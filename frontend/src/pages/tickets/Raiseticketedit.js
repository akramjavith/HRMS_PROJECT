import React, { useState, useEffect, useRef, useContext } from "react";
import {
  DialogTitle,
  Box,
  Typography,
  TableBody,
  Paper,

  TableHead,
  TableContainer,
  Table,
  OutlinedInput,
  Dialog,
  Select,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  MenuItem,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import moment from "moment-timezone";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import correctrightimg from "../../images/correctright.jpeg";
import correctwrongimg from "../../images/correctwrong.jpeg";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import { FaTrash } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Webcamimage from "./webcam/Webcamimage";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));


const CopyClip = ({ name }) => {
  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };
  return (
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
      onCopy={handleCopy}
      options={{ message: "Copied!" }}
      text={name}
    >
      <ListItemText primary={name} />
    </CopyToClipboard>
  </ListItem>
  )

}





function Raiseticketedit() {
  const classes = useStyles();
  const [materialsNamesingle, setMaterialsNamesingle] = useState([]);
  const [descriptionNew, setDescriptionNew] = useState([]);
  const [initialDescription, setInitialDescription] = useState([]);
  const [checkingAnsLength, setcheckingAnsLength] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [workStationOptions, setWorkStationOptions] = useState([]);
  const [materialsName, setMaterialsName] = useState([]);
  const [CategoryGrouping, setCategoryGrouping] = useState("");
  const [pagemapCheck, setPagemapCheck] = useState(1);
  const [pageSizeMapCheck, setPageSizeMapCheck] = useState(10);
  const [CheckingTableModification, setCheckingTableModification] = useState(
    []
  );
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [resolvernames, setResolvernames] = useState([]);
  const [pagemap, setPagemap] = useState(1);
  const [selectedOptionsEmployees, setSelectedOptionsEmployee] = useState([]);
  const [selectedOptionsEmployeesValues, setSelectedOptionsEmployeeValues] =
    useState([]);
  const [pageSizeMap, setPageSizeMap] = useState(10);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedOptionsEmployeesID, setSelectedOptionsEmployeeId] = useState(
    []
  );
  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedCompanyValues, setSelectedCompanyValues] = useState([]);
  const [selectedCompanyRaiseValues, setSelectedCompanyRaiseValues] = useState(
    []
  );
  const [selectedCompanyFromRaise, setSelectedCompanyFromRaise] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [subsubcategorys, setSubsubcategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [typemaster, setTypemaster] = useState("No Type");
  const [requiredFieldsMaster, setRequiredFieldsMaster] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [reasonmaster, setReasonmaster] = useState([]);
  const [checkRaiseResolve, setCheckRaiseResolve] = useState("");
  const [priorityfiltermaster, setPriorityfiltermaster] =
    useState("No Priority");
  const [raiseSelfValue, setRaiseSelfValue] = useState("");
  const [assetMaterialCode, setAssetMaterialCode] = useState("");
  const [assetMaterialCodeId, setAssetMaterialCodeId] = useState("");



  
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;






  let todayyes = new Date();

// Subtract 2 days from today's date
todayyes.setDate(todayyes.getDate() - 3);

// Format the date
var ddyes = String(todayyes.getDate()).padStart(2, "0");
var mmyes = String(todayyes.getMonth() + 1).padStart(2, "0"); // Months are zero-based
var yyyyyes = todayyes.getFullYear();
let formattedDateyes = yyyyyes + "-" + mmyes + "-" + ddyes;






  const [raiseTicketMaster, setRaiseTicketMaster] = useState({
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    employeecode: "",
    category: "Please Select Category",
    subcategory: "Please Select Subcategory",
    subsubcategory: "Please Select Sub Sub-category",
    type: "",
    reason: "Please Select Reason",
    priority: "Please Select Priority",
    teamgroupname: "Please Select TeamGroup Name",
    branchRaise: "",
    unitRaise: "",
    teamRaise: "",
    checkedworkstation: false,
    workstation: "Please Select Work Station",
    materialname: "Please Select Material Name",
    employeenameRaise: "",
    duedate: "",
    title: "",
    description: "",
  });
  const [companies, setCompanies] = useState([]);
  const [branchesRaise, setBranchesRaise] = useState([]);
  const [unitsRaise, setUnitsRaise] = useState([]);
  const [teamsRaise, setTeamsRaise] = useState([]);
  const [getAtuoIdFetch, setGetAutoIdFetch] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [selfCheckPointMaster, setSelfCheckPointMaster] = useState([]);
  const handleChangeSummary = (value) => {
    setDescriptionNew(value);
  };
  const handleChangeSummaryEdit = (value) => {
    setRaiseTicketMaster({ ...raiseTicketMaster, description: value });
  };
  const [Accessdrop, setAccesDrop] = useState("");
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
    // setRefImage([]);
    // setRefImageDrag([])
    // setCapturedImages([])
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

  const [expanded, setExpanded] = React.useState(false);
  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const [capturedImages, setCapturedImages] = useState([]);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState();

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
    setGetImg("");
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);

    setGetImg("");
    setPreviewURL(null);
    // setFile("");
    setRefImage([]);

    setRefImageDrag([]);
    setCapturedImages([]);

    // setShowDragField(true)
    // setShowUploadBtn(true)
    // setShowWebCam(true)
  };

  // Error Popup model
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showViewAlert, setShowViewAlert] = useState();
  const handleClickOpenViewpop = () => {
    setIsViewOpen(true);
  };
  const handleCloseViewpop = () => {
    setIsViewOpen(false);
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };
  const [allUploadedFiles, setAllUploadedFiles] = useState([]);

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
    // setRefImageDrag([])
    // setCapturedImages([])

    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image

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
    }
  };

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles.concat(
    refImage,
    refImageDrag,
    capturedImages
  );

  // Create an empty object to keep track of unique values
  let uniqueValues = {};

  // Filter out duplicates and create a new array
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

  //first deletefile
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


  // Drag and drop image upload
  const handleDragOver = (event) => {
    setRefImageDrag([]);
    setRefImage([]);
    setCapturedImages([]);
    event.preventDefault();
  };

  const handleDrop = (event) => {
    setRefImageDrag([]);
    setRefImage([]);
    setCapturedImages([]);

    event.preventDefault();

    previewFile(event.dataTransfer.files[0]);

    // Use dataTransfer property to access the dropped files
    const files = event.dataTransfer.files;

    // Now, you can handle the dropped files
    let newSelectedFiles = [...refImageDrag];

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
          setRefImageDrag(newSelectedFiles);
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
        handleClickOpenerr();
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
    // setPreviewURL(newSelectedFiles);
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;

  const id = useParams().id;

  const fetchHandlerEdit = async () => {
    try {
      let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetMaterialCode(res?.data?.sraiseticket?.materialcode);
      setAssetMaterialCodeId(res?.data?.sraiseticket?.materialcodeid);
      setRaiseTicketMaster(res?.data?.sraiseticket);
      setRaiseSelfValue(res?.data?.sraiseticket?.raiseself);
      setAccesDrop(res?.data?.sraiseticket.accessdrop);
      setInitialDescription(
        res?.data?.sraiseticket?.forwardedlog?.filter(
          (data) => data?.status === "Details Needed"
        )
      );
      fetchEmployee(
        res?.data?.sraiseticket.accessdrop,
        res?.data?.sraiseticket.employeename
      );
      getunitvaluesCateFrom(res?.data?.sraiseticket);
      getunitvaluesCateFromCompany(res?.data?.sraiseticket);
      setRequiredFieldsMaster(res?.data?.sraiseticket?.requiredfields);
      setCheckingTableModification(res?.data?.sraiseticket?.checkingNewtable);
      setPageSizeMap(res?.data?.sraiseticket?.requiredfields.length);
      getunitvaluesEmployees(res?.data?.sraiseticket);
      setSelfCheckPointMaster(
        res?.data?.sraiseticket?.selfcheckpointsmaster[0]
      );
      setSelectedOptionsEmployeeId(res?.data?.sraiseticket?.employeecode);
      getunitvaluesCateFromCompanyRaise(res?.data?.sraiseticket);
      setTypemaster(res?.data?.sraiseticket.type);
      setDuemastersall(res?.data?.sraiseticket.duedate);
      fetchBranchDropdowns(res?.data?.sraiseticket?.companyRaise);
      // fetchMaterialNames(res?.data?.sraiseticket.workstation)
      fetchMaterialNamesBoth(
        res?.data?.sraiseticket.company,
        res?.data?.sraiseticket.branch,
        res?.data?.sraiseticket.unit,
        res?.data?.sraiseticket.accessdrop,
        res?.data?.sraiseticket.workstation
      );
      setCheckRaiseResolve(res?.data?.sraiseticket?.checkRaiseResolve);
      setEmployeeName(res?.data?.sraiseticket?.employeename);
      setEmployeeCode(res?.data?.sraiseticket?.employeecode);
      // setReasonmaster(res?.data?.sraiseticket.reason);
      fetchResolverDetails(
        res?.data?.sraiseticket?.subsubcategory ===
          "Please Select Sub Sub-category"
          ? res?.data?.sraiseticket?.subcategory
          : res?.data?.sraiseticket?.subsubcategory,
        res?.data?.sraiseticket?.subsubcategory ===
          "Please Select Sub Sub-category"
          ? "subcatgeory"
          : "subsubcatgeory",
        res?.data?.sraiseticket.accessdrop,
        res?.data?.sraiseticket?.employeename,
        res?.data?.sraiseticket?.category,
        res?.data?.sraiseticket?.subcategory,
        res?.data?.sraiseticket?.subsubcategory
      );
      fetchTeamGroupRelatedNames(
        res?.data?.sraiseticket?.subsubcategory ===
          "Please Select Sub Sub-category"
          ? res?.data?.sraiseticket?.subcategory
          : res?.data?.sraiseticket?.subsubcategory,
        res?.data?.sraiseticket?.subsubcategory ===
          "Please Select Sub Sub-category"
          ? "subcatgeory"
          : "subsubcatgeory",
        res?.data?.sraiseticket.accessdrop,
        res?.data?.sraiseticket?.employeename,
        res?.data?.sraiseticket?.category,
        res?.data?.sraiseticket?.subcategory,
        res?.data?.sraiseticket?.subsubcategory
      );
      setCategoryGrouping(res?.data?.sraiseticket?.workassetgroup);
      fetchCatgeoryGroupping(
        res?.data?.sraiseticket?.category,
        res?.data?.sraiseticket?.subcategory
      );
      // fetchRequiredFields(res?.data?.sraiseticket.subsubcategory, "subsubcategory")
      // fetchworkStationNames(res?.data?.sraiseticket?.accessdrop)
      setCapturedImages(res?.data?.sraiseticket?.files);
      setRefImage(res?.data?.sraiseticket?.files);
      setRefImageDrag(res?.data?.sraiseticket?.files);
      setAllUploadedFiles(res?.data?.sraiseticket?.files);
      setPriorityfiltermaster(res?.data?.sraiseticket.priority);
      let anwer =
        res?.data?.sraiseticket?.checkingNewtable?.length > 0
          ? res?.data?.sraiseticket?.checkingNewtable[0]?.total
          : [];
      const ans = ["Sno", "User Name", ...anwer.map((data) => data.details)];
      setcheckingAnsLength(ans);

      let res_type1 = await axios.get(SERVICE.REASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result1 =
        res?.data?.sraiseticket.subsubcategory !==
          "Please Select Sub Sub-category" &&
        res?.data?.sraiseticket.subsubcategory !== ""
          ? //need to change
            res_type1.data.reasonmasters.filter(
              (d) =>
                d.subsubcategoryreason.includes(
                  res?.data?.sraiseticket.subsubcategory
                ) && d.typereason === res?.data?.sraiseticket.type
            )
          : res_type1.data.reasonmasters.filter(
              (d) =>
                d.subcategoryreason.includes(
                  res?.data?.sraiseticket.subcategory
                ) && d.typereason === res?.data?.sraiseticket.type
            );

      const uniqueData = Array.from(
        new Set(result1.map((item) => item.namereason))
      ).map((namereason) => {
        return result1.find((item) => item.namereason === namereason);
      });
      const reasonall = [
        ...uniqueData.map((d) => ({
          ...d,
          label: d.namereason,
          value: d.namereason,
        })),
        { label: "No Specific Reason", value: "No Specific Reason" },
      ];

      setReasonmaster(reasonall);

      const answer = res?.data?.sraiseticket?.raiseticketcount.split("#");
      const check = answer[answer.length - 1];
      setGetAutoIdFetch(check);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchHandlerEdit();
  }, []);

  // get all branches
  const fetchCompany = async (e) => {
    try {
      const branchdata = isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      setCompanies(branchdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //company multiselect dropdown changes
  const handleCompanyChangeFrom = (options) => {
    setSelectedCompanyFrom(options);
    setSelectedCompanyValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    setWorkStationOptions([]);
    setMaterialsName([]);
    setCategoryGrouping("");
    fetchBranch(options);
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      employeename: "Please Select Employee Name",
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      subsubcategory: "Please Select Sub Sub-category",
      workstation: "Please Select Work Station",
      materialname: "Please Select Material Name",
    });
    setUnits([]);
    setTeams([]);
    setSelectedOptionsEmployee([]);
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };

  // get all branches
  const fetchBranch = async (e) => {
    try {
      const companyname = e
        ? e.map((data) => data.value)
        : selectedCompanyValues;
      if (companyname) {
        const branches = isAssignBranch?.filter(
          (comp) =>
            companyname.includes(comp.company)
        )?.map(data => ({
          label: data.branch,
          value: data.branch,
        })).filter((item, index, self) => {
          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })

        const branchdata = [
          { label: "ALL", value: "ALL" },
          ...branches
        ];

        setBranches(branchdata);
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchUnitBased = async (e) => {
    const branchname = e ? e.value : raiseTicketMaster.branch;
    try {
    let resdata =  isAssignBranch?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let resdata1 =  isAssignBranch?.filter(
        (comp) =>
         branchname === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let data_set =
        branchname === "ALL"
          ? resdata
          : resdata1;

      const unitall = [
        { label: "ALL", value: "ALL" },
        ...data_set,
      ];

      setUnits(unitall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTeamBased = async (e) => {
    const unitname = e ? e.value : raiseTicketMaster.unit;
    try {

      let result =
        unitname === "ALL" && raiseTicketMaster?.branch === "ALL"
          ? allTeam
          : unitname === "ALL"
          ? allTeam.filter(
              (d) => d.branch === raiseTicketMaster?.branch
            )
          : raiseTicketMaster?.branch === "ALL"
          ? allTeam.filter((d) => d.unit === unitname)
          : allTeam.filter(
              (d) =>
                d.unit === unitname && d.branch === raiseTicketMaster?.branch
            );
      const teamall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeams(teamall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchUsers = async () => {
    try {
      setAllEmployees(allUsersData);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //company multiselect dropdown changes
  const handleEmployeeNames = (options) => {
    setSelectedOptionsEmployee(options);
    let ans = options.map((data) => data.value);
    fetchEmployee(Accessdrop, ans);
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      subsubcategory: "Please Select Sub Sub-category",
      type: "",
      reason: "Please Select Reason",
      priority: "Please Select Priority",
      teamgroupname: "Please Select TeamGroup Name",
      branchRaise: "Please Select Branch",
      workstation: "Please Select Work Station",
      materialname: "Please Select Material Name",
      unitRaise: "Please Select Unit",
      teamRaise: "Please Select Team",
    });
    setWorkStationOptions([]);
    setMaterialsName([]);
    setCategoryGrouping("");
    setRequiredFieldsMaster([])
    setCheckingTableModification([]);
    setSelectedOptionsEmployeeValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployeeId(
      options.map((a, index) => {
        return a.empcode;
      })
    );
  };
  const customValueEmployeesName = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee Name";
  };

  //while onChanginf the Sub_Category Value
  const fetchRequiredFields = async (e, name) => {
    try {
      let res_branch = await axios.get(SERVICE.REQUIREDFIELDS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const branches =
        name === "subcategory"
          ? res_branch.data.required.filter(
              (data) =>
                data.category.includes(raiseTicketMaster.category) &&
                data.subcategory.includes(e.value)
            )
          : res_branch.data.required.filter(
              (data) =>
                data.category.includes(raiseTicketMaster.category) &&
                data.subcategory.includes(raiseTicketMaster.subcategory) &&
                data.subsubcategory.includes(e.value)
            );
      const newArray = branches?.map((data) => data.overalldetails).flat();

      let result = [];
      let ans =
        selectedOptionsEmployees.length < 1
          ? [{ value: isUserRoleAccess.companyname }]
          : selectedOptionsEmployees;
      // Iterate over each object in arr1
      for (let obj1 of newArray) {
        // Iterate over each object in arr2
        for (let obj2 of ans) {
          // Create a new object with merged properties
          let mergedObj = {
            //  idgen: obj2._id,
            namegen: obj2.value,
            details: obj1.details,
            options: obj1.options,
            raiser: obj1.raiser,
            resolver: obj1.resolver,
            restriction: obj1.restriction,
            _id: obj1._id,
          };

          // Push the merged object to the result array
          result.push(mergedObj);
        }
      }
      const mergedArray = result.reduce((acc, obj, index) => {
        const existingGroup = acc.find((group) => group.name === obj.namegen);

        if (existingGroup) {
          existingGroup.total.push(obj);
        } else {
          acc.push({
            name: obj.namegen,
            total: [obj],
            serialNumber: index + 1,
          });
        }

        return acc;
      }, []);

      const answerCheck =
        result.length > 0 && result.map((data) => data.details);
      const totAns = result.length > 0 && [
        "SNO",
        "User Name",
        ...new Set(answerCheck),
      ];
      const outputArray =
        totAns.length > 0 &&
        totAns.map((str) => {
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        });
      setcheckingAnsLength(outputArray);
      setCheckingTableModification(mergedArray);
      setRequiredFieldsMaster(result);
      setPageSizeMapCheck(mergedArray.length);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [employees, setEmployees] = useState([]);
  const [breakTiming, setBreakTiming] = useState([]);

  //get all employees list details
  const fetchEmployee = async (e, value) => {
    try {
      const [res_employee,res_emp_break] = await Promise.all([
        axios.get(SERVICE.USER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.SHIFT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        })
      ])

      setBreakTiming(res_emp_break.data.shifts);

      let answer =
        e === "Manager"
          ? res_employee.data.users.filter((data) =>
              value.includes(data.companyname)
            )
          : res_employee.data.users.filter(
              (data) => isUserRoleAccess.companyname === data.companyname
            );

      let data = answer.map((item) => {
        const matchingBranch = res_emp_break.data.shifts.find(
          (branchObj) => branchObj.name === item.shifttiming
        );
        if (matchingBranch) {
          item.breakhours = matchingBranch.breakhours;
        }
        return item;
      });
      setEmployees(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleOnChanegFieldsCheck = (e, indexs, index, id) => {
    const updatedTodos = [...CheckingTableModification];
    const ans =
      updatedTodos[indexs].total[index]?.options?.split("-")[1] === "number"
        ? "number"
        : updatedTodos[indexs].total[index]?.options?.split("-")[1] === "alpha"
        ? "alpha"
        : "alphanumeric";

    let pattern;
    if (ans === "number") {
      updatedTodos[indexs].total[index].value = e.replace(/[^0-9.;\s]/g, "");
      setCheckingTableModification(updatedTodos);
    }
    if (
      updatedTodos[indexs].total[index]?.options === "Radio" ||
      updatedTodos[indexs].total[index]?.options === "Text Box"
    ) {
      updatedTodos[indexs].total[index].value = e;
      setCheckingTableModification(updatedTodos);
    } else if (ans === "alpha") {
      updatedTodos[indexs].total[index].value = e.replace(/[^a-zA-Z\s;]/g, "");
      setCheckingTableModification(updatedTodos);
    } else {
      updatedTodos[indexs].total[index].value = e;
      setCheckingTableModification(updatedTodos);
    }
  };
  const handleOnChanegFieldsCheckDate = (e, indexs, index, id) => {
    const updatedTodos = [...CheckingTableModification];
    updatedTodos[indexs].total[index].value = e;
    setCheckingTableModification(updatedTodos);
  };

  const handleOnChanegFieldsCheckDateTime = (e, indexs, index, id, val) => {
    if (val === "Date") {
      const updatedTodos = [...CheckingTableModification];
      updatedTodos[indexs].total[index].value = e;
      setCheckingTableModification(updatedTodos);
    }
    if (val === "Time") {
      const updatedTodos = [...CheckingTableModification];
      updatedTodos[indexs].total[index].time = e;
      setCheckingTableModification(updatedTodos);
    }
  };

 
  const handleOnChanegFieldsCheckDateTimeRestrict = (data, e, indexs, index, id, val) => {
    if (val === "Date") {
      if (e) {
        const updatedTodos = [...CheckingTableModification];
        updatedTodos[indexs].total[index].value = e;
        setCheckingTableModification(updatedTodos);
      }else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Allowed Dates"}
            </p>
          </>
        );
        handleClickOpenerr();
      }

    }
    if (val === "Time") {
      const updatedTodos = [...CheckingTableModification];
      updatedTodos[indexs].total[index].time = e;
      setCheckingTableModification(updatedTodos);
    }
  };




  const handleDeleteFileCheck = (indexs, index, id) => {
    const updatedTodos = [...CheckingTableModification];
    updatedTodos[indexs].total[index].files = [];
    setCheckingTableModification(updatedTodos);
  };

  const handleOnChanegFieldsImageCheck = (e, indexs, index, id) => {
    const updatedTodos = [...CheckingTableModification];
    const files = e.target.files;
    // let newSelectedFiles = [...refImage];
    let ans = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      const reader = new FileReader();
      reader.onload = () => {
        ans.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        updatedTodos[indexs].total[index].files = ans;
        setCheckingTableModification(updatedTodos);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchTableFieldValuesCheck = (
    row,
    e,
    value,
    indexs,
    index,
    name,
    id
  ) => {
    let answer;

    if (employees.length > 0) {
      let employeesset = employees.find((data) => data.companyname === name);

      let employeeBreak = breakTiming.find(
        (data) => data?.name === employeesset?.shifttiming
      );
      let caddress = `${
        !employeesset?.cdoorno ? "" : employeesset?.cdoorno + ","
      }
     ${!employeesset?.cstreet ? "" : employeesset?.cstreet + ","}
      ${!employeesset?.carea ? "" : employeesset?.carea + ","}
      ${!employeesset?.clandmark ? "" : employeesset?.clandmark + ","}
      ${!employeesset?.ctaluk ? "" : employeesset?.ctaluk + ","}
      ${!employeesset?.cpost ? "" : employeesset?.cpost + ","}
     ${!employeesset?.ccity ? "" : employeesset?.ccity + ","}
      ${!employeesset?.cstate ? "" : employeesset?.cstate + ","}
      ${!employeesset?.ccountry ? "" : employeesset?.ccountry + ","}
      ${!employeesset?.cpincode ? "" : "-" + employeesset?.cpincode}`;

      let paddress = `${
        !employeesset?.pdoorno ? "" : employeesset?.pdoorno + ","
      }
      ${!employeesset?.pstreet ? "" : employeesset?.pstreet + ","}
      ${!employeesset?.parea ? "" : employeesset?.parea + ","}
      ${!employeesset?.plandmark ? "" : employeesset?.plandmark + ","}
     ${!employeesset?.ptaluk ? "" : employeesset?.ptaluk + ","}
    ${!employeesset?.ppost ? "" : employeesset?.ppost + ","}
     ${!employeesset?.pcity ? "" : employeesset?.pcity + ","}
      ${!employeesset?.pstate ? "" : employeesset?.pstate + ","}
     ${!employeesset?.pcountry ? "" : employeesset?.pcountry + ","}
      ${!employeesset?.ppincode ? "" : "-" + employeesset?.ppincode}`;

      answer = value
        .replaceAll(
          "LEGALNAME",
          employeesset?.legalname ? employeesset?.legalname : "--"
        )
        .replaceAll(
          "DATE OF BIRTH",
          employeesset?.dob ? employeesset?.dob : "--"
        )
        .replaceAll(
          "FIRST NAME",
          employeesset?.firstname ? employeesset?.firstname : "--"
        )
        .replaceAll(
          "LAST NAME",
          employeesset?.lastname ? employeesset?.lastname : "--"
        )
        .replaceAll(
          "WORKSTATION NAME",
          employeesset?.workstation ? employeesset?.workstation : "--"
        )
        .replaceAll(
          "WORKSTATION COUNT",
          employeesset?.workstation ? employeesset?.workstation?.length : "--"
        )
        .replaceAll(
          "SYSTEM COUNT",
          employeesset?.employeecount ? employeesset?.employeecount : "--"
        )
        .replaceAll("CURRENT ADDRESS", caddress ? caddress : "--")
        .replaceAll(
          "LOGIN",
          employeesset?.username ? employeesset?.username : "--"
        )
        .replaceAll("PERMANENT ADDRESS", paddress ? paddress : "--")
        .replaceAll("EMAIL", employeesset?.email ? employeesset?.email : "--")
        .replaceAll(
          "PHONE NUMBER",
          employeesset?.emergencyno ? employeesset?.emergencyno : "--"
        )
        .replaceAll(
          "DATE OF JOINING",
          employeesset?.doj ? employeesset?.doj : "--"
        )
        .replaceAll(
          "DATE OF TRAINING",
          employeesset?.dot ? employeesset?.dot : "--"
        )
        .replaceAll(
          "EMPLOYEE CODE",
          employeesset?.empcode ? employeesset?.empcode : "--"
        )
        .replaceAll(
          "BRANCH",
          employeesset?.branch ? employeesset?.branch : "--"
        )
        .replaceAll("UNIT", employeesset?.unit ? employeesset?.unit : "--")
        .replaceAll(
          "DESIGNATION",
          employeesset?.designation ? employeesset?.designation : "--"
        )
        .replaceAll(
          "COMPANY NAME",
          employeesset?.companyname ? employeesset?.companyname : "--"
        )
        .replaceAll("TEAM", employeesset?.team ? employeesset?.team : "--")
        .replaceAll(
          "PROCESS",
          employeesset?.process ? employeesset?.process : "--"
        )
        .replaceAll(
          "DEPARTMENT",
          employeesset?.department ? employeesset?.department : "--"
        )
        .replaceAll(
          "LAST WORKING DATE",
          employeesset?.reasondate ? employeesset?.reasondate : "--"
        )
        .replaceAll(
          "SHIFT",
          employeesset?.shifttiming ? employeesset?.shifttiming : "--"
        )
        .replaceAll(
          "ACCOUNT NAME",
          employeesset?.accountholdername
            ? employeesset?.accountholdername
            : "--"
        )
        .replaceAll(
          "ACCOUNT NUMBER",
          employeesset?.accountnumber ? employeesset?.accountnumber : "--"
        )
        .replaceAll(
          "IFSC",
          employeesset?.ifsccode ? employeesset?.ifsccode : "--"
        )
        .replaceAll("CURRENT DATE", formattedDate)
        .replaceAll("CURRENT TIME", new Date().toLocaleTimeString())
        .replaceAll(
          "BREAK",
          employeeBreak?.breakhours ? employeeBreak?.breakhours : "--"
        );

      const updatedTodos = [...CheckingTableModification];
      updatedTodos[indexs].total[index].value = answer ? answer : "-";
      updatedTodos[indexs].total[index].display =
        row.raiser === false ? "-" : answer ? answer : "-";
      updatedTodos[indexs].total[index].viewpage =
        row.resolver === false ? "-" : answer ? answer : "-";

      // return answer
    }
  };

  const fetchCategoryTicket = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.ticketcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategoryTicket();
  }, [raiseTicketMaster]);

  const fetchCategoryBased = async (e) => {
    try {
      const category = e ? e.value : raiseTicketMaster.category;
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.ticketcategory
        .filter((data) => {
          return category === data.categoryname;
        })
        .map((data) => data.subcategoryname);
      let ans = [].concat(...data_set);

      setSubcategorys(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );

    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchSubCategoryBased = async (e) => {
    let ans = e ? e?.value : raiseTicketMaster.subcategory;

    try {
      let res_category = await axios.get(SERVICE.SUBSUBCOMPONENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.subsubcomponents
        .filter((data) => {
          return (
            data.subcategoryname.includes(ans) &&
            data.categoryname.includes(raiseTicketMaster.category)
          );
        })
        .map((data) => data.subsubname);

      setSubsubcategorys(
        data_set.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTypemaster = async (e, name) => {
    try {
      let res_type = await axios.get(SERVICE.TYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result =
        name === "subsubcatgeory"
          ? res_type?.data?.typemasters
              .filter((d) => d.subsubcategorytype.includes(e.value))
              .map((item) => item.nametype)
          : res_type?.data?.typemasters
              .filter((d) => d.subcategorytype.includes(e.value))
              .map((item) => item.nametype);

      let typename = result.length > 0 ? result[0] : "No Type";

      setTypemaster(typename);

      let res_type1 = await axios.get(SERVICE.REASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result1 =
        name === "subsubcatgeory"
          ? //need to change
            res_type1.data.reasonmasters.filter(
              (d) =>
                d.subsubcategoryreason.includes(e.value) &&
                d.typereason === result[0]
            )
          : res_type1.data.reasonmasters.filter(
              (d) =>
                d.subcategoryreason.includes(e.value) &&
                // d.subcategoryreason === e.value

                d.typereason === typename
            );

      const uniqueData = Array.from(
        new Set(result1.map((item) => item.namereason))
      ).map((namereason) => {
        return result1.find((item) => item.namereason === namereason);
      });
      const reasonall = [
        { label: "No Specific Reason", value: "No Specific Reason" },
        ...uniqueData.map((d) => ({
          ...d,
          label: d.namereason,
          value: d.namereason,
        })),
      ];

      setReasonmaster(reasonall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchPriorityfilter = async (e) => {
    try {
      let res_priority = await axios.get(SERVICE.PRIORITYMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let resultpriority =
        subsubcategorys.length > 0
          ? res_priority?.data?.prioritymaster
              .filter(
                (d) =>
                  d.reason === e.value &&
                  d.category.includes(raiseTicketMaster.category) &&
                  d.subcategory.includes(raiseTicketMaster.subcategory) &&
                  d.subsubcategory.includes(raiseTicketMaster.subsubcategory) &&
                  d.type == typemaster
              )
              .map((item) => item.priority)
          : res_priority?.data?.prioritymaster
              .filter(
                (d) =>
                  d.reason === e.value &&
                  d.category.includes(raiseTicketMaster.category) &&
                  d.subcategory.includes(raiseTicketMaster.subcategory) &&
                  d.type == typemaster
              )
              .map((item) => item.priority);

      let priorityname =
        resultpriority.length > 0 ? resultpriority[0] : "No Priority";

      setPriorityfiltermaster(priorityname);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get all shifts
  const fetchAllPriority = async () => {
    try {
      let res_priority = await axios.get(SERVICE.PRIORITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const priorityall = res_priority?.data?.priorities?.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setPriorities(priorityall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [duemastersall, setDuemastersall] = useState("");

  const fetchDuemasters = async () => {
    try {
      let res_due = await axios.get(SERVICE.DUEDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let resultdue =
        subsubcategorys?.length > 0
          ? res_due?.data?.duedatemasters
              .filter(
                (d) =>
                  d.subcategory.includes(raiseTicketMaster.subcategory) &&
                  d.category.includes(raiseTicketMaster.category) &&
                  d.subsubcategory.includes(raiseTicketMaster.subsubcategory) &&
                  d.type == typemaster &&
                  d.reason == raiseTicketMaster.reason &&
                  d.priority == priorityfiltermaster
              )
              .map((item) => item.estimation + "-" + item.estimationtime)
          : res_due.data.duedatemasters
              .filter(
                (d) =>
                  d.subcategory.includes(raiseTicketMaster.subcategory) &&
                  d.category.includes(raiseTicketMaster.category) &&
                  d.type == typemaster &&
                  d.reason == raiseTicketMaster.reason &&
                  d.priority == priorityfiltermaster
              )
              .map((item) => item.estimation + "-" + item.estimationtime);

      setDuemastersall(resultdue.length > 0 ? resultdue[0] : "");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchCatgeoryGroupping = async (cat, subcat) => {
    try {
      let res_category = await axios.get(SERVICE.ASSETCATEGORYGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.assetcategorygroupings.find(
        (data) =>
          data?.categoryname?.includes(cat) &&
          data?.subcategoryname?.includes(subcat)
      );
      setCategoryGrouping(data_set ? data_set?.assetoptions : "");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchMaterialNamesBoth = async (company, branch, unit, access, e) => {
    try {
      let res_due = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let accessBasedCompany =
        access === "Manager" && branch === "ALL" && unit === "ALL"
          ? res_due?.data?.assetworkstationgrouping
              ?.filter(
                (data) =>
                  company.includes(data.company) && data?.workstation === e
              )
              ?.flatMap((item) => item.component)
        ?.map((item) => ({
          label: item,
          value: item,
        }))
          : [];
      let accessBasedBranch =
        access === "Manager" && unit === "ALL"
          ? res_due?.data?.assetworkstationgrouping
              ?.filter(
                (data) =>
                  company.includes(data.company) &&
                  branch === data.branch &&
                  data?.workstation === e
              )
              ?.flatMap((item) => item.component)
        ?.map((item) => ({
          label: item,
          value: item,
        }))
          : [];
      let accessBasedUnit =
        access === "Manager"
          ? res_due?.data?.assetworkstationgrouping
              ?.filter(
                (data) =>
                  company.includes(data.company) &&
                  branch === data.branch &&
                  unit === data.unit &&
                  data?.workstation === e
              )
              ?.flatMap((item) => item.component)
        ?.map((item) => ({
          label: item,
          value: item,
        }))
          : [];

      let resultMaterialsSelf = res_due?.data?.assetworkstationgrouping
        ?.filter(
          (data) =>
            isUserRoleAccess.branch === data.branch &&
            isUserRoleAccess.unit === data.unit &&
            isUserRoleAccess.company === data.company &&
            data?.workstation === e
        )
        ?.flatMap((item) => item.component)
        ?.map((item) => ({
          label: item,
          value: item,
        }));

      let Conclude =
        access === "Manager" && branch === "ALL" && unit === "ALL"
          ? accessBasedCompany
          : access === "Manager" && unit === "ALL"
          ? accessBasedBranch
          : access === "Manager"
          ? accessBasedUnit
          : resultMaterialsSelf;

      setMaterialsName(Conclude);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllPriority();
  }, []);

  const concatename =
    (raiseTicketMaster.category == "Please Select Category"
      ? ""
      : raiseTicketMaster.category) +
    (raiseTicketMaster.subcategory == "Please Select Subcategory"
      ? ""
      : "_" + raiseTicketMaster.subcategory) +
    (raiseTicketMaster.subsubcategory == "Please Select Sub Sub-category"
      ? ""
      : "_" + raiseTicketMaster.subsubcategory) +
    (typemaster == "" ? "_" + "No Type" : "_" + typemaster) +
    (raiseTicketMaster.reason == "Please Select Reason"
      ? ""
      : "_" + raiseTicketMaster.reason) +
    (priorityfiltermaster == ""
      ? "_" + "No Priority"
      : "_" + priorityfiltermaster);
  let newval =
    raiseTicketMaster?.category?.slice(0, 3).toUpperCase() +
    "_" +
    raiseTicketMaster?.subcategory?.slice(0, 3).toUpperCase() +
    "#";

  const [teamGroupFromNames, setTeamGroupFromNames] = useState([]);
  const fetchTeamGroupRelatedNames = async (
    e,
    access,
    drop,
    employeenames,
    category,
    subcatgeory,
    subsubcategory
  ) => {
    try {
      let res_due = await axios.get(SERVICE.TEAMGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let CatgeorySubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          employeenames?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(e)
      );
      let CatgeorySubSubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          employeenames?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(subcatgeory) &&
          data.subsubcategoryfrom.includes(subsubcategory)
      );

      let EmployeeCatgeorySubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(e)
      );
      let EmployeeCatgeorySubSubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(subcatgeory) &&
          data.subsubcategoryfrom.includes(subsubcategory)
      );

      let checkingConditions =
        access === "subcatgeory" && drop === "Manager"
          ? CatgeorySubCatgeoryOnly
          : access === "subsubcatgeory" && drop === "Manager"
          ? CatgeorySubSubCatgeoryOnly
          : access === "subcatgeory" && drop === "Employee"
          ? EmployeeCatgeorySubCatgeory
          : EmployeeCatgeorySubSubCatgeory;

      const resolvedBy =
        checkingConditions.length > 0
          ? checkingConditions?.flatMap((data) => data.employeenameto)
          : [];

      setTeamGroupFromNames(
        resolvedBy?.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [companiesRaise, setCompaniesRaise] = useState([]);
  // get all branches
  const fetchCompanyRaise = async (e) => {
    try {
      
      const branchdata = isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      setCompaniesRaise(branchdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //company multiselect dropdown changes
  const handleCompanyChangeFromRaise = (options) => {
    setSelectedCompanyFromRaise(options);
    setSelectedCompanyRaiseValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    const company = options.map((a, index) => a.value);
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      branchRaise: "Please Select Branch",
      unitRaise: "Please Select Unit",
      teamRaise: "Please Select Team",
    });
    setCheckingTableModification([]);
    fetchBranchDropdowns(company);
  };
  const customValueRendererCompanyFromRaise = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };

  const fetchBranchDropdowns = async (e) => {
    try {
      let res_category = isAssignBranch?.filter(
        (comp) =>
          e.includes(comp.company)
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      const branches =
        e?.length > 0
          ? res_category: [];

      const branchdata = [
        { label: "ALL", value: "ALL" },
        ...branches,
      ];

      setBranchesRaise(branchdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchUnit = async (e) => {
    const branchname = e ? e.value : raiseTicketMaster.branchRaise;
    try {
      let resdata = isAssignBranch?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let resdata1 = isAssignBranch?.filter(
        (comp) =>
          branchname === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let data_set =
        branchname === "ALL"
          ? resdata
          : resdata1;
      const unitall = [
        { label: "ALL", value: "ALL" },
        ...data_set,
      ];

      setUnitsRaise(unitall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTeam = async (e) => {
    const unitname = e ? e.value : raiseTicketMaster.unitRaise;
    try {

      let result =
        unitname === "ALL" && raiseTicketMaster?.branchRaise === "ALL"
          ? allTeam
          : unitname === "ALL"
          ? allTeam.filter(
              (d) => d.branch === raiseTicketMaster?.branchRaise
            )
          : raiseTicketMaster?.branchRaise === "ALL"
          ? allTeam.filter((d) => d.unit === unitname)
          : allTeam.filter(
              (d) =>
                d.unit === unitname &&
                d.branch === raiseTicketMaster?.branchRaise
            );
      const teamall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamsRaise(teamall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

 
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employeename";
  };

  const getunitvaluesCateFrom = (e) => {
    setSelectedOptionsCate(
      Array.isArray(e?.employeenameRaise)
        ? e?.employeenameRaise?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `x-${x._id}`,
          }))
        : []
    );
  };

  const getunitvaluesCateFromCompany = (e) => {
    setSelectedCompanyFrom(
      Array.isArray(e?.company)
        ? e?.company?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `x-${x._id}`,
          }))
        : []
    );
    setSelectedCompanyValues(
      Array.isArray(e?.company)
        ? e?.company.map((a, index) => {
            return a;
          })
        : []
    );
  };

  const getunitvaluesCateFromCompanyRaise = (e) => {
    setSelectedCompanyFromRaise(
      Array.isArray(e?.companyRaise)
        ? e?.companyRaise?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `x-${x._id}`,
          }))
        : []
    );
    setSelectedCompanyRaiseValues(
      Array.isArray(e?.companyRaise)
        ? e?.companyRaise.map((a, index) => {
            return a;
          })
        : []
    );
  };
  const getunitvaluesEmployees = (e) => {
    setSelectedOptionsEmployee(
      Array.isArray(e?.employeename)
        ? e?.employeename?.map((x) => ({
            ...x,
            label: x,
            value: x,
            key: `x-${x._id}`,
          }))
        : []
    );

    setSelectedOptionsEmployeeValues(
      Array.isArray(e?.employeename)
        ? e?.employeename.map((a, index) => {
            return a;
          })
        : []
    );
  };
  useEffect(() => {
    fetchCompanyRaise();
    fetchCompany();
    fetchBranch();
    fetchUnit();
    fetchUnitBased();
    fetchTeamBased();
    fetchTeam();
    fetchCategoryBased();
    fetchSubCategoryBased();
  }, [raiseTicketMaster]);

  const fetchSelfCheckPointsMaster = async (e) => {
    try {
      let res_queue = await axios.get(SERVICE.SELFCHECKPOINTTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans =
        raiseTicketMaster.subsubcategory === "Please Select Sub Sub-category"
          ? res_queue?.data.selfcheckpointticketmasters.filter(
              (data) =>
                data.category.includes(raiseTicketMaster.category) &&
                data.subcategory.includes(raiseTicketMaster.subcategory) &&
                e === data.reason &&
                typemaster === data.type
            )
          : res_queue?.data.selfcheckpointticketmasters.filter(
              (data) =>
                data.category.includes(raiseTicketMaster.category) &&
                data.subcategory.includes(raiseTicketMaster.subcategory) &&
                data.subsubcategory.includes(
                  raiseTicketMaster.subsubcategory
                ) &&
                e === data.reason &&
                typemaster === data.type
            );
      let answer = ans.length > 0 ? ans[0] : {};
      setSelfCheckPointMaster(answer);
      handleClickOpenViewpop();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchworkStationNames = async (e) => {
    try {
      let company = [];
      let branch = [];
      let unit = [];
      if (Accessdrop === "Employee") {
        const answer = isUserRoleAccess?.workstation?.map((data) => ({
          ...data,
          label: data,
          value: data,
        }));
        setWorkStationOptions(answer);
      } else if (Accessdrop === "Manager") {
        let checkUser = selectedOptionsEmployees.map((data) => data.value);
        
        const selectedoptions = allUsersData.filter((data) =>
          checkUser.includes(data.companyname)
        );
        const answer =
          selectedoptions.length > 0 &&
          selectedoptions?.map((data) => {
            company.push(data.company);
            branch.push(data.branch);
            unit.push(data.unit);
          });
        const workStation = selectedoptions.flatMap((item) => item.workstation);
        const concludeWorkStation = [...new Set(workStation)];

        setWorkStationOptions(
          concludeWorkStation.map((data) => ({
            ...data,
            label: data,
            value: data,
          }))
        );
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchworkStationNames();
  }, [selectedOptionsEmployees, Accessdrop]);

  const fetchResolverDetails = async (
    e,
    access,
    drop,
    employeenames,
    category,
    subcatgeory,
    subsubcategory
  ) => {
    try {
      let res_due = await axios.get(SERVICE.TEAMGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let CatgeorySubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          employeenames?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(e) &&
          data.subsubcategoryfrom.length < 1
      );
      let CatgeorySubSubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          employeenames?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(subcatgeory) &&
          data.subsubcategoryfrom.includes(subsubcategory)
      );

      let EmployeeCatgeorySubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(e) &&
          data.subsubcategoryfrom.length < 1
      );
      let EmployeeCatgeorySubSubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(category) &&
          data?.subcategoryfrom.includes(subcatgeory) &&
          data.subsubcategoryfrom.includes(subsubcategory)
      );

      let checkingConditions =
        access === "subcatgeory" && drop === "Manager"
          ? CatgeorySubCatgeoryOnly
          : access === "subsubcatgeory" && drop === "Manager"
          ? CatgeorySubSubCatgeoryOnly
          : access === "subcatgeory" && drop === "Employee"
          ? EmployeeCatgeorySubCatgeory
          : EmployeeCatgeorySubSubCatgeory;

      const resolvedBy =
        checkingConditions.length > 0
          ? checkingConditions?.flatMap((data) => data.employeenameto)
          : [];

      setResolvernames(resolvedBy);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const backPage = useNavigate();
  //branch updatedby edit page....
  let updateby = raiseTicketMaster.updatedby;
  //add function
  const sendRequest = async () => {
    setBtnSubmit(true);
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accessdrop: Accessdrop,
        branch: String(
          raiseTicketMaster.branch == undefined ? "" : raiseTicketMaster.branch
        ),
        company: selectedCompanyValues,
        resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
        raisedby: isUserRoleAccess.companyname,
        unit: String(
          raiseTicketMaster.unit == undefined ? "" : raiseTicketMaster.unit
        ),
        team: String(
          raiseTicketMaster.team == undefined ? "" : raiseTicketMaster.team
        ),
        employeename:
          Accessdrop === "Manager"
            ? selectedOptionsEmployeesValues
            : employeeName,
        employeecode:
          Accessdrop === "Manager"
            ? selectedOptionsEmployeesID
            : isUserRoleAccess.empcode,
        category: String(raiseTicketMaster.category),
        subcategory: String(raiseTicketMaster.subcategory),
        subsubcategory:
          String(raiseTicketMaster.subsubcategory) ===
          "Please Select Sub Sub-category"
            ? ""
            : String(raiseTicketMaster.subsubcategory),
        raiseTeamGroup: String(raiseTicketMaster.raiseTeamGroup),
        type: String(typemaster) === "" ? "No Type" : String(typemaster),
        reason:
          String(raiseTicketMaster.reason) === "Please Select Reason"
            ? "No Specific Reason"
            : String(raiseTicketMaster.reason),
        raiseself: "Resolved",
        raiseticketcount: newval + getAtuoIdFetch,
        requiredfields: requiredFieldsMaster,
        checkingNewtable: CheckingTableModification,
        checkedworkstation: raiseTicketMaster.checkedworkstation,
        // priority: String(raiseTicketMaster.priority),
        priority:
          String(priorityfiltermaster) === ""
            ? "No Priority"
            : String(priorityfiltermaster),
        duedate: String(duemastersall),
        title: concatename,
        companyRaise: selectedCompanyRaiseValues,
        description:
          raiseTicketMaster.raiseself === "Details Needed"
            ? descriptionNew
            : raiseTicketMaster?.description,
        descriptionstatus:
          raiseTicketMaster.raiseself === "Details Needed"
            ? [...raiseTicketMaster?.descriptionstatus, descriptionNew]
            : raiseTicketMaster?.description,
        files: resultArray,
        workstation:
          raiseTicketMaster.workstation === "Please Select Work Station"
            ? ""
            : raiseTicketMaster.workstation,
        materialname:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname,
        materialcode:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCode,
        materialcodeid:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCodeId,
        materialnamecut:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname?.split("-")[0],
        teamgroupname:
          String(raiseTicketMaster.teamgroupname) ===
          "Please Select TeamGroup Name"
            ? ""
            : String(raiseTicketMaster.teamgroupname),
        branchRaise:
          String(raiseTicketMaster.branchRaise) === "Please Select Branch"
            ? ""
            : String(raiseTicketMaster.branchRaise),
        unitRaise:
          String(raiseTicketMaster.unitRaise) === "Please Select Unit"
            ? ""
            : String(raiseTicketMaster.unitRaise),
        teamRaise:
          String(raiseTicketMaster.teamRaise) === "Please Select Team"
            ? ""
            : String(raiseTicketMaster.teamRaise),
        employeenameRaise: valueCate,
        selfcheckpointsmaster: selfCheckPointMaster,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      setBtnSubmit(false);
      handleClickOpenerr();
      // setRaiseTicketMaster(res.data);
      backPage("/tickets/listtickets");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const forwardlog = raiseTicketMaster.forwardedlog;

  //add function
  const sendRequestRaise = async () => {
    setBtnSubmit(true);
    try {
      let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accessdrop: Accessdrop,
        branch: String(
          raiseTicketMaster.branch == undefined ? "" : raiseTicketMaster.branch
        ),
        company: selectedCompanyValues,
        raisedby: isUserRoleAccess.companyname,
        raiseddate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
        resolverby: resolvernames,
        unit: String(
          raiseTicketMaster.unit == undefined ? "" : raiseTicketMaster.unit
        ),
        team: String(
          raiseTicketMaster.team == undefined ? "" : raiseTicketMaster.team
        ),
        employeename:
          Accessdrop === "Manager"
            ? selectedOptionsEmployeesValues
            : isUserRoleAccess.companyname,
        employeecode:
          Accessdrop === "Manager"
            ? selectedOptionsEmployeesID
            : isUserRoleAccess.empcode,
        category: String(raiseTicketMaster.category),
        subcategory: String(raiseTicketMaster.subcategory),
        subsubcategory:
          String(raiseTicketMaster.subsubcategory) ===
          "Please Select Sub Sub-category"
            ? ""
            : String(raiseTicketMaster.subsubcategory),
        raiseTeamGroup: String(raiseTicketMaster.raiseTeamGroup),
        type: String(typemaster) === "" ? "No Type" : String(typemaster),
        reason:
          String(raiseTicketMaster.reason) === "Please Select Reason"
            ? "No Specific Reason"
            : String(raiseTicketMaster.reason),
        raiseself:
          raiseSelfValue === "Details Needed" ? "Open Details Needed" : "Open",
        // priority: String(raiseTicketMaster.priority),
        priority:
          String(priorityfiltermaster) === ""
            ? "No Priority"
            : String(priorityfiltermaster),
        duedate: String(duemastersall),
        title: concatename,
        raiseticketcount: newval + getAtuoIdFetch,
        checkedworkstation: raiseTicketMaster.checkedworkstation,
        workstation:
          raiseTicketMaster.workstation === "Please Select Work Station"
            ? ""
            : raiseTicketMaster.workstation,
        materialname:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname,
        materialcode:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCode,
        materialcodeid:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCodeId,
        materialnamecut:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname?.split("-")[0],
        companyRaise: selectedCompanyRaiseValues,
        description:
          raiseTicketMaster?.raiseself === "Details Needed"
            ? descriptionNew
            : raiseTicketMaster?.description,
        descriptionstatus:
          raiseTicketMaster?.raiseself === "Details Needed"
            ? [...raiseTicketMaster?.descriptionstatus, descriptionNew]
            : raiseTicketMaster?.description,
        files: resultArray,
        requiredfields: requiredFieldsMaster,
        checkingNewtable:
          CheckingTableModification === undefined
            ? []
            : CheckingTableModification,
        teamgroupname:
          String(raiseTicketMaster.teamgroupname) ===
          "Please Select TeamGroup Name"
            ? ""
            : String(raiseTicketMaster.teamgroupname),
        branchRaise:
          String(raiseTicketMaster.branchRaise) === "Please Select Branch"
            ? ""
            : String(raiseTicketMaster.branchRaise),
        unitRaise:
          String(raiseTicketMaster.unitRaise) === "Please Select Unit"
            ? ""
            : String(raiseTicketMaster.unitRaise),
        teamRaise:
          String(raiseTicketMaster.teamRaise) === "Please Select Team"
            ? ""
            : String(raiseTicketMaster.teamRaise),
        employeenameRaise: valueCate,
        selfcheckpointsmaster: selfCheckPointMaster,
        forwardedlog: [
          ...forwardlog,
          {
            names:
              Accessdrop === "Manager"
                ? selectedOptionsEmployeesValues
                : isUserRoleAccess.companyname,
            status:
              raiseSelfValue === "Details Needed"
                ? "Open Details Needed"
                : "Open",
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            claimreason:
              raiseTicketMaster?.raiseself === "Details Needed"
                ? descriptionNew
                : raiseTicketMaster?.description,
            // reason: forwardlog[forwardlog?.length - 1]?.reason,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      setRaiseTicketMaster(res.data);
      setBtnSubmit(false);
      backPage("/tickets/listtickets");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // const getCheck =
  const fetchMaterialNamesSingle = async () => {
    try {
      let res_due = await axios.get(SERVICE.ASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let resultMaterialsSelf = res_due?.data?.assetdetails?.map((item) => ({
        ...item,
        label: item.material + "-" + item.code,
        value: item.material + "-" + item.code,
      }));

      setMaterialsNamesingle(resultMaterialsSelf);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchMaterialNamesSingle();
  }, []);

  const [raiseTicketList, setRaiseTicketList] = useState([]);
  //get all project.
  const fetchAllRaisedTickets = async () => {
    try {
      let res_queue = await axios.post(SERVICE.RAISETICKETEDITDUPLICATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        individualid: raiseTicketMaster?._id,
      });
      let answer = res_queue?.data.raisetickets.filter(
        (item) => item._id !== raiseTicketMaster?._id
      );
      setRaiseTicketList(answer);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchAllRaisedTickets();
  }, [raiseTicketMaster]);

  const handleClick = (ind, value) => {
    const updatedTodos = [...selfCheckPointMaster.checkpointgrp];
    updatedTodos[ind].checked = value.target.checked;
    selfCheckPointMaster.checkpointgrp = updatedTodos;
    setSelfCheckPointMaster((data) => {
      return { ...data, checkpointgrp: updatedTodos };
    });
  };
  const handleRaiseSelfSolved = () => {
    const ans = selfCheckPointMaster.checkpointgrp.every(
      (data) => data?.checked === "true" || data.checked === true
    );
    if (ans === true) {
      setCheckRaiseResolve("Resolved");
      handleCloseViewpop();
      fetchDuemasters();
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "These Issues Can't be Solved whether all the checkboxes is'nt chosen"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };
  const handleRaiseSelfExcept = () => {
    const ans = selfCheckPointMaster?.checkpointgrp?.length
      ? selfCheckPointMaster.checkpointgrp.every(
          (data) => data?.checked === true
        )
      : true;
    if (ans === true) {
      // sendRequestRaise();
      setCheckRaiseResolve("Raise");
      handleCloseViewpop();
      fetchDuemasters();
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "These Issues Can't be Raised whether all the checkboxes is'nt chosen"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isDuplicationNewTable = CheckingTableModification.flatMap(
      (data) => data.total
    );
    // const check = isDuplicationNewTable?.every(data => data?.files?.length > 0 || data.value)
    const isValid = isDuplicationNewTable.every((item) => {
      if (
        item.options === "Date Multi Random Time" ||
        item.options === "Date Multi Span Time" ||
        item.options === "DateTime"
      ) {
        return item.value && item.time;
      }
      if (item.options === "Attachments") {
        return item?.files?.length > 0;
      }
      return item.value;
    });

    const isNameMatch = raiseTicketList?.some(
      (item) => item.title?.toLowerCase() === concatename?.toLowerCase()
    );
    if (Accessdrop === "Manager" && selectedCompanyValues.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "Manager" &&
      raiseTicketMaster.branch === "Please Select Branch"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "Manager" &&
      raiseTicketMaster.unit === "Please Select Unit"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "Manager" &&
      raiseTicketMaster.team === "Please Select Team"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      Accessdrop === "Manager" &&
      selectedOptionsEmployeesValues.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      raiseTicketMaster.category == "Please Select Category" ||
      raiseTicketMaster.category == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      raiseTicketMaster.subcategory == "Please Select Subcategory" ||
      raiseTicketMaster.subcategory == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Subcategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      subsubcategorys?.length > 0 &&
      (raiseTicketMaster.subsubcategory == "Please Select Sub Sub-category" ||
        raiseTicketMaster.subsubcategory == "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Sub Sub-category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      raiseTicketMaster.reason == "Please Select Reason" ||
      raiseTicketMaster.reason == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Reason"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (CategoryGrouping === "Work Station" || CategoryGrouping === "Both") &&
      raiseTicketMaster.workstation === "Please Select Work Station"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Work Station"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

   
    else if (concatename == "" || concatename == "Please Select Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Title"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isValid) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All Fields in Required Fields Table"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      raiseTicketMaster?.raiseself === "Details Needed" &&
      (descriptionNew == "" || descriptionNew == "<p><br></p>")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Description"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      raiseTicketMaster?.raiseself !== "Details Needed" &&
      (raiseTicketMaster?.description == "" ||
        raiseTicketMaster?.description == "<p><br></p>")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Description"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (isNameMatch) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Title Already exists"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.raiseTeamGroup === "Manual" &&
      selectedCompanyFromRaise.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.raiseTeamGroup === "Manual" &&
      raiseTicketMaster.branchRaise === "Please Select Branch"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.raiseTeamGroup === "Manual" &&
      raiseTicketMaster.unitRaise === "Please Select Unit"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.raiseTeamGroup === "Manual" &&
      raiseTicketMaster.teamRaise === "Please Select Team"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.raiseTeamGroup === "Manual" &&
      selectedOptionsCate.length < 1
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      if (checkRaiseResolve !== "" && checkRaiseResolve === "Resolved") {
        sendRequest();
      } else if (checkRaiseResolve !== "" && checkRaiseResolve === "Raise") {
        sendRequestRaise();
      }
    }
  };

  const [itemsmap, setItemsMap] = useState([]);
  const [itemsmapCheck, setItemsMapCheck] = useState([]);

  const addSerialNumberMap = () => {
    const itemsWithSerialNumber = requiredFieldsMaster?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      checkbox: item._id,
    }));
    const itemsWithSerialNumbers = CheckingTableModification?.map(
      (item, index) => ({
        ...item,
        serialNumber: index + 1,
        checkbox: item._id,
      })
    );
    setItemsMap(itemsWithSerialNumber);
    setItemsMapCheck(itemsWithSerialNumbers);
  };

  useEffect(() => {
    addSerialNumberMap();
  }, [requiredFieldsMaster]);

  //sorting for unalloted list table

  //table sorting
  const [sortingmap, setSortingMap] = useState({ column: "", direction: "" });

  const handleSortingMap = (column) => {
    const direction =
      sortingmap.column === column && sortingmap.direction === "asc"
        ? "desc"
        : "asc";
    setSortingMap({ column, direction });
  };

  const sortedDataMap = itemsmap.sort((a, b) => {
    if (sortingmap.direction === "asc") {
      return a[sortingmap.column] > b[sortingmap.column] ? 1 : -1;
    } else if (sortingmap.direction === "desc") {
      return a[sortingmap.column] < b[sortingmap.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIconMap = (column) => {
    if (sortingmap.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sortingmap.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //datatable for unalloted list

  //Datatable
  const handlePageChangeMap = (newPage) => {
    setPagemap(newPage);
  };

  const handlePageSizeChangeMap = (event) => {
    setPageSizeMap(Number(event.target.value));
    setPagemap(1);
  };

  //Datatable
  const handlePageChangeMapCheck = (newPage) => {
    setPagemapCheck(newPage);
  };

  const handlePageSizeChangeMapCheck = (event) => {
    setPageSizeMapCheck(Number(event.target.value));
    setPagemapCheck(1);
  };

  //datatable....
  const [searchQueryMap, setSearchQueryMap] = useState("");
  const handleSearchChangeMap = (event) => {
    setSearchQueryMap(event.target.value);
    setPagemap(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQueryMap.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasmap = itemsmap?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredDatasmapCheck = itemsmapCheck?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataMap = filteredDatasmap?.slice(
    (pagemap - 1) * pageSizeMap,
    pagemap * pageSizeMap
  );
  const filteredDatamapCheck = filteredDatasmapCheck?.slice(
    (pagemapCheck - 1) * pageSizeMapCheck,
    pagemapCheck * pageSizeMapCheck
  );

  const totalPagesmap = Math.ceil(filteredDatasmap?.length / pageSizeMap);
  const totalPagesmapCheck = Math.ceil(
    filteredDatasmapCheck?.length / pageSizeMapCheck
  );

  const visiblePagesmap = Math.min(totalPagesmap, 3);
  const visiblePagesmapCheck = Math.min(totalPagesmapCheck, 3);

  const firstVisiblePagemap = Math.max(1, pagemap - 1);
  const firstVisiblePagemapCheck = Math.max(1, pagemapCheck - 1);
  const lastVisiblePagemap = Math.min(
    firstVisiblePagemap + visiblePagesmap - 1,
    totalPagesmap
  );
  const lastVisiblePagemapCheck = Math.min(
    firstVisiblePagemapCheck + visiblePagesmapCheck - 1,
    totalPagesmapCheck
  );

  const pageNumbersmap = [];
  const pageNumbersmapCheck = [];

  const indexOfLastItemmap = pagemap * pageSizeMap;
  const indexOfLastItemmapCheck = pagemapCheck * pageSizeMapCheck;
  const indexOfFirstItemmap = indexOfLastItemmap - pageSizeMap;
  const indexOfFirstItemmapCheck = indexOfLastItemmapCheck - pageSizeMapCheck;

  for (let i = firstVisiblePagemap; i <= lastVisiblePagemap; i++) {
    pageNumbersmap.push(i);
  }
  for (let i = firstVisiblePagemapCheck; i <= lastVisiblePagemapCheck; i++) {
    pageNumbersmapCheck.push(i);
  }

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Raise Ticket",
    pageStyle: "print",
  });

  const columns = [
    { title: "S.NO", field: "serialNumber" },
    { title: "Subcategory ", field: "details" },
    { title: "Subsubcategory ", field: "value" },
  ];

  const checkPdf =
    filteredDatamapCheck?.length > 0 &&
    filteredDatamapCheck.flatMap((data) => data.total);
  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: checkPdf,
    });
    doc.save("Raise_Ticket_Edit.pdf");
  };






  return (
    <>
      <Box>
        <Headtitle title={"RAISE TICKET EDIT"} />
        <Typography sx={userStyle.HeaderText}>Raise Ticket Edit</Typography>
        <Grid>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <NotificationContainer />
          </Box>
        </Grid>
        {/* {isUserRoleCompare?.includes("eraiseticketlist") && ( */}
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item md={9} sm={6} xs={12}>
                <Typography variant="h5">Manage Ticket Master Edit </Typography>
              </Grid>
              {isUserRoleAccess.role.includes("Manager") ? (
                <>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Access</Typography>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          setEmployeeName(
                            e.target.value === "Employee"
                              ? [isUserRoleAccess.companyname]
                              : []
                          );
                          setEmployeeCode(
                            e.target.value === "Employee"
                              ? [isUserRoleAccess.empcode]
                              : []
                          );
                          fetchEmployee(e.target.value, [
                            isUserRoleAccess.companyname,
                          ]);
                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            employeename: "Please Select Employee Name",
                            employeecode: "",
                            category: "Please Select Category",
                            subcategory: "Please Select Subcategory",
                            type: "",
                            workstation: "Please Select Work Station",
                            materialname: "Please Select Material Name",
                            reason: "Please Select Reason",
                            priority: "Please Select Priority",
                            teamgroupname: "Please Select TeamGroup Name",
                            branchRaise: "Please Select Branch",
                            unitRaise: "Please Select Unit",
                            teamRaise: "Please Select Team",
                          });

                          setTypemaster("No Type");
                          setPriorityfiltermaster("No Priority");
                          setRequiredFieldsMaster([]);
                          setSelectedOptionsEmployee([]);
                          setSelectedOptionsEmployeeValues([]);
                          setSelectedCompanyFrom([]);
                          setSelectedCompanyValues([]);
                          setMaterialsName([]);
                          setWorkStationOptions([]);
                          setCategoryGrouping("");
                          setSelectedOptionsEmployeeId([]);
                          setCheckingTableModification([]);
                        }}
                      >
                        <MenuItem value={"Employee"}>Self</MenuItem>
                        <MenuItem value={"Manager"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : isUserRoleCompare.includes("lself/otherraiseticketuser") ? (
                <>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Access</Typography>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          setEmployeeName(
                            e.target.value === "Employee"
                              ? [isUserRoleAccess.companyname]
                              : []
                          );
                          setEmployeeCode(
                            e.target.value === "Employee"
                              ? [isUserRoleAccess.empcode]
                              : []
                          );
                          fetchEmployee(e.target.value, [
                            isUserRoleAccess.companyname,
                          ]);
                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            employeename: "Please Select Employee Name",
                            employeecode: "",
                            category: "Please Select Category",
                            subcategory: "Please Select Subcategory",
                            type: "",
                            workstation: "Please Select Work Station",
                            materialname: "Please Select Material Name",
                            reason: "Please Select Reason",
                            priority: "Please Select Priority",
                            teamgroupname: "Please Select TeamGroup Name",
                            branchRaise: "Please Select Branch",
                            unitRaise: "Please Select Unit",
                            teamRaise: "Please Select Team",
                          });
                          setTypemaster("No Type");
                          setPriorityfiltermaster("No Priority");
                          setRequiredFieldsMaster([]);
                          setSelectedOptionsEmployee([]);
                          setSelectedOptionsEmployeeValues([]);
                          setSelectedCompanyFrom([]);
                          setSelectedCompanyValues([]);
                          setMaterialsName([]);
                          setWorkStationOptions([]);
                          setCategoryGrouping("");
                          setSelectedOptionsEmployeeId([]);
                          setCheckingTableModification([]);
                        }}
                      >
                        <MenuItem value={"Employee"}>Self</MenuItem>
                        <MenuItem value={"Manager"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
            </Grid>
            <br />
            <>
              {raiseTicketMaster?.raiseself === "Details Needed" ? (
                <>
                  <FormControl
                    fullWidth
                    size="small"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Typography variant="h6">Redirected Due To : </Typography>
                    <Stack spacing={1} alignItems="center">
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={
                            initialDescription[initialDescription?.length - 1]
                              ?.reason
                          }
                          color="primary"
                        />
                      </Stack>
                    </Stack>
                  </FormControl>
                </>
              ) : (
                ""
              )}
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                {Accessdrop === "Manager" ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <MultiSelect
                          options={companies}
                          value={selectedCompanyFrom}
                          onChange={handleCompanyChangeFrom}
                          valueRenderer={customValueRendererCompanyFrom}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={branches}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.branch,
                            value: raiseTicketMaster.branch,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              branch: e.value,
                              unit: "Please Select Unit",
                              team: "Please Select Team",
                              employeename: "Please Select Employee Name",
                              category: "Please Select Category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                              subcategory: "Please Select Subcategory",
                              reason: "Please Select Reason",
                              subsubcategory: "Please Select Sub Sub-category",
                            });
                            fetchUnitBased(e);
                            setUnits([]);
                            setSelectedOptionsEmployee([]);
                            setMaterialsName([]);
                            setWorkStationOptions([]);
                            setCheckingTableModification([]);
                            setCategoryGrouping("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={units}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.unit,
                            value: raiseTicketMaster.unit,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              unit: e.value,
                              team: "Please Select Team",
                              employeename: "Please Select Employee Name",
                              category: "Please Select Category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                              subcategory: "Please Select Subcategory",
                              reason: "Please Select Reason",
                              subsubcategory: "Please Select Sub Sub-category",
                            });
                            fetchTeamBased(e);
                            setMaterialsName([]);
                            setWorkStationOptions([]);
                            setCategoryGrouping("");
                            setCheckingTableModification([]);
                            setTeams([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={teams}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.team,
                            value: raiseTicketMaster.team,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              team: e.value,
                              employeename: "Please Select Employee Name",
                              category: "Please Select Category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                              subcategory: "Please Select Subcategory",
                              reason: "Please Select Reason",
                              subsubcategory: "Please Select Sub Sub-category",
                            });
                            // fetchEmployeeBased(e);
                            setMaterialsName([]);
                            setWorkStationOptions([]);
                            setCheckingTableModification([]);
                            setCategoryGrouping("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          // options={allEmployees}
                          options={allEmployees
                            .filter(
                              (item) =>
                                selectedCompanyValues.includes(item.company) &&
                                (raiseTicketMaster.branch != "ALL"
                                  ? item.branch === raiseTicketMaster.branch
                                  : item.branch) &&
                                (raiseTicketMaster.unit != "ALL"
                                  ? item.unit === raiseTicketMaster.unit
                                  : item.unit) &&
                                (raiseTicketMaster.team != "ALL"
                                  ? item.team === raiseTicketMaster.team
                                  : item.team)
                            )
                            .map((item) => ({
                              ...item,
                              label: item.companyname,
                              value: item.companyname,
                            }))}
                          value={selectedOptionsEmployees}
                          onChange={handleEmployeeNames}
                          valueRenderer={customValueEmployeesName}
                          labelledBy="Please Select Employeename"
                          // className="scrollable-multiselect"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Code<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={selectedOptionsEmployeesID}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={employeeName}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Code<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={employeeCode}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={categorys}
                      styles={colourStyles}
                      value={{
                        label: raiseTicketMaster.category,
                        value: raiseTicketMaster.category,
                      }}
                      onChange={(e) => {
                        setRaiseTicketMaster({
                          ...raiseTicketMaster,
                          category: e.value,
                          subcategory: "Please Select Subcategory",
                          subsubcategory: "Please Select Sub Sub-category",
                          workstation: "Please Select Work Station",
                          materialname: "Please Select Material Name",
                          type: "",
                          reason: "Please Select Reason",
                        });
                        setTypemaster("No Type");
                        setSubsubcategorys([]);
                        setPriorityfiltermaster("No Priority");
                        fetchCategoryBased(e);
                        setReasonmaster([]);
                        setMaterialsName([]);
                        setWorkStationOptions([]);
                        setCategoryGrouping("");
                        setCheckingTableModification([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={subcategorys}
                      styles={colourStyles}
                      value={{
                        label: raiseTicketMaster.subcategory,
                        value: raiseTicketMaster.subcategory,
                      }}
                      onChange={(e) => {
                        setRaiseTicketMaster({
                          ...raiseTicketMaster,
                          subcategory: e.value,
                          subsubcategory: "Please Select Sub Sub-category",
                          type: "",
                          reason: "Please Select Reason",
                          workstation: "Please Select Work Station",
                          materialname: "Please Select Material Name",
                        });
                        setSubsubcategorys([]);
                        fetchSubCategoryBased(e);
                        fetchTypemaster(e, "subcatgeory");
                        fetchRequiredFields(e, "subcategory");
                        fetchCatgeoryGroupping(
                          raiseTicketMaster.category,
                          e.value
                        );
                        fetchworkStationNames(Accessdrop);
                        fetchResolverDetails(
                          e.value,
                          "subcatgeory",
                          Accessdrop,
                          selectedOptionsEmployeesValues,
                          raiseTicketMaster.category,
                          e.value,
                          raiseTicketMaster.subsubcategory
                        );
                        setCheckingTableModification([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {subsubcategorys.length > 0 && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Sub-Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={subsubcategorys}
                        styles={colourStyles}
                        value={{
                          label: raiseTicketMaster.subsubcategory,
                          value: raiseTicketMaster.subsubcategory,
                        }}
                        onChange={(e) => {
                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
                            subsubcategory: e.value,
                            type: "",
                            reason: "Please Select Reason",
                          });
                          // fetchSubCategoryBased(e);
                          fetchTypemaster(e, "subsubcatgeory");
                          fetchRequiredFields(e, "subsubcatgeory");
                          setCheckingTableModification([]);
                          fetchResolverDetails(
                            e.value,
                            "subsubcatgeory",
                            Accessdrop,
                            selectedOptionsEmployeesValues,
                            raiseTicketMaster.category,
                            raiseTicketMaster.subcategory,
                            e.value
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={typemaster}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={reasonmaster}
                      styles={colourStyles}
                      value={{
                        label: raiseTicketMaster.reason,
                        value: raiseTicketMaster.reason,
                      }}
                      onChange={(e) => {
                        setRaiseTicketMaster({
                          ...raiseTicketMaster,
                          reason: e.value,
                        });
                        fetchPriorityfilter(e);
                        fetchSelfCheckPointsMaster(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                {CategoryGrouping === "Work Station" ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Work Station<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={workStationOptions}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.workstation,
                            value: raiseTicketMaster.workstation,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              workstation: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : CategoryGrouping === "Material Name" ? (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Material Name </Typography>
                      <Selects
                        options={materialsNamesingle}
                        styles={colourStyles}
                        value={{
                          label: raiseTicketMaster.materialname,
                          value: raiseTicketMaster.materialname,
                        }}
                        onChange={(e) => {
                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
                            materialname: e.value,
                          });
                          let splitcode = e?.value?.split("-");
                          setAssetMaterialCode(splitcode[1]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : CategoryGrouping === "Both" ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Work Station<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={workStationOptions}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.workstation,
                            value: raiseTicketMaster.workstation,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              workstation: e.value,
                            });
                            fetchMaterialNamesBoth(
                              selectedCompanyValues,
                              raiseTicketMaster.branch,
                              raiseTicketMaster.unit,
                              Accessdrop,
                              e.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Material Name </Typography>
                        <Selects
                          options={materialsName}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.materialname,
                            value: raiseTicketMaster.materialname,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              materialname: e.value,
                            });
                            let splitcode = e?.value?.split("-");
                            setAssetMaterialCode(splitcode[1]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={3} xs={12} sm={12}>
                
                  <FormControl fullWidth size="small">
                    <Typography>
                      Priority<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={priorityfiltermaster}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Title<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={concatename}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {filteredDatamapCheck.length > 0 && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid style={userStyle.dataTablestyle}>
                        <Box>
                          <Select
                            id="pageSizeSelectMapCheck"
                            value={pageSizeMapCheck}
                            onChange={handlePageSizeChangeMapCheck}
                            sx={{ width: "77px" }}
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={CheckingTableModification?.length}>
                              All
                            </MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}></Grid>
                    {CheckingTableModification?.length > 0 && (
                      <>
                        <Grid item md={6} xs={12} sm={12} sx={{ marginTop: 2 }}>
                          <Grid container>
                            <Grid>
                              {isUserRoleCompare?.includes(
                                "excelraiseticket"
                              ) && (
                                <>
                                  <Button sx={userStyle.buttongrp}>
                                    &ensp;
                                    <FaFileExcel />
                                    &ensp;
                                    <ReactHTMLTableToExcel
                                      id="test-table-xls-button"
                                      className="download-table-xls-button"
                                      table="raisetickets"
                                      filename="Required Fields"
                                      sheet="Sheet"
                                      buttonText="Export To Excel"
                                    />
                                    &ensp;
                                  </Button>
                                </>
                              )}
                              {isUserRoleCompare?.includes(
                                "printraiseticket"
                              ) && (
                                <>
                                  <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleprint}
                                  >
                                    &ensp;
                                    <FaPrint />
                                    &ensp;Print&ensp;
                                  </Button>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography>Required Fields</Typography>
                      <br></br>
                      <TableContainer>
                        <Table
                          aria-label="simple table"
                          id="excel"
                          sx={{ overflow: "auto" }}
                        >
                          <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                              {checkingAnsLength?.length > 0 &&
                                checkingAnsLength?.map((row, index) => {
                                  return (
                                    <StyledTableCell>
                                      <Box sx={userStyle.tableheadstyle}>
                                        <Box
                                          sx={{
                                            textAlign: "center",
                                            justifyContent: "center",
                                            width:
                                              row === "Sno" ? "50px" : "200px",
                                          }}
                                        >
                                          {row}
                                        </Box>
                                      </Box>
                                    </StyledTableCell>
                                  );
                                })}
                            </StyledTableRow>
                          </TableHead>
                          <TableBody align="left">
                            {filteredDatamapCheck?.length > 0
                              ? filteredDatamapCheck?.map((item, indexs) => {
                                  const ans = item.total;
                                  return (
                                    <StyledTableRow>
                                      <StyledTableCell>
                                        {item?.serialNumber}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                      <CopyClip name={item.name} />
                                      </StyledTableCell>
                                      {ans.map((row, index) => {
                                        return (
                                          <>
                                            <StyledTableCell>
                                              {[
                                                "Text Box-number",
                                                "Text Box-alpha",
                                                "Text Box-alphanumeric",
                                                "Text Box",
                                              ].includes(row?.options) &&
                                              row.raiser ? (
                                                <>
                                                  {row?.value === undefined ||
                                                  row.value === "" ? (
                                                    <OutlinedInput
                                                      id="component-outlined"
                                                      style={{ width: "300px" }}
                                                      type={
                                                        row?.options?.split(
                                                          "-"
                                                        )[1] === "number"
                                                          ? "number"
                                                          : "text"
                                                      }
                                                      sx={
                                                        row?.options?.split(
                                                          "-"
                                                        )[1] === "number"
                                                          ? userStyle.input
                                                          : "text"
                                                      }
                                                      value={row.value}
                                                      onChange={(e) => {
                                                        const ans =
                                                          row?.options?.split(
                                                            "-"
                                                          )[1] === "number"
                                                            ? Number(
                                                                e.target.value
                                                              ) > 0
                                                              ? e.target.value
                                                              : 0
                                                            : e.target.value;
                                                        handleOnChanegFieldsCheck(
                                                          ans,
                                                          indexs,
                                                          index,
                                                          row._id
                                                        );
                                                      }}
                                                      placeholder={row?.details}
                                                    />
                                                  ) : (
                                                    <OutlinedInput
                                                      id="component-outlined"
                                                      style={{ width: "300px" }}
                                                      type={
                                                        row?.options?.split(
                                                          "-"
                                                        )[1] === "number"
                                                          ? "number"
                                                          : "text"
                                                      }
                                                      sx={
                                                        row?.options?.split(
                                                          "-"
                                                        )[1] === "number"
                                                          ? userStyle.input
                                                          : "text"
                                                      }
                                                      value={row.value}
                                                      onChange={(e) => {
                                                        const ans =
                                                          row?.options?.split(
                                                            "-"
                                                          )[1] === "number"
                                                            ? Number(
                                                                e.target.value
                                                              ) > 0
                                                              ? e.target.value
                                                              : 0
                                                            : e.target.value;
                                                        handleOnChanegFieldsCheck(
                                                          ans,
                                                          indexs,
                                                          index,
                                                          row._id
                                                        );
                                                      }}
                                                      placeholder={row?.details}
                                                    />
                                                  )}
                                                </>
                                              ) : [
                                                  "Date",
                                                  "Date Multi Span",
                                                  "Date Multi Random",
                                                ].includes(row?.options) &&
                                                row.raiser ? (
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  type="date"
                                                  value={
                                                    row.value ? row.value : ""
                                                  }
                                                  onChange={(e) =>
                                                    handleOnChanegFieldsCheckDate(
                                                      e.target.value,
                                                      indexs,
                                                      index,
                                                      row._id
                                                    )
                                                  }
                                                />
                                              ) : 
                                              [
                                                "DateTime"
                                              ].includes(row?.options) &&
                                                row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id={row._id}
                                                    type="date"
                                                    value={
                                                      row.value ? row.value : ""
                                                    }
                                                    onChange={(e) =>{
                                                      const ans = (new Date(e.target.value) > new Date(formattedDateyes)) ? e.target.value :row.restriction == true ?  "" : e.target.value;
                                                      handleOnChanegFieldsCheckDateTimeRestrict(
                                                        row,
                                                        ans,
                                                        indexs,
                                                        index,
                                                        row._id,
                                                        "Date"
                                                      )
                                                    }
                                                    }
                                                  />
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={
                                                      row.time ? row.time : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleOnChanegFieldsCheckDateTimeRestrict(
                                                        row,
                                                        e.target.value,
                                                        indexs,
                                                        index,
                                                        row._id,
                                                        "Time"
                                                      )
                                                    }
                                                  />
                                                </>
                                              ) 
                                              
                                              
                                              
                                              :
                                              
                                              [
                                                  "Date Multi Span Time",
                                                  "Date Multi Random Time",
                                                ].includes(row?.options) &&
                                                row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
                                                    value={
                                                      row.value ? row.value : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleOnChanegFieldsCheckDateTime(
                                                        e.target.value,
                                                        indexs,
                                                        index,
                                                        row._id,
                                                        "Date"
                                                      )
                                                    }
                                                  />
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={
                                                      row.time ? row.time : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleOnChanegFieldsCheckDateTime(
                                                        e.target.value,
                                                        indexs,
                                                        index,
                                                        row._id,
                                                        "Time"
                                                      )
                                                    }
                                                  />
                                                </>
                                              ) : 
                                              
                                              
                                              
                                              
                                              
                                              ["Time"].includes(
                                                  row?.options
                                                ) && row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
                                                    value={
                                                      row.value ? row.value : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleOnChanegFieldsCheckDate(
                                                        e.target.value,
                                                        indexs,
                                                        index,
                                                        row._id
                                                      )
                                                    }
                                                  />
                                                </>
                                              ) : row?.options === "Radio" &&
                                                row.raiser ? (
                                                <>
                                                  {row?.value === undefined ||
                                                  row.value === "" ? (
                                                    <Selects
                                                      options={[
                                                        {
                                                          label: "Yes",
                                                          value: "Yes",
                                                        },
                                                        {
                                                          label: "No",
                                                          value: "No",
                                                        },
                                                      ]}
                                                      styles={colourStyles}
                                                      onChange={(e) =>
                                                        handleOnChanegFieldsCheck(
                                                          e.value,
                                                          indexs,
                                                          index,
                                                          row._id
                                                        )
                                                      }
                                                    />
                                                  ) : (
                                                    <Selects
                                                      options={[
                                                        {
                                                          label: "Yes",
                                                          value: "Yes",
                                                        },
                                                        {
                                                          label: "No",
                                                          value: "No",
                                                        },
                                                      ]}
                                                      styles={colourStyles}
                                                      value={{
                                                        label: row.value,
                                                        value: row.value,
                                                      }}
                                                      onChange={(e) =>
                                                        handleOnChanegFieldsCheck(
                                                          e.value,
                                                          indexs,
                                                          index,
                                                          row._id
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </>
                                              ) : row?.options ===
                                                  "Attachments" &&
                                                row.raiser ? (
                                                <>
                                                  {/* <Button>Upload<input type="file" id={`${row?.details}`} accept="image/*" hidden onChange={(e)=> handleOnChanegFieldsImage(e , index , row._id)}  /></Button> */}
                                                  {(row?.files === undefined ||
                                                    row?.files?.length < 1) && (
                                                    <Button
                                                      component="label"
                                                      color="info"
                                                      variant="contained"
                                                    >
                                                      Upload
                                                      <input
                                                        type="file"
                                                        id={`${row?.details}`}
                                                        accept="image/*"
                                                        hidden
                                                        onChange={(e) =>
                                                          handleOnChanegFieldsImageCheck(
                                                            e,
                                                            indexs,
                                                            index,
                                                            row
                                                          )
                                                        }
                                                      />
                                                    </Button>
                                                  )}
                                                  <Typography>
                                                    {row?.files &&
                                                      row?.files[0]?.name}
                                                  </Typography>
                                                  {row?.files?.length > 0 && (
                                                    <Button
                                                      sx={{
                                                        padding: "14px 14px",
                                                        minWidth:
                                                          "40px !important",
                                                        borderRadius:
                                                          "50% !important",
                                                        ":hover": {
                                                          backgroundColor:
                                                            "#80808036", // theme.palette.primary.main
                                                        },
                                                      }}
                                                      onClick={() =>
                                                        handleDeleteFileCheck(
                                                          indexs,
                                                          index,
                                                          row
                                                        )
                                                      }
                                                    >
                                                      <FaTrash
                                                        style={{
                                                          fontSize: "medium",
                                                          color: "#a73131",
                                                          fontSize: "14px",
                                                        }}
                                                      />
                                                    </Button>
                                                  )}
                                                </>
                                              ) : row?.display ? (
                                                <CopyClip name={row?.display} /> 
                                              ) : (
                                                <CopyClip name={fetchTableFieldValuesCheck(
                                                  row,
                                                  row?.options,
                                                  row?.details,
                                                  indexs,
                                                  index,
                                                  row?.namegen,
                                                  row._id
                                                )} /> 
                                              )}
                                            </StyledTableCell>
                                          </>
                                        );
                                      })}
                                    </StyledTableRow>
                                  );
                                })
                              : ""}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box style={userStyle.dataTablestyle}>
                        <Box>
                          Showing{" "}
                          {filteredDatamapCheck.length > 0
                            ? (pagemapCheck - 1) * pageSizeMapCheck + 1
                            : 0}{" "}
                          to{" "}
                          {Math.min(
                            pagemapCheck * pageSizeMapCheck,
                            filteredDatasmapCheck.length
                          )}{" "}
                          of {filteredDatasmapCheck.length} entries
                        </Box>

                        <Box>
                          <Button
                            onClick={() => setPagemapCheck(1)}
                            disabled={pagemapCheck === 1}
                            sx={userStyle.paginationbtn}
                          >
                            <FirstPageIcon />
                          </Button>
                          <Button
                            onClick={() =>
                              handlePageChangeMapCheck(pagemapCheck - 1)
                            }
                            disabled={pagemapCheck === 1}
                            sx={userStyle.paginationbtn}
                          >
                            <NavigateBeforeIcon />
                          </Button>
                          {pageNumbersmapCheck?.map((pageNumber) => (
                            <Button
                              key={pageNumber}
                              sx={userStyle.paginationbtn}
                              onClick={() =>
                                handlePageChangeMapCheck(pageNumber)
                              }
                              className={
                                pagemapCheck === pageNumber ? "active" : ""
                              }
                              disabled={pagemapCheck === pageNumber}
                            >
                              {pageNumber}
                            </Button>
                          ))}
                          {lastVisiblePagemapCheck < totalPagesmapCheck && (
                            <span>...</span>
                          )}
                          <Button
                            onClick={() =>
                              handlePageChangeMapCheck(pagemapCheck + 1)
                            }
                            disabled={pagemapCheck === totalPagesmapCheck}
                            sx={userStyle.paginationbtn}
                          >
                            <NavigateNextIcon />
                          </Button>
                          <Button
                            onClick={() => setPagemapCheck(totalPagesmapCheck)}
                            disabled={pagemapCheck === totalPagesmapCheck}
                            sx={userStyle.paginationbtn}
                          >
                            <LastPageIcon />
                          </Button>
                        </Box>
                      </Box>
                      <br></br>
                    </Grid>
                  </>
                )}
                <br></br>
                <br></br>
                <Grid item md={12} sm={12} xs={12}>
                  {raiseTicketMaster?.raiseself === "Details Needed" && (
                    <div>
                      <Accordion
                        expanded={expanded}
                        onChange={handleExpansion}
                        slots={{ transition: Fade }}
                        slotProps={{ transition: { timeout: 400 } }}
                        sx={{
                          "& .MuiAccordion-region": {
                            height: expanded ? "auto" : 0,
                          },
                          "& .MuiAccordionDetails-root": {
                            display: expanded ? "block" : "none",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography>
                            <b>Description Status</b>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {raiseTicketMaster?.descriptionstatus?.map((data) => {
                            return (
                              <ReactQuill
                                style={{ height: "180px" }}
                                value={data}
                                readOnly
                                modules={{
                                  toolbar: [
                                    [
                                      { header: "1" },
                                      { header: "2" },
                                      { font: [] },
                                    ],
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
                            );
                          })}
                          <br></br>
                          <br></br> <br></br>
                          <br></br> <br></br>
                          <br></br> <br></br>
                          <br></br>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  {raiseTicketMaster?.raiseself === "Details Needed" ? (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Description<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={descriptionNew}
                        onChange={handleChangeSummary}
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
                  ) : (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Description<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={raiseTicketMaster?.description}
                        onChange={handleChangeSummaryEdit}
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
                  )}
                  <br /> <br />
                  <br />
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Button
                    variant="contained"
                    onClick={handleClickUploadPopupOpen}
                  >
                    Attachments
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                {isUserRoleCompare.includes("lassignraiseticketuser") && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Access Team Group <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Auto", value: "Auto" },
                          { label: "Manual", value: "Manual" },
                        ]}
                        styles={colourStyles}
                        value={{
                          label: raiseTicketMaster.raiseTeamGroup,
                          value: raiseTicketMaster.raiseTeamGroup,
                        }}
                        onChange={(e) => {
                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
                            raiseTeamGroup: e.value,
                            teamgroupname: "Please Select TeamGroup Name",
                            branchRaise: "Please Select Branch",
                            unitRaise: "Please Select Unit",
                            teamRaise: "Please Select Team",
                          });
                          setSelectedOptionsCate([]);
                          setSelectedCompanyFromRaise([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>{" "}
              {isUserRoleCompare.includes("lassignraiseticketuser") &&
              raiseTicketMaster.raiseTeamGroup === "Manual" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Team Group From</Typography>
                        <Selects
                          options={teamGroupFromNames}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.teamgroupname,
                            value: raiseTicketMaster.teamgroupname,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              teamgroupname: e.value,
                              branchRaise: "Please Select Branch",
                              unitRaise: "Please Select Unit",
                              teamRaise: "Please Select Team",
                            });
                            //  setSelectedOptionsCate([])
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <MultiSelect
                          options={companiesRaise}
                          value={selectedCompanyFromRaise}
                          onChange={handleCompanyChangeFromRaise}
                          valueRenderer={customValueRendererCompanyFromRaise}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={branchesRaise}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.branchRaise,
                            value: raiseTicketMaster.branchRaise,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              branchRaise: e.value,
                              unitRaise: "Please Select Unit",
                              teamRaise: "Please Select Team",
                            });
                            setSelectedOptionsCate([]);
                            //  setAllBranch(e.value);
                            fetchUnit(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={unitsRaise}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.unitRaise,
                            value: raiseTicketMaster.unitRaise,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              unitRaise: e.value,
                              teamRaise: "Please Select Team",
                            });
                            setSelectedOptionsCate([]);
                            fetchTeam(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={teamsRaise}
                          styles={colourStyles}
                          value={{
                            label: raiseTicketMaster.teamRaise,
                            value: raiseTicketMaster.teamRaise,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              teamRaise: e.value,
                            });
                            // fetchAllEmployee(e);
                            setSelectedOptionsCate([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          // options={allEmployeesRaise}
                          options={allEmployees
                            .filter(
                              (item) =>
                                selectedCompanyRaiseValues.includes(
                                  item.company
                                ) &&
                                (raiseTicketMaster.branchRaise != "ALL"
                                  ? item.branch ===
                                    raiseTicketMaster.branchRaise
                                  : item.branch) &&
                                (raiseTicketMaster.unitRaise != "ALL"
                                  ? item.unit === raiseTicketMaster.unitRaise
                                  : item.unit) &&
                                (raiseTicketMaster.teamRaise != "ALL"
                                  ? item.team === raiseTicketMaster.teamRaise
                                  : item.team)
                            )
                            .map((item) => ({
                              ...item,
                              label: item.companyname,
                              value: item.companyname,
                            }))}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Employeename"
                          // className="scrollable-multiselect"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <br /> <br />
              <Grid container>
                <Grid item md={2} xs={12} sm={6}>
                  <LoadingButton
                    sx={{
                      ...userStyle.buttonedit,
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    loading={btnSubmit}
                    style={{ minWidth: "0px" }}
                    onClick={handleSubmit}
                  >
                    UPDATE
                  </LoadingButton>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Link
                    to={"/tickets/listtickets"}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <Button sx={userStyle.btncancel}>Cancel</Button>
                  </Link>
                </Grid>
              </Grid>
            </>
          </Box>
          <br />
        </>
        {/* )} */}

        {/* ALERT DIALOG */}

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
            Upload Attachments
          </DialogTitle>
          <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
            <Grid container spacing={2}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="body2" style={{ marginTop: "5px" }}>
                  Max File size: 5MB
                </Typography>
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
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <br />
                <FormControl size="small" fullWidth>
                  <Grid sx={{ display: "flex" }}>
                    <Button component="label" variant="contained">
                      Upload
                      <input
                        type="file"
                        multiple
                        id="productimage"
                        accept="image/*"
                        hidden
                        onChange={handleInputChange}
                      />
                    </Button>{" "}
                    &ensp;
                    {/* <Button onClick={showWebcam} variant="contained">
                      Webcam
                    </Button> */}
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {resultArray.map((file, index) => (
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
                  </>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUploadOverAll} variant="contained">
              Ok
            </Button>
            {/* <Button onClick={resetImage} sx={userStyle.buttoncancel}>Reset</Button> */}
            <Button onClick={handleUploadPopupClose} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            aria-label="customized table"
            id="raisetickets"
            ref={componentRef}
          >
            <TableHead sx={{ fontWeight: "600" }}>
              <StyledTableRow>
                {checkingAnsLength?.length > 0 &&
                  checkingAnsLength?.map((row, index) => {
                    return (
                      <StyledTableCell>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box
                            sx={{
                              textAlign: "center",
                              justifyContent: "center",
                            }}
                          >
                            {row}
                          </Box>
                        </Box>
                      </StyledTableCell>
                    );
                  })}
              </StyledTableRow>
            </TableHead>
            <TableBody align="left">
              {filteredDatamapCheck?.length > 0
                ? filteredDatamapCheck?.map((item, indexs) => {
                    const ans = item.total;
                    return (
                      <StyledTableRow>
                        <StyledTableCell>{item?.serialNumber}</StyledTableCell>
                        <StyledTableCell>{item?.name}</StyledTableCell>
                        {ans.map((row, index) => {
                          return (
                            <>
                              <StyledTableCell>
                                {[
                                  "Text Box-number",
                                  "Text Box-alpha",
                                  "Text Box-alphanumeric",
                                  "Text Box",
                                ].includes(row?.options) ? (
                                  row?.value
                                ) : [
                                    "Date",
                                    "Date Multi Span",
                                    "Date Multi Random",
                                  ].includes(row?.options) && row.raiser ? (
                                  <>{row?.value}</>
                                ) : [
                                    "DateTime",
                                    "Date Multi Span Time",
                                    "Date Multi Random Time",
                                  ].includes(row?.options) && row.raiser ? (
                                  <>
                                    {`${moment(row.value).format(
                                      "DD-MM-YYYY"
                                    )} - ${row.time}`}
                                  </>
                                ) : row?.options === "Radio" && row.raiser ? (
                                  row?.value
                                ) : row?.options === "Time" && row.raiser ? (
                                  moment(row.value).format("DD-MM-YYYY")
                                ) : row?.options === "Attachments" &&
                                  row.raiser ? (
                                  <Typography>
                                    {row?.files && row?.files[0]?.name}
                                  </Typography>
                                ) : (
                                  row?.display
                                )}
                              </StyledTableCell>
                            </>
                          );
                        })}
                      </StyledTableRow>
                    );
                  })
                : ""}
            </TableBody>
          </Table>
        </TableContainer>

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
            <Button
              variant="contained"
              color="success"
              onClick={webcamDataStore}
            >
              OK
            </Button>
            <Button variant="contained" color="error" onClick={webcamClose}>
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isViewOpen}
          onClose={handleCloseViewpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "scroll",
            "& .MuiPaper-root": {
              overflow: "scroll",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  sx={{ position: "relative" }}
                >
                  <Typography sx={userStyle.HeaderText}>
                    Self Check Points Master
                  </Typography>
                  <CloseIcon
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={handleCloseViewpop}
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>
                        Category
                      </Typography>
                      <Typography>{raiseTicketMaster?.category}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>
                        Sub-Category
                      </Typography>
                      <Typography>{raiseTicketMaster?.subcategory}</Typography>
                    </FormControl>
                  </Grid>
                  {raiseTicketMaster.subsubcategory !==
                    "Please Select Sub Sub-category" && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>
                          Sub Sub-Category
                        </Typography>
                        <Typography>
                          {raiseTicketMaster.subsubcategory}
                        </Typography>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>Type</Typography>
                      <Typography>{typemaster}</Typography>
                    </FormControl>
                  </Grid>
                </>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Reason</Typography>
                    <Typography>{raiseTicketMaster?.reason}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Check Points{" "}
                    </Typography>
                    {selfCheckPointMaster?.checkpointgrp?.map((data, index) => {
                      return (
                        <>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data?.checked}
                                onClick={(e) => handleClick(index, e)}
                              />
                            }
                            label={data.label}
                          />
                        </>
                      );
                    })}
                  </FormControl>
                </Grid>

                <Grid item md={9} xs={12} sm={12}></Grid>
                <Grid item md={12} sm={12} xs={12}></Grid>
              </Grid>

              <br />

              <br />

              <Grid container spacing={2}>
                {selfCheckPointMaster?.checkpointgrp?.length > 0 && (
                  <Grid item md={2} xs={6} sm={6}>
                    <div
                      style={{
                        display: "flex",
                        color: "red",
                        border: "2px solid red",
                      }}
                    >
                      <img
                        src={correctwrongimg}
                        style={{ marginLeft: "5px", marginTop: "20px" }}
                        width={20}
                        height={20}
                      />
                      <Button
                        sx={{
                          display: "flex",
                          color: "red",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                        onClick={handleRaiseSelfSolved}
                      >
                        I am satisfied with the checkpoints; no need to raise a
                        ticket
                      </Button>
                    </div>
                  </Grid>
                )}
                <Grid item md={2} xs={6} sm={6}>
                  <div
                    style={{
                      display: "flex",
                      color: "green",
                      border: "2px solid green",
                    }}
                  >
                    <img
                      src={correctrightimg}
                      style={{ marginLeft: "5px", marginTop: "20px" }}
                      width={20}
                      height={20}
                    />
                    <Button
                      color="success"
                      sx={{ fontSize: "12px", fontWeight: "bold" }}
                      onClick={handleRaiseSelfExcept}
                    >
                      I still have valid reasons to raise my ticket
                    </Button>
                  </div>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </>
          </Box>
        </Dialog>
      </Box>
    </>
  );
}

export default Raiseticketedit;