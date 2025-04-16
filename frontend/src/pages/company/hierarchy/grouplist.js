import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Checkbox, FormControlLabel, OutlinedInput, TableBody, TableRow, TableCell, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";


function Assignedgrouplist({ first }) {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    designationgroup: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employeename: true,
    supervisorchoose: true,
    mode: true,
    level: true,
    control: true, pagecontrols: true
  };
  const [columnVisibilityList, setColumnVisibilityList] = useState(initialColumnVisibility);
  useEffect(() => {
    localStorage.setItem("columnVisibilityList", JSON.stringify(columnVisibilityList));
  }, [columnVisibilityList]);


  let exportColumnNames = ['Designationgroup',
    'Department',
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Employee Name',
    'Supervisor Name',
    'Mode',
    'Level',
    'Control Name',
    'Module Control'];
  let exportRowValues = [
    'designationgroup',
    'department',
    'company',
    'branch',
    'unit',
    'team',
    'employeename',
    'supervisorchoose',
    'mode',
    'level',
    'control',
    'pagecontrols'
  ];


  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Setup/Hierarchy/Hierarchy Group List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };


  //get single row to edit....
  const [hirerarchiEdit, setHirerarchiEdit] = useState({ company: "Please Select Company", designationgroup: "Please Select Designation Group", department: "Please Select Department", branch: "Please Select Branch", unit: "Please Select Unit", team: "Please Select Team", employeename: "", supervisorchoose: "", mode: "Please Select Mode", level: "Please Select Sector", control: "" });
  const [groupList, setSetGroupList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allBranch, allTeam, alldepartment, allUnit, allUsersData, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);



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
          data?.subsubpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0
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
  const { auth } = useContext(AuthContext);
  //Datatable
  const [conditionCheckEdit, setConditionCheckEdit] = useState(false);
  const gridRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchQueryList, setSearchQueryL] = useState("");
  const [Loader, setLoader] = useState(false);

  const [pageList, setPageList] = useState(1);
  const [pageSizeList, setPageSizeList] = useState(10);
  const [itemsList, setItemsList] = useState([]);
  const [searchQueryList, setSearchQueryList] = useState("");

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };



  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setLoader(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // clipboard
  const [copiedData, setCopiedData] = useState("");

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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit start
  const [isEditOpenList, setIsEditOpenList] = useState(false);

  const handleClickOpenEditList = () => {
    setIsEditOpenList(true);
  };
  const handleCloseModEditList = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenList(false);
    setLoading("");
    setFilterUser([]);
  };

  const [isDeleteOpenList, setIsDeleteOpenList] = useState(false);

  //Delete model
  const handleClickOpenList = () => {
    setIsDeleteOpenList(true);
  };
  const handleCloseModList = () => {
    setIsDeleteOpenList(false);
  };
  // View start
  const [openview, setOpenviewList] = useState(false);

  const handleClickOpenviewList = () => {
    setOpenviewList(true);
  };

  const handleCloseviewList = () => {
    setOpenviewList(false);
  };

  // fetch company
  const [companyOpt, setCompany] = useState([]);
  const [showdept, setShowDept] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [getUsers, setGetUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [departmentOpt, setDepartment] = useState([]);
  const [designationGroupOpt, setDesignationGroup] = useState([]);
  const [controlname, setControlname] = useState({ controlname: "" });
  const [branchOpt, setBranch] = useState([]);
  const [unitOpt, setUnit] = useState([]);
  const [teamopt, setTeam] = useState([]);
  const [loading, setLoading] = useState("");

  const fetchCompany = async () => {
    setPageName(!pageName);
    try {

      let res = accessbranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })

      setCompany([
        { label: "All", value: "All" },
        ...res?.map((t) => ({
          ...t,
          label: t.value,
          value: t.value,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch Department Group
  const fetchDepartment = async () => {
    setPageName(!pageName);
    try {


      setDepartment([
        { label: "All", value: "All" },
        ...alldepartment?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch Designation Group
  const fetchDesignationGroup = async () => {
    setPageName(!pageName);
    try {

      let res = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationGroup([
        { label: "All", value: "All" },
        ...res?.data?.desiggroup?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchDesignation = async (e) => {
    if (e == "All") {
      setControlname({ controlname: "" });
    } else {
      setPageName(!pageName);
      try {

        let res = await axios.post(SERVICE.CONTROLNAME, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: e,
        });
        setControlname(...res.data.designationgroups);
      } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
  };

  // fetch Branch
  const fetchBranch = async () => {
    setPageName(!pageName);
    try {


      setBranch([
        { label: "All", value: "All" },
        ...allBranch?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch Unit
  const fetchUnit = async () => {
    setPageName(!pageName);
    try {


      setUnit([
        { label: "All", value: "All" },
        ...allUnit?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch Team
  const fetchTeam = async () => {
    setPageName(!pageName);
    try {


      setTeam([
        { label: "All", value: "All" },
        ...allTeam?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Fetch location wise data Start
  const fetchDesignation_Department_Branch = async (e) => {
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.LOCATIONWISE_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(e),
      });
      setDepartment([
        { label: "All", value: "All" },
        ...res?.data?.department?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);

      setBranch([
        { label: "All", value: "All" },
        ...res?.data?.branch?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch branch wise data from unit
  const fetchBranchwiseunit = async (e) => {
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.BRANCHWISE_UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: String(e),
      });

      setUnit([
        { label: "All", value: "All" },
        ...res?.data?.units?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch unit wise data from Team
  const fetchUnitwiseData = async (e) => {
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.UNITWISE_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: String(hirerarchiEdit.branch),
        unit: String(e),
      });

      setTeam([
        { label: "All", value: "All" },
        ...res?.data?.teams?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const HandleDefFilter = async (Hierachy, empids, ids, emps, designation) => {

    setLoading("");
    let ans = designation.filter((data) => data.value != "All");
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.USERWISE_FILTER_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: Hierachy.company,
        designationgroup: Hierachy.designationgroup == "Please Select Designation Group" ? "" : Hierachy.designationgroup == "" ? "" : Hierachy.designationgroup === "All" ? ans?.map((data) => data.value) : [Hierachy.designationgroup],
        department: Hierachy.department,
        branch: Hierachy.branch,
        unit: Hierachy.unit,
        team: Hierachy.team,
      });
      setFilterUser(res.data.users);
      const allRowIds = res.data.users?.length > 0 ? res.data.users.map((row) => row.empcode) : [];

      let answer = empids?.length > 0 ? empids?.filter(data => data && data !== "") : [];
      const ans = answer.length == allRowIds.length;
      setSelectAll(ans);
      setGetUsers(res.data.users.filter((item) => empids.includes(item.empcode)).map((item) => item));
      setemployeeseditid(ids);
      setSelectedRows(empids);
      setLoading("loaded");
      handleClickOpenEditList();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch unit wise data from Team
  const handleFilter = async (e) => {
    if (hirerarchiEdit.company == "Please Select Company") {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hirerarchiEdit.designationgroup === "Please Select Designation Group") {
      setPopupContentMalert('Please Select Designation Group');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.branch == "" || hirerarchiEdit.branch === "Please Select Branch")) {
      setPopupContentMalert('Please Select Branch ');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.unit == "" || hirerarchiEdit.unit === "Please Select Unit")) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.team == "" || hirerarchiEdit.team === "Please Select Team")) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!showdept && (hirerarchiEdit.department == "" || hirerarchiEdit.department === "Please Select Department")) {
      setPopupContentMalert('Please Select Department Or Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setPageName(!pageName);
      try {

        let ans = designationGroupOpt.filter((data) => data.value != "All");
        let res = await axios.post(SERVICE.USERWISE_FILTER_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(hirerarchiEdit.company == "Please Select Company" ? "" : hirerarchiEdit.company),
          designationgroup: hirerarchiEdit.designationgroup == "Please Select Designation Group" ? "" : hirerarchiEdit.designationgroup == "" ? "" : hirerarchiEdit.designationgroup === "All" ? ans.map((data) => data.value) : [hirerarchiEdit.designationgroup],
          department: String(hirerarchiEdit.department == "Please Select Department" ? "" : hirerarchiEdit.department),
          branch: String(hirerarchiEdit.branch == "Please Select Branch" ? "" : hirerarchiEdit.branch),
          unit: String(hirerarchiEdit.unit == "Please Select Unit" ? "" : hirerarchiEdit.unit),
          team: String(hirerarchiEdit.team == "Please Select Team" ? "" : hirerarchiEdit.team),
        });
        setFilterUser(res?.data?.users);
        setConditionCheckEdit(true);
        setSelectedRows([]);
        setGetUsers(res.data.users.filter((item) => selectedRows.includes(item.empcode)).map((item) => item));
      } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
  };
  const handleClearFilter = () => {
    setHirerarchiEdit({
      ...hirerarchiEdit,
      company: "Please Select Company",
      designationgroup: "Please Select Designation Group",
      department: "Please Select Department",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
    });
    setSelectedRows([]);
    setGetUsers([]);
    setBranch([])
    setDepartment([])
    setUnit([])
    setTeam([])
    setSelectAll(false);
    setControlname({ controlname: "" });
    setFilterUser([]);
    setConditionCheckEdit(false);
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // Info End
  let sno = 1;
  // this is the etimation concadination value
  const modifiedData = filterUser?.map((person) => ({
    ...person,
    sino: sno++,
  }));

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
      ...item, serialNumber: index + 1, id: index, employeename: item.employeename?.join(","),
      supervisorchoose: item.supervisorchoose?.join(","),
      pagecontrols: item?.pagecontrols?.join(", "),
    }));
    setItems(itemsWithSerialNumber);
  };
  const [control, setControl] = useState([]);

  //fetching Control names for Dropdowns
  const fetchControlname = async (value) => {
    setPageName(!pageName);
    try {

      let res_project = await axios.post(SERVICE.CONTROL_NAMES_BASED_ON_DESIG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: value,
      });
      const controlNames = res_project?.data?.controlnames?.length > 0 ? Array.from(
        new Set(res_project?.data?.controlnames.map(data => data.controlname)) // Create a Set of unique controlname values
      ).map(controlname => ({
        label: controlname, // Rebuild the object structure
        value: controlname
      })) : []
      setControl(controlNames);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    addSerialNumber();
  }, [filterUser]);

  useEffect(() => {
    fetchCompany();
    fetchDepartment();
    fetchDesignationGroup();
    fetchUnit();
    fetchTeam();
    fetchBranch();
  }, []);

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

  //CHECK BOX CHECKALL SELECTION
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
      setGetUsers([]);
    } else {
      const allRowIds = filteredData.map((row) => row.empcode);
      setGetUsers(filteredData.filter((item) => allRowIds.includes(item.empcode)));
      setSelectedRows(allRowIds);
      setSelectAll(true);
    }
  };
  //CHECK BOX SELECTION
  const handleCheckboxChange = (id, row) => {
    let updatedSelectedRows = [...selectedRows];

    if (selectedRows.includes(id)) {
      updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRows, id];
    }

    setGetUsers(filteredData.filter((item) => updatedSelectedRows.includes(item.empcode)));
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.length === filteredData.length);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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

  // fetch unit wise data from Team
  const [supervisorList, setSupervisorList] = useState([]);
  const fetchAllUsersList = async () => {
    setPageName(!pageName);
    try {


      let ans = allUsersData?.map((t) => ({
        label: t.companyname,
        value: t.companyname,
      }));
      setSupervisorList(ans);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const modeopt = [
    { label: "Only", value: "Only" },
    { label: "All", value: "All" },
  ];

  const levelopt = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  //get all project.
  const fetchAllApprovedsList = async () => {
    setLoader(true)
    setPageName(!pageName);
    try {

      let res_queue = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let groupList = res_queue?.data?.hirerarchi.filter((data, i) => {
        return data.action == true;
      });

      const groupedData = res_queue?.data?.hirerarchi.reduce((acc, item) => {
        const key = JSON.stringify({
          company: item.company,
          designationgroup: item.designationgroup,
          department: item.department,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          mode: item.mode,
          level: item.level,
          control: item.control,
          supervisorchoose: item.supervisorchoose,
          pagecontrols: item.pagecontrols
        });

        if (!acc[key]) {
          acc[key] = { ...item, employeename: [...item.employeename], unid: [item._id], empids: [item.empcode] };
        } else {
          acc[key].employeename.push(...item.employeename);
          acc[key].unid.push(item._id);
          acc[key].empids.push(item.empcode);
        }

        return acc;
      }, {});

      // Convert groupedData back to an array
      const mergedDataArray = Object.values(groupedData);
      setLoader(false)
      const answer = mergedDataArray?.length > 0 ? mergedDataArray?.map((item, index) => ({
        ...item, serialNumber: index + 1, employeename: item.employeename?.map((t, i) => `${i + 1 + ". "}` + t)
        ,
        supervisorchoose: item.supervisorchoose?.map((t, i) => `${i + 1 + ". "}` + t)
        ,
        pagecontrols: item?.pagecontrols?.map((t, i) => `${i + 1 + ". "}` + t)
        ,
      })) : [];
      setSetGroupList(answer);
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchAllApprovedsList();
    fetchAllUsersList();
  }, [isDeleteOpenList]);

  const [employesseditid, setemployeeseditid] = useState([]);

  const getCodeList = async (id, ids, emps, empids) => {

    setPageName(!pageName);
    try {

      let res = await axios.get(`${SERVICE.HIRERARCHI_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res_Desig = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const Designation = [
        { label: "All", value: "All" },
        ...res_Desig?.data?.desiggroup?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ];
      setHirerarchiEdit(res?.data?.shirerarchi);
      setValuePageControls(res?.data?.shirerarchi?.pagecontrols);
      setSelectedPageControls(res?.data?.shirerarchi?.pagecontrols?.map((item) => ({
        label: item,
        value: item,
      })));
      fetchControlname(res?.data?.shirerarchi?.designationgroup)
      fetchDesignation_Department_Branch(res?.data?.shirerarchi?.company);
      fetchBranchwiseunit(res?.data?.shirerarchi?.branch)
      fetchUnitwiseData(res?.data?.shirerarchi?.unit)
      fetchDesignation(res?.data?.shirerarchi?.designationgroup)
      setShowBranch(res?.data?.shirerarchi?.department ? true : false)
      setConditionCheckEdit(res?.data?.shirerarchi?.access === "all" ? true : false);
      setShowDept((res?.data?.shirerarchi?.branch || res?.data?.shirerarchi?.unit || res?.data?.shirerarchi?.team) ? true : false)
      HandleDefFilter(res?.data?.shirerarchi, empids, ids, emps, Designation);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  let updateby = hirerarchiEdit.updatedby;
  let addedby = hirerarchiEdit.addedby;
  const usernameaddedby = isUserRoleAccess?.companyname;
  const sendEditRequestList = async () => {
    setPageName(!pageName);
    try {

      if (getUsers.length > 0) {
        const updatePromises = getUsers?.map((item) => {
          return axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(hirerarchiEdit.company == "Please Select Company" ? "" : hirerarchiEdit.company),
            designationgroup: String(hirerarchiEdit.designationgroup == "Please Select Designation Group" ? "" : hirerarchiEdit.designationgroup),
            department: String(hirerarchiEdit.department == "Please Select Department" ? "" : hirerarchiEdit.department),
            branch: String(hirerarchiEdit.branch == "Please Select Branch" ? "" : hirerarchiEdit.branch),
            unit: String(hirerarchiEdit.unit == "Please Select Unit" ? "" : hirerarchiEdit.unit),
            team: String(hirerarchiEdit.team == "Please Select Team" ? "" : hirerarchiEdit.team),
            supervisorchoose: String(hirerarchiEdit.supervisorchoose),
            mode: String(hirerarchiEdit.mode),
            level: String(hirerarchiEdit.level),
            control: String(hirerarchiEdit.control),
            pagecontrols: valuePageControls,
            employeename: item.companyname,
            empcode: item.empcode,
            access: selectAll ? "all" : "",
            addedby: [
              {
                name: String(usernameaddedby),
                date: String(new Date()),
              },
            ],
          });
        });
        await Promise.all(updatePromises);
        await fetchAllApprovedsList();
        handleCloseModEditList();
        setPage(1);
        setSelectAll(false);
        setSelectedRows([]);
      } else {
        let anbs = axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(hirerarchiEdit.company == "Please Select Company" ? "" : hirerarchiEdit.company),
          designationgroup: String(hirerarchiEdit.designationgroup == "Please Select Designation Group" ? "" : hirerarchiEdit.designationgroup),
          department: String(hirerarchiEdit.department == "Please Select Department" ? "" : hirerarchiEdit.department),
          branch: String(hirerarchiEdit.branch == "Please Select Branch" ? "" : hirerarchiEdit.branch),
          unit: String(hirerarchiEdit.unit == "Please Select Unit" ? "" : hirerarchiEdit.unit),
          team: String(hirerarchiEdit.team == "Please Select Team" ? "" : hirerarchiEdit.team),
          supervisorchoose: String(hirerarchiEdit.supervisorchoose),
          mode: String(hirerarchiEdit.mode),
          level: String(hirerarchiEdit.level),
          control: String(hirerarchiEdit.control),
          pagecontrols: valuePageControls,
          employeename: "All",
          empcode: "",
          access: selectAll ? "all" : "",
          addedby: [
            {
              name: String(usernameaddedby),
              date: String(new Date()),
            },
          ],
        });
        await fetchAllApprovedsList();
        handleCloseModEditList();
        setPage(1);
        setSelectAll(false);
        setSelectedRows([]);
      }

      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmitList = async () => {
    let res = await axios.post(`${SERVICE.HIRERARCHI_EDIT_MATCHCHECK}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },

      company: String(hirerarchiEdit.company == "Please Select Company" ? "" : hirerarchiEdit.company),
      designationgroup: String(hirerarchiEdit.designationgroup == "Please Select Designation Group" ? "" : hirerarchiEdit.designationgroup),
      department: String(hirerarchiEdit.department == "Please Select Department" ? "" : hirerarchiEdit.department),
      branch: String(hirerarchiEdit.branch == "Please Select Branch" ? "" : hirerarchiEdit.branch),
      unit: String(hirerarchiEdit.unit == "Please Select Unit" ? "" : hirerarchiEdit.unit),
      team: String(hirerarchiEdit.team == "Please Select Team" ? "" : hirerarchiEdit.team),
      supervisorchoose: String(hirerarchiEdit.supervisorchoose),
      mode: String(hirerarchiEdit.mode),
      level: String(hirerarchiEdit.level),
      control: String(hirerarchiEdit.control),
      employeename: selectAll && getUsers?.map((item) => item?.companyname)?.length == 0 ? ["All"] : getUsers?.map((item) => item?.companyname),
      unids: employesseditid,
    });

    const getUsersName = selectAll && getUsers?.map((data) => data?.companyname)?.length == 0 ? ["All"] : getUsers?.map((data) => data?.companyname);


    if (hirerarchiEdit.company == "" || hirerarchiEdit.company == "Please Select Company") {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedPageControls?.length === 0) {
      setPopupContentMalert('Please Select Module Controls');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hirerarchiEdit.company == "" || hirerarchiEdit.designationgroup == "Please Select Designation Group") {
      setPopupContentMalert('Please Select Designation Group');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.branch == "" || hirerarchiEdit.branch === "Please Select Branch")) {
      setPopupContentMalert('Please Select Branch ');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.unit == "" || hirerarchiEdit.unit === "Please Select Unit")) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (showdept && (hirerarchiEdit.team == "" || hirerarchiEdit.team === "Please Select Team")) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!showdept && (hirerarchiEdit.department == "" || hirerarchiEdit.department === "Please Select Department")) {
      setPopupContentMalert('Please Select Department Or Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (getUsers?.length == 0 && !selectAll) {
      setPopupContentMalert('Please Select Employee Name');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (getUsersName?.some(data => hirerarchiEdit?.supervisorchoose.includes(data))) {
      setPopupContentMalert('Supervisor and Employee Names are Equal. Choose Different');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hirerarchiEdit.supervisorchoose == "" || hirerarchiEdit.supervisorchoose === "Please Select Supervisor") {
      setPopupContentMalert('Please Select Supervisor');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hirerarchiEdit.mode == "" || hirerarchiEdit.mode === "Please Select Mode") {
      setPopupContentMalert('Please Select Mode');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hirerarchiEdit.level == "" || hirerarchiEdit.level === "Please Select Sector") {
      setPopupContentMalert('Please Select Sector');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (hirerarchiEdit.control == "" || hirerarchiEdit.control === "Please Select Control") {
      setPopupContentMalert('Please Select Control');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (res?.data?.hirerarchi?.length > 0 ||
      res?.data?.hierarchyemp?.length > 0 ||
      res?.data?.hierarchysamesupemp?.length > 0 ||
      res?.data?.hierarchysuplvl?.length > 0 || res?.data?.hierarchysameempmodelevcont?.length > 0) {


      setPopupContentMalert(`
        ${res?.data?.hirerarchi?.length > 0 ? "These data already added!" :
          res?.data?.hierarchyemp?.length > 0 ? "This Employee , Supervisor and level is already added" :
            res?.data?.hierarchysamesupemp?.length > 0 ? " This supervisor and Employeenames are same" :
              res?.data?.hierarchysuplvl?.length > 0 ? " This supervisor , Employeenames and mode are same" :
                res?.data?.hierarchysameempmodelevcont?.length > 0 ? " This Employeenames,level , control and mode are same"
                  : ""}
      `);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const deletePromises = employesseditid?.map((item) => {
        return axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
      sendEditRequestList();
    }
  };

  // View end
  // Delete start
  const [deletequeueList, setDeleteQueueList] = useState([]);
  const rowDataList = async (ids) => {
    setPageName(!pageName);
    try {


      setDeleteQueueList(ids);
      handleClickOpenList();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const deleQueueList = async () => {
    setPageName(!pageName);
    try {

      const deletePromises = deletequeueList?.map((item) => {
        return axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      setPopupContent('Deleted Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllApprovedsList();
      handleCloseModList();
      setPageList(1);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Delete End

  // View start
  // get single row to view....
  const [viewEmployees, setViewemployees] = useState([]);
  const getviewCodeList = async (e, emps) => {
    setPageName(!pageName);
    try {

      let res = await axios.get(`${SERVICE.HIRERARCHI_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHirerarchiEdit(res?.data?.shirerarchi);
      setViewemployees(emps);
      handleClickOpenviewList();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // View End

  // Info start
  // get single row to view....
  const getinfoCodeList = async (e) => {
    setPageName(!pageName);
    try {

      let res = await axios.get(`${SERVICE.HIRERARCHI_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHirerarchiEdit(res?.data?.shirerarchi);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  //serial no for listing items
  const addSerialNumberList = (data) => {
    setItemsList(data);
  };

  const getRowClassNameList = (params) => {
    if (selectedRowsList.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //Datatable
  const handlePageChangeList = (newPage) => {
    setPageList(newPage);
  };

  const handlePageSizeChangeList = (event) => {
    setPageSizeList(Number(event.target.value));
    setPageList(1);
  };

  //datatable....
  const handleSearchChangeList = (event) => {
    setSearchQueryList(event.target.value);
    setPageList(1);
  };

  // Split the search query into individual terms
  const searchOverTermsList = searchQueryList.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasList = itemsList?.filter((item) => {
    return searchOverTermsList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataList = filteredDatasList?.slice((pageList - 1) * pageSizeList, pageList * pageSizeList);

  const totalPagesList = Math.ceil(filteredDatasList?.length / pageSizeList);

  const visiblePagesList = Math.min(totalPagesList, 3);

  const firstVisiblePageList = Math.max(1, pageList - 1);
  const lastVisiblePageList = Math.min(firstVisiblePageList + visiblePagesList - 1, totalPagesList);
  const pageNumbersList = [];

  const indexOfLastItemList = pageList * pageSizeList;
  const indexOfFirstItemList = indexOfLastItemList - pageSizeList;

  for (let i = firstVisiblePageList; i <= lastVisiblePageList; i++) {
    pageNumbersList.push(i);
  }
  useEffect(() => {
    addSerialNumberList(groupList);
  }, [groupList]);

  const fileName = "AssignedGroupList";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AssignedGroupList",
    pageStyle: "print",
  });






  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [selectedRowsList, setSelectedRowsList] = useState([]);
  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibilityList");
    if (savedVisibility) {
      setColumnVisibilityList(JSON.parse(savedVisibility));
    }
  }, []);

  const columnDataTableList = [
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
      hide: !columnVisibilityList.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityList.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "designationgroup", headerName: "Designation Group", flex: 0, width: 150, hide: !columnVisibilityList.designationgroup, headerClassName: "bold-header" },
    { field: "department", headerName: "Department", flex: 0, width: 100, hide: !columnVisibilityList.vendor, department: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibilityList.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 90, hide: !columnVisibilityList.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibilityList.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibilityList.team, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee name", flex: 0, width: 300, hide: !columnVisibilityList.employeename, headerClassName: "bold-header" },
    { field: "supervisorchoose", headerName: "SuperVisor Choose", flex: 0, width: 250, hide: !columnVisibilityList.supervisorchoose, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 50, hide: !columnVisibilityList.mode, headerClassName: "bold-header" },
    { field: "level", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibilityList.level, headerClassName: "bold-header" },
    { field: "control", headerName: "Control", flex: 0, width: 50, hide: !columnVisibilityList.control, headerClassName: "bold-header" },
    { field: "pagecontrols", headerName: "Module Control", flex: 0, width: 150, hide: !columnVisibilityList.pagecontrols, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 300,
      hide: !columnVisibilityList.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex", marginTop: "5px" }}>
          {isUserRoleCompare?.includes("ehierarchygrouplist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeList(params.data.id, params.data.unid, params.data.employeenameall, params.data.empids);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vhierarchygrouplist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeList(params.data.id, params.data.employeenameall);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ihierarchygrouplist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCodeList(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dhierarchygrouplist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataList(params.data.unid);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  // Create a row data object for the DataGrid
  const rowDataTableList = filteredDataList.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      designationgroup: item.designationgroup,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item?.team,
      employeename: item.employeename,
      supervisorchoose: item.supervisorchoose,
      pagecontrols: item?.pagecontrols,
      mode: item.mode,
      level: item.level,
      control: item.control,
      unid: item.unid,
      employeenameall: item.employeename,
      empids: item.empids,

    };
  });
  const rowsWithCheckboxes = rowDataTableList.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsList.includes(row.empids),
  }));

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityList };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityList(updatedVisibility);
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRowsList(newSelection.selectionModel);
  };

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigned Group List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  const [selectedPageControls, setSelectedPageControls] = useState([]);
  const [pageControls, setPageControls] = useState([]);
  let [valuePageControls, setValuePageControls] = useState("");


  //fetching Reporting To for Dropdowns
  const fetchPageControls = async () => {
    setPageName(!pageName);
    try {

      let res_project = await axios.get(SERVICE.REPORTINGHEADER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const pageControls = res_project?.data?.reportingheaders?.length > 0 ? res_project?.data?.reportingheaders?.map((data) => ({
        // ...data,
        label: data?.name,
        value: data?.name,
        id: data?._id
      })) : []

      setPageControls(pageControls);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchPageControls();
  }, [])
  const handlePageControlsChange = (options) => {
    setValuePageControls(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedPageControls(options);
  };

  const customValueRendererPageControl = (valueCate, _area) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Module Controls";
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityList((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

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
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityList[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityList(initialColumnVisibility)}>
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
                columnDataTableList.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityList(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <>
      <Headtitle title={"HIERARCHY GROUP LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Hierarchy Group List"
        modulename="Setup"
        submodulename="Hierarchy"
        mainpagename="Hierarchy Group List"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lhierarchygrouplist") && (
        <Box sx={userStyle.selectcontainer}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography sx={userStyle.importheadtext}>
              <b>Assigned Group List</b>
            </Typography>
          </Grid>
          <Grid container spacing={2} style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  value={pageSizeList}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeList}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={groupList.length}>All</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelhierarchygrouplist") &&
                    (<>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>)
                  }
                  {isUserRoleCompare?.includes("csvhierarchygrouplist") &&
                    (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>

                    )}
                  {isUserRoleCompare?.includes("printhierarchygrouplist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  )}
                  {isUserRoleCompare?.includes("pdfhierarchygrouplist") && (

                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>

                  )}
                  {isUserRoleCompare?.includes("imagehierarchygrouplist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <AggregatedSearchBar
                columnDataTable={columnDataTableList}
                setItems={setItemsList}
                addSerialNumber={addSerialNumberList}
                setPage={setPageList}
                maindatas={groupList}
                setSearchedString={setSearchedString}
                searchQuery={searchQueryList}
                setSearchQuery={setSearchQueryList}
                paginated={false}
                totalDatas={itemsList}
              />
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
          <br />
          <br />
          {Loader ?
            (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
                <br />
              </>
            )
            :
            (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >

                  <AggridTable
                    rowDataTable={rowDataTableList}
                    columnDataTable={columnDataTableList}
                    columnVisibility={columnVisibilityList}
                    page={pageList}
                    setPage={setPageList}
                    pageSize={pageSizeList}
                    totalPages={totalPagesList}
                    setColumnVisibility={setColumnVisibilityList}
                    isHandleChange={isHandleChange}
                    items={itemsList}
                    selectedRows={selectedRowsList}
                    setSelectedRows={setSelectedRowsList}
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatasList}
                    // totalDatas={totalProjects}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={itemsList}
                  />
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
              </>
            )}
          <br />
          <br />
          {/* Edit Alert */}
          <Box>
            {/* Edit DIALOG */}
            <Dialog open={isEditOpenList} onClose={handleCloseModEditList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "50px" }}>
              <DialogContent sx={[{ padding: "30px 35px" }, userStyle.dialogbox]}>
                <>
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography sx={userStyle.HeaderText}>Edit Hierarchy Board </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  {loading !== "loaded" ? (
                    <>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                      </Box>
                      <br />
                    </>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Company <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={companyOpt}
                              placeholder="Please Select Company"
                              value={{ label: hirerarchiEdit.company, value: hirerarchiEdit.company }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  company: e.value,
                                  designationgroup: "Please Select Designation Group",
                                  department: "Please Select Department",
                                  branch: "Please Select Branch",
                                  unit: "Please Select Unit",
                                  team: "Please Select Team",
                                });
                                fetchDesignation_Department_Branch(e.value);
                                setUnit([])
                                setTeam([])
                                setDepartment([])
                                setFilterUser([]);
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Designation Group<b style={{ color: "red" }}>*</b></Typography>
                            <Selects
                              options={designationGroupOpt}
                              placeholder="New"
                              value={{ label: hirerarchiEdit.designationgroup, value: hirerarchiEdit.designationgroup }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  designationgroup: e.value,
                                  department: "Please Select Department",
                                  branch: "Please Select Branch",
                                  unit: "Please Select Unit",
                                  team: "Please Select Team",
                                  control: "Please Select Control"
                                });
                                setUnit([])
                                setTeam([])
                                fetchDesignation(e.value);
                                fetchControlname(e.value);
                                setFilterUser([])
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Department</Typography>
                            <Selects
                              isDisabled={showdept}
                              options={departmentOpt}
                              placeholder="New"
                              value={{ label: hirerarchiEdit.department, value: hirerarchiEdit.department }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  department: e.value,
                                });
                                setTeam([])
                                setShowBranch(true);
                                setFilterUser([]);
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Branch</Typography>
                            <Selects
                              isDisabled={showBranch}
                              options={[{ label: "All", value: "All" }, ...accessbranch?.filter(
                                (comp) =>
                                  (hirerarchiEdit.company === "All" ? true : hirerarchiEdit.company === comp.company)
                              )?.map(data => ({
                                label: data.branch,
                                value: data.branch,
                              })).filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })]}
                              placeholder="New"
                              value={{ label: hirerarchiEdit.branch, value: hirerarchiEdit.branch }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  branch: e.value,
                                  unit: "Please Select Unit",
                                  team: "Please Select Team",
                                });
                                setShowDept(true);
                                fetchBranchwiseunit(e.value);
                                setFilterUser([]);
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Unit</Typography>
                            <Selects
                              isDisabled={showBranch}

                              options={[{ label: "All", value: "All" }, ...accessbranch?.filter(
                                (comp) =>
                                  (hirerarchiEdit.company === "All" ? true : hirerarchiEdit.company === comp.company)
                                  && (hirerarchiEdit.branch === "All" ? true : hirerarchiEdit.branch === comp.branch)
                              )?.map(data => ({
                                label: data.unit,
                                value: data.unit,
                              })).filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })]}
                              placeholder="New"
                              value={{ label: hirerarchiEdit.unit, value: hirerarchiEdit.unit }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  unit: e.value,
                                  team: "Please Select Team",
                                });
                                setShowDept(true);
                                fetchUnitwiseData(e.value);
                                setFilterUser([]);
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Team</Typography>
                            <Selects
                              isDisabled={showBranch}
                              options={[{ label: "All", value: "All" }, ...allTeam?.filter(
                                (comp) =>
                                  (hirerarchiEdit.company === "All" ? true : hirerarchiEdit.company === comp.company)
                                  && (hirerarchiEdit.branch === "All" ? true : hirerarchiEdit.branch === comp.branch)
                                  && (hirerarchiEdit.unit === "All" ? true : hirerarchiEdit.unit === comp.unit)
                              )?.map(data => ({
                                label: data.teamname,
                                value: data.teamname,
                              })).filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })]}
                              placeholder="New"
                              value={{ label: hirerarchiEdit.team, value: hirerarchiEdit.team }}
                              onChange={(e) => {
                                setHirerarchiEdit({
                                  ...hirerarchiEdit,
                                  team: e.value,
                                });
                                setShowDept(true);
                                setFilterUser([]);
                                setGetUsers([]);
                                setSelectAll(false);
                              }}
                            />
                          </FormControl>{" "}
                          <br></br>
                          <br></br>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <Button
                          sx={buttonStyles.buttonsubmit}
                          variant="contained"
                          //
                          onClick={() => {
                            handleFilter();
                          }}
                        >
                          Filter
                        </Button>

                        <Button
                          s sx={buttonStyles.btncancel}
                          onClick={() => {
                            handleClearFilter();
                            setShowDept(false);
                            setShowBranch(false);
                          }}
                        >
                          Clear
                        </Button>
                      </Box>
                      <br />
                      <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <Box>
                            <br />
                            <Grid style={userStyle.dataTablestyle}>
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
                                  <MenuItem value={filterUser?.length}>All</MenuItem>
                                </Select>
                              </Box>
                              <Box>
                                <FormControl fullWidth size="small">
                                  <Typography>Search</Typography>
                                  <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                </FormControl>
                              </Box>
                            </Grid>

                            {/* ****** Table start ****** */}
                            <TableContainer component={Paper}>
                              <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                                <TableHead sx={{ fontWeight: "600" }}>
                                  <StyledTableRow>
                                    <StyledTableCell sx={{ padding: "0 15px !IMPORTANT" }}>
                                      <Checkbox checked={selectAll} onChange={handleSelectAll} />
                                    </StyledTableCell>
                                    <StyledTableCell> SNo</StyledTableCell>
                                    <StyledTableCell> Employee Id</StyledTableCell>
                                    <StyledTableCell> Employee Name</StyledTableCell>
                                    <StyledTableCell> Branch</StyledTableCell>
                                    <StyledTableCell> Unit</StyledTableCell>
                                    <StyledTableCell> Team</StyledTableCell>
                                    <StyledTableCell> Designation</StyledTableCell>
                                  </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                  {conditionCheckEdit === false ? (
                                    ""
                                  ) : (
                                    <StyledTableRow>
                                      <StyledTableCell sx={{ padding: "0 15px !IMPORTANT" }}>
                                        <FormControlLabel sx={{ marginBotton: "0px" }} label="All" control={<Checkbox checked={selectAll} onChange={handleSelectAll} />} />
                                      </StyledTableCell>
                                      <StyledTableCell colSpan={7}></StyledTableCell>
                                    </StyledTableRow>
                                  )}
                                  {filteredData?.length > 0 ? (
                                    filteredData?.map((row, index) => (
                                      <StyledTableRow key={index}>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>
                                          <Checkbox checked={selectedRows.includes(row.empcode)} onChange={() => handleCheckboxChange(row.empcode, row)} />
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.serialNumber}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.empcode}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.companyname}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.branch}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.unit}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.team}</StyledTableCell>
                                        <StyledTableCell sx={{ fontSize: "12px", padding: "0 5px !IMPORTANT" }}>{row.designation}</StyledTableCell>
                                      </StyledTableRow>
                                    ))
                                  ) : conditionCheckEdit === true ? (
                                    ""
                                  ) : (
                                    <StyledTableRow>
                                      {" "}
                                      <StyledTableCell colSpan={13} align="center">
                                        No Data Available
                                      </StyledTableCell>{" "}
                                    </StyledTableRow>
                                  )}
                                  <StyledTableRow></StyledTableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <Box style={userStyle.dataTablestyle}>
                              <Box>
                                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
                          </Box>
                        </Grid>
                      </Grid>
                      <br /> <br />
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Employee Name<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput value={selectAll === true ? "All" : getUsers?.map((d) => d?.companyname)} />

                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Supervisor Choose<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              id="component-outlined"
                              type="text"
                              placeholder="Choose Designation"
                              options={supervisorList}
                              value={{ label: hirerarchiEdit.supervisorchoose, value: hirerarchiEdit.supervisorchoose }}
                              maxMenuHeight={200}
                              onChange={(e) => {
                                setHirerarchiEdit({ ...hirerarchiEdit, supervisorchoose: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Sector<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              id="component-outlined"
                              type="text"
                              placeholder="Choose Designation"
                              options={levelopt}
                              value={{ label: hirerarchiEdit.level, value: hirerarchiEdit.level }}
                              maxMenuHeight={200}
                              onChange={(e) => {
                                setHirerarchiEdit({ ...hirerarchiEdit, level: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              id="component-outlined"
                              type="text"
                              placeholder="Choose Designation"
                              options={modeopt}
                              value={{ label: hirerarchiEdit.mode, value: hirerarchiEdit.mode }}
                              maxMenuHeight={200}
                              onChange={(e) => {
                                setHirerarchiEdit({ ...hirerarchiEdit, mode: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Control<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={control}
                              styles={colourStyles}
                              value={{ label: hirerarchiEdit?.control, value: hirerarchiEdit?.control }}
                              onChange={(e) => {
                                setHirerarchiEdit({ ...hirerarchiEdit, control: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Module Controls<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={pageControls}
                              value={selectedPageControls}
                              onChange={handlePageControlsChange}
                              valueRenderer={customValueRendererPageControl}
                              labelledBy="Please Select Module Controls"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <br /> <br />
                      <DialogActions>
                        <Button
                          variant="contained"

                          onClick={editSubmitList}
                          sx={buttonStyles.buttonsubmit}
                        >
                          Update
                        </Button>

                        <Button

                          onClick={handleCloseModEditList}
                          sx={buttonStyles.btncancel}
                        >
                          Cancel
                        </Button>
                      </DialogActions>
                    </>
                  )}
                </>
              </DialogContent>
            </Dialog>

            {/* view model */}
            <Dialog open={openview} onClose={handleCloseviewList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: "50px" }}>
              <Box sx={{ padding: "20px 30px" }}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>View Hierarchy board </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}>Employee Name</Typography>
                    {viewEmployees.map((item, i) => (
                      <Typography>{item + " "}</Typography>
                    ))}
                  </Grid>
                  <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}> Supervisor Choose</Typography>
                    <Typography>{hirerarchiEdit?.supervisorchoose}</Typography>
                  </Grid>
                  <Grid item lg={4} md={4} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}> Mode</Typography>
                    <Typography>{hirerarchiEdit?.mode}</Typography>
                  </Grid>
                  <Grid item lg={4} md={4} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}> Sector</Typography>
                    <Typography>{hirerarchiEdit?.level}</Typography>
                  </Grid>
                  <Grid item lg={4} md={4} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}> Control Name</Typography>
                    <Typography>{hirerarchiEdit?.control}</Typography>
                  </Grid>
                  <Grid item lg={4} md={4} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: 700 }}> Module Controls</Typography>
                    <Typography>{hirerarchiEdit?.pagecontrols}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <DialogActions>
                <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handleCloseviewList}>
                  Back
                </Button>
              </DialogActions>
            </Dialog>

            {/* print DIALOG */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                <TableHead>
                  <TableRow>
                    <TableCell> SI.No</TableCell>
                    <TableCell> Designation Group</TableCell>
                    <TableCell> Department</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Employee name</TableCell>
                    <TableCell>SuperVisor Choose</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell>Control</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody align="left">
                  {rowDataTableList &&
                    rowDataTableList.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.designationgroup}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.team}</TableCell>
                        <TableCell>{row.employeename}</TableCell>
                        <TableCell>{row.supervisorchoose}</TableCell>
                        <TableCell>{row.mode}</TableCell>
                        <TableCell>{row.level}</TableCell>
                        <TableCell>{row.control}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpenList} onClose={handleCloseModList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseModList}
                  sx={buttonStyles.btncancel}
                >
                  Cancel
                </Button>
                <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={(e) => deleQueueList()}>
                  {" "}
                  OK{" "}
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
            filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTableList) ?? []}
            itemsTwo={itemsList ?? []}
            filename={"Assigned Group List"}
            exportColumnNames={exportColumnNames}
            exportRowValues={exportRowValues}
            componentRef={componentRef}
          />
          {/* INFO */}
          <InfoPopup
            openInfo={openInfo}
            handleCloseinfo={handleCloseinfo}
            heading="Assigned Group List Info"
            addedby={addedby}
            updateby={updateby}
          />
          {/* Edit Alert End */}
        </Box>
      )}
    </>
  );
}

export default Assignedgrouplist;