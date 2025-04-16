import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  FormControlLabel,
  Select,
  Paper,
  MenuItem,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  ListItem,
  ListItemText,
  Checkbox,

} from "@mui/material";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { handleApiError } from "../../components/Errorhandling";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { userStyle, colourStyles } from "../../pageStyle";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { FaPrint, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment-timezone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import correctrightimg from "../../images/correctright.jpeg";
import correctwrongimg from "../../images/correctwrong.jpeg";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import Webcamimage from "./webcam/Webcamimage";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FaTrash } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CloseIcon from "@mui/icons-material/Close";

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

function RaiseticketMaster() {
  const classes = useStyles();
  const [Access, setAcces] = useState();
  const [checkRaiseResolve, setCheckRaiseResolve] = useState("");
  const [Accessdrop, setAccesDrop] = useState("Employee");
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam} = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [branches, setBranches] = useState([]);
  const [CategoryGrouping, setCategoryGrouping] = useState("");
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [resolvernames, setResolvernames] = useState([]);
  const [workStationOptions, setWorkStationOptions] = useState([]);
  const [checkingAnsLength, setcheckingAnsLength] = useState([]);
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [CheckingTableModification, setCheckingTableModification] = useState(
    []
  );
  const [selectedOptionsEmployees, setSelectedOptionsEmployee] = useState([]);
  const [selectedOptionsEmployeesValues, setSelectedOptionsEmployeeValues] =
    useState([]);
  const [selectedOptionsEmployeesID, setSelectedOptionsEmployeeId] = useState(
    []
  );
  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedSubCategoryFrom, setSelectedSubCategoryFrom] = useState([]);
  const [selectedSubSubCategoryFrom, setSelectedSubSubCategoryFrom] = useState(
    []
  );
  const [selectedCompanyValues, setSelectedCompanyValues] = useState([]);
  const [selectedCompanyRaiseValues, setSelectedCompanyRaiseValues] = useState(
    []
  );
  const [selectedCompanyFromRaise, setSelectedCompanyFromRaise] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [pagemap, setPagemap] = useState(1);
  const [pagemapCheck, setPagemapCheck] = useState(1);

  const [companiesRaise, setCompaniesRaise] = useState([]);
  const [branchesRaise, setBranchesRaise] = useState([]);
  const [unitsRaise, setUnitsRaise] = useState([]);
  const [teamsRaise, setTeamsRaise] = useState([]);
  const [allEmployeesRaise, setAllEmployeesRaise] = useState([]);
  const [materialsName, setMaterialsName] = useState([]);
  const [materialsNamesingle, setMaterialsNamesingle] = useState([]);
  const [employee, setEmployee] = useState({});
  //webcam
  const [file, setFile] = useState();
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  let allUploadedFiles = [];
  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [subsubcategorys, setSubsubcategorys] = useState([]);
  const [typemaster, setTypemaster] = useState("No Type");

  const [priorities, setPriorities] = useState([]);
  const [reasonmaster, setReasonmaster] = useState([]);
  const [textSumm, setTextSummary] = useState("");
  const [statusopen, setSatusopen] = useState("Open");
  const [selfCheckPointMaster, setSelfCheckPointMaster] = useState([]);
  const [requiredFieldsMaster, setRequiredFieldsMaster] = useState([]);
  const [priorityfiltermaster, setPriorityfiltermaster] =
    useState("No Priority");
  const [pageSizeMap, setPageSizeMap] = useState(10);
  const [pageSizeMapCheck, setPageSizeMapCheck] = useState(10);

  const [raiseTicketMaster, setRaiseTicketMaster] = useState({
    company: "Please Select Company",
    companyRaise: "Please Select Company",
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
    duedate: "",
    title: "",
    description: "",
    checkedworkstation: false,
    workstation: "Please Select Work Station",
    materialname: "Please Select Material Name",
    access: "Auto",
    teamgroupname: "Please Select TeamGroup Name",
    branchRaise: "Please Select Branch",
    unitRaise: "Please Select Unit",
    teamRaise: "Please Select Team",
    employeenameRaise: "Please Select Employee Name",
  });

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

  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleChangeSummary = (value) => {
    setTextSummary(value);
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

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setFile("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  //first allexcel....
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
  // Drag and drop image upload
  const handleDragOver = (event) => {
    event.preventDefault();
    // setRefImage([]);
    // setCapturedImages([])
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
    //popup close
    webcamClose();
    setGetImg("");
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };
  const handleDrop = (event) => {
    event.preventDefault();

    previewFile(event.dataTransfer.files[0]);

    // Use dataTransfer property to access the dropped files
    const files = event.dataTransfer.files;

    // Now, you can handle the dropped files
    let newSelectedFilesDrag = [...refImageDrag];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image

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

  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };

  const resetImage = () => {
    setGetImg("");
    setFile("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  // get all branches
  const fetchCompany = (e) => {
    try {
      setCompanies(isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
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
    fetchBranch(options);
    setCheckingTableModification([]);
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      employeename: "Please Select Employee Name",
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      subsubcategory: "Please Select Sub Sub-category",
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
  const fetchBranch = (e) => {
    let companynames = e.map((data) => data.value);

    try {
      
      const branches =isAssignBranch?.filter(
        (comp) =>
          companynames.includes(comp.company)
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      const branchdata = [
        { label: "ALL", value: "ALL" },
        ...branches,
      ];
      setBranches(branchdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
          ? res_branch?.data?.required.filter(
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
            // count: obj1.count,
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
        result.length > 0 && result?.map((data) => data.details);
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
      setPageSizeMap(result.length);
      setPageSizeMapCheck(mergedArray.length);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [employees, setEmployees] = useState([]);
  const [breakTiming, setBreakTiming] = useState([]);

  //get all employees list details
  const fetchEmployee = async (e) => {
    let ans = e && e.map((data) => data.value);
    try {
      let res_employee = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res_emp_break = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBreakTiming(res_emp_break.data.shifts);
      let answer =
        Access === "Manager"
          ? res_employee.data.users.filter((data) =>
            ans?.includes(data.companyname)
          )
          : res_employee.data.users.filter(
            (data) => isUserRoleAccess.companyname === data.companyname
          );

      setEmployees(answer);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleOnChanegFields = (e, index, id) => {
    const updatedTodos = [...requiredFieldsMaster];
    updatedTodos[index].value = e;
    setRequiredFieldsMaster(updatedTodos);
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
      updatedTodos[indexs].total[index].value = e ? e.replace(/[^0-9.;\s]/g, "") : "";
      setCheckingTableModification(updatedTodos);
    }
    if (
      updatedTodos[indexs].total[index]?.options === "Radio" ||
      updatedTodos[indexs].total[index]?.options === "Text Box"
    ) {
      updatedTodos[indexs].total[index].value = e;
      setCheckingTableModification(updatedTodos);
    } else if (ans === "alpha") {
      updatedTodos[indexs].total[index].value = e ? e.replace(/[^a-zA-Z\s;]/g, "") : "";
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




  const handleMultipleCheckDate = (updatedTodos) => {
    setCheckingTableModification(updatedTodos);
  };

  const handleDeleteFileCheck = (indexs, index, id) => {
    const updatedTodos = [...CheckingTableModification];
    updatedTodos[indexs].total[index].files = [];
    setCheckingTableModification(updatedTodos);
  };

  const handleOnChanegFieldsImage = (e, index, id) => {
    const updatedTodos = [...requiredFieldsMaster];
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
        updatedTodos[index].files = ans;
        const mergedArray = updatedTodos.reduce((acc, obj) => {
          const existingGroup = acc.find((group) => group.name === obj.namegen);

          if (existingGroup) {
            existingGroup.total.push(obj);
          } else {
            acc.push({ name: obj.namegen, total: [obj] });
          }

          return acc;
        }, []);

        setCheckingTableModification(mergedArray);
        setRequiredFieldsMaster(updatedTodos);
      };
      reader.readAsDataURL(file);
    }
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

  // const getCheck =
  const fetchMaterialNamesBoth = async (access, e) => {
    try {

      let res_due = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let accessBasedCompany =
        access === "Manager" &&
          raiseTicketMaster.branch === "ALL" &&
          raiseTicketMaster.unit === "ALL"
          ? res_due?.data?.assetworkstationgrouping
            ?.filter(
              (data) =>
                selectedCompanyValues.includes(data.company) &&
                data?.workstation === e
            )
            ?.flatMap((item) => item.component)
            ?.map((item) => ({
              label: item,
              value: item,
            }))
          : [];
      let accessBasedBranch =
        access === "Manager" && raiseTicketMaster.unit === "ALL"
          ? res_due?.data?.assetworkstationgrouping
            ?.filter(
              (data) =>
                selectedCompanyValues.includes(data.company) &&
                raiseTicketMaster.branch === data.branch &&
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
                selectedCompanyValues.includes(data.company) &&
                raiseTicketMaster.branch === data.branch &&
                raiseTicketMaster.unit === data.unit &&
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
        }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.value === value.value)
        );

      let Conclude =
        access === "Manager" &&
          raiseTicketMaster.branch === "ALL" &&
          raiseTicketMaster.unit === "ALL"
          ? accessBasedCompany
          : access === "Manager" && raiseTicketMaster.unit === "ALL"
            ? accessBasedBranch
            : access === "Manager"
              ? accessBasedUnit
              : resultMaterialsSelf;

      setMaterialsName(Conclude);
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

      let resultMaterialsSelf = res_due?.data?.assetdetails
        ?.map((item) => ({
          ...item,
          label: item.material + "-" + item.code,
          value: item.material + "-" + item.code,
        }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.value === value.value)
        );

      setMaterialsNamesingle(resultMaterialsSelf);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTableFieldValues = (e, value, index, name, id) => {
    let answer;
    if (employees.length > 0) {
      let employeesset = employees.find((data) => data.companyname === name);

      let employeeBreak = breakTiming.find(
        (data) => data?.name === employeesset?.shifttiming
      );
      let caddress = `${!employeesset?.cdoorno ? "" : employeesset?.cdoorno + ","
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

      let paddress = `${!employeesset?.pdoorno ? "" : employeesset?.pdoorno + ","
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
        .replaceAll("CURRENT ADDRESS", caddress)
        .replaceAll(
          "LOGIN",
          employeesset?.username ? employeesset?.username : "--"
        )
        .replaceAll("PERMANENT ADDRESS", paddress)
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

      const updatedTodos = [...requiredFieldsMaster];
      updatedTodos[index].value = answer;
      return answer;
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

    if (employees.length > 0 && CheckingTableModification.length > 0) {
      let employeesset = employees.find((data) => data.companyname === name);

      let employeeBreak = breakTiming.find(
        (data) => data?.name === employeesset?.shifttiming
      );
      let caddress = `${!employeesset?.cdoorno ? "" : employeesset?.cdoorno + ","
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

      let paddress = `${!employeesset?.pdoorno ? "" : employeesset?.pdoorno + ","
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
          employeesset?.legalname ? employeesset?.legalname : ""
        )
        .replaceAll("DATE OF BIRTH", employeesset?.dob ? employeesset?.dob : "")
        .replaceAll(
          "FIRST NAME",
          employeesset?.firstname ? employeesset?.firstname : ""
        )
        .replaceAll(
          "LAST NAME",
          employeesset?.lastname ? employeesset?.lastname : ""
        )
        .replaceAll(
          "WORKSTATION NAME",
          employeesset?.workstation ? employeesset?.workstation : ""
        )
        .replaceAll(
          "WORKSTATION COUNT",
          employeesset?.workstation ? employeesset?.workstation?.length : ""
        )
        .replaceAll(
          "SYSTEM COUNT",
          employeesset?.employeecount ? employeesset?.employeecount : ""
        )
        .replaceAll("CURRENT ADDRESS", caddress)
        .replaceAll(
          "LOGIN",
          employeesset?.username ? employeesset?.username : ""
        )
        .replaceAll("PERMANENT ADDRESS", paddress)
        .replaceAll("EMAIL", employeesset?.email ? employeesset?.email : "")
        .replaceAll(
          "PHONE NUMBER",
          employeesset?.emergencyno ? employeesset?.emergencyno : ""
        )
        .replaceAll(
          "DATE OF JOINING",
          employeesset?.doj ? employeesset?.doj : ""
        )
        .replaceAll(
          "DATE OF TRAINING",
          employeesset?.dot ? employeesset?.dot : ""
        )
        .replaceAll(
          "EMPLOYEE CODE",
          employeesset?.empcode ? employeesset?.empcode : ""
        )
        .replaceAll("BRANCH", employeesset?.branch ? employeesset?.branch : "")
        .replaceAll("UNIT", employeesset?.unit ? employeesset?.unit : "")
        .replaceAll(
          "DESIGNATION",
          employeesset?.designation ? employeesset?.designation : ""
        )
        .replaceAll(
          "COMPANY NAME",
          employeesset?.companyname ? employeesset?.companyname : ""
        )
        .replaceAll("TEAM", employeesset?.team ? employeesset?.team : "")
        .replaceAll(
          "PROCESS",
          employeesset?.process ? employeesset?.process : ""
        )
        .replaceAll(
          "DEPARTMENT",
          employeesset?.department ? employeesset?.department : ""
        )
        .replaceAll(
          "LAST WORKING DATE",
          employeesset?.reasondate ? employeesset?.reasondate : ""
        )
        .replaceAll(
          "SHIFT",
          employeesset?.shifttiming ? employeesset?.shifttiming : ""
        )
        .replaceAll(
          "ACCOUNT NAME",
          employeesset?.accountholdername ? employeesset?.accountholdername : ""
        )
        .replaceAll(
          "ACCOUNT NUMBER",
          employeesset?.accountnumber ? employeesset?.accountnumber : ""
        )
        .replaceAll(
          "IFSC",
          employeesset?.ifsccode ? employeesset?.ifsccode : ""
        )
        .replaceAll("CURRENT DATE", formattedDate)
        .replaceAll("CURRENT TIME", new Date().toLocaleTimeString())
        .replaceAll(
          "BREAK",
          employeeBreak?.breakhours ? employeeBreak?.breakhours : ""
        );

      const updatedTodos = [...CheckingTableModification];
      if (answer) {
        updatedTodos[indexs].total[index].value = answer;
        updatedTodos[indexs].total[index].display =
          row?.raiser === false ? "-" : answer;
        updatedTodos[indexs].total[index].viewpage =
          row?.resolver === false ? "-" : answer;
      } else {
        updatedTodos[indexs].total[index].value = "-";
        updatedTodos[indexs].total[index].display =
          row?.raiser === false ? "-" : "-";
        updatedTodos[indexs].total[index].viewpage =
          row?.resolver === false ? "-" : "-";
      }


    }
  };

  useEffect(() => {
    fetchCompany();
    fetchEmployee();
  }, []);
  useEffect(() => { }, [requiredFieldsMaster]);

  const fetchUnitBased = (e) => {
    try {
     let resdata = isAssignBranch?.map(data => ({
      label: data.unit,
      value: data.unit,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })

    let resdata1 = isAssignBranch?.filter(
      (comp) =>
        e.value === comp.branch
    )?.map(data => ({
      label: data.unit,
      value: data.unit,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })

      let data_set =
        e.value === "ALL"
          ? resdata
          : resdata1;

      setUnits([
        { label: "ALL", value: "ALL" },
        ...data_set,
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTeamBased = async (e) => {
    try {

      let result =
        e.value === "ALL" && isallBranch === "ALL"
          ? allTeam
          : e.value === "ALL"
            ? allTeam.filter((d) => d.branch === isallBranch)
            : isallBranch === "ALL"
              ? allTeam.filter((d) => d.unit === e.value)
              : allTeam.filter(
                (d) => d.unit === e.value && d.branch === isallBranch
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
      let res_module = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });
      setAllEmployees(res_module?.data?.users);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [teamGroupFromNames, setTeamGroupFromNames] = useState([]);
  const fetchTeamGroupRelatedNames = async (e, access) => {
    try {
      let res_due = await axios.get(SERVICE.TEAMGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let CatgeorySubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          selectedOptionsEmployeesValues?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(e)
      );
      let CatgeorySubSubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          selectedOptionsEmployeesValues?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(raiseTicketMaster.subcategory) &&
          data.subsubcategoryfrom.includes(e)
      );

      let EmployeeCatgeorySubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(e)
      );
      let EmployeeCatgeorySubSubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(raiseTicketMaster.subcategory) &&
          data.subsubcategoryfrom.includes(e)
      );

      let checkingConditions =
        access === "subcatgeory" && Accessdrop === "Manager"
          ? CatgeorySubCatgeoryOnly
          : access === "subsubcatgeory" && Accessdrop === "Manager"
            ? CatgeorySubSubCatgeoryOnly
            : access === "subcatgeory" && Accessdrop === "Employee"
              ? EmployeeCatgeorySubCatgeory
              : EmployeeCatgeorySubSubCatgeory;

      const branchall =
        checkingConditions.length > 0
          ? checkingConditions
            .filter((d) =>
              d.employeenamefrom?.some(
                (item) => item === isUserRoleAccess?.companyname
              )
            )
            .map((item) => item?.employeenameto)
            .flat()
          : [];

      setTeamGroupFromNames(
        branchall?.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const ans = [
    {
      namegen: isUserRoleAccess.companyname,
      details: "$EMPCODE$",
      options: "Attachments",
    },
    {
      namegen: isUserRoleAccess.companyname,
      details: "$fsdf$",
      options: "Attachments",
    },
    {
      namegen: isUserRoleAccess.companyname,
      details: "$dsfsd$",
      options: "Attachments",
    },
  ];

  // get all branches
  const fetchCompanyRaise = (e) => {
    try {
      
      const branchdata = isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });

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
    setWorkStationOptions([]);
    setMaterialsName([]);
    setCategoryGrouping("");
    fetchBranchDropdowns(options);
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      branchRaise: "Please Select Branch",
      unitRaise: "Please Select Unit",
      teamRaise: "Please Select Team",
    });
  };
  const customValueRendererCompanyFromRaise = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };
  const fetchBranchDropdowns = (e) => {
    let companynames = e.map((data) => data.value);
    try {
      const branches = isAssignBranch?.filter(
        (comp) =>
          companynames.includes(comp.company)
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      
      const branchdata = [
        { label: "ALL", value: "ALL" },
        ...branches.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setBranchesRaise(branchdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCompanyRaise();
  }, []);

  const fetchUnit = (e) => {
    try {
      let resdata = isAssignBranch?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let resdata1 = isAssignBranch?.filter(
        (comp) =>
          e.value === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      let data_set =
        e.value === "ALL"
          ? resdata
          : resdata1;

      const unitall = [
        { label: "ALL", value: "ALL" },
        ...data_set,
      ];

      setUnitsRaise(unitall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [isallBranch, setIsAllBranch] = useState("");
  const [allBranchRaise, setAllBranchRaise] = useState("");
  const fetchTeam = async (e) => {
    try {
      

      let result =
        e.value === "ALL" && allBranchRaise === "ALL"
          ? allTeam
          : e.value === "ALL"
            ? allTeam.filter(
              (d) => d.branch === allBranchRaise
            )
            : allBranchRaise === "ALL"
              ? allTeam.filter((d) => d.unit === e.value)
              : allTeam.filter(
                (d) => d.unit === e.value && d.branch === allBranchRaise
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

  const handleEmployeeNames = (options) => {
    setSelectedOptionsEmployee(options);
    setSelectedOptionsEmployeeValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployee(options);
    setWorkStationOptions([]);
    setMaterialsName([]);

    setCategoryGrouping("");
    setRaiseTicketMaster({
      ...raiseTicketMaster,
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      subsubcategory: "Please Select Sub Sub-category",
      type: "",
      reason: "Please Select Reason",
    });
    setCheckingTableModification([])
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
  }, []);

  const fetchCategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.ticketcategory
        .filter((data) => {
          return e.value === data.categoryname;
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
    try {
      let res_category = await axios.get(SERVICE.SUBSUBCOMPONENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.subsubcomponents
        .filter((data) => {
          return (
            data.subcategoryname.includes(e.value) &&
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
  const fetchCatgeoryGroupping = async (cat, subcat) => {
    try {
      let res_category = await axios.get(SERVICE.ASSETCATEGORYGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.assetcategorygroupings.find(
        (data) =>
          data?.categoryname?.includes(cat) &&
          data?.subcategoryname?.includes(subcat)
      );
      setCategoryGrouping(data_set ? data_set?.assetoptions : "");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchworkStationNames = async () => {
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
        const conclude = await axios.get(SERVICE.ASSETDETAIL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      } else if (Accessdrop === "Manager") {
        const answer =
          selectedOptionsEmployees.length > 0 &&
          selectedOptionsEmployees?.map((data) => {
            company.push(data.company);
            branch.push(data.branch);
            unit.push(data.unit);
          });
        const workStation =
          selectedOptionsEmployees?.length > 0
            ? selectedOptionsEmployees?.flatMap((item) => item.workstation)
            : [];
        const concludeWorkStation =
          workStation?.length > 0 ? [...new Set(workStation)] : [];
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

  const fetchTypemaster = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.TYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result =
        subsubcategorys.length > 0
          ? res_type.data.typemasters
            .filter((d) => d.subsubcategorytype.includes(e.value))
            .map((item) => item.nametype)
          : res_type.data.typemasters
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
        subsubcategorys.length > 0
          ? //need to change
          res_type1.data.reasonmasters.filter(
            (d) =>
              d.subsubcategoryreason.includes(e.value) &&
              d.typereason === typename
          )
          : res_type1.data.reasonmasters.filter(
            (d) =>
              d.subcategoryreason.includes(e.value) &&
              d.typereason === result[0]
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
          ? res_priority.data.prioritymaster
            .filter(
              (d) =>
                d.reason === e.value &&
                d.category.includes(raiseTicketMaster.category) &&
                d.subcategory.includes(raiseTicketMaster.subcategory) &&
                d.subsubcategory.includes(raiseTicketMaster.subsubcategory) &&
                d.type == typemaster
            )
            .map((item) => item.priority)
          : res_priority.data.prioritymaster
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
          ? res_due.data.duedatemasters
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
  const fetchResolverDetails = async (e, access) => {
    try {
      let res_due = await axios.get(SERVICE.TEAMGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let CatgeorySubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          selectedOptionsEmployeesValues?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(e)
      );
      let CatgeorySubSubCatgeoryOnly = res_due?.data?.teamgroupings?.filter(
        (data) =>
          selectedOptionsEmployeesValues?.some((item) =>
            data?.employeenamefrom.includes(item)
          ) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(raiseTicketMaster.subcategory) &&
          data.subsubcategoryfrom.includes(raiseTicketMaster.subsubcategory)
      );

      let EmployeeCatgeorySubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(e)
      );
      let EmployeeCatgeorySubSubCatgeory = res_due?.data?.teamgroupings?.filter(
        (data) =>
          data.employeenamefrom.includes(isUserRoleAccess.companyname) &&
          data?.categoryfrom.includes(raiseTicketMaster.category) &&
          data?.subcategoryfrom.includes(raiseTicketMaster.subcategory) &&
          data.subsubcategoryfrom.includes(raiseTicketMaster.subsubcategory)
      );

      let checkingConditions =
        access === "subcatgeory" && Accessdrop === "Manager"
          ? CatgeorySubCatgeoryOnly
          : access === "subsubcatgeory" && Accessdrop === "Manager"
            ? CatgeorySubSubCatgeoryOnly
            : access === "subcatgeory" && Accessdrop === "Employee"
              ? EmployeeCatgeorySubCatgeory
              : EmployeeCatgeorySubSubCatgeory;

      const resolvedBy =
        checkingConditions.length > 0
          ? checkingConditions?.flatMap((data) => data.employeenameto)
          : [];

      setResolvernames(resolvedBy);
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

  const backPage = useNavigate();

  //add function
  const sendRequestRaise = async () => {
    
    setBtnSubmit(true);
    try {
      const resdata = await fetchAllRaisedTickets();
      let res = await axios.post(SERVICE.RAISETICKET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accessdrop: Accessdrop,
        branch: String(
          raiseTicketMaster.branch == undefined ? "" : raiseTicketMaster.branch
        ),
        company: selectedCompanyValues,
        raiseticketcount: String(resdata),
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
          Access === "Manager"
            ? selectedOptionsEmployeesValues
            : isUserRoleAccess.companyname,
        accessEmp: String(
          Access === "Manager" && raiseTicketMaster.employeename === "ALL"
            ? true
            : Access === "Manager"
              ? false
              : false
        ),
        employeecode:
          Access === "Manager"
            ? selectedOptionsEmployeesID
            : isUserRoleAccess.empcode,
        category: String(raiseTicketMaster.category),
        subcategory: String(raiseTicketMaster.subcategory),
        subsubcategory:
          String(raiseTicketMaster.subsubcategory) ===
            "Please Select Sub Sub-category"
            ? ""
            : String(raiseTicketMaster.subsubcategory),
        type: String(typemaster) === "" ? "No Type" : String(typemaster),
        reason:
          String(raiseTicketMaster.reason) === "Please Select Reason"
            ? "No Specific Reason"
            : String(raiseTicketMaster.reason),
        raiseTeamGroup: String(raiseTicketMaster.access),
        status: statusopen,
        priority:
          String(priorityfiltermaster) === ""
            ? "No Priority"
            : String(priorityfiltermaster),
        duedate: String(duemastersall),
        title: concatename,
        checkRaiseResolve: checkRaiseResolve,
        raiseself: "Open",
        workassetgroup: CategoryGrouping,
        workstation:
          raiseTicketMaster.workstation === "Please Select Work Station"
            ? ""
            : raiseTicketMaster.workstation,
        materialname:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? "Please Select Material Name"
            : raiseTicketMaster.materialname,
        materialcode:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCode,
        materialnamecut:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname?.split("-")[0],
        description: String(textSumm),
        descriptionstatus: textSumm,
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
        requiredfields: requiredFieldsMaster,
        checkingNewtable: CheckingTableModification,
        companyRaise: selectedCompanyRaiseValues,
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
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
        forwardedlog: [
          {
            names:
              Accessdrop === "Manager"
                ? selectedOptionsEmployeesValues
                : isUserRoleAccess.companyname,
            status: "Open",
            date: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
            claimreason: String(textSumm),
            // reason: forwardlog[forwardlog?.length - 1]?.reason,
            forwardedby: isUserRoleAccess.companyname,
          },
        ],
      });
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            TICKET ID: {resdata} {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();

      setTextSummary("");
      setSelectedCompanyFromRaise([]);
      setEmployee({ empcode: "" });
      setTypemaster("No Type");
      setReasonmaster([]);
      setPriorityfiltermaster("No Priority");
      setSelectedOptionsCate([]);
      setAllEmployeesRaise([]);
      setUnitsRaise([]);
      // setSubcategorys([]);
      setSelectedSubCategoryFrom([]);
      setSelectedSubSubCategoryFrom([]);
      setTeamsRaise([]);
      setRequiredFieldsMaster([]);
      setTextSummary("");
      setEmployee({ empcode: "" });
      setMaterialsName([]);
      handleCloseViewpop();
      setBtnSubmit(false);
      setCheckingTableModification([]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //add function
  const sendRequest = async () => {
    
    setBtnSubmit(true);
    try {
      const resdata = await fetchAllRaisedTickets();
      let res = await axios.post(SERVICE.RAISETICKET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accessdrop: Accessdrop,
        branch: String(
          raiseTicketMaster.branch == undefined ? "" : raiseTicketMaster.branch
        ),
        company: selectedCompanyValues,
        raiseticketcount: String(resdata),
        resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
        raisedby: isUserRoleAccess.companyname,
        unit: String(
          raiseTicketMaster.unit == undefined ? "" : raiseTicketMaster.unit
        ),
        team: String(
          raiseTicketMaster.team == undefined ? "" : raiseTicketMaster.team
        ),
        employeename:
          Access === "Manager"
            ? selectedOptionsEmployeesValues
            : isUserRoleAccess.companyname,
        accessEmp: String(
          Access === "Manager" && raiseTicketMaster.employeename === "ALL"
            ? true
            : Access === "Manager"
              ? false
              : false
        ),
        employeecode:
          Access === "Manager"
            ? selectedOptionsEmployeesID
            : isUserRoleAccess.empcode,
        category: String(raiseTicketMaster.category),
        subcategory: String(raiseTicketMaster.subcategory),
        subsubcategory: String(raiseTicketMaster.subsubcategory),
        type: String(typemaster) === "" ? "No Type" : String(typemaster),
        reason:
          String(raiseTicketMaster.reason) === "Please Select Reason"
            ? "No Specific Reason"
            : String(raiseTicketMaster.reason),
        raiseTeamGroup: String(raiseTicketMaster.access),
        status: "Resolved",
        checkRaiseResolve: checkRaiseResolve,
        workassetgroup: CategoryGrouping,
        workstation:
          raiseTicketMaster.workstation === "Please Select Work Station"
            ? ""
            : raiseTicketMaster.workstation,
        materialname:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? "Please Select Material Name"
            : raiseTicketMaster.materialname,
        materialcode:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : assetMaterialCode,
        materialnamecut:
          raiseTicketMaster.materialname === "Please Select Material Name"
            ? ""
            : raiseTicketMaster.materialname?.split("-")[0],
        priority:
          String(priorityfiltermaster) === ""
            ? "No Priority"
            : String(priorityfiltermaster),
        duedate: "",
        title: concatename,
        raiseself: "Resolved",
        ticketclosed: isUserRoleAccess.companyname,
        description: String(textSumm),
        descriptionstatus: textSumm,
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
        requiredfields: requiredFieldsMaster,
        checkingNewtable: CheckingTableModification,
        companyRaise: selectedCompanyRaiseValues,
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
        addedby: [
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
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            TICKET ID: {resdata} {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      handleCloseViewpop();
      setRaiseTicketMaster({
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employeename: "Please Select Employee Name",
        employeecode: "",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        subcategory: "Please Select Sub Sub-category",
        type: "",
        reason: "Please Select Reason",
        priority: "Please Select Priority",
        duedate: "",
        title: "",
        description: "",
        checkedworkstation: false,
        access: "Auto",
        teamgroupname: "Please Select TeamGroup Name",
        branchRaise: "Please Select Branch",
        unitRaise: "Please Select Unit",
        teamRaise: "Please Select Team",
        employeenameRaise: "Please Select Employee Name",
        workstation: "Please Select Work Station",
        materialname: "Please Select Material Name",
      });
      setTextSummary("");
      setSelectedCompanyFromRaise([]);
      setSelectedCompanyFrom([]);
      setEmployee({ empcode: "" });
      setTypemaster("No Type");
      setReasonmaster([]);
      setPriorityfiltermaster("No Priority");
      setSelectedOptionsCate([]);
      setAllEmployeesRaise([]);
      setUnitsRaise([]);
      setTeamsRaise([]);
      setMaterialsName([]);
      setRequiredFieldsMaster([]);
      setTextSummary("");
  
      setBtnSubmit(false);
      setEmployee({ empcode: "" });
      // backPage("/tickets/listtickets");

    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all project.
  const fetchAllRaisedTickets = async () => {
    try {
      let res_queue = await axios.get(SERVICE.RAISETICKET_LAST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      
      let refNo = res_queue?.data?.raisetickets.length > 0 ? res_queue?.data?.raisetickets[0]?.raiseticketcount : raiseTicketMaster?.category?.slice(0, 3).toUpperCase() + "_" + raiseTicketMaster?.subcategory
      ?.slice(0, 3)
      .toUpperCase() + "#"+0;
      let codenum = refNo.split("#");
      let prefixLength = Number(codenum[1]) + 1;
      let prefixString = String(prefixLength);
      let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ? `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ? `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}` : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` : prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString
      let newval = raiseTicketMaster?.category?.slice(0, 3).toUpperCase() + "_" + raiseTicketMaster?.subcategory
      ?.slice(0, 3)
      .toUpperCase() + "#"+ postfixLength;
      return newval;

      
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //Self Check Point Master
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


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isDuplicationNewTable = CheckingTableModification.flatMap(
      (data) => data.total
    );
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
      (subsubcategorys?.length > 0 &&
        raiseTicketMaster.subsubcategory == "Please Select Sub Sub-category") ||
      raiseTicketMaster.subsubcategory == ""
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

    else if (concatename == "") {
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
    } else if (textSumm == "" || textSumm == "<p><br></p>") {
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

    else if (
      isUserRoleCompare.includes("lassignraiseticketuser") &&
      raiseTicketMaster.access === "Manual" &&
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
      raiseTicketMaster.access === "Manual" &&
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
      raiseTicketMaster.access === "Manual" &&
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
      raiseTicketMaster.access === "Manual" &&
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
      raiseTicketMaster.access === "Manual" &&
      valueCate.length < 1
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
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Atleast choose Raise OR Resolve To Raise Ticket"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // Clear
  const handleClear = (e) => {
    e.preventDefault();
    setRaiseTicketMaster({
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      employeename: "Please Select Employee Name",
      employeecode: "",
      category: "Please Select Category",
      subcategory: "Please Select Subcategory",
      subsubcategory: "Please Select Subcategory",
      type: "",
      reason: "Please Select Reason",
      priority: "Please Select Priority",
      duedate: "",
      title: "",
      description: "",
      access: "Auto",
      teamgroupname: "Please Select TeamGroup Name",
      branchRaise: "Please Select Branch",
      unitRaise: "Please Select Unit",
      teamRaise: "Please Select Team",
      employeenameRaise: "Please Select Employee Name",
      workstation: "Please Select Work Station",
      materialname: "Please Select Material Name",
    });
    setTextSummary("");
    setSelectedCompanyFromRaise([]);
    setSelectedOptionsEmployee([]);
    setSelectedCompanyFrom([]);
    setSelectedOptionsEmployeeId([]);
    setEmployee({ empcode: "" });
    setTypemaster("No Type");
    setBranches([]);
    setUnits([]);
    setTeams([]);
    setReasonmaster([]);
    setSubcategorys([]);
    setSubsubcategorys([]);
    setPriorityfiltermaster("No Priority");
    setSelectedOptionsCate([]);
    setAllEmployeesRaise([]);
    setUnitsRaise([]);
    setTeamsRaise([]);
    setRequiredFieldsMaster([]);
    setMaterialsName([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {
            "Cleared Successfully"
          }
        </p>
      </>
    );
    handleClickOpenerr();
  };
  const handleCancel = () => {
    backPage("/tickets/listtickets");
  };

  useEffect(() => {
    setAcces("Employee");
  }, []);

  useEffect(() => {
    setAcces(Accessdrop);
  }, [Accessdrop]);

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
      (data) => data?.checked === true
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
      fetchDuemasters();
      handleCloseViewpop();
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

  for (let i = firstVisiblePagemap; i <= lastVisiblePagemap; i++) {
    pageNumbersmap.push(i);
  }
  for (let i = firstVisiblePagemapCheck; i <= lastVisiblePagemapCheck; i++) {
    pageNumbersmapCheck.push(i);
  }

  let snos = 1;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Raise Ticket",
    pageStyle: "print",
  });

  return (
    <>
      <Box>
        <Headtitle title={"RAISE TICKET MASTER"} />
        <Typography sx={userStyle.HeaderText}>Raise Ticket Master</Typography>
        <Grid>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <NotificationContainer />
          </Box>
        </Grid>
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item md={9} sm={6} xs={12}>
                <Typography variant="h5">Add Ticket Master</Typography>
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

                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
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
                            branchRaise: "Please Select Branch",
                            unitRaise: "Please Select Unit",
                            teamRaise: "Please Select Team",
                            workstation: "Please Select Work Station",
                            materialname: "Please Select Material Name",
                          });
                          setTypemaster("No Type");
                          setWorkStationOptions([]);
                          setMaterialsName([]);
                          setCategoryGrouping("");
                          setPriorityfiltermaster("No Priority");
                          setRequiredFieldsMaster([]);
                          setSelectedOptionsEmployee([]);
                          setSelectedOptionsEmployeeValues([]);
                          setSelectedCompanyFrom([]);
                          setSelectedCompanyValues([]);
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

                          setRaiseTicketMaster({
                            ...raiseTicketMaster,
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
                            branchRaise: "Please Select Branch",
                            unitRaise: "Please Select Unit",
                            teamRaise: "Please Select Team",
                            workstation: "Please Select Work Station",
                            materialname: "Please Select Material Name",
                          });
                          setTypemaster("No Type");
                          setWorkStationOptions([]);
                          setMaterialsName([]);
                          setCategoryGrouping("");
                          setPriorityfiltermaster("No Priority");
                          setRequiredFieldsMaster([]);
                          setSelectedOptionsEmployee([]);
                          setSelectedOptionsEmployeeValues([]);
                          setSelectedCompanyFrom([]);
                          setSelectedCompanyValues([]);
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
              <Grid container spacing={2}>
                {Access === "Manager" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
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
                    <Grid item md={4} xs={12} sm={12}>
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
                              subcategory: "Please Select Subcategory",
                              subsubcategory: "Please Select Sub Sub-category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                            });
                            fetchUnitBased(e);
                            setIsAllBranch(e.value);
                            setWorkStationOptions([]);
                            setMaterialsName([]);
                            setCheckingTableModification([]);
                            setCategoryGrouping("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
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
                              subcategory: "Please Select Subcategory",
                              subsubcategory: "Please Select Sub Sub-category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                            });
                            fetchTeamBased(e);
                            setWorkStationOptions([]);
                            setMaterialsName([]);
                            setCheckingTableModification([]);
                            setCategoryGrouping("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
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
                              subcategory: "Please Select Subcategory",
                              subsubcategory: "Please Select Sub Sub-category",
                              workstation: "Please Select Work Station",
                              materialname: "Please Select Material Name",
                            });
                            setWorkStationOptions([]);
                            setMaterialsName([]);
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
                          value={isUserRoleAccess.companyname}
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
                          value={isUserRoleAccess.empcode}
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
                          type: "",
                          reason: "Please Select Reason",
                          workstation: "Please Select Work Station",
                          materialname: "Please Select Material Name",
                        });
                        setTypemaster("No Type");
                        setPriorityfiltermaster("No Priority");
                        fetchCategoryBased(e);
                        setWorkStationOptions([]);
                        setMaterialsName([]);
                        setCategoryGrouping("");
                        setCheckingTableModification([]);
                        // setRequiredFieldsMaster([])
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
                        fetchCatgeoryGroupping(
                          raiseTicketMaster.category,
                          e.value
                        );
                        fetchSubCategoryBased(e);
                        fetchTypemaster(e, "subcategory");
                        fetchRequiredFields(e, "subcategory");
                        fetchworkStationNames();
                        fetchMaterialNamesSingle();
                        fetchResolverDetails(e.value, "subcatgeory");
                        fetchTeamGroupRelatedNames(e.value, "subcatgeory");
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
                          });
                          // fetchSubCategoryBased(e);
                          fetchTypemaster(e);
                          fetchRequiredFields(e, "subsubcategory");
                          fetchResolverDetails(e.value, "subsubcatgeory");
                          fetchTeamGroupRelatedNames(e.value, "subsubcatgeory");
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Type</Typography>
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
                        fetchSelfCheckPointsMaster(e.value);
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
                            fetchMaterialNamesBoth(Accessdrop, e.value);
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
                    <Typography>Priority</Typography>

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
                {requiredFieldsMaster.length > 0 && (
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

                    <Grid item md={6} xs={12} sm={12} sx={{ marginTop: 2 }}>
                      <Grid container>
                        <Grid>
                          {isUserRoleCompare?.includes("excelraiseticket") && (
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
                          {isUserRoleCompare?.includes("printraiseticket") && (
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
                  {requiredFieldsMaster.length > 0 && (
                    <>
                      <Grid item md={12} xs={12} sm={12}>
                        <Typography>Required Fields</Typography>
                        <br></br>
                        <TableContainer>
                          <Table aria-label="customized table">
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
                                                row === "Sno"
                                                  ? "50px"
                                                  : "200px",
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
                                      <StyledTableCell
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >

                                        {item?.serialNumber}
                                      </StyledTableCell>
                                      <StyledTableCell
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <CopyClip name={item.name} />

                                      </StyledTableCell>
                                      {ans.map((row, index) => {
                                        return (
                                          <>
                                            <StyledTableCell key={index}>
                                              {[
                                                "Text Box-number",
                                                "Text Box-alpha",
                                                "Text Box-alphanumeric",
                                                "Text Box",
                                              ].includes(row?.options) &&
                                                row.raiser ? (
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
                                              ) : [
                                                "Date",
                                                "Date Multi Span",
                                                "Date Multi Random",
                                              ].includes(row?.options) &&
                                                row.raiser ? (
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  type="date"
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
                                              
                                                "Date Multi Span Time",
                                                "Date Multi Random Time",
                                              ].includes(row?.options) &&
                                                row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="date"
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
                                              ):
                                              [
                                                "DateTime"
                                              ].includes(row?.options) &&
                                                row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id={row._id}
                                                    type="date"
                                                  value={row?.value}
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
                                              
                                              
                                              
                                              : ["Time"].includes(
                                                row?.options
                                              ) && row.raiser ? (
                                                <>
                                                  <OutlinedInput
                                                    id="component-outlined"
                                                    type="time"
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
                                                  {(row?.files ===
                                                    undefined ||
                                                    row?.files?.length <
                                                    1) && (
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
                                              ) : <CopyClip name={
                                                fetchTableFieldValuesCheck(
                                                  row,
                                                  row?.options,
                                                  row?.details,
                                                  indexs,
                                                  index,
                                                  row?.namegen,
                                                  row._id
                                                )
                                              } />
                                              }
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
                              onClick={() =>
                                setPagemapCheck(totalPagesmapCheck)
                              }
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
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Description<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <ReactQuill
                      style={{ height: "180px" }}
                      value={textSumm}
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
                  <br /> <br />
                  <br />
                  <br></br>
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
                  <>
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
                            label: raiseTicketMaster.access,
                            value: raiseTicketMaster.access,
                          }}
                          onChange={(e) => {
                            setRaiseTicketMaster({
                              ...raiseTicketMaster,
                              access: e.value,
                              teamgroupname: "Please Select TeamGroup Name",
                              branchRaise: "Please Select Branch",
                              unitRaise: "Please Select Unit",
                              teamRaise: "Please Select Team",
                            });
                            setSelectedOptionsCate([]);
                            // setSelectedCompanyFrom([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>{" "}
              <br />
              {isUserRoleCompare.includes("lassignraiseticketuser") &&
                raiseTicketMaster.access === "Manual" ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
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
                            setSelectedOptionsCate([]);
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
                    <Grid item md={4} xs={12} sm={12}>
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
                            setAllBranchRaise(e.value);
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
                    SUBMIT
                  </LoadingButton>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
          <br />
        </>

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
                {/* {showDragField ? ( */}
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                  {previewURL && refImageDrag.length > 0 ? (
                    <>
                      {refImageDrag.map((file, index) => (
                        <>
                          <img
                            src={
                              file.type.startsWith("image/")
                                ? file.preview
                                : getFileIcon(file.name)
                            }
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
                    <Button component="label" color="info" variant="contained">
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
            <Button onClick={handleUploadPopupClose} variant="outlined">
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
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>
                          Category
                        </Typography>
                        <Typography>{raiseTicketMaster.category}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>
                          Sub-Category
                        </Typography>
                        <Typography>{raiseTicketMaster.subcategory}</Typography>
                      </FormControl>
                    </Grid>
                    {raiseTicketMaster.subsubcategory !==
                      "Please Select Sub Sub-category" && (
                        <Grid item md={2} xs={12} sm={12}>
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
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>Type</Typography>
                        <Typography>{typemaster}</Typography>
                      </FormControl>
                    </Grid>
                  </>

                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>Reason</Typography>
                      <Typography>{raiseTicketMaster.reason}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>
                        Check Points{" "}
                      </Typography>
                      {selfCheckPointMaster?.checkpointgrp?.map(
                        (data, index) => {
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
                        }
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={9} xs={12} sm={12}></Grid>
                  <Grid item md={12} sm={12} xs={12}></Grid>
                </Grid>
                <br />
                <br />
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
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
                          I am satisfied with the checkpoints; no need to raise
                          a ticket
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
      </Box>
    </>
  );
}

export default RaiseticketMaster;