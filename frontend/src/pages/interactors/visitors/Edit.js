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
  MenuItem,
  Select,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextareaAutosize,
  DialogTitle,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import {
  documentTypeOption,
  followUpActionOption,
} from "../../../components/Componentkeyword";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import Webcamimage from "../../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { FaTrash } from "react-icons/fa";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import PageHeading from "../../../components/PageHeading";

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

function EditVisitors() {
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
  const [vendor, setVendor] = useState({
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
  });
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    allUsersData,
    allTeam,
    allfloor,
    alldepartment,
    allareagrouping,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  useEffect(() => {
    fetchInteractorType();
    fetchInteractorMode();
  }, []);
  let ids = useParams().id;
  let page = useParams().form;
  //useEffect
  useEffect(() => {
    getinfoCode();
  }, [ids]);
  // get single row to view....
  const getinfoCode = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendor(res?.data?.svisitors);
      setRefImageedit(res?.data?.svisitors.files);
      setRefImageDragedit(res?.data?.svisitors.files);
      setCapturedImagesedit(res?.data?.svisitors.files);
      setAllUploadedFilesedit(res?.data?.svisitors.files);

      setValueCompanyCat(res?.data?.svisitors?.meetingpersoncompany);
      setSelectedOptionsCompany([
        ...res?.data?.svisitors?.meetingpersoncompany.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueBranchCat(res?.data?.svisitors?.meetingpersonbranch);

      fetchInteractorPurpose(res?.data?.svisitors?.visitortype);
      setSelectedOptionsBranch([
        ...res?.data?.svisitors?.meetingpersonbranch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueUnitCat(res?.data?.svisitors?.meetingpersonunit);
      setSelectedOptionsUnit([
        ...res?.data?.svisitors?.meetingpersonunit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueTeamCat(res?.data?.svisitors?.meetingpersonteam);
      setSelectedOptionsTeam([
        ...res?.data?.svisitors?.meetingpersonteam.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueDepartmentCat(res?.data?.svisitors?.meetingpersondepartment);
      setSelectedOptionsDepartment([
        ...res?.data?.svisitors?.meetingpersondepartment.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setValueCompanyLocationCat(res?.data?.svisitors?.meetinglocationcompany);
      setSelectedOptionsCompanyLocation([
        ...res?.data?.svisitors?.meetinglocationcompany.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueBranchLocationCat(res?.data?.svisitors?.meetinglocationbranch);
      setSelectedOptionsBranchLocation([
        ...res?.data?.svisitors?.meetinglocationbranch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueUnitLocationCat(res?.data?.svisitors?.meetinglocationunit);
      setSelectedOptionsUnitLocation([
        ...res?.data?.svisitors?.meetinglocationunit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setValueFloorLocationCat(res?.data?.svisitors?.meetinglocationfloor);
      setSelectedOptionsFloorLocation([
        ...res?.data?.svisitors?.meetinglocationfloor.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
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
  const handleDragOveredit = (event) => {};
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
  const getimgbillCode = async (valueimg) => {
    setGetImgbillcode(valueimg);
    handleImgcodeviewbill();
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    setVendor({ ...vendor, meetinglocationarea: "Please Select Area" });
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
    setVendor({ ...vendor, meetinglocationarea: "Please Select Area" });
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
    setVendor({ ...vendor, meetinglocationarea: "Please Select Area" });
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
    setVendor({ ...vendor, meetinglocationarea: "Please Select Area" });
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
  let updateby = vendor.updatedby;
  let allUploadedFiles = [];
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let addVendorDetails = await axios.put(
        `${SERVICE.SINGLE_VISITORS}/${ids}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(vendor.company),
          branch: String(vendor.branch),
          unit: String(vendor.unit),
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
          documentnumber: String(vendor.documentnumber),
          meetingdetails: Boolean(vendor.meetingdetails),
          meetingpersoncompany:
            vendor.meetingdetails === true ? [...valueCompanyCat] : [],
          meetingpersonbranch:
            vendor.meetingdetails === true ? [...valueBranchCat] : [],
          meetingpersonunit:
            vendor.meetingdetails === true ? [...valueUnitCat] : [],
          meetingpersondepartment:
            vendor.meetingdetails === true ? [...valueDepartmentCat] : [],
          meetingpersonteam:
            vendor.meetingdetails === true ? [...valueTeamCat] : [],
          meetingpersonemployeename: String(
            vendor.meetingdetails === true
              ? vendor.meetingpersonemployeename
              : ""
          ),
          meetinglocationcompany:
            vendor.meetingdetails === true ? [...valueCompanyLocationCat] : [],
          meetinglocationbranch:
            vendor.meetingdetails === true ? [...valueBranchLocationCat] : [],
          meetinglocationunit:
            vendor.meetingdetails === true ? [...valueUnitLocationCat] : [],
          meetinglocationfloor:
            vendor.meetingdetails === true ? [...valueFloorLocationCat] : [],
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
          followupaction: String(vendor.followupaction),
          followupdate: String(
            vendor.followupaction === "Required" ? vendor.followupdate : ""
          ),
          followuptime: String(
            vendor.followupaction === "Required" ? vendor.followuptime : ""
          ),
          visitorbadge: String(vendor.visitorbadge),
          visitorsurvey: String(vendor.visitorsurvey),
          detailsaddedy: String(vendor.detailsaddedy),
          files: resultArray,
          followuparray: [
            ...vendor.followuparray,
            {
              visitortype: String(vendor.visitortype),
              visitormode: String(vendor.visitormode),
              visitorpurpose: String(vendor.visitorpurpose),
              meetingdetails: Boolean(vendor.meetingdetails),
              intime: String(vendor.intime),

              meetingpersoncompany:
                vendor.meetingdetails === true ? [...valueCompanyCat] : [],
              meetingpersonbranch:
                vendor.meetingdetails === true ? [...valueBranchCat] : [],
              meetingpersonunit:
                vendor.meetingdetails === true ? [...valueUnitCat] : [],
              meetingpersondepartment:
                vendor.meetingdetails === true ? [...valueDepartmentCat] : [],
              meetingpersonteam:
                vendor.meetingdetails === true ? [...valueTeamCat] : [],
              meetingpersonemployeename: String(
                vendor.meetingdetails === true
                  ? vendor.meetingpersonemployeename
                  : ""
              ),

              meetinglocationcompany:
                vendor.meetingdetails === true
                  ? [...valueCompanyLocationCat]
                  : [],
              meetinglocationbranch:
                vendor.meetingdetails === true
                  ? [...valueBranchLocationCat]
                  : [],
              meetinglocationunit:
                vendor.meetingdetails === true ? [...valueUnitLocationCat] : [],
              meetinglocationfloor:
                vendor.meetingdetails === true
                  ? [...valueFloorLocationCat]
                  : [],
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
              followupaction: String(vendor.followupaction),
              followupdate: String(
                vendor.followupaction === "Required" ? vendor.followupdate : ""
              ),
              followuptime: String(
                vendor.followupaction === "Required" ? vendor.followuptime : ""
              ),
              visitorbadge: String(vendor.visitorbadge),
              visitorsurvey: String(vendor.visitorsurvey),
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
      );
      backPage(
        page === "allvisitor"
          ? "/interactor/allvisitorlist"
          : "/interactor/master/listvisitors"
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchVendor();
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
    const isNameMatch = resdata.some(
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
    if (
      vendor.company === "Please Select Company" ||
      vendor.company === "" ||
      vendor.company == "undefined"
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
      vendor.branch === "Please Select Branch" ||
      vendor.branch === "" ||
      vendor.branch == "undefined"
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
      vendor.unit === "Please Select Unit" ||
      vendor.unit === "" ||
      vendor.unit == "undefined"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.visitortype === "Please Select Visitor Type" ||
      vendor.visitortype === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Visitor Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.visitormode === "Please Select Visitor Mode" ||
      vendor.visitormode === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Visitor Mode"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.prefix === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Prefix"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.visitorname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Visitor Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.intime === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select IN Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.visitorpurpose === "Please Select Visitor Purpose" ||
      vendor.visitorpurpose === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Visitor Purpose"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.visitorcontactnumber === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Visitor Contact Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.visitorcontactnumber.length < 10) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Visitor Contact Number"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.visitoremail !== "" &&
      !validateEmail(vendor.visitoremail)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Visitor Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor.meetingdetails === true && valueCompanyCat?.length == 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Company"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (vendor.meetingdetails === true && valueBranchCat?.length == 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Branch"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (vendor.meetingdetails === true && valueUnitCat?.length == 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      valueDepartmentCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Department"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (vendor.meetingdetails === true && valueTeamCat?.length == 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Team"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      (vendor.meetingpersonemployeename === "Please Select Employee Name" ||
        vendor.meetingpersonemployeename === "")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Person Employee Name"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      valueCompanyLocationCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Location Company"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      valueBranchLocationCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Location Branch"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      valueUnitLocationCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Location Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      valueFloorLocationCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Location Floor"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.meetingdetails === true &&
      (vendor.meetinglocationarea === "Please Select Area" ||
        vendor.meetinglocationarea === "")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting-Location Area"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.escortinformation === true &&
      vendor.escortdetails === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Escort Details"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (vendor.outtime === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select OUT Time"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.followupaction === "Please Select Follow Up Action" ||
      vendor.followupaction === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Follow Up Action"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.followupaction === "Required" &&
      vendor.followupdate === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Follow Up Date"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      vendor.followupaction === "Required" &&
      vendor.followuptime === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Follow Up Time"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Visitor Details Already Exist!"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
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

      return res_vendor?.data?.visitors.filter((item) => item._id !== ids);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  return (
    <Box>
      <Headtitle title={"EDIT VISITORS"} />

      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Edit Visitor </Typography>
      <>
        {isUserRoleCompare?.includes("eaddvisitors") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Edit Visitor
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
                      options={isAssignBranch
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
                      options={isAssignBranch
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
                        });
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
                      options={isAssignBranch
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
                      IN Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      placeholder="HH:mm:AM/PM"
                      value={vendor.intime}
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
                    <Typography>Visitor Email</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="email"
                      value={vendor.visitoremail}
                      placeholder="Please Enter Visitor Email"
                      onChange={(e) => {
                        setVendor({ ...vendor, visitoremail: e.target.value });
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
                <Grid item md={6} xs={12} sm={12}>
                  <Typography>Photograph</Typography>
                  <Box sx={{ display: "flex", justifyContent: "left" }}>
                    <Button
                      variant="contained"
                      onClick={handleClickUploadPopupOpenedit}
                    >
                      Upload
                    </Button>
                  </Box>
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
                        label:
                          vendor.documenttype === ""
                            ? "Please Select Document Type"
                            : vendor.documenttype,
                        value:
                          vendor.documenttype === ""
                            ? "Please Select Document Type"
                            : vendor.documenttype,
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
                        setVendor({
                          ...vendor,
                          documentnumber: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={Boolean(vendor.meetingdetails)} />
                      }
                      onChange={(e) =>
                        setVendor({
                          ...vendor,
                          meetingdetails: !vendor.meetingdetails,
                        })
                      }
                      label="Meeting Details"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={9} xs={12} sm={12}></Grid>
                {vendor.meetingdetails && (
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
                              valueCompanyLocationCat?.includes(comp.company)
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
                                valueBranchLocationCat?.includes(comp.branch)
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
                          Area<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={[
                            ...new Set(
                              allareagrouping
                                .filter(
                                  (item) =>
                                    valueFloorLocationCat?.includes(
                                      item.floor
                                    ) &&
                                    valueBranchLocationCat?.includes(
                                      item.branch
                                    )
                                )
                                .flatMap((item) => item.area)
                            ),
                          ].map((location) => ({
                            label: location,
                            value: location,
                          }))}
                          placeholder="Please Select Area"
                          value={{
                            label: vendor.meetinglocationarea,
                            value: vendor.meetinglocationarea,
                          }}
                          onChange={(e) => {
                            setVendor({
                              ...vendor,
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
                        <Checkbox checked={Boolean(vendor.escortinformation)} />
                      }
                      onChange={(e) =>
                        setVendor({
                          ...vendor,
                          escortinformation: !vendor.escortinformation,
                        })
                      }
                      label="Escort Information"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={9} xs={12} sm={12}></Grid>
                {vendor.escortinformation && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Escort Details<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={vendor.escortdetails}
                          onChange={(e) => {
                            setVendor({
                              ...vendor,
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
                      value={vendor.equipmentborrowed}
                      placeholder="Please Enter Equipment Borrowed "
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
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
                      placeholder="HH:mm:AM/PM"
                      value={vendor.outtime}
                    />
                  </FormControl>
                </Grid>
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Visitor Badge / Pass Details</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.visitorbadge}
                      placeholder="Please Enter Visitor Badge / Pass Details"
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
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
                      value={vendor.visitorsurvey}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
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
                      value={vendor.detailsaddedy}
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
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={userStyle.buttonadd}
                    onClick={(e) => handleSubmit(e)}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
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
                    <Button sx={userStyle.btncancel}>Cancel</Button>
                  </Link>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
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
    </Box>
  );
}
export default EditVisitors;
