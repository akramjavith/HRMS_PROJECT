import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  Dialog,
  FormControl,
  InputAdornment,
  Tooltip,
  Radio, RadioGroup,
  OutlinedInput,
  FormControlLabel
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash, FaSearch } from "react-icons/fa";
import Resizable from "react-resizable";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { handleApiError } from "../../../components/Errorhandling";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import Noticeperiod from "./rechecklist";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";

import domtoimage from 'dom-to-image';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function Noticeperiodlist() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...!");
  const [employees, setEmployees] = useState([]);
  const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);
  const [noticePeriodEdit, setNoticeperiodEdit] = useState({
    empcode: "",
    empname: "",
    name: "",
    reasonleavingname: "Please Select Reason",
    other: "",
  });

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
      pagename: String("Notice Period Status"),
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


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);
  const [file, setFile] = useState("");

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  let exportColumnNames = [
    'Company', 'Branch',
    'Unit', 'Name',
    'Empcode', 'Team',
    'Department', 'Date',
    'Reason', 'Status',
    'Release Date'
  ];
  let exportRowValues = [
    'company',
    'branch',
    'unit',
    'empname',
    'empcode',
    'team',
    'department',
    'noticedate',
    'reasonleavingname',
    'status',
    'approvenoticereq'
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")

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

  const [selectedRows, setSelectedRows] = useState([]);

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };




  const open = Boolean(anchorEl);
  const idr = open ? "simple-popover" : undefined;

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [empaddform, setEmpaddform] = useState({
    branch: "",
    floor: "",
    department: "",
    company: "",
    unit: "",
    team: "",
    designation: "",
    shifttiming: "",
    reportingto: "",
  });
  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.name;
  const id = useParams().id;

  const gridRef = useRef(null);

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Notice Period Applied List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // Show all columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    empname: true,
    empcode: true,
    team: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    files: true,
    status: true,
    rejectStatus: true,
    approvenoticereq: true,
    meetingremarks: true,
    meetingcompleted: true,
    actionsnew: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getRowClassNameAll = (params) => {
    const itemTat = params.row.status || "";
    return "custom-others-row";
    // }
  };

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);

  //20.11.2024-------------------------------------------------------------------------------------------------------------------
  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

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

  useEffect(() => {
    fetchChecklisttype();
  }, [page, pageSize, searchQuery])



  const fetchChecklisttype = async () => {
    setPageName(!pageName)
    // setLoading(true);
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
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'all';


    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []
      

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No',
        status:
          item.status === "Exited" ? item.status :
            item.approvedStatus === "true" &&
              item.cancelstatus === false &&
              item.continuestatus === false
              ? "Approved"
              : item.approvedStatus === "true" && item.cancelstatus === true
                ? "Canceled"
                : item.approvedStatus === "true" && item.continuestatus === true
                  ? "Continue"
                  : item.rejectStatus === "true"
                    ? "Reject"
                    : item.recheckStatus === "true"
                      ? "Recheck"
                      : item.status,

        rejectStatus: item.rejectStatus === "true" ? item.rejectnoticereq : "---"
      }));


      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setEmployees(itemsWithSerialNumber);
      setLoading(false);


    } catch (err) {
      console.log(err)
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }


  const handleResetSearch = async () => {
    setPageName(!pageName)


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
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'all';



    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No',
        status:
          item.status === "Exited" ? item.status :
            item.approvedStatus === "true" &&
              item.cancelstatus === false &&
              item.continuestatus === false
              ? "Approved"
              : item.approvedStatus === "true" && item.cancelstatus === true
                ? "Canceled"
                : item.approvedStatus === "true" && item.continuestatus === true
                  ? "Continue"
                  : item.rejectStatus === "true"
                    ? "Reject"
                    : item.recheckStatus === "true"
                      ? "Recheck"
                      : item.status,

        rejectStatus: item.rejectStatus === "true" ? item.rejectnoticereq : "---"
      }));


      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setEmployees(itemsWithSerialNumber);
      setLoading(false);

    } catch (err) {
      // setChecklisttypecheck(true);
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }

  //get all employees list details
  const fetchNoticeperiodlist = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        !isUserRoleAccess.role.includes("Manager") &&
          !isUserRoleAccess.role.includes("HiringManager") &&
          !isUserRoleAccess.role.includes("HR")
          ? res?.data?.noticeperiodapply.filter(
            (data) => data.empname === isUserRoleAccess.companyname
          )
          : res?.data?.noticeperiodapply;
      setOverallItems(answer.map((item) => ({
        ...item, noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        status:
          item.status === "Exited" ? item.status :
            item.approvedStatus === "true" &&
              item.cancelstatus === false &&
              item.continuestatus === false
              ? "Approved"
              : item.approvedStatus === "true" && item.cancelstatus === true
                ? "Canceled"
                : item.approvedStatus === "true" && item.continuestatus === true
                  ? "Continue"
                  : item.rejectStatus === "true"
                    ? "Reject"
                    : item.recheckStatus === "true"
                      ? "Recheck"
                      : item.status,

        rejectStatus: item.rejectStatus === "true" ? item.rejectnoticereq : "---"
      })));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [employeesFilterArray, setEmployeesFilterArray] = useState([])

  const fetchNoticeperiodlistArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeesFilterArray(res?.data?.noticeperiodapply);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchNoticeperiodlistArray()
    fetchNoticeperiodlist();
  }, [isFilterOpen])

  //id for login...;
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //get single row to edit....
  const fileData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreview(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setFile(res?.data?.snoticeperiodapply.files[0]);
      setFile(res?.data?.snoticeperiodapply.files);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //  PDF
  const columns = [
    // { title: "Sno", field: "sno" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Date", field: "noticedate" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Release Date", field: "approvenoticereq" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,

      })) :
      employeesFilterArray.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,
        noticedate: row.noticedate === "undefined" ? "" : moment(row.noticedate).format("DD/MM/YYYY"),
        approvenoticereq: moment(row.approvenoticereq).format("DD-MM-YYYY")
      }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Apply List.pdf");
  };


  // Excel
  const fileName = "Apply List";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      var data = employees.map((t) => ({
        Sno: excelno++,
        Branch: t.branch,
        Company: t.company,
        unit: t.unit,
        Name: t.empname,
        Empcode: t.empcode,
        Team: t.team,
        Department: t.department,
        date: t.noticedate,
        Reason: t.reasonleavingname,
        Document: t.files,
        Status: t.status,
        Releasedate: t.approvenoticereq,
      }));
      setexceldata(data);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Notice Period Applied List",
    pageStyle: "print",
  });


  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);

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



  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );



  const [openview, setOpenview] = useState(false);

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const getviewCodeNew = async (e) => {
    setPageName(!pageName);
    setLoading(true);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiodEdit(res?.data?.snoticeperiodapply);
      handleClickOpenview();
      setLoading(false);
    } catch (err) { 
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Table start colum and row
  // Define columns for the DataGrid
  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      pinned: 'left',
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      pinned: 'left',
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      pinned: 'left',
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empname,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noticedate,
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reasonleavingname,
    },

    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibility.actions,
      cellRenderer: (params) => {
        if (!params?.row?.hrupload) {
          return (
            <Grid sx={{ display: "flex", gap: '10px' }}>
              <Button
                onClick={() => {
                  fileData(params.data.id);
                }}
                variant="contained"
                sx={{
                  fontSize: "10px",
                  width: "90px",
                  backgroundColor: "#9b2105"
                }}
              >
                View
              </Button>
              <Button
                sx={{
                  fontSize: "10px",
                  width: "90px",
                  backgroundColor: "#013e2d"
                }}
                variant="contained"
                onClick={() => {
                  fileDataDownload(params.data.id);
                }}
                download={file.name}
              >
                Download
              </Button>
            </Grid>
          )
        }
        return null;
      }
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      cellRenderer: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.data.status === "Approved"
                ? "green"
                : params.data.status === "Reject"
                  ? "red"
                  : params.data.status === "Recheck"
                    ? "blue"
                    : params.data.status === "Applied"
                      ? "yellow"
                      : params.data.status === "Canceled"
                        ? "#037084" : params.data.status === "Exited"
                          ? "#852f04" : "#85030c",
            color: params.data.status === "Applied" ? "black" : "white",
            // color: params.value === "Approved" ? "black" : params.value === "Rejected" ? "white" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.data.status}
        </Button>
      ),

      hide: !columnVisibility.status,
    },
    {
      field: "rejectStatus",
      headerName: "RejectStatus",
      flex: 0,
      width: 200,
      hide: !columnVisibility.rejectStatus,
    },
    {
      field: "approvenoticereq",
      headerName: "Release Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.approvenoticereq,
    },
    {
      field: "meetingcompleted",
      headerName: "Is Meeting Completed",
      flex: 0,
      width: 100,
      hide: !columnVisibility.meetingcompleted,
      headerClassName: "bold-header",
    },

    {
      field: "meetingremarks",
      headerName: "Remarks",
      flex: 0,
      width: 100,
      hide: !columnVisibility.meetingremarks,
      headerClassName: "bold-header",
    },
    {
      field: "actionsnew",
      headerName: "View",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actionsnew,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>

          {isUserRoleCompare?.includes("vnoticeperiodapprove") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeNew(params.data.id);

              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}

        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  // Create a row data object for the DataGrid
  const rowDataTable = items.map((notice, index) => {

    return {
      ...notice,
      id: notice._id,
      serialNumber: notice.serialNumber,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      noticedate: notice.noticedate,
      reasonleavingname: notice.reasonleavingname,
      files: notice.files,
      status: notice.status
      ,
      rejectStatus: notice.rejectStatus,
      releasedate: notice.releasedate,
      approvenoticereq: notice.approvenoticereq,
      meetingcompleted: notice.meetingcompleted ? 'Yes' : 'No',
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
              // secondary={column.headerName }
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

  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          "Sno": index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: t.noticedate,
          Reason: t.reasonleavingname,
          status: t.status
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeesFilterArray.map((t, index) => ({
          "Sno": index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: t.noticedate === "undefined" ? "" : moment(t.noticedate).format("DD/MM/YYYY"),
          Reason: t.reasonleavingname,
          status:
            t.approvedStatus === "true"
              ? "Approved"
              : t.rejectStatus === "true"
                ? "Reject"
                : t.recheckStatus === "true"
                  ? "Recheck"
                  : t.status,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  return (
    <Box>
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Notice Period Status"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Notice Period"
        subsubpagename="Notice Period Status"
      />
      <br />
      {isUserRoleCompare?.includes("lnoticeperiodstatus") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Apply List</Typography>
              </Grid>
            </Grid>

            {/* added to the pagination grid */}
            <Grid style={{ ...userStyle.dataTablestyle, display: 'flex', justifyContent: 'space-between' }}>
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
                  <MenuItem value={employees.length}>All</MenuItem>
                </Select>
              </Box>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("csvnoticeperiodstatus") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchNoticeperiodlistArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("excelnoticeperiodstatus") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchNoticeperiodlistArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printnoticeperiodstatus") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfnoticeperiodstatus") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchNoticeperiodlistArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagenoticeperiodstatus") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Grid>
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
            {/* ****** Table Grid Container ****** */}
            <Grid container>
              <Grid md={4} sm={2} xs={1}></Grid>
              <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
            </Grid>
            <br />
            {/* ****** Table start ****** */}
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            {/* {isLoader ? ( */}
            <br />
            <br />
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
                gridRefTable={gridRef}
                paginated={false}
                filteredDatas={filteredDatas}
                handleShowAllColumns={handleShowAllColumns}
                setFilteredRowData={setFilteredRowData}
                filteredRowData={filteredRowData}
                setFilteredChanges={setFilteredChanges}
                filteredChanges={filteredChanges}
                gridRefTableImg={gridRefTableImg}
                itemsList={overallItems}
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
                gridRefTable={gridRef}


                totalDatas={totalDatas}

                setFilteredRowData={setFilteredRowData}
                filteredRowData={filteredRowData}

                gridRefTableImg={gridRefTableImg}
                itemsList={overallItems}
              />
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
                              fetchChecklisttype();
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
              <br /> <br />
            </>
          </Box>
          <br />
          <Box sx={userStyle.container}>
            <Noticeperiod />
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      <Popover
        id={idr}
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
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Document</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Releasedate</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell>{row.empname}</StyledTableCell>
                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.noticedate}</StyledTableCell>
                  <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                  <StyledTableCell>{row.files}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>{row.rejectStatus}</StyledTableCell>
                  <StyledTableCell>{row.releasedate}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={overallItems ?? []}
        filename={"Notice Period Applied List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

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
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ width: "750px", padding: "20px 70px", }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Notice Period Apply
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Employee Name</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.empname}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Employee Code</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.empcode}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Apply Date</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.noticedate === "undefined" ? "" : moment(noticePeriodEdit.noticedate).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Reason of Leaving</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.reasonleavingname}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Request Details</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.other}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Is Meeting Completed</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.meetingcompleted ? 'Yes' : 'No'}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Remarks</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.meetingremarks}
                  </Typography>
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
      <Loader loading={loading} message={loadingMessage} />
    </Box>

    //    another table
  );
}

export default Noticeperiodlist;
