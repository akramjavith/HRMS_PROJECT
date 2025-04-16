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
import StyledDataGrid from "../../../components/TableStyle";
import { FaArrowCircleDown, FaPlus } from "react-icons/fa";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
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
import DeleteIcon from "@mui/icons-material/Delete";
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
import { useFetcher } from "react-router-dom";

function TrainingNonScheduleDetails() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [trainingDetails, setTrainingDetails] = useState({
    trainingdetails: "",
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    duration: "00:00",
    date: "",
    mode: "Please Select Mode",
    schedule: "Please Select Schedule",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select unit",
    team: "Please Select Team",
    type: "Please Select Type",
    estimation: "Year", estimationtime: "",
  });
  const [trainingDetailsEdit, setTrainingDetailsEdit] = useState({ trainingdetails: "", category: "Please Select Category", subcategory: "Please Select SubCategory", duration: "00:00", mode: "Please Select Mode", company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select unit", team: "Please Select Team", estimation: "Year", estimationtime: "", });
  const [trainingDetailsArray, setTrainingDetailsArray] = useState([]);
  const [trainingDetailsArrayEdit, setTrainingDetailsArrayEdit] = useState([]);

  const [filteredBranch, setFilteredBranch] = useState([]);
  const [filteredBranchEdit, setFilteredBranchEdit] = useState([]);
  const [filteredUnit, setFilteredUnit] = useState([]);
  const [filteredUnitEdit, setFilteredUnitEdit] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [filteredTeamEdit, setFilteredTeamEdit] = useState([]);

  const [frequencyOption, setFrequencyOption] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" }

  ]);

  const [categoryOption, setCategoryOption] = useState([]);

  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);
  const [subcatgeoryDocuments, setSubcatgeoryDocuments] = useState([]);
  const [subcatgeoryDocumentsEdit, setSubcatgeoryDocumentsEdit] = useState([]);
  const [employeeNameOption, setEmployeeNameOption] = useState([]);
  const [filteredEmployeeName, setFilteredEmployeeName] = useState([]);
  const [filteredEmployeeNameEdit, setFilteredEmployeeNameEdit] = useState([]);

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

  const { isUserRoleCompare, isUserRoleAccess,allCompany,allBranch,allUnit,allTeam } = useContext(
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
  const [trainingDetailsData, setTrainingDetailsData] = useState([]);
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
    category: true,
    subcategory: true,
    duefromdoj: true,
    duration: true,
    mode: true,
    type: true,
    designation: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    schedule: true,
    date: true,
    time: true,
    employeenames: true,
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















  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [trainingDetailsArray]);

  useEffect(() => {
    getexcelDatas();
  }, [trainingDetailsArray]);

  useEffect(() => {
    fetchProcessQueueAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchProcessQueue();
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


      const categoryall = [
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


      const categoryall = [
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
    fetchEmployeeName();
    fetchCategory();

    generateHrsOptions();
    generateMinsOptions();
  }, []);




  useEffect(() => {
    const filteredUnitedit = unitOption?.filter(ue =>
      ue.branch === trainingDetailsEdit.branch
    ).map(ue => (
      {
        ...ue,
        label: ue.name,
        value: ue.name
      }
    ))

    setFilteredUnitEdit(filteredUnitedit);
  }, [trainingDetailsEdit.branch]);

  useEffect(() => {
    const filteredTeams = teamOption?.filter(u =>
      u.unit === trainingDetails.unit).map(u => (
        {
          ...u,
          label: u.teamname,
          value: u.teamname
        }
      ))

    setFilteredTeam(filteredTeams);
  }, [trainingDetails.unit]);

  // useEffect(() => {
  //   const filteredSub = subCategoryOption?.filter(u =>
  //     u.category === trainingDetailsEdit.category).map(u => (
  //       {
  //         ...u,
  //         label: u.subcategoryname,
  //         value: u.subcategoryname
  //       }
  //     ))

  //   setFilteredSubCategory(filteredSub);
  // }, [trainingDetailsEdit.category]);


  useEffect(() => {
    const filteredTeamEdits = teamOption?.filter(ue =>
      ue.unit === trainingDetailsEdit.unit
    ).map(ue => (
      {
        ...ue,
        label: ue.teamname,
        value: ue.teamname
      }
    ))

    setFilteredTeamEdit(filteredTeamEdits);
  }, [trainingDetailsEdit.unit]);


  useEffect(() => {
    const filteredTeams = employeeNameOption?.filter(u =>
      trainingDetails.company === u.company && trainingDetails.branch === u.branch && trainingDetails.unit === u.unit && trainingDetails.team === u.team).map(u => (
        {
          ...u,
          label: u.companyname,
          value: u.companyname
        }
      ))

    setFilteredEmployeeName(filteredTeams);
  }, [trainingDetails.company, trainingDetails.branch, trainingDetails.unit, trainingDetails.team]);
  useEffect(() => {
    const filteredTeams = employeeNameOption?.filter(u =>
      trainingDetailsEdit.company === u.company && trainingDetailsEdit.branch === u.branch && trainingDetailsEdit.unit === u.unit && trainingDetailsEdit.team === u.team).map(u => (
        {
          ...u,
          label: u.companyname,
          value: u.companyname
        }
      ))

    setFilteredEmployeeNameEdit(filteredTeams);

  }, [trainingDetailsEdit.company, trainingDetailsEdit.branch, trainingDetailsEdit.unit, trainingDetailsEdit.team]);



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
  const [hourTodo, setHourTodo] = useState([]);
  const [minutesTodo, setMinutesTodo] = useState([]);
  const [timeTypeTodo, setTimeTypeTodo] = useState([]);

  const [hourTodoEdit, setHourTodoEdit] = useState([]);
  const [minutesTodoEdit, setMinutesTodoEdit] = useState([]);
  const [timeTypeTodoEdit, setTimeTypeTodoEdit] = useState([]);

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );


  //Adding Time Todo
  const addTodo = () => {
    const result = {
      hour: trainingDetails?.hour,
      min: trainingDetails?.min,
      timetype: trainingDetails?.timetype,

    }
    if (trainingDetails?.hour === "" || trainingDetails?.min === "" || trainingDetails?.timetype === "") {
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

  const fetchEmployeeName = async () => {
    try {
      let res = await axios.get(SERVICE.USER_STATUS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      const empall = [...res?.data?.usersstatus.map((d) => (
        {
          ...d,
          label: d.companyname,
          value: d.companyname
        }
      ))];
      setEmployeeNameOption(empall);
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
      let res = await axios.get(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteProcessQueue(res?.data?.snonscheduletrainingdetails);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Alert delete popup
  let proid = deleteProcessQueue._id;
  const delProcess = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${proid}`, {
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
  const sendRequest = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_NONSCHEDULE_TRAININGDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        trainingdetails: String(trainingDetails.trainingdetails),
        category: String(trainingDetails.category),
        subcategory: String(trainingDetails.subcategory),
        date: String(trainingDetails.date),
        schedule: String(trainingDetails.schedule),
        time: String(trainingDetails.time),
        duration: String(trainingDetails.duration),
        mode: String(trainingDetails.mode),
        estimation: String(trainingDetails.estimation),
        estimationtime: String(trainingDetails.estimationtime),
        type: String(trainingDetails.type),
        designation: valueDesignation,
        department: valueDepartment,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employeenames: valueEmployee,
        documentslist: subcatgeoryDocuments,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setTrainingDetails(brandCreate.data);
      await fetchProcessQueue();
      setTrainingDetails({ ...trainingDetails, trainingdetails: "", estimationtime: "" })
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully👍"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const scheduleOption = [{ label: "Time-Based", value: "Time-Based" }, { label: "Any Time", value: "Any Time" }]
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let empopt = selectedEmployeeNameOptionsCate.map((item) => item.value);
    const isNameMatch = trainingDetailsArray?.some(
      (item) =>
        item.trainingdetails === trainingDetails.trainingdetails &&
        item.category === trainingDetails.category &&
        item.subcategory === trainingDetails.subcategory &&
        item.date === trainingDetails.date &&
        item.time === trainingDetails.time &&
        item.mode === trainingDetails.mode
    );

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
    else if (trainingDetails.category === "Please Select Category") {
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
    else if (trainingDetails.subcategory === "Please Select SubCategory") {
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
    else if (trainingDetails.schedule === "Please Select Schedule") {
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
    else if (trainingDetails.date === undefined || trainingDetails?.date === "") {
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
    else if (trainingDetails?.schedule === "Time-Based" && (trainingDetails.time === undefined || trainingDetails?.time === "")) {
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
    else if (trainingDetails.estimation === "" || trainingDetails.estimationtime === "") {
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
    } else if (trainingDetails.estimationtime <= 0) {
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
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Non-Schedule Training Details already exits!"}
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
    setTrainingDetails({
      trainingdetails: "", category: "Please Select Category",
      subcategory: "Please Select SubCategory",
      duration: "00:00",
      date: "",
      mode: "Please Select Mode",
      schedule: "Please Select Schedule",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select unit",
      team: "Please Select Team",
      estimation: "Year",
      type: "Please Select Type",
      estimationtime: "",
    });
    setHours("Hrs");
    setMinutes("Mins");
    setFilteredBranch([])
    setAddReqTodo([])
    setSubcatgeoryDocuments([])
    setFilteredUnit([])
    setFilteredTeam([])
    setSelectedEmployeeNameOptionsCate([]);
    setEmployeeNameValueCate("");
    setUpload([])
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
    setValueDesignation([])
    setSelectedDesignationOptions([])
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
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setHours("Hrs");
    setMinutes("Mins");
  };
  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchSubCategoryEdit(res?.data?.snonscheduletrainingdetails?.category)
      setTrainingDetailsEdit(res?.data?.snonscheduletrainingdetails);
      setSubcatgeoryDocumentsEdit(res?.data?.snonscheduletrainingdetails.documentslist)
      const [hours, minutes] = res?.data?.snonscheduletrainingdetails?.duration.split(":");
      setHoursEdit(hours);
      setMinutesEdit(minutes);
      setSelectedDesignationOptionsEdit(res?.data?.snonscheduletrainingdetails?.designation?.map((t) => ({
        ...t,
        label: t,
        value: t,
      })))

      setSelectedOptionsCompanyEdit([...res?.data?.snonscheduletrainingdetails?.company.map((t) => ({ ...t, label: t, value: t }))])
      setValueCompanyCatEdit(res?.data?.snonscheduletrainingdetails?.company)

      setSelectedOptionsBranchEdit([...res?.data?.snonscheduletrainingdetails?.branch.map((t) => ({ ...t, label: t, value: t }))])
      setValueBranchCatEdit(res?.data?.snonscheduletrainingdetails?.branch)
      fetchBranchAllEdit([...res?.data?.snonscheduletrainingdetails?.company.map((t) => ({ ...t, label: t, value: t }))])

      setValueUnitCatEdit(res?.data?.snonscheduletrainingdetails?.unit)
      setSelectedOptionsUnitEdit([...res?.data?.snonscheduletrainingdetails?.unit.map((t) => ({ ...t, label: t, value: t }))])
      fetchUnitAllEdit([...res?.data?.snonscheduletrainingdetails?.branch.map((t) => ({ ...t, label: t, value: t }))])

      setValueTeamCatEdit(res?.data?.snonscheduletrainingdetails?.team)
      setSelectedOptionsTeamEdit([...res?.data?.snonscheduletrainingdetails?.team.map((t) => ({ ...t, label: t, value: t }))])
      fetchTeamAllEdit(res?.data?.snonscheduletrainingdetails?.company, res?.data?.snonscheduletrainingdetails?.branch, [...res?.data?.snonscheduletrainingdetails?.unit.map((t) => ({ ...t, label: t, value: t }))])


      setSelectedDesignationOptionsEdit([...res?.data?.snonscheduletrainingdetails?.designation.map((t) => ({ ...t, label: t, value: t }))])
      setValueDesignationEdit(res?.data?.snonscheduletrainingdetails?.designation)

      setSelectedDepartmentOptionsEdit([...res?.data?.snonscheduletrainingdetails?.department.map((t) => ({ ...t, label: t, value: t }))])
      setValueDepartmentEdit(res?.data?.snonscheduletrainingdetails?.department)



      setSelectedEmployeeOptionsEdit([...res?.data?.snonscheduletrainingdetails?.employeenames.map((t) => ({ ...t, label: t, value: t }))])
      setValueEmployeeEdit(res?.data?.snonscheduletrainingdetails?.employeenames)
      const typeChecking = res?.data?.snonscheduletrainingdetails?.type === "Designation" ? [...res?.data?.snonscheduletrainingdetails?.designation.map((t) => ({ ...t, label: t, value: t }))] :
        res?.data?.snonscheduletrainingdetails?.type === "Department" ? [...res?.data?.snonscheduletrainingdetails?.department.map((t) => ({ ...t, label: t, value: t }))]
          : [...res?.data?.snonscheduletrainingdetails?.team.map((t) => ({ ...t, label: t, value: t }))]
      fetchEmployeeOptionsEdit(res?.data?.snonscheduletrainingdetails?.company, res?.data?.snonscheduletrainingdetails?.branch, res?.data?.snonscheduletrainingdetails?.unit, typeChecking, res?.data?.snonscheduletrainingdetails?.type)

      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....

  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsEdit(res?.data?.snonscheduletrainingdetails);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsEdit(res?.data?.snonscheduletrainingdetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  let updateby = trainingDetailsEdit.updatedby;
  let addedby = trainingDetailsEdit.addedby;
  let processId = trainingDetailsEdit._id;

  //editing the single data...

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          trainingdetails: String(trainingDetailsEdit.trainingdetails),
          category: String(trainingDetailsEdit.category),
          subcategory: String(trainingDetailsEdit.subcategory),
          date: String(trainingDetailsEdit.date),
          schedule: String(trainingDetailsEdit.schedule),
          time: String(trainingDetailsEdit.time),
          duration: String(trainingDetailsEdit.duration),
          mode: String(trainingDetailsEdit.mode),
          estimation: String(trainingDetailsEdit.estimation),
          estimationtime: String(trainingDetailsEdit.estimationtime),
          type: String(trainingDetailsEdit.type),
          designation: valueDesignationEdit,
          department: valueDepartmentEdit,
          company: valueCompanyCatEdit,
          branch: valueBranchCatEdit,
          unit: valueUnitCatEdit,
          team: valueTeamCatEdit,
          employeenames: valueEmployeeEdit,
          documentslist: subcatgeoryDocumentsEdit,
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
    let empopt = selectedEmployeeNameOptionsCateEdit.map((item) => item.value);
    const isNameMatch = trainingDetailsArrayEdit?.some(
      (item) =>
        item.trainingdetails === trainingDetailsEdit.trainingdetails &&
        item.category === trainingDetailsEdit.category &&
        item.subcategory === trainingDetailsEdit.subcategory &&
        item.date === trainingDetailsEdit.date &&
        item.time === trainingDetailsEdit.time &&
        item.mode === trainingDetailsEdit.mode
    );





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
    else if (trainingDetailsEdit.category === "Please Select Category") {
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
    else if (trainingDetailsEdit.subcategory === "Please Select SubCategory") {
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
    else if (trainingDetailsEdit.schedule === "Please Select Schedule") {
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
    else if (trainingDetailsEdit.date === undefined || trainingDetailsEdit?.date === "") {
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
    else if (trainingDetailsEdit?.schedule === "Time-Based" && (trainingDetailsEdit.time === undefined || trainingDetailsEdit?.time === "")) {
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
    else if (trainingDetailsEdit.estimation === "" || trainingDetailsEdit.estimationtime === "") {
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
    } else if (trainingDetailsEdit.estimationtime <= 0) {
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
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Non-Schedule Training Details already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendEditRequest();
    }
  };

  //get all Training Details.

  const fetchProcessQueue = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_NONSCHEDULE_TRAININGDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setTrainingDetailsArray(res_freq?.data?.nonscheduletrainingdetails);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_NONSCHEDULE_TRAININGDETAILS}/${item}`, {
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
      let res_freq = await axios.get(SERVICE.ALL_NONSCHEDULE_TRAININGDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTrainingDetailsArrayEdit(
        res_freq?.data?.nonscheduletrainingdetails.filter(
          (item) => item._id !== trainingDetailsEdit._id
        ));
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Non-Schedule Training Details.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Training Details", field: "trainingdetails" },
    { title: "Category", field: "category" },
    { title: "Sub Category", field: "subcategory" },
    { title: "Schedule", field: "schedule" },
    { title: "Date", field: "date" },
    { title: "Time", field: "time" },
    { title: "Duration", field: "duration" },
    { title: "Mode", field: "mode" },
    { title: "Due From DOJ", field: "duefromdoj" },
    { title: "Type", field: "type" },
    { title: "Department", field: "department" },
    { title: "Designation", field: "designation" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Responsible Person", field: "employeenames" },
  ];
  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: filteredData,
      styles: { fontSize: 4 },
    });
    doc.save("Non-Schedule Training Details.pdf");
  };
  // Excel
  const fileName = "Non-Schedule Training Details";
  // get particular columns for export excel
  const getexcelDatas = () => {
      var data = trainingDetailsArray.map((t, index) => ({
        Sno: index + 1,
        "Training Details": t.trainingdetails,
        "Category": t.category,
        "Sub Category": t.subcategory,
        "Duration": t.duration,
        "Mode": t.mode,
        "Frequency": t.frequency,
        "Due From DOJ": t.estimationtime + " " + t.estimation,
        "Company": t.company,
        "Branch": t.branch,
        "Unit": t.unit,
        "Team": t.team,
        "Responsible Person": t.responsibleperson?.join(','),
      }));
      setTrainingDetailsData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Non-Schedule Training Details",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = trainingDetailsArray?.map((item, index) => ({
      id: item._id,
      serialNumber: index + 1,
      category: item.category,
      type: item.type,
      duration: item.duration,
      trainingdetails: item.trainingdetails,
      subcategory: item.subcategory,
      schedule: item.schedule,
      date: moment(item.date).format("DD-MM-YYYY"),
      time: item.time,
      duefromdoj: item.estimationtime + " " + item.estimation,
      mode: item.mode,
      designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
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
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
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
          {isUserRoleCompare?.includes("enonscheduletrainingdetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dnonscheduletrainingdetails") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vnonscheduletrainingdetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("inonscheduletrainingdetails") && (
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
      id: item.id,
      serialNumber: item.serialNumber,
      trainingdetails: item.trainingdetails,
      category: item.category,
      type: item.type,
      duration: item.duration,
      subcategory: item.subcategory,
      schedule: item.schedule,
      date: item.date,
      time: item.time,
      duefromdoj: item.duefromdoj,
      mode: item.mode,
      designation: item.designation,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
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
      <Headtitle title={"NON-SCHEDULE TRAINING DETAILS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Non-Schedule Training Details</Typography>

      <>
        {isUserRoleCompare?.includes("anonscheduletrainingdetails") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Manage Non-Schedule Training Details
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
                            subcategory: "Please Select SubCategory"
                          });
                          fetchSubCategory(e.value);
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Schedule<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[{ label: "Time-Based", value: "Time-Based" }, { label: "Any Time", value: "Any Time" }]}
                        styles={colourStyles}
                        value={{
                          label: trainingDetails.schedule,
                          value: trainingDetails.schedule,
                        }}
                        onChange={(e) => {
                          setTrainingDetails({
                            ...trainingDetails,
                            schedule: e.value,
                            time: ""
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
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
                  {trainingDetails?.schedule === "Time-Based" &&
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
                  }
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
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained"
                    onClick={handleSubmit}
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
          {isUserRoleCompare?.includes("lnonscheduletrainingdetails") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Non-Schedule Training Details List
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
                    {isUserRoleCompare?.includes("excelnonscheduletrainingdetails") && (
                      <>
                        <ExportXL csvData={filteredData.map((item, index) => {
                          return {
                            SerialNumber: item.serialNumber,
                            Tablerainingdetails: item.trainingdetails,
                            Category: item.category,
                            Subcategory: item.subcategory,
                            Schedule: item.schedule,
                            DataGridate: item.date,
                            Time: item.time,
                            Duration: item.duration,
                            Mode: item.mode,
                            Duefromdoj: item.duefromdoj,
                            Type: item.type,
                            Designation: item.designation,
                            Department: item.department,
                            Company: item.company,
                            Branch: item.branch,
                            Unit: item.unit,
                            Team: item.team,
                            Employeenames: item.employeenames,
                          };
                        })} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvnonscheduletrainingdetails") && (
                      <>
                        <ExportCSV csvData={filteredData.map((item, index) => {
                          return {
                            SerialNumber: item.serialNumber,
                            Tablerainingdetails: item.trainingdetails,
                            Category: item.category,
                            Subcategory: item.subcategory,
                            Schedule: item.schedule,
                            DataGridate: item.date,
                            Time: item.time,
                            Duration: item.duration,
                            Mode: item.mode,
                            Duefromdoj: item.duefromdoj,
                            Type: item.type,
                            Designation: item.designation,
                            Department: item.department,
                            Company: item.company,
                            Branch: item.branch,
                            Unit: item.unit,
                            Team: item.team,
                            Employeenames: item.employeenames,
                          };
                        })} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printnonscheduletrainingdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfnonscheduletrainingdetails") && (
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
                    {isUserRoleCompare?.includes("imagenonscheduletrainingdetails") && (
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
              {isUserRoleCompare?.includes("bdnonscheduletrainingdetails") && (
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
              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Due From DOJ</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Employee Names</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.trainingdetails}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.subcategory}</TableCell>
                  <TableCell>{row.schedule}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.mode}</TableCell>
                  <TableCell>{row.duefromdoj}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.employeenames}</TableCell>
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
              Non-Schedule Training Details Info
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
              View Non-Schedule Training Details
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
                  <Typography variant="h6">Category</Typography>
                  <Typography>{trainingDetailsEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{trainingDetailsEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Schedule</Typography>
                  <Typography>{trainingDetailsEdit.schedule}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(trainingDetailsEdit.date).format("DD-MM-YYYY")}</Typography>
                </FormControl>
              </Grid>
              {trainingDetailsEdit.schedule === "Time-Based" &&
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Time</Typography>
                    <Typography>{trainingDetailsEdit.time}</Typography>
                  </FormControl>
                </Grid>}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{trainingDetailsEdit.mode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Due From DOJ</Typography>
                  <Typography>{`${trainingDetailsEdit.estimationtime}  ${trainingDetailsEdit.estimation}`}</Typography>
                </FormControl>
              </Grid>
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
                  Edit Non-Schedule Training Details
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
                <Grid item md={4} xs={12} sm={12}>
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
                          subcategory: "Please Select SubCategory"
                        });
                        fetchSubCategoryEdit(e.value)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
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
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Schedule<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[{ label: "Time-Based", value: "Time-Based" }, { label: "Any Time", value: "Any Time" }]}
                      styles={colourStyles}
                      value={{
                        label: trainingDetailsEdit.schedule,
                        value: trainingDetailsEdit.schedule,
                      }}
                      onChange={(e) => {
                        setTrainingDetailsEdit({
                          ...trainingDetailsEdit,
                          schedule: e.value,
                          time: ""
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
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
                {trainingDetailsEdit?.schedule === "Time-Based" &&
                  <Grid item md={4} xs={12} sm={12}>
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
                }
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

              }<br />
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

export default TrainingNonScheduleDetails;
