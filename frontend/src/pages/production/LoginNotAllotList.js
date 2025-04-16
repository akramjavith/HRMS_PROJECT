import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

function LoginNotAllotList() {
  const [designationlogEdit, setDesignationlogEdit] = useState({});
  const [loader, setLoader] = useState(true);

  const [designationlogs, setDesignationlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Empname: t.empname,
          Empcode: t.empcode,
          Date: t.date,
          Time: t.time,
          Userid: t.userid,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Empname: t.empname,
          Empcode: t.empcode,
          Date: moment(t.date).format("DD-MM-YYYY"),
          Time: t.time,
          Userid: t.userid,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Employee Name", field: "empname" },
    { title: "Employee Code", field: "empcode" },
    { title: "Date", field: "date" },
    { title: "Time", field: "time" },
    { title: "User Id", field: "userid" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            unit: t.unit,
            team: t.team,
            empname: t.empname,
            empcode: t.empcode,
            date: t.date,
            time: t.time,
            userid: t.userid,
          }))
        : items?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            unit: t.unit,
            team: t.team,
            empname: t.empname,
            empcode: t.empcode,
            date: moment(t.date).format("DD-MM-YYYY"),
            time: t.time,
            userid: t.userid,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`Login Log List.pdf`);
  };

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  const handleCloseinfo = () => {
    setOpenInfo(false);
  };
  const handleOpeninfo = () => {
    setOpenInfo(true);
  };

  //view
  const [openView, setOpenView] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };

  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);

  //get single row to edit....
  const getCode = async (params) => {
    try {
      await filterBranch(params.company);
      filterUnit(params.company, params.branch);
      await filterTeam(params.company, params.branch, params.unit);
      await fetchAllEmployeeSecond(
        params.company,
        params.branch,
        params.unit,
        params.originaldate,
        params.team
      );
      handleOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [filteredBranchOptions, setFilteredBranchOptions] = useState([]);
  const [filteredUnitOptions, setFilteredUnitOptions] = useState([]);
  const [filteredTeamOptions, setFilteredTeamOptions] = useState([]);
  const [employeenamesSecond, setEmployeenamesSecond] = useState([]);

  const filterBranch = async (e) => {
    try {
      let branchall;
      if (e === "ALL") {
        branchall = isAssignBranch
          .map((u, index) => ({
            ...u,
            label: u.branch,
            value: u.branch,
            index: index,
          }))
          .filter(
            (item, index, arr) =>
              index === arr.findIndex((el) => el.branch === item.branch)
          );
        setFilteredBranchOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...branchall,
        ]);
      } else {
        branchall = isAssignBranch
          ?.filter((u) => u.company === e)
          .map((u, index) => ({
            ...u,
            label: u.branch,
            value: u.branch,
            index: index,
          }))
          .filter(
            (item, index, arr) =>
              index === arr.findIndex((el) => el.branch === item.branch)
          );
        setFilteredBranchOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...branchall,
        ]);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const filterUnit = async (company, e) => {
    try {
      let unitall;
      if (company === "ALL" && e === "ALL") {
        unitall = isAssignBranch.map((u) => ({
          ...u,
          label: u.unit,
          value: u.unit,
        }));
        setFilteredUnitOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...unitall,
        ]);
      } else if (company !== "ALL" && e === "ALL") {
        unitall = isAssignBranch?.map((u) => ({
          ...u,
          label: u.unit,
          value: u.unit,
        }));
        setFilteredUnitOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...unitall,
        ]);
      } else if (company === "ALL" && e !== "ALL") {
        unitall = isAssignBranch
          ?.filter((u) => u.branch === e)
          .map((u) => ({
            ...u,
            label: u.unit,
            value: u.unit,
          }));
        setFilteredUnitOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...unitall,
        ]);
      } else if (company !== "ALL" && e !== "ALL") {
        unitall = isAssignBranch
          ?.filter((u) => u.branch === e)
          .map((u) => ({
            ...u,
            label: u.unit,
            value: u.unit,
          }));
        setFilteredUnitOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...unitall,
        ]);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const filterTeam = async (company, branch, e) => {
    try {
      let teamall;
      if (company === "ALL" && branch === "ALL" && e === "ALL") {
        teamall = allTeam.map((u) => ({
          ...u,
          label: u.teamname,
          value: u.teamname,
        }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company !== "ALL" && branch === "ALL" && e === "ALL") {
        teamall = allTeam
          ?.filter((u) => u.company === company)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company !== "ALL" && branch === "ALL" && e !== "ALL") {
        teamall = allTeam
          ?.filter((u) => u.company === company && u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company !== "ALL" && branch !== "ALL" && e === "ALL") {
        teamall = allTeam
          ?.filter((u) => u.company === company && u.branch === branch)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company === "ALL" && branch !== "ALL" && e !== "ALL") {
        teamall = allTeam
          ?.filter((u) => u.branch === branch && u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company === "ALL" && branch !== "ALL" && e === "ALL") {
        teamall = allTeam
          ?.filter((u) => u.branch === branch)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else if (company === "ALL" && branch === "ALL" && e !== "ALL") {
        teamall = allTeam
          ?.filter((u) => u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      } else {
        teamall = allTeam
          ?.filter(
            (u) => u.company === company && u.branch === branch && u.unit === e
          )
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([
          ...(isUserRoleAccess?.role?.includes("Manager")
            ? [{ label: "ALL", value: "ALL" }]
            : []),
          ...teamall,
        ]);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all Employeename.
  const fetchAllEmployeeSecond = async (company, branch, unit, date, e) => {
    try {
      let res_module = await axios.post(SERVICE.USEREMP_TEAMGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
        unit: unit,
        date: date,
        team: e,
      });

      setEmployeenamesSecond(
        res_module.data.userteamgroup
          .filter((item) => item.reasonablestatus === undefined)
          .map((data) => ({
            // ...data,
            label: data.companyname,
            value: data.companyname,
            empcode: data.empcode,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      editDetails.originaldate === "" ||
      editDetails.originaldate === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.company === "" ||
      editDetails.company === undefined ||
      editDetails.company === "Please Select Company"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.branch === "" ||
      editDetails.branch === undefined ||
      editDetails.branch === "Please Select Branch"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.unit === "" ||
      editDetails.unit === undefined ||
      editDetails.unit === "Please Select Unit"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.team === "" ||
      editDetails.team === undefined ||
      editDetails.team === "Please Select Team"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.empname === "" ||
      editDetails.empname === undefined ||
      editDetails.empname === "Please Select Person"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  const sendEditRequest = async () => {
    try {
      await axios.put(
        `${SERVICE.LOGINALLOTLOG}/?logid=${editDetails?.id}&logname=loginallotlog`,
        {
          company: String(editDetails.company),
          branch: String(editDetails.branch),
          unit: String(editDetails.unit),
          team: String(editDetails.team),
          empname: String(editDetails.empname),
          empcode: String(editDetails.empcode),
          date: editDetails.originaldate,
          time: String(moment().format("HH:mm")),

          logeditedby: [
            ...editDetails?.logeditedby,
            {
              username: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      if (isLastLog) {
        let res = await axios.put(
          `${SERVICE.SINGLE_CLIENTUSERID}/${designationlogEdit?._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(editDetails.company),
            branch: String(editDetails.branch),
            unit: String(editDetails.unit),
            team: String(editDetails.team),
            empname: String(editDetails.empname),
            empcode: String(editDetails.empcode),
            date: editDetails.originaldate,
            time: String(moment().format("HH:mm")),
            allotted: "allotted",
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
      }

      await rowData();

      handleCloseEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const [deleteionId, setDeletionId] = useState({});

  const handleDeleteLog = async () => {
    await axios.delete(
      `${SERVICE.LOGINALLOTLOG}/?logid=${deleteionId?.id}&logname=loginallotlog&mainid=${logid}&lastlog=${isLastLog}`,
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );

    await rowData();
    setPage(1);
    handleCloseDelete();
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Deleted Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
  };

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Login Log List.png");
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
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    date: true,
    time: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    empname: true,
    userid: true,
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

  const rowData = async () => {
    try {
      setLoader(true);
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogs(res?.data?.sclientuserid?.loginallotlog);
      setDesignationlogEdit(res?.data?.sclientuserid);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    rowData();
  }, []);
  const logid = useParams().id;
  const from = useParams().from;

  //Project updateby edit page...
  let updateby = designationlogEdit?.updatedby;
  let addedby = designationlogEdit?.addedby;

  let subprojectsid = designationlogEdit?._id;

  // Excel
  const fileName = "Login Log List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Login Log List",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = designationlogs?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      index: index,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [designationlogs]);

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
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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
    // {
    //     field: "checkbox",
    //     headerName: "Checkbox", // Default header name
    //     headerStyle: {
    //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //         // Add any other CSS styles as needed
    //     },
    //     renderHeader: (params) => (
    //         <CheckboxHeader
    //             selectAllChecked={selectAllChecked}
    //             onSelectAll={() => {
    //                 if (rowDataTable.length === 0) {
    //                     // Do not allow checking when there are no rows
    //                     return;
    //                 }
    //                 if (selectAllChecked) {
    //                     setSelectedRows([]);
    //                 } else {
    //                     const allRowIds = rowDataTable.map((row) => row.id);
    //                     setSelectedRows(allRowIds);
    //                 }
    //                 setSelectAllChecked(!selectAllChecked);

    //             }}
    //         />
    //     ),

    //     renderCell: (params) => (
    //         <Checkbox
    //             checked={selectedRows.includes(params.row.id)}
    //             onChange={() => {
    //                 let updatedSelectedRows;
    //                 if (selectedRows.includes(params.row.id)) {
    //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
    //                 } else {
    //                     updatedSelectedRows = [...selectedRows, params.row.id];
    //                 }

    //                 setSelectedRows(updatedSelectedRows);

    //                 // Update the "Select All" checkbox based on whether all rows are selected
    //                 setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

    //             }}
    //         />
    //     ),
    //     sortable: false, // Optionally, you can make this column not sortable
    //     width: 90,

    //     hide: !columnVisibility.checkbox,
    //     headerClassName: "bold-header"
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 180,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 180,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 180,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 180,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 180,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "empname",
      headerName: "Employee Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
    },
    {
      field: "userid",
      headerName: "User Id",
      flex: 0,
      width: 180,
      hide: !columnVisibility.userid,
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
      renderCell: (params) => {
        return (
          <>
            {from === "loginnotallotedlist" ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eloginallot") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        setEditDetails(params.row);
                        setEditDetailsOld(params.row);
                        getCode(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                      }}
                    >
                      <EditOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dloginallot") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setIsLastLog(params?.row?.index === items?.length - 1);
                        setDeletionId(params.row);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon
                        style={{ fontsize: "large" }}
                      />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vloginallot") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.row);
                    }}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("iloginallot") &&
                params?.row?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.row);
                      }}
                    >
                      <InfoOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
            </Grid>
          </>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      originaldate: item.date,
      date: moment(item.date).format("DD-MM-YYYY"),
      time: item.time,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empname: item.empname,
      empcode: item.empcode === "undefined" ? "" : item.empcode,
      userid: item.userid,
      logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
      index: item?.index,
    };
  });

  const [deleteLogData, setDeleteLogData] = useState([]);

  const delAddemployee = async (userid) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res.data.sclientuserid.loginallotlog.filter(
        (data) => data._id !== userid.id
      );
      setDeleteLogData(ans);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
  return (
    <Box>
      <Headtitle title={"Login Log List"} />
      {/* ****** Header Content ****** */}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lloginallot") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item md={8} xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Login Log List
                </Typography>
              </Grid>
              <Grid item md={3} xs={3}></Grid>
              <Grid item md={1} xs={1}>
                <Link to={"/updatepages/loginallot"}>
                  <Button variant="contained">Back</Button>
                </Link>
              </Grid>
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
                    <MenuItem value={designationlogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelloginallot") && (
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
                  {isUserRoleCompare?.includes("csvloginallot") && (
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
                  {isUserRoleCompare?.includes("printloginallot") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfloginallot") && (
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
                  {isUserRoleCompare?.includes("imageloginallot") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;
                      </Button>
                    </>
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
            {/* <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button> */}
            <br />
            <br />
            {loader ? (
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
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>User Id</TableCell>
              </TableRow>
            </TableHead>

            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.empname}</TableCell>
                    <TableCell>
                      {row.empcode === "undefined" ? "" : row.empcode}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.userid}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "1150px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Designation Log</Typography>
            <br /> <br />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell> SI.No</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>From Date</TableCell>
                    <TableCell>Designation </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody align="left">
                  {designationlogs &&
                    designationlogs.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.team}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.startdate}</TableCell>
                        <TableCell>{row.designation}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
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

      {/* VIEW */}
      <Dialog
        maxWidth="lg"
        open={openView}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                View Login Allot Log
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">User Id</Typography>
                <Typography>{viewDetails?.userid}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Company</Typography>
                <Typography>{viewDetails?.company}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Branch</Typography>
                <Typography>{viewDetails?.branch}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Unit</Typography>
                <Typography>{viewDetails?.unit}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Team</Typography>
                <Typography>{viewDetails?.team}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Employee Name</Typography>
                <Typography>{viewDetails?.empname}</Typography>
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6"> Date</Typography>
                <Typography>{viewDetails?.date}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Time</Typography>
                <Typography>{viewDetails?.time}</Typography>
              </FormControl>
            </Grid>
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
                <Button
                  variant="contained"
                  onClick={() => {
                    handleCloseView();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
            <Typography sx={userStyle.HeaderText}>
              Edit Login Allot Log
            </Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>User Id</Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="User Id"
                    value={editDetails.userid}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    placeholder="Date"
                    value={editDetails.originaldate}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        originaldate: e.target.value,
                        company: "Please Select Company",
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        empname: "Please Select Person",
                      });
                      setEmployeenamesSecond([]);
                      setFilteredUnitOptions([]);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={[
                      ...(isUserRoleAccess?.role?.includes("Manager")
                        ? [{ label: "ALL", value: "ALL" }]
                        : []),
                      ...isAssignBranch
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
                        }),
                    ]}
                    value={{
                      label: editDetails.company,
                      value: editDetails.company,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        company: e.value,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        empname: "Please Select Person",
                      });
                      filterBranch(e.value);
                      setEmployeenamesSecond([]);
                      setFilteredUnitOptions([]);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredBranchOptions}
                    value={{
                      label: editDetails.branch,
                      value: editDetails.branch,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        branch: e.value,
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        empname: "Please Select Person",
                      });
                      setEmployeenamesSecond([]);
                      filterUnit(editDetails.company, e.value);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Unit<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredUnitOptions}
                    value={{
                      label: editDetails.unit,
                      value: editDetails.unit,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        unit: e.value,
                        team: "Please Select Team",
                        empname: "Please Select Person",
                      });
                      filterTeam(
                        editDetails.company,
                        editDetails.branch,
                        e.value
                      );
                      setEmployeenamesSecond([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Team<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredTeamOptions}
                    value={{
                      label: editDetails.team,
                      value: editDetails.team,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        team: e.value,
                        empname: "Please Select Person",
                      });
                      fetchAllEmployeeSecond(
                        editDetails.company,
                        editDetails.branch,
                        editDetails.unit,
                        editDetails.originaldate,
                        e.value
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Employee Name<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={employeenamesSecond}
                    value={{
                      label: editDetails.empname,
                      value: editDetails.empname,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        empname: e.value,
                        empcode: e.empcode,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* INFO */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Login Allot Log Edited By
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {infoDetails?.logeditedby?.map((item, i) => (
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
                            {item.username}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button
                variant="contained"
                onClick={handleCloseinfo}
                sx={{ marginLeft: "15px" }}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Delete  DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseDelete}
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
          <Button onClick={handleCloseDelete} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => handleDeleteLog(deleteionId)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

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

export default LoginNotAllotList;
