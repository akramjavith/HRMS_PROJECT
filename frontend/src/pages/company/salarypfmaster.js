import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
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
  TableBody,
  TableFooter,
  TableHead,
  Table,
  Paper,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import Selects from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { saveAs } from "file-saver";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import "jspdf-autotable";
// import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling.js";
import Headtitle from "../../components/Headtitle.js";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../context/Appcontext.js";
import { userStyle,colourStyles} from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../components/Alert.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";
import domtoimage from "dom-to-image";

function Salarypfmaster() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [loader, setLoader] = useState(false);
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
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

   //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
  
    let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    let currentMonth = monthsArr[mm - 1];
  
    const [selectedYear, setSelectedYear] = useState(yyyy);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedMonthNum, setSelectedMonthNum] = useState(mm);
  
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
      setSelectedMonthNum(event.numval);
    };

  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [month, setMonth] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [generatedFormula, setGeneratedFormula] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [lastid, setLastid] = useState("");

  const fieldOptions = [
    "Basic",
    "HRA",
    "Conveyance",
    "Medical Allowance",
    "Production Allowance",
    "Other Allowance",
    "Production Allowance 2",
  ];
  const operatorOptions = ["+", "-", "*", "/"];
  const monthOptions = [
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
  const yearOptions = ["2023", "2024", "2025", "2026"];

  const handleGenerateFormula = () => {
    let part = "";
    if (field) part += field;
    if (operator) part += ` ${operator}`;
    if (part) {
      const newFormula = generatedFormula
        ? `${generatedFormula} ${part}`
        : part;
      setGeneratedFormula(newFormula.trim());
      setField("");
      setOperator("");
    }
  };

  const handleAddToDo = () => {
    if (generatedFormula && month && year) {
      const finalEntry = `${generatedFormula} for ${month} ${year}`;
      setTodoList([...todoList, finalEntry]);

      // Clear everything
      setGeneratedFormula("");
      setField("");
      setOperator("");
      setMonth("");
      setYear("");
    } else {
      alert("Please generate a formula and select month & year");
    }
  };

  const [salarySlab, setSalarySlab] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    processqueue: "Please Select Process",
    checkinput: "",
    salarycode: "",
    basic: "",
    hra: "",
    conveyance: "",
    medicalallowance: "",
    productionallowance: "",
    epfcontribution: 0,
    pfemployerpercentage: 0,
    productionallowancetwo: 0,
    pfemployeepercentage: 0,
    esilimit:0,
    pflimit:0,
    esiemployerpercentage: 0,
    esiemployeepercentage: 0,
    otherallowance: 0,
    epspension: 0,
    epfadmincharges: 0,
    shiftallowance: 0,
    edliinsurance: 0,

    esideduction: false,
    esipercentage: 0,
    esimaxsalary: 0,
    esiemployeepercentage: 0,
    pfdeduction: false,
    pfpercentage: 0,
    epspercentage: 0,
    pfemployeepercentage: 0,
  });

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [selectedRowsGrp, setSelectedRowsGrp] = useState([]);
  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({
    under: [],
  });

  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {
    setisCheckOpenbulk(false);
  };

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

  const [group, setGroup] = useState({ name: "" });
  const [groupEdit, setGroupEdit] = useState({ name: "" });
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allGroupEdit, setAllGroupEdit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };
  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Salary PF List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    setloadingdeloverall(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  // const handleClickOpenalert = () => {
  //   setIsHandleChange(true);
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     setIsDeleteOpencheckbox(true);
  //   }
  // };

  const handleClickOpenalert = async () => {
    try {
      let value = [...new Set(selectedRowsGrp.flat())];
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        let res = await axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_GROUP, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountname: value,
        });

        setDeleteAccGroup(res?.data?.groups);

        let under = res?.data?.groups.map((t) => t.under);

        if ((res?.data?.groups).length > 0) {
          handleClickOpenCheckbulk();
          // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
          setOveraldeletecheck({
            ...overalldeletecheck,
            under: [...new Set(under)],
          });

          setDeleteAccGroup([]);
        } else {
          setIsDeleteOpencheckbox(true);
        }
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
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

  const [deleteGroup, setDeletegroup] = useState("");
  const [deleteAccGroup, setDeleteAccGroup] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res1 = await axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accountname: [name],
      });
      setDeletegroup(res?.data?.sgroup);
      setDeleteAccGroup(res1?.data.groups);

      if (res1?.data.groups.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let groupEditt = deleteGroup._id;
  const deleGroup = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.GROUP_SINGLE}/${groupEditt}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllGroup();
      handleCloseMod();
      setFilteredRowData([]);
      setFilteredChanges(null);
      setPage(1);
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

  const delGroupcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.GROUP_SINGLE}/${item}`, {
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
      setFilteredRowData([]);
      setFilteredChanges(null);
      await fetchAllGroup();
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
  // console.log(lastid, "lastid")
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      if (lastid != "" && lastid != undefined && lastid != "undefined") {

        let grpcreate = await axios.put(
          `${SERVICE.SINGLE_SALARY_PF_MASTER}/${lastid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            esiemployeepercentage: Number(salarySlab.esiemployeepercentage),
            esiemployerpercentage: Number(salarySlab.esiemployerpercentage),

            pfemployeepercentage: Number(salarySlab.pfemployeepercentage),
            pfemployerpercentage: Number(salarySlab.pfemployerpercentage),

            epfcontribution: Number(salarySlab.epfcontribution),
            epspension: Number(salarySlab.epspension),

            edliinsurance: Number(salarySlab.edliinsurance),
            epfadmincharges: Number(salarySlab.epfadmincharges),

            esilimit: Number(salarySlab.esilimit),
            pflimit: Number(salarySlab.pflimit),
             year:selectedYear,
             month:selectedMonth,

            // pftodoList: todoList,
            updatedby: [
              ...salarySlab?.updatedby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchAllGroup();
        setloadingdeloverall(false);

      } else {
        let grpcreate = await axios.post(SERVICE.CREATE_SALARY_PF_MASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          esiemployeepercentage: Number(salarySlab.esiemployeepercentage),
          esiemployerpercentage: Number(salarySlab.esiemployerpercentage),

          pfemployeepercentage: Number(salarySlab.pfemployeepercentage),
          pfemployerpercentage: Number(salarySlab.pfemployerpercentage),

          epfcontribution: Number(salarySlab.epfcontribution),
          epspension: Number(salarySlab.epspension),

          edliinsurance: Number(salarySlab.edliinsurance),
          epfadmincharges: Number(salarySlab.epfadmincharges),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchAllGroup();
        setloadingdeloverall(false);
      }


    } catch (err) {
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
    setPageName(!pageName);
    e.preventDefault();
    setloadingdeloverall(true);
    if (salarySlab.esiemployeepercentage === '' || salarySlab.esiemployeepercentage === 0 || salarySlab.esiemployeepercentage === undefined || salarySlab.esiemployeepercentage === "undefined") {
      setPopupContentMalert('Please Enter ESI Employee Percentage');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (salarySlab.esiemployerpercentage === '' || salarySlab.esiemployerpercentage === 0 || salarySlab.esiemployerpercentage === undefined || salarySlab.esiemployerpercentage === "undefined") {
      setPopupContentMalert('Please Enter ESI Employer Percentage');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (salarySlab.pfemployeepercentage === '' || salarySlab.pfemployeepercentage === 0 || salarySlab.pfemployeepercentage === undefined || salarySlab.pfemployeepercentage === "undefined") {
      setPopupContentMalert('Please Enter PF Employee Percentage');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    // else if (salarySlab.pfemployerpercentage === '' || salarySlab.pfemployerpercentage === 0 || salarySlab.pfemployerpercentage === undefined || salarySlab.pfemployerpercentage === "undefined") {
    //   setPopupContentMalert('Please Enter PF Employer Percentage');
    //   setPopupSeverityMalert('warning');
    //   handleClickOpenPopupMalert();
    // }
    else if (salarySlab.epfcontribution === '' || salarySlab.epfcontribution === 0 || salarySlab.epfcontribution === undefined || salarySlab.epfcontribution === "undefined") {
      setPopupContentMalert('Please Enter EPF Contribution');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else if (salarySlab.epspension === '' || salarySlab.epspension === 0 || salarySlab.epspension === undefined || salarySlab.epspension === "undefined") {
      setPopupContentMalert('Please Enter  EPS (Pension)');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else if (salarySlab.edliinsurance === '' || salarySlab.edliinsurance === 0 || salarySlab.edliinsurance === undefined || salarySlab.edliinsurance === "undefined") {
      setPopupContentMalert('Please Enter EDLI(Insurance)');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else if (salarySlab.epfadmincharges === '' || salarySlab.epfadmincharges === 0 || salarySlab.epfadmincharges === undefined || salarySlab.epfadmincharges === "undefined") {
      setPopupContentMalert('Please Enter EPF Admin Charges');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else if (salarySlab.esilimit === '' || salarySlab.esilimit === 0 || salarySlab.esilimit === undefined || salarySlab.esilimit === "undefined") {
      setPopupContentMalert('Please Enter ESI Limit');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else if (salarySlab.pflimit === '' || salarySlab.pflimit === 0 || salarySlab.pflimit === undefined || salarySlab.pflimit === "undefined") {
      setPopupContentMalert('Please Enter PF Limit');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = () => {
    setPageName(!pageName);
    setGroup({ name: "" });
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      getOverallEditSection(name);
      setOvProj(name);
      handleClickOpenEdit();
      setGroupEdit(res?.data?.sgroup);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);

    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroupEdit(res?.data?.sgroup);
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

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroupEdit(res?.data?.sgroup);
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

  //Project updateby edit page...
  let updateby = groupEdit.updatedby;
  let addedby = groupEdit.addedby;
  let projectsid = groupEdit._id;

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in
       ${res?.data?.under?.length > 0 ? "Account Salary PF ," : ""
        } whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.under);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const sendEditRequestOverall = async (under) => {
    try {
      if (under.length > 0) {
        let answ = under.map((d, i) => {
          let res = axios.put(`${SERVICE.ACCOUNTGROUP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            under: String(groupEdit.name),
          });
        });
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.GROUP_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(groupEdit.name),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setGroupEdit(res.data);
      await fetchGroupAll();
      await fetchAllGroup();
      getOverallEditSectionUpdate();
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
    setPageName(!pageName);
    e.preventDefault();
    fetchGroupAll();
    const isNameMatch = allGroupEdit?.some(
      (item) => item?.name?.toLowerCase() === groupEdit?.name?.toLowerCase()
    );
    if (groupEdit.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (groupEdit.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };

  //get all project.
  const fetchAllGroup = async () => {
    setPageName(!pageName);
    try {
      let res_grp = await axios.get(SERVICE.ALL_SALARY_PF_MASTER_LAST_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      if (res_grp?.data?.salarypf) {
        setSalarySlab(res_grp?.data?.salarypf);
        setTodoList(res_grp?.data?.salarypf.pftodoList);
        setLastid(res_grp?.data?.salarypf._id);
      }
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all project.
  const fetchGroupAll = async () => {
    setPageName(!pageName);
    try {
      let res_grp = await axios.get(SERVICE.GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllGroupEdit(
        res_grp?.data?.groups.filter((item) => item._id !== groupEdit._id)
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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Groupname List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchAllGroup();
  }, []);

  useEffect(() => {
    fetchGroupAll();
  }, [isEditOpen, groupEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(groups);
  }, [groups]);

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
      headerName: "Salary PF Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
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
          {isUserRoleCompare?.includes("esalarypfmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dsalarypfmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vsalarypfmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("isalarypfmaster") && (
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
      name: item.name,
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
      pagename: String("Salary PF"),
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

  useEffect(() => {
    getapi();
  }, []);

  const [todo, setTodo] = useState([]);

  const addTodo = () => {
    const newTodo = {
      formula: generatedFormula,
      type: type,
      month: month,
      year: year,
    };

    setTodoList([...todoList, newTodo]);
    setGeneratedFormula("");
    setField("");
    setOperator("");
    setMonth("");
    setYear("");
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...todoList];
    updatedTodos.splice(index, 1);
    setTodoList(updatedTodos);
  };
  console.log(salarySlab.esiemployeepercentage, "es")

  const calculatePFEmployerPercentage = (updates = {}) => {
    return (
      Number(updates.epfcontribution ?? (salarySlab.epfcontribution || 0)) +
      Number(updates.epspension ?? (salarySlab.epspension || 0))
      // +
      // Number(updates.edliinsurance ?? (salarySlab.edliinsurance || 0)) +
      // Number(updates.epfadmincharges ?? (salarySlab.epfadmincharges || 0))
    );
  };

  return (
    <Box>
      <Headtitle title={"Salary PF"} />
      <PageHeading
        title="Salary PF"
        modulename="Asset"
        submodulename="Master"
        mainpagename="Salary PF Master"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("asalarypfmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Salary PF Master
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      ESI Employee Percentage<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter ESI Employee Percentage"
                      value={salarySlab.esiemployeepercentage}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          esiemployeepercentage: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      ESI Employer Percentage<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter ESI Employer Percentage"
                      value={salarySlab.esiemployerpercentage}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          esiemployerpercentage: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      PF Employee Percentage<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter  PF Employee Percentage"
                      value={salarySlab.pfemployeepercentage}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          pfemployeepercentage: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Pf Employer Percentage<b>&nbsp;%</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      readOnly
                      sx={userStyle.input}
                      placeholder="Please Enter Pf Employer Percentage"
                      value={salarySlab.pfemployerpercentage}
                    // onChange={(e) => {
                    //   setSalarySlab({
                    //     ...salarySlab,
                    //     pfemployerpercentage:
                    //      e.target.value
                    //      ,
                    //   });
                    // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      EPF Contribution<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter EPF Contribution"
                      value={salarySlab.epfcontribution}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        setSalarySlab({
                          ...salarySlab,
                          epfcontribution: value,
                          pfemployerpercentage: calculatePFEmployerPercentage({ epfcontribution: value }),

                          // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epspension) + Number(salarySlab.edliinsurance) + Number(salarySlab.epfadmincharges),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      EPS (Pension)<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter EPS (Pension)"
                      value={salarySlab.epspension}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSalarySlab({
                          ...salarySlab,
                          epspension: value,
                          // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.edliinsurance) + Number(salarySlab.epfadmincharges),
                          pfemployerpercentage: calculatePFEmployerPercentage({ epspension: value }),

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      EDLI(Insurance)<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter EDLI(Insurance)"
                      value={salarySlab.edliinsurance}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSalarySlab({
                          ...salarySlab,
                          edliinsurance: value,
                          // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.epspension) + Number(salarySlab.epfadmincharges),
                          pfemployerpercentage: calculatePFEmployerPercentage({ edliinsurance: value }),

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      EPF Admin Charges<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter  EPF Admin Charges"
                      value={salarySlab.epfadmincharges}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        setSalarySlab({
                          ...salarySlab,
                          epfadmincharges: value,
                          // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.epspension) + Number(salarySlab.edliinsurance),
                          pfemployerpercentage: calculatePFEmployerPercentage({ epfadmincharges: value }),

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                    ESI limit<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter  ESI Limit"
                      value={salarySlab.esilimit}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        setSalarySlab({
                          ...salarySlab,
                          esilimit: value,
                        

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                    PF limit<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter  PF Limit"
                      value={salarySlab.pflimit}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        setSalarySlab({
                          ...salarySlab,
                          pflimit: value,
                        

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                 <Grid item md={2} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Year<b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <Selects options={years} styles={colourStyles} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Month <b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <Selects options={months} styles={colourStyles} value={{ label: selectedMonth, value: selectedMonth }} onChange={handleMonthChange} />
                                </FormControl>
                              </Grid>
                <br />
              
                <Grid item md={2} sm={6} xs={6} marginTop={3}>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Update
                  </LoadingButton>
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
          fullWidth={true}
          maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Salary PF Name
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter name"
                        value={groupEdit.name}
                        onChange={(e) => {
                          setGroupEdit({ ...groupEdit, name: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <LoadingButton
                      onClick={editSubmit}
                      sx={buttonStyles.buttonsubmit}
                      loadingPosition="end"
                      variant="contained"
                    >
                      Update
                    </LoadingButton>
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

      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Salary PF Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleGroup}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delGroupcheckbox}
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

export default Salarypfmaster;
