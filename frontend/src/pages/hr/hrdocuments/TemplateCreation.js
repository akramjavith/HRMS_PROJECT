import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";


function TemplateCreation() {
  const employeeModeOptions = [
    { value: "Current List", label: "Current List" },
    { value: "Absconded", label: "Absconded" },
    { value: "Releave Employee", label: "Releave Employee" },
    { value: "Hold", label: "Hold" },
    { value: "Terminate", label: "Terminate" },
    { value: "Postponed", label: "Postponed" },
    { value: "Rejected", label: "Rejected" },
    { value: "Closed", label: "Closed" },
    { value: "Not Joined", label: "Not Joined" },
    { value: "Notice Period", label: "Notice Period" },
    // { value: "Manual", label: "Manual" },
  ];

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
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
    'Template Mode',
    'Company',
    'Branch',
    'Template Name ',
    'Document Name ',
    'Template Code ',
    'Page Size ',
    'Signature',
    'Seal',
    'Page Mode'
  ];
  let exportRowValues = [
    'tempaltemode',
    'company',
    'branch',
    'name',
    'documentname',
    'tempcode',
    'pagesize',
    'signature',
    'seal',
    'pagemode'
  ];

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
      pagename: String("Template Creation"),
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
  const gridRef = useRef(null);
  const { name } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [templateCreation, setTemplateCreation] = useState({
    name: "",
    documentname: "",
    tempaltemode: "Employee",
    company: "Please Select Company",
    branch: "Please Select Branch",
    pagesize: "Please Select Page Size",
    print: "Please Select Print Option",
    heading: "Please Select Header Option",
    signature: "None",
    seal: "None",
    pagemode: "Single Page",

  });
  const [CompanyOptions, setCompanyOptions] = useState([]);
  const [BranchOptions, setBranchOptions] = useState([]);
  const [termsAndConditons, setTermsAndConditons] = useState([]);
  const [BranchOptionsEdit, setBranchOptionsEdit] = useState([]);
  const [btnload, setBtnLoad] = useState(false);
  const [ovcategory, setOvcategory] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
  const [ovProjCountDelete, setOvProjCountDelete] = useState("");
  const [templateCreationEdit, setTemplateCreationEdit] = useState({ name: "" });
  const [templateCreationArray, setTemplateCreationArray] = useState([]);
  const [templateCreationArrayOverall, setTemplateCreationArrayOverall] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    isAssignBranch,
    buttonStyles,
  } = useContext(UserRoleAccessContext);



  // AssignBranch For Users
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




  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTemplateCreationEdit, setAllTemplateCreationEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [agenda, setAgenda] = useState("");
  const [agendaEdit, setAgendaEdit] = useState("");

  const [head, setHeader] = useState("");
  const [foot, setfooter] = useState("");
  const [headEdit, setHeaderEdit] = useState("");
  const [footEdit, setfooterEdit] = useState("");

  const [headvalue, setHeadValue] = useState([])
  const [selectedHeadOpt, setSelectedHeadOpt] = useState([])
  const [agendaEditStyles, setAgendaEditStyles] = useState({});

  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')


  const [selectedEmpModeOptions, setSelectedEmpModeOptions] = useState([]);
  let [valueEmpModeOptions, setValueEmpModeOptions] = useState([]);
  const handleEmpModeChange = (options) => {
    setValueEmpModeOptions(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmpModeOptions(options);
  };
  const customValueRendererEmpMode = (valueEmpMode, _branchs) => {
    return valueEmpMode.length ? valueEmpMode.map(({ label }) => label).join(", ") : "Please Select Employee Mode";
  };




  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
  };
  const customValueRendererBranch = (valueDesig, _branchs) => {
    return valueDesig.length ? valueDesig.map(({ label }) => label).join(", ") : "Please Select Branch";
  };


  const [selectedTermsAndCondtionOptions, setSelectedTermsAndCondtionOptions] = useState([]);
  let [valueTermsAndCondtion, setValueTermsAndCondtion] = useState([]);
  const handleTermsAndCondtionChange = (options) => {
    console.log(options, 'options')
    setValueTermsAndCondtion(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTermsAndCondtionOptions(options);
  };
  const customValueRendererTermsAndCondtion = (termsAndCondtion, _branchs) => {
    return termsAndCondtion.length ? termsAndCondtion.map(({ label }) => label).join(", ") : "Please Select Terms and Condtions";
  };



  const [docPrepData, setDocPrepData] = useState([]);


  const [selectedEmpModeOptionsEdit, setSelectedEmpModeOptionsEdit] = useState([]);
  let [valueEmpModeOptionsEdit, setValueEmpModeOptionsEdit] = useState([]);
  const handleEmpModeChangeEdit = (options) => {
    setValueEmpModeOptionsEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmpModeOptionsEdit(options);
  };
  const customValueRendererEmpModeEdit = (valueEmpMode, _branchs) => {
    return valueEmpMode.length ? valueEmpMode.map(({ label }) => label).join(", ") : "Please Select Employee Mode";
  };



  const [selectedTermsAndCondtionOptionsEdit, setSelectedTermsAndCondtionOptionsEdit] = useState([]);
  let [valueTermsAndCondtionEdit, setValueTermsAndCondtionEdit] = useState([]);
  const handleTermsAndCondtionChangeEdit = (options) => {
    setValueTermsAndCondtionEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTermsAndCondtionOptionsEdit(options);
  };
  const customValueRendererTermsAndCondtionEdit = (termsAndCondtion, _branchs) => {
    return termsAndCondtion.length ? termsAndCondtion.map(({ label }) => label).join(", ") : "Please Select Terms and Condtions";
  };










  const modeoptions = [
    { label: "Employee", value: "Employee" },
    { label: "Company", value: "Company" },
    { label: "Candidate", value: "Candidate" },
  ];
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

  const CompanyDropDowns = async () => {
    setPageName(!pageName);
    try {
      setCompanyOptions(accessbranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const BranchDropDowns = async (e) => {
    setPageName(!pageName);
    try {
      setBranchOptions(accessbranch?.filter(
        (comp) =>
          e === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      }))?.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const BranchDropDownsEdit = async (e) => {
    setPageName(!pageName);
    try {
      setBranchOptionsEdit(accessbranch?.filter(
        (comp) =>
          e === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      }))?.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  useEffect(() => {
    CompanyDropDowns();
  }, [])



  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };



  // Error Popup model
  const [isErrorOpenpopTemplate, setIsErrorOpenpopTemplate] = useState(false);
  const [showAlertpopTemplate, setShowAlertpopTemplate] = useState();
  const handleClickOpenerrpopTemplate = () => {
    setIsErrorOpenpopTemplate(true);
  };
  const handleCloseerrpopTemplate = () => {
    setIsErrorOpenpopTemplate(false);
  };

  const sendEditRequestTemplate = async () => {
    console.log(valueTermsAndCondtionEdit, 'valueTermsAndCondtionEdit')
    if (docPrepData?.length > 0) {
      docPrepData?.map(data => {
        let res = axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${data._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          termsAndConditons: valueTermsAndCondtionEdit
        });
      })
    }
  }


  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  const handlePagenameChange = (format) => {

    if (format === "A3") {
      setAgendaEditStyles({ width: "297mm", height: "420mm" });
    }
    else if (format === "A4") {
      setAgendaEditStyles({ width: "210mm", height: "297mm" });
    }
    else if (format === "Certificate") {
      setAgendaEditStyles({ width: "297mm", height: "180mm" });
    }
    else if (format === "Certificate1") {
      setAgendaEditStyles({ width: "297mm", height: "200mm" });
    }
    else if (format === "Envelope") {
      setAgendaEditStyles({ width: "220mm", height: "110mm" });
    }

  }
  const [agendaEditStyles1, setAgendaEditStyles1] = useState({});

  const handlePagenameChange1 = (format) => {

    if (format === "A3") {
      setAgendaEditStyles1({ width: "297", height: "420" });
    }
    else if (format === "A4") {
      setAgendaEditStyles1({ width: "210", height: "297" });
    }
    else if (format === "Certificate") {
      setAgendaEditStyles1({ width: "279", height: "180" });
    }
    else if (format === "Certificate1") {
      setAgendaEditStyles1({ width: "279", height: "220" });
    }
    else if (format === "Envelope") {
      setAgendaEditStyles1({ width: "220", height: "110" });
    }

  }



  const signatureOptions = [
    { value: "None", label: "None" },
    { value: "With", label: "With" },
    { value: "Without", label: "Without" },
  ];
  const sealOptions = [
    { value: "None", label: "None" },
    { value: "Round Seal", label: "Round Seal" },
    { value: "Normal Seal", label: "Normal Seal" },
    { value: "For Seal", label: "For Seal" },
  ];

  const handleHeadChange = (options) => {

    setHeadValue(options.map((a) => {
      return a.value;
    }))
    setHeader("")
    setfooter("")
    setSelectedHeadOpt(options)

  }



  const [headvalueEdit, setHeadValueEdit] = useState([])
  const [selectedHeadOptEdit, setSelectedHeadOptEdit] = useState([])
  const handleHeadChangeEdit = (options) => {

    setHeadValueEdit(options.map((a) => {
      return a.value;
    }))
    setHeaderEdit("")
    setfooterEdit("")
    setSelectedHeadOptEdit(options)

  }


  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    documentname: true,
    tempcode: true,
    headvaluetext: true,
    pagesize: true,
    seal: true,
    tempaltemode: true,
    company: true,
    branch: true,
    pagemode: true,
    signature: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  //useEffect
  useEffect(() => {
    addSerialNumber(templateCreationArray);
  }, [templateCreationArray]);
  useEffect(() => {
    fetchBrandMaster();
  }, []);

  useEffect(() => {
    fetchBrandMasterAll();
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
    setBtnLoad(false)
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
    setAgendaEdit("");
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
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.companyname;
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
      getOverallEditSectionOverallDelete(selectedRows)
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
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
    "& .custom-id-row": {
      backgroundColor: "#1976d22b !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": {
        backgroundColor: "#ff00004a !important",
      },
      "& .custom-in-row:hover": {
        backgroundColor: "#ffff0061 !important",
      },
      "& .custom-others-row:hover": {
        backgroundColor: "#0080005e !important",
      },
    },
  }));
  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteTemplate(res?.data?.stemplatecreation);
      getOverallEditSectionDelete(res?.data?.stemplatecreation?.name)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  const pagesizeoptions = [
    { value: "A3", label: "A3" },
    { value: "A4", label: "A4" },
    { value: "Certificate", label: "Certificate" },
    { value: "Certificate1", label: "Certificate1" },
    { value: "Envelope", label: "Envelope" }
  ];

  const sizenewOptions = [
    { value: "Single Page", label: "Single Page" },
    { value: "Multiple Page", label: "Multiple Page" }
  ];


  //overall edit section for all pages
  const getOverallEditSectionDelete = async (cat) => {
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: cat
      });
      setOvProjCountDelete(res?.data?.count);
      setGetOverallCountDelete(`This data is linked in 
              ${res?.data?.templatecreation?.length > 0 ? "Employee Document Preparation " : ""}
               `);

      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Terms And Conditons Options
  const fetchTermsAndConditonsOptions = async () => {
    setPageName(!pageName);
    try {

      let res = await axios.get(SERVICE.ALL_TERMSANDCONDITION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const options = res?.data?.termsandcondition?.length > 0 ? res?.data?.termsandcondition?.map(data => ({ ...data, label: data?.details, value: data?._id })) : [];
      setTermsAndConditons(options)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => { fetchTermsAndConditonsOptions(); }, [])
  //overall edit section for all pages
  const getOverallEditSectionOverallDelete = async (ids) => {
    setPageName(!pageName);
    try {

      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: ids
      });
      setSelectedRows(res?.data?.result);
      setSelectedRowsCount(res?.data?.count)
      setIsDeleteOpencheckbox(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (cat) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: cat,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`This data is linked in 
         ${res?.data?.templatecreation?.length > 0 ? "Employee Document Preparation ," : ""}
           whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: ovcategory,
      });
      sendEditRequestOverall(res?.data?.templatecreation,
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (templatecreation) => {
    setPageName(!pageName);
    try {
      if (templatecreation?.length > 0) {

        let answ = templatecreation.map((d, i) => {

          const tempName = d?.template?.split("--");
          const NewVariable = `${templateCreationEdit.name}--${tempName[1]}--${tempName[2]}`
          let res = axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            template: NewVariable,
          });
        });
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let brandid = deleteTemplate._id;
  const delBrand = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_TEMPLATECREATION}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBrandMaster();
      await fetchBrandMasterAll();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    setBtnLoad(true)

    setPageName(!pageName);
    try {
      valueBranchCat.forEach((data, index) => {
        return axios.post(SERVICE.CREATE_TEMPLATECREATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: String(templateCreation.name),
          documentname: String(templateCreation.documentname),
          tempaltemode: String(templateCreation.tempaltemode),
          company: templateCreation.company,
          employeemode: valueEmpModeOptions,
          branch: data, // Use the branch from the current loop
          tempcode: String(templateCreation.tempcode),
          headvalue: headvalue,
          head: head,
          foot: foot,
          termsAndConditons: valueTermsAndCondtion,
          pagesize: templateCreation.pagesize,
          signature: String(templateCreation.signature),
          seal: String(templateCreation.seal),
          pagemode: String(templateCreation.pagemode),
          pageformat: String(agenda),
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });
      })

      setTemplateCreation({
        ...templateCreation,
        name: "",
        documentname: "",
        tempcode: "",
        pagesize: "Please Select Page Size",
        print: "Please Select Print Option",
        heading: "Please Select Header Option",
        signature: "None",
        seal: "None",
        pagemode: "Single Page",
      });
      setValueEmpModeOptions([])
      setSelectedEmpModeOptions([])
      setHeadValue([])
      setSelectedHeadOpt([])
      setHeader("")
      setfooter("")
      setAgenda("");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchBrandMaster();
      await fetchBrandMasterAll();
      setSearchQuery("")
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = templateCreationArrayOverall?.some((item) =>
      item.name?.toLowerCase() === templateCreation.name?.toLowerCase()
      && item.company?.toLowerCase() === templateCreation.company?.toLowerCase()
      && valueBranchCat.includes(item.branch));

    if (templateCreation?.tempaltemode === "Employee" && valueEmpModeOptions.length === 0) {
      setPopupContentMalert("Please Select Employee Mode!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreation?.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (valueBranchCat.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreation?.name === "") {
      setPopupContentMalert("Please Enter Template Name!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreation?.documentname === "") {
      setPopupContentMalert("Please Enter Document Name!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreation.tempcode === "" || templateCreation.tempcode === undefined) {
      setPopupContentMalert("Please Enter Template Code!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();

    }
    else if (templateCreation.pagesize === "Please Select Page Size" || templateCreation.pagesize === "" || templateCreation.pagesize === undefined) {
      setPopupContentMalert("Please Select Page Size!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();

    }
    else if (agenda === "" || agenda.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setPopupContentMalert("Please Enter Page Format!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Template Name already exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setTemplateCreation({
      name: "",
      documentname: "",
      tempaltemode: "Employee",
      tempcode: "",
      pagesize: "Please Select Page Size",
      company: "Please Select Company",
      print: "Please Select Print Option",
      heading: "Please Select Header Option",
      signature: "None",
      seal: "None",
      pagemode: "Single Page",
    });
    setValueBranchCat([]);
    setSelectedOptionsBranch([])
    setAgenda("");
    setHeader("")
    setfooter("")
    setHeadValue([])
    setSelectedHeadOpt([])
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
    setAgendaEdit("");
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationEdit(res?.data?.stemplatecreation);
      setHeaderEdit(res?.data?.stemplatecreation?.head)
      getOverallEditSection(res?.data?.stemplatecreation?.name)
      setOvcategory(res?.data?.stemplatecreation?.name)
      setfooterEdit(res?.data?.stemplatecreation?.foot)
      BranchDropDownsEdit(res?.data?.stemplatecreation?.company)
      setHeadValueEdit(res?.data?.stemplatecreation?.headvalue)
      setSelectedHeadOptEdit(res?.data?.stemplatecreation?.headvalue?.map(data => ({
        value: data,
        label: data
      })))
      setAgendaEdit(res?.data?.stemplatecreation?.pageformat);
      const termsandcond = termsAndConditons?.filter(data => res?.data?.stemplatecreation?.termsAndConditons?.includes(data?._id)).map(data => ({
        ...data,
        label: data?.details,
        value: data?._id,
      }));
      setSelectedTermsAndCondtionOptionsEdit(termsandcond);
      getOverallEditTermsandConditions(res?.data?.stemplatecreation)
      setValueTermsAndCondtionEdit(res?.data?.stemplatecreation?.termsAndConditons)
      setValueEmpModeOptionsEdit(res?.data?.stemplatecreation?.employeemode)
      setSelectedEmpModeOptionsEdit(res?.data?.stemplatecreation?.employeemode?.map(data => ({
        label: data,
        value: data
      })))
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const getOverallEditTermsandConditions = async (doc) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.OVERALL_EDIT_TERMS_TEMPLATECREATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: doc?.termsAndConditons,
        template: `${doc.name}--(${doc?.company}--${doc?.branch})`,
      });
      const answer = res?.data?.document?.length > 0 ? res?.data?.document : [];
      console.log(answer, 'res?.data?.document')
      setDocPrepData(answer)
      console.log(res?.data, 'res?.data')
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

  }



  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationEdit(res?.data?.stemplatecreation);
      setAgendaEdit(res?.data?.stemplatecreation?.pageformat);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationEdit(res?.data?.stemplatecreation);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //frequency master name updateby edit page...
  let updateby = templateCreationEdit.updatedby;
  let addedby = templateCreationEdit.addedby;
  let frequencyId = templateCreationEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_TEMPLATECREATION}/${frequencyId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(templateCreationEdit.name),
        documentname: String(templateCreationEdit.documentname),
        tempaltemode: templateCreationEdit.tempaltemode,
        company: templateCreationEdit.company,
        branch: templateCreationEdit.branch,
        tempcode: String(templateCreationEdit.tempcode),
        termsAndConditons: valueTermsAndCondtionEdit,
        employeemode: valueEmpModeOptionsEdit,
        headvalue: headvalueEdit,
        head: headEdit,
        foot: footEdit,
        pagesize: templateCreationEdit.pagesize,
        signature: String(templateCreationEdit.signature),
        seal: String(templateCreationEdit.seal),
        pagemode: String(templateCreationEdit.pagemode),
        pageformat: String(agendaEdit),
        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      await fetchBrandMaster();
      await fetchBrandMasterAll();
      await getOverallEditSectionUpdate();
      setValueEmpModeOptionsEdit([])
      setSelectedEmpModeOptionsEdit([])
      setAgendaEdit("");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchBrandMasterAll();
    const isNameMatch = allTemplateCreationEdit?.some((item) => item.name?.toLowerCase() === templateCreationEdit.name?.toLowerCase() && item.company?.toLowerCase() === templateCreationEdit?.company?.toLowerCase() && item.branch?.toLowerCase() === templateCreationEdit?.branch?.toLowerCase());



    if (templateCreationEdit?.tempaltemode === "" || templateCreationEdit?.tempaltemode === undefined || templateCreationEdit?.tempaltemode === "") {
      setPopupContentMalert("Please Select Template Mode!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreationEdit?.tempaltemode === "Employee" && valueEmpModeOptionsEdit?.length === 0) {
      setPopupContentMalert("Please Select Employee Mode!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }

    else if (templateCreationEdit?.company === "Please Select Company" || templateCreationEdit?.company === undefined || templateCreationEdit?.company === "") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreationEdit?.branch === "Please Select Branch" || templateCreationEdit?.branch === undefined || templateCreationEdit?.branch === "") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreationEdit.name === "") {
      setPopupContentMalert("Please Enter Template Name!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreationEdit.documentname === "" || templateCreationEdit.documentname === undefined) {
      setPopupContentMalert("Please Enter Document Name!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }

    else if (templateCreationEdit.tempcode === "" || templateCreationEdit.tempcode === undefined) {
      setPopupContentMalert("Please Enter Template Code!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();

    }
    else if (templateCreationEdit.pagesize === "Please Select Page Size" || templateCreationEdit.pagesize === "" || templateCreationEdit.pagesize === undefined) {
      setPopupContentMalert("Please Select Page Size!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();

    }
    else if (agendaEdit === "" || agendaEdit.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setPopupContentMalert("Please Enter Page Format!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Template Name already exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (templateCreationEdit.name != ovcategory && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else if (valueTermsAndCondtionEdit?.some(data => templateCreationEdit?.termsAndConditons?.includes(data))) {
      setShowAlertpopTemplate(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Old Terms & Condtions changed,Do You want to chnange in Employee Document also.?"}</p>
        </>
      );
      handleClickOpenerrpopTemplate();
    }
    else {
      sendEditRequest();
    }
  };
  //get all brand master name.
  const fetchBrandMaster = async () => {
    const accessbranchs = accessbranch
      ? accessbranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];
    setPageName(!pageName);
    try {
      let res_freq = await axios.post(SERVICE.ACCESSIBLEBRANCHALL_TEMPLATECREATION, {
        assignbranch: accessbranchs
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });



      const answer = res_freq?.data?.templatecreation?.length > 0 ? res_freq?.data?.templatecreation?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        headvaluetext: item.headvalue?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        head: convertToNumberedList(item.head),
        foot: convertToNumberedList(item.foot),
      })) : [];
      setTemplateCreationArray(answer);
      setTemplateCreationArrayOverall(res_freq?.data?.overalllist);
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_TEMPLATECREATION}/${item}`, {
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

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchBrandMaster();
      await fetchBrandMasterAll();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //get all Template Name.
  const fetchBrandMasterAll = async () => {
    try {
      const answer = templateCreationArrayOverall?.length > 0 ? templateCreationArrayOverall : [];
      setAllTemplateCreationEdit(answer?.filter((item) => item._id !== templateCreationEdit._id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Template Creation.png");
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
    documentTitle: "Template Creation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
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

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
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

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);


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
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "tempaltemode",
      headerName: "Template Mode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tempaltemode,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Template Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "documentname",
      headerName: "Document Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.documentname,
      headerClassName: "bold-header",
    },
    {
      field: "tempcode",
      headerName: "Template Code",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tempcode,
      headerClassName: "bold-header",
    },
    {
      field: "pagesize",
      headerName: "Page Size",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pagesize,
      headerClassName: "bold-header",
    },

    {
      field: "signature",
      headerName: "Signature",
      flex: 0,
      width: 80,
      hide: !columnVisibility.signature,
      headerClassName: "bold-header",
    },
    {
      field: "seal",
      headerName: "Seal Option",
      flex: 0,
      width: 100,
      hide: !columnVisibility.seal,
      headerClassName: "bold-header",
    },
    {
      field: "pagemode",
      headerName: "Page Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pagemode,
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
          {isUserRoleCompare?.includes("etemplatecreation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtemplatecreation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtemplatecreation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("itemplatecreation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      tempaltemode: item.tempaltemode,
      serialNumber: item.serialNumber,
      name: item.name,
      documentname: item.documentname,
      tempcode: item.tempcode,
      pagesize: item.pagesize,
      head: item.head,
      foot: item.foot,
      signature: item.signature,
      seal: item.seal,
      company: item.company,
      branch: item.branch,
      pagemode: item.pagemode,
      headvaluetext: item.headvaluetext,
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
  const filteredColumns = columnDataTable?.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
      <Headtitle title={"TEMPLATE CREATION"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Template Creation" modulename="Human Resources" submodulename="HR Documents" mainpagename="Documents Setup" subpagename="Template Creation" subsubpagename="" />


      {isUserRoleCompare?.includes("atemplatecreation") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Template Creation</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Template Mode<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={modeoptions}
                    value={{ label: templateCreation.tempaltemode, value: templateCreation.tempaltemode }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        tempaltemode: e.value,
                      });
                      setSelectedEmpModeOptions([])
                      setValueEmpModeOptions([])
                    }}

                  />
                </FormControl>
              </Grid>
              {templateCreation.tempaltemode === "Employee" &&
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={employeeModeOptions}
                      value={selectedEmpModeOptions}
                      onChange={(e) => {
                        handleEmpModeChange(e);
                      }}
                      valueRenderer={customValueRendererEmpMode}
                      labelledBy="Please Select Employee Mode"
                    />
                  </FormControl>
                </Grid>
              }
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={CompanyOptions}
                    value={{ label: templateCreation.company, value: templateCreation.company }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        company: e.value,
                      });
                      setSelectedOptionsBranch([])
                      setValueBranchCat([]);
                      BranchDropDowns(e.value)
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
                    options={BranchOptions}
                    value={selectedOptionsBranch}
                    onChange={(e) => {
                      handleBranchChange(e);
                    }}
                    valueRenderer={customValueRendererBranch}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Template Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Template Name"
                    value={templateCreation.name}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        name: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Template Code<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="code"
                    placeholder="Please Enter Template Code"
                    value={templateCreation.tempcode}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        tempcode: e?.target?.value?.slice(0, 4),
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Document Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Document Name"
                    value={templateCreation.documentname}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        documentname: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Terms & Conditions
                  </Typography>
                  <MultiSelect
                    options={termsAndConditons}
                    value={selectedTermsAndCondtionOptions}
                    onChange={(e) => {
                      handleTermsAndCondtionChange(e);
                    }}
                    valueRenderer={customValueRendererTermsAndCondtion}
                    labelledBy="Please Select Terms And Condtions"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Page Size <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={pagesizeoptions}
                    value={{ label: templateCreation.pagesize, value: templateCreation.pagesize }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        pagesize: e.value,

                      });
                      handlePagenameChange(e.value)

                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Signature<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={signatureOptions}
                    value={{ label: templateCreation.signature, value: templateCreation.signature }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        signature: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Seal Option<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={sealOptions}
                    value={{ label: templateCreation.seal, value: templateCreation.seal }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        seal: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Page Mode<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={sizenewOptions}
                    value={{ label: templateCreation.pagemode, value: templateCreation.pagemode }}
                    onChange={(e) => {
                      setTemplateCreation({
                        ...templateCreation,
                        pagemode: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Page Format <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <ReactQuill
                    style={{ maxHeight: "750px", height: "750px" }}
                    value={agenda}
                    onChange={setAgenda}
                    modules={{
                      toolbar:
                        [[{ header: "1" }, { header: "2" },
                        { font: [] }], [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ align: [] }],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        ["link", "image", "video"],
                        ["clean"]]
                    }}

                    formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Grid container>
              <Grid item md={2} xs={12} sm={6}>
                <LoadingButton
                  sx={buttonStyles.buttonsubmit}
                  loading={btnload}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}>
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}


      <br /> <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("ltemplatecreation") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Template Creation List</Typography>
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
                    <MenuItem value={templateCreationArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("exceltemplatecreation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvtemplatecreation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printtemplatecreation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdftemplatecreation") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={templateCreationArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
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
            {isUserRoleCompare?.includes("bdtemplatecreation") && (
              <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />

            {!loader ? (
              <Box sx={userStyle.container}>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </Box>
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
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={items}
                />
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
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            sx={buttonStyles.btncancel}
          >
            Cancel
          </Button>
          <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: "50px" }}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Template Creation</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template Mode</Typography>
                  <Typography>{templateCreationEdit?.tempaltemode}</Typography>
                </FormControl>
              </Grid>
              {templateCreationEdit?.tempaltemode === "Employee" &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Employee Mode</Typography>
                    <Typography>{templateCreationEdit?.employeemode?.map((t, i) => `${i + 1 + ". "}` + t).join("\n")}</Typography>
                  </FormControl>
                </Grid>}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{templateCreationEdit?.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{templateCreationEdit?.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Template Name</Typography>
                  <Typography>{templateCreationEdit?.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Document Name</Typography>
                  <Typography>{templateCreationEdit?.documentname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Template Code</Typography>
                  <Typography>{templateCreationEdit?.tempcode}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Page Size
                  </Typography>
                  <Typography>{templateCreationEdit?.pagesize}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Signature
                  </Typography>
                  <Typography>{templateCreationEdit?.signature}</Typography>

                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Seal Option
                  </Typography>
                  <Typography>{templateCreationEdit?.seal}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Page Mode
                  </Typography>
                  <Typography>{templateCreationEdit?.pagemode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Page Format</Typography>
                  <ReactQuill readOnly style={{ maxHeight: "750px", height: "750px" }} value={agendaEdit} modules={{ toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]] }} formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]} />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
              <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
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
            <Button variant="contained" sx={buttonStyles.buttonsubmit} style={{ padding: '7px 13px' }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}>
              ok
            </Button>
            <Button
              sx={buttonStyles.btncancel}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpopTemplate}
          onClose={handleCloseerrpopTemplate}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpopTemplate}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" sx={buttonStyles.buttonsubmit} style={{ padding: '7px 13px' }}
              onClick={() => {
                sendEditRequest();
                sendEditRequestTemplate();
                handleCloseerrpopTemplate();
              }}>
              ok
            </Button>
            <Button
              sx={buttonStyles.btncancel}
              onClick={handleCloseerrpopTemplate}
            >
              Cancel
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
          <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            {selectedRowsCount > 0 ?
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
              :
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

            }
          </DialogContent>
          <DialogActions>
            {selectedRowsCount > 0 ?
              <>
                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" color='error'
                  onClick={(e) => delAreagrpcheckbox(e)}
                > OK </Button>
              </>
              :
              <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.buttonsubmit}>Ok</Button>
            }
          </DialogActions>
        </Dialog>

      </Box>
      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {getOverAllCountDelete}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
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
          sx={{
            marginTop: "50px"
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Template Creation</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Template Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={modeoptions}
                      value={{ label: templateCreationEdit.tempaltemode, value: templateCreationEdit.tempaltemode }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          tempaltemode: e.value,
                        });
                        setSelectedEmpModeOptionsEdit([])
                        setValueEmpModeOptionsEdit([])
                      }}

                    />
                  </FormControl>
                </Grid>
                {templateCreationEdit.tempaltemode === "Employee" &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Mode<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={employeeModeOptions}
                        value={selectedEmpModeOptionsEdit}
                        onChange={(e) => {
                          handleEmpModeChangeEdit(e);
                        }}
                        valueRenderer={customValueRendererEmpModeEdit}
                        labelledBy="Please Select Employee Mode"
                      />
                    </FormControl>
                  </Grid>}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={CompanyOptions}
                      value={{ label: templateCreationEdit.company, value: templateCreationEdit.company }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          company: e.value,
                          branch: "Please Select Branch"
                        });
                        BranchDropDownsEdit(e.value)
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
                      maxMenuHeight={300}
                      options={BranchOptionsEdit}
                      value={{ label: templateCreationEdit.branch, value: templateCreationEdit.branch }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          branch: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Template Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Template Name"
                      value={templateCreationEdit.name}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Template Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="code"
                      placeholder="Please Enter Template Code"
                      value={templateCreationEdit.tempcode}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          tempcode: e?.target?.value?.slice(0, 4),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Document Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Document Name"
                      value={templateCreationEdit.documentname}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          documentname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Terms & Conditions
                    </Typography>
                    <MultiSelect
                      options={termsAndConditons}
                      value={selectedTermsAndCondtionOptionsEdit}
                      onChange={(e) => {
                        handleTermsAndCondtionChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererTermsAndCondtionEdit}
                      labelledBy="Please Select Terms And Condtions"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Page Size <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={pagesizeoptions}
                      value={{ label: templateCreationEdit.pagesize, value: templateCreationEdit.pagesize }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          pagesize: e.value,

                        });
                        // handlePagenameChange(e.value)
                        handlePagenameChange1(e.value)

                      }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={4} xs={12} sm={12}>
                </Grid> */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Signature
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={signatureOptions}
                      value={{ label: templateCreationEdit.signature, value: templateCreationEdit.signature }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          signature: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Seal Option
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={sealOptions}
                      value={{ label: templateCreationEdit.seal, value: templateCreationEdit.seal }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          seal: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Page Mode
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={sizenewOptions}
                      value={{ label: templateCreationEdit.pagemode, value: templateCreationEdit.pagemode }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          pagemode: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Page Format <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <ReactQuill style={{ maxHeight: "750px", height: "750px" }} value={agendaEdit}
                      onChange={setAgendaEdit}
                      modules={{
                        toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ align: [] }],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        ["link", "image", "video"], ["clean"]]
                      }}

                      formats={["header", "font", "size", "bold", "italic", "underline", "align", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]} />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={editSubmit}>
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
      <br />


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
        itemsTwo={templateCreationArray ?? []}
        filename={"Template Creation"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Template Creation Info"
        addedby={addedby}
        updateby={updateby}
      />



    </Box>
  );
}

export default TemplateCreation;