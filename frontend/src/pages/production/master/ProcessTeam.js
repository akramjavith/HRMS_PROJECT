import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination.js';
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";

function ProcessTeam() {

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

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Team', 'Process'];
  let exportRowValues = ['company', 'branch', 'unit', 'team', 'process'];

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [processTeam, setProcessTeam] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    process: "Please Select Process",
  });
  const [processTeamEdit, setProcessTeamEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    process: "Please Select Process",
  });
  const [processTeamArray, setProcessTeamArray] = useState([]);
  const [processTeamArrayEdit, setProcessTeamArrayEdit] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [filteredTeamEdit, setFilteredTeamEdit] = useState([]);
  const [processOption, setProcessOption] = useState([]);
  const [filteredProcess, setFilteredProcess] = useState([]);
  const [filteredProcessEdit, setFilteredProcessEdit] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProcessQueue, setDeleteProcessQueue] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesEdit, setdocumentFilesEdit] = useState([]);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    process: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  useEffect(() => {
    addSerialNumber();
  }, [processTeamArray]);

  useEffect(() => {
    fetchProcessQueueAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchEmployee();
    fetchProcessQueue();
  }, []);

  useEffect(() => {
    fetchTeam();
    fetchProcess();
  }, []);

  useEffect(() => {
    const filteredTeams = teamOption
      ?.filter((u) => u.unit === processTeam.unit)
      .map((u) => ({
        ...u,
        label: u.teamname,
        value: u.teamname,
      }));

    setFilteredTeam(filteredTeams);
  }, [processTeam.unit]);

  useEffect(() => {
    const filteredTeamEdits = teamOption
      ?.filter((ue) => ue.unit === processTeamEdit.unit)
      .map((ue) => ({
        ...ue,
        label: ue.teamname,
        value: ue.teamname,
      }));

    setFilteredTeamEdit(filteredTeamEdits);
  }, [processTeamEdit.unit]);

  useEffect(() => {
    const filteredProcesss = processOption
      ?.filter((u) => u.branch === processTeam.branch)
      .map((u) => ({
        ...u,
        label: u.name,
        value: u.name,
      }));

    setFilteredProcess(filteredProcesss);
  }, [processTeam.branch]);

  useEffect(() => {
    const filteredProcessEdits = processOption
      ?.filter((ue) => ue.branch === processTeamEdit.branch)
      .map((ue) => ({
        ...ue,
        label: ue.name,
        value: ue.name,
      }));

    setFilteredProcessEdit(filteredProcessEdits);
  }, [processTeamEdit.branch]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const fetchTeam = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const teamall = [
        ...res.data.teamsdetails.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];
      setTeamOption(teamall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchProcess = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const processall = [
        ...res.data.processqueuename.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProcessOption(processall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteProcessQueue(res?.data?.sprocessteam);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let proid = deleteProcessQueue._id;
  const delProcess = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      await fetchProcessQueue();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [isBtn, setIsBtn] = useState(false)

  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let brandCreatePromises = [];

      valueProcessCat.forEach((processValue) => {
        brandCreatePromises.push(
          axios.post(SERVICE.CREATE_PROCESS_AND_TEAM, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(
              documentFiles?.length === 0 ? processTeam.company : ""
            ),
            branch: String(
              documentFiles?.length === 0 ? processTeam.branch : ""
            ),
            unit: String(documentFiles?.length === 0 ? processTeam.unit : ""),
            team: String(documentFiles?.length === 0 ? processTeam.team : ""),
            process: processValue, // Set the current value from valueProcessCat array
            // choosefile: [...documentFiles],
            addedby: [
              {
                name: String(username),
                date: String(new Date()),
              },
            ],
          })
        );
      });

      let brandCreate = await Promise.all(brandCreatePromises);
      await fetchEmployee();
      await fetchProcessQueue();
      setProcessTeam({ ...processTeam });
      setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let processopt = selectedOptionsProcess.map((item) => item.value);
    const isNameMatch = processTeamArray?.some(
      (item) =>
        item.company === processTeam.company &&
        item.branch === processTeam.branch &&
        item.unit === processTeam.unit &&
        item.team === processTeam.team &&
        processopt.includes(item.process)
    );
    if (
      documentFiles.length === 0 &&
      processTeam.company === "Please Select Company"
    ) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentFiles.length === 0 &&
      processTeam.branch === "Please Select Branch"
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentFiles.length === 0 &&
      processTeam.unit === "Please Select Unit"
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentFiles.length === 0 &&
      processTeam.team === "Please Select Team"
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueProcessCat.length === 0) {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setProcessTeam({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select unit",
      team: "Please Select Team",
      process: "Please Select Process",
    });
    setdocumentFiles([]);
    setFilteredTeam([]);
    setFilteredProcess([]);
    setValueProcessCat([]);
    setSelectedOptionsProcess([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //company multiselect
  const [selectedOptionsProcess, setSelectedOptionsProcess] = useState([]);
  let [valueProcessCat, setValueProcessCat] = useState([]);

  const handleProcessChange = (options) => {
    setValueProcessCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsProcess(options);
  };

  const customValueRendererProcess = (valueProcessCat, _categoryname) => {
    return valueProcessCat?.length
      ? valueProcessCat.map(({ label }) => label)?.join(", ")
      : "Please Select Process";
  };

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProcessTeamEdit(res?.data?.sprocessteam);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....

  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProcessTeamEdit(res?.data?.sprocessteam);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProcessTeamEdit(res?.data?.sprocessteam);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  let updateby = processTeamEdit.updatedby;
  let addedby = processTeamEdit.addedby;
  let processId = processTeamEdit._id;

  //editing the single data...

  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_PROCESS_AND_TEAM}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(
            documentFilesEdit?.length === 0 ? processTeamEdit.company : ""
          ),
          branch: String(
            documentFilesEdit?.length === 0 ? processTeamEdit.branch : ""
          ),
          unit: String(
            documentFilesEdit?.length === 0 ? processTeamEdit.unit : ""
          ),
          team: String(
            documentFilesEdit?.length === 0 ? processTeamEdit.team : ""
          ),
          process: String(
            documentFilesEdit?.length === 0 ? processTeamEdit.process : ""
          ),
          // choosefile:  [...documentFilesEdit] ,
          updatedby: [
            ...updateby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEmployee();
      await fetchProcessQueue();
      await fetchProcessQueueAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = processTeamArrayEdit?.some(
      (item) =>
        item.company == processTeamEdit.company &&
        item.branch == processTeamEdit.branch &&
        item.unit == processTeamEdit.unit &&
        item.team == processTeamEdit.team &&
        item.process == processTeamEdit.process
    );
    if (processTeamEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processTeamEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processTeamEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processTeamEdit.team === "Please Select Team") {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processTeamEdit.process === "Please Select Process") {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Process Team.
  const fetchProcessQueue = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setProcessTeamArray(res_freq?.data?.processteam);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployee = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.PROCESS_AND_TEAM_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery,
        assignbranch: accessbranch
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));
      // setProcessTeamArray(itemsWithSerialNumber);
      setOverallFilterdata(itemsWithSerialNumber);
      // setClientUserIDArray(itemsWithSerialNumber)
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);


  const [processTeamFilterArray, setProcessTeamFilterArray] = useState([])

  const fetchProcessQueueArray = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];
    setPageName(!pageName)
    try {
      let res_freq = await axios.post(SERVICE.ALL_PROCESS_AND_TEAM_ASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProcessTeamFilterArray(res_freq?.data?.processteam);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchProcessQueueArray()
  }, [isFilterOpen])

  const bulkdeletefunction = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_PROCESS_AND_TEAM}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchEmployee();
      await fetchProcessQueue();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all Process Team.

  const fetchProcessQueueAll = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProcessTeamArrayEdit(
        res_freq?.data?.processteam.filter(
          (item) => item._id !== processTeamEdit._id
        )
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ProcessTeam.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Process Team",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = processTeamArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
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
    // setPage(1);
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = overallFilterdata?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredDatas.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 150,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
    },
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
          {isUserRoleCompare?.includes("eprocessteammapping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dprocessteammapping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vprocessteammapping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iprocessteammapping") && (
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

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      process: item.process,
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
  // Function to filter columns based on search query
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
    <Box
      style={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
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
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              {" "}
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"PROCESS AND TEAM"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Process Team"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Process Team Mapping"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aprocessteammapping") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography
                    sx={userStyle.importheadtext}
                    style={{ fontWeight: "600" }}
                  >
                    Add Process Team
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={isAssignBranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        placeholder="Please Select Company"
                        value={{
                          label: processTeam.company,
                          value: processTeam.company,
                        }}
                        onChange={(e) => {
                          setProcessTeam({
                            ...processTeam,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            process: "Please Select Process",
                          });
                          setValueProcessCat([]);
                          setSelectedOptionsProcess([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={isAssignBranch?.filter(
                          (comp) =>
                            processTeam.company === comp.company
                        )?.map(data => ({
                          label: data.branch,
                          value: data.branch,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        placeholder="Please Select Branch"
                        value={{
                          label: processTeam.branch,
                          value: processTeam.branch,
                        }}
                        onChange={(e) => {
                          setProcessTeam({
                            ...processTeam,
                            branch: e.value,
                            unit: "Please Select Unit",
                            team: "Please Select Team",
                            process: "Please Select Process",
                          });
                          setValueProcessCat([]);
                          setSelectedOptionsProcess([]);
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
                        maxMenuHeight={250}
                        options={isAssignBranch?.filter(
                          (comp) =>
                            processTeam.company === comp.company && processTeam.branch === comp.branch
                        )?.map(data => ({
                          label: data.unit,
                          value: data.unit,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        placeholder="Please Select Unit"
                        value={{
                          label: processTeam.unit,
                          value: processTeam.unit,
                        }}
                        onChange={(e) => {
                          setProcessTeam({
                            ...processTeam,
                            unit: e.value,
                            team: "Please Select Team",
                            process: "Please Select Process",
                          });
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
                        maxMenuHeight={250}
                        options={filteredTeam}
                        placeholder="Please Select Team"
                        value={{
                          label: processTeam.team,
                          value: processTeam.team,
                        }}
                        onChange={(e) => {
                          setProcessTeam({
                            ...processTeam,
                            team: e.value,
                            process: "Please Select Process",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Process<b style={{ color: "red" }}>*</b>
                      </Typography>

                      <MultiSelect
                        options={filteredProcess}
                        value={selectedOptionsProcess}
                        onChange={(e) => {
                          handleProcessChange(e);
                        }}
                        valueRenderer={customValueRendererProcess}
                        labelledBy="Please Select Process"
                      />
                    </FormControl>
                  </Grid>
                </>
              </Grid>
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
                    {" "}
                    Submit
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {!loader ? (
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
          {isUserRoleCompare?.includes("lprocessteammapping") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Process Team List
                </Typography>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 180,
                            width: 80,
                          },
                        },
                      }}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={processTeamArray?.length}>All</MenuItem> */}
                    </Select>
                  </Box>
                </Grid>
                <Grid
                  item
                  md={8}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    {isUserRoleCompare?.includes("excelprocessteammapping") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchProcessQueueArray()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvprocessteammapping") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchProcessQueueArray()
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printprocessteammapping") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfprocessteammapping") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                            fetchProcessQueueArray()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageprocessteammapping") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              {isUserRoleCompare?.includes("bdprocessteammapping") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  onClipboardCopy={(copiedString) =>
                    setCopiedData(copiedString)
                  }
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  ref={gridRef}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                />
              </Box>
              <Box>
                <Pagination
                  page={searchQuery !== "" ? 1 : page}
                  pageSize={pageSize}
                  totalPages={searchQuery !== "" ? 1 : totalPages}
                  onPageChange={handlePageChange}
                  pageItemLength={filteredDatas?.length}
                  totalProjects={
                    searchQuery !== "" ? filteredDatas?.length : totalProjects
                  }
                />
              </Box>

              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}
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
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Process Team
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{processTeamEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{processTeamEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{processTeamEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{processTeamEdit.team}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Process</Typography>
                  <Typography>{processTeamEdit.process}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Process Team
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{
                        label:
                          processTeamEdit.company === ""
                            ? "Please Select Company"
                            : processTeamEdit.company,
                        value:
                          processTeamEdit.company === ""
                            ? "Please Select Company"
                            : processTeamEdit.company,
                      }}
                      onChange={(e) => {
                        setProcessTeamEdit({
                          ...processTeamEdit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          process: "Please Select Process",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          processTeamEdit.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Branch"
                      value={{
                        label:
                          processTeamEdit.branch === ""
                            ? "Please Select Branch"
                            : processTeamEdit.branch,
                        value:
                          processTeamEdit.branch === ""
                            ? "Please Select Branch"
                            : processTeamEdit.branch,
                      }}
                      onChange={(e) => {
                        setProcessTeamEdit({
                          ...processTeamEdit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          process: "Please Select Process",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={isAssignBranch?.filter(
                        (comp) =>
                          processTeamEdit.company === comp.company && processTeamEdit.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Unit"
                      value={{
                        label:
                          processTeamEdit.unit === ""
                            ? "Please Select Unit"
                            : processTeamEdit.unit,
                        value:
                          processTeamEdit.unit === ""
                            ? "Please Select Unit"
                            : processTeamEdit.unit,
                      }}
                      onChange={(e) => {
                        setProcessTeamEdit({
                          ...processTeamEdit,
                          unit: e.value,
                          team: "Please Select Team",
                          process: "Please Select Process",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredTeamEdit}
                      placeholder="Please Select Team"
                      value={{
                        label:
                          processTeamEdit.team === ""
                            ? "Please Select Team"
                            : processTeamEdit.team,
                        value:
                          processTeamEdit.team === ""
                            ? "Please Select Team"
                            : processTeamEdit.team,
                      }}
                      onChange={(e) => {
                        setProcessTeamEdit({
                          ...processTeamEdit,
                          team: e.value,
                          process: "Please Select Process",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredProcessEdit}
                      placeholder="Please Select Process"
                      value={{
                        label:
                          processTeamEdit.process === ""
                            ? "Please Select Process"
                            : processTeamEdit.process,
                        value:
                          processTeamEdit.process === ""
                            ? "Please Select Process"
                            : processTeamEdit.process,
                      }}
                      onChange={(e) => {
                        setProcessTeamEdit({
                          ...processTeamEdit,
                          process: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
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
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
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
        filteredDataTwo={filteredDatas ?? []}
        itemsTwo={processTeamFilterArray ?? []}
        filename={"Process Team"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Process Team Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProcess}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
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

export default ProcessTeam;