import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, Divider, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, FormGroup, FormControlLabel, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { colourStyles, userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaDownload, FaTrash } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import * as XLSX from "xlsx";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
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
import { CsvBuilder } from "filefy";
import * as FileSaver from 'file-saver';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import PageHeading from "../../components/PageHeading";

function SalarySlabList() {

  const [loading, setLoading] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedprocess, setSelectedprocess] = useState("");
  const [selectedprocessedit, setSelectedprocessedit] = useState("");
  const [selectedprocessqueuedit, setSelectedprocessqueueedit] = useState("Please Select Process");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [salarySlab, setSalarySlab] = useState({
    company: "Please Select Company", branch: "Please Select Branch",
    processqueue: "Please Select Process", checkinput: "",
    salarycode: "", basic: "", hra: "", conveyance: "", medicalallowance: "", productionallowance: "", productionallowancetwo: "", otherallowance: "", shiftallowance: "", esideduction: false, esipercentage: "", esimaxsalary: "", esiemployeepercentage: "", pfdeduction: false, pfpercentage: "", pfemployeepercentage: ""
  });
  const [salarySlabEdit, setSalarySlabEdit] = useState({ company: "Please Select Company", branch: "Please Select Branch", processqueue: "Please Select Process", checkinput: "", salarycode: "", basic: "", hra: "", conveyance: "", medicalallowance: "", productionallowance: "", productionallowancetwo: "", otherallowance: "", shiftallowance: "", esideduction: false, esipercentage: "", esimaxsalary: "", esiemployeepercentage: "", pfdeduction: false, pfpercentage: "", pfemployeepercentage: "" });
  const [salarySlabArray, setSalarySlabArray] = useState([]);
  const [companyOption, setCompanyOption] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [branchOptionEdit, setBranchOptionEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUnit, allTeam, allCompany, allBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpensalary, setIsErrorOpenSalary] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteSalarySlab, setDeleteSalarySlab] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [salarySlabData, setSalarySlabData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSalarySlabEdit, setAllSalarySlabEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [processQueueArray, setProcessQueueArray] = useState([]);
  const [processQueueArrayedit, setProcessQueueArrayEdit] = useState([]);


  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;


  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    processqueue: true,
    salarycode: true,
    basic: true,
    hra: true,
    conveyance: true,
    medicalallowance: true,
    productionallowance: true,
    productionallowancetwo: true,
    otherallowance: true,
    shiftallowance: true,
    esideduction: true,
    pfdeduction: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [salarySlabArray]);

  useEffect(() => {
    getexcelDatas();
  }, [salarySlabArray]);
  useEffect(() => {
    fetchEmployee();
    fetchCompany();
    // fetchProfessionalTaxAll();
  }, [isEditOpen]);

  useEffect(() => {
    fetchEmployee();
  }, []);
  useEffect(() => {
    fetchEmployee();
  }, [isEditOpen, salarySlabEdit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };


  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  // Error Popup model saalryslab
  const handleClickOpenerrSalary = () => {
    setIsErrorOpenSalary(true);
  };
  const handleCloseerrSalary = () => {
    setIsErrorOpenSalary(false);
    fetchEmployee();
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


  const fetchCompany = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        { label: "ALL", value: "ALL" },
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCompanyOption(companyall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchBranch = async (e) => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setLoader(true);

      let data_set = e.value.toUpperCase() === 'ALL'
        ? res_branch.data.branch
        : res_branch.data.branch.filter((data) => e.value === data.company);

      const branchall = [
        { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setBranchOption(branchall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  const fetchBranchEdit = async (e) => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setLoader(true);

      let data_set = e.toUpperCase() === 'ALL'
        ? res_branch.data.branch
        : res_branch.data.branch.filter((data) => data.company === e);

      const branchall = [
        { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setBranchOptionEdit(branchall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  const fetchProcessQueueEdit = async (e) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = e.toUpperCase() === 'ALL'
        ? res_freq?.data?.processqueuename
        : res_freq?.data?.processqueuename.filter((data) => data.branch === e);

      const branchall = [

        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProcessQueueArrayEdit(branchall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteSalarySlab(res?.data?.ssalaryslab);

      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let taxid = deleteSalarySlab._id;
  const deltax = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_SALARYSLAB}/${taxid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
      setSelectedprocessedit(res?.data?.ssalaryslab.checkinput == "input" ? res?.data?.ssalaryslab.processqueue : "");
      setSelectedprocessqueueedit(res?.data?.ssalaryslab.checkinput == "dropdown" ? res?.data?.ssalaryslab.processqueue : "");
      await fetchBranchEdit(res?.data?.ssalaryslab?.company);
      await fetchProcessQueueEdit(res?.data?.ssalaryslab?.branch);
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setLoader(true);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //frequency master name updateby edit page...
  let updateby = salarySlabEdit.updatedby;
  let addedby = salarySlabEdit.addedby;
  let frequencyId = salarySlabEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.SINGLE_SALARYSLAB}/${frequencyId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(salarySlabEdit.company),
        branch: String(salarySlabEdit.branch),
        processqueue: String(selectedprocessedit !== "" ? selectedprocessedit : selectedprocessqueuedit),
        salarycode: String(salarySlabEdit.salarycode),
        basic: Number(salarySlabEdit.basic),
        hra: Number(salarySlabEdit.hra),
        conveyance: Number(salarySlabEdit.conveyance),
        medicalallowance: Number(salarySlabEdit.medicalallowance),
        productionallowance: Number(salarySlabEdit.productionallowance),
        productionallowancetwo: Number(salarySlabEdit.productionallowancetwo),
        otherallowance: Number(salarySlabEdit.otherallowance),
        shiftallowance: Number(salarySlabEdit.shiftallowance),
        esideduction: Boolean(salarySlabEdit.esideduction),
        esipercentage: Number(salarySlabEdit.esideduction ? salarySlabEdit.esipercentage : ""),
        esimaxsalary: Number(salarySlabEdit.esideduction ? salarySlabEdit.esimaxsalary : ""),
        esiemployeepercentage: Number(salarySlabEdit.esideduction ? salarySlabEdit.esiemployeepercentage : ""),
        pfdeduction: Boolean(salarySlabEdit.pfdeduction),
        pfpercentage: Number(salarySlabEdit.pfdeduction ? salarySlabEdit.pfpercentage : ""),
        pfemployeepercentage: Number(salarySlabEdit.pfdeduction ? salarySlabEdit.pfemployeepercentage : ""),
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      // await fetchProfessionalTaxAll();
      await fetchEmployee();
      handleCloseModEdit();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    // fetchProfessionalTaxAll();
    const isNameMatch = allSalarySlabEdit?.some((item) => item.company === salarySlabEdit.company &&
      item.branch === salarySlabEdit.branch && item.salarycode.toLowerCase() === salarySlabEdit.salarycode.toLowerCase());

    if (salarySlabEdit.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (salarySlabEdit.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (salarySlabEdit.salarycode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Salary Code"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (salarySlabEdit.processqueue === "" && selectedprocessedit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Salary Slab already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  const [salarySlabFilterArray, setSalarySlabFilterArray] = useState([])


  const fetchProfessionalTaxArray = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);

      setSalarySlabFilterArray(res_freq?.data?.salaryslab);
      setIsPdfFilterOpen(false);
    } catch (err) { setIsPdfFilterOpen(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchProfessionalTaxArray()
  }, [isFilterOpen])



  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployee = async () => {
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.ALL_SALARYSLAB_SORTASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery,
        assignbranch: isAssignBranch
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setSalarySlabArray(itemsWithSerialNumber);
      setOverallFilterdata(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);



  const delAreagrpcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_SALARYSLAB}/${item}`, {
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchEmployee();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "SalarySlab.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Process Queue", field: "processqueue" },
    { title: "Salary Code", field: "salarycode" },
    { title: "Basic", field: "basic" },
    { title: "HRA", field: "hra" },
    { title: "Conveyance", field: "conveyance" },
    { title: "Medical Allowance", field: "medicalallowance" },
    { title: "Production Allowance", field: "productionallowance" },
    { title: "Production Allowance 2", field: "productionallowancetwo" },
    { title: "Other Allowance", field: "otherallowance" },
    { title: "Shift Allowance", field: "shiftallowance" },
    { title: "ESI Deduction", field: "esideduction" },
    { title: "PF Deduction", field: "pfdeduction" },
  ];


  // pdf functionality 
  const downloadPdf = async (isfilter) => {
    setLoading(true);

    let overalldata;
    if (isfilter !== "filtered") {
      setPageName(!pageName)
      try {
        let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setLoader(true);

        overalldata = res_freq?.data?.salaryslab
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      overalldata.map(row => ({
        ...row, serialNumber: serialNumberCounter++,
        // company: t.company,
        // branch: t.branch,
        // processqueue: t.processqueue,
        // salarycode: t.salarycode,
        // basic: t.basic,
        // hra: t.hra,
        // conveyance: t.conveyance,
        // medicalallowance: t.medicalallowance,
        // productionallowance: t.productionallowance,
        // "ProductionAllowance 2": t.productionallowancetwo,
        // OtherAllowance: t.otherallowance,
        // ShiftAllowance: t.shiftallowance,
        esideduction: row.esideduction ? "YES" : "NO",
        pfdeduction: row.pfdeduction ? "YES" : "NO",
      }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("SalarySlab.pdf");
    setLoading(false);
    setIsPdfFilterOpen(false)

  };


  // Excel
  const fileName = "SalarySlab";
  // get particular columns for export excel
  const getexcelDatas = () => {
    setPageName(!pageName)
    try {
      var data = salarySlabArray.map((t, index) => ({
        Sno: index + 1,
        Company: t.company,
        Branch: t.branch,
        ProcessQueue: t.processqueue,
        SalaryCode: t.salarycode,
        Basic: t.basic,
        HRA: t.hra,
        Conveyance: t.conveyance,
        MedicalAllowance: t.medicalallowance,
        ProductionAllowance: t.productionallowance,
        "ProductionAllowance 2": t.productionallowancetwo,
        OtherAllowance: t.otherallowance,
        ShiftAllowance: t.shiftallowance,
        "ESI Deduction": t.esideduction ? "YES" : "NO",
        "PF Deduction": t.pfdeduction ? "YES" : "NO",
      }));
      setSalarySlabData(data);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Salary Slab",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = salarySlabArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      esideduction: item.esideduction ? "YES" : "NO",
      pfdeduction: item.pfdeduction ? "YES" : "NO",
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
  const filteredDatas = overallFilterdata?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "processqueue",
      headerName: "Process Queue ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.processqueue,
      headerClassName: "bold-header",
    },
    {
      field: "salarycode",
      headerName: "Salary Code",
      flex: 0,
      width: 130,
      hide: !columnVisibility.salarycode,
      headerClassName: "bold-header",
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 0,
      width: 100,
      hide: !columnVisibility.basic,
      headerClassName: "bold-header",
    },
    {
      field: "hra",
      headerName: "HRA",
      flex: 0,
      width: 100,
      hide: !columnVisibility.hra,
      headerClassName: "bold-header",
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.conveyance,
      headerClassName: "bold-header",
    },
    {
      field: "medicalallowance",
      headerName: "Medical Allowance",
      flex: 0,
      width: 150,
      hide: !columnVisibility.medicalallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowance",
      headerName: "Production Allowance",
      flex: 0,
      width: 170,
      hide: !columnVisibility.productionallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowancetwo",
      headerName: "Production Allowance 2",
      flex: 0,
      width: 180,
      hide: !columnVisibility.productionallowancetwo,
      headerClassName: "bold-header",
    },
    {
      field: "otherallowance",
      headerName: "Other Allowance",
      flex: 0,
      width: 130,
      hide: !columnVisibility.otherallowance,
      headerClassName: "bold-header",
    },
    {
      field: "shiftallowance",
      headerName: "Shift Allowance",
      flex: 0,
      width: 130,
      hide: !columnVisibility.shiftallowance,
      headerClassName: "bold-header",
    },
    {
      field: "esideduction",
      headerName: "ESI Deduction",
      flex: 0,
      width: 130,
      hide: !columnVisibility.esideduction,
      headerClassName: "bold-header",
    },
    {
      field: "pfdeduction",
      headerName: "PF Deduction",
      flex: 0,
      width: 130,
      hide: !columnVisibility.pfdeduction,
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
          {isUserRoleCompare?.includes("esalaryslablist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dsalaryslablist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vsalaryslablist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("isalaryslablist") && (
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
      processqueue: item.processqueue,
      salarycode: item.salarycode,
      basic: item.basic,
      hra: item.hra,
      conveyance: item.conveyance,
      medicalallowance: item.medicalallowance,
      productionallowance: item.productionallowance,
      productionallowancetwo: item.productionallowancetwo,
      otherallowance: item.otherallowance,
      shiftallowance: item.shiftallowance,
      esideduction: item.esideduction ? "YES" : "NO",
      pfdeduction: item.pfdeduction ? "YES" : "NO",
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
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = async (isfilter) => {

    setLoading(true);

    let overalldata;
    if (isfilter !== "filtered") {
      setPageName(!pageName)
      try {
        let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setLoader(true);
        overalldata = res_freq?.data?.salaryslab

      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          ProcessQueue: t.processqueue,
          SalaryCode: t.salarycode,
          Basic: t.basic,
          HRA: t.hra,
          Conveyance: t.conveyance,
          MedicalAllowance: t.medicalallowance,
          ProductionAllowance: t.productionallowance,
          "ProductionAllowance 2": t.productionallowancetwo,
          OtherAllowance: t.otherallowance,
          ShiftAllowance: t.shiftallowance,
          "ESI Deduction": t.esideduction,
          "PF Deduction": t.pfdeduction,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overalldata.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          ProcessQueue: t.processqueue,
          SalaryCode: t.salarycode,
          Basic: t.basic,
          HRA: t.hra,
          Conveyance: t.conveyance,
          MedicalAllowance: t.medicalallowance,
          ProductionAllowance: t.productionallowance,
          "ProductionAllowance 2": t.productionallowancetwo,
          OtherAllowance: t.otherallowance,
          ShiftAllowance: t.shiftallowance,
          "ESI Deduction": t.esideduction ? "YES" : "NO",
          "PF Deduction": t.pfdeduction ? "YES" : "NO",
        })),
        fileName,
      );

    }
    setLoading(false);
    setIsFilterOpen(false)
  };



  return (
    <Box>
      <Headtitle title={"SALARY SLAB LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Salary Slab List"
        modulename="PayRoll"
        submodulename="Salary Slab"
        mainpagename="Salary Slab List"
        subpagename=""
        subsubpagename=""
      />

      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lsalaryslablist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Salary Slab List</Typography>
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
                    {/* <MenuItem value={salarySlabArray?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelsalaryslablist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        // fetchProfessionalTaxArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvsalaryslablist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        // fetchProfessionalTaxArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printsalaryslablist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfsalaryslablist") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagesalaryslablist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
            {isUserRoleCompare?.includes("bdsalaryslablist") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!loader ? (
              <Box sx={userStyle.container}>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </Box>
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box>
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalPages={searchQuery !== "" ? 1 : totalPages}
                    onPageChange={handlePageChange}
                    pageItemLength={filteredDatas?.length}
                    totalProjects={
                      searchQuery !== "" ? filteredDatas?.length : totalProjects
                    }
                  />
                </Box>


              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Process Queue</TableCell>
              <TableCell>Salary Code</TableCell>
              <TableCell>Basic</TableCell>
              <TableCell>HRA</TableCell>
              <TableCell>Conveyance</TableCell>
              <TableCell>Medical Allowance</TableCell>
              <TableCell>Production Allowance</TableCell>
              <TableCell>Production Allowance 2</TableCell>
              <TableCell>Other Allowance</TableCell>
              <TableCell>Shift Allowance</TableCell>
              <TableCell>ESI Deduction</TableCell>
              <TableCell>PF Deduction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {salarySlabArray &&
              salarySlabArray.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.processqueue}</TableCell>
                  <TableCell>{row.salarycode}</TableCell>
                  <TableCell>{row.basic}</TableCell>
                  <TableCell>{row.hra}</TableCell>
                  <TableCell>{row.conveyance}</TableCell>
                  <TableCell>{row.medicalallowance}</TableCell>
                  <TableCell>{row.productionallowance}</TableCell>
                  <TableCell>{row.productionallowancetwo}</TableCell>
                  <TableCell>{row.otherallowance}</TableCell>
                  <TableCell>{row.shiftallowance}</TableCell>
                  <TableCell>{row.esideduction ? "YES" : "NO"}</TableCell>
                  <TableCell>{row.pfdeduction ? "YES" : "NO"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Salary Slab Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
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
          <Button autoFocus variant="contained" color="error" onClick={(e) => deltax(taxid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Salary Slab</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{salarySlabEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{salarySlabEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Process Queue</Typography>
                  <Typography>{salarySlabEdit.processqueue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Salary Code</Typography>
                  <Typography>{salarySlabEdit.salarycode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Basic <span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.basic}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    HRA<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.hra}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Conveyance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.conveyance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Medical Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.medicalallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Production Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.productionallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Production Allowance 2<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.productionallowancetwo}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Other Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.otherallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Shift Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.shiftallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ESI Deduction</Typography>
                  <Typography>{salarySlabEdit.esideduction ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">PF Deduction</Typography>
                  <Typography>{salarySlabEdit.pfdeduction ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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


      <Box>
        <Dialog open={isErrorOpensalary} onClose={handleCloseerrSalary} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
              onClick={handleCloseerrSalary}
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
            <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/*Export XL Data  */}
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
          {loading ? (
            <LoadingButton
              // onClick={handleClick}
              loading={loading}
              loadingPosition="center"
              variant="contained"
            >
              <span>Loading Over All Data..</span>
            </LoadingButton>

          ) : (
            <Button variant="contained"
              onClick={(e) => {
                handleExportXL("overall")
              }}
            >
              Export Over All Data
            </Button>

          )}

          {/* <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchProfessionalTaxArray()
            }}
          >
            Export Over All Data
          </Button> */}
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
          {loading ? (
            <LoadingButton
              // onClick={handleClick}
              loading={loading}
              loadingPosition="center"
              variant="contained"
            >
              <span>Loading Over All Data..</span>
            </LoadingButton>

          ) : (
            <Button variant="contained"
              onClick={(e) => {
                downloadPdf("overall")
              }}
            >
              Export Over All Data
            </Button>

          )}
        </DialogActions>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Salary Slab</Typography>
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
                      options={companyOption}
                      placeholder="Please Select Company"
                      value={{ label: salarySlabEdit.company, value: salarySlabEdit.company }}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          company: e.value,
                          branch: "Please Select Branch",
                          processqueue: "Please Select Process"
                        });
                        fetchBranchEdit(e.value);
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
                      options={branchOptionEdit}
                      placeholder="Please Select Branch"
                      value={{ label: salarySlabEdit.branch, value: salarySlabEdit.branch }}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          branch: e.value,
                          processqueue: "Please Select Process",
                        });
                        fetchProcessQueueEdit(e.value)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      isDisabled={selectedprocessedit.length > 0}
                      options={processQueueArrayedit}
                      placeholder="Please Select Company"
                      value={{ label: selectedprocessqueuedit, value: selectedprocessqueuedit }}
                      onChange={(e) => setSelectedprocessqueueedit(e.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      disabled={selectedprocessqueuedit !== ""}
                      placeholder="Please Enter Process "
                      value={selectedprocessedit}
                      onChange={(e) => {
                        setSelectedprocessedit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Salary Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Salary Code"
                      value={salarySlabEdit.salarycode}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          salarycode: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Basic <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Basic Amount"
                      value={salarySlabEdit.basic}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          basic: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      HRA <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter HRA"
                      value={salarySlabEdit.hra}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          hra: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Conveyance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Conveyance"
                      value={salarySlabEdit.conveyance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          conveyance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Medical Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Medical Allowance"
                      value={salarySlabEdit.medicalallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          medicalallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Production Allowance"
                      value={salarySlabEdit.productionallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          productionallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance 2<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Production Allowance 2"
                      value={salarySlabEdit.productionallowancetwo}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          productionallowancetwo: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Other Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Other Allowance"
                      value={salarySlabEdit.otherallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          otherallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Shift Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Shift Allowance"
                      value={salarySlabEdit.shiftallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          shiftallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlabEdit.esideduction} />} onChange={(e) => setSalarySlabEdit({ ...salarySlabEdit, esideduction: !salarySlabEdit.esideduction })} label="ESI Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlabEdit.esideduction && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Percentage"
                          value={salarySlabEdit.esipercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              esipercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography> ESI Max Salary </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Max Salary"
                          value={salarySlabEdit.esimaxsalary}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              esimaxsalary: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Employee Percentage"
                          value={salarySlabEdit.esiemployeepercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              esiemployeepercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={6} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlabEdit.pfdeduction} />} onChange={(e) => setSalarySlabEdit({ ...salarySlabEdit, pfdeduction: !salarySlabEdit.pfdeduction })} label="PF Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlabEdit.pfdeduction && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          PF Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Percentage"
                          value={salarySlabEdit.pfpercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              pfpercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          PF Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Employee Percentage"
                          value={salarySlabEdit.pfemployeepercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              pfemployeepercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
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
    </Box>
  );
}
export default SalarySlabList;