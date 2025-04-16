import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import MenuIcon from "@mui/icons-material/Menu";
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
import { styled } from "@mui/system";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Resizable from "react-resizable";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

function LoginAllotedList({ checkLoad }) {
  const [loginAllottedList, setLoginAllotedList] = useState([]);
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [loader, setLoader] = useState(true);

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
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          "User Id": item.userid,
          "Employee Code": item.empcode == "undefined" ? "" : item.empcode,
          "Employee Name": item.empname,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          Sno: index + 1,
          "User Id": item.userid,
          "Employee Code": item.empcode == "undefined" ? "" : item.empcode,
          "Employee Name": item.empname,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "User ID", field: "userid" },
    { title: "Employee Code", field: "empcode" },
    { title: "Employee Name", field: "empname" },
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
        ? rowDataTable?.map((item, index) => ({
            serialNumber: index + 1,
            userid: item.userid,
            empcode: item.empcode === "undefined" ? "" : item.empcode,
            empname: item.empname,
          }))
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            userid: item.userid,
            empcode: item.empcode === "undefined" ? "" : item.empcode,
            empname: item.empname,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`LoginAlloted.pdf`);
  };

  const [employeenamesSecond, setEmployeenamesSecond] = useState([]);
  const [loginAllotted, setLoginAllotted] = useState([]);

  const backLpage = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [groupData, setGroupData] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUnit,
    allTeam,
    allCompany,
    allBranch,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const [openviewalert, setOpenviewalert] = useState(false);
  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };

  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "loginallotList.png");
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

  //OVERALL EDIT FUNCTIONALITY
  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjcount, setOvProjcount] = useState();

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

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;
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
    userid: true,
    empcode: true,
    empname: true,
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

  const [filteredBranchOptions, setFilteredBranchOptions] = useState([]);
  const [filteredUnitOptions, setFilteredUnitOptions] = useState([]);
  const [filteredTeamOptions, setFilteredTeamOptions] = useState([]);

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
  const fetchLoginAllotedList = async () => {
    try {
      setLoader(true);
      let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let grpUser = await axios.get(SERVICE.USERS_LOGIN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultGroup = [];
      const answer = res?.data?.clientuserid.filter(
        (item) => item.allotted === "allotted"
      );
      let ans = answer.forEach((item1) => {
        // Find the corresponding item in the second array
        const matchingItem = grpUser.data.users.find(
          (item2) => item1.empname === item2.companyname
        );
        // If a match is found, combine the properties
        if (matchingItem) {
          resultGroup.push({
            _id: item1._id,
            projectvendor: item1.projectvendor,
            userid: item1.userid,
            password: item1.password,
            company: item1.company,
            branch: item1.branch,
            unit: item1.unit,
            empname: item1.empname,
            empcode: matchingItem.empcode,
            team: item1.team,
            updatedby: item1.updatedby,
            addedby: item1.addedby,
          });
        }
      });
      setLoginAllotedList(resultGroup);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delGroupcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_CLIENTUSERID}/${item}`, {
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

      await sendRequest();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchLoginAllotedList();
  }, [checkLoad]);

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setFilteredBranchOptions([]);
    setFilteredUnitOptions([]);
    setFilteredTeamOptions([]);
    setEmployeenamesSecond([]);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoginAllotted(res?.data?.sclientuserid);
      filterBranch(res?.data?.sclientuserid.company);
      filterUnit(
        res?.data?.sclientuserid.company,
        res?.data?.sclientuserid.branch
      );
      filterTeam(
        res?.data?.sclientuserid.company,
        res?.data?.sclientuserid.branch,
        res?.data?.sclientuserid.unit
      );
      fetchAllEmployeeSecond(
        res?.data?.sclientuserid.company,
        res?.data?.sclientuserid.branch,
        res?.data?.sclientuserid.unit,
        res?.data?.sclientuserid.date,
        res?.data?.sclientuserid.team
      );
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
  let singleData = {};
  const sendRequest = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      singleData = res?.data?.sclientuserid;
      const requestData = {};

      if (
        singleData.loginallotlog.length === 0 &&
        singleData.loginallotlog.length !== 0
      ) {
        requestData.loginallotlog = [
          ...singleData.loginallotlog,
          {
            branch: String(singleData.branch),
            company: String(singleData.company),
            unit: String(singleData.unit),
            team: String(singleData.team),
            empname: String(singleData.empname),
            empcode:String(singleData.empcode),
            date: singleData.date,
            time: singleData.time,
            userid: singleData.userid, // Fixed the field names
          },
        ];
      } else {
        window.open(`/updatepages/loginallotedlist/${singleData._id}`);

        return;
      }

      const headers = {
        Authorization: `Bearer ${auth.APIToken}`,
      };

      // Use Promise.all to make asynchronous operations concurrent
      await Promise.all([
        // Send the PUT request
        axios.put(
          `${SERVICE.SINGLE_CLIENTUSERID}/${singleData._id}`,
          requestData,
          { headers }
        ),
        // Fetch the updated designationlog data
        fetchLoginAllotedList(),
      ]);

      // Redirect after all asynchronous operations are completed
      backLpage(`/updatepages/loginnotallotlist/${singleData._id}`);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpenEdit();
      setLoginAllotted(res?.data?.sclientuserid);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let updateby = loginAllotted.updatedby;
  let addedby = loginAllotted.addedby;

  let projectsid = loginAllotted._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_CLIENTUSERID}/${projectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          branch: String(loginAllotted.branch),
          company: String(loginAllotted.company),
          unit: String(loginAllotted.unit),
          team: String(loginAllotted.team),
          empname: String(loginAllotted.empname),
          empcode: String(loginAllotted.empcode),
          date: String(loginAllotted.date),
          time: String(moment().format("HH:mm")),
          userid: loginAllotted.userid,
          allotted: "allotted",
          loginallotlog: [
            ...loginAllotted.loginallotlog,
            {
              company: String(loginAllotted.company),
              branch: String(loginAllotted.branch),
              unit: String(loginAllotted.unit),
              team: String(loginAllotted.team),
              empname: String(loginAllotted.empname),
              empcode: String(loginAllotted.empcode),
              date: loginAllotted.date,
              time: String(moment().format("HH:mm")),
              userid: loginAllotted.userid, // Fixed the field names
            },
          ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setFilteredBranchOptions([]);
      setFilteredUnitOptions([]);
      setFilteredTeamOptions([]);
      setEmployeenamesSecond([]);
      // setLoginNotAllotEdit(res.data);
      await fetchLoginAllotedList();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = allGroupEdit.some(item => item.name.toLowerCase() === (loginNotAllotEdit.name).toLowerCase());
    if (loginAllotted.branch === "Please Select Branch") {
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
      loginAllotted.unit === "Please Select Unit" ||
      loginAllotted.unit === ""
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
      loginAllotted.team === "Please Select Team" ||
      loginAllotted.team === ""
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
      loginAllotted.empname === "Please Select Person" ||
      loginAllotted.empname === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Person"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (loginAllotted.date === "") {
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
    }
    // else if (isNameMatch) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      sendEditRequest();
    }
  };

  // Excel
  const fileName = "LoginAlloted";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Login_Allot_List",
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
    const itemsWithSerialNumber = loginAllottedList?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [loginAllottedList]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
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
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
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
      field: "userid",
      headerName: "User Id",
      flex: 0,
      width: 250,
      hide: !columnVisibility.userid,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 250,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "empname",
      headerName: "Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.empname,
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
          {isUserRoleCompare?.includes("vloginallot") && (
            <Button
              variant="contained"
              sx={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                sendRequest(params.row.id);
                getviewCode(params.row.id);
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes("eloginallot") && (
            <Button
              style={{
                backgroundColor: "red",
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={(e) => {
                handleClickOpenEdit();
                getCode(params.row.id, params.row.name);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
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
      userid: item.userid,
      empcode: item.empcode === "undefined" ? "" : item.empcode,
      empname: item.empname,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
      <Headtitle title={"Login Allot"} />
      {/* ****** Header Content ****** */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
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
                Login Allot Entry
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>User Id</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="User Id"
                      value={loginAllotted.userid}
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
                      value={loginAllotted.date}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
                          date: e.target.value,
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
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }),
                      ]}
                      value={{
                        label: loginAllotted.company,
                        value: loginAllotted.company,
                      }}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
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
                        label: loginAllotted.branch,
                        value: loginAllotted.branch,
                      }}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          empname: "Please Select Person",
                        });
                        setEmployeenamesSecond([]);
                        filterUnit(loginAllotted.company, e.value);
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
                        label: loginAllotted.unit,
                        value: loginAllotted.unit,
                      }}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
                          unit: e.value,
                          team: "Please Select Team",
                          empname: "Please Select Person",
                        });
                        filterTeam(
                          loginAllotted.company,
                          loginAllotted.branch,
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
                        label: loginAllotted.team,
                        value: loginAllotted.team,
                      }}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
                          team: e.value,
                          empname: "Please Select Person",
                        });
                        fetchAllEmployeeSecond(
                          loginAllotted.company,
                          loginAllotted.branch,
                          loginAllotted.unit,
                          loginAllotted.date,
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
                        label: loginAllotted.empname,
                        value: loginAllotted.empname,
                      }}
                      onChange={(e) => {
                        setLoginAllotted({
                          ...loginAllotted,
                          empname: e.value,
                          empcode: e.empcode,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />

              {/* <Typography sx={{ color: "red" }}> {editCalOverall}</Typography> */}
              <br />

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
                    Change
                  </Button>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lloginallot") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Login Allot List
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
                    <MenuItem value={loginAllottedList?.length}>All</MenuItem>
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
                sendEditRequest();
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
              <TableCell>User ID</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell> Employee Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.userid}</TableCell>
                  <TableCell>
                    {row.empcode === undefined ? "" : row.empcode}
                  </TableCell>
                  <TableCell>{row.empname}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
            onClick={(e) => delGroupcheckbox(e)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

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

export default LoginAllotedList;
