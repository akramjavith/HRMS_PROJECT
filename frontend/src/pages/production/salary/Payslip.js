import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Typography, TextField, List, ListItem, ListItemText, Popover, IconButton, Select, MenuItem, DialogContent, DialogActions, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
// import { FaPrint, FaFilePdf } from "react-icons/fa";
import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
// import ImageIcon from "@mui/icons-material/Image";
// import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
// import { debounce } from "lodash";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";
// import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
// import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
// import ExportData from "../../../components/ExportData";

function PayslipUser() {
  // const [fileFormat, setFormat] = useState("");

  const [loaderPayslip, setLoaderPayslip] = useState(false);
  const [userPayslip, setUserPayslip] = useState([]);

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

  // const exportColumnNames = ["Employee Name", "Branch", "Unit", "Project Vendor", "Date", "Queue Name", "Login ID", "Accuracy", "Total Fields", "Error Count", "Auto Count"];
  // const exportRowValues = ["name", "branch", "unit", "projectvendor", "date", "queuename", "loginid", "accuracy", "totalfields", "errorcount", "autocount"];

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, listPageAccessMode } = useContext(UserRoleAccessContext);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Manual Error Upadate.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

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
  const ids = open ? "simple-popover" : undefined;

  const [selectedRows, setSelectedRows] = useState([]);

  // let username = isUserRoleAccess.username
  const id = useParams().id;
  // const classes = useStyles();

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    department: true,
    month: true,
    year: true,
    company: true,
    branch: true,
    unit: true,
    empcode: true,
    companyname: true,
    legalname: true,
    designation: true,
    team: true,
    doj: true,
    bankname: true,
    accountholdername: true,
    accountnumber: true,
    ifsccode: true,
    totalnumberofdays: true,
    clsl: true,
    totalasbleave: true,
    totalpaidDays: true,
    gross: true,
    basic: true,
    hra: true,
    conveyance: true,
    medicalallowance: true,
    productionallowance: true,
    productionallowancetwo: true,
    otherallowance: true,
    finalbasic: true,
    finalhra: true,
    finalconveyance: true,
    finalmedicalallowance: true,
    finalproductionallowance: true,
    finalotherallowance: true,
    finalnetsalary: true,
    pfdeduction: true,
    esideduction: true,
    professionaltax: true,
    finallopdays: true,
    finalleavededuction: true,
    totaldeductions: true,
    noallowancepoint: true,
    nightshiftallowance: true,
    finalsalary: true,
    ctc: true,
    paidstatus: true,
    currentmonthavg: true,
    currentmonthattendance: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // //print...
  // const componentRef = useRef();
  // const handleprint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: "PaySlip",
  //   pageStyle: "print",
  // });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(userPayslip);
  }, [userPayslip]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(items.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const handleFetchPaySlipDetails = async () => {
    setLoaderPayslip(true);
    try {
      let res = await axios.post(SERVICE.PAYRUNLIST_SINGLE_USER_LASTHREE_MONTHS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyname: isUserRoleAccess.companyname,
        department: isUserRoleAccess.department,
      });

      let datas = res.data.payruncontrol
        .map((dv) => ({ data: dv.data.filter((d) => d.companyname === isUserRoleAccess.companyname).map((d) => ({ ...d, month: dv.month, year: dv.year })) }))
        .map((d) => d.data)
        .flat();
      console.log(datas, "datas");

      let dataWithSerialNumber = datas.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        salarytypefinal: item.salarytypefinal ? item.salarytypefinal : item.salarytype,
        deductiontypefinal: item.deductiontypefinal ? item.deductiontypefinal : item.deductiontype,
        otherdeductionfinal: item.otherdeductionfinal ? item.otherdeductionfinal : item.otherdeduction,

        lossdeductionfinal: item.lossdeductionfinal ? item.lossdeductionfinal : item.salarytype === "Final Salary" ? item.lossdeduction : item.salarytype === "Fixed Salary" ? item.fixedlossdeduction : item.prodlossdeduction,
      }));

      console.log("123");

      // console.log(datasplitted, "datasplitted");

      let finaldownloadData = dataWithSerialNumber.map((t, index) => {
        let commonFields = {
          ...t,
          Sno: index + 1,
          company: t.company,
          month: t.month,
          year: t.year,
          branch: t.branch,
          unit: t.unit,
          empcode: t.empcode,
          legalname: t.legalname,
          companyname: t.companyname,
          designation: t.designation,
          team: t.team,
          processcodeexp: t.processcodeexp,
          doj: t.doj,
          experience: Number(t.experience),
          bankname: t.bankname,
          accountholdername: t.accountholdername,
          accountnumber: t.accountnumber,
          ifsccode: t.ifsccode,
          uan: t.uan,
          ipname: t.ipname,
          totalnumberofdays: Number(t.totalnumberofdays),
          totalshift: Number(t.totalshift),
          clsl: Number(t.clsl),
          weekoffcount: Number(t.weekoffcount),
          holiday: Number(t.holiday),
          totalasbleave: Number(t.totalasbleave),
          totalpaidDays: Number(t.totalpaidDays),
          basic: Number(t.basic),
          hra: Number(t.hra),
          conveyance: Number(t.conveyance),
          medicalallowance: Number(t.medicalallowance),
          productionallowance: Number(t.productionallowance),
          productionallowancetwo: Number(t.productionallowancetwo),
          otherallowance: Number(t.otherallowance),
          monthPoint: Number(t.monthPoint),
          acheivedpoints: Number(t.acheivedpoints),
          acheivedpercent: Number(t.acheivedpercent),
          penaltyamount: Number(t.penaltyamount),
        };

        if (t.salarytypefinal === "Final Salary") {
          return {
            ...commonFields,
            otherdeduction: Number(t.otherdeduction),
            lossdeduction: Number(t.lossdeduction),
            finalbasic: Number(t.finalbasic),
            finalhra: Number(t.finalhra),
            finalconveyance: Number(t.finalconveyance),
            finalmedicalallowance: Number(t.finalmedicalallowance),
            finalproductionallowance: Number(t.finalproductionallowance),
            finalotherallowance: Number(t.finalotherallowance),
            finalnetsalary: Number(t.finalnetsalary),
            pfdays: Number(t.pfdays),
            pfdeduction: Number(t.pfdeduction),
            esideduction: Number(t.esideduction),
            paysliplop: Number(t.paysliplop),
            professionaltax: Number(t.professionaltax),
            totaldeductions: Number(t.totaldeductions),
            noallowancepoint: Number(t.noallowancepoint),
            nightshiftallowance: Number(t.nightshiftallowance),
            pfemployerdeduction: Number(t.pfemployerdeduction),
            esiemployerdeduction: Number(t.esiemployerdeduction),
            finalsalary: Number(t.finalsalary),
            finalsalarypenalty: Number(t.finalsalarypenalty),
            finalvalue: Number(t.finalvalue),
            finalvaluepenalty: Number(t.finalvaluepenalty),
            ctc: Number(t.ctc),
            actualdeduction: Number(t.actualdeduction),
            minimumdeduction: Number(t.minimumdeduction),
            salarytype: t.salarytype,
            deductiontype: t.deductiontype,
          };
        } else if (t.salarytypefinal === "Fixed Salary") {
          return {
            ...commonFields,
            "Other Deduction": Number(t.otherdeduction),
            "Fixed Loss Deduction": Number(t.fixedlossdeduction),
            finalbasic: Number(t.fixedbasic),
            finalhra: Number(t.fixedhra),
            finalconveyance: Number(t.fixedconveyance),
            finalmedicalallowance: Number(t.fixedmedicalallowance),
            finalproductionallowance: Number(t.fixedproductionallowance),
            finalotherallowance: Number(t.fixedotherallowance),
            finalnetsalary: Number(t.fixednetsalaryone),
            pfdays: Number(t.pfdays),

            pfdeduction: Number(t.fixedemppf),
            esideduction: Number(t.fixedempesi),
            paysliplop: Number(t.fixedlop),
            professionaltax: Number(t.fixedempptax),
            totaldeductions: Number(t.fixedtotaldeductions),
            noallowancepoint: Number(t.noallowancepoint),
            nightshiftallowance: Number(t.nightshiftallowance),
            pfemployerdeduction: Number(t.pfemployerdeduction),
            esiemployerdeduction: Number(t.esiemployerdeduction),
            finalsalary: Number(t.fixedsalary),
            finalsalarypenalty: Number(t.fixedsalarypenalty),
            finalvalue: Number(t.fixedfinalvalue),
            finalvaluepenalty: Number(t.fixedfinalvalue),
            ctc: Number(t.fixedctc),
            actualdeduction: Number(t.fixedactualdeduction),
            minimumdeduction: Number(t.fixedminimumdeduction),
            salarytype: t.salarytype,
            deductiontype: t.deductiontype,
          };
        } else {
          return {
            ...commonFields,
            prodlossdeduction: Number(t.prodlossdeduction),
            finalbasic: Number(t.prodbasicp),
            finalhra: Number(t.prodhrap),
            finalconveyance: Number(t.prodconveyancep),
            finalmedicalallowance: Number(t.prodmedicalallowancep),
            finalproductionallowance: Number(t.prodproductionallowancep),
            finalotherallowance: Number(t.prodotherallowancep),
            finalnetsalary: Number(t.prodnetsalaryonep),
            pfdays: Number(t.pfdays),

            pfdeduction: Number(t.prodemppf),
            esideduction: Number(t.prodempesi),
            paysliplop: Number(t.prodlop),
            professionaltax: Number(t.prodempptax),
            totaldeductions: Number(t.prodtotaldeductions),
            noallowancepoint: Number(t.noallowancepoint),
            nightshiftallowance: Number(t.nightshiftallowance),
            pfemployerdeduction: Number(t.pfemployerdeduction),
            esiemployerdeduction: Number(t.esiemployerdeduction),
            finalsalary: Number(t.prodsalary),
            finalsalarypenalty: Number(t.prodsalarypenalty),
            finalvalue: Number(t.prodfinalvalue),
            finalvaluepenalty: Number(0),
            ctc: Number(t.prodctc),
            actualdeduction: Number(t.prodactualdeduction),
            minimumdeduction: Number(t.prodminimumdeduction),
            salarytype: t.salarytype,
            deductiontype: t.deductiontype,
          };
        }
      });
      setUserPayslip(finaldownloadData);
      setLoaderPayslip(false);
    } catch (err) {
      console.log(err);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
    // let excelData = finaldownloadData.map((d, index) => ({ ...d, Sno: index + 1 }));
  };

  useEffect(() => {
    handleFetchPaySlipDetails();
  }, []);

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    // { field: "department", headerName: "Department", flex: 0, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "month", headerName: "Month", flex: 0, hide: !columnVisibility.month, width: 110, headerClassName: "bold-header" },
    { field: "year", headerName: "Year", flex: 0, hide: !columnVisibility.year, width: 100, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, hide: !columnVisibility.company, width: 120, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, hide: !columnVisibility.branch, width: 110, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, hide: !columnVisibility.unit, width: 100, headerClassName: "bold-header" },

    { field: "empcode", headerName: "Emp Code", flex: 0, hide: !columnVisibility.empcode, width: 130, headerClassName: "bold-header" },
    { field: "companyname", headerName: "Employee Name", flex: 0, hide: !columnVisibility.companyname, width: 250, headerClassName: "bold-header" },
    { field: "legalname", headerName: "Aadhar Name", flex: 0, hide: !columnVisibility.legalname, width: 250, headerClassName: "bold-header" },

    { field: "designation", headerName: "Designation", flex: 0, hide: !columnVisibility.designation, headerClassName: "bold-header" },

    { field: "team", headerName: "Team", flex: 0, hide: !columnVisibility.team, width: 100, headerClassName: "bold-header" },
    { field: "doj", headerName: "DOJ", flex: 0, hide: !columnVisibility.doj, width: 110, headerClassName: "bold-header" },

    { field: "bankname", headerName: "Bank Name", flex: 0, hide: !columnVisibility.bankname, headerClassName: "bold-header" },
    { field: "accountholdername", headerName: "Account Name", flex: 0, hide: !columnVisibility.accountholdername, headerClassName: "bold-header" },
    { field: "accountnumber", headerName: "Bank Account No", flex: 0, hide: !columnVisibility.accountnumber, headerClassName: "bold-header" },
    { field: "ifsccode", headerName: "IFSC Code", flex: 0, hide: !columnVisibility.ifsccode, headerClassName: "bold-header" },

    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, hide: !columnVisibility.totalnumberofdays, headerClassName: "bold-header" },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, hide: !columnVisibility.clsl, headerClassName: "bold-header" },
    { field: "totalasbleave", headerName: "Total Absent/Leave Shift", flex: 0, hide: !columnVisibility.totalasbleave, headerClassName: "bold-header" },
    { field: "totalpaidDays", headerName: "Total Paid Shift", flex: 0, hide: !columnVisibility.totalpaidDays, headerClassName: "bold-header" },

    { field: "gross", headerName: "New Gross", flex: 0, hide: !columnVisibility.gross, headerClassName: "bold-header" },
    { field: "basic", headerName: "Actual Basic", flex: 0, hide: !columnVisibility.basic, headerClassName: "bold-header" },
    { field: "hra", headerName: "Actual HRA", flex: 0, hide: !columnVisibility.hra, headerClassName: "bold-header" },
    { field: "conveyance", headerName: "Actual Conveyance", flex: 0, hide: !columnVisibility.conveyance, headerClassName: "bold-header" },
    { field: "medicalallowance", headerName: "Actual Medical Allowance", flex: 0, hide: !columnVisibility.medicalallowance, headerClassName: "bold-header" },
    { field: "productionallowance", headerName: "Actual Production Allowance", flex: 0, hide: !columnVisibility.productionallowance, headerClassName: "bold-header" },
    { field: "productionallowancetwo", headerName: "Actual Production Allowance 2", flex: 0, hide: !columnVisibility.productionallowancetwo, headerClassName: "bold-header" },
    { field: "otherallowance", headerName: "Actual Other Allowance", flex: 0, hide: !columnVisibility.otherallowance, headerClassName: "bold-header" },

    { field: "finalbasic", headerName: "Final Basic", flex: 0, hide: !columnVisibility.finalbasic, headerClassName: "bold-header" },
    { field: "finalhra", headerName: "Final HRA", flex: 0, hide: !columnVisibility.finalhra, headerClassName: "bold-header" },
    { field: "finalconveyance", headerName: "Final Conveyance", flex: 0, hide: !columnVisibility.finalconveyance, headerClassName: "bold-header" },
    { field: "finalmedicalallowance", headerName: "Final Medical Allowance", flex: 0, hide: !columnVisibility.finalmedicalallowance, headerClassName: "bold-header" },
    { field: "finalproductionallowance", headerName: "Final Production Allowance", flex: 0, hide: !columnVisibility.finalproductionallowance, headerClassName: "bold-header" },
    { field: "finalotherallowance", headerName: "Final Other Allowance", flex: 0, hide: !columnVisibility.finalotherallowance, headerClassName: "bold-header" },
    { field: "finalnetsalary", headerName: "Final Net Salary", flex: 0, hide: !columnVisibility.finalnetsalary, headerClassName: "bold-header" },

    { field: "pfdeduction", headerName: "PF Deduction", flex: 0, hide: !columnVisibility.pfdeduction, headerClassName: "bold-header" },
    { field: "esideduction", headerName: "ESI Deduction", flex: 0, hide: !columnVisibility.esideduction, headerClassName: "bold-header" },
    { field: "professionaltax", headerName: "Professional Tax", flex: 0, hide: !columnVisibility.professionaltax, headerClassName: "bold-header" },

    { field: "finallopdays", headerName: "Final-LOP ", flex: 0, hide: !columnVisibility.finallopdays, headerClassName: "bold-header" },
    { field: "finalleavededuction", headerName: "Final Leave Deduction", flex: 0, hide: !columnVisibility.finalleavededuction, headerClassName: "bold-header" },

    { field: "totaldeductions", headerName: "Total Deductions", flex: 0, hide: !columnVisibility.totaldeductions, headerClassName: "bold-header" },

    { field: "noallowancepoint", headerName: "No. Allowance Shift", flex: 0, hide: !columnVisibility.noallowancepoint, headerClassName: "bold-header" },

    { field: "nightshiftallowance", headerName: "Night Shift Allowance", flex: 0, hide: !columnVisibility.nightshiftallowance, headerClassName: "bold-header" },

    { field: "finalsalary", headerName: "Final Salary", flex: 0, hide: !columnVisibility.finalsalary, headerClassName: "bold-header" },
    { field: "ctc", headerName: "CTC", flex: 0, hide: !columnVisibility.ctc, headerClassName: "bold-header" },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, hide: !columnVisibility.paidstatus },

    { field: "currentmonthavg", headerName: `Current Month Avg`, flex: 0, hide: !columnVisibility.currentmonthavg },
    { field: "currentmonthattendance", headerName: `Current Month Attendance`, flex: 0, hide: !columnVisibility.currentmonthattendance },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
    };
  });

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      sx={{
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
          {filteredColumns?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <Box>
      <Headtitle title={"Pay Slip"} />
      <Typography sx={userStyle.HeaderText}>
        PaySlip
        <Typography sx={userStyle.SubHeaderText}></Typography>
      </Typography>

      <Box sx={userStyle.container}>
        {isUserRoleCompare?.includes("lpayslip(last3month)") && (
          <>
            <Box>
              {/* <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("csvpayslip(last3month)") && (
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
                  {isUserRoleCompare?.includes("excelpayslip(last3month)") && (
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
                  {isUserRoleCompare?.includes("printpayslip(last3month)") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpayslip(last3month)") && (
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
                  {isUserRoleCompare?.includes("imagepayslip(last3month)") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Grid>
              </Grid>
              <br /> */}
              {/* added to the pagination grid */}
              <Grid style={userStyle.dataTablestyle}>
                <Box>
                  <label htmlFor="pageSizeSelect">Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={employeesList.length}>All</MenuItem> */}
                  </Select>
                </Box>
                <Box>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={userPayslip}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </Box>
              </Grid>
              {/* ****** Table Grid Container ****** */}
              <Grid container>
                <Grid md={4} sm={2} xs={1}></Grid>
                <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
              </Grid>
              <br />
              {/* ****** Table start ****** */}
              <Button
                sx={userStyle.buttongrp}
                onClick={() => {
                  handleShowAllColumns();
                  setColumnVisibility(initialColumnVisibility);
                }}
              >
                Show All Columns
              </Button>
              &ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                Manage Columns
              </Button>
              {/* Manage Column */}
              <Popover
                id={ids}
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
              <br />
              <>
                {loaderPayslip ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "350px",
                    }}
                  >
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    {/* <FacebookCircularProgress /> */}
                  </Box>
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
                      getRowId={(params) => params.data.id}
                      getRowNodeId={(data) => data.id}
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                    />
                  </>
                )}
              </>
            </Box>

            <br />
          </>
        )}

        {/* <ExportData
          isFilterOpen={isFilterOpen}
          handleCloseFilterMod={handleCloseFilterMod}
          fileFormat={fileFormat}
          setIsFilterOpen={setIsFilterOpen}
          isPdfFilterOpen={isPdfFilterOpen}
          setIsPdfFilterOpen={setIsPdfFilterOpen}
          handleClosePdfFilterMod={handleClosePdfFilterMod}
          filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
          itemsTwo={items ?? []}
          filename={"Pay Slip"}
          exportColumnNames={exportColumnNames}
          exportRowValues={exportRowValues}
          componentRef={componentRef}
        /> */}

        <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
        {/* SUCCESS */}
        <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      </Box>
    </Box>
  );
}

export default PayslipUser;