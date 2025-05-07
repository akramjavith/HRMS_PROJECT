import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TextareaAutosize, IconButton, Popover, Checkbox, TextField, List, ListItemText, ListItem, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThreeDots } from 'react-loader-spinner';
import Selects from "react-select";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import PageHeading from "../../components/PageHeading";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import { useParams } from "react-router-dom";

function Refercandidate() {
  const pathname = window.location.pathname;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
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

  let exportColumnNames = ['Refering for Job', 'Email Id', 'Mobile', 'Relationship', 'Knownperiod', 'Status', 'Refered By'];
  let exportRowValues = ['referingjob', 'emailid', 'mobile', 'relation', 'known', 'status', 'companyname']

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Refer a candidate"),
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


  const [refferal, setRefferal] = useState({
    referingjob: "", prefix: 'Mr', firstname: "",
    lastname: "", emailid: "", mobile: "", relation: "",
    known: "", notes: "",
    addedby: "",
    updatedby: "",
  });

  const [refferalEdit, setRefferaledit] = useState({
    referingjob: "", prefix: 'Mr', firstname: "",
    lastname: "", emailid: "", mobile: "", relationship: "",
    knownperiod: "", notes: "", files: ""
  });
  const [isBtn, setIsBtn] = useState(false);
  const [file, setFile] = useState("");
  const [refList, setReflist] = useState([]);
  const [jobopenening, setJobOpeing] = useState([]);
  const [allrefListEdit, setAllReflistEdit] = useState([]);
  const { isUserRoleCompare, isAssignBranch, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [relationship, setRelationship] = useState("Personally known")
  const [relationshipEdit, setRelationshipEdit] = useState("Personally known")
  const [knownperiod, setKnownperiod] = useState("Less than a year")
  const [knownperiodEdit, setKnownperiodEdit] = useState("Less than a year")
  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [referCheck, setRefercheck] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [fileEdit, setFilesEdit] = useState([]);


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



  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Refer a Candidate.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    referingjob: true,
    emailid: true,
    mobile: true,
    relation: true,
    known: true,
    resume: true,
    // files: true,
    status: true,
    companyname: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const ids = useParams().id;

  const getJobOpenings = async () => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setJobOpeing(res?.data?.sjobopening);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    getJobOpenings();
  }, [ids]);

  const handleMobileChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    inputValue = inputValue.slice(0, 10);
    setRefferal({
      ...refferal,
      mobile: inputValue,
    });
  };
  const handleMobileChangeEdit = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    inputValue = inputValue.slice(0, 10);
    setRefferaledit({
      ...refferalEdit,
      mobile: inputValue,
    });
  };

  const handleFileUpload = (event, index) => {
    const filesname = event.target.files;
    let newSelectedFiles = [...files];

    for (let i = 0; i < filesname.length; i++) {
      const file = filesname[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            preview: reader.result,
            base64: reader.result.split(',')[1]
            // index: indexData
          });
          setFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
        break;
      } else {
        setPopupContentMalert("Please Upload PDF File Only");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        break;
      }
    }
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleFileUploadEdit = (event, index) => {
    const filesname = event.target.files;
    let newSelectedFiles = [...fileEdit];

    for (let i = 0; i < filesname.length; i++) {
      const file = filesname[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            preview: reader.result,
            base64: reader.result.split(',')[1]
            // index: indexData
          });
          setFilesEdit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
        break;
      } else {
        setPopupContentMalert("Please Upload PDF File Only");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        break;
      }
    }
  };

  const handleFileDeleteEdit = (index) => {
    setFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //get single row to edit....    
  const fileData = async (id) => {
    try {

      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      renderFilePreview(res?.data?.srefercandidate.files[0]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get single row to edit....    
  const fileDataDownload = async (id) => {
    try {

      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setFile(res?.data?.srefercandidate.files);
      res?.data?.srefercandidate.files.forEach((file) => {
        const link = document.createElement('a');
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setDeleteproject(res?.data?.srefercandidate);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delRefer = async () => {
    try {
      await axios.delete(`${SERVICE.REFERCANDIDATE_SINGLE}/${projectid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      await fetchRefercandidate();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delRefercheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.REFERCANDIDATE_SINGLE}/${item}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchRefercandidate();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    setIsBtn(true)
    try {
      let refercreate = await axios.post(SERVICE.REFERCANDIDATE_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        referingjob: String(jobopenening.recruitmentname),
        status: String("Refered"),
        companyname: String(isUserRoleAccess.companyname),
        prefix: String(refferal.prefix),
        firstname: String(refferal.firstname),
        lastname: String(refferal.lastname),
        emailid: String(refferal.emailid),
        mobile: String(refferal.mobile),
        relation: String(relationship),
        known: String(knownperiod),
        notes: String(refferal.notes),
        files: [...files],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRefferal(refercreate.data);
      await fetchRefercandidate();
      setFiles([]);
      setRefferal({
        referingjob: "", prefix: 'Mr', firstname: "",
        lastname: "", emailid: "", mobile: "", relationship: "", knownperiod: "", files: "", notes: ""
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    const isNameMatch = refList.some((item) =>
      item.firstname.toLowerCase() === (refferal.firstname).toLowerCase()
      && item.lastname.toLowerCase() === (refferal.lastname).toLowerCase()
      && item.emailid === refferal.emailid
      && item.mobile === refferal.mobile
    );
    e.preventDefault();
    if (files.length < 1) {
      setPopupContentMalert("Please Upload Files");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (refferal.firstname === "") {
      setPopupContentMalert("Please Enter Firstname");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferal.lastname === "") {
      setPopupContentMalert("Please Enter Lastname");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferal.emailid === "") {
      setPopupContentMalert("Please Enter Email");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (refferal.emailid && !isValidEmail(refferal.emailid)) {
      setPopupContentMalert("Please Enter Valid Email");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferal.mobile === "") {
      setPopupContentMalert("Please Enter Mobile");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (refferal.mobile.length !== 10) {
      setPopupContentMalert("Please Enter a valid 10 digit Mobile Number");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (files.length < 1) {
      setPopupContentMalert("Please Upload Files");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFiles([]);
    setRelationship('Personally known');
    setKnownperiod('Less than a year');
    setRefferal({
      ...refferal,
      referingjob: "", prefix: 'Mr', firstname: "",
      lastname: "", emailid: "", mobile: "", relationship: "", knownperiod: "", files: "", notes: ""
    })
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    try {

      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setRefferaledit(res?.data?.srefercandidate);
      setRelationshipEdit(res?.data?.srefercandidate?.relation === "" ? "Personally known" : res?.data?.srefercandidate?.relation);
      setKnownperiodEdit(res?.data?.srefercandidate.known === "" ? "Less than a year" : res?.data?.srefercandidate.known);
      setFilesEdit(res?.data?.srefercandidate.files);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setRefferaledit(res?.data?.srefercandidate);
      handleClickOpenview();
    } catch (err) {
      console.log(err, 'err1');
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setRefferaledit(res?.data?.srefercandidate);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //Project updateby edit page...
  let updateby = refferalEdit.updatedby;
  let addedby = refferalEdit.addedby;
  let refsid = refferalEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.REFERCANDIDATE_SINGLE}/${refsid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        name: String(refferalEdit.name),
        referingjob: String(refferalEdit.referingjob),
        prefix: String(refferalEdit.prefix) === undefined ? "" : String(refferalEdit.prefix),
        firstname: String(refferalEdit.firstname),
        lastname: String(refferalEdit.lastname),
        emailid: String(refferalEdit.emailid),
        mobile: String(refferalEdit.mobile),
        relation: String(relationshipEdit),
        known: String(knownperiodEdit),
        notes: String(refferalEdit.notes) === undefined ? "" : String(refferalEdit.notes),
        files: [...fileEdit],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRefferaledit(res.data);
      await fetchRefercandidate(); fetchRefercandidateAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchRefercandidateAll();
    const isNameMatch = allrefListEdit.some((item) =>
      item.firstname.toLowerCase() === refferalEdit.firstname.toLowerCase() &&
      item.lastname.toLowerCase() === refferalEdit.lastname.toLowerCase() &&
      item.emailid === refferalEdit.emailid &&
      item.mobile === refferalEdit.mobile
    );
    if (fileEdit.length < 1) {
      setPopupContentMalert("Please Upload Files");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferalEdit.firstname === "") {
      setPopupContentMalert("Please Enter Firstname");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferalEdit.lastname === "") {
      setPopupContentMalert("Please Enter Lastname");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferalEdit.emailid === "") {
      setPopupContentMalert("Please Enter Email");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (refferalEdit.emailid && !isValidEmail(refferalEdit.emailid)) {
      setPopupContentMalert("Please Enter Valid Email");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (refferalEdit.mobile === "") {
      setPopupContentMalert("Please Enter Mobile");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (refferalEdit.mobile.length !== 10) {
      setPopupContentMalert("Please Enter a valid 10 digit Mobile Number");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };


  //get all refercandidate details.
  const fetchRefercandidate = async () => {
    setPageName(!pageName)

    try {
      let res_project = await axios.post(SERVICE.USERREFERCANDIDATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        companyname: isUserRoleAccess.companyname
      });

      setReflist(res_project?.data?.refercandidates.map((item, index) => ({ ...item, serialNumber: index + 1 })));
      setRefercheck(true);
    } catch (err) { setRefercheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all refercandidate details.
  const fetchRefercandidateAll = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.post(SERVICE.USERREFERCANDIDATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        companyname: isUserRoleAccess.companyname
      });
      setAllReflistEdit(res_project?.data?.refercandidates.filter((item) => item._id !== refferalEdit._id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Refercandidate",
    pageStyle: "print",
  });

  //serial no for listing items 
  const addSerialNumber = (datas) => {
    setItems(datas);
  }

  useEffect(() => {
    addSerialNumber(refList);
  }, [refList])

  useEffect(() => {
    fetchRefercandidate();
    fetchRefercandidateAll();
  }, [])
  useEffect(() => {
    fetchRefercandidateAll();
  }, [isEditOpen, refferalEdit])

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false)
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false)
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }
  const [selectAllChecked, setSelectAllChecked] = useState(false);

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
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "referingjob", headerName: "Refering for Job", flex: 0, width: 200, hide: !columnVisibility.referingjob, headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    { field: "emailid", headerName: "Emailid", flex: 0, width: 200, hide: !columnVisibility.emailid, headerClassName: "bold-header" },
    { field: "mobile", headerName: "Mobile", flex: 0, width: 200, hide: !columnVisibility.mobile, headerClassName: "bold-header" },
    { field: "relation", headerName: "Relationship", flex: 0, width: 200, hide: !columnVisibility.relation, headerClassName: "bold-header" },
    { field: "known", headerName: "Knownperiod", flex: 0, width: 200, hide: !columnVisibility.known, headerClassName: "bold-header" },
    {
      field: "resume",
      headerName: "Resume",
      flex: 0,
      width: 200,
      sortable: false,
      // hide: !columnVisibility.files,
      hide: !columnVisibility.resume,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => { fileData(params.data.id); }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}>
            View
          </a> &nbsp;&nbsp;
          <a
            style={{ minWidth: "0px", textDecoration: 'none', color: "#357AE8", cursor: "pointer" }}
            onClick={() => { fileDataDownload(params.data.id); }}
          >
            Download
          </a>
        </Grid>
      ),
    },
    { field: "status", headerName: "Status", flex: 0, width: 200, hide: !columnVisibility.status },
    { field: "companyname", headerName: "Refered By", flex: 0, width: 200, hide: !columnVisibility.companyname },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ereferacandidate") && (
            <Button sx={userStyle.buttonedit} onClick={() => { getCode(params.data.id, params.data.name); }} style={{ minWidth: "0px" }}>
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dreferacandidate") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vreferacandidate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferacandidate") && (
            <Button sx={userStyle.buttonview}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ]

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      referingjob: item.referingjob,
      emailid: item.emailid,
      mobile: item.mobile,
      relation: item.relation,
      known: item.known,
      resume: item.resume,
      status: item.status,
      companyname: item.companyname
    }
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {

    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
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
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              Hide All
            </Button>

          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  useEffect(
    () => {
      const beforeUnloadHandler = (event) => handleBeforeUnload(event);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, []);

  return (
    <Box>
      <Headtitle title={'REFER CANDIDATE'} />
      <PageHeading
        title="Refer a Candidate"
        modulename="Refer & Earn"
        submodulename="Refer a candidate"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <>
        <Box sx={userStyle.selectcontainer}>
          {isUserRoleCompare?.includes("areferacandidate")
            && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.HeaderText}>Add Refer a Candidate </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={8} sm={12} xs={12}>
                    <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                      <div> Upload Resume <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                      </div>
                      <input hidden type="file" multiple onChange={handleFileUpload} accept=" application/pdf, image/*" /><b style={{ color: "red" }}>*</b>
                    </Button>
                    </>
                  </Grid>
                  <>

                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px', }}>

                      {files?.length > 0 &&
                        (files.map((file, index) => (
                          <>
                            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                              <Grid item lg={6} md={6} sm={6} xs={6}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={2} md={2} sm={2} xs={2}>
                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                              </Grid>

                              <Grid item lg={2} md={2} sm={2} xs={2}>
                                <Button style={{ fontsize: "large", color: "#FF0000", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => handleFileDelete(index)} size="small"  ><CancelIcon /></Button>

                              </Grid>
                            </Grid>
                          </>
                        )))}
                    </Grid>
                  </>
                  <br />
                </Grid>

                <Grid container spacing={2}>

                  <Grid item md={3} xs={12} sm={12} >
                    {/* <Typography sx={userStyle.SubHeaderText} mb={1}><b> Job Recommendation </b></Typography> */}
                    <FormControl fullWidth size="small">
                      <Typography>Refering for Job</Typography>
                      <TextField
                        size="small"
                        value={jobopenening.recruitmentname}
                      />

                    </FormControl>
                  </Grid>
                </Grid><br />

                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}><b> Candidate Information</b></Typography>
                </Grid><br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Grid container >

                      <Grid item md={3} xs={12} sm={12}>
                        <Typography>Mr</Typography>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            placeholder="Mr."
                            value={refferal.prefix}
                            onChange={(e) => {
                              setRefferal({ ...refferal, prefix: e.target.value });
                            }}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Ms">Ms</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={9} xs={12} sm={12}>
                        <Typography>Firstname<b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={refferal.firstname}
                            onChange={(e) => {
                              setRefferal({
                                ...refferal,
                                firstname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>LastName<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={refferal.lastname}
                        onChange={(e) => {
                          setRefferal({
                            ...refferal,
                            lastname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Email Id<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="email"
                        value={refferal.emailid}
                        onChange={(e) => {
                          setRefferal({
                            ...refferal,
                            emailid: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Mobile<b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput
                        sx={userStyle.input}
                        id="component-outlined"
                        type="number"
                        value={refferal.mobile}
                        onChange={handleMobileChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid><br />
                <br />
                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}><b> Additional Information</b></Typography>
                </Grid><br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Relationship</Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Personally known"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={relationship}
                        onChange={(e) => {
                          setRelationship(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {/* <MenuItem value="Please Select Relationship" disabled> {"Please Select Relationship"} </MenuItem> */}
                        <MenuItem value="Personally known"> {"Personally known"} </MenuItem>
                        <MenuItem value="Former Colleague"> {"Former Colleague"} </MenuItem>
                        <MenuItem value="Socially Connected"> {"Socially Connected"} </MenuItem>
                        <MenuItem value="Got the resume through a common friend"> {"Got the resume through a common friend"} </MenuItem>
                        <MenuItem value="Others"> {"Others"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Known Period</Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Less than a year"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={knownperiod}
                        onChange={(e) => {
                          setKnownperiod(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {/* <MenuItem value="Please Select Knownperiod" disabled> {"Please Select Knownperiod"} </MenuItem> */}
                        <MenuItem value="Less than a year"> {"Less than a year"} </MenuItem>
                        <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                        <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                        <MenuItem value="5 years"> {"5 years"} </MenuItem>
                        <MenuItem value="More than 5 years"> {"More than 5 years"} </MenuItem>

                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Notes</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={refferal.notes}
                        onChange={(e) => { setRefferal({ ...refferal, notes: e.target.value }) }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} marginTop={4}>

                    <Grid container spacing={8} >
                      <Grid item md={4} xs={12} sm={6}>
                        <Button
                          variant="contained"
                          sx={buttonStyles.buttonsubmit}
                          onClick={handleSubmit}
                          disabled={isBtn}
                        >
                          Submit Refferal
                        </Button>
                      </Grid>
                      <Grid item md={4} xs={12} sm={6}>

                        <Button sx={buttonStyles.btncancel} onClick={handleClear} >
                          Clear
                        </Button>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid><br />

              </>
            )}
        </Box>
      </>
      {/* } */}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "47px" }}
        >
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Grid container spacing={2}>

                <Typography sx={userStyle.HeaderText}>
                  Edit Refer a Candidate
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <> <Button variant="outlined" component="label" style={{ justifyContent: "center !important" }}>
                    <div> Upload Resume <CloudUploadIcon sx={{ paddingTop: '5px' }} />
                    </div>
                    <input hidden type="file" multiple onChange={handleFileUploadEdit} accept=" application/pdf, image/*" /><b style={{ color: "red" }}>*</b>
                  </Button>
                  </>
                </Grid>
                <>

                  <Grid item lg={6} md={6} sm={12} xs={12} sx={{ padding: '10px', }}>

                    {fileEdit?.length > 0 &&
                      (fileEdit.map((file, index) => (
                        <>
                          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                              {/* <Button><VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px",  }} onClick={() => renderFilePreviewEdit(file)} /></Button> */}
                              <Button style={{ fontsize: "large", color: "#357AE8", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} size="small"  ><VisibilityOutlinedIcon /></Button>
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                              <Button style={{ fontsize: "large", color: "#FF0000", marginLeft: "60px", marginTop: "-20px", cursor: "pointer" }} onClick={() => handleFileDeleteEdit(index)} size="small"  ><CancelIcon /></Button>

                            </Grid>
                          </Grid>
                        </>
                      )))}
                  </Grid>
                </>
                <br />
              </Grid>


              <Grid item xs={12}>
                <Typography sx={userStyle.SubHeaderText}><b> Job Recommendation </b></Typography>
              </Grid><br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12} >
                  <FormControl fullWidth size="small" >
                    <Typography>Refering for Job</Typography>
                    <TextField
                      size="small"
                      value={refferalEdit.referingjob}
                    />
                  </FormControl>
                </Grid>
              </Grid><br />
              <Grid item xs={12}>
                <Typography sx={userStyle.SubHeaderText}><b> Candidate Information</b></Typography>
              </Grid><br />
              <Grid container spacing={2} >
                <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                  <Grid >
                    <Typography>Mr</Typography>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Mr."
                        value={refferalEdit.prefix}
                        onChange={(e) => {
                          setRefferaledit({ ...refferalEdit, prefix: e.target.value });
                        }}
                      >
                        <MenuItem value="Mr">Mr</MenuItem>
                        <MenuItem value="Ms">Ms</MenuItem>
                        <MenuItem value="Mrs">Mrs</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid >
                    <Typography>Firstname<b style={{ color: "red" }}>*</b></Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={refferalEdit.firstname}
                        onChange={(e) => {
                          setRefferaledit({
                            ...refferalEdit,
                            firstname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>LastName<b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={refferalEdit.lastname}
                      onChange={(e) => {
                        setRefferaledit({
                          ...refferalEdit,
                          lastname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Email Id<b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={refferalEdit.emailid}
                      onChange={(e) => {
                        setRefferaledit({
                          ...refferalEdit,
                          emailid: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Mobile<b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      sx={userStyle.input}
                      id="component-outlined"
                      type="number"
                      value={refferalEdit.mobile}
                      onChange={handleMobileChangeEdit}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={4} sm={{ display: 'none' }} xs={{ display: 'none' }}></Grid> */}
                <br />

              </Grid><br />
              <Grid item xs={12}>
                <Typography sx={userStyle.SubHeaderText}><b> Additional Information</b></Typography>
              </Grid><br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Relationship</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={relationshipEdit}
                      onChange={(e) => {
                        setRelationshipEdit(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {/* <MenuItem value="Please Select Relationship" disabled> {"Please Select Relationship"} </MenuItem> */}
                      <MenuItem value="Personally known"> {"Personally known"} </MenuItem>
                      <MenuItem value="Former Colleague"> {"Former Colleague"} </MenuItem>
                      <MenuItem value="Socially Connected"> {"Socially Connected"} </MenuItem>
                      <MenuItem value="Got the resume through a common friend"> {"Got the resume through a common friend"} </MenuItem>
                      <MenuItem value="Others"> {"Others"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Known Period</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={knownperiodEdit}
                      onChange={(e) => {
                        setKnownperiodEdit(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {/* <MenuItem value="Please Select Knownperiod" disabled> {"Please Select Knownperiod"} </MenuItem> */}
                      <MenuItem value="Less than a year"> {"Less than a year"} </MenuItem>
                      <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                      <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                      <MenuItem value="5 years"> {"5 years"} </MenuItem>
                      <MenuItem value="More than 5 years"> {"More than 5 years"} </MenuItem>

                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Notes</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={refferalEdit.notes}
                      onChange={(e) => { setRefferaledit({ ...refferalEdit, notes: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>

              </Grid><br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>  Update</Button>
                </Grid><br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}> Cancel </Button>
                </Grid>
              </Grid>
            </>
          </Box>

        </Dialog>
      </Box>
      <br />

      {isUserRoleCompare?.includes("lreferacandidate") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Refer a Candidate List</Typography>
            </Grid>

            <br />

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label >Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(refList?.length)}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("excelreferacandidate") && (
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
                  {isUserRoleCompare?.includes("csvreferacandidate") && (
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
                  {isUserRoleCompare?.includes("printreferacandidate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfreferacandidate") && (
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
                  {isUserRoleCompare?.includes("imagereferacandidate") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>)}
                </Box >
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={refList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={refList}
                />
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            <br />
            {!referCheck ?
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
              :
              <>
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
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
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={refList}
                    />
                  </>

                </Box>

              </>}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "47px" }}
      >
        <Box sx={{ width: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Refer a Candidate</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"><b> Job Recommendation </b></Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Refering for job</Typography>
                  <Typography>{refferalEdit.referingjob}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"><b> Candidate Information</b></Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item md={0.5} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Mr</Typography>
                      <Typography>{refferalEdit.prefix}</Typography>
                      {/* <Typography>{refferalEdit.prefix ? undefined : ""}</Typography> */}
                    </FormControl>

                  </Grid>
                  <Grid item md={2.5} xs={12} sm={12} >
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Firstname</Typography>
                      <Typography>{refferalEdit.firstname}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> LastName</Typography>
                      <Typography>{refferalEdit.lastname}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Email Id</Typography>
                      <Typography>{refferalEdit.emailid}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Mobile</Typography>
                      <Typography>{refferalEdit.mobile}</Typography>
                    </FormControl>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"><b> Additional Information</b></Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Relationship</Typography>
                      <Typography>{refferalEdit.relation}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Known Period</Typography>
                      <Typography>{refferalEdit.known}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Notes</Typography>
                      <Typography>{refferalEdit.notes}</Typography>
                    </FormControl>
                  </Grid>
                </Grid>
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
            <Button variant="contained" style={{
              padding: '7px 13px',
              color: 'white',
              background: 'rgb(25, 118, 210)'
            }} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        itemsTwo={refList ?? []}
        filename={"Refer a Candidate"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Refer a Candidate Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delRefer}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delRefercheckbox}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />


    </Box>
  );
}

export default Refercandidate;