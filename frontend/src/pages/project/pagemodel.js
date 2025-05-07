import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import StyledDataGrid from "../../components/TableStyle";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select"; 
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function PageModel() {
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

  let exportColumnNames = ['Project', 'Subproject', 'Module', 'Submodule', 'Page Type', 'Main Page', 'Sub Page', 'Name', 'Estimation Time'];
  let exportRowValues = ['project', 'subproject', 'module', 'submodule', 'pagetype', 'mainpage', 'subpage', 'name', 'estimationtime']

  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [project, setProject] = useState([]);
  const [subproject, setSubProject] = useState([]);
  const [projectEdit, setProjectEdit] = useState([]);
  const [module, setModule] = useState([]);
  const [submodule, setSubModule] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [submoduleid, setSubmoduleid] = useState({ name: "", project: "", subproject: "", module: "", estimation: "", estimationtime: "" });
  const [getrowid, setRowGetid] = useState("");
  const [timeCalculation, setTimeCalculation] = useState("");
  const [timeDiffCal, setTimeDiffCal] = useState("");
  const [typeEst, setTypeEst] = useState("");
  const [rowEditTime, setRowEditTime] = useState("");
  const [rowEditTimeProj, setRowEditTimeProj] = useState("");
  const [editTimeCalculation, setEditTimeCalculation] = useState("");
  const [editCalOverall, setEditCalOverall] = useState("");
  const [getEstitype, setGetEstiType] = useState("");
  const [conditionTiming, setConditionTiming] = useState("");
  const [moduleEditList, setModuleEditList] = useState([]);
  const [submodulecheck, setsubmodulecheck] = useState(false);
  const [mainPageDropName, setMainPageDropName] = useState("");
  const [subPageDropName, setSubPageDropName] = useState("");
  const [subSubPageDropName, setSubSubPageDropName] = useState("");
  const [estimationType, setEstimationType] = useState("");
  const [estimationTime, setEstimationTime] = useState("");
  const [allSubmoduleedit, setAllSubmoduleedit] = useState([]);
  const [pageTypes, setPageTypes] = useState("");
  const [selectedOptProject, setSelectedOptProject] = useState({ value: "", label: "Please Select Project Name" });
  const [selectedOptSubProject, setSelectedOptSubProject] = useState({ value: " ", label: "Please Select SubProject Name" });
  const [selectedOptModule, setSelectedOptModule] = useState({ value: "", label: "Please Select Module Name" });
  const [selectedOptSubModule, setSelectedOptSubModule] = useState({ value: "", label: "Please Select SubModule Name" });
  const [selectedpageType, setSelectedpageType] = useState({ value: "", label: "Please Select PageType" });
  const [selectedpageTypeMain, setSelectedpageTypeMain] = useState({ value: "", label: "Please select Main Page" });
  const [selectedpageTypeSubPage, setSelectedpageTypeSubPage] = useState({ value: "", label: "Please select Sub Page" });
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Page Model"),
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

  const gridRefTableImg = useRef(null);
  // image
 const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Page Model.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    // setSelectedData([])
  };

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

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    // setTodoseditdelete([]);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
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

  const getRowClassName = (params) => {
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    subproject: true,
    module: true,
    submodule: true,
    pagetype: true,
    mainpage: true,
    subpage: true,
    name: true,
    estimationtime: true,
    estimateTime: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //set function to get particular row
  const [deletePageModel, setDeletePageModel] = useState({});
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletePageModel(res?.data?.spagemodel);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all modules.
  const fetchAllSubModule = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setsubmodulecheck(true);
      setSubmodules(res_module?.data?.submodules);
      setAllSubmoduleedit(res_module?.data?.submodules.filter((item) => item._id !== submoduleid._id));
    } catch (err) { setsubmodulecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let pagemodelid = deletePageModel._id;
  const delPageModel = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.delete(`${SERVICE.PAGEMODEL_SINGLE}/${pagemodelid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchprojectModelsDropdwon();
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setProject(
        res_project?.data?.projects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
      setProjectEdit(
        res_project?.data?.projects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [projectModels, setProjectModels] = useState([]);
  //fetching Project for Dropdowns
  const fetchprojectModelsDropdwon = async () => {
    setPageName(!pageName);    
      try {
        let res_project = await axios.get(SERVICE.PAGEMODEL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setProjectModels(res_project?.data?.pagemodel.map((item, index) => ({
          ...item, serialNumber: index + 1,
          project: item.project,
          subproject: item.subproject,
          module: item.module,
          submodule: item.submodule,
          pagetype: item.pagetype,
          mainpage: item.mainpage === "" ? "---" : item.mainpage,
          subpage: item.subpage === "" ? "---" : item.subpage,
          name: item.name,
          estimationtime: item.estimationtime + "-" + item.estimationtype,
        })));
      } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }    
  };

  //fetching sub-Project Dropdowns
  const fetchSubProjectDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let subPro = await axios.post(SERVICE.SUBPROJECTS_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: e,
      });

      setSubProject(
        subPro?.data?.subprojects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Module Dropdowns
  const fetchModuleDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.post(SERVICE.MODULES_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedOptProject.value,
        subproject: e,
      });
      setModule(
        dropModule?.data?.modules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Module Dropdowns
  const fetchsubModuleDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.post(SERVICE.SUBMODULES_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedOptProject.value,
        subproject: selectedOptSubProject.value,
        modulename: e,
      });
      setSubModule(
        dropModule?.data?.submodules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [getProjectName, setGetProjectName] = useState("");
  const [getSubProjectName, setGetSubProjectName] = useState("");
  const [getModuleName, setGetModuleName] = useState("");
  const [getSubModuleName, setGetSubModuleName] = useState("");

  const [mainpageTypeDropdown, setMainpageTypeDropdown] = useState([]);
  const [subpageTypeDropdown, setSubpageTypeDropdown] = useState([]);
  const [mainpageEstimaionTime, setmainpageEstimaionTime] = useState("");

  //fetching Main Page Dropdowns
  const fetchPagetypeMainDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_MAIN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: getProjectName,
        subproject: getSubProjectName,
        module: getModuleName,
        submodule: getSubModuleName,
        pagetype: e.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : e.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE",
      });

      setMainpageTypeDropdown(
        res?.data?.pagetypemain?.map((d) => ({
          ...d,
          label: d.mainpage,
          value: d.mainpage,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUBPAGE_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: getProjectName,
        subproject: getSubProjectName,
        module: getModuleName,
        submodule: getSubModuleName,
        pagetype: selectedpageType.value.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : selectedpageType.value.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE",
        mainpage: e,
      });
      setSubpageTypeDropdown(
        res?.data?.pagetypesub?.map((d) => ({
          ...d,
          label: d.subpage,
          value: d.subpage,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Module Dropdowns
  const fetchPageTypeMainEstimationTime = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_MAIN_EST_TIME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        pagetypemain: e,
      });

      setmainpageEstimaionTime(res?.data?.pagetypemainEst?.estimationtime);
      setmainpageEstimaionTime(res?.data?.pagetypemainEst?.estimationtype);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Pagetypes Dropdowns
  const fetchpageTypes = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PAGETYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let allMainpages = res_project.data.pagetypes[0]?.allmainpages;
      let MainPagesType = [...new Set(allMainpages?.map((data) => data.label))];
      let allSubPages = res_project.data.pagetypes[0]?.allsubpages;
      let allsubSubPages = res_project.data.pagetypes[0]?.allsubsubpages;
      let allPages = [...allMainpages, ...allSubPages, ...allsubSubPages];

      setPageTypes(
        allPages?.map((d) => ({
          ...d,
          label: d.label + "-" + d.Sno,
          value: d.label + "-" + d.Sno,
        }))
      );
      setpageTypesEdit(
        allPages?.map((d) => ({
          ...d,
          label: d.label + "-" + d.Sno,
          value: d.label + "-" + d.Sno,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Project for Dropdowns
  const fetchModuleEditDropDown = async () => {
    setPageName(!pageName);
    try {
      let projectDrop = await axios.get(SERVICE.MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModuleEditList(projectDrop?.data?.modules);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [pageBranch, setPageBranch] = useState("");
  const [pageBranchEdit, setPageBranchEdit] = useState("");

  const [pagemodels, setPageModels] = useState([]);
  //add function...
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let areas = await axios.post(SERVICE.PAGEMODEL_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedOptProject.value),
        subproject: String(selectedOptSubProject.value),
        module: String(selectedOptModule.value),
        submodule: String(selectedOptSubModule.value),
        pagetypename: selectedpageType.value.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : selectedpageType.value.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE",
        pagetype: String(selectedpageType.value),
        mainpage: selectedpageType.value.split("-")[0] === "MAINPAGE" ? mainPageDropName : String(selectedpageTypeMain.value),
        subpage: selectedpageType.value.split("-")[0] === "SUBPAGE" ? subPageDropName : String(selectedpageTypeSubPage.value),
        name: subSubPageDropName,
        estimationtype: String(estimationType),
        estimationtime: String(estimationTime),

        pageBranch: pageBranch,
        addedby: [
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });
      setPageModels(areas);
      setSelectedOptProject({ value: "", label: "Please Select Project Name" });
      setSelectedOptSubProject({ value: "", label: "Please Select SubProject Name" });
      setSelectedOptModule({ value: "", label: "Please Select Module Name" });
      setSelectedOptSubModule({ value: "", label: "Please Select SubModule Name" });
      setSelectedpageType({ value: "", label: "Please Select PageType" });
      setSelectedpageTypeMain({ value: "", label: "Please select Main Page" });
      setSelectedpageTypeSubPage({ value: "", label: "Please select Sub Page" });
      setMainPageDropName("");
      setSubPageDropName("");
      setSubSubPageDropName("");
      setEstimationType("");
      setEstimationTime("");
      setPageBranch("");
      await fetchprojectModelsDropdwon();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //Save and Add Another function...
  const sendRequestSaveAnother = async () => {
    setPageName(!pageName);
    try {
      let areas = await axios.post(SERVICE.PAGEMODEL_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedOptProject.value),
        subproject: String(selectedOptSubProject.value),
        module: String(selectedOptModule.value),
        submodule: String(selectedOptSubModule.value),
        pagetypename: selectedpageType.value.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : selectedpageType.value.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE",
        pagetype: String(selectedpageType.value),
        mainpage: selectedpageType.value.split("-")[0] === "MAINPAGE" ? mainPageDropName : String(selectedpageTypeMain.value),
        subpage: selectedpageType.value.split("-")[0] === "SUBPAGE" ? subPageDropName : String(selectedpageTypeSubPage.value),
        name: subSubPageDropName,
        estimationtype: String(estimationType),
        estimationtime: String(estimationTime),

        pageBranch: pageBranch,
        addedby: [
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });
      setPageModels(areas);
      // setSelectedOptProject({value:"", label : "Please Select Project Name"});
      // setSelectedOptSubProject({value:"", label : "Please Select SubProject Name"});
      // setSelectedOptModule({value:"", label : "Please Select Module Name"});
      // setSelectedOptSubModule({value:"" , label : "Please Select SubModule Name"});
      setSelectedpageType({ value: "", label: "Please Select PageType" });
      setSelectedpageTypeMain({ value: "", label: "Please select Main Page" });
      setSelectedpageTypeSubPage({ value: "", label: "Please select Sub Page" });
      setMainPageDropName("");
      setSubPageDropName("");
      setSubSubPageDropName("");
      setEstimationType("");
      setEstimationTime("");
      setPageBranch("");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  let difference = [];
  let ans = 0;
  let timeDiffs = 0;

  // calculate time difference between the choosed projects
  const fetchTimeDiffCal = async (pagetype, value) => {
    setPageName(!pageName);
    try {
      //getting ans from pagetype---> "mainpage" and submodule based on page models database

      if (pagetype.split("-")[0] === "MAINPAGE") {
        let sub_proj_time = projectModels?.map((data) => {
          if (data.pagetypename === "MAINPAGE" && data.submodule === selectedOptSubModule.value) {
            if (data.estimationtype === "Hours") {
              difference.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              difference.push(Number(data.estimationtime) / 60);
            }
            ans = difference.reduce((acc, cur) => acc + cur);

            setTimeCalculation(ans);
          }
        });
      }
      if (pagetype.split("-")[0] === "SUBPAGE") {
        let sub_proj_time = projectModels?.map((data) => {
          if (data.pagetypename === "SUBPAGE" && value === data.mainpage) {
            if (data.estimationtype === "Hours") {
              difference.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              difference.push(Number(data.estimationtime) / 60);
            }
            ans = difference.reduce((acc, cur) => acc + cur);

            setTimeCalculation(ans);
          }
        });
      }
      if (pagetype.split("-")[0] === "SUBSUBPAGE") {
        let sub_proj_time = projectModels?.map((data) => {
          if (data.pagetypename === "SUBSUBPAGE" && value === data.subpage) {
            if (data.estimationtype === "Hours") {
              difference.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              difference.push(Number(data.estimationtime) / 60);
            }
            ans = difference.reduce((acc, cur) => acc + cur);

            setTimeCalculation(ans);
          }
        });
      }

      let project_check =
        pagetype.split("-")[0] === "MAINPAGE"
          ? submodule?.map((value) => {
            if (selectedOptSubModule.value === value.name) {
              if (value.estimationtime === "Month") {
                timeDiffs = (Number(value.estimation) / 12) * (365 * 24);
                setTimeDiffCal(timeDiffs);
              } else if (value.estimationtime === "Year") {
                timeDiffs = Number(value.estimation) * (365 * 24);
                setTimeDiffCal(timeDiffs);
              } else if (value.estimationtime === "Days") {
                setTimeDiffCal(Number(value.estimation) * 24);
              } else if (value.estimationtime === "Hour") {
                setTimeDiffCal(Number(value.estimation));
              }
            }
          })
          : pagetype.split("-")[0] === "SUBPAGE"
            ? projectModels?.map((data) => {
              if (value === data.name) {
                if (data.estimationtype === "Hours") {
                  setTimeDiffCal(Number(data.estimationtime));
                } else if (data.estimationtype === "Minutes") {
                  setTimeDiffCal(Number(data.estimationtime));
                }
              }
            })
            : pagetype.split("-")[0] === "SUBSUBPAGE"
              ? projectModels?.map((data) => {
                if (value === data.name) {
                  if (data.estimationtype === "Hours") {
                    setTimeDiffCal(Number(data.estimationtime));
                  } else if (data.estimationtype === "Minutes") {
                    setTimeDiffCal(Number(data.estimationtime));
                  }
                }
              })
              : "";
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchCalculRemaining = async (pagetype, estType) => {
    if (pagetype && pagetype.split("-")[0] === "MAINPAGE") {
      if (estType === "Hours") {
        setTypeEst((timeDiffCal - timeCalculation).toFixed(2));
      }
      if (estType === "Minutes") {
        setTypeEst(((timeDiffCal - timeCalculation) * 60).toFixed(2));
      }
    }
    if (pagetype && pagetype.split("-")[0] === "SUBPAGE") {
      if (estType === "Hours") {
        setTypeEst((timeDiffCal - timeCalculation).toFixed(2));
      }
      if (estType === "Minutes") {
        setTypeEst(((timeDiffCal - timeCalculation) * 60).toFixed(2));
      }
    }
    if (pagetype && pagetype.split("-")[0] === "SUBSUBPAGE") {
      if (estType === "Hours") {
        setTypeEst((timeDiffCal - timeCalculation).toFixed(2));
      }
      if (estType === "Minutes") {
        setTypeEst(((timeDiffCal - timeCalculation) * 60).toFixed(2));
      }
    }
  };

  let differenceEdit = [];
  let ansEdit = 0;
  let timeDiffsEdit = 0;

  const [getSubModuleEdit, setGetSubModuleEdit] = useState("");
  const [getSubPageNameDropEdit, setGetSubPageNameDropEdit] = useState("");

  //Edit Page Functionality for Estimation Time
  const fetchEditEstTime = async (pagetype, value) => {
    setPageName(!pageName);
    try {
      let pageType = pagetype ? pagetype : selectedpageTypeEdit.value;
      let pageTypeEdit = pageType.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : pageType.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : pageType.split("-")[0];
      let subModEditValue = getSubModuleEdit ? getSubModuleEdit : selectedOptSubModuleEdit.value;
      let mainPageEditValue = getMainPageNameEdit ? getMainPageNameEdit : selectedpageTypeMainEdit.value;
      let subPageEditValue = getSubPageNameDropEdit ? getSubPageNameDropEdit : selectedpageTypeSubPageEdit.value;

      if (pageTypeEdit === "MAINPAGE") {
        let sub_module = projectModels.map((data) => {
          if (data.pagetypename === "MAINPAGE" && data.submodule === subModEditValue) {
            if (data.estimationtype === "Hours") {
              differenceEdit.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              differenceEdit.push(Number(data.estimationtime) / 60);
            }
            ansEdit = differenceEdit.reduce((acc, cur) => acc + cur);

            setEditTimeCalculation(ansEdit);
          }
        });
      }

      if (pageTypeEdit === "SUBPAGE") {
        let sub_module = projectModels.map((data) => {
          if (data.pagetypename === "SUBPAGE" && data.mainpage === mainPageEditValue) {
            if (data.estimationtype === "Hours") {
              differenceEdit.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              differenceEdit.push(Number(data.estimationtime) / 60);
            }
            ansEdit = differenceEdit.reduce((acc, cur) => acc + cur);

            setEditTimeCalculation(ansEdit);
          }
        });
      }
      if (pageTypeEdit === "SUBSUBPAGE") {
        let sub_module = projectModels.map((data) => {
          if (data.pagetypename === "SUBSUBPAGE" && data.subpage === subPageEditValue) {
            if (data.estimationtype === "Hours") {
              differenceEdit.push(Number(data.estimationtime));
            } else if (data.estimationtype === "Minutes") {
              differenceEdit.push(Number(data.estimationtime) / 60);
            }
            ansEdit = differenceEdit.reduce((acc, cur) => acc + cur);

            setEditTimeCalculation(ansEdit);
          }
        });
      }

      let ans =
        pageTypeEdit === "MAINPAGE"
          ? submoduleEditDrop?.filter((value) => {
            if (subModEditValue === value.name) {
              if (value.estimationtime === "Month") {
                timeDiffsEdit = (Number(value.estimation) / 12) * (365 * 24);
                setRowEditTimeProj(timeDiffsEdit);
              } else if (value.estimationtime === "Year") {
                timeDiffsEdit = Number(value.estimation) * (365 * 24);
                setRowEditTimeProj(timeDiffsEdit);
              } else if (value.estimationtime === "Days") {
                setRowEditTimeProj(Number(value.estimation) * 24);
              } else if (value.estimationtime === "Hour") {
                setRowEditTimeProj(Number(value.estimation));
              }
            }
          })
          : pageTypeEdit === "SUBPAGE"
            ? projectModels?.map((data) => {
              if (mainPageEditValue === data.name) {
                if (data.estimationtype === "Hours") {
                  setRowEditTimeProj(Number(data.estimationtime));
                } else if (data.estimationtype === "Minutes") {
                  setRowEditTimeProj(Number(data.estimationtime));
                }
              }
            })
            : pageTypeEdit === "SUBSUBPAGE"
              ? projectModels?.map((data) => {
                if (subPageEditValue === data.name) {
                  if (data.estimationtype === "Hours") {
                    setRowEditTimeProj(Number(data.estimationtime));
                  } else if (data.estimationtype === "Minutes") {
                    setRowEditTimeProj(Number(data.estimationtime));
                  }
                }
              })
              : "mainpage";
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [getPageTypeEditValue, setgetPageTypeEditValue] = useState("");
  const fetchEditEstimationType = async () => {
    let pageType = getPageTypeEditValue ? getPageTypeEditValue : selectedpageTypeEdit.value;
    let pageTypeEdit = pageType.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : pageType.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : pageType.split("-")[0];

    let estimatType = getEstitype ? getEstitype : rowEditTime.estimationtime;

    if (pageModelEdit.estimationtype === "Hours") {
      if (estimationTypeEdit === "Hours") {
        let remaining = rowEditTimeProj - editTimeCalculation;
        setConditionTiming(Number(pageModelEdit.estimationtime) + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " Hours Remaining");
      } else if (estimationTypeEdit === "Minutes") {
        let remaining = (rowEditTimeProj - editTimeCalculation) * 60;
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) * 24);
        setEditCalOverall(remaining + " Minutes Remaining");
      }
    } else if (pageModelEdit.estimationtype === "Minutes") {
      if (estimationTypeEdit === "Hours") {
        let remaining = rowEditTimeProj - editTimeCalculation;
        setConditionTiming(Number(pageModelEdit.estimationtime) / 24 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " Hours Remaining");
      } else if (estimationTypeEdit === "Minutes") {
        let remaining = (rowEditTimeProj - editTimeCalculation) * 60;
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) * 60);
        setEditCalOverall(remaining + " Minutes Remaining");
      }
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = submodules.some(item => item.name.toLowerCase() === (submodule.name).toLowerCase());
    if (selectedOptProject.value === "") {
      setPopupContentMalert("Please Select Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubProject.value === "") {
      setPopupContentMalert("Please Select Subproject Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptModule.value === "") {
      setPopupContentMalert("Please Select Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubModule.value === "") {
      setPopupContentMalert("Please Select Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value === "") {
      setPopupContentMalert("Please Select Page Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBPAGE" && selectedpageTypeMain.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeSubPage.value === "") {
      setPopupContentMalert("Please Select Sub Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeMain.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "MAINPAGE" && mainPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBPAGE" && subPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && subSubPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationType === "") {
      setPopupContentMalert("Please Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTime === "" || estimationTime === 0) {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(estimationTime) > Number(typeEst)) {
      setPopupContentMalert(`Please Enter less than ${typeEst} `);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (pageBranch === "") {
      setPopupContentMalert("Please Select Page Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //submit option for saving
  const handleSubmitSaveanother = (e) => {
    e.preventDefault();
    // const isNameMatch = submodules.some(item => item.name.toLowerCase() === (submodule.name).toLowerCase());
    if (selectedOptProject.value === "") {
      setPopupContentMalert("Please Select Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubProject.value === "") {
      setPopupContentMalert("Please Select Subproject Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptModule.value === "") {
      setPopupContentMalert("Please Select Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubModule.value === "") {
      setPopupContentMalert("Please Select Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value === "") {
      setPopupContentMalert("Please Select Page Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBPAGE" && selectedpageTypeMain.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeSubPage.value === "") {
      setPopupContentMalert("Please Select Sub Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeMain.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "MAINPAGE" && mainPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBPAGE" && subPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageType.value.split("-")[0] === "SUBSUBPAGE" && subSubPageDropName === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationType === "") {
      setPopupContentMalert("Please Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTime === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (pageBranch === "") {
      setPopupContentMalert("Please Select Page Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestSaveAnother();
    }
    // }
  };
  //cancel for create section
  const handleclear = () => {
    setSelectedOptProject({ value: "", label: "Please Select Project Name" });
    setSelectedOptSubProject({ value: "", label: "Please Select SubProject Name" });
    setSelectedOptModule({ value: "", label: "Please Select Module Name" });
    setSelectedOptSubModule({ value: "", label: "Please Select SubModule Name" });
    setSelectedpageType({ value: "", label: "Please Select PageType" });
    setSelectedpageTypeMain({ value: "", label: "Please select Main Page" });
    setSelectedpageTypeSubPage({ value: "", label: "Please select Sub Page" });
    setMainPageDropName("");
    setSubPageDropName("");
    setSubSubPageDropName("");
    setEstimationType("");
    setEstimationTime("");
    setPageBranch("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //id for login...
  let authToken = localStorage.APIToken;

  const [pageModelEdit, setPageModelEdit] = useState([]);
  const [selectedOptProjectEdit, setSelectedOptProjectEdit] = useState({ value: "", label: "Please Select Project Name" });
  const [selectedOptSubProjectEdit, setSelectedOptSubProjectEdit] = useState({ value: " ", label: "Please Select SubProject Name" });
  const [selectedOptModuleEdit, setSelectedOptModuleEdit] = useState({ value: "", label: "Please Select Module Name" });
  const [selectedOptSubModuleEdit, setSelectedOptSubModuleEdit] = useState({ value: "", label: "Please Select SubModule Name" });
  const [selectedpageTypeEdit, setSelectedpageTypeEdit] = useState({ value: "", label: "Please Select PageType" });
  const [selectedpageTypeMainEdit, setSelectedpageTypeMainEdit] = useState({ value: "", label: "Please select Main Page" });
  const [selectedpageTypeSubPageEdit, setSelectedpageTypeSubPageEdit] = useState({ value: "", label: "Please select Sub Page" });
  const [mainPageDropNameEdit, setMainPageDropNameEdit] = useState("");
  const [subPageDropNameEdit, setSubPageDropNameEdit] = useState("");
  const [subSubPageDropNameEdit, setSubSubPageDropNameEdit] = useState("");
  const [estimationTypeEdit, setEstimationTypeEdit] = useState("");
  const [estimationTimeEdit, setEstimationTimeEdit] = useState("");
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPageModelEdit(res?.data?.spagemodel);
      setSelectedOptProjectEdit({ value: res?.data?.spagemodel?.project, label: res?.data?.spagemodel?.project });
      setSelectedOptSubProjectEdit({ value: res?.data?.spagemodel?.subproject, label: res?.data?.spagemodel?.subproject });
      setSelectedOptModuleEdit({ value: res?.data?.spagemodel?.module, label: res?.data?.spagemodel?.module });
      setSelectedOptSubModuleEdit({ value: res?.data?.spagemodel?.submodule, label: res?.data?.spagemodel?.submodule });
      setSelectedpageTypeEdit({ value: res?.data?.spagemodel?.pagetype, label: res?.data?.spagemodel?.pagetype });
      setSelectedpageTypeMainEdit({ value: res?.data?.spagemodel?.mainpage, label: res?.data?.spagemodel?.mainpage });
      setSelectedpageTypeSubPageEdit({ value: res?.data?.spagemodel?.subpage, label: res?.data?.spagemodel?.subpage });
      setMainPageDropNameEdit(res?.data?.spagemodel?.name);
      setSubPageDropNameEdit(res?.data?.spagemodel?.name);
      setSubSubPageDropNameEdit(res?.data?.spagemodel?.name);
      setEstimationTypeEdit(res?.data?.spagemodel?.estimationtype);
      setEstimationTimeEdit(res?.data?.spagemodel?.estimationtime);
      setPageBranchEdit(res?.data?.spagemodel?.pageBranch);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPageModelEdit(res?.data?.spagemodel);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPageModelEdit(res?.data?.spagemodel);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submodule updateby edit page...
  let updateby = pageModelEdit?.updatedby;
  let addedby = pageModelEdit?.addedby;

  let submoduletsid = getrowid?._id;

  const [projectnameEdit, setprojectnameEdit] = useState("");
  const [subprojNameEdit, setsubprojNameEdit] = useState("");
  const [moduleNameEdit, setmoduleNameEdit] = useState("");
  const [getpageTypeEdit, setgetpageTypeEdit] = useState("");
  const [pageTypesEdit, setpageTypesEdit] = useState("");
  const [getMainPageNameEdit, setgetMainPageNameEdit] = useState("");
  const [subProjEditDrop, setsubProjEditDrop] = useState([]);
  const [moduleEditDrop, setModuleEditDrop] = useState([]);
  const [submoduleEditDrop, setsubmoduleEditDrop] = useState([]);
  const [pageTypeMainDrop, setpageTypeMainDrop] = useState([]);
  const [pageTypeSubPageDrop, setPageTypeSubPageDrop] = useState([]);
  //fetching sub-Project Dropdowns
  const fetchSubProjectDropdownsedit = async () => {
    setPageName(!pageName);
    let projectName = projectnameEdit ? projectnameEdit : selectedOptProjectEdit?.value;
    try {
      let subPro = await axios.get(SERVICE.SUBPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let subProDrop =
        subPro?.data?.subprojects.length > 0 &&
        subPro?.data?.subprojects.filter((data) => {
          return projectName === data.project;
        });

      setsubProjEditDrop(
        subProDrop.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Module Dropdowns
  const fetchModuleDropdownsedit = async () => {
    setPageName(!pageName);
    let modulename = subprojNameEdit ? subprojNameEdit : selectedOptSubProjectEdit?.value;
    try {
      let dropModule = await axios.get(SERVICE.MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let modulelist =
        dropModule?.data?.modules?.length > 0 &&
        dropModule?.data?.modules?.filter((data) => {
          if (modulename === data.subproject) {
            return data;
          }
        });
      setModuleEditDrop(
        modulelist.length > 0 &&
        modulelist?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching Sub Module Dropdowns Edit
  const fetchSubModuleDropdownsedit = async () => {
    setPageName(!pageName);
    let modulename = moduleNameEdit ? moduleNameEdit : selectedOptModuleEdit?.value;
    try {
      let dropModule = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let submodulelist =
        dropModule?.data?.submodules?.length > 0 &&
        dropModule?.data?.submodules?.filter((data) => {
          if (modulename === data.module) {
            return data;
          }
        });
      setsubmoduleEditDrop(
        submodulelist.length > 0 &&
        submodulelist?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching PageType Main
  const fetchpagetypeMainDropdwons = async () => {
    setPageName(!pageName);
    // let modulename = moduleNameEdit ? moduleNameEdit : selectedOptModuleEdit.value;
    let pageType = getpageTypeEdit ? getpageTypeEdit : selectedpageTypeEdit?.value;
    let pageEdit = pageType.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : pageType.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE";

    let pagTypeEditName = pageEdit === "SUBPAGE" ? "MAINPAGE" : pageEdit === "SUBSUBPAGE" ? "MAINPAGE" : "";

    try {
      let dropModule = await axios.get(SERVICE.PAGEMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let submodulelist =
        dropModule?.data?.pagemodel?.length > 0 &&
        dropModule?.data?.pagemodel?.filter((data) => {
          if (pagTypeEditName === data.pagetypename && data.project === selectedOptProjectEdit?.value && data.subproject === selectedOptSubProjectEdit?.value && data.module === selectedOptModuleEdit?.value && data.submodule === selectedOptSubModuleEdit?.value) {
            return data;
          }
        });
      setpageTypeMainDrop(
        submodulelist.length > 0 &&
        submodulelist?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching PageType Main
  const fetchPagetypeSubPageDropdownsEdit = async () => {
    setPageName(!pageName);
    let mainPageGet = getMainPageNameEdit ? getMainPageNameEdit : selectedpageTypeMainEdit?.value;
    let getPageName = selectedpageTypeEdit?.value.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : selectedpageTypeEdit?.value.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE";
    let getPageNameEdit = getPageName === "SUBPAGE" ? "MAINPAGE" : getPageName === "SUBSUBPAGE" ? "SUBPAGE" : "";
    try {
      let dropModule = await axios.get(SERVICE.PAGEMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let submodulelist =
        dropModule?.data?.pagemodel?.length > 0 &&
        dropModule?.data?.pagemodel?.filter((data) => {
          if (getPageNameEdit === data.pagetypename && mainPageGet === data.mainpage && data.project === selectedOptProjectEdit?.value && data.subproject === selectedOptSubProjectEdit?.value && data.module === selectedOptModuleEdit?.value && data.submodule === selectedOptSubModuleEdit?.value) {
            return data;
          }
        });
      setPageTypeSubPageDrop(
        submodulelist.length > 0 &&
        submodulelist?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let page_mod_id = pageModelEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let areas = await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${page_mod_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedOptProjectEdit.value),
        subproject: String(selectedOptSubProjectEdit.value),
        module: String(selectedOptModuleEdit.value),
        submodule: String(selectedOptSubModuleEdit.value),
        pagetypename: selectedpageTypeEdit.value.split("-")[0] === "MAINPAGE" ? "MAINPAGE" : selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" ? "SUBPAGE" : "SUBSUBPAGE",
        pagetype: String(selectedpageTypeEdit.value),
        mainpage: selectedpageTypeEdit.value.split("-")[0] === "MAINPAGE" ? mainPageDropNameEdit : String(selectedpageTypeMainEdit.value),
        subpage: selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" ? subPageDropNameEdit : String(selectedpageTypeSubPageEdit.value),
        name: subSubPageDropNameEdit,
        estimationtype: String(estimationTypeEdit),
        estimationtime: String(estimationTimeEdit),
        pageBranch: pageBranchEdit,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });

      setSelectedOptProjectEdit({ value: "", label: "Please Select Project Name" });
      setSelectedOptSubProjectEdit({ value: "", label: "Please Select SubProject Name" });
      setSelectedOptModuleEdit({ value: "", label: "Please Select Module Name" });
      setSelectedOptSubModuleEdit({ value: "", label: "Please Select SubModule Name" });
      setSelectedpageTypeEdit({ value: "", label: "Please Select PageType" });
      setSelectedpageTypeMainEdit({ value: "", label: "Please select Main Page" });
      setSelectedpageTypeSubPageEdit({ value: "", label: "Please select Sub Page" });
      setMainPageDropNameEdit("");
      setSubPageDropNameEdit("");
      setSubSubPageDropNameEdit("");
      setEstimationTypeEdit("");
      setEstimationTimeEdit("");
      setPageBranch("");
      handleCloseModEdit();
      await fetchprojectModelsDropdwon();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmit = (e) => {
    if (selectedOptProjectEdit.value === "") {
      setPopupContentMalert("Please Select Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubProjectEdit.value === "") {
      setPopupContentMalert("Please Select Subproject Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptModuleEdit.value === "") {
      setPopupContentMalert("Please Select Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptSubModuleEdit.value === "") {
      setPopupContentMalert("Please Select Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value === "") {
      setPopupContentMalert("Please Select Page Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" && selectedpageTypeMainEdit.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeSubPageEdit.value === "") {
      setPopupContentMalert("Please Select Sub Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "SUBSUBPAGE" && selectedpageTypeMainEdit.value === "") {
      setPopupContentMalert("Please Select Main Page Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "MAINPAGE" && mainPageDropNameEdit === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" && subPageDropNameEdit === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedpageTypeEdit.value.split("-")[0] === "SUBSUBPAGE" && subSubPageDropNameEdit === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTypeEdit === "") {
      setPopupContentMalert("Please Estimation Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (estimationTimeEdit === "" || estimationTimeEdit === 0) {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(estimationTimeEdit) > Number(conditionTiming)) {
      setPopupContentMalert(`Please Enter less than ${conditionTiming} ${estimationTypeEdit} `);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (pageBranchEdit === "") {
      setPopupContentMalert("Please Select Page Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const modifiedData = projectModels.map((t, index) => ({
    _id: t._id,
    sno: index + 1,
    project: t.project,
    subproject: t.subproject,
    module: t.module,
    submodule: t.submodule,
    pagetype: t.pagetype,
    mainpage: t.mainpage === "" ? "---" : t.mainpage,
    subpage: t.subpage === "" ? "---" : t.subpage,
    name: t.name,
    estimationtime: t.estimationtime + "-" + t.estimationtype,
  }));

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Page Model",
    pageStyle: "print",
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProjectDropdowns();
    fetchprojectModelsDropdwon();
    fetchpageTypes();
  }, []);
  useEffect(() => {
    fetchCalculRemaining();
  }, [pageTypes, mainPageDropName, subPageDropName, submodule]);

  useEffect(() => {
    fetchEditEstimationType();
  }, [isEditOpen, pageModelEdit, estimationTypeEdit, selectedpageTypeEdit, selectedOptSubModuleEdit, selectedpageTypeMainEdit, selectedpageTypeSubPageEdit]);

  useEffect(() => {
    fetchAllSubModule();
    fetchSubProjectDropdownsedit();
  }, [isEditOpen, pageModelEdit, selectedOptProjectEdit]);

  useEffect(() => {
    fetchModuleDropdownsedit();
  }, [isEditOpen, pageModelEdit, selectedOptSubProjectEdit]);

  useEffect(() => {
    fetchSubModuleDropdownsedit();
  }, [isEditOpen, pageModelEdit, selectedOptModuleEdit]);

  useEffect(() => {
    fetchpagetypeMainDropdwons();
  }, [isEditOpen, pageModelEdit, selectedpageTypeEdit]);

  useEffect(() => {
    fetchPagetypeSubPageDropdownsEdit();
  }, [selectedpageTypeMainEdit]);

  useEffect(() => {
    fetchEditEstTime();
    fetchEditEstimationType();
  }, [isEditOpen, pageModelEdit, selectedpageTypeEdit, selectedOptSubModuleEdit, estimationTimeEdit, selectedpageTypeMainEdit, selectedpageTypeSubPageEdit]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(projectModels);
  }, [projectModels]);

  useEffect(() => {
    fetchAllSubModule();
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchProjectDropdowns();
    fetchModuleEditDropDown();
  }, [isEditOpen, submoduleid]);

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
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  function filterDataFromPage(page, projectName, pageName) {
    const pageData = page.filter((item) => item.project === projectName);
    return pageData.length > 0 ? pageData.map((item) => ({ ...item, page: pageName })) : null;
  }


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
      flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "project", headerName: "Project Name", flex: 0, width: 130, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "subproject", headerName: "Subproject Name", flex: 0, width: 130, hide: !columnVisibility.subproject, headerClassName: "bold-header" },
    { field: "module", headerName: "Module Name", flex: 0, width: 130, hide: !columnVisibility.module, headerClassName: "bold-header" },
    { field: "submodule", headerName: "Sub Module", flex: 0, width: 130, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
    { field: "pagetype", headerName: "Page Type", flex: 0, width: 130, hide: !columnVisibility.pagetype, headerClassName: "bold-header" },
    { field: "mainpage", headerName: "Main Page", flex: 0, width: 130, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
    { field: "subpage", headerName: "Sub Page", flex: 0, width: 130, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
    { field: "name", headerName: "Name", flex: 0, width: 130, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "estimationtime", headerName: "Estimation Time", flex: 0, width: 130, hide: !columnVisibility.estimationtime, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 275,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("epagemodel") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )} */}
          {isUserRoleCompare?.includes("dpagemodel") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vpagemodel") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ipagemodel") && (
            <Button
              sx={userStyle.buttonedit}
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
      project: item.project,
      subproject: item.subproject,
      module: item.module,
      submodule: item.submodule,
      pagetype: item.pagetype,
      mainpage: item.mainpage,
      subpage: item.subpage,
      name: item.name,
      estimationtime: item.estimationtime
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"PAGE MODEL"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Page Model"
        modulename="Projects"
        submodulename="Page Model"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("apagemodel") && (
        <>
          <Box sx={userStyle.container}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>Create Page Model</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={project}
                      styles={colourStyles}
                      value={{ label: selectedOptProject.label, value: selectedOptProject.value }}
                      onChange={(value) => {
                        setSelectedOptProject(value);
                        fetchSubProjectDropdowns(value.value);
                        setSelectedOptSubProject({ value: "", label: "Please Select SubProject Name" });
                        setSelectedOptModule({ value: "", label: "Please Select Module Name" });
                        setSelectedOptSubModule({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageType({ value: "", label: "Please Select PageType" });
                        setGetProjectName(value.value);
                        setEstimationType("");
                        setModule([])
                        setSubModule([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={subproject}
                      styles={colourStyles}
                      value={{ label: selectedOptSubProject.label, value: selectedOptSubProject.value }}
                      onChange={(value) => {
                        setSelectedOptSubProject(value);
                        fetchModuleDropdowns(value.value);
                        setSelectedOptModule({ value: "", label: "Please Select Module Name" });
                        setSelectedOptSubModule({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageType({ value: "", label: "Please Select PageType" });
                        setGetSubProjectName(value.value);
                        setEstimationType("");
                        setModule([])
                        setSubModule([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Module <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={module}
                      styles={colourStyles}
                      value={{ label: selectedOptModule.label, value: selectedOptModule.value }}
                      onChange={(value) => {
                        setSelectedOptModule(value);
                        fetchsubModuleDropdowns(value.value);
                        setSelectedOptSubModule({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageTypeMain({ value: "", label: "Please Select Mainpage" });
                        setGetModuleName(value.value);
                        setEstimationType("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      SubModule Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      styles={colourStyles}
                      options={submodule}
                      value={{ label: selectedOptSubModule.label, value: selectedOptSubModule.value }}
                      onChange={(value) => {
                        setSelectedOptSubModule(value);
                        setGetSubModuleName(value.value);
                        setSelectedpageType({ value: "", label: "Please Select SPageType" });
                        setEstimationType("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Page Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={pageTypes}
                    styles={colourStyles}
                    value={{ label: selectedpageType.label, value: selectedpageType.value }}
                    onChange={(value) => {
                      setSelectedpageType(value);
                      fetchPagetypeMainDropdowns(value.value);
                      setSelectedpageTypeMain({ value: "", label: "Please select Main Page" });
                      setSelectedpageTypeSubPage({ value: "", label: "Please select Sub Page" });
                      fetchTimeDiffCal(value.value, value.value);
                      setEstimationType("");
                      setMainPageDropName("");
                      setSubPageDropName("");
                      setSubSubPageDropName("");
                    }}
                  />
                </Grid>
                {selectedpageType.value.split("-")[0] === "MAINPAGE" ? (
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={mainPageDropName}
                        onChange={(e) => {
                          setMainPageDropName(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : selectedpageType.value.split("-")[0] === "SUBPAGE" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Main Page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={mainpageTypeDropdown}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeMain.label, value: selectedpageTypeMain.value }}
                        onChange={(value) => {
                          setSelectedpageTypeMain(value);
                          fetchPageTypeMainEstimationTime(value.value);
                          fetchTimeDiffCal(selectedpageType.value, value.value);
                          setEstimationType("");
                          setSubPageDropName("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={subPageDropName}
                          onChange={(e) => {
                            setSubPageDropName(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : selectedpageType.value.split("-")[0] === "SUBSUBPAGE" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Main Page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={mainpageTypeDropdown}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeMain.label, value: selectedpageTypeMain.value }}
                        onChange={(value) => {
                          setSelectedpageTypeMain(value);
                          fetchPagetypeSubPageDropdowns(value.value);
                          setSelectedpageTypeSubPage({ label: "Please Select Sub Page" });
                          setEstimationType("");
                          setSubSubPageDropName("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Sub page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={subpageTypeDropdown}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeSubPage.label, value: selectedpageTypeSubPage.value }}
                        onChange={(value) => {
                          setSelectedpageTypeSubPage(value);
                          fetchTimeDiffCal(selectedpageType.value, value.value);
                          setEstimationType("");
                          setSubSubPageDropName("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={subSubPageDropName}
                          onChange={(e) => {
                            setSubSubPageDropName(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Estimation Type<b style={{ color: "red" }}>*</b>
                  </Typography>
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
                    value={estimationType}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => {
                      setEstimationType(e.target.value);
                      fetchCalculRemaining(selectedpageType.value, e.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      Please Select Estimation Type
                    </MenuItem>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Estimation Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput id="component-outlined" type="Number" sx={userStyle.input} value={estimationTime} onChange={(e) => setEstimationTime(Number(e.target.value) > Number(typeEst) ? 0 : Number(e.target.value) > 0 ? Number(e.target.value) : 0)} />
                    <Typography style={{ color: "red" }}>
                      {typeEst}
                      {estimationType} is Remaining
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Page Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
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
                    value={pageBranch}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => {
                      setPageBranch(e.target.value);
                      // fetchCalculRemaining(selectedpageType.value , e.target.value)
                    }}
                  >
                    <MenuItem value="" disabled>
                      Please Select Branch Status
                    </MenuItem>
                    <MenuItem value="EndPage"> {"End Page"} </MenuItem>
                    <MenuItem value="NotEndPage"> {"Not End Page"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2} lg={2}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    // sx={{ display: "flex" }}
                    // type="submit"
                    onClick={handleSubmit}
                  >
                    SUBMIT
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={2} lg={3}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    // sx={{ display: "flex" }}
                    // type="submit"
                    onClick={handleSubmitSaveanother}
                  >
                    SUBMIT AND ADD ANOTHER
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </>
      )}
      <Box>
        {/* edit model */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography sx={userStyle.SubHeaderText}>Edit Page Model</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={projectEdit}
                      styles={colourStyles}
                      value={{ label: selectedOptProjectEdit.label, value: selectedOptProjectEdit.value }}
                      onChange={(value) => {
                        setSelectedOptProjectEdit(value);
                        setprojectnameEdit(value.value);
                        fetchSubProjectDropdownsedit();
                        setSelectedOptSubProjectEdit({ value: "", label: "Please Select SubProject Name" });
                        setSelectedOptModuleEdit({ value: "", label: "Please Select Module Name" });
                        setSelectedOptSubModuleEdit({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageTypeEdit({ value: "", label: "Please Select PageType" });
                        setEstimationTypeEdit("");
                        setModuleEditDrop([])
                        setsubmoduleEditDrop([])
                        setpageTypesEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* {subprojectnone == "None" ? null : */}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={subProjEditDrop}
                      styles={colourStyles}
                      value={{ label: selectedOptSubProjectEdit.label, value: selectedOptSubProjectEdit.value }}
                      onChange={(value) => {
                        setSelectedOptSubProjectEdit(value);
                        setsubprojNameEdit(value.value);
                        fetchModuleDropdownsedit();
                        setEstimationTypeEdit("");
                        setSelectedOptModuleEdit({ value: "", label: "Please Select Module Name" });
                        setSelectedOptSubModuleEdit({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageTypeEdit({ value: "", label: "Please Select PageType" });
                        setsubmoduleEditDrop([])
                        setpageTypesEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* } */}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Module <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={moduleEditDrop}
                      styles={colourStyles}
                      value={{ label: selectedOptModuleEdit.label, value: selectedOptModuleEdit.value }}
                      onChange={(value) => {
                        setSelectedOptModuleEdit(value);
                        setmoduleNameEdit(value.value);
                        fetchSubModuleDropdownsedit();
                        setEstimationTypeEdit("");
                        setSelectedOptSubModuleEdit({ value: "", label: "Please Select SubModule Name" });
                        setSelectedpageTypeEdit({ value: "", label: "Please Select PageType" }); setpageTypesEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      SubModule Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={submoduleEditDrop}
                      styles={colourStyles}
                      value={{ label: selectedOptSubModuleEdit.label, value: selectedOptSubModuleEdit.value }}
                      onChange={(value) => {
                        setSelectedOptSubModuleEdit(value);
                        setGetSubModuleEdit(value.value);
                        setSelectedpageTypeEdit({ value: "", label: "Please Select PageType" }); setpageTypesEdit([])

                        setEstimationTypeEdit("");
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Page Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={pageTypesEdit}
                    styles={colourStyles}
                    value={{ label: selectedpageTypeEdit.label, value: selectedpageTypeEdit.value }}
                    onChange={(value) => {
                      setSelectedpageTypeEdit(value);
                      // fetchPagetypeMainDropdowns(value.value)
                      setgetPageTypeEditValue(value.value);
                      setSelectedpageTypeMainEdit({ value: "", label: "Please select Main Page" });
                      setSelectedpageTypeSubPageEdit({ value: "", label: "Please select Sub Page" });
                      fetchEditEstTime(value.value, value.value);
                      setEstimationTypeEdit("");
                      setMainPageDropNameEdit("");
                      setSubPageDropNameEdit("");
                    }}
                  />
                </Grid>
                {selectedpageTypeEdit.value.split("-")[0] === "MAINPAGE" ? (
                  <Grid item md={4} xs={12} sm={12}>
                    <Typography>
                      Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={mainPageDropNameEdit}
                        onChange={(e) => {
                          setMainPageDropNameEdit(e.target.value);
                          setEstimationTypeEdit("");
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : selectedpageTypeEdit.value.split("-")[0] === "SUBPAGE" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Main Page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={pageTypeMainDrop}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeMainEdit.label, value: selectedpageTypeMainEdit.value }}
                        onChange={(value) => {
                          setSelectedpageTypeMainEdit(value);
                          setgetMainPageNameEdit(value.value);
                          // fetchPageTypeMainEstimationTime(value.value)
                          fetchEditEstTime(selectedpageTypeEdit.value, value.value);
                          setSubPageDropNameEdit("");
                          setEstimationTypeEdit("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={subPageDropNameEdit}
                          onChange={(e) => {
                            setSubPageDropNameEdit(e.target.value);
                            setEstimationTypeEdit("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : selectedpageTypeEdit?.value.split("-")[0] === "SUBSUBPAGE" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Main Page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={pageTypeMainDrop}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeMainEdit.label, value: selectedpageTypeMainEdit.value }}
                        onChange={(value) => {
                          setSelectedpageTypeMainEdit(value);
                          setSelectedpageTypeSubPageEdit({ value: "", label: "Please select Sub Page" });
                          // fetchEditEstTime(selectedpageTypeEdit.value , value.value);
                          fetchPagetypeSubPageDropdownsEdit();
                          setEstimationTypeEdit("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Sub page<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={pageTypeSubPageDrop}
                        styles={colourStyles}
                        value={{ label: selectedpageTypeSubPageEdit.label, value: selectedpageTypeSubPageEdit.value }}
                        onChange={(value) => {
                          setSelectedpageTypeSubPageEdit(value);
                          fetchEditEstTime(selectedpageTypeEdit.value, value.value);
                          setGetSubPageNameDropEdit(value.value);
                          // fetchEditEstTime(selectedpageTypeEdit.value , value.value);
                          setEstimationTypeEdit("");
                        }}
                      />
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={subSubPageDropNameEdit}
                          onChange={(e) => {
                            setSubSubPageDropNameEdit(e.target.value);
                            setEstimationTypeEdit("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Estimation Type<b style={{ color: "red" }}>*</b>
                  </Typography>
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
                    value={estimationTypeEdit}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => {
                      setEstimationTypeEdit(e.target.value);
                      // setEstimationTypeEdit(e.target.value);
                      fetchEditEstimationType();
                    }}
                  >
                    <MenuItem value="" disabled>
                      {" "}
                      Please Select Estimation Type
                    </MenuItem>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Estimation Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput id="component-outlined" type="Number" placeholder="please enter time" value={estimationTimeEdit} onChange={(e) => setEstimationTimeEdit(Number(e.target.value))} />
                    <Typography style={{ color: "red" }}>{editCalOverall}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Page Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
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
                    value={pageBranchEdit}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={(e) => {
                      setPageBranchEdit(e.target.value);
                      // fetchCalculRemaining(selectedpageType.value , e.target.value)
                    }}
                  >
                    <MenuItem value="" disabled>
                      Please Select Branch Status
                    </MenuItem>
                    <MenuItem value="EndPage"> {"End Page"} </MenuItem>
                    <MenuItem value="NotEndPage"> {"Not End Page"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <br />
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      <>
        {isUserRoleCompare?.includes("lpagemodel") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              {/*       
          <Box sx={userStyle.container} > */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Page Model List</Typography>
              </Grid>
              {!submodulecheck ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>

                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  </Box>
                </>
              ) : (
                <>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                      {isUserRoleCompare?.includes("csvpagemodel") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            setFormat("xl")
                          }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("excelpagemodel") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printpagemodel") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint /> &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdfpagemodel") && (
                        <>
                          <Button sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true)
                            }}
                          ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imagepagemodel") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                      )}
                    </Grid>
                  </Grid>
                  <br />
                  <Grid style={userStyle.dataTablestyle}>
                    <Box>
                      <label>Show entries:</label>
                      <Select
                        id="pageSizeSelect"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 180,
                              width: 80,
                            },
                          },
                        }}
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        style={{ width: "77px" }}
                        sx={{ "@media only screen and (max-width: 500px) and (min-width: 100px)": { fontSize: "12px !important", height: "30px", width: "inherit", marginRight: "50px", padding: "10px" } }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={projectModels.length}>All</MenuItem>
                      </Select>
                    </Box>
                    <Grid item md={2} xs={6} sm={6}>
                      <AggregatedSearchBar
                        columnDataTable={columnDataTable}
                        setItems={setItems}
                        addSerialNumber={addSerialNumber}
                        setPage={setPage}
                        maindatas={projectModels}
                        setSearchedString={setSearchedString}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                  <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;

                  <br />
                  <br />
                  {/* ****** Table Grid Container ****** */}

                  {/* ****** Table start ****** */}

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
                      />
                    </>

                  </Box>

                </>
              )}
            </Box>
          </>
        )}
      </>

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
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={true}>
        <Box sx={{ width: "1080px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>View Page Model </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project</Typography>
                  <Typography>{pageModelEdit.project}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subproject</Typography>
                  <Typography>{pageModelEdit.subproject}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Module Name</Typography>
                  <Typography>{pageModelEdit.module}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">SubModule Name</Typography>
                  <Typography>{pageModelEdit.submodule}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">PageType</Typography>
                  <Typography>{pageModelEdit.pagetype}</Typography>
                </FormControl>
              </Grid>
              {pageModelEdit.pagetypename === "MAINPAGE" ? (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Name</Typography>
                    <Typography>{pageModelEdit.name}</Typography>
                  </FormControl>
                </Grid>
              ) : pageModelEdit.pagetypename === "SUBPAGE" ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Main Page</Typography>
                      <Typography>{pageModelEdit.mainpage}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Name</Typography>
                      <Typography>{pageModelEdit.name}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : pageModelEdit.pagetypename === "SUBSUBPAGE" ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Main Page</Typography>
                      <Typography>{pageModelEdit.mainpage}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Sub Page</Typography>
                      <Typography>{pageModelEdit.subpage}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Name</Typography>
                      <Typography>{pageModelEdit.name}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Estimation Time</Typography>
                  <Typography>{pageModelEdit.estimationtime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Estimation Type</Typography>
                  <Typography>{pageModelEdit.estimationtype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Page Branch</Typography>
                  <Typography>{pageModelEdit.pageBranch}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "450px", textAlign: "center", alignItems: "center" }}>
            <DialogContent>
              <Typography variant="h6">{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={handleCloseerr}>
                ok
              </Button>
            </DialogActions>
          </Box>
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
        itemsTwo={projectModels ?? []}
        filename={"Page Model"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Page Model Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delPageModel}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />

    </Box>
  );
}

export default PageModel;