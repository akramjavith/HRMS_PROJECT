import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import { BASE_URL } from "../../services/Authservice";
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
  Popover,
  Select,
  TextField,
  Typography, Radio, RadioGroup, FormControlLabel, InputAdornment, Tooltip, OutlinedInput
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import domtoimage from 'dom-to-image';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import debounce from "lodash/debounce";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";

import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";

function ExpenseList() {
  const [isHandleChange, setIsHandleChange] = useState(false);
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
    "Reference No",
    "Company",
    "Branch",
    "Unit",
    "Vendor Name",
    "Purpose",
    "Expense Category",
    "Expense Sub Category",
    "Total Bill Amount",
    "Frequency",
    "Date",
    "Paid Status",
    "Paid Mode",
    "Paid Amount",
    "Balance Amount",
    "Expense Total",
    "Bill Status",
  ];
  let exportRowValues = [
    "referenceno",
    "company",
    "branch",
    "unit",
    "vendorname",
    "purpose",
    "expansecategory",
    "expansesubcategory",
    "totalbillamount",
    "vendorfrequency",
    "date",
    "paidstatus",
    "paidmode",
    "paidamount",
    "balanceamount",
    "expensetotal",
    "billstatus",
  ];



  const [allData, setAllData] = useState([]);
  const exportallData = async () => {
    setPageName(!pageName);

    try {
      let res = await axios.post(
        SERVICE.EXPENSESALL,
        {
          assignbranch: [
            ...accessbranch,
            isUserRoleCompare?.includes("lassignexpenseothers") && {
              company: "Others",
              branch: "",
              unit: "",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      let data = res?.data?.expenses.map((item) => ({
        ...item,
        purpose:
          item.purpose === "Please Select Purpose" ||
            item.purpose === undefined ||
            item.purpose === null
            ? ""
            : item.purpose,
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

  //state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const [openview, setOpenview] = useState(false);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [espenseCheck, setExpenseCheck] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [deletequeue, setDeleteQueue] = useState({});
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projEdit, setProjedit] = useState({});
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [roleName, setRoleName] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const [upload, setUpload] = useState([]);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    referenceno: true,
    company: true,
    branch: true,
    unit: true,
    vendorname: true,
    purpose: true,
    expansecategory: true,
    expansesubcategory: true,
    totalbillamount: true,
    vendorfrequency: true,
    date: true,
    paidstatus: true,
    paidmode: true,
    paidamount: true,
    balanceamount: true,
    expensetotal: true,
    checkbox: true,
    billstatus: true,
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulter = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_EXPENSE_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //useEffect

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  useEffect(() => {
    addSerialNumber(expenses);
  }, [expenses]);
  const {
    isUserRoleCompare,
    pageName,
    setPageName,
    isAssignBranch,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
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

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const delVendorcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.EXPENSES_SINGLE}/${item}`, {
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
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchExpenses(filterClicked);

    } catch (err) {
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
    setExpenses([]);

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
      fetchExpenses(true);
    }
  };


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
  const [filterClicked, setFilterClicked] = useState(false)

  useEffect(() => {
    if (filterClicked) {
      fetchExpenses(filterClicked);
    }
  }, [page, pageSize, debouncedQuery]);

  const handleResetSearch = async () => {
    setPageName(!pageName)
    setExpenseCheck(false);

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
      let res = await axios.post(SERVICE.SKIPPEDEXPENSES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        dateFilter: filterUser?.day ? filterUser : null,
        assignbranch: [
          ...accessbranch,
          isUserRoleCompare?.includes("lassignexpenseothers") && {
            company: "Others",
            branch: "",
            unit: "",
          },
        ],
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        ...queryParams,
      });


      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        purpose:
          item.purpose === "Please Select Purpose" ||
            item.purpose === undefined ||
            item.purpose === null
            ? ""
            : item.purpose,
        date: moment(item.date)?.format("DD-MM-YYYY"),
      }));

      setExpenses(itemsWithSerialNumber);

      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setExpenseCheck(true);
      // let resEXP = await axios.post(SERVICE.SKIPPEDEXPENSESEXPORT, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      //   dateFilter: filterUser?.day ? filterUser : null,
      //   assignbranch: [
      //     ...accessbranch,
      //     isUserRoleCompare?.includes("lassignexpenseothers") && {
      //       company: "Others",
      //       branch: "",
      //       unit: "",
      //     },
      //   ],
      //   company: valueCompanyCat,
      //   branch: valueBranchCat,
      //   unit: valueUnitCat,
      // });

      setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
        res?.data?.totalProjectsDatas?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: index + 1,
          purpose:
            item.purpose === "Please Select Purpose" ||
              item.purpose === undefined ||
              item.purpose === null
              ? ""
              : item.purpose,
          date: moment(item.date)?.format("DD-MM-YYYY"),
        })) : []);
    } catch (err) {
      setExpenseCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

  const fetchExpenses = async (clicked) => {

    try {
      if (clicked) {
        setPageName(!pageName);
        setExpenseCheck(false);
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


        let res = await axios.post(SERVICE.SKIPPEDEXPENSES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          page: Number(page),
          pageSize: Number(pageSize),
          dateFilter: filterUser?.day ? filterUser : null,
          assignbranch: [
            ...accessbranch,
            isUserRoleCompare?.includes("lassignexpenseothers") && {
              company: "Others",
              branch: "",
              unit: "",
            },
          ],
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
          ...queryParams,
        });

        const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          purpose:
            item.purpose === "Please Select Purpose" ||
              item.purpose === undefined ||
              item.purpose === null
              ? ""
              : item.purpose,
          date: moment(item.date)?.format("DD-MM-YYYY"),
        }));

        setExpenses(itemsWithSerialNumber);

        setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
        setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });
        setExpenseCheck(true);


        // let resEXP = await axios.post(SERVICE.SKIPPEDEXPENSESEXPORT, {
        //   headers: {
        //     Authorization: `Bearer ${auth.APIToken}`,
        //   },
        //   dateFilter: filterUser?.day ? filterUser : null,
        //   assignbranch: [
        //     ...accessbranch,
        //     isUserRoleCompare?.includes("lassignexpenseothers") && {
        //       company: "Others",
        //       branch: "",
        //       unit: "",
        //     },
        //   ],
        //   company: valueCompanyCat,
        //   branch: valueBranchCat,
        //   unit: valueUnitCat,
        // });

        setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
          res?.data?.totalProjectsDatas?.map((item, index) => ({
            ...item,
            id: item._id,
            serialNumber: index + 1,
            purpose:
              item.purpose === "Please Select Purpose" ||
                item.purpose === undefined ||
                item.purpose === null
                ? ""
                : item.purpose,
            date: moment(item.date)?.format("DD-MM-YYYY"),
          })) : []);
      }
    } catch (err) {
      setExpenseCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteQueue(res?.data?.sexpenses);
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
  let queueid = deletequeue._id;
  const deleQueue = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.EXPENSES_SINGLE}/${queueid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchExpenses(filterClicked);

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const gridRef = useRef(null);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sexpenses);
      setUpload(res?.data?.sexpenses?.files);
      console.log(res?.data?.sexpenses?.files);
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
      let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleName(res?.data?.sexpenses);
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

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  let updateby = roleName.updatedby;
  let addedby = roleName.addedby;
  // pdf.....

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Expenses.png");
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
    documentTitle: "List Expenses",
    pageStyle: "print",
  });
  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  //table sorting
  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });
  //Datatable

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
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

  console.log(filteredDatas, "filteredDatas")

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      referenceno: item.referenceno,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      vendorname: item.vendorname,
      // purpose: item.purpose,
      purpose: item.purpose,
      date: item.date,
      expansecategory: item.expansecategory,
      expansesubcategory: item.expansesubcategory,
      totalbillamount: item.totalbillamount,
      vendorfrequency: item.vendorfrequency,
      paidstatus: item.paidstatus,
      paidmode: item.paidmode,
      paidamount: item.paidamount,
      balanceamount: item.balanceamount,
      expensetotal: item.expensetotal,
      billstatus: item.billstatus,
    };
  });
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 50,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "referenceno",
      headerName: "Reference No",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.referenceno,
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.vendorname,
    },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.purpose,
    },
    {
      field: "expansecategory",
      headerName: "Expense Category",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.expansecategory,
    },
    {
      field: "expansesubcategory",
      headerName: "Expense SubCategory",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.expansesubcategory,
    },
    {
      field: "totalbillamount",
      headerName: "Total BillAmount",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.totalbillamount,
    },
    {
      field: "vendorfrequency",
      headerName: "Frequency",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.vendorfrequency,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "paidstatus",
      headerName: "Paid Status",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.paidstatus,
    },
    {
      field: "paidmode",
      headerName: "Paid Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.paidmode,
    },
    {
      field: "paidamount",
      headerName: "Paid Amount",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.paidamount,
    },
    {
      field: "balanceamount",
      headerName: "Balance Amount",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.balanceamount,
    },
    {
      field: "expensetotal",
      headerName: "Expense Total",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.expensetotal,
      //lockPinned: true,
    },
    {
      field: "billstatus",
      headerName: "Bill Status",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.billstatus,
      //lockPinned: true,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("elistexpense") && (
            <Link
              to={`/expense/editexpenselist/${params.data.id}/?pathname=${window.location.pathname}`}
            >
              {" "}
              <Button>
                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dlistexpense") && (
            <Button
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vlistexpense") && (
            <Button
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ilistexpense") && (
            <Button
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
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize) {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${visibleRows > 0
        ? visibleRows * rowHeight + extraSpace
        : scrollbarWidth + extraSpace
        }px`;
    }
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibility((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

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

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

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
      pagename: String("Expense List"),
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

  const gridRefTable = useRef(null);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);

      gridRefTable.current.api.paginationGoToPage(newPage - 1); // AG Grid uses zero-indexed pages
    }
  };

  const selection = {
    mode: "multiRow",
    headerCheckbox: false,
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  const handleColumnMoved = useCallback(
    debounce((event) => {
      if (!event.columnApi) return;

      const currentMoveCount = columnMoveRef.current;
      if (currentMoveCount >= columnMoveLimit) {
        alert(`You can only move ${columnMoveLimit} columns.`);
        return; // Prevent further moves
      }

      // Increment column move count
      columnMoveRef.current = currentMoveCount + 1;

      const visibleColumns = event.columnApi
        .getAllColumns()
        .filter((col) => {
          const colState = event.columnApi
            .getColumnState()
            .find((state) => state.colId === col.colId);
          return colState && !colState.hide;
        })
        .map((col) => col.colId);

      setColumnVisibility((prevVisibility) => {
        const updatedVisibility = { ...prevVisibility };
        Object.keys(updatedVisibility).forEach((colId) => {
          updatedVisibility[colId] = visibleColumns.includes(colId);
        });
        return updatedVisibility;
      });
    }, 300),
    []
  );

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [colId]: !event.visible, // Update visibility based on the event
    }));
  }, []);

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = items?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case "Contains":
            match = itemValue.includes(filterValue);
            break;
          case "Does Not Contain":
            match = !itemValue?.includes(filterValue);
            break;
          case "Equals":
            match = itemValue === filterValue;
            break;
          case "Does Not Equal":
            match = itemValue !== filterValue;
            break;
          case "Begins With":
            match = itemValue.startsWith(filterValue);
            break;
          case "Ends With":
            match = itemValue.endsWith(filterValue);
            break;
          case "Blank":
            match = !itemValue;
            break;
          case "Not Blank":
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === "AND") {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });
    console.log(filtered);
    setItems(filtered); // Update filtered data
    setAdvancedFilter(filters);
    // handleCloseSearchUserShift(); // Close the popover after search
  };

  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data); // Collect filtered row data
        });

        setFilteredRowData(filteredData);
      }
    }
  };

  // Pagination change handler for the grid
  const onPaginationChanged = useCallback(() => {
    if (gridRefTable.current) {
      const gridApi = gridRefTable.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1; // Current page (1-indexed)
      console.log(currentPage, "onPaginationChanged");
      console.log(
        gridApi.paginationGetTotalPages(),
        "total pages onpagination"
      );
      setPage(currentPage); // Update current page state
    }
  }, [gridRefTable]);

  // Get visible page numbers for pagination UI
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = Math.min(totalPages, 3);

    const startPage = Math.max(1, page - 1); // Start 1 page before the current page
    const endPage = Math.min(totalPages, startPage + visiblePages - 1); // Show 3 pages at max

    // Loop through and add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible page, show ellipsis
    if (endPage < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  const [gridApi, setGridApi] = useState(null);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const columnMoveRef = useRef(0);
  const columnMoveLimit = 3;

  const defaultColDef = useMemo(() => {
    return {
      // filter: 'agTextColumnFilter',
      // floatingFilter: true,
      filter: true,
      flex: 1,
      minWidth: 90,
      resizable: true,
      sortable: true,
    };
  }, []);

  useEffect(() => {
    const pinnedLeft = document.querySelector(".ag-pinned-left");
    const bodyViewport = document.querySelector(".ag-body-viewport");

    if (pinnedLeft && bodyViewport) {
      // Sync horizontal scroll between pinned and body viewports
      pinnedLeft.addEventListener("scroll", () => {
        bodyViewport.scrollLeft = pinnedLeft.scrollLeft;
      });

      bodyViewport.addEventListener("scroll", () => {
        pinnedLeft.scrollLeft = bodyViewport.scrollLeft;
      });
    }

    // Clean up the event listeners
    return () => {
      if (pinnedLeft && bodyViewport) {
        pinnedLeft.removeEventListener("scroll", () => { });
        bodyViewport.removeEventListener("scroll", () => { });
      }
    };
  }, []);

  // Undo filter funtion




  return (
    <Box>
      <Headtitle title={"LIST EXPENSES"} />
      <PageHeading
        title="List Expenses"
        modulename="Expenses"
        submodulename="List Expense"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <br />

      <>
        {/* ****** Table Start ****** */}
        {isUserRoleCompare?.includes("llistexpense") && (
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
                          isUserRoleCompare?.includes(
                            "lassignexpenseothers"
                          ) && {
                            label: "Others",
                            value: "Others",
                          },
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
        {isUserRoleCompare?.includes("llistexpense") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    List Expenses
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {isUserRoleCompare?.includes("aaddexpense") && (
                    <>
                      <Link
                        to={`/expense/addexpanse`}
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
              <br />
              <Grid item xs={8}></Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
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
                    {isUserRoleCompare?.includes("excellistexpense") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            setFormat("xl");
                            // exportallData();
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvlistexpense") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            setFormat("csv");
                            // exportallData();
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printlistexpense") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdflistexpense") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            // exportallData();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagelistexpense") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
                        </Button>
                      </>
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
              <br />
              <Button
                sx={userStyle.buttongrp}
                onClick={() => {
                  handleShowAllColumns();
                  setColumnVisibility(initialColumnVisibility);
                }}
              >
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &emsp;
              {isUserRoleCompare?.includes("bdlistexpense") && (
                <Button
                  variant="contained"
                  color="error"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
              {!espenseCheck ? (
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
                        fetchExpenses(filterClicked);
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
          maxWidth="md"
          fullWidth={true}
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Expense List
              </Typography>
              <br /> <br />
              <Grid container spacing={4}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Reference No</Typography>
                    <Typography>{projEdit.referenceno}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Company</Typography>
                    <Typography>{projEdit.company}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Branch</Typography>
                    <Typography>{projEdit.branch}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Unit</Typography>
                    <Typography>{projEdit.unit}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor Grouping</Typography>
                    <Typography>{projEdit.vendorgrouping}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor Name</Typography>
                    <Typography>{projEdit.vendorname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Purpose</Typography>
                    <Typography>{projEdit.purpose}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Expense Category</Typography>
                    <Typography>{projEdit.expansecategory}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Expense Sub Category</Typography>
                    <Typography>{projEdit.expansesubcategory}</Typography>
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Total Bill Amount</Typography>
                    <Typography>{projEdit.totalbillamount}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Frequency</Typography>
                    <Typography>{projEdit.vendorfrequency}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Date</Typography>
                    <Typography>
                      {moment(projEdit.date)?.format("DD-MM-YYYY")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Paid Status</Typography>
                    <Typography>{projEdit.paidstatus}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Paid Mode</Typography>
                    <Typography>{projEdit.paidmode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Paid Amount</Typography>
                    <Typography>{projEdit.paidamount}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Balance Amount</Typography>
                    <Typography>{projEdit.balanceamount}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Expense Total</Typography>
                    <Typography>{projEdit.expensetotal}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Bill Status</Typography>
                    <Typography>{projEdit.billstatus}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12} sx={{ marginTop: "20px" }}>
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
                              onClick={() => {
                                if (file.preview) {
                                  renderFilePreview(file)
                                } else {
                                  renderFilePreviewMulter(file)
                                }
                              }
                              }
                            />
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
                {projEdit.paidmode === "Cash" && (
                  <>
                    <br />
                    <br />
                    <br />

                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Cash</Typography>
                        <Typography>Cash</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <br />
                <br />
                {projEdit.paidmode === "Bank Transfer" && (
                  <>
                    <br />
                    <br />

                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Bank Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Bank Name</Typography>
                        <Typography>{projEdit.bankname}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Bank Branch Name</Typography>
                        <Typography>{projEdit.bankbranchname}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          Account Holder Name
                        </Typography>
                        <Typography>{projEdit.accountholdername}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Account Number</Typography>
                        <Typography>{projEdit.accountnumber}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">IFSC Code</Typography>
                        <Typography>{projEdit.ifsccode}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <br /> <br />
                {projEdit.paidmode === "UPI" && (
                  <>
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">UPI Number</Typography>
                        <Typography>{projEdit.upinumber}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <br /> <br />
                {projEdit.paidmode === "Card" && (
                  <>
                    <Grid md={12} item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Card Details
                      </Typography>
                    </Grid>

                    <br />
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Card Number</Typography>
                        <Typography>{projEdit.cardnumber}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Card Holder Name</Typography>
                        <Typography>{projEdit.cardholdername}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          Card Transaction Number
                        </Typography>
                        <Typography>
                          {projEdit.cardtransactionnumber}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Card Type</Typography>
                        <Typography>{projEdit.cardtype}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <Typography variant="h6">Expire At</Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {projEdit.cardmonth}/{projEdit.cardyear}
                            </Typography>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Security Code</Typography>
                        <Typography>{projEdit.cardsecuritycode}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <br />
                <br />
                {projEdit.paidmode === "Cheque" && (
                  <>
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>

                    <br />

                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Cheque Number</Typography>
                        <Typography>{projEdit.chequenumber}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseview}
                  sx={buttonStyles.btncancel}
                >
                  Back
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </>

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
        // filteredDataTwo={rowDataTable ?? []}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={totalProjectsData ?? []}
        filename={"Expense"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Expense List Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleQueue}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delVendorcheckbox}
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
export default ExpenseList;