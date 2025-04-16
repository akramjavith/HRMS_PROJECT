import React, { useState, useEffect, useRef, useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion as MUIAccordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  OutlinedInput,
  Select,
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
  IconButton, Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaSearch } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import InfoIcon from "@mui/icons-material/Info";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import { ThreeDots } from "react-loader-spinner";

function EmployeeAssetDistribution() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] =
    useState("");



  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState([]);
  //  const [filteredRowData, setFilteredRowData] = useState([]);
  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions






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

  const [upload, setUpload] = useState([]);
  const handleResumeUpload = (event) => {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;

    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
          },
        ]);
      };
    }

    if (showAlert) {
      setPopupContentMalert("File size is greater than 1MB, please upload a file below 1MB.!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };
  const [uploadEdit, setUploadEdit] = useState([]);
  const handleResumeUploadEdit = (event) => {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;

    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadEdit((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
          },
        ]);
      };
    }

    if (showAlert) {
      setPopupContentMalert("File size is greater than 1MB, please upload a file below 1MB.!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
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
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleFileDeleteEdit = (index) => {
    setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


  let exportColumnNames = [
    "Status",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Assetmaterial",
    "AssetmaterialCode",
    "assigndate",
    "assigntime",
    "Companys",
    "Branchs",
    "Units",
    "Team",
    "Employeename",
  ];
  let exportRowValues = [
    "status",
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "assetmateriallist",
    "assetmaterialcode",
    "assigndate",
    "assigntime",
    "companyto",
    "branchto",
    "unitto",
    "teamto",
    "employeenameto",
  ];

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  let now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  let currtime = `${hours}:${minutes}`;
  const gridRefNeartat = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsNear, setSelectedRowsNear] = useState([]);
  const [itemsneartat, setItemsNearTat] = useState([]);
  const [materialOpt, setMaterialopt] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);
  const [selectedBranchTo, setSelectedBranchTo] = useState([]);
  const [selectedUnitTo, setSelectedUnitTo] = useState([]);
  const [selectedTeamTo, setSelectedTeamTo] = useState([]);
  const [selectedEmployeeTo, setSelectedEmployeeTo] = useState([]);
  const [selectedBranchToEdit, setSelectedBranchToEdit] = useState([]);
  const [selectedUnitToEdit, setSelectedUnitToEdit] = useState([]);
  const [selectedTeamToEdit, setSelectedTeamToEdit] = useState([]);
  const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState([]);
  //branchto multiselect dropdown chang
  const handleBranchChangeTo = (options) => {
    setSelectedBranchTo(options);
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererBranchTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeTo = (options) => {
    setSelectedUnitTo(options);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererUnitTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeTo = (options) => {
    setSelectedTeamTo(options);
    setSelectedEmployeeTo([]);
  };
  const customValueRendererTeamTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeTo = (options) => {
    setSelectedEmployeeTo(options);
  };
  const customValueRendererEmployeeTo = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeToEdit = (options) => {
    setSelectedBranchToEdit(options);
    setSelectedUnitToEdit([]);
    setSelectedTeamToEdit([]);

    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererBranchToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //unitto multiselect dropdown changes
  const handleUnitChangeToEdit = (options) => {
    setSelectedUnitToEdit(options);
    setSelectedTeamToEdit([]);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererUnitToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeToEdit = (options) => {
    setSelectedTeamToEdit(options);
    setSelectedEmployeeToEdit([]);
  };
  const customValueRendererTeamToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeToEdit = (options) => {
    setSelectedEmployeeToEdit(options);
  };
  const customValueRendererEmployeeToEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select To Employee Name";
  };
  const [individualasset, setIndividualAsset] = useState([]);
  const [uniqueid, setUniqueid] = useState(0);
  const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);

  const getRowClassNameNearTat = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const handleCaptureImagenear = () => {
    if (gridRefNeartat.current) {
      html2canvas(gridRefNeartat.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "AssetEmployeeDistribution.png");
        });
      });
    }
  };

  const handleSelectionChangeNear = (newSelection) => {
    setSelectedRowsNear(newSelection.selectionModel);
  };

  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [maintentancemaster, setMaintentancemaster] = useState({
    company: "Please Select Company",
    companyto: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "",
    assetmaterialcode: "",
    assetmaterialcheck: "",
    workstation: "Please Select Workstation",
    employee: "",
    assigndate: today,
    assigntime: currtime,
    addedby: "",
    updatedby: "",
  });
  const [maintentancemasteredit, setMaintentancemasteredit] = useState({
    company: "Please Select Company",
    companyto: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "",
    assetmaterialcode: "",
    assetmaterialcheck: "",
    assigndate: today,
    assigntime: currtime,
  });
  const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([]);
  const handleMaterialChange = (options) => {
    setSelectedOptionsMaterial(options);
  };

  const customValueRendererBranch = (valueMaterialCat, _categoryname) => {
    return valueMaterialCat?.length
      ? valueMaterialCat.map(({ label }) => label)?.join(", ")
      : "Please Select AssetMaterial";
  };

  const [selectedOptionsMaterialEdit, setSelectedOptionsMaterialEdit] =
    useState([]);
  const handleMaterialChangeEdit = (options) => {
    setSelectedOptionsMaterialEdit(options);
  };
  const customValueRendererMaterialEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select AssetMaterial";
  };

  const {
    isUserRoleCompare,
    isUserRoleAccess, pageName, setPageName,
    isAssignBranch,
    allUsersData,
    allTeam,
    allfloor,
    alllocationgrouping,
    allareagrouping, buttonStyles
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchto: data.branch,
      companyto: data.company,
      unitto: data.unit,
    }))

  //Datatable
  const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
  const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [allProjectedit, setAllProjectedit] = useState([]);
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
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRowsNear.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckboxbulk(true);
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
  //bulk Delete model
  const [isDeleteOpencheckboxbulk, setIsDeleteOpencheckboxbulk] = useState(false);

  const handleClickOpencheckboxbulk = () => {
    setIsDeleteOpencheckboxbulk(true);
  };
  const handleCloseModcheckboxbulk = () => {
    setIsDeleteOpencheckboxbulk(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  // Manage Columns
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
  // Manage Columns
  const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] =
    useState(false);
  const [anchorElNeartat, setAnchorElNeartat] = useState(null);
  const handleOpenManageColumnsNeartat = (event) => {
    setAnchorElNeartat(event.currentTarget);
    setManageColumnsOpenNeartat(true);
  };
  const handleCloseManageColumnsNeartat = () => {
    setManageColumnsOpenNeartat(false);
    setSearchQueryManageNeartat("");
  };

  const openneartat = Boolean(anchorElNeartat);
  const idneartat = openneartat ? "simple-popover" : undefined;
  // Show All Columns & Manage Columns
  const initialColumnVisibilityNeartat = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    status: true,
    assetmaterial: true,
    assetmaterialcode: true,
    subcomponents: true,
    subcomponentsstring: true,
    assetmateriallist: true,
    assigntime: true,
    assigndate: true,
    companyto: true,
    branchtolist: true,
    unittolist: true,
    teamtolist: true,
    employeenametolist: true,
    actions: true,
  };
  const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(
    initialColumnVisibilityNeartat
  );
  //Delete model
  const handleClickOpenNear = () => {
    setIsDeleteOpenNear(true);
  };
  const handleCloseModNear = () => {
    setIsDeleteOpenNear(false);
  };

  //set function to get particular row
  const rowDataNear = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.semployeeasset);
      handleClickOpencheckbox();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  const delProjectcheckbox = async () => {
    setPageName(!pageName)
    try {
      let onlyyetToAccept = itemsneartat?.filter(item => item?.status === "Yet To Accept");
      const array1Ids = new Set(onlyyetToAccept.map((item) => item._id));
      let deletIds = selectedRowsNear?.filter(id => array1Ids.has(id));
      if (selectedRowsNear?.length !== 0 && deletIds?.length === 0) {
        setPopupContentMalert("Only Yet To Accept Data can be able to delete!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        handleCloseModcheckboxbulk();
        setSelectedRowsNear([]);
        return;
      }

      const deletePromises = deletIds?.map((item) => {
        return axios.delete(`${SERVICE.EMPLOYEEASSET_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchMaintentanceIndividual();
      handleCloseModcheckboxbulk();
      setSelectedRowsNear([]);
      setSelectAllCheckedNear(false);
      setPageNearTatPrimary(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delProject = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = [deleteproject?._id]?.map((item) => {
        return axios.delete(`${SERVICE.EMPLOYEEASSET_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchMaintentanceIndividual();
      handleCloseModcheckbox();
      setSelectedRowsNear([]);
      setSelectAllCheckedNear(false);
      setPageNearTatPrimary(1);
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
      // let subarray = selectedOptionsMaterial.map((item) => item.value);
      let branchnamesto = selectedBranchTo.map((item) => item.value);
      let unitnamesto = selectedUnitTo.map((item) => item.value);
      let teamnamesto = selectedTeamTo.map((item) => item.value);
      // let employeenamesto = selectedEmployeeTo.map((item) => item.value);
      let uniqueval = uniqueid ? uniqueid + 1 : 1;

      let selectedUserData = allUsersData?.find(item => item?.companyname === maintentancemaster?.employee)

      // const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);

      let freqCreate = await axios.post(SERVICE.EMPLOYEEASSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        company: String(maintentancemaster.company),
        branch: String(maintentancemaster.branch),
        unit: String(maintentancemaster.unit),
        floor: String(maintentancemaster.floor),
        location: String(maintentancemaster.location),
        area: String(maintentancemaster.area),
        employee: String(maintentancemaster.employee),
        assetmaterial: maintentancemaster?.assetmaterial,
        assetmaterialcode: maintentancemaster?.assetmaterialcode,
        assetmaterialcheck: maintentancemaster.assetmaterialcheck,
        assigndate: String(maintentancemaster.assigndate),
        assigntime: String(maintentancemaster.assigntime),
        companyto: String(selectedUserData?.company),
        branchto: [selectedUserData?.branch],
        unitto: [selectedUserData?.unit],
        teamto: [selectedUserData?.team],
        employeenameto: [maintentancemaster?.employee],
        uniqueid: uniqueval,
        status: "Yet To Accept",
        images: upload,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setMaintentancemaster({
        ...maintentancemaster,
        assetmaterialcode: "",
        assigndate: today,
        assigntime: currtime,
      });
      setUpload([])
      await fetchMaintentanceIndividual();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      console.log(err)
      setloadingdeloverall(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = async () => {
    setPageName(!pageName)
    setloadingdeloverall(true);

    // setIndividualAsset(res_project?.data?.employeeassets);
    let subarray = selectedOptionsMaterial.map((item) => item.value);
    const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);
    const isNameMatch = allDistributionDatas?.filter(data => data?.status !== "Returned")?.some(
      (item) =>
        // item.company === maintentancemaster.company &&
        // item.branch === maintentancemaster.branch &&
        // item.unit === maintentancemaster.unit &&
        // item.floor === maintentancemaster.floor &&
        // item.area === maintentancemaster.area &&
        // item.location === maintentancemaster.location &&
        // item.assetmaterial === maintentancemaster.assetmaterial &&
        item.assetmaterialcode === maintentancemaster.assetmaterialcode
      // item.assigndate === maintentancemaster.assigndate &&
      // item.assigntime === maintentancemaster.assigntime &&
      // item.companyto === maintentancemaster.companyto &&
      // item.branchto.some((item) =>
      //   selectedBranchTo.map((item) => item.value).includes(item)
      // ) &&
      // item.unitto.some((item) =>
      //   selectedUnitTo.map((item) => item.value).includes(item)
      // ) &&
      // item.teamto.some((item) =>
      //   selectedTeamTo.map((item) => item.value).includes(item)
      // ) &&
      // item.employeenameto?.includes(maintentancemaster?.employee)
    );

    if (maintentancemaster.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster?.assetmaterial === "" || !maintentancemaster?.assetmaterial) {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster?.assetmaterialcode === "" || !maintentancemaster?.assetmaterialcode) {
      setPopupContentMalert("Please Select Asset Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster.assigndate === "") {
      setPopupContentMalert("Please Select AssignDate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.assigntime === "") {
      setPopupContentMalert("Please Select AssignTime!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchTo.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitTo.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeamTo.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (upload?.length === 0) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster?.employee === "" || !maintentancemaster?.employee) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setMaintentancemaster({
      company: "Please Select Company",
      companyto: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "",
      assetmaterialcode: "",
      assigndate: today,
      assigntime: currtime,
    });
    setAccordianCreate([])
    setUpload([])
    setFloors([]);
    setAreas([]);
    setSelectedBranchTo([]);
    setSelectedUnitTo([]);
    setSelectedTeamTo([]);
    setSelectedEmployeeTo([]);
    setSelectedOptionsMaterial([]);
    setLocations([{ label: "ALL", value: "ALL" }]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [isEditOpenNear, setIsEditOpenNear] = useState(false);

  //Edit model...
  const handleClickOpenEditNear = () => {
    setIsEditOpenNear(true);
  };
  const handleCloseModEditNear = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenNear(false);
    setSelectedOptionsMaterialEdit([]);
  };

  //get single row to edit....
  const getCodeNear = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllLocationEdit();
      await fetchUnAssignedIPAddress(res?.data?.semployeeasset?.assetmaterialcode, setAccordianCreateEdit);
      setMaintentancemasteredit({ ...res?.data?.semployeeasset, employee: res?.data?.semployeeasset?.employeenameto[0] });
      fetchFloorEdit(res?.data?.semployeeasset?.branch);
      setUploadEdit(res?.data?.semployeeasset?.images);
      fetchAreaEdit(
        res?.data?.semployeeasset?.branch,
        res?.data?.semployeeasset?.floor
      );
      fetchAllLocationEdit(
        res?.data?.semployeeasset?.branch,
        res?.data?.semployeeasset?.floor,
        res?.data?.semployeeasset?.area
      );
      // setSelectedOptionsMaterialEdit(
      //   res?.data?.semployeeasset.assetmaterial.map((item) => ({
      //     ...item,
      //     label: item,
      //     value: item,
      //   }))
      // );

      setSelectedBranchToEdit(
        res?.data?.semployeeasset.branchto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedUnitToEdit(
        res?.data?.semployeeasset.unitto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedTeamToEdit(
        res?.data?.semployeeasset.teamto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setSelectedEmployeeToEdit(
        res?.data?.semployeeasset.employeenameto.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      handleClickOpenEditNear();
      await fetchProjMasterAll();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [openviewnear, setOpenviewnear] = useState(false);

  // view model
  const handleClickOpenviewnear = () => {
    setOpenviewnear(true);
  };

  const handleCloseviewnear = () => {
    setOpenviewnear(false);
  };

  // get single row to view....
  const [maintenanceview, setMaintenanceview] = useState([]);

  const getviewCodeNear = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMaintenanceview(res?.data?.semployeeasset);
      await fetchUnAssignedIPAddress(res?.data?.semployeeasset?.assetmaterialcode, setAccordianCreateView);
      handleClickOpenviewnear();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMaintentancemasteredit(res?.data?.semployeeasset);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = maintentancemasteredit?.updatedby;
  let addedby = maintentancemasteredit?.addedby;
  let maintenanceid = maintentancemasteredit?._id;

  const sendEditRequestNear = async () => {
    setPageName(!pageName)
    // let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
    let branchnamesto = selectedBranchToEdit.map((item) => item.value);
    let unitnamesto = selectedUnitToEdit.map((item) => item.value);
    let teamnamesto = selectedTeamToEdit.map((item) => item.value);
    // let employeenamesto = selectedEmployeeToEdit.map((item) => item.value);
    // const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);

    let selectedUserData = allUsersData?.find(item => item?.companyname === maintentancemasteredit?.employee)

    try {
      let res = await axios.put(
        `${SERVICE.EMPLOYEEASSET_SINGLE}/${maintenanceid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(maintentancemasteredit.company),
          branch: String(maintentancemasteredit.branch),
          unit: String(maintentancemasteredit.unit),
          floor: String(maintentancemasteredit.floor),
          location: String(maintentancemasteredit.location),
          area: String(maintentancemasteredit.area),
          employee: String(maintentancemasteredit.employee),
          assetmaterialcheck: String(maintentancemasteredit.assetmaterialcheck),
          assigndate: String(maintentancemasteredit.assigndate),
          assigntime: String(maintentancemasteredit.assigntime),
          assetmaterial: maintentancemasteredit?.assetmaterial,
          assetmaterialcode: maintentancemasteredit?.assetmaterialcode,
          companyto: String(selectedUserData?.company),
          branchto: [selectedUserData?.branch],
          unitto: [selectedUserData?.unit],
          teamto: [selectedUserData?.team],
          employeenameto: maintentancemasteredit?.employee,
          images: uploadEdit,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchMaintentanceIndividual();

      handleCloseModEditNear();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmitNear = async (e) => {
    setPageName(!pageName)
    e.preventDefault();

    let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
    const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);
    const isNameMatch = allDistributionDatas?.filter(data => data?.status !== "Returned" && data?._id !== maintentancemasteredit?._id).some(
      (item) =>
        // item.company === maintentancemasteredit.company &&
        // item.branch === maintentancemasteredit.branch &&
        // item.unit === maintentancemasteredit.unit &&
        // item.floor === maintentancemasteredit.floor &&
        // item.area === maintentancemasteredit.area &&
        // item.location === maintentancemasteredit.location &&
        // item.assetmaterial === maintentancemasteredit.assetmaterial &&
        item.assetmaterialcode === maintentancemasteredit.assetmaterialcode
      // item.assigndate === maintentancemasteredit.assigndate &&
      // item.assigntime === maintentancemasteredit.assigntime &&
      // item.companyto === maintentancemasteredit.companyto &&
      // item.branchto.some((item) =>
      //   selectedBranchToEdit.map((item) => item.value).includes(item)
      // ) &&
      // item.unitto.some((item) =>
      //   selectedUnitToEdit.map((item) => item.value).includes(item)
      // ) &&
      // item.teamto.some((item) =>
      //   selectedTeamToEdit.map((item) => item.value).includes(item)
      // ) &&
      // item.employeenameto?.includes(maintentancemasteredit?.employee)
    );
    if (maintentancemasteredit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit?.assetmaterial === "" || !maintentancemasteredit?.assetmaterial) {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit?.assetmaterialcode === "" || !maintentancemasteredit?.assetmaterialcode) {
      setPopupContentMalert("Please Select Asset Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit.assigndate === "") {
      setPopupContentMalert("Please Select AssignDate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.assigntime === "") {
      setPopupContentMalert("Please Select AssignTime!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.companyto === "Please Select Company") {
      setPopupContentMalert("Please Select Company To!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchToEdit.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitToEdit.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeamToEdit.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemasteredit?.employee === "" || !maintentancemasteredit?.employee) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (uploadEdit.length === 0) {
      setPopupContentMalert("Please Upload Image!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequestNear();
    }
  };

  const fetchMaterial = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETMATERIALIP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMaterialopt(res?.data?.assetmaterialip);
      console.log(res?.data?.assetmaterialip, "res?.data?.assetmaterialip");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchFloor = async (e) => {
    let result = allfloor.filter((d) => d.branch === e.value);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
      .filter((d) => d.branch === newcheckbranch && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };
  const fetchLocation = async (e) => {
    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === newcheckbranch &&
          d.floor === maintentancemaster.floor &&
          d.area === e
      )
      .map((data) => data.location);
    let ji = [].concat(...result);
    const all = [
      { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocations(all);
  };

  const fetchFloorEdit = async (e) => {
    let result = allfloor.filter((d) => d.branch === e);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloorEdit(floorall);
  };
  const fetchAreaEdit = async (a, e) => {
    let result = allareagrouping
      .filter((d) => d.branch === a && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreasEdit(all);
  };
  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {
    let result = alllocationgrouping
      .filter((d) => d.branch === a && d.floor === b && d.area === c)
      .map((data) => data.location);
    let ji = [].concat(...result);
    const all = [
      { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocationsEdit(all);
  };

  // useEffect(() => {
  //   fetchAllLocationEdit();
  // }, [isEditOpen, maintentancemasteredit.floor]);

  const fetchMaintentanceIndividual = async () => {
    setPageName(!pageName)

    let assignbranch = accessbranch;
    setLoading(true)
    try {
      // let res = await axios.get(SERVICE.EMPLOYEEASSET, {
      let res_employee = await axios.post(SERVICE.ASSET_DISTRIBUTION_GROUPED_DATAS, { assignbranch }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.groupedData?.length > 0 ? res_employee?.data?.groupedData : []
      const itemsWithSerialNumber = ans?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))?.map((item, index) => {

        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          assigndate: moment(item.assigndate).format("DD/MM/YYYY"),
          assigntime: moment(item.assigntime, "HH:mm").format("hh:mm A"),
          assetmateriallist: item.assetmaterial,
          branchtolist: item.branchto
            ? item.branchto
              ?.map((t, i) => t)
              .join(", ")
              .toString()
            : "",
          unittolist: item.unitto
            ?.map((t, i) => t)
            .join(", ")
            .toString(),
          teamtolist: item.teamto
            ?.map((t, i) => t)
            .join(", ")
            .toString(),
          employeenametolist: item.employeenameto
            ?.map((t, i) => `${i + 1 + "."}` + t)
            .join(", ")
            .toString(),
        }
      });

      setIndividualAsset(itemsWithSerialNumber);
      setItemsNearTat(itemsWithSerialNumber);
      setOverallFilterdata(itemsWithSerialNumber);
      await fetchAllDistribution();

      setLoading(false)
      // setIndividualAsset(res?.data?.employeeassets?.filter((item) => item?.status !== "recovered"));
    } catch (err) {
      handleApiError(err, setLoading(false), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchMaintentanceIndividual();
  }, []);
  // }, [accessbranch, individualasset]);

  //get all project.
  const fetchProjMasterAll = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.EMPLOYEEASSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllProjectedit(
        res_project?.data?.employeeassets.filter(
          (item) => item._id !== maintentancemasteredit?._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [allDistributionDatas, setAllDistributionDatas] = useState([])
  const fetchAllDistribution = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.EMPLOYEEASSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllDistributionDatas(
        res_project?.data?.employeeassets.map(
          (item) => ({
            _id: item?._id,
            assetmaterialcode: item?.assetmaterialcode,
            status: item?.status,
          })
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRefNear = useRef();
  const handleprintNear = useReactToPrint({
    content: () => componentRefNear.current,
    documentTitle: "Asset Employee Distribution",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumberNearTat = (datas) => {
    // console.log(datas, "datas")
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   serialNumber: index + 1,
    //   assigndate: moment(item.assigndate).format("DD/MM/YYYY"),
    // assigntime:moment(item.assigntime, "HH:mm").format("hh:mm A"),
    //   assetmateriallist: item.assetmaterial
    //     ? item.assetmaterial
    //       ?.map((t, i) => t)
    //       .join(", ")
    //       .toString()
    //     : "",
    // }));
    setItemsNearTat(datas);
  };

  useEffect(() => {
    addSerialNumberNearTat(individualasset);
  }, [individualasset]);
  //Datatable
  const handlePageChangeNearTatPrimary = (newPage) => {
    setPageNearTatPrimary(newPage);
  };

  const handlePageSizeChangeNearTatPrimary = (event) => {
    setPageSizeNearTatPrimary(Number(event.target.value));
    setPageNearTatPrimary(1);
  };


  const handleSearchChangeNearTatPrimary = (event) => {
    setSearchQueryNearTatPrimary(event.target.value);
    setFilterValue(event.target.value);
    setPageNearTatPrimary(1);
  };

  const searchOverNearTerms = searchQueryNearTatPrimary
    .toLowerCase()
    .split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
    return searchOverNearTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice(
    (pageNearTatPrimary - 1) * pageSizeNearTatPrimary,
    pageNearTatPrimary * pageSizeNearTatPrimary
  );

  const totalPagesNearTatPrimary = Math.ceil(
    filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary
  );

  const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

  const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
  const lastVisiblePageNearTatPrimary = Math.min(
    Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1),
    totalPagesNearTatPrimary
  );

  const pageNumbersNearTatPrimary = [];

  const indexOfLastItemNearTatPrimary =
    pageNearTatPrimary * pageSizeNearTatPrimary;
  const indexOfFirstItemNearTatPrimary =
    indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;

  for (
    let i = firstVisiblePageNearTatPrimary;
    i <= lastVisiblePageNearTatPrimary;
    i++
  ) {
    pageNumbersNearTatPrimary.push(i);
  }

  useEffect(() => {
    fetchMaterial();
  }, []);
  // }, [isEditOpenNear]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

  const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
    <div>
      <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
    </div>
  );
  const renderStatusIconAndColor = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color
    let textcolor = "white";
    // Default color

    switch (status) {
      case "Yet To Accept":
        icon = <HourglassEmptyIcon {...iconProps} />;
        color = "orange";
        textcolor = "white";
        break;

      case "Accepted":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "green";
        textcolor = "white";
        break;
      case "Returned":
        icon = <AssignmentReturnedIcon {...iconProps} />;
        color = "blue";
        textcolor = "white";
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default color
    }

    return { icon, color, textcolor };
  };

  const StatusButton = ({ status }) => {
    const { icon, color, textcolor } = renderStatusIconAndColor(status);

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
            color: textcolor,
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
          {status}
        </Button>
      </Tooltip>
    );
  };
  const columnDataTableNeartat = [

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
      hide: !columnVisibilityNeartat.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.serialNumber,
      headerClassName: "bold-header",
      lockPinned: true,
      pinned: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      hide: !columnVisibilityNeartat.status,
      headerClassName: "bold-header",
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <>
          {params?.data?.status && (
            <StatusButton status={params.data.status} />
          )}
        </>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.location,
      headerClassName: "bold-header",
    },
    {
      field: "assetmateriallist",
      headerName: "Asset Material",
      flex: 0,
      width: 160,
      hide: !initialColumnVisibilityNeartat.assetmateriallist,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterialcode",
      headerName: "Asset Material Code",
      flex: 0,
      width: 160,
      hide: !initialColumnVisibilityNeartat.assetmaterialcode,
      headerClassName: "bold-header",
    },
    {
      field: "assigndate",
      headerName: "Assign Date",
      flex: 0,
      width: 160,
      hide: !initialColumnVisibilityNeartat.assigndate,
      headerClassName: "bold-header",
    },
    {
      field: "assigntime",
      headerName: "Assign Time",
      flex: 0,
      width: 160,
      hide: !initialColumnVisibilityNeartat.assigntime,
      headerClassName: "bold-header",
    },

    {
      field: "companyto",
      headerName: "Companys",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.companyto,
      headerClassName: "bold-header",
    },
    {
      field: "branchtolist",
      headerName: "Branchs",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.branchtolist,
      headerClassName: "bold-header",
    },
    {
      field: "unittolist",
      headerName: "To Unit",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.unittolist,
      headerClassName: "bold-header",
    },
    {
      field: "teamtolist",
      headerName: "Teams",
      flex: 0,
      width: 100,
      hide: !initialColumnVisibilityNeartat.teamtolist,
      headerClassName: "bold-header",
    },
    {
      field: "employeenametolist",
      headerName: "Employee Name",
      flex: 0,
      width: 250,
      hide: !initialColumnVisibilityNeartat.employeenametolist,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !initialColumnVisibilityNeartat.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eemployeeassetdistributionregister") && params?.data?.status === "Yet To Accept" && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpenEditNear();
                getCodeNear(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("demployeeassetdistributionregister") && params?.data?.status === "Yet To Accept" && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataNear(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vemployeeassetdistributionregister") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeNear(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iemployeeassetdistributionregister") && (
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
          {isUserRoleCompare?.includes("vemployeeassetdistributionregister") &&
            params.data.log && (
              <Button
                variant="contained"
                sx={{
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={() => {
                  window.open(`/asset/employeeassetdistributionlog/${params?.data?.id}`);
                }}
              >
                <MenuIcon style={{ fontsize: "small" }} />
              </Button>
            )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTableNeartat.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


  const rowDataTableNearTat = filteredDataNearTatPrimary.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      assetmaterial: item.assetmaterial,
      status: item.status || "",
      assetmaterialcode: item.assetmaterialcode,
      assigndate: item.assigndate,
      assigntime: item.assigntime,
      assetmateriallist: item.assetmateriallist,

      companyto: item.companyto,
      branchto: item.branchto,
      unitto: item.unitto,
      teamto: item.teamto,
      employeenameto: item.employeenameto,
      log: item?.log,
      branchtolist: item.branchtolist,
      unittolist: item.unittolist,
      teamtolist: item.teamtolist,
      employeenametolist: item.employeenametolist,
    };
  });

  const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsNear.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumnsNeartat = () => {
    setColumnVisibilityNeartat(initialColumnVisibilityNeartat);
  };

  // Manage Columns functionality
  const toggleColumnVisibilityNeartat = (field) => {
    setColumnVisibilityNeartat((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageNeartat.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentNeartat = (
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
        onClick={handleCloseManageColumnsNeartat}
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
          value={searchQueryManageNeartat}
          onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsNeartat.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityNeartat[column.field]}
                    onChange={() => toggleColumnVisibilityNeartat(column.field)}
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
              onClick={() =>
                setColumnVisibilityNeartat(initialColumnVisibilityNeartat)
              }
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
                columnDataTableNeartat.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityNeartat(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

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



  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQueryManageNeartat("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTableNeartat.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryNearTatPrimary;
  };

  const [accordianCreate, setAccordianCreate] = useState([])
  const [accordianCreateEdit, setAccordianCreateEdit] = useState([]);
  const [accordianCreateView, setAccordianCreateView] = useState([]);
  const getTextAfterFirstDash = (inputString) => {
    const parts = inputString.split('-');
    return parts.slice(1).join('-');
  };

  const fetchUnAssignedIPAddress = async (code, setState) => {
    const result = await getTextAfterFirstDash(code);
    try {
      let response = await axios.post(`${SERVICE.ASSET_MATCHED_SUBCOMPONENT}`, {
        code: result
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let mainArray = response?.data?.matchedObjects?.length > 0 ? response?.data?.matchedObjects : [];

      // List of desired keys
      const desiredKeys = [
        "type", "model", "size", "variant", "brand", "serial", "other", "capacity", "hdmiport",
        "vgaport", "dpport", "usbport", "paneltypescreen", "resolution", "connectivity",
        "daterate", "compatibledevice", "outputpower", "collingfancount", "clockspeed",
        "core", "speed", "frequency", "output", "ethernetports", "distance", "lengthname",
        "slot", "noofchannels", "colours", "code"
      ];

      // Filter the array
      let filteredArray = mainArray.map(obj => {
        // Filter the keys based on desiredKeys and conditions
        let filteredObject = {};
        desiredKeys.forEach(key => {
          if (
            obj[key] && // Check if the value exists (not undefined or null)
            obj[key].trim() !== "" && // Ensure it's not empty
            !obj[key].includes("Please Select") // Exclude "Please Select" values
          ) {
            filteredObject[key] = obj[key]; // Add the valid key-value pair
          }
        });
        return filteredObject; // Return the filtered object
      }).filter(obj => Object.keys(obj).length > 1); // Exclude empty objects

      console.log(filteredArray);
      setState(filteredArray)
      console.log(response?.data?.matchedObjects, "response?.data?.matchedObjects");
    } catch (err) {
      //   handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      setState([]);
      console.log(err)
    }
  };

  const Accordion = ({ data }) => {
    const capitalizeFirstLetter = (string) =>
      string.charAt(0).toUpperCase() + string.slice(1);

    return (
      <Box sx={{ margin: "20px" }}>
        {data.map((item, index) => (
          <MUIAccordion key={index}>
            {/* Accordion Title */}
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">
                Specification - {item.code || `Item ${index + 1}`}
              </Typography>
            </AccordionSummary>

            {/* Accordion Content */}
            <AccordionDetails>
              <Grid container spacing={2}>
                {Object.keys(item)
                  .filter((key) => key !== "code") // Exclude the code key
                  .map((key, subIndex) => (
                    <Grid item xs={12} sm={4} md={4} key={subIndex}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {capitalizeFirstLetter(key)}:
                      </Typography>
                      <Typography variant="body2">{item[key]}</Typography>
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </MUIAccordion>
        ))}
      </Box>
    );
  };
  // Disable the search input if the search is active
  const isSearchDisabled = isSearchActive || additionalFilters.length > 0;



  return (
    <Box>
      <Headtitle title={"ASSET EMPLOYEE DISTRIBUTION"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Asset Employee Distribution
      </Typography> */}
      <PageHeading
        title="Asset Employee Distribution"
        modulename="Asset"
        submodulename="Asset Register"
        mainpagename="Employee Asset Distribution Register"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aemployeeassetdistributionregister") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Employee Distribution
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.company,
                        value: maintentancemaster.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                          employee: "",
                        });
                        setAccordianCreate([])
                        setSelectedOptionsMaterial([]);
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) => maintentancemaster.company === comp.company
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
                        label: maintentancemaster.branch,
                        value: maintentancemaster.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setMaintentancemaster({
                          ...maintentancemaster,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                          employee: "",
                        });

                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);

                        fetchFloor(e);
                        setAccordianCreate([])
                        setSelectedOptionsMaterial([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.company === comp.company &&
                            maintentancemaster.branch === comp.branch
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
                        label: maintentancemaster.unit,
                        value: maintentancemaster.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          unit: e.value,
                          employee: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.floor,
                        value: maintentancemaster.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                        });
                        setAccordianCreate([])
                        setSelectedOptionsMaterial([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.area,
                        value: maintentancemaster.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                        });
                        setAccordianCreate([])
                        setSelectedOptionsMaterial([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchLocation(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.location,
                        value: maintentancemaster.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          location: e.value,
                          assetmaterial: "",
                          assetmaterialcode: "",
                        });
                        setAccordianCreate([])
                        setSelectedOptionsMaterial([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemaster.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemaster.location &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemaster?.assetmaterial ? maintentancemaster?.assetmaterial : "Please Select Asset Material",
                        value: maintentancemaster?.assetmaterial ? maintentancemaster?.assetmaterial : "Please Select Asset Material",
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assetmaterial: e.value,
                          assetmaterialcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemaster.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area &&
                                    subpro.assetmaterial === maintentancemaster?.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(
                                  (str) => !allDistributionDatas.some((obj) => obj?.status !== "Returned" && obj.assetmaterialcode === str)
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemaster.location &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemaster.company &&
                                    subpro.branch ===
                                    maintentancemaster.branch &&
                                    subpro.unit === maintentancemaster.unit &&
                                    subpro.floor ===
                                    maintentancemaster.floor &&
                                    subpro.area === maintentancemaster.area &&
                                    subpro.assetmaterial === maintentancemaster?.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(
                                  (str) => !allDistributionDatas.some((obj) => obj?.status !== "Returned" && obj.assetmaterialcode === str)
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemaster?.assetmaterialcode ? maintentancemaster?.assetmaterialcode : "Please Select Asset Material Code",
                        value: maintentancemaster?.assetmaterialcode ? maintentancemaster?.assetmaterialcode : "Please Select Asset Material Code",
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assetmaterialcode: e.value,
                        });
                        fetchUnAssignedIPAddress(e.value, setAccordianCreate);
                      }}
                    />
                  </FormControl>
                </Grid>
                {accordianCreate?.length > 0 &&
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Accordion data={accordianCreate} />
                    </FormControl>
                  </Grid>}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Assign Date <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      value={maintentancemaster.assigndate}
                      type="date"
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assigndate: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Assign Time <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      value={maintentancemaster.assigntime}
                      type="time"
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assigntime: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography sx={userStyle.importheadtext}>
                    Assign Person
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.companyto,
                        value: maintentancemaster.companyto,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          companyto: e.value,
                        });

                        setSelectedBranchTo([]);
                        setSelectedUnitTo([]);
                        setSelectedTeamTo([]);
                        setSelectedEmployeeTo([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company
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
                      value={selectedBranchTo}
                      onChange={handleBranchChangeTo}
                      valueRenderer={customValueRendererBranchTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            selectedBranchTo
                              .map((item) => item.value)
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
                      value={selectedUnitTo}
                      onChange={handleUnitChangeTo}
                      valueRenderer={customValueRendererUnitTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            selectedBranchTo
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitTo
                              .map((item) => item.value)
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
                      value={selectedTeamTo}
                      onChange={handleTeamChangeTo}
                      valueRenderer={customValueRendererTeamTo}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            selectedBranchTo
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitTo
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamTo
                              .map((item) => item.value)
                              .includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={selectedEmployeeTo}
                      onChange={handleEmployeeChangeTo}
                      valueRenderer={customValueRendererEmployeeTo}
                      labelledBy="Please Select Employeename"
                    /> */}
                    <Selects
                      options={allUsersData
                        ?.filter(
                          (comp) =>
                            maintentancemaster.companyto === comp.company &&
                            selectedBranchTo
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitTo
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamTo
                              .map((item) => item.value)
                              .includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={{
                        label: maintentancemaster?.employee ? maintentancemaster?.employee : "Please Select Employee",
                        value: maintentancemaster?.employee ? maintentancemaster?.employee : "Please Select Employee",
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          employee: e.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={2}
                  xs={12}
                  sm={12}
                  sx={{ marginTop: "20px" }}
                >
                  <Typography
                    sx={userStyle.importheadtext}
                    style={{ marginLeft: "5px" }}
                  >
                    Image <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Button variant="contained" size="small" component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input
                      type="file"
                      id="resume"
                      multiple
                      accept="image/*"
                      name="file"
                      hidden
                      onChange={handleResumeUpload}
                    />
                  </Button>
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                  sm={12}
                  sx={{ marginTop: "20px" }}
                >
                  {upload?.length > 0 &&
                    upload.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
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
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpenNear}
          onClose={handleCloseModEditNear}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}

          sx={{
            overflow: "auto",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
            marginTop: "95px"
          }}
        >
          <Box sx={{ padding: "10px 20px", overflow: "auto" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Employee Distribution
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.company,
                        value: maintentancemasteredit.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                          employee: "",
                        });
                        setAccordianCreate([])
                        setAreasEdit([]);
                        setFloorEdit([]);
                        setSelectedOptionsMaterialEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company
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
                        label: maintentancemasteredit.branch,
                        value: maintentancemasteredit.branch,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                          employee: "",
                        });
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setFloorEdit([]);
                        fetchFloorEdit(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company &&
                            maintentancemasteredit.branch === comp.branch
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
                        label: maintentancemasteredit.unit,
                        value: maintentancemasteredit.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          unit: e.value,
                          employee: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floorsEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.floor,
                        value: maintentancemasteredit.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          floor: e.value,
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                        });
                        setAccordianCreate([])
                        setAreasEdit([]);
                        setSelectedOptionsMaterialEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAreaEdit(maintentancemasteredit.branch, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areasEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.area,
                        value: maintentancemasteredit.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          area: e.value,
                          location: "Please Select Location",
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                        });
                        setAccordianCreate([])
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setSelectedOptionsMaterialEdit([]);
                        fetchAllLocationEdit(
                          maintentancemasteredit.branch,
                          maintentancemasteredit.floor,
                          e.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locationsEdit}
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.location,
                        value: maintentancemasteredit.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          location: e.value,
                          assetmaterial: "",
                          assetmaterialcode: "",
                          workstation: "Please Select Workstation",
                        });
                        setAccordianCreate([])
                        setSelectedOptionsMaterialEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemasteredit.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locationsEdit
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemasteredit.location &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area
                                )
                                // .map((t) => t.component)
                                // .reduce((acc, curr) => acc.concat(curr), [])
                                .map((t) => ({
                                  ...t,
                                  label: t?.assetmaterial,
                                  value: t?.assetmaterial,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemasteredit?.assetmaterial ? maintentancemasteredit?.assetmaterial : "Please Select Asset Material",
                        value: maintentancemasteredit?.assetmaterial ? maintentancemasteredit?.assetmaterial : "Please Select Asset Material",
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assetmaterial: e.value,
                          assetmaterialcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={
                        maintentancemasteredit.location === "ALL"
                          ? Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    locationsEdit
                                      .map((item) => item.value)
                                      .includes(subpro.location) &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area &&
                                    subpro.assetmaterial === maintentancemasteredit?.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(
                                  (str) => !allDistributionDatas?.filter(item => item?._id !== maintentancemasteredit?._id)?.some((obj) => obj?.status !== "Returned" && obj.assetmaterialcode === str)
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              materialOpt
                                .filter(
                                  (subpro) =>
                                    subpro.location ===
                                    maintentancemasteredit.location &&
                                    subpro.empdistribution === true &&
                                    subpro.company ===
                                    maintentancemasteredit.company &&
                                    subpro.branch ===
                                    maintentancemasteredit.branch &&
                                    subpro.unit ===
                                    maintentancemasteredit.unit &&
                                    subpro.floor ===
                                    maintentancemasteredit.floor &&
                                    subpro.area ===
                                    maintentancemasteredit.area &&
                                    subpro.assetmaterial === maintentancemasteredit?.assetmaterial
                                )
                                .map((t) => t.component)
                                .reduce((acc, curr) => acc.concat(curr), [])
                                .filter(
                                  (str) => !allDistributionDatas?.filter(item => item?._id !== maintentancemasteredit?._id)?.some((obj) => obj?.status !== "Returned" && obj.assetmaterialcode === str)
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t,
                                  value: t,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={{
                        label: maintentancemasteredit?.assetmaterialcode ? maintentancemasteredit?.assetmaterialcode : "Please Select Asset Material Code",
                        value: maintentancemasteredit?.assetmaterialcode ? maintentancemasteredit?.assetmaterialcode : "Please Select Asset Material Code",
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assetmaterialcode: e.value,
                        });
                        fetchUnAssignedIPAddress(e.value, setAccordianCreateEdit);
                      }}
                    />
                  </FormControl>
                </Grid>
                {accordianCreateEdit?.length > 0 &&
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Accordion data={accordianCreateEdit} />
                    </FormControl>
                  </Grid>}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Assign Date <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      value={maintentancemasteredit.assigndate}
                      type="date"
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assigndate: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Assign Time <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      value={maintentancemasteredit.assigntime}
                      type="time"
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assigntime: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography sx={userStyle.importheadtext}>
                    Assigned Person
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.companyto,
                        value: maintentancemasteredit.companyto,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          companyto: e.value,
                        });
                        setSelectedBranchToEdit([]);
                        setSelectedUnitToEdit([]);
                        setSelectedTeamToEdit([]);
                        setSelectedEmployeeToEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.companyto === comp.company
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
                      value={selectedBranchToEdit}
                      onChange={handleBranchChangeToEdit}
                      valueRenderer={customValueRendererBranchToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.companyto === comp.company &&
                            selectedBranchToEdit
                              .map((item) => item.value)
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
                      value={selectedUnitToEdit}
                      onChange={handleUnitChangeToEdit}
                      valueRenderer={customValueRendererUnitToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.companyto === comp.company &&
                            selectedBranchToEdit
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitToEdit
                              .map((item) => item.value)
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
                      value={selectedTeamToEdit}
                      onChange={handleTeamChangeToEdit}
                      valueRenderer={customValueRendererTeamToEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.companyto === comp.company &&
                            selectedBranchToEdit
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitToEdit
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamToEdit
                              .map((item) => item.value)
                              .includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={selectedEmployeeToEdit}
                      style={{
                        menu: (provided, state) => ({
                          ...provided,
                          position: "absolute",
                          top: "100%", // Set the desired top position
                          left: "0", // Set the desired left position
                          zIndex: 1000, // Set the desired zIndex
                        }),
                        menuList: (provided, state) => ({
                          ...provided,
                          maxHeight: "200px", // Set the desired max height here
                          overflowY: "auto", // Add scroll if the content exceeds max height
                        }),
                      }}
                      onChange={handleEmployeeChangeToEdit}
                      valueRenderer={customValueRendererEmployeeToEdit}
                      labelledBy="Please Select Employeename"
                    /> */}
                    <Selects
                      options={allUsersData
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.companyto === comp.company &&
                            selectedBranchToEdit
                              .map((item) => item.value)
                              .includes(comp.branch) &&
                            selectedUnitToEdit
                              .map((item) => item.value)
                              .includes(comp.unit) &&
                            selectedTeamToEdit
                              .map((item) => item.value)
                              .includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={{
                        label: maintentancemasteredit?.employee ? maintentancemasteredit?.employee : "Please Select Employee",
                        value: maintentancemasteredit?.employee ? maintentancemasteredit?.employee : "Please Select Employee",
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          employee: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                item
                lg={2}
                md={2}
                xs={12}
                sm={12}
                sx={{ marginTop: "20px" }}
              >
                <Typography
                  sx={userStyle.importheadtext}
                  style={{ marginLeft: "5px" }}
                >
                  Image <b style={{ color: "red" }}>*</b>
                </Typography>
                <Button variant="contained" size="small" component="label" sx={buttonStyles.buttonsubmit}>
                  Upload
                  <input
                    type="file"
                    id="resume"
                    multiple
                    accept="image/*"
                    name="file"
                    hidden
                    onChange={handleResumeUploadEdit}
                  />
                </Button>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                sx={{ marginTop: "20px" }}
              >
                {uploadEdit?.length > 0 &&
                  uploadEdit.map((file, index) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item lg={8} md={8} sm={8} xs={8}>
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
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitNear}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEditNear}
                  >
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
      <br />
      <>
        {isUserRoleCompare?.includes("lemployeeassetdistributionregister") && (
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Employee Asset Distribution List
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeNearTatPrimary}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeNearTatPrimary}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={totalProjects}>All</MenuItem>
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
                    "excelemployeeassetdistributionregister"
                  ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            // fetchMaintentanceIndividual();
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
                    "csvemployeeassetdistributionregister"
                  ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            // fetchMaintentanceIndividual();
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
                    "printemployeeassetdistributionregister"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "pdfemployeeassetdistributionregister"
                  ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            // fetchMaintentanceIndividual();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "imageemployeeassetdistributionregister"
                  ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImagenear}
                        >
                          {" "}
                          <ImageIcon
                            sx={{ fontSize: "15px" }}
                          /> &ensp;Image&ensp;{" "}
                        </Button>
                      </>
                    )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>

                <AggregatedSearchBar
                  columnDataTable={columnDataTableNeartat}
                  setItems={setItemsNearTat}
                  addSerialNumber={addSerialNumberNearTat}
                  setPage={setPageNearTatPrimary}
                  maindatas={individualasset}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryNearTatPrimary}
                  setSearchQuery={setSearchQueryNearTatPrimary}
                  paginated={false}
                  totalDatas={individualasset}
                />
              </Grid>
            </Grid>

            <br />
            <Button
              sx={userStyle.buttongrp}
              onClick={handleShowAllColumnsNeartat}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button
              sx={userStyle.buttongrp}
              onClick={handleOpenManageColumnsNeartat}
            >
              Manage Columns
            </Button>
            <Popover
              id={idneartat}
              open={isManageColumnsOpenNeartat}
              anchorEl={anchorElNeartat}
              onClose={handleCloseManageColumnsNeartat}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentNeartat}
            </Popover>


            &ensp;
            {isUserRoleCompare?.includes(
              "bdemployeeassetdistributionregister"
            ) && (
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

            {loading ? (
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
                      rowDataTable={rowDataTableNearTat}
                      columnDataTable={columnDataTableNeartat}
                      columnVisibility={columnVisibilityNeartat}
                      page={pageNearTatPrimary}
                      setPage={setPageNearTatPrimary}
                      pageSize={pageSizeNearTatPrimary}
                      totalPages={totalPages}
                      setColumnVisibility={setColumnVisibilityNeartat}
                      isHandleChange={isHandleChange}
                      items={itemsneartat}
                      selectedRows={selectedRowsNear}
                      setSelectedRows={setSelectedRowsNear}
                      gridRefTable={gridRefTable}
                      paginated={false}
                      filteredDatas={filteredDatasNearTatPrimary}
                      // totalDatas={totalDatas}
                      searchQuery={searchQueryNearTatPrimary}
                      handleShowAllColumns={handleShowAllColumnsNeartat}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={individualasset}
                    />

                    {/* <AggridTableForPaginationTable
                    rowDataTable={rowDataTableNearTat}
                    columnDataTable={columnDataTableNeartat}
                    columnVisibility={columnVisibilityNeartat}
                    page={pageNearTatPrimary}
                    setPage={setPageNearTatPrimary}
                    pageSize={pageSizeNearTatPrimary}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibilityNeartat}
                    selectedRows={selectedRowsNear}
                    setSelectedRows={setSelectedRowsNear}
                    gridRefTable={gridRefTable}
                    totalDatas={totalProjects}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={overallFilterdata}
                  /> */}
                  </>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>)}
      </>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ overflow: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Employee Asset Distribution
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Status</Typography>
                  <Typography>{maintentancemasteredit?.status}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintentancemasteredit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{maintentancemasteredit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintentancemasteredit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{maintentancemasteredit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintentancemasteredit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{maintentancemasteredit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>
                    {maintentancemasteredit?.assetmaterial}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material Code</Typography>
                  <Typography>
                    {maintentancemasteredit?.assetmaterialcode}
                  </Typography>
                </FormControl>
              </Grid>
              {accordianCreateView?.length > 0 &&
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Accordion data={accordianCreateView} />
                  </FormControl>
                </Grid>}
              <Grid item xs={12} md={12}>
                <Typography sx={userStyle.importheadtext}>
                  Assigned Person
                </Typography>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Assign Date</Typography>
                  <Typography>
                    {moment(maintentancemasteredit.assigndate).format(
                      "DD/MM/YYYY"
                    )}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Assign Time</Typography>
                  <Typography>{moment(maintentancemasteredit.assigntime, "HH:mm").format("hh:mm A")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintentancemasteredit.companyto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Branch
                  </Typography>
                  <Typography>
                    {maintentancemasteredit?.branchto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Unit
                  </Typography>
                  <Typography>
                    {maintentancemasteredit.unitto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={2.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Team
                  </Typography>
                  <Typography>
                    {maintentancemasteredit.teamto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4.5} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Employee Name
                  </Typography>
                  <Typography>
                    {maintentancemasteredit?.employeenameto
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog
        open={openviewnear}
        onClose={handleClickOpenviewnear}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Employee Asset Distribution
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Status</Typography>
                  <Typography>{maintenanceview?.status}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintenanceview.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{maintenanceview.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintenanceview.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{maintenanceview.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintenanceview.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{maintenanceview.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>
                    {maintenanceview?.assetmaterial}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material Code</Typography>
                  <Typography>
                    {maintenanceview?.assetmaterialcode}
                  </Typography>
                </FormControl>
              </Grid>

              {accordianCreateView?.length > 0 &&
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Accordion data={accordianCreateView} />
                  </FormControl>
                </Grid>}
              <Grid item xs={12} md={12}>
                <Typography sx={userStyle.importheadtext}>
                  Assigned Person
                </Typography>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Assign Date</Typography>
                  <Typography>
                    {moment(maintentancemasteredit.assigndate).format(
                      "DD/MM/YYYY"
                    )}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Assign Time</Typography>
                  <Typography> {moment(maintenanceview.assigntime, "HH:mm").format("hh:mm A")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintenanceview.companyto}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Branch
                  </Typography>
                  <Typography>
                    {maintenanceview?.branchto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Unit
                  </Typography>
                  <Typography>
                    {maintenanceview.unitto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Team
                  </Typography>
                  <Typography>
                    {maintenanceview.teamto
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                    Employee Name
                  </Typography>
                  <Typography>
                    {maintenanceview?.employeenameto
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              {maintenanceview?.status === "Accepted" &&
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Accepted At</Typography>
                      <Typography>{moment(maintenanceview?.accepteddateandtime)?.format('DD-MM-YYYY hh:mm:ss A')}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Accepted By</Typography>
                      <Typography>{maintenanceview?.acceptedby}</Typography>
                    </FormControl>
                  </Grid>
                </>
              }
              <Grid
                item
                lg={6}
                md={6}
                xs={12}
                sm={12}
                sx={{ marginTop: "20px" }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                  Images
                </Typography>
                {maintenanceview?.images?.length > 0 &&
                  maintenanceview?.images.map((file, index) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={11} sm={11} xs={11}>
                          <Typography>{file.name}</Typography>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(file)}
                          />
                        </Grid>
                      </Grid>
                    </>
                  ))}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseviewnear}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTableNearTat) ?? []}
        itemsTwo={overallFilterdata ?? []}
        filename={"AssetEmployeeDistribution"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefNear}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Employee Asset Distribution Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      {/* <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delFrequency}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}
      {/*Single DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckboxbulk}
        onClose={handleCloseModcheckboxbulk}
        onConfirm={delProjectcheckbox}
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
    </Box>
  );
}

export default EmployeeAssetDistribution;