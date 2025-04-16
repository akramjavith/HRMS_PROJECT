import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import Selects from "react-select"; 
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

function Submodule() {

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

  let exportColumnNames = ['Project Name', 'Subproject Name', 'Module Name', 'Submodule Name', 'EstimationTime'];
  let exportRowValues = ['project', 'subproject', 'module', 'name', 'estimateTime'];

  const gridRef = useRef(null);
  const [project, setProject] = useState([]);
  const [subproject, setSubProject] = useState([]);
  const [module, setModule] = useState([]);
  const [modules, setModules] = useState([]);

  const [submodule, setSubmodule] = useState({
    project: "Please Select Project",
    subproject: "Please Select Subproject",
    module: "Please Select Module",
    name: "",
    estimation: "",
    estimationtime: "",
  });
  const [endPage, setEndPage] = useState("notend");
  const [endPageEdit, setEndPageEdit] = useState("");
  const [submodules, setSubmodules] = useState([]);
  const [submoduleid, setSubmoduleid] = useState({
    name: "",
    project: "Please Select Project",
    subproject: "Please Select Subproject",
    module: "Please Select Module",
    estimation: "",
    estimationtime: "",
  });
  const [isBtn, setIsBtn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [checkvalue, setCheckvalue] = useState("");
  const [getrowid, setRowGetid] = useState("");
  const [timeCalculation, setTimeCalculation] = useState("");
  const [timeDiffCal, setTimeDiffCal] = useState("");
  const [typeEst, setTypeEst] = useState("");
  const [typCheck, setTypeCheck] = useState("");
  const [rowEditTime, setRowEditTime] = useState("");
  const [rowEditTimeProj, setRowEditTimeProj] = useState("");
  const [editTimeCalculation, setEditTimeCalculation] = useState("");
  const [editCalOverall, setEditCalOverall] = useState("");
  const [getEstitype, setGetEstiType] = useState("");
  const [conditionTiming, setConditionTiming] = useState("");
  const [editProjDropdwon, setEditProjDropdown] = useState("");
  const [editProjDropdwonproj, setEditProjDropdownproj] = useState("");
  const [editProjDropdwonsubproj, setEditProjDropdownsubproj] = useState("");
  const [moduleEditList, setModuleEditList] = useState([]);
  const [submodulecheck, setsubmodulecheck] = useState(false);
  const [selectedProject, setSelectedProject] = useState("Please Select Project");
  const [selectedProjectedit, setSelectedProjectedit] = useState("Please Select Project");
  const [selectedSubproject, setSelectedSubproject] = useState("Please Select Subproject");
  const [selectedSubprojectedit, setSelectedSubprojectedit] = useState("Please Select Subproject");
  const [selectedModule, setSelectedModule] = useState("Please Select Module");
  const [selectedModuleedit, setSelectedModuleedit] = useState("Please Select Module");
  const [allSubmoduleedit, setAllSubmoduleedit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName,} = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;

  const [fileFormat, setFormat] = useState('')

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Submodule.png");
        });
      });
    }
  };

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredCategoriesEdit, setFilteredCategoriesEdit] = useState([]);

  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredSubCategoriesEdit, setFilteredSubCategoriesEdit] = useState([]);

  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategories = subproject
      ?.filter((subpro) => subpro.project === selectedProject)
      .map((subpro) => ({
        ...subpro,
        label: subpro.name,
        value: subpro.name,
      }));
    setFilteredCategories(filteredCategories);
  }, [selectedProject]);

  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategoriesedit = subproject
      ?.filter((subpro) => subpro.project === selectedProjectedit)
      .map((subpro) => ({
        ...subpro,
        label: subpro.name,
        value: subpro.name,
      }));

    setFilteredCategoriesEdit(filteredCategoriesedit);
  }, [selectedProjectedit, selectedSubprojectedit]);

  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategories = module
      ?.filter((mod) => mod.project === selectedProject && mod.subproject === selectedSubproject)
      .map((mod) => ({
        ...mod,
        label: mod.name,
        value: mod.name,
      }));
    setFilteredSubCategories(filteredCategories);
  }, [selectedProject, selectedSubproject]);

  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategoriesedit = module
      ?.filter((mod) => mod.project === selectedProjectedit && mod.subproject === selectedSubprojectedit)
      .map((mod) => ({
        ...mod,
        label: mod.name,
        value: mod.name,
      }));

    setFilteredSubCategoriesEdit(filteredCategoriesedit);
  }, [selectedProjectedit, selectedSubprojectedit]);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    setSubmoduleid({
      ...submoduleid,
      name: "",
      estimation: "",
      estimationtime: "",
    });
    setTypeCheck("");
    setGetEstiType("");
    setRowEditTime("");
    setEndPageEdit("");
    setSelectedProjectedit("");
    setSelectedSubprojectedit("");
    setSelectedModuleedit("");
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // selects field status
  const handleProjectChange = (e) => {
    const selectedProject = e.value;
    setSelectedProject(selectedProject);
    setSelectedSubproject("Please Select Subproject");
    setSelectedModule("Please Select Module");
    setSubmodule({
      ...submodule,
      module: 'Please Select Module',
      name: '',
      estimation: '',
      estimationtime: "",
    });
    setEndPage('notend');
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    subproject: true,
    module: true,
    name: true,
    estimateTime: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //set function to get particular row
  const [deletesubmodule, setDeletesubmodule] = useState({});
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletesubmodule(res?.data?.ssubmodule);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { setsubmodulecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all modules.
  const fetchSubModuleAll = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAllSubmoduleedit(res_module?.data?.submodules.filter((item) => item._id !== submoduleid._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let submodulesid = deletesubmodule._id;
  const delSubModule = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SUBMODULE_SINGLE}/${submodulesid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      setPage(1);
      await fetchAllSubModule();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      const projall = [
        ...res_project?.data?.projects.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProject(projall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub-Project for Dropdowns
  const fetchSubProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let subPro = await axios.get(SERVICE.SUBPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const subprojall = [
        ...subPro?.data?.subprojects.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setSubProject(subprojall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module for Dropdowns
  const fetchModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let subPro = await axios.get(SERVICE.MODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const moduleall = [
        ...subPro?.data?.modules.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setModule(moduleall);
      setModules(subPro?.data?.modules);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function...
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let submodules = await axios.post(SERVICE.SUBMODULE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        subproject: String(selectedSubproject),
        module: String(selectedModule),
        name: String(isChecked ? checkvalue : submodule.name),
        estimation: String(submodule.estimation),
        estimationtime: String(submodule.estimationtime),
        endpage: String(endPage),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setSubmodule({
        ...submodule,
        name: "",
        estimation: 0,
        estimationtime: "",
      });
      await fetchAllSubModule();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let difference = [];
  let ans = 0;
  let timeDiffs = 0;

  //calculate time difference between the Selectd projects
  const fetchTimeDiffCal = async () => {
    setPageName(!pageName);
    try {
      let sub_proj_time = submodules?.map((data) => {
        if (selectedModule === data.module && selectedProject === data.project && selectedSubproject === data.subproject) {
          if (data.estimationtime === "Month") {
            difference.push((Number(data.estimation) / 12) * (365 * 24));
          } else if (data.estimationtime === "Year") {
            difference.push(Number(data.estimation) * 365 * 24);
          } else if (data.estimationtime === "Days") {
            difference.push(Number(data.estimation) * 24);
          } else if (data.estimationtime === "Hour") {
            difference.push(Number(data.estimation));
          }
          ans = difference.reduce((acc, cur) => acc + cur);
          setTimeCalculation(ans);
        }
      });

      let project_check = modules?.map((value) => {
        if (selectedModule === value.name && selectedProject === value.project && selectedSubproject === value.subproject) {
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
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchCalculRemaining = (estType) => {
    if (estType === "Month") {
      setTypeEst(((timeDiffCal - timeCalculation) / (24 * 30.41)).toFixed(2));
    } else if (estType === "Year") {
      setTypeEst(((timeDiffCal - timeCalculation) / (365 * 24)).toFixed(2));
    } else if (estType === "Days") {
      setTypeEst(((timeDiffCal - timeCalculation) / 24).toFixed(2));
    } else if (estType === "Hour") {
      setTypeEst((timeDiffCal - timeCalculation).toFixed(2));
    }
  };

  let differenceEdit = [];
  let ansEdit = 0;
  let timeDiffsEdit = 0;

  //Edit Page Functionality for Estimation Time
  const fetchEditEstTime = async () => {
    setPageName(!pageName);
    try {
      let sub_Project = editProjDropdwon ? editProjDropdwon : rowEditTime?.module;
      let submodproject = editProjDropdwonproj ? editProjDropdwonproj : rowEditTime?.project;
      let submodsubproject = editProjDropdwonsubproj ? editProjDropdwonsubproj : rowEditTime?.subproject;

      let sub_proj_time = submodules?.filter((data) => {
        if (sub_Project === data.module && submodproject === data.project && submodsubproject === data.subproject) {
          if (data.estimationtime === "Month") {
            differenceEdit.push((Number(data.estimation) / 12) * 365);
          } else if (data.estimationtime === "Year") {
            differenceEdit.push(Number(data.estimation) * 365);
          } else if (data.estimationtime === "Days") {
            differenceEdit.push(Number(data.estimation));
          } else if (data.estimationtime === "Hour") {
            differenceEdit.push(Number(data.estimation) / 24);
          }
          ansEdit = differenceEdit.reduce((acc, cur) => acc + cur);
          setEditTimeCalculation(ansEdit);
        }
        //  else if (sub_Project != data.module) {
        //   setEditTimeCalculation(ansEdit);
        // }
      });

      let project_check = moduleEditList?.map((value) => {
        if (sub_Project === value.name && submodproject === value.project && submodsubproject === value.subproject) {
          if (value.estimationtime === "Month") {
            timeDiffsEdit = (Number(value.estimation) / 12) * 365;
            setRowEditTimeProj(timeDiffsEdit);
          } else if (value.estimationtime === "Year") {
            timeDiffsEdit = Number(value.estimation) * 365;
            setRowEditTimeProj(timeDiffsEdit);
          } else if (value.estimationtime === "Days") {
            setRowEditTimeProj(Number(value.estimation));
          } else if (value.estimationtime === "Hour") {
            setRowEditTimeProj(Number(value.estimation) / 24);
          }
        }
        // else if(sub_Project != value.name ) {
        //   setRowEditTimeProj(0);
        // }
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchEditEstimationType = async () => {
    let estimatType = getEstitype ? getEstitype : rowEditTime.estimationtime;

    if (rowEditTime.estimationtime === "Month") {
      if (estimatType === "Month") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 30.41).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 30.41);
        setEditCalOverall(remaining + " months Remaining ");
      } else if (estimatType === "Days") {
        let remaining = (rowEditTimeProj - editTimeCalculation).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) * 30.41 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " years Remaining");
      } else if (estimatType === "Hour") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) * 24).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) * 24 + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " Hours Remaining");
      }
    } else if (rowEditTime.estimationtime === "Days") {
      if (estimatType === "Month") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 30).toFixed(2).toString().split(".");
        let rem = ((rowEditTimeProj - editTimeCalculation) % 25).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) / 30.41 + (rowEditTimeProj - editTimeCalculation) / 30.41);
        setEditCalOverall(remaining[0] + " months Remaining");
      } else if (estimatType === "Days") {
        let remaining = (rowEditTimeProj - editTimeCalculation).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " years Remaining");
      } else if (estimatType === "Hour") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) * 24).toFixed(2);
        setConditionTiming(Number(rowEditTime.estimation) * 24 + (rowEditTimeProj - editTimeCalculation) * 24);
        setEditCalOverall(remaining + " Hours Remaining");
      }
    } else if (rowEditTime.estimationtime === "Year") {
      if (estimatType === "Month") {
        let remaining = (((rowEditTimeProj - editTimeCalculation) / 365) * 12).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) * 12 + ((rowEditTimeProj - editTimeCalculation) / 365) * 12);
        setEditCalOverall(remaining[0] + " Months Remaining");
      } else if (estimatType === "Days") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) * 365).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) * 365 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " years Remaining");
      } else if (estimatType === "Hour") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) * 365 * 24).toFixed(2);
        setConditionTiming(Number(rowEditTime.estimation) * 365 * 24 + (rowEditTimeProj - editTimeCalculation) * 365 * 24);
        setEditCalOverall(remaining + " Hours Remaining");
      }
    } else if (rowEditTime.estimationtime === "Hour") {
      if (estimatType === "Month") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 30.41).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) / (24 * 30.41) + (rowEditTimeProj - editTimeCalculation) / 30.41);
        setEditCalOverall(remaining[0] + " Months Remaining");
      } else if (estimatType === "Days") {
        let remaining = (rowEditTimeProj - editTimeCalculation).toFixed(2).toString();
        setConditionTiming(Number(rowEditTime.estimation) / 24 + (rowEditTimeProj - editTimeCalculation));
        setEditCalOverall(remaining + " days Remaining");
      } else if (estimatType === "Year") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) / 365).toFixed(2).toString().split(".");
        setConditionTiming(Number(rowEditTime.estimation) / (24 * 365) + (rowEditTimeProj - editTimeCalculation) / 365);
        setEditCalOverall(remaining[0] + " years Remaining");
      } else if (estimatType === "Hour") {
        let remaining = ((rowEditTimeProj - editTimeCalculation) * 24).toFixed(2);
        setConditionTiming(Number(rowEditTime.estimation) + (rowEditTimeProj - editTimeCalculation) * 24);
        setEditCalOverall(remaining + " Hours Remaining");
      }
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = submodules.some((item) => item.project === selectedProject && item.subproject === selectedSubproject && item.module === selectedModule && item.name?.toLowerCase() === submodule.name?.toLowerCase());
    if (selectedProject === "" || selectedProject == "Please Select Project") {
      setPopupContentMalert("Please Select Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedSubproject === "" || selectedSubproject == "Please Select Subproject") {
      setPopupContentMalert("Please Select Subproject Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedModule === "" || selectedModule == "Please Select Module") {
      setPopupContentMalert("Please Select Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (submodule.name === "") {
      setPopupContentMalert("Please Enter Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (submodule.estimationtime === "") {
      setPopupContentMalert("Please Select Estimation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (submodule.estimation === "") {
      setPopupContentMalert("Please Enter Estimation Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if ((submodule.estimation <= 0) || (typeEst < submodule.estimation)) {
      setPopupContentMalert(`Please Enter a valid Estimation Time`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (submodule.estimation > typeEst) {
      setPopupContentMalert(`Please enter less or equal to ${typeEst} ${submodule.estimationtime}`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("SubModule Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //cancel for create section
  const handleclear = () => {
    setSubmodule({ name: "", estimation: "", estimationtime: "" });
    setEndPage('notend')
    setSelectedProject("Please Select Project");
    setSelectedSubproject("Please Select Subproject");
    setSelectedModule("Please Select Module");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //id for login...
  let authToken = localStorage.APIToken;
  const [updateby, setUpdateby] = useState([]);

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSubmoduleid(res?.data?.ssubmodule);
      setUpdateby(res?.data?.ssubmodule.updatedby);
      setRowGetid(res?.data?.ssubmodule);
      setTypeCheck(res?.data?.ssubmodule?.estimationtime);
      setRowEditTime(res?.data?.ssubmodule);
      setEndPageEdit(res?.data?.ssubmodule?.endpage);
      setSelectedProjectedit(res?.data?.ssubmodule?.project);
      setSelectedSubprojectedit(res?.data?.ssubmodule?.subproject);
      setSelectedModuleedit(res?.data?.ssubmodule?.module);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSubmoduleid(res?.data?.ssubmodule);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSubmoduleid(res?.data?.ssubmodule);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let addedby = submoduleid?.addedby;

  let submoduletsid = getrowid?._id;

  const [relatedCountEdit, setRelatedCountEdit] = useState(0);
  const errorPopupFuncEdit = async (e) => {
    setPageName(!pageName);
    try {
      let todoEditPages = e?.length > 0 ? e.map((d) => d.page) : "";
      let lastIndex = todoEditPages.sort();
      let pageName = lastIndex[lastIndex.length - 1];
      let dataName = e.filter((d) => pageName === d.page);
      let res = await axios.post(`${SERVICE.SUBMODULETASKCHECKEDIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: pageName,
        name: String(dataName[0].name),
      });
      setRelatedCountEdit(res.data.count);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${submoduletsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: String(selectedProjectedit),
        subproject: String(selectedSubprojectedit),
        module: String(selectedModuleedit),
        name: String(submoduleid.name),
        estimation: String(submoduleid.estimation),
        estimationtime: String(submoduleid.estimationtime),
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllSubModule();
      await fetchSubModuleAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchSubModuleAll();
    const isNameMatch = allSubmoduleedit.some((item) => item.name.toLowerCase() === submoduleid.name.toLowerCase() && item.project === selectedProjectedit && item.subproject === selectedSubprojectedit && item.module === selectedModuleedit);
    if (selectedProjectedit === "") {
      setPopupContentMalert("Please Select Project Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedSubprojectedit === "" || selectedSubprojectedit == "Please Select SubProject" || selectedSubprojectedit == "Please Select Subproject") {
      setPopupContentMalert("Please Select Subproject Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedModuleedit === "" || selectedModuleedit == "Please Select Module") {
      setPopupContentMalert("Please Select Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (submoduleid.name === "" && !isChecked) {
      setPopupContentMalert("Please Enter Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if ((Number(submoduleid.estimation) <= 0) || (Number(editCalOverall) < Number(submoduleid.estimation))) {
      setPopupContentMalert(`Please Enter a valid Estimation Time`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("SubModule Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTimeDiffCal();
    fetchProjectDropdowns();
    fetchSubProjectDropdowns();
    fetchEditEstimationType();
  }, [submoduleid, submodule]);

  useEffect(() => {
    // fetchCalculRemaining();
    fetchEditEstTime();
  }, [editProjDropdwon,editProjDropdwonproj,rowEditTime]);

  // useEffect(() => {
  //   // fetchCalculRemaining();
  //   fetchEditEstimationType();
  // }, [editProjDropdwon,editProjDropdwonproj,rowEditTime,getEstitype]);
  useEffect(() => {
    // fetchCalculRemaining();
    fetchEditEstimationType();
  }, [getEstitype,submodules]);

  useEffect(() => {
    fetchAllSubModule();
  }, [isEditOpen, submodule, submoduleid]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = submodules?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      estimateTime: item.estimation + " " + item.estimationtime,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [submodules]);

  useEffect(() => {
    fetchAllSubModule();
    fetchProjectDropdowns();
    fetchSubModuleAll();
    fetchModuleDropdowns();
  }, []);

  useEffect(() => {
    fetchProjectDropdowns();
    fetchModuleEditDropDown();
    fetchSubModuleAll();
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

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "project", headerName: "Project Name", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "subproject", headerName: "Subproject Name", flex: 0, width: 200, hide: !columnVisibility.subproject, headerClassName: "bold-header" },
    { field: "module", headerName: "Module Name", flex: 0, width: 200, hide: !columnVisibility.module, headerClassName: "bold-header" },
    { field: "name", headerName: "Submodule Name", flex: 0, width: 200, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "estimateTime", headerName: "Estimation Time", flex: 0, width: 200, hide: !columnVisibility.estimateTime, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("esubmodule") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dsubmodule") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                handleClickOpen();
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vsubmodule") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("isubmodule") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      project: item.project,
      subproject: item.subproject,
      module: item.module,
      name: item.name,
      estimateTime: item.estimation + " " + item.estimationtime,
    };
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
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: "relative", margin: "10px" }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "SubModule",
    pageStyle: "print",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  return (
    <Box>
      <Headtitle title={"SUB MODULE"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}> SubModule </Typography> */}
      <PageHeading
        title="SubModule"
        modulename="Projects"
        submodulename="Sub Module"
        mainpagename="Sub Module"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("asubmodule") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>Add SubModule</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects options={project} styles={colourStyles} value={{ label: selectedProject, value: selectedProject }} onChange={handleProjectChange} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Project <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={subproject
                        ?.filter((subpro) => subpro.project === selectedProject)
                        .map((subpro) => ({
                          ...subpro,
                          label: subpro.name,
                          value: subpro.name,
                        }))}
                      styles={colourStyles}
                      value={{
                        label: selectedSubproject,
                        value: selectedSubproject,
                      }}
                      onChange={(e) => {
                        setSelectedSubproject(e.value);
                        setSelectedModule("Please Select Module");
                        setSubmodule({
                          ...submodule,
                          name: '',
                          estimation: '',
                          estimationtime: "",
                        });
                        setEndPage('notend');
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
                      options={filteredSubCategories}
                      styles={colourStyles}
                      value={{ label: selectedModule, value: selectedModule }}
                      onChange={(e) => {
                        setSelectedModule(e.value);
                        fetchTimeDiffCal();
                        setSubmodule({
                          ...submodule,
                          estimation: 0,
                          estimationtime: "",
                        });
                        setEndPage('notend');
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={submodule.name}
                      onChange={(e) => {
                        setSubmodule({ ...submodule, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation<b style={{ color: "red" }}>*</b>
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
                        value={submodule.estimationtime}
                        onChange={(e) => {
                          setSubmodule({
                            ...submodule,
                            estimationtime: e.target.value,
                          });
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select
                        </MenuItem>
                        <MenuItem value="Hour" onClick={() => fetchCalculRemaining("Hour")}> {"Hour"} </MenuItem>
                        <MenuItem value="Days" onClick={() => fetchCalculRemaining("Days")}>
                          {" "}
                          {"Days"}{" "}
                        </MenuItem>
                        <MenuItem value="Month" onClick={() => fetchCalculRemaining("Month")}>
                          {" "}
                          {"Month"}{" "}
                        </MenuItem>
                        <MenuItem value="Year" onClick={() => fetchCalculRemaining("Year")}>
                          {" "}
                          {"Year"}{" "}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={submodule.estimation}
                          onChange={(e) => {
                            setSubmodule({
                              ...submodule,
                              estimation: Number(e.target.value) > typeEst ? "" : Number(e.target.value) > 0 ? Number(e.target.value) : "",
                            });
                          }}
                        />
                        {submodule.estimationtime ? (
                          <Typography sx={{ color: "red" }}>
                            {" "}
                            {typeEst} {submodule.estimationtime} is Remaining{" "}
                          </Typography>
                        ) : (
                          " "
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Page Status </Typography>
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
                      value={endPage}
                      onChange={(e) => {
                        setEndPage(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="notend"> {"Not End"} </MenuItem>
                      <MenuItem value="end"> {"End"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br />

              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    SUBMIT
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
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
              <Typography sx={userStyle.SubHeaderText}>Edit SubModule</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={project}
                      styles={colourStyles}
                      value={{
                        label: selectedProjectedit,
                        value: selectedProjectedit,
                      }}
                      onChange={(e) => {
                        setSelectedProjectedit(e.value);
                        setEditProjDropdownproj(e.value);
                        setSelectedSubprojectedit("Please Select Subproject");
                        setSelectedModuleedit("Please Select Module");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Subproject<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={filteredCategoriesEdit}
                      styles={colourStyles}
                      value={{
                        label: selectedSubprojectedit,
                        value: selectedSubprojectedit,
                      }}
                      onChange={(e) => {
                        setSelectedSubprojectedit(e.value);
                        setEditProjDropdownsubproj(e.value);
                        setSelectedModuleedit("Please Select Module");
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* } */}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Module<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={filteredSubCategoriesEdit}
                      styles={colourStyles}
                      value={{
                        label: selectedModuleedit,
                        value: selectedModuleedit,
                      }}
                      onChange={(e) => {
                        setSelectedModuleedit(e.value);
                        setEditProjDropdown(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={submoduleid.name}
                      onChange={(e) => {
                        setSubmoduleid({
                          ...submoduleid,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Estimation<b style={{ color: "red" }}>*</b>
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
                        value={submoduleid.estimationtime}
                        onChange={(e) => {
                          setSubmoduleid({
                            ...submoduleid,
                            estimationtime: e.target.value,
                            estimation: 0
                          });

                          // fetchEditTimeCal(e.target.value);
                        }}
                      >
                        <em>
                          <MenuItem value="Please Select"> {"Please Select"} </MenuItem>
                        </em>
                        <MenuItem
                          value="Hour"
                          onClick={(e) => {
                            // fetchCalculRemaining("Hour");
                            setGetEstiType("Hour");
                          }}
                        >
                          {" "}
                          {"Hour"}{" "}
                        </MenuItem>
                        <MenuItem
                          value="Days"
                          onClick={(e) => {
                            // fetchCalculRemaining("Days");
                            setGetEstiType("Days");
                          }}
                        >
                          {" "}
                          {"Days"}{" "}
                        </MenuItem>
                        <MenuItem
                          value="Month"
                          onClick={(e) => {
                            // fetchCalculRemaining("Month");
                            setGetEstiType("Month");
                          }}
                        >
                          {" "}
                          {"Month"}{" "}
                        </MenuItem>
                        <MenuItem
                          value="Year"
                          onClick={(e) => {
                            // fetchCalculRemaining("Year");
                            setGetEstiType("Year");
                          }}
                        >
                          {" "}
                          {"Year"}{" "}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <br />
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={submoduleid.estimation}
                          onChange={(e) => {
                            setSubmoduleid({
                              ...submoduleid,
                              estimation: Number(e.target.value) > Number(conditionTiming) ? " " : Number(e.target.value),
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Typography sx={{ color: "red" }}> {editCalOverall}</Typography>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Page Status </Typography>

                    <OutlinedInput id="component-outlined" type="text" value={endPageEdit === "end" ? "End" : endPageEdit === "notend" ? "Not End" : endPageEdit} />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
        {isUserRoleCompare?.includes("lsubmodule") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              {/*       
          <Box sx={userStyle.container} > */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>SubModule List</Typography>
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
                      {isUserRoleCompare?.includes("excelsubmodule") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            fetchAllSubModule()
                            setFormat("xl")
                          }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvsubmodule") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            fetchAllSubModule()
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printsubmodule") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint /> &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdfsubmodule") && (
                        <>
                          <Button sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true)
                              fetchAllSubModule()
                            }}
                          ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imagesubmodule") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                        </Button>
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
                        sx={{
                          "@media only screen and (max-width: 500px) and (min-width: 100px)": {
                            fontSize: "12px !important",
                            height: "30px",
                            width: "inherit",
                            marginRight: "50px",
                            padding: "10px",
                          },
                        }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        {/* <MenuItem value={submodules?.length}>All</MenuItem> */}
                      </Select>
                    </Box>
                    <Box>
                      <FormControl fullWidth size="small">
                        <Typography>Search</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          sx={{
                            "@media only screen and (max-width: 500px) and (min-width: 100px)": {
                              fontSize: "12px !important",
                              height: "30px",
                              width: "inherit",
                              marginRight: "50px",
                              padding: "10px",
                            },
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <br />
                  <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                    Show All Columns
                  </Button>
                  &ensp;
                  <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                    Manage Columns
                  </Button>
                  &ensp;
                  <br />
                  <br />
                  {/* ****** Table Grid Container ****** */}
                  {/* ****** Table start ****** */}
                  <Box
                    style={{
                      width: "100%",
                      overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                  >
                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                    </Box>
                    <Box>
                      <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                        <FirstPageIcon />
                      </Button>
                      <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                        <NavigateBeforeIcon />
                      </Button>
                      {pageNumbers?.map((pageNumber) => (
                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                          {pageNumber}
                        </Button>
                      ))}
                      {lastVisiblePage < totalPages && <span>...</span>}
                      <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                        <NavigateNextIcon />
                      </Button>
                      <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                        <LastPageIcon />
                      </Button>
                    </Box>
                  </Box>
                  {/* ****** Table End ****** */}
                </>
              )}
            </Box>
          </>
        )}
      </>
      {/* ****** Table End ****** */}

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>
      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>View SubModule </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project Name</Typography>
                  <Typography>{submoduleid.project}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subproject Name</Typography>
                  <Typography>{submoduleid.subproject}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Module Name</Typography>
                  <Typography>{submoduleid.module}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Submodule Name</Typography>
                  <Typography>{submoduleid.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Estimation Time</Typography>
                  <Typography>{submoduleid.estimation + " " + submoduleid.estimationtime}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseview}>
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
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={"SubModule"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="SubModule Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delSubModule}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}

    </Box>
  );
}

export default Submodule;