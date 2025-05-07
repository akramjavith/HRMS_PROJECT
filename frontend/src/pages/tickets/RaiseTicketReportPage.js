import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, RadioGroup, Radio, FormControlLabel, Checkbox, InputAdornment, ListItemText, Tooltip, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../components/Pagination';
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function RaiseTicketReport() {
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [advancedFilter, setAdvancedFilter] = useState(null);
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

  let exportColumnNames = ['Raised By',
    'Employee Code',
    'Ticket Number',
    'Raise Date',
    'Raise Time ',
    'Status ',
    'Closed By '];
  let exportRowValues = [
    'employeename',
    'employeecode',
    'raiseticketcount',
    'date',
    'time',
    'raiseself',
    'ticketclosed'
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
      pagename: String("Ticket/Raise Ticket/Reports/Consolidated Ticket Report"),
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


  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, allTeam, isAssignBranch, allUsersData, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);


  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchaddress: data?.branchaddress,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = []; if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
        } const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];

        return fetfinalurl?.some((item) => remove?.includes(item));

      })



  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [btnSubmit, setBtnSubmit] = useState(false);



  const [categorys, setCategorys] = useState([]);
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);
  let [valueEmployee, setValueEmployee] = useState([]);
  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState([]);
  //subcategory multiselect
  const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);
  let [valueSubCat, setValueSubCat] = useState([]);
  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
  const [selectedOptionsSubSubCat, setSelectedOptionsSubSubCat] = useState([]);
  let [valueSubSubCat, setValueSubSubCat] = useState([]);
  const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState(
    []
  );
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [filteredSubSubCategoryOptions, setFilteredSubSubCategoryOptions] =
    useState([]);
  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    // fetchBranchAll(options)
  };

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    // fetchUnitAll(options)
  };

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    // fetchTeamAll(options)
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };


  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options)
    setValueEmployee(
      options.map((a, index) => {
        return a.value;
      })
    );
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat?.length
      ? valueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };


  const handleSubCategoryChange = (options) => {
    setValueSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCat(options);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
  };

  const customValueRendererSubCat = (valueSubCat, _categoryname) => {
    return valueSubCat?.length
      ? valueSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const handleSubSubCategoryChange = (options) => {
    setValueSubSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubSubCat(options);
  };

  const customValueRendererSubSubCat = (valueSubSubCat, _categoryname) => {
    return valueSubSubCat?.length
      ? valueSubSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };
  const fetchSubsubcomponent = async () => {
    setPageName(!pageName);
    try {

      let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubSubCategoryOptions(res_vendor?.data?.subsubcomponents);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchCategoryBased = async () => {
    setPageName(!pageName);
    try {

      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions(res_category.data.ticketcategory);
      let data_set = res_category.data.ticketcategory
        .filter((data) => {
          return valueCat.includes(data.categoryname);
        })
        .map((data) => data.subcategoryname);

      let ans = [].concat(...data_set);
      setSubcategorys(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchCategoryTicket = async () => {
    setPageName(!pageName);
    try {

      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.ticketcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);
    const filteredCategoryOptions = subSubCategoryOptions
      ?.filter(
        (u) =>
          u.categoryname.some((data) => catopt.includes(data)) &&
          u.subcategoryname.some((data) => subcatopt.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptions(filteredCategoryOptions);
  }, [valueCat, valueSubCat]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => valueCat?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptions(subcategoryNames);
  }, [valueCat]);




  useEffect(() => {
    fetchSubsubcomponent();
    fetchCategoryTicket();
    fetchCategoryBased();
  }, [])







  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [capturedImages, setCapturedImages] = useState([]);
  const [refImage, setRefImage] = useState([]);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };






  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  //get all project.
  const fetchAllRaisedTickets = async (e) => {
    setPageName(!pageName);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      company: e === 'Cleared' ? [] : valueCompanyCat,
      unit: e === 'Cleared' ? [] : valueUnitCat,
      branch: e === 'Cleared' ? [] : valueBranchCat,
      team: e === 'Cleared' ? [] : valueTeamCat,
      employeename: e === 'Cleared' ? [] : valueEmployee,
      category: e === 'Cleared' ? [] : valueCat,
      subcategory: e === 'Cleared' ? [] : valueSubCat,
      subsubcategory: e === 'Cleared' ? [] : valueSubSubCat,
      username: isUserRoleAccess.companyname,
      role:true,

    };

    const selctedNameColumn = selectedColumn === "status" ? "raiseself" :
     (selectedColumn === "date") ? "raiseddate" : selectedColumn
     const allFilters = [
      ...additionalFilters,
      { column: selectedColumn === "status" ? "raiseself" :
         selectedColumn === "reason" ? "textAreaCloseDetails" :
         selectedColumn, condition: selectedCondition, value: filterValue}
  ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    try {


      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT,queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // company: from === "clear" ? [] : valueCompanyCat,
        // unit: from === "clear" ? [] : valueUnitCat,
        // branch: from === "clear" ? [] : valueBranchCat,
        // team: from === "clear" ? [] : valueTeamCat,
        // employeename: from === "clear" ? [] : valueEmployee,
        // category: from === "clear" ? [] : valueCat,
        // subcategory: from === "clear" ? [] : valueSubCat,
        // subsubcategory: from === "clear" ? [] : valueSubSubCat,
        // username: from === "clear" ? [] : isUserRoleAccess.companyname,
        // role: true,
        // page: page,
        // pageSize: pageSize

      });

      const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : [];
      const overallList = res_task?.data?.overallList?.length > 0 ? res_task?.data?.overallList : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        raiseticketcount: item.raiseticketcount,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      const overallListDatas = overallList?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        raiseticketcount: item.raiseticketcount,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      setRaiseTicketList(itemsWithSerialNumber);
      setItemsList(overallListDatas)
      setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setBtnSubmit(false)
      setQueueCheck(true);
    } catch (err) { setQueueCheck(true); setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  

  const handleResetSearch = async (from) => {

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
      company: from === "clear" ? [] : valueCompanyCat,
        unit: from === "clear" ? [] : valueUnitCat,
        branch: from === "clear" ? [] : valueBranchCat,
        team: from === "clear" ? [] : valueTeamCat,
        employeename: from === "clear" ? [] : valueEmployee,
        category: from === "clear" ? [] : valueCat,
        subcategory: from === "clear" ? [] : valueSubCat,
        subsubcategory: from === "clear" ? [] : valueSubSubCat,
        username: from === "clear" ? [] : isUserRoleAccess.companyname,
        role: true,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }
    try {
      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
     const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : [];
      const overallList = res_task?.data?.overallList?.length > 0 ? res_task?.data?.overallList : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        raiseticketcount: item.raiseticketcount,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      const overallListDatas = overallList?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        raiseticketcount: item.raiseticketcount,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      setRaiseTicketList(itemsWithSerialNumber);
      setItemsList(overallListDatas)
      setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setBtnSubmit(false)
      setQueueCheck(true);
      // Trigger a table refresh if necessary
      setPageName((prev) => !prev); // Force re-render
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  };
  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

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

  const addSerialNumber = (data) => {
    setItems(data);
  };

  useEffect(() => {
    addSerialNumber(raiseTicketList);
  }, [raiseTicketList]);




  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (
      valueCompanyCat?.length < 1
    ) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setBtnSubmit(true)
      fetchAllRaisedTickets("submit");
    }
  };

  const handleClear = async () => {

    await fetchAllRaisedTickets("Cleared");
    setBtnSubmit(false)
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsUnit([])
    setSelectedOptionsTeam([])
    setSelectedEmployeeFrom([])
    setValueCompanyCat([])
    setValueUnitCat([])
    setValueBranchCat([])
    setValueTeamCat([])
    setValueCat([])
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);
    setValueSubCat([])
    setValueSubSubCat([])
    setSelectedOptionsCat([])
    setSelectedOptionsSubCat([])
    setSelectedOptionsSubSubCat([])
    setValueEmployee([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();


  };

  useEffect(() => {
    fetchAllRaisedTickets("fetching");
  }, [page, pageSize , searchQuery]);

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles.concat(refImage, refImageDrag, capturedImages);

  // Create an empty object to keep track of unique values
  let uniqueValues = {};

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    employeename: true,
    employeecode: true,
    date: true,
    time: true,
    raiseself: true,
    raiseticketcount: true,
    ticketclosed: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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
      headerName: "S.No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
    },

    {
      field: "employeename",
      headerName: "Raised By",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeename,
    },
    {
      field: "employeecode",
      headerName: "Employee Code",
      flex: 0,
      width: 300,
      hide: !columnVisibility.employeecode,
    },
    {
      field: "raiseticketcount",
      headerName: "Ticket Number",
      flex: 0,
      width: 200,
      hide: !columnVisibility.raiseticketcount,
    },
    {
      field: "date",
      headerName: "Raise Date",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "time",
      headerName: "Raise Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
    },
    {
      field: "raiseself",
      headerName: "Status",
      flex: 0,
      width: 180,
      hide: !columnVisibility.raiseself,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography sx={{
              color: params.data.raiseself === "Open" ? "red" :
                params.data.raiseself === "Resolved" ? "green" :
                  params.data.raiseself === "Details Needed" ? "blue" :
                    params.data.raiseself === "Closed" ? 'Orange' :
                      params.data.raiseself === "Forwarded" ? "palevioletred" :
                        params.data.raiseself === "Reject" ? "darkmagenta" : 'violet'
            }}>{params.data.raiseself}</Typography>                </Grid>

        </Grid>

      ),
    },
    {
      field: "ticketclosed",
      headerName: "Closed By",
      flex: 0,
      width: 180,
      hide: !columnVisibility.ticketclosed,
    },

  ];
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = raiseTicketList?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });


  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);



  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeename: item.employeename,
      employeecode: (item.employeecode),
      raiseticketcount: (item.raiseticketcount),
      date: item?.date,
      time: item?.time,
      raiseself: item.raiseself,
      ticketclosed: item.ticketclosed,
    };
  });

  // Excel
  const fileName = "RaiseTicketReport";
  let snos = 1;


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RaiseTicketReport",
    pageStyle: "print",
  });


  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Consolidated Ticket Report.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

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

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [copiedData, setCopiedData] = useState("");

  return (
    <Box>
      <Headtitle title={"RAISE TICKET REPORT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Consolidated Raise Ticket Reports"
        modulename="Tickets"
        submodulename="Raise Ticket"
        mainpagename="Reports"
        subpagename="Consolidated Ticket Report"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lconsolidatedticketreport") && (
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.HeaderText}>
            Raise Ticket Reports
          </Typography>
          <Grid container spacing={2}>
            <>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
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
                      setSelectedOptionsBranch([]);
                      setValueBranchCat([]);
                      setValueUnitCat([]);
                      setValueTeamCat([]);
                      setSelectedOptionsUnit([]);
                      setSelectedOptionsTeam([]);
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch
                  </Typography>
                  <MultiSelect
                    options={accessbranch
                      ?.filter((comp) => {
                        let datas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        return datas?.includes(comp.company);
                      })
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
                    value={selectedOptionsBranch}
                    onChange={(e) => {
                      handleBranchChange(e);
                      setSelectedOptionsTeam([]);
                      setSelectedOptionsUnit([]);
                      setValueUnitCat([]);
                      setValueTeamCat([]);
                    }}
                    valueRenderer={customValueRendererBranch}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit
                  </Typography>
                  <MultiSelect
                    options={accessbranch
                      ?.filter((comp) => {
                        let compdatas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        let branchdatas = selectedOptionsBranch?.map(
                          (item) => item?.value
                        );
                        return (
                          compdatas?.includes(comp.company) &&
                          branchdatas?.includes(comp.branch)
                        );
                      })
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
                    value={selectedOptionsUnit}
                    onChange={(e) => {
                      handleUnitChange(e);
                      setValueTeamCat([]);
                      setSelectedOptionsTeam([]);
                    }}
                    valueRenderer={customValueRendererUnit}
                    labelledBy="Please Select Unit"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team
                  </Typography>
                  <MultiSelect
                    options={allTeam
                      ?.filter((comp) => {
                        let compdatas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        let branchdatas = selectedOptionsBranch?.map(
                          (item) => item?.value
                        );
                        let unitdatas = selectedOptionsUnit?.map(
                          (item) => item?.value
                        );
                        return (
                          compdatas?.includes(comp.company) &&
                          branchdatas?.includes(comp.branch) &&
                          unitdatas?.includes(comp.unit)
                        );
                      })
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
                    value={selectedOptionsTeam}
                    onChange={(e) => {
                      handleTeamChange(e);
                    }}
                    valueRenderer={customValueRendererTeam}
                    labelledBy="Please Select Team"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Employee Name
                  </Typography>
                  <MultiSelect
                    options={allUsersData
                      ?.filter(
                        (comp) =>
                          valueCompanyCat?.includes(comp.company) &&
                          valueBranchCat?.includes(comp.branch) &&
                          valueUnitCat?.includes(comp.unit) &&
                          valueTeamCat?.includes(comp.team)
                      )
                      ?.map((com) => ({
                        ...com,
                        label: com.companyname,
                        value: com.companyname,
                      }))}
                    value={selectedEmployeeFrom}
                    onChange={handleEmployeeChangeFrom}
                    valueRenderer={customValueRendererEmployeeFrom}
                    labelledBy="Please Select Employeename"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category
                  </Typography>
                  <MultiSelect
                    options={categorys}
                    value={selectedOptionsCat}
                    onChange={(e) => {
                      handleCategoryChange(e);
                    }}
                    valueRenderer={customValueRendererCat}
                    labelledBy="Please Select Category"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category
                  </Typography>
                  <MultiSelect
                    options={filteredSubCategoryOptions}
                    value={selectedOptionsSubCat}
                    onChange={(e) => {
                      handleSubCategoryChange(e);
                    }}
                    valueRenderer={customValueRendererSubCat}
                    labelledBy="Please Select Sub Category"
                  />
                </FormControl>
              </Grid>
              {filteredSubSubCategoryOptions?.length != 0 && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Sub Category
                    </Typography>
                    <MultiSelect
                      options={filteredSubSubCategoryOptions}
                      value={selectedOptionsSubSubCat}
                      onChange={(e) => {
                        handleSubSubCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererSubSubCat}
                      labelledBy="Please Select Sub Sub Category"
                    />
                  </FormControl>
                </Grid>
              )}
            </>

          </Grid> <br></br>
          <Grid container spacing={2}>
            <Grid item md={2} xs={12} sm={12}>
              <LoadingButton variant="contained" sx={buttonStyles.buttonsubmit} loading={btnSubmit} onClick={handleSubmitFilter}>Filter</LoadingButton>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
            </Grid>
          </Grid>
        </Box>
      )}
      <br></br>


      {isUserRoleCompare?.includes("lconsolidatedticketreport") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Raise Ticket Report</Typography>
              </Grid>

            </Grid>
            <br></br><br></br><br></br>

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
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
                  <MenuItem value={itemsList.length}>All</MenuItem>
                </Select>
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
                {isUserRoleCompare?.includes("excelconsolidatedticketreport") && (

                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvconsolidatedticketreport") && (


                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                  </>
                )}
                {isUserRoleCompare?.includes("printconsolidatedticketreport") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfconsolidatedticketreport") && (

                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                      }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageconsolidatedticketreport") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Grid>

              {/* <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={raiseTicketList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={true}
                  totalDatas={itemsList}
                />
              </Grid> */}
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
            &emsp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>{" "}
            &emsp;
            <br />
            <br />

            {!queueCheck ? (
              <Box sx={userStyle.container}>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </Box>
            ) : (
              <>
                {/* ****** Table start ****** */}
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
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
                    filteredDatas={filteredDatas}
                    totalDatas={totalProjects}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={itemsList}
                  />
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>

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

        </>
      )}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
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
        itemsTwo={itemsList ?? []}
        filename={"Consolidated Ticket Report"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

            {/* Search Bar */}
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
                      fetchAllRaisedTickets();
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
      <br />
      <br />
    </Box>
  );
}

export default RaiseTicketReport;