import { makeStyles } from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  Typography
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../../components/Alert";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import { followUpActionOption } from "../../../components/Componentkeyword";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import Webcamimage from "../../asset/Webcameimageasset";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";


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

function FollowUpVisitor() {

  const [deletedRequestFiles, setDeletedRequestFiles] = useState([]);
  const [uploadedRequestDocument, setUploadedRequestDocument] = useState([]);
  const [uploadBillsRequestDocument, setUploadBillsRequestDocument] = useState([]);

  const handleDeleteFileDocumentEditRequestDocument = (index) => {
    const newSelectedFiles = [...uploadBillsRequestDocument];
    newSelectedFiles.splice(index, 1);
    setUploadBillsRequestDocument(newSelectedFiles);
  };

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

  const handleDeleteUploadedRequestDocument = (index) => {
    setUploadedRequestDocument((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setDeletedRequestFiles((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  const handleRemarkChange = (index, newRemark) => {
    setUploadBillsRequestDocument(prevFiles =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, remark: newRemark } : file
      )
    );
  };

  let sno = 1;

  const renderFilePreviewMulter = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const assignurl = urlParams.get('status');

  const [buttonLoad, setButtonLoad] = useState(false);
  const [todosEdit, setTodosEdit] = useState([]);
  const classes = useStyles();
  const backPage = useNavigate();
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const [date, setDate] = useState(formattedDate);
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };

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

  const { id: ids, form: page } = useParams();

  const [vendor, setVendor] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    visitortype: "Please Select Visitor Type",
    visitormode: "Please Select Visitor Mode",
    date: date,
    visitorname: "",
    intime: "",

    requestvisitorfollowaction: 'Please Select Request Follow Up Action',
    requestfollowupactionupdate: '',
    requestfollowupactionuptime: '',

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
  });

  const [followupArray, setFollowupArray] = useState([]);

  const [vendorFollow, setVendorFollow] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    visitortype: "Please Select Visitor Type",
    visitormode: "Please Select Visitor Mode",
    date: date,
    visitorname: "",
    intime: "",
    visitorpurpose: "Please Select Visitor Purpose",
    visitorcontactnumber: "",
    visitoremail: "",
    visitorcompnayname: "",

    requestvisitorfollowaction: 'Please Select Request Follow Up Action',
    requestfollowupactionupdate: '',
    requestfollowupactionuptime: '',

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
  });
  const [vendorArray, setVendorArray] = useState([]);
  const {
    isUserRoleAccess,
    isAssignBranch,
    allfloor,
    alldepartment,
    allareagrouping,
    allUsersData,
    allTeam,
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
          "/interactor/allvisitorlist",
          "interactor/allvisitorlist",
          "/interactor/master/listvisitors",
          "interactor/master/listvisitors"
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const filteredAreas = allareagrouping.filter(area =>
    accessbranch.some(access =>
      access.company === area.company &&
      access.branch === area.branch &&
      access.unit === area.unit
    )
  );

  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Followup Visitors"),
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
    fetchVendor();
    getinfoCode();
    getapi();
  }, []);
  // useEffect(() => {
  //   fetchVendor();
  //   getinfoCode();
  // }, [vendor, followupArray]);

  useEffect(() => {
    fetchInteractorType();
    fetchInteractorMode();
  }, []);

  const [documentFiles, setdocumentFiles] = useState([]);

  const [documentFilesImages, setdocumentFilesImages] = useState([]);

  const [lastObject, setLastObject] = useState()
  console.log(lastObject, "lastObject")
  const getinfoCode = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor(res?.data?.svisitors);
      setLastObject(res?.data?.svisitors.followuparray[res?.data?.svisitors.followuparray?.length - 1])
      setFollowupArray(res?.data?.svisitors.followuparray);
      setdocumentFiles(res?.data?.svisitors.document)
      const allFiles = res?.data?.svisitors?.followuparray?.flatMap(item => item.files) || [];
      setAllUploadedFilesedit(allFiles);
      if (res?.data?.svisitors?.visitorid) {
        let url = `${SERVICE.VISITORDETAILS_LOG_SINGLE_PROFILE}/${encodeURIComponent(res?.data?.svisitors?.visitorid)}`;
        let resVisitor = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setdocumentFilesImages(resVisitor?.data?.svisitordetailslog);
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


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
        setPopupContentMalert("Only Accept Images");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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
        setPopupContentMalert("Only Accept Images");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();

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
    if (!uniqueValues[item?.name]) {
      uniqueValues[item?.name] = true;
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
        setPopupContentMalert("Only Accept Images");
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
  const [getimgbillcode, setGetImgbillcode] = useState([]);
  const getimgbillCode = async (valueimg) => {
    setGetImgbillcode(valueimg);
    handleImgcodeviewbill();
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

      let result = res.data.manageTypePG.filter(
        (d) => d.interactorstype === e.value
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

  //vendor unit multi select
  const [selectedOptionsUnitFirst, setSelectedOptionsUnitFirst] = useState([]);

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

  const handleCompanyLocationChange = (options) => {
    setValueCompanyLocationCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyLocation(options);
    setValueBranchLocationCat([]);
    setSelectedOptionsBranchLocation([]);
    setValueUnitLocationCat([]);
    setSelectedOptionsUnitLocation([]);
    setValueFloorLocationCat([]);
    setSelectedOptionsFloorLocation([]);
    setVendorFollow({ ...vendorFollow, meetinglocationarea: "Please Select Area" });
  };

  const customValueRendererCompanyLocation = (
    valueCompanyLocationCat,
    _categoryname
  ) => {
    return valueCompanyLocationCat?.length
      ? valueCompanyLocationCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch location multiselect
  const [selectedOptionsBranchLocation, setSelectedOptionsBranchLocation] =
    useState([]);
  let [valueBranchLocationCat, setValueBranchLocationCat] = useState([]);
  const handleBranchLocationChange = (options) => {
    setValueBranchLocationCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchLocation(options);
    setValueUnitLocationCat([]);
    setSelectedOptionsUnitLocation([]);
    setValueFloorLocationCat([]);
    setSelectedOptionsFloorLocation([]);
    setVendorFollow({ ...vendorFollow, meetinglocationarea: "Please Select Area" });
  };

  const customValueRendererBranchLocation = (
    valueBranchLocationCat,
    _categoryname
  ) => {
    return valueBranchLocationCat?.length
      ? valueBranchLocationCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  //unit location multiselect
  const [selectedOptionsUnitLocation, setSelectedOptionsUnitLocation] =
    useState([]);
  let [valueUnitLocationCat, setValueUnitLocationCat] = useState([]);
  const handleUnitLocationChange = (options) => {
    setValueUnitLocationCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitLocation(options);
    setValueFloorLocationCat([]);
    setSelectedOptionsFloorLocation([]);
    setVendorFollow({ ...vendorFollow, meetinglocationarea: "Please Select Area" });
  };

  const customValueRendererUnitLocation = (
    valueUnitLocationCat,
    _categoryname
  ) => {
    return valueUnitLocationCat?.length
      ? valueUnitLocationCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  //floor location multiselect
  const [selectedOptionsFloorLocation, setSelectedOptionsFloorLocation] =
    useState([]);
  let [valueFloorLocationCat, setValueFloorLocationCat] = useState([]);
  const handleFloorLocationChange = (options) => {
    setValueFloorLocationCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsFloorLocation(options);
    setVendorFollow({ ...vendorFollow, meetinglocationarea: "Please Select Area" });
  };

  const customValueRendererFloorLocation = (
    valueFloorLocationCat,
    _categoryname
  ) => {
    return valueFloorLocationCat?.length
      ? valueFloorLocationCat.map(({ label }) => label)?.join(", ")
      : "Please Select Floor";
  };
  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];
  let updateby = vendor.updatedby;
  //add function
  const sendRequest = async (type) => {
    setButtonLoad(true);
    setPageName(!pageName);
    try {

      const formData = new FormData();

      if (uploadBillsRequestDocument.length > 0) {
        uploadBillsRequestDocument.forEach((item, index) => {
          formData.append('requestdocument', item.file); // Append the file
          formData.append(`remarks[${index}]`, item.remark); // Append the remark for this file
        });
      }


      if (deletedRequestFiles.length > 0) {
        formData.append("deletedrequestdocumentFiles", JSON.stringify(deletedRequestFiles));
      }

      const jsonData = {

        followuparray: [
          ...vendor.followuparray,
          {
            visitortype: String(vendorFollow.visitortype),
            visitormode: String(vendorFollow.visitormode),
            visitorpurpose: String(vendorFollow.visitorpurpose),
            meetingdetails: Boolean(vendorFollow.meetingdetails),
            intime: String(vendorFollow.intime),

            meetingpersoncompany:
              vendorFollow.meetingdetails === true
                ? [...valueCompanyCat]
                : [],
            meetingpersonbranch:
              vendorFollow.meetingdetails === true ? [...valueBranchCat] : [],
            meetingpersonunit:
              vendorFollow.meetingdetails === true ? [...valueUnitCat] : [],
            meetingpersondepartment:
              vendorFollow.meetingdetails === true
                ? [...valueDepartmentCat]
                : [],
            meetingpersonteam:
              vendorFollow.meetingdetails === true ? [...valueTeamCat] : [],
            meetingpersonemployeename: String(
              vendorFollow.meetingdetails === true
                ? vendor.meetingpersonemployeename
                : ""
            ),

            meetinglocationcompany:
              vendorFollow.meetingdetails === true
                ? [...valueCompanyLocationCat]
                : [],
            meetinglocationbranch:
              vendorFollow.meetingdetails === true
                ? [...valueBranchLocationCat]
                : [],
            meetinglocationunit:
              vendorFollow.meetingdetails === true
                ? [...valueUnitLocationCat]
                : [],
            meetinglocationfloor:
              vendorFollow.meetingdetails === true
                ? [...valueFloorLocationCat]
                : [],
            meetinglocationarea: String(
              vendorFollow.meetingdetails === true
                ? vendorFollow.meetinglocationarea
                : ""
            ),

            escortinformation: Boolean(vendorFollow.escortinformation),
            escortdetails: String(
              vendorFollow.escortinformation === true
                ? vendorFollow.escortdetails
                : ""
            ),
            equipmentborrowed: String(vendorFollow.equipmentborrowed),
            outtime: String(vendorFollow.outtime),
            remark: String(vendorFollow.remark),
            followupaction: String(vendorFollow.followupaction),
            followupdate: String(
              vendorFollow.followupaction === "Required"
                ? vendorFollow.followupdate
                : ""
            ),
            followuptime: String(
              vendorFollow.followupaction === "Required"
                ? vendorFollow.followuptime
                : ""
            ),
            visitorbadge: String(vendorFollow.visitorbadge),
            visitorsurvey: String(vendorFollow.visitorsurvey),
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }

      formData.append("jsonData", JSON.stringify(jsonData));


      let addVendorDetails = await axios.put(
        `${SERVICE.VISITORS_STATUSUPDATE}/${ids}`,
        // {
        //   followuparray: [
        //     ...vendor.followuparray,
        //     {
        //       visitortype: String(vendorFollow.visitortype),
        //       visitormode: String(vendorFollow.visitormode),
        //       visitorpurpose: String(vendorFollow.visitorpurpose),
        //       meetingdetails: Boolean(vendorFollow.meetingdetails),
        //       intime: String(vendorFollow.intime),

        //       meetingpersoncompany:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueCompanyCat]
        //           : [],
        //       meetingpersonbranch:
        //         vendorFollow.meetingdetails === true ? [...valueBranchCat] : [],
        //       meetingpersonunit:
        //         vendorFollow.meetingdetails === true ? [...valueUnitCat] : [],
        //       meetingpersondepartment:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueDepartmentCat]
        //           : [],
        //       meetingpersonteam:
        //         vendorFollow.meetingdetails === true ? [...valueTeamCat] : [],
        //       meetingpersonemployeename: String(
        //         vendorFollow.meetingdetails === true
        //           ? vendor.meetingpersonemployeename
        //           : ""
        //       ),

        //       meetinglocationcompany:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueCompanyLocationCat]
        //           : [],
        //       meetinglocationbranch:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueBranchLocationCat]
        //           : [],
        //       meetinglocationunit:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueUnitLocationCat]
        //           : [],
        //       meetinglocationfloor:
        //         vendorFollow.meetingdetails === true
        //           ? [...valueFloorLocationCat]
        //           : [],
        //       meetinglocationarea: String(
        //         vendorFollow.meetingdetails === true
        //           ? vendorFollow.meetinglocationarea
        //           : ""
        //       ),

        //       escortinformation: Boolean(vendorFollow.escortinformation),
        //       escortdetails: String(
        //         vendorFollow.escortinformation === true
        //           ? vendorFollow.escortdetails
        //           : ""
        //       ),
        //       equipmentborrowed: String(vendorFollow.equipmentborrowed),
        //       outtime: String(vendorFollow.outtime),
        //       remark: String(vendorFollow.remark),
        //       followupaction: String(vendorFollow.followupaction),
        //       followupdate: String(
        //         vendorFollow.followupaction === "Required"
        //           ? vendorFollow.followupdate
        //           : ""
        //       ),
        //       followuptime: String(
        //         vendorFollow.followupaction === "Required"
        //           ? vendorFollow.followuptime
        //           : ""
        //       ),
        //       visitorbadge: String(vendorFollow.visitorbadge),
        //       visitorsurvey: String(vendorFollow.visitorsurvey),
        //     },
        //   ],
        //   updatedby: [
        //     ...updateby,
        //     {
        //       name: String(isUserRoleAccess.companyname),
        //       date: String(new Date()),
        //     },
        //   ],
        // }
        formData
        ,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setButtonLoad(false);
      if (type === "save1") {
        backPage(
          page === "allvisitor"
            ? "/interactor/allvisitorlist"
            : "/interactor/master/listvisitors"
        );
      } else if (type === "save2") {
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
        });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      setButtonLoad(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // useEffect(() => {
  //   console.log(vendor.followuparray[vendor.followuparray?.length - 1]?.visitortype, "vendor.followuparray[vendor.followuparray.length - 1]?.visitortype")
  // }, [vendor])

  console.log(vendor, "vendor")
  const sendRequestVisitor = async (type) => {
    setButtonLoad(true);
    setPageName(!pageName);
    try {
      let addVendorDetails = await axios.put(
        `${SERVICE.VISITORS_STATUSUPDATE}/${ids}`,
        {
          requestvisitorfollowaction: String(vendor.requestvisitorfollowaction),
          requestfollowupactionupdate: String(vendor.requestfollowupactionupdate),
          requestfollowupactionuptime: String(vendor.requestfollowupactionuptime),
          followuparray: [
            ...vendor.followuparray,
            {
              visitortype: String(lastObject?.visitortype),
              visitormode: String(lastObject?.visitormode),
              visitorpurpose: String(lastObject?.visitorpurpose),
              meetingdetails: Boolean(lastObject?.meetingdetails),
              intime: String(lastObject?.intime),

              requestvisitorfollowaction: String(vendor.requestvisitorfollowaction),
              requestfollowupactionupdate: String(vendor.requestfollowupactionupdate),
              requestfollowupactionuptime: String(vendor.requestfollowupactionuptime),
              requestdocument: lastObject?.requestdocument,
              visitordocument: lastObject?.visitordocument,

              enquiredbranchnumber: String(lastObject?.enquiredbranchnumber),
              enquiredbranchemail: String(lastObject?.enquiredbranchemail),

              meetingpersoncompany: lastObject?.meetingpersoncompany || [],
              meetingpersonbranch: lastObject?.meetingpersonbranch || [],
              meetingpersonunit: lastObject?.meetingpersonunit || [],
              meetingpersondepartment: lastObject?.meetingpersondepartment || [],
              meetingpersonteam: lastObject?.meetingpersonteam || [],
              meetingpersonemployeename: lastObject?.meetingpersonemployeename || [],


              meetinglocationcompany: lastObject?.meetinglocationcompany || [],
              meetinglocationbranch: lastObject?.meetinglocationbranch || [],
              meetinglocationunit: lastObject?.meetinglocationunit || [],
              meetinglocationfloor: lastObject?.meetinglocationfloor || [],
              meetinglocationarea: lastObject?.meetinglocationarea || "",

              escortinformation: lastObject?.escortinformation || false,
              escortdetails: lastObject?.escortdetails || "",
              equipmentborrowed: lastObject?.equipmentborrowed || "",
              outtime: lastObject?.outtime || "",
              remark: lastObject?.remark || "",
              followupaction: lastObject?.followupaction || "",
              followupdate: lastObject?.followupdate || "",
              followuptime: lastObject?.followuptime || "",
              visitorbadge: lastObject?.visitorbadge || "",
              visitorsurvey: lastObject?.visitorsurvey || "",
            },
          ],
          updatedby: [
            ...updateby,
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
      setButtonLoad(false);
      if (type === "save1") {
        backPage(
          page === "allvisitor"
            ? "/interactor/allvisitorlist"
            : "/interactor/master/listvisitors"
        );
      } else if (type === "save2") {
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
        });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      console.log(err, "err")
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
    // let resdata =  await fetchVendor();
    await fetchVendor();
    let resdata = vendorArray;
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
    const isNameMatch = resdata?.some(
      (item) =>
        item.company === vendor.company &&
        item.branch === vendor.branch &&
        item.unit === vendor.unit &&
        item.visitortype === vendorFollow.visitortype &&
        item.visitormode === vendorFollow.visitormode &&
        item.visitorpurpose === vendorFollow.visitorpurpose &&
        item.date === vendor.date &&
        item.visitorcontactnumber === vendor.visitorcontactnumber &&
        item.visitorname?.trim()?.toLowerCase() ===
        vendor.visitorname?.trim()?.toLowerCase() &&
        item.intime === vendorFollow.intime &&
        item.outtime === vendorFollow.outtime &&
        (!vendorFollow.meetingdetails ||
          (item.meetingpersoncompany.some((data) => compopt.includes(data)) &&
            item.meetingpersonbranch.some((data) => branchopt.includes(data)) &&
            item.meetingpersonunit.some((data) => unitopt.includes(data)) &&
            item.meetingpersondepartment.some((data) =>
              departmentopt.includes(data)
            ) &&
            item.meetingpersonteam.some((data) => teamopt.includes(data)) &&
            item.meetingpersonemployeename ===
            vendorFollow.meetingpersonemployeename &&
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
            item.meetinglocationarea === vendorFollow.meetinglocationarea)) &&
        (!vendorFollow.escortinformation ||
          item.escortdetails == vendorFollow.escortdetails) &&
        item.followupaction == vendorFollow.followupaction &&
        (vendorFollow.followupaction !== "Required" ||
          (item.followupdate == vendorFollow.followupdate &&
            item.followuptime == vendorFollow.followuptime))
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
    } else if (vendorFollow.visitortype === "Please Select Visitor Type") {
      setPopupContentMalert("Please Select Visitor Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendorFollow.visitormode === "Please Select Visitor Mode") {
      setPopupContentMalert("Please Select Visitor Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.visitorname === "") {
      setPopupContentMalert("Please Enter Visitor Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendorFollow.intime === "") {
      setPopupContentMalert("Please Select IN Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.visitorpurpose === "Please Select Visitor Purpose"
    ) {
      setPopupContentMalert("Please Select Visitor Purpose");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.visitorcontactnumber === "") {
      setPopupContentMalert("Please Enter Visitor Contact Number");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (vendor.visitorcontactnumber.length < 10) {
      setPopupContentMalert("Please Enter Valid Visitor Contact Number");
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
    else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument) && vendorFollow.requestvisitorfollowupdate === '') {
      setPopupContentMalert('Please Select Request Visitor Followup Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument) && vendorFollow.requestvisitorfollowaction === 'Please Select Request Follow Up Action') {
      setPopupContentMalert('Please Select Request Follow Up Action');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument) && vendorFollow.requestvisitorfollowaction === 'Required' && vendorFollow.requestfollowupactionupdate === '') {
      setPopupContentMalert('Please Select Request Follow Up Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument) && vendorFollow.requestvisitorfollowaction === 'Required' && vendorFollow.requestfollowupactionuptime === '') {
      setPopupContentMalert('Please Select Request Follow Up Time');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if (
      vendorFollow.meetingdetails === true &&
      valueCompanyCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Person Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueBranchCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Person Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueUnitCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Person Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueDepartmentCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Person Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueTeamCat?.length == 0
    ) {

      setPopupContentMalert("Please Select Meeting-Person Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      vendorFollow.meetingpersonemployeename === "Please Select Employee Name"
    ) {
      setPopupContentMalert("Please Select Meeting-Person Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueCompanyLocationCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Location Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueBranchLocationCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Location Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueUnitLocationCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Location Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      valueFloorLocationCat?.length == 0
    ) {
      setPopupContentMalert("Please Select Meeting-Location Floor");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.meetingdetails === true &&
      vendorFollow.meetinglocationarea === "Please Select Area"
    ) {
      setPopupContentMalert("Please Select Meeting-Location Area");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.escortinformation === true &&
      vendorFollow.escortdetails === ""
    ) {
      setPopupContentMalert("Please Enter Escort Details");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendorFollow.outtime === "") {
      setPopupContentMalert("Please Select OUT Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.followupaction === "Please Select Follow Up Action"
    ) {
      setPopupContentMalert("Please Select Follow Up Action");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.followupaction === "Required" &&
      vendorFollow.followupdate === ""
    ) {
      setPopupContentMalert("Please Select Follow Up Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorFollow.followupaction === "Required" &&
      vendorFollow.followuptime === ""
    ) {
      setPopupContentMalert("Please Select Follow Up Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Visitor Details already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest(type);
    }
  };

  const handleSubmitRequest = async (e, type) => {
    e.preventDefault();
    // let resdata =  await fetchVendor();
    if ((visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[followupArray.length - 1]?.visitortype && item?.interactorspurpose?.includes(followupArray[followupArray.length - 1]?.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowaction === 'Required' && vendor.requestfollowupactionupdate === '') {
      setPopupContentMalert('Please Select Request Follow Up Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if ((visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[followupArray.length - 1].visitortype && item?.interactorspurpose?.includes(followupArray[followupArray.length - 1]?.visitorpurpose))[0]?.requestdocument) && vendor.requestvisitorfollowaction === 'Required' && vendor.requestfollowupactionuptime === '') {
      setPopupContentMalert('Please Select Request Follow Up Time');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else {
      sendRequestVisitor(type);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setVendorFollow({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      visitortype: "Please Select Visitor Type",
      visitormode: "Please Select Visitor Mode",
      date: date,
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
    });
    setSelectedOptionsUnitFirst([]);

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
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

  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_VISITOR_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };


  return (
    <Box>
      <Headtitle title={"ADD FOLLOWUP VISITORS"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Followup Visitors"
        modulename="Interactors"
        submodulename="Visitor"
        mainpagename={"Visitors Datewise Filter" || "Visitors Followup Filter"}
        subpagename=""
        subsubpagename=""
      />
      <>
        <Box sx={userStyle.dialogbox}>
          <>
            {followupArray?.map((data, index) => (
              <Box key={index}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <span>
                      <b>Visitor Name:</b> {vendor.visitorname + "  "}
                      <b>Visitor Type:</b> {data.visitortype + "  "}
                      <b>Visitor Mode:</b> {data.visitormode + "  "}
                      <b>Visitor Purpose:</b> {data.visitorpurpose + "  "}
                      <b>Visitor Contact No:</b>{" "}
                      {vendor.visitorcontactnumber + "  "}
                      <b>Date:</b> {moment(vendor.date).format("DD-MM-YYYY")}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={userStyle.dialogbox}>
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={8}>
                            {" "}
                            <Typography sx={{ fontWeight: "bold" }}>
                              View Visitor
                            </Typography>{" "}
                          </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Company</Typography>
                            </FormControl>
                            <Typography>{vendor.company}</Typography>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Branch</Typography>
                              <Typography>{vendor.branch}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Unit</Typography>
                              <Typography>{vendor.unit}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor's ID
                              </Typography>
                              <Typography>{vendor.visitorid}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Visitor Type
                              </Typography>
                              <Typography>{data.visitortype}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Mode
                              </Typography>
                              <Typography>{data.visitormode}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Date</Typography>
                              <Typography>
                                {moment(vendor.date).format("DD-MM-YYYY")}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">Prefix</Typography>
                              <Typography>{vendor.prefix}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Name
                              </Typography>
                              <Typography>{vendor.visitorname}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">IN Time</Typography>
                              <Typography>{data.intime}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Purpose
                              </Typography>
                              <Typography>{data.visitorpurpose}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Contact Number
                              </Typography>
                              <Typography>
                                {vendor.visitorcontactnumber}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor Email
                              </Typography>
                              <Typography>{vendor.visitoremail}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Visitor's Company Name
                              </Typography>
                              <Typography>
                                {vendor.visitorcompnayname}
                              </Typography>
                            </FormControl>
                          </Grid>
                          {assignurl !== "visitorenquiry" && (
                            <Grid item md={6} xs={12} sm={12} >
                              <Typography>Photograph</Typography>

                              {documentFilesImages[index]?.files?.map((file, index) => (
                                <>
                                  <Grid container spacing={2}>
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
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Typography variant="subtitle2"> {file.name} </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={2} xs={2}>
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
                          )}
                          <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Visitor ID / Document Details
                            </Typography>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Document Type
                              </Typography>
                              <Typography>{vendor.documenttype}</Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                Document Number
                              </Typography>
                              <Typography>{vendor.documentnumber}</Typography>
                            </FormControl>
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <Typography >Upload Document</Typography>
                            <Grid >
                              <Grid item md={2} sm={12} xs={12}>

                              </Grid>
                              <Typography>&nbsp;</Typography>
                              <Grid container>
                                <Grid item md={12} sm={12} xs={12}>
                                  {data?.visitordocument?.length > 0 && data?.visitordocument?.map((data, index) => (
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
                                              onClick={() => renderFilePreviewMulterUploaded(data)}
                                            />
                                          </Button>

                                          {/* <Button
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
                                        </Button> */}
                                        </Grid>
                                      </Grid>
                                    </>
                                  ))}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          {visitorsTypeOption?.filter((item) => item?.interactorstype === data.visitortype && item?.interactorspurpose?.includes(data.visitorpurpose))[0]?.requestdocument &&

                            <Grid item md={12} xs={12} sm={12}>
                              <Box >
                                <Grid item xs={8}>
                                  <Typography sx={{ fontWeight: 'bold' }}>Request Visitor Document</Typography>
                                </Grid>
                                <>
                                  <Grid container sx={{ justifyContent: "center" }} spacing={1}>

                                  </Grid>
                                </>

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
                                      </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                      {followupArray[index]?.requestdocument &&
                                        followupArray[index]?.requestdocument?.map((file, index) => (
                                          <StyledTableRow key={index}>
                                            <StyledTableCell align="center">
                                              {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                              {file.name || file.file.name}
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                              <FormControl>
                                                <OutlinedInput
                                                  sx={{
                                                    height: "30px !important",
                                                    background: "white",
                                                    border: "1px solid rgb(0 0 0 / 48%)",
                                                  }}
                                                  size="small"
                                                  type="text"
                                                  value={file.remark}
                                                  // onChange={(event) =>
                                                  //   handleRemarkChange(index, event.target.value)
                                                  // }
                                                />
                                              </FormControl>
                                            </StyledTableCell> */}

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
                                                onClick={() => renderFilePreviewMulterUploaded(file)}
                                              >
                                                View
                                              </a>
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">
                                                                      <Button
                                                                        onClick={() => handleDeleteUploadedRequestDocument(index)}
                                                                        variant="contained"
                                                                        size="small"
                                                                        sx={{
                                                                          textTransform: "capitalize",
                                                                          minWidth: "0px",
                                                                        }}
                                                                      >
                                                                        <DeleteIcon style={{ fontSize: "20px" }} />
                                                                      </Button>
                                                                    </StyledTableCell> */}
                                          </StyledTableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                              <br />
                            </Grid>
                          }
                          {visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[index].visitortype && item?.interactorspurpose?.includes(followupArray[index].visitorpurpose))[0]?.requestdocument && (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Request Visitor Followup Date<b style={{ color: 'red' }}>*</b>
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={followupArray[index].requestvisitorfollowupdate}
                                  // onChange={(e) => {
                                  //   setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                                  // }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Request Follow Up Action <b style={{ color: 'red' }}>*</b>
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={followupArray[index]?.requestvisitorfollowaction}
                                  // onChange={(e) => {
                                  //   setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                                  // }}
                                  />
                                  {/* <Selects
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
                                                          /> */}
                                </FormControl>
                              </Grid>
                              {followupArray[index].requestvisitorfollowaction === 'Required' ? (
                                <>

                                  <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Request Follow Up Date<b style={{ color: 'red' }}>*</b>
                                      </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={followupArray[index]?.requestfollowupactionupdate}
                                      // onChange={(e) => {
                                      //   setVendor({
                                      //     ...vendor,
                                      //     requestfollowupactionupdate: e.target.value,
                                      //   });
                                      // }}
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
                                        value={followupArray[index]?.requestfollowupactionuptime}
                                      // onChange={(e) => {
                                      //   setVendor({
                                      //     ...vendor,
                                      //     requestfollowupactionuptime: e.target.value,
                                      //   });
                                      // }}
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
                          {assignurl !== "visitorenquiry" &&
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={Boolean(data.meetingdetails)}
                                      />
                                    }
                                    readOnly
                                    label="Meeting Details"
                                  />
                                </FormGroup>
                              </Grid>
                            </>
                          }
                          <Grid item md={10} xs={12} sm={12}></Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Address Type
                              </Typography>

                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.addesstype}
                                placeholder="Please Enter Reference Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Personal Prefix
                              </Typography>

                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.personalprefix}
                                placeholder="Please Enter Reference Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Reference Name </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.referencename}
                                placeholder="Please Enter Reference Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Landmark Position Prefix
                              </Typography>


                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.landmarkpositionprefix}
                                placeholder="Please Enter Landmark Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Landmark Name</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.landmarkname}
                                placeholder="Please Enter Landmark Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>House/Flat No</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.houseflatnumber}
                                placeholder="Please Enter House/Flat Number"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Street/Road Name</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.streetroadname}
                                placeholder="Please Enter Street/Road Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Locality/Area Name</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.localityareaname}
                                placeholder="Please Enter Locality/Area Name"

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <FormControl size="small" fullWidth>
                              <Typography>Country</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                sx={userStyle.input}
                                placeholder="Pincode"
                                value={vendor?.followuparray[index]?.pcountry}

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>State</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                sx={userStyle.input}
                                placeholder="Pincode"
                                value={vendor?.followuparray[index]?.pstate}

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>City</Typography>

                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                sx={userStyle.input}
                                placeholder="Pincode"
                                value={vendor?.followuparray[index]?.pcity}

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
                                value={vendor?.followuparray[index]?.ppincode}

                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>GPS Coordinate</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={vendor?.followuparray[index]?.gpscoordinate}
                                placeholder="Please Enter GPS Coordinate"

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
                                    vendor?.followuparray[index]?.personalprefix !== "Please Select Personal Prefix" ? vendor?.followuparray[index]?.personalprefix : null,
                                    vendor?.followuparray[index]?.referencename,
                                    vendor?.followuparray[index]?.landmarkpositionprefix !== "Please Select Landmark Position Prefix" ? vendor?.followuparray[index]?.landmarkpositionprefix : null,
                                    vendor?.followuparray[index]?.landmarkname,
                                    vendor?.followuparray[index]?.houseflatnumber,
                                    vendor?.followuparray[index]?.streetroadname,
                                    vendor?.followuparray[index]?.localityareaname,
                                    vendor?.followuparray[index]?.pcity,
                                    vendor?.followuparray[index]?.pstate,
                                    vendor?.followuparray[index]?.pcountry,
                                    vendor?.followuparray[index]?.ppincode
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
                          {data.meetingdetails && (
                            <>
                              <Grid item md={12} xs={12} sm={12}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  {assignurl === "visitorenquiry" ? "Enquiry Person" : "Meeting Person"}
                                </Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Company
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersoncompany
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Branch
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersonbranch
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Unit</Typography>
                                  <Typography>
                                    {data.meetingpersonunit
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Department
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersondepartment
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6"> Team</Typography>
                                  <Typography>
                                    {data.meetingpersonteam
                                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                                      .toString()}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Employee Name
                                  </Typography>
                                  <Typography>
                                    {data.meetingpersonemployeename}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              {assignurl === "visitorenquiry" &&
                                <>
                                  <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6">
                                        {" "}
                                        Enquired Branch Number
                                      </Typography>
                                      <Typography>
                                        {data.enquiredbranchnumber}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6">
                                        {" "}
                                        Enquired Branch Email
                                      </Typography>
                                      <Typography>
                                        {data.enquiredbranchemail}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={12}>
                                  </Grid>
                                </>
                              }
                              {assignurl !== "visitorenquiry" && (
                                <>
                                  <Grid item md={12} xs={12} sm={12}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      Meeting Location
                                    </Typography>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6">
                                        {" "}
                                        Company
                                      </Typography>
                                      <Typography>
                                        {data.meetinglocationcompany
                                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                                          .toString()}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6">
                                        {" "}
                                        Branch
                                      </Typography>
                                      <Typography>
                                        {data.meetinglocationbranch
                                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                                          .toString()}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6"> Unit</Typography>
                                      <Typography>
                                        {data.meetinglocationunit
                                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                                          .toString()}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6"> Floor</Typography>
                                      <Typography>
                                        {data.meetinglocationfloor
                                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                                          .toString()}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6"> Area</Typography>
                                      <Typography>
                                        {data.meetinglocationarea}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4} xs={12} sm={12}></Grid>

                                  <Grid item md={3} xs={12} sm={12}>
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={Boolean(data.escortinformation)}
                                          />
                                        }
                                        readOnly
                                        label="Escort Information"
                                      />
                                    </FormGroup>
                                  </Grid>
                                  <Grid item md={9} xs={12} sm={12}></Grid>
                                  {data.escortinformation && (
                                    <>
                                      <Grid item md={6} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography variant="h6">
                                            {" "}
                                            Escort Details
                                          </Typography>
                                          <Typography>
                                            {data.escortdetails}
                                          </Typography>
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={6} xs={12} sm={12}></Grid>
                                    </>
                                  )}
                                  <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6">
                                        {" "}
                                        Equipment Borrowed
                                      </Typography>
                                      <Typography>
                                        {data.equipmentborrowed}
                                      </Typography>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography variant="h6"> OUT Time</Typography>
                                      <Typography>{data.outtime}</Typography>
                                    </FormControl>
                                  </Grid>
                                </>
                              )}
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Remark</Typography>
                              <Typography>{data.remark}</Typography>
                            </FormControl>
                          </Grid>

                          {/* <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Follow Up Action
                              </Typography>
                              <Typography>{data.followupaction}</Typography>
                            </FormControl>
                          </Grid> */}
                          {visitorsTypeOption?.filter((item) => item?.interactorstype === data.visitortype && item?.interactorspurpose?.includes(data.visitorpurpose))[0]?.requestdocument || false ?
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                              </Grid>
                            </>
                            :
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Follow Up Action <b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <Typography>{data.followupaction}</Typography>
                                </FormControl>
                              </Grid>
                            </>
                          },
                          {data.followupaction === "Required" && (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Follow Up Date
                                  </Typography>
                                  <Typography>
                                    {moment(data.followupdate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Follow Up Time
                                  </Typography>
                                  <Typography>{data.followuptime}</Typography>
                                </FormControl>
                              </Grid>
                            </>
                          )}
                          {assignurl !== "visitorenquiry" && (
                            <>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Visitor Badge / Pass Details
                                  </Typography>
                                  <Typography>{data.visitorbadge}</Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Visitor Survey / Feedback
                                  </Typography>
                                  <Typography>{data.visitorsurvey}</Typography>
                                </FormControl>
                              </Grid>
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Added By</Typography>
                              <Typography>{vendor.detailsaddedy}</Typography>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <br /> <br />
                        <br /> <br />
                      </>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <br />
                {followupArray[followupArray.length - 1]?.followupaction ===
                  "Not Required" && (
                    <>
                      <Grid item md={1} sm={2} xs={12}>
                        <Link
                          to={
                            page === "allvisitor"
                              ? "/interactor/allvisitorlist"
                              : "/interactor/master/listvisitors"
                          }
                          style={{
                            textDecoration: "none",
                            color: "white",
                            float: "right",
                          }}
                        >
                          <Button sx={buttonStyles.btncancel}>Back</Button>
                        </Link>
                      </Grid>
                    </>
                  )}
              </Box>
            ))}
            <br />
            <br />

            {followupArray[followupArray.length - 1]?.followupaction ===
              "Required" ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    {" "}
                    <Typography sx={{ fontWeight: "bold" }}>
                      Add Followup Visitors
                    </Typography>{" "}
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Company</Typography>
                      <OutlinedInput readOnly value={vendor.company} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Branch</Typography>
                      <OutlinedInput readOnly value={vendor.branch} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Unit</Typography>
                      <OutlinedInput readOnly value={vendor.unit} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor's ID</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        value={vendor.visitorid}
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
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }
                        )}
                        // placeholder="Please Select Visitor Type"
                        value={{
                          label: vendorFollow.visitortype,
                          value: vendorFollow.visitortype,
                        }}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            visitortype: e.value,
                            visitorpurpose: "Please Select Visitor Purpose",
                          });
                          fetchInteractorPurpose(e);
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
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }
                        )}
                        placeholder="Please Select Visitor Mode"
                        value={{
                          label: vendorFollow.visitormode,
                          value: vendorFollow.visitormode,
                        }}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            visitormode: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={vendor.date}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.visitorname}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        IN Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={vendorFollow.intime}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            intime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Visitor Purpose <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={visitorsPurposeOption}
                        placeholder="Please Select Visitor Purpose"
                        value={{
                          label: vendorFollow.visitorpurpose,
                          value: vendorFollow.visitorpurpose,
                        }}
                        // onChange={(e) => {
                        //   setVendorFollow({
                        //     ...vendorFollow,
                        //     visitorpurpose: e.value,
                        //   });
                        // }}
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

                            setVendorFollow({
                              ...vendorFollow,
                              requestvisitorfollowupdate: formattedDate,

                              visitorpurpose: e.value,
                              requestvisitorfollowaction: 'Please Select Request Follow Up Action',
                              requestfollowupactionupdate: '',
                              requestfollowupactionuptime: '',
                            });
                          } else {
                            setVendorFollow({
                              ...vendorFollow,
                              visitorpurpose: e.value,

                              requestvisitorfollowaction: 'Please Select Request Follow Up Action',
                              requestfollowupactionupdate: '',
                              requestfollowupactionuptime: '',
                            });

                          }
                          setUploadBillsRequestDocument([])
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor Contact Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendor.visitorcontactnumber}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor Email</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="email"
                        value={vendor.visitoremail}
                        readOnly
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
                        readOnly
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
                      <OutlinedInput readOnly value={vendor.documenttype} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Document Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.documentnumber}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography >Upload Document</Typography>
                    <Grid >
                      <Grid item md={2} sm={12} xs={12}>
                        {/* <Button size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" }, ...buttonStyles?.buttonsubmit }}>
                                    Upload
                                    <input
                                      type="file"
                                      id="resume"
                                      accept=".xlsx, .xls, .csv, .pdf, .txt,"
                                      name="file"
                                      hidden
                                      onChange={(e) => {
                                        handleResumeUpload(e);
                                        setTextEditor("");
                                        setTextAreas([])
                                      }}
                                    />
                                  </Button> */}
                      </Grid>
                      <Typography>&nbsp;</Typography>

                      {documentFiles?.length > 0 &&
                        documentFiles.map((file, index) => (
                          <>
                            <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                              <Grid item md={10} sm={6} xs={6}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                              </Grid>

                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument &&

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
                              {uploadedRequestDocument &&
                                uploadedRequestDocument?.map((file, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell align="center">
                                      {sno++}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {file.name || file.file.name}
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="center">
                                                    <FormControl>
                                                      <OutlinedInput
                                                        sx={{
                                                          height: "30px !important",
                                                          background: "white",
                                                          border: "1px solid rgb(0 0 0 / 48%)",
                                                        }}
                                                        size="small"
                                                        type="text"
                                                        value={file.remark}
                                                        onChange={(event) =>
                                                          handleRemarkChange(index, event.target.value)
                                                        }
                                                      />
                                                    </FormControl>
                                                  </StyledTableCell> */}

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
                                        onClick={() => renderFilePreviewMulterUploaded(file)}
                                      >
                                        View
                                      </a>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      <Button
                                        onClick={() => handleDeleteUploadedRequestDocument(index)}
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
                              {uploadBillsRequestDocument &&
                                uploadBillsRequestDocument?.map((file, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell align="center">
                                      {sno++}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {file.name || file.file.name}
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="center">
                                      <FormControl>
                                        <OutlinedInput
                                          sx={{
                                            height: "30px !important",
                                            background: "white",
                                            border: "1px solid rgb(0 0 0 / 48%)",
                                          }}
                                          size="small"
                                          type="text"
                                          value={file.remark}
                                          onChange={(event) =>
                                            handleRemarkChange(index, event.target.value)
                                          }
                                        />
                                      </FormControl>
                                    </StyledTableCell> */}

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
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === vendorFollow.visitortype && item?.interactorspurpose?.includes(vendorFollow.visitorpurpose))[0]?.requestdocument && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Request Visitor Followup Date<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={vendorFollow.requestvisitorfollowupdate}
                            onChange={(e) => {
                              setVendorFollow({ ...vendorFollow, requestvisitorfollowupdate: e.target.value });

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
                              label: vendorFollow.requestvisitorfollowaction,
                              value: vendorFollow.requestvisitorfollowaction,
                            }}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
                                requestvisitorfollowaction: e.value,
                                requestfollowupactionupdate: "",
                                requestfollowupactionuptime: ""
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {vendorFollow.requestvisitorfollowaction === 'Required' ? (
                        <>

                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Request Follow Up Date<b style={{ color: 'red' }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="date"
                                value={vendorFollow.requestfollowupactionupdate}
                                onChange={(e) => {
                                  setVendorFollow({
                                    ...vendorFollow,
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
                                value={vendorFollow.requestfollowupactionuptime}
                                onChange={(e) => {
                                  setVendorFollow({
                                    ...vendorFollow,
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={vendorFollow.meetingdetails} />
                        }
                        onChange={(e) =>
                          setVendorFollow({
                            ...vendorFollow,
                            meetingdetails: !vendorFollow.meetingdetails,
                          })
                        }
                        label="Meeting Details"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={9} xs={12} sm={12}></Grid>
                  {vendorFollow.meetingdetails && (
                    <>
                      <Grid item md={12} xs={12} sm={12}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Meeting Person
                        </Typography>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Company <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={isAssignBranch
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
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename:
                                  "Please Select Employee Name",
                              });
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
                            options={isAssignBranch
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
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename:
                                  "Please Select Employee Name",
                              });
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
                            options={isAssignBranch
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
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename:
                                  "Please Select Employee Name",
                              });
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
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename:
                                  "Please Select Employee Name",
                              });
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
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename:
                                  "Please Select Employee Name",
                              });
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
                                  valueDepartmentCat?.includes(
                                    u.department
                                  ) &&
                                  valueTeamCat?.includes(u.team)
                              )
                              .map((u) => ({
                                ...u,
                                label: u.companyname,
                                value: u.companyname,
                              }))}
                            placeholder="Please Select Employee Name"
                            value={{
                              label: vendorFollow.meetingpersonemployeename,
                              value: vendorFollow.meetingpersonemployeename,
                            }}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
                                meetingpersonemployeename: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={12} xs={12} sm={12}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Meeting Location
                        </Typography>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Company <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={isAssignBranch
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
                            value={selectedOptionsCompanyLocation}
                            onChange={(e) => {
                              handleCompanyLocationChange(e);
                            }}
                            valueRenderer={customValueRendererCompanyLocation}
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
                            options={isAssignBranch
                              ?.filter((comp) =>
                                valueCompanyLocationCat?.includes(
                                  comp.company
                                )
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
                            value={selectedOptionsBranchLocation}
                            onChange={(e) => {
                              handleBranchLocationChange(e);
                            }}
                            valueRenderer={customValueRendererBranchLocation}
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
                            options={isAssignBranch
                              ?.filter(
                                (comp) =>
                                  valueCompanyLocationCat?.includes(
                                    comp.company
                                  ) &&
                                  valueBranchLocationCat?.includes(
                                    comp.branch
                                  )
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
                            value={selectedOptionsUnitLocation}
                            onChange={(e) => {
                              handleUnitLocationChange(e);
                            }}
                            valueRenderer={customValueRendererUnitLocation}
                            labelledBy="Please Select Unit"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Floor<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={allfloor
                              ?.filter((u) =>
                                valueBranchLocationCat?.includes(u.branch)
                              )
                              .map((u) => ({
                                ...u,
                                label: u.name,
                                value: u.name,
                              }))}
                            value={selectedOptionsFloorLocation}
                            onChange={(e) => {
                              handleFloorLocationChange(e);
                            }}
                            valueRenderer={customValueRendererFloorLocation}
                            labelledBy="Please Select Floor"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Areas<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              ...new Set(
                                filteredAreas
                                  .filter(
                                    (item) =>
                                      valueFloorLocationCat?.includes(
                                        item.floor
                                      ) &&
                                      valueBranchLocationCat?.includes(
                                        item.branch
                                      )
                                      && item?.boardingareastatus

                                  )
                                  .flatMap((item) => item.area)
                              ),
                            ].map((location) => ({
                              label: location,
                              value: location,
                            }))}
                            placeholder="Please Select Area"
                            value={{
                              label: vendorFollow.meetinglocationarea,
                              value: vendorFollow.meetinglocationarea,
                            }}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
                                meetinglocationarea: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}></Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vendorFollow.escortinformation}
                          />
                        }
                        onChange={(e) =>
                          setVendorFollow({
                            ...vendorFollow,
                            escortinformation:
                              !vendorFollow.escortinformation,
                          })
                        }
                        label="Escort Information"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={9} xs={12} sm={12}></Grid>
                  {vendorFollow.escortinformation && (
                    <>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Escort Details<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={5}
                            value={vendorFollow.escortdetails}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
                                escortdetails: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}></Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Equipment Borrowed</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorFollow.equipmentborrowed}
                        placeholder="Please Enter Equipment Borrowed "
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            equipmentborrowed: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        OUT Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={vendorFollow.outtime}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            outtime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Remark</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={vendorFollow.remark}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            remark: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
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
                          label: vendorFollow.followupaction,
                          value: vendorFollow.followupaction,
                        }}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            followupaction: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid> */}
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === vendor.visitortype && item?.interactorspurpose?.includes(vendor.visitorpurpose))[0]?.requestdocument || false ?
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                      </Grid>
                    </>
                    :
                    <>
                      <Grid item md={3} xs={12} sm={12}>
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
                      </Grid>
                    </>
                  },
                  {vendorFollow.followupaction === "Required" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Follow Up Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={vendorFollow.followupdate}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
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
                            value={vendorFollow.followuptime}
                            onChange={(e) => {
                              setVendorFollow({
                                ...vendorFollow,
                                followuptime: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor Badge / Pass Details</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorFollow.visitorbadge}
                        placeholder="Please Enter Visitor Badge / Pass Details"
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            visitorbadge: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Visitor Survey / Feedback</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={vendorFollow.visitorsurvey}
                        onChange={(e) => {
                          setVendorFollow({
                            ...vendorFollow,
                            visitorsurvey: e.target.value,
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
                  <Grid item md={1} sm={2} xs={12}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Grid>
                  <Grid item md={1} sm={2} xs={12}>
                    <Link
                      to={
                        page === "allvisitor"
                          ? "/interactor/allvisitorlist"
                          : "/interactor/master/listvisitors"
                      }
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
            ) : (
              <></>
            )}
            {followupArray[followupArray.length - 1]?.requestvisitorfollowaction ===
              "Required" ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    {" "}
                    <Typography sx={{ fontWeight: "bold" }}>
                      Add Request Followup Visitors
                    </Typography>{" "}
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Company</Typography>
                    </FormControl>
                    <Typography>{vendor.company}</Typography>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>{vendor.branch}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Unit</Typography>
                      <Typography>{vendor.unit}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        {" "}
                        Visitor's ID
                      </Typography>
                      <Typography>{vendor.visitorid}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        {" "}
                        Visitor Type
                      </Typography>
                      <Typography>{followupArray[followupArray.length - 1]?.visitortype}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor Mode
                      </Typography>
                      <Typography>{followupArray[followupArray.length - 1]?.visitormode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Date</Typography>
                      <Typography>
                        {moment(vendor.date).format("DD-MM-YYYY")}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Prefix</Typography>
                      <Typography>{vendor.prefix}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor Name
                      </Typography>
                      <Typography>{vendor.visitorname}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">IN Time</Typography>
                      <Typography>{followupArray[followupArray.length - 1]?.intime}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor Purpose
                      </Typography>
                      <Typography>{followupArray[followupArray.length - 1]?.visitorpurpose}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor Contact Number
                      </Typography>
                      <Typography>
                        {vendor.visitorcontactnumber}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor Email
                      </Typography>
                      <Typography>{vendor.visitoremail}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Visitor's Company Name
                      </Typography>
                      <Typography>
                        {vendor.visitorcompnayname}
                      </Typography>
                    </FormControl>
                  </Grid>
                  {assignurl !== "visitorenquiry" && (
                    <Grid item md={6} xs={12} sm={12} >
                      <Typography>Photograph</Typography>

                      {vendorFollow?.files?.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
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
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography variant="subtitle2"> {file.name} </Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
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
                  )}
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Visitor ID / Document Details
                    </Typography>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Document Type
                      </Typography>
                      <Typography>{vendor.documenttype}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        Document Number
                      </Typography>
                      <Typography>{vendor.documentnumber}</Typography>
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <Typography >Upload Document</Typography>
                    <Grid >
                      <Grid item md={2} sm={12} xs={12}>

                      </Grid>
                      <Typography>&nbsp;</Typography>
                      <Grid container>
                        <Grid item md={12} sm={12} xs={12}>
                          {followupArray[followupArray.length - 1]?.visitordocument?.length > 0 && followupArray[followupArray.length - 1]?.visitordocument?.map((data, index) => (
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
                                      onClick={() => renderFilePreviewMulterUploaded(data)}
                                    />
                                  </Button>

                                  {/* <Button
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
                                        </Button> */}
                                </Grid>
                              </Grid>
                            </>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[followupArray.length - 1]?.visitortype && item?.interactorspurpose?.includes(followupArray[followupArray.length - 1]?.visitorpurpose))[0]?.requestdocument &&

                    <Grid item md={12} xs={12} sm={12}>
                      <Box >
                        <Grid item xs={8}>
                          <Typography sx={{ fontWeight: 'bold' }}>Request Visitor Document</Typography>
                        </Grid>
                        <>
                          <Grid container sx={{ justifyContent: "center" }} spacing={1}>

                          </Grid>
                        </>

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
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {followupArray[followupArray.length - 1]?.requestdocument &&
                                followupArray[followupArray.length - 1]?.requestdocument?.map((file, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell align="center">
                                      {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                      {file.name || file.file.name}
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="center">
                                              <FormControl>
                                                <OutlinedInput
                                                  sx={{
                                                    height: "30px !important",
                                                    background: "white",
                                                    border: "1px solid rgb(0 0 0 / 48%)",
                                                  }}
                                                  size="small"
                                                  type="text"
                                                  value={file.remark}
                                                  // onChange={(event) =>
                                                  //   handleRemarkChange(index, event.target.value)
                                                  // }
                                                />
                                              </FormControl>
                                            </StyledTableCell> */}

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
                                        onClick={() => renderFilePreviewMulterUploaded(file)}
                                      >
                                        View
                                      </a>
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="center">
                                                                      <Button
                                                                        onClick={() => handleDeleteUploadedRequestDocument(index)}
                                                                        variant="contained"
                                                                        size="small"
                                                                        sx={{
                                                                          textTransform: "capitalize",
                                                                          minWidth: "0px",
                                                                        }}
                                                                      >
                                                                        <DeleteIcon style={{ fontSize: "20px" }} />
                                                                      </Button>
                                                                    </StyledTableCell> */}
                                  </StyledTableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                      <br />
                    </Grid>
                  }
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[followupArray.length - 1]?.visitortype && item?.interactorspurpose?.includes(followupArray[followupArray.length - 1]?.visitorpurpose))[0]?.requestdocument && (
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
                          // onChange={(e) => {
                          //   setVendor({ ...vendor, requestvisitorfollowupdate: e.target.value });

                          // }}
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
                  {assignurl !== "visitorenquiry" &&
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Boolean(followupArray[followupArray.length - 1]?.meetingdetails)}
                              />
                            }
                            readOnly
                            label="Meeting Details"
                          />
                        </FormGroup>
                      </Grid>
                    </>
                  }
                  <Grid item md={10} xs={12} sm={12}></Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Address Type
                      </Typography>

                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.addesstype}
                        placeholder="Please Enter Reference Name"

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Personal Prefix
                      </Typography>

                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.personalprefix}
                        placeholder="Please Enter Reference Name"

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

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Landmark Position Prefix
                      </Typography>


                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.landmarkpositionprefix}
                        placeholder="Please Enter Landmark Name"

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

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Country</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        placeholder="Pincode"
                        value={vendor.pcountry}

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        placeholder="Pincode"
                        value={vendor.pstate}

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>

                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        placeholder="Pincode"
                        value={followupArray[followupArray.length - 1]?.pcity}

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
                  {followupArray[followupArray.length - 1]?.meetingdetails && (
                    <>
                      <Grid item md={12} xs={12} sm={12}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {assignurl === "visitorenquiry" ? "Enquiry Person" : "Meeting Person"}
                        </Typography>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Company
                          </Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersoncompany
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Branch
                          </Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersonbranch
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Unit</Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersonunit
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Department
                          </Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersondepartment
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Team</Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersonteam
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Employee Name
                          </Typography>
                          <Typography>
                            {followupArray[followupArray.length - 1]?.meetingpersonemployeename}
                          </Typography>
                        </FormControl>
                      </Grid>
                      {assignurl === "visitorenquiry" &&
                        <>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Enquired Branch Number
                              </Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.enquiredbranchnumber}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Enquired Branch Email
                              </Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.enquiredbranchemail}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                          </Grid>
                        </>
                      }
                      {assignurl !== "visitorenquiry" && (
                        <>
                          <Grid item md={12} xs={12} sm={12}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Meeting Location
                            </Typography>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Company
                              </Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.meetinglocationcompany
                                  ?.map((t, i) => `${i + 1 + ". "}` + t)
                                  .toString()}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Branch
                              </Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.meetinglocationbranch
                                  ?.map((t, i) => `${i + 1 + ". "}` + t)
                                  .toString()}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Unit</Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.meetinglocationunit
                                  ?.map((t, i) => `${i + 1 + ". "}` + t)
                                  .toString()}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Floor</Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.meetinglocationfloor
                                  ?.map((t, i) => `${i + 1 + ". "}` + t)
                                  .toString()}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Area</Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.meetinglocationarea}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}></Grid>

                          <Grid item md={3} xs={12} sm={12}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Boolean(followupArray[followupArray.length - 1]?.escortinformation)}
                                  />
                                }
                                readOnly
                                label="Escort Information"
                              />
                            </FormGroup>
                          </Grid>
                          <Grid item md={9} xs={12} sm={12}></Grid>
                          {followupArray[followupArray.length - 1]?.escortinformation && (
                            <>
                              <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography variant="h6">
                                    {" "}
                                    Escort Details
                                  </Typography>
                                  <Typography>
                                    {followupArray[followupArray.length - 1]?.escortdetails}
                                  </Typography>
                                </FormControl>
                              </Grid>
                              <Grid item md={6} xs={12} sm={12}></Grid>
                            </>
                          )}
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Equipment Borrowed
                              </Typography>
                              <Typography>
                                {followupArray[followupArray.length - 1]?.equipmentborrowed}
                              </Typography>
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> OUT Time</Typography>
                              <Typography>{followupArray[followupArray.length - 1]?.outtime}</Typography>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Remark</Typography>
                      <Typography>{followupArray[followupArray.length - 1]?.remark}</Typography>
                    </FormControl>
                  </Grid>

                  {/* <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6">
                                {" "}
                                Follow Up Action
                              </Typography>
                              <Typography>{data.followupaction}</Typography>
                            </FormControl>
                          </Grid> */}
                  {visitorsTypeOption?.filter((item) => item?.interactorstype === followupArray[followupArray.length - 1]?.visitortype && item?.interactorspurpose?.includes(followupArray[followupArray.length - 1]?.visitorpurpose))[0]?.requestdocument || false ?
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                      </Grid>
                    </>
                    :
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Follow Up Action <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Typography>{vendorFollow.followupaction}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  },
                  {vendorFollow.followupaction === "Required" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Follow Up Date
                          </Typography>
                          <Typography>
                            {moment(vendorFollow.followupdate).format(
                              "DD-MM-YYYY"
                            )}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Follow Up Time
                          </Typography>
                          <Typography>{vendorFollow.followuptime}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {assignurl !== "visitorenquiry" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Visitor Badge / Pass Details
                          </Typography>
                          <Typography>{vendorFollow.visitorbadge}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            {" "}
                            Visitor Survey / Feedback
                          </Typography>
                          <Typography>{vendorFollow.visitorsurvey}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Added By</Typography>
                      <Typography>{vendor.detailsaddedy}</Typography>
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
                      onClick={(e) => handleSubmitRequest(e, "save1")}
                      disabled={buttonLoad}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={1} sm={2} xs={12}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Grid>
                  <Grid item md={1} sm={2} xs={12}>
                    <Link
                      to={
                        page === "allvisitor"
                          ? "/interactor/allvisitorlist"
                          : "/interactor/master/listvisitors"
                      }
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
            ) : (
              <></>
            )}
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
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
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
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChange}
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
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
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
                        {file?.type.includes("image/") ? (
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
                            className={classes.preview}
                            src={getFileIcon(file?.name)}
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
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
    </Box>
  );
}
export default FollowUpVisitor;
