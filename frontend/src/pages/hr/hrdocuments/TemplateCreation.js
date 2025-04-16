import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
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
import { useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
function TemplateCreation() {
  const gridRef = useRef(null);
  const { name } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [templateCreation, setTemplateCreation] = useState({
    name: "",
    tempaltemode: "Employee",
    company: "Please Select Company",
    branch: "Please Select Branch",
    proption: "Please Select Print Option",
    pagesize: "Please Select Page Size",
    print: "Please Select Print Option",
    heading: "Please Select Header Option",
    signature: "None",
    seal: "None",
    pagemode: "Single Page",

  });
  const [CompanyOptions, setCompanyOptions] = useState([]);
  const [BranchOptions, setBranchOptions] = useState([]);
  const [BranchOptionsEdit, setBranchOptionsEdit] = useState([]);
  const [btnload, setBtnLoad] = useState(false);
  const [ovcategory, setOvcategory] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
  const [ovProjCountDelete, setOvProjCountDelete] = useState("");
  const [templateCreationEdit, setTemplateCreationEdit] = useState({ name: "" });
  const [templateCreationArray, setTemplateCreationArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
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
  const modeoptions = [
    { label: "Employee", value: "Employee" },
    { label: "Company", value: "Company" },
    { label: "Payslip", value: "Payslip" }
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
  const handleExportXL = (isfilter) => {

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          "Template Mode": item.tempaltemode,
          Company: item.company,
          Branch: item.branch,
          Name: item.name,
          'Template Code': item.tempcode,
          "Page Size": item.pagesize,
          "Print Option": item.proption,
          "Head Value Text": item.headvaluetext,
          Signature: item.signature,
          Seal: item.seal,
          "Page Mode": item.pagemode,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overallExcelDatas.map((item, index) => ({
          "Sno": index + 1,
          "Template Mode": item.tempaltemode,
          Company: item.company,
          Branch: item.branch,
          Name: item.name,
          "Template Code": item.tempcode,
          "Page Size": item.pagesize,
          "Print Option": item.proption,
          "Head Value Text": item.headvalue?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          Signature: item.signature,
          Seal: item.seal,
          "Page Mode": item.pagemode
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  const CompanyDropDowns = async () => {
    try {
      setCompanyOptions(isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const BranchDropDowns = async (e) => {
    try {
      setBranchOptions(isAssignBranch?.filter(
        (comp) =>
          e === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const BranchDropDownsEdit = async (e) => {
    try {
      setBranchOptionsEdit(isAssignBranch?.filter(
        (comp) =>
          e === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    CompanyDropDowns();
  }, [])

  // get all branches
  const fetchOverallExcelDatas = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
    }))
    : [];
    try {
      let res_freq = await axios.post(SERVICE.ACCESSIBLEBRANCHALL_TEMPLATECREATION, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallExcelDatas(res_freq?.data?.templatecreation);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])


  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };


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


  const printOptions = [
    { value: "With Letter Head", label: "With Letter Head" },
    { value: "Without Letter Head", label: "Without Letter Head" },
  ];


  const headingcontentOptions = [
    { value: "With Head content", label: "With Head content" },
    { value: "With Footer content", label: "With Footer content" }

  ];

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

  const customValueRenderHeadFrom = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
  };


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

  const customValueRenderHeadFromEdit = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    tempcode: true,
    headvaluetext: true,
    pagesize: true,
    seal: true,
    tempaltemode: true,
    company: true,
    branch: true,
    pagemode: true,
    signature: true,
    proption: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [templateCreationArray]);


  useEffect(() => {
    fetchBrandMaster();
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
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteTemplate(res?.data?.stemplatecreation);
      getOverallEditSectionDelete(res?.data?.stemplatecreation?.name)
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    try {

      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: cat
      });
      setOvProjCountDelete(res?.data?.count);
      setGetOverallCountDelete(`This data is linked in 
              ${res?.data?.templatecreation?.length > 0 ? "Document Preparation ," : ""}
               `);

      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSectionOverallDelete = async (ids) => {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (cat) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: cat,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`This data is linked in 
         ${res?.data?.templatecreation?.length > 0 ? "Document Preparation ," : ""}
           whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TEMPLATE_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: ovcategory,
      });
      sendEditRequestOverall(res?.data?.templatecreation,
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (templatecreation) => {
    try {
      if (templatecreation?.length > 0) {
        let answ = templatecreation.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            template: templateCreationEdit.name,
          });
        });
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let brandid = deleteTemplate._id;
  const delBrand = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_TEMPLATECREATION}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBrandMaster();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setBtnLoad(true)
   
    try {
        valueBranchCat.forEach((data, index) => {
          return axios.post(SERVICE.CREATE_TEMPLATECREATION, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            name: String(templateCreation.name),
            tempaltemode: String(templateCreation.tempaltemode),
            company: templateCreation.company,
            branch: data, // Use the branch from the current loop
            tempcode: String(templateCreation.tempcode),
            proption: String(templateCreation.proption),
            headvalue: headvalue,
            head: head,
            foot: foot,
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
        tempcode: "",
        proption: "Please Select Print Option",
        pagesize: "Please Select Page Size",
        print: "Please Select Print Option",
        heading: "Please Select Header Option",
        signature: "None",
        seal: "None",
        pagemode: "Single Page",
      });
      setHeadValue([])
      setSelectedHeadOpt([])
      setHeader("")
      setfooter("")
      setAgenda("");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      await fetchBrandMaster();
      handleClickOpenerr();
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = templateCreationArray?.some((item) => item.name?.toLowerCase() === templateCreation.name?.toLowerCase() && item.company?.toLowerCase() === templateCreation.company?.toLowerCase() && valueBranchCat.includes(item.branch?.toLowerCase()));
    if (templateCreation?.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (valueBranchCat.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreation?.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Template Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreation.tempcode === "" || templateCreation.tempcode === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Template Code"}</p>
        </>
      );
      handleClickOpenerr();

    }
    else if (templateCreation.pagesize === "Please Select Page Size" || templateCreation.pagesize === "" || templateCreation.pagesize === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Page Size"}</p>
        </>
      );
      handleClickOpenerr();

    }
    else if (templateCreation.proption === "Please Select Print Option" || templateCreation.proption === "" || templateCreation.proption === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Print Option"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreation.proption === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select With Letter Head"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (agenda === "" || agenda.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Page Format!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Template Name already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      console.log(valueBranchCat,'valueBranchCat')
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setTemplateCreation({
      name: "",
      tempaltemode: "Employee",
      tempcode: "",
      proption: "Please Select Print Option",
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


    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
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
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationEdit(res?.data?.stemplatecreation);
      setAgendaEdit(res?.data?.stemplatecreation?.pageformat);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMPLATECREATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationEdit(res?.data?.stemplatecreation);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //frequency master name updateby edit page...
  let updateby = templateCreationEdit.updatedby;
  let addedby = templateCreationEdit.addedby;
  let frequencyId = templateCreationEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.SINGLE_TEMPLATECREATION}/${frequencyId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(templateCreationEdit.name),
        tempaltemode: templateCreationEdit.tempaltemode,
        company: templateCreationEdit.company,
        branch: templateCreationEdit.branch,
        tempcode: String(templateCreationEdit.tempcode),
        proption: String(templateCreationEdit.proption),
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
      await fetchBrandMaster(); fetchBrandMasterAll();
      await getOverallEditSectionUpdate();
      setAgendaEdit("");
      handleCloseModEdit();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchBrandMasterAll();
    const isNameMatch = allTemplateCreationEdit?.some((item) => item.name?.toLowerCase() === templateCreationEdit.name?.toLowerCase() && item.company?.toLowerCase() === templateCreationEdit?.company?.toLowerCase() && item.branch?.toLowerCase() === templateCreationEdit?.branch?.toLowerCase());



    if (templateCreationEdit?.tempaltemode === "" || templateCreationEdit?.tempaltemode === undefined || templateCreationEdit?.tempaltemode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Template Mode"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreationEdit?.company === "Please Select Company" || templateCreationEdit?.company === undefined || templateCreationEdit?.company === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreationEdit?.branch === "Please Select Branch" || templateCreationEdit?.branch === undefined || templateCreationEdit?.branch === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreationEdit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Template Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreationEdit.tempcode === "" || templateCreationEdit.tempcode === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Template Code"}</p>
        </>
      );
      handleClickOpenerr();

    }
    else if (templateCreationEdit.pagesize === "Please Select Page Size" || templateCreationEdit.pagesize === "" || templateCreationEdit.pagesize === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Page Size"}</p>
        </>
      );
      handleClickOpenerr();

    }
    else if (templateCreationEdit.proption === "Please Select Print Option" || templateCreationEdit.proption === "" || templateCreationEdit.proption === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Print Option"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (templateCreationEdit.proption === "With Letter Head" && selectedHeadOptEdit?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select With Letter Head"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (agendaEdit === "" || agendaEdit.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Page Format!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Template Name already exists!"}</p>
        </>
      );
      handleClickOpenerr();
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

    else {
      sendEditRequest();
    }
  };
  //get all brand master name.
  const fetchBrandMaster = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
    }))
    : [];
    try {
      let res_freq = await axios.post(SERVICE.ACCESSIBLEBRANCHALL_TEMPLATECREATION, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationArray(res_freq?.data?.templatecreation);
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const delAreagrpcheckbox = async () => {
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchBrandMasterAll();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all Template Name.
  const fetchBrandMasterAll = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
    }))
    : [];
    try {
      let res_freq = await axios.post(SERVICE.ACCESSIBLEBRANCHALL_TEMPLATECREATION, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationArray(res_freq?.data?.templatecreation);
      setAllTemplateCreationEdit(res_freq?.data?.templatecreation.filter((item) => item._id !== templateCreationEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "TemplateCreation.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Template Mode", field: "tempaltemode" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Template Name ", field: "name" },
    { title: "Template Code ", field: "tempcode" },
    { title: "Page Size ", field: "pagesize" },
    { title: "Print Options", field: "proption" },
    { title: "Letter Head", field: "headvaluetext" },
    { title: "Signature", field: "signature" },
    { title: "Seal", field: "seal" },
    { title: "Page Mode", field: "pagemode" },
  ];

  const downloadPdf = (isfilter) => {


    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        "Template Mode": item.tempaltemode,
        company: item.company,
        branch: item.branch,
        name: item.name,
        tempcode: item.tempcode,
        "pagesize": item.pagesize,
        "proption": item.proption,
        "headvaluetext": item.headvaluetext,
        signature: item.signature,
        seal: item.seal,
        "pagemode": item.pagemode,

      })) :
      overallExcelDatas.map((item, index) => ({
        "serialNumber": index + 1,
        "Template Mode": item.tempaltemode,
        company: item.company,
        branch: item.branch,
        name: item.name,
        tempcode: item.tempcode,
        "pagesize": item.pagesize,
        "proption": item.proption,
        "headvaluetext": item.headvalue?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        signature: item.signature,
        seal: item.seal,
        pagemode: item.pagemode,

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("TemplateCreation.pdf");
  };

  // Excel
  const fileName = "TemplateCreation";


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Template Creation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = templateCreationArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      headvaluetext: item.headvalue?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
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
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
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
      width: 120,
      hide: !columnVisibility.name,
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
      field: "proption",
      headerName: "Print Option",
      flex: 0,
      width: 140,
      hide: !columnVisibility.proption,
      headerClassName: "bold-header",
    },
    {
      field: "headvaluetext",
      headerName: "Letter Head",
      flex: 0,
      width: 140,
      hide: !columnVisibility.headvaluetext,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("etemplatecreation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtemplatecreation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtemplatecreation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("itemplatecreation") && (
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
      tempcode: item.tempcode,
      pagesize: item.pagesize,
      head: convertToNumberedList(item.head),
      foot: convertToNumberedList(item.foot),
      proption: item.proption,
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
      <Typography sx={userStyle.HeaderText}>Template Creation</Typography>
      {!loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("atemplatecreation") && (
            <Box sx={userStyle.selectcontainer}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>Add Template</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode<b style={{ color: "red" }}>*</b>
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
                        }}

                      />
                    </FormControl>
                  </Grid>
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
                          console.log(e,'eeee')
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
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
                  <Grid item md={3} xs={12} sm={12}>
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
                          // handlePagenameChange1(e.value)

                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Print Option<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={printOptions}
                        value={{ label: templateCreation.proption, value: templateCreation.proption }}
                        onChange={(e) => {
                          setTemplateCreation({
                            ...templateCreation,
                            proption: e.value,
                          });
                          setHeader("")
                          setfooter("")
                          setSelectedHeadOpt([])
                          setHeadValue([])
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {templateCreation.proption === "With Letter Head" && (<Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        With Letter Head    <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        maxMenuHeight={300}
                        options={headingcontentOptions}
                        value={selectedHeadOpt}
                        onChange={handleHeadChange}
                        valueRenderer={customValueRenderHeadFrom}
                      />
                    </FormControl>
                  </Grid>)}
                  <Grid item md={12} xs={12} sm={12}>
                  </Grid>
                  <br />
                  <br />
                  <Grid item md={3} xs={12} sm={12}>
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
                  <Grid item md={3} xs={12} sm={6}>
                    <LoadingButton loading={btnload} variant="contained" color="primary" onClick={handleSubmit}>
                      Submit
                    </LoadingButton>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
          )}
        </>
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
                    {/* <MenuItem value={templateCreationArray?.length}>All</MenuItem> */}
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
                        fetchOverallExcelDatas()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvtemplatecreation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
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
                          fetchOverallExcelDatas()
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
            {isUserRoleCompare?.includes("bdtemplatecreation") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Template Mode</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Template Name</TableCell>
              <TableCell>Template Code</TableCell>
              <TableCell>Page Size</TableCell>
              <TableCell>Print Option</TableCell>
              <TableCell>Letter Head</TableCell>
              <TableCell>Signature</TableCell>
              <TableCell>Seal</TableCell>
              <TableCell>Page Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable?.length > 0 &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.tempaltemode}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.tempcode}</TableCell>
                  <TableCell>{row.pagesize}</TableCell>
                  <TableCell>{row.proption}</TableCell>
                  <TableCell>{row.headvaluetext}</TableCell>
                  <TableCell>{row.signature}</TableCell>
                  <TableCell>{row.seal}</TableCell>
                  <TableCell>{row.pagemode}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Template Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchOverallExcelDatas()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
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
          <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Template</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template Mode</Typography>
                  <Typography>{templateCreationEdit?.tempaltemode}</Typography>
                </FormControl>
              </Grid>
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
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Print Option
                  </Typography>
                  <Typography>{templateCreationEdit?.proption}</Typography>
                </FormControl>
              </Grid>
              {templateCreationEdit.proption === "With Letter Head" && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      With Letter Head
                    </Typography>
                    <Typography>{templateCreationEdit?.headvalue?.map((t, i) => `${i + 1 + ". "}` + t).toString()}</Typography>
                  </FormControl>
                </Grid>)}
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
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
            <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}>
              ok
            </Button>
            <Button
              style={{
                backgroundColor: '#f4f4f4',
                color: '#444',
                boxShadow: 'none',
                borderRadius: '3px',
                padding: '7px 13px',
                border: '1px solid #0000006b',
                '&:hover': {
                  '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                    backgroundColor: '#f4f4f4',
                  },
                },
              }}
              onClick={handleCloseerrpop}
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
          <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
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
                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                <Button autoFocus variant="contained" color='error'
                  onClick={(e) => delAreagrpcheckbox(e)}
                > OK </Button>
              </>
              :
              <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
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
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
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
          fullWidth={true}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Template</Typography>
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
                      }}

                    />
                  </FormControl>
                </Grid>
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
                <Grid item md={4} xs={12} sm={12}>
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

                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Print Option    <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={printOptions}
                      value={{ label: templateCreationEdit.proption, value: templateCreationEdit.proption }}
                      onChange={(e) => {
                        setTemplateCreationEdit({
                          ...templateCreationEdit,
                          proption: e.value,
                        });
                        setSelectedHeadOptEdit([])
                        setHeaderEdit("")
                        setfooterEdit("")
                        setHeadValueEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                {templateCreationEdit.proption === "With Letter Head" && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        With Letter Head    <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        maxMenuHeight={300}
                        options={headingcontentOptions}
                        value={selectedHeadOptEdit}
                        onChange={handleHeadChangeEdit}
                        valueRenderer={customValueRenderHeadFromEdit}
                      />
                    </FormControl>
                  </Grid>)}
                <Grid item md={4} xs={12} sm={12}>
                </Grid>


                <Grid item md={4} xs={12} sm={12}>
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
                <Grid item md={4} xs={12} sm={12}>
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
                <Grid item md={4} xs={12} sm={12}>
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

export default TemplateCreation;