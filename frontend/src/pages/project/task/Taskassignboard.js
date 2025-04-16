import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, Checkbox, List, ListItem, ListItemText, IconButton, Popover, TextField, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Selects from "react-select";
import "jspdf-autotable";
import Switch from "@mui/material/Switch";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import CloseIcon from "@mui/icons-material/Close";
import Taskeditmodel from "./taskeditmodel";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { saveAs } from "file-saver";
import ImageIcon from '@mui/icons-material/Image';
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";

function FacebookCircularProgress(props) {
  return (
    <Box style={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        style={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        style={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function Taskassigned() {

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

  let exportColumnNames = ['Task Name', 'TaskId', 'Phase', 'Project', 'SubProject', 'Module', 'SubModule', 'Mainpage', 'Subpage'];
  let exportRowValues = ['taskname', 'taskid', 'phase', 'project', 'subproject', 'module', 'submodule', 'mainpage', 'subpage'];

  const gridRef = useRef(null);
  const [subpagefive, setSubpagefive] = useState([]);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Task Notassigned Board.png');
        });
      });
    }
  };

  const [isloader, setIsLoader] = useState(false);
  const [deleteTaskDetail, setDeleteTaskDetail] = useState({});
  const [workOrderDelt, setWorkOrderDelt] = useState({});
  const [project, setProject] = useState([]);
  const [subProject, setSubProject] = useState([]);
  const [module, setModule] = useState([]);
  const [subModule, setSubModule] = useState([]);
  const [mainpageTypeDropdown, setMainpageTypeDropdown] = useState([]);
  const [subpageTypeDropdown, setSubpageTypeDropdown] = useState([]);
  const [subsubpageTypeDropdown, setsubSubpageTypeDropdown] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedSubProject, setSelectedSubProject] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedSubModule, setSelectedSubModule] = useState([]);
  const [selectedMainpage, setSelectedMainpage] = useState([]);
  const [selectedSubpage, setSelectedSubpage] = useState([]);
  const [selectedSubSubpage, setSelectedSubSubpage] = useState([]);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedUnit, setSelectedUnit] = useState("Please Select Unit");
  const [selectedTeam, setSelectedTeam] = useState("Please Select Team");
  const [selectedResperson, setSelectedResperson] = useState("Please Select Responsibleperson");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [githublink, setGithublink] = useState("");
  const [editTime, seteditTime] = useState("");
  const [editTimetype, seteditTimetype] = useState("");
  const [checkpoinstUI, setCheckpoinstUI] = useState([]);
  const [checkpoinstDev, setCheckpoinstDev] = useState([]);
  const [checkpointsUiTesting, setCheckpointsUiTesting] = useState([]);
  const [checkpointsDevTesting, setCheckpointsDevTesting] = useState([]);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [workOrder, setWorkOrder] = useState({
    assignby: "",
    assignmode: "Auto",
    assigndate: "",
    team: "",
    branch: "",
    unit: "",
    resperson: "",
    calculatedtime: "",
  });

  // const array = ["arr1" ,"arr2", "arr3"];
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  //DATATBLE
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  //UI table checkboxselection
  const [selectedRowsuipopup, setSelectedRowsuipopup] = useState([]);
  const [selectAllCheckeduipopup, setSelectAllCheckeduipopup] = useState(false);
  //dev table checkboxselection
  const [selectedRowsdevpopup, setSelectedRowsdevpopup] = useState([]);
  const [selectAllCheckeddevpopup, setSelectAllCheckeddevpopup] = useState(false);
  //testingpopup table checkboxselection
  const [selectedRowstestdevpopup, setSelectedRowstestdevpopup] = useState([]);
  const [selectAllCheckedtestdevpopup, setSelectAllCheckedtestdevpopup] = useState(false);
  const [selectedRowstestuipopup, setSelectedRowstestuipopup] = useState([]);
  const [selectAllCheckedtestuipopup, setSelectAllCheckedtestuipopup] = useState(false);
  const { isUserRoleAccess, pageName, setPageName} = useContext(UserRoleAccessContext);
  // const username = isUserRoleAccess.username;
  const companyname = isUserRoleAccess.companyname;

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsErrorOpen(false);
  };

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsDeleteOpen(false);
  };

  // UIDESIGN ASSIGN model
  const [isUIdesignAssign, setIsUIdesignAssign] = useState(false);
  // Delete model
  const handleClickOpenUIdesignAssign = () => {
    setIsUIdesignAssign(true);
  };

  const handleCloseUIdesignAssign = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsUIdesignAssign(false);
    setSelectedRowsuipopup([]);
    setSelectAllCheckeduipopup(false);
    setGithublink("");
    setSelectedBranch("Please Select Branch");
    setSelectedUnit("Please Select Unit");
    setSelectedTeam("Please Select Team");
    setSelectedResperson("Please Select Responsibleperson");
    seteditTime("");
    seteditTimetype("");
    setSelectedRows([]);
    setSelectAllChecked(false);
    setSelectedPriority("Please Select Priority");
  };

  // DEV ASSIGN model
  const [isDevAssign, setIsDevAssign] = useState(false);
  // Delete model
  const handleClickOpenDevAssign = () => {
    setIsDevAssign(true);
  };
  const handleCloseDevAssign = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsDevAssign(false);
    setSelectAllCheckeddevpopup(false);
    setSelectedRowsdevpopup([]);
    setSelectedBranch("Please Select Branch");
    setSelectedUnit("Please Select Unit");
    setSelectedTeam("Please Select Team");
    setSelectedResperson("Please Select Responsibleperson");
    seteditTime("");
    seteditTimetype("");
    setSelectedRows([]);
    setSelectAllChecked(false);
    setSelectedPriority("Please Select Priority");
  };

  // TESTING ASSIGN model
  const [isTestAssign, setIsTestAssign] = useState(false);
  // Delete model
  const handleClickOpenTestAssign = () => {
    setIsTestAssign(true);
  };
  const handleCloseTestAssign = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsTestAssign(false);
    setSelectAllCheckedtestuipopup(false);
    setSelectedRowstestuipopup([]);
    setSelectAllCheckedtestdevpopup(false);
    setSelectedRowstestdevpopup([]);
    setSelectedBranch("Please Select Branch");
    setSelectedUnit("Please Select Unit");
    setSelectedTeam("Please Select Team");
    setSelectedResperson("Please Select Responsibleperson");
    seteditTime("");
    seteditTimetype("");
    setSelectedRows([]);
    setSelectAllChecked(false);
    setSelectedPriority("Please Select Priority");
  };

  const { auth } = useContext(AuthContext);

  const [taskdeletepagename, setTaskDeletepagename] = useState();
  const [taskdeletepageid, setTaskdeletepageid] = useState();

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
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
  const [copiedData, setCopiedData] = useState("");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    allotedstatus: true,
    taskassignboardliststatus: true,
    taskname: true,
    taskid: true,
    phase: true,
    project: true,
    subproject: true,
    module: true,
    submodule: true,
    mainpage: true,
    subpage: true,
    name: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //get all role list details
  const fetchSubpageFive = async () => {
    setPageName(!pageName);
    try {
      let res_sub = await axios.get(SERVICE.NOTTASKASSIGN_BOARD_LIST_TABLEDATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSubpagefive(res_sub?.data?.taskAssignBoardList);
      setIsLoader(true);
    } catch (err) { setIsLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (selectedProject.length === 0 && selectedSubProject.length === 0) {
      setPopupContentMalert("Please choose Any one filter");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setIsLoader(false);
      FilterSubmit();
    }
  };

  //get all role list details
  const FilterSubmit = async () => {
    setPageName(!pageName);
    try {
      let res_sub = await axios.post(SERVICE.TASKASSIGN_BOARD_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: selectedMainpage.map((item) => item.value),
        subpage: selectedSubpage.map((item) => item.value),
        subsubpage: selectedSubSubpage.map((item) => item.value),
      });
      setPage(1);
      setSubpagefive(res_sub?.data?.taskAssignBoardList);
      setIsLoader(true);
    } catch (err) { setIsLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setIsLoader(false);
    setCheckpoinstUI([]);
    setSelectedRows([]);
    setSelectAllChecked(false);
    setSelectedProject([]);
    setSelectedSubProject([]);
    setSelectedModule([]);
    setSelectedSubModule([]);
    setSelectedMainpage([]);
    setSelectedSubpage([]);
    setSelectedSubSubpage([]);
    try {
      let res_sub = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSubpagefive(res_sub?.data?.taskAssignBoardList);
      setIsLoader(true);
    } catch (err) { setIsLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Project for Dropdowns
  const fetchSubProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.SUBPROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubProject(
        res?.data?.subprojects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.MODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModule(
        dropModule?.data?.modules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchsubModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.SUBMODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubModule(
        dropModule?.data?.submodules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Main Page Dropdowns
  const fetchPagetypeMainDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_MAIN_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: e.map((item) => item.value),
      });
      setMainpageTypeDropdown(
        res?.data?.pagetypemain?.map((d) => ({
          ...d,
          label: d.mainpage,
          value: d.mainpage,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUBPAGE_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedModule.map((item) => item.value),
        mainpage: e.map((item) => item.value),
      });
      setSubpageTypeDropdown(
        res?.data?.pagetypesub?.map((d) => ({
          ...d,
          label: d.subpage,
          value: d.subpage,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUBSUBPAGE_DROP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject,
        subproject: selectedSubProject,
        module: selectedModule,
        submodule: selectedModule,
        mainpage: selectedMainpage,
        subpage: e,
      });
      setsubSubpageTypeDropdown(
        res?.data?.pagetypesub?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchBranches = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranches(
        res_project?.data?.branch?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchUnits = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnits(
        res_project?.data?.units?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTeams = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeams(
        res_project?.data?.teamsdetails?.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchUsers = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.USERALLLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUsers(
        res_project?.data?.users?.map((d) => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchPriorities = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PRIORITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPriorities(
        res_project?.data?.priorities?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchBranches();
    fetchUnits();
    fetchTeams();
    fetchUsers();
    fetchPriorities();
  }, [checkpoinstUI, checkpoinstDev, checkpointsDevTesting]);

  //set function to get particular row to Delete
  const rowData = async (id, pageid, pagename) => {
    let res = await axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    setTaskDeletepagename(pagename);
    setTaskdeletepageid(pageid);
    setDeleteTaskDetail(id);
    setWorkOrderDelt();
    handleClickOpen();
    let result = res?.data?.staskAssignBoardList?.workorders?.map((d) => {
      return d._id;
    });
    setWorkOrderDelt(result);
  };

  //project handlechange
  const handleChangeproject = (options) => {
    setSelectedProject(options);
    setSelectedSubProject([]);
    setSelectedModule([]);
    setSelectedSubModule([]);
  };

  const customValueRendererproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select project";
  };
  //subproject handlechange
  const handleChangesubproject = (options) => {
    setSelectedSubProject(options);
    setSelectedModule([]);
    setSelectedSubModule([]);
  };

  const customValueRenderersubproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subproject";
  };
  // modulechandlechange
  const handleChangemodule = (options) => {
    setSelectedModule(options);
    setSelectedSubModule([]);
  };

  const customValueRenderermodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Module";
  };

  // submodulechandlechange
  const handleChangesubmodule = (options) => {
    setSelectedSubModule(options);
    fetchPagetypeMainDropdowns(options);
  };

  const customValueRenderersubmodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select SubModule";
  };

  // mainpage chandlechange
  const handleChangemainpage = (options) => {
    setSelectedMainpage(options);
    fetchPagetypeSubPageDropdowns(options);
  };

  const customValueRenderermainpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Mainpage";
  };
  // subpagechandlechange
  const handleChangesubpage = (options) => {
    setSelectedSubpage(options);
  };

  const customValueRenderersubpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subpage";
  };

  let deleteid = deleteTaskDetail;

  // Alert delete popup
  const deleteDetail = async (e) => {
    setPageName(!pageName);
    try {
      await axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE_WORKORDER_DELETE}/${deleteid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      await fetchSubpageFive();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = subpagefive?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      id: `${item._id}_${item.phase}`,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [subpagefive]);


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Task Notassigned Board",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchSubpageFive();
  }, [isUIdesignAssign]);

  useEffect(() => {
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchSubProjectDropdowns();
  }, [selectedProject]);

  useEffect(() => {
    fetchModuleDropdowns();
  }, [selectedProject, selectedSubProject]);

  useEffect(() => {
    fetchsubModuleDropdowns();
  }, [selectedProject, selectedSubProject, selectedModule]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

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
    {
      field: "allotedstatus",
      headerName: "Alloted Status", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderCell: (params) => (
        <Grid>
          <Typography style={{ background: "#f82c2ceb", width: "max-content", borderRadius: "14px", color: "white", padding: "0px 5px" }} variant="subtitle2">
            {"Not Alloted"}
          </Typography>
        </Grid>
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 120,
      hide: !columnVisibility.allotedstatus,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 80,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center !important" }}>
          {params.row.taskassignboardliststatus === "assigned" ? (
            <>
              <Taskeditmodel sx={{ display: "flex", justifyContent: "center" }} idval={params.row._id} />
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.row._id, params.row.taskpageid, params.row.taskpagename);
                }}
              >
                <FaTrash color="#ad4848" />
              </Button>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {/* <Link to={`/project/taskassignboardlistcreate/${params.row._id}`}>
                <div style={{ fontSize: "20px", color: "#1976d2" }}>
                  <AddCircleOutlineIcon />
                </div>
              </Link> */}
            </Box>
          )}
        </Box>
      ),
    },
    { field: "taskname", headerName: "Task Name", flex: 0, width: 250, hide: !columnVisibility.taskname, headerClassName: "bold-header" },
    { field: "taskid", headerName: "Task ID", flex: 0, width: 250, hide: !columnVisibility.taskid, headerClassName: "bold-header" },
    { field: "phase", headerName: "Phase", flex: 0, width: 150, hide: !columnVisibility.phase, headerClassName: "bold-header" },
    { field: "project", headerName: "Project Name", flex: 0, width: 150, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "subproject", headerName: "SubProject Name", flex: 0, width: 150, hide: !columnVisibility.subproject, headerClassName: "bold-header" },
    { field: "module", headerName: "Module", flex: 0, width: 150, hide: !columnVisibility.module, headerClassName: "bold-header" },
    { field: "submodule", headerName: "SubModule", flex: 0, width: 150, hide: !columnVisibility.submodule, headerClassName: "bold-header" },
    { field: "mainpage", headerName: "Mainpage", flex: 0, width: 150, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
    { field: "subpage", headerName: "Subpage", flex: 0, width: 150, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      allotedstatus: item.allotedstatus,
      taskassignboardliststatus: item.taskassignboardliststatus,
      taskname: item.taskname,
      taskid: item.taskid,
      phase: item.phase,
      project: item.project,
      subproject: item.subproject,
      module: item.module,
      submodule: item.submodule,
      mainpage: item.mainpage,
      subpage: item.subpage,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row, index) => ({
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

  //selected alla nd check selection functionality
  const handleCheckboxChange = (id) => {
    let updatedSelectedRows;
    if (selectedRows.includes(id)) {
      updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRows, id];
    }

    setSelectedRows(updatedSelectedRows);
    // Update the "Select All" checkbox based on whether all rows are selected
    setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([]);
      setSelectAllChecked(false);
    } else {
      const allRowIds = filteredData.map((row) => row.id);
      setSelectedRows(allRowIds);
      setSelectAllChecked(true);
    }
  };

  const assignWorkorderAllot = async () => {
    let checkMatch = selectedRows.map((item) => item.split("_")[1]);
    let getIDs = selectedRows.map((item) => item.split("_")[0]);

    if (selectedRows.length === 0) {
      setPopupContentMalert("Please Choose any row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkMatch.some((item) => item !== "UI")) {
      setPopupContentMalert("Please Choose same Phase");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      try {
        const requests = getIDs.map((item) => {
          return axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
        const responses = await Promise.all(requests);
        let data = responses.map((item) => item.data.staskAssignBoardList);
        setCheckpoinstUI(data);
        handleClickOpenUIdesignAssign();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
  };

  //selected alla nd check selection functionality for UI POPUP
  const handleCheckboxChangeuipopup = (id) => {
    let updatedSelectedRows;
    if (selectedRowsuipopup?.includes(id)) {
      updatedSelectedRows = selectedRowsuipopup.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRowsuipopup, id];
    }
    setSelectedRowsuipopup(updatedSelectedRows);
    setSelectAllCheckeduipopup(updatedSelectedRows.length === checkpoinstUI.map((item) => item.uidesign?.map((item, i) => item)).reduce((accumulator, currentArray) => accumulator.concat(currentArray), []).length);
  };

  const handleSelectAlluipopup = () => {
    if (selectAllCheckeduipopup) {
      setSelectedRowsuipopup([]);
      setSelectAllCheckeduipopup(false);
    } else {
      const allRowIds = checkpoinstUI
        .map((item) => item.uidesign?.map((item, i) => item, "checkpoinstUI"))
        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
        .map((row) => row._id);
      setSelectedRowsuipopup(allRowIds);
      setSelectAllCheckeduipopup(true);
    }
  };

  const assignDevWorkorderAllot = async () => {
    let checkMatch = selectedRows.map((item) => item.split("_")[1]);
    let getIDs = selectedRows.map((item) => item.split("_")[0]);

    if (selectedRows.length === 0) {
      setPopupContentMalert("Please Choose any row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkMatch.some((item) => item !== "Development")) {
      setPopupContentMalert("Please Choose same Phase");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      try {
        const requests = getIDs.map((item) => {
          return axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
        const responses = await Promise.all(requests);
        let data = responses.map((item) => item.data.staskAssignBoardList);
        setCheckpoinstDev(data);
        handleClickOpenDevAssign();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
  };

  //selected alla nd check selection functionality for Develop POPUP
  const handleCheckboxChangedevpopup = (id) => {
    let updatedSelectedRows;
    if (selectedRowsdevpopup?.includes(id)) {
      updatedSelectedRows = selectedRowsdevpopup.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRowsdevpopup, id];
    }
    setSelectedRowsdevpopup(updatedSelectedRows);
    setSelectAllCheckeduipopup(updatedSelectedRows.length === checkpoinstDev.map((item) => item.develop?.map((item, i) => item)).reduce((accumulator, currentArray) => accumulator.concat(currentArray), []).length);
  };

  const handleSelectAlldevpopup = () => {
    if (selectAllCheckeddevpopup) {
      setSelectedRowsdevpopup([]);
      setSelectAllCheckeddevpopup(false);
    } else {
      const allRowIds = checkpoinstDev
        .map((item) => item.develop?.map((item, i) => item))
        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
        .map((row) => row._id);
      setSelectedRowsdevpopup(allRowIds);
      setSelectAllCheckeddevpopup(true);
    }
  };

  const assignTestingWorkorderAllot = async () => {
    let checkMatch = selectedRows.map((item) => item.split("_")[1]);
    let getIDs = selectedRows.map((item) => item.split("_")[0]);

    if (selectedRows.length === 0) {
      setPopupContentMalert("Please Choose any row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkMatch.some((item) => item !== "Testing")) {
      setPopupContentMalert("Please Choose same Phase");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      try {
        const requests = getIDs.map((item) => {
          return axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
        const responses = await Promise.all(requests);
        let data = responses.map((item) => item.data.staskAssignBoardList);
        setCheckpointsUiTesting(data);
        setCheckpointsDevTesting(data);
        handleClickOpenTestAssign();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
  };

  //selected alla nd check selection functionality for testui POPUP
  const handleCheckboxChangetestuipopup = (id) => {
    let updatedSelectedRows;
    if (selectedRowstestuipopup?.includes(id)) {
      updatedSelectedRows = selectedRowstestuipopup.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRowstestuipopup, id];
    }
    setSelectedRowstestuipopup(updatedSelectedRows);
    setSelectAllCheckedtestuipopup(updatedSelectedRows.length === checkpointsUiTesting.map((item) => item.testinguidesign?.map((item, i) => item)).reduce((accumulator, currentArray) => accumulator.concat(currentArray), []).length);
  };

  const handleSelectAlltestuipopup = () => {
    if (selectAllCheckedtestuipopup) {
      setSelectedRowstestuipopup([]);
      setSelectAllCheckedtestuipopup(false);
    } else {
      const allRowIds = checkpointsUiTesting
        .map((item) => item.testinguidesign?.map((item, i) => item))
        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
        .map((row) => row._id);
      setSelectedRowstestuipopup(allRowIds);
      setSelectAllCheckedtestuipopup(true);
    }
  };
  //selected alla nd check selection functionality for testdev POPUP
  const handleCheckboxChangetestdevpopup = (id) => {
    let updatedSelectedRows;
    if (selectedRowstestdevpopup?.includes(id)) {
      updatedSelectedRows = selectedRowstestdevpopup.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRowstestdevpopup, id];
    }
    setSelectedRowstestdevpopup(updatedSelectedRows);
    setSelectAllCheckedtestdevpopup(updatedSelectedRows.length === checkpointsDevTesting.map((item) => item.testing?.map((item, i) => item)).reduce((accumulator, currentArray) => accumulator.concat(currentArray), []).length);
  };

  const handleSelectAlltestdevpopup = () => {
    if (selectAllCheckedtestdevpopup) {
      setSelectedRowstestdevpopup([]);
      setSelectAllCheckedtestdevpopup(false);
    } else {
      const allRowIds = checkpointsDevTesting
        .map((item) => item.testing?.map((item, i) => item))
        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
        .map((row) => row._id);
      setSelectedRowstestdevpopup(allRowIds);
      setSelectAllCheckedtestdevpopup(true);
    }
  };

  //UPDATE UITASK
  const handleUpdateUItaskAssign = () => {
    if (selectedRowsuipopup.length === 0) {
      setPopupContentMalert("Please Select row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
    else if (workOrder.assigndate === "") {
      setPopupContentMalert("Please Select Assigned Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
     else if (selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedPriority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      UpdateassignUItask();
    }
  };

  const UpdateassignUItask = async () => {
    const checkpoinstUIUpdated = checkpoinstUI.map((item) => {
      const findidArray = subpagefive.filter((row) => row.taskid === item.taskid).map((row) => row._id + "_" + row.phase);
      const findUI = findidArray.filter((id) => id.includes("UI")).map((id) => id.split("_")[0]);
      const findOthers = findidArray.filter((id) => !id.includes("UI")).map((id) => id.split("_")[0]);

      item.uidesign = item.uidesign.map((row) => {
        if (selectedRowsuipopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson === "Please Select Responsibleperson" ? row.taskdev : selectedResperson, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, assignedby: companyname, assignmode: workOrder.assignmode, assigndate: workOrder.assignmode === "Auto" ? today : workOrder.assigndate, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });

      item.idstoupdate1 = findUI[0];
      item.idstoupdate2 = findOthers[0];
      item.idstoupdate3 = findOthers[1];
      item.allotedstatus = item.uidesign.every((row) => {
        if (row.taskdev) {
          return "alloted";
        }
      });
      return item;
    });

    try {
      const requests = checkpoinstUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          uidesign: [...item.uidesign],
          allotedstatus: item.allotedstatus,
        });
      });
      const requests1 = checkpoinstUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          uidesign: [...item.uidesign],
        });
      });
      const requests2 = checkpoinstUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          uidesign: [...item.uidesign],
        });
      });
      // const responses = await Promise.all(requests);
      setGithublink("");
      setSelectedBranch("Please Select Branch");
      setSelectedUnit("Please Select Unit");
      setSelectedTeam("Please Select Team");
      setSelectedResperson("Please Select Responsibleperson");
      seteditTime("");
      seteditTimetype("");
      setSelectedRowsuipopup([]);
      setSelectAllCheckeduipopup(false);
      setSelectedPriority("Please Select Priority");
      setSelectedRows([]);
      setSelectAllChecked(false);
      // handleCloseUIdesignAssign();
      await fetchSubpageFive();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //UPDATE DEV UITASK

  const handleUpdateDevtaskAssign = () => {
    if (selectedRowsdevpopup.length === 0) {
      setPopupContentMalert("Please Select row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
    else if (workOrder.assigndate === "") {
      setPopupContentMalert("Please Select Assigned Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
    else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
    else if (selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedPriority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      UpdateassignDevtask();
    }
  };

  const UpdateassignDevtask = async () => {
    const checkpoinstDEVUpdated = checkpoinstDev.map((item) => {
      const findidArray = subpagefive.filter((row) => row.taskid === item.taskid).map((row) => row._id + "_" + row.phase);
      const findDev = findidArray.filter((id) => id.includes("Development")).map((id) => id.split("_")[0]);
      const findOthers = findidArray.filter((id) => !id.includes("Development")).map((id) => id.split("_")[0]);

      item.develop = item.develop.map((row) => {
        if (selectedRowsdevpopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson === "Please Select Responsibleperson" ? row.taskdev : selectedResperson, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, assignedby: companyname, assignmode: workOrder.assignmode, assigndate: workOrder.assignmode === "Auto" ? today : workOrder.assigndate, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findDev[0];
      item.idstoupdate2 = findOthers[1];
      item.idstoupdate3 = findOthers[2];

      item.allotedstatus = item.develop.every((row) => {
        if (row.taskdev) {
          return "alloted";
        }
      });
      return item;
    });

    try {
      const requests = checkpoinstDEVUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          develop: [...item.develop],
          allotedstatus: item.allotedstatus,
        });
      });
      const requests1 = checkpoinstDEVUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          develop: [...item.develop],
        });
      });
      const requests2 = checkpoinstDEVUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          develop: [...item.develop],
        });
      });
      const responses = await Promise.all(requests);
      setGithublink("");
      setSelectedBranch("Please Select Branch");
      setSelectedUnit("Please Select Unit");
      setSelectedTeam("Please Select Team");
      setSelectedResperson("Please Select Responsibleperson");
      seteditTime("");
      seteditTimetype("");
      setSelectedRowsdevpopup([]);
      setSelectAllCheckeddevpopup(false);
      setSelectedPriority("Please Select Priority");
      setSelectedRows([]);
      setSelectAllChecked(false);
      // handleCloseUIdesignAssign();
      await fetchSubpageFive();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //UPDATE TEST UITASK

  const handleUpdatetesttaskAssign = () => {
    if (selectedRowstestdevpopup.length === 0 && selectedRowstestuipopup.length === 0) {
      setPopupContentMalert("Please Select row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workOrder.assigndate === "") {
      setPopupContentMalert("Please Select Assign Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedPriority === "Please Select Priority") {
      setPopupContentMalert("Please Select Priority");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      Updateassigntesttask();
    }
  };

  const Updateassigntesttask = async () => {
    const checkpoinsttestUIUpdated = checkpointsUiTesting.map((item) => {
      const findidArray = subpagefive.filter((row) => row.taskid === item.taskid).map((row) => row._id);

      item.testinguidesign = item.testinguidesign.map((row) => {
        if (selectedRowstestuipopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson === "Please Select Responsibleperson" ? row.taskdev : selectedResperson, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, assignedby: companyname, assignmode: workOrder.assignmode, assigndate: workOrder.assignmode === "Auto" ? today : workOrder.assigndate, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findidArray[0];
      item.idstoupdate2 = findidArray[1];
      item.idstoupdate3 = findidArray[2];

      item.allotedstatus = item.testinguidesign.every((row) => {
        if (row.taskdev) {
          return "alloted";
        }
      });
      return item;
    });

    const checkpoinsttestDevUpdated = checkpointsDevTesting.map((item) => {
      const findidArray = subpagefive.filter((row) => row.taskid === item.taskid).map((row) => row._id);
      item.testing = item.testing.map((row) => {
        if (selectedRowstestdevpopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson === "Please Select Responsibleperson" ? row.taskdev : selectedResperson, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, assignedby: companyname, assignmode: workOrder.assignmode, assigndate: workOrder.assignmode === "Auto" ? today : workOrder.assigndate, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findidArray[0];
      item.idstoupdate2 = findidArray[1];
      item.idstoupdate3 = findidArray[2];
      item.allotedstatus = item.testing.every((row) => {
        if (row.taskdev) {
          return "alloted";
        }
      });

      return item;
    });

    try {
      // uitesting
      const requestsui = checkpoinsttestUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...item.testinguidesign],
          allotedstatus: item.allotedstatus,
        });
      });
      const requestsui1 = checkpoinsttestUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...item.testinguidesign],
          allotedstatus: item.allotedstatus,
        });
      });
      const requestsui2 = checkpoinsttestUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...item.testinguidesign],
          allotedstatus: item.allotedstatus,
        });
      });
      //DEV TESTING
      const requestsdev = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
          allotedstatus: item.allotedstatus,
        });
      });
      const requestsdev1 = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
          allotedstatus: item.allotedstatus,
        });
      });
      const requestsdev2 = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
          allotedstatus: item.allotedstatus,
        });
      });
      // const responses = await Promise.all([...requestsui, ...requestsdev]);

      setGithublink("");
      setSelectedBranch("Please Select Branch");
      setSelectedUnit("Please Select Unit");
      setSelectedTeam("Please Select Team");
      setSelectedResperson("Please Select Responsibleperson");
      seteditTime("");
      seteditTimetype("");
      setSelectedRowstestdevpopup([]);
      setSelectAllCheckedtestdevpopup(false);
      setSelectedPriority("Please Select Priority");
      setSelectedRows([]);
      setSelectAllChecked(false);
      await fetchSubpageFive();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

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
      <Headtitle title={"TASKASSIGNED LIST"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Task Not assign Board</Typography> */}
      <PageHeading
        title="Task Not assign Board"
        modulename="Projects"
        submodulename="Tasks"
        mainpagename="Not Yet Task Assign Board"
        subpagename=""
        subsubpagename=""
      />
      <br />
      <Box sx={userStyle.dialogbox}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12} sm={12}>
            <Typography>
              Project <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>
              <FormControl size="small" fullWidth>
                <MultiSelect options={project} value={selectedProject} onChange={handleChangeproject} valueRenderer={customValueRendererproject} labelledBy="Please Select Project" />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={12}>
            <Typography>
              Sub Project <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>
              <MultiSelect
                options={subProject
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubProject}
                onChange={handleChangesubproject}
                valueRenderer={customValueRenderersubproject}
                labelledBy="Please Select SubProject"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={12}>
            <Typography>
              Module <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl size="small" fullWidth>

              <MultiSelect
                options={module
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedModule}
                onChange={handleChangemodule}
                valueRenderer={customValueRenderermodule}
                labelledBy="Please Select Module"
              />
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                SubModule Name <b style={{ color: "red" }}>*</b>{" "}
              </Typography>

              <MultiSelect
                options={subModule
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject) && selectedModule.map((item) => item.value).includes(subpro.module))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubModule}
                onChange={handleChangesubmodule}
                valueRenderer={customValueRenderersubmodule}
                labelledBy="Please Select SubModule"
              />
            </FormControl>
          </Grid>
          {mainpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Main Page<b style={{ color: "red" }}>*</b>
              </Typography>

              <MultiSelect options={mainpageTypeDropdown} value={selectedMainpage} onChange={handleChangemainpage} valueRenderer={customValueRenderermainpage} labelledBy="Please Select Mainpage" />
            </Grid>
          )}
          {subpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Sub page<b style={{ color: "red" }}>*</b>
              </Typography>
              <Selects
                options={subpageTypeDropdown}
                styles={colourStyles}
                value={{ label: selectedSubpage, value: selectedSubpage }}
                onChange={(value) => {
                  setSelectedSubpage(value.value);
                  setSelectedSubSubpage("Please Select SubSubpage");
                  fetchPagetypeSubSubPageDropdowns(value.value);
                }}
              />
            </Grid>
          )}
          {subsubpageTypeDropdown.length > 0 && (
            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                Sub Sub page<b style={{ color: "red" }}>*</b>
              </Typography>
              <Selects
                options={subsubpageTypeDropdown}
                styles={colourStyles}
                value={{ label: selectedSubSubpage, value: selectedSubSubpage }}
                onChange={(value) => {
                  setSelectedSubSubpage(value.value);
                }}
              />
            </Grid>
          )}
        </Grid>
        <br />
        <Box sx={{ display: "flex", justifyContent: "center", gap: "25px" }}>
          <Button variant="contained" onClick={(e) => handleFilter(e)}>
            Filter
          </Button>
          <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
            Clear
          </Button>
        </Box>
      </Box>
      <br />
      <br />
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.SubHeaderText}>Task Not assign Board List</Typography>
          </Grid>
        </Grid>
        <br />
        <br />
        {!isloader ? (
          <>
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <FacebookCircularProgress />
            </Box>
          </>
        ) : (
          <>
            <Grid container>
              <Grid item md={6} xs={12} sm={12}></Grid>
              <Grid item md={6} xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item md={3.2} xs={12} sm={0}></Grid>
                  <Grid item md={3.3} xs={12} sm={4}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "capitalize" }} onClick={(e) => assignWorkorderAllot()}>
                      UI design
                    </Button>
                  </Grid>
                  <Grid item md={3.5} xs={12} sm={4}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "capitalize" }} onClick={(e) => assignDevWorkorderAllot()}>
                      Development
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={12} sm={4}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "capitalize" }} onClick={(e) => assignTestingWorkorderAllot()}>
                      Testing
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} sm={3} xs={12} sx={{ display: "flex", justifyContent: "start" }}>
                <Box>
                  <label>Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={subpagefive?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={6} sm={6} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                      {/* {isUserRoleCompare[0]?.excelrole && ( */}
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchSubpageFive()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                      <>
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            fetchSubpageFive()
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      </>
                      {/* )} */}
                      {/* {isUserRoleCompare[0]?.printrole && ( */}
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                      {/* )} */}
                      {/* {isUserRoleCompare[0]?.pdfrole && ( */}
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                            fetchSubpageFive()
                          }}
                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                      </>
                      {/* )} */}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item md={3} sm={3} xs={12} sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
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
            <br /> <br />
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
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
              </Box>
              <Box>
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: "capitalize", color: "black" }}>
                  Prev
                </Button>
                {pageNumbers?.map((pageNumber) => (
                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePage < totalPages && <span>...</span>}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: "capitalize", color: "black" }}>
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

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

      <Box>
        <Dialog
          // open={isErrorOpen}
          // onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent style={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseMod}
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => deleteDetail(deleteTaskDetail)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/*TESTING DESIGN ASSIGN ALERT DIALOG */}
      <Dialog open={isUIdesignAssign} onClose={handleCloseUIdesignAssign} maxWidth="lg" fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography variant="h5">Assign Work Order UI</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned By</Typography>
              <FormControl fullWidth>
                <OutlinedInput size="small" value={companyname} />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Mode</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={workOrder.assignmode}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assignmode: e.target.value });
                  }}
                >
                  <MenuItem value="Auto"> {"Auto"} </MenuItem>
                  <MenuItem value="Manual"> {"Manual"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Date</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="date"
                  value={workOrder.assignmode === "Auto" ? today : workOrder.assigndate}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assigndate: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Branch <b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={branches}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedBranch, value: selectedBranch }}
                  onChange={(e) => {
                    setSelectedBranch(e.value);
                    setSelectedUnit("Please Select Unit");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Unit <b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={units
                    ?.filter((unit) => unit.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.name,
                      value: sub.name,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedUnit, value: selectedUnit }}
                  onChange={(e) => {
                    setSelectedUnit(e.value);
                    setSelectedTeam("Please Select Team");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Team <b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={teams
                    ?.filter((team) => team.unit === selectedUnit && team.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.teamname,
                      value: sub.teamname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedTeam, value: selectedTeam }}
                  onChange={(e) => {
                    setSelectedTeam(e.value);
                    setSelectedResperson("Please Select Responsibleperson");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Responsible Person<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={users
                    ?.filter((user) => user.unit === selectedUnit && user.branch === selectedBranch && user.team === selectedTeam)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.companyname,
                      value: sub.companyname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedResperson, value: selectedResperson }}
                  onChange={(e) => setSelectedResperson(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Priority<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={priorities}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedPriority, value: selectedPriority }}
                  onChange={(e) => setSelectedPriority(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={5.5} sm={12} xs={12}>
              <Typography>Source Link</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="text"
                  placeholder="Please Enter Link Here"
                  value={githublink}
                  onChange={(e) => {
                    setGithublink(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3.5} sm={3} xs={12}>
              <Grid container>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Time</Typography>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      type="text"
                      placeholder="Estimation Time"
                      value={editTime}
                      onChange={(e) => {
                        seteditTime(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Type</Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={editTimetype}
                    onChange={(e) => {
                      seteditTimetype(e.target.value);
                    }}
                  >
                    <em>
                      <MenuItem value="" disabled>
                        Please Select
                      </MenuItem>
                    </em>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox sx={{ padding: "1px" }} checked={selectAllCheckeduipopup} onChange={handleSelectAlluipopup} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Sno"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Name"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Developer"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Priority"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Estimation"}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {checkpoinstUI
                  .map((item) => item.uidesign?.map((item, i) => item))
                  .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                  .map((row, i) => {
                    return (
                      <StyledTableRow key={row._id} sx={{ background: selectedRowsuipopup?.includes(row._id) ? "#87ceeb47 !IMPORTANT" : "inherit" }}>
                        <StyledTableCell sx={{ display: "flex", justifyContent: "center", padding: "5px 10px !important" }}>
                          <Checkbox sx={{ padding: "1px" }} checked={selectedRowsuipopup?.includes(row._id)} onChange={() => handleCheckboxChangeuipopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.taskdev}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {row.priority}</StyledTableCell>

                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                          <Grid container>
                            <Grid item md={3} sm={3} xs={3}>
                              <Typography>{row.subEstTime}</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", alignItems: "center" }}>
                              <Typography> {row.subEstType}</Typography>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="primary" onClick={(e) => handleUpdateUItaskAssign()}>
            Update
          </Button>
          <Button
            onClick={handleCloseUIdesignAssign}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/*UI DESIGN ASSIGN ALERT DIALOG */}
      <Dialog open={isDevAssign} onClose={handleCloseDevAssign} maxWidth="lg" fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography variant="h5">Assign Work Order Development</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned By</Typography>
              <FormControl fullWidth>
                <OutlinedInput size="small" value={companyname} />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Mode</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={workOrder.assignmode}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assignmode: e.target.value });
                  }}
                >
                  <MenuItem value="Auto"> {"Auto"} </MenuItem>
                  <MenuItem value="Manual"> {"Manual"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Date</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="date"
                  value={workOrder.assignmode === "Auto" ? today : workOrder.assigndate}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assigndate: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Branch<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={branches}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedBranch, value: selectedBranch }}
                  onChange={(e) => {
                    setSelectedBranch(e.value);
                    setSelectedUnit("Please Select Unit");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Unit<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={units
                    ?.filter((unit) => unit.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.name,
                      value: sub.name,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedUnit, value: selectedUnit }}
                  onChange={(e) => {
                    setSelectedUnit(e.value);
                    setSelectedTeam("Please Select Team");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Team<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={teams
                    ?.filter((team) => team.unit === selectedUnit && team.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.teamname,
                      value: sub.teamname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedTeam, value: selectedTeam }}
                  onChange={(e) => {
                    setSelectedTeam(e.value);
                    setSelectedResperson("Please Select Responsibleperson");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Responsible Person<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={users
                    ?.filter((user) => user.unit === selectedUnit && user.branch === selectedBranch && user.team === selectedTeam)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.companyname,
                      value: sub.companyname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedResperson, value: selectedResperson }}
                  onChange={(e) => setSelectedResperson(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Priority<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={priorities}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedPriority, value: selectedPriority }}
                  onChange={(e) => setSelectedPriority(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={5.5} sm={12} xs={12}>
              <Typography>Source Link</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="text"
                  placeholder="Please Enter Link Here"
                  value={githublink}
                  onChange={(e) => {
                    setGithublink(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3.5} sm={3} xs={12}>
              <Grid container>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Time</Typography>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      type="text"
                      placeholder="Estimation Time"
                      value={editTime}
                      onChange={(e) => {
                        seteditTime(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Type</Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={editTimetype}
                    onChange={(e) => {
                      seteditTimetype(e.target.value);
                    }}
                  >
                    <em>
                      <MenuItem value="" disabled>
                        Please Select
                      </MenuItem>
                    </em>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox sx={{ padding: "1px" }} checked={selectAllCheckeddevpopup} onChange={handleSelectAlldevpopup} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Sno"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Name"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Developer"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Priority"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Estimation"}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {checkpoinstDev
                  .map((item) => item.develop?.map((item, i) => item))
                  .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                  .map((row, i) => {
                    return (
                      <StyledTableRow key={row._id} sx={{ background: selectedRowsdevpopup?.includes(row._id) ? "#87ceeb47 !IMPORTANT" : "inherit" }}>
                        <StyledTableCell sx={{ display: "flex", justifyContent: "center", padding: "5px 10px !important" }}>
                          <Checkbox sx={{ padding: "1px" }} checked={selectedRowsdevpopup?.includes(row._id)} onChange={() => handleCheckboxChangedevpopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.taskdev}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.priority}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                          <Grid container>
                            <Grid item md={3} sm={3} xs={3}>
                              <Typography>{row.subEstTime}</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", alignItems: "center" }}>
                              <Typography> {row.subEstType}</Typography>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="primary" onClick={(e) => handleUpdateDevtaskAssign()}>
            Update
          </Button>
          <Button
            onClick={handleCloseDevAssign}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/*DEVELOP DESIGN ASSIGN ALERT DIALOG */}
      <Dialog open={isTestAssign} onClose={handleCloseTestAssign} maxWidth="lg" fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography variant="h5">Assign Work Order Testing</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned By</Typography>
              <FormControl fullWidth>
                <OutlinedInput size="small" value={companyname} />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Mode</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={workOrder.assignmode}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assignmode: e.target.value });
                  }}
                >
                  <MenuItem value="Auto"> {"Auto"} </MenuItem>
                  <MenuItem value="Manual"> {"Manual"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Typography>Assigned Date</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="date"
                  value={workOrder.assignmode === "Auto" ? today : workOrder.assigndate}
                  onChange={(e) => {
                    setWorkOrder({ ...workOrder, assigndate: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Branch <b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={branches}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedBranch, value: selectedBranch }}
                  onChange={(e) => {
                    setSelectedBranch(e.value);
                    setSelectedUnit("Please Select Unit");
                    setSelectedTeam("Please Select Team");
                    setSelectedResperson("Please Select Responsibleperson");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Unit<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={units
                    ?.filter((unit) => unit.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.name,
                      value: sub.name,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedUnit, value: selectedUnit }}
                  onChange={(e) => {
                    setSelectedUnit(e.value);
                    setSelectedTeam("Please Select Team");
                    setSelectedResperson("Please Select Responsibleperson");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Team<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={teams
                    ?.filter((team) => team.unit === selectedUnit && team.branch === selectedBranch)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.teamname,
                      value: sub.teamname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedTeam, value: selectedTeam }}
                  onChange={(e) => {
                    setSelectedTeam(e.value);
                    setSelectedResperson("Please Select Responsibleperson");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Responsible Person<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={users
                    ?.filter((user) => user.unit === selectedUnit && user.branch === selectedBranch && user.team === selectedTeam)
                    ?.map((sub) => ({
                      ...sub,
                      label: sub.companyname,
                      value: sub.companyname,
                    }))}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedResperson, value: selectedResperson }}
                  onChange={(e) => setSelectedResperson(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Priority<b style={{ color: "red" }}> *</b></Typography>
              <FormControl fullWidth>
                <Selects
                  options={priorities}
                  styles={{
                    menuList: (styles) => ({
                      ...styles,
                      background: "white",
                      maxHeight: "200px",
                    }),
                  }}
                  value={{ label: selectedPriority, value: selectedPriority }}
                  onChange={(e) => setSelectedPriority(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={5.5} sm={12} xs={12}>
              <Typography>Source Link</Typography>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="text"
                  placeholder="Please Enter Link Here"
                  value={githublink}
                  onChange={(e) => {
                    setGithublink(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3.5} sm={3} xs={12}>
              <Grid container>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Time</Typography>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      type="text"
                      placeholder="Estimation Time"
                      value={editTime}
                      onChange={(e) => {
                        seteditTime(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={6}>
                  <Typography>Estimation Type</Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={editTimetype}
                    onChange={(e) => {
                      seteditTimetype(e.target.value);
                    }}
                  >
                    <em>
                      <MenuItem value="" disabled>
                        Please Select
                      </MenuItem>
                    </em>
                    <MenuItem value="Hours"> {"Hours"} </MenuItem>
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <Typography> UI Testing</Typography>
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox sx={{ padding: "1px" }} checked={selectAllCheckedtestuipopup} onChange={handleSelectAlltestuipopup} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Sno"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Name"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Developer"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Priority"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Estimation"}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {checkpointsUiTesting
                  .map((item) => item.testinguidesign?.map((item, i) => item))
                  .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                  .map((row, i) => {
                    return (
                      <StyledTableRow key={row._id} sx={{ background: selectedRowstestuipopup?.includes(row._id) ? "#87ceeb47 !IMPORTANT" : "inherit" }}>
                        <StyledTableCell sx={{ display: "flex", justifyContent: "center", padding: "5px 10px !important" }}>
                          <Checkbox sx={{ padding: "1px" }} checked={selectedRowstestuipopup?.includes(row._id)} onChange={() => handleCheckboxChangetestuipopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.taskdev}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.priority}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                          <Grid container>
                            <Grid item md={3} sm={3} xs={3}>
                              <Typography>{row.subEstTime}</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", alignItems: "center" }}>
                              <Typography> {row.subEstType}</Typography>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          <Typography> Development Testing</Typography>
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox sx={{ padding: "1px" }} checked={selectAllCheckedtestdevpopup} onChange={handleSelectAlltestdevpopup} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Sno"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"Name"}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Developer"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Priority"}</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Estimation"}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {checkpointsDevTesting
                  .map((item) => item.testing?.map((item, i) => item))
                  .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                  .map((row, i) => {
                    return (
                      <StyledTableRow key={row._id} sx={{ background: selectedRowstestdevpopup?.includes(row._id) ? "#87ceeb47 !IMPORTANT" : "inherit" }}>
                        <StyledTableCell sx={{ display: "flex", justifyContent: "center", padding: "5px 10px !important" }}>
                          <Checkbox sx={{ padding: "1px" }} checked={selectedRowstestdevpopup?.includes(row._id)} onChange={() => handleCheckboxChangetestdevpopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.taskdev}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.priority}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                          <Grid container>
                            <Grid item md={3} sm={3} xs={3}>
                              <Typography>{row.subEstTime}</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ display: "flex", alignItems: "center" }}>
                              <Typography> {row.subEstType}</Typography>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="primary" onClick={(e) => handleUpdatetesttaskAssign()}>
            Update
          </Button>
          <Button
            onClick={handleCloseTestAssign}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
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
      <br />

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
        filename={"Task Notassigned Board"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      {/* <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Size Info"
        addedby={addedby}
        updateby={updateby}
      /> */}
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      {/* <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delBrand}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />     */}
      {/* EXTERNAL COMPONENTS -------------- END */}


    </Box>
  );
}

export default Taskassigned;