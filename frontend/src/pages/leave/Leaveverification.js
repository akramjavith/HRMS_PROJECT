import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { handleApiError } from "../../components/Errorhandling";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Divider, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, InputAdornment } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MultiSelect } from "react-multi-select-component";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import AdvancedSearchBar from '../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../components/ManageColumn";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function LeaveVerification() {

  const gridRefTableLeaveTeamVeri = useRef(null);
  const gridRefImageLeaveTeamVeri = useRef(null);

  const [teamgrouping, setTeamgrouping] = useState({
    categoryfrom: "Please Select Category",
    subcategoryfrom: "Please Select Subcategory",
    companyfrom: "Please Select Company",
    type: "Please Select Type",
    companyto: "Please Select Company",
  });

  const typeOption = [
    { label: "Leave", value: "Leave" },
    { label: "Permission", value: "Permission" },
  ];

  const [teamgroupingEdit, setTeamgroupingEdit] = useState([]);
  const [teamgroupingview, setTeamgroupingsview] = useState([]);
  const [teamgroupings, setTeamgroupings] = useState([]);
  const [items, setItems] = useState([]);
  const [allTeamgroupingedit, setAllTeamgroupingedit] = useState([]);

  // State to track advanced filter
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  //To
  const [units, setUnits] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [teamgroupingCheck, setTeamgroupingcheck] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);

  //new fields changes
  const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
  const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);
  const [selectedTeamFrom, setSelectedTeamFrom] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);

  const [selectedBranchTo, setSelectedBranchTo] = useState([]);
  const [selectedUnitTo, setSelectedUnitTo] = useState([]);
  const [selectedTeamTo, setSelectedTeamTo] = useState([]);
  const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employeesall, setEmployeesall] = useState([]);
  const [teamsall, setTeamsall] = useState([]);

  //EDIT FIELDS
  const [selectedBranchFromEdit, setSelectedBranchFromEdit] = useState([]);
  const [selectedUnitFromEdit, setSelectedUnitFromEdit] = useState([]);
  const [selectedTeamFromEdit, setSelectedTeamFromEdit] = useState([]);
  const [selectedEmployeeFromEdit, setSelectedEmployeeFromEdit] = useState([]);

  const [selectedBranchToEdit, setSelectedBranchToEdit] = useState([]);
  const [selectedUnitToEdit, setSelectedUnitToEdit] = useState([]);
  const [selectedTeamToEdit, setSelectedTeamToEdit] = useState([]);
  const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); }

  //Datatable
  const [pageLeaveTeamVeri, setPageLeaveTeamVeri] = useState(1);
  const [pageSizeLeaveTeamVeri, setPageSizeLeaveTeamVeri] = useState(10);
  const [searchQueryLeaveTeamVeri, setSearchQueryLeaveTeamVeri] = useState("");
  const [totalPagesLeaveTeamVeri, setTotalPagesLeaveTeamVeri] = useState(1);

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => { setOpenview(true); };
  const handleCloseview = () => { setOpenview(false); };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setBtnSubmit(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleCloseMod = () => { setIsDeleteOpen(false); };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  // const handleClickOpencheckbox = () => {
  //   setIsDeleteOpencheckbox(true);
  // };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // Manage Columns
  const [isManageColumnsOpenLeaveTeamVeri, setManageColumnsOpenLeaveTeamVeri] = useState(false);
  const [searchQueryManageLeaveTeamVeri, setSearchQueryManageLeaveTeamVeri] = useState("");
  const [anchorElLeaveTeamVeri, setAnchorElLeaveTeamVeri] = useState(null);

  const handleOpenManageColumnsLeaveTeamVeri = (event) => {
    setAnchorElLeaveTeamVeri(event.currentTarget);
    setManageColumnsOpenLeaveTeamVeri(true);
  };
  const handleCloseManageColumnsLeaveTeamVeri = () => {
    setManageColumnsOpenLeaveTeamVeri(false);
    setSearchQueryManageLeaveTeamVeri("");
  };

  const openLeaveTeamVeri = Boolean(anchorElLeaveTeamVeri);
  const idLeaveTeamVeri = openLeaveTeamVeri ? "simple-popover" : undefined;

  // Search bar
  const [anchorElSearchLeaveTeamVeri, setAnchorElSearchLeaveTeamVeri] = React.useState(null);
  const handleClickSearchLeaveTeamVeri = (event) => {
    setAnchorElSearchLeaveTeamVeri(event.currentTarget);
  };
  const handleCloseSearchLeaveTeamVeri = () => {
    setAnchorElSearchLeaveTeamVeri(null);
    setSearchQueryLeaveTeamVeri("");
  };

  const openSearchLeaveTeamVeri = Boolean(anchorElSearchLeaveTeamVeri);
  const idSearchLeaveTeamVeri = openSearchLeaveTeamVeri ? 'simple-popover' : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibilityLeaveTeamVeri = {
    serialNumber: true,
    checkbox: true,
    category: true,
    subcategory: true,
    subsubcategory: true,
    type: true,
    company: true,
    companyto: true,
    branchlist: true,
    unitlist: true,
    teamlist: true,
    employeenamefromlist: true,
    branchtolist: true,
    unittolist: true,
    teamtolist: true,
    employeenametolist: true,
    actions: true,
  };

  const [columnVisibilityLeaveTeamVeri, setColumnVisibilityLeaveTeamVeri] = useState(initialColumnVisibilityLeaveTeamVeri);

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Leave/Permission Verification"),
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteTeamgrp, setDeleteTeamgrp] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteTeamgrp(res?.data?.steamgrouping);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let Teamgrpsid = deleteTeamgrp?._id;
  const delTeamgrp = async () => {
    setPageName(!pageName)
    try {
      if (Teamgrpsid) {
        await axios.delete(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${Teamgrpsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchTeamgrouping();
        handleCloseMod();
        setSelectedRows([]);
        setPageLeaveTeamVeri(1);
        setIsHandleChange(false);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectAllChecked(false);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delTeamgrpcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPageLeaveTeamVeri(1);

      await fetchTeamgrouping();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //branch multiselect dropdown changes
  const handleBranchChangeFrom = (options) => {
    setSelectedBranchFrom(options);
    setSelectedUnitFrom([]);

    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererBranchFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedUnitFrom(options);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererUnitFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Team multiselect dropdown changes
  const handleTeamChangeFrom = (options) => {
    setSelectedTeamFrom(options);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererTeamFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options);
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  //type multiselect
  const [selectedOptionsType, setSelectedOptionsType] = useState([]);
  let [valueTypeCat, setValueTypeCat] = useState([]);
  const [selectedTypeOptionsCateEdit, setSelectedTypeOptionsCateEdit] =
    useState([]);
  const [typeValueCateEdit, setTypeValueCateEdit] = useState("");

  const handleTypeChange = (options) => {
    setValueTypeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsType(options);
  };

  const customValueRendererType = (valueTypeCat, _categoryname) => {
    return valueTypeCat?.length
      ? valueTypeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Type";
  };

  const handleTypeChangeEdit = (options) => {
    setTypeValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTypeOptionsCateEdit(options);
  };
  const customValueRendererTypeEdit = (typeValueCateEdit, _employeename) => {
    return typeValueCateEdit?.length
      ? typeValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Type";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeTo = (options) => {
    setSelectedBranchTo(options);
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererBranchTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeTo = (options) => {
    setSelectedUnitTo(options);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererUnitTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeTo = (options) => {
    setSelectedTeamTo(options);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererTeamTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeTo = (options) => {
    setSelectedEmployeeTo(options);

    const optionIds = options.map((option) => option._id);
    const updatedSelectedEmployeeFrom = selectedEmployeeFrom.filter(
      (value) => !optionIds.includes(value._id)
    );
    setSelectedEmployeeFrom(updatedSelectedEmployeeFrom);
  };
  const customValueRendererEmployeeTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  //EDIT MULSTISELECT ONCHANGE
  //branch multiselect dropdown changes
  const handleBranchChangeFromEdit = (options) => {
    setSelectedBranchFromEdit(options);
    setSelectedUnitFromEdit([]);
    setSelectedTeamFromEdit([]);
    setSelectedEmployeeFromEdit([]);
  };
  const customValueRendererBranchFromEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChangeFromEdit = (options) => {
    setSelectedUnitFromEdit(options);
    setSelectedTeamFromEdit([]);
    setSelectedEmployeeFromEdit([]);
  };
  const customValueRendererUnitFromEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Team multiselect dropdown changes
  const handleTeamChangeFromEdit = (options) => {
    setSelectedTeamFromEdit(options);
    setSelectedEmployeeFromEdit([]);
  };
  const customValueRendererTeamFromEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeFromEdit = (options) => {
    setSelectedEmployeeFromEdit(options);
  };
  const customValueRendererEmployeeFromEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select From Employee Name";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeToEdit = (options) => {
    setSelectedBranchToEdit(options);
    setSelectedUnitToEdit([]);
    setSelectedTeamToEdit([]);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererBranchToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeToEdit = (options) => {
    setSelectedUnitToEdit(options);
    setSelectedTeamToEdit([]);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererUnitToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeToEdit = (options) => {
    setSelectedTeamToEdit(options);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererTeamToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeToEdit = (options) => {
    setSelectedEmployeeToEdit(options);
    const optionIds = options.map((option) => option.value);
    const updatedSelectedEmployeeFrom = selectedEmployeeFromEdit.filter(
      (valuess) => !optionIds.includes(valuess.value)
    );
    setSelectedEmployeeFromEdit(updatedSelectedEmployeeFrom);
  };
  const customValueRendererEmployeeToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select To Employee Name";
  };

  const fetchCompanyAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let companyalldata = res?.data?.companies.map((item) => ({
        ...item,
        value: item.name,
        label: item.name,
      }));
      setCompanies(companyalldata);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchBranchAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranches(res.data.branch);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchUnitAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnits(res.data.units);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchTeamAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamsall(res.data.teamsdetails);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchEmployeesAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeesall(res.data.users);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchTeamgrouping();
  }, []);

  useEffect(() => {
    fetchCompanyAll();
    fetchBranchAll();
    fetchUnitAll();
    fetchTeamAll();
    fetchEmployeesAll();
  }, []);

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    setBtnSubmit(true);
    let branchnamesfrom = selectedBranchFrom.map((item) => item.value);
    let unitnamesfrom = selectedUnitFrom.map((item) => item.value);
    let teamnamesfrom = selectedTeamFrom.map((item) => item.value);
    let employeenamesfrom = selectedEmployeeFrom.map((item) => item.value);
    let branchnamesto = selectedBranchTo.map((item) => item.value);
    let unitnamesto = selectedUnitTo.map((item) => item.value);
    let teamnamesto = selectedTeamTo.map((item) => item.value);
    let employeenamesto = selectedEmployeeTo.map((item) => item.value);
    try {
      await axios.post(SERVICE.LEAVEVERIFICATION_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        companyfrom: String(teamgrouping.companyfrom),
        branchfrom: branchnamesfrom,
        unitfrom: unitnamesfrom,
        teamfrom: teamnamesfrom,
        employeenamefrom: employeenamesfrom,
        type: valueTypeCat,
        companyto: String(teamgrouping.companyto),
        branchto: branchnamesto,
        unitto: unitnamesto,
        teamto: teamnamesto,
        employeenameto: employeenamesto,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchTeamgrouping();
      setBtnSubmit(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    const isNameMatch = teamgroupings.some(
      (item) =>
        item.companyfrom === teamgrouping.companyfrom &&
        item.companyto === teamgrouping.companyto &&
        item.branchfrom.some((item) =>
          selectedBranchFrom.map((item) => item.value).includes(item)
        ) &&
        item.unitfrom.some((item) =>
          selectedUnitFrom.map((item) => item.value).includes(item)
        ) &&
        item.teamfrom.some((item) =>
          selectedTeamFrom.map((item) => item.value).includes(item)
        ) &&
        item.employeenamefrom.some((item) =>
          selectedEmployeeFrom.map((item) => item.value).includes(item)
        ) &&
        item.type.some((item) =>
          selectedOptionsType.map((item) => item.value).includes(item)
        ) &&
        item.branchto.some((item) =>
          selectedBranchTo.map((item) => item.value).includes(item)
        ) &&
        item.unitto.some((item) =>
          selectedUnitTo.map((item) => item.value).includes(item)
        ) &&
        item.teamto.some((item) =>
          selectedTeamTo.map((item) => item.value).includes(item)
        ) &&
        item.employeenameto.some((item) =>
          selectedEmployeeTo.map((item) => item.value).includes(item)
        )
    );

    if (teamgrouping.companyfrom === "Please Select Company") {
      setPopupContentMalert("Please Select Company From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedBranchFrom.length === 0) {
      setPopupContentMalert("Please Select Branch From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedUnitFrom.length === 0) {
      setPopupContentMalert("Please Select Unit From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedTeamFrom.length === 0) {
      setPopupContentMalert("Please Select Team From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeFrom.length === 0) {
      setPopupContentMalert("Please Select Employeename From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsType.length === 0) {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (teamgrouping.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedBranchTo.length === 0) {
      setPopupContentMalert("Please Select Branch To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedUnitTo.length === 0) {
      setPopupContentMalert("Please Select Unit To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedTeamTo.length === 0) {
      setPopupContentMalert("Please Select Team To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeTo.length === 0) {
      setPopupContentMalert("Please Select Employeename To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Leave/Permission Verification Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //handle Clear
  const handleClear = (e) => {
    e.preventDefault();
    setTeamgrouping({
      categoryfrom: "Please Select Category",
      subcategoryfrom: "Please Select Subcategory",
      companyfrom: "Please Select Company",
      type: "Please Select Type",
      companyto: "Please Select Company",
    });
    setSelectedBranchFrom([]);
    setSelectedUnitFrom([]);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
    setSelectedBranchTo([]);
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
    setSubcategorys([]);
    setValueCat([]);
    setSelectedOptionsCat([]);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setValueTypeCat([]);
    setSelectedOptionsType([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => { setOpeninfo(true); };
  const handleCloseinfo = () => { setOpeninfo(false); };

  const [categorys, setCategorys] = useState([]);
  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);

  //category multiselect

  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState([]);
  const [selectedCategoryOptionsCateEdit, setSelectedCategoryOptionsCateEdit] =
    useState([]);
  const [categoryValueCateEdit, setCategoryValueCateEdit] = useState("");

  const [selectedTypeOptionsTypeEdit, setSelectedTypeOptionsTypeEdit] =
    useState([]);
  const [categoryValueTypeEdit, setTypeValueTypeEdit] = useState("");

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setTeamgrouping({ ...teamgrouping, type: "Please Select Type" });
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat?.length
      ? valueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  const handleCategoryChangeEdit = (options) => {
    setCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCategoryOptionsCateEdit(options);
    setSubCategoryValueCateEdit([]);
    setSelectedSubCategoryOptionsCateEdit([]);
    setSubSubCategoryValueCateEdit([]);
    setSelectedTypeOptionsTypeEdit([]);
    setTypeValueTypeEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
    setTeamgroupingEdit({
      ...teamgroupingEdit,
      typefrom: "Please Select Type",
    });
  };
  const customValueRendererCategoryEdit = (
    categoryValueCateEdit,
    _employeename
  ) => {
    return categoryValueCateEdit?.length
      ? categoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  //subcategory multiselect
  const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);
  let [valueSubCat, setValueSubCat] = useState([]);
  const [
    selectedSubCategoryOptionsCateEdit,
    setSelectedSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subCategoryValueCateEdit, setSubCategoryValueCateEdit] = useState("");

  const handleSubCategoryChange = (options) => {
    setValueSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCat(options);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setTeamgrouping({ ...teamgrouping, type: "Please Select Type" });
  };

  const customValueRendererSubCat = (valueSubCat, _categoryname) => {
    return valueSubCat?.length
      ? valueSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const handleSubCategoryChangeEdit = (options) => {
    setSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubCategoryOptionsCateEdit(options);
    setSelectedTypeOptionsTypeEdit([]);
    setTypeValueTypeEdit([]);
    setTeamgroupingEdit({
      ...teamgroupingEdit,
      typefrom: "Please Select Type",
    });
    setSubSubCategoryValueCateEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
  };
  const customValueRendererSubCategoryEdit = (
    subCategoryValueCateEdit,
    _employeename
  ) => {
    return subCategoryValueCateEdit?.length
      ? subCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState(
    []
  );
  const [filteredSubCategoryOptionsEdit, setFilteredSubCategoryOptionsEdit] =
    useState([]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => valueCat?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptions(subcategoryNames);
  }, []);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => categoryValueCateEdit?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptionsEdit(subcategoryNames);
  }, []);

  //sub sub category multiselect

  const [filteredSubSubCategoryOptions, setFilteredSubSubCategoryOptions] =
    useState([]);
  const [
    filteredSubSubCategoryOptionsEdit,
    setFilteredSubSubCategoryOptionsEdit,
  ] = useState([]);

  const [selectedOptionsSubSubCat, setSelectedOptionsSubSubCat] = useState([]);
  let [valueSubSubCat, setValueSubSubCat] = useState([]);
  const [
    selectedSubSubCategoryOptionsCateEdit,
    setSelectedSubSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subSubCategoryValueCateEdit, setSubSubCategoryValueCateEdit] =
    useState("");

  const handleSubSubCategoryChange = (options) => {
    setValueSubSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubSubCat(options);
    setTeamgrouping({ ...teamgrouping, type: "Please Select Type" });
  };

  const customValueRendererSubSubCat = (valueSubSubCat, _categoryname) => {
    return valueSubSubCat?.length
      ? valueSubSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const handleSubSubCategoryChangeEdit = (options) => {
    setSubSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubSubCategoryOptionsCateEdit(options);
    setSelectedTypeOptionsTypeEdit([]);
    setTypeValueTypeEdit([]);
    setTeamgroupingEdit({
      ...teamgroupingEdit,
      typefrom: "Please Select Type",
    });
  };
  const customValueRendererSubSubCategoryEdit = (
    subSubCategoryValueCateEdit,
    _employeename
  ) => {
    return subSubCategoryValueCateEdit?.length
      ? subSubCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const [typeOptions, setTypeOptions] = useState([]);

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchTeamgroupingAll();
      setTypeValueCateEdit(res?.data?.steamgrouping?.type);
      setSelectedTypeOptionsCateEdit([
        ...res?.data?.steamgrouping?.type.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamgroupingEdit(res?.data?.steamgrouping);
      setSelectedBranchFromEdit(
        res?.data?.steamgrouping.branchfrom.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedBranchToEdit(
        res?.data?.steamgrouping.branchto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedUnitFromEdit(
        res?.data?.steamgrouping.unitfrom.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedUnitToEdit(
        res?.data?.steamgrouping.unitto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedTeamFromEdit(
        res?.data?.steamgrouping.teamfrom.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedTeamToEdit(
        res?.data?.steamgrouping.teamto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedEmployeeFromEdit(
        res?.data?.steamgrouping.employeenamefrom.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedEmployeeToEdit(
        res?.data?.steamgrouping.employeenameto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSubCategoryValueCateEdit(res?.data?.steamgrouping?.subcategoryreason);

      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamgroupingEdit(res?.data?.steamgrouping);
      setTeamgroupingsview(res?.data?.steamgrouping);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamgroupingEdit(res?.data?.steamgrouping);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //Project updateby edit page...
  let updateby = teamgroupingEdit?.updatedby;
  let addedby = teamgroupingEdit?.addedby;

  let subprojectsid = teamgroupingEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    let branchnamesfrom = selectedBranchFromEdit.map((item) => item.value);
    let unitnamesfrom = selectedUnitFromEdit.map((item) => item.value);
    let teamnamesfrom = selectedTeamFromEdit.map((item) => item.value);
    let employeenamesfrom = selectedEmployeeFromEdit.map((item) => item.value);
    let branchnamesto = selectedBranchToEdit.map((item) => item.value);
    let unitnamesto = selectedUnitToEdit.map((item) => item.value);
    let teamnamesto = selectedTeamToEdit.map((item) => item.value);
    let employeenamesto = selectedEmployeeToEdit.map((item) => item.value);

    try {
      await axios.put(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        companyfrom: String(teamgroupingEdit.companyfrom),
        branchfrom: branchnamesfrom,
        unitfrom: unitnamesfrom,
        teamfrom: teamnamesfrom,
        employeenamefrom: employeenamesfrom,
        type: typeValueCateEdit,
        companyto: String(teamgroupingEdit.companyto),
        branchto: branchnamesto,
        unitto: unitnamesto,
        teamto: teamnamesto,
        employeenameto: employeenamesto,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setTeamgrouping({
        ...teamgrouping,
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        type: "Please Select Type",
      });
      await fetchTeamgrouping();
      await fetchTeamgroupingAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    let subSubcatopt = selectedSubSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );

    const isNameMatch = allTeamgroupingedit.some(
      (item) =>
        item.companyfrom === teamgroupingEdit.companyfrom &&
        item.companyto === teamgroupingEdit.companyto &&
        item.branchfrom.some((item) =>
          selectedBranchFromEdit.map((item) => item.value).includes(item)
        ) &&
        item.unitfrom.some((item) =>
          selectedUnitFromEdit.map((item) => item.value).includes(item)
        ) &&
        item.teamfrom.some((item) =>
          selectedTeamFromEdit.map((item) => item.value).includes(item)
        ) &&
        item.employeenamefrom.some((item) =>
          selectedEmployeeFromEdit.map((item) => item.value).includes(item)
        ) &&
        item.type.some((item) =>
          selectedTypeOptionsCateEdit.map((item) => item.value).includes(item)
        ) &&
        item.branchto.some((item) =>
          selectedBranchToEdit.map((item) => item.value).includes(item)
        ) &&
        item.unitto.some((item) =>
          selectedUnitToEdit.map((item) => item.value).includes(item)
        ) &&
        item.teamto.some((item) =>
          selectedTeamToEdit.map((item) => item.value).includes(item)
        ) &&
        item.employeenameto.some((item) =>
          selectedEmployeeToEdit.map((item) => item.value).includes(item)
        )
    );

    if (selectedTypeOptionsCateEdit.length === 0) {
      setPopupContentMalert("Please Select Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (teamgroupingEdit.companyfrom === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedBranchFromEdit.length === 0) {
      setPopupContentMalert("Please Select Branch From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedUnitFromEdit.length === 0) {
      setPopupContentMalert("Please Select Unit From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedTeamFromEdit.length === 0) {
      setPopupContentMalert("Please Select Team From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeFromEdit.length === 0) {
      setPopupContentMalert("Please Select Employeename From");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (teamgroupingEdit.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedBranchToEdit.length === 0) {
      setPopupContentMalert("Please Select Branch To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedUnitToEdit.length === 0) {
      setPopupContentMalert("Please Select Unit To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedTeamToEdit.length === 0) {
      setPopupContentMalert("Please Select Team To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeToEdit.length === 0) {
      setPopupContentMalert("Please Select Employeename To");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Leave/Permission Verification Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

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

  //get all Sub vendormasters.
  const fetchTeamgrouping = async () => {
    setPageName(!pageName)
    try {
      let res_team = await axios.post(SERVICE.LEAVEVERIFICATION_ASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      const itemsWithSerialNumber = res_team?.data?.teamgroupings?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        category: item.categoryfrom
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        subcategory: item.subcategoryfrom
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        subsubcategory: item.subsubcategoryfrom
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        type: item?.type,
        company: item.companyfrom,
        branch: item.branchfrom,
        unit: item.unitfrom,
        team: item.teamfrom,
        companyto: item.companyto,
        branchto: item.branchto,
        unitto: item.unitto,
        teamto: item.teamto,
        employeenameto: item.employeenameto,
        employeenamefrom: item.employeenamefrom,
        branchlist: item.branchfrom
          ?.map((t, i) => t)
          .join(", ")
          .toString(),
        unitlist: item.unitfrom
          ?.map((t, i) => t)
          .join(", ")
          .toString(),
        teamlist: item.teamfrom
          ?.map((t, i) => t)
          .join(", ")
          .toString(),
        branchtolist: item.branchto
          ? item.branchto
            ?.map((t, i) => t)
            .join(", ")
            .toString()
          : "",
        unittolist: item.unitto
          ?.map((t, i) => t)
          .join(", ")
          .toString(),
        teamtolist: item.teamto
          ?.map((t, i) => t)
          .join(", ")
          .toString(),
        employeenametolist: item.employeenameto
          ?.map((t, i) => `${i + 1 + "."}` + t)
          .join(", ")
          .toString(),
        employeenamefromlist: item.employeenamefrom
          ?.map((t, i) => `${i + 1 + "."}` + t)
          .join(", ")
          .toString(),
      }));
      setTeamgroupings(itemsWithSerialNumber);
      setTeamgroupingcheck(true);
      setTotalPagesLeaveTeamVeri(Math.ceil(itemsWithSerialNumber.length / pageSizeLeaveTeamVeri));
    } catch (err) { setTeamgroupingcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all Sub vendormasters.
  const fetchTeamgroupingAll = async () => {
    setPageName(!pageName)
    try {
      let res_team = await axios.get(SERVICE.LEAVEVERIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllTeamgroupingedit(
        res_team?.data?.teamgroupings.filter(
          (item) => item._id !== teamgroupingEdit._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // useEffect(() => {
  //   fetchTeamgroupingAll();
  // }, [isEditOpen, teamgroupingEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(teamgroupings);
  }, [teamgroupings]);

  const handleSearch = items.map((item, index) => ({
    ...item,
    id: item._id,
    category: item.categoryfrom
      ?.map((t, i) => `${i + 1 + ". "}` + t)
      .toString(),
    subcategory: item.subcategoryfrom
      ?.map((t, i) => `${i + 1 + ". "}` + t)
      .toString(),
    subsubcategory: item.subsubcategoryfrom
      ?.map((t, i) => `${i + 1 + ". "}` + t)
      .toString(),
    type: item?.type?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
    branchlist: item.branchfrom
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    unitlist: item.unitfrom
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    teamlist: item.teamfrom
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    branchtolist: item.branchto
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    unittolist: item.unitto
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    teamtolist: item.teamto
      ?.map((t, i) => t)
      .join(",")
      .toString(),
    employeenameto: item.employeenameto,
    employeenamefrom: item.employeenamefrom,
    employeenametolist: item.employeenameto
      ?.map((t, i) => `${i + 1 + "."}` + t)
      .join(",")
      .toString(),
    employeenamefromlist: item.employeenamefrom
      ?.map((t, i) => `${i + 1 + "."}` + t)
      .join(",")
      .toString(),
  }));


  // Split the search query into individual terms
  const searchTerms = searchQueryLeaveTeamVeri.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  // Pagination for outer filter
  const filteredData = filteredDatas?.slice((pageLeaveTeamVeri - 1) * pageSizeLeaveTeamVeri, pageLeaveTeamVeri * pageSizeLeaveTeamVeri);
  const totalPagesLeaveTeamVeriOuter = Math.ceil(filteredDatas?.length / pageSizeLeaveTeamVeri);
  const visiblePages = Math.min(totalPagesLeaveTeamVeriOuter, 3);
  const firstVisiblePage = Math.max(1, pageLeaveTeamVeri - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesLeaveTeamVeriOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageLeaveTeamVeri * pageSizeLeaveTeamVeri;
  const indexOfFirstItem = indexOfLastItem - pageSizeLeaveTeamVeri;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  const columnDataTableLeaveTeamVeri = [
    {
      field: "checkbox",
      headerName: "",
      headerStyle: { fontWeight: "bold", },
      sortable: false,
      width: 75,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibilityLeaveTeamVeri.checkbox,
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityLeaveTeamVeri.serialNumber,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 120,
      hide: !columnVisibilityLeaveTeamVeri.type,
    },
    {
      field: "company",
      headerName: "From Company",
      flex: 0,
      width: 120,
      hide: !columnVisibilityLeaveTeamVeri.company,
    },
    {
      field: "branchlist",
      headerName: " From Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.branchlist,
    },
    {
      field: "unitlist",
      headerName: "From Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.unitlist,
    },
    {
      field: "teamlist",
      headerName: "From Team",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.teamlist,
    },
    {
      field: "employeenamefromlist",
      headerName: "From Employee Name",
      flex: 0,
      width: 220,
      hide: !columnVisibilityLeaveTeamVeri.employeenamefromlist,
    },

    {
      field: "companyto",
      headerName: "To Company",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.companyto,
    },
    {
      field: "branchtolist",
      headerName: "To Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.branchtolist,
    },
    {
      field: "unittolist",
      headerName: "To Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.unittolist,
    },
    {
      field: "teamtolist",
      headerName: "To Team",
      flex: 0,
      width: 100,
      hide: !columnVisibilityLeaveTeamVeri.teamtolist,
    },
    {
      field: "employeenametolist",
      headerName: "To Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibilityLeaveTeamVeri.employeenametolist,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      filter: false,
      sortable: false,
      hide: !columnVisibilityLeaveTeamVeri.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eleave/permissionverification") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dleave/permissionverification") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vleave/permissionverification") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ileave/permissionverification") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
    };
  });

  // Datatable
  const handlePageSizeChange = (e) => {
    setPageSizeLeaveTeamVeri(Number(e.target.value));
    setSelectAllChecked(false);
    setSelectedRows([]);
    setPageLeaveTeamVeri(1);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityLeaveTeamVeri };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityLeaveTeamVeri(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableLeaveTeamVeri.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManageLeaveTeamVeri.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityLeaveTeamVeri((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Excel
  const fileName = "Leave/Permission Verification";
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrt = ["Type", "Company", "Branch", "Unit", "Team", "Employee Name", "Company To", "Branch To", "Unit To", "Team To", "Employee Name To",]
  let exportRowValuescrt = ["type", "company", "branchlist", "unitlist", "teamlist", "employeenamefromlist", "companyto", "branchtolist", "unittolist", "teamtolist", "employeenametolist",]

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Leave/Permission Verification",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageLeaveTeamVeri.current) {
      domtoimage.toBlob(gridRefImageLeaveTeamVeri.current)
        .then((blob) => {
          saveAs(blob, "Leave/Permission Verification.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={"LEAVE/PERMISSION VERIFICATION"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Leave/Permission Verification"
        modulename="Leave&Permission"
        submodulename="Leave/Permission Verification"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aleave/permissionverification") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  From Leave/Permission Verification
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={companies}
                    styles={colourStyles}
                    value={{
                      label: teamgrouping.companyfrom,
                      value: teamgrouping.companyfrom,
                    }}
                    onChange={(e) => {
                      setTeamgrouping({
                        ...teamgrouping,
                        companyfrom: e.value,
                      });
                      setSelectedBranchFrom([]);
                      setSelectedUnitFrom([]);

                      setSelectedTeamFrom([]);
                      setSelectedEmployeeFrom([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={Array.from(
                      new Set(
                        branches
                          ?.filter(
                            (comp) => teamgrouping.companyfrom === comp.company
                          )
                          ?.map((com) => com.name)
                      )
                    ).map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    value={selectedBranchFrom}
                    onChange={handleBranchChangeFrom}
                    valueRenderer={customValueRendererBranchFrom}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={Array.from(
                      new Set(
                        units
                          ?.filter((comp) =>
                            selectedBranchFrom
                              .map((item) => item.value)
                              .includes(comp.branch)
                          )
                          ?.map((com) => com.name)
                      )
                    ).map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    value={selectedUnitFrom}
                    onChange={handleUnitChangeFrom}
                    valueRenderer={customValueRendererUnitFrom}
                    labelledBy="Please Select Unit"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <MultiSelect
                    options={Array.from(
                      new Set(
                        teamsall
                          ?.filter(
                            (comp) =>
                              selectedBranchFrom
                                .map((item) => item.value)
                                .includes(comp.branch) &&
                              selectedUnitFrom
                                .map((item) => item.value)
                                .includes(comp.unit)
                          )
                          ?.map((com) => com.teamname)
                      )
                    ).map((teamname) => ({
                      label: teamname,
                      value: teamname,
                    }))}
                    value={selectedTeamFrom}
                    onChange={handleTeamChangeFrom}
                    valueRenderer={customValueRendererTeamFrom}
                    labelledBy="Please Select Team"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Employee Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={employeesall
                      ?.filter(
                        (comp) =>
                          teamgrouping.companyfrom === comp.company &&
                          selectedBranchFrom
                            .map((item) => item.value)
                            .includes(comp.branch) &&
                          selectedUnitFrom
                            .map((item) => item.value)
                            .includes(comp.unit) &&
                          selectedTeamFrom
                            .map((item) => item.value)
                            .includes(comp.team) &&
                          !selectedEmployeeTo
                            .map((item) => item.value)
                            .includes(comp.companyname)
                      )
                      ?.map((com) => ({
                        ...com,
                        label: com.companyname,
                        value: com.companyname,
                      }))}
                    value={selectedEmployeeFrom}
                    onChange={handleEmployeeChangeFrom}
                    valueRenderer={customValueRendererEmployeeFrom}
                    labelledBy="Please Select Employeename"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={typeOption}
                    value={selectedOptionsType}
                    onChange={(e) => {
                      handleTypeChange(e);
                    }}
                    valueRenderer={customValueRendererType}
                    labelledBy="Please Select Type"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  To Leave/Permission Verification
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {/* <MultiSelect options={companies} value={selectedCompanyTo} onChange={handleCompanyChangeTo} valueRenderer={customValueRendererCompanyTo} labelledBy="Please Select Company" /> */}
                  <Selects
                    options={companies}
                    styles={colourStyles}
                    value={{
                      label: teamgrouping.companyto,
                      value: teamgrouping.companyto,
                    }}
                    onChange={(e) => {
                      setTeamgrouping({ ...teamgrouping, companyto: e.value });
                      setSelectedBranchTo([]);
                      setSelectedUnitTo([]);
                      setSelectedTeamTo([]);
                      setSelectedEmployeeTo([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={Array.from(
                      new Set(
                        branches
                          ?.filter(
                            (comp) => teamgrouping.companyto === comp.company
                          )
                          ?.map((com) => com.name)
                      )
                    ).map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    value={selectedBranchTo}
                    onChange={handleBranchChangeTo}
                    valueRenderer={customValueRendererBranchTo}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={Array.from(
                      new Set(
                        units
                          ?.filter((comp) =>
                            selectedBranchTo
                              .map((item) => item.value)
                              .includes(comp.branch)
                          )
                          ?.map((com) => com.name)
                      )
                    ).map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    value={selectedUnitTo}
                    onChange={handleUnitChangeTo}
                    valueRenderer={customValueRendererUnitTo}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <MultiSelect
                    options={Array.from(
                      new Set(
                        teamsall
                          ?.filter(
                            (comp) =>
                              selectedBranchTo
                                .map((item) => item.value)
                                .includes(comp.branch) &&
                              selectedUnitTo
                                .map((item) => item.value)
                                .includes(comp.unit)
                          )
                          ?.map((com) => com.teamname)
                      )
                    ).map((teamname) => ({
                      label: teamname,
                      value: teamname,
                    }))}
                    value={selectedTeamTo}
                    onChange={handleTeamChangeTo}
                    valueRenderer={customValueRendererTeamTo}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Employee Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={employeesall
                      ?.filter(
                        (comp) =>
                          teamgrouping.companyto === comp.company &&
                          selectedBranchTo
                            .map((item) => item.value)
                            .includes(comp.branch) &&
                          selectedUnitTo
                            .map((item) => item.value)
                            .includes(comp.unit) &&
                          selectedTeamTo
                            .map((item) => item.value)
                            .includes(comp.team)
                        // selectedEmployeeFrom
                        //   .map((item) => item.value)
                        //   .includes(comp.companyname)
                      )
                      ?.map((com) => ({
                        ...com,
                        label: com.companyname,
                        value: com.companyname,
                      }))}
                    value={selectedEmployeeTo}
                    onChange={handleEmployeeChangeTo}
                    valueRenderer={customValueRendererEmployeeTo}
                    labelledBy="Please Select Employeename"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12} >
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <LoadingButton loading={btnSubmit} variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                    Submit
                  </LoadingButton>
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        </Box>
      )}<br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lleave/permissionverification") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Leave/Permission Verification List
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeLeaveTeamVeri}
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
                    <MenuItem value={teamgroupings?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes(
                    "excelleave/permissionverification"
                  ) && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "csvleave/permissionverification"
                  ) && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "printleave/permissionverification"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfleave/permissionverification"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}
                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "imageleave/permissionverification"
                  ) && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon
                          sx={{ fontSize: "15px" }}
                        /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableLeaveTeamVeri}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPageLeaveTeamVeri}
                  maindatas={teamgroupings}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryLeaveTeamVeri}
                  setSearchQuery={setSearchQueryLeaveTeamVeri}
                  paginated={false}
                  totalDatas={teamgroupings}
                />
              </Grid>
            </Grid> <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns  </Button>            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsLeaveTeamVeri}>   Manage Columns  </Button>  &ensp;
            {isUserRoleCompare?.includes("bdleave/permissionverification") && (<Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>Bulk Delete</Button>)}<br /><br />
            {!teamgroupingCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            ) : (
              <>
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageLeaveTeamVeri} >
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTableLeaveTeamVeri}
                    columnVisibility={columnVisibilityLeaveTeamVeri}
                    page={pageLeaveTeamVeri}
                    setPage={setPageLeaveTeamVeri}
                    pageSize={pageSizeLeaveTeamVeri}
                    totalPages={totalPagesLeaveTeamVeri}
                    setColumnVisibility={setColumnVisibilityLeaveTeamVeri}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTableLeaveTeamVeri}
                    gridRefTableImg={gridRefImageLeaveTeamVeri}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    itemsList={teamgroupings}
                  />
                </Box>
              </>
            )}
          </Box>
        </>
      )}

      {/* Manage Column */}
      <Popover
        id={idLeaveTeamVeri}
        open={isManageColumnsOpenLeaveTeamVeri}
        anchorEl={anchorElLeaveTeamVeri}
        onClose={handleCloseManageColumnsLeaveTeamVeri}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsLeaveTeamVeri}
          searchQuery={searchQueryManageLeaveTeamVeri}
          setSearchQuery={setSearchQueryManageLeaveTeamVeri}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityLeaveTeamVeri}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityLeaveTeamVeri}
          initialColumnVisibility={initialColumnVisibilityLeaveTeamVeri}
          columnDataTable={columnDataTableLeaveTeamVeri}
        />
      </Popover>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseModEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        scroll="paper"
        sx={{ marginTop: '95px' }}
      >
        <Box sx={{ padding: "10px 20px" }}>
          <>
            <Grid container>
              <Grid item md={12} xs={12} sm={12}>
                <Typography variant="h6">
                  Edit Leave/Permission Verification
                </Typography>
              </Grid>
            </Grid>
            <br />
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    From Leave/Permission Verification
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={companies}
                      styles={colourStyles}
                      value={{
                        label: teamgroupingEdit.companyfrom,
                        value: teamgroupingEdit.companyfrom,
                      }}
                      onChange={(e) => {
                        setTeamgroupingEdit({
                          ...teamgroupingEdit,
                          companyfrom: e.value,
                        });
                        setSelectedBranchFromEdit([]);
                        setSelectedUnitFromEdit([]);
                        setSelectedTeamFromEdit([]);
                        setSelectedEmployeeFromEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={Array.from(
                        new Set(
                          branches
                            ?.filter(
                              (comp) =>
                                teamgroupingEdit.companyfrom === comp.company
                            )
                            ?.map((com) => com.name)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={selectedBranchFromEdit}
                      style={{
                        option: (base, state) => ({
                          ...base,
                          height: "40px", // Set the desired height here
                        }),
                        control: (base, state) => ({
                          ...base,
                          minHeight: "40px", // Set the desired height here
                        }),
                      }}
                      onChange={handleBranchChangeFromEdit}
                      valueRenderer={customValueRendererBranchFromEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={Array.from(
                        new Set(
                          units
                            ?.filter((comp) =>
                              selectedBranchFromEdit
                                .map((item) => item.value)
                                .includes(comp.branch)
                            )
                            ?.map((com) => com.name)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={selectedUnitFromEdit}
                      onChange={handleUnitChangeFromEdit}
                      valueRenderer={customValueRendererUnitFromEdit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={Array.from(
                        new Set(
                          teamsall
                            ?.filter(
                              (comp) =>
                                selectedBranchFromEdit
                                  .map((item) => item.value)
                                  .includes(comp.branch) &&
                                selectedUnitFromEdit
                                  .map((item) => item.value)
                                  .includes(comp.unit)
                            )
                            ?.map((com) => com.teamname)
                        )
                      ).map((teamname) => ({
                        label: teamname,
                        value: teamname,
                      }))}
                      value={selectedTeamFromEdit}
                      onChange={handleTeamChangeFromEdit}
                      valueRenderer={customValueRendererTeamFromEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={employeesall
                        ?.filter(
                          (comp) =>
                            teamgroupingEdit.companyfrom === comp.company &&
                            selectedBranchFromEdit
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitFromEdit
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamFromEdit
                              .map((item) => item.value)
                              .includes(comp.team) &&
                            !selectedEmployeeToEdit
                              .map((item) => item.value)
                              .includes(comp.companyname)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={selectedEmployeeFromEdit}
                      onChange={handleEmployeeChangeFromEdit}
                      valueRenderer={customValueRendererEmployeeFromEdit}
                      labelledBy="Please Select Employeename"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={typeOption}
                      value={selectedTypeOptionsCateEdit}
                      onChange={handleTypeChangeEdit}
                      valueRenderer={customValueRendererTypeEdit}
                      labelledBy="Please Select Type"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    To Leave/Permission Verification
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <MultiSelect options={companies} value={selectedCompanyToEdit} onChange={handleCompanyChangeToEdit} valueRenderer={customValueRendererCompanyToEdit} labelledBy="Please Select Company" /> */}
                    <Selects
                      options={companies}
                      styles={colourStyles}
                      value={{
                        label: teamgroupingEdit.companyto,
                        value: teamgroupingEdit.companyto,
                      }}
                      onChange={(e) => {
                        setTeamgroupingEdit({
                          ...teamgroupingEdit,
                          companyto: e.value,
                        });
                        setSelectedBranchToEdit([]);
                        setSelectedUnitToEdit([]);
                        setSelectedTeamToEdit([]);
                        setSelectedEmployeeToEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={Array.from(
                        new Set(
                          branches
                            ?.filter(
                              (comp) =>
                                teamgroupingEdit.companyto === comp.company
                            )
                            ?.map((com) => com.name)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={selectedBranchToEdit}
                      onChange={handleBranchChangeToEdit}
                      valueRenderer={customValueRendererBranchToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={Array.from(
                        new Set(
                          units
                            ?.filter((comp) =>
                              selectedBranchToEdit
                                .map((item) => item.value)
                                .includes(comp.branch)
                            )
                            ?.map((com) => com.name)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={selectedUnitToEdit}
                      onChange={handleUnitChangeToEdit}
                      valueRenderer={customValueRendererUnitToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={Array.from(
                        new Set(
                          teamsall
                            ?.filter(
                              (comp) =>
                                selectedBranchToEdit
                                  .map((item) => item.value)
                                  .includes(comp.branch) &&
                                selectedUnitToEdit
                                  .map((item) => item.value)
                                  .includes(comp.unit)
                            )
                            ?.map((com) => com.teamname)
                        )
                      ).map((teamname) => ({
                        label: teamname,
                        value: teamname,
                      }))}
                      value={selectedTeamToEdit}
                      onChange={handleTeamChangeToEdit}
                      valueRenderer={customValueRendererTeamToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={employeesall
                        ?.filter(
                          (comp) =>
                            teamgroupingEdit.companyto === comp.company &&
                            selectedBranchToEdit
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitToEdit
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamToEdit
                              .map((item) => item.value)
                              .includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={selectedEmployeeToEdit}
                      style={{
                        menu: (provided, state) => ({
                          ...provided,
                          position: "absolute",
                          top: "100%", // Set the desired top position
                          left: "0", // Set the desired left position
                          zIndex: 1000, // Set the desired zIndex
                        }),
                        menuList: (provided, state) => ({
                          ...provided,
                          maxHeight: "200px", // Set the desired max height here
                          overflowY: "auto", // Add scroll if the content exceeds max height
                        }),
                      }}
                      onChange={handleEmployeeChangeToEdit}
                      valueRenderer={customValueRendererEmployeeToEdit}
                      labelledBy="Please Select Employeename"
                    // className="scrollable-multiselect"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </> <br />  <br />
          </>
        </Box>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
            Update
          </Button>

          <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{ marginTop: '95px' }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>View Leave/Permission Verification</b>
            </Typography>
            <br /> <br />
            <Typography sx={userStyle.SubHeaderText}>
              <b>From Leave/Permission Verification</b>
            </Typography>
            <br /> <br />
            <Typography sx={userStyle.SubHeaderText}>
              <b>Type : </b>{" "}
              {teamgroupingview?.type
                ?.map((t, i) => t)
                .join(", ")
                .toString()}
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Company
                  </Typography>
                  <Typography>{teamgroupingview.companyfrom}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Branch
                  </Typography>
                  <Typography>
                    {teamgroupingview.branchfrom
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Unit
                  </Typography>
                  <Typography>
                    {teamgroupingview.unitfrom
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Team
                  </Typography>
                  <Typography>
                    {teamgroupingview.teamfrom
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Employee Name
                  </Typography>
                  <Typography>
                    {teamgroupingview?.employeenamefrom
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>{" "}
            <br />
            <Divider />
            <br />
            <Typography sx={userStyle.SubHeaderText}>
              <b>To Leave/Permission Verification</b>
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Company To
                  </Typography>
                  <Typography>{teamgroupingview?.companyto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Branch To
                  </Typography>
                  <Typography>
                    {teamgroupingview?.branchto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Unit To
                  </Typography>
                  <Typography>
                    {teamgroupingview.unitto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Team To
                  </Typography>
                  <Typography>
                    {teamgroupingview.teamto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Employee Name To
                  </Typography>
                  <Typography>
                    {teamgroupingview?.employeenameto
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
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
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}          >
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
      {/* EXTERNAL COMPONENTS -------------- END */}
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
        itemsTwo={teamgroupings ?? []}
        filename={"Leave/Permission Verification"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delTeamgrp}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delTeamgrpcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Leave/Permission Verification Info"
        addedby={addedby}
        updateby={updateby}
      />
    </Box>
  );
}

export default LeaveVerification;