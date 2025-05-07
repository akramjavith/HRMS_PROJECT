import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
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
  TextareaAutosize,
  TextField,
  Typography, Radio, RadioGroup, FormControlLabel, InputAdornment, Tooltip,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";

function Incomemaster() {
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
    "Date",
    "Time",
    "Company",
    "Branch",
    "Unit",
    "Payment Mode",
    "Source",
    "Amount",
    "Note",
    "Mode",
  ];
  let exportRowValues = [
    "date",
    "time",
    "company",
    "branch",
    "unit",
    "paymentmode",
    "source",
    "amount",
    "notes",
    "modeDrop",
  ];

  const [allData, setAllData] = useState([]);
  const exportallData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(
        SERVICE.INCOME,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      let data = res?.data?.incomes.map((item) => ({
        ...item,
        date: moment(item.date)?.format("DD-MM-YYYY"),
      }));
      setAllData(data);
      return data;
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

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

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [income, setIncome] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    source: "Please Select Source",
    paymentmode: "Please Select Payment Mode",
    date: formattedDate,
    time: "",
    modeDrop: "Please Select Mode",
    notes: "",
    amount: "",
  });

  const [incomeEdit, setIncomeEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    source: "Please Select Source",
    paymentmode: "Please Select Payment Mode",
    date: "",
    time: "",
    modeDrop: "Please Select Mode",
    notes: "",
    amount: "",
  });
  const [incomes, setIncomes] = useState([]);
  const [modeDrop, setmodeDrop] = useState("Please Select Mode");
  const [modeDropEdit, setmodeDropEdit] = useState("Please Select Mode");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const [sourceDrop, setSourceDrop] = useState([]);
  const [sourceDropEdit, setSourcedropEdit] = useState([]);

  const { auth } = useContext(AuthContext);
  const [incomeCheck, setIncomecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [sourceNameDrop, setSourceNameDrop] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [sourceNameDropEdit, setSourceNameDropEdit] = useState([]);
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

  //image

  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Income.png");
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
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

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
    date: true,
    time: true,
    company: true,
    branch: true,
    unit: true,
    paymentmode: true,
    source: true,
    amount: true,
    notes: true,
    modeDrop: true,
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

  const [deleteIncome, setDeleteIncome] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.INCOME_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteIncome(res?.data?.sincome);
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

  // Alert delete popup
  let Incomesid = deleteIncome?._id;
  const delIncome = async () => {
    setPageName(!pageName);
    try {
      if (Incomesid) {
        await axios.delete(`${SERVICE.INCOME_SINGLE}/${Incomesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchIncome(filterClicked);
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
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

  const delIncomecheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.INCOME_SINGLE}/${item}`, {
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

      await fetchIncome(filterClicked);

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
  const fetchSourceDropdowns = async () => {
    try {
      let res = await axios.get(SERVICE.SOURCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const sourceall = [
        ...res?.data?.sources.map((d) => ({
          ...d,
          label: d.sourcename,
          value: d.sourcename,
        })),
      ];

      setSourceDrop(sourceall);
      setSourcedropEdit(sourceall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
      let res = await axios.get(`${SERVICE.INCOME_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIncomeEdit(res?.data?.sincome);
      setmodeDropEdit(res?.data?.sincome.modeDrop);
      fetchSourceNameAll(res?.data?.sincome?.paymentmode);
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

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.INCOME_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIncomeEdit(res?.data?.sincome);
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
      let res = await axios.get(`${SERVICE.INCOME_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIncomeEdit(res?.data?.sincome);
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
  let updateby = incomeEdit?.updatedby;
  let addedby = incomeEdit?.addedby;

  let subprojectsid = incomeEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.INCOME_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(incomeEdit.company),
        branch: String(incomeEdit.branch),
        unit: String(incomeEdit.unit),
        paymentmode: String(incomeEdit.paymentmode),
        source: String(incomeEdit.source),
        amount: Number(incomeEdit.amount),
        date: String(incomeEdit.date),
        time: String(incomeEdit.time),
        modeDrop: String(modeDropEdit),
        notes: String(incomeEdit.notes),
        sortdate: String(modeDropEdit === "Received" ? new Date() : ""),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchIncome(filterClicked);
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

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchIncomeAll();
    const isNameMatch = resdata.some(
      (item) =>
        item.company === incomeEdit.company &&
        item.branch === incomeEdit.branch &&
        item.unit === incomeEdit.unit &&
        item.paymentmode === incomeEdit.paymentmode &&
        item.source === incomeEdit.source &&
        item.amount == incomeEdit.amount &&
        item.modeDrop === modeDropEdit &&
        //  && item.date === incomeEdit.date
        item.time === incomeEdit.time
    );
    if (incomeEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      incomeEdit.source === "" ||
      incomeEdit.source === "Please Select Source"
    ) {
      setPopupContentMalert("Please Select Source!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.paymentmode === "Please Select Payment Mode") {
      setPopupContentMalert("Please Select Payment Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.amount === "") {
      setPopupContentMalert("Please Enter Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.date === "" || incomeEdit.date === undefined) {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeDropEdit === "Please Select Mode" || modeDropEdit === "") {
      setPopupContentMalert("Please Select Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (incomeEdit.time === "") {
      setPopupContentMalert("Please Select Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Income already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };


  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(incomes);
  }, [incomes]);




  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalProjectsData, setTotalProjectsData] = useState([]);
  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
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
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after the timeout
    }, 300); // Debounce delay in milliseconds (adjust as needed)

    return () => {
      clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
    };
  }, [searchQuery]);
  const [filterClicked, setFilterClicked] = useState(false);
  useEffect(() => {
    if (filterClicked) {
      fetchIncome(filterClicked);
    }
  }, [page, pageSize, debouncedQuery]);


  const handleResetSearch = async () => {
    setPageName(!pageName)
    // setLoader(false);

    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (debouncedQuery) {
      queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
    }


    try {
      setIncomecheck(true);
      let res = await axios.post(SERVICE.SKIPPEDINCOME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ...queryParams,
        assignbranch: accessbranch,
        dateFilter: filterUser?.day ? filterUser : null,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
      });


      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        date: moment(item.date).format("DD-MM-YYYY"),
      }));

      setIncomes(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
        res?.data?.totalProjectsDatas?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          date: moment(item.date).format("DD-MM-YYYY"),
        })) : []);
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);

      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setIncomecheck(false);

    } catch (err) {
      setIncomecheck(false); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

  //get all Sub vendormasters.


  //get all Sub vendormasters.
  const fetchIncomeAll = async () => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.post(
        SERVICE.INCOME,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      return res_meet?.data?.incomes.filter(
        (item) => item._id !== incomeEdit._id
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
    documentTitle: "Income",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchSourceDropdowns();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
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
      field: "paymentmode",
      headerName: "Payment Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.paymentmode,
      headerClassName: "bold-header",
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 100,
      hide: !columnVisibility.source,
      headerClassName: "bold-header",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0,
      width: 100,
      hide: !columnVisibility.amount,
      headerClassName: "bold-header",
    },
    {
      field: "notes",
      headerName: "Note",
      flex: 0,
      width: 100,
      hide: !columnVisibility.notes,
      headerClassName: "bold-header",
      //lockPinned: true,
    },
    {
      field: "modeDrop",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.modeDrop,
      headerClassName: "bold-header",
      //lockPinned: true,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      //lockPinned: true,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("elistincome") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dlistincome") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vlistincome") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ilistincome") && (
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
  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      date: item.date,
      time: item.time,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      paymentmode: item.paymentmode,
      source: item.source,
      amount: item.amount,
      notes: item.notes,
      modeDrop: item.modeDrop,
      // date: item.date,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
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

  //get all Sourcename vendormasters.
  const fetchSourceNameAll = async (e) => {
    try {
      let res_meet = await axios.get(SERVICE.SOURCEOFPAYMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_meet?.data?.SourceofPy.filter((data) => {
        return data.paymentmode.some((item) => item === e);
      });
      const units = [
        ...data_set.map((d) => ({
          ...d,
          label: d.sourcename,
          value: d.sourcename,
        })),
      ];
      setSourceNameDrop(units);
      setSourceNameDropEdit(units);
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

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("List Income"),
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

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };




  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]


  const [filterUser, setFilterUser] = useState({
    day: "Today",
    fromtime: '00:00',
    totime: '23:59',
    fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
  });

  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
        break;
      default:
        return;
    }
  }
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = accessbranch.filter(
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

      setValueCompanyCat([
        ...selectedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && "Others",
      ]);
      setSelectedOptionsCompany([
        ...mappedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && {
        //   label: "Others",
        //   value: "Others",
        // },
      ]);

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


  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.day === "Custom Fields" && (!filterUser.fromdate || !filterUser.todate)) {
      setPopupContentMalert("Please Select All Date Fields!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setFilterClicked(true);
      fetchIncome(true);
    }
  };
  const fetchIncome = async (clicked) => {
    setPageName(!pageName);

    try {
      if (clicked) {
        setIncomecheck(true);
        const queryParams = {
          page: Number(page),
          pageSize: Number(pageSize),
        };

        const allFilters = [
          ...additionalFilters,
          { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {

          queryParams.allFilters = allFilters
          queryParams.logicOperator = logicOperator;
        } else if (debouncedQuery) {
          queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
        }


        let res = await axios.post(SERVICE.SKIPPEDINCOME, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ...queryParams,
          assignbranch: accessbranch,
          dateFilter: filterUser?.day ? filterUser : null,
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
        });
        const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          date: moment(item.date).format("DD-MM-YYYY"),
        }));

        setIncomes(itemsWithSerialNumber);
        setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
          res?.data?.totalProjectsDatas?.map((item, index) => ({
            ...item,
            id: item._id,
            serialNumber: (page - 1) * pageSize + index + 1,
            date: moment(item.date).format("DD-MM-YYYY"),
          })) : []);
        setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);

        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });

      }
      setIncomecheck(false);
    } catch (err) {
      setIncomecheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setIncomes([]);

    setFilterUser({
      day: "Today",
      fromtime: '00:00',
      totime: '23:59',
      fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
    });
    setTotalProjectsData([]);
    setTotalProjects([]);
    setTotalPages(0);
    setTotalDatas(0);
    setPageSize(10);
    setPage(1);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  return (
    <Box>
      <Headtitle title={"LIST INCOME"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="List Income"
        modulename="Expenses"
        submodulename="List Income"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("llistincome") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={[
                        ...accessbranch?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        })),

                      ]
                        ?.filter(Boolean) // Filter out falsy values, including `undefined`
                        ?.filter((item, index, self) => {
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
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
                      disabled={valueCompanyCat?.includes("Others")}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Unit</Typography>
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
                      disabled={valueCompanyCat?.includes("Others")}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: "500" }}>
                      Days
                    </Typography>
                    <Selects
                      options={daysoptions}
                      // styles={colourStyles}
                      value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                      onChange={(e) => {
                        handleChangeFilterDate(e);
                        setFilterUser((prev) => ({ ...prev, day: e.value }))
                      }}
                    />
                  </FormControl>
                </Grid>
                {filterUser.day !== "" && <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        From Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="from-date"
                        type="date"
                        disabled={filterUser.day !== "Custom Fields"}
                        value={filterUser.fromdate}
                        onChange={(e) => {
                          const newFromDate = e.target.value;
                          setFilterUser((prevState) => ({
                            ...prevState,
                            fromdate: newFromDate,
                            todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                          }));
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
                        id="to-date"
                        type="date"
                        value={filterUser.todate}
                        disabled={filterUser.day !== "Custom Fields"}
                        onChange={(e) => {
                          const selectedToDate = new Date(e.target.value);
                          const selectedFromDate = new Date(filterUser.fromdate);

                          if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                            setFilterUser({
                              ...filterUser,
                              todate: e.target.value
                            });
                          } else {
                            setFilterUser({
                              ...filterUser,
                              todate: "" // Reset to empty string if the condition fails
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>}
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleClearFilter}
                >
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            marginTop: "50px",
            // overflow: "visible",
            // "& .MuiPaper-root": {
            //   overflow: "visible",
            // },
          }}
        >
          <Box sx={{ padding: "30px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Income
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
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
                          styles={colourStyles}
                          value={{
                            label: incomeEdit.company,
                            value: incomeEdit.company,
                          }}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              company: e.value,
                              branch: "Please Select Branch",
                              unit: "Please Select Unit",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={accessbranch
                            ?.filter(
                              (comp) => incomeEdit.company === comp.company
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
                            label: incomeEdit.branch,
                            value: incomeEdit.branch,
                          }}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
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
                          Unit <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                incomeEdit.company === comp.company &&
                                incomeEdit.branch === comp.branch
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
                            label: incomeEdit.unit,
                            value: incomeEdit.unit,
                          }}
                          onChange={(e) => {
                            setIncomeEdit({ ...incomeEdit, unit: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Payment Mode <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={sourceDropEdit}
                          styles={colourStyles}
                          value={{
                            label: incomeEdit.paymentmode,
                            value: incomeEdit.paymentmode,
                          }}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              paymentmode: e.value,
                              source: "Please Select Source",
                            });
                            fetchSourceNameAll(e.sourcename);
                            setSourceNameDropEdit([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Source <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={sourceNameDropEdit}
                          styles={colourStyles}
                          value={{
                            label: incomeEdit.source,
                            value: incomeEdit.source,
                          }}
                          onChange={(e) => {
                            setIncomeEdit({ ...incomeEdit, source: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Amount <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          placeholder="Please Enter Amount"
                          sx={userStyle.input}
                          value={incomeEdit.amount}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              amount: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Notes</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={incomeEdit.notes}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              notes: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Mode <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={modeDropEdit}
                          onChange={(e) => {
                            setmodeDropEdit(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="Please Select Mode" disabled>
                            {" "}
                            {"Please Select Mode"}{" "}
                          </MenuItem>
                          <MenuItem value="Pending"> {"Pending"} </MenuItem>
                          <MenuItem value="Received"> {"Received"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Date </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={incomeEdit.date}
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              date: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <Typography>
                        {" "}
                        Time<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          value={incomeEdit.time}
                          type="time"
                          onChange={(e) => {
                            setIncomeEdit({
                              ...incomeEdit,
                              time: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={buttonStyles.buttonsubmit}
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
      {isUserRoleCompare?.includes("llistincome") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Income List</Typography>
              </Grid>
              <Grid item xs={4}>
                {isUserRoleCompare?.includes("aaddincome") && (
                  <>
                    <Link
                      to={`/expense/addincome`}
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
                  {isUserRoleCompare?.includes("excellistincome") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("xl");
                          exportallData();
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvlistincome") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("csv");
                          exportallData();
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printlistincome") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdflistincome") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          exportallData();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagelistincome") && (
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
                <FormControl fullWidth size="small">
                  <OutlinedInput size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {advancedFilter && (
                          <IconButton onClick={handleResetSearch}>
                            <MdClose />
                          </IconButton>
                        )}
                        <Tooltip title="Show search options">
                          <span>
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                          </span>
                        </Tooltip>
                      </InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ 'aria-label': 'weight', }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>


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
            {isUserRoleCompare?.includes("bdlistincome") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {incomeCheck ? (
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
                <>

                  {/* <AggridTable
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
                    paginated={true}
                    filteredDatas={filteredDatas}
                    totalDatas={totalProjects}
                    searchQuery={searchQuery}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={totalProjectsData}
                  /> */}


                  <AggridTableForPaginationTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTable}
                    columnVisibility={columnVisibility}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibility}

                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTable}


                    totalDatas={totalDatas}

                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={totalProjectsData}
                  />
                </>
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
      <Popover
        id={idSearch}
        open={openSearch}
        anchorEl={anchorElSearch}
        onClose={handleCloseSearch}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <Box style={{ padding: "10px", maxWidth: '450px' }}>
          <Typography variant="h6">Advance Search</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSearch}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ width: "100%" }}>
            <Box sx={{
              width: '350px',
              maxHeight: '400px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                // paddingRight: '5px'
              }}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Columns</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Column</MenuItem>
                      {filteredSelectedColumn.map((col) => (
                        <MenuItem key={col.field} value={col.field}>
                          {col.headerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Operator</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      disabled={!selectedColumn}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {condition}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Value</Typography>
                    <TextField fullWidth size="small"
                      value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                      placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-disabled': {
                          backgroundColor: 'rgb(0 0 0 / 26%)',
                        },
                        '& .MuiOutlinedInput-input.Mui-disabled': {
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                  </Grid>
                  {additionalFilters.length > 0 && (
                    <>
                      <Grid item md={12} sm={12} xs={12}>
                        <RadioGroup
                          row
                          value={logicOperator}
                          onChange={(e) => setLogicOperator(e.target.value)}
                        >
                          <FormControlLabel value="AND" control={<Radio />} label="AND" />
                          <FormControlLabel value="OR" control={<Radio />} label="OR" />
                        </RadioGroup>
                      </Grid>
                    </>
                  )}
                  {additionalFilters.length === 0 && (
                    <Grid item md={4} sm={12} xs={12} >
                      <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                        Add Filter
                      </Button>
                    </Grid>
                  )}

                  <Grid item md={2} sm={12} xs={12}>
                    <Button variant="contained" onClick={() => {
                      fetchIncome(filterClicked);
                      handleCloseSearch();
                      setIsSearchActive(true);
                      setAdvancedFilter([
                        ...additionalFilters,
                        { column: selectedColumn, condition: selectedCondition, value: filterValue }
                      ])
                    }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Popover>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          marginTop: "50px",
        }}
      >
        <Box sx={{ width: "850px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Income</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{incomeEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{incomeEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{incomeEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Payment Mode</Typography>
                  <Typography>{incomeEdit.paymentmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Source</Typography>
                  <Typography>{incomeEdit.source}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Amount</Typography>
                  <Typography>{incomeEdit.amount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Note</Typography>
                  <Typography style={{ overflowWrap: "break-word" }}>
                    {incomeEdit.notes}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{incomeEdit.modeDrop}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(incomeEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{incomeEdit.time}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={buttonStyles.btncancel}
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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
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
        itemsTwo={totalProjectsData ?? []}
        filename={"Income"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Income Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delIncome}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delIncomecheckbox}
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

export default Incomemaster;
