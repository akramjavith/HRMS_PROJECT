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
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";

function FileShare() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [fileShare, setFileShare] = useState({ company: "Please Select Company", foldername: "Please Select Folder Name", url: "" });
  const [fileShareEdit, setFileShareEdit] = useState({ company: "Please Select Company", foldername: "Please Select Folder Name", url: "" });
  const [fileShareArray, setFileShareArray] = useState([]);
  const [fileShareArrayEdit, setFileShareArrayEdit] = useState([]);

  const [departmentOption, setDepartmentOption] = useState([]);

 const [isBtn, setIsBtn] = useState(false);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData } = useContext(
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
  const [fileShareQueue, setFileShareQueue] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [fileShareData, setFileShareData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    employeename: true,
    foldername: true,
    actions: true,
  };

  //branch option
  const [selectedBranchOptionsCate, setSelectedBranchOptionsCate] = useState([]);
  const [branchValueCate, setBranchValueCate] = useState("");
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] = useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");
  const handleBranchChange = (options) => {
    setBranchValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCate(options);
    setUnitValueCate("");
    setSelectedUnitOptionsCate([]);
    setTeamValueCate("");
    setSelectedTeamOptionsCate([]);
    setDepartmentValueCate("");
    setSelectedDepartmentOptionsCate([]);
    setEmployeeNameValueCate("");
    setSelectedEmployeeNameOptionsCate([]);

  };
  const customValueRendererBranch = (branchValueCate, _employeename) => {
    return branchValueCate.length ? branchValueCate.map(({ label }) => label).join(", ") : "Please Select Branch";
  };
  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);
    setEmployeeNameValueCateEdit([]);
    setSelectedEmployeeNameOptionsCateEdit([]);
  };
  const customValueRendererBranchEdit = (branchValueCateEdit, _employeename) => {
    return branchValueCateEdit.length ? branchValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Branch";
  };

  //unit options
  const [selectedUnitOptionsCate, setSelectedUnitOptionsCate] = useState([]);
  const [unitValueCate, setUnitValueCate] = useState("");
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] = useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState("");
  const handleUnitChange = (options) => {
    setUnitValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCate(options);
    setTeamValueCate([]);
    setSelectedTeamOptionsCate([]);
    setDepartmentValueCate([]);
    setSelectedDepartmentOptionsCate([]);
    setEmployeeNameValueCate([]);
    setSelectedEmployeeNameOptionsCate([]);
  };
  const customValueRendererUnit = (unitValueCate, _employeename) => {
    return unitValueCate.length ? unitValueCate.map(({ label }) => label).join(", ") : "Please Select Unit";
  };
  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);
    setEmployeeNameValueCateEdit([]);
    setSelectedEmployeeNameOptionsCateEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit.length ? unitValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Unit";
  };

  //team options
  const [selectedTeamOptionsCate, setSelectedTeamOptionsCate] = useState([]);
  const [teamValueCate, setTeamValueCate] = useState("");
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] = useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");
  const handleTeamChange = (options) => {
    setTeamValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCate(options);
    setDepartmentValueCate([]);
    setSelectedDepartmentOptionsCate([]);
    setEmployeeNameValueCate([]);
    setSelectedEmployeeNameOptionsCate([]);
  };
  const customValueRendererTeam = (teamValueCate, _employeename) => {
    return teamValueCate.length ? teamValueCate.map(({ label }) => label).join(", ") : "Please Select Team";
  };
  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);

  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit.length ? teamValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Team";
  };

  //department options
  const [selectedDepartmentOptionsCate, setSelectedDepartmentOptionsCate] = useState([]);
  const [departmentValueCate, setDepartmentValueCate] = useState("");
  const [selectedDepartmentOptionsCateEdit, setSelectedDepartmentOptionsCateEdit] = useState([]);
  const [departmentValueCateEdit, setDepartmentValueCateEdit] = useState("");
  const handleDepartmentChange = (options) => {
    setDepartmentValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDepartmentOptionsCate(options);
    setEmployeeNameValueCate("");
    setSelectedEmployeeNameOptionsCate([]);
  };
  const customValueRendererDepartment = (departmentValueCate, _employeename) => {
    return departmentValueCate.length ? departmentValueCate.map(({ label }) => label).join(", ") : "Please Select Department";
  };
  const handleDepartmentChangeEdit = (options) => {
    setDepartmentValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDepartmentOptionsCateEdit(options);

    setEmployeeNameValueCateEdit([]);
    setSelectedEmployeeNameOptionsCateEdit([]);
  };
  const customValueRendererDepartmentEdit = (departmentValueCateEdit, _employeename) => {
    return departmentValueCateEdit.length ? departmentValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Department";
  };
  //Employee options
  const [selectedEmployeeNameOptionsCate, setSelectedEmployeeNameOptionsCate] = useState([]);
  const [employeeNameValueCate, setEmployeeNameValueCate] = useState("");
  const [selectedEmployeeNameOptionsCateEdit, setSelectedEmployeeNameOptionsCateEdit] = useState([]);
  const [employeeNameValueCateEdit, setEmployeeNameValueCateEdit] = useState("");
  const handleEmployeeNameChange = (options) => {
    setEmployeeNameValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeNameOptionsCate(options);
  };
  const customValueRendererEmployeeName = (employeeNameValueCate, _employeename) => {
    return employeeNameValueCate.length ? employeeNameValueCate.map(({ label }) => label).join(", ") : "Please Select Employee Name";
  };
  const handleEmployeeNameChangeEdit = (options) => {
    setEmployeeNameValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeNameOptionsCateEdit(options);
  };
  const customValueRendererEmployeeNameEdit = (employeeNameValueCateEdit, _employeename) => {
    return employeeNameValueCateEdit.length ? employeeNameValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Employee Name";
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  useEffect(() => {
    addSerialNumber();
  }, [fileShareArray]);



  useEffect(() => {
    fetchFileShareAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchFileShare();
  }, []);

  useEffect(() => {
    fetchDepartment();
    fetchFolderName();
  }, []);

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


  const [folderOpt, setFolderOpt] = useState([]);
  const fetchFolderName = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_FILEACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFolderOpt([
        ...res?.data?.fileaccess?.map((t) => ({
          ...t,
          label: t.foldername,
          value: t.foldername,
          url: t.url
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchDepartment = async () => {
    try {
      let res = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const deptall = [...res?.data?.departmentdetails.map((d) => (
        {
          ...d,
          label: d.deptname,
          value: d.deptname
        }
      ))];
      setDepartmentOption(deptall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_FILESHARE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileShareQueue(res?.data?.sfileshare);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Alert delete popup
  let proid = fileShareQueue._id;
  const delProcess = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_FILESHARE}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchFileShare();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_FILESHARE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(fileShare.company),
        branch: [...branchValueCate],
        unit: [...unitValueCate],
        team: [...teamValueCate],
        department: [...departmentValueCate],
        employeename: [...employeeNameValueCate],
        foldername: String(fileShare.foldername),
        url: String(fileShare.url),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setFileShare(brandCreate.data);
      await fetchFileShare();
      setFileShare({ ...fileShare })
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let branchopt = selectedBranchOptionsCate.map((item) => item.value);
    let unitopt = selectedUnitOptionsCate.map((item) => item.value);
    let teamopt = selectedTeamOptionsCate.map((item) => item.value);
    let deptopt = selectedDepartmentOptionsCate.map((item) => item.value);
    let empopt = selectedEmployeeNameOptionsCate.map((item) => item.value);
    const isNameMatch = fileShareArray?.some(
      (item) =>
        item.company === fileShare.company &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.department.some((data) => deptopt.includes(data)) &&
        item.employeename.some((data) => empopt.includes(data)) &&
        item.foldername === fileShare.foldername
    );
    if (fileShare.company === "Please Select Company") {
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
    }
    else if (branchValueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Branch"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (unitValueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Unit"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (teamValueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Team"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentValueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Department"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeNameValueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Employee"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (fileShare.foldername === "Please Select Folder Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Folder Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setFileShare({ company: "Please Select Company", foldername: "Please Select Folder Name" });
    
    setSelectedBranchOptionsCate([]);
    setBranchValueCate("");
    setSelectedUnitOptionsCate([]);
    setUnitValueCate("");
    setSelectedTeamOptionsCate([]);
    setTeamValueCate("");
    setSelectedDepartmentOptionsCate([]);
    setDepartmentValueCate("");
    setSelectedEmployeeNameOptionsCate([]);
    setEmployeeNameValueCate("");
    setShowAlert(
      <>
        {" "}
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Cleared Successfully👍"} </p>{" "}
      </>
    );
    handleClickOpenerr();
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
    try {
      let res = await axios.get(`${SERVICE.SINGLE_FILESHARE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileShareEdit(res?.data?.sfileshare);
      setBranchValueCateEdit(res?.data?.sfileshare?.branch);
      setSelectedBranchOptionsCateEdit([...res?.data?.sfileshare?.branch.map((t) => ({ ...t, label: t, value: t }))]);
      setUnitValueCateEdit(res?.data?.sfileshare?.unit);
      setSelectedUnitOptionsCateEdit([...res?.data?.sfileshare?.unit.map((t) => ({ ...t, label: t, value: t }))]);
      setTeamValueCateEdit(res?.data?.sfileshare?.team);
      setSelectedTeamOptionsCateEdit([...res?.data?.sfileshare?.team.map((t) => ({ ...t, label: t, value: t }))]);
      setDepartmentValueCateEdit(res?.data?.sfileshare?.department);
      setSelectedDepartmentOptionsCateEdit([...res?.data?.sfileshare?.department.map((t) => ({ ...t, label: t, value: t }))]);
      setEmployeeNameValueCateEdit(res?.data?.sfileshare?.employeename);
      setSelectedEmployeeNameOptionsCateEdit([...res?.data?.sfileshare?.employeename.map((t) => ({ ...t, label: t, value: t }))]);

      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....

  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_FILESHARE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileShareEdit(res?.data?.sfileshare);
      concordinateParticipants(res?.data?.sfileshare);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const [concBrancehs, setConcBranches] = useState("");
  const [concUnits, setConcUnits] = useState("");
  const [concTeams, setConcTeams] = useState("");
  const [concDepts, setConcDepts] = useState("");
  const [concEmps, setConcEmps] = useState("");
  const concordinateParticipants = (fileshare) => {
    const branches = fileshare.branch;
    const units = fileshare.unit;
    const teams = fileshare.team;
    const departments = fileshare.department;
    const employeenames = fileshare.employeename;
    const concatenatedBrancehs = branches.join(",");
    const concatenatedUnits = units.join(",");
    const concatenatedTeams = teams.join(",");
    const concatenatedDepts = departments.join(",");
    const concatenatedEmps = employeenames.join(",");
    setConcBranches(concatenatedBrancehs);
    setConcUnits(concatenatedUnits);
    setConcTeams(concatenatedTeams);
    setConcDepts(concatenatedDepts);
    setConcEmps(concatenatedEmps);
  };
  // get single row to view....

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_FILESHARE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileShareEdit(res?.data?.sfileshare);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let updateby = fileShareEdit.updatedby;
  let addedby = fileShareEdit.addedby;
  let processId = fileShareEdit._id;

  //editing the single data...

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_FILESHARE}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(fileShareEdit.company),
          branch: [...branchValueCateEdit],
          unit: [...unitValueCateEdit],
          team: [...teamValueCateEdit],
          department: [...departmentValueCateEdit],
          employeename: [...employeeNameValueCateEdit],
          foldername: String(fileShareEdit.foldername),
          url: String(fileShareEdit.url),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchFileShare();
      await fetchFileShareAll();
      setBranchValueCateEdit("");
      setSelectedBranchOptionsCateEdit([]);
      setUnitValueCateEdit("");
      setSelectedUnitOptionsCateEdit([]);
      setTeamValueCateEdit("");
      setSelectedTeamOptionsCateEdit([]);
      handleCloseModEdit();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const editSubmit = (e) => {
    e.preventDefault();
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    let deptopt = selectedDepartmentOptionsCateEdit.map((item) => item.value);
    let empopt = selectedEmployeeNameOptionsCateEdit.map((item) => item.value);
    const isNameMatch = fileShareArrayEdit?.some(
      (item) =>
        item.company === fileShareEdit.company &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.department.some((data) => deptopt.includes(data)) &&
        item.employeename.some((data) => empopt.includes(data)) &&
        item.foldername === fileShareEdit.foldername
    );
    if (fileShareEdit.company === "Please Select Company") {
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
    }
    else if (branchValueCateEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (unitValueCateEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (teamValueCateEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentValueCateEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeNameValueCateEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (fileShareEdit.foldername === "Please Select Folder Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Folder Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendEditRequest();
    }
  };

  //get all File Share.

  const fetchFileShare = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_FILESHARE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setFileShareArray(res_freq?.data?.fileshare);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_FILESHARE}/${item}`, {
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

      await fetchFileShare();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all File Share.

  const fetchFileShareAll = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_FILESHARE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileShareArrayEdit(
        res_freq?.data?.fileshare.filter(
          (item) => item._id !== fileShareEdit._id
        ));
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "File Share.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "EmployeeNames", field: "employeename" },
    { title: "FolderName", field: "foldername" },
  ];
  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: filteredData,
      styles: { fontSize: 5 },
    });
    doc.save("File Share.pdf");
  };
  // Excel
  const fileName = "File Share";


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "File Share",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = fileShareArray?.map((item, index) => ({
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
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "employeename",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeename,
      headerClassName: "bold-header",
    },
    {
      field: "foldername",
      headerName: "Folder Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.foldername,
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
          {isUserRoleCompare?.includes("efileshare") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dfileshare") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vfileshare") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ifileshare") && (
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
      company: item.company,
      branch: item.branch.join(","),
      unit: item.unit.join(","),
      team: item.team.join(","),
      department: item.department.join(","),
      employeename: item.employeename.join(","),
      foldername: item.foldername,
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
  return (
    <Box>
      <Headtitle title={"FILE SHARE"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Manage File Share</Typography>

      <>
        {isUserRoleCompare?.includes("afileshare") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Add File Share
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
                        options={isAssignBranch?.map(data =>({
                          label:data.company,
                          value:data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        placeholder="Please Select Company"
                        value={{ label: fileShare.company, value: fileShare.company }}
                        onChange={(e) => {
                          setFileShare({
                            ...fileShare,
                            company: e.value,
                          });
                          setBranchValueCate("");
                          setSelectedBranchOptionsCate([]);
                          setUnitValueCate("");
                          setSelectedUnitOptionsCate([]);
                          setTeamValueCate("");
                          setSelectedTeamOptionsCate([]);
                          setDepartmentValueCate("");
                          setSelectedDepartmentOptionsCate([]);
                          setEmployeeNameValueCate("");
                          setSelectedEmployeeNameOptionsCate([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={isAssignBranch?.filter(
                            (comp) =>
                              fileShare.company === comp.company
                          )?.map(data =>({
                        label:data.branch,
                        value:data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedBranchOptionsCate} onChange={handleBranchChange} valueRenderer={customValueRendererBranch} labelledBy="Please Select Branch" />
                    </FormControl>
                  </Grid> 
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={isAssignBranch?.filter(
                            (comp) =>
                              fileShare.company === comp.company && branchValueCate.includes(comp.branch)
                          )?.map(data =>({
                        label:data.unit,
                        value:data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedUnitOptionsCate} onChange={handleUnitChange} valueRenderer={customValueRendererUnit} labelledBy="Please Select Unit" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={allTeam?.filter(
                            (comp) =>
                              fileShare.company === comp.company && branchValueCate?.includes(comp.branch) && unitValueCate?.includes(comp.unit)
                          )?.map(data =>({
                        label:data.teamname,
                        value:data.teamname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedTeamOptionsCate} onChange={handleTeamChange} valueRenderer={customValueRendererTeam} labelledBy="Please Select Team" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={departmentOption} value={selectedDepartmentOptionsCate} onChange={handleDepartmentChange} valueRenderer={customValueRendererDepartment} labelledBy="Please Select Department" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={allUsersData?.filter(
                            (comp) =>
                              fileShare.company === comp.company && branchValueCate?.includes(comp.branch) && unitValueCate?.includes(comp.unit) && teamValueCate?.includes(comp.team)
                          )?.map(data =>({
                        label:data.companyname,
                        value:data.companyname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedEmployeeNameOptionsCate} onChange={handleEmployeeNameChange} valueRenderer={customValueRendererEmployeeName} labelledBy="Please Select Employee Name" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Folder Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={folderOpt}
                        placeholder="Please Select Folder Name"
                        value={{ label: fileShare.foldername, value: fileShare.foldername }}
                        onChange={(e) => {
                          setFileShare({
                            ...fileShare,
                            foldername: e.value,
                            url: e.url,
                            subcategory: "Please Select SubCategory",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              </Grid>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained"
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    {" "}
                    Submit
                  </Button>
                  <Button sx={userStyle.btncancel}
                    onClick={handleclear}
                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />   <br />
      {/* ****** Table Start ****** */}
      {!loader ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box> :
        <>
          {isUserRoleCompare?.includes("lfileshare") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  File Share List
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
                      <MenuItem value={fileShareArray?.length}>
                        All
                      </MenuItem>
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
                    {isUserRoleCompare?.includes("excelfileshare") && (
                      <>
                        <ExportXL csvData={filteredData?.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch.join(","),
                          Unit: t.unit.join(","),
                          Team: t.team.join(","),
                          Department: t.department.join(","),
                          EmployeeName: t.employeename.join(","),
                          FolderName: t.foldername,
                        }))} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvfileshare") && (
                      <>
                        <ExportCSV csvData={filteredData?.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch.join(","),
                          Unit: t.unit.join(","),
                          Team: t.team.join(","),
                          Department: t.department.join(","),
                          EmployeeName: t.employeename.join(","),
                          FolderName: t.foldername,
                        }))} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printfileshare") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdffileshare") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => downloadPdf()}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagefileshare") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
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
              {isUserRoleCompare?.includes("bdfileshare") && (
                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>)}
              <br />
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
          )}
        </>}
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
              <TableCell>Department</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Folder Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch.join(",")}</TableCell>
                  <TableCell>{row.unit.join(",")}</TableCell>
                  <TableCell>{row.team.join(",")}</TableCell>
                  <TableCell>{row.department.join(",")}</TableCell>
                  <TableCell>{row.employeename.join(",")}</TableCell>
                  <TableCell>{row.foldername}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
              File Share Info
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => delProcess(proid)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View File Share
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{fileShareEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{concBrancehs}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{concUnits}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{concTeams}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Department</Typography>
                  <Typography>{concDepts}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Name</Typography>
                  <Typography>{concEmps}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Folder Name</Typography>
                  <Typography>{fileShareEdit.foldername}</Typography>
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
      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error"
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
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'visible',
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit File Share
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
                      options={isAssignBranch?.map(data =>({
                        label:data.company,
                        value:data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{ label: fileShareEdit.company === "" ? "Please Select Company" : fileShareEdit.company, value: fileShareEdit.company === "" ? "Please Select Company" : fileShareEdit.company }}
                      onChange={(e) => {
                        setFileShareEdit({
                          ...fileShareEdit,
                          company: e.value,
                        });
                        setBranchValueCateEdit([]);
                        setSelectedBranchOptionsCateEdit([]);
                        setUnitValueCateEdit([]);
                        setSelectedUnitOptionsCateEdit([]);
                        setTeamValueCateEdit([]);
                        setSelectedTeamOptionsCateEdit([]);
                        setDepartmentValueCateEdit([]);
                        setSelectedDepartmentOptionsCateEdit([]);
                        setEmployeeNameValueCateEdit([]);
                        setSelectedEmployeeNameOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={isAssignBranch?.filter(
                            (comp) =>
                              fileShareEdit.company === comp.company
                          )?.map(data =>({
                        label:data.branch,
                        value:data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedBranchOptionsCateEdit} onChange={handleBranchChangeEdit} valueRenderer={customValueRendererBranchEdit} labelledBy="Please Select Branch" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                     Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={isAssignBranch?.filter(
                            (comp) =>
                              fileShareEdit.company === comp.company &&  branchValueCateEdit.includes(comp.branch)
                          )?.map(data =>({
                        label:data.unit,
                        value:data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedUnitOptionsCateEdit} onChange={handleUnitChangeEdit} valueRenderer={customValueRendererUnitEdit} labelledBy="Please Select Unit" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={allTeam?.filter(
                            (comp) =>
                              unitValueCateEdit.includes(comp.unit) && fileShareEdit.company === comp.company &&  branchValueCateEdit.includes(comp.branch)
                          )?.map(data =>({
                        label:data.teamname,
                        value:data.teamname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedTeamOptionsCateEdit} onChange={handleTeamChangeEdit} valueRenderer={customValueRendererTeamEdit} labelledBy="Please Select Team" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={departmentOption} value={selectedDepartmentOptionsCateEdit} onChange={handleDepartmentChangeEdit} valueRenderer={customValueRendererDepartmentEdit} labelledBy="Please Select Department" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={allUsersData?.filter(
                            (comp) =>
                              unitValueCateEdit.includes(comp.unit) && fileShareEdit.company === comp.company &&  branchValueCateEdit.includes(comp.branch) && teamValueCateEdit?.includes(comp.team)
                          )?.map(data =>({
                        label:data.companyname,
                        value:data.companyname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedEmployeeNameOptionsCateEdit} onChange={handleEmployeeNameChangeEdit} valueRenderer={customValueRendererEmployeeNameEdit} labelledBy="Please Select Employee Name" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Folder Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={folderOpt}
                      placeholder="Please Select Folder Name"
                      value={{ label: fileShareEdit.foldername === "" ? "Please Select Folder Name" : fileShareEdit.foldername, value: fileShareEdit.foldername === "" ? "Please Select Folder Name" : fileShareEdit.foldername }}
                      onChange={(e) => {
                        setFileShareEdit({
                          ...fileShareEdit,
                          foldername: e.value,
                          url: e.url,
                          subcategory: "Please Select SubCategory",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid><br /><br />
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
    </Box>
  );
}

export default FileShare;