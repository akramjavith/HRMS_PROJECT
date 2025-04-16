import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
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
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../components/TableStyle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";
import { MultiSelect } from "react-multi-select-component";
import { colourStyles } from "../../pageStyle";
import { json } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ActionEmployeeAssignInterviewer from "./ActionEmployeeAssignInterviewer";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function Assigninterviewer() {
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable.map((t, index) => ({
          serialNumber: index + 1,

          "From Company": t.fromcompany,
          "From Branch": t.frombranch,
          "From Unit": t.fromunit,
          "From Team": t.fromteam,
          Type: t.type,
          Designation: t?.designation,
          Round: t?.round,

          "To Company": t.tocompany,
          "To Branch": t.tobranch,
          "To Unit": t.tounit,
          "To Team": t.toteam,
          employee: t.employee,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((t, index) => ({
          serialNumber: index + 1,

          "From Company": t.fromcompany
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Branch": t.frombranch
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Unit": t.fromunit
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Team": t.fromteam
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          Type: t.type,
          Designation: t?.designation,
          Round: t?.round?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

          "To Company": t.tocompany,
          "To Branch": t.tobranch,
          "To Unit": t.tounit,
          "To Team": t.toteam,
          employee: t?.employee
            ?.filter((name) => !formerUsers.includes(name))
            ?.map((ts, i) => `${i + 1 + ". "}` + ts)
            .toString(),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "From Company ", field: "fromcompany" },
    { title: "From Branch ", field: "frombranch" },
    { title: "From Unit ", field: "fromunit" },
    { title: "From Team ", field: "fromteam" },
    { title: "Type ", field: "type" },
    { title: "Designation ", field: "designation" },
    { title: "Round ", field: "round" },

    { title: "To Company ", field: "tocompany" },
    { title: "To Branch ", field: "tobranch" },
    { title: "To Unit ", field: "tounit" },
    { title: "To Team ", field: "toteam" },

    { title: "Employee Name ", field: "employee" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((t, index) => ({
            serialNumber: index + 1,

            fromcompany: t.fromcompany,
            frombranch: t.frombranch,
            fromunit: t.fromunit,
            fromteam: t.fromteam,
            type: t.type,
            designation: t?.designation,
            round: t?.round,

            tocompany: t.tocompany,
            tobranch: t.tobranch,
            tounit: t.tounit,
            toteam: t.toteam,
            employee: t.employee,
          }))
        : items?.map((t, index) => ({
            serialNumber: index + 1,

            fromcompany: t.fromcompany
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            frombranch: t.frombranch
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            fromunit: t.fromunit
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            fromteam: t.fromteam
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            type: t.type,
            designation: t?.designation,
            round: t?.round?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

            tocompany: t.tocompany,
            tobranch: t.tobranch,
            tounit: t.tounit,
            toteam: t.toteam,
            employee: t?.employee
              ?.filter((name) => !formerUsers.includes(name))
              ?.map((ts, i) => `${i + 1 + ". "}` + ts)
              .toString(),
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Assigninterviewer.pdf");
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [isDeleteOpenAl, setIsDeleteOpenAl] = useState(false);
  const [isBulkDeleteOpenAl, setIsBulkDeleteOpenAl] = useState(false);
  const [employeEdit, setEmployeeEdit] = useState([]);
  const [selectedOptionsEdit, setSelectedOptionsEdit] = useState([]);
  const [selectedEmployeeOpt, setSelectedEmployeeOpt] = useState([]);
  const [empValue, setEmpValue] = useState([]);
  const [editId, setEditId] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  //state to handle powerstation values
  const [assignInterviewerState, setAssignInterviewerState] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    type: "Interviewer",
    team: "Please Select Team",
    designation: "Please Select Designation",
    employee: [""],
  });
  const [assignInterviewerEdit, setAssignInterviewerEdit] = useState({
    tocompany: "Please Select Compay",
    tobranch: "Please Select Branch",
    tounit: "Please Select Unit",
    type: "Please Select Type",
    toteam: "Please Select Team",
    employee: "",
  });

  const [selectedOptionsCompanyAdd, setSelectedOptionsCompanyAdd] = useState(
    []
  );
  const [selectedOptionsRoundAdd, setSelectedOptionsRoundAdd] = useState([]);
  const [selectedOptionsBranchAdd, setSelectedOptionsBranchAdd] = useState([]);
  const [selectedOptionsUnitAdd, setSelectedOptionsUnitAdd] = useState([]);
  const [selectedOptionsTeamAdd, setSelectedOptionsTeamAdd] = useState([]);
  const [round, setRound] = useState([]);

  //get all Sub vendormasters.
  const fetchInterviewgrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.INTERVIEWQUESTIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const roundall = [
        ...res_vendor?.data?.interviewgroupingquestion.map((d) => ({
          ...d,
          label: d.round,
          value: d.round,
        })),
      ];

      setRound(roundall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //company-----------------------------------------
  const handleCompanyChangeAdd = (options) => {
    setSelectedOptionsCompanyAdd(options);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererCompanyAdd = (valueCompanyAdd, _shifts) => {
    return valueCompanyAdd.length ? (
      valueCompanyAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    );
  };

  //Branch-----------------------------------------
  const handleBranchChangeAdd = (options) => {
    setSelectedOptionsBranchAdd(options);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererBranchAdd = (valueBranchAdd, _shifts) => {
    return valueBranchAdd.length ? (
      valueBranchAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    );
  };

  //Unit-----------------------------------------
  const handleUnitChangeAdd = (options) => {
    setSelectedOptionsUnitAdd(options);
    setSelectedOptionsTeamAdd([]);
  };

  const customValueRendererUnitAdd = (valueUnitAdd, _shifts) => {
    return valueUnitAdd.length ? (
      valueUnitAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Unit</span>
    );
  };

  //Team-----------------------------------------

  const handleTeamChangeAdd = (options) => {
    setSelectedOptionsTeamAdd(options);
  };

  const customValueRendererTeamAdd = (valueTeamAdd, _shifts) => {
    return valueTeamAdd.length ? (
      valueTeamAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Team</span>
    );
  };

  //round-----------------------------------------
  const handleRoundChangeAdd = (options) => {
    setSelectedOptionsRoundAdd(options);
  };

  const customValueRendererRoundAdd = (valueRoundAdd, _shifts) => {
    return valueRoundAdd.length ? (
      valueRoundAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Round</span>
    );
  };
  // for Edit section---------------------------------------------------------------------------

  const [selectedOptionsCompanyAddEdit, setSelectedOptionsCompanyAddEdit] =
    useState([]);
  const [selectedOptionsRoundAddEdit, setSelectedOptionsRoundAddEdit] =
    useState([]);
  const [selectedOptionsBranchAddEdit, setSelectedOptionsBranchAddEdit] =
    useState([]);
  const [selectedOptionsUnitAddEdit, setSelectedOptionsUnitAddEdit] = useState(
    []
  );
  const [selectedOptionsTeamAddEdit, setSelectedOptionsTeamAddEdit] = useState(
    []
  );
  //round-----------------------------------------
  const handleRoundChangeAddEdit = (options) => {
    setSelectedOptionsRoundAddEdit(options);
  };

  const customValueRendererRoundAddEdit = (valueRoundAddEdit, _shifts) => {
    return valueRoundAddEdit.length ? (
      valueRoundAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Round</span>
    );
  };

  //company-----------------------------------------
  const handleCompanyChangeAddEdit = (options) => {
    setSelectedOptionsCompanyAddEdit(options);
    setSelectedOptionsBranchAddEdit([]);
    setSelectedOptionsUnitAddEdit([]);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererCompanyAddEdit = (valueCompanyAddEdit, _shifts) => {
    return valueCompanyAddEdit.length ? (
      valueCompanyAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    );
  };

  //Branch-----------------------------------------
  const handleBranchChangeAddEdit = (options) => {
    setSelectedOptionsBranchAddEdit(options);
    setSelectedOptionsUnitAddEdit([]);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererBranchAddEdit = (valueBranchAddEdit, _shifts) => {
    return valueBranchAddEdit.length ? (
      valueBranchAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    );
  };

  //Unit-----------------------------------------
  const handleUnitChangeAddEdit = (options) => {
    setSelectedOptionsUnitAddEdit(options);
    setSelectedOptionsTeamAddEdit([]);
  };

  const customValueRendererUnitAddEdit = (valueUnitAddEdit, _shifts) => {
    return valueUnitAddEdit.length ? (
      valueUnitAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Unit</span>
    );
  };

  //Team-----------------------------------------

  const handleTeamChangeAddEdit = (options) => {
    setSelectedOptionsTeamAddEdit(options);
  };

  const customValueRendererTeamAddEdit = (valueTeamAddEdit, _shifts) => {
    return valueTeamAddEdit.length ? (
      valueTeamAddEdit.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Team</span>
    );
  };

  const handleCategoryEditChange = (options) => {
    setEmployeeEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEdit(options);
  };
  const [powerstationArray, setPowerstationArray] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    alldesignation,
    allTeam,
    allUsersData,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteHoliday, setDeleteHoliday] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    fromcompany: true,
    frombranch: true,
    fromunit: true,
    fromteam: true,
    tocompany: true,
    tobranch: true,
    tounit: true,
    toteam: true,
    employee: true,
    type: true,
    designation: true,
    round: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isAddOpenalert, setIsAddOpenalert] = useState(false);
  const [isClearOpenalert, setIsClearOpenalert] = useState(false);
  const [isUpdateOpenalert, setIsUpdateOpenalert] = useState(false);
  const [isBulkDeleteOpenalert, seBulktIsDeletealert] = useState(false);
  //useEffect

  const typeOpt = [
    { value: "Interviewer", label: "Interviewer" },
    { value: "Hiring Manager", label: "Hiring Manager" },
    { value: "Issuing Authority", label: "Issuing Authority" },
  ];

  const handleEmployeeChange = (options) => {
    setEmpValue(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOpt(options);
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnDisable(false);
    setStatusCheck(false);
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

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteHoliday(res?.data?.sassigninterviewer);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let powerstationid = deleteHoliday._id;
  const delPowerstation = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${powerstationid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleCloseMod();
      setIsDeleteOpenAl(true);
      setTimeout(() => {
        setIsDeleteOpenAl(false);
      }, 1000);
      setSelectedRows([]);
      setPage(1);
      await fetchPowerstationAll();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAssignedInterviewEditAll = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      return res_status?.data?.assigninterview.filter(
        (item) => item._id !== assignInterviewerEdit._id
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    let fromCompanyName = selectedOptionsCompanyAdd.map((data) => data.value);
    let fromBranchName = selectedOptionsBranchAdd.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAdd.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAdd.map((data) => data.value);
    let round = selectedOptionsRoundAdd.map((data) => data.value);
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.ASSIGNINTERVIEWER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromcompany: fromCompanyName,
        frombranch: fromBranchName,
        fromunit: fromUnitName,
        fromteam: fromTeamName,
        tocompany: String(assignInterviewerState.company),
        tobranch: String(assignInterviewerState.branch),
        tounit: String(assignInterviewerState.unit),
        toteam: String(assignInterviewerState.team),
        type: String(assignInterviewerState.type),
        designation: String(
          assignInterviewerState.type === "Interviewer"
            ? assignInterviewerState.designation
            : ""
        ),
        round: assignInterviewerState.type === "Interviewer" ? round : [],
        employee: empValue,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setTimeout(() => {
        setBtnDisable(false);
      }, 1000);
      setIsAddOpenalert(true);
      setTimeout(() => {
        setIsAddOpenalert(false);
      }, 2000);
      await fetchPowerstationAll();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    setBtnDisable(true);
    e.preventDefault();
    let fromCompanyName = selectedOptionsCompanyAdd.map((data) => data.value);
    let fromBranchName = selectedOptionsBranchAdd.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAdd.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAdd.map((data) => data.value);
    let round = selectedOptionsRoundAdd.map((data) => data.value);

    const employeExits = empValue.map((c) => c);
    const isNameMatch = powerstationArray?.some(
      (item) =>
        item.tocompany?.toLowerCase() ==
          assignInterviewerState.company?.toLowerCase() &&
        item.tobranch == assignInterviewerState.branch &&
        item.tounit == assignInterviewerState.unit &&
        item.type == assignInterviewerState.type &&
        item.employee.some((data) => employeExits.includes(data)) &&
        item.toteam == assignInterviewerState.team &&
        item.fromcompany.some((item) => fromCompanyName.includes(item)) &&
        item.frombranch.some((item) => fromBranchName.includes(item)) &&
        item.fromunit.some((item) => fromUnitName.includes(item)) &&
        (assignInterviewerState.type !== "Interviewer" ||
          (item?.designation == assignInterviewerState?.designation &&
            item?.round.some((item) => round.includes(item)))) &&
        (assignInterviewerState.type !== "Hiring Manager" ||
          item.fromteam.some((item) => fromTeamName.includes(item)))
    );
    if (selectedOptionsCompanyAdd.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsBranchAdd.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Branch!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsUnitAdd.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Unit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerState.type === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignInterviewerState.type === "Interviewer" &&
      assignInterviewerState.designation === "Please Select Designation"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignInterviewerState.type === "Interviewer" &&
      selectedOptionsRoundAdd.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Round!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (assignInterviewerState.type === "Hiring Manager" ||
        assignInterviewerState.type === "Issuing Authority") &&
      selectedOptionsTeamAdd.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Team!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerState.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerState.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Branch!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerState.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Unit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerState.team === "Please Select Team") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Team!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empValue.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee!"}
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
            {"Data Already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setAssignInterviewerState({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      type: "Interviewer",
      employee: "Please Select Employee",
      designation: "Please Select Designation",
    });
    setEmpValue([]);
    setIsClearOpenalert(true);
    setTimeout(() => {
      setIsClearOpenalert(false);
    }, 2000);
    setSelectedEmployeeOpt([]);
    setSelectedOptionsCompanyAdd([]);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsTeamAdd([]);
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };
  //get single row to edit....
  const getCode = async (e) => {
    setEditId(e);
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      setSelectedOptionsEdit([
        ...res?.data?.sassigninterviewer?.employee.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setEmployeeEdit(res?.data?.sassigninterviewer?.employee);

      setSelectedOptionsRoundAddEdit(
        res?.data?.sassigninterviewer?.round.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsCompanyAddEdit(
        res?.data?.sassigninterviewer?.fromcompany.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsBranchAddEdit(
        res?.data?.sassigninterviewer?.frombranch.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsUnitAddEdit(
        res?.data?.sassigninterviewer?.fromunit.map((data) => {
          return { label: data, value: data };
        })
      );
      setSelectedOptionsTeamAddEdit(
        res?.data?.sassigninterviewer?.fromteam.map((data) => {
          return { label: data, value: data };
        })
      );
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // updateby edit page...
  let updateby = assignInterviewerEdit?.updatedby;

  let addedby = assignInterviewerEdit?.addedby;
  let powerstationId = assignInterviewerEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    let fromCompanyName = selectedOptionsCompanyAddEdit.map(
      (data) => data.value
    );
    let fromBranchName = selectedOptionsBranchAddEdit.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAddEdit.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAddEdit.map((data) => data.value);
    let round = selectedOptionsRoundAddEdit.map((data) => data.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${powerstationId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          fromcompany: fromCompanyName,
          frombranch: fromBranchName,
          fromunit: fromUnitName,
          fromteam: fromTeamName,
          tocompany: String(assignInterviewerEdit.tocompany),
          tobranch: String(assignInterviewerEdit.tobranch),
          tounit: String(assignInterviewerEdit.tounit),
          toteam: String(assignInterviewerEdit.toteam),
          type: String(assignInterviewerEdit.type),
          designation: String(
            assignInterviewerEdit.type === "Interviewer"
              ? assignInterviewerEdit.designation
              : ""
          ),
          round: assignInterviewerEdit.type === "Interviewer" ? round : [],
          employee: employeEdit,
          updatedby: [
            ...updateby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      setIsUpdateOpenalert(true);
      setTimeout(() => {
        setIsUpdateOpenalert(false);
      }, 1000);
      await fetchPowerstationAll();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchAssignedInterviewEditAll();
    let fromCompanyName = selectedOptionsCompanyAddEdit.map(
      (data) => data.value
    );
    let fromBranchName = selectedOptionsBranchAddEdit.map((data) => data.value);
    let fromUnitName = selectedOptionsUnitAddEdit.map((data) => data.value);
    let fromTeamName = selectedOptionsTeamAddEdit.map((data) => data.value);
    let round = selectedOptionsRoundAddEdit.map((data) => data.value);
    const employeExitsEdit = employeEdit.map((c) => c);
    const isNameMatch = resdata?.some(
      (item) =>
        item.tocompany?.toLowerCase() ==
          assignInterviewerEdit.tocompany?.toLowerCase() &&
        item.tobranch == assignInterviewerEdit.tobranch &&
        item.tounit == assignInterviewerEdit.tounit &&
        item.type == assignInterviewerEdit.type &&
        item.employee.some((data) => employeExitsEdit.includes(data)) &&
        item.toteam == assignInterviewerEdit.toteam &&
        item.fromcompany.some((item) => fromCompanyName.includes(item)) &&
        item.frombranch.some((item) => fromBranchName.includes(item)) &&
        item.fromunit.some((item) => fromUnitName.includes(item)) &&
        (assignInterviewerEdit.type !== "Interviewer" ||
          (item?.designation == assignInterviewerEdit?.designation &&
            item?.round.some((item) => round.includes(item)))) &&
        (assignInterviewerEdit.type !== "Hiring Manager" ||
          item.fromteam.some((item) => fromTeamName.includes(item)))
    );
    if (selectedOptionsCompanyAddEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsBranchAddEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Branch!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsUnitAddEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Unit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerEdit.type === "Please Select Type") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignInterviewerEdit.type === "Interviewer" &&
      (assignInterviewerEdit.designation === "Please Select Designation" ||
        assignInterviewerEdit.designation === "" ||
        assignInterviewerEdit.designation === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignInterviewerEdit.type === "Interviewer" &&
      selectedOptionsRoundAddEdit.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Round!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (assignInterviewerEdit.type === "Hiring Manager" ||
        assignInterviewerEdit.type === "Issuing Authority") &&
      selectedOptionsTeamAddEdit.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Team!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerEdit.tocompany === "Please Choose Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerEdit.tobranch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Branch!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerEdit.tounit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Unit!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignInterviewerEdit.toteam === "Please Select Team") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Team!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsEdit.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee!"}
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
            {"Data Already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  // get all data.
  const fetchPowerstationAll = async () => {
    setStatusCheck(true);
    setPageName(!pageName);
    try {
      let res_status = await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setPowerstationArray(res_status?.data?.assigninterview);
      setStatusCheck(false);
    } catch (err) {
      setStatusCheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assigninterviewer.png");
        });
      });
    }
  };

  // Excel
  const fileName = "Assigninterviewer";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Interviewer",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = powerstationArray
      ?.map((item) => ({
        ...item,
        employee: item?.employee?.filter((name) => !formerUsers.includes(name)),
      }))
      ?.filter((item) => item.employee.length > 0)
      ?.map((item, index) => ({
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
    setPage(1);
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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
      width: 75,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "fromcompany",
      headerName: "From Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fromcompany,
      headerClassName: "bold-header",
    },
    {
      field: "frombranch",
      headerName: "From Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.frombranch,
      headerClassName: "bold-header",
    },
    {
      field: "fromunit",
      headerName: "From Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromunit,
      headerClassName: "bold-header",
    },
    {
      field: "fromteam",
      headerName: "From Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromteam,
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
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 120,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "round",
      headerName: "Round",
      flex: 0,
      width: 150,
      hide: !columnVisibility.round,
      headerClassName: "bold-header",
    },

    {
      field: "tocompany",
      headerName: "To Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.tocompany,
      headerClassName: "bold-header",
    },
    {
      field: "tobranch",
      headerName: "To Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tobranch,
      headerClassName: "bold-header",
    },
    {
      field: "tounit",
      headerName: "To Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tounit,
      headerClassName: "bold-header",
    },
    {
      field: "toteam",
      headerName: "To Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.toteam,
      headerClassName: "bold-header",
    },

    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
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
          {isUserRoleCompare?.includes("eassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassigninterviewer") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassigninterviewer") && (
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

  const [formerUsers, setFormerUsers] = useState([]);

  const fetchFormerUsers = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(SERVICE.FORMERUSERS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setFormerUsers(
        response?.data?.formerusers?.map((data) => data?.companyname)
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fromcompany: item.fromcompany.join(","),
      frombranch: item.frombranch.join(","),
      fromunit: item.fromunit.join(","),
      fromteam: item.fromteam.join(","),
      tocompany: item.tocompany,
      tobranch: item.tobranch,
      tounit: item.tounit,
      toteam: item.toteam,
      type: item.type,
      designation: item?.designation,
      round: item?.round.join(","),
      employee: item.employee?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
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

  useEffect(() => {
    fetchFormerUsers();
    fetchPowerstationAll();
    fetchInterviewgrouping();
  }, []);

  useEffect(() => {
    addSerialNumber();
  }, [powerstationArray]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const delAccountcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setIsBulkDeleteOpenAl(true);
      fetchPowerstationAll();
      setTimeout(() => {
        setIsBulkDeleteOpenAl(false);
      }, 2000);
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${item}`, {
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
      await fetchPowerstationAll();
      seBulktIsDeletealert(true);
      setTimeout(() => {
        seBulktIsDeletealert(false);
      }, 2000);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  return (
    <Box>
      <Headtitle title={"Assign Interviewer"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Assign Interviewer"
        modulename="Interview"
        submodulename="Interview Setup"
        mainpagename="Assign Interviewer"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aassigninterviewer") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} variant="h6">
                    From Assign Interviewer
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsCompanyAdd}
                      onChange={handleCompanyChangeAdd}
                      valueRenderer={customValueRendererCompanyAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={isAssignBranch
                        ?.filter((comp) =>
                          selectedOptionsCompanyAdd
                            .map((data) => data.value)
                            .includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranchAdd}
                      onChange={handleBranchChangeAdd}
                      valueRenderer={customValueRendererBranchAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            selectedOptionsCompanyAdd
                              .map((data) => data.value)
                              .includes(comp.company) &&
                            selectedOptionsBranchAdd
                              .map((data) => data.value)
                              .includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnitAdd}
                      onChange={handleUnitChangeAdd}
                      valueRenderer={customValueRendererUnitAdd}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={typeOpt}
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.type,
                        value: assignInterviewerState.type,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          type: e.value,
                          designation: "Please Select Designation",
                        });
                        setSelectedOptionsRoundAdd([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                {assignInterviewerState?.type === "Interviewer" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={alldesignation
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={{
                            label: assignInterviewerState.designation,
                            value: assignInterviewerState.designation,
                          }}
                          onChange={(e) => {
                            setAssignInterviewerState({
                              ...assignInterviewerState,
                              designation: e.value,
                            });
                            setSelectedOptionsRoundAdd([]);
                            setSelectedOptionsTeamAdd([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Round<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={Array.from(
                            new Set(
                              round
                                ?.filter(
                                  (item) =>
                                    item.designation ===
                                    assignInterviewerState?.designation
                                )
                                .map((item) => item.round)
                            )
                          ).map((roundValue) => ({
                            label: roundValue,
                            value: roundValue,
                          }))}
                          value={selectedOptionsRoundAdd}
                          onChange={handleRoundChangeAdd}
                          valueRenderer={customValueRendererRoundAdd}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={allTeam
                          ?.filter(
                            (comp) =>
                              selectedOptionsCompanyAdd
                                .map((data) => data.value)
                                .includes(comp.company) &&
                              selectedOptionsBranchAdd
                                .map((data) => data.value)
                                .includes(comp.branch) &&
                              selectedOptionsUnitAdd
                                .map((data) => data.value)
                                .includes(comp.unit)
                          )
                          ?.map((data) => ({
                            label: data.teamname,
                            value: data.teamname,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsTeamAdd}
                        onChange={handleTeamChangeAdd}
                        valueRenderer={customValueRendererTeamAdd}
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <br />
              <br />

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} variant="h6">
                    To Assign Interviewer
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={{
                        label: assignInterviewerState.company,
                        value: assignInterviewerState.company,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.branch,
                        value: assignInterviewerState.branch,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company &&
                            assignInterviewerState.branch === comp.branch
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      // placeholder="New"
                      value={{
                        label: assignInterviewerState.unit,
                        value: assignInterviewerState.unit,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          unit: e.value,
                          team: "Please Select Team",
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            assignInterviewerState.company === comp.company &&
                            assignInterviewerState.branch === comp.branch &&
                            assignInterviewerState.unit === comp.unit
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={{
                        label: assignInterviewerState.team,
                        value: assignInterviewerState.team,
                      }}
                      onChange={(e) => {
                        setAssignInterviewerState({
                          ...assignInterviewerState,
                          team: e.value,
                        });
                        setSelectedEmployeeOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            assignInterviewerState.company === u.company &&
                            assignInterviewerState.branch === u.branch &&
                            assignInterviewerState.unit === u.unit &&
                            assignInterviewerState.team === u.team
                        )
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      value={selectedEmployeeOpt}
                      onChange={handleEmployeeChange}
                      valueRenderer={customValueRendererCompanyFrom}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  {isUserRoleCompare?.includes("aassigninterviewer") && (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={btnDisable}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
        <br />
      </>

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassigninterviewer") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Assign Interviewer
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
                    {/* <MenuItem value={powerstationArray?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("csvassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("printassigninterviewer") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("imageassigninterviewer") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdassigninterviewer") && (
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
            {statusCheck ? (
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
              <Box style={{ width: "100%", overflowY: "hidden" }}>
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
            )}
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                {filteredDatas?.length} entries
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
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      <br />
      <ActionEmployeeAssignInterviewer />
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
      {/*DELETE ALERT DIALOG */}
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
          <Button
            onClick={() => {
              handleCloseModcheckbox();
              handleCloseMod();
            }}
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
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => delPowerstation(powerstationid)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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
              onClick={(e) => delAccountcheckbox(e)}
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
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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

      {/* Update DIALOG */}
      <Dialog
        open={isUpdateOpenalert}
        onClose={handleCloseerr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Updated Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>
      {/* Delete DIALOG */}
      <Dialog
        open={isBulkDeleteOpenalert}
        onClose={handleCloseerr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Deleted Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Delete DIALOG */}
      <Box>
        <Dialog
          open={isDeleteOpenAl}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "37px 23px",
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <Typography variant="h6">
              <b>Deleted Successfully</b>
            </Typography>
          </DialogContent>
        </Dialog>
        {/*Bulk Delete*/}
        <Dialog
          open={isBulkDeleteOpenAl}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "37px 23px",
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <Typography variant="h6">
              <b>Deleted Successfully👍</b>
            </Typography>
          </DialogContent>
        </Dialog>

        {/* Add DIALOG */}
        <Dialog
          open={isAddOpenalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "37px 23px",
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <Typography variant="h6">
              <b>Added Successfully👍</b>
            </Typography>
          </DialogContent>
        </Dialog>
        {/* Clear DIALOG */}
        <Dialog
          open={isClearOpenalert}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "37px 23px",
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <Typography variant="h6">
              <b>Cleared Successfully👍</b>
            </Typography>
          </DialogContent>
        </Dialog>

        {/* this is info view details */}
        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <Box sx={{ padding: "30px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Assign Interviewer Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={4}>
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
                <TableCell> SI.No</TableCell>

                <TableCell>From Company</TableCell>
                <TableCell>From Branch</TableCell>
                <TableCell>From Unit</TableCell>
                <TableCell>From Team</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Round</TableCell>

                <TableCell>To Company</TableCell>
                <TableCell>To Branch</TableCell>
                <TableCell>To Unit</TableCell>
                <TableCell>To Team</TableCell>

                <TableCell>Employee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable?.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{row.fromcompany}</TableCell>
                      <TableCell>{row.frombranch}</TableCell>
                      <TableCell>{row.fromunit}</TableCell>
                      <TableCell>{row.fromteam}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row?.designation}</TableCell>
                      <TableCell>{row?.round}</TableCell>

                      <TableCell>{row.tocompany}</TableCell>
                      <TableCell>{row.tobranch}</TableCell>
                      <TableCell>{row.tounit}</TableCell>
                      <TableCell>{row.toteam}</TableCell>

                      <TableCell>{row.employee}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <Box sx={{ padding: "30px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Assign Interviewer
              </Typography>
              <br />
              <br />
              <Typography sx={userStyle.HeaderText}>
                {" "}
                From Assign Interviewer
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">From Company</Typography>
                    <Typography>
                      {assignInterviewerEdit.fromcompany
                        ? assignInterviewerEdit.fromcompany.join(",")
                        : ""}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">From Branch</Typography>
                    <Typography>
                      {assignInterviewerEdit.frombranch
                        ? assignInterviewerEdit.frombranch.join(",")
                        : ""}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">From Unit</Typography>
                    <Typography>
                      {assignInterviewerEdit.fromunit
                        ? assignInterviewerEdit.fromunit.join(",")
                        : ""}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Type</Typography>
                    <Typography>{assignInterviewerEdit.type}</Typography>
                  </FormControl>
                </Grid>
                {assignInterviewerEdit?.type === "Interviewer" ? (
                  <>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Designation</Typography>
                        <Typography>
                          {assignInterviewerEdit.designation}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Round</Typography>

                        <Typography>
                          {assignInterviewerEdit?.round
                            ? assignInterviewerEdit?.round?.join(",")
                            : ""}
                        </Typography>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">From Team</Typography>
                      <Typography>
                        {assignInterviewerEdit.fromteam
                          ? assignInterviewerEdit.fromteam.join(",")
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              <br /> <br />
              <Typography sx={userStyle.HeaderText}>
                {" "}
                To Assign Interviewer
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">To Company</Typography>
                    <Typography>{assignInterviewerEdit.tocompany}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">To Branch</Typography>
                    <Typography>{assignInterviewerEdit.tobranch}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">To Unit</Typography>
                    <Typography>{assignInterviewerEdit.tounit}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">To Team</Typography>
                    <Typography>{assignInterviewerEdit.toteam}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Employee</Typography>
                    <Typography>
                      {Array.isArray(assignInterviewerEdit?.employee)
                        ? assignInterviewerEdit.employee
                            .filter((name) => !formerUsers.includes(name))
                            .join(",")
                        : ""}
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
        {/* Bulk delete ALERT DIALOG */}
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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
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
                onClick={(e) => bulkdeletefunction(e)}
              >
                {" "}
                OK{" "}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* Edit DIALOG */}
        <Box>
          <Dialog
            sx={{
              overflow: "scroll",
              "& .MuiPaper-root": {
                overflow: "scroll",
              },
            }}
            open={isEditOpen}
            onClose={handleCloseModEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={true}
          >
            <Box sx={{ padding: "30px 50px" }}>
              <>
                <Grid container spacing={2}>
                  <Typography sx={userStyle.HeaderText}>
                    Edit Assign Interviewer
                  </Typography>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Typography sx={userStyle.HeaderText}>
                    From Assign Interviewer
                  </Typography>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={isAssignBranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsCompanyAddEdit}
                        onChange={handleCompanyChangeAddEdit}
                        valueRenderer={customValueRendererCompanyAddEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={isAssignBranch
                          ?.filter((comp) =>
                            selectedOptionsCompanyAddEdit
                              .map((data) => data.value)
                              .includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsBranchAddEdit}
                        onChange={handleBranchChangeAddEdit}
                        valueRenderer={customValueRendererBranchAddEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={isAssignBranch
                          ?.filter(
                            (comp) =>
                              selectedOptionsCompanyAddEdit
                                .map((data) => data.value)
                                .includes(comp.company) &&
                              selectedOptionsBranchAddEdit
                                .map((data) => data.value)
                                .includes(comp.branch)
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsUnitAddEdit}
                        onChange={handleUnitChangeAddEdit}
                        valueRenderer={customValueRendererUnitAddEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={typeOpt}
                        // placeholder="New"
                        value={{
                          label: assignInterviewerEdit.type,
                          value: assignInterviewerEdit.type,
                        }}
                        onChange={(e) => {
                          setAssignInterviewerEdit({
                            ...assignInterviewerEdit,
                            type: e.value,
                            designation: "Please Select Designation",
                          });
                          setSelectedOptionsRoundAddEdit([]);
                          setSelectedOptionsTeamAddEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {assignInterviewerEdit?.type === "Interviewer" ? (
                    <>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Designation<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={alldesignation
                              ?.map((data) => ({
                                label: data.name,
                                value: data.name,
                              }))
                              .filter((item, index, self) => {
                                return (
                                  self.findIndex(
                                    (i) =>
                                      i.label === item.label &&
                                      i.value === item.value
                                  ) === index
                                );
                              })}
                            value={{
                              label:
                                assignInterviewerEdit?.designation === "" ||
                                assignInterviewerEdit?.designation === undefined
                                  ? "Please Select Designation"
                                  : assignInterviewerEdit.designation,
                              value:
                                assignInterviewerEdit?.designation === "" ||
                                assignInterviewerEdit?.designation === undefined
                                  ? "Please Select Designation"
                                  : assignInterviewerEdit?.designation,
                            }}
                            onChange={(e) => {
                              setAssignInterviewerEdit({
                                ...assignInterviewerEdit,
                                designation: e.value,
                              });
                              setSelectedOptionsRoundAddEdit([]);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Round<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            size="small"
                            options={Array.from(
                              new Set(
                                round
                                  ?.filter(
                                    (item) =>
                                      item.designation ===
                                      assignInterviewerEdit?.designation
                                  )
                                  .map((item) => item.round)
                              )
                            ).map((roundValue) => ({
                              label: roundValue,
                              value: roundValue,
                            }))}
                            value={selectedOptionsRoundAddEdit}
                            onChange={handleRoundChangeAddEdit}
                            valueRenderer={customValueRendererRoundAddEdit}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={allTeam
                            ?.filter(
                              (comp) =>
                                selectedOptionsCompanyAddEdit
                                  .map((data) => data.value)
                                  .includes(comp.company) &&
                                selectedOptionsBranchAddEdit
                                  .map((data) => data.value)
                                  .includes(comp.branch) &&
                                selectedOptionsUnitAddEdit
                                  .map((data) => data.value)
                                  .includes(comp.unit)
                            )
                            ?.map((data) => ({
                              label: data.teamname,
                              value: data.teamname,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsTeamAddEdit}
                          onChange={handleTeamChangeAddEdit}
                          valueRenderer={customValueRendererTeamAddEdit}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Typography sx={userStyle.HeaderText}>
                    To Assign Interviewer
                  </Typography>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={{
                          label: assignInterviewerEdit.tocompany,
                          value: assignInterviewerEdit.tocompany,
                        }}
                        onChange={(e) => {
                          setAssignInterviewerEdit({
                            ...assignInterviewerEdit,
                            tocompany: e.value,
                            tobranch: "Please Select Branch",
                            tounit: "Please Select Unit",
                            toteam: "Please Select Team",
                          });
                          setSelectedOptionsEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter(
                            (comp) =>
                              assignInterviewerEdit.tocompany === comp.company
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        styles={colourStyles}
                        value={{
                          label: assignInterviewerEdit.tobranch,
                          value: assignInterviewerEdit.tobranch,
                        }}
                        onChange={(e) => {
                          setAssignInterviewerEdit({
                            ...assignInterviewerEdit,
                            tobranch: e.value,
                            tounit: "Please Select Unit",
                            toteam: "Please Select Team",
                          });
                          setSelectedOptionsEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter(
                            (comp) =>
                              assignInterviewerEdit.tocompany ===
                                comp.company &&
                              assignInterviewerEdit.tobranch === comp.branch
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        styles={colourStyles}
                        value={{
                          label: assignInterviewerEdit.tounit,
                          value: assignInterviewerEdit.tounit,
                        }}
                        onChange={(e) => {
                          setAssignInterviewerEdit((prev) => ({
                            ...assignInterviewerEdit,
                            tounit: e.value,
                            toteam: "Please Select Team",
                          }));
                          setSelectedOptionsEdit([]);
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
                        options={allTeam
                          ?.filter(
                            (comp) =>
                              assignInterviewerEdit.tocompany ===
                                comp.company &&
                              assignInterviewerEdit.tobranch === comp.branch &&
                              assignInterviewerEdit.tounit === comp.unit
                          )
                          ?.map((data) => ({
                            label: data.teamname,
                            value: data.teamname,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={{
                          label: assignInterviewerEdit.toteam,
                          value: assignInterviewerEdit.toteam,
                        }}
                        onChange={(e) => {
                          setAssignInterviewerEdit({
                            ...assignInterviewerEdit,
                            toteam: e.value,
                          });
                          setSelectedOptionsEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allUsersData
                          ?.filter(
                            (u) =>
                              assignInterviewerEdit.tocompany === u.company &&
                              assignInterviewerEdit.tobranch === u.branch &&
                              assignInterviewerEdit.tounit === u.unit &&
                              assignInterviewerEdit.toteam === u.team
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEdit}
                        onChange={handleCategoryEditChange}
                        valueRenderer={customValueRendererEditCompanyFrom}
                        labelledBy="Please Select Participants"
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
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
          </Dialog>
        </Box>
        {/* ALERT DIALOG */}
        <Box>
          <Dialog
            open={isErrorOpen}
            onClose={handleClickOpenerr}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                style={{
                  padding: "7px 13px",
                  color: "white",
                  background: "rgb(25, 118, 210)",
                }}
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              // fetchProductionClientRateArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Assigninterviewer;
