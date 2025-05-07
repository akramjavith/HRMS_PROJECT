import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
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
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { userStyle } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import dayjs from "dayjs";
import ExportData from "../../../components/ExportData";
import PageHeading from "../../../components/PageHeading";
import MessageAlert from "../../../components/MessageAlert.js";
import AlertDialog from "../../../components/Alert.js";
import { handleApiError } from "../../../components/Errorhandling";

function ManualEntryTimeStudyOverallReport() {
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

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  const [selectedOptionsLoginid, setSelectedOptionsLoginid] = useState([]);
  const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
  const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

  const [projectOpt, setProjmasterOpt] = useState([]);
  const [vendorOpt, setVendormasterOpt] = useState([]);
  const [companyOpt, setCompanyOpt] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);
  const [categoryOpt, setCategoryOPt] = useState([]);
  const [subcategory, setSubCategoryOpt] = useState([]);

  const [productionFilter, setProductionFilter] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);

  //FETCH DATA BATCHWISE
  const [allData, setAllData] = useState([]);
  const [batchNumber, setBatchNumber] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

  const handleLoadMoreClosePopup = () => {
    setIsLoadMorePopupOpen(false); // Close the popup without loading more
  };

  let exportColumnNames = ["Company", "Branch", "Unit", "Team", "Vendor", "Category", "SubCategory", "Unit Identifier", "EmpCode", "Emp Name", "LoginId", "Date", "CST", "UserName"];
  let exportRowValues = ["mode", "company", "branch", "unit", "team", "vendor", "filename", "category", "unitid", "empcode", "empname", "user", "dateval", "CST", "username"];

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

  const ShiftOpt = [
    { label: "Date Based", value: "Date Based" },
    { label: "Month Based", value: "Month Based" },
  ];

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthsArr[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);

  //yeardropdown
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  //month dropdown options
  const months = [
    { value: "January", label: "January", numval: 1 },
    { value: "February", label: "February", numval: 2 },
    { value: "March", label: "March", numval: 3 },
    { value: "April", label: "April", numval: 4 },
    { value: "May", label: "May", numval: 5 },
    { value: "June", label: "June", numval: 6 },
    { value: "July", label: "July", numval: 7 },
    { value: "August", label: "August", numval: 8 },
    { value: "September", label: "September", numval: 9 },
    { value: "October", label: "October", numval: 10 },
    { value: "November", label: "November", numval: 11 },
    { value: "December", label: "December", numval: 12 },
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    // updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
  };

  const [loginAllotFilter, setLoginAllotFilter] = useState([]);

  const [overallState, setOverallState] = useState({
    mode: "Please Select Production Mode",
    project: "Please Select Project",
    vendor: "Please Select Vendor",
    fromdate: today,
    alllogin: "Please Select Login",
    shift: "Date Based",
    todate: today,
    // fromtime: "",
    // totime: "",
    fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
    totime: dayjs("11:59:59 PM", "h:mm:ss A"),
    fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
    totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
  });

  //get all  company.
  const fetchCompany = async () => {
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : // isAssignBranch?.map((data) => ({
        //     // branch: data.branch,
        //     company: data.company,
        //     // unit: data.unit,
        //   }))
        isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (
              data?.modulenameurl?.length !== 0 &&
              data?.submodulenameurl?.length !== 0 &&
              data?.mainpagenameurl?.length !== 0 &&
              data?.subpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            // branch: data.branch,
            name: data.company,
            // unit: data.unit,
          }));

    try {
      let res = await axios.post(SERVICE.COMPANY_LIMITED_BY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
      });

      let companies = [...new Set(res?.data?.companies.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setCompanyOpt(companies);
      setSelectedOptionsCompany(companies);
      fetchBranchAll(companies);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all branch by company.
  const fetchBranchAll = async (company) => {
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (
              data?.modulenameurl?.length !== 0 &&
              data?.submodulenameurl?.length !== 0 &&
              data?.mainpagenameurl?.length !== 0 &&
              data?.subpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            name: data.branch,
            company: data.company,
            // unit: data.unit,
          }));
    try {
      let res_location = await axios.post(SERVICE.BRANCH_BY_COMPANY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        company: company.map((item) => item.value),
      });

      let branchOptfirstthree = [...new Set(res_location?.data?.branches.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setBranchOption(branchOptfirstthree);
      setSelectedOptionsBranch(branchOptfirstthree);
      fetchUnitAll(company, branchOptfirstthree);
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get unit by branch
  const fetchUnitAll = async (company, branch) => {
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (
              data?.modulenameurl?.length !== 0 &&
              data?.submodulenameurl?.length !== 0 &&
              data?.mainpagenameurl?.length !== 0 &&
              data?.subpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.length !== 0 &&
              data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            branch: data.branch,
            // company: data.company,
            // unit: data.unit,
          }));
    try {
      let res_location = await axios.post(SERVICE.UNIT_BY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        branch: branch.map((item) => item.value),
      });

      let units = [...new Set(res_location?.data?.units.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setUnitOption(units);
      setSelectedOptionsUnit(units);
      fetchTeamAll(company, branch, units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all Team.
  const fetchTeamAll = async (company, branch, unit) => {
    // let unitArr = e.map(data => data.name)

    try {
      let res_location = await axios.post(SERVICE.TEAMS_BY_UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company.map((item) => item.value),
        branch: branch.map((item) => item.value),
        unit: unit.map((item) => item.value),
      });
      // const TeamOpt = res_location?.data?.teamsdetails?.filter((t) => unitArr.includes(t.unit))
      let TeamOpt = [...new Set(res_location?.data?.teamsdetails.map((data) => data.teamname))].map((name) => ({
        label: name,
        value: name,
      }));

      setTeamOption(TeamOpt);
      setSelectedOptionsTeam(TeamOpt);
      fetchEmployeesAll(company, branch, unit, TeamOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all project.
  const fetchProjMaster = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projectopt = res_project?.data?.projmaster.map((item) => ({
        ...item,
        label: item.name,
        value: item.name,
      }));

      setProjmasterOpt(projectopt);
      setSelectedProject(projectopt);
      await fetchVendor(projectopt);
      await fetchAllCategory(projectopt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all Sub vendormasters.
  const fetchVendor = async (project) => {
    try {
      let res_vendor = await axios.post(SERVICE.VENDORMASTER_LIMITED_BYPROJECT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: project.map((t) => t.value),
      });

      const projFilt = [...new Set(res_vendor?.data?.vendormaster?.map((data) => data.name))].map((t) => ({
        ...t,
        label: t,
        value: t,
      }));
      setVendormasterOpt(projFilt);
      // let vendoryOptfirstthree = projFilt.filter((d, index) => index <= 2);
      // let prodjectvalue = vendoryOptfirstthree.length > 0 ? vendoryOptfirstthree : [];
      setSelectedVendor(projFilt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all category.
  const fetchAllCategory = async (project) => {
    try {
      let res_module = await axios.post(SERVICE.CATEGORYPROD_LIMITED_REPORT_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        projectvendor: project.map((t) => t.value),
      });
      const uniques = [...new Set(res_module?.data?.categoryprod.map((item) => item.name))];
      const categoryOpt = uniques.map((d) => ({
        label: d,
        value: d,
      }));
      setCategoryOPt(categoryOpt);

      // let categoryOptfirstthree = categoryOpt.filter((d, index) => index <= 2);

      // let prodjectvalue = categoryOptfirstthree.length > 0 ? categoryOptfirstthree : [];
      setSelectedOptionsCategory(categoryOpt);
      fetchAllSubCategory(project, categoryOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all category.
  const fetchAllSubCategory = async (project, category) => {
    try {
      let res_module = await axios.post(SERVICE.SUBCATEGORYPROD_LIMITED_REPORT_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: project.map((item) => item.value),
        category: category.map((item) => item.value),
      });
      const uniques = [...new Set(res_module?.data?.subcategoryprod.map((item) => item.name))];

      const projFilt = uniques.map((d) => ({
        label: d,
        value: d,
      }));

      setSubCategoryOpt(projFilt);
      setSelectedOptionsSubCategory(projFilt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchAllLogins = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERID_REPORT_LIMITED_IDSONLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alluseridNamesadmin = [...new Set(res_vendor?.data?.clientuserid?.map((data) => data.userid))].map((t) => ({
        ...t,
        label: t,
        value: t,
      }));
      setLoginAllotFilter(alluseridNamesadmin);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchEmployeesAll = async (company, branch, unit, team) => {
    try {
      let res = await axios.post(SERVICE.USER_PROD_LIMITED_REPORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company.map((item) => item.value),
        branch: branch.map((item) => item.value),
        unit: unit.map((item) => item.value),
        team: team.map((item) => item.value),
      });
      const allusers = [...new Set(res?.data?.users?.map((data) => data.companyname))].map((t) => ({
        ...t,
        label: t,
        value: t,
      }));
      setEmployeeOption(allusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options);
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Employee";
  };

  //employee multiselect dropdown changes
  const handleLoginChangeFrom = (options) => {
    setSelectedOptionsLoginid(options);
  };
  const customValueRendererLoginFrom = (valueLoginCat, _employeename) => {
    return valueLoginCat.length ? valueLoginCat.map(({ label }) => label).join(", ") : "Please Select Login";
  };

  useEffect(() => {
    fetchAllLogins();
  }, []);

  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  const fetchBatchFilter = async (batchNum) => {
    setProductionFilter([]);
    let startMonthDate = new Date(overallState.fromdate);
    // let endMonthDate = new Date(overallState.todate);
    let firstDate = new Date(overallState.todate);
    let enddate = firstDate.setDate(firstDate.getDate() + 1);
    let endMonthDate = new Date(enddate);

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
          ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
          : getWeekNumberInMonth(startMonthDate) === 3
          ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
          : getWeekNumberInMonth(startMonthDate) > 3
          ? `${getWeekNumberInMonth(startMonthDate)}th Week`
          : "";

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    setSourcecheck(true);
    setIsLoading(true);
    let allData = [];
    let hasMoreData = true;
    // Filter the subcategories based on selected categories
    const filteredSubcategories = subcategory.filter((sub) => selectedOptionsCategory.map((item) => item.value).includes(sub.categoryname));

    const resultmanual = filteredSubcategories
      .filter((item) => selectedOptionsSubCategory.map((item) => item.value).includes(item.name))
      .map((sub) => ({
        category: `${sub.categoryname}`, // Append .xlsx to the category name
        subcategory: sub.name,
      }));

    let resultvendor = [];
    selectedProject
      .map((d) => d.value)
      .forEach((proj) => {
        selectedVendor
          .map((d) => d.value)
          .forEach((vend) => {
            if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
              resultvendor.push(`${proj}-${vend}`);
            }
          });
      });
    let projvendor = [...new Set(resultvendor)];
    const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));

    try {
      const response = await axios.post(
        SERVICE.MANUAL_CLIENT_INFO_FILTER,
        {
          company: isRoleManager ? [] : selectedOptionsCompany.map((item) => item.value).length > 0 ? selectedOptionsCompany.map((item) => item.value) : companyOpt.map((d) => d.value),
          branch: isRoleManager ? [] : selectedOptionsBranch.map((item) => item.value).length > 0 ? selectedOptionsBranch.map((item) => item.value) : branchOption.map((d) => d.value),
          unit: isRoleManager ? [] : selectedOptionsUnit.map((item) => item.value).length > 0 ? selectedOptionsUnit.map((item) => item.value) : unitOption.map((d) => d.value),
          team: selectedOptionsTeam.map((d) => d.value),

          // branch: selectedOptionsBranch.map((item) => item.value),
          // unit: selectedOptionsUnit.map((item) => item.value),
          // team: selectedOptionsTeam.map((item) => item.value),

          userDates: daysArray,
          projectvendor: projvendor,
          subsmanual: resultmanual,
          empname: selectedEmployeeFrom.map((item) => item.value),
          user: selectedOptionsLoginid.map((item) => item.value),
          filename: selectedOptionsCategory.map((item) => item.value),

          fromdate: overallState.fromdate,
          todate: overallState.todate,

          fromYear: Number(selectedYear),
          fromMonth: Number(selectedMonthNum),
          shift: overallState.shift,

          batchNumber: batchNum,
          batchSize: 10000,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      if (response.data.count === 0) {
        setHasMoreData(false);
        setSourcecheck(false);
        setIsLoading(false);
        if (productionFilter.length > 0) {
          setPopupContentMalert("Fully Loaded");
          setPopupSeverityMalert("success");
          handleClickOpenPopupMalert();
        }
      } else {
        const filtered = response.data.mergedData.filter((item) => item != null);

        setProductionFilter(filtered);
        setBatchNumber(batchNum);
        setSourcecheck(false);
        setIsLoading(false);
        if (filtered.length > 0) {
          setIsLoadMorePopupOpen(true);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSourcecheck(false);
      setIsLoading(false);
      setHasMoreData(false);
    } finally {
      setSourcecheck(false);
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const fetchBatch = async (batchNum) => {
    let startMonthDate = new Date(overallState.fromdate);
    // let endMonthDate = new Date(overallState.todate);
    let firstDate = new Date(overallState.todate);
    let enddate = firstDate.setDate(firstDate.getDate() + 1);
    let endMonthDate = new Date(enddate);

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", { weekday: "long" });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
          ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
          : getWeekNumberInMonth(startMonthDate) === 3
          ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
          : getWeekNumberInMonth(startMonthDate) > 3
          ? `${getWeekNumberInMonth(startMonthDate)}th Week`
          : "";

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    setSourcecheck(true);
    setIsLoading(true);
    let allData = [];
    let hasMoreData = true;
    // Filter the subcategories based on selected categories
    const filteredSubcategories = subcategory.filter((sub) => selectedOptionsCategory.map((item) => item.value).includes(sub.categoryname));

    const resultmanual = filteredSubcategories
      .filter((item) => selectedOptionsSubCategory.map((item) => item.value).includes(item.name))
      .map((sub) => ({
        category: `${sub.categoryname}`, // Append .xlsx to the category name
        subcategory: sub.name,
      }));

    let resultvendor = [];
    selectedProject
      .map((d) => d.value)
      .forEach((proj) => {
        selectedVendor
          .map((d) => d.value)
          .forEach((vend) => {
            if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
              resultvendor.push(`${proj}-${vend}`);
            }
          });
      });
    let projvendor = [...new Set(resultvendor)];
    const isRoleManager = ["Manager", "Director", "Admin", "SuperAdmin", "ADMIN"].some((rl) => isUserRoleAccess.role.includes(rl));

    try {
      const response = await axios.post(
        SERVICE.MANUAL_CLIENT_INFO_FILTER,
        {
          company: isRoleManager ? [] : selectedOptionsCompany.map((item) => item.value).length > 0 ? selectedOptionsCompany.map((item) => item.value) : companyOpt.map((d) => d.value),
          branch: isRoleManager ? [] : selectedOptionsBranch.map((item) => item.value).length > 0 ? selectedOptionsBranch.map((item) => item.value) : branchOption.map((d) => d.value),
          unit: isRoleManager ? [] : selectedOptionsUnit.map((item) => item.value).length > 0 ? selectedOptionsUnit.map((item) => item.value) : unitOption.map((d) => d.value),
          team: selectedOptionsTeam.map((d) => d.value),

          userDates: daysArray,
          projectvendor: projvendor,
          subsmanual: resultmanual,
          empname: selectedEmployeeFrom.map((item) => item.value),
          user: selectedOptionsLoginid.map((item) => item.value),
          filename: selectedOptionsCategory.map((item) => item.value),

          fromdate: overallState.fromdate,
          todate: overallState.todate,

          fromYear: Number(selectedYear),
          fromMonth: Number(selectedMonthNum),
          shift: overallState.shift,

          batchNumber: batchNum,
          batchSize: 10000,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      if (response.data.count === 0) {
        setHasMoreData(false);
        setSourcecheck(false);
        setIsLoading(false);

        setPopupContentMalert("Fully Loaded");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();
      } else {
        const filtered = response.data.mergedData.filter((item) => item != null);
        setAllData((prevData) => [...prevData, ...filtered]);
        setProductionFilter((prevData) => [...prevData, ...filtered]);
        setBatchNumber(batchNum);
        setSourcecheck(false);
        setIsLoading(false);
        setIsLoadMorePopupOpen(true);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSourcecheck(false);
      setIsLoading(false);
      setHasMoreData(false);
    } finally {
      setSourcecheck(false);
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    const nextBatchNumber = batchNumber + 1;
    setBatchNumber(nextBatchNumber);
    fetchBatch(nextBatchNumber);
  };
  const handleLoadMore = () => {
    setIsLoadMorePopupOpen(false); // Close the popup
    const nextBatchNumber = batchNumber + 1;
    setBatchNumber(nextBatchNumber);
    fetchBatch(nextBatchNumber); // Fetch the next batch
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Manual Overall_Report.png");
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
    company: true,
    branch: true,
    dateval: true,
    unit: true,
    team: true,
    project: true,
    vendor: true,
    category: true,
    filename: true,
    actionsstatus: true,
    unitid: true,
    approvalstatus: true,
    lateentrystatus: true,
    empcode: true,
    empname: true,
    username: true,
    user: true,
    fromdate: true,
    todate: true,
    section: true,
    flagcount: true,
    points: true,
    unitrate: true,
    status: true,
    csection: true,
    cflagcount: true,
    cpoints: true,
    cunitrate: true,

    worktook: true,
    createdAt: true,
    cstist: true,
    totalpoints: true,
    dupe: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleCategoryChange = (options) => {
    fetchAllSubCategory(selectedProject, options);
    setSelectedOptionsCategory(options);
    setSelectedOptionsSubCategory([]);
  };

  const handleSubCategoryChange = (options) => {
    // setValueSubCat(
    //   options.map((a, index) => {
    //     return a.value;
    //   })
    // );
    setSelectedOptionsSubCategory(options);
  };

  const handleCompanyChange = (options) => {
    fetchBranchAll(options);
    setSelectedOptionsCompany(options);
    fetchUnitAll(options, selectedOptionsBranch);
    fetchEmployeesAll(options, selectedOptionsBranch, selectedOptionsUnit, selectedOptionsTeam);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
  };

  const handleBranchChange = (options) => {
    setSelectedOptionsBranch(options);
    fetchUnitAll(selectedOptionsCompany, options);
    fetchEmployeesAll(selectedOptionsCompany, options, selectedOptionsUnit, selectedOptionsTeam);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
  };

  const handleUnitChange = (options) => {
    setSelectedOptionsUnit(options);
    fetchTeamAll(selectedOptionsCompany, selectedOptionsBranch, options);
    fetchEmployeesAll(selectedOptionsCompany, selectedOptionsBranch, options, selectedOptionsTeam);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
  };

  const handleTeamChange = (options) => {
    setSelectedOptionsTeam(options);
    fetchEmployeesAll(selectedOptionsCompany, selectedOptionsBranch, selectedOptionsUnit, options);
    setSelectedEmployeeFrom([]);
  };

  const handleProjectChange = (options) => {
    setSelectedProject(options);
    fetchVendor(options);
    fetchAllCategory(options);
    fetchAllSubCategory(options, selectedOptionsCategory);
    setSelectedVendor([]);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
  };

  const handleVendorChange = (options) => {
    setSelectedVendor(options);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(", ") : "Please Select Company";
  };

  const customValueRendererProject = (valueProject, _categoryname) => {
    return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
  };

  const customValueRendererVendor = (valueVendor, _categoryname) => {
    return valueVendor?.length ? valueVendor.map(({ label }) => label)?.join(", ") : "Please Select Vendor";
  };

  const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
    return valueCompanyCategory?.length ? valueCompanyCategory.map(({ label }) => label)?.join(", ") : "Please Select Category";
  };

  const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
    return valueSubCat?.length ? valueSubCat.map(({ label }) => label)?.join(", ") : "Please Select SubCategory";
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(", ") : "Please Select Branch";
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(", ") : "Please Select Unit";
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(", ") : "Please Select Team";
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  // function daysBetweenDates(date1, date2) {
  //   const diffTime = Math.abs(date2 - date1);
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // }
  // const difference = daysBetweenDates(new Date(overallState.fromdate), new Date(overallState.todate));

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    setPageName(!pageName);
    if (overallState.fromdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select FromDate"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (overallState.todate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select ToDate"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (overallState.fromdate !== overallState.todate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Single Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedProject.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Project"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsCategory.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Category"}</p>
        </>
      );
      handleClickOpenerr();
    }

    // else if (selectedOptionsCategory.length > 3) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Categories"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (selectedOptionsSubCategory.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sub Category"}</p>
        </>
      );
      handleClickOpenerr();
    }

    // else if (selectedOptionsSubCategory.length > 3) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Sub Categories"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (selectedOptionsSubCategory.length > 3 && difference > 1) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"For more than 3 Sub Categories, The Date Range Should not be More Than 2 days"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (overallState.shift === "Date Based" && overallState.totime < overallState.fromtime) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"To Time must be greater than or equal to From Time"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchBatchFilter(1);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setOverallState({
      mode: "Please Select Production Mode",
      project: "Please Select Project",
      vendor: "Please Select Vendor",
      fromdate: today,
      todate: today,
      fromtime: "",
      totime: "",
      alllogin: "Please Select Login",
      shift: "Date Based",
    });
    setSelectedYear(yyyy);
    setSelectMonthName(currentMonth);
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
    setVendormasterOpt([]);
    setTeamOption([]);
    setBranchOption([]);
    setUnitOption([]);
    setEmployeeOption([]);
    setProductionFilter([]);
    setSelectedProject([]);
    setSelectedVendor([]);
    setCategoryOPt([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
      </>
    );
    handleClickOpenerr();
  };

  // pdf.....
  const columns = [
    { title: "Sno", dataKey: "serialNumber" },
    { title: "Mode", dataKey: "mode" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Vendor", dataKey: "vendor" },
    { title: "Category", dataKey: "filename" },
    { title: "SubCategory", dataKey: "category" },
    { title: "Unit Identifier", dataKey: "unitid" },

    { title: "Employee Name", dataKey: "empname" },
    { title: "Employee Code", dataKey: "empcode" },
    { title: "LoginId", dataKey: "user" },
    { title: "Date", dataKey: "dateval" },

    { title: "U-Points", dataKey: "points" },
    { title: "U-Unitrate", dataKey: "unitrate" },
    { title: "U-Section", dataKey: "section" },
    { title: "U-Flag Count", dataKey: "flagcount" },

    { title: "A-Points", dataKey: "cpoints" },
    { title: "A-Unitrate", dataKey: "cunitrate" },
    { title: "A-Section", dataKey: "csection" },
    { title: "A-Flag Count", dataKey: "cflagcount" },

    { title: "WorkTook", dataKey: "worktook" },
    { title: "Total Points", dataKey: "totalpoints" },
    { title: "User Name", dataKey: "username" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const maxColumnsPerPage = 10; // Maximum number of columns per page
    const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

      const currentPageColumns = columns.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTable,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }
    doc.save("ManualEntry TimeStudy Overall Report.pdf");
  };

  // Excel
  const fileName = "ManualEntry TimeStudy Overall Report";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ManualEntry TimeStudy Overall Report",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchCompany();
    fetchProjMaster();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = productionFilter?.map((item, index) => {
      let totalPointsCalcValue = item.cpoints ? Number(item.cpoints) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount)) : Number(item.points) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount));
      const fromDate = new Date(item.createdAt);
      const fromDatePlus24Hours = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
      const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);
      const fromDatePlus48Hours = new Date(fromDaten.getTime() + 48 * 60 * 60 * 1000);

      return {
        ...item,
        serialNumber: index + 1,
        fromdate: moment(item.fromdate).format("DD/MM/yyyy"),
        todate: moment(item.todate).format("DD/MM/yyyy"),
        totalpoints: Number(totalPointsCalcValue).toFixed(4),
        points: Number(item.points).toFixed(4),
        dupe: item.dupe ? item.dupe : "No",
        lateentrystatus: fromDate > fromDatePlus48Hours ? "Late Entry" : "On Entry",
        approvalstatus:
          (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved"
            ? ""
            : new Date() <= fromDatePlus24Hours && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)
            ? "Pending"
            : new Date() > fromDatePlus24Hours && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)
            ? "Late Not Approval"
            : new Date() > fromDatePlus24Hours && item.approvaldate
            ? "Late Approval"
            : "On Approval",
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [productionFilter]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);

    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setPage(1);
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "vendor", headerName: "Project", flex: 0, width: 160, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
    { field: "filename", headerName: "Category", flex: 0, width: 280, hide: !columnVisibility.filename, headerClassName: "bold-header" },
    { field: "category", headerName: "Sub Category", flex: 0, width: 350, hide: !columnVisibility.category, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Unit Identifier", flex: 0, width: 240, hide: !columnVisibility.unitid, headerClassName: "bold-header" },

    { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    { field: "empname", headerName: "Emp Name", flex: 0, width: 260, hide: !columnVisibility.empname, headerClassName: "bold-header" },
    { field: "user", headerName: "LogIn Id", flex: 0, width: 100, hide: !columnVisibility.user, headerClassName: "bold-header" },
    { field: "dateval", headerName: "Date", flex: 0, width: 160, hide: !columnVisibility.dateval, headerClassName: "bold-header" },
    { field: "cstist", headerName: "CST", flex: 0, width: 190, hide: !columnVisibility.cstist, headerClassName: "bold-header" },

    // { field: "worktook", headerName: "Worktook", flex: 0, width: 140, hide: !columnVisibility.worktook, headerClassName: "bold-header" },
    // { field: "unitrate", headerName: "U-Unitrate", flex: 0, width: 100, hide: !columnVisibility.unitrate, headerClassName: "bold-header" },
    // { field: "points", headerName: "U-Points", flex: 0, width: 100, hide: !columnVisibility.points, headerClassName: "bold-header" },
    // { field: "section", headerName: "U-Section", flex: 0, width: 100, hide: !columnVisibility.section, headerClassName: "bold-header" },
    // { field: "flagcount", headerName: "U-Flag Count", flex: 0, width: 100, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
    // { field: "cunitrate", headerName: "A-Unitrate", flex: 0, width: 100, hide: !columnVisibility.cunitrate, headerClassName: "bold-header" },
    // { field: "cpoints", headerName: "A-Points", flex: 0, width: 100, hide: !columnVisibility.cpoints, headerClassName: "bold-header" },
    // { field: "csection", headerName: "A-Section", flex: 0, width: 100, hide: !columnVisibility.csection, headerClassName: "bold-header" },
    // { field: "cflagcount", headerName: "A-Flag Count", flex: 0, width: 100, hide: !columnVisibility.cflagcount, headerClassName: "bold-header" },
    // { field: "totalpoints", headerName: "Total Points", flex: 0, width: 100, hide: !columnVisibility.totalpoints, headerClassName: "bold-header" },
    { field: "username", headerName: "User Name", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      project: item.project,
      worktook: item.worktook,
      createdAt: item.createdAt,
      vendor: item.vendor,
      filename: item.filename,
      category: item.category,
      dateval: item.dateval,
      subcategory: item.subcategory,
      empcode: item.empcode,
      empname: item.empname,
      username: item.username,
      user: item.user,
      fromdate: item.fromdate,
      todate: item.todate,
      totalpoints: item.totalpoints,
      unitrate: item.unitrate,
      cunitrate: item.cunitrate,
      approvalstatus: item.approvalstatus,
      lateentrystatus: item.lateentrystatus,
      approvaldate: item.approvaldate,
      status: item.status,
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

  // // Function to filter columns based on search query
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
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
      {/* <Headtitle title={'ManualEntry TimeStudy Overall Report'} /> */}
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>ManualEntry TimeStudy Overall Report</Typography> */}
      <PageHeading title="ManualEntry TimeStudy Overall Report" modulename="Production" submodulename="Reports" mainpagename="Original" subpagename="ManualEntry TimeStudy Overall Report Filter" subsubpagename="" />
      <Box sx={userStyle.dialogbox}>
        <>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Company</Typography>
                <MultiSelect
                  options={companyOpt}
                  value={selectedOptionsCompany}
                  onChange={(e) => {
                    handleCompanyChange(e);
                  }}
                  valueRenderer={customValueRendererCompany}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Branch</Typography>
                <MultiSelect
                  options={branchOption}
                  value={selectedOptionsBranch}
                  onChange={(e) => {
                    handleBranchChange(e);
                  }}
                  valueRenderer={customValueRendererBranch}
                  labelledBy="Please Select Branch"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Unit</Typography>
                <MultiSelect
                  options={unitOption}
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
                <Typography>Team</Typography>
                <MultiSelect
                  options={teamOption}
                  value={selectedOptionsTeam}
                  onChange={(e) => {
                    handleTeamChange(e);
                  }}
                  valueRenderer={customValueRendererTeam}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth>
                <Typography>
                  Project
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={projectOpt}
                  value={selectedProject}
                  onChange={(e) => {
                    handleProjectChange(e);
                  }}
                  valueRenderer={customValueRendererProject}
                  labelledBy="Please Select Project"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth>
                <Typography>Vendor</Typography>
                <MultiSelect
                  options={vendorOpt}
                  value={selectedVendor}
                  onChange={(e) => {
                    handleVendorChange(e);
                  }}
                  valueRenderer={customValueRendererVendor}
                  labelledBy="Please Select Vendor"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Mode</Typography>
                <Selects
                  options={ShiftOpt}
                  value={{ label: overallState.shift, value: overallState.shift }}
                  onChange={(e) => {
                    setOverallState({
                      ...overallState,
                      shift: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  From Date <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  disabled={overallState.shift === "Month Based"}
                  value={overallState.fromdate}
                  // onChange={(e) => {
                  //     setOverallState({ ...overallState, fromdate: e.target.value });
                  // }}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    // Ensure that the selected date is not in the future
                    const currentDate = new Date().toISOString().split("T")[0];
                    if (selectedDate <= currentDate) {
                      // setSelectedFromdate(selectedDate);
                      // setSelectedTodate(selectedDate);
                      setOverallState({ ...overallState, fromdate: selectedDate, todate: selectedDate });
                    } else {
                    }
                  }}
                  // Set the max attribute to the current date
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  To Date <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  disabled={overallState.shift === "Month Based"}
                  value={overallState.todate}
                  // onChange={(e) => {
                  //     setOverallState({ ...overallState, todate: e.target.value });
                  // }}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    // Ensure that the selected date is not in the future
                    const currentDate = new Date().toISOString().split("T")[0];
                    const fromdateval = overallState.fromdate != "" && new Date(overallState.fromdate).toISOString().split("T")[0];
                    if (overallState.fromdate == "") {
                      setShowAlert(
                        <>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                          <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                        </>
                      );
                      handleClickOpenerr();
                    } else if (selectedDate < fromdateval) {
                      setShowAlert(
                        <>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                          <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                        </>
                      );
                      handleClickOpenerr();

                      setOverallState({ ...overallState, todate: "" });
                    } else if (selectedDate <= currentDate) {
                      // setSelectedTodate(selectedDate);
                      setOverallState({ ...overallState, todate: selectedDate });
                    } else {
                    }
                  }}
                  // Set the max attribute to the current date
                  inputProps={{ max: new Date().toISOString().split("T")[0], min: overallState.fromdate !== "" ? overallState.fromdate : null }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Year<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects options={years} isDisabled={overallState.shift === "Date Based"} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Month <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects options={selectedYear === "Select Year" ? [] : months} isDisabled={overallState.shift === "Date Based"} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth>
                <Typography>
                  Category<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={categoryOpt}
                  value={selectedOptionsCategory}
                  onChange={(e) => {
                    handleCategoryChange(e);
                    // setOverallState({
                    //   ...overallState,
                    //   raisedby: "Please Select Category",
                    // });
                  }}
                  valueRenderer={customValueRendererCategory}
                  labelledBy="Please Select Category"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth>
                <Typography>
                  Sub Category<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={subcategory}
                  value={selectedOptionsSubCategory}
                  onChange={(e) => {
                    handleSubCategoryChange(e);
                    // setOverallState({
                    //   ...overallState,
                    //   raisedby: "Please Select SubCategory",
                    // });
                  }}
                  valueRenderer={customValueRendererSubCategory}
                  labelledBy="Please Select SubCategory"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>All Login Id</Typography>
                <MultiSelect options={loginAllotFilter} value={selectedOptionsLoginid} onChange={handleLoginChangeFrom} valueRenderer={customValueRendererLoginFrom} labelledBy="Please Select Login" />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Employee Name</Typography>
                <MultiSelect options={employeeOption} value={selectedEmployeeFrom} onChange={handleEmployeeChangeFrom} valueRenderer={customValueRendererEmployeeFrom} labelledBy="Please Select Employeename" />
              </FormControl>
            </Grid>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <br />
            <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <Button
                variant="contained"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Filter
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                CLEAR
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>

      <br />
      {/* ****** Table Start ****** */}

      <Box sx={userStyle.container}>
        {/* ******************************************************EXPORT Buttons****************************************************** */}
        <Grid item xs={8}>
          <Typography sx={userStyle.importheadtext}>ManualEntry TimeStudy Overall Report</Typography>
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
                <MenuItem value={productionFilter?.length}>All</MenuItem>
              </Select>
            </Box>
          </Grid>
          <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box>
              {isUserRoleCompare?.includes("excelmanualentrytimestudyoverallreport") && (
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
              {isUserRoleCompare?.includes("csvmanualentrytimestudyoverallreport") && (
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
              {isUserRoleCompare?.includes("printmanualentrytimestudyoverallreport") && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>
                    &ensp;
                    <FaPrint />
                    &ensp;Print&ensp;
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("pdfmanualentrytimestudyoverallreport") && (
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
              {isUserRoleCompare?.includes("imagemanualentrytimestudyoverallreport") && (
                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                  {" "}
                  <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item md={2} xs={6} sm={6}>
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
        {/* Show "Load More" button if there's more data */}
        {hasMoreData && !isLoading && productionFilter.length > 0 && (
          <Button variant="contained" onClick={loadMore}>
            Load More
          </Button>
        )}
        <br />
        <br />
        {sourceCheck ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {/* <CircularProgress color="inherit" />  */}
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                rows={rowsWithCheckboxes}
                columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
              </Box>
              <Box>
                <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                  <FirstPageIcon />
                </Button>
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                  <NavigateBeforeIcon />
                </Button>
                {pageNumbers?.map((pageNumber) => (
                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePage < totalPages && <span>...</span>}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                  <NavigateNextIcon />
                </Button>
                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Delete Modal */}
      <Box>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Unit Identifier</TableCell>

                <TableCell>EmpCode</TableCell>
                <TableCell>Emp Name</TableCell>
                <TableCell>LoginId</TableCell>
                <TableCell>Date</TableCell>

                <TableCell>U-Unitrate</TableCell>
                <TableCell>U-Points</TableCell>
                <TableCell>U-Section</TableCell>
                <TableCell>U-FlagCount</TableCell>

                <TableCell>A-Unitrate</TableCell>
                <TableCell>A-Points</TableCell>
                <TableCell>A-Section</TableCell>
                <TableCell>A-FlagCount</TableCell>

                <TableCell>Total Points</TableCell>
                <TableCell>WorkTook</TableCell>
                <TableCell>UserName</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.unitid}</TableCell>

                    <TableCell>{row.empcode}</TableCell>
                    <TableCell>{row.empname}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.dateval}</TableCell>

                    <TableCell>{row.unitrate}</TableCell>
                    <TableCell>{row.points}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.flagcount}</TableCell>

                    <TableCell>{row.cunitrate}</TableCell>
                    <TableCell>{row.cpoints}</TableCell>
                    <TableCell>{row.csection}</TableCell>
                    <TableCell>{row.cflagcount}</TableCell>

                    <TableCell>{row.totalpoints}</TableCell>
                    <TableCell>{row.worktook}</TableCell>
                    <TableCell>{row.username}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        {/* ALERT DIALOG */}
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
      </Box>

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={"ManualEntry TimeStudy Overall Report"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog open={isLoadMorePopupOpen} onClose={handleLoadMoreClosePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "60px", color: "skyblue" }} />
          <Typography variant="h6">Loaded {productionFilter.length} Data</Typography>
          <Typography variant="body1"> Do you want to load more data?</Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.btncancel} onClick={handleLoadMoreClosePopup}>
            No
          </Button>
          <Button sx={buttonStyles.buttonsubmit} onClick={handleLoadMore} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default ManualEntryTimeStudyOverallReport;