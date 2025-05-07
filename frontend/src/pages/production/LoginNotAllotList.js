import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
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
  Typography
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
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';

import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import domtoimage from 'dom-to-image';


function LoginNotAllotList() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);


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


  const [searchedString, setSearchedString] = useState("")
  const gridRefTable = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);

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

  let exportColumnNames =
    [
      'Date',
      'Time',
      'Company',
      'Branch',
      'Unit',
      'Team',
      'Employee Name',
      'Employee Code',
      'User Id'
    ]
  let exportRowValues =
    [
      'date', 'time',
      'company', 'branch',
      'unit', 'team',
      'empname', 'empcode',
      'userid'
    ]

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    buttonStyles,
    pageName, setPageName,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      company: data.company,
      branch: data.branch,
      unit: data.unit
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
          "/updatepages/loginallot",
          "updatepages/loginallot",
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        company: data.company,
        branch: data.branch,
        unit: data.unit
      }));

  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState([]);
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


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [dupDataLog, setDupDataLog] = useState([])

  //get single row to edit....
  const getCode = async (params) => {
    setPageName(!pageName)
    try {

      await filterBranch(params.company);
      filterUnit(params.company, params.branch);
      await filterTeam(params.company, params.branch, params.unit);
      await fetchAllEmployeeSecond(
        params?.data?.company,
        params?.data?.branch,
        params?.data?.unit,
        params?.data?.ogdate,
        params?.data?.team
      );
      setDupDataLog(designationlogs?.filter((item) => item?._id !== params?.id))
      handleOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [filteredBranchOptions, setFilteredBranchOptions] = useState([]);
  const [filteredUnitOptions, setFilteredUnitOptions] = useState([]);
  const [filteredTeamOptions, setFilteredTeamOptions] = useState([]);
  const [employeenamesSecond, setEmployeenamesSecond] = useState([]);

  const filterBranch = async (e) => {
    setPageName(!pageName)
    try {

      let branchall;
      if (e === "ALL") {
        branchall = accessbranch
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
        branchall = accessbranch
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const filterUnit = async (company, e) => {
    setPageName(!pageName)
    try {

      let unitall;
      if (company === "ALL" && e === "ALL") {
        unitall = accessbranch.map((u) => ({
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
        unitall = accessbranch?.map((u) => ({
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
        unitall = accessbranch
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
        unitall = accessbranch
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const filterTeam = async (company, branch, e) => {
    setPageName(!pageName)
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all Employeename.
  const fetchAllEmployeeSecond = async (company, branch, unit, date, e) => {
    setPageName(!pageName)
    try {

      let res_module = await axios.post(SERVICE.USEREMP_TEAMGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
        unit: unit,
        date: moment(date)?.format("YYYY-MM-DD"),
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
            company: data.company,
            branch: data.branch,
            unit: data.unit,
            team: data.team,
          }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const editSubmit = (e) => {
    e.preventDefault();
    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );


    const IsDataMatch = dupDataLog?.some((item) =>
      item?.userid === editDetails.userid &&
      item?.date === moment(editDetails.ogdate)?.format("DD-MM-YYYY"))

    if (
      editDetails.ogdate === "" ||
      editDetails.ogdate === undefined ||
      !editDetails.ogdate
    ) {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.company === "" ||
      editDetails.company === undefined ||
      editDetails.company === "Please Select Company"
    ) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.branch === "" ||
      editDetails.branch === undefined ||
      editDetails.branch === "Please Select Branch"
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.unit === "" ||
      editDetails.unit === undefined ||
      editDetails.unit === "Please Select Unit"
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.team === "" ||
      editDetails.team === undefined ||
      editDetails.team === "Please Select Team"
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.empname === "" ||
      editDetails.empname === undefined ||
      editDetails.empname === "Please Select Person"
    ) {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!isChanged) {
      setPopupContentMalert("No Changes to Update");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (IsDataMatch) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };



  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {

      await axios.put(
        `${SERVICE.LOGINALLOTLOG}/?logid=${editDetails?.id}&logname=loginallotlog`,
        {
          company: String(editDetails?.employeecompany),
          branch: String(editDetails?.employeebranch),
          unit: String(editDetails?.employeeunit),
          team: String(editDetails?.employeeteam),
          empname: String(editDetails.empname),
          empcode: String(editDetails.empcode),
          date: editDetails.ogdate,
          time: String(moment().format("HH:mm")),

          logeditedby: [
            ...editDetails?.logeditedby,
            {
              username: String(isUserRoleAccess?.companyname),
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
            date: editDetails.ogdate,
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
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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

    setPopupContent("Deleted Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Login Log List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    setPageName(!pageName)
    try {

      setLoader(true);
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID_FORACCESSFORLOG}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const table = res?.data?.sclientuserid?.loginallotlog?.filter((item) => {
        return accessbranch?.some((access) =>
          access?.company === item?.company &&
          access?.branch === item?.branch &&
          access?.unit === item?.unit
        );
      });

      setDesignationlogs(table?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        index: index,
        ogdate: item.date,
        date: moment(item.date).format("DD-MM-YYYY"),
      })));
      setDesignationlogEdit(res?.data?.sclientuserid);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Login Log List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    rowData();
    getapi();
  }, []);
  const logid = useParams().id;
  const from = useParams().from;

  //Project updateby edit page...

  let updateby = infoDetails;
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



  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(designationlogs);
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



  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,

    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 180,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 180,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: 'left',
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
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
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
                      onClick={(e) => {
                        setEditDetails({ ...params.data });
                        setEditDetailsOld(params.data);
                        getCode(params.data);
                        setIsLastLog(params?.data?.index === items?.length - 1);
                      }}
                    >
                      <EditOutlinedIcon sx={buttonStyles.buttonedit} />                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dloginallot") && (
                  <>
                    <Button
                      size="small"
                      onClick={(e) => {
                        handleOpenDelete();
                        setIsLastLog(params?.data?.index === items?.length - 1);
                        setDeletionId(params.data);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />                    </Button>
                  </>
                )}
                <Grid sx={{ display: "flex" }}>
                  {isUserRoleCompare?.includes("vloginallot") && (
                    <>
                      <Button
                        size="small"
                        onClick={(e) => {
                          handleOpenView();
                          setViewDetails(params.data);
                        }}
                      >
                        <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                  </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("iloginallot") &&
                    params?.data?.logeditedby?.length > 0 && (
                      <>
                        <Button
                          size="small"
                          onClick={(e) => {
                            handleOpeninfo();
                            // setInfoDetails(params.data?.data);
                            setInfoDetails(params.data?.data?.logeditedby?.map((item) => ({
                              name: item?.username,
                              date: item?.date
                            })));
                          }}
                        >
                          <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                    </Button>
                      </>
                    )}
                </Grid>
              </Grid>
            )}

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
      ogdate: item.ogdate,
      date: item.date,
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
      data: item
    };
  });

  const [deleteLogData, setDeleteLogData] = useState([]);

  const delAddemployee = async (userid) => {
    setPageName(!pageName)
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
                  <Button sx={buttonStyles.btncancel}>Back</Button>
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

                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={designationlogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={designationlogs}
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
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={designationlogs}
                />
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
                  sx={buttonStyles.buttonsubmit}
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
                    value={editDetails.ogdate}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        ogdate: e.target.value,
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
                      ...accessbranch
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
                        editDetails.ogdate,
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
                        employeecompany: e.company,
                        employeebranch: e.branch,
                        employeeunit: e.unit,
                        employeeteam: e.team,
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
                  sx={buttonStyles.buttonsubmit}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
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
        // itemsTwo={processQueueArray ?? []}
        itemsTwo={designationlogs ?? []}
        filename={"Login Log List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Login Log List"
        addedby={addedby}
        updateby={updateby}
      />
    </Box>
  );
}

export default LoginNotAllotList;