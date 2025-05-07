import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Grid, Button, OutlinedInput, DialogActions, Dialog, DialogContent, Select, MenuItem, FormControl } from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Headtitle from "../../../../components/Headtitle";
import moment from "moment-timezone";
import { handleApiError } from "../../../../components/Errorhandling";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import TaskallAdmin from "../taskadmin/tasklistadmin";
import PageHeading from "../../../../components/PageHeading";
import ExportData from "../../../../components/ExportData";
import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";


function Tasklist() {
  const priorityColors = {
    "urgent": "#8B0000",  // DarkRed (darker shade for urgent, high urgency)
    "very high": "#FF4500", // OrangeRed (distinct from urgent, bright red)
    high: "#FF6347",        // Tomato (lighter than "very high" and "urgent")
    medium: "#1E90FF",      // DodgerBlue (clear blue for medium)
    low: "#32CD32",         // LimeGreen (vivid, bright green for low priority)
    "very low": "#90EE90",  // LightGreen (softer green for very low priority)
  };
  const [taskTypeName, setTaskTypeName] = useState("Please Select Type");
  const [designation, setDesignation] = useState([]);
  const [department, setDepartment] = useState([]);
  const [employeesNames, setEmployeesNames] = useState([]);
  let [valueDesignation, setValueDesignation] = useState([]);
  const [selectedDesignationOptions, setSelectedDesignationOptions] = useState([]);

  let [valueDepartment, setValueDepartment] = useState([]);
  const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState([]);
  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([])
  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  let [valueEmployee, setValueEmployee] = useState([]);
  const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState([]);
  const pathname = window.location.pathname;
  const { auth } = useContext(AuthContext);
  const [isTaskdots, setIsTaskdots] = useState(true);
  const [Accessdrop, setAccesDrop] = useState("");
  const { isUserRoleAccess, isUserRoleCompare, pageName, isAssignBranch, allTeam, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");

  // AssignBranch For Users
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchaddress: data?.branchaddress,
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
        branchaddress: data?.branchaddress
      }));


  const fetchDesignation = async () => {
    setPageName(!pageName);
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchDepartments = async () => {
    setPageName(!pageName);
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchDesignation();
    fetchDepartments();
  }, [])

  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);

  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setfilteralert(false);
    setfilteralertmsg("");
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
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const [fromDate, setFromDate] = useState(formattedDate)
  const [toDate, setToDate] = useState(formattedDate)

  // FILTER DROPDOWNS
  const [project, setProject] = useState([]);
  const [subProject, setSubProject] = useState([]);
  const [module, setModule] = useState([]);
  const [subModule, setSubModule] = useState([]);
  const [mainpageTypeDropdown, setMainpageTypeDropdown] = useState([]);
  const [subpageTypeDropdown, setSubpageTypeDropdown] = useState([]);
  const [subsubpageTypeDropdown, setsubSubpageTypeDropdown] = useState([]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Task Board"),
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
    getapi();
  }, []);

  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedSubProject, setSelectedSubProject] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedSubModule, setSelectedSubModule] = useState([]);
  const [selectedMainpage, setSelectedMainpage] = useState([]);
  const [selectedSubpage, setSelectedSubpage] = useState([]);
  const [selectedSubSubpage, setSelectedSubSubpage] = useState([]);

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


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [userTasks, setUserTasks] = useState([]);
  const [userTasksDev, setUserTasksDev] = useState([]);
  const [userTasksTest, setUserTasksTest] = useState([]);


  const handleFilter = (e) => {
    e.preventDefault();
    const mangerAccess = isUserRoleAccess.role.includes("Manager") && Accessdrop === "all";

    if (mangerAccess && (taskTypeName === "Please Select Type" || taskTypeName === undefined || taskTypeName === "")) {

      setPopupContentMalert('Please Select Type');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
      setfilteralertmsg("Please Select Type")
    }
    else if (mangerAccess && taskTypeName === "Designation" && selectedDesignationOptions?.length < 1) {

      setPopupContentMalert('Please Select Designation');
      setfilteralertmsg('Please Select Designation');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    }
    else if (mangerAccess && taskTypeName === "Department" && selectedDepartmentOptions?.length < 1) {

      setPopupContentMalert('Please Select Department');
      setfilteralertmsg('Please Select Department');
      setPopupSeverityMalert("info");
      setfilteralert(true);
      handleClickOpenPopupMalert();
    }
    else if (mangerAccess && taskTypeName === "Employee" && selectedOptionsCompany?.length < 1) {

      setPopupContentMalert('Please Select Company');
      setfilteralertmsg('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    }
    else if (mangerAccess && taskTypeName === "Employee" && selectedOptionsBranch?.length < 1) {

      setPopupContentMalert('Please Select Branch');
      setfilteralertmsg('Please Select Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    }
    else if (mangerAccess && taskTypeName === "Employee" && selectedOptionsUnit?.length < 1) {

      setPopupContentMalert('Please Select Unit');
      setfilteralertmsg('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);

    }
    else if (mangerAccess && taskTypeName === "Employee" && selectedOptionsTeam?.length < 1) {

      setPopupContentMalert('Please Select Team');
      setfilteralertmsg('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    }
    else if (mangerAccess && taskTypeName !== "Please Select Type" && selectedEmployeeOptions?.length < 1) {

      setPopupContentMalert('Please Select Employee Names');
      setfilteralertmsg('Please Select Employee Names');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    }
    else if (!mangerAccess && selectedProject.length === 0 && selectedSubProject.length === 0 && selectedModule.length === 0 && selectedSubModule.length === 0 && selectedMainpage.length === 0 && selectedSubpage.length === 0 && selectedSubSubpage.length === 0) {

      setPopupContentMalert("Please choose Any one filter");
      setfilteralertmsg("Please choose Any one filter");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setfilteralert(true);
    } else {

      // setIsLoader(false);
      FilterSubmit();
      setfilteralert(false);
      setfilteralertmsg("");
    }
  };
  const [userTasksFilter, setUserTasksFilter] = useState([]);
  const [userTasksDevFilter, setUserTasksDevFilter] = useState([]);
  const [userTasksTestFilter, setUserTasksTestFilter] = useState([]);
  const [filterchange, setfilterchange] = useState(false);
  const [filterclear, setfilterclear] = useState(false);
  const [filteralert, setfilteralert] = useState(false);
  const [filteralertmsg, setfilteralertmsg] = useState("");


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


  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setSelectedOptionsBranch([])
    setValueBranchCat([])
    setSelectedOptionsUnit([])
    setValueUnitCat([])
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setSelectedEmployeeOptions([])
    setEmployeesNames([])
    setValueEmployee([])
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsBranch(options);
    setSelectedOptionsUnit([])
    setValueUnitCat([])
    setSelectedOptionsTeam([])
    setValueTeamCat([])
    setSelectedEmployeeOptions([])
    setEmployeesNames([])
    setValueEmployee([])
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };




  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);

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

  const fetchEmployeeOptions = async (e, type) => {
    let designation = [];
    let department = [];
    let company = [];
    let branch = [];
    let unit = [];
    let team = [];

    switch (type) {
      case "Designation":
        designation = e?.length > 0 ? e?.map(data => data?.value) : [];
        department = [];
        company = [];
        branch = [];
        unit = [];
        team = [];
        break;

      case "Department":
        designation = [];
        department = e?.length > 0 ? e?.map(data => data?.value) : [];
        company = [];
        branch = [];
        unit = [];
        team = [];
        break;

      case "Employee":
        designation = [];
        department = [];
        company = valueCompanyCat;
        branch = valueBranchCat;
        unit = valueUnitCat;
        team = e?.length > 0 ? e?.map(data => data?.value) : [];
        break;

      default:
        designation = [];
        department = [];
        company = [];
        branch = [];
        unit = [];
        team = [];
        break;
    }
    setPageName(!pageName);
    try {
      let res_category = await axios.post(SERVICE.USER_TASK_DESIGNATION_EMP_NAMES, {
        designation: designation,
        department: department,
        company: company,
        branch: branch,
        unit: unit,
        team: team,
        type: type
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const employeenames = res_category?.data?.users?.length > 0 ? res_category?.data?.users : []


      const categoryall = [
        ...employeenames?.map((d) => ({
          label: d.companyname,
          value: d.companyname,
        })),
      ];
      setEmployeesNames(categoryall)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

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


  //get all role list details
  const FilterSubmit = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.TASKBOARDVIEW_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: selectedMainpage.map((item) => item.value),
        subpage: selectedSubpage.map((item) => item.value),
        subsubpage: selectedSubSubpage.map((item) => item.value),
        designation: valueDesignation,
        department: valueDepartment,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employeenames: valueEmployee,
        user: isUserRoleAccess.companyname,
        access: isUserRoleAccess.role,
        accessdrop: String(Accessdrop),
        fromdate: fromDate,
        todate: toDate,
        // pagetype:pagetypename
      });

      setfilterclear("");
      setfilterchange(!filterchange);

      if (!isUserRoleAccess.role.includes("Manager") || (isUserRoleAccess.role.includes("Manager") && Accessdrop == "Teammember")) {
        setUserTasks(res?.data?.taskUI);
        setUserTasksDev(res?.data?.taskDev);
        setUserTasksTest(res?.data?.taskTest);
      } else if (isUserRoleAccess.role.includes("Manager") && Accessdrop == "all") {
        setUserTasksFilter(res?.data?.taskUI);
        setUserTasksDevFilter(res?.data?.taskDev);
        setUserTasksTestFilter(res?.data?.taskTest);
      }
    } catch (err) { console.log(err, 'err'); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSelectedProject([]);
    setSelectedSubProject([]);
    setSelectedModule([]);
    setSelectedSubModule([]);
    setSelectedMainpage([]);
    setSelectedSubpage([]);
    setSelectedSubSubpage([]);
    setfilterclear("clear");
    setTaskTypeName("Please Select Type");
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
    setValueDesignation([])
    setValueDepartment([])
    // await fetchUsersTasks();
    setPopupContentMalert("Cleared Successfully");
    setPopupSeverityMalert("success");
    handleClickOpenPopupMalert();
  };





  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProject(
        res_project?.data?.projects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Project for Dropdowns
  const fetchSubProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.SUBPROJECTLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubProject(
        res?.data?.subprojects?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.MODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModule(
        dropModule?.data?.modules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Module Dropdowns
  const fetchsubModuleDropdowns = async () => {
    setPageName(!pageName);
    try {
      let dropModule = await axios.get(SERVICE.SUBMODULELIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubModule(
        dropModule?.data?.submodules?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching Main Page Dropdowns
  const fetchPagetypeMainDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_MAIN_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: e.map((item) => item.value),
      });

      let uniquearray = Array.from(new Set(res?.data?.pagetypemain?.map((com) => com.mainpage))).map((name) => ({
        label: name,
        value: name,
      }));

      setMainpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUBPAGE_DROP_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: e.map((item) => item.value),
      });

      let uniquearray = Array.from(new Set(res?.data?.pagetypesub?.map((com) => com.subpage))).map((name) => ({
        label: name,
        value: name,
      }));
      setSubpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching sub Page Dropdowns
  const fetchPagetypeSubSubPageDropdowns = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.PAGETYPE_SUB_SUBPAGE_DROP_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProject.map((item) => item.value),
        subproject: selectedSubProject.map((item) => item.value),
        module: selectedModule.map((item) => item.value),
        submodule: selectedSubModule.map((item) => item.value),
        mainpage: selectedMainpage.map((item) => item.value),
        subpage: e.map((item) => item.value),
      });
      let uniquearray = Array.from(new Set(res?.data?.pagetypesub?.map((com) => com.name))).map((name) => ({
        label: name,
        value: name,
      }));
      setsubSubpageTypeDropdown(uniquearray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //project handlechange
  const handleChangeproject = (options) => {
    setSelectedProject(options);
  };

  const customValueRendererproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select project";
  };
  //subproject handlechange
  const handleChangesubproject = (options) => {
    setSelectedSubProject(options);
  };

  const customValueRenderersubproject = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subproject";
  };
  // modulechandlechange
  const handleChangemodule = (options) => {
    setSelectedModule(options);
  };

  const customValueRenderermodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Module";
  };

  // submodulechandlechange
  const handleChangesubmodule = (options) => {
    setSelectedSubModule(options);
    fetchPagetypeMainDropdowns(options);
  };

  const customValueRenderersubmodule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select SubModule";
  };

  // mainpage chandlechange
  const handleChangemainpage = (options) => {
    setSelectedMainpage(options);
    fetchPagetypeSubPageDropdowns(options);
  };

  const customValueRenderermainpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Mainpage";
  };
  // subpagechandlechange
  const handleChangesubpage = (options) => {
    setSelectedSubpage(options);
    fetchPagetypeSubSubPageDropdowns(options);
  };

  const customValueRenderersubpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subpage";
  };
  // subSUBpagechandlechange
  const handleChangesubsubpage = (options) => {
    setSelectedSubSubpage(options);
  };

  const customValueRenderersubsubpage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subpage";
  };

  useEffect(() => {
    fetchProjectDropdowns();
  }, []);

  useEffect(() => {
    fetchSubProjectDropdowns();
  }, [selectedProject]);

  useEffect(() => {
    fetchModuleDropdowns();
  }, [selectedProject, selectedSubProject]);

  useEffect(() => {
    fetchsubModuleDropdowns();
  }, [selectedProject, selectedSubProject, selectedModule]);

  useEffect(() => {
    setAccesDrop(isUserRoleAccess.role.includes("Manager") ? "all" : "Teammember");
  }, []);

  return (
    <>
      {isUserRoleAccess.role.includes("Manager") && Accessdrop === "all" ? (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container>
              <Grid item md={9} sm={6} xs={12}>
                <PageHeading
                  title="Task Board Admin"
                  modulename="Projects"
                  submodulename="Tasks"
                  mainpagename="Task Board"
                  subpagename=""
                  subsubpagename=""
                />
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={4} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box >
                      <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Access</Typography>
                    </Box>
                  </Grid>
                  <Grid item md={9} sm={8} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          handleClear(e);
                        }}
                      >
                        <MenuItem value={"all"}>Manager</MenuItem>
                        <MenuItem value={"Teammember"}>Employee</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      ) :
        isUserRoleAccess.role.includes("Manager") && Accessdrop === "Teammember" ? (
          <>
            <Box sx={userStyle.dialogbox}>
              <Grid container>
                <Grid item md={9} sm={6} xs={12}>
                  <Typography variant="h5">Task Board</Typography>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={4} xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Access</Typography>
                      </Box>
                    </Grid>
                    <Grid item md={9} sm={8} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={Accessdrop}
                          onChange={(e) => {
                            setAccesDrop(e.target.value);
                            handleClear(e);
                          }}
                        >
                          <MenuItem value={"all"}>Manager</MenuItem>
                          <MenuItem value={"Teammember"}>Employee</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <Box sx={userStyle.dialogbox}>
              <Grid container>
                <Grid item md={9} sm={6} xs={12}>
                  <Typography variant="h5">Task Board</Typography>
                </Grid>
                <Grid item md={3} sm={6} xs={12}></Grid>
              </Grid>
            </Box>
          </>
        )}

      <br />
      <Box sx={userStyle.dialogbox}>
        <Grid container spacing={2}>
          {isUserRoleAccess.role.includes("Manager") && Accessdrop === "all" &&
            <>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={[{ label: "Designation", value: "Designation" }, { label: "Department", value: "Department" }, { label: "Employee", value: "Employee" }]}
                    styles={colourStyles}
                    value={{
                      label: taskTypeName,
                      value: taskTypeName,
                    }}
                    onChange={(e) => {
                      setTaskTypeName(e.value)
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
                      setValueDesignation([])
                      setValueDepartment([])
                    }}
                  />
                </FormControl>
              </Grid>
              {taskTypeName === "Designation" ?
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
                taskTypeName === "Department" ?
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
                  taskTypeName === "Employee" ?
                    <>
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Company <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch?.map(data => ({
                              label: data.company,
                              value: data.company,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Branch<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch?.filter(
                              (comp) =>
                                selectedOptionsCompany
                                  .map((item) => item.value)
                                  .includes(comp.company)
                            )?.map(data => ({
                              label: data.branch,
                              value: data.branch,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Unit<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch?.filter(
                              (comp) =>
                                selectedOptionsCompany
                                  .map((item) => item.value)
                                  .includes(comp.company) && selectedOptionsBranch
                                    .map((item) => item.value)
                                    .includes(comp.branch)
                            )?.map(data => ({
                              label: data.unit,
                              value: data.unit,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                            options={allTeam?.filter(
                              (comp) =>
                                selectedOptionsCompany
                                  .map((item) => item.value)
                                  .includes(comp.company) && selectedOptionsBranch
                                    .map((item) => item.value)
                                    .includes(comp.branch) && selectedOptionsUnit
                                      .map((item) => item.value)
                                      .includes(comp.unit)
                            )?.map(data => ({
                              label: data.teamname,
                              value: data.teamname,
                            })).filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                            })}
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
          }
          <Grid item md={3} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Project</Typography>
            <FormControl size="small" fullWidth>
              <FormControl size="small" fullWidth>
                <MultiSelect options={project} value={selectedProject} onChange={handleChangeproject} valueRenderer={customValueRendererproject} labelledBy="Please Select Project" />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub Project</Typography>
            <FormControl size="small" fullWidth>
              <MultiSelect
                options={subProject
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubProject}
                onChange={handleChangesubproject}
                valueRenderer={customValueRenderersubproject}
                labelledBy="Please Select SubProject"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Module</Typography>
            <FormControl size="small" fullWidth>
              <MultiSelect
                options={module
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedModule}
                onChange={handleChangemodule}
                valueRenderer={customValueRenderermodule}
                labelledBy="Please Select Module"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>SubModule Name </Typography>

              <MultiSelect
                options={subModule
                  ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject) && selectedModule.map((item) => item.value).includes(subpro.module))
                  ?.map((subpro) => ({
                    ...subpro,
                    label: subpro.name,
                    value: subpro.name,
                  }))}
                value={selectedSubModule}
                onChange={handleChangesubmodule}
                valueRenderer={customValueRenderersubmodule}
                labelledBy="Please Select SubModule"
              />
            </FormControl>
          </Grid>
          {mainpageTypeDropdown.length > 0 && (
            <Grid item md={3} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Main Page</Typography>

              <MultiSelect options={mainpageTypeDropdown} value={selectedMainpage} onChange={handleChangemainpage} valueRenderer={customValueRenderermainpage} labelledBy="Please Select Mainpage" />
            </Grid>
          )}
          {subpageTypeDropdown.length > 0 && (
            <Grid item md={3} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub page</Typography>
              <MultiSelect options={subpageTypeDropdown} value={selectedSubpage} onChange={handleChangesubpage} valueRenderer={customValueRenderersubpage} labelledBy="Please Select Subpage" />
            </Grid>
          )}
          {subsubpageTypeDropdown.length > 0 && (
            <Grid item md={3} xs={12} sm={6}>
              <Typography sx={{ fontSize: '16px', color: 'black', fontWeight: 500 }}>Sub Sub page</Typography>
              <MultiSelect options={subsubpageTypeDropdown} value={selectedSubSubpage} onChange={handleChangesubsubpage} valueRenderer={customValueRenderersubsubpage} labelledBy="Please Select SubSubpage" />
            </Grid>
          )}
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                From Date<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="Date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}

              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                To Date<b style={{ color: "red" }}>*</b>
              </Typography>
              <OutlinedInput
                id="component-outlined"
                type="Date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                }}

              />
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <Box sx={{ display: "flex", justifyContent: "center", gap: "25px" }}>
          <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={(e) => handleFilter(e)}>
            Filter
          </Button>
          <Button sx={buttonStyles.btncancel} onClick={(e) => handleClear(e)}>
            Clear
          </Button>
        </Box>
      </Box>
      <br />
      {Accessdrop == "all" ? (
        <>
          <TaskallAdmin filterchange={filterchange} filterclear={filterclear} filteralert={filteralert} userTasksFilter={userTasksFilter} userTasksDevFilter={userTasksDevFilter} userTasksTestFilter={userTasksTestFilter} selectedProject={selectedProject} selectedSubProject={selectedSubProject} selectedModule={selectedModule} selectedSubModule={selectedSubModule} selectedMainpage={selectedMainpage} selectedSubpage={selectedSubpage} selectedSubSubpage={selectedSubSubpage} filteralertmsg={filteralertmsg} setfilteralert={setfilteralert} setfilteralertmsg={setfilteralertmsg} />
        </>
      ) : (
        <>
          {/* <Grid container spacing={2}>
            <Grid item md={12} sm={6} xs={12}>
              <Typography variant="h5">Task Board</Typography>
            </Grid>
          </Grid> */}
          <br />
          {/* <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Project 
                </Typography>
                <FormControl size="small" fullWidth>
                  <FormControl size="small" fullWidth>
                    <MultiSelect options={project} value={selectedProject} onChange={handleChangeproject} valueRenderer={customValueRendererproject} labelledBy="Please Select Project" />
                  </FormControl>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Sub Project 
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={subProject
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedSubProject}
                    onChange={handleChangesubproject}
                    valueRenderer={customValueRenderersubproject}
                    labelledBy="Please Select SubProject"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Module 
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={module
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedModule}
                    onChange={handleChangemodule}
                    valueRenderer={customValueRenderermodule}
                    labelledBy="Please Select Module"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    SubModule Name {" "}
                  </Typography>

                  <MultiSelect
                    options={subModule
                      ?.filter((subpro) => selectedProject.map((item) => item.value).includes(subpro.project) && selectedSubProject.map((item) => item.value).includes(subpro.subproject) && selectedModule.map((item) => item.value).includes(subpro.module))
                      ?.map((subpro) => ({
                        ...subpro,
                        label: subpro.name,
                        value: subpro.name,
                      }))}
                    value={selectedSubModule}
                    onChange={handleChangesubmodule}
                    valueRenderer={customValueRenderersubmodule}
                    labelledBy="Please Select SubModule"
                  />
                </FormControl>
              </Grid>
              {mainpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Main Page
                  </Typography>

                  <MultiSelect options={mainpageTypeDropdown} value={selectedMainpage} onChange={handleChangemainpage} valueRenderer={customValueRenderermainpage} labelledBy="Please Select Mainpage" />
                </Grid>
              )}
              {subpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub page
                  </Typography>
                  <MultiSelect options={subpageTypeDropdown} value={selectedSubpage} onChange={handleChangesubpage} valueRenderer={customValueRenderersubpage} labelledBy="Please Select Subpage" />
                </Grid>
              )}
              {subsubpageTypeDropdown.length > 0 && (
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Sub Sub page
                  </Typography>
                  <MultiSelect options={subsubpageTypeDropdown} value={selectedSubSubpage} onChange={handleChangesubsubpage} valueRenderer={customValueRenderersubsubpage} labelledBy="Please Select SubSubpage" />
                </Grid>
              )}
            </Grid>
            <br />
            <Box sx={{ display: "flex", justifyContent: "center", gap: "25px" }}>
              <Button variant="contained" onClick={(e) => handleFilter(e)}>
                Filter
              </Button>
              <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
                Cancel
              </Button>
            </Box>
          </Box>
          <br /> */}
          <Box>
            <Headtitle title={"TASKBOARD"} />
            {isTaskdots ? (
              <>
                <Grid container spacing={1}>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">UI Design</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      <br />
                      {userTasks?.length > 0 &&
                        userTasks.map((row) => {
                          if (row.phase === "UI") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_ui} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}

                                  </Typography>
                                  <Box
                                    sx={{
                                      marginTop: "8px",
                                      padding: "4px 8px",
                                      color: "#fff",
                                      backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                      borderRadius: "4px",
                                      display: "inline-block",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px", // Adjust font size as needed
                                    }}
                                  >
                                    {row?.priority?.priority || "No Priority"}
                                  </Box>
                                  &ensp;
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/taskuipage/${row._id}`} style={{ background: "#b76eb7", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Development</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      <br />
                      {/* <Box sx={userStyle.taskboardbox_dev}>HI</Box> */}
                      {userTasksDev?.length > 0 &&
                        userTasksDev.map((row) => {
                          if (row.phase === "Development") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_dev} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}
                                  </Typography>
                                  <Box
                                    sx={{
                                      marginTop: "8px",
                                      padding: "4px 8px",
                                      color: "#fff",
                                      backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                      borderRadius: "4px",
                                      display: "inline-block",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px", // Adjust font size as needed
                                    }}
                                  >
                                    {row?.priority?.priority || "No Priority"}
                                  </Box>
                                  &ensp;
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/taskdevpage/${row._id}`} style={{ background: "#1976d291", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Testing</Typography>

                    <Box sx={userStyle.taskboardcontainer}>
                      {/* <Box sx={userStyle.taskboardbox_test}>HI</Box> */}
                      {userTasksTest?.length > 0 &&
                        userTasksTest.map((row) => {
                          if (row.phase === "Testing") {
                            return (
                              <>
                                <Box sx={userStyle.taskboardbox_test} key={row._id}>
                                  <Typography
                                    sx={{
                                      fontSize: row.taskname?.length > 25 ? "11px" : "small",
                                      fontWeight: "bold",
                                      fontFamily: "auto",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {row.taskname}
                                  </Typography>
                                  <Box
                                    sx={{
                                      marginTop: "8px",
                                      padding: "4px 8px",
                                      color: "#fff",
                                      backgroundColor: priorityColors[row?.priority?.priority?.toLowerCase()] || "#ccc",
                                      borderRadius: "4px",
                                      display: "inline-block",
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: "12px", // Adjust font size as needed
                                    }}
                                  >
                                    {row?.priority?.priority || "No Priority"}
                                  </Box>
                                  &ensp;
                                  <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                    <Link target="_blank" rel="noopener noreferrer" to={`/project/tasktesterpage/${row._id}`} style={{ background: "#e3b052", padding: "3px", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                      <OpenInNewIcon sx={{ color: "white", fontSize: "15px" }} />
                                    </Link>
                                  </Box>
                                </Box>
                                <br />
                              </>
                            );
                          }
                        })}
                    </Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Source Integration</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Deployment</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <Typography variant="h6">Completed Tasks</Typography>

                    <Box sx={userStyle.taskboardcontainer}></Box>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            )}
            {/* ALERT DIALOG */}
            <Box>
              <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent style={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                  <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="error" onClick={handleCloseerr}>
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
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
            {/* <SwipeableDrawerComponent isOpen={openDrawer} selectedRowId={selectedRowId} onClose={handleCloseDrawer} time={timedata} /> */}
          </Box>

        </>
      )}
    </>
  );
}

export default Tasklist;