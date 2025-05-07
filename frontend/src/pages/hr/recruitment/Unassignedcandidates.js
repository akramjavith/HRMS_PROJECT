import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
  Popover,
  Select,
  TextField,
  InputLabel,
  Typography,
  Paper,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import StyledDataGrid from "../../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
function UnassignedCandidates() {
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

  let exportColumnNames = [
    "Role",
    "Applicant Name",
    "Contact Name",
    "Email",
    "Date of Birth",
    "Experience",
    "Skill",
    "Applied Date",
  ];
  let exportRowValues = [
    "role",
    "fullname",
    "mobile",
    "email",
    "dateofbirth",
    "experience",
    "skill",
    "applieddate",
  ];
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

  const [candidates, setCandidates] = useState([]);
  const [candidateSingle, setCandidateSingle] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

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
      pagename: String("Unassigned Candidates List"),
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

  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const DetailItem = ({ label, value }) => (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "#333" }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  const ComparisonSection = ({ title, requirement, candidate }) => (
    <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#fffde7", marginBottom: 3 }}>
      <Typography variant="h6" gutterBottom color="warning.main">
        🔍 Compare {title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" fontWeight="bold">Requirement</Typography>
          <Typography variant="body2">{requirement || "-"}</Typography>
        </Grid>
        <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
          {requirement === candidate ? "✔️" : "❌"}
        </Grid>
        <Grid item xs={7}>
          <Typography variant="subtitle2" fontWeight="bold">Candidate</Typography>
          <Typography variant="body2">{candidate || "-"}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );


  const [openTable, setOpenTable] = useState(false)
  const handleOpenTable = () => {
    setOpenTable(true)
  }
  const handleCloseTable = () => {
    setOpenTable(false)
  }
  const [openApprove, setOpenApprove] = useState(false)
  const handleOpenApprove = () => {
    setOpenApprove(true)
  }
  const handleCloseApprove = () => {
    setOpenApprove(false)
  }
  const [designationRequirements, setDesignationRequirements] = useState([]);
  const [singleDesignationRequirements, setSingleDesignationRequirements] = useState({});
  useEffect(() => {
    fetchDesignationReq();
  }, [])
  const fetchDesignationReq = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.DESIGNATIONREQUIREMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const itemsWithSerialNumber = res_project?.data?.designationreq;
      setDesignationRequirements(itemsWithSerialNumber)
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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
          saveAs(blob, "Unassigned Candidates Report.png");
        });
      });
    }
  };

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  //for assigning workstation
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const [openings, setOpenings] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    designation: "Please Select Designation",
    jobrole: "Please Select Job Role",
    jobopeningid: "",
  });
  //fetch companies for dropdown
  const fetchComapnies = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Remove duplicates from companies
      let uniqueCompanies = Array.from(
        new Set(res?.data?.companies.map((t) => t.name))
      );
      setCompanies(
        uniqueCompanies.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchComapnies();
  }, []);

  // Alert delete popup
  let brandid = candidateSingle._id;
  const delBrand = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.CANDIDATES_SINGLE}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchUnassignedCandidates();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setCandidateSingle(res?.data?.scandidates);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //for getting branches
  const handleCompanyChange = async (options) => {
    setBranches([]);
    setDesignation([]);
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      branch: "Please Select Branch",
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let branchArr = res_branch.data.branch.filter((branch) => {
        return branch.company === options.value;
      });
      let finalArr = branchArr.map((branch) => ({
        label: branch.name,
        value: branch.name,
      }));
      setBranches(finalArr);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //for branch change
  const handleBranchChange = async (options) => {
    setDesignation([]);
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let designationArr = res_designation.data.designation.map(
        (designation) => ({
          label: designation.name,
          value: designation.name,
        })
      );

      setDesignation(designationArr);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleDesignationChange = async (options) => {
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_jobopenings = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let jobopeningsArr = res_jobopenings.data.jobopenings.filter(
        (opening) => {
          return (
            opening.status === "OnProgress" &&
            opening.company === openings.company &&
            opening.branch === openings.branch &&
            options.value === opening.designation
          );
        }
      );

      let jobRoleArr = jobopeningsArr.map((job) => ({
        label: job.recruitmentname,
        value: job._id,
      }));

      setJobRole(jobRoleArr);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };




  const [rowId, setRowId] = useState();
  const [candidateDetails, setCandidateDetails] = useState({});
  const getCode = async (id) => {
    setPageName(!pageName);
    try {
      setRowId(id);
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setCandidateDetails(res?.data?.scandidates);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };


  // submit option for saving....
  const handleSubmit = (e) => {
    //fetchUser();
    e.preventDefault();

    if (openings.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (openings.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (openings.designation === "Please Select Designation") {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (openings.jobrole === "Please Select Job Role") {
      setPopupContentMalert("Please Select Job Role!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      handleOpenTable();
      // sendRequest();
    }
  };

  // post call
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      // let singleUser = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${employee.employeeId}`)
      let assignbranches = await axios.put(
        `${SERVICE.CANDIDATES_SINGLE}/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: openings.jobrole,
          jobopeningsid: openings.jobopeningid,
          overallstatus: "Applied",
          updatedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchUnassignedCandidates();
      setOpenings({
        company: "Please Select Company",
        branch: "Please Select Branch",
        designation: "Please Select Designation",
        jobrole: "Please Select Job Role",
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseTable();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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
    mode: true,
    role: true,
    branch: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    experience: true,
    skill: true,
    applieddate: true,
    actions: true,
    category: true,
    subcategory: true,
    specialization: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // get single row to view....
  const getinfoCode = async (id) => {
    navigate(`/recruitment/viewresume/${id}/unassigned`);
  };

  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CANDIDATES_SINGLE}/${item}`, {
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

      await fetchUnassignedCandidates();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const getinfoCodeNew = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCandidateSingle(res?.data?.scandidates);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //frequency master name updateby edit page...
  let updateby = candidateSingle.updatedby;
  let addedby = candidateSingle.addedby;

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleClickOpenInfo = () => {
    setOpenview(true);
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setOpenings({
      company: "Please Select Company",
      branch: "Please Select Branch",
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    });
    setDesignation([]);
    setJobRole([]);
    setBranches([]);
  };

  const getEditCode = (id) => {
    navigate(`/unassignedcandidates/editresume/${id}`);
  };

  //get all employees list details
  const fetchUnassignedCandidates = async () => {
    setPageName(!pageName);
    try {
      let res_candidates = await axios.get(SERVICE.INTERVIEWCANDIDATES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let candi = res_candidates?.data?.candidates?.filter(
        (data) =>
          data?.role === "All" || data?.role === "" || data?.role == undefined
      );
      setCandidates(candi);

      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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

  // Excel
  const fileName = "Unassigned Candidates Report";
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Unassigned Candidates Report",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchUnassignedCandidates();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      applieddate: moment(item.createdAt).format("DD-MM-YYYY"),
      skill: item?.skill?.join(","),
      experience: `${item?.experience} ${item?.experienceestimation == undefined
        ? "Years"
        : item?.experienceestimation
        }`,
      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY")
        : "",
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidates]);

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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    // { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 130,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              variant="contained"
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id);
              }}
            >
              Assign
            </Button>
          )}
          {/* )} */}
        </Grid>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0,
      width: 150,
      hide: !columnVisibility.role,
      headerClassName: "bold-header",
    },
    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fullname,
      headerClassName: "bold-header",
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mobile,
      headerClassName: "bold-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.email,
      headerClassName: "bold-header",
    },
    {
      field: "dateofbirth",
      headerName: "Date of Birth",
      flex: 0,
      width: 150,
      hide: !columnVisibility.dateofbirth,
      headerClassName: "bold-header",
    },
    // { field: "category", headerName: "Category", flex: 0, width: 100, hide: !columnVisibility.category, headerClassName: "bold-header" },
    // { field: "subcategory", headerName: "Sub Category", flex: 0, width: 100, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
    // { field: "specialization", headerName: "Specialization", flex: 0, width: 100, hide: !columnVisibility.specialization, headerClassName: "bold-header" },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 100,
      hide: !columnVisibility.skill,
      headerClassName: "bold-header",
    },
    {
      field: "applieddate",
      headerName: "Applied Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.applieddate,
      headerClassName: "bold-header",
    },
    // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getEditCode(params.row.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dunassignedcandidates") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenInfo();
                getinfoCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCodeNew(params.row.id);
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
      id: item._id,
      serialNumber: item.serialNumber,
      role: item.role,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item.dateofbirth,
      qualification: item.qualification,

      category: item.categoryedu,
      subcategory: item.subcategoryedu,
      specialization: item.specialization,
      skill: item?.skill,
      applieddate: item.applieddate,
      experience: item?.experience,
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"UNASSIGNED CANDIDATES REPORT"} />

      <PageHeading
        title="Unassigned Candidates Report"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Resume"
        subpagename="Unassigned Candidates"
        subsubpagename=""
      />
      <br />
      {isUserRoleCompare?.includes("lunassignedcandidates") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Unassigned Candidates List
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <>
                  <Link
                    to="/recruitment/addresume"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      float: "right",
                    }}
                  >
                    <Button variant="contained" sx={buttonStyles.buttonsubmit}>
                      ADD
                    </Button>
                  </Link>
                </>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Unassigned Candidates List</Typography>
                            </Grid>
                            <Grid item xs={8} style={{ display:"flex",justifyContent:"flex-end"}}>
                                <Button sx={userStyle.importheadtext} styles={{"right":"0"}}>Add</Button>
                            </Grid>
                        </Grid> */}
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
                    {/* <MenuItem value={candidates?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("csvunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printunassignedcandidates") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printunassignedcandidates") && (
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
            {isUserRoleCompare?.includes("bdunassignedcandidates") && (
              <>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              </>
            )}
            <br />
            <br />
            {!isBankdetail ? (
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

      {/* <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                        <Button autoFocus variant="contained" color='error'
                            onClick={(e) => delBoardingcheckbox(e)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box> */}
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
              sx={buttonStyles.buttonsubmit}
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            width: "50rem",
            margin: "auto auto",
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                Assign Unassigned Candidates
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={companies}
                      placeholder="Please Select Company"
                      value={{
                        label: openings.company,
                        value: openings.company,
                      }}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          company: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={branches}
                      placeholder="Please Select Branch"
                      value={{ label: openings.branch, value: openings.branch }}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          branch: e.value,
                        }));
                      }}
                    />
                    {/* <MultiSelect size="small" options={branches} value={selectedOptionsBranchAdd} onChange={handleBranchChangeAdd} valueRenderer={customValueRendererBranchAdd} /> */}
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Designation{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={designation}
                      placeholder="Please Select Designation"
                      value={{
                        label: openings.designation,
                        value: openings.designation,
                      }}
                      onChange={(e) => {
                        handleDesignationChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          designation: e.value,
                        }));
                        setSingleDesignationRequirements(designationRequirements?.find(data => data?.designation === e.value) || {})
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Job Role{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={jobRole}
                      placeholder="Please Select Job Role"
                      value={{
                        label: openings.jobrole,
                        value: openings.jobrole,
                      }}
                      onChange={(e) => {
                        setOpenings((prev) => ({
                          ...prev,
                          jobrole: e.label,
                          jobopeningid: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  Update
                </Button>
                <Grid item md={1} sm={1}></Grid>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseModEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

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
          <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
            ok
          </Button>
        </DialogActions>
      </Dialog>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="UnAssigned Candidates Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delBrand}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAreagrpcheckbox}
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


      <Dialog
        open={openTable}
        onClose={handleCloseTable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        fullWidth
        sx={{ marginTop: "50px" }}
      >
        <Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Designation Requirement & Candidate Details
          </Typography>

          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: "#fffde7",
              mt: 3,
              borderLeft: "5px solid #fbc02d",
            }}
          >
            <Typography variant="h6" gutterBottom color="warning.main">
              🧾 Cross-Check Key Details
            </Typography>

            <TableContainer component={Box}>
              <Table size="small" sx={{ minWidth: 900, mx: "auto" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9fbe7" }}>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell align="center"><strong>Designation Requirement</strong></TableCell>
                    <TableCell align="center" sx={{ width: "4px", backgroundColor: "#eeeeee" }}></TableCell> {/* Meridian */}
                    <TableCell align="center"><strong>Candidate Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Candidate Name */}
                  <TableRow>
                    <TableCell><strong>Candidate Name</strong></TableCell>
                    <TableCell>-</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{candidateDetails?.fullname || "-"}</TableCell>
                  </TableRow>
                  {/* Designation */}
                  <TableRow>
                    <TableCell><strong>Designation</strong></TableCell>
                    <TableCell>{singleDesignationRequirements?.designation || "-"}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{candidateDetails?.role || "-"}</TableCell>
                  </TableRow>

                  {/* Department */}
                  <TableRow>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell>{singleDesignationRequirements?.department || "-"}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>

                  {/* Language */}
                  {/* <TableRow>
                    <TableCell><strong>Language</strong></TableCell>
                    <TableCell>{singleDesignationRequirements?.language?.join(", ") || "-"}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow> */}

                  {/* Skill */}
                  <TableRow>
                    <TableCell><strong>Skill</strong></TableCell>
                    <TableCell>{singleDesignationRequirements?.skill?.join(", ") || "-"}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{candidateDetails?.skill?.join(", ") || "-"}</TableCell>
                  </TableRow>

                  {/* Experience */}
                  <TableRow>
                    <TableCell><strong>Experience</strong></TableCell>
                    <TableCell>
                      From {singleDesignationRequirements?.experiencefrom || 0} to {singleDesignationRequirements?.experienceto || 0} years
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {candidateDetails?.domainexperience || 0} {candidateDetails?.domainexperienceestimation || "Years"}
                    </TableCell>
                  </TableRow>

                  {/* Salary */}
                  <TableRow>
                    <TableCell><strong>Salary</strong></TableCell>
                    <TableCell>
                      From ₹{singleDesignationRequirements?.salaryfrom || 0} to ₹{singleDesignationRequirements?.salaryto || 0}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      ₹{candidateDetails?.expectedsalary || 0} {candidateDetails?.expectedsalaryopts || ""}
                    </TableCell>
                  </TableRow>

                  {/* Education */}
                  <TableRow>
                    <TableCell><strong>Education</strong></TableCell>
                    <TableCell>
                      {`${singleDesignationRequirements?.category?.join(", ") || "-"}/${singleDesignationRequirements?.subcategory?.join(", ") || "-"}/${singleDesignationRequirements?.education?.join(", ") || "-"}`}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {candidateDetails?.educationdetails?.length > 0
                        ? candidateDetails.educationdetails.map((edu, i) =>
                          `${i + 1}. ${edu?.categoryedu || ""}/${edu?.subcategoryedu || ""}/${edu?.specilization || ""}`
                        ).join(" | ")
                        : "-"}
                    </TableCell>
                  </TableRow>

                  {/* Certification */}
                  <TableRow>
                    <TableCell><strong>Certification</strong></TableCell>
                    <TableCell>-</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{candidateDetails?.certification?.join(", ") || "-"}</TableCell>
                  </TableRow>

                  {/* Job Description */}
                  <TableRow>
                    <TableCell><strong>Job Description</strong></TableCell>
                    <TableCell>
                      {convertToNumberedList(singleDesignationRequirements?.jobdescription)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>

                  {/* Job Requirements */}
                  <TableRow>
                    <TableCell><strong>Job Requirements</strong></TableCell>
                    <TableCell>
                      {convertToNumberedList(singleDesignationRequirements?.jobrequirements)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>

                  {/* Job Benefits */}
                  <TableRow>
                    <TableCell><strong>Job Benefits</strong></TableCell>
                    <TableCell>
                      {convertToNumberedList(singleDesignationRequirements?.jobbenefits)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Buttons */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="contained" color="secondary" onClick={handleCloseTable}>
              Close
            </Button>
            &nbsp;&nbsp;
            <Button variant="contained" color="success" onClick={sendRequest}>
              Approve
            </Button>
          </Box>
        </Box>
      </Dialog>



    </Box>
  );
}

export default UnassignedCandidates;
