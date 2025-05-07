import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LoadingButton } from "@mui/lab";
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
  Typography,
  Chip
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import domtoimage from 'dom-to-image';
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

function Assignmanualsalarydetails() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [monthSets, setMonthsets] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [tarPoints, setTarpoints] = useState([]);


  const [employees, setEmployees] = useState([]);
  const [employeesOverall, setEmployeesOverall] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    allUsersData,
    buttonStyles,
    allUsersLimit
  } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }
        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const [btnSubmit, setBtnSubmit] = useState(false);

  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });

  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);

  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const fetchDepartments = async () => {
    setPageName(!pageName)
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
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

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

  const [internChecked, setInternChecked] = useState(false);

  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };


  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  //Datatable Info
  const [pageInfo, setPageInfo] = useState(1);
  const [pageSizeInfo, setPageSizeInfo] = useState(10);
  const [searchQueryInfo, setSearchQueryInfo] = useState("");
  const { auth } = useContext(AuthContext);

  const [salarySetUpForm, setSalarysetupForm] = useState({
    mode: "",
    empcode: "",
    employeename: "",
    salarycode: "",
  });

  const [formValue, setFormValue] = useState({
    esideduction: false,
    pfdeduction: false,
    gross: "",
    basic: "",
    hra: "",
    conveyance: "",
    medicalallowance: "",
    productionallowance: "",
    productionallowancetwo: "",
    otherallowance: "",
  });
  const [empDetailsform, setEmpDetailsForm] = useState({
    esideduction: false,
    pfdeduction: false,
    uan: "",
    pfmembername: "",
    insurancenumber: "",
    ipname: "",
    pfesifromdate: "",
    isenddate: false,
    pfesienddate: "",
    mode: "Manual",
  });

  const currentDateAttStatus = new Date();
  const currentYearAttStatus = currentDateAttStatus.getFullYear();
  // get current month in string name
  const monthstring = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = {
    label: monthstring[currentMonthIndex],
    value: currentMonthIndex + 1,
  };
  const currentYearObject = {
    label: currentYearAttStatus,
    value: currentYearAttStatus,
  };
  const years = Array.from(
    new Array(20),
    (val, index) => currentYearAttStatus - 5 + index
  );
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  //get all months
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const [isMonthyear, setIsMonthYear] = useState({
    startMonth: currentMonthObject?.label,
    startMonthValue: currentMonthObject?.value,
    startYear: currentYearObject?.value,
  });

  const [isActive, setIsActive] = useState(false);

  const [salarySlabOpt, setSalarySlabOpt] = useState([]);
  const [isBankdetail, setBankdetail] = useState(false);
  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const gridRef = useRef(null);
  const gridRefinfo = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");


  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assign Manual Salary Details.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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

  const [expDptDates, setExpDptDates] = useState([]);
  const [oldDatalog, setOldDatalog] = useState({
    expmode: "",
    expval: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleOpeneinfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSalarysetupForm({
      ...salarySetUpForm,
      mode: "Manual",
      salarycode: "Please Select Salary Code",
    });

    setFormValue([]);
    setCtc("");
    setIsActive(false);
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

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setExpDptDates(res?.data?.departmentdetails);
      setMonthsets(res.data.departmentdetails);

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchSalarySlabs = async () => {
    try {
      let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setsalSlabs(res_employee?.data?.salaryslab);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all employees list details
  const fetchTargetpoints = async () => {
    try {
      let res_employee = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTarpoints(res_employee?.data?.targetpoints);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const StyledDataGridInfo = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "10px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "30px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "40px !important",
      background: "#b7b3b347",
      maxHeight: "40px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "9px", // Change the font size for row data
      minWidth: "30px",
      color: "black",
      // Add any other styles you want to apply to the row data
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (monthNumber) {
      return monthNames[monthNumber - 1];
    } else {
      return undefined;
    }
  };





  let today1 = new Date();
  var mm = String(today1.getMonth() + 1).padStart(2, "0");
  var yyyy = today1.getFullYear();
  let curMonStartDate = yyyy + "-" + mm + "-01";


  const [overallgrosstotal, setoverallgrosstotal] = useState("");
  const [modeexperience, setModeexperience] = useState("");
  const [targetexperience, setTargetexperience] = useState("");
  const [targetpts, setTargetpts] = useState("");
  const [autoSalarySlab, setAutoSalarySlab] = useState([]);
  const [salaryCode, setSalaryCode] = useState([]);

  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpDetailsForm(res?.data?.suser);

      const salusr = res?.data?.suser;

      let lastexplogsalaryslab =
        res?.data?.suser.assignExpLog[
        res?.data?.suser?.assignExpLog?.length - 1
        ];

      let findexp = monthSets.find(
        (d) =>
          d.department === salusr.department &&
          new Date(salusr?.doj) >= new Date(d.fromdate) &&
          new Date(salusr?.doj) <= new Date(d.todate)
      );

      let findDate = findexp ? findexp.fromdate : curMonStartDate;


      const handleSalaryfix = (
        process,
        updatedate,
        doj,
        assignExpMode,
        assignExpvalue,
        assignEndExpvalue,
        assignEndExpDate,
        assignEndTarvalue,
        assignEndTarDate
      ) => {
        let modevalue =
          new Date(today1) > new Date(updatedate) &&
          ((assignExpMode === "Add" && assignExpvalue !== "") ||
            (assignExpMode === "Minus" && assignExpvalue !== "") ||
            (assignExpMode === "Fix" && assignExpvalue !== "") ||
            (assignEndExpvalue === "Yes" && assignEndExpDate !== "") ||
            assignEndTarvalue === "Yes" ||
            assignEndTarDate !== "");

        const calculateMonthsBetweenDates = (startDate, endDate) => {
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            // Convert years to months
            months += years * 12;

            // Adjust for negative days
            if (days < 0) {
              months -= 1; // Subtract a month
              days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
            }

            // Adjust for days 15 and above
            if (days >= 15) {
              months += 1; // Count the month if 15 or more days have passed
            }

            return months;
          }

          return 0; // Return 0 if either date is missing
        };
        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
        if (modevalue) {
          //findexp end difference yes/no
          if (assignEndExpvalue === "Yes") {
            differenceInMonthsexp = calculateMonthsBetweenDates(
              doj,
              assignEndExpDate
            );
            differenceInMonthsexp =
              differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
            if (assignExpMode === "Add") {
              differenceInMonthsexp += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthsexp -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthsexp = parseInt(assignExpvalue);
            }
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
            differenceInMonthsexp =
              differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;

            if (assignExpMode === "Add") {
              differenceInMonthsexp += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthsexp -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthsexp = parseInt(assignExpvalue);
            } else {
              differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
            }
          }

          //findtar end difference yes/no
          if (modevalue.endtar === "Yes") {
            differenceInMonthstar = calculateMonthsBetweenDates(
              doj,
              assignEndTarDate
            );
            differenceInMonthstar =
              differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

            if (assignExpMode === "Add") {
              differenceInMonthstar += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthstar -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthstar = parseInt(assignExpvalue);
            }
          } else {
            differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
            differenceInMonthstar =
              differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

            if (assignExpMode === "Add") {
              differenceInMonthstar += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthstar -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthstar = parseInt(assignExpvalue);
            } else {
              differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
            }
          }

          differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;

          if (assignExpMode === "Add") {
            differenceInMonths += parseInt(assignExpvalue);
          } else if (assignExpMode === "Minus") {
            differenceInMonths -= parseInt(assignExpvalue);
          } else if (assignExpMode === "Fix") {
            differenceInMonths = parseInt(assignExpvalue);
          } else {
            // differenceInMonths = parseInt(assignExpvalue);
            differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
        }

        let getprocessCode = process;

        let processexp = doj
          ? getprocessCode +
          (differenceInMonths < 1
            ? "00"
            : differenceInMonths <= 9
              ? `0${differenceInMonths}`
              : differenceInMonths)
          : "00";

        setSalaryCode(processexp)
        // setSalarysetupForm({
        //   ...salarySetUpForm,
        //   salarycode: processexp,
        // });



        let findSalDetails = salSlabs.find(
          (d) =>
            d.company == salusr?.company &&
            d.branch == salusr?.branch &&
            d.salarycode == processexp
        );

        setAutoSalarySlab(findSalDetails)


      };

      handleSalaryfix(
        salusr?.process,
        salusr?.date,
        salusr?.doj,
        salusr?.assignExpMode,
        salusr?.assignExpvalue,
        lastexplogsalaryslab?.endexp,
        lastexplogsalaryslab?.endexpdate,
        lastexplogsalaryslab?.endtar,
        lastexplogsalaryslab?.endtardate,
      )

      if (res?.data?.suser?.assignExpLog?.length > 0) {

        let lastexplog =
          res?.data?.suser.assignExpLog[
          res?.data?.suser?.assignExpLog?.length - 1
          ];
        const mondatefilter = lastexplog?.updatedate?.split("-");
        const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09' ? "September" : mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08' ? "August" : mondatefilter[1] === '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06' ? "June" : mondatefilter[1] === '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04' ? "April" : mondatefilter[1] === '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March" : mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01' ? "January" : mondatefilter[1] === '1' ? "January" : "";
        setOldDatalog(lastexplog);
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: lastexplog.expmode != "Manual" ? "Auto" : "Manual",
          // salarycode: salaryCode,
          salarycode: lastexplog.salarycode && lastexplog.salarycode !== "Please Select Salary Code" ? lastexplog.salarycode : "",
        });
        setFormValue({
          ...formValue,
          gross: lastexplog.gross && lastexplog.gross !== "undefined" && lastexplog.gross !== "Please Select Salary Code" ? lastexplog.gross : "",
          hra: lastexplog.hra && lastexplog.hra !== "undefined" ? lastexplog.hra : "",
          conveyance: lastexplog.conveyance && lastexplog.gross !== "undefined" ? lastexplog.conveyance : "",
          startDate: lastexplog.updatedate ? lastexplog.updatedate : "",
          startmonthlabel: getmonth,
          startmonth: mondatefilter[1],
          startyear: mondatefilter[0],
          basic: lastexplog.basic && lastexplog.basic !== "undefined" ? lastexplog.basic : "",
          medicalallowance: lastexplog.medicalallowance && lastexplog.medicalallowance !== "undefined"
            ? lastexplog.medicalallowance
            : "",
          productionallowance: lastexplog.productionallowance && lastexplog.productionallowance !== "undefined"
            ? lastexplog.productionallowance
            : "",
          productionallowancetwo: lastexplog.productionallowancetwo && lastexplog.productionallowancetwo !== "undefined"
            ? lastexplog.productionallowancetwo
            : "",
          otherallowance: lastexplog.otherallowance && lastexplog.otherallowance !== "undefined"
            ? lastexplog.otherallowance
            : "",
          pfdeduction: lastexplog.pfdeduction && lastexplog.pfdeduction !== "undefined" ? lastexplog.pfdeduction : "",
          esideduction: lastexplog.esideduction && lastexplog.esideduction !== "undefined" ? lastexplog.esideduction : "",
        });

      } else {
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: "Auto",
          startDate: "",
        });
      }
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [empDetailInfo, setempDetailInfo] = useState([]);

  const getInfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      if (
        res?.data?.suser.assignExpLog &&
        res?.data?.suser.assignExpLog.length > 0
      ) {
        let lastexplog =
          res?.data?.suser.assignExpLog[
          res?.data?.suser.assignExpLog.length - 1
          ];
        setOldDatalog(lastexplog);
        setempDetailInfo(
          res?.data?.suser.assignExpLog
            .filter((d) => d.expmode == "Manual")
            .map((item) => ({
              ...item,
              companyname: res?.data?.suser.companyname,
              startdate: item.updatedate,
            }))
        );
      } else {
        setOldDatalog([]);
        setempDetailInfo([]);
      }

      handleOpeneinfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //change form
  const handleChangeGross = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        gross: inputValue,
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
      });
    }
  };

  //change form
  const handleChangeBasic = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        basic: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeHra = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        hra: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeConveyance = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        conveyance: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeMedAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        medicalallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.basic) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllowtwo = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowancetwo: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeOtherAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;

    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        otherallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo),
      });
    }
  };



  //Boardingupadate updateby edit page...
  let updateby = empDetailsform?.updatedby;

  //edit post call
  let boredit = empDetailsform?._id;
  const sendRequestt = async () => {
    setBtnSubmit(true);
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignExpLog: [
          ...empDetailsform.assignExpLog,
          {
            type: salarySetUpForm.mode,
            expmode: salarySetUpForm.mode,
            salarycode: salarySetUpForm.salarycode,
            endexp: "No",
            endexpdate: "",
            endtar: "No",
            endtardate: "",
            basic: String(formValue.basic),
            hra: String(formValue.hra),
            conveyance: String(formValue.conveyance),
            gross: String(formValue.gross),
            medicalallowance: String(formValue.medicalallowance),
            productionallowance: String(formValue.productionallowance),
            otherallowance: String(formValue.otherallowance),
            productionallowancetwo: String(formValue.productionallowancetwo),
            pfdeduction: Boolean(formValue.pfdeduction),
            esideduction: Boolean(formValue.esideduction),
            ctc: String(Ctc),
            updatedate: String(formValue.startDate),
            updatename: String(isUserRoleAccess.companyname),
            date: String(new Date()),
            startmonth: String(formValue?.startmonth),
            startyear: String(formValue?.startyear),
            endmonth: String(""),
            endyear: String(""),
          },
        ],
        salarysetup: true,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });


      setIsMonthYear({
        startMonth: currentMonthObject?.label,
        startMonthValue: currentMonthObject?.value,
        startYear: currentYearObject?.value,
      });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setIsActive(true);
      setFormValue({
        ...formValue,
        gross: "",
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
        esideduction: false,
        pfdeduction: false
      });
      setFormValue({

      })
      setCtc("");

      setBtnSubmit(false);
      await fetchEmployee();

      setIsActive(false);
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    if (
      salarySetUpForm.mode === "Auto" &&
      (formValue.startDate === "" || formValue.startDate === undefined)
    ) {

      setPopupContentMalert("Please Select Start Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      formValue.startDate === "" ||
      formValue.startDate === undefined
    ) {

      setPopupContentMalert("Please Select Start Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (salarySetUpForm.mode === "Manual" && formValue.gross === "") {

      setPopupContentMalert("Please Enter Gross amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName)
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
        Empcode: item.empcode || "",
        Name: item.companyname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assign Manual Salary Details");
    setIsFilterOpen(false);
  };
  //  PDF
  let exportColumnNames = [
    'Company', 'Branch',
    'Unit', 'Team', 'Work Mode',
    'Emp Code', 'Name',
  ]
  let exportRowValues = [
    'company',
    'branch',
    'unit',
    'team',
    'workmode',
    'empcode',
    'companyname',
  ]

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
  ];



  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 8 },
    });

    doc.save("Assign Manual Salary Details.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Manual Salary Details",
    pageStyle: "print",
  });

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
    addSerialNumber(employees);
  }, [employees]);

  useEffect(() => {
    fetchDepartmentMonthsets();
    fetchSalarySlabs();
    fetchTargetpoints();
  }, []);

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

  const totalPages = Math.ceil(employees.length / pageSize);

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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 140,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 160,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 160,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
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
      // Assign Bank Detail
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {isUserRoleCompare?.includes("eassignmanualsalarydetails") && (
            <Button
              variant="contained"
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Assign
            </Button>
          )}{" "}
          &ensp;
          {isUserRoleCompare?.includes("vassignmanualsalarydetails") && (
            <Button
              variant="contained"
              sx={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                window.open(
                  `/assignmanualsalarydetails/${params.data.id}`,
                  "_blank"
                );
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes("iassignmanualsalarydetails") && (
            <Button
              //   variant="outlined"
              onClick={() => {
                getInfoCode(params.data.id);
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
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      empcode: item.empcode,
      companyname: item.companyname,
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

  const ModeOpt = [
    { label: "Manual", value: "Manual" },
    { label: "Auto", value: "Auto" },
  ];

  //get all client user id.
  const fetchProfessionalTax = async (process, salarycode) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.SALARYSLAB_PROCESS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: process,
      });
      const OptSlaball = res_freq?.data?.salaryslab;
      const OptSlab = res_freq?.data?.salaryslab.filter((slab) => {
        return slab.salarycode === salarycode;
      });

      setSalarySlabOpt(OptSlaball);
      setFormValue(OptSlab[0]);
      setCtc(
        OptSlab[0].basic +
        OptSlab[0].hra +
        OptSlab[0].conveyance +
        OptSlab[0].medicalallowance +
        OptSlab[0].productionallowance +
        OptSlab[0].productionallowancetwo +
        OptSlab[0].otherallowance
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [Ctc, setCtc] = useState("");

  const handleclear = (e) => {
    e.preventDefault();

    setFormValue({
      basic: "",
      hra: "",
      conveyance: "",
      medicalallowance: "",
      productionallowance: "",
      productionallowancetwo: "",
      otherallowance: "",
      gross: "",
      startDate: "",
    });
    setCtc("");

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //INFO table entries ..,.
  const [itemsInfo, setItemsInfo] = useState([]);

  const addSerialNumberInfo = () => {
    const itemsWithSerialNumber = empDetailInfo?.map((item, index) => {
      const newDate = new Date(item.date);
      // Extract year, month, and day
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to get the correct month since January is 0
      const day = String(newDate.getDate()).padStart(2, "0");
      const formattedDate = `${day}-${month}-${year}`;
      const updatestartdate = moment(item.startdate).format("YYYY-MM-DD");

      return {
        ...item,
        serialNumber: index + 1,
        date: item.updatename + " / " + formattedDate,
        startdate: updatestartdate,
      };
    });
    setItemsInfo(itemsWithSerialNumber);
  };

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Assign Manual Salary Details"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    addSerialNumberInfo();
  }, [empDetailInfo]);

  //Datatable
  const handlePageChangeInfo = (newPage) => {
    setPageInfo(newPage);
  };

  const handlePageSizeChangeInfo = (event) => {
    setPageSizeInfo(Number(event.target.value));
    setPageInfo(1);
  };

  //datatable....
  const handleSearchChangeInfo = (event) => {
    setSearchQueryInfo(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsInfo = searchQueryInfo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasInfo = itemsInfo?.filter((item) => {
    return searchTermsInfo.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataInfo = filteredDatasInfo.slice(
    (pageInfo - 1) * pageSizeInfo,
    pageInfo * pageSizeInfo
  );

  const totalPagesInfo = Math.ceil(empDetailInfo.length / pageSizeInfo);

  const visiblePagesInfo = Math.min(totalPagesInfo, 3);

  const firstVisiblePageInfo = Math.max(1, pageInfo - 1);
  const lastVisiblePageInfo = Math.min(
    firstVisiblePageInfo + visiblePagesInfo - 1,
    totalPagesInfo
  );

  const pageNumbersInfo = [];

  for (let i = firstVisiblePageInfo; i <= lastVisiblePageInfo; i++) {
    pageNumbersInfo.push(i);
  }

  const columnDataTableInfo = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 45,
      // hide: !columnVisibilityInfo.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 150,
      headerClassName: "bold-header",
    },

    {
      field: "gross",
      headerName: "Gross",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "hra",
      headerName: "Hra",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      flex: 0,
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "medicalallowance",
      headerName: "Medical Allowance",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowance",
      headerName: "Production Allowance",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowancetwo",
      headerName: "Production Allowance2",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "otherallowance",
      headerName: "Other Allowance",
      flex: 0,
      width: 60,
      otherallowance: "bold-header",
    },
    {
      field: "esideduction",
      headerName: "ESI Deduction",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "pfdeduction",
      headerName: "PF Deduction",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },

    {
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Updated By",
      flex: 0,
      width: 150,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTableInfo = filteredDataInfo.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      companyname: item.companyname,
      expmode: item.expmode,
      salarycode: item.salarycode,
      gross: item.gross,
      basic: item.basic,
      hra: item.hra,
      conveyance: item.conveyance,
      medicalallowance: item.medicalallowance,
      productionallowance: item.productionallowance,
      productionallowancetwo: item.productionallowancetwo,
      otherallowance: item.otherallowance,
      esideduction: item.esideduction,
      pfdeduction: item.pfdeduction,
      updatename: item.updatename,

      startdate: item.startdate,
      date: item.date,
    };
  });

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name !== "");

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = internChecked
      ? allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode === "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())
      : allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())


    const matchedValues = namesArray.filter((name) =>
      availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    );

    // Update selected options
    const newOptions = matchedValues.map(value => ({
      label: value,
      value: value
    }));

    setSelectedOptionsEmployee(prev => {
      const newValues = newOptions.filter(
        newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
      );
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
    setValueEmp((current) => current.filter(empValue => empValue !== value));
    setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
  };


  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setInternChecked(false);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {

    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setBankdetail(true);
    setPageName(!pageName);
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                {
                  company: { $in: valueCompanyCat },
                },
              ]
              : [
                {
                  company: { $in: allAssignCompany },
                },
              ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                {
                  branch: { $in: valueBranchCat },
                },
              ]
              : [
                {
                  branch: { $in: allAssignBranch },
                },
              ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                {
                  unit: { $in: valueUnitCat },
                },
              ]
              : [
                {
                  unit: { $in: allAssignUnit },
                },
              ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat.length > 0
              ? [
                {
                  companyname: { $in: valueEmployeeCat },
                },
              ]
              : []),
          ],
        },
      },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          workmode: 1,
        },
      },
    ];
    setPageName(!pageName)
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setEmployees(response.data.users);
      setEmployeesOverall(response.data.users);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employeess = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => u.companyname);

      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
      setValueEmployeeCat(employeess);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"ASSIGN MANUAL SALARY DETAILS"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Assign Manual Salary Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Assign Manual Salary Details"
      />
      <br />
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? "Please Select Type",
                        value: filterState.type ?? "Please Select Type",
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                {["Individual", "Team"]?.includes(filterState.type) ? (
                  <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
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
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
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
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit)
                            )
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
                ) : ["Department"]?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Branch"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
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
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Unit"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
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
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
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
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <div
                        onPaste={handlePasteForEmp}
                        style={{ position: 'relative' }}
                      >
                        <MultiSelect
                          options={
                            internChecked
                              ? allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode === "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                              : allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode !== "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                          }
                          value={selectedOptionsEmployee}
                          onChange={(e) => {
                            handleEmployeeChange(e);
                          }}
                          valueRenderer={customValueRendererEmployee}
                          labelledBy="Please Select Employee"
                          // Add these props if your MultiSelect supports them
                          inputValue={searchInputValue} // Add this state if needed
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
                  </Grid>
                )}
                {["Individual"]?.includes(filterState.type) &&
                  <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box" // Add an ID to the Box
                        tabIndex={0} // Make the div focusable
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); // Refocus only if the Box was previously focused
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            clickable
                            sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                            onDelete={(e) => handleDelete(e, value)}
                            onClick={() => console.log("clicked chip")}
                          />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                }

                <Grid
                  item md={3} xs={12} sm={12}

                >
                  <Typography>&nbsp;</Typography>
                  <Button
                    sx={buttonStyles.buttonsubmit} onClick={handleFilter}
                  >
                    {" "}
                    Filter{" "}
                  </Button>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                    {" "}
                    Clear{" "}
                  </Button>
                </Grid>
              </>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assign Manual Salary Details List
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
                    <MenuItem value={employees?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes(
                    "excelassignmanualsalarydetails"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "csvassignmanualsalarydetails"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "printassignmanualsalarydetails"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfassignmanualsalarydetails"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "imageassignmanualsalarydetails"
                  ) && (
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={employees}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={employeesOverall}
                  />
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
            <br />
            <br />
            {isBankdetail ? (
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
                  itemsList={employeesOverall}

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

      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{ marginTop: "80px" }}
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <br />
              <Grid container spacing={2} >
                <Grid
                  item
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={userStyle.SubHeaderText}>
                    Salary Setup
                  </Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      styles={colourStyles}
                      options={ModeOpt}
                      value={{
                        label: salarySetUpForm.mode,
                        value: salarySetUpForm.mode,
                      }}
                      onChange={(e) => {
                        setSalarysetupForm({
                          ...salarySetUpForm,
                          mode: e.value,
                          salarycode: e.value == "Manual" ? "MANUAL" : salaryCode,
                        });
                        if (e.value === "Auto") {
                          setIsActive(true);
                          setFormValue({
                            ...formValue,
                            gross: autoSalarySlab?.esimaxsalary === "undefined" || autoSalarySlab?.esimaxsalary === "" ? "" : autoSalarySlab?.esimaxsalary,
                            basic: autoSalarySlab?.basic === "undefined" || autoSalarySlab?.basic === "" ? "" : autoSalarySlab?.basic,
                            hra: autoSalarySlab?.hra === "undefined" || autoSalarySlab?.hra === "" ? "" : autoSalarySlab?.hra,
                            conveyance: autoSalarySlab?.conveyance === "undefined" || autoSalarySlab?.conveyance === "" ? "" : autoSalarySlab?.conveyance,
                            medicalallowance: autoSalarySlab?.medicalallowance === "undefined" || autoSalarySlab?.medicalallowance === "" ? "" : autoSalarySlab?.medicalallowance,
                            productionallowance: autoSalarySlab?.productionallowance === "undefined" || autoSalarySlab?.productionallowance === "" ? "" : autoSalarySlab?.productionallowance,
                            productionallowancetwo: autoSalarySlab?.productionallowancetwo === "undefined" || autoSalarySlab?.productionallowancetwo === "" ? "" : autoSalarySlab?.productionallowancetwo,
                            otherallowance: autoSalarySlab?.otherallowance === "undefined" || autoSalarySlab?.otherallowance === "" ? "" : autoSalarySlab?.otherallowance,
                          });
                          setCtc("");
                        } else {
                          setIsActive(false);
                          setFormValue({
                            ...formValue,
                            gross: "",
                            basic: "",
                            hra: "",
                            conveyance: "",
                            medicalallowance: "",
                            productionallowance: "",
                            productionallowancetwo: "",
                            otherallowance: "",
                          });
                          setCtc("");
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      maxMenuHeight={250}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      options={expDptDates
                        .filter((d) =>
                          oldDatalog.updatedate !== undefined ||
                            oldDatalog.updatedate !== "" ||
                            oldDatalog.updatedate != "undefined" // Problematic part
                            ? d.department === empDetailsform.department &&
                            d.fromdate >= oldDatalog.updatedate
                            : d.department === empDetailsform.department
                        )
                        .map((item) => ({
                          ...item,
                          label: item.fromdate,
                          value: item.fromdate,
                        }))}
                      value={{
                        label: formValue.startDate,
                        value: formValue.startDate,
                      }}
                      onChange={(e) => {
                        const mondatefilter = e?.value?.split("-");
                        const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09' ? "September" : mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08' ? "August" : mondatefilter[1] === '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06' ? "June" : mondatefilter[1] === '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04' ? "April" : mondatefilter[1] === '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March" : mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01' ? "January" : mondatefilter[1] === '1' ? "January" : "";
                        setFormValue({ ...formValue, startmonthlabel: getmonth, startmonth: mondatefilter[1], startyear: mondatefilter[0], startDate: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Emp Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={isActive}
                      placeholder="Please Enter Emp Code"
                      value={empDetailsform.empcode}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={isActive}
                      placeholder="Please Enter Employee Code"
                      value={empDetailsform.companyname}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  {salarySetUpForm.mode === "Manual" ? (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Salary Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Salary Code"
                        value={salarySetUpForm.salarycode}
                      />
                    </FormControl>
                  ) : (
                    <FormControl fullWidth size="small">
                      <Typography>Salary Code</Typography>
                      <Selects
                        isDisabled
                        options={salarySlabOpt
                          .filter(
                            (item) =>
                              item.processqueue === empDetailsform.process
                          )
                          .map((sc) => ({
                            ...sc,
                            value: sc.salarycode,
                            label: sc.salarycode,
                          }))}
                        value={{
                          label: salarySetUpForm.salarycode,
                          value: salarySetUpForm.salarycode,
                        }}
                        onChange={(e) => {
                          setSalarysetupForm({
                            ...salarySetUpForm,
                            salarycode: e.value,
                          });
                          fetchProfessionalTax(e.process, e.value);
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Start Month <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={formValue.startmonthlabel}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Start Year <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={formValue.startyear}
                      />
                    </FormControl>
                  </Grid>
                </>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Gross Salary <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Gross"
                      value={formValue.gross}
                      onChange={handleChangeGross}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Basic</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Basic"
                      value={formValue.basic}
                      onChange={handleChangeBasic}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>HRA</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter HRA"
                      value={formValue.hra}
                      onChange={handleChangeHra}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Conveyance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Conveyance"
                      value={formValue.conveyance}
                      onChange={handleChangeConveyance}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Medical Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Medical Allowance"
                      value={formValue.medicalallowance}
                      onChange={handleChangeMedAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Production Allowance"
                      value={formValue.productionallowance}
                      onChange={handleChangeProdAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Production Allowance 2"
                      value={formValue.productionallowancetwo}
                      onChange={handleChangeProdAllowtwo}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Other Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Other Allowance"
                      value={formValue.otherallowance}
                      onChange={handleChangeOtherAllow}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={formValue.esideduction}
                      disabled={salarySetUpForm.mode === "Auto"}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          esideduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>ESI Deduction</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={formValue.pfdeduction}
                      disabled={salarySetUpForm.mode === "Auto"}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          pfdeduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>PF Deduction</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <LoadingButton
                    loading={btnSubmit}
                    sx={buttonStyles.buttonsubmit}
                    onClick={editSubmit}
                  >
                    SAVE
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    CLEAR
                  </Button>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    Back
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
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

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ padding: "20px" }}>
          <Typography sx={userStyle.HeaderText}>
            Manual Salary Details Info
          </Typography>

          <Box>
            <br />
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelectInfo"
                    size="small"
                    value={pageSizeInfo}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeInfo}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={empDetailInfo?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQueryInfo}
                      onChange={handleSearchChangeInfo}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGridInfo
                rows={rowDataTableInfo}
                columns={columnDataTableInfo}
                onSelectionModelChange={handleSelectionChange}
                autoHeight={true}
                ref={gridRefinfo}
                density="compact"
                hideFooter
                getRowClassName={getRowClassName}
                disableRowSelectionOnClick
              />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredDataInfo.length > 0
                  ? (pageInfo - 1) * pageSizeInfo + 1
                  : 0}{" "}
                to {Math.min(pageInfo * pageSizeInfo, filteredDatasInfo.length)}{" "}
                of {filteredDatasInfo.length} entries
              </Box>
              <Box>
                <Button
                  onClick={() => setPageInfo(1)}
                  disabled={pageInfo === 1}
                  sx={userStyle.paginationbtn}
                >
                  <FirstPageIcon />
                </Button>
                <Button
                  onClick={() => handlePageChangeInfo(pageInfo - 1)}
                  disabled={pageInfo === 1}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateBeforeIcon />
                </Button>
                {pageNumbersInfo?.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    sx={userStyle.paginationbtn}
                    onClick={() => handlePageChangeInfo(pageNumber)}
                    className={pageInfo === pageNumber ? "active" : ""}
                    disabled={pageInfo === pageNumber}
                  >
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePageInfo < totalPagesInfo && <span>...</span>}
                <Button
                  onClick={() => handlePageChangeInfo(pageInfo + 1)}
                  disabled={pageInfo === totalPagesInfo}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateNextIcon />
                </Button>
                <Button
                  onClick={() => setPage(totalPagesInfo)}
                  disabled={pageInfo === totalPagesInfo}
                  sx={userStyle.paginationbtn}
                >
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>

            <br />
            <Button sx={buttonStyles.btncancel} onClick={handleCloseinfo}>
              {" "}
              Back{" "}
            </Button>
          </Box>
        </Box>
      </Dialog>


      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />

      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={items ?? []}
        filename={"Assign Manual Salary Details List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default Assignmanualsalarydetails;
