import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { Box, Typography, InputAdornment, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../components/TableStyle";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PageHeading from "../../components/PageHeading";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from "dom-to-image";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from "../../components/Searchbar.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";

function ManageIPList() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);
  const [ipmasters, setIpmasters] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  let exportColumnNames = ["Category", "Subcategory", "IP Address", "Subnet Mask", "Gateway", "DNS"];
  let exportRowValues = ["categoryname", "subcategoryname", "ipaddress", "subnet", "gateway", "dns1"];

  const backPage = useNavigate();
  const [ipmaster, setIpmaster] = useState({
    ipaddress: "",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "Please Select Asset Material",
    assetmaterialcode: "Please Select Asset Material Code",
    status: "",
    ipconfig: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [materialOpt, setMaterialopt] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, allfloor, buttonStyles, pageName, setPageName, allareagrouping, alllocationgrouping, isAssignBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
      if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)) {
        fetfinalurl = data.subpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)) {
        fetfinalurl = data.mainpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
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

  const [reasonmasterCheck, setReasonmastercheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

  const [getip, setGetip] = useState();
  const [getid, setGetid] = useState();

  const getCode = async (value, id) => {
    try {
      setGetip(value);
      setGetid(id);

      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Un_Assingned IP.png");
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
    setIpmaster({
      ipaddress: "",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "Please Select Asset Material",
      assetmaterialcode: "Please Select Asset Material Code",
    });
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
    categoryname: true,
    subcategoryname: true,
    ipaddress: true,
    subnet: true,
    gateway: true,
    dns1: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //get all Sub vendormasters.
  const fetchIpMaster1 = async () => {
    setPageName(!pageName);
    try {
      setTableLoader(true);
      setFilterLoader(true);
      let res_vendor = await axios.get(SERVICE.IPMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // assignbranch: accessbranch,
      });
      setReasonmastercheck(true);
      let arrval = (res_vendor?.data?.ipmaster || [])
        .map((item) => ({
          ...item,
          ipconfig: item.ipconfig.filter((ipitem) => ipitem.status != "assigned" &&
            valueIpAddressCat?.includes(ipitem.ipaddress) &&
            valueSubCategoryCat?.includes(ipitem.subcategoryname) && valueCategoryCat?.includes(ipitem.categoryname)),
        }))
        .map((item) => item.ipconfig);

      const mergedArray = [].concat(...arrval);
      setIpmasters(
        mergedArray?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
        }))
      );
    } catch (err) {
      setReasonmastercheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    } finally {
      setTableLoader(false);
      setFilterLoader(false);
    }
  };


  const fetchIpMaster = async () => {
    setPageName(!pageName);
    setTableLoader(true);
    setFilterLoader(true);

    try {
      let res_vendor = await axios.post(SERVICE.IP_MASTER_UNASSIGNED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: valueCategoryCat,
        subcategoryname: valueSubCategoryCat,
        ipaddress: valueIpAddressCat

      });
      setReasonmastercheck(true);
      console.log(res_vendor.data.ipmaster, "ioo")
      setIpmasters(
        res_vendor.data.ipmaster?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );
    } catch (err) {
      setReasonmastercheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    } finally {
      setTableLoader(false);
      setFilterLoader(false);
    }
  };

  // Excel
  const fileName = "Un_Assigned IP";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Un_Assigned IP",
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
    addSerialNumber(ipmasters);
  }, [ipmasters]);

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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

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
    //           // Do not allow checking when there are no rows
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
      field: "categoryname",
      headerName: "Category",
      flex: 0,
      width: 140,
      hide: !columnVisibility.categoryname,
      headerClassName: "bold-header",
    },
    {
      field: "subcategoryname",
      headerName: "Subcategory",
      flex: 0,
      width: 140,
      hide: !columnVisibility.subcategoryname,
      headerClassName: "bold-header",
    },
    {
      field: "ipaddress",
      headerName: "Ip Address",
      flex: 0,
      width: 140,
      hide: !columnVisibility.ipaddress,
      headerClassName: "bold-header",
    },
    {
      field: "subnet",
      headerName: "Subnet Mask",
      flex: 0,
      width: 140,
      hide: !columnVisibility.subnet,
      headerClassName: "bold-header",
    },
    {
      field: "gateway",
      headerName: "Gateway",
      flex: 0,
      width: 140,
      hide: !columnVisibility.gateway,
      headerClassName: "bold-header",
    },
    {
      field: "dns1",
      headerName: "DNS ",
      flex: 0,
      width: 140,
      hide: !columnVisibility.dns1,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 220,
      minHeight: "40px !important",
      sortable: false,
      filter: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Button
          sx={{
            padding: "14px 14px",
            minWidth: "40px !important",
            borderRadius: "50% !important",
            ":hover": {
              backgroundColor: "#80808036", // theme.palette.primary.main
            },
          }}
          onClick={() => {
            getCode(params?.data?.ipaddress, params?.data?.id);
          }}
        >
          Assign
        </Button>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      subcategoryname: item.subcategoryname,
      type: item.type,
      ipaddress: item.ipaddress,
      subnet: item.subnet,
      gateway: item.gateway,
      dns1: item.dns1,
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
    setAreas(allareagrouping);
  };

  //get all Locations.
  const fetchAllLocation = async (e) => {
    let result = alllocationgrouping.filter((d) => d.branch === ipmaster.branch && d.floor === ipmaster.floor && d.area === e).map((data) => data.location);
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

  const fetchMaterial = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.ASSETMATERIALIP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMaterialopt(res.data.assetmaterialip);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const sendRequest = async () => {
    try {
      await axios.post(SERVICE.IPMASTER_UPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        updatevalue: getid,
        company: String(ipmaster.company),
        branch: String(ipmaster.branch),
        unit: String(ipmaster.unit),
        floor: String(ipmaster.floor),
        location: String(ipmaster.location),
        area: String(ipmaster.area),
        assetmaterial: String(ipmaster.assetmaterial),
        assetmaterialcode: String(ipmaster.assetmaterialcode),
        status: "assigned",
        addedby: {
          name: String(isUserRoleAccess.companyname),
          date: String(new Date()),
        },
      });

      await fetchIpMaster();
      setIpmaster({
        ...ipmaster,
        ipaddress: "",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select AssetMaterial",
        assetmaterialcode: "Please Select Asset Material Code",
      });
      backPage("/assignediplist");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (ipmaster?.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.assetmaterial === "Please Select Asset Material") {
      setPopupContentMalert("Please Select AssetMaterial");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (ipmaster?.assetmaterialcode === "Please Select Asset Material Code") {
      setPopupContentMalert("Please Select AssetMaterial Code");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setIpmaster({
      ipaddress: "",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "Please Select Asset Material",
      assetmaterialcode: "Please Select Asset Material Code",
    });
    let res = await axios.get(SERVICE.ASSETMATERIALIP, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    setMaterialopt(res.data.assetmaterialip);

    setAreas([]);
    setFloors([]);
    // setMaterialopt([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("UnAssigned IP"),
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
    fetchUnAssignedIPAddress();
  }, []);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subIpAddressOptions, setsIpAddressOptions] = useState([]);

  const fetchCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.IPCATEGORY}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions([
        ...response?.data?.ipcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
      setCategoryData(response?.data?.ipcategory);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchUnAssignedIPAddress = async () => {
    try {
      let response = await axios.get(`${SERVICE.UNASSIGNEDIPS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setsIpAddressOptions(response?.data?.ipconfigArray);
      console.log(response?.data?.ipconfigArray, "response?.data?.ipconfigArray");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  //Category multiselect
  const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
  let [valueCategoryCat, setValueCategoryCat] = useState([]);

  const handleCategoryChange = (options) => {
    setValueCategoryCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCategory(options);
    setValueSubCategoryCat([]);
    setSelectedOptionsSubCategory([]);
    setValueIpAddressCat([]);
    setSelectedOptionsIpAddress([]);
  };

  const customValueRendererCategory = (valueCategoryCat, _categoryname) => {
    return valueCategoryCat?.length ? valueCategoryCat.map(({ label }) => label)?.join(", ") : "Please Select Category";
  };
  //sub Category multiselect
  const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
  let [valueSubCategoryCat, setValueSubCategoryCat] = useState([]);

  const handleSubCategoryChange = (options) => {
    setValueSubCategoryCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCategory(options);
    setValueIpAddressCat([]);
    setSelectedOptionsIpAddress([]);
  };

  const customValueRendererSubCategory = (valueSubCategoryCat, _Subcategoryname) => {
    return valueSubCategoryCat?.length ? valueSubCategoryCat.map(({ label }) => label)?.join(", ") : "Please Select Sub Category";
  };

  //Ip Addrss multiselect
  const [selectedOptionsIpAddress, setSelectedOptionsIpAddress] = useState([]);
  let [valueIpAddressCat, setValueIpAddressCat] = useState([]);

  const handleIpAddressChange = (options) => {
    setValueIpAddressCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsIpAddress(options);
  };

  const customValueRendererIpAddress = (valueIpAddressCat, _IpAddressname) => {
    return valueIpAddressCat?.length ? valueIpAddressCat.map(({ label }) => label)?.join(", ") : "Please Select IP Address";
  };

  const handleClearFilter = () => {
    setValueCategoryCat([]);
    setSelectedOptionsCategory([]);
    setValueSubCategoryCat([]);
    setSelectedOptionsSubCategory([]);
    setValueIpAddressCat([]);
    setSelectedOptionsIpAddress([]);
    setIpmasters([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const handleFilter = () => {
    if (selectedOptionsCategory?.length === 0) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubCategory?.length === 0) {
      setPopupContentMalert("Please Select Sub Category!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsIpAddress?.length === 0) {
      setPopupContentMalert("Please Select IP Address!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchIpMaster();
    }
  };

  return (
    <Box>
      <Headtitle title={"UNASSIGNED IP"} />
      <PageHeading title=" UnAssigned IP" modulename="Network Administration" submodulename="IP" mainpagename="UnAssigned IP" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes("lunassignedip") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>UnAssigned IP Filter</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={categoryOptions}
                      value={selectedOptionsCategory}
                      onChange={(e) => {
                        handleCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererCategory}
                      labelledBy="Please Select Category"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Sub Category<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={categoryData
                        ?.filter((item) => valueCategoryCat?.includes(item.categoryname))
                        ?.map((items) => items.subcategoryname)
                        .flat()
                        .map((data) => ({
                          label: data,
                          value: data,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsSubCategory}
                      onChange={(e) => {
                        handleSubCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererSubCategory}
                      labelledBy="Please Select Sub Category"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    IP Address<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={subIpAddressOptions
                        ?.filter((data) => valueCategoryCat?.includes(data.categoryname) && valueSubCategoryCat?.includes(data.subcategoryname))
                        ?.map((item) => ({
                          value: item?.ipaddress,
                          label: item?.ipaddress,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsIpAddress}
                      onChange={(e) => {
                        handleIpAddressChange(e);
                      }}
                      valueRenderer={customValueRendererIpAddress}
                      labelledBy="Please Select Ip Address"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <LoadingButton variant="contained" color="primary" onClick={handleFilter} loading={filterLoader} sx={buttonStyles.buttonsubmit}>
                      Filter
                    </LoadingButton>

                    <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}{" "}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lunassignedip") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>UnAssigned IP List</Typography>
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
                    <MenuItem value={ipmasters?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelunassignedip") && (
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
                  {isUserRoleCompare?.includes("csvunassignedip") && (
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
                  {isUserRoleCompare?.includes("printunassignedip") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfunassignedip") && (
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
                  {isUserRoleCompare?.includes("imageunassignedip") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={ipmasters} setSearchedString={setSearchedString} searchQuery={searchQuery} setSearchQuery={setSearchQuery} paginated={false} totalDatas={ipmasters} />
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
            <br />
            <br />
            {tableLoader ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                      itemsList={ipmasters}
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> UnAssigned IP List</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    IP Address<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" type="text" value={getip} />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={accessbranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{ label: ipmaster.company, value: ipmaster.company }}
                    onChange={(e) => {
                      setIpmaster({
                        ...ipmaster,
                        company: e.value,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        floor: "Please Select Floor",
                        area: "Please Select Area",
                        location: "Please Select Location",
                        assetmaterial: "Please Select Asset Material",
                        assetmaterialcode: "Please Select Asset Material Code",
                      });
                      setAreas([]);
                      setFloors([]);
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
                    options={accessbranch
                      ?.filter((comp) => ipmaster.company === comp.company)
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{ label: ipmaster.branch, value: ipmaster.branch }}
                    onChange={(e) => {
                      setAreas([]);
                      setFloors([]);
                      setIpmaster({
                        ...ipmaster,
                        branch: e.value,
                        unit: "Please Select Unit",
                        floor: "Please Select Floor",
                        area: "Please Select Area",
                      });
                      fetchFloor(e);
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
                    options={accessbranch
                      ?.filter((comp) => ipmaster.company === comp.company && ipmaster.branch === comp.branch)
                      ?.map((data) => ({
                        label: data.unit,
                        value: data.unit,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{ label: ipmaster.unit, value: ipmaster.unit }}
                    onChange={(e) => {
                      setIpmaster({
                        ...ipmaster,
                        unit: e.value,
                        floor: "Please Select Floor",
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
                    value={{ label: ipmaster.floor, value: ipmaster.floor }}
                    onChange={(e) => {
                      setIpmaster({
                        ...ipmaster,
                        floor: e.value,
                        area: "Please Select Area",
                      });
                      fetchArea(e.value);
                      // setAreas([]);
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
                    options={areas
                      ?.find((subpro) => subpro.company === ipmaster.company && subpro.branch === ipmaster.branch && subpro.unit === ipmaster.unit && subpro.floor === ipmaster.floor)
                      ?.area?.map((subpro) => ({
                        ...subpro,
                        label: subpro,
                        value: subpro,
                      }))}
                    styles={colourStyles}
                    value={{ label: ipmaster.area, value: ipmaster.area }}
                    onChange={(e) => {
                      setIpmaster({
                        ...ipmaster,
                        area: e.value,
                        assetmaterial: "Please Select Asset Material",
                        assetmaterialcode: "Please Select Asset Material Code",
                      });
                      fetchAllLocation(e.value);
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
                      label: ipmaster.location,
                      value: ipmaster.location,
                    }}
                    onChange={(e) => {
                      setIpmaster({ ...ipmaster, location: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Material<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={
                      ipmaster.location === "ALL"
                        ? Array.from(
                          new Set(
                            materialOpt
                              .filter((subpro) => subpro.ip === true && subpro.company === ipmaster.company && subpro.branch === ipmaster.branch && subpro.unit === ipmaster.unit && subpro.floor === ipmaster.floor && subpro.area === ipmaster.area)
                              .map((t) => ({
                                ...t,
                                label: t.assetmaterial,
                                value: t.assetmaterial,
                              }))
                              .reduce((acc, curr) => {
                                if (!acc.some((obj) => obj.value === curr.value)) {
                                  acc.push(curr);
                                }
                                return acc;
                              }, [])
                          )
                        )
                        : Array.from(
                          new Set(
                            materialOpt
                              .filter((subpro) => subpro.location === ipmaster.location && subpro.ip === true && subpro.company === ipmaster.company && subpro.branch === ipmaster.branch && subpro.unit === ipmaster.unit && subpro.floor === ipmaster.floor && subpro.area === ipmaster.area && subpro.location === ipmaster.location)
                              .map((t) => ({
                                ...t,
                                label: t.assetmaterial,
                                value: t.assetmaterial,
                              }))
                              .reduce((acc, curr) => {
                                if (!acc.some((obj) => obj.value === curr.value)) {
                                  acc.push(curr);
                                }
                                return acc;
                              }, [])
                          )
                        )
                    }
                    styles={colourStyles}
                    value={{
                      label: ipmaster.assetmaterial,
                      value: ipmaster.assetmaterial,
                    }}
                    onChange={(e) => {
                      setIpmaster({ ...ipmaster, assetmaterial: e.value });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Asset Material Code<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={Array.from(
                      new Set(
                        materialOpt
                          .filter((subpro) => subpro.company === ipmaster.company && subpro.branch === ipmaster.branch && subpro.unit === ipmaster.unit && subpro.floor === ipmaster.floor && subpro.area === ipmaster.area && subpro.location === ipmaster.location && subpro.assetmaterial === ipmaster.assetmaterial)
                          .map((t) => ({
                            ...t,
                            label: t.component,
                            value: t.component,
                          }))
                      )
                    )}
                    styles={colourStyles}
                    value={{
                      label: ipmaster.assetmaterialcode,
                      value: ipmaster.assetmaterialcode,
                    }}
                    onChange={(e) => {
                      setIpmaster({ ...ipmaster, assetmaterialcode: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                  Close
                </Button>
              </Grid>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/*Export XL Data  */}
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        // filteredDataTwo={filteredData ?? []}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={ipmasters ?? []}
        filename={"UnAssinged IP"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default ManageIPList;
