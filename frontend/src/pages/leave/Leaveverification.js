import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { handleApiError } from "../../components/Errorhandling";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
  Box,
  Typography,
  OutlinedInput,
  Divider,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { MultiSelect } from "react-multi-select-component";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";

function LeaveVerification() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [allTeamgroupingedit, setAllTeamgroupingedit] = useState([]);

  //To
  const [units, setUnits] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [teamgroupingCheck, setTeamgroupingcheck] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

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
  const [setCopiedData] = useState("");

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
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Leave/Permission Verification.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setBtnSubmit(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteTeamgrp, setDeleteTeamgrp] = useState("");

  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteTeamgrp(res?.data?.steamgrouping);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let Teamgrpsid = deleteTeamgrp?._id;
  const delTeamgrp = async (e) => {
    try {
      if (Teamgrpsid) {
        await axios.delete(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchTeamgrouping();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Deleted Successfully"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delTeamgrpcheckbox = async () => {
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

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchTeamgrouping();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchBranchAll = async () => {
    try {
      let res = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranches(res.data.branch);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchUnitAll = async () => {
    try {
      let res = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnits(res.data.units);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchTeamAll = async () => {
    try {
      let res = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamsall(res.data.teamsdetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const fetchEmployeesAll = async () => {
    try {
      let res = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeesall(res.data.users);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCompanyAll();
    fetchBranchAll();
    fetchUnitAll();
    fetchTeamAll();
    fetchEmployeesAll();
    fetchTeamgrouping();
  }, []);

  //add function
  const sendRequest = async () => {
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {setBtnSubmit(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setBtnSubmit(true);
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedBranchFrom.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnitFrom.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedTeamFrom.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedEmployeeFrom.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employeename From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsType.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (teamgrouping.companyto === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedBranchTo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnitTo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedTeamTo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedEmployeeTo.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employeename To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Leave/Permission Verification already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
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
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

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
  }, [valueCat]);

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
  }, [categoryValueCateEdit]);

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
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamgroupingEdit(res?.data?.steamgrouping);
      setTeamgroupingsview(res?.data?.steamgrouping);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.LEAVEVERIFICATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamgroupingEdit(res?.data?.steamgrouping);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //Project updateby edit page...
  let updateby = teamgroupingEdit?.updatedby;
  let addedby = teamgroupingEdit?.addedby;

  let subprojectsid = teamgroupingEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (teamgroupingEdit.companyfrom === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedBranchFromEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnitFromEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedTeamFromEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedEmployeeFromEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employeename From"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (teamgroupingEdit.companyto === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedBranchToEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnitToEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedTeamToEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedEmployeeToEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employeename To"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Leave/Permission Verification already exists"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchTeamgrouping = async () => {
    try {
      let res_team = await axios.get(SERVICE.LEAVEVERIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamgroupingcheck(true);
      setTeamgroupings(res_team?.data?.teamgroupings);
    } catch (err) {setTeamgroupingcheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all Sub vendormasters.
  const fetchTeamgroupingAll = async () => {
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchTeamgroupingAll();
  }, [isEditOpen, teamgroupingEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = teamgroupings?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [teamgroupings]);

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

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = handleSearch?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
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
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 120,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "From Company",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branchlist",
      headerName: " From Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branchlist,
      headerClassName: "bold-header",
    },
    {
      field: "unitlist",
      headerName: "From Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unitlist,
      headerClassName: "bold-header",
    },
    {
      field: "teamlist",
      headerName: "From Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.teamlist,
      headerClassName: "bold-header",
    },
    {
      field: "employeenamefromlist",
      headerName: "From Employee Name",
      flex: 0,
      width: 220,
      hide: !columnVisibility.employeenamefromlist,
      headerClassName: "bold-header",
    },

    {
      field: "companyto",
      headerName: "To Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyto,
      headerClassName: "bold-header",
    },
    {
      field: "branchtolist",
      headerName: "To Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branchtolist,
      headerClassName: "bold-header",
    },
    {
      field: "unittolist",
      headerName: "To Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unittolist,
      headerClassName: "bold-header",
    },
    {
      field: "teamtolist",
      headerName: "To Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.teamtolist,
      headerClassName: "bold-header",
    },
    {
      field: "employeenametolist",
      headerName: "To Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeenametolist,
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
          {isUserRoleCompare?.includes("eleave/permissionverification") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dleave/permissionverification") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vleave/permissionverification") && (
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
          {isUserRoleCompare?.includes("ileave/permissionverification") && (
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
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
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

  // Excel
  const fileName = "Leave/Permission Verification";
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

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "SNo": index + 1,
          "Type": item.type,
          "Company From": item.company,
          "Branch From": item.branch?.map((t, i) => t).join(", ").toString(),
          "Unit From": item.unit?.map((t, i) => t).join(", ").toString(),
          "Team From": item.team?.map((t, i) => t).join(", ").toString(),
          "Employeename from": item.employeenamefrom?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
          "Company to": item.companyto,
          "Branch to": item.branchto?.map((t, i) => t).join(", ").toString(),
          "Unit to": item.unitto?.map((t, i) => t).join(", ").toString(),
          "Team to": item.teamto?.map((t, i) => t).join(", ").toString(),
          "Employeename to": item.employeenameto?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        teamgroupings.map((item, index) => ({
          "SNo": index + 1,
          "Type": item.type?.map((t, i) => t).join(", ").toString(),
          "Company From": item.companyfrom,
          "Branch From": item.branchfrom?.map((t, i) => t).join(", ").toString(),
          "Unit From": item.unitfrom?.map((t, i) => t).join(", ").toString(),
          "Team From": item.teamfrom?.map((t, i) => t).join(", ").toString(),
          "Employeename from": item.employeenamefrom?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
          "Company to": item.companyto,
          "Branch to": item.branchto?.map((t, i) => t).join(", ").toString(),
          "Unit to": item.unitto?.map((t, i) => t).join(", ").toString(),
          "Team to": item.teamto?.map((t, i) => t).join(", ").toString(),
          "Employeename to": item.employeenameto?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
        })),
        fileName,
      );
    }
    setIsFilterOpen(false)
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Leave/Permission Verification",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Type", field: "type" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branchlist" },
    { title: "Unit", field: "unitlist" },
    { title: "Team", field: "teamlist" },
    { title: "Employee Name", field: "employeenamefromlist" },
    { title: "Company To", field: "companyto" },
    { title: "Branch To", field: "branchtolist" },
    { title: "Unit To", field: "unittolist" },
    { title: "Team To", field: "teamtolist" },
    { title: "Employee Name To", field: "employeenametolist" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      teamgroupings.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,
        type: row.type?.map((t, i) => t).join(", ").toString(),
        company: row.companyfrom,
        branchlist: row.branchfrom?.map((t, i) => t).join(", ").toString(),
        unitlist: row.unitfrom?.map((t, i) => t).join(", ").toString(),
        teamlist: row.teamfrom?.map((t, i) => t).join(", ").toString(),
        employeenamefromlist: row.employeenamefrom?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
        companyto: row.companyto,
        branchtolist: row.branchto?.map((t, i) => t).join(", ").toString(),
        unittolist: row.unitto?.map((t, i) => t).join(", ").toString(),
        teamtolist: row.teamto?.map((t, i) => t).join(", ").toString(),
        employeenametolist: row.employeenameto?.map((t, i) => `${i + 1 + "."}` + t).join(",").toString(),
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Leave/Permission Verification.pdf");
  };



  return (
    <Box>
      <Headtitle title={"LEAVE/PERMISSION VERIFICATION"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Leave/Permission Verification
      </Typography>
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
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button> */}
                <LoadingButton loading={btnSubmit} variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <br /> <br />
      <br /> <br />
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          scroll="paper"
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
              </>
              <br />
              <br />
            </>
          </Box>
          <DialogActions>
            <Button variant="contained" onClick={editSubmit}>
              Update
            </Button>

            <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
            <br />
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
                    {/* <MenuItem value={teamgroupings?.length}>All</MenuItem> */}
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
                        {/* <ExportXL
                          csvData={filteredData?.map((item, index) => ({
                            Sno: index + 1,
                            Type: item.type,
                            "Company From": item.companyfrom,
                            "Branch From": item.branchfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Unit From": item.unitfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Team From": item.teamfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Employeename from": item.employeenamefrom
                              ?.map((t, i) => `${i + 1 + "."}` + t)
                              .join(",")
                              .toString(),
                            "Company to": item.companyto,
                            "Branch to": item.branchto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Unit to": item.unitto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Team to": item.teamto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Employeename to": item.employeenameto
                              ?.map((t, i) => `${i + 1 + "."}` + t)
                              .join(",")
                              .toString(),

                            // "Employee Name": t.,
                          }))}
                          fileName={fileName}
                        /> */}
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
                        {/* <ExportCSV
                          csvData={filteredData?.map((item, index) => ({
                            Sno: index + 1,
                            Type: item.type,
                            "Company From": item.companyfrom,
                            "Branch From": item.branchfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Unit From": item.unitfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Team From": item.teamfrom
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Employeename from": item.employeenamefrom
                              ?.map((t, i) => `${i + 1 + "."}` + t)
                              .join(",")
                              .toString(),
                            "Company to": item.companyto,
                            "Branch to": item.branchto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Unit to": item.unitto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Team to": item.teamto
                              ?.map((t, i) => t)
                              .join(", ")
                              .toString(),
                            "Employeename to": item.employeenameto
                              ?.map((t, i) => `${i + 1 + "."}` + t)
                              .join(",")
                              .toString(),

                            // "Employee Name": t.,
                          }))}
                          fileName={fileName}
                        /> */}
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
                        {/* <Button
                          sx={userStyle.buttongrp}
                          onClick={() => downloadPdf()}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button> */}
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdleave/permissionverification") && (
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
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
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
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>
      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delTeamgrp(Teamgrpsid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Leave/Permission Verification Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell>SNo</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Company To</TableCell>
                <TableCell>Branch To</TableCell>
                <TableCell>Unit To</TableCell>
                <TableCell>Team To</TableCell>
                <TableCell>Employee Name To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.companyfrom}</TableCell>
                    <TableCell>{row.branchlist}</TableCell>
                    <TableCell>{row.unitlist}</TableCell>
                    <TableCell>{row.teamlist}</TableCell>
                    <TableCell>{row.employeenamefromlist}</TableCell>
                    <TableCell>{row.companyto}</TableCell>
                    <TableCell>{row.branchtolist}</TableCell>
                    <TableCell>{row.unittolist}</TableCell>
                    <TableCell>{row.teamtolist}</TableCell>
                    <TableCell>{row.employeenametolist}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {fileFormat === 'xl' ?
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
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
                color="primary"
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delTeamgrpcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
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

export default LeaveVerification;