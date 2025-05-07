import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Checkbox, Dialog, Chip, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Tooltip, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import WarningIcon from "@mui/icons-material/Warning";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import EmployeeExportData from "../../../components/EmployeeExport";
import InfoPopup from "../../../components/InfoPopup.js";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import jsPDF from "jspdf";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        position: "fixed", // Changed to absolute
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
      >
        Loading, please wait...
      </Typography>
    </Backdrop>
  );
};

function EmployeeList() {
  // Copied fields Name

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };
  const [isLoading, setIsLoading] = useState(false);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setFilterLoader(false);
    setTableLoader(false);
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
  const [employees, setEmployees] = useState([]);
  const [employeesExcel, setEmployeesExcel] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    pageName,
    setPageName,
    buttonStyles,
    allUsersData,
    allUsersLimit,
  } = useContext(UserRoleAccessContext);
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);

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
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Employee List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
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
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
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
      pagename: String("Employee List"),
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    status: true,
    percentage: true,
    empcode: true,
    companyname: true,
    username: true,
    email: true,
    branch: true,
    unit: true,
    team: true,
    shift: true,
    experience: true,
    doj: true,
    religion: true,
    expmode: true,
    expval: true,
    endexp: true,
    endexpdate: true,
    endtar: true,
    endtardate: true,
    workmode: true,
    checkbox: true,
    profileimage: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );


  const [selectedEmp, setSelectedEmp] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state
  const multiSelectInputRef = useRef(null);

  // const handlePasteForEmp = (e) => {
  //   e.preventDefault();
  //   const pastedText = e.clipboardData.getData('text');

  //   // Process the pasted text
  //   const newValues = pastedText.split('\n').filter((value) => value.trim() !== '');
  //   const pastedNames = newValues
  //     .flatMap(value => value.split(","))
  //     .map(name => name.replace(/\s*\.\s*/g, ".").trim())
  //     .filter(name => name !== "");


  //   // Update the state
  //   updateEmployees(pastedNames);

  //   // Refocus the Box after paste
  //   e.target.focus();
  // };

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

  // const updateEmployees = (pastedNames) => {
  //   // Ensure pastedNames is always an array
  //   const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

  //   const availableOptions = allUsersLimit
  //     ?.filter(
  //       (comp) =>
  //         valueCompanyCat?.includes(comp.company) &&
  //         valueBranchCat?.includes(comp.branch) &&
  //         valueUnitCat?.includes(comp.unit) &&
  //         valueTeamCat?.includes(comp.team)
  //     )
  //     ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

  //   const matchedValues = namesArray.filter((name) =>
  //     availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
  //   );

  //   setValueEmp((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  //   setSelectedOptionsEmployee((prev) => {
  //     // Filter out duplicates from namesArray
  //     const uniqueValues = matchedValues.filter((value) =>
  //       !prev.some((item) => item.value === value.replace(/\s*\.\s*/g, ".").trim())
  //     );

  //     // Map the unique values to label-value pairs
  //     const uniqueValuesMap = uniqueValues.map((data) => ({
  //       label: data.replace(/\s*\.\s*/g, ".").trim(),
  //       value: data.replace(/\s*\.\s*/g, ".").trim(),
  //     }));

  //     // Merge with previous values
  //     const updatedValues = [...prev, ...uniqueValuesMap];

  //     // Deduplicate based on the `value` property using a Map
  //     const uniqueSet = new Map(updatedValues.map((item) => [item.value, item]));

  //     // Convert the Map back to an array
  //     const uniqueArray = Array.from(uniqueSet.values());

  //     return uniqueArray;
  //   });

  //   setValueEmployeeCat((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  // };

  // Handle clicks outside the Box

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersData
      ?.filter(
        (comp) =>
          valueCompanyCat?.includes(comp.company) &&
          valueBranchCat?.includes(comp.branch) &&
          valueUnitCat?.includes(comp.unit) &&
          valueTeamCat?.includes(comp.team) &&
          comp.workmode !== "Internship"
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


  let userid = deleteuser?._id;
  //set function to get particular row
  const [checkProject, setCheckProject] = useState();
  const [checkTask, setCheckTask] = useState();
  const rowData = async (id, username) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteuser(res?.data?.suser);
      let resdev = await axios.post(SERVICE.USERPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojectouser: String(username),
      });
      setCheckProject(resdev?.data?.projects);
      let restask = await axios.post(SERVICE.USERTTASKCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkusertotask: String(username),
      });
      setCheckTask(restask?.data?.tasks);
      if (
        resdev?.data?.projects?.length > 0 ||
        restask?.data?.tasks?.length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpendel();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchEmployee = async () => {
    console.time("fetchEmployee"); // Start the timer for fetchEmployee
    setPageName(!pageName);
    try {
      // Fetch both employee data and profile images in parallel
      const [resEmployee, resImages] = await Promise.all([
        axios.post(
          SERVICE.USERSWITHSTATUS,
          { pageName: "Employee" },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.get(SERVICE.GETPROFILES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      // Extract employee data and profile images
      const employees = resEmployee?.data?.allusers || [];
      const empDocs = resImages?.data?.alldocuments || [];
      // Create a Map for profile images for quick lookups
      const profileImageMap = new Map(
        empDocs.map((item) => [item?.commonid, item?.profileimage || ""])
      );
      // Merge employee data with profile images
      const showData = employees.map((data) => ({
        ...data,
        profileimage: profileImageMap.get(data?._id) || "",
      }));
      setcheckemployeelist(true);
      setEmployees(showData);
      console.timeEnd("fetchEmployee"); // End the timer for fetchEmployee
    } catch (err) {
      setcheckemployeelist(true);
      const messages = err?.response?.data?.message || "Something went wrong!";
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
        </>
      );
      handleClickOpenerr();
    }
  };
  const delAddemployee = async () => {
    setPageName(!pageName);
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchListData();
      setPage(1);
      handleCloseDel();
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
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
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
  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;
  //------------------------------------------------------
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    setIsLoading(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const calculateExperience = (doj) => {
    const startDate = new Date(doj);
    const currentDate = new Date();
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentDate.getMonth();
    return Math.max(0, months);
  };
  const exportColumnNames = [
    "SNo",
    "Status",
    "Empcode",
    "Employee Name",
    "Username",
    "Email",
    "Branch",
    "Unit",
    "Team",
    "Experience",
    "DOJ",
    "Work Mode",
    "Religion",
    "Image",
  ];
  const exportRowValues = [
    "serialNumber",
    "status",
    "empcode",
    "companyname",
    "username",
    "email",
    "branch",
    "unit",
    "team",
    "experience",
    "doj",
    "workmode",
    "religion",
    "imageBase64",
  ];
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employeelist",
    pageStyle: "print",
  });
  // useEffect(() => {
  //   fetchEmployee();
  // }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => {
      const lastExpLog =
        item?.assignExpLog.filter(d => d.mode != "Auto" && d.mode != "Manual")?.length > 0
          ? item.assignExpLog[item.assignExpLog.length - 1]
          : {};
      return {
        ...item,
        _id: item._id,
        // serialNumber: index + 1,
        serialNumber: item.serialNumber,
        status: item.status || "",
        empcode: item.empcode || "",
        companyname: item.companyname || "",
        username: item.username || "",
        email: item.email || "",
        branch: item.branch || "",
        unit: item.unit || "",
        team: item.team || "",
        workmode: item.workmode || "",
        experience: calculateExperience(item.doj),
        religion: item.religion ? item.religion : "",
        doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
        dob: item.dob ? moment(item.dob).format("DD-MM-YYYY") : "",
        dot: item.dot ? moment(item.dob).format("DD-MM-YYYY") : "",
        dom: item.dom ? moment(item.dom).format("DD-MM-YYYY") : "",
        mode: lastExpLog.expmode || "",
        value: lastExpLog.expval || "",
        endexp: lastExpLog.endexp || "",
        endexpdate: lastExpLog.endexpdate
          ? moment(lastExpLog.endexpdate).format("DD-MM-YYYY")
          : "",
        endtar: lastExpLog.endtar || "",
        endtardate: lastExpLog.endtardate
          ? moment(lastExpLog.endtardate).format("DD-MM-YYYY")
          : "",
        profileimage: item?.profileimage,
      };
    });
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber(employees);

  }, [employees]);

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
  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   setPage(1);
  // };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  // const searchTerms = searchQuery?.replace(/\s+/g, "").toLowerCase().split(" ");
  // const filteredDatas = items?.filter((item) => {
  //   // Normalize companyname by removing spaces
  //   const normalizedCompanyName = item.companyname.replace(/\s+/g, "").toLowerCase();

  //   // Check if every search term is present in the normalized company name or other fields
  //   return searchTerms.every((term) =>
  //     normalizedCompanyName.includes(term) ||
  //     Object.values(item).join(" ").toLowerCase().includes(term)
  //   );
  // });

  // const searchTerms = searchQuery?.replace(/\s+/g, "").toLowerCase().split(" ");

  // const filteredDatas = items?.filter((item) => {
  //   // Create a normalized string of all fields joined together
  //   const normalizedItem = Object.values(item)
  //     .map(value => value?.toString().replace(/\s+/g, "").toLowerCase()) // Remove spaces and convert to lowercase
  //     .join(" ");

  //   // Check if every search term is present in the normalized item string
  //   return searchTerms.every((term) => normalizedItem.includes(term));
  // });

  // Pagination for outer filter
  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * page;
  const indexOfFirstItem = indexOfLastItem - page;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  // Function to render the status with icons and buttons
  const renderStatus = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };
    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color
    switch (status) {
      case "Exit Confirmed":
        icon = <CancelIcon {...iconProps} />;
        color = "#f44336"; // Blue
        break;
      case "Notice Period Applied":
      case "Notice Period Applied and Long Leave":
      case "Notice Period Applied and Long Absent":
        icon = <PauseCircleOutlineIcon {...iconProps} />;
        color = "#1976d2"; // Blue
        break;
      case "Notice Period Approved":
      case "Notice Period Approved and Long Leave":
      case "Notice Period Approved and Long Absent":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      case "Notice Period Cancelled":
      case "Notice Period Cancelled and Long Leave":
      case "Notice Period Cancelled and Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#9c27b0"; // Purple
        break;
      case "Notice Period Continue":
      case "Notice Period Continue and Long Leave":
      case "Notice Period Continue and Long Absent":
        icon = <WarningIcon {...iconProps} />;
        color = "#ff9800"; // Orange
        break;
      case "Notice Period Rejected":
      case "Notice Period Rejected and Long Leave":
      case "Notice Period Rejected and Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      case "Notice Period Recheck":
      case "Notice Period Recheck and Long Leave":
      case "Notice Period Recheck and Long Absent":
        icon = <InfoIcon {...iconProps} />;
        color = "#00acc1"; // Cyan
        break;
      case "Long Leave":
        icon = <PauseCircleOutlineIcon {...iconProps} />;
        color = "#1976d2"; // Blue
        break;
      case "Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      case "Live":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default gray
    }
    return (
      <Tooltip title={status} arrow>
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            fontSize: "0.75rem",
            padding: "2px 6px",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              overflow: "visible",
              whiteSpace: "normal",
              maxWidth: "none",
            },
          }}
          disableElevation
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {status}
          </Typography>
        </Button>
      </Tooltip>
    );
  };
  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", 
    //   sortable: false,
    //   width: 90,
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   hide: !columnVisibility.checkbox,
    //   pinned: "left",
    //   lockPinned: true,
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      cellRenderer: (params) => renderStatus(params?.data.status),
      hide: !columnVisibility.status,
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      lockPinned: true,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
      pinned: "left",
      lockPinned: true,
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
                handleCopy("Copied Empcode!");
              }}
              options={{ message: "Copied Empcode!" }}
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
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
      pinned: "left",
      lockPinned: true,
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
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.username,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "doj",
      headerName: "Doj",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.doj,
    },
    {
      field: "religion",
      headerName: "Religion",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.religion,
    },
    {
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.expmode,
    },
    {
      field: "expval",
      headerName: "Value",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.expval,
    },
    {
      field: "endexp",
      headerName: "End Exp",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endexp,
    },
    {
      field: "endexpdate",
      headerName: "End-Exp Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endexpdate,
    },
    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "endtardate",
      headerName: "End-Tar Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.workmode,
    },
    {
      field: "profileimage",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
        return params.value !== "" ? (
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <></>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 200,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      lockPinned: true,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("elist") && (
                    <a
                      href={`/edit/${params.data.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" sx={userStyle.actionbutton}>
                        <EditIcon sx={buttonStyles.buttonedit} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("dlist") && (
                    <Link to="">
                      <Button
                        size="small"
                        sx={userStyle.actionbutton}
                        onClick={(e) => {
                          rowData(params.data.id, params.data.username);
                        }}
                      >
                        <DeleteIcon sx={buttonStyles.buttondelete} />
                      </Button>
                    </Link>
                  )}
                  {isUserRoleCompare?.includes("vlist") && (
                    <a
                      href={`/view/${params.data.id}/employee`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" sx={userStyle.actionbutton}>
                        <VisibilityIcon sx={buttonStyles.buttonview} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("ilist") && (
                    <Link to="">
                      <Button
                        size="small"
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                      </Button>
                    </Link>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("vlist") && (
                  <Link
                    to={`/view/${params.data.id}`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button size="small" style={userStyle.actionbutton}>
                      <VisibilityIcon sx={buttonStyles.buttonview} />
                    </Button>
                  </Link>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];
  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      shift: item.shift,
      profileimage: item.profileimage,
      experience: item?.experience,
      expmode: item?.mode,
      expval: item?.value,
      endexp: item?.endexp,
      endexpdate: item?.endexpdate,
      endtar: item?.endtar,
      endtardate: item?.endtardate,
      doj: item?.doj,
      religion: item?.religion || "",
    };
  });
  // const rowsWithCheckboxes = rowDataTable.map((row) => ({
  //   ...row,
  //   // Create a custom field for rendering the checkbox
  //   checkbox: selectedRows.includes(row.id),
  // }));
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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
    </div>
  );

  const downloadPdf = async (isfilter) => {
    // setPageName(!pageName);
    try {
      const doc = new jsPDF({ orientation: "landscape" });

      // Define the table headers
      const headers = [
        "SNo",
        "Name of the Employee",
        "Employee Identification No",
        "Gender",
        "Father/Spouse Name",
        "Date of Birth",
        "Date of entry into Service",
        "Designation",
        "Present Address",
        "Permanent Address",
        "Employee PF No",
        "Employee ESIC No",
        "Aadhar No",
        "Date on which completion of 480 days of services",
        "Date on which made permanent",
        "Period of suspension if any",
        "Bank A/c No, Name of the Bank, Bank IFSC",
        "Mobile No",
        "e-mail",
        "Specimen Signature/Thumb impression",
        "Date of Exit",
        "Reason For Exit",
        "Remarks",
        "Photo",
      ];

      // Function to generate table data
      const generateTableData = (rowData) => {
        return rowData.map((row, index) => [
          index + 1,
          row.username,
          row.empcode,
          row.gender,
          row.fathername,
          row.dob,
          row.entryDate,
          row.designation,
          `${row.pdoorno},${row.pstreet},${row.parea},${row.pcity},${row.pstate},${row.ppincode}`,
          `${row.cdoorno},${row.cstreet},${row.carea},${row.ccity},${row.cstate},${row.cpincode}`,
          row.pfNo,
          row.esicNo,
          row.aadhar,
          row.completion480Days,
          row.permanentDate,
          row.suspensionPeriod,
          row.bankDetails,
          row.emergencyno,
          row.email,
          row.specimenSignature,
          row.exitDate,
          row.exitReason,
          row.remarks,
          // Store the base64 image string with index
          row.profileimage && { imageBase64: row.profileimage, index: index },
        ]);
      };
      let finaldata = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? []

      // Prepare data based on filter
      let tableData = [];
      if (isfilter === "filtered") {
        tableData = generateTableData(finaldata);
      } else {
        tableData = generateTableData(employees);
      }

      const addHeader = () => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("FORM-U", 130, 10);
        doc.text("EMPLOYEE REGISTER", 115, 15);
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("[See sub-rule(1) of rule(16)]", 125, 18);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(
          "TTS BUSINESS SERVICES PRIVATE LIMITED, NO 39, VAIGANALLUR AGRAHARAM, KULITHALAI-639104",
          65,
          25
        );
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Name and Address of the Establishment:", 5, 25);
        doc.text("Register Certificate No:", 5, 30);
      };

      const loadImage = (imageBase64) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageBase64;
        });
      };

      const loadedImages = await Promise.all(
        tableData.map((row, index) => {
          console.log(row[row.length - 1].imageBase64);
          if (row[row.length - 1].imageBase64) {
            console.log(
              loadImage(row[row.length - 1].imageBase64).then((img) => ({
                img,
                index,
              }))
            );
            return loadImage(row[row.length - 1].imageBase64).then((img) => ({
              img,
              index,
            }));
          } else {
            return { index };
          }
        })
      );

      console.log(loadedImages);
      const rowHeight = 10; // Set desired row height

      const addTable = async () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 5; // Left and right margin
        const availableWidth = pageWidth - margin * 2; // Available width for the table
        const columnCount = headers.length;
        const columnWidth = availableWidth / columnCount; // Distribute the available width equally among columns

        doc.autoTable({
          theme: "grid",
          styles: { fontSize: 5, cellPadding: 0.5, minCellHeight: 1 },
          headStyles: {
            fontSize: 5,
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
            halign: "center",
            valign: "middle",
          },
          head: [headers],
          body: tableData, // Exclude the image column from data
          startY: 40,
          margin: { top: 20, left: margin, right: margin, bottom: 10 },
          columnStyles: {
            0: { cellWidth: 5 }, // SNo
            1: { cellWidth: columnWidth }, // Name of the Employee
            2: { cellWidth: columnWidth }, // Employee Identification No
            3: { cellWidth: columnWidth }, // Gender
            4: { cellWidth: columnWidth }, // Father/Spouse Name
            5: { cellWidth: columnWidth }, // Date of Birth
            6: { cellWidth: columnWidth }, // Date of entry into Service
            7: { cellWidth: columnWidth }, // Designation
            8: { cellWidth: columnWidth }, // Present Address
            9: { cellWidth: columnWidth }, // Permanent Address
            10: { cellWidth: columnWidth }, // Employee PF No
            11: { cellWidth: columnWidth }, // Employee ESIC No
            12: { cellWidth: columnWidth }, // Aadhar No
            13: { cellWidth: columnWidth }, // Date on which completion of 480 days of services
            14: { cellWidth: columnWidth }, // Date on which made permanent
            15: { cellWidth: columnWidth }, // Period of suspension if any
            16: { cellWidth: columnWidth }, // Bank A/c No, Name of the Bank, Bank IFSC
            17: { cellWidth: columnWidth }, // Mobile No
            18: { cellWidth: columnWidth }, // e-mail
            19: { cellWidth: columnWidth }, // Specimen Signature/Thumb impression
            20: { cellWidth: columnWidth }, // Date of Exit
            21: { cellWidth: columnWidth }, // Reason For Exit
            22: { cellWidth: columnWidth }, // Remarks
            23: { cellWidth: columnWidth }, // Photo
          },
          pageBreak: "auto",
          rowPageBreak: "auto",
          showHead: "everyPage",
          bodyStyles: { valign: "middle" },
          didDrawCell: (data) => {
            console.log(data);
            // Ensure that the cell belongs to the body section and it's the image column
            if (
              data.section === "body" &&
              data.column.index === headers.length - 1
            ) {
              const imageInfo = loadedImages.find(
                (image) => image?.index === data.row.index
              );
              console.log(imageInfo);
              if (imageInfo?.img) {
                const imageHeight = 10; // Desired image height
                const imageWidth = 10; // Desired image width
                const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
                const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

                doc.addImage(
                  imageInfo.img,
                  "PNG",
                  data.cell.x + xOffset,
                  data.cell.y + yOffset,
                  imageWidth,
                  imageHeight
                );

                // Adjust cell styles to increase height
                data.cell.height = rowHeight; // Set custom height
              } else {
                // Clear cell content if no image
                data.cell.text = ""; // Clear the cell text
              }
            }
          },
          didDrawPage: (data) => {
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            const totalPages = Math.ceil(tableData.length / 10);
            if (pageNumber < totalPages) {
              doc.addPage({ orientation: "landscape" });
              addHeader();
            }
          },
        });
      };

      addHeader();
      await addTable();
      doc.save("Labour Office.pdf");
    } catch (err) {
      console.log(err);
    }
  };

  //FILTER START
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
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
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

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
  //employee multiselect
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

  //MULTISELECT ONCHANGE END
  const handleClearFilter = () => {
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
    setEmployeeOptions([]);
    setEmployees([]);

    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("warning");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchListData();
    }
  };

  const fetchListData = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    try {
      let response = await axios.post(
        SERVICE.USERSWITHSTATUS,
        {
          pageName: "Employee",
          company:
            valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
          branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
          unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
          team: valueTeamCat,
          department: valueDepartmentCat,
          employee: valueEmployeeCat,
          profileimage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setEmployees(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
      console.log(response.data.allusers?.map((item, index) => ({ ...item, serialNumber: index + 1, })));

      setSearchQuery("");
      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
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

      let employees = allUsersData
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

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map(a => a.value));
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
    handleAutoSelect();
  }, [isAssignBranch]);

  //FILTER END

  return (
    <>
      <Box>
        <NotificationContainer />
        <Headtitle title={"EMPLOYEE LIST"} />
        {/* ****** Header Content ****** */}
        <PageHeading
          title="Employee Details"
          modulename="Human Resources"
          submodulename="HR"
          mainpagename="Employee"
          subpagename="Employee details"
          subsubpagename="List"
        />
        {isUserRoleCompare?.includes("llist") && (
          <>
            <Box sx={userStyle.selectcontainer}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      Employee List Filter
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
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
                                  i.label === item.label &&
                                  i.value === item.value
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

                  {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
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
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                  {["Individual", "Team"]?.includes(filterState.type) ? (
                    <>
                      {/* Branch Unit Team */}
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
                  {/* {["Individual"]?.includes(filterState.type) && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allUsersData
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
                            }))}
                          value={selectedOptionsEmployee}
                          onChange={(e) => {
                            handleEmployeeChange(e);
                          }}
                          valueRenderer={customValueRendererEmployee}
                          labelledBy="Please Select Employee"
                        />
                      </FormControl>
                    </Grid>
                  )} */}
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
                            options={allUsersData
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
                              }))}
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
                  <Grid item md={3} xs={12} sm={6} mt={3}>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        onClick={handleFilter}
                        loading={filterLoader}
                        sx={buttonStyles.buttonsubmit}
                      >
                        Filter
                      </LoadingButton>

                      <Button
                        sx={buttonStyles.btncancel}
                        onClick={handleClearFilter}
                      >
                        Clear
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </>
            </Box>
          </>
        )} <br />
        {isUserRoleCompare?.includes("llist") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Employees List
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {isUserRoleCompare?.includes("alist") && (
                    <>
                      <Link
                        to="/addemployee"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={buttonStyles.buttonsubmit}
                        >
                          ADD
                        </Button>
                      </Link>
                    </>
                  )}
                </Grid>
              </Grid>
              <Box>
                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                  <Grid item md={2} xs={12} sm={12}>
                    <Box>
                      <label htmlFor="pageSizeSelect">Show entries:</label>
                      <Select
                        id="pageSizeSelect"
                        value={pageSize}
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
                  <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                    <Box>
                      {isUserRoleCompare?.includes("excellist") && (
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
                      {isUserRoleCompare?.includes("csvlist") && (
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
                      {isUserRoleCompare?.includes("printlist") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleprint}
                          >
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdflist") && (
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
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              downloadPdf("filtered");
                              // setIsPdfFilterOpen(true);
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Labour Office PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imagelist") && (
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
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
                      maindatas={employees}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={employees}
                    />
                  </Grid>
                </Grid>  <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button> <br /><br />
                {!tableLoader ? (
                  <>
                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                        gridRefTableImg={gridRefTableImg}
                        paginated={false}
                        filteredDatas={filteredDatas}
                        // totalDatas={totalDatas}
                        searchQuery={searchedString}
                        handleShowAllColumns={handleShowAllColumns}
                        setFilteredRowData={setFilteredRowData}
                        filteredRowData={filteredRowData}
                        setFilteredChanges={setFilteredChanges}
                        filteredChanges={filteredChanges}
                        rowHeight={80}
                        itemsList={employees}
                      />
                    </Box>
                  </>
                ) : (
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
                )}
              </Box>
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
        {/* Check Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog
                open={isCheckOpen}
                onClose={handleCloseCheck}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{
                    width: "350px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "80px", color: "orange" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", textAlign: "center" }}
                  >
                    {checkProject?.length > 0 && checkTask?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>
                          Project & Task
                        </span>{" "}
                      </>
                    ) : checkProject?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>{" "}
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>Project</span>
                      </>
                    ) : checkTask?.length > 0 ? (
                      <>
                        <span
                          style={{ fontWeight: "700", color: "#777" }}
                        >{`${deleteuser?.username} `}</span>{" "}
                        was linked in{" "}
                        <span style={{ fontWeight: "700" }}>Task</span>
                      </>
                    ) : (
                      ""
                    )}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseCheck}
                    autoFocus
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>

        <DeleteConfirmation
          open={isDeleteOpen}
          onClose={handleCloseDel}
          onConfirm={delAddemployee}
          title="Are you sure?"
          confirmButtonText="Yes"
          cancelButtonText="Cancel"
        />
        {/* VALIDATION */}
        <MessageAlert
          openPopup={openPopupMalert}
          handleClosePopup={handleClosePopupMalert}
          popupContent={popupContentMalert}
          popupSeverity={popupSeverityMalert}
        />
        <AlertDialog
          openPopup={openPopup}
          handleClosePopup={handleClosePopup}
          popupContent={popupContent}
          popupSeverity={popupSeverity}
        />
        <EmployeeExportData
          isFilterOpen={isFilterOpen}
          handleCloseFilterMod={handleCloseFilterMod}
          fileFormat={fileFormat}
          setIsFilterOpen={setIsFilterOpen}
          isPdfFilterOpen={isPdfFilterOpen}
          setIsPdfFilterOpen={setIsPdfFilterOpen}
          handleClosePdfFilterMod={handleClosePdfFilterMod}
          // filteredDataTwo={filteredData ?? []}
          filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
          itemsTwo={employees ?? []}
          filename={"Employees List"}
          exportColumnNames={exportColumnNames}
          exportRowValues={exportRowValues}
          componentRef={componentRef}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
        <InfoPopup
          openInfo={openInfo}
          handleCloseinfo={handleCloseinfo}
          heading="Employee Details Info"
          addedby={addedby}
          updateby={updateby}
        />
      </Box >
      <LoadingBackdrop open={isLoading} />
    </>
  );
}

export default EmployeeList;