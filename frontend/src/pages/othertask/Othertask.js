import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";


function Manageothertask() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const [TextEditor, setTextEditor] = useState("");
  //state to handle holiday values
  const [manageothertask, setManageothertask] = useState({
    project: "Please Select Project",
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    total: "",
    date: formattedDate,
    time: "",
    assignedby: "Please Select Assigned by",
    assignedmode: "Please Select Assigned Mode",
    ticket: "",
    duedate: "",
    duetime: "",
    estimation: "Please Select Estimation",
    estimationtime: "",
    orate: 0,
    mrate: 0,
    flagcount: 1,
    points: "0.0000",
    conversion: "8.333333333333333",
  });
  const [documentFiles, setdocumentFiles] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);
  const [subcategoryOption, setSubcategoryOption] = useState([]);
  const [projectOpt, setProjectopt] = useState([]);
  const [assignedmodeOpt, setAssignedmodeopt] = useState([]);
  const [assignedbyOpt, setAssignedbyopt] = useState([]);
  const [projectOptEdit, setProjectoptEdit] = useState([]);
  const [assignedmodeOptEdit, setAssignedmodeoptEdit] = useState([]);
  const [assignedbyOptEdit, setAssignedbyoptEdit] = useState([]);
  const [manageothertasks, setManageothertasks] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(true);
  //Datatable
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [deleteHoliday, setDeleteHoliday] = useState({});
  const [items, setItems] = useState([]);
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFiles((prevFiles) => [
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
  const handleTextSummary = (value) => {
    setTextEditor(value);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        ...res_category?.data?.projmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProjectopt(companyall);
      setProjectoptEdit(companyall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchAssignedmode = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.MANAGEASSIGNEDMODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const assignall = [
        ...res_category?.data?.manageassignedmode.map((d) => ({
          ...d,
          label: d.manageassignedname,
          value: d.manageassignedname,
        })),
      ];
      setAssignedmodeopt(assignall);
      setAssignedmodeoptEdit(assignall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchAssignedby = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.ASSIGNEDBY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const assinedbyall = [
        ...res_category?.data?.assignedby.map((d) => ({
          ...d,
          label: d.assignedname,
          value: d.assignedname,
        })),
      ];
      setAssignedbyopt(assinedbyall);
      setAssignedbyoptEdit(assinedbyall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchCategoryDropdowns = async (e) => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_project.data.categoryprod.filter(
        (d) => d.project === e.value)
      
      const catall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setCategoryOption(catall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchSubcategoryDropdowns = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res.data.subcategoryprod.filter(
        (d) => d.categoryname === e.value)
      
      const subcatealls = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setSubcategoryOption(subcatealls);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchProjectDropdowns();
    fetchAssignedmode();
    fetchAssignedby();
  }, []);
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [isBtn, setIsBtn] = useState(false)
  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let statusCreate = await axios.post(SERVICE.MANAGEOTHERTASK_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(manageothertask.project),
        category: String(manageothertask.category),
        subcategory: String(manageothertask.subcategory),
        total: String(manageothertask.total),
        date: String(manageothertask.date),
        time: String(manageothertask.time),
        assignedby: String(manageothertask.assignedby),
        assignedmode: String(manageothertask.assignedmode),
        ticket: String(manageothertask.ticket),
        document: [...documentFiles],
        documentstext: TextEditor,
        duedate: String(manageothertask.duedate),
        duetime: String(manageothertask.duetime),
        estimation: String(manageothertask.estimation),
        estimationtime: String(manageothertask.estimationtime),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchMangeothertaskArray();
      setManageothertask({
        ...manageothertask,
        total: "",
        time: "",
        ticket: "",
        duedate: "",
        duetime: "",
        estimationtime: "",
      });
      setTextEditor("");
      setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setIsBtn(false);
        setPopupContentMalert(err.response.data.message);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        setIsBtn(false);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };
  const handleEstimationChange = (estimation) => {
    if (
      // manageothertask.estimationtime !== "" &&
      manageothertask.time !== "" &&
      manageothertask.date !== ""
    ) {
      if (estimation === "Days") {
        const estDate = new Date(manageothertask.date);
        estDate.setDate(
          estDate.getDate() + Number(manageothertask.estimationtime)
        );
        setManageothertask({
          ...manageothertask,
          estimation: estimation,
          duedate: moment(estDate).format("YYYY-MM-DD"),
          duetime: manageothertask.time,
        });
      } else if (estimation === "Hours") {
        const [hours, minutes] = manageothertask.time.split(":").map(Number);
        let newHours = hours + Number(manageothertask.estimationtime);
        let newDate = new Date(manageothertask.date);
        if (newHours >= 24) {
          newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
          newHours %= 24;
        }
        setManageothertask({
          ...manageothertask,
          estimation: estimation,
          duedate: moment(newDate).format("YYYY-MM-DD"),
          duetime: `${newHours < 10 ? "0" : ""}${newHours}:${minutes < 10 ? "0" : ""
            }${minutes}`,
        });
      } else if (estimation === "Minutes") {
        const [hours, minutes] = manageothertask.time.split(":").map(Number);
        let newMinutes = minutes + Number(manageothertask.estimationtime);
        let addedHours = Math.floor(newMinutes / 60);
        let adjustedMinutes = newMinutes % 60;
        let newHours = hours + addedHours;
        let newDate = new Date(manageothertask.date);
        if (newHours >= 24) {
          newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
          newHours %= 24;
        }
        setManageothertask({
          ...manageothertask,
          estimation: estimation,
          duedate: moment(newDate).format("YYYY-MM-DD"),
          duetime: `${newHours < 10 ? "0" : ""}${newHours}:${adjustedMinutes < 10 ? "0" : ""
            }${adjustedMinutes}`,
        });
      }
    }
  };
  const handleEstimationTimeChange = (estTime) => {
    const regex = /^\d*\.?\d*$/;
    if (
      (manageothertask.estimation !== "Please Select Estimation" &&
        manageothertask.time !== "" &&
        manageothertask.date !== "" &&
        regex.test(estTime)) ||
      estTime === ""
    ) {
      if (manageothertask.estimation === "Days") {
        const estDate = new Date(manageothertask.date);
        estDate.setDate(estDate.getDate() + Number(estTime));
        setManageothertask({
          ...manageothertask,
          estimationtime: estTime,
          duedate: moment(estDate).format("YYYY-MM-DD"),
          duetime: manageothertask.time,
        });
      } else if (manageothertask.estimation === "Hours") {
        const [hours, minutes] = manageothertask.time.split(":").map(Number);
        let newHours = hours + Number(estTime);
        let newDate = new Date(manageothertask.date);
        if (newHours >= 24) {
          newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
          newHours %= 24;
        }
        setManageothertask({
          ...manageothertask,
          estimationtime: estTime,
          duedate: moment(newDate).format("YYYY-MM-DD"),
          duetime: `${newHours < 10 ? "0" : ""}${newHours}:${minutes < 10 ? "0" : ""
            }${minutes}`,
        });
      } else if (manageothertask.estimation === "Minutes") {
        const [hours, minutes] = manageothertask.time.split(":").map(Number);
        let newMinutes = minutes + Number(estTime);
        let addedHours = Math.floor(newMinutes / 60);
        let adjustedMinutes = newMinutes % 60;
        let newHours = hours + addedHours;
        let newDate = new Date(manageothertask.date);
        if (newHours >= 24) {
          newDate.setDate(newDate.getDate() + Math.floor(newHours / 24));
          newHours %= 24;
        }
        setManageothertask({
          ...manageothertask,
          estimationtime: estTime,
          duedate: moment(newDate).format("YYYY-MM-DD"),
          duetime: `${newHours < 10 ? "0" : ""}${newHours}:${adjustedMinutes < 10 ? "0" : ""
            }${adjustedMinutes}`,
        });
      }
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = manageothertasks.some(
      (item) =>
        item.project?.toLowerCase() == manageothertask.project?.toLowerCase() &&
        item.category?.toLowerCase() == manageothertask.category?.toLowerCase() &&
        item.subcategory?.toLowerCase() == manageothertask.subcategory?.toLowerCase() &&
        item.date?.toLowerCase() == manageothertask.date?.toLowerCase() &&
        item.time?.toLowerCase() == manageothertask.time?.toLowerCase() &&
        // item.duedate?.toLowerCase() == manageothertask.duedate?.toLowerCase() &&
        item.duetime?.toLowerCase() == manageothertask.duetime?.toLowerCase() &&
        item.estimation?.toLowerCase() == manageothertask.estimation?.toLowerCase() &&
        item.estimationtime?.toLowerCase() == manageothertask.estimationtime?.toLowerCase() &&
        item.assignedby?.toLowerCase() == manageothertask.assignedby?.toLowerCase() &&
        item.assignedmode?.toLowerCase() == manageothertask.assignedmode?.toLowerCase() &&
        item.total?.toLowerCase() == manageothertask.total?.toLowerCase()
      // && item.ticket == manageothertask.ticket
    );
    if (manageothertask.project === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.subcategory === "Please Select SubCategory") {
      setPopupContentMalert("Please Select SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.total === "") {
      setPopupContentMalert("Please Enter Total");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.time === "") {
      setPopupContentMalert("Please Enter Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.assignedby === "Please Select Assigned by") {
      setPopupContentMalert("Please Select Assigned by");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.assignedmode === "Please Select Assigned Mode") {
      setPopupContentMalert("Please Select Assigned Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (manageothertask.estimation === "Please Select Estimation") {
      setPopupContentMalert("Please Select Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (manageothertask.estimationtime === "") {
      setPopupContentMalert("Please Select Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      manageothertask.estimation != "Immediate" &&
      manageothertask.estimationtime === ""
    ) {
      setPopupContentMalert("Please Select Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      manageothertask.estimationtime <= 0 &&
      manageothertask.estimation == "Hours"
    ) {
      setPopupContentMalert("Please Enter a Valid Estimation ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      manageothertask.estimationtime <= 0 &&
      manageothertask.estimation == "Minutes"
    ) {
      setPopupContentMalert("Please Enter a Valid Estimation ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      manageothertask.estimationtime <= 0 &&
      manageothertask.estimation == "Days"
    ) {
      setPopupContentMalert("Please Enter a Valid Estimation ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setManageothertask({
      project: "Please Select Project",
      category: "Please Select Category",
      subcategory: "Please Select SubCategory",
      total: "",
      date: formattedDate,
      time: "",
      assignedby: "Please Select Assigned by",
      assignedmode: "Please Select Assigned Mode",
      ticket: "",
      duedate: "",
      duetime: "",
      estimation: "Please Select Estimation",
      estimationtime: "",
    });
    setTextEditor("");
    setdocumentFiles([]);
    setCategoryOption([]);
    setSubcategoryOption([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const [manageothertasksArray, setManageothertasksArray] = useState([])
  const fetchMangeothertaskArray = async () => {
    setPageName(!pageName)
    try {
      let res_status = await axios.get(SERVICE.MANAGEOTHERTASK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManageothertasks(res_status?.data?.manageothertasks);
      setManageothertasksArray(res_status?.data?.manageothertasks?.map((t, index) => ({
        ...t,
        Sno: index + 1,
        project: t.project,
        category: t.category,
        subcategory: t.subcategory,
        total: t.total,
        date: moment(t.date).format("DD-MM-YYYY"),
        time: moment(
          `${new Date().toDateString()} ${t.time}`,
          "ddd MMM DD YYYY HH:mm"
        ).format("hh:mm:ss A"),
        duedate: moment(t.duedate).format("DD-MM-YYYY"),
        duetime: moment(
          `${new Date().toDateString()} ${t.duetime}`,
          "ddd MMM DD YYYY HH:mm"
        ).format("hh:mm:ss A"),
        estimation: t.estimation,
        estimationtime: t.estimationtime,
      })))
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchMangeothertaskArray()
  }, [isFilterOpen])
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = manageothertasks?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    fetchMangeothertaskArray();
  }, []);
  useEffect(() => {
    addSerialNumber();
  }, [manageothertasks]);
  const estimateopt = [
    { label: "Minutes", value: "Minutes" },
    { label: "Hours", value: "Hours" },
    { label: "Days", value: "Days" },
    // { label: "Immediate", value: "Immediate" },
  ];

  const handleChangemrate = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setManageothertask({ ...manageothertask, mrate: inputValue });
    }
  };

  const handleChangeorate = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setManageothertask({ ...manageothertask, flagcount: 1, orate: inputValue, mrate: inputValue, points: (inputValue / manageothertask.conversion).toFixed(4) });
    }
  };



  return (
    <Box>
      <Headtitle title={"Manage Other Task"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Other Task"
        modulename="Other Tasks"
        submodulename="Other Task"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {!statusCheck ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
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
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("aothertask") && (
            <Box sx={userStyle.selectcontainer}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      Add Other Task
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Project <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={projectOpt}
                        styles={colourStyles}
                        value={{
                          label: manageothertask.project,
                          value: manageothertask.project,
                        }}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            project: e.value,
                            category: "Please Select Category",
                            subcategory: "Please Select SubCategory",
                          });
                          setSubcategoryOption([]);
                          fetchCategoryDropdowns(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={categoryOption}
                        styles={colourStyles}
                        value={{
                          label: manageothertask.category,
                          value: manageothertask.category,
                        }}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            category: e.value,
                            subcategory: "Please Select SubCategory",
                          });
                          fetchSubcategoryDropdowns(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={subcategoryOption}
                        styles={colourStyles}
                        value={{
                          label: manageothertask.subcategory,
                          value: manageothertask.subcategory,
                        }}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            subcategory: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Total<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Total"
                        value={manageothertask.total}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            total: e.target.value,
                          });
                        }}
                      />
                      {/* <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={manageothertask.total} onChange={handleChangeflagcount} /> */}

                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <Grid container sx={{ display: "flex" }}>
                      <Grid item md={6} sm={3} xs={3}>
                        <Typography>
                          Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={manageothertask.date}
                            onChange={(e) => {
                              setManageothertask({
                                ...manageothertask,
                                date: e.target.value,
                                estimation: "Please Select Estimation",
                                estimationtime: "",
                                duedate: "",
                                duetime: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} sm={9} xs={9}>
                        <Typography>
                          Time<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="time"
                            value={manageothertask.time}
                            onChange={(e) => {
                              setManageothertask({
                                ...manageothertask,
                                time: e.target.value,
                                estimation: "Please Select Estimation",
                                estimationtime: "",
                                duedate: "",
                                duetime: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Assigned by <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={assignedbyOpt}
                        styles={colourStyles}
                        value={{
                          label: manageothertask.assignedby,
                          value: manageothertask.assignedby,
                        }}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            assignedby: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Assigned Mode <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={assignedmodeOpt}
                        styles={colourStyles}
                        value={{
                          label: manageothertask.assignedmode,
                          value: manageothertask.assignedmode,
                        }}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            assignedmode: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Ticket</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Ticket"
                        value={manageothertask.ticket}
                        onChange={(e) => {
                          setManageothertask({
                            ...manageothertask,
                            ticket: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Estimation <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={estimateopt}
                      styles={colourStyles}
                      value={{
                        label: manageothertask.estimation,
                        value: manageothertask.estimation,
                      }}
                      onChange={(e) => {
                        handleEstimationChange(e.value);
                      }}
                    />
                  </Grid>
                  <br />
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Estimation Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Enter Time"
                        value={manageothertask.estimationtime}
                        onChange={(e) => {
                          // handleChangephonenumber(e);
                          handleEstimationTimeChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <Grid container sx={{ display: "flex" }}>
                      <Grid item md={6} sm={3} xs={3}>
                        <Typography>
                          Due Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={manageothertask.duedate}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} sm={9} xs={9}>
                        <Typography>
                          Due Time<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="time"
                            value={manageothertask.duetime}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={6} md={5} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        <b> Documents </b>{" "}
                      </Typography>
                      <br />
                      <ReactQuill
                        style={{ height: "auto" }}
                        value={TextEditor}
                        onChange={(e) => {
                          handleTextSummary(e);
                        }}
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
                  </Grid>
                  <Grid item lg={0.5} md={0.5} sm={12} xs={12}>
                    {/* <Typography sx={{ marginTop: '93px' }}><b>(or)</b></Typography> */}
                  </Grid>
                  <Grid item lg={4.5} md={2.5} sm={12} xs={12}>
                    <Typography>
                      <b>Upload Document</b>
                    </Typography>
                    <Grid>
                      <Button
                        variant="contained"
                        size="small"
                        component="label"
                        sx={{
                          "@media only screen and (max-width:550px)": {
                            marginY: "5px",
                          },
                          marginTop: "15px",
                        }}
                      >
                        Upload
                        <input
                          multiple
                          type="file"
                          id="resume"
                          accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                          name="file"
                          hidden
                          onChange={(e) => {
                            handleResumeUpload(e);
                          }}
                        />
                      </Button>
                      <br />
                      <br />
                      {documentFiles?.length > 0 &&
                        documentFiles.map((file, index) => (
                          <>
                            <Grid container spacing={2}>
                              <Grid item lg={10} md={10} sm={6} xs={6}>
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
                                  onClick={() => handleFileDelete(index)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <br />
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button variant="contained" onClick={handleSubmit} disabled={isBtn}>
                      SAVE
                    </Button>
                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
          )}
          <br />
        </>
      )}
      {/* ****** Table Start ****** */}
      {/* ****** Table End ****** */}
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
    </Box>
  );
}
export default Manageothertask;