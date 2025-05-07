import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
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

function EBReadingAnalysisreviewList() {
  const [selectedMode, setSelectedMode] = useState("Today");

  const mode = [
    { label: "Today", value: "Today" },
    { label: "Tomorrow", value: "Tomorrow" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Custom", value: "Custom" }

  ]

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  const [ebreadingdetails, setEbreadingdetails] = useState([]);

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
    "Status",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Service",
    "Reading Mode",
    "Allowe Unit",
    "Kwh",
    "kvah",
    "Kwhunit",
    "kvahunit",
    "P.F R phase",
    "P.F Y phase",
    "P.F B phase",
    "P.F Current",
    "P.F Average",
    "PF",
    "M.D R Phase",
    "M.D Y Phase",
    "M.D B Phase",
    "M.D Current",
    "M.D Average",
    "MD",
  ];
  let exportRowValues = [
    "date",
    "time",
    "currentstatus",
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "servicenumber",
    "readingmode",
    "usageunit",
    "openkwh",
    "kvah",
    "kwhunit",
    "kvahunit",
    "pfrphase",
    "pfyphase",
    "pfbphase",
    "pfcurrent",
    "pfaverage",
    "pf",
    "mdrphase",
    "mdyphase",
    "mdbphase",
    "mdcurrent",
    "mdaverage",
    "md",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };



  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
  const [selectedServiceFrom, setSelectedServiceFrom] = useState([]);
  const [selectedFloorFrom, setSelectedFloorFrom] = useState([]);
  const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);


  //branch multiselect dropdown changes
  const handleCompanyChangeFrom = (options) => {
    setSelectedCompanyFrom(options);
    setSelectedBranchFrom([]);
    setSelectedUnitFrom([]);
    setSelectedServiceFrom([])
    setSelectedFloorFrom([]);
    setserviceNumber([])
    setFloors([])
    setserviceNumber([])
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };



  //branch multiselect dropdown changes
  const handleBranchChangeFrom = (options) => {
    setSelectedBranchFrom(options);
    setSelectedUnitFrom([]);
    setSelectedServiceFrom([])
    setSelectedFloorFrom([]);
    setFloors([])
    fetchServiceNumberFilter(options);
  };
  const customValueRendererBranchFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //branch multiselect dropdown changes
  const handleServiceChangeFrom = (options) => {
    setSelectedServiceFrom(options);
    setSelectedFloorFrom([]);
    fetchFloorFilter(options)
  };
  const customValueRendererServiceFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Service Number";
  };

  //branch multiselect dropdown changes
  const handleFloorChangeFrom = (options) => {
    setSelectedFloorFrom(options);
  };
  const customValueRendererFloorFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Floor";
  };


  //branch multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedUnitFrom(options);
  };
  const customValueRendererUnitFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Floor";
  };




  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [serviceNumberFilter, setserviceNumberFilter] = useState([]);
  const [ebreadingdetailFilter, setEbreadingdetailFilter] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    floor: "Please Select Floor",
    unit: "Please Select Unit",
    materialname: "Please Select Material Name",
    servicenumber: "Please Select Service",
    fromdate: formattedDate,
    todate: formattedDate,
  });

  const [serviceNumber, setserviceNumber] = useState([]);
  const [readingmode, setReadingmode] = useState("Daily Closing");
  const [usagevalue, setUsagevalue] = useState("Greater than Allowed Unit");
  const [searchQuery, setSearchQuery] = useState("");
  const [floors, setFloors] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
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

      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));





  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Eb Reading Analysis Review"),
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







  const { auth } = useContext(AuthContext);
  const [ebreadingdetailCheck, setEbreadingdetailcheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "EB Reading Analysis Review .png");
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
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    date: true,
    time: true,
    currentstatus: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    servicenumber: true,
    readingmode: true,
    usageunit: true,
    openkwh: true,
    kvah: true,
    kvahunit: true,
    kwhunit: true,
    currentusageunit: true,
    pfyphase: true,
    pfrphase: true,
    pfbphase: true,
    pfcurrent: true,
    pfaverage: true,
    pf: true,
    mdrphase: true,
    mdyphase: true,
    mdbphase: true,
    mdcurrent: true,
    mdaverage: true,
    md: true,
    status: true,
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

  const fetchServiceNumberFilter = async (e) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      // let data_set = res_freq?.data?.ebservicemasters.filter(
      //   (data) => e.value === data.branch
      // );
      // const branchall = [
      //   ...data_set.map((d) => ({
      //     ...d,
      //     label: d.servicenumber,
      //     value: d.servicenumber,
      //   })),
      // ];
      let data_set = res_freq?.data?.ebservicemasters.filter((data) => e.map(item => item.value).includes(data.branch));
      let final = [...new Set(data_set.map(item => item.servicenumber))]
      const branchall = [
        ...final.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];



      setserviceNumber(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchFloorFilter = async (e) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,

      });


      let data_set = res_freq?.data?.ebservicemasters.filter((data) => e.map(item => item.value).includes(data.servicenumber));

      let final = [...new Set(data_set.map(item => item.floor))]
      const branchall = [
        ...final.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setSelectedFloorFrom(branchall)
      setFloors(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const fetchFilteredDatas = async () => {
    setPageName(!pageName)
    setEbreadingdetailcheck(true);
    const accessmodule = [];

    isAssignBranch.map((data) => {
      let fetfinalurl = [];

      if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
        fetfinalurl = data.subpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0) {
        fetfinalurl = data.mainpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      }
      accessmodule.push(fetfinalurl);
    });

    const uniqueValues = [...new Set(accessmodule.flat())];

    if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
      try {
        let subprojectscreate = await axios.post(
          SERVICE.CHECK_EBREADINGDETAILLIST,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: selectedCompanyFrom.map(item => item.value),
            branch: selectedBranchFrom.map(item => item.value),
            unit: selectedUnitFrom.map(item => item.value),
            floor: selectedFloorFrom.map(item => item.value),
            servicenumber: selectedServiceFrom.map(item => item.value),
            readingmode: String(readingmode),
            currentstatus: String(usagevalue),
            fromdate: ebreadingdetailFilter.fromdate,
            todate: ebreadingdetailFilter.todate,
          }
        );

        setEbreadingdetails(subprojectscreate.data.ebreadingdetailsfilter?.map((item, index) => {
          let [year, month, date] = item.date.split("-");
          return {
            ...item,
            id: item._id,
            serialNumber: index + 1,
            date: `${date}/${month}/${year}`,
            company: item.company === "Please Select Company" ? "" : item.company,
            branch: item.branch === "Please Select Branch" ? "" : item.branch,
            unit: item.unit === "Please Select Unit" ? "" : item.unit,
            floor: item.floor === "Please Select Floor" ? "" : item.floor,
            area: item.area === "Please Select Area" ? "" : item.area,
            time: item.time,
            currentstatus: item.currentstatus,
            readingmode: item.readingmode,
            usageunit: item.usageunit,
            openkwh: item.openkwh,
            kvah: item.kvah,
            kvahunit: item.kvahunit,
            kwhunit: item.kwhunit,
            currentusageunit: item.currentusageunit,
            pfyphase: item.pfyphase,
            pfrphase: item.pfrphase,
            pfbphase: item.pfbphase,
            pfcurrent: item.pfcurrent,
            pfaverage: item.pfaverage,
            pf: item.pf,
            mdrphase: item.mdrphase,
            mdyphase: item.mdyphase,
            mdbphase: item.mdbphase,
            mdcurrent: item.mdcurrent,
            mdaverage: item.mdaverage,
            md: item.md,
            status: item.status,
          };
        }));
        setEbreadingdetailcheck(false);
      } catch (err) {
        setEbreadingdetailcheck(false);
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
    else {
      setEbreadingdetailcheck(true)
      setEbreadingdetails([]);
    }
  }

  //submit option for saving
  const handleSubmitFilter = (e) => {

    try {


      setPageName(!pageName)
      e.preventDefault();
      if (ebreadingdetailFilter.fromdate === "") {
        setPopupContentMalert("Please Select From Date!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (ebreadingdetailFilter.todate === "") {
        setPopupContentMalert("Please Select To Date!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (selectedCompanyFrom.length === 0) {
        setPopupContentMalert("Please Select Company!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        fetchFilteredDatas();
      }
    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    setEbreadingdetailFilter({
      company: "Please Select Company",
      branch: "Please Select Branch",
      floor: "Please Select Floor",
      unit: "Please Select Unit",
      servicenumber: "Please Select Service",
      fromdate: formattedDate,
      todate: formattedDate,
    });
    setSelectedMode("Today")
    setSelectedCompanyFrom([])
    setSelectedBranchFrom([])
    setSelectedServiceFrom([])
    setSelectedFloorFrom([])
    setSelectedUnitFrom([])
    setserviceNumber([]);
    setserviceNumber([]);
    setFloors([]);
    setEbreadingdetails([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();

  };


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EB Reading Analysis Review",
    pageStyle: "print",
  });

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
    addSerialNumber(ebreadingdetails);
  }, [ebreadingdetails]);

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
      width: 80,
      hide: !columnVisibility.serialNumber,
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
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "currentstatus",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentstatus,
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
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "servicenumber",
      headerName: "Services",
      flex: 0,
      width: 100,
      hide: !columnVisibility.servicenumber,
      headerClassName: "bold-header",
    },
    {
      field: "readingmode",
      headerName: "Reading Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.readingmode,
      headerClassName: "bold-header",
    },
    {
      field: "usageunit",
      headerName: "Allowed Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.usageunit,
      headerClassName: "bold-header",
    },
    {
      field: "openkwh",
      headerName: "KWH",
      flex: 0,
      width: 100,
      hide: !columnVisibility.openkwh,
      headerClassName: "bold-header",
    },
    {
      field: "kvah",
      headerName: "KVAH",
      flex: 0,
      width: 100,
      hide: !columnVisibility.kvah,
      headerClassName: "bold-header",
    },
    {
      field: "kwhunit",
      headerName: "KWHUNIT",
      flex: 0,
      width: 100,
      hide: !columnVisibility.kwhunit,
      headerClassName: "bold-header",
    },
    {
      field: "kvahunit",
      headerName: "KVAHUNIT",
      flex: 0,
      width: 100,
      hide: !columnVisibility.kvahunit,
      headerClassName: "bold-header",
    },
    {
      field: "currentusageunit",
      headerName: "Remaining Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentusageunit,
      headerClassName: "bold-header",
    },
    {
      field: "pfrphase",
      headerName: "P.F R phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pfrphase,
      headerClassName: "bold-header",
    },
    {
      field: "pfyphase",
      headerName: "P.F Y phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pfyphase,
      headerClassName: "bold-header",
    },
    {
      field: "pfbphase",
      headerName: "P.F B phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pfbphase,
      headerClassName: "bold-header",
    },
    {
      field: "pfcurrent",
      headerName: "P.F Current",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pfcurrent,
      headerClassName: "bold-header",
    },
    {
      field: "pfaverage",
      headerName: "P.F Average",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pfaverage,
      headerClassName: "bold-header",
    },
    {
      field: "pf",
      headerName: "PF",
      flex: 0,
      width: 100,
      hide: !columnVisibility.pf,
      headerClassName: "bold-header",
    },
    {
      field: "mdrphase",
      headerName: "M.D R Phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mdrphase,
      headerClassName: "bold-header",
    },
    {
      field: "mdyphase",
      headerName: "M.D Y Phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mdyphase,
      headerClassName: "bold-header",
    },
    {
      field: "mdbphase",
      headerName: "M.D B Phase",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mdbphase,
      headerClassName: "bold-header",
    },
    {
      field: "mdcurrent",
      headerName: "M.D Current",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mdcurrent,
      headerClassName: "bold-header",
    },
    {
      field: "mdaverage",
      headerName: "M.D Average",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mdaverage,
      headerClassName: "bold-header",
    },
    {
      field: "md",
      headerName: "MD",
      flex: 0,
      width: 100,
      hide: !columnVisibility.md,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      time: item.time,
      date: item?.date,
      currentstatus: item.currentstatus,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      servicenumber: item.servicenumber,
      readingmode: item.readingmode,
      usageunit: item.usageunit,
      openkwh: item.openkwh,
      kvah: item.kvah,
      kvahunit: item.kvahunit,
      kwhunit: item.kwhunit,
      currentusageunit: item.currentusageunit,
      pfyphase: item.pfyphase,
      pfrphase: item.pfrphase,
      pfbphase: item.pfbphase,
      pfcurrent: item.pfcurrent,
      pfaverage: item.pfaverage,
      pf: item.pf,
      mdrphase: item.mdrphase,
      mdyphase: item.mdyphase,
      mdbphase: item.mdbphase,
      mdcurrent: item.mdcurrent,
      mdaverage: item.mdaverage,
      md: item.md,
      status: item.status,
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


  const [fileFormat, setFormat] = useState("");



  const getDateRange = (mode) => {
    const today = new Date();
    let fromdate, todate;

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    switch (mode) {
      case "Today":
        fromdate = todate = formatDate(today);
        break;
      case "Tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        fromdate = todate = formatDate(tomorrow);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;
      case "This Week":
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
        fromdate = formatDate(startOfThisWeek);
        todate = formatDate(endOfThisWeek);
        break;
      case "This Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
      case "Last Week":
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case "Last Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      default:
        fromdate = todate = "";
    }

    return { fromdate, todate };
  };


  const formatDateForInput = (date) => {
    if (isNaN(date.getTime())) {
      return ''; // Return empty if the date is invalid
    }
    return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
  };


  return (
    <Box>
      <Headtitle title={"EB Reading Analysis Review"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Manage EB Reading Analysis Review
      </Typography> */}
      <PageHeading
        title=" Manage EB Reading Analysis Review"
        modulename="EB"
        submodulename="Eb Reading Analysis Review"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aebreadingreport") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    EB Reading Analysis Details
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Filter Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      labelId="mode-select-label"
                      options={mode}
                      value={{ label: selectedMode, value: selectedMode }}
                      // onChange={(selectedOption) => {
                      //   const { fromdate, todate } = getDateRange(selectedOption.value); 
                      //   setEbreadingdetailFilter({
                      //     ...ebreadingdetailFilter,
                      //     fromdate,
                      //     todate
                      //   });
                      //   setSelectedMode(selectedOption.value); 
                      // }}
                      // Inside your Selects onChange
                      onChange={(selectedOption) => {
                        // Reset the date fields to empty strings
                        let fromdate = '';
                        let todate = '';

                        // If a valid option is selected, get the date range
                        if (selectedOption.value) {
                          const dateRange = getDateRange(selectedOption.value);
                          fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                          todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                        }

                        // Set the state with formatted dates
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                          todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                        });
                        setSelectedMode(selectedOption.value); // Update the mode
                      }}
                    />
                  </FormControl>


                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      From Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      disabled={selectedMode != "Custom"}
                      placeholder="Please Enter Name"
                      value={ebreadingdetailFilter.fromdate}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          fromdate: e.target.value,
                          todate: "",
                        });
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
                      id="component-outlined"
                      type="date"
                      disabled={selectedMode != "Custom"}
                      value={ebreadingdetailFilter.todate}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          todate:
                            new Date(e.target.value) >=
                              new Date(ebreadingdetailFilter.fromdate)
                              ? e.target.value
                              : "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
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
                        label: ebreadingdetailFilter.company,
                        value: ebreadingdetailFilter.company,
                      }}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          company: e.value,
                          branch: "Please Select Branch",
                          floor: "Please Select Floor",
                          unit: "Please Select Unit",
                          servicenumber: "Please Select Service",
                        });
                        setserviceNumberFilter("");
                        setserviceNumber([]);

                        setFloors([])
                      }}
                    />
                  </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      // value={{ label: ebreadingdetailFilter.company, value: ebreadingdetailFilter.company }}
                      // onChange={(e) => {
                      //     setEbreadingdetailFilter({
                      //         ...ebreadingdetailFilter,
                      //         company: e.value,
                      //         branch: "Please Select Branch",
                      //         floor: "Please Select Floor",
                      //         servicenumber: "Please Select Service"
                      //     });
                      //     setserviceNumber([]);
                      //     setFloors([])
                      // }}
                      value={selectedCompanyFrom}
                      onChange={handleCompanyChangeFrom}
                      valueRenderer={customValueRendererCompanyFrom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>

                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            ebreadingdetailFilter.company === comp.company
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
                        label: ebreadingdetailFilter.branch,
                        value: ebreadingdetailFilter.branch,
                      }}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          branch: e.value,
                          servicenumber: "Please Select Service",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                        });
                        fetchServiceNumberFilter(e);
                        setFloors([])
                      }}
                    />
                  </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch
                    </Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          // ebreadingdetailFilter.company === comp.company
                          selectedCompanyFrom
                            .map((item) => item.value)
                            .includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      // value={{ label: ebreadingdetailFilter.branch, value: ebreadingdetailFilter.branch }}
                      // onChange={(e) => {
                      //     setEbreadingdetailFilter({
                      //         ...ebreadingdetailFilter,
                      //         branch: e.value,
                      //         servicenumber: "Please Select Service",
                      //         floor: "Please Select Floor",
                      //         servicenumber: "Please Select Service"
                      //     });
                      //     fetchServiceNumberFilter(e);
                      // }}
                      value={selectedBranchFrom}
                      onChange={handleBranchChangeFrom}
                      valueRenderer={customValueRendererBranchFrom}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            ebreadingdetailFilter.company === comp.company &&
                            ebreadingdetailFilter.branch === comp.branch
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
                        label: ebreadingdetailFilter.unit,
                        value: ebreadingdetailFilter.unit,
                      }}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          unit: e.value,
                        });
                      }}
                    />
                  </FormControl> */}


                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            // ebreadingdetailFilter.company === comp.company &&
                            // ebreadingdetailFilter.branch === comp.branch
                            selectedCompanyFrom
                              .map((item) => item.value)
                              .includes(comp.company) &&
                            selectedBranchFrom
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
                      styles={colourStyles}
                      // value={{ label: ebreadingdetailFilter.branch, value: ebreadingdetailFilter.branch }}
                      // onChange={(e) => {
                      //     setEbreadingdetailFilter({
                      //         ...ebreadingdetailFilter,
                      //         branch: e.value,
                      //         servicenumber: "Please Select Service",
                      //         floor: "Please Select Floor",
                      //         servicenumber: "Please Select Service"
                      //     });
                      //     fetchServiceNumberFilter(e);
                      // }}
                      value={selectedUnitFrom}
                      onChange={handleUnitChangeFrom}
                      valueRenderer={customValueRendererUnitFrom}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Service Number</Typography>
                    <Selects
                      options={serviceNumber}
                      styles={colourStyles}
                      value={{
                        label: ebreadingdetailFilter.servicenumber,
                        value: ebreadingdetailFilter.servicenumber,
                      }}
                      onChange={(e) => {
                        fetchFloorFilter(e);
                      }}
                    />
                  </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      Service Number
                    </Typography>
                    <MultiSelect
                      options={serviceNumber}
                      styles={colourStyles}
                      // value={{ label: ebreadingdetailFilter.servicenumber, value: ebreadingdetailFilter.servicenumber }}
                      // onChange={(e) => {
                      //     fetchFloorFilter(e);


                      // }}
                      value={selectedServiceFrom}
                      onChange={handleServiceChangeFrom}
                      valueRenderer={customValueRendererServiceFrom}
                      labelledBy="Please Select Service Number"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: ebreadingdetailFilter.floor,
                        value: ebreadingdetailFilter.floor,
                      }}
                      onChange={(e) => {
                        setEbreadingdetailFilter({
                          ...ebreadingdetailFilter,
                          floor: e.value,
                        });
                      }}
                    />
                  </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor
                    </Typography>
                    <MultiSelect
                      options={floors}
                      styles={colourStyles}
                      // value={{ label: ebreadingdetailFilter.floor, value: ebreadingdetailFilter.floor }}
                      // onChange={(e) => {
                      //     setEbreadingdetailFilter({ ...ebreadingdetailFilter, floor: e.value });

                      // }}
                      value={selectedFloorFrom}
                      onChange={handleFloorChangeFrom}
                      valueRenderer={customValueRendererFloorFrom}
                      labelledBy="Please Select Floor"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Reading Mode</Typography>
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
                      value={readingmode}
                      onChange={(e) => {
                        setReadingmode(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Daily Closing" disabled>
                        {" "}
                        {"Daily Closing"}{" "}
                      </MenuItem>
                      <MenuItem value="Daily Closing">
                        {" "}
                        {"Daily Closing"}{" "}
                      </MenuItem>
                      <MenuItem value="Month Closing">
                        {" "}
                        {"Month Closing"}{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Usage Value</Typography>
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
                      value={usagevalue}
                      onChange={(e) => {
                        setUsagevalue(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Greater than Allowed Unit" disabled>
                        {" "}
                        {"Greater than Allowed Unit"}{" "}
                      </MenuItem>
                      <MenuItem value="Greater than Allowed Unit">
                        {" "}
                        {"Greater than Allowed Unit"}{" "}
                      </MenuItem>
                      <MenuItem value="Below than Allowed Unit">
                        {" "}
                        {"Below than Allowed Unit"}{" "}
                      </MenuItem>
                      <MenuItem value="Normal Usage Unit">
                        {" "}
                        {"Normal Usage Unit"}{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6} marginTop={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmitFilter}
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                    Clear
                  </Button>
                </Grid>
              </Grid>

            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lebreadingreport") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                EB Reading Analysis Review List
              </Typography>
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
                    <MenuItem value={(ebreadingdetails?.length)}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelebreadinganalysisreview") && (
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

                  {isUserRoleCompare?.includes("csvebreadinganalysisreview") && (
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
                  {isUserRoleCompare?.includes("printebreadinganalysisreview") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfebreadinganalysisreview") && (
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
                  {isUserRoleCompare?.includes("imageebreadinganalysisreview") && (
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
                  maindatas={ebreadingdetails}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={ebreadingdetails}
                />


              </Grid>
            </Grid>
            <br />

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;

            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>&ensp;
            <br />
            <br />
            {ebreadingdetailCheck ? (
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
                      itemsList={ebreadingdetails}
                    />
                  </>
                </Box>

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
        itemsTwo={ebreadingdetails ?? []}
        filename={"EB Reading Analysis Review"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXPTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EBReadingAnalysisreviewList;