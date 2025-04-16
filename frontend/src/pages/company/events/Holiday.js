import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput,
  Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid,
  Button, List, ListItem, ListItemText, Popover, TextField, IconButton, TextareaAutosize,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { daysOpt } from "../../../components/Componentkeyword";
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
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";
import { MultiSelect } from "react-multi-select-component";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function Holiday() {
  const pathname = window.location.pathname;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);


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

  let exportColumnNames = ['Name', 'Date', 'Company', 'Branch', 'Unit', 'Team', 'Employee', 'Description', 'Reminder'];
  let exportRowValues = ['name', 'date', 'company', 'applicablefor', 'unit', 'team', 'employee', 'description', 'noofdays']

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Manage Holiday"),
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
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  //state to handle holiday values
  const [holidayState, setHolidayState] = useState({
    name: "",
    date: "",
    applicablefor: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    employee: "Please Select Employee",
    description: "",
    noofdays: "Please Select Day",
  });
  const [holidayEdit, setHolidayEdit] = useState();
  const [holidayArray, setHolidayArray] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    allUsersData,
    allTeam,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteHoliday, setDeleteHoliday] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allStatusEdit, setAllStatusEdit] = useState([]);
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
          data?.subsubpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [window.location.pathname?.substring(1), window.location.pathname]
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));


  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] =
    useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
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
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererBranchEdit = (
    branchValueCateEdit,
    _employeename
  ) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] =
    useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState("");

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
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
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit?.length
      ? unitValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] =
    useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const [employeeLength, setEmployeeLength] = useState([]);
  const handleTeamChange = (options) => {
    let team = options.map((a, index) => {
      return a.value;
    });

    setValueTeamCat(team);
    setSelectedOptionsTeam(options);
    setSelectedOptionsEmployee([]);

    let emplength = [
      ...allUsersData
        ?.filter(
          (comp) =>
            valueCompanyCat?.includes(comp.company) &&
            selectedOptionsBranch
              .map((data) => data.value)
              .includes(comp.branch) &&
            selectedOptionsUnit.map((data) => data.value).includes(comp.unit) &&
            options.map((data) => data.value).includes(comp.team)
        )
        ?.map((data) => ({
          label: data.companyname,
          value: data.companyname,
        }))
        .filter((item, index, self) => {
          return (
            self.findIndex(
              (i) => i.label === item.label && i.value === item.value
            ) === index
          );
        }),
    ];
    setEmployeeLength(emplength);
  };

  const customValueRendererTeam = (valueteamCat, _categoryname) => {
    return valueteamCat?.length
      ? valueteamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const [employeeLengthEdit, setEmployeeLengthEdit] = useState([]);
  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);

    let emplength = [
      ...allUsersData
        ?.filter(
          (comp) =>
            companyValueCateEdit?.includes(comp.company) &&
            selectedBranchOptionsCateEdit
              .map((data) => data.value)
              ?.includes(comp.branch) &&
            selectedUnitOptionsCateEdit
              .map((data) => data.value)
              ?.includes(comp.unit) &&
            options.map((data) => data.value)?.includes(comp.team)
        )
        ?.map((data) => ({
          label: data.companyname,
          value: data.companyname,
        }))
        .filter((item, index, self) => {
          return (
            self.findIndex(
              (i) => i.label === item.label && i.value === item.value
            ) === index
          );
        }),
    ];

    setEmployeeLengthEdit(emplength);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length
      ? teamValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
  const [selectedEmployeeOptionsCateEdit, setSelectedEmployeeOptionsCateEdit] =
    useState([]);
  const [employeeValueCateEdit, setEmployeeValueCateEdit] = useState("");

  const handleEmployeeChange = (options) => {
    if (employeeLength.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsEmployee(filteredOptions);
      setValueEmployeeCat(filteredOptions.map((option) => option.value));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedOptionsEmployee([{ value: "ALL", label: "ALL" }]);
      setValueEmployeeCat(["ALL"]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsEmployee(filteredOptions);
      setValueEmployeeCat(filteredOptions.map((option) => option.value));
    }
  };

  const customValueRendererEmployee = (valueemployeeCat, _categoryname) => {
    return valueemployeeCat?.length
      ? valueemployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  const handleEmployeeChangeEdit = (options) => {
    if (employeeLengthEdit.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedEmployeeOptionsCateEdit(filteredOptions);
      setEmployeeValueCateEdit(filteredOptions.map((option) => option.value));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedEmployeeOptionsCateEdit([{ value: "ALL", label: "ALL" }]);
      setEmployeeValueCateEdit(["ALL"]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedEmployeeOptionsCateEdit(filteredOptions);
      setEmployeeValueCateEdit(filteredOptions.map((option) => option.value));
    }
  };

  const customValueRendererEmployeeEdit = (
    employeeValueCateEdit,
    _employeename
  ) => {
    return employeeValueCateEdit?.length
      ? employeeValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
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
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    date: true,
    company: true,
    applicablefor: true,
    unit: true,
    team: true,
    employee: true,
    description: true,
    noofdays: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    addSerialNumber(holidayArray);
  }, [holidayArray]);
  useEffect(() => {
    fetchHoliday();
    fetchHolidayAll();
  }, [isEditOpen]);
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
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
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
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

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

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_HOLIDAY}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteHoliday(res?.data?.sholiday);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let holidayid = deleteHoliday._id;
  const delHoliday = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_HOLIDAY}/${holidayid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchHoliday();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delHolidaycheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_HOLIDAY}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchHoliday();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [isBtn, setIsBtn] = useState(false);
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let statusCreate = await axios.post(SERVICE.CREATE_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(holidayState.name),
        date: String(holidayState.date),
        company: valueCompanyCat,
        applicablefor: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employee: valueEmployeeCat,
        description: String(holidayState.description),

        noofdays: String(
          holidayState.noofdays === "Please Select Day"
            ? 0
            : holidayState.noofdays
        ),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setHolidayState(statusCreate.data);
      await fetchHoliday();
      setHolidayState({ ...holidayState, name: "", date: "", description: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let compopt = selectedOptionsCompany.map((item) => item.value);
    let branchopt = selectedOptionsBranch.map((item) => item.value);
    let unitopt = selectedOptionsUnit.map((item) => item.value);
    let teamopt = selectedOptionsTeam.map((item) => item.value);
    let employeeopt = selectedOptionsEmployee.map((item) => item.value);
    const isNameMatch = holidayArray.some(
      (item) =>
        item.name?.toLowerCase() === holidayState.name?.toLowerCase() &&
        item.date === holidayState.date &&
        item.company.some((data) => compopt.includes(data)) &&
        item.applicablefor.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.employee.some((data) => employeeopt.includes(data))
    );
    if (holidayState.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (holidayState.date === "") {
      setPopupContentMalert("Please Choose Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCompanyCat?.length == 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueBranchCat?.length == 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueUnitCat?.length == 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueTeamCat?.length == 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueEmployeeCat?.length == 0) {
      setPopupContentMalert("Please Select Employee");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Holiday already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setHolidayState({
      name: "",
      date: "",
      applicablefor: "Please Select Branch",
      description: "",
      noofdays: "Please Select Day",
    });
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
    setValueUnitCat([]);
    setValueTeamCat([]);
    setValueEmployeeCat([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_HOLIDAY}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHolidayEdit(res?.data?.sholiday);
      setCompanyValueCateEdit(res?.data?.sholiday?.company);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.sholiday?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchValueCateEdit(res?.data?.sholiday?.applicablefor);
      setSelectedBranchOptionsCateEdit([
        ...res?.data?.sholiday?.applicablefor.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setUnitValueCateEdit(res?.data?.sholiday?.unit);

      setSelectedUnitOptionsCateEdit([
        ...res?.data?.sholiday?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamValueCateEdit(res?.data?.sholiday?.team);

      setSelectedTeamOptionsCateEdit([
        ...res?.data?.sholiday?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setEmployeeValueCateEdit(res?.data?.sholiday?.employee);

      setSelectedEmployeeOptionsCateEdit([
        ...res?.data?.sholiday?.employee.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      let emplength = [
        ...allUsersData
          ?.filter(
            (comp) =>
              res?.data?.sholiday?.company?.includes(comp.company) &&
              res?.data?.sholiday?.applicablefor?.includes(comp.branch) &&
              res?.data?.sholiday?.unit?.includes(comp.unit) &&
              res?.data?.sholiday?.team.includes(comp.team)
          )
          ?.map((data) => ({
            label: data.companyname,
            value: data.companyname,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          }),
      ];

      setEmployeeLengthEdit(emplength);

      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_HOLIDAY}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHolidayEdit(res?.data?.sholiday);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_HOLIDAY}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHolidayEdit(res?.data?.sholiday);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = holidayEdit?.updatedby;
  let addedby = holidayEdit?.addedby;
  let holidayId = holidayEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_HOLIDAY}/${holidayId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(holidayEdit?.name),
        date: String(holidayEdit?.date),
        company: companyValueCateEdit,
        applicablefor: branchValueCateEdit,
        unit: unitValueCateEdit,
        team: teamValueCateEdit,
        employee: employeeValueCateEdit,
        description: String(holidayEdit?.description),
        noofdays: String(
          holidayEdit?.noofdays === "Please Select Day"
            ? 0
            : holidayEdit?.noofdays
        ),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchHoliday();
      await fetchHolidayAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchHolidayAll();
    let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    let employeeopt = selectedEmployeeOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allStatusEdit.some(
      (item) =>
        item.name?.toLowerCase() === holidayEdit.name?.toLowerCase() &&
        item.date === holidayEdit.date &&
        item.company.some((data) => compopt.includes(data)) &&
        item.applicablefor.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.employee.some((data) => employeeopt.includes(data))
    );
    if (holidayEdit?.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (holidayEdit?.date === "") {
      setPopupContentMalert("Please Choose Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (companyValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchOptionsCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitOptionsCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeamOptionsCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeOptionsCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Employee");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Holiday already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all data.
  const fetchHoliday = async () => {
    setPageName(!pageName);
    const accessmodule = [];

    isAssignBranch.map((data) => {
      let fetfinalurl = [];

      if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
        fetfinalurl = data.subpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0) {
        fetfinalurl = data.mainpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      }
      accessmodule.push(fetfinalurl);
    });

    const uniqueValues = [...new Set(accessmodule.flat())];

    if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
      try {
        let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,
        });

        const result = res_status?.data?.holiday.filter((data, index) => {
          if (
            data.employee.includes("ALL") &&
            data.company.includes(isUserRoleAccess.company) &&
            data.applicablefor.includes(isUserRoleAccess.branch) &&
            data.unit.includes(isUserRoleAccess.unit) &&
            data.team.includes(isUserRoleAccess.team)
          ) {
            return (
              data.company.includes(isUserRoleAccess.company) &&
              data.applicablefor.includes(isUserRoleAccess.branch) &&
              data.unit.includes(isUserRoleAccess.unit) &&
              data.team.includes(isUserRoleAccess.team)
            );
          } else {
            return (
              data.company.includes(isUserRoleAccess.company) &&
              data.applicablefor.includes(isUserRoleAccess.branch) &&
              data.unit.includes(isUserRoleAccess.unit) &&
              data.team.includes(isUserRoleAccess.team) &&
              data.employee.includes(isUserRoleAccess.companyname)
            );
          }
        });

        const resdata = isUserRoleAccess.role.includes("Manager")
          ? res_status?.data?.holiday
          : result;

        setHolidayArray(resdata.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          date: moment(item.date).format("DD-MM-YYYY"),
          company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          applicablefor: item.applicablefor
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          employee: item.employee?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        })));
        setStatusCheck(true);
      } catch (err) { setStatusCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    } else {
      setStatusCheck(true);
      setHolidayArray([]);
    }

  };
  //get all data.
  const fetchHolidayAll = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      setAllStatusEdit(
        res_status?.data?.holiday.filter(
          (item) => item._id !== holidayEdit?._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //image
  // const handleCaptureImage = () => {
  //   if (gridRef.current) {
  //     html2canvas(gridRef.current).then((canvas) => {
  //       canvas.toBlob((blob) => {
  //         saveAs(blob, "Holiday.png");
  //       });
  //     });
  //   }
  // };

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Holiday.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Holiday",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
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

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
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
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 200,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "applicablefor",
      headerName: "Branch",
      flex: 0,
      width: 200,
      hide: !columnVisibility.applicablefor,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 200,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 200,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
      headerClassName: "bold-header",
    },

    {
      field: "description",
      headerName: "Description",
      flex: 0,
      width: 200,
      hide: !columnVisibility.description,
      headerClassName: "bold-header",
    },
    {
      field: "noofdays",
      headerName: "Reminder",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noofdays,
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("emanageholiday") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmanageholiday") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanageholiday") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanageholiday") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
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
      name: item.name,
      date: item.date,
      company: item.company,
      applicablefor: item.applicablefor,
      unit: item.unit,
      team: item.team,
      employee: item.employee,
      description: item.description,
      noofdays: item.noofdays,
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
      <Headtitle title={"HOLIDAY"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Holiday"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Holiday"
        subpagename="Manage Holiday"
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("amanageholiday") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Holiday
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={holidayState.name}
                      onChange={(e) => {
                        const userInput = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(userInput)) {
                          setHolidayState({ ...holidayState, name: userInput });
                        }
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
                      type="date"
                      value={holidayState.date}
                      onChange={(e) => {
                        setHolidayState({
                          ...holidayState,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
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
                                i.label === item.label && i.value === item.value
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            selectedOptionsBranch
                              .map((data) => data.value)
                              .includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            selectedOptionsBranch
                              .map((data) => data.value)
                              .includes(comp.branch) &&
                            selectedOptionsUnit
                              .map((data) => data.value)
                              .includes(comp.unit)
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              selectedOptionsBranch
                                .map((data) => data.value)
                                .includes(comp.branch) &&
                              selectedOptionsUnit
                                .map((data) => data.value)
                                .includes(comp.unit) &&
                              selectedOptionsTeam
                                .map((data) => data.value)
                                .includes(comp.team)
                          )
                          ?.map((data) => ({
                            label: data.companyname,
                            value: data.companyname,
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
                      value={selectedOptionsEmployee}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                      }}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={holidayState.description}
                      onChange={(e) => {
                        setHolidayState({
                          ...holidayState,
                          description: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      No.of Days Before when reminder email is sent:
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={daysOpt}
                      placeholder="Please Select Day"
                      value={{
                        label: holidayState.noofdays,
                        value: holidayState.noofdays,
                      }}
                      onChange={(e) => {
                        setHolidayState({
                          ...holidayState,
                          noofdays: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
        <br />
      </>

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanageholiday") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Holiday List
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
                    <MenuItem value={holidayArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelmanageholiday") && (
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
                  {isUserRoleCompare?.includes("csvmanageholiday") && (
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
                  {isUserRoleCompare?.includes("printmanageholiday") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanageholiday") && (
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
                  {isUserRoleCompare?.includes("imagemanageholiday") && (
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={holidayArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
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
            {isUserRoleCompare?.includes("bdmanageholiday") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            &ensp;
            <br />
            {!statusCheck ? (
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
                <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                </Box>

              </>
            )}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "47px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Holiday</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{holidayEdit?.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Date</Typography>
                  <Typography>
                    {moment(holidayEdit?.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company </Typography>
                  <Typography>
                    {holidayEdit?.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>
                    {holidayEdit?.applicablefor
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>
                    {holidayEdit?.unit
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>
                    {holidayEdit?.team
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee</Typography>
                  <Typography>
                    {holidayEdit?.employee
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Description</Typography>
                  <Typography>{holidayEdit?.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Reminder</Typography>
                  <Typography>{holidayEdit?.noofdays}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          sx={{ marginTop: "47px" }}
        // fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Holiday</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={holidayEdit?.name}
                      onChange={(e) => {
                        const userInput = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(userInput)) {
                          setHolidayEdit({ ...holidayEdit, name: userInput });
                        }
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
                      type="date"
                      value={holidayEdit?.date}
                      onChange={(e) => {
                        setHolidayEdit({
                          ...holidayEdit,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                      value={selectedCompanyOptionsCateEdit}
                      onChange={handleCompanyChangeEdit}
                      valueRenderer={customValueRendererCompanyEdit}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) =>
                          companyValueCateEdit?.includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedBranchOptionsCateEdit}
                      onChange={handleBranchChangeEdit}
                      valueRenderer={customValueRendererBranchEdit}
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
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            companyValueCateEdit?.includes(comp.company) &&
                            selectedBranchOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedUnitOptionsCateEdit}
                      onChange={(e) => {
                        handleUnitChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererUnitEdit}
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
                          (comp) =>
                            companyValueCateEdit?.includes(comp.company) &&
                            selectedBranchOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.branch) &&
                            selectedUnitOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.unit)
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedTeamOptionsCateEdit}
                      onChange={(e) => {
                        handleTeamChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererTeamEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              companyValueCateEdit?.includes(comp.company) &&
                              selectedBranchOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.branch) &&
                              selectedUnitOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.unit) &&
                              selectedTeamOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.team)
                          )
                          ?.map((data) => ({
                            label: data.companyname,
                            value: data.companyname,
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
                      value={selectedEmployeeOptionsCateEdit}
                      onChange={(e) => {
                        handleEmployeeChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererEmployeeEdit}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={holidayEdit?.description}
                      onChange={(e) => {
                        setHolidayEdit({
                          ...holidayEdit,
                          description: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      No.Of days before when reminder email is sent
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={daysOpt}
                      placeholder="Please Select Branch"
                      value={{
                        label: holidayEdit?.noofdays,
                        value: holidayEdit?.noofdays,
                      }}
                      onChange={(e) => {
                        setHolidayEdit({
                          ...holidayEdit,
                          noofdays: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={holidayArray ?? []}
        filename={"Holiday"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Holiday Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delHoliday}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delHolidaycheckbox}
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
      <br />
    </Box>
  );
}
export default Holiday;