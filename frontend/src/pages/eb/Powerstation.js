import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box, InputAdornment,
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
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaSearch, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import {
  daysOpt,
  messagereceivedfromOptions,
  statusOptions,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/SearchbarEbList.js';
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";

function PowerStation() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);
  const [powerstationArray, setPowerstationArray] = useState([]);
  const [managematerialCheck, setManagematerialcheck] = useState(false);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setloadingdeloverall(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Company ",
    "Branch ",
    "Unit ",
    "Name ",
    "Date ",
    "From Time",
    "To Time",
    "Total Time",
    "Power Shutdown Type",
    "Message Received From",
    "Person Name",
    "Reason",
    "Description ",
    "Reminder ",
    // "Status",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "name",
    "date",
    "fromtime",
    "totime",
    "totaltime",
    "powershutdowntype",
    "messagereceivedfrom",
    "personname",
    "reason",
    "description",
    "noofdays",
  ];
  const [loadingdeloverall, setloadingdeloverall] = useState(false);





  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const gridRef = useRef(null);
  const [selectedCompanyValues, setSelectedCompanyValues] = useState([]);
  const [selectedEditCompanyValues, setSelectedEditCompanyValues] = useState(
    []
  );
  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedCompanyEditFrom, setSelectedCompanyEditFrom] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //state to handle holiday values
  const [powerstationState, setPowerstationState] = useState({
    company: [""],
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    name: "",
    date: "",
    description: "",
    noofdays: "Please Select Day",
    powershutdowntype: "Please Select Power Shutdown Type",
    fromtime: "",
    totime: "",
    totaltime: "",
    reason: "",
    messagereceivedfrom: "Please Select Message Received From",
    personname: "",
    status: "Please Select Status",
    cancelreason: "",
    postponddate: "",
    postpondfromtime: "",
    postpondtotime: "",
    postpondtotaltime: "",
  });

  const [powerstationEdit, setPowerstationEdit] = useState({});
  const [powerShutDownTypeOption, setPowerShutDownTypeOption] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUnit,
    allTeam,
    allCompany,
    allBranch,
    pageName, setPageName, buttonStyles
  } = useContext(UserRoleAccessContext);
  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))

  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(true);

  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesEdit, setdocumentFilesEdit] = useState([]);

  const handleResumeUpload = (event) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFiles([
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        },
      ]);
    };
  };
  const handleResumeUploadEdit = (event) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      setdocumentFilesEdit([
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        },
      ]);
    };
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteEdit = (index) => {
    setdocumentFilesEdit((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

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
  const [copiedData, setCopiedData] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    name: true,
    date: true,
    noofdays: true,
    actions: true,
    fromtime: true,
    totime: true,
    totaltime: true,
    powershutdowntype: true,
    messagereceivedfrom: true,
    status: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isAddOpenalert, setIsAddOpenalert] = useState(false);
  const [isUpdateOpenalert, setIsUpdateOpenalert] = useState(false);

  //get power shutdown tpe.
  const fetchPowerShutdownType = async () => {
    setPageName(!pageName)
    try {
      let res_location = await axios.get(SERVICE.MANAGEPOWERSHUTDOWNTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerShutDownTypeOption([
        ...res_location?.data?.managepowershutdowntypename?.map((t) => ({
          ...t,
          label: t.shutdowntypename,
          value: t.shutdowntypename,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //company multiselect dropdown changes
  const handleCompanyChangeFrom = (options) => {
    setSelectedCompanyFrom(options);
    setSelectedCompanyValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    setPowerstationState({
      ...powerstationState,
      branch: "Please Select Branch",
      unit: "Please Select Unit",
    });
  };

  const handleCompanyEditChangeFrom = (options) => {
    setSelectedCompanyEditFrom(options);
    // if (options.length === 0) {
    //   setPowerstationEdit({
    //     ...powerstationEdit,
    //     branch: "Please Select Branch",
    //     unit: "Please Select Unit",
    //   });
    // } else {
    //   setSelectedEditCompanyValues(options.map((a, index) => a.value));
    // }
    setSelectedEditCompanyValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    setPowerstationEdit({
      ...powerstationEdit,
      branch: "Please Select Branch",
      unit: "Please Select Unit",
    });

  };

  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };

  const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {

    try {
      setIsHandleChange(false)
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        setIsDeleteOpencheckbox(true);
      }

    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  useEffect(() => {
    // Function to calculate total time when either fromtime or totime changes
    const calculateTotalTime = () => {
      const { fromtime, totime } = powerstationState;
      if (fromtime && totime) {
        const [fromHours, fromMinutes] = fromtime.split(":").map(Number);
        const [toHours, toMinutes] = totime.split(":").map(Number);

        let totalHours = toHours - fromHours;
        let totalMinutes = toMinutes - fromMinutes;

        if (totalMinutes < 0) {
          totalHours -= 1;
          totalMinutes += 60;
        }
        if (totalHours < 0) {
          totalHours += 24;
        }

        const formattedTotalTime = `${totalHours < 10 ? "0" : ""
          }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;
        setPowerstationState({
          ...powerstationState,
          totaltime: formattedTotalTime,
        });
      }
    };

    calculateTotalTime(); // Call the function initially
  }, [powerstationState.fromtime, powerstationState.totime]);

  useEffect(() => {
    // Function to calculate total time when either fromtime or totime changes
    const calculateTotalTime = () => {
      const { postpondfromtime, postpondtotime } = powerstationState;
      if (postpondfromtime && postpondtotime) {
        const [fromHours, fromMinutes] = postpondfromtime
          .split(":")
          .map(Number);
        const [toHours, toMinutes] = postpondtotime.split(":").map(Number);

        let totalHours = toHours - fromHours;
        let totalMinutes = toMinutes - fromMinutes;

        if (totalMinutes < 0) {
          totalHours -= 1;
          totalMinutes += 60;
        }
        if (totalHours < 0) {
          totalHours += 24;
        }

        const formattedTotalTime = `${totalHours < 10 ? "0" : ""
          }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;
        setPowerstationState({
          ...powerstationState,
          postpondtotaltime: formattedTotalTime,
        });
      }
    };

    calculateTotalTime(); // Call the function initially
  }, [powerstationState.postpondfromtime, powerstationState.postpondtotime]);

  useEffect(() => {
    const calculateTotalTimeEdit = () => {
      const { postpondfromtime, postpondtotime } = powerstationEdit;
      if (postpondfromtime && postpondtotime) {
        const [fromHours, fromMinutes] = postpondfromtime
          .split(":")
          .map(Number);
        const [toHours, toMinutes] = postpondtotime.split(":").map(Number);

        let totalHours = toHours - fromHours;
        let totalMinutes = toMinutes - fromMinutes;

        if (totalMinutes < 0) {
          totalHours -= 1;
          totalMinutes += 60;
        }
        if (totalHours < 0) {
          totalHours += 24;
        }

        const formattedTotalTime = `${totalHours < 10 ? "0" : ""
          }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;
        setPowerstationEdit({
          ...powerstationEdit,
          postpondtotaltime: formattedTotalTime,
        });
      }
    };

    calculateTotalTimeEdit();
  }, [powerstationEdit.postpondfromtime, powerstationEdit.postpondtotime]);

  useEffect(() => {
    const calculateTotalTimeEdit = () => {
      const { fromtime, totime } = powerstationEdit;
      if (fromtime && totime) {
        const [fromHours, fromMinutes] = fromtime.split(":").map(Number);
        const [toHours, toMinutes] = totime.split(":").map(Number);

        let totalHours = toHours - fromHours;
        let totalMinutes = toMinutes - fromMinutes;

        if (totalMinutes < 0) {
          totalHours -= 1;
          totalMinutes += 60;
        }
        if (totalHours < 0) {
          totalHours += 24;
        }

        const formattedTotalTime = `${totalHours < 10 ? "0" : ""
          }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;
        setPowerstationEdit({
          ...powerstationEdit,
          totaltime: formattedTotalTime,
        });
      }
    };

    calculateTotalTimeEdit();
  }, [powerstationEdit.fromtime, powerstationEdit.totime]);

  const handleTimeChange = (event, timeField) => {
    const inputValue = event.target.value;
    setPowerstationState({
      ...powerstationState,
      [timeField]: inputValue,
    });
  };

  const handleTimeChangeEdit = (event, timeField) => {
    const inputValue = event.target.value;
    setPowerstationEdit({
      ...powerstationEdit,
      [timeField]: inputValue,
    });
  };

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_POWERTSTATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteHoliday(res.data.spowerstation);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let holidayid = deleteHoliday._id;
  const delHoliday = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_POWERTSTATION}/${holidayid}`, {
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
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let statusCreate = await axios.post(SERVICE.CREATE_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: selectedCompanyValues,
        branch: String(powerstationState.branch),
        unit: String(powerstationState.unit),
        name: String(powerstationState.name),
        date: String(powerstationState.date),
        description: String(powerstationState.description),
        fromtime: String(powerstationState.fromtime),
        totime: String(powerstationState.totime),
        totaltime: String(powerstationState.totaltime),
        powershutdowntype: String(powerstationState.powershutdowntype),
        messagereceivedfrom: String(powerstationState.messagereceivedfrom),
        status: String(powerstationState.status),
        cancelreason: String(
          powerstationState.status === "Canceled"
            ? powerstationState.cancelreason
            : ""
        ),
        postponddate: String(
          powerstationState.status === "Postponed"
            ? powerstationState.postponddate
            : ""
        ),
        postpondfromtime: String(
          powerstationState.status === "Postponed"
            ? powerstationState.postpondfromtime
            : ""
        ),
        postpondtotime: String(
          powerstationState.status === "Postponed"
            ? powerstationState.postpondtotime
            : ""
        ),
        postpondtotaltime: String(
          powerstationState.status === "Postponed"
            ? powerstationState.postpondtotaltime
            : ""
        ),
        reason: String(powerstationState.reason),
        personname: String(
          powerstationState.messagereceivedfrom === "Person"
            ? powerstationState.personname
            : ""
        ),
        document: documentFiles,
        noofdays: String(
          powerstationState.noofdays === "Please Select Day"
            ? 0
            : powerstationState.noofdays
        ),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchHoliday();

      setPowerstationState({
        ...powerstationState,
        name: "",
        date: "",
        description: "",
        reason: "",
        fromtime: "",
        totime: "",
        totaltime: "",
        personname: "",
        cancelreason: "",
        postponddate: "",
        postpondfromtime: "",
        postpondtotime: "",
        postpondtotaltime: "",
      });
      setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();
    let compopt = selectedCompanyValues.map((item) => item);
    const isNameMatch = powerstationArray?.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch == powerstationState.branch &&
        item.unit == powerstationState.unit &&
        item.name?.toLowerCase() == powerstationState.name?.toLowerCase() &&
        item.date == powerstationState.date &&
        item.fromtime == powerstationState.fromtime &&
        item.totime == powerstationState.totime &&
        item.status == powerstationState.status
    );
    if (selectedCompanyFrom.length <= 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.date === "") {
      setPopupContentMalert("Please Choose Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.fromtime === "") {
      setPopupContentMalert("Please Select From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.totime === "") {
      setPopupContentMalert("Please Select To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.fromtime >= powerstationState.totime) {
      setPopupContentMalert("From Time Must be grater than To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.powershutdowntype ===
      "Please Select Power Shutdown Type"
    ) {
      setPopupContentMalert("Please Select Power Shutdown Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.messagereceivedfrom ===
      "Please Select Message Received From"
    ) {
      setPopupContentMalert("Please Select Message Received From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.messagereceivedfrom === "Person" &&
      powerstationState.personname === ""
    ) {
      setPopupContentMalert("Please Enter Person Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationState.status === "Please Select Status") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.status === "Postponed" &&
      powerstationState.postponddate === ""
    ) {
      setPopupContentMalert("Please Select Postponed Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.status === "Postponed" &&
      powerstationState.postpondfromtime === ""
    ) {
      setPopupContentMalert("Please Select Postponed From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.status === "Postponed" &&
      powerstationState.postpondtotime === ""
    ) {
      setPopupContentMalert("Please Select Postponed To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationState.status === "Postponed" &&
      powerstationState.postpondfromtime >= powerstationState.postpondtotime
    ) {
      setPopupContentMalert(
        "Postponed From Time Must be greater than To Time!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setPowerstationState({
      company: [""],
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      name: "",
      date: "",
      description: "",
      noofdays: "Please Select Day",
      powershutdowntype: "Please Select Power Shutdown Type",
      fromtime: "",
      totime: "",
      totaltime: "",
      reason: "",
      messagereceivedfrom: "Please Select Message Received From",
      personname: "",
      status: "Please Select Status",
      cancelreason: "",
      postponddate: "",
      postpondfromtime: "",
      postpondtotime: "",
      postpondtotaltime: "",
    });
    setSelectedCompanyFrom([]);
    setdocumentFiles([]);
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
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_POWERTSTATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerstationEdit(res?.data?.spowerstation);
      setdocumentFilesEdit(res?.data?.spowerstation?.document);
      setSelectedCompanyEditFrom([
        ...res?.data?.spowerstation?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSelectedCompanyValues(
        res?.data?.spowerstation?.company.map((a, index) => {
          return a;
        })
      );
      setSelectedEditCompanyValues(
        res?.data?.spowerstation?.company.map((a, index) => {
          return a;
        })
      );

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_POWERTSTATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerstationEdit(res?.data?.spowerstation);
      setdocumentFilesEdit(res?.data?.spowerstation?.document);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {

      let res = await axios.get(`${SERVICE.SINGLE_POWERTSTATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerstationEdit(res?.data?.spowerstation);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // updateby edit page...
  let updateby = powerstationEdit?.updatedby;

  let addedby = powerstationEdit?.addedby;
  let holidayId = powerstationEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_POWERTSTATION}/${holidayId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: selectedEditCompanyValues,
          branch: String(powerstationEdit.branch),
          unit: String(powerstationEdit.unit),
          name: String(powerstationEdit.name),
          date: String(powerstationEdit.date),
          description: String(powerstationEdit.description),
          fromtime: String(powerstationEdit.fromtime),
          totime: String(powerstationEdit.totime),
          totaltime: String(powerstationEdit.totaltime),
          powershutdowntype: String(powerstationEdit.powershutdowntype),
          messagereceivedfrom: String(powerstationEdit.messagereceivedfrom),
          reason: String(powerstationEdit.reason),
          status: String(powerstationEdit.status),
          cancelreason: String(
            powerstationEdit.status === "Canceled"
              ? powerstationEdit.cancelreason
              : ""
          ),
          postponddate: String(
            powerstationEdit.status === "Postponed"
              ? powerstationEdit.postponddate
              : ""
          ),
          postpondfromtime: String(
            powerstationEdit.status === "Postponed"
              ? powerstationEdit.postpondfromtime
              : ""
          ),
          postpondtotime: String(
            powerstationEdit.status === "Postponed"
              ? powerstationEdit.postpondtotime
              : ""
          ),
          postpondtotaltime: String(
            powerstationEdit.status === "Postponed"
              ? powerstationEdit.postpondtotaltime
              : ""
          ),
          personname: String(
            powerstationEdit.messagereceivedfrom === "Person"
              ? powerstationEdit.personname
              : ""
          ),
          document: documentFilesEdit,
          noofdays: String(
            powerstationEdit.noofdays === "Please Select Day"
              ? 0
              : powerstationEdit.noofdays
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

      await fetchHoliday();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchHolidayAll();
    let compopt = selectedEditCompanyValues.map((item) => item);
    const isNameMatch = allStatusEdit?.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch == powerstationEdit.branch &&
        item.unit == powerstationEdit.unit &&
        item.name?.toLowerCase() == powerstationEdit.name?.toLowerCase() &&
        item.date == powerstationEdit.date &&
        item.fromtime == powerstationEdit.fromtime &&
        item.totime == powerstationEdit.totime &&
        item.status == powerstationEdit.status
    );
    if (selectedCompanyEditFrom.length <= 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.date === "") {
      setPopupContentMalert("Please Choose Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.fromtime === "") {
      setPopupContentMalert("Please Select From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.totime === "") {
      setPopupContentMalert("Please Select To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.fromtime >= powerstationEdit.totime) {
      setPopupContentMalert("From Time Must be grater than To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.powershutdowntype === "Please Select Power Shutdown Type"
    ) {
      setPopupContentMalert("Please Select Power Shutdown Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.messagereceivedfrom ===
      "Please Select Message Received From"
    ) {
      setPopupContentMalert("Please Select Message Received From!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      handleClickOpenerr();
    } else if (
      powerstationEdit.messagereceivedfrom === "Person" &&
      powerstationEdit.personname === ""
    ) {
      setPopupContentMalert("Please Enter Person Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (powerstationEdit.status === "Please Select Status") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.status === "Postponed" &&
      powerstationEdit.postponddate === ""
    ) {
      setPopupContentMalert("Please Select Postponed Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.status === "Postponed" &&
      (powerstationEdit.postpondfromtime === "" ||
        powerstationEdit.postpondfromtime == undefined)
    ) {
      setPopupContentMalert("Please Select Postponed From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.status === "Postponed" &&
      (powerstationEdit.postpondtotime === "" ||
        powerstationEdit.postpondtotime == undefined)
    ) {
      setPopupContentMalert("Please Select Postponed To Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      powerstationEdit.status === "Postponed" &&
      powerstationEdit.postpondfromtime >= powerstationEdit.postpondtotime
    ) {
      setPopupContentMalert(
        "Postponed From Time Must be greater than To Time!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all data.
  const fetchHoliday = async () => {
    setPageName(!pageName)
    setManagematerialcheck(true)

    const accessmodule = [];

    isAssignBranch.map((data) => {
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
        data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.subpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
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

      accessmodule.push(fetfinalurl);
    });

    const uniqueValues = [...new Set(accessmodule.flat())];

    if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
      try {
        let res_status = await axios.post(SERVICE.ALL_POWERSTATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,
        });
        setPowerstationArray(res_status?.data?.powerstation?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: index + 1,
          date: moment(item.date).format("DD-MM-YYYY"),
          postponddate: moment(item.postponddate).format("DD-MM-YYYY"),
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          name: item.name,
          description: item.description,
          noofdays: item.noofdays,
          fromtime: item.fromtime,
          totime: item.totime,
          totaltime: item.totaltime,
          powershutdowntype: item.powershutdowntype,
          messagereceivedfrom: item.messagereceivedfrom,
          reason: item.reason,
          personname: item.personname,
          status: item.status,
          cancelreason: item.cancelreason,
          postpondfromtime: item.postpondfromtime,
          postpondtotime: item.postpondtotime,
          postpondtotaltime: item.postpondtotaltime,
        })));
        setManagematerialcheck(false)
      } catch (err) {
        setManagematerialcheck(false)
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
    else {
      setManagematerialcheck(true)
      setPowerstationArray([]);
    }
  }
  //get all data.
  const fetchHolidayAll = async () => {
    setPageName(!pageName)


    try {
      let res_status = await axios.post(SERVICE.ALL_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setAllStatusEdit(
        res_status?.data?.powerstation.filter(
          (item) => item._id !== powerstationEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //image


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "PowerShutDown.png");
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
    documentTitle: "Power ShutDown",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {

    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(powerstationArray);
  }, [powerstationArray]);
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }



  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),
    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);
    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },

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
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 100,
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
      field: "fromtime",
      headerName: "From Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.fromtime,
      headerClassName: "bold-header",
    },
    {
      field: "totime",
      headerName: "To Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totime,
      headerClassName: "bold-header",
    },
    {
      field: "totaltime",
      headerName: "Total Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totaltime,
      headerClassName: "bold-header",
    },
    {
      field: "powershutdowntype",
      headerName: "Power Shutdown Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.powershutdowntype,
      headerClassName: "bold-header",
    },
    {
      field: "messagereceivedfrom",
      headerName: "Message Received From",
      flex: 0,
      width: 150,
      hide: !columnVisibility.messagereceivedfrom,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 120,
      hide: !columnVisibility.status,
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
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("emanagepowershutdown") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmanagepowershutdown") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanagepowershutdown") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanagepowershutdown") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

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
      company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      branch: item.branch,
      unit: item.unit,
      name: item.name,
      date: item.date,
      description: item.description,
      noofdays: item.noofdays,
      fromtime: item.fromtime,
      totime: item.totime,
      totaltime: item.totaltime,
      powershutdowntype: item.powershutdowntype,
      messagereceivedfrom: item.messagereceivedfrom,
      reason: item.reason,
      personname: item.personname,
      status: item.status,
      cancelreason: item.cancelreason,
      postponddate: item.postponddate,
      postpondfromtime: item.postpondfromtime,
      postpondtotime: item.postpondtotime,
      postpondtotaltime: item.postpondtotaltime,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Show All Columns functionality
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


  useEffect(() => {
    fetchPowerShutdownType();
    fetchHoliday();
  }, []);



  useEffect(() => {
    fetchHolidayAll();
  }, [isEditOpen]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const delAccountcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_POWERTSTATION}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false)
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      fetchHolidayAll();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [fileFormat, setFormat] = useState("");


  //Access Module
  const pathname = window.location.pathname;

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Manage Power ShutDown"),
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

  return (
    <Box>
      <Headtitle title={"Manage Power ShutDown"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Power ShutDown</Typography> */}
      <PageHeading
        title="Manage Power ShutDown"
        modulename="EB"
        submodulename="Power ShutDown"
        mainpagename="Power ShutDown Type"
        subpagename=""
        subsubpagename=""
      />
      {!statusCheck ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "350px",
            }}
          >
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
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("amanagepowershutdown") && (
            <Box sx={userStyle.selectcontainer}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      Power ShutDown
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <MultiSelect
                        options={isAssignBranch
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
                        value={selectedCompanyFrom}
                        onChange={handleCompanyChangeFrom}
                        valueRenderer={customValueRendererCompanyFrom}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter((comp) =>
                            selectedCompanyValues?.includes(comp.company)
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
                        styles={colourStyles}
                        value={{
                          label: powerstationState.branch,
                          value: powerstationState.branch,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            branch: e.value,
                            unit: "Please Select Unit",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter(
                            (comp) =>
                              selectedCompanyValues?.includes(comp.company) &&
                              powerstationState.branch === comp.branch
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
                        styles={colourStyles}
                        value={{
                          label: powerstationState.unit,
                          value: powerstationState.unit,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            unit: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={powerstationState.name}
                        onChange={(e) => {
                          const userInput = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(userInput)) {
                            setPowerstationState({
                              ...powerstationState,
                              name: userInput,
                            });
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
                        value={powerstationState.date}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            date: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        From Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="fromtime"
                        type="time"
                        value={powerstationState.fromtime}
                        placeholder="HH:MM"
                        onChange={(e) => handleTimeChange(e, "fromtime")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        To Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="totime"
                        type="time"
                        value={powerstationState.totime}
                        placeholder="HH:MM"
                        onChange={(e) => handleTimeChange(e, "totime")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Time</Typography>
                      <OutlinedInput
                        id="totaltime"
                        type="text"
                        value={powerstationState.totaltime}
                        placeholder="HH:MM"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Power Shutdownn Type<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={powerShutDownTypeOption}
                        styles={colourStyles}
                        placeholder="Please Select Power Shutdown Type"
                        value={{
                          label: powerstationState.powershutdowntype,
                          value: powerstationState.powershutdowntype,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            powershutdowntype: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Message Received From<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={messagereceivedfromOptions}
                        styles={colourStyles}
                        placeholder="Please Select Message Received From"
                        value={{
                          label: powerstationState.messagereceivedfrom,
                          value: powerstationState.messagereceivedfrom,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            messagereceivedfrom: e.value,
                            personname: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {powerstationState.messagereceivedfrom === "Person" && (
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Person Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Name"
                          value={powerstationState.personname}
                          onChange={(e) => {
                            const userInput = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(userInput)) {
                              setPowerstationState({
                                ...powerstationState,
                                personname: userInput,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Reason</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={powerstationState.reason}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            reason: e.target.value,
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
                          label: powerstationState.noofdays,
                          value: powerstationState.noofdays,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            noofdays: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Description</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={powerstationState.description}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            description: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={statusOptions}
                        styles={colourStyles}
                        placeholder="Please Select Status"
                        value={{
                          label: powerstationState.status,
                          value: powerstationState.status,
                        }}
                        onChange={(e) => {
                          setPowerstationState({
                            ...powerstationState,
                            status: e.value,
                            cancelreason: "",
                            postponddate: "",
                            postpondfromtime: "",
                            postpondtotime: "",
                            postpondtotaltime: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {powerstationState.status === "Postponed" && (
                    <>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Postponed Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={powerstationState.postponddate}
                            onChange={(e) => {
                              setPowerstationState({
                                ...powerstationState,
                                postponddate: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Postponed From Time{" "}
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="fromtime"
                            type="time"
                            value={powerstationState.postpondfromtime}
                            placeholder="HH:MM"
                            onChange={(e) =>
                              handleTimeChange(e, "postpondfromtime")
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Postponed To Time <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="postpondtotime"
                            type="time"
                            value={powerstationState.postpondtotime}
                            placeholder="HH:MM"
                            onChange={(e) =>
                              handleTimeChange(e, "postpondtotime")
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Postponed Total Time</Typography>
                          <OutlinedInput
                            id="postpondtotaltime"
                            type="text"
                            value={powerstationState.postpondtotaltime}
                            placeholder="HH:MM"
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {powerstationState.status === "Canceled" && (
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Cancel Reason</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2.5}
                          value={powerstationState.cancelreason}
                          onChange={(e) => {
                            setPowerstationState({
                              ...powerstationState,
                              cancelreason: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={12} sm={12} xs={12}>
                    <br /> <br />
                    <Typography variant="h6">Upload Document</Typography>
                    <Grid marginTop={2}>
                      <Button
                        variant="contained"
                        size="small"
                        component="label"
                        sx={{
                          "@media only screen and (max-width:550px)": {
                            marginY: "5px",
                          },
                        }}
                      >
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                          name="file"
                          hidden
                          onChange={(e) => {
                            handleResumeUpload(e);
                          }}
                        />
                      </Button>
                      <br />
                      <br />
                      {documentFiles?.length > 0 &&
                        documentFiles.map((file, index) => (
                          <>
                            <Grid container spacing={2}>
                              <Grid item lg={8} md={8} sm={6} xs={6}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <Button
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    cursor: "pointer",
                                    marginTop: "-5px",
                                  }}
                                  onClick={() => handleFileDelete(index)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container>
                  <Grid item md={3} xs={12} sm={6}>
                    {/* {isUserRoleCompare?.includes("smanageholiday") && ( */}
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button> */}
                    <LoadingButton
                      onClick={handleSubmit}
                      loading={loadingdeloverall}
                      sx={buttonStyles.buttonsubmit}
                      variant="contained"
                    >
                      Submit
                    </LoadingButton>
                    {/* )} */}
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
      )}

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanagepowershutdown") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Power ShutDown
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
                    <MenuItem value={(powerstationArray?.length)}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelmanagepowershutdown") && (
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

                  {isUserRoleCompare?.includes("csvmanagepowershutdown") && (
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
                  {isUserRoleCompare?.includes("printmanagepowershutdown") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanagepowershutdown") && (
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
                  {isUserRoleCompare?.includes("imagemanagepowershutdown") && (
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
                  maindatas={powerstationArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={powerstationArray}
                />
              </Grid>
            </Grid>
            <br />

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;

            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>&ensp;

            {isUserRoleCompare?.includes("bdmanagepowershutdown") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {managematerialCheck ? (
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
                      itemsList={powerstationArray}
                    />
                  </>
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "85px" }}
      >
        <Box sx={{ padding: "30px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Power ShutDown List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {powerstationEdit.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{powerstationEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>{powerstationEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{powerstationEdit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Date</Typography>
                  <Typography>
                    {powerstationEdit.date
                      ? new Date(powerstationEdit.date).toLocaleDateString(
                        "en-GB"
                      )
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> From Time</Typography>
                  <Typography>{powerstationEdit.fromtime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> To Time</Typography>
                  <Typography>{powerstationEdit.totime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Total Time</Typography>
                  <Typography>{powerstationEdit.totaltime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Power Shutdown Type</Typography>
                  <Typography>{powerstationEdit.powershutdowntype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Message Received From</Typography>
                  <Typography>
                    {powerstationEdit.messagereceivedfrom}
                  </Typography>
                </FormControl>
              </Grid>
              {powerstationEdit.messagereceivedfrom === "Person" && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Person Name</Typography>
                    <Typography>{powerstationEdit.personname}</Typography>
                  </FormControl>
                </Grid>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reason</Typography>
                  <Typography>{powerstationEdit.reason}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Description</Typography>
                  <Typography>{powerstationEdit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Reminder</Typography>
                  <Typography>{powerstationEdit.noofdays}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Status</Typography>
                  <Typography>{powerstationEdit.status}</Typography>
                </FormControl>
              </Grid>
              {powerstationEdit.status === "Canceled" && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Cancel Reason</Typography>
                    <Typography>{powerstationEdit.cancelreason}</Typography>
                  </FormControl>
                </Grid>
              )}
              {powerstationEdit.status === "Postponed" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed Date</Typography>
                      <Typography>
                        {moment(powerstationEdit.postponddate).format(
                          "DD-MM-YYYY"
                        )}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed From Time</Typography>
                      <Typography>
                        {powerstationEdit.postpondfromtime}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed To Time</Typography>
                      <Typography>{powerstationEdit.postpondtotime}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Postponed Total Time</Typography>
                      <Typography>
                        {powerstationEdit.postpondtotaltime}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={12} sm={12} xs={12}>
                <br /> <br />
                <Typography variant="h6">Upload Document</Typography>
                <Grid marginTop={2}>
                  {/* <Button
                    variant="contained"
                    size="small"
                    component="label"
                    sx={{
                      "@media only screen and (max-width:550px)": {
                        marginY: "5px",
                      },
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      id="resume"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                      name="file"
                      hidden
                      onChange={(e) => {
                        handleResumeUploadEdit(e);
                      }}
                    />
                  </Button> */}
                  <br />
                  <br />
                  {documentFilesEdit?.length > 0 &&
                    documentFilesEdit.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={6} xs={6}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            {/* <Button
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                                marginTop: "-5px",
                              }}
                              onClick={() => handleFileDeleteEdit(index)}
                            >
                              <DeleteIcon />
                            </Button> */}
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
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
          maxWidth="md"
          fullWidth={true}
          sx={{ marginTop: "85px" }}
        >
          <Box sx={{ padding: "30px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Power ShutDown
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                      value={selectedCompanyEditFrom}
                      onChange={handleCompanyEditChangeFrom}
                      valueRenderer={customValueRendererEditCompanyFrom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter((comp) =>
                          selectedEditCompanyValues?.includes(comp.company)
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
                      styles={colourStyles}
                      value={{
                        label: powerstationEdit.branch,
                        value: powerstationEdit.branch,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit({
                          ...powerstationEdit,
                          branch: e.value,
                          unit: "Please Select Unit",

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            selectedEditCompanyValues?.includes(comp.company) &&
                            powerstationEdit.branch === comp.branch
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
                      styles={colourStyles}
                      value={{
                        label: powerstationEdit.unit,
                        value: powerstationEdit.unit,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit((prev) => ({
                          ...prev,
                          unit: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={powerstationEdit.name}
                      onChange={(e) => {
                        const userInput = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(userInput)) {
                          setPowerstationEdit((prev) => ({
                            ...prev,
                            name: userInput,
                          }));
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={powerstationEdit.date}
                      onChange={(e) => {
                        setPowerstationEdit((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      From Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="fromtime"
                      type="time"
                      value={powerstationEdit.fromtime}
                      placeholder="HH:MM"
                      onChange={(e) => handleTimeChangeEdit(e, "fromtime")}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="totime"
                      type="time"
                      value={powerstationEdit.totime}
                      placeholder="HH:MM"
                      onChange={(e) => handleTimeChangeEdit(e, "totime")}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Total Time</Typography>
                    <OutlinedInput
                      id="totaltime"
                      type="text"
                      value={powerstationEdit.totaltime}
                      placeholder="HH:MM"
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Power Shutdownn Type<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={powerShutDownTypeOption}
                      styles={colourStyles}
                      placeholder="Please Select Power Shutdown Type"
                      value={{
                        label: powerstationEdit.powershutdowntype,
                        value: powerstationEdit.powershutdowntype,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit({
                          ...powerstationEdit,
                          powershutdowntype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Message Received From<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={messagereceivedfromOptions}
                      styles={colourStyles}
                      placeholder="Please Select Message Received From"
                      value={{
                        label: powerstationEdit.messagereceivedfrom,
                        value: powerstationEdit.messagereceivedfrom,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit({
                          ...powerstationEdit,
                          messagereceivedfrom: e.value,
                          personname: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {powerstationEdit.messagereceivedfrom === "Person" && (
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Person Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={powerstationEdit.personname}
                        onChange={(e) => {
                          const userInput = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(userInput)) {
                            setPowerstationEdit({
                              ...powerstationEdit,
                              personname: userInput,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Reason</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2.5}
                      value={powerstationEdit.reason}
                      onChange={(e) => {
                        setPowerstationEdit({
                          ...powerstationEdit,
                          reason: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      No.Of days before when reminder email is sent
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={daysOpt}
                      placeholder="Please Select Branch"
                      value={{
                        label: powerstationEdit.noofdays,
                        value: powerstationEdit.noofdays,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit((prev) => ({
                          ...prev,
                          noofdays: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={powerstationEdit.description}
                      onChange={(e) => {
                        setPowerstationEdit((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                      style={{ height: "100px" }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={statusOptions}
                      styles={colourStyles}
                      placeholder="Please Select Status"
                      value={{
                        label: powerstationEdit.status,
                        value: powerstationEdit.status,
                      }}
                      onChange={(e) => {
                        setPowerstationEdit({
                          ...powerstationEdit,
                          status: e.value,
                          cancelreason: "",
                          postponddate: "",
                          postpondfromtime: "",
                          postpondtotime: "",
                          postpondtotaltime: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {powerstationEdit.status === "Postponed" && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Postponed Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={powerstationEdit.postponddate}
                          onChange={(e) => {
                            setPowerstationEdit({
                              ...powerstationEdit,
                              postponddate: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Postponed From Time <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="postpondfromtime"
                          type="time"
                          value={powerstationEdit.postpondfromtime}
                          placeholder="HH:MM"
                          onChange={(e) =>
                            handleTimeChangeEdit(e, "postpondfromtime")
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Postponed To Time <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="postpondtotime"
                          type="time"
                          value={powerstationEdit.postpondtotime}
                          placeholder="HH:MM"
                          onChange={(e) =>
                            handleTimeChangeEdit(e, "postpondtotime")
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Postponed Total Time</Typography>
                        <OutlinedInput
                          id="postpondtotaltime"
                          type="text"
                          value={powerstationEdit.postpondtotaltime}
                          placeholder="HH:MM"
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {powerstationEdit.status === "Canceled" && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Cancel Reason</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={powerstationEdit.cancelreason}
                        onChange={(e) => {
                          setPowerstationEdit({
                            ...powerstationEdit,
                            cancelreason: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={12} sm={12} xs={12}>
                  <br /> <br />
                  <Typography variant="h6">Upload Document</Typography>
                  <Grid marginTop={2}>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUploadEdit(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFilesEdit?.length > 0 &&
                      documentFilesEdit.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item lg={8} md={8} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(file)}
                              />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDeleteEdit(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
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

      {/* EXPTERNAL COMPONENTS -------------- START */}
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
        filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
        itemsTwo={powerstationArray ?? []}
        filename={"PowerShutdown"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Power Shutdown Info"
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
        onConfirm={delAccountcheckbox}
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
      {/* EXPTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}
export default PowerStation;
