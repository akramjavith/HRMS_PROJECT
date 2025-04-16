import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  InputLabel,
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
import { handleApiError } from "../../../components/Errorhandling";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import { FaPlus } from "react-icons/fa";
import { userStyle, colourStyles } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
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
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function TrainingDetails() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [trainingDetails, setTrainingDetails] = useState({
    trainingdetails: "",
    deadlinedate: "",
    date: "",
    time: "",
    status: 'Active',
    taskassign: "Individual",
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    duration: "00:00",
    mode: "Please Select Mode",
    company: "Please Select Company",
    branch: "Please Select Branch",
    required: "Please Select Required",
    unit: "Please Select unit",
    team: "Please Select Team",
    frequency: "Please Select Frequency",
    schedule: "Please Select Schedule",
    type: "Please Select Type",
    isOnlineTest: false,
    testnames: "Please Select Test Name",
    estimation: "Year", estimationtime: "",
    estimationtraining: "Hours", estimationtimetraining: "",
  });
  const [trainingDetailsEdit, setTrainingDetailsEdit] = useState({
    trainingdetails: "", category: "Please Select Category",
    subcategory: "Please Select SubCategory", duration: "00:00", mode: "Please Select Mode",
    company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select unit",
    team: "Please Select Team", frequency: "Please Select Frequency", estimation: "Year", estimationtime: "",
    isOnlineTest: false,
    testnames: "Please Select Test Name",
    estimation: "Year", estimationtime: "",
    estimationtraining: "Hours", estimationtimetraining: "",
  });
  const [trainingDetailsArray, setTrainingDetailsArray] = useState([]);
  const [trainingDetailsArrayEdit, setTrainingDetailsArrayEdit] = useState([]);


  const [ovcategory, setOvcategory] = useState("");
  const [trainingDetailsName, setTrainingDetailsName] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");

  const [btnLoad, setBtnLoad] = useState(false)



  const [frequencyOption, setFrequencyOption] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" }

  ]);


  const [categoryOption, setCategoryOption] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);
  const [filteredSubCategoryEditDoc, setFilteredSubCategoryEditDoc] = useState([]);
  const [subcatgeoryDocuments, setSubcatgeoryDocuments] = useState([]);
  const [subcatgeoryDocumentsEdit, setSubcatgeoryDocumentsEdit] = useState([]);

  const [employeeNameOption, setEmployeeNameOption] = useState([]);
  const [testNamesOption, setTestNamesOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [hoursEdit, setHoursEdit] = useState("Hrs");
  const [minutesEdit, setMinutesEdit] = useState("Mins");
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [employeesNames, setEmployeesNames] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [department, setDepartment] = useState([]);
  let [valueDesignation, setValueDesignation] = useState([]);
  let [valueWeekly, setValueWeekly] = useState("");
  const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
  const [selectedDesignationOptions, setSelectedDesignationOptions] = useState([]);
  const [selectedSubCateOptions, setSelectedSubCateOptions] = useState([]);
  let [valueSubCate, setValueSubCate] = useState([]);
  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [companyOption, setCompanyOption] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueEmployee, setValueEmployee] = useState([]);
  const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState([]);
  const [scheduleGroupingEdit, setScheduleGroupingEdit] = useState([]);

  const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
  const [isTodoEditPage, setIsTodoEditPage] = useState(
    Array(addReqTodoEdit.length).fill(false)
  );
  let [valueDepartment, setValueDepartment] = useState([]);
  const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
  let [valueDepartmentEdit, setValueDepartmentEdit] = useState([]);

  let [valueWeeklyEdit, setValueWeeklyEdit] = useState("");
  const [selectedWeeklyOptionsEdit, setSelectedWeeklyOptionsEdit] = useState([]);
  let [valueDesignationEdit, setValueDesignationEdit] = useState("");
  const [selectedDesignationOptionsEdit, setSelectedDesignationOptionsEdit] = useState([]);
  const [selectedDepartmentOptionsEdit, setSelectedDepartmentOptionsEdit] = useState([]);
  //company multiselect

  const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
  let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);





  const [branchOptionEdit, setBranchOptionEdit] = useState([]);

  const [unitOptionEdit, setUnitOptionEdit] = useState([]);

  const [teamOptionEdit, setTeamOptionEdit] = useState([]);

  const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
  let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);
  //unit multiselect

  //unit multiselect
  const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
  let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

  //team multiselect


  const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
  let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

  let [valueEmployeeEdit, setValueEmployeeEdit] = useState([]);
  const [selectedEmployeeOptionsEdit, setSelectedEmployeeOptionsEdit] = useState([]);
  const [employeesNamesEdit, setEmployeesNamesEdit] = useState([]);



  //Employee options
  const [selectedEmployeeNameOptionsCate, setSelectedEmployeeNameOptionsCate] = useState([]);




  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((item, index) => ({
          "Sno": index + 1,
          Trainingdetails: item.trainingdetails,
          Status: item.status,
          Duration: item.duration,
          Mode: item.mode,
          Required: item.required,
          Date: item.date,
          Time: item.time,
          Deadlinedate: item.deadlinedate,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Timetodo: item?.timetodo,
          Weekdays: item?.weekdays,
          Monthdate: item.monthdate,
          AnnualMonth: item?.annumonth,
          Duefromdoj: item.duefromdoj,
          Type: item.type,
          Designation: item.designation,
          Department: item.department,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Team: item.team,
          Employeenames: item.employeenames,
          Onlinetest: item.onlinetest,
          Testnames: item.testnames,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          "Sno": index + 1,
          Trainingdetails: item.trainingdetails,
          Status: item.status,
          Duration: item.duration,
          Mode: item.mode,
          Required: item.required,
          Date: item.date,
          Time: item.time,
          Deadlinedate: item.deadlinedate,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Timetodo: item?.timetodo,
          Weekdays: item?.weekdays,
          Monthdate: item.monthdate,
          AnnualMonth: item?.annumonth,
          Duefromdoj: item.duefromdoj,
          Type: item.type,
          Designation: item.designation,
          Department: item.department,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Team: item.team,
          Employeenames: item.employeenames,
          Onlinetest: item.onlinetest,
          Testnames: item.testnames,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(item => ({
        serialNumber: serialNumberCounter++,
        trainingdetails: item.trainingdetails,
        status: item.status,
        duration: item.duration,
        mode: item.mode,
        required: item.required,
        date: item.date,
        time: item.time,
        deadlinedate: item.deadlinedate,
        frequency: item.frequency,
        schedule: item.schedule,
        timetodo: item?.timetodo,
        weekdays: item?.weekdays,
        monthdate: item.monthdate,
        annumonth: item?.annumonth,
        duefromdoj: item.duefromdoj,
        type: item.type,
        designation: item.designation,
        department: item.department,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        employeenames: item.employeenames,
        onlinetest: item.onlinetest,
        testnames: item.testnames,
      })) :
      items?.map(item => ({
        serialNumber: serialNumberCounter++,
        trainingdetails: item.trainingdetails,
        status: item.status,
        duration: item.duration,
        mode: item.mode,
        required: item.required,
        date: item.date,
        time: item.time,
        deadlinedate: item.deadlinedate,
        frequency: item.frequency,
        schedule: item.schedule,
        timetodo: item?.timetodo,
        weekdays: item?.weekdays,
        monthdate: item.monthdate,
        annumonth: item?.annumonth,
        duefromdoj: item.duefromdoj,
        type: item.type,
        designation: item.designation,
        department: item.department,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        employeenames: item.employeenames,
        onlinetest: item.onlinetest,
        testnames: item.testnames,
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Schedule_Training_Details.pdf");
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






  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  const modeOption = [
    { label: "Online", value: "Online" },
    { label: "Offline", value: "Offline" },
  ]

  const { isUserRoleCompare, isUserRoleAccess } = useContext(
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
  const [deleteProcessQueue, setDeleteProcessQueue] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    trainingdetails: true,
    status: true,
    required: true,
    date: true,
    time: true,
    deadlinedate: true,
    duefromdoj: true,
    duration: true,
    mode: true,
    onlinetest: true,
    testnames: true,
    frequency: true,
    schedule: true,
    type: true,
    designation: true,
    department: true,
    timetodo: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employeenames: true,
    weekdays: true,
    annumonth: true,
    monthdate: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);


  const handleDownload = async (data) => {

    const pages = data;
    const numPages = pages.length;
    const pageNumber = 1;

    const goToPrevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
    const goToNextPage = () => setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));

    const handlePageClick = (page) => {
      setPageNumber(page);
    };

    function updatePage() {
      const currentPageContent = pages[pageNumber - 1];
      document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
      document.querySelector('.pdf-content').innerHTML = currentPageContent;
    }

    const doc = new jsPDF();

    // Show the content of the current page
    doc.text(10, 10, pages[pageNumber - 1]);

    // Convert the content to a data URL
    const pdfDataUri = doc.output('datauristring');

    const newTab = window.open();
    newTab.document.write(`
      <html>
        <style>
          body {
            font-family: 'Arial, sans-serif';
            margin: 0;
            padding: 0;
            background-color: #fff;
            color: #000;
          }
          .pdf-viewer {
            display: flex;
            flex-direction: column;
          }
          .pdf-navigation {
            display: flex;
            justify-content: space-between;
            margin: 20px;
            align-items: center;
          }
          button {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border: none;
            cursor: pointer;
          }
          .pdf-content {
            background-color: #fff;
            padding: 20px;
            box-sizing: border-box;
            flex: 1;
          }
          .pdf-thumbnails {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          .pdf-thumbnail {
            cursor: pointer;
            margin: 0 5px;
            font-size: 14px;
            padding: 5px;
          }
        </style>
        <body>
          <div class="pdf-viewer">
            <div class="pdf-navigation">
              <button onclick="goToPrevPage()">Prev</button>
              <span>Page ${pageNumber} of ${numPages}</span>
              <button onclick="goToNextPage()">Next</button>
            </div>
            <div class="pdf-content">
              ${/* Render PDF content directly in the embed tag */ ''}
              <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
            </div>
            <div class="pdf-thumbnails">
              ${pages.map((_, index) => `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1})">${index + 1}</div>`).join('')}
            </div>
          </div>
          <script>
            let pageNumber = ${pageNumber};
            let numPages = ${numPages};
            let pagesData = ${JSON.stringify(pages)};

            function goToPrevPage() {
              if (pageNumber > 1) {
                pageNumber--;
                updatePage();
              }
            }

            function goToNextPage() {
              if (pageNumber < numPages) {
                pageNumber++;
                updatePage();
              }
            }

            function updatePage() {
              document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
              document.querySelector('.pdf-content').innerHTML = pagesData[pageNumber - 1];
            }

            function handlePageClick(page) {
              pageNumber = page;
              updatePage();
            }
            
            // Load initial content
            updatePage();
          </script>
        </body>
      </html>
    `);
  };

  const renderFilePreview = async (file) => {
    const ansd = file.map(async (data) => {
      const response = await fetch(data.preview);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      window.open(link, "_blank");
    })

  };



  const fetchTestNamesOption = async () => {
    try {
      let res_category = await axios.get(SERVICE.ALL_ONLINE_TEST_MASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.onlinetestmasters.map((d) => ({
          ...d,
          label: d.testname + "-" + `(${d.category}-${d.subcategory})`,
          value: d.testname + "-" + `(${d.category}-${d.subcategory})`,
        })),
      ];
      setTestNamesOption(categoryall);
      // setDesignationEdit(categoryall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }











  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [trainingDetailsArray]);


  useEffect(() => {
    fetchProcessQueueAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchProcessQueue();
    fetchTestNamesOption();
  }, []);

  const fetchDesignation = async () => {
    try {
      let res_category = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.designation.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setDesignation(categoryall);
      // setDesignationEdit(categoryall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const fetchDepartments = async () => {
    try {
      let res_category = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.departmentdetails.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];

      setDepartment(categoryall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const handleWeeklyChange = (options) => {
    setValueWeekly(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptions(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
  };



  const handleWeeklyChangeEdit = (options) => {
    setValueWeeklyEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptionsEdit(options);
  };

  const customValueRendererCateEdit = (valueCate, _days) => {
    return valueCate?.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
  };


  //Designation
  const handleDesignationChange = (options) => {
    setValueDesignation(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptions(options, "Designation")
    setSelectedEmployeeOptions([])
    setValueEmployee([])

    setSelectedDesignationOptions(options);
  };

  const customValueRendererDesignation = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
  };
  //Department
  const handleDepartmentChange = (options) => {
    setValueDepartment(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptions(options, "Department")
    setSelectedEmployeeOptions([])
    setValueEmployee([])
    setSelectedDepartmentOptions(options);
  };

  const customValueRendererDepartment = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
  };






  //get all comnpany.
  const fetchCompanyAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOption([
        ...res_location?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    fetchBranchAll(options)
    setSelectedOptionsBranch([])
    setValueBranchCat([])
    setSelectedOptionsUnit([])
    setValueUnitCat([])
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setUnitOption([])
    setTeamOption([])
    setSelectedEmployeeOptions([])
    setEmployeesNames([])
    setValueEmployee([])
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };



  //get all branches.
  const fetchBranchAll = async (companies) => {
    let company = companies?.map(e => e.value)
    try {
      let res_location = await axios.get(SERVICE.BRANCH, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      let branchDrop = res_location?.data?.branch?.filter(data => company?.includes(data.company))
      setBranchOption([
        ...branchDrop?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // sevendays
  const weekdays = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },

  ];
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchUnitAll(options)
    setSelectedOptionsBranch(options);
    setSelectedOptionsUnit([])
    setValueUnitCat([])
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setTeamOption([])
    setSelectedEmployeeOptions([])
    setEmployeesNames([])
    setValueEmployee([])
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };



  //function to fetch unit
  const fetchUnitAll = async (branches) => {
    let branch = branches?.map(e => e.value)
    try {
      let res_unit = await axios.get(`${SERVICE.UNIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let unitDrop = res_unit?.data?.units?.filter(data => branch?.includes(data.branch))
      setUnitOption([
        ...unitDrop?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    fetchTeamAll(options)
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setSelectedEmployeeOptions([])
    setEmployeesNames([])
    setValueEmployee([])
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //function to fetch  team
  const fetchTeamAll = async (unit) => {

    const units = unit?.map(data => data?.value)
    try {
      let res_team = await axios.get(SERVICE.TEAMS, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      const unitDrop = res_team?.data?.teamsdetails?.filter(data => valueCompanyCat?.includes(data.company) && valueBranchCat?.includes(data.branch) && units?.includes(data.unit))
      setTeamOption([
        ...unitDrop?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    fetchEmployeeOptions(options, "Employee")
    setSelectedEmployeeOptions([])
    setValueEmployee([])
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };



  useEffect(() => {
    fetchCompanyAll();
    fetchDesignation();
    fetchDepartments();
  }, [])





  //Designation_Wise_Employees
  const handleEmployeeChange = (options) => {
    setValueEmployee(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOptions(options);
  };

  const customValueRendererEmployee = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
  };



  const fetchEmployeeOptions = async (e, type) => {
    let designation = e?.map(data => data.value);

    try {
      let res_category = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const employeenames =
        type === "Designation" ? res_category?.data?.users?.filter(item => designation?.includes(item.designation))
          : type === "Department" ? res_category?.data?.users?.filter(item => designation?.includes(item.department))
            : type === "Employee" ? res_category?.data?.users?.filter(item => valueCompanyCat?.includes(item.company) &&
              valueBranchCat?.includes(item.branch) &&
              valueUnitCat?.includes(item.unit)
              && designation?.includes(item.team)) : []


      const categoryall = [{ label: "ALL", value: "ALL" },
      ...employeenames?.map((d) => ({
        label: d.companyname,
        value: d.companyname,
      })),
      ];
      setEmployeesNames(categoryall)
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };







  const handleDesignationChangeEdit = (options) => {
    setValueDesignationEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Designation")
    setSelectedEmployeeOptionsEdit([])
    setSelectedDesignationOptionsEdit(options);
  };

  const customValueRendererDesignationEdit = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Designation";
  };


  //Department
  const handleDepartmentChangeEdit = (options) => {
    setValueDepartmentEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Department")
    setSelectedEmployeeOptionsEdit([])
    setValueEmployeeEdit([])
    setSelectedDepartmentOptionsEdit(options);
  };

  const customValueRendererDepartmentEdit = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Department";
  };




  const handleCompanyChangeEdit = (options) => {
    setValueCompanyCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyEdit(options);
    fetchBranchAllEdit(options)
    setSelectedOptionsBranchEdit([])
    setValueBranchCatEdit([])
    setSelectedOptionsUnitEdit([])
    setValueUnitCatEdit([])
    setSelectedOptionsTeamEdit([])
    setValueTeamCatEdit([])
    setUnitOptionEdit([])
    setTeamOptionEdit([])
    setSelectedEmployeeOptionsEdit([])
    setEmployeesNamesEdit([])
    setValueEmployeeEdit([])
  };

  const customValueRendererCompanyEdit = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };



  const fetchBranchAllEdit = async (companies) => {
    let company = companies?.map(e => e.value)
    try {
      let res_location = await axios.get(SERVICE.BRANCH, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      let branchDrop = res_location?.data?.branch?.filter(data => company?.includes(data.company))
      setBranchOptionEdit([
        ...branchDrop?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const handleBranchChangeEdit = (options) => {
    setValueBranchCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchUnitAllEdit(options)
    setSelectedOptionsBranchEdit(options);
    setSelectedOptionsUnitEdit([])
    setValueUnitCatEdit([])
    setSelectedOptionsTeamEdit([])
    setValueTeamCatEdit([])
    setTeamOptionEdit([])
    setSelectedEmployeeOptionsEdit([])
    setEmployeesNamesEdit([])
    setValueEmployeeEdit([])
  };

  const customValueRendererBranchEdit = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //function to fetch unit
  const fetchUnitAllEdit = async (branches) => {
    let branch = branches?.map(e => e.value)
    try {
      let res_unit = await axios.get(`${SERVICE.UNIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let unitDrop = res_unit?.data?.units?.filter(data => branch?.includes(data.branch))
      setUnitOptionEdit([
        ...unitDrop?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const handleUnitChangeEdit = (options) => {
    setValueUnitCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitEdit(options);
    fetchTeamAllEdit(valueCompanyCatEdit, valueBranchCatEdit, options)
    setSelectedOptionsTeamEdit([])
    setValueTeamCatEdit([])
    setSelectedEmployeeOptionsEdit([])
    setEmployeesNamesEdit([])
    setValueEmployeeEdit([])
  };

  const customValueRendererUnitEdit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //function to fetch  team
  const fetchTeamAllEdit = async (company, branch, unit) => {

    const units = unit?.map(data => data?.value)
    try {
      let res_team = await axios.get(SERVICE.TEAMS, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      const unitDrop = res_team?.data?.teamsdetails?.filter(data => company?.includes(data.company) && branch?.includes(data.branch) && units?.includes(data.unit))
      setTeamOptionEdit([
        ...unitDrop?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const handleTeamChangeEdit = (options) => {
    setValueTeamCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamEdit(options);
    fetchEmployeeOptionsEdit(valueCompanyCatEdit, valueBranchCatEdit, valueUnitCatEdit, options, "Employee")
    setSelectedEmployeeOptionsEdit([])
    setValueEmployeeEdit([])
  };

  const customValueRendererTeamEdit = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };


  const fetchEmployeeOptionsEdit = async (company, branch, unit, e, type) => {
    let designation = e?.map(data => data.value);
    try {
      let res_category = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const employeenames =
        type === "Designation" ? res_category?.data?.users?.filter(item => designation?.includes(item.designation))
          : type === "Department" ? res_category?.data?.users?.filter(item => designation?.includes(item.department))
            : type === "Employee" ? res_category?.data?.users?.filter(item => company?.includes(item.company) &&
              branch?.includes(item.branch) &&
              unit?.includes(item.unit)
              && designation?.includes(item.team)) : []


      const categoryall = [{ label: "ALL", value: "ALL" },
      ...employeenames?.map((d) => ({
        label: d.companyname,
        value: d.companyname,
      })),
      ];
      setEmployeesNamesEdit(categoryall)
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //Designation_Wise_Employees
  const handleEmployeeChangeEdit = (options) => {
    setValueEmployeeEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmployeeOptionsEdit(options);
  };

  const customValueRendererEmployeeEdit = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
  };



  useEffect(() => {
    fetchCompany();
    fetchBranch();
    fetchUnit();
    fetchTeam();
    fetchCategory();
    generateHrsOptions();
    generateMinsOptions();
  }, []);


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [upload, setUpload] = useState([]);
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
  };

  const handleFileDelete = (index) => {
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const [uploadEdit, setUploadEdit] = useState([]);
  const handleResumeUploadEdit = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadEdit((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
  };
  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnLoad(false)
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


  const [addReqTodo, setAddReqTodo] = useState([]);
  const [addReqTodoDocument, setAddReqTodoDocument] = useState([]);
  const [addReqTodoDocumentEdit, setAddReqTodoDocumentEdit] = useState([]);
  const [hourTodo, setHourTodo] = useState([]);
  const [minutesTodo, setMinutesTodo] = useState([]);
  const [timeTypeTodo, setTimeTypeTodo] = useState([]);
  const [catgeoryTodo, setCategoryTodo] = useState("Please Select Category");
  const [subcatgeoryTodo, setSubcategoryTodo] = useState("Please Select SubCategory");
  const [subcatgeoryDocumentsTodo, setSubcategoryDocumentsTodo] = useState([]);
  const [catgeoryTodoEdit, setCategoryTodoEdit] = useState("Please Select Category");
  const [subcatgeoryTodoEdit, setSubcategoryTodoEdit] = useState("Please Select SubCategory");
  const [subcatgeoryDocumentsTodoEdit, setSubcategoryDocumentsTodoEdit] = useState([]);

  const [hourTodoEdit, setHourTodoEdit] = useState([]);
  const [minutesTodoEdit, setMinutesTodoEdit] = useState([]);
  const [timeTypeTodoEdit, setTimeTypeTodoEdit] = useState([]);

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editingIndexcheckDocument, setEditingIndexcheckDocument] = useState(-1);
  const [editingIndexcheckDocumentEdit, setEditingIndexcheckDocumentEdit] = useState(-1);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [todoSubmitDocument, setTodoSubmitDocument] = useState(false);
  const [todoSubmitDocumentEdit, setTodoSubmitDocumentEdit] = useState(false);
  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );
  const [isTodoEditDocument, setIsTodoEditDocument] = useState(
    Array(addReqTodoDocument.length).fill(false)
  );
  const [isTodoEditDocumentEdit, setIsTodoEditDocumentEdit] = useState(
    Array(addReqTodoDocumentEdit.length).fill(false)
  );


  //Adding Time Todo
  const addTodo = () => {
    const result = {
      hour: trainingDetails?.hour,
      min: trainingDetails?.min,
      timetype: trainingDetails?.timetype,

    }
    if ((trainingDetails?.hour === "" || trainingDetails?.hour === undefined)
      || (trainingDetails?.min === "" || trainingDetails?.min === undefined) ||
      (trainingDetails?.timetype === "" || trainingDetails?.timetype === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Hour, Minutes and Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodo?.some(data => data?.hour === trainingDetails?.hour && data?.min === trainingDetails?.min && data?.timetype === trainingDetails?.timetype)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodo((prevTodos) => [...prevTodos, result]);
      setIsTodoEdit(Array(addReqTodo.length).fill(false));
      setEditingIndexcheck(-1)
      setTodoSubmit(false)
    }


  };


  //Adding Time Todo
  const addTodoDocument = () => {
    const result = {
      category: trainingDetails.category,
      subcategory: trainingDetails?.subcategory,
      subcatgeoryDocuments: subcatgeoryDocuments,

    }
    if ((trainingDetails?.category === "Please Select Category" || trainingDetails?.category === undefined || trainingDetails?.category === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if ((trainingDetails?.subcategory === "Please Select SubCategory" || trainingDetails?.subcategory === undefined || trainingDetails?.subcategory === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoDocument?.some(data => data?.category === trainingDetails?.category && data?.subcategory === trainingDetails?.subcategory)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodoDocument((prevTodos) => [...prevTodos, result]);
      setIsTodoEditDocument(Array(addReqTodo.length).fill(false));
      setEditingIndexcheckDocument(-1)
      setTodoSubmitDocument(false)
    }


  };
  const handleUpdateTodocheckDocument = () => {
    const newTodoscheck = [...addReqTodoDocument];
    newTodoscheck[editingIndexcheckDocument].category = catgeoryTodo;
    newTodoscheck[editingIndexcheckDocument].subcategory = subcatgeoryTodo;
    newTodoscheck[editingIndexcheckDocument].subcatgeoryDocuments = subcatgeoryDocumentsTodo;

    setAddReqTodoDocument(newTodoscheck);
    setEditingIndexcheckDocument(-1);
    setTodoSubmitDocument(false)

  };

  const handleEditTodocheckDocument = (index) => {
    setEditingIndexcheckDocument(index);
    setCategoryTodo(addReqTodoDocument[index].category);
    setSubcategoryTodo(addReqTodoDocument[index].subcategory);
    fetchSubCategory(addReqTodoDocument[index].category);
    setSubcategoryDocumentsTodo(addReqTodoDocument[index].subcatgeoryDocuments);
    setTodoSubmitDocument(true)
  };

  const deleteTodoDocument = (index) => {
    const updatedTodos = [...addReqTodoDocument];
    updatedTodos.splice(index, 1);
    setAddReqTodoDocument(updatedTodos);
    setEditingIndexcheckDocument(-1)
    setTodoSubmitDocument(false)
  };


  //Adding Time Todo
  const addTodoDocumentEdit = () => {
    const result = {
      category: trainingDetailsEdit.category,
      subcategory: trainingDetailsEdit?.subcategory,
      subcatgeoryDocuments: subcatgeoryDocumentsEdit,

    }
    if ((trainingDetailsEdit?.category === "Please Select Category" || trainingDetailsEdit?.category === undefined || trainingDetailsEdit?.category === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if ((trainingDetailsEdit?.subcategory === "Please Select SubCategory"
      || trainingDetailsEdit?.subcategory === undefined || trainingDetailsEdit?.subcategory === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoDocumentEdit?.some(data => data?.category === trainingDetailsEdit?.category
      && data?.subcategory === trainingDetailsEdit?.subcategory)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodoDocumentEdit((prevTodos) => [...prevTodos, result]);
      setIsTodoEditDocumentEdit(Array(addReqTodo.length).fill(false));
      setEditingIndexcheckDocumentEdit(-1)
      setTodoSubmitDocumentEdit(false)
      setCategoryTodoEdit("Please Select Category")
      setSubcategoryTodoEdit("Please Select SubCategory")
      setSubcategoryDocumentsTodoEdit([])
    }


  };
  const handleUpdateTodocheckDocumentEdit = () => {
    const newTodoscheck = [...addReqTodoDocumentEdit];
    newTodoscheck[editingIndexcheckDocumentEdit].category = catgeoryTodoEdit;
    newTodoscheck[editingIndexcheckDocumentEdit].subcategory = subcatgeoryTodoEdit;
    newTodoscheck[editingIndexcheckDocumentEdit].subcatgeoryDocuments = subcatgeoryDocumentsTodoEdit;

    setAddReqTodoDocumentEdit(newTodoscheck);
    setEditingIndexcheckDocumentEdit(-1);
    setTodoSubmitDocumentEdit(false)
    // setCategoryTodoEdit("Please Select Category")
    // setSubcategoryTodoEdit("Please Select SubCategory")
    // setSubcategoryDocumentsTodoEdit([])

  };

  const handleEditTodocheckDocumentEdit = (index) => {
    setEditingIndexcheckDocumentEdit(index);
    setCategoryTodoEdit(addReqTodoDocumentEdit[index].category);
    setSubcategoryTodoEdit(addReqTodoDocumentEdit[index].subcategory);
    fetchSubCategoryTodoEdit(addReqTodoDocumentEdit[index].category);
    setSubcategoryDocumentsTodoEdit(addReqTodoDocumentEdit[index].subcatgeoryDocuments);
    setTodoSubmitDocumentEdit(true)
  };

  const deleteTodoDocumentEdit = (index) => {
    const updatedTodos = [...addReqTodoDocumentEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoDocumentEdit(updatedTodos);
    setEditingIndexcheckDocumentEdit(-1)
    setTodoSubmitDocumentEdit(false)
  };














  const handleUpdateTodocheck = () => {
    const newTodoscheck = [...addReqTodo];
    newTodoscheck[editingIndexcheck].hour = hourTodo;
    newTodoscheck[editingIndexcheck].min = minutesTodo;
    newTodoscheck[editingIndexcheck].timetype = timeTypeTodo;

    setAddReqTodo(newTodoscheck);
    setEditingIndexcheck(-1);
    setTodoSubmit(false)

  };

  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setHourTodo(addReqTodo[index].hour);
    setMinutesTodo(addReqTodo[index].min);
    setTimeTypeTodo(addReqTodo[index].timetype);
    setTodoSubmit(true)
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...addReqTodo];
    updatedTodos.splice(index, 1);
    setAddReqTodo(updatedTodos);
    setEditingIndexcheck(-1)
    setTodoSubmit(false)
  };



  const addTodoEdit = () => {
    const result = {
      hour: trainingDetailsEdit?.hour,
      min: trainingDetailsEdit?.min,
      timetype: trainingDetailsEdit?.timetype,

    }

    if ((trainingDetailsEdit?.hour === "" || trainingDetailsEdit?.hour === undefined)
      || (trainingDetailsEdit?.min === "" || trainingDetailsEdit?.min === undefined) ||
      (trainingDetailsEdit?.timetype === "" || trainingDetailsEdit?.timetype === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Hour, Minutes and Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoEdit?.some(data => data?.hour === trainingDetailsEdit?.hour
      && data?.min === trainingDetailsEdit?.min && data?.timetype === trainingDetailsEdit?.timetype)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodoEdit((prevTodos) => [...prevTodos, result]);
      setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
      setEditingIndexcheckEdit(-1)
      setTodoSubmitEdit(false)
    }


  };

  const handleUpdateTodocheckEdit = () => {
    const newTodoscheck = [...addReqTodoEdit];
    newTodoscheck[editingIndexcheckEdit].hour = hourTodoEdit;
    newTodoscheck[editingIndexcheckEdit].min = minutesTodoEdit;
    newTodoscheck[editingIndexcheckEdit].timetype = timeTypeTodoEdit;

    setAddReqTodoEdit(newTodoscheck);
    setEditingIndexcheckEdit(-1);
    setTodoSubmitEdit(false)


  };
  const handleEditTodocheckEdit = (index) => {
    setEditingIndexcheckEdit(index);
    setHourTodoEdit(addReqTodoEdit[index].hour);
    setMinutesTodoEdit(addReqTodoEdit[index].min);
    setTimeTypeTodoEdit(addReqTodoEdit[index].timetype);
    setTodoSubmitEdit(true)
  };
  const deleteTodoEdit = (index) => {
    const updatedTodos = [...addReqTodoEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoEdit(updatedTodos);
    setEditingIndexcheckEdit(-1)
    setTodoSubmitEdit(false)
  };


















  const fetchCompany = async () => {
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCompanyOption(companyall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const fetchUnit = async () => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const unitall = [...res_unit.data.units.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ))];

      setUnitOption(unitall);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchBranch = async () => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const branchall = [...res_branch.data.branch.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ))];
      setBranchOption(branchall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchTeam = async () => {
    try {
      let res = await axios.get(SERVICE.TEAMS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const teamall = [...res.data.teamsdetails.map((d) => (
        {
          ...d,
          label: d.teamname,
          value: d.teamname
        }
      ))];
      setTeamOption(teamall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }


  const fetchCategory = async () => {
    try {
      let res = await axios.get(SERVICE.TRAININGCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const catall = [...res.data.trainingcategorys.map((d) => (
        {
          ...d,
          label: d.categoryname,
          value: d.categoryname
        }
      ))];
      setCategoryOption(catall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchSubCategory = async (e) => {
    try {
      let res = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const filteredSub = res.data.trainingsubcategorys?.filter(u =>
        u.category === e).map(u => (
          {
            ...u,
            label: u.subcategoryname,
            value: u.subcategoryname
          }
        ))

      setFilteredSubCategory(filteredSub);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchSubCategoryTodo = async (e) => {
    try {
      let res = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const filteredSub = res.data.trainingsubcategorys?.filter(u =>
        u.category === e).map(u => (
          {
            ...u,
            label: u.subcategoryname,
            value: u.subcategoryname
          }
        ))

      setFilteredSubCategory(filteredSub);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchSubCategoryTodoEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const filteredSub = res.data.trainingsubcategorys?.filter(u =>
        u.category === e).map(u => (
          {
            ...u,
            label: u.subcategoryname,
            value: u.subcategoryname
          }
        ))
      setFilteredSubCategoryEditDoc(filteredSub);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const fetchSubCategoryEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.TRAININGSUBCATEGORY, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const filteredSub = res.data.trainingsubcategorys?.filter(u =>
        u.category === e).map(u => (
          {
            ...u,
            label: u.subcategoryname,
            value: u.subcategoryname
          }
        ))

      setFilteredSubCategoryEdit(filteredSub);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteProcessQueue(res?.data?.strainingdetails);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Alert delete popup
  let proid = deleteProcessQueue._id;
  const delProcess = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_TRAININGDETAILS}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchProcessQueue();
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
  const sendRequest = async (data) => {
    setBtnLoad(true)
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_TRAININGDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        trainingdetails: String(trainingDetails.trainingdetails),
        trainingdocuments: addReqTodoDocument,
        duration: String(trainingDetails.duration),
        status: String(trainingDetails.status),
        taskassign: String(trainingDetails.taskassign),
        mode: String(trainingDetails.mode),
        isOnlineTest: trainingDetails?.isOnlineTest,
        testnames: trainingDetails?.testnames === "Please Select Test Name" ? "" : trainingDetails?.testnames,
        questioncount: trainingDetails?.questioncount,
        typequestion: trainingDetails?.typequestion,
        required: String(trainingDetails.required),
        frequency: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.frequency) : "",
        date: trainingDetails?.required === "Schedule" ? String(trainingDetails.date) : "",
        time: trainingDetails?.required === "Schedule" ? String(trainingDetails.time) : "",
        deadlinedate: trainingDetails?.required === "NonSchedule" ? String(trainingDetails.deadlinedate) : "",
        schedule: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.schedule) : "",
        timetodo: trainingDetails?.schedule === "Time-Based" ? data : [],
        monthdate: ((trainingDetails.frequency === "Monthly" || trainingDetails.frequency === "Date Wise")) ? trainingDetails.monthdate : "",
        weekdays: ((trainingDetails.frequency === "Weekly" || trainingDetails.frequency === "Day Wise")) ? valueWeekly : [],
        annumonth: ((trainingDetails.frequency === "Annually")) ? trainingDetails.annumonth : "",
        annuday: ((trainingDetails.frequency === "Annually")) ? trainingDetails.annuday : "",
        estimation: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? (trainingDetails.estimation) : "",
        estimationtime: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.estimationtime) : "",
        estimationtraining: trainingDetails?.isOnlineTest ? (trainingDetails.estimationtraining) : "",
        estimationtimetraining: trainingDetails?.isOnlineTest ? String(trainingDetails.estimationtimetraining) : "",
        type: String(trainingDetails.type),
        designation: valueDesignation,
        department: valueDepartment,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employeenames: valueEmployee,
        documentslist: subcatgeoryDocuments,
        trainingdetailslog: [{
          trainingdetails: String(trainingDetails.trainingdetails),
          status: String(trainingDetails.status),
          taskassign: String(trainingDetails.taskassign),
          mode: String(trainingDetails.mode),
          duration: String(trainingDetails.duration),
          isOnlineTest: trainingDetails?.isOnlineTest,
          testnames: trainingDetails?.testnames === "Please Select Test Name" ? "" : trainingDetails?.testnames,
          questioncount: trainingDetails?.questioncount,
          typequestion: trainingDetails?.typequestion,
          required: String(trainingDetails.required),
          frequency: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.frequency) : "",
          date: trainingDetails?.required === "Schedule" ? String(trainingDetails.date) : "",
          time: trainingDetails?.required === "Schedule" ? String(trainingDetails.time) : "",
          deadlinedate: trainingDetails?.required === "NonSchedule" ? String(trainingDetails.deadlinedate) : "",
          schedule: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.schedule) : "",
          timetodo: trainingDetails?.schedule === "Time-Based" ? data : [],
          monthdate: ((trainingDetails.frequency === "Monthly" || trainingDetails.frequency === "Date Wise")) ? trainingDetails.monthdate : "",
          weekdays: ((trainingDetails.frequency === "Weekly" || trainingDetails.frequency === "Day Wise")) ? valueWeekly : [],
          annumonth: ((trainingDetails.frequency === "Annually")) ? trainingDetails.annumonth : "",
          annuday: ((trainingDetails.frequency === "Annually")) ? trainingDetails.annuday : "",
          estimation: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? (trainingDetails.estimation) : "",
          estimationtime: !["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) ? String(trainingDetails.estimationtime) : "",
          estimationtraining: trainingDetails?.isOnlineTest ? (trainingDetails.estimationtraining) : "",
          estimationtimetraining: trainingDetails?.isOnlineTest ? String(trainingDetails.estimationtimetraining) : "",
          type: String(trainingDetails.type),
          designation: valueDesignation,
          department: valueDepartment,
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
          team: valueTeamCat,
          employeenames: valueEmployee,
          assigndate: moment(new Date()).format("DD-MM-YYYY hh:mm a"),

        }
        ],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setTrainingDetails(brandCreate.data);
      await fetchProcessQueue();
      setTrainingDetails({
        ...trainingDetails,
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        trainingdetails: "", estimationtime: "",
        isOnlineTest: false,
        testnames: "Please Select Test Name",
        type: "Please Select Type",
        estimationtraining: "Hours",
        estimationtimetraining: "",
      })
      setFilteredSubCategory([])
      setSubcatgeoryDocuments([])
      setAddReqTodoDocument([])
      setCategoryTodo("Please Select Category")
      setSubcategoryTodo("Please Select SubCategory")
      setSubcategoryDocumentsTodo([])
      setAddReqTodo([])
      setSubcatgeoryDocuments([])
      setSelectedEmployeeNameOptionsCate([]);

      setUpload([])
      setEmployeesNames([])
      setSelectedDesignationOptions([])
      setValueDesignation([])
      setValueEmployee([])
      setValueWeekly([])
      setSelectedEmployeeOptions([])
      setSelectedWeeklyOptions([])
      setSelectedEmployeeOptions([])
      setSelectedOptionsCompany([])
      setSelectedOptionsBranch([])
      setSelectedOptionsTeam([])
      setSelectedOptionsUnit([])
      setValueBranchCat([])
      setValueCompanyCat([])
      setValueUnitCat([])
      setValueTeamCat([])
      setBranchOption([])
      setUnitOption([])
      setTeamOption([])
      setValueDesignation([])
      setSelectedDesignationOptions([])
      setBtnLoad(false)
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {setBtnLoad(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const scheduleOption = [{ label: "Time-Based", value: "Time-Based" }, { label: "Any Time", value: "Any Time" }]
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let empopt = selectedEmployeeNameOptionsCate.map((item) => item.value);
    const isNameMatch = trainingDetailsArray?.some(
      (item) => {
        return item.trainingdetails === trainingDetails.trainingdetails
      }
    );






    const seenCombinations = new Set();
    const hasDuplicate = addReqTodo.some((todo) => {
      const combination = `${todo.hour}-${todo.min}-${todo.timetype}`;
      if (seenCombinations.has(combination)) {
        return true; // Duplicate found
      } else {
        seenCombinations.add(combination);
        return false; // No duplicate yet
      }
    });

    if (trainingDetails.trainingdetails === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Training Details"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.duration === "00:00" || trainingDetails.duration.includes("Mins")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.mode === "Please Select Mode") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Mode"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.required === "Please Select Required") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Required"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) && trainingDetails.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails?.required === "Schedule" && (trainingDetails.date === "" || trainingDetails.date === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails?.required === "Schedule" && (trainingDetails.time === "" || trainingDetails.time === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails?.required === "NonSchedule" && (trainingDetails.deadlinedate === "" || trainingDetails.deadlinedate === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Dead Line Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) && trainingDetails.schedule === "Please Select Schedule") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Schedule"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetails.schedule === "Time-Based") && addReqTodo?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add One Data in Time todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetails.schedule === "Time-Based") && todoSubmit === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo and Submit "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetails.frequency === "Monthly" || trainingDetails.frequency === "Date Wise")) && trainingDetails.monthdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Monthly Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetails.frequency === "Weekly" || trainingDetails.frequency === "Day Wise")) && selectedWeeklyOptions?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetails.frequency === "Annually")) && trainingDetails.annumonth === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetails.frequency === "Annually")) && trainingDetails.annuday === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) && (trainingDetails.estimation === "" || trainingDetails.estimationtime === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Due From DOJ"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!["NonSchedule", "Schedule"]?.includes(trainingDetails?.required) && trainingDetails.estimationtime <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter a valid Due From DOJ Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetails?.isOnlineTest === true || trainingDetails?.isOnlineTest === "true") && trainingDetails.testnames === "Please Select Test Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Test Names"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.type === "Please Select Type") {
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
    }
    else if (trainingDetails.type === "Designation" && selectedDesignationOptions?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.type === "Department" && selectedDepartmentOptions?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetails.type === "Employee" && selectedOptionsCompany?.length < 1) {
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
    else if (trainingDetails.type === "Employee" && selectedOptionsBranch?.length < 1) {
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
    }
    else if (trainingDetails.type === "Employee" && selectedOptionsUnit?.length < 1) {
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
    }
    else if (trainingDetails.type === "Employee" && selectedOptionsTeam?.length < 1) {
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
    }
    else if (selectedEmployeeOptions?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Names"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (trainingDetails?.isOnlineTest && trainingDetails?.testnames === "Please Select Test Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Test Names"}
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
            {"Schedule Training Details already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetails.schedule === "Time-Based") && addReqTodo?.length > 0 && hasDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Timing Has Same Values"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoDocument?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add one Training Documents"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (todoSubmitDocument === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo Document and Submit "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      if (trainingDetails?.schedule === "Time-Based") {
        addReqTodo?.map(data => {
          sendRequest(data);
        })
      } else {
        sendRequest()
      }
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setTrainingDetails({
      trainingdetails: "", category: "Please Select Category",
      subcategory: "Please Select SubCategory",
      duration: "00:00",
      mode: "Please Select Mode",
      status: 'Active',
      taskassign: "Individual",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select unit",
      isOnlineTest: false,
      testnames: "Please Select Test Name",
      team: "Please Select Team",
      frequency: "Please Select Frequency",
      schedule: "Please Select Schedule",
      required: "Please Select Required",
      estimation: "Year",
      estimationtime: "",
      estimationtraining: "Hours",
      estimationtimetraining: "",
      type: "Please Select Type",

    });
    setHours("Hrs");
    setMinutes("Mins");
    setAddReqTodo([])
    setSubcatgeoryDocuments([])
    setAddReqTodoDocument([])
    setCategoryTodo("Please Select Category")
    setSubcategoryTodo("Please Select SubCategory")
    setSubcategoryDocumentsTodo([])

    setSelectedEmployeeNameOptionsCate([]);

    setUpload([])
    setValueWeekly([])
    setSelectedWeeklyOptions([])
    setEmployeesNames([])
    setSelectedDesignationOptions([])
    setValueDesignation([])
    setValueEmployee([])
    setSelectedEmployeeOptions([])
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsTeam([])
    setSelectedOptionsUnit([])
    setValueBranchCat([])
    setValueCompanyCat([])
    setValueUnitCat([])
    setValueTeamCat([])
    setBranchOption([])
    setUnitOption([])
    setTeamOption([])
    setFilteredSubCategory([])
    setValueDesignation([])
    setSelectedDesignationOptions([])
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully..!!"}</p>
      </>
    );
    handleClickOpenerr();
  };
  //change form
  const handleChangephonenumber = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setTrainingDetails({ ...trainingDetails, estimationtime: inputValue });
    }
  };
  const handleChangephonenumberEdit = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setTrainingDetailsEdit({ ...trainingDetailsEdit, estimationtime: inputValue });
    }
  };
  const handleEstimationTimeTrainingEdit = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = trainingDetailsEdit?.estimationtraining === "Hours" ? Number(e.target.value) <= 24 ? e.target.value : "" : Number(e.target.value) <= 1 ? e.target.value : "";
    if (regex.test(inputValue) || inputValue === "") {
      setTrainingDetailsEdit({ ...trainingDetailsEdit, estimationtimetraining: inputValue });
    }
  };
  const handleEstimationTimeTraining = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = trainingDetails?.estimationtraining === "Hours" ? Number(e.target.value) <= 24 ? e.target.value : "" : Number(e.target.value) <= 1 ? e.target.value : "";
    if (regex.test(inputValue) || inputValue === "") {
      setTrainingDetails({ ...trainingDetails, estimationtimetraining: inputValue });
    }
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setHours("Hrs");
    setMinutes("Mins");
    setEditingIndexcheckEdit(-1);
    setTodoSubmitEdit(false);
    setAddReqTodoEdit([]);
    setEditingIndexcheckDocumentEdit(-1);
    setTodoSubmitDocumentEdit(false);
    setAddReqTodoDocumentEdit([]);
  };
  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchSubCategoryEdit(res?.data?.strainingdetails?.category)
      getOverallEditSection(res?.data?.strainingdetails?.trainingdetails)
      setOvcategory(res?.data?.strainingdetails?.trainingdetails)
      setAddReqTodoEdit(res?.data?.strainingdetails?.timetodo)
      setAddReqTodoDocumentEdit(res?.data?.strainingdetails?.trainingdocuments)
      setTrainingDetailsName(res?.data?.strainingdetails?.trainingdetails)
      setTrainingDetailsEdit(res?.data?.strainingdetails);
      const [hours, minutes] = res?.data?.strainingdetails?.duration.split(":");
      setHoursEdit(hours);
      setMinutesEdit(minutes);
      setSelectedDesignationOptionsEdit(res?.data?.strainingdetails?.designation?.map((t) => ({
        ...t,
        label: t,
        value: t,
      })))

      setSelectedOptionsCompanyEdit([...res?.data?.strainingdetails?.company.map((t) => ({ ...t, label: t, value: t }))])
      setValueCompanyCatEdit(res?.data?.strainingdetails?.company)

      setSelectedOptionsBranchEdit([...res?.data?.strainingdetails?.branch.map((t) => ({ ...t, label: t, value: t }))])
      setValueBranchCatEdit(res?.data?.strainingdetails?.branch)
      fetchBranchAllEdit([...res?.data?.strainingdetails?.company.map((t) => ({ ...t, label: t, value: t }))])

      setValueUnitCatEdit(res?.data?.strainingdetails?.unit)
      setSelectedOptionsUnitEdit([...res?.data?.strainingdetails?.unit.map((t) => ({ ...t, label: t, value: t }))])
      fetchUnitAllEdit([...res?.data?.strainingdetails?.branch.map((t) => ({ ...t, label: t, value: t }))])
      setValueTeamCatEdit(res?.data?.strainingdetails?.team)
      setSelectedOptionsTeamEdit([...res?.data?.strainingdetails?.team.map((t) => ({ ...t, label: t, value: t }))])
      fetchTeamAllEdit(res?.data?.strainingdetails?.company, res?.data?.strainingdetails?.branch, [...res?.data?.strainingdetails?.unit.map((t) => ({ ...t, label: t, value: t }))])


      setSelectedDesignationOptionsEdit([...res?.data?.strainingdetails?.designation.map((t) => ({ ...t, label: t, value: t }))])
      setValueDesignationEdit(res?.data?.strainingdetails?.designation)

      setSelectedDepartmentOptionsEdit([...res?.data?.strainingdetails?.department.map((t) => ({ ...t, label: t, value: t }))])
      setValueDepartmentEdit(res?.data?.strainingdetails?.department)
      const answerWeek = res?.data?.strainingdetails?.weekdays?.length > 0 ?
        res?.data?.strainingdetails?.weekdays?.map((t) => ({
          ...t,
          label: t,
          value: t,
        })) : []
      setSelectedWeeklyOptionsEdit(answerWeek)
      setValueWeeklyEdit(res?.data?.strainingdetails?.weekdays)
      setSelectedEmployeeOptionsEdit([...res?.data?.strainingdetails?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
      setValueEmployeeEdit(res?.data?.strainingdetails?.employeenames)
      const typeChecking = res?.data?.strainingdetails?.type === "Designation" ? [...res?.data?.strainingdetails?.designation.map((t) => ({ ...t, label: t, value: t }))] :
        res?.data?.strainingdetails?.type === "Department" ? [...res?.data?.strainingdetails?.department.map((t) => ({ ...t, label: t, value: t }))]
          : [...res?.data?.strainingdetails?.team.map((t) => ({ ...t, label: t, value: t }))]
      fetchEmployeeOptionsEdit(res?.data?.strainingdetails?.company, res?.data?.strainingdetails?.branch, res?.data?.strainingdetails?.unit, typeChecking, res?.data?.strainingdetails?.type)

      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....

  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsEdit(res?.data?.strainingdetails);
      setAddReqTodoDocumentEdit(res?.data?.strainingdetails.trainingdocuments)
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsEdit(res?.data?.strainingdetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  let updateby = trainingDetailsEdit.updatedby;
  let addedby = trainingDetailsEdit.addedby;
  let processId = trainingDetailsEdit._id;
  let trainingdesiglog = trainingDetailsEdit.trainingdetailslog;

  //editing the single data...

  //overall edit section for all pages
  const getOverallEditSection = async (cat) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TRAINING_DETAILS_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        details: cat,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`This data is linked in 
          ${res?.data?.tasforuser?.length > 0 ? "Training For User ," : ""}
           whether you want to do changes ..??`);
          } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TRAINING_DETAILS_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        details: ovcategory,
      });
      sendEditRequestOverall(res?.data?.tasforuser);
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendEditRequestOverall = async (taskforuser) => {
    try {
      if (taskforuser.length > 0) {
        let answ = taskforuser.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            trainingdetails: trainingDetailsEdit?.trainingdetails,
          });
        });
      }

   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };






  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_TRAININGDETAILS}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          trainingdetails: String(trainingDetailsEdit.trainingdetails),
          // category: String(trainingDetailsEdit.category),
          // subcategory: String(trainingDetailsEdit.subcategory),
          trainingdocuments: addReqTodoDocumentEdit,
          duration: String(trainingDetailsEdit.duration),
          mode: String(trainingDetailsEdit.mode),
          status: String(trainingDetailsEdit.status),
          taskassign: String(trainingDetailsEdit.taskassign),
          required: String(trainingDetailsEdit.required),
          isOnlineTest: trainingDetailsEdit?.isOnlineTest,
          testnames: trainingDetailsEdit?.testnames === "Please Select Test Name" ? "" : trainingDetailsEdit?.testnames,
          questioncount: trainingDetailsEdit?.questioncount,
          typequestion: trainingDetailsEdit?.typequestion,
          estimationtraining: trainingDetailsEdit?.isOnlineTest ? (trainingDetailsEdit.estimationtraining) : "",
          estimationtimetraining: trainingDetailsEdit?.isOnlineTest ? String(trainingDetailsEdit.estimationtimetraining) : "",
          frequency: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.frequency) : "",
          date: trainingDetailsEdit?.required === "Schedule" ? String(trainingDetailsEdit.date) : "",
          time: trainingDetailsEdit?.required === "Schedule" ? String(trainingDetailsEdit.time) : "",
          deadlinedate: trainingDetailsEdit?.required === "NonSchedule" ? String(trainingDetailsEdit.deadlinedate) : "",
          schedule: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.schedule) : "",
          timetodo: trainingDetailsEdit?.schedule === "Time-Based" ? addReqTodoEdit : [],
          monthdate: ((trainingDetailsEdit.frequency === "Monthly" || trainingDetailsEdit.frequency === "Date Wise")) ? trainingDetailsEdit.monthdate : "",
          weekdays: ((trainingDetailsEdit.frequency === "Weekly" || trainingDetailsEdit.frequency === "Day Wise")) ? valueWeeklyEdit : [],
          annumonth: ((trainingDetailsEdit.frequency === "Annually")) ? trainingDetailsEdit.annumonth : "",
          annuday: ((trainingDetailsEdit.frequency === "Annually")) ? trainingDetailsEdit.annuday : "",
          estimation: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.estimation) : "",
          estimationtime: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.estimationtime) : "",
          type: String(trainingDetailsEdit.type),
          designation: valueDesignationEdit,
          department: valueDepartmentEdit,
          company: valueCompanyCatEdit,
          branch: valueBranchCatEdit,
          unit: valueUnitCatEdit,
          team: valueTeamCatEdit,
          employeenames: valueEmployeeEdit,
          documentslist: subcatgeoryDocumentsEdit,

          trainingdetailslog: [
            ...trainingdesiglog,
            {

              trainingdetails: String(trainingDetailsEdit.trainingdetails),

              trainingdocuments: addReqTodoDocumentEdit,
              duration: String(trainingDetailsEdit.duration),
              mode: String(trainingDetailsEdit.mode),
              status: String(trainingDetailsEdit.status),
              taskassign: String(trainingDetailsEdit.taskassign),
              required: String(trainingDetailsEdit.required),
              isOnlineTest: trainingDetailsEdit?.isOnlineTest,
              testnames: trainingDetailsEdit?.testnames === "Please Select Test Name" ? "" : trainingDetailsEdit?.testnames,
              questioncount: trainingDetailsEdit?.questioncount,
              typequestion: trainingDetailsEdit?.typequestion,
              estimationtraining: trainingDetailsEdit?.isOnlineTest ? (trainingDetailsEdit.estimationtraining) : "",
              estimationtimetraining: trainingDetailsEdit?.isOnlineTest ? String(trainingDetailsEdit.estimationtimetraining) : "",
              frequency: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.frequency) : "",
              date: trainingDetailsEdit?.required === "Schedule" ? String(trainingDetailsEdit.date) : "",
              time: trainingDetailsEdit?.required === "Schedule" ? String(trainingDetailsEdit.time) : "",
              deadlinedate: trainingDetailsEdit?.required === "NonSchedule" ? String(trainingDetailsEdit.deadlinedate) : "",
              schedule: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.schedule) : "",
              timetodo: trainingDetailsEdit?.schedule === "Time-Based" ? addReqTodoEdit : [],
              monthdate: ((trainingDetailsEdit.frequency === "Monthly" || trainingDetailsEdit.frequency === "Date Wise")) ? trainingDetailsEdit.monthdate : "",
              weekdays: ((trainingDetailsEdit.frequency === "Weekly" || trainingDetailsEdit.frequency === "Day Wise")) ? valueWeeklyEdit : [],
              annumonth: ((trainingDetailsEdit.frequency === "Annually")) ? trainingDetailsEdit.annumonth : "",
              annuday: ((trainingDetailsEdit.frequency === "Annually")) ? trainingDetailsEdit.annuday : "",
              estimation: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.estimation) : "",
              estimationtime: !["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) ? String(trainingDetailsEdit.estimationtime) : "",
              type: String(trainingDetailsEdit.type),
              designation: valueDesignationEdit,
              department: valueDepartmentEdit,
              company: valueCompanyCatEdit,
              branch: valueBranchCatEdit,
              unit: valueUnitCatEdit,
              team: valueTeamCatEdit,
              employeenames: valueEmployeeEdit,
              assigndate: moment(new Date()).format("DD-MM-YYYY hh:mm a"),

            }
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
      await fetchProcessQueue();
      await fetchProcessQueueAll();
      await getOverallEditSectionUpdate();
      setAddReqTodoDocumentEdit([])
      setSubcatgeoryDocumentsEdit([])
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
 
    const isNameMatch = trainingDetailsArrayEdit?.some(
      (item) => {
        return item.trainingdetails === trainingDetailsEdit.trainingdetails
      }
    );


    const seenCombinations = new Set();
    const hasDuplicate = addReqTodoEdit.some((todo) => {
      const combination = `${todo.hour}-${todo.min}-${todo.timetype}`;
      if (seenCombinations.has(combination)) {
        return true; // Duplicate found
      } else {
        seenCombinations.add(combination);
        return false; // No duplicate yet
      }
    });



    if (trainingDetailsEdit.trainingdetails === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Training Details"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.duration === "00:00" || trainingDetailsEdit.duration.includes("Mins")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.mode === "Please Select Mode") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Mode"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.required === "Please Select Required") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Required"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) && trainingDetailsEdit.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit?.required === "Schedule" && (trainingDetailsEdit.date === "" || trainingDetailsEdit.date === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit?.required === "Schedule" && (trainingDetailsEdit.time === "" || trainingDetailsEdit.time === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit?.required === "NonSchedule" && (trainingDetailsEdit.deadlinedate === "" || trainingDetailsEdit.deadlinedate === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Dead Line Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) && trainingDetailsEdit.schedule === "Please Select Schedule") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Schedule"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetailsEdit.schedule === "Time-Based") && addReqTodoEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add One Data in Time todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetailsEdit.schedule === "Time-Based") && todoSubmitEdit === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo and Submit "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetailsEdit.frequency === "Monthly")) && trainingDetailsEdit.monthdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Monthly Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetailsEdit.frequency === "Weekly" || trainingDetailsEdit.frequency === "Day Wise")) && selectedWeeklyOptionsEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetailsEdit.frequency === "Annually")) && trainingDetailsEdit.annumonth === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((trainingDetailsEdit.frequency === "Annually")) && trainingDetailsEdit.annuday === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) && (trainingDetailsEdit.estimation === "" || trainingDetailsEdit.estimationtime === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Due From DOJ"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!["NonSchedule", "Schedule"]?.includes(trainingDetailsEdit?.required) && trainingDetailsEdit.estimationtime <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter a valid Due From DOJ Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetailsEdit?.isOnlineTest === true || trainingDetailsEdit?.isOnlineTest === "true") && trainingDetailsEdit.testnames === "Please Select Test Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Test Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.type === "Please Select Type") {
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
    }
    else if (trainingDetailsEdit.type === "Designation" && selectedDesignationOptionsEdit?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.type === "Department" && selectedDepartmentOptionsEdit?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit.type === "Employee" && selectedOptionsCompanyEdit?.length < 1) {
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
    else if (trainingDetailsEdit.type === "Employee" && selectedOptionsBranchEdit?.length < 1) {
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
    }
    else if (trainingDetailsEdit.type === "Employee" && selectedOptionsUnitEdit?.length < 1) {
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
    }
    else if (trainingDetailsEdit.type === "Employee" && selectedOptionsTeamEdit?.length < 1) {
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
    }
    else if (selectedEmployeeOptionsEdit?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Names"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetailsEdit?.isOnlineTest === true || trainingDetailsEdit?.isOnlineTest === "true") && trainingDetailsEdit?.testnames === "Please Select Test Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Test Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoDocumentEdit?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add one Training Documents"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (todoSubmitDocumentEdit === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo Document and Submit "}
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
            {"Schedule Training Details already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((trainingDetailsEdit.schedule === "Time-Based") && addReqTodoEdit?.length > 0 && hasDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Timing Has Same Values"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (trainingDetailsEdit?.trainingdetails != ovcategory && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }

    else {
      sendEditRequest();
    }
  };

  //get all Training Details.
  const fetchProcessQueue = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_TRAININGDETAILS_DOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setTrainingDetailsArray(res_freq?.data?.trainingdetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_TRAININGDETAILS}/${item}`, {
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
      await fetchProcessQueue();
      await fetchProcessQueueAll();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
   } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all Training Details.
  const fetchProcessQueueAll = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_TRAININGDETAILS_DOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsArrayEdit(
        res_freq?.data?.trainingdetails.filter(
          (item) => item._id !== trainingDetailsEdit._id  && item.trainingdetails !== trainingDetailsName
        ));
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Schedule_Training_Details.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Training Details", field: "trainingdetails" },
    { title: "Status", field: "status" },
    { title: "Duration", field: "duration" },
    { title: "Mode", field: "mode" },
    { title: "Required", field: "required" },
    { title: "Date", field: "date" },
    { title: "Time", field: "time" },
    { title: "Dead Line Date", field: "deadlinedate" },
    { title: "Frequency", field: "frequency" },
    { title: "Schedule", field: "schedule" },
    { title: "Time", field: "timetodo" },
    { title: "Days", field: "weekdays" },
    { title: "MonthDate", field: "monthdate" },
    { title: "Annual", field: "annumonth" },
    { title: "Due From DOJ", field: "duefromdoj" },
    { title: "Type", field: "type" },
    { title: "Department", field: "department" },
    { title: "Designation", field: "designation" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Responsible Person", field: "employeenames" },
    { title: "Online Test", field: "onlinetest" },
    { title: "Test Names", field: "testnames" },
  ];

  // Excel
  const fileName = "Schedule_Training_Details";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Schedule_Training_Details",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = trainingDetailsArray?.map((item, index) => ({
      id: item._id,
      serialNumber: index + 1,
      type: item.type,
      duration: item.duration,
      trainingdetails: item.trainingdetails,
      duefromdoj: item.estimationtime + " " + item.estimation,
      mode: item.mode,
      frequency: item.frequency,
      schedule: item.schedule,
      required: item.required,
      date: item.date ? moment(item.date).format("DD-MM-YYYY") : "",
      time: item.time,
      onlinetest: item.isOnlineTest,
      testnames: item.testnames,
      status: item.status,
      deadlinedate: item.deadlinedate ? moment(item.deadlinedate).format("DD-MM-YYYY") : "",
      designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      timetodo: item?.timetodo?.length > 0 ? item?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`).toString() : "",
      weekdays: item?.weekdays?.length > 0 ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
      annumonth: item?.frequency === "Annually" ? `${item?.annumonth} month ${item?.annuday} days` : "",
      monthdate: item?.monthdate,
      department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
      company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
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
      field: "trainingdetails",
      headerName: "Training Details",
      flex: 0,
      width: 180,
      hide: !columnVisibility.trainingdetails,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
    },
    {
      field: "required",
      headerName: "Required",
      flex: 0,
      width: 150,
      hide: !columnVisibility.required,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "deadlinedate",
      headerName: "DeadLine Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.deadlinedate,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 150,
      hide: !columnVisibility.frequency,
      headerClassName: "bold-header",
    },
    {
      field: "schedule",
      headerName: "Schedule",
      flex: 0,
      width: 150,
      hide: !columnVisibility.schedule,
      headerClassName: "bold-header",
    },
    {
      field: "timetodo",
      headerName: "Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.timetodo,
      headerClassName: "bold-header",
    },
    {
      field: "weekdays",
      headerName: "Days",
      flex: 0,
      width: 150,
      hide: !columnVisibility.weekdays,
      headerClassName: "bold-header",
    },
    {
      field: "monthdate",
      headerName: "Month Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.monthdate,
      headerClassName: "bold-header",
    },
    {
      field: "annumonth",
      headerName: "Annual",
      flex: 0,
      width: 150,
      hide: !columnVisibility.annumonth,
      headerClassName: "bold-header",
    },
    {
      field: "duefromdoj",
      headerName: "Due From Doj",
      flex: 0,
      width: 150,
      hide: !columnVisibility.duefromdoj,
      headerClassName: "bold-header",
    },

    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.designation,
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
      field: "employeenames",
      headerName: "Employee Names",
      flex: 0,
      width: 180,
      hide: !columnVisibility.employeenames,
      headerClassName: "bold-header",
    },
    {
      field: "onlinetest",
      headerName: "Online Test",
      flex: 0,
      width: 180,
      hide: !columnVisibility.onlinetest,
      headerClassName: "bold-header",
    },
    {
      field: "testnames",
      headerName: "Test Names",
      flex: 0,
      width: 180,
      hide: !columnVisibility.testnames,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 400,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("etrainingdetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtrainingdetails") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtrainingdetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("itrainingdetails") && (
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
          {isUserRoleCompare?.includes("itrainingdetails") && (
            <Link to={`/training/traininfuserlog/${params.row.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
              <Button variant="contained" ><MenuIcon /></Button>
            </Link>

          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      trainingdetails: item.trainingdetails,
      type: item.type,
      duration: item.duration,
      duefromdoj: item.duefromdoj,
      mode: item.mode,
      required: item.required,
      date: item.date,
      status: item.status,
      onlinetest: item.onlinetest,
      testnames: item.testnames,
      time: item.time,
      deadlinedate: item.deadlinedate,
      frequency: item.frequency,
      schedule: item.schedule,
      designation: item.designation,
      timetodo: item?.timetodo,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      weekdays: item?.weekdays,
      annumonth: item?.annumonth,
      monthdate: item.monthdate,
      team: item.team,
      employeenames: item.employeenames,
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
      <Headtitle title={"SCHEDULE TRAINING DETAILS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Schedule Training Details</Typography>

      <>
        {isUserRoleCompare?.includes("atrainingdetails") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Add Schedule Training Details
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Training Details <b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={trainingDetails.trainingdetails}
                        placeholder="Please Enter Training Details"
                        onChange={(e) => {
                          setTrainingDetails({ ...trainingDetails, trainingdetails: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Typography>
                      Duration<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={hrsOption}
                            placeholder="Hrs"
                            value={{ label: hours, value: hours }}
                            onChange={(e) => {
                              setHours(e.value);
                              setTrainingDetails({ ...trainingDetails, duration: `${e.value}:${minutes}` });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={minsOption}
                            placeholder="Mins"
                            value={{ label: minutes, value: minutes }}
                            onChange={(e) => {
                              setMinutes(e.value);
                              setTrainingDetails({ ...trainingDetails, duration: `${hours}:${e.value}` });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={modeOption}
                        placeholder="Please Select Mode"
                        value={{ label: trainingDetails.mode, value: trainingDetails.mode }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            mode: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={[{ label: "Active", value: "Active" }, { label: "InActive", value: "InActive" }]}

                        value={{ label: trainingDetails.status, value: trainingDetails.status }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            status: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Training Assign
                      </Typography>
                      <Selects
                        options={[{ label: "Individual", value: "Individual" }, { label: "Team", value: "Team" }]}
                        styles={colourStyles}
                        value={{
                          label: trainingDetails.taskassign,
                          value: trainingDetails.taskassign,
                        }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            taskassign: e.value,
                          });

                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Required<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={[{ label: "Mandatory", value: "Mandatory" },
                        { label: "NonSchedule", value: "NonSchedule" }, { label: "Schedule", value: "Schedule" }]}
                        placeholder="Please Select Required"
                        value={{ label: trainingDetails.required, value: trainingDetails.required }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            required: e.value,
                            frequency: "Please Select Frequency",
                            schedule: "Please Select Schedule",
                            monthdate: "",
                            date: "",
                            time: "",
                            deadlinedate: "",
                            annumonth: "",
                            annuday: "",
                          });
                          setSelectedWeeklyOptions([])
                          setValueWeekly([])
                          setAddReqTodo([])
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {!["NonSchedule", "Schedule"].includes(trainingDetails.required) ?

                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Frequency<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={frequencyOption}
                            placeholder="Please Select Frequency"
                            value={{ label: trainingDetails.frequency, value: trainingDetails.frequency }}
                            onChange={(e) => {
                              setTrainingDetails({
                                ...trainingDetails,
                                frequency: e.value,
                                monthdate: "",
                                date: "",
                                annumonth: "",
                                annuday: "",
                              });
                              setSelectedWeeklyOptions([])
                              setValueWeekly([])
                              setAddReqTodo([])
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Schedule<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={scheduleOption}
                            placeholder="Please Select Schedule"
                            value={{ label: trainingDetails.schedule, value: trainingDetails.schedule }}
                            onChange={(e) => {
                              setTrainingDetails({
                                ...trainingDetails,
                                schedule: e.value,
                                monthdate: "",
                                date: "",
                                annumonth: "",
                                annuday: "",
                              });
                              setSelectedWeeklyOptions([])
                              setValueWeekly([])
                              setAddReqTodo([])
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {((trainingDetails.schedule === "Time-Based")) &&
                        <>
                          <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b> Time <b style={{ color: "red" }}>*</b> </b>
                            </InputLabel>
                            <Grid item lg={12} md={12} sm={6} xs={12}>
                              <Grid container >
                                <Grid item xs={4} sm={4} md={4}>
                                  <FormControl size="small" fullWidth>
                                    <Select
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={trainingDetails.hour}
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 200,
                                            width: 80,
                                          },
                                        },
                                      }}
                                      onChange={(e) => { setTrainingDetails({ ...trainingDetails, hour: e.target.value }) }}
                                    >
                                      <MenuItem value={"01"}>01</MenuItem>
                                      <MenuItem value={"02"}>02</MenuItem>
                                      <MenuItem value={"03"}>03</MenuItem>
                                      <MenuItem value={"04"}>04</MenuItem>
                                      <MenuItem value={"05"}>05</MenuItem>
                                      <MenuItem value={"06"}>06</MenuItem>
                                      <MenuItem value={"07"}>07</MenuItem>
                                      <MenuItem value={"08"}>08</MenuItem>
                                      <MenuItem value={"09"}>09</MenuItem>
                                      <MenuItem value={"10"}>10</MenuItem>
                                      <MenuItem value={11}>11</MenuItem>
                                      <MenuItem value={12}>12</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                  <FormControl size="small" fullWidth>
                                    <Select
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={trainingDetails.min}
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 200,
                                            width: 80,
                                          },
                                        },
                                      }}
                                      onChange={(e) => { setTrainingDetails({ ...trainingDetails, min: e.target.value }) }}
                                    >
                                      <MenuItem value={"00"}>00</MenuItem>
                                      <MenuItem value={"01"}>01</MenuItem>
                                      <MenuItem value={"02"}>02</MenuItem>
                                      <MenuItem value={"03"}>03</MenuItem>
                                      <MenuItem value={"04"}>04</MenuItem>
                                      <MenuItem value={"05"}>05</MenuItem>
                                      <MenuItem value={"06"}>06</MenuItem>
                                      <MenuItem value={"07"}>07</MenuItem>
                                      <MenuItem value={"08"}>08</MenuItem>
                                      <MenuItem value={"09"}>09</MenuItem>
                                      <MenuItem value={"10"}>10</MenuItem>
                                      <MenuItem value={11}>11</MenuItem>
                                      <MenuItem value={12}>12</MenuItem>
                                      <MenuItem value={13}>13</MenuItem>
                                      <MenuItem value={14}>14</MenuItem>
                                      <MenuItem value={15}>15</MenuItem>
                                      <MenuItem value={16}>16</MenuItem>
                                      <MenuItem value={17}>17</MenuItem>
                                      <MenuItem value={18}>18</MenuItem>
                                      <MenuItem value={19}>19</MenuItem>
                                      <MenuItem value={20}>20</MenuItem>
                                      <MenuItem value={21}>21</MenuItem>
                                      <MenuItem value={22}>22</MenuItem>
                                      <MenuItem value={23}>23</MenuItem>
                                      <MenuItem value={24}>24</MenuItem>
                                      <MenuItem value={25}>25</MenuItem>
                                      <MenuItem value={26}>26</MenuItem>
                                      <MenuItem value={27}>27</MenuItem>
                                      <MenuItem value={28}>28</MenuItem>
                                      <MenuItem value={29}>29</MenuItem>
                                      <MenuItem value={30}>30</MenuItem>
                                      <MenuItem value={31}>31</MenuItem>
                                      <MenuItem value={32}>32</MenuItem>
                                      <MenuItem value={33}>33</MenuItem>
                                      <MenuItem value={34}>34</MenuItem>
                                      <MenuItem value={35}>35</MenuItem>
                                      <MenuItem value={36}>36</MenuItem>
                                      <MenuItem value={37}>37</MenuItem>
                                      <MenuItem value={38}>38</MenuItem>
                                      <MenuItem value={39}>39</MenuItem>
                                      <MenuItem value={40}>40</MenuItem>
                                      <MenuItem value={41}>41</MenuItem>
                                      <MenuItem value={42}>42</MenuItem>
                                      <MenuItem value={43}>43</MenuItem>
                                      <MenuItem value={44}>44</MenuItem>
                                      <MenuItem value={45}>45</MenuItem>
                                      <MenuItem value={46}>46</MenuItem>
                                      <MenuItem value={47}>47</MenuItem>
                                      <MenuItem value={48}>48</MenuItem>
                                      <MenuItem value={49}>49</MenuItem>
                                      <MenuItem value={50}>50</MenuItem>
                                      <MenuItem value={51}>51</MenuItem>
                                      <MenuItem value={52}>52</MenuItem>
                                      <MenuItem value={53}>53</MenuItem>
                                      <MenuItem value={54}>54</MenuItem>
                                      <MenuItem value={55}>55</MenuItem>
                                      <MenuItem value={56}>56</MenuItem>
                                      <MenuItem value={57}>57</MenuItem>
                                      <MenuItem value={58}>58</MenuItem>
                                      <MenuItem value={59}>59</MenuItem>

                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                  <FormControl size="small" fullWidth>
                                    <Select
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={trainingDetails.timetype}
                                      onChange={(e) => { setTrainingDetails({ ...trainingDetails, timetype: e.target.value }) }}
                                    >
                                      <MenuItem value={"AM"}>AM</MenuItem>
                                      <MenuItem value={"PM"}>PM</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={0.5} xs={12} sm={12}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={addTodo}
                              type="button"
                              sx={{
                                height: "30px",
                                minWidth: "30px",
                                marginTop: "28px",
                                padding: "6px 10px",
                              }}
                            >
                              <FaPlus />
                            </Button>
                          </Grid>
                        </>
                      }
                      {
                        ((trainingDetails.frequency === "Monthly" || trainingDetails.frequency === "Date Wise")) &&
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b> Date<b style={{ color: "red" }}>*</b> </b>
                            </InputLabel>
                            <FormControl fullWidth size="small">
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={trainingDetails.monthdate}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => { setTrainingDetails({ ...trainingDetails, monthdate: e.target.value }) }}
                              >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={13}>13</MenuItem>
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={17}>17</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={19}>19</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={21}>21</MenuItem>
                                <MenuItem value={22}>22</MenuItem>
                                <MenuItem value={23}>23</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={26}>26</MenuItem>
                                <MenuItem value={27}>27</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={29}>29</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={31}>31</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      }
                      {((trainingDetails.frequency === "Weekly" || trainingDetails.frequency === "Day Wise")) &&
                        <>
                          <Grid item lg={3} md={3} sm={12} xs={12} >
                            <InputLabel>
                              {" "}
                              <b> Days <b style={{ color: "red" }}>*</b></b>
                            </InputLabel>
                            <FormControl fullWidth size="small">
                              <MultiSelect size="small"
                                options={weekdays}
                                value={selectedWeeklyOptions}
                                onChange={handleWeeklyChange}
                                valueRenderer={customValueRendererCate}
                                labelledBy="Please Select Days"
                              />
                            </FormControl>
                          </Grid>
                        </>
                      }
                      {((trainingDetails.frequency === "Annually")) &&
                        <>
                          <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b> Month <b style={{ color: "red" }}>*</b> </b>
                            </InputLabel>
                            <FormControl size="small" fullWidth>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={trainingDetails.annumonth}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => { setTrainingDetails({ ...trainingDetails, annumonth: e.target.value }) }}
                              >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                            <InputLabel>
                              {" "}
                              <b> Day <b style={{ color: "red" }}>*</b> </b>
                            </InputLabel>

                            <FormControl size="small" fullWidth>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={trainingDetails.annuday}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => { setTrainingDetails({ ...trainingDetails, annuday: e.target.value }) }}
                              >

                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={13}>13</MenuItem>
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={17}>17</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={19}>19</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={21}>21</MenuItem>
                                <MenuItem value={22}>22</MenuItem>
                                <MenuItem value={23}>23</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={26}>26</MenuItem>
                                <MenuItem value={27}>27</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={29}>29</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={31}>31</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      }
                      <Grid item md={3} xs={12} sm={12}>
                        <Typography>
                          Due From Doj <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Grid container>
                          <Grid item md={6} xs={6} sm={6}>
                            <Select
                              fullWidth
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={trainingDetails.estimation}
                              placeholder="Please Select"
                              onChange={(e) => {
                                setTrainingDetails({
                                  ...trainingDetails,
                                  estimation: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value="" disabled selected>
                                {" "}
                                Please Select
                              </MenuItem>
                              <MenuItem value="Days"> {"Days"} </MenuItem>
                              <MenuItem value="Month"> {"Month"} </MenuItem>
                              <MenuItem value="Year"> {"Year"} </MenuItem>
                            </Select>
                          </Grid>
                          <Grid item md={6} xs={6} sm={6}>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Enter Time"
                                value={trainingDetails.estimationtime}
                                onChange={(e) => handleChangephonenumber(e)}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </> :
                    trainingDetails?.required === "Schedule" ?
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Date<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="Date"
                              value={trainingDetails.date}
                              onChange={(e) => {
                                setTrainingDetails({
                                  ...trainingDetails,
                                  date: e.target.value,
                                });
                              }}

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Time<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="Time"
                              value={trainingDetails.time}
                              onChange={(e) => {
                                setTrainingDetails({
                                  ...trainingDetails,
                                  time: e.target.value,
                                });
                              }}

                            />
                          </FormControl>
                        </Grid>
                      </>
                      : trainingDetails?.required === "NonSchedule" ?
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Deadline Date<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="Date"
                              value={trainingDetails.deadlinedate}
                              onChange={(e) => {
                                setTrainingDetails({
                                  ...trainingDetails,
                                  deadlinedate: e.target.value,
                                });
                              }}

                            />
                          </FormControl>
                        </Grid>
                        : ""
                  }
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                          checked={trainingDetails.isOnlineTest}
                          onChange={(e) => {
                            setTrainingDetails({
                              ...trainingDetails,
                              isOnlineTest: e.target.checked,
                              testnames: "Please Select Test Name",
                              questioncount: "",
                              typequestion: "",
                              estimationtraining: "Hours",
                              estimationtimetraining: "",
                            });
                          }}
                          color="primary"
                        />
                      }
                      label="Online test"
                    />

                  </Grid>
                  {trainingDetails?.isOnlineTest == true &&
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Test Names<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={testNamesOption}
                            placeholder="Please Select Test Name"
                            value={{ label: trainingDetails.testnames, value: trainingDetails.testnames }}
                            onChange={(e) => {
                              setTrainingDetails({
                                ...trainingDetails,
                                testnames: e.value,
                                typequestion: e?.type,
                                questioncount: e?.type === "Manual" ? `${e.countfrom}-${e.countto}` : e.questioncount
                              });

                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  }
                  <Grid item md={9} xs={12} sm={12}>
                    {addReqTodo?.length > 0 && (
                      <ul type="none">
                        {addReqTodo?.map((row, index) => {
                          return (
                            <li key={index}>
                              <Grid container spacing={2}>
                                {
                                  editingIndexcheck === index
                                    // index == 0
                                    ? (
                                      <>
                                        <Grid item lg={3} md={5} sm={12} xs={12}>
                                          <InputLabel>
                                            {" "}
                                            <b> Time <b style={{ color: "red" }}>*</b> </b>
                                          </InputLabel>
                                          <Grid item lg={12} md={12} sm={6} xs={12}>
                                            <Grid container >
                                              <Grid item xs={4} sm={4} md={4}>
                                                <FormControl size="small" fullWidth>
                                                  <Select
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={hourTodo}
                                                    MenuProps={{
                                                      PaperProps: {
                                                        style: {
                                                          maxHeight: 200,
                                                          width: 80,
                                                        },
                                                      },
                                                    }}
                                                    onChange={(e) => {
                                                      setHourTodo(e.target.value)
                                                    }}
                                                  >
                                                    <MenuItem value={"01"}>01</MenuItem>
                                                    <MenuItem value={"02"}>02</MenuItem>
                                                    <MenuItem value={"03"}>03</MenuItem>
                                                    <MenuItem value={"04"}>04</MenuItem>
                                                    <MenuItem value={"05"}>05</MenuItem>
                                                    <MenuItem value={"06"}>06</MenuItem>
                                                    <MenuItem value={"07"}>07</MenuItem>
                                                    <MenuItem value={"08"}>08</MenuItem>
                                                    <MenuItem value={"09"}>09</MenuItem>
                                                    <MenuItem value={"10"}>10</MenuItem>
                                                    <MenuItem value={11}>11</MenuItem>
                                                    <MenuItem value={12}>12</MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                              <Grid item xs={4} sm={4} md={4}>
                                                <FormControl size="small" fullWidth>
                                                  <Select
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={minutesTodo}
                                                    MenuProps={{
                                                      PaperProps: {
                                                        style: {
                                                          maxHeight: 200,
                                                          width: 80,
                                                        },
                                                      },
                                                    }}
                                                    onChange={(e) => {
                                                      setMinutesTodo(e.target.value)
                                                    }} >
                                                    <MenuItem value={"00"}>00</MenuItem>
                                                    <MenuItem value={"01"}>01</MenuItem>
                                                    <MenuItem value={"02"}>02</MenuItem>
                                                    <MenuItem value={"03"}>03</MenuItem>
                                                    <MenuItem value={"04"}>04</MenuItem>
                                                    <MenuItem value={"05"}>05</MenuItem>
                                                    <MenuItem value={"06"}>06</MenuItem>
                                                    <MenuItem value={"07"}>07</MenuItem>
                                                    <MenuItem value={"08"}>08</MenuItem>
                                                    <MenuItem value={"09"}>09</MenuItem>
                                                    <MenuItem value={"10"}>10</MenuItem>
                                                    <MenuItem value={11}>11</MenuItem>
                                                    <MenuItem value={12}>12</MenuItem>
                                                    <MenuItem value={13}>13</MenuItem>
                                                    <MenuItem value={14}>14</MenuItem>
                                                    <MenuItem value={15}>15</MenuItem>
                                                    <MenuItem value={16}>16</MenuItem>
                                                    <MenuItem value={17}>17</MenuItem>
                                                    <MenuItem value={18}>18</MenuItem>
                                                    <MenuItem value={19}>19</MenuItem>
                                                    <MenuItem value={20}>20</MenuItem>
                                                    <MenuItem value={21}>21</MenuItem>
                                                    <MenuItem value={22}>22</MenuItem>
                                                    <MenuItem value={23}>23</MenuItem>
                                                    <MenuItem value={24}>24</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={26}>26</MenuItem>
                                                    <MenuItem value={27}>27</MenuItem>
                                                    <MenuItem value={28}>28</MenuItem>
                                                    <MenuItem value={29}>29</MenuItem>
                                                    <MenuItem value={30}>30</MenuItem>
                                                    <MenuItem value={31}>31</MenuItem>
                                                    <MenuItem value={32}>32</MenuItem>
                                                    <MenuItem value={33}>33</MenuItem>
                                                    <MenuItem value={34}>34</MenuItem>
                                                    <MenuItem value={35}>35</MenuItem>
                                                    <MenuItem value={36}>36</MenuItem>
                                                    <MenuItem value={37}>37</MenuItem>
                                                    <MenuItem value={38}>38</MenuItem>
                                                    <MenuItem value={39}>39</MenuItem>
                                                    <MenuItem value={40}>40</MenuItem>
                                                    <MenuItem value={41}>41</MenuItem>
                                                    <MenuItem value={42}>42</MenuItem>
                                                    <MenuItem value={43}>43</MenuItem>
                                                    <MenuItem value={44}>44</MenuItem>
                                                    <MenuItem value={45}>45</MenuItem>
                                                    <MenuItem value={46}>46</MenuItem>
                                                    <MenuItem value={47}>47</MenuItem>
                                                    <MenuItem value={48}>48</MenuItem>
                                                    <MenuItem value={49}>49</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={51}>51</MenuItem>
                                                    <MenuItem value={52}>52</MenuItem>
                                                    <MenuItem value={53}>53</MenuItem>
                                                    <MenuItem value={54}>54</MenuItem>
                                                    <MenuItem value={55}>55</MenuItem>
                                                    <MenuItem value={56}>56</MenuItem>
                                                    <MenuItem value={57}>57</MenuItem>
                                                    <MenuItem value={58}>58</MenuItem>
                                                    <MenuItem value={59}>59</MenuItem>

                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                              <Grid item xs={4} sm={4} md={4}>
                                                <FormControl size="small" fullWidth>
                                                  <Select
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={timeTypeTodo}
                                                    onChange={(e) => {

                                                      setTimeTypeTodo(e.target.value)
                                                    }} >
                                                    <MenuItem value={"AM"}>AM</MenuItem>
                                                    <MenuItem value={"PM"}>PM</MenuItem>
                                                  </Select>
                                                </FormControl>
                                              </Grid>
                                            </Grid>
                                          </Grid>
                                        </Grid>

                                      </>
                                    ) : (
                                      <>
                                        <Grid item md={1} xs={12} sm={12}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Hour
                                            </Typography>
                                            <OutlinedInput readOnly value={row.hour} />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={1} xs={12} sm={12}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Minutes
                                            </Typography>
                                            <OutlinedInput readOnly value={row.min} />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={1} xs={12} sm={12}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Type
                                            </Typography>
                                            <OutlinedInput readOnly value={row.timetype} />
                                          </FormControl>
                                        </Grid>
                                      </>
                                    )}
                                <Grid item md={1} xs={12} sm={12}>
                                  {editingIndexcheck === index ? (
                                    <Button
                                      variant="contained"
                                      color="success"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "37px",
                                        padding: "6px 10px",
                                      }}
                                      onClick={() => {
                                        if (addReqTodo?.some((data, inde) => data?.hour === hourTodo && data?.min === minutesTodo && data?.timetype === timeTypeTodo && index !== inde)) {
                                          setShowAlert(
                                            <>
                                              <ErrorOutlineOutlinedIcon
                                                sx={{ fontSize: "100px", color: "orange" }}
                                              />
                                              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                                {"Already Time Added"}
                                              </p>
                                            </>
                                          );
                                          handleClickOpenerr();
                                        }
                                        else {
                                          const updatedIsTodoEdit = [...isTodoEdit];
                                          updatedIsTodoEdit[index] = false;
                                          setIsTodoEdit(updatedIsTodoEdit);

                                          handleUpdateTodocheck();
                                        }

                                      }
                                      }
                                    >
                                      <MdOutlineDone
                                        style={{
                                          fontSize: "17px",
                                          fontWeight: "bold",
                                        }}
                                      />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "37px",
                                        padding: "6px 10px",
                                      }}

                                      onClick={() => {
                                        const updatedIsTodoEdit = [...isTodoEdit];
                                        updatedIsTodoEdit[index] = true;
                                        setIsTodoEdit(updatedIsTodoEdit);

                                        setEditingIndexcheck(index);
                                        handleEditTodocheck(index)
                                      }}
                                    >
                                      <FaEdit />
                                    </Button>
                                  )}
                                </Grid>
                                <Grid item md={1} xs={12} sm={12}>
                                  {isTodoEdit[index] ? (
                                    <Button
                                      variant="contained"
                                      color="error"
                                      type="button"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "37px",
                                        padding: "6px 10px",
                                      }}
                                      onClick={() => {
                                        const updatedIsTodoEdit = [...isTodoEdit];
                                        updatedIsTodoEdit[index] = false;
                                        setIsTodoEdit(updatedIsTodoEdit);
                                        setTodoSubmit(false)
                                        setEditingIndexcheck(-1)
                                      }}
                                    >
                                      <AiOutlineClose />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="error"
                                      type="button"
                                      sx={{
                                        height: "30px",
                                        minWidth: "30px",
                                        marginTop: "37px",
                                        padding: "6px 10px",
                                      }}
                                      onClick={() => {
                                        deleteTodo(index);
                                      }}
                                    >
                                      <AiOutlineClose />
                                    </Button>
                                  )}
                                </Grid>
                                <Grid item md={2}></Grid>
                              </Grid>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}></Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={{ fontWeight: "bold" }}>Responsible Person Allocation</Typography>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
                        styles={colourStyles}
                        value={{
                          label: trainingDetails.type,
                          value: trainingDetails.type,
                        }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            type: e.value,
                          });
                          setEmployeesNames([])
                          setSelectedDesignationOptions([])
                          setValueDesignation([])
                          setSelectedDepartmentOptions([])
                          setSelectedDesignationOptions([])
                          setValueEmployee([])
                          setSelectedEmployeeOptions([])
                          setSelectedOptionsCompany([])
                          setSelectedOptionsBranch([])
                          setSelectedOptionsTeam([])
                          setSelectedOptionsUnit([])
                          setValueBranchCat([])
                          setValueCompanyCat([])
                          setValueUnitCat([])
                          setValueTeamCat([])
                          setBranchOption([])
                          setUnitOption([])
                          setTeamOption([])
                          setValueDesignation([])
                          setValueDepartment([])
                        }}
                      />
                    </FormControl>
                  </Grid>



                  {trainingDetails.type === "Designation" ?
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect size="small"
                          options={designation}
                          value={selectedDesignationOptions}
                          onChange={handleDesignationChange}
                          valueRenderer={customValueRendererDesignation}
                          labelledBy="Please Select Designation"
                        />

                      </FormControl>
                    </Grid> :
                    trainingDetails.type === "Department" ?
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Department<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect size="small"
                            options={department}
                            value={selectedDepartmentOptions}
                            onChange={handleDepartmentChange}
                            valueRenderer={customValueRendererDepartment}
                            labelledBy="Please Select Department"
                          />

                        </FormControl>
                      </Grid>

                      :
                      trainingDetails.type === "Employee" ?

                        <>

                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Company <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                options={companyOption}
                                value={selectedOptionsCompany}
                                onChange={(e) => {
                                  handleCompanyChange(e);
                                }}
                                valueRenderer={customValueRendererCompany}
                                labelledBy="Please Select Company"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Branch<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                options={branchOption
                                  ?.filter((u) => valueCompanyCat?.includes(u.company))
                                  .map((u) => ({
                                    ...u,
                                    label: u.name,
                                    value: u.name,
                                  }))}
                                value={selectedOptionsBranch}
                                onChange={(e) => {
                                  handleBranchChange(e);
                                }}
                                valueRenderer={customValueRendererBranch}
                                labelledBy="Please Select Branch"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Unit<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                options={unitOption
                                  ?.filter((u) => valueBranchCat?.includes(u.branch))
                                  .map((u) => ({
                                    ...u,
                                    label: u.name,
                                    value: u.name,
                                  }))}
                                value={selectedOptionsUnit}
                                onChange={(e) => {
                                  handleUnitChange(e);
                                }}
                                valueRenderer={customValueRendererUnit}
                                labelledBy="Please Select Unit"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Team<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                options={teamOption
                                  ?.filter((u) => valueUnitCat?.includes(u.unit))
                                  .map((u) => ({
                                    ...u,
                                    label: u.teamname,
                                    value: u.teamname,
                                  }))}
                                value={selectedOptionsTeam}
                                onChange={(e) => {
                                  handleTeamChange(e);
                                }}
                                valueRenderer={customValueRendererTeam}
                                labelledBy="Please Select Team"
                              />
                            </FormControl>
                          </Grid>
                        </>
                        : ""
                  }
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Names<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect size="small"
                        options={employeesNames}
                        value={selectedEmployeeOptions}
                        onChange={handleEmployeeChange}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />

                    </FormControl>
                  </Grid>
                </>
              </Grid>
              <br />
              <Typography sx={{ fontWeight: "bold" }}>Training Documents</Typography>
              <br />
              <Grid container spacing={2}>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: trainingDetails.category, value: trainingDetails.category }}
                      onChange={(e) => {
                        setTrainingDetails({
                          ...trainingDetails,
                          category: e.value,
                          subcategory: "Please Select SubCategory",
                        });
                        fetchSubCategory(e.value);
                        setSubcatgeoryDocuments([])

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredSubCategory}
                      placeholder="Please Select SubCategory"
                      value={{ label: trainingDetails.subcategory, value: trainingDetails.subcategory }}
                      onChange={(e) => {
                        setTrainingDetails({
                          ...trainingDetails,
                          subcategory: e.value,
                        });

                        setSubcatgeoryDocuments(e.documentslist)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4.5} xs={12} sm={12}>
                  <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
                  {subcatgeoryDocuments?.length > 0 &&
                    subcatgeoryDocuments?.map((data, index) => {
                      return (
                        <Grid container spacing={2}>
                          <Grid item md={5} xs={12} sm={12}>
                            <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                          </Grid>
                          <Grid item md={2} xs={12} sm={12}>
                            {data.files.length < 1 ?
                              <div className="page-pdf">
                                <Button onClick={() => {
                                  handleDownload(data.document);
                                }} className="next-pdf-btn pdf-button">
                                  View
                                </Button>
                              </div> :
                              <Button
                                variant="text"
                                onClick={() => {
                                  renderFilePreview(data.files);
                                }}
                                sx={userStyle.buttonview}
                              >
                                Views
                              </Button>
                            }
                          </Grid>
                        </Grid>
                      )
                    })

                  }
                </Grid>
                <Grid item md={0.5} xs={12} sm={12}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addTodoDocument}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  {addReqTodoDocument?.length > 0 && (
                    <ul type="none">
                      {addReqTodoDocument?.map((row, index) => {
                        return (
                          <li key={index}>
                            <Grid container spacing={2}>
                              {
                                editingIndexcheckDocument === index
                                  // index == 0
                                  ? (
                                    <>
                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            maxMenuHeight={250}
                                            options={categoryOption}
                                            placeholder="Please Select Category"
                                            value={{ label: catgeoryTodo, value: catgeoryTodo }}
                                            onChange={(e) => {
                                              setCategoryTodo(e.value);
                                              setSubcategoryTodo("Please Select SubCategory")
                                              fetchSubCategoryTodo(e.value);
                                              setSubcategoryDocumentsTodo([])

                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            maxMenuHeight={250}
                                            options={filteredSubCategory}
                                            placeholder="Please Select SubCategory"
                                            value={{ label: subcatgeoryTodo, value: subcatgeoryTodo }}
                                            onChange={(e) => {
                                              setSubcategoryTodo(e.value);
                                              setSubcategoryDocumentsTodo(e.documentslist)
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={3.5} xs={12} sm={12}>
                                        <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
                                        {subcatgeoryDocumentsTodo?.length > 0 &&
                                          subcatgeoryDocumentsTodo?.map((data, index) => {
                                            return (
                                              <Grid container spacing={2}>
                                                <Grid item md={5} xs={12} sm={12}>
                                                  <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={12}>
                                                  {data.files.length < 1 ?
                                                    <div className="page-pdf">
                                                      <Button onClick={() => {
                                                        handleDownload(data.document);
                                                      }} className="next-pdf-btn pdf-button">
                                                        View
                                                      </Button>
                                                    </div> :
                                                    <Button
                                                      variant="text"
                                                      onClick={() => {
                                                        renderFilePreview(data.files);
                                                      }}
                                                      sx={userStyle.buttonview}
                                                    >
                                                      Views
                                                    </Button>
                                                  }
                                                </Grid>
                                              </Grid>
                                            )
                                          })

                                        }
                                      </Grid>

                                    </>
                                  ) : (
                                    <>
                                      <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Category
                                          </Typography>
                                          <OutlinedInput readOnly value={row.category} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Subcategory
                                          </Typography>
                                          <OutlinedInput readOnly value={row.subcategory} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            SubCatgeory Documents
                                          </Typography>
                                          {row?.subcatgeoryDocuments?.length > 0 &&
                                            row?.subcatgeoryDocuments?.map((data, index) => {
                                              return (
                                                <Grid container spacing={2}>
                                                  <Grid item md={5} xs={12} sm={12}>
                                                    <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                                  </Grid>
                                                  <Grid item md={2} xs={12} sm={12}>
                                                    {data.files.length < 1 ?
                                                      <div className="page-pdf">
                                                        <Button onClick={() => {
                                                          handleDownload(data.document);
                                                        }} className="next-pdf-btn pdf-button">
                                                          View
                                                        </Button>
                                                      </div> :
                                                      <Button
                                                        variant="text"
                                                        onClick={() => {
                                                          renderFilePreview(data.files);
                                                        }}
                                                        sx={userStyle.buttonview}
                                                      >
                                                        Views
                                                      </Button>
                                                    }
                                                  </Grid>
                                                </Grid>
                                              )
                                            })

                                          }
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )}
                              <Grid item md={1} xs={12} sm={12}>
                                {editingIndexcheckDocument === index ? (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      if (addReqTodoDocument?.some((data, inde) => data?.category === catgeoryTodo && data?.subcategory === subcatgeoryTodo && index !== inde)) {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Already Added"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      } else if (catgeoryTodo === "" || catgeoryTodo === "Please Select Category") {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Please Select Category"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      }
                                      else if (subcatgeoryTodo === "" || subcatgeoryTodo === "Please Select SubCategory") {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Please Select SubCategory"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      }
                                      else {
                                        const updatedIsTodoEdit = [...isTodoEditDocument];
                                        updatedIsTodoEdit[index] = false;
                                        setIsTodoEditDocument(updatedIsTodoEdit);

                                        handleUpdateTodocheckDocument();
                                      }

                                    }
                                    }
                                  >
                                    <MdOutlineDone
                                      style={{
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditDocument];
                                      updatedIsTodoEdit[index] = true;
                                      setIsTodoEditDocument(updatedIsTodoEdit);

                                      setEditingIndexcheckDocument(index);
                                      handleEditTodocheckDocument(index)
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={1} xs={12} sm={12}>
                                {isTodoEditDocument[index] ? (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditDocument];
                                      updatedIsTodoEdit[index] = false;
                                      setIsTodoEditDocument(updatedIsTodoEdit);
                                      setTodoSubmitDocument(false)
                                      setEditingIndexcheckDocument(-1)
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      deleteTodoDocument(index);
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={2}></Grid>
                            </Grid>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Grid>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <LoadingButton
                    loading={btnLoad} variant="contained"
                    onClick={handleSubmit}
                  >
                    {" "}
                    Submit
                  </LoadingButton>
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
          {isUserRoleCompare?.includes("ltrainingdetails") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Schedule Training Details List
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
                      <MenuItem value={trainingDetailsArray?.length}>
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
                    {isUserRoleCompare?.includes("exceltrainingdetails") && (
                      // <>
                      //   <ExportXL csvData={filteredData.map((item, index) => {
                      //     return {
                      //       SerialNumber: item.serialNumber,
                      //       Trainingdetails: item.trainingdetails,
                      //       Status: item.status,
                      //       Duration: item.duration,
                      //       Mode: item.mode,
                      //       Required: item.required,
                      //       Date: item.date,
                      //       Time: item.time,
                      //       Deadlinedate: item.deadlinedate,
                      //       Frequency: item.frequency,
                      //       Schedule: item.schedule,
                      //       Timetodo: item?.timetodo,
                      //       Weekdays: item?.weekdays,
                      //       Monthdate: item.monthdate,
                      //       AnnualMonth: item?.annumonth,
                      //       Duefromdoj: item.duefromdoj,
                      //       Type: item.type,
                      //       Designation: item.designation,
                      //       Department: item.department,
                      //       Company: item.company,
                      //       Branch: item.branch,
                      //       Unit: item.unit,
                      //       Team: item.team,
                      //       Employeenames: item.employeenames,
                      //       Onlinetest: item.onlinetest,
                      //       Testnames: item.testnames,
                      //     };
                      //   })} fileName={fileName} />
                      // </>
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvtrainingdetails") && (
                      // <>
                      //   <ExportCSV csvData={filteredData.map((item, index) => {
                      //     return {
                      //       SerialNumber: item.serialNumber,
                      //       Trainingdetails: item.trainingdetails,
                      //       Duration: item.duration,
                      //       Status: item.status,
                      //       Mode: item.mode,
                      //       Required: item.required,
                      //       Date: item.date,
                      //       Time: item.time,
                      //       Deadlinedate: item.deadlinedate,
                      //       Frequency: item.frequency,
                      //       Schedule: item.schedule,
                      //       Timetodo: item?.timetodo,
                      //       Weekdays: item?.weekdays,
                      //       Monthdate: item.monthdate,
                      //       AnnualMonth: item?.annumonth,
                      //       Duefromdoj: item.duefromdoj,
                      //       Type: item.type,
                      //       Designation: item.designation,
                      //       Department: item.department,
                      //       Company: item.company,
                      //       Branch: item.branch,
                      //       Unit: item.unit,
                      //       Team: item.team,
                      //       Employeenames: item.employeenames,
                      //       Onlinetest: item.onlinetest,
                      //       Testnames: item.testnames,
                      //     };
                      //   })} fileName={fileName} />
                      // </>
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printtrainingdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdftrainingdetails") && (
                      // <>
                      //   <Button
                      //     sx={userStyle.buttongrp}
                      //     onClick={() => downloadPdf()}
                      //   >
                      //     <FaFilePdf />
                      //     &ensp;Export to PDF&ensp;
                      //   </Button>
                      // </>

                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagetrainingdetails") && (
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
              {isUserRoleCompare?.includes("bdtrainingdetails") && (
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
              <TableCell>Training Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Required</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>DeadlineDate</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Date Wise</TableCell>
              <TableCell>Month Date</TableCell>
              <TableCell>Annually</TableCell>
              <TableCell>Due From DOJ</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Employee Names</TableCell>
              <TableCell>OnLine Test</TableCell>
              <TableCell>Test Names</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.trainingdetails}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.mode}</TableCell>
                  <TableCell>{row.required}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.deadlinedate}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>{row.schedule}</TableCell>
                  <TableCell>{row.timetodo}</TableCell>
                  <TableCell>{row?.weekdays}</TableCell>
                  <TableCell>{row?.monthdate}</TableCell>
                  <TableCell>{row?.annumonth}</TableCell>
                  <TableCell>{row?.duefromdoj}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.employeenames}</TableCell>
                  <TableCell>{row.onlinetest}</TableCell>
                  <TableCell>{row.testnames}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
            <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}>
              ok
            </Button>
            <Button
              style={{
                backgroundColor: '#f4f4f4',
                color: '#444',
                boxShadow: 'none',
                borderRadius: '3px',
                padding: '7px 13px',
                border: '1px solid #0000006b',
                '&:hover': {
                  '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                    backgroundColor: '#f4f4f4',
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
              Schedule Training Details Info
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
              View Schedule Training Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Training Details</Typography>
                  <Typography>{trainingDetailsEdit.trainingdetails}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{trainingDetailsEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{trainingDetailsEdit.mode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Status</Typography>
                  <Typography>{trainingDetailsEdit.status}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Required</Typography>
                  <Typography>{trainingDetailsEdit.required}</Typography>
                </FormControl>
              </Grid>

              {trainingDetailsEdit?.required === "Schedule" ?
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Date</Typography>
                      <Typography>{moment(trainingDetailsEdit.date).format("DD-MM-YYYY")}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Time</Typography>
                      <Typography>{trainingDetailsEdit.time}</Typography>
                    </FormControl>
                  </Grid>
                </>
                :
                trainingDetailsEdit?.required === "NonSchedule" ?
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Dead Line Date</Typography>
                        <Typography>{moment(trainingDetailsEdit.deadlinedate).format("DD-MM-YYYY")}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                  :
                  !["NonSchedule", "Schedule"].includes(trainingDetailsEdit.required) ?
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Frequency</Typography>
                          <Typography>{trainingDetailsEdit.frequency}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Schedule</Typography>
                          <Typography>{trainingDetailsEdit.schedule}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        {((trainingDetailsEdit.schedule === "Time-Based")) &&
                          <>
                            <Typography variant="h6">Time</Typography>
                            <Typography>{trainingDetailsEdit?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`)}</Typography>
                          </>
                        }
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        {
                          ((trainingDetailsEdit.frequency === "Monthly" || trainingDetailsEdit.frequency === "Date Wise")) &&
                          <>
                            <Typography variant="h6">Days</Typography>
                            <Typography>{trainingDetailsEdit?.monthdate}</Typography>
                          </>
                        }
                        {((trainingDetailsEdit?.frequency === "Weekly" || trainingDetailsEdit?.frequency === "Day Wise")) &&
                          <>
                            <Typography variant="h6">Days</Typography>
                            <Typography>{trainingDetailsEdit?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t)}</Typography>
                          </>
                        }
                        {((trainingDetailsEdit.frequency === "Annually")) &&
                          <>
                            <Typography variant="h6">Annual</Typography>
                            <Typography>{`${trainingDetailsEdit?.annumonth} month ${trainingDetailsEdit?.annuday} days`}</Typography>
                          </>
                        }
                      </Grid>


                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Due From DOJ</Typography>
                          <Typography>{`${trainingDetailsEdit.estimationtime}  ${trainingDetailsEdit.estimation}`}</Typography>
                        </FormControl>
                      </Grid>



                    </> : ""
              }
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Online Test</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                        checked={trainingDetailsEdit.isOnlineTest}
                        color="primary"
                      />
                    }
                    label="Online test"
                  />
                </FormControl>
              </Grid>

              {(trainingDetailsEdit?.isOnlineTest == "true" || trainingDetailsEdit?.isOnlineTest == true) &&
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Test Names</Typography>
                      <Typography>{trainingDetailsEdit?.testnames}</Typography>
                    </FormControl>
                  </Grid>

                </>}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{trainingDetailsEdit?.type}</Typography>
                </FormControl>
              </Grid>

              {trainingDetailsEdit.type === "Designation" ?
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Designation</Typography>
                    <Typography>{trainingDetailsEdit.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                  </FormControl>
                </Grid> :
                trainingDetailsEdit.type === "Department" ?
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Department</Typography>
                      <Typography>{trainingDetailsEdit.department?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                    </FormControl>
                  </Grid>

                  :
                  trainingDetailsEdit.type === "Employee" ?

                    <>

                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Company</Typography>
                          <Typography>{trainingDetailsEdit.company?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Branch</Typography>
                          <Typography>{trainingDetailsEdit.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Unit</Typography>
                          <Typography>{trainingDetailsEdit.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6"> Team</Typography>
                          <Typography>{trainingDetailsEdit.team?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                        </FormControl>
                      </Grid>
                    </>
                    : ""
              }
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Names</Typography>
                  <Typography>{trainingDetailsEdit.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />

            <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
            <br /> <br />
            {addReqTodoDocumentEdit?.length > 0 &&
              <>                  <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Category</Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography variant="h6">Sub Category</Typography>
                </Grid>
                <Grid item md={5} xs={12} sm={12}>
                  <Typography variant="h6">Training Documents</Typography>
                </Grid>
              </Grid></>}
            {addReqTodoDocumentEdit?.length > 0 &&
              addReqTodoDocumentEdit?.map((row, index) => {
                return (
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>{row?.category}</Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>{row?.subcategory}</Typography>
                    </Grid>
                    <Grid item md={5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        {row?.subcatgeoryDocuments?.length > 0 &&
                          row?.subcatgeoryDocuments?.map((data, index) => {
                            return (
                              <Grid container spacing={2}>
                                <Grid item md={5} xs={12} sm={12}>
                                  <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                  {data.files.length < 1 ?
                                    <div className="page-pdf">
                                      <Button onClick={() => {
                                        handleDownload(data.document);
                                      }} className="next-pdf-btn pdf-button">
                                        View
                                      </Button>
                                    </div> :
                                    <Button
                                      variant="text"
                                      onClick={() => {
                                        renderFilePreview(data.files);
                                      }}
                                      sx={userStyle.buttonview}
                                    >
                                      Views
                                    </Button>
                                  }
                                </Grid>
                              </Grid>
                            )
                          })

                        }
                      </FormControl>
                    </Grid>
                  </Grid>
                )
              })

            }<br />
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
          maxWidth="lg"
          fullWidth={true}
        //   sx={{
        //     overflow: 'visible',
        //     '& .MuiPaper-root': {
        //         overflow: 'visible',
        //     },
        // }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Schedule Training Details
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>

                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Training Details <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={trainingDetailsEdit.trainingdetails}
                      placeholder="Please Enter Training Details"
                      onChange={(e) => {
                        setTrainingDetailsEdit({ ...trainingDetailsEdit, trainingdetails: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hoursEdit, value: hoursEdit }}
                          onChange={(e) => {
                            setHoursEdit(e.value);
                            setTrainingDetailsEdit({ ...trainingDetailsEdit, duration: `${e.value}:${minutesEdit}` });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutesEdit, value: minutesEdit }}
                          onChange={(e) => {
                            setMinutesEdit(e.value);
                            setTrainingDetailsEdit({ ...trainingDetailsEdit, duration: `${hoursEdit}:${e.value}` });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeOption}
                      placeholder="Please Select Mode"
                      value={{ label: trainingDetailsEdit.mode, value: trainingDetailsEdit.mode }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          mode: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={[{ label: "Active", value: "Active" }, { label: "InActive", value: "InActive" }]}
                      value={{ label: trainingDetailsEdit.status, value: trainingDetailsEdit.status }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          status: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Training Assign
                    </Typography>
                    <Selects
                      options={[{ label: "Individual", value: "Individual" }, { label: "Team", value: "Team" }]}
                      styles={colourStyles}
                      value={{
                        label: trainingDetailsEdit.taskassign,
                        value: trainingDetailsEdit.taskassign,
                      }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          taskassign: e.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Required<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={[{ label: "Mandatory", value: "Mandatory" },
                      { label: "NonSchedule", value: "NonSchedule" }, { label: "Schedule", value: "Schedule" }]}
                      placeholder="Please Select Required"
                      value={{ label: trainingDetailsEdit.required, value: trainingDetailsEdit.required }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          required: e.value,
                          frequency: "Please Select Frequency",
                          schedule: "Please Select Schedule",
                          monthdate: "",
                          date: "",
                          time: "",
                          deadlinedate: "",
                          annumonth: "",
                          annuday: "",
                        });
                        setSelectedWeeklyOptionsEdit([])
                        setValueWeeklyEdit([])
                        setAddReqTodoEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                {!["NonSchedule", "Schedule"].includes(trainingDetailsEdit.required) ?
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Frequency<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={frequencyOption}
                          placeholder="Please Select Frequency"
                          value={{ label: trainingDetailsEdit.frequency, value: trainingDetailsEdit.frequency }}
                          onChange={(e) => {
                            setTrainingDetailsEdit({
                              ...trainingDetailsEdit,
                              frequency: e.value,
                              monthdate: "",
                              date: "",
                              annumonth: "",
                              annuday: "",
                            });
                            setSelectedWeeklyOptionsEdit([])
                            setValueWeeklyEdit([])
                            setAddReqTodoEdit([])
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Schedule<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={scheduleOption}
                          placeholder="Please Select Schedule"
                          value={{ label: trainingDetailsEdit.schedule, value: trainingDetailsEdit.schedule }}
                          onChange={(e) => {
                            setTrainingDetailsEdit({
                              ...trainingDetailsEdit,
                              schedule: e.value,
                              monthdate: "",
                              date: "",
                              annumonth: "",
                              annuday: "",
                            });
                            setSelectedWeeklyOptionsEdit([])
                            setValueWeeklyEdit([])
                            setAddReqTodoEdit([])
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {((trainingDetailsEdit.schedule === "Time-Based")) &&
                      <>
                        <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Time <b style={{ color: "red" }}>*</b> </b>
                          </InputLabel>
                          <Grid item lg={12} md={12} sm={6} xs={12}>
                            <Grid container >
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={trainingDetailsEdit.hour}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, hour: e.target.value }) }}
                                  >
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={trainingDetailsEdit.min}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, min: e.target.value }) }}
                                  >
                                    <MenuItem value={"00"}>00</MenuItem>
                                    <MenuItem value={"01"}>01</MenuItem>
                                    <MenuItem value={"02"}>02</MenuItem>
                                    <MenuItem value={"03"}>03</MenuItem>
                                    <MenuItem value={"04"}>04</MenuItem>
                                    <MenuItem value={"05"}>05</MenuItem>
                                    <MenuItem value={"06"}>06</MenuItem>
                                    <MenuItem value={"07"}>07</MenuItem>
                                    <MenuItem value={"08"}>08</MenuItem>
                                    <MenuItem value={"09"}>09</MenuItem>
                                    <MenuItem value={"10"}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={21}>21</MenuItem>
                                    <MenuItem value={22}>22</MenuItem>
                                    <MenuItem value={23}>23</MenuItem>
                                    <MenuItem value={24}>24</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={26}>26</MenuItem>
                                    <MenuItem value={27}>27</MenuItem>
                                    <MenuItem value={28}>28</MenuItem>
                                    <MenuItem value={29}>29</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={31}>31</MenuItem>
                                    <MenuItem value={32}>32</MenuItem>
                                    <MenuItem value={33}>33</MenuItem>
                                    <MenuItem value={34}>34</MenuItem>
                                    <MenuItem value={35}>35</MenuItem>
                                    <MenuItem value={36}>36</MenuItem>
                                    <MenuItem value={37}>37</MenuItem>
                                    <MenuItem value={38}>38</MenuItem>
                                    <MenuItem value={39}>39</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                    <MenuItem value={41}>41</MenuItem>
                                    <MenuItem value={42}>42</MenuItem>
                                    <MenuItem value={43}>43</MenuItem>
                                    <MenuItem value={44}>44</MenuItem>
                                    <MenuItem value={45}>45</MenuItem>
                                    <MenuItem value={46}>46</MenuItem>
                                    <MenuItem value={47}>47</MenuItem>
                                    <MenuItem value={48}>48</MenuItem>
                                    <MenuItem value={49}>49</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={51}>51</MenuItem>
                                    <MenuItem value={52}>52</MenuItem>
                                    <MenuItem value={53}>53</MenuItem>
                                    <MenuItem value={54}>54</MenuItem>
                                    <MenuItem value={55}>55</MenuItem>
                                    <MenuItem value={56}>56</MenuItem>
                                    <MenuItem value={57}>57</MenuItem>
                                    <MenuItem value={58}>58</MenuItem>
                                    <MenuItem value={59}>59</MenuItem>

                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={4} sm={4} md={4}>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={trainingDetailsEdit.timetype}
                                    onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, timetype: e.target.value }) }}
                                  >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>




                        {addReqTodoEdit?.length < 1 && <Grid item md={0.5} xs={12} sm={12}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={addTodoEdit}
                            type="button"
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              marginTop: "28px",
                              padding: "6px 10px",
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </Grid>}
                      </>
                    }
                    {
                      ((trainingDetailsEdit.frequency === "Monthly" || trainingDetailsEdit.frequency === "Date Wise")) &&
                      <>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Date <b style={{ color: "red" }}>*</b></b>
                          </InputLabel>
                          <FormControl fullWidth size="small">
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={trainingDetailsEdit.monthdate}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, monthdate: e.target.value }) }}
                            >
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                              <MenuItem value={13}>13</MenuItem>
                              <MenuItem value={14}>14</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={16}>16</MenuItem>
                              <MenuItem value={17}>17</MenuItem>
                              <MenuItem value={18}>18</MenuItem>
                              <MenuItem value={19}>19</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                              <MenuItem value={21}>21</MenuItem>
                              <MenuItem value={22}>22</MenuItem>
                              <MenuItem value={23}>23</MenuItem>
                              <MenuItem value={24}>24</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={26}>26</MenuItem>
                              <MenuItem value={27}>27</MenuItem>
                              <MenuItem value={28}>28</MenuItem>
                              <MenuItem value={29}>29</MenuItem>
                              <MenuItem value={30}>30</MenuItem>
                              <MenuItem value={31}>31</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    }
                    {((trainingDetailsEdit.frequency === "Weekly" || trainingDetailsEdit.frequency === "Day Wise")) &&
                      <>
                        <Grid item lg={3} md={3} sm={12} xs={12} >
                          <InputLabel>
                            {" "}
                            <b> Days<b style={{ color: "red" }}>*</b> </b>
                          </InputLabel>
                          <FormControl fullWidth size="small">
                            <MultiSelect size="small"
                              options={weekdays}
                              value={selectedWeeklyOptionsEdit}
                              onChange={handleWeeklyChangeEdit}
                              valueRenderer={customValueRendererCateEdit}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                      </>
                    }

                    {((trainingDetailsEdit.frequency === "Annually")) &&
                      <>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Month  <b style={{ color: "red" }}>*</b></b>
                          </InputLabel>
                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={trainingDetailsEdit.annumonth}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, annumonth: e.target.value }) }}
                            >
                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                          <InputLabel>
                            {" "}
                            <b> Day <b style={{ color: "red" }}>*</b> </b>
                          </InputLabel>

                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={trainingDetailsEdit?.annuday}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                    width: 80,
                                  },
                                },
                              }}
                              onChange={(e) => { setTrainingDetailsEdit({ ...trainingDetailsEdit, annuday: e?.target?.value }) }}
                            >

                              <MenuItem value={"01"}>01</MenuItem>
                              <MenuItem value={"02"}>02</MenuItem>
                              <MenuItem value={"03"}>03</MenuItem>
                              <MenuItem value={"04"}>04</MenuItem>
                              <MenuItem value={"05"}>05</MenuItem>
                              <MenuItem value={"06"}>06</MenuItem>
                              <MenuItem value={"07"}>07</MenuItem>
                              <MenuItem value={"08"}>08</MenuItem>
                              <MenuItem value={"09"}>09</MenuItem>
                              <MenuItem value={"10"}>10</MenuItem>
                              <MenuItem value={11}>11</MenuItem>
                              <MenuItem value={12}>12</MenuItem>
                              <MenuItem value={13}>13</MenuItem>
                              <MenuItem value={14}>14</MenuItem>
                              <MenuItem value={15}>15</MenuItem>
                              <MenuItem value={16}>16</MenuItem>
                              <MenuItem value={17}>17</MenuItem>
                              <MenuItem value={18}>18</MenuItem>
                              <MenuItem value={19}>19</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                              <MenuItem value={21}>21</MenuItem>
                              <MenuItem value={22}>22</MenuItem>
                              <MenuItem value={23}>23</MenuItem>
                              <MenuItem value={24}>24</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={26}>26</MenuItem>
                              <MenuItem value={27}>27</MenuItem>
                              <MenuItem value={28}>28</MenuItem>
                              <MenuItem value={29}>29</MenuItem>
                              <MenuItem value={30}>30</MenuItem>
                              <MenuItem value={31}>31</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    }

                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>
                        Due From Doj <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid container>
                        <Grid item md={6} xs={6} sm={6}>
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={trainingDetailsEdit.estimation}
                            placeholder="Please Select"
                            onChange={(e) => {
                              setTrainingDetailsEdit({
                                ...trainingDetailsEdit,
                                estimation: e.target.value,
                              });
                            }}
                            style={{ height: '40px' }}
                          >
                            <MenuItem value="" disabled selected>
                              {" "}
                              Please Select
                            </MenuItem>
                            <MenuItem value="Days"> {"Days"} </MenuItem>
                            <MenuItem value="Month"> {"Month"} </MenuItem>
                            <MenuItem value="Year"> {"Year"} </MenuItem>
                          </Select>
                        </Grid>
                        <Grid item md={6} xs={6} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Enter Time"
                              value={trainingDetailsEdit.estimationtime}
                              onChange={(e) => handleChangephonenumberEdit(e)}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                    </Grid>
                  </>
                  :
                  trainingDetailsEdit?.required === "Schedule" ?
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Date"
                            value={trainingDetailsEdit.date}
                            onChange={(e) => {
                              setTrainingDetailsEdit({
                                ...trainingDetailsEdit,
                                date: e.target.value,
                              });
                            }}

                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Time<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Time"
                            value={trainingDetailsEdit.time}
                            onChange={(e) => {
                              setTrainingDetailsEdit({
                                ...trainingDetailsEdit,
                                time: e.target.value,
                              });
                            }}

                          />
                        </FormControl>
                      </Grid>
                    </>
                    : trainingDetailsEdit?.required === "NonSchedule" ?
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Deadline Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Date"
                            value={trainingDetailsEdit.deadlinedate}
                            onChange={(e) => {
                              setTrainingDetailsEdit({
                                ...trainingDetailsEdit,
                                deadlinedate: e.target.value,
                              });
                            }}

                          />
                        </FormControl>
                      </Grid>
                      : ""
                }





                <Grid item md={12} xs={12} sm={12}>
                  {addReqTodoEdit?.length > 0 && (
                    <ul type="none">
                      {addReqTodoEdit?.map((row, index) => {
                        return (
                          <li key={index}>
                            <Grid container spacing={2}>
                              {
                                editingIndexcheckEdit === index
                                  // index == 0
                                  ? (
                                    <>
                                      <Grid item lg={3} md={5} sm={12} xs={12}>
                                        <InputLabel>
                                          {" "}
                                          <b> Time <b style={{ color: "red" }}>*</b> </b>
                                        </InputLabel>
                                        <Grid item lg={12} md={12} sm={6} xs={12}>
                                          <Grid container >
                                            <Grid item xs={4} sm={4} md={4}>
                                              <FormControl size="small" fullWidth>
                                                <Select
                                                  labelId="demo-select-small"
                                                  id="demo-select-small"
                                                  value={hourTodoEdit}
                                                  MenuProps={{
                                                    PaperProps: {
                                                      style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                      },
                                                    },
                                                  }}
                                                  onChange={(e) => {
                                                    setHourTodoEdit(e.target.value)
                                                  }}
                                                >
                                                  <MenuItem value={"01"}>01</MenuItem>
                                                  <MenuItem value={"02"}>02</MenuItem>
                                                  <MenuItem value={"03"}>03</MenuItem>
                                                  <MenuItem value={"04"}>04</MenuItem>
                                                  <MenuItem value={"05"}>05</MenuItem>
                                                  <MenuItem value={"06"}>06</MenuItem>
                                                  <MenuItem value={"07"}>07</MenuItem>
                                                  <MenuItem value={"08"}>08</MenuItem>
                                                  <MenuItem value={"09"}>09</MenuItem>
                                                  <MenuItem value={"10"}>10</MenuItem>
                                                  <MenuItem value={11}>11</MenuItem>
                                                  <MenuItem value={12}>12</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={4}>
                                              <FormControl size="small" fullWidth>
                                                <Select
                                                  labelId="demo-select-small"
                                                  id="demo-select-small"
                                                  value={minutesTodoEdit}
                                                  MenuProps={{
                                                    PaperProps: {
                                                      style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                      },
                                                    },
                                                  }}
                                                  onChange={(e) => {
                                                    setMinutesTodoEdit(e.target.value)
                                                  }} >
                                                  <MenuItem value={"00"}>00</MenuItem>
                                                  <MenuItem value={"01"}>01</MenuItem>
                                                  <MenuItem value={"02"}>02</MenuItem>
                                                  <MenuItem value={"03"}>03</MenuItem>
                                                  <MenuItem value={"04"}>04</MenuItem>
                                                  <MenuItem value={"05"}>05</MenuItem>
                                                  <MenuItem value={"06"}>06</MenuItem>
                                                  <MenuItem value={"07"}>07</MenuItem>
                                                  <MenuItem value={"08"}>08</MenuItem>
                                                  <MenuItem value={"09"}>09</MenuItem>
                                                  <MenuItem value={"10"}>10</MenuItem>
                                                  <MenuItem value={11}>11</MenuItem>
                                                  <MenuItem value={12}>12</MenuItem>
                                                  <MenuItem value={13}>13</MenuItem>
                                                  <MenuItem value={14}>14</MenuItem>
                                                  <MenuItem value={15}>15</MenuItem>
                                                  <MenuItem value={16}>16</MenuItem>
                                                  <MenuItem value={17}>17</MenuItem>
                                                  <MenuItem value={18}>18</MenuItem>
                                                  <MenuItem value={19}>19</MenuItem>
                                                  <MenuItem value={20}>20</MenuItem>
                                                  <MenuItem value={21}>21</MenuItem>
                                                  <MenuItem value={22}>22</MenuItem>
                                                  <MenuItem value={23}>23</MenuItem>
                                                  <MenuItem value={24}>24</MenuItem>
                                                  <MenuItem value={25}>25</MenuItem>
                                                  <MenuItem value={26}>26</MenuItem>
                                                  <MenuItem value={27}>27</MenuItem>
                                                  <MenuItem value={28}>28</MenuItem>
                                                  <MenuItem value={29}>29</MenuItem>
                                                  <MenuItem value={30}>30</MenuItem>
                                                  <MenuItem value={31}>31</MenuItem>
                                                  <MenuItem value={32}>32</MenuItem>
                                                  <MenuItem value={33}>33</MenuItem>
                                                  <MenuItem value={34}>34</MenuItem>
                                                  <MenuItem value={35}>35</MenuItem>
                                                  <MenuItem value={36}>36</MenuItem>
                                                  <MenuItem value={37}>37</MenuItem>
                                                  <MenuItem value={38}>38</MenuItem>
                                                  <MenuItem value={39}>39</MenuItem>
                                                  <MenuItem value={40}>40</MenuItem>
                                                  <MenuItem value={41}>41</MenuItem>
                                                  <MenuItem value={42}>42</MenuItem>
                                                  <MenuItem value={43}>43</MenuItem>
                                                  <MenuItem value={44}>44</MenuItem>
                                                  <MenuItem value={45}>45</MenuItem>
                                                  <MenuItem value={46}>46</MenuItem>
                                                  <MenuItem value={47}>47</MenuItem>
                                                  <MenuItem value={48}>48</MenuItem>
                                                  <MenuItem value={49}>49</MenuItem>
                                                  <MenuItem value={50}>50</MenuItem>
                                                  <MenuItem value={51}>51</MenuItem>
                                                  <MenuItem value={52}>52</MenuItem>
                                                  <MenuItem value={53}>53</MenuItem>
                                                  <MenuItem value={54}>54</MenuItem>
                                                  <MenuItem value={55}>55</MenuItem>
                                                  <MenuItem value={56}>56</MenuItem>
                                                  <MenuItem value={57}>57</MenuItem>
                                                  <MenuItem value={58}>58</MenuItem>
                                                  <MenuItem value={59}>59</MenuItem>

                                                </Select>
                                              </FormControl>
                                            </Grid>
                                            <Grid item xs={4} sm={4} md={4}>
                                              <FormControl size="small" fullWidth>
                                                <Select
                                                  labelId="demo-select-small"
                                                  id="demo-select-small"
                                                  value={timeTypeTodoEdit}
                                                  onChange={(e) => {

                                                    setTimeTypeTodoEdit(e.target.value)
                                                  }} >
                                                  <MenuItem value={"AM"}>AM</MenuItem>
                                                  <MenuItem value={"PM"}>PM</MenuItem>
                                                </Select>
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>

                                    </>
                                  ) : (
                                    <>
                                      <Grid item md={1} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Hour
                                          </Typography>
                                          <OutlinedInput readOnly value={row.hour} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={1} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Minutes
                                          </Typography>
                                          <OutlinedInput readOnly value={row.min} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={1} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Type
                                          </Typography>
                                          <OutlinedInput readOnly value={row.timetype} />
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )}
                              <Grid item md={1} xs={12} sm={12}>
                                {editingIndexcheckEdit === index ? (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "47px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      if (addReqTodoEdit?.some((data, inde) => data?.hour === hourTodoEdit && data?.min === minutesTodoEdit && data?.timetype === timeTypeTodoEdit && index !== inde)) {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Already Time Added"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      }
                                      else {
                                        const updatedIsTodoEdit = [...isTodoEditPage];
                                        updatedIsTodoEdit[index] = false;
                                        setIsTodoEditPage(updatedIsTodoEdit);
                                        setTodoSubmitEdit(false)
                                        handleUpdateTodocheckEdit();
                                      }

                                    }
                                    }
                                  >
                                    <MdOutlineDone
                                      style={{
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "28px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditPage];
                                      updatedIsTodoEdit[index] = true;
                                      setIsTodoEditPage(updatedIsTodoEdit);
                                      setTodoSubmitEdit(true)
                                      setEditingIndexcheckEdit(index);
                                      handleEditTodocheckEdit(index)
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={1} xs={12} sm={12}>
                                {isTodoEditPage[index] ? (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "47px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditPage];
                                      updatedIsTodoEdit[index] = false;
                                      setIsTodoEditPage(updatedIsTodoEdit);
                                      setTodoSubmitEdit(false)
                                      setEditingIndexcheckEdit(-1);
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "28px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      deleteTodoEdit(index);
                                      setTodoSubmitEdit(false)
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={2}></Grid>
                            </Grid>
                          </li>
                        );
                      })}
                    </ul>
                  )}</Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                        checked={Boolean(trainingDetailsEdit.isOnlineTest)}
                        onChange={(e) => {
                          setTrainingDetailsEdit({
                            ...trainingDetailsEdit,
                            isOnlineTest: e.target.checked,
                            testnames: "Please Select Test Name",
                            questioncount: "",
                            typequestion: "",
                            estimationtraining: "Hours",
                            estimationtimetraining: "",
                          });
                        }}
                        color="primary"
                      />
                    }
                    label="Online test"
                  />

                </Grid>
                {(trainingDetailsEdit?.isOnlineTest == "true" || trainingDetailsEdit?.isOnlineTest == true) &&
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Test Names<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={testNamesOption}
                          placeholder="Please Select Test Name"
                          value={{ label: trainingDetailsEdit.testnames, value: trainingDetailsEdit.testnames }}
                          onChange={(e) => {
                            setTrainingDetailsEdit({
                              ...trainingDetailsEdit,
                              testnames: e.value,
                              questioncount: e?.type === "Manual" ? `${e.countfrom}-${e.countto}` : e.questioncount,
                              typequestion: e?.type,
                            });

                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>}
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={{ fontWeight: "bold" }}>Responsible Person Allocation</Typography>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
                      styles={colourStyles}
                      value={{
                        label: trainingDetailsEdit.type,
                        value: trainingDetailsEdit.type,
                      }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          type: e.value,
                        });
                        setEmployeesNamesEdit([])
                        setValueEmployeeEdit([])
                        setSelectedEmployeeOptionsEdit([])
                        setSelectedDepartmentOptionsEdit([])
                        setValueDepartmentEdit([])
                        setSelectedDesignationOptionsEdit([])
                        setValueDesignationEdit([])

                        setSelectedOptionsCompanyEdit([])
                        setValueCompanyCatEdit([])

                        setSelectedOptionsBranchEdit([])
                        setValueBranchCatEdit([])
                        setBranchOptionEdit([])

                        setSelectedOptionsUnitEdit([])
                        setValueUnitCatEdit([])
                        setUnitOptionEdit([])

                        setSelectedDepartmentOptionsEdit([])
                        setValueDepartmentEdit([])
                        setSelectedEmployeeOptionsEdit([])
                        setSelectedOptionsTeamEdit([])
                        setValueTeamCatEdit([])
                        setTeamOptionEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                {trainingDetailsEdit?.type === "Designation" ?
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect size="small"
                        options={designation}
                        value={selectedDesignationOptionsEdit}
                        onChange={handleDesignationChangeEdit}
                        valueRenderer={customValueRendererDesignationEdit}
                        labelledBy="Please Select Designation"
                      />

                    </FormControl>
                  </Grid> :
                  trainingDetailsEdit?.type === "Department" ?
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect size="small"
                          options={department}
                          value={selectedDepartmentOptionsEdit}
                          onChange={handleDepartmentChangeEdit}
                          valueRenderer={customValueRendererDepartmentEdit}
                          labelledBy="Please Select Department"
                        />

                      </FormControl>
                    </Grid>

                    :
                    trainingDetailsEdit?.type === "Employee" ?

                      <>

                        <Grid item md={4} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Company <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={companyOption}
                              value={selectedOptionsCompanyEdit}
                              onChange={(e) => {
                                handleCompanyChangeEdit(e);
                              }}
                              valueRenderer={customValueRendererCompanyEdit}
                              labelledBy="Please Select Company"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Branch<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={branchOptionEdit}
                              value={selectedOptionsBranchEdit}
                              onChange={(e) => {
                                handleBranchChangeEdit(e);
                              }}
                              valueRenderer={customValueRendererBranchEdit}
                              labelledBy="Please Select Branch"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Unit<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={unitOptionEdit}
                              value={selectedOptionsUnitEdit}
                              onChange={(e) => {
                                handleUnitChangeEdit(e);
                              }}
                              valueRenderer={customValueRendererUnitEdit}
                              labelledBy="Please Select Unit"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Team<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              options={teamOptionEdit}
                              value={selectedOptionsTeamEdit}
                              onChange={(e) => {
                                handleTeamChangeEdit(e);
                              }}
                              valueRenderer={customValueRendererTeamEdit}
                              labelledBy="Please Select Team"
                            />
                          </FormControl>
                        </Grid>
                      </>
                      : ""
                }
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Names<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect size="small"
                      options={employeesNamesEdit}
                      value={selectedEmployeeOptionsEdit}
                      onChange={handleEmployeeChangeEdit}
                      valueRenderer={customValueRendererEmployeeEdit}
                      labelledBy="Please Select Employee"
                    />

                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Typography sx={{ fontWeight: "bold" }}>Training Documents</Typography>
              <br />
              <Grid container spacing={2}>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: trainingDetailsEdit.category, value: trainingDetailsEdit.category }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          category: e.value,
                          subcategory: "Please Select SubCategory",
                        });
                        fetchSubCategoryEdit(e.value);
                        setSubcatgeoryDocumentsEdit([])

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredSubCategoryEdit}
                      placeholder="Please Select SubCategory"
                      value={{ label: trainingDetailsEdit.subcategory, value: trainingDetailsEdit.subcategory }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          subcategory: e.value,
                        });

                        setSubcatgeoryDocumentsEdit(e.documentslist)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4.5} xs={12} sm={12}>
                  <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
                  {subcatgeoryDocumentsEdit?.length > 0 &&
                    subcatgeoryDocumentsEdit?.map((data, index) => {
                      return (
                        <Grid container spacing={2}>
                          <Grid item md={5} xs={12} sm={12}>
                            <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                          </Grid>
                          <Grid item md={2} xs={12} sm={12}>
                            {data.files.length < 1 ?
                              <div className="page-pdf">
                                <Button onClick={() => {
                                  handleDownload(data.document);
                                }} className="next-pdf-btn pdf-button">
                                  View
                                </Button>
                              </div> :
                              <Button
                                variant="text"
                                onClick={() => {
                                  renderFilePreview(data.files);
                                }}
                                sx={userStyle.buttonview}
                              >
                                Views
                              </Button>
                            }
                          </Grid>
                        </Grid>
                      )
                    })

                  }
                </Grid>
                <Grid item md={0.5} xs={12} sm={12}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addTodoDocumentEdit}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  {addReqTodoDocumentEdit?.length > 0 && (
                    <ul type="none">
                      {addReqTodoDocumentEdit?.map((row, index) => {
                        return (
                          <li key={index}>
                            <Grid container spacing={2}>
                              {
                                editingIndexcheckDocumentEdit === index
                                  // index == 0
                                  ? (
                                    <>
                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            maxMenuHeight={250}
                                            options={categoryOption}
                                            placeholder="Please Select Category"
                                            value={{ label: catgeoryTodoEdit, value: catgeoryTodoEdit }}
                                            onChange={(e) => {
                                              setCategoryTodoEdit(e.value);
                                              setSubcategoryTodoEdit("Please Select SubCategory")
                                              fetchSubCategoryTodoEdit(e.value);
                                              setSubcategoryDocumentsTodoEdit([])

                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            maxMenuHeight={250}
                                            options={filteredSubCategoryEditDoc}
                                            placeholder="Please Select SubCategory"
                                            value={{ label: subcatgeoryTodoEdit, value: subcatgeoryTodoEdit }}
                                            onChange={(e) => {
                                              setSubcategoryTodoEdit(e.value);
                                              setSubcategoryDocumentsTodoEdit(e.documentslist)
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={3.5} xs={12} sm={12}>
                                        <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
                                        {subcatgeoryDocumentsTodoEdit?.length > 0 &&
                                          subcatgeoryDocumentsTodoEdit?.map((data, index) => {
                                            return (
                                              <Grid container spacing={2}>
                                                <Grid item md={5} xs={12} sm={12}>
                                                  <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                                </Grid>
                                                <Grid item md={2} xs={12} sm={12}>
                                                  {data.files.length < 1 ?
                                                    <div className="page-pdf">
                                                      <Button onClick={() => {
                                                        handleDownload(data.document);
                                                      }} className="next-pdf-btn pdf-button">
                                                        View
                                                      </Button>
                                                    </div> :
                                                    <Button
                                                      variant="text"
                                                      onClick={() => {
                                                        renderFilePreview(data.files);
                                                      }}
                                                      sx={userStyle.buttonview}
                                                    >
                                                      Views
                                                    </Button>
                                                  }
                                                </Grid>
                                              </Grid>
                                            )
                                          })

                                        }
                                      </Grid>

                                    </>
                                  ) : (
                                    <>
                                      <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Category
                                          </Typography>
                                          <OutlinedInput readOnly value={row.category} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={2} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Subcategory
                                          </Typography>
                                          <OutlinedInput readOnly value={row.subcategory} />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            SubCatgeory Documents
                                          </Typography>
                                          {row?.subcatgeoryDocuments?.length > 0 &&
                                            row?.subcatgeoryDocuments?.map((data, index) => {
                                              return (
                                                <Grid container spacing={2}>
                                                  <Grid item md={5} xs={12} sm={12}>
                                                    <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                                  </Grid>
                                                  <Grid item md={2} xs={12} sm={12}>
                                                    {data.files.length < 1 ?
                                                      <div className="page-pdf">
                                                        <Button onClick={() => {
                                                          handleDownload(data.document);
                                                        }} className="next-pdf-btn pdf-button">
                                                          View
                                                        </Button>
                                                      </div> :
                                                      <Button
                                                        variant="text"
                                                        onClick={() => {
                                                          renderFilePreview(data.files);
                                                        }}
                                                        sx={userStyle.buttonview}
                                                      >
                                                        Views
                                                      </Button>
                                                    }
                                                  </Grid>
                                                </Grid>
                                              )
                                            })

                                          }
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )}
                              <Grid item md={1} xs={12} sm={12}>
                                {editingIndexcheckDocumentEdit === index ? (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      if (addReqTodoDocumentEdit?.some((data, inde) => data?.category === catgeoryTodoEdit
                                        && data?.subcategory === subcatgeoryTodoEdit && index !== inde)) {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Already Added"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      } else if (catgeoryTodoEdit === "" || catgeoryTodoEdit === "Please Select Category") {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Please Select Category"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      }
                                      else if (subcatgeoryTodoEdit === "" || subcatgeoryTodoEdit === "Please Select SubCategory") {
                                        setShowAlert(
                                          <>
                                            <ErrorOutlineOutlinedIcon
                                              sx={{ fontSize: "100px", color: "orange" }}
                                            />
                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                              {"Please Select SubCategory"}
                                            </p>
                                          </>
                                        );
                                        handleClickOpenerr();
                                      }
                                      else {
                                        const updatedIsTodoEdit = [...isTodoEditDocumentEdit];
                                        updatedIsTodoEdit[index] = false;
                                        setIsTodoEditDocumentEdit(updatedIsTodoEdit);

                                        handleUpdateTodocheckDocumentEdit();
                                      }

                                    }
                                    }
                                  >
                                    <MdOutlineDone
                                      style={{
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditDocumentEdit];
                                      updatedIsTodoEdit[index] = true;
                                      setIsTodoEditDocumentEdit(updatedIsTodoEdit);

                                      setEditingIndexcheckDocumentEdit(index);
                                      handleEditTodocheckDocumentEdit(index)
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={1} xs={12} sm={12}>
                                {isTodoEditDocumentEdit[index] ? (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      const updatedIsTodoEdit = [...isTodoEditDocumentEdit];
                                      updatedIsTodoEdit[index] = false;
                                      setIsTodoEditDocumentEdit(updatedIsTodoEdit);
                                      setTodoSubmitDocumentEdit(false)
                                      setEditingIndexcheckDocumentEdit(-1)
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    sx={{
                                      height: "30px",
                                      minWidth: "30px",
                                      marginTop: "37px",
                                      padding: "6px 10px",
                                    }}
                                    onClick={() => {
                                      deleteTodoDocumentEdit(index);
                                    }}
                                  >
                                    <AiOutlineClose />
                                  </Button>
                                )}
                              </Grid>
                              <Grid item md={2}></Grid>
                            </Grid>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Grid>
              </Grid>
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

export default TrainingDetails;
