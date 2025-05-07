import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Divider, TextField, Checkbox, Dialog, Select, Button, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, List, ListItem, ListItemText, IconButton, Popover } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { saveAs } from "file-saver";
import ImageIcon from '@mui/icons-material/Image';
import html2canvas from 'html2canvas';
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function Tasks() {
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

  let exportColumnNames = ['Task Name', 'TaskId', 'Phase', 'Project', 'SubProject', 'Module', 'SubModule', 'Mainpage', 'Subpage'];
  let exportRowValues = ['taskname', 'taskid', 'phase', 'project', 'subproject', 'module', 'submodule', 'mainpage', 'subpage'];

  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [allotedTasks, setAllotedTasks] = useState([]);
  const { isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isallotedtasks, setIsallotedtasks] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedUnit, setSelectedUnit] = useState("Please Select Unit");
  const [selectedTeam, setSelectedTeam] = useState("Please Select Team");
  const [selectedResperson, setSelectedResperson] = useState("Please Select Responsibleperson");
  const [selectedPriority, setSelectedPriority] = useState("Please Select Priority");
  const [githublink, setGithublink] = useState("");
  const [editTime, seteditTime] = useState("");
  const [editTimetype, seteditTimetype] = useState("");
  const [checkpoinstUI, setCheckpoinstUI] = useState([]);
  const [checkpoinstDev, setCheckpoinstDev] = useState([]);
  const [checkpointsUiTesting, setCheckpointsUiTesting] = useState([]);
  const [checkpointsDevTesting, setCheckpointsDevTesting] = useState([]);

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Taskassigned Board List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Task Assigned Board"),
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
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;

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
      const allRowIds = filteredData.map((row) => row._id);
      setSelectedRows(allRowIds);
      setSelectAllChecked(true);
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [searchedString, setSearchedString] = useState("");
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
    setSelectedRows([]);
    setSelectAllChecked(false);
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
    setSelectedRows([]);
    setSelectAllChecked(false);
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
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

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

  //get single row to edit....
  const getCode = async (id, phase) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      if (phase === "UI") {
        setCheckpoinstUI([res.data.staskAssignBoardList]);
        handleClickOpenUIdesignAssign();
      } else if (phase === "Development") {
        setCheckpoinstDev([res.data.staskAssignBoardList]);
        handleClickOpenDevAssign();
      } else {
        setCheckpointsDevTesting([res.data.staskAssignBoardList]);
        setCheckpointsUiTesting([res.data.staskAssignBoardList]);
        handleClickOpenTestAssign();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get all shifts
  const fetchAllallotedtasks = async () => {
    setPageName(!pageName);

    try {
      let res = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST_TABLEDATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIsallotedtasks(true);
      setAllotedTasks(res?.data?.taskAssignBoardList.map((item, index) => ({ ...item, serialNumber: index + 1 })));
    } catch (err) { setIsallotedtasks(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

  };

  useEffect(() => {
    fetchAllallotedtasks();
  }, []);

  useEffect(() => {
    fetchBranches();
    fetchUnits();
    fetchTeams();
    fetchUsers();
    fetchPriorities();
  }, [checkpoinstUI, checkpoinstDev, checkpointsDevTesting]);

  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(allotedTasks);
  }, [allotedTasks]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Taskassigned Board",
    pageStyle: "print",
  });

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
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
      headerStyle: { fontWeight: "bold" },
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ marginTop: "8px" }}>
          <Typography style={{ background: params.data.allotedstatus === true ? "#34a034ed" : "#f82c2ceb", width: "max-content", borderRadius: "14px", color: "white", padding: "0px 5px" }} variant="subtitle2">
            {params.data.allotedstatus === true ? "Alloted" : ""}
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
      cellRenderer: (params) => (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button onClick={(e) => getCode(params.data.id, params.data.phase)}>
            <EditOutlinedIcon />
          </Button>
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
      id: item._id,
      serialNumber: item.serialNumber,
      allotedstatus: item.allotedstatus,
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
    } else if (selectedBranch === "Please Select Branch" && selectedUnit === "Please Select Unit" && selectedTeam === "Please Select Team" && selectedResperson === "Please Select Responsibleperson" && selectedPriority === "Please Select Priority" && githublink == "" && editTime == "") {
      setPopupContentMalert("Please Choose data to change");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedBranch !== "Please Select Branch" && selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam !== "Please Select Team" && selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      UpdateassignUItask();
    }
  };

  const UpdateassignUItask = async () => {
    const checkpoinstUIUpdated = checkpoinstUI.map((item) => {
      const findidArray = allotedTasks.filter((row) => row.taskid === item.taskid).map((row) => row._id + "_" + row.phase);
      const findUI = findidArray.filter((id) => id.includes("UI")).map((id) => id.split("_")[0]);
      const findOthers = findidArray.filter((id) => !id.includes("UI")).map((id) => id.split("_")[0]);

      item.uidesign = item.uidesign.map((row) => {
        if (selectedRowsuipopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson != "Please Select Responsibleperson" ? selectedResperson : row.taskdev, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });

      item.idstoupdate1 = findUI[0];
      item.idstoupdate2 = findOthers[0];
      item.idstoupdate3 = findOthers[1];
      return item;
    });

    try {
      const requests = checkpoinstUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          uidesign: [...item.uidesign],
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
      setSelectedRowsuipopup([]);
      setSelectAllCheckeduipopup(false);
      // handleCloseUIdesignAssign();
      await fetchAllallotedtasks();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //UPDATE DEV UITASK
  const handleUpdateDevtaskAssign = () => {
    if (selectedRowsdevpopup.length === 0) {
      setPopupContentMalert("Please Select row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch" && selectedUnit === "Please Select Unit" && selectedTeam === "Please Select Team" && selectedResperson === "Please Select Responsibleperson" && selectedPriority === "Please Select Priority" && githublink == "" && editTime == "") {
      setPopupContentMalert("Please Choose data to change");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedBranch !== "Please Select Branch" && selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam !== "Please Select Team" && selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      UpdateassignDevtask();
    }
  };

  const UpdateassignDevtask = async () => {
    const checkpoinstDEVUpdated = checkpoinstDev.map((item) => {
      const findidArray = allotedTasks.filter((row) => row.taskid === item.taskid).map((row) => row._id + "_" + row.phase);
      const findDev = findidArray.filter((id) => id.includes("Development")).map((id) => id.split("_")[0]);
      const findOthers = findidArray.filter((id) => !id.includes("Development")).map((id) => id.split("_")[0]);

      item.develop = item.develop.map((row) => {
        if (selectedRowsdevpopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson != "Please Select Responsibleperson" ? selectedResperson : row.taskdev, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findDev[0];
      item.idstoupdate2 = findOthers[1];
      item.idstoupdate3 = findOthers[2];
      return item;
    });

    try {
      const requests = checkpoinstDEVUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          develop: [...item.develop],
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
      setSelectedRowsuipopup([]);
      setSelectAllCheckeduipopup(false);
      // handleCloseUIdesignAssign();
      await fetchAllallotedtasks();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //UPDATE TEST UITASK

  const handleUpdatetesttaskAssign = () => {
    if (selectedRowstestdevpopup.length === 0 && selectedRowstestuipopup.length === 0) {
      setPopupContentMalert("Please Select row");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch" && selectedUnit === "Please Select Unit" && selectedTeam === "Please Select Team" && selectedResperson === "Please Select Responsibleperson" && selectedPriority === "Please Select Priority" && githublink == "" && editTime == "") {
      setPopupContentMalert("Please Choose data to change");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedBranch !== "Please Select Branch" && selectedUnit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch !== "Please Select Branch" && selectedUnit !== "Please Select Unit" && selectedTeam !== "Please Select Team" && selectedResperson === "Please Select Responsibleperson") {
      setPopupContentMalert("Please Select Responsibleperson");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      Updateassigntesttask();
    }
  };

  const Updateassigntesttask = async () => {
    const checkpoinsttestUIUpdated = checkpointsUiTesting.map((item) => {
      const findidArray = allotedTasks.filter((row) => row.taskid === item.taskid).map((row) => row._id);

      item.testinguidesign = item.testinguidesign.map((row) => {
        if (selectedRowstestuipopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson != "Please Select Responsibleperson" ? selectedResperson : row.taskdev, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findidArray[0];
      item.idstoupdate2 = findidArray[1];
      item.idstoupdate3 = findidArray[2];
      return item;
    });

    const checkpoinsttestDevUpdated = checkpointsDevTesting.map((item) => {
      const findidArray = allotedTasks.filter((row) => row.taskid === item.taskid).map((row) => row._id);
      item.testing = item.testing.map((row) => {
        if (selectedRowstestdevpopup.includes(row._id)) {
          return { ...row, taskdev: selectedResperson != "Please Select Responsibleperson" ? selectedResperson : row.taskdev, subEstTime: editTime ? editTime : row.subEstTime, subEstType: editTimetype ? editTimetype : row.subEstType, branch: selectedBranch === "Please Select Branch" ? row.branch : selectedBranch, unit: selectedUnit === "Please Select Unit" ? row.unit : selectedUnit, team: selectedTeam === "Please Select Team" ? row.team : selectedTeam, priority: selectedPriority === "Please Select Priority" ? row.priority : selectedPriority, sourcelink: githublink !== "" ? githublink : row.githublink };
        }
        return row;
      });
      item.idstoupdate1 = findidArray[0];
      item.idstoupdate2 = findidArray[1];
      item.idstoupdate3 = findidArray[2];

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
        });
      });
      const requestsui1 = checkpoinsttestUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...item.testinguidesign],
        });
      });
      const requestsui2 = checkpoinsttestUIUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testinguidesign: [...item.testinguidesign],
        });
      });
      //DEV TESTING
      const requestsdev = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate1}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
        });
      });
      const requestsdev1 = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate2}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
        });
      });
      const requestsdev2 = checkpoinsttestDevUpdated.map((item) => {
        return axios.put(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item.idstoupdate3}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          testing: [...item.testing],
        });
      });
      // const responses = await Promise.all([...requestsui, ...requestsdev]);

      setGithublink("");
      setSelectedBranch("Please Select Branch");
      setSelectedUnit("Please Select Unit");
      setSelectedTeam("Please Select Team");
      setSelectedResperson("Please Select Responsibleperson");
      seteditTime("");
      setSelectedRowstestuipopup([]);
      setSelectAllCheckedtestuipopup(false);
      setSelectedRowstestdevpopup([]);
      setSelectAllCheckedtestdevpopup(false);
      await fetchAllallotedtasks();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
      <Headtitle title={"allotedTasks"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Tasks </Typography> */}
      <PageHeading
        title="Task Assigned Board"
        modulename="Projects"
        submodulename="Tasks"
        mainpagename="Task Assigned Board"
        subpagename=""
        subsubpagename=""
      />

      <br />
      {/* ****** Table Start ****** */}

      <Box sx={userStyle.container}>
        {/* ******************************************************EXPORT Buttons****************************************************** */}
        {/*       
          <Box sx={userStyle.container} > */}
        {isallotedtasks ? (
          <>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Tasks List</Typography>
            </Grid>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("exceltaskassignedboard") && (
                  <>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>

                  </>
                )}
                {isUserRoleCompare?.includes("csvtaskassignedboard") && (
                  <>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  </>
                )}
                {isUserRoleCompare?.includes("printtaskassignedboard") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint /> &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdftaskassignedboard") && (
                  <>
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  </>
                )}
                {isUserRoleCompare?.includes("imagetaskassignedboard") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                )}
              </Grid>
            </Grid>
            <br />
            <Grid style={userStyle.dataTablestyle}>
              <Box>
                <label>Show entries:</label>
                <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={allotedTasks.length}>All</MenuItem>
                </Select>
              </Box>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={allotedTasks}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={allotedTasks}
                />
              </Grid>
            </Grid>
            {/* ****** Table Grid Container ****** */}
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
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
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
                  itemsList={allotedTasks}
                />
              </>
            </Box>

          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        )}

        {/* ****** Table End ****** */}
      </Box>

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

      {/* ****** Table End ****** */}
      {/*TESTING DESIGN ASSIGN ALERT DIALOG */}
      <Dialog open={isUIdesignAssign} onClose={handleCloseUIdesignAssign} maxWidth="lg" fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography variant="h5">Update Assign Work Order UI</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task Name</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpoinstUI[0]?.taskname}</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task ID</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpoinstUI[0]?.taskid}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Branch</Typography>
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
              <Typography>Unit</Typography>
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
              <Typography>Team</Typography>
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
              <Typography>Responsible Person</Typography>
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
              <Typography>Priority</Typography>
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
                  <Typography>Est Type</Typography>
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
          <br /> <Divider />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox
                      sx={{ padding: "1px" }}
                      checked={selectAllCheckeduipopup}
                      disabled={checkpoinstUI
                        .map((item) => item.uidesign?.map((item, i) => item))
                        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                        .some((row) => row.checkpointsstatus === "completed")}
                      onChange={handleSelectAlluipopup}
                    />
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
                          <Checkbox sx={{ padding: "1px" }} disabled={row.checkpointsstatus === "completed" || row.state == "running"} checked={selectedRowsuipopup?.includes(row._id)} onChange={() => handleCheckboxChangeuipopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{(row.taskdev != undefined ? row.taskdev : "") + " " + (row.checkpointsstatus === "completed" ? "(Completed)" : row.state === "running" ? "(Running)" : "")}</StyledTableCell>
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
          <Typography variant="h5">Update Assign Work Order Development</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task Name</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpoinstDev[0]?.taskname}</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task ID</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpoinstDev[0]?.taskid}</Typography>
            </Grid>
          </Grid>
          <br /> <Divider /> <br />
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <Typography>Branch</Typography>
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
              <Typography>Unit</Typography>
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
              <Typography>Team</Typography>
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
              <Typography>Responsible Person</Typography>
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
              <Typography>Priority</Typography>
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
                  <Typography>Est Type</Typography>
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
          <br /> <Divider />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "1100px", width: "100%" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox
                      sx={{ padding: "1px" }}
                      disabled={checkpoinstDev
                        .map((item) => item.develop?.map((item, i) => item))
                        .reduce((accumulator, currentArray) => accumulator.concat(currentArray), [])
                        .some((row) => row.checkpointsstatus === "completed")}
                      checked={selectAllCheckeddevpopup}
                      onChange={handleSelectAlldevpopup}
                    />
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
                          <Checkbox sx={{ padding: "1px" }} disabled={row.checkpointsstatus === "completed" || row.state == "running"} checked={selectedRowsdevpopup?.includes(row._id)} onChange={() => handleCheckboxChangedevpopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{(row.taskdev != undefined ? row.taskdev : "") + " " + (row.checkpointsstatus === "completed" ? "(Completed)" : row.state === "running" ? "(Running)" : "")}</StyledTableCell>
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
          <Typography variant="h5">Update Assign Work Order Test</Typography>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task Name</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpointsUiTesting[0]?.taskname}</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography variant="h6">Task ID</Typography>
              <Typography sx={{ wordBreak: "break-all" }}>{checkpointsUiTesting[0]?.taskid}</Typography>
            </Grid>
          </Grid>
          <br /> <Divider />
          <br />
          <Grid container spacing={2}>
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
              <Typography>Priority</Typography>
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
                  <Typography>Est Type</Typography>
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
          <br /> <Divider />
          <br />
          <Typography variant="h6"> UI Testing</Typography>
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
                          <Checkbox sx={{ padding: "1px" }} disabled={row.checkpointsstatus === "completed"} checked={selectedRowstestuipopup?.includes(row._id)} onChange={() => handleCheckboxChangetestuipopup(row._id)} />
                        </StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.name}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{(row.taskdev != undefined ? row.taskdev : "") + " " + (row.checkpointsstatus === "completed" ? "(Completed)" : row.state === "running" ? "(Running)" : "")}</StyledTableCell>
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
          <br /> <Divider />
          <br />
          <Typography variant="h6"> Development Testing</Typography>
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
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{(row.taskdev != undefined ? row.taskdev : "") + " " + (row.checkpointsstatus === "completed" ? "(Completed)" : row.state === "running" ? "(Running)" : "")}</StyledTableCell>
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={allotedTasks ?? []}
        filename={"Taskassigned Board"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}





    </Box>
  );
}

export default Tasks;