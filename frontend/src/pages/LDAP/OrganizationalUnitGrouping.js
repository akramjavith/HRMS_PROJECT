import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
} from "@mui/material";
import Selects from "react-select";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { v4 as uuidv4 } from "uuid";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { SERVICE } from "../../services/Baseservice";
import { colourStyles, userStyle } from "../../pageStyle";
import { MultiSelect } from "react-multi-select-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoPopup from "../../components/InfoPopup.js";

function OrganizationalUnitGrouping() {
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    allUsersData,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  const [organizationalUnitGrouping, SetOrganizationalUnitGrouping] = useState({
    workmode: "Please Select Work Mode",
    organizationalunit: "Please Select Organizational Unit",
  });
  const [organizationalUnitGroupingEdit, SetOrganizationalUnitGroupingEdit] =
    useState({
      workmode: "Please Select Work Mode",
      organizationalunit: "Please Select Organizational Unit",
    });

  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);
  let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);
  let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);
  let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);
  let [valueEmployeeCatEdit, setValueEmployeeCatEdit] = useState([]);

  const [filterState, setFilterState] = useState({
    type: "Individual",
  });
  const [filterStateEdit, setFilterStateEdit] = useState({
    type: "Individual",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  const [employeeValueAdd, setEmployeeValueAdd] = useState([]);
  let [valueEmployeeAdd, setValueEmployeeAdd] = useState("");
  const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
    return valueEmployeeAdd.length ? (
      valueEmployeeAdd.map(({ label }) => label).join(",")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    );
  };
  const handleEmployeeChangeAdd = (options) => {
    setValueEmployeeAdd(
      options.map((a) => {
        return a.value;
      })
    );
    setEmployeeValueAdd(options);
  };

  const [employeeValueAddEdit, setEmployeeValueAddEdit] = useState([]);
  let [valueEmployeeAddEdit, setValueEmployeeAddEdit] = useState("");
  const customValueRendererEmployeeAddEdit = (
    valueEmployeeAddEdit,
    _employees
  ) => {
    return valueEmployeeAddEdit.length ? (
      valueEmployeeAddEdit.map(({ label }) => label).join(",")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    );
  };
  const handleEmployeeChangeAddEdit = (options) => {
    setValueEmployeeAddEdit(
      options.map((a) => {
        return a.value;
      })
    );
    setEmployeeValueAddEdit(options);
  };

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
            data?.subsubpagenameurl?.length !== 0 &&
            data?.subsubpagenameurl?.includes(window.location.pathname)
          ) {
            fetfinalurl = data.subsubpagenameurl;
          } else if (
            data?.modulenameurl?.length !== 0 &&
            data?.submodulenameurl?.length !== 0 &&
            data?.mainpagenameurl?.length !== 0 &&
            data?.subpagenameurl?.length !== 0 &&
            data?.subsubpagenameurl?.includes(window.location.pathname)
          ) {
            fetfinalurl = data.subpagenameurl;
          } else if (
            data?.modulenameurl?.length !== 0 &&
            data?.submodulenameurl?.length !== 0 &&
            data?.mainpagenameurl?.length !== 0 &&
            data?.subsubpagenameurl?.includes(window.location.pathname)
          ) {
            fetfinalurl = data.mainpagenameurl;
          } else if (
            data?.modulenameurl?.length !== 0 &&
            data?.submodulenameurl?.length !== 0 &&
            data?.subsubpagenameurl?.includes(window.location.pathname)
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

  const pathname = window.location.pathname;
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

  let exportColumnNames = [
    "Type",
    "Work Mode",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Department",
    "Designation",
    "Process",
    "Shift Grouping",
    "Shift",
    "Employee",
    "Organization Unit",
  ];
  let exportRowValues = [
    "type",
    "workmode",
    "company",
    "branch",
    "unit",
    "team",
    "department",
    "designation",
    "process",
    "shiftgrouping",
    "shifttiming",
    "employee",
    "organizationalunit",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Organizational Unit Grouping"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

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
    setValueEmployeeCat([]);
    setEmployeeOption([]);
    setEmployeeValueAdd([]);
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
    setEmployeeOption([]);
    setEmployeeValueAdd([]);
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
    setEmployeeOption([]);
    setEmployeeValueAdd([]);
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
    fetchEmployeeName(
      options.map((a, index) => {
        return a.value;
      }),
      organizationalUnitGrouping.workmode
    );
    setSelectedOptionsTeam(options);
    setEmployeeValueAdd([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const [employeeOptionEdit, setEmployeeOptionEdit] = useState([]);

  //company multiselect
  const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState(
    []
  );

  const handleCompanyChangeEdit = (options) => {
    setValueCompanyCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyEdit(options);
    setValueBranchCatEdit([]);
    setSelectedOptionsBranchEdit([]);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueEmployeeCatEdit([]);
    setEmployeeOptionEdit([]);
    setEmployeeValueAddEdit([]);
  };

  const customValueRendererCompanyEdit = (
    valueCompanyCatEdit,
    _categoryname
  ) => {
    return valueCompanyCatEdit?.length
      ? valueCompanyCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState(
    []
  );

  const handleBranchChangeEdit = (options) => {
    setValueBranchCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchEdit(options);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setEmployeeOptionEdit([]);
    setEmployeeValueAddEdit([]);
  };

  const customValueRendererBranchEdit = (valueBranchCatEdit, _categoryname) => {
    return valueBranchCatEdit?.length
      ? valueBranchCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);

  const handleUnitChangeEdit = (options) => {
    setValueUnitCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitEdit(options);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setEmployeeOptionEdit([]);
    setEmployeeValueAddEdit([]);
  };

  const customValueRendererUnitEdit = (valueUnitCatEdit, _categoryname) => {
    return valueUnitCatEdit?.length
      ? valueUnitCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);

  const handleTeamChangeEdit = (options) => {
    setValueTeamCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    fetchEmployeeNameEdit(
      options.map((a, index) => {
        return a.value;
      }),
      organizationalUnitGroupingEdit.workmode
    );
    setSelectedOptionsTeamEdit(options);
    setEmployeeValueAddEdit([]);
  };

  const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
    return valueTeamCatEdit?.length
      ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [employeeOption, setEmployeeOption] = useState([]);

  const fetchEmployeeName = async (team, workMode) => {
    setPageName(!pageName);
    try {
      let arr = allUsersData
        ?.filter(
          (item) =>
            valueCompanyCat?.includes(item.company) &&
            valueBranchCat?.includes(item.branch) &&
            valueUnitCat?.includes(item.unit) &&
            team?.includes(item.team) &&
            workMode?.toLowerCase() === item.workmode?.toLowerCase()
        )
        ?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        }));
      console.log(arr, "arr");
      setEmployeeOption(arr);
      console.log(arr);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchEmployeeNameEditForget = async (
    company,
    branch,
    unit,
    team,
    workMode,
    employee
  ) => {
    setPageName(!pageName);
    try {
      let arr = allUsersData
        ?.filter(
          (item) =>
            company?.includes(item.company) &&
            branch?.includes(item.branch) &&
            unit?.includes(item.unit) &&
            team?.includes(item.team) &&
            workMode?.toLowerCase() === item.workmode?.toLowerCase() &&
            employee?.includes(item.companyname)
        )
        ?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        }));
      let arropt = allUsersData
        ?.filter(
          (item) =>
            company?.includes(item.company) &&
            branch?.includes(item.branch) &&
            unit?.includes(item.unit) &&
            team?.includes(item.team) &&
            workMode?.toLowerCase() === item.workmode?.toLowerCase()
        )
        ?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        }));
      setEmployeeOptionEdit(arropt);
      setEmployeeValueAddEdit(arr);
      setValueEmployeeAddEdit(
        arr.map((a) => {
          return a.value;
        })
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

  const fetchEmployeeNameEdit = async (team, workMode) => {
    setPageName(!pageName);

    try {
      let arr = allUsersData
        ?.filter(
          (item) =>
            valueCompanyCatEdit?.includes(item.company) &&
            valueBranchCatEdit?.includes(item.branch) &&
            valueUnitCatEdit?.includes(item.unit) &&
            team?.includes(item.team) &&
            workMode?.toLowerCase() === item.workmode?.toLowerCase()
        )
        ?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        }));

      setEmployeeOptionEdit(arr);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [deleteType, setDeleteType] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      setNameDelete(id);
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

  const [organizationalUnitGroupingView, SetOrganizationalUnitGroupingView] =
    useState([]);

  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      SetOrganizationalUnitGroupingView(e);
      handleClickOpenview();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      setOrganizationalUnitEdit(e);
      handleClickOpeninfo();
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
    getapi();
  }, []);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");
  const [organizationalUnit, setOrganizationalUnit] = useState({ name: "" });
  const [organizationalUnitEdit, setOrganizationalUnitEdit] = useState({
    name: "",
  });
  const [organizationalUnits, setOrganizationalUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTypemasteredit, setAllTypemasteredit] = useState([]);

  const { auth } = useContext(AuthContext);
  const [isBtn, setIsBtn] = useState(false);

  const [typemasterCheck, setTypemastercheck] = useState(false);
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Organizational Unit Grouping.png");
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

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
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

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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
    type: true,
    workmode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    designation: true,
    process: true,
    shiftgrouping: true,
    shifttiming: true,
    employee: true,
    organizationalunit: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [nameDelete, setNameDelete] = useState("");

  const delType = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.ORGANIZATIONALUNITGROUPING_SINGLE}/${nameDelete}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchOrganizationalUnitGrouping();
      handleCloseMod();
      setPage(1);

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleCloseMod();
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    let mappedDatas = valueEmployeeAdd?.map((data) => {
      let [firstName, lastName] = data?.split(".");
      let foundData = employeeValueAdd?.find((item) => item.label === data);
      return {
        cn: firstName,
        sn: lastName,
        sAMAccountName: foundData?.username,
        userPassword: foundData?.originalpassword,
        ous: String(organizationalUnitGrouping.organizationalunit),
      };
    });
    try {
      let subprojectscreate = await axios.post(
        SERVICE.CREATE_ORGANIZATIONALUNITGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          type: String(filterState.type),
          workmode: String(organizationalUnitGrouping.workmode),
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
          team: valueTeamCat,
          department: ["Individual"]?.includes(filterState.type)
            ? employeeValueAdd
                .filter((emp) => emp.department) // Filter out objects without department
                .map((emp) => emp.department)
            : "",
          designation: ["Individual"]?.includes(filterState.type)
            ? employeeValueAdd
                .filter((emp) => emp.designation) // Filter out objects without department
                .map((emp) => emp.designation)
            : "",
          process: ["Individual"]?.includes(filterState.type)
            ? employeeValueAdd
                .filter((emp) => emp.process) // Filter out objects without department
                .map((emp) => emp.process)
            : "",
          shiftgrouping: ["Individual"]?.includes(filterState.type)
            ? employeeValueAdd
                .filter((emp) => emp.shiftgrouping) // Filter out objects without department
                .map((emp) => emp.shiftgrouping)
            : "",
          shifttiming: ["Individual"]?.includes(filterState.type)
            ? employeeValueAdd
                .filter((emp) => emp.shifttiming) // Filter out objects without department
                .map((emp) => emp.shifttiming)
            : "",
          employee: valueEmployeeAdd,
          organizationalunit: String(
            organizationalUnitGrouping.organizationalunit
          ),
          addedby: [
            {
              name: String(isUserRoleAccess?.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      if (filterState.type === "Individual") {
        let pushData = await axios.post(SERVICE.ADDUSERSWITHOUGROUPING, {
          users: mappedDatas,
        });
      }
      await fetchOrganizationalUnitGrouping();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (organizationalUnitGrouping.workmode === "Please Select Work Mode") {
      setPopupContentMalert("Please Select Work Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team", "Branch", "Unit"]?.includes(filterState.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team", "Unit"]?.includes(filterState.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual"]?.includes(filterState.type) &&
      employeeValueAdd?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      organizationalUnitGrouping.organizationalunit ===
      "Please Select Organizational Unit"
    ) {
      setPopupContentMalert("Please Select Organizational Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    SetOrganizationalUnitGrouping({
      workmode: "Please Select Work Mode",
      organizationalunit: "Please Select Organizational Unit",
    });
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueEmployeeCat([]);
    setEmployeeOption([]);
    setEmployeeValueAdd([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [oldDatas, setOldDatas] = useState([]);
  //get single row to edit....
  const getCode = async (data) => {
    setPageName(!pageName);
    try {
      let mappedDatas = data?.employee?.map((dataNew) => {
        let [firstName, lastName] = dataNew?.split(".");
        let foundData = allUsersData?.find(
          (item) => item.companyname === dataNew
        );
        return {
          cn: firstName,
          sn: lastName,
          sAMAccountName: foundData?.username,
          userPassword: foundData?.originalpassword,
          ous: String(data.organizationalunit),
        };
      });
      setOldDatas(mappedDatas);
      setOrganizationalUnitEdit(data);
      setFilterStateEdit({
        type: data.type,
      });
      SetOrganizationalUnitGroupingEdit({
        workmode: data.workmode,
        organizationalunit: data.organizationalunit,
      });
      setValueCompanyCatEdit(data?.company);
      setValueBranchCatEdit(data?.branch);
      setValueUnitCatEdit(data?.unit);
      setValueTeamCatEdit(data?.team);
      fetchEmployeeNameEditForget(
        data?.company,
        data?.branch,
        data?.unit,
        data?.team,
        data?.workmode,
        data?.employee
      );
      setSelectedOptionsCompanyEdit(
        data?.company?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsBranchEdit(
        data?.branch?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsUnitEdit(
        data?.unit?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsTeamEdit(
        data?.team?.map((item) => ({
          label: item,
          value: item,
        }))
      );

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [editid, setEditid] = useState("");
  let updateby = organizationalUnitEdit.updatedby;
  let addedby = organizationalUnitEdit.addedby;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);

    let mappedDatas = valueEmployeeAddEdit?.map((data) => {
      let [firstName, lastName] = data?.split(".");
      let foundData = employeeValueAddEdit?.find((item) => item.label === data);
      return {
        cn: firstName,
        sn: lastName,
        sAMAccountName: foundData?.username,
        userPassword: foundData?.originalpassword,
        ous: String(organizationalUnitGroupingEdit.organizationalunit),
      };
    });
    console.log(mappedDatas, "mappedDatas");
    try {
      let res = await axios.put(
        `${SERVICE.ORGANIZATIONALUNITGROUPING_SINGLE}/${editid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          type: String(filterStateEdit.type),
          workmode: String(organizationalUnitGroupingEdit.workmode),
          company: valueCompanyCatEdit,
          branch: valueBranchCatEdit,
          unit: valueUnitCatEdit,
          team: valueTeamCatEdit,
          department: ["Individual"]?.includes(filterStateEdit.type)
            ? employeeValueAddEdit
                .filter((emp) => emp.department) // Filter out objects without department
                .map((emp) => emp.department)
            : "",
          designation: ["Individual"]?.includes(filterStateEdit.type)
            ? employeeValueAddEdit
                .filter((emp) => emp.designation) // Filter out objects without department
                .map((emp) => emp.designation)
            : "",
          process: ["Individual"]?.includes(filterStateEdit.type)
            ? employeeValueAddEdit
                .filter((emp) => emp.process) // Filter out objects without department
                .map((emp) => emp.process)
            : "",
          shiftgrouping: ["Individual"]?.includes(filterStateEdit.type)
            ? employeeValueAddEdit
                .filter((emp) => emp.shiftgrouping) // Filter out objects without department
                .map((emp) => emp.shiftgrouping)
            : "",
          shifttiming: ["Individual"]?.includes(filterStateEdit.type)
            ? employeeValueAddEdit
                .filter((emp) => emp.shifttiming) // Filter out objects without department
                .map((emp) => emp.shifttiming)
            : "",
          employee: valueEmployeeAddEdit,
          organizationalunit: String(
            organizationalUnitGroupingEdit.organizationalunit
          ),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      let pushDataOld = await axios.post(SERVICE.DELETEUSERSWITHOUGROUPING, {
        users: oldDatas,
      });
      if (filterStateEdit.type === "Individual") {
        let pushData = await axios.post(SERVICE.ADDUSERSWITHOUGROUPING, {
          users: mappedDatas,
        });
      }

      await fetchOrganizationalUnitGrouping();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
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

  const editSubmit = (e) => {
    e.preventDefault();

    if (organizationalUnitGroupingEdit.workmode === "Please Select Work Mode") {
      setPopupContentMalert("Please Select Work Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompanyEdit?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team", "Branch", "Unit"]?.includes(
        filterStateEdit.type
      ) &&
      selectedOptionsBranchEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team", "Unit"]?.includes(filterStateEdit.type) &&
      selectedOptionsUnitEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterStateEdit.type) &&
      selectedOptionsTeamEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual"]?.includes(filterStateEdit.type) &&
      employeeValueAddEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      organizationalUnitGroupingEdit.organizationalunit ===
      "Please Select Organizational Unit"
    ) {
      setPopupContentMalert("Please Select Organizational Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [organizationalunitOption, setOrganizationalunitOption] = useState([]);
  const [organizationalunitOptionEdit, setOrganizationalunitOptionEdit] =
    useState([]);

  //get all Sub vendormasters.
  const fetchOrganizational = async () => {
    setPageName(!pageName);
    setTypemastercheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.ALL_ORGANIZATIONALUNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOrganizationalunitOption(
        res_vendor?.data?.ouList?.map((item) => ({
          label: item?.ouName,
          value: item?.ouName,
        }))
      );
      setOrganizationalunitOptionEdit(
        res_vendor?.data?.ouList?.map((item) => ({
          label: item?.ouName,
          value: item?.ouName,
        }))
      );
    } catch (err) {
      setTypemastercheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchOrganizationalUnitGrouping = async () => {
    setPageName(!pageName);
    setTypemastercheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.ALL_ORGANIZATIONALUNITGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTypemastercheck(false);
      setOrganizationalUnits(res_vendor?.data?.organizationalUnitgrouping);
    } catch (err) {
      setTypemastercheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Organizational Unit Grouping",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchOrganizational();
    fetchOrganizationalUnitGrouping();
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
    const itemsWithSerialNumber = organizationalUnits.map((item, index) => {
      return {
        _id: item?._id,
        serialNumber: index + 1,
        type: item.type,
        workmode: item.workmode,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        department: item.department,
        designation: item.designation,
        process: item.process,
        shiftgrouping: item.shiftgrouping,
        shifttiming: item.shifttiming,
        employee: item.employee,
        organizationalunit: item.organizationalunit,
        organizationalunit: item.organizationalunit,
        updatedby: item.updatedby,
        addedby: item.addedby,
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [organizationalUnits]);

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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 140,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 250,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 250,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 250,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 250,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 250,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 250,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 250,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 250,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 250,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
    },
    {
      field: "shiftgrouping",
      headerName: "Shift Grouping",
      flex: 0,
      width: 250,
      hide: !columnVisibility.shiftgrouping,
      headerClassName: "bold-header",
    },
    {
      field: "shifttiming",
      headerName: "Shift",
      flex: 0,
      width: 250,
      hide: !columnVisibility.shifttiming,
      headerClassName: "bold-header",
    },
    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employee,
      headerClassName: "bold-header",
    },
    {
      field: "organizationalunit",
      headerName: "Organization Unit",
      flex: 0,
      width: 250,
      hide: !columnVisibility.organizationalunit,
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
          {isUserRoleCompare?.includes("eorganizationalunitgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row);
                setEditid(params.row.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dorganizationalunitgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vorganizationalunitgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iorganizationalunitgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row);
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
      id: item?._id,
      serialNumber: item.serialNumber,
      type: item.type,
      workmode: item.workmode,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      department: item.department,
      designation: item.designation,
      process: item.process,
      shiftgrouping: item.shiftgrouping,
      shifttiming: item.shifttiming,
      employee: item.employee,
      organizationalunit: item.organizationalunit,
      updatedby: item.updatedby,
      addedby: item.addedby,
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
  const deduction = [
    { label: "Remote", value: "Remote" },
    { label: "Office", value: "Office" },
  ];

  return (
    <Box>
      <Headtitle title={"Organizational Unit Grouping"} />
      <PageHeading
        title="Organizational Unit Grouping"
        modulename="LDAP"
        submodulename="Organizational Unit Grouping"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aorganizationalunitgrouping") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Organizational Unit Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
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
                        setValueEmployeeCat([]);
                        setEmployeeOption([]);
                        setEmployeeValueAdd([]);
                        SetOrganizationalUnitGrouping({
                          workmode: "Please Select Work Mode",
                          organizationalunit:
                            "Please Select Organizational Unit",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={deduction}
                      styles={colourStyles}
                      value={{
                        label: organizationalUnitGrouping.workmode,
                        value: organizationalUnitGrouping.workmode,
                      }}
                      onChange={(e) => {
                        SetOrganizationalUnitGrouping({
                          ...organizationalUnitGrouping,
                          workmode: e.value,
                        });
                        fetchEmployeeName(valueTeamCat, e.value);
                        setEmployeeValueAdd([]);
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
                    {["Individual"]?.includes(filterState.type) && (
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography sx={{ fontWeight: "500" }}>
                            Employee Name <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <MultiSelect
                            size="small"
                            options={employeeOption}
                            value={employeeValueAdd}
                            valueRenderer={customValueRendererEmployeeAdd}
                            onChange={handleEmployeeChangeAdd}
                          />
                        </FormControl>
                      </Grid>
                    )}
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
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Organizational Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={organizationalunitOption}
                      styles={colourStyles}
                      value={{
                        label: organizationalUnitGrouping.organizationalunit,
                        value: organizationalUnitGrouping.organizationalunit,
                      }}
                      onChange={(e) => {
                        SetOrganizationalUnitGrouping({
                          ...organizationalUnitGrouping,
                          organizationalunit: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12} marginTop={3}>
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        disabled={isBtn}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            marginTop: "80px",
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Organizational Unit Grouping
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={3}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={TypeOptions}
                        styles={colourStyles}
                        value={{
                          label: filterStateEdit.type ?? "Please Select Type",
                          value: filterStateEdit.type ?? "Please Select Type",
                        }}
                        onChange={(e) => {
                          setFilterStateEdit((prev) => ({
                            ...prev,
                            type: e.value,
                          }));
                          setValueCompanyCatEdit([]);
                          setSelectedOptionsCompanyEdit([]);
                          setValueBranchCatEdit([]);
                          setSelectedOptionsBranchEdit([]);
                          setValueUnitCatEdit([]);
                          setSelectedOptionsUnitEdit([]);
                          setValueTeamCatEdit([]);
                          setSelectedOptionsTeamEdit([]);
                          setValueEmployeeCatEdit([]);
                          setEmployeeOptionEdit([]);
                          setEmployeeValueAddEdit([]);
                          SetOrganizationalUnitGroupingEdit({
                            workmode: "Please Select Work Mode",
                            organizationalunit:
                              "Please Select Organizational Unit",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Work Mode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={deduction}
                        styles={colourStyles}
                        value={{
                          label: organizationalUnitGroupingEdit.workmode,
                          value: organizationalUnitGroupingEdit.workmode,
                        }}
                        onChange={(e) => {
                          SetOrganizationalUnitGroupingEdit({
                            ...organizationalUnitGroupingEdit,
                            workmode: e.value,
                          });
                          fetchEmployeeNameEdit(valueTeamCatEdit, e.value);
                          setEmployeeValueAddEdit([]);
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
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsCompanyEdit}
                        onChange={(e) => {
                          handleCompanyChangeEdit(e);
                        }}
                        valueRenderer={customValueRendererCompanyEdit}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  {["Individual", "Team"]?.includes(filterStateEdit.type) ? (
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
                                valueCompanyCatEdit?.includes(comp.company)
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
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
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
                                  valueCompanyCatEdit?.includes(comp.company) &&
                                  valueBranchCatEdit?.includes(comp.branch)
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
                            value={selectedOptionsUnitEdit}
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
                                (u) =>
                                  valueCompanyCatEdit?.includes(u.company) &&
                                  valueBranchCatEdit?.includes(u.branch) &&
                                  valueUnitCatEdit?.includes(u.unit)
                              )
                              .map((u) => ({
                                ...u,
                                label: u.teamname,
                                value: u.teamname,
                              }))}
                            value={selectedOptionsTeamEdit}
                            onChange={(e) => {
                              handleTeamChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererTeamEdit}
                            labelledBy="Please Select Team"
                          />
                        </FormControl>
                      </Grid>
                      {["Individual"]?.includes(filterStateEdit.type) && (
                        <Grid item md={3} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                              Employee Name <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={employeeOptionEdit}
                              value={employeeValueAddEdit}
                              valueRenderer={customValueRendererEmployeeAddEdit}
                              onChange={handleEmployeeChangeAddEdit}
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </>
                  ) : ["Branch"]?.includes(filterStateEdit.type) ? (
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
                                valueCompanyCatEdit?.includes(comp.company)
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
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : ["Unit"]?.includes(filterStateEdit.type) ? (
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
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
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
                                  valueCompanyCatEdit?.includes(comp.company) &&
                                  valueBranchCatEdit?.includes(comp.branch)
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
                            value={selectedOptionsUnitEdit}
                            onChange={(e) => {
                              handleUnitChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererUnitEdit}
                            labelledBy="Please Select Unit"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ""
                  )}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Organizational Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={organizationalunitOptionEdit}
                        styles={colourStyles}
                        value={{
                          label:
                            organizationalUnitGroupingEdit.organizationalunit,
                          value:
                            organizationalUnitGroupingEdit.organizationalunit,
                        }}
                        onChange={(e) => {
                          SetOrganizationalUnitGroupingEdit({
                            ...organizationalUnitGroupingEdit,
                            organizationalunit: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      sx={buttonStyles.buttonsubmit}
                      type="submit"
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lorganizationalunitgrouping") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Organizational Unit Grouping List
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
                    {/* <MenuItem value={organizationalUnits?.length}>All</MenuItem> */}
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
                    "excelorganizationalunitgrouping"
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
                    "csvorganizationalunitgrouping"
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
                    "printorganizationalunitgrouping"
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
                    "pdforganizationalunitgrouping"
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
                    "imageorganizationalunitgrouping"
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
            <br />
            <br />
            {typemasterCheck ? (
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{
          marginTop: "80px",
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Organizational Unit Grouping
            </Typography>
            <br />
            <Grid container spacing={3}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <strong>Type</strong>
                  </Typography>
                  <Typography>
                    {organizationalUnitGroupingView?.type}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <strong> Work Mode</strong>
                  </Typography>
                  <Typography>
                    {organizationalUnitGroupingView?.workmode}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  <strong> Company</strong>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Typography>
                    {organizationalUnitGroupingView?.company}
                  </Typography>
                </FormControl>
              </Grid>
              {["Individual", "Team"]?.includes(
                organizationalUnitGroupingView.type
              ) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        <strong> Branch</strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.branch?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <strong> Unit</strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.unit?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <strong> Team</strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.team?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  {["Individual"]?.includes(
                    organizationalUnitGroupingView.type
                  ) && (
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "500" }}>
                          <strong> Employee Name </strong>
                        </Typography>
                        <Typography sx={{ overflowWrap: "break-word" }}>
                          {organizationalUnitGroupingView?.employee?.toString()}
                        </Typography>
                      </FormControl>
                    </Grid>
                  )}
                </>
              ) : ["Branch"]?.includes(organizationalUnitGroupingView.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <strong> Branch </strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.branch?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : ["Unit"]?.includes(organizationalUnitGroupingView.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <strong> Branch </strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.branch?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <strong> Unit </strong>
                      </Typography>
                      <Typography sx={{ overflowWrap: "break-word" }}>
                        {organizationalUnitGroupingView?.unit?.toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <strong> Organizational Unit </strong>
                  </Typography>
                  <Typography sx={{ overflowWrap: "break-word" }}>
                    {organizationalUnitGroupingView?.organizationalunit?.toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
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
        filename={"Organizational Unit Grouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delType}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Organizational Unit Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />
    </Box>
  );
}

export default OrganizationalUnitGrouping;
