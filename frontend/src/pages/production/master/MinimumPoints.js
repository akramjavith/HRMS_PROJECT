import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import html2canvas from "html2canvas";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../../components/Errorhandling.js";
import Headtitle from "../../../components/Headtitle.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import SendToServer from "../../sendtoserver.js";

import AlertDialog from "../../../components/Alert.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";

function MinimumPoints() {
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
  }; let exportColumnNames = ['Company', 'Branch', 'File Name'];
  let exportRowValues = ['company', 'branch', 'filename']; let exportColumnNames2 = ['Company', 'Branch', 'Unit', 'Name', 'Emp Code', 'Team', 'Department', 'Total Paid Days', 'Month Point', 'Day Point', 'Year', 'Month'];
  let exportRowValues2 = ['company', 'branch', 'unit', 'name', 'empcode', 'team', 'department', 'totalpaiddays', 'monthpoint', 'daypoint', 'year', 'month']; const gridRef = useRef(null);
  const gridRefFilename = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [minimumPoints, setMinimumPoints] = useState([]);
  const [minimumPointEdit, setMinimumPointEdit] = useState([]);
  const [minimumPointFilename, setMinimumPointFilename] = useState([]);
  const [fileNameInfoCodeAddedBy, setFileNameInfoCodeAddedBy] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const [updateSheet, setUpdatesheet] = useState([])
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const { auth } = useContext(AuthContext);
  const [selectedCompanyEdit, setSelectedCompanyEdit] = useState(
    "Please Select Company"
  );
  const [selectedBranchEdit, setSelectedBranchEdit] = useState(
    "Please Select Branch"
  );
  const [minimumPointmanual, setMinimumPointmanual] = useState({
    processcode: "",
    amount: "",
  });  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [splitArray, setSplitArray] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);  //SECOND DATATABLE
  const [pageFilename, setPageFilename] = useState(1);
  const [pageSizeFilename, setPageSizeFilename] = useState(10);
  const [itemsFilename, setItemsFilename] = useState([]);
  const [selectedRowsFilename, setSelectedRowsFilename] = useState([]);
  const [searchQueryFilename, setSearchQueryFilename] = useState("");
  const [isManageColumnsOpenFilename, setManageColumnsOpenFilename] = useState(false);
  const [anchorElFilename, setAnchorElFilename] = useState(null);
  const [selectAllCheckedFilename, setSelectAllCheckedFilename] = useState(false);
  const [searchQueryManageFilename, setSearchQueryManageFilename] = useState("");  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    name: true,
    empcode: true,
    team: true,
    department: true,
    totalpaiddays: true,
    monthpoint: true,
    daypoint: true,
    year: true,
    month: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  ); const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  }; const username = isUserRoleAccess.username;  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  }; const handleCloseview = () => {
    setOpenview(false);
  };  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //file info model
  const [openFileInfo, setOpenFileinfo] = useState(false);
  const handleClickOpenFileinfo = () => {
    setOpenFileinfo(true);
  };
  const handleCloseFileinfo = () => {
    setOpenFileinfo(false);
  };  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    setDeletefilenamedata([]);
  }; const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  }; const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  }; const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };
  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };  //Delete single model
  const [isDeleteSingleOpen, setIsDeleteSingleOpen] = useState(false);
  const handleClickSingleOpen = () => {
    setIsDeleteSingleOpen(true);
  };
  const handleCloseSingleMod = () => {
    setIsDeleteSingleOpen(false);
    setDeletesingledata({});
  };  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false); const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  }; const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  }; const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined; const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  }; const month = [
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
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const [yearsOption, setYearsOption] = useState([]);
  const [periodState, setPeriodState] = useState({
    year: currentYear.toString(),
    month: currentMonth,
    monthlabel: month[date.getMonth()],
  });  //function to generate mins
  const generateYearsOptions = () => {
    const yearsOpt = [];
    for (let i = currentYear; i <= currentYear + 30; i++) {
      yearsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setYearsOption(yearsOpt);
  }; const monthsOption = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]; const fetchMinimumPointData = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];
    setPageName(!pageName)
    try {
      let Res = await axios.post(SERVICE.MINIMUMPOINTSACCESSBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMinimumPoints(Res?.data?.minimumpoints);
      setMinimumPointEdit(
        Res?.data?.minimumpoints.filter(
          (item) => item._id !== editsingleData._id
        )
      );
      let getFilenames = Res?.data?.minimumpoints.filter(
        (item) => item.filename !== "nonexcel"
      );
      const uniqueArray = Array.from(
        new Set(getFilenames.map((obj) => obj.filename))
      ).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setMinimumPointFilename(uniqueArray);
      setTableLoading(true);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; const [minimumPointFilenameArray, setMinimumPointFilenameArray] = useState([])
  const [minimumPointsArray, setMinimumPointsArray] = useState([])
  const fetchMinimumPointDataArray = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];
    setPageName(!pageName)
    try {
      let Res = await axios.post(SERVICE.MINIMUMPOINTSACCESSBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMinimumPointsArray(Res?.data?.minimumpoints);
      let getFilenames = Res?.data?.minimumpoints.filter(
        (item) => item.filename !== "nonexcel"
      );
      const uniqueArray = Array.from(
        new Set(getFilenames.map((obj) => obj.filename))
      ).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setMinimumPointFilenameArray(uniqueArray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; useEffect(() => {
    fetchMinimumPointDataArray();
  }, [isFilterOpen])
  useEffect(() => {
    generateYearsOptions();
  }, []);
  useEffect(() => {
    fetchMinimumPointData();
  }, [isEditOpen]);  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (periodState.year === "Please Select Year") {
      setPopupContentMalert("Please Select Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (periodState.month === "Please Select Month") {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (fileUploadName === "") {
      setPopupContentMalert("Please Choose File!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  }; const handleClear = (e) => {
    e.preventDefault();
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
    setMinimumPointmanual({
      ...minimumPointmanual,
      processcode: "",
      amount: "",
    });
    setPeriodState({
      year: currentYear.toString(),
      month: currentMonth,
      monthlabel: month[date.getMonth()],
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //delete singledata functionality
  const [deletesingleData, setDeletesingledata] = useState();
  const rowDataSingleDelete = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.MINIMUMPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletesingledata(Res?.data?.sminimumpoints);
      handleClickSingleOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; const deleteSingleList = async () => {
    let deleteSingleid = deletesingleData?._id;
    setPageName(!pageName)
    try {
      const deletePromises = await axios.delete(
        `${SERVICE.MINIMUMPOINT_SINGLE}/${deleteSingleid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      ); handleCloseSingleMod();
      await fetchMinimumPointDataArray();
      await fetchMinimumPointData();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; const bulkdeletefunction = async () => {
    setTableLoading(false);
    setPageName(!pageName)
    try {
      const deletePromises = await axios.post(
        SERVICE.MINIMUMPOINTS_BULKDELETE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: [...selectedRows],
        }
      );
      if (deletePromises?.data?.success) {
        await fetchMinimumPointData();
        setTableLoading(true);
        handleCloseModcheckbox();
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        setTableLoading(true);
        handleCloseModcheckbox();
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
        await fetchMinimumPointData();
      }
    } catch (err) { setTableLoading(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //edit get data functionality single list
  const [editsingleData, setEditsingleData] = useState({ processcode: "", amount: "", });
  const [viewsingleData, setviewsingleData] = useState({ processcode: "", amount: "", }); const rowdatasingleview = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.MINIMUMPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setviewsingleData(Res?.data?.sminimumpoints);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; const editSubmit = (e) => {
    e.preventDefault();
    fetchMinimumPointData();
    const isNameMatch = minimumPointEdit?.some(
      (item) =>
        item.company === selectedCompanyEdit &&
        item.branch === selectedBranchEdit &&
        item.processcode?.toLowerCase() ===
        editsingleData.processcode?.toLowerCase() &&
        item.amount?.toLowerCase() === editsingleData.amount?.toLowerCase()
    );
    if (selectedCompanyEdit === "Please Select Company") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchEdit === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.amount === "") {
      setPopupContentMalert("Please Enter Amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Minimum Points already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  }; const sendEditRequest = async () => {
    let editid = editsingleData._id;
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.MINIMUMPOINT_SINGLE}/${editid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompanyEdit),
        branch: String(selectedBranchEdit),
        processcode: String(editsingleData.processcode),
        amount: String(editsingleData.amount),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      handleCloseModEdit();
      await fetchMinimumPointData();
      await fetchMinimumPointDataArray();
      setMinimumPointmanual({
        ...minimumPointmanual,
        processcode: "",
        amount: "",
      });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "MinimumPoints.png");
        });
      });
    }
  };  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Minimum Points",
    pageStyle: "print",
  });  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = minimumPoints?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  }; useEffect(() => {
    addSerialNumber();
  }, [minimumPoints]);  //Datatable
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
  }; let updateby = editsingleData.updatedby;
  let addedby = editsingleData.addedby; const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.MINIMUMPOINT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEditsingleData(res?.data?.sminimumpoints);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  }); const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  ); const pageNumbers = [];
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  } const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
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
      ), renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
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
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 180,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 120,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "totalpaiddays",
      headerName: "Total Paid Days",
      flex: 0,
      width: 180,
      hide: !columnVisibility.totalpaiddays,
      headerClassName: "bold-header",
    },
    {
      field: "monthpoint",
      headerName: "Month Point",
      flex: 0,
      width: 150,
      hide: !columnVisibility.monthpoint,
      headerClassName: "bold-header",
    },
    {
      field: "daypoint",
      headerName: "Day Point",
      flex: 0,
      width: 150,
      hide: !columnVisibility.daypoint,
      headerClassName: "bold-header",
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0,
      width: 100,
      hide: !columnVisibility.year,
      headerClassName: "bold-header",
    },
    {
      field: "month",
      headerName: "Month",
      flex: 0,
      width: 100,
      hide: !columnVisibility.month,
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
          {isUserRoleCompare?.includes("dminimumpoints") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataSingleDelete(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vminimumpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleview(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iminimumpoints") && (
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
  ]; const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      name: item.name,
      empcode: item.empcode,
      team: item.team,
      department: item.department,
      totalpaiddays: item.totalpaiddays,
      monthpoint: item.monthpoint,
      daypoint: item.daypoint,
      year: item.year,
      month: item.month,
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
  );  //SECOND TABLE FDATA AND FUNCTIONS
  const [deleteFilenameData, setDeletefilenamedata] = useState([]);
  const rowDatafileNameDelete = async (filename) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.MINIMUMPOINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.minimumpoints
        .filter((item) => item.filename === filename)
        .map((item) => item._id);
      setDeletefilenamedata(getFilenames);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }; const deleteFilenameList = async () => {
    setTableLoading(false);
    setPageName(!pageName)
    try {
      if (deleteFilenameData.length != 0) {
        const deletePromises = await axios.post(
          SERVICE.MINIMUMPOINTS_BULKDELETE,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            ids: [...deleteFilenameData],
          }
        );
        if (deletePromises?.data?.success) {
          await fetchMinimumPointDataArray();
          await fetchMinimumPointData();
          handleCloseMod();
          setSelectedRows([]);
          setSelectAllChecked(false);
          setPage(1);
          setPopupContent("Deleted Successfully");
          setPopupSeverity("success");
          handleClickOpenPopup();
          setTableLoading(true);
        } else {
          setTableLoading(true);
          handleCloseMod();
          setSelectedRows([]);
          setSelectAllChecked(false);
          setPage(1);
          await fetchMinimumPointData();
        }
      } else {
        setPopupContentMalert("No Data to Delete");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) { setTableLoading(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };  // Manage Columns
  const handleOpenManageColumnsFilename = (event) => {
    setAnchorElFilename(event.currentTarget);
    setManageColumnsOpenFilename(true);
  };
  const handleCloseManageColumnsFilename = () => {
    setManageColumnsOpenFilename(false);
    setSearchQueryManageFilename("");
  };  // Show All Columns & Manage Columns
  const initialColumnVisibilityFilename = {
    serialNumber: true,
    checkbox: true,
    branch: true,
    company: true,
    filename: true,
    // lastupload: true,
    actions: true,
  };
  const [columnVisibilityFilename, setColumnVisibilityFilename] = useState(
    initialColumnVisibilityFilename
  ); useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityFilename");
    if (savedVisibility) {
      setColumnVisibilityFilename(JSON.parse(savedVisibility));
    }
  }, []); useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityFilename",
      JSON.stringify(columnVisibilityFilename)
    );
  }, [columnVisibilityFilename]); const handleSelectionChangeFilename = (newSelection) => {
    setSelectedRowsFilename(newSelection.selectionModel);
  };  //image
  const handleCaptureImageFilename = () => {
    if (gridRefFilename.current) {
      html2canvas(gridRefFilename.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "MinimumPointsFile.png");
        });
      });
    }
  };
  //print...
  const componentRefFilename = useRef();
  const handleprintFilename = useReactToPrint({
    content: () => componentRefFilename.current,
    documentTitle: "Minimum Points File Name",
    pageStyle: "print",
  });  //serial no for listing itemsFilename
  const addSerialNumberFilename = () => {
    const itemsWithSerialNumber = minimumPointFilename?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsFilename(itemsWithSerialNumber);
  }; useEffect(() => {
    addSerialNumberFilename();
  }, [minimumPointFilename]);  //Datatable
  const handlePageChangeFilename = (newPage) => {
    setPageFilename(newPage);
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
  };
  const handlePageSizeChangeFilename = (event) => {
    setPageSizeFilename(Number(event.target.value));
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
    setPageFilename(1);
  };
  //datatable....
  const handleSearchChangeFilename = (event) => {
    setSearchQueryFilename(event.target.value);
    setPageFilename(1);
  };  // Split the search query into individual terms
  const searchTermsFilename = searchQueryFilename.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasFilename = itemsFilename?.filter((item) => {
    return searchTermsFilename.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  }); const FilenameFilename = filteredDatasFilename?.slice(
    (pageFilename - 1) * pageSizeFilename,
    pageFilename * pageSizeFilename
  );
  const totalPagesFilename = Math.ceil(
    filteredDatasFilename?.length / pageSizeFilename
  );
  const visiblePagesFilename = Math.min(totalPagesFilename, 3);
  const firstVisiblePageFilename = Math.max(1, pageFilename - 1);
  const lastVisiblePageFilename = Math.min(
    firstVisiblePageFilename + visiblePagesFilename - 1,
    totalPagesFilename
  ); const pageNumbersFilename = [];
  for (let i = firstVisiblePageFilename; i <= lastVisiblePageFilename; i++) {
    pageNumbersFilename.push(i);
  } const CheckboxHeaderFilename = ({
    selectAllCheckedFilename,
    onSelectAll,
  }) => (
    <div>
      <Checkbox checked={selectAllCheckedFilename} onChange={onSelectAll} />
    </div>
  );
  const columnDataTableFilename = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeaderFilename
          selectAllCheckedFilename={selectAllCheckedFilename}
          onSelectAll={() => {
            if (rowDataTableFilename.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedFilename) {
              setSelectedRowsFilename([]);
            } else {
              const allRowIds = rowDataTableFilename.map((row) => row.id);
              setSelectedRowsFilename(allRowIds);
            }
            setSelectAllCheckedFilename(!selectAllCheckedFilename);
          }}
        />
      ), renderCell: (params) => (
        <Checkbox
          checked={selectedRowsFilename.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsFilename.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsFilename.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRowsFilename, params.row.id];
            }
            setSelectedRowsFilename(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedFilename(
              updatedSelectedRows.length === FilenameFilename.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibilityFilename.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityFilename.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.branch,
      headerClassName: "bold-header",
    },
    {
      field: "filename",
      headerName: "File Name",
      flex: 0,
      width: 350,
      hide: !columnVisibilityFilename.filename,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityFilename.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dminimumpoints") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDatafileNameDelete(params.row.filename);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ]; const rowDataTableFilename = FilenameFilename.map((item, index) => {
    return {
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      filename: item.filename,
    };
  });
  const rowsWithCheckboxesFilename = rowDataTableFilename.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsFilename.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumnsFilename = () => {
    const updatedVisibility = { ...columnVisibilityFilename };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityFilename(updatedVisibility);
  };
  // Function to filter columns based on search query
  const filteredColumnsFilename = columnDataTableFilename.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageFilename.toLowerCase())
  );
  // Manage Columns functionality
  const toggleColumnVisibilityFilename = (field) => {
    setColumnVisibilityFilename((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentFilename = (
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
        onClick={handleCloseManageColumnsFilename}
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
          value={searchQueryManageFilename}
          onChange={(e) => setSearchQueryManageFilename(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFilename.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityFilename[column.field]}
                    onChange={() =>
                      toggleColumnVisibilityFilename(column.field)
                    }
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
                setColumnVisibilityFilename(initialColumnVisibilityFilename)
              }
            >
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
                columnDataTableFilename.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityFilename(newColumnVisibility);
              }}
            >
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  }; useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []); const readExcel = (file) => {
    const requiredHeaders = [
      "company", "branch", "unit", "name", "empcode",
      "team", "department", "totalpaiddays", "monthpoint",
      "daypoint"
    ]; if (!(file instanceof Blob)) {
      // Handle the case when the file is not a Blob
      return;
    } else if (periodState.year === "Please Select Year") {
      setPopupContentMalert("Please Select Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (periodState.month === "Please Select Month") {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file); fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];          // Validate headers
          const headers = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          const missingHeaders = requiredHeaders.filter(header => !headers.includes(header)); if (missingHeaders.length > 0) {
            setPopupContentMalert("Missing required headers: " + missingHeaders.join(", "));
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            reject("Missing required headers");
            return;
          }
          // Convert the sheet to JSON
          const data = XLSX.utils.sheet_to_json(ws);
          if (data.length === 0) {
            setPopupContentMalert("The uploaded file is empty!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            reject("Empty file");
            return;
          }          // Validate each row for missing required fields
          const invalidRows = data.filter(row =>
            requiredHeaders.some(header => !row[header] || row[header].toString().trim() === "")
          ); if (invalidRows.length > 0) {
            setPopupContentMalert("Some rows have missing Values!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            reject("Some rows have missing Values");
            return;
          }
          resolve(data);
        }; fileReader.onerror = (error) => {
          reject(error);
        };
      }); promise.then((d) => {
        let uniqueArrayfinal = d.filter(
          (item) =>
            !minimumPoints.some(
              (tp) =>
                tp.company === item.company &&
                tp.branch === item.branch &&
                tp.unit === item.unit &&
                tp.name === item.name &&
                tp.empcode === item.empcode &&
                tp.team === item.team &&
                tp.department === item.department &&
                tp.totalpaiddays === item.totalpaiddays &&
                tp.monthpoint === item.monthpoint &&
                tp.daypoint === item.daypoint &&
                tp.year === periodState.year &&
                tp.month === periodState.month
            )
        ); let uniqueArray = d.filter(
          (item) =>
            !minimumPoints.some(
              (tp) =>
                tp.company === item.company &&
                tp.branch === item.branch &&
                tp.unit === item.unit &&
                tp.name === item.name &&
                tp.empcode === item.empcode &&
                tp.team === item.team &&
                tp.department === item.department &&
                tp.totalpaiddays === item.totalpaiddays &&
                tp.monthpoint === item.monthpoint &&
                tp.daypoint === item.daypoint &&
                tp.year === periodState.year &&
                tp.month === periodState.month
            )
        ); const dataArray = uniqueArray.map((item) => ({
          filename: file.name,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          name: item.name,
          empcode: item.empcode,
          team: item.team,
          department: item.department,
          totalpaiddays: item.totalpaiddays,
          monthpoint: item.monthpoint,
          daypoint: item.daypoint,
          year: periodState.year,
          month: periodState.month,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        })); const uniqueDataArray = dataArray
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.name === item.name &&
                  t.empcode === item.empcode &&
                  t.team === item.team &&
                  t.department === item.department &&
                  t.totalpaiddays === item.totalpaiddays &&
                  t.monthpoint === item.monthpoint &&
                  t.daypoint === item.daypoint &&
                  t.year === periodState.year &&
                  t.month === periodState.month
              )
          )
          .map((item) => ({
            filename: file.name,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            name: item.name,
            empcode: item.empcode,
            team: item.team,
            department: item.department,
            totalpaiddays: item.totalpaiddays,
            monthpoint: item.monthpoint,
            daypoint: item.daypoint,
            year: periodState.year,
            month: periodState.month,
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          })); if (uniqueArray.length !== d.length) {
            setPopupContentMalert(uniqueArrayfinal.length !== d.length && uniqueArray.length === 0
              ? "No Data to Upload"
              : uniqueArrayfinal.length !== d.length
                ? `${d.length - uniqueArrayfinal.length} Duplicate datas are Removed`
                : "");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        setUpdatesheet([])
        const subarraySize = 1000;
        const splitedArray = []; for (let i = 0; i < uniqueDataArray.length; i += subarraySize) {
          const subarray = uniqueDataArray.slice(i, i + subarraySize);
          splitedArray.push(subarray);
        }
        setSplitArray(splitedArray);
      });
    }
  }; const getSheetExcel = () => {
    if (
      !Array.isArray(splitArray) ||
      (splitArray.length === 0 && fileUploadName === "")
    ) {
      setPopupContentMalert("Please Upload a file");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      })); setSheets(getsheets);
    }
  }; const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata?.filter(
      (item) =>
        !minimumPoints?.some(
          (tp) =>
            tp.company === item.company &&
            tp.branch === item.branch &&
            tp.unit == item.unit &&
            tp.name == item.name &&
            tp.empcode == item.empcode &&
            tp.team == item.team &&
            tp.department == item.department &&
            tp.totalpaiddays == item.totalpaiddays &&
            tp.monthpoint == item.monthpoint &&
            tp.daypoint == item.daypoint &&
            tp.year == periodState.year &&
            tp.month == periodState.month
        )
    ); const updateVar = uniqueArray?.map((tp) => {
      tp.year = periodState.year;
      tp.month = periodState.month;
      return tp;
    });    // Ensure that items is an array of objects before sending
    if (
      // fileUploadName === "" ||
      // !Array.isArray(uniqueArray) ||
      // uniqueArray.length === 0 ||
      selectedSheet === "Please Select Sheet"
    ) {
      setPopupContentMalert(fileUploadName === ""
        ? "Please Upload File"
        : selectedSheet === "Please Select Sheet"
          ? "Please Select Sheet"
          : "No data to upload");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        }
      };
      setPageName(!pageName)
      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.MINIMUMPOINT_CREATE);
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xmlhttp.send(JSON.stringify(uniqueArray));
        await fetchMinimumPointData();
        await fetchMinimumPointDataArray();
      } catch (err) {
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        if (uniqueArray.length === 0) {
          setPopupContent("No Data To Upload");
          setPopupSeverity("info");
          handleClickOpenPopup();
        } else {
          setPopupContent("Added Successfully");
          setPopupSeverity("success");
          handleClickOpenPopup();
          setSelectedSheet("Please Select Sheet");
          setSelectedSheetindex(-1)
          setUpdatesheet(prev => [...prev, selectedSheetindex])
          await fetchMinimumPointData();
          await fetchMinimumPointDataArray();
        }
      }
    }
  };
  const clearFileSelection = () => {
    setUpdatesheet([])
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy; const ExportsHead = () => {
    let fileDownloadName = "Filename_MinimumPoints" + "_" + today; new CsvBuilder(fileDownloadName)
      .setColumns([
        "S.No",
        "company",
        "branch",
        "unit",
        "name",
        "empcode",
        "team",
        "department",
        "totalpaiddays",
        "monthpoint",
        "daypoint",
      ])
      .exportFile();
  }; const [fileFormat, setFormat] = useState('')
  return (
    <Box>
      <Headtitle title={"MINIMUM POINTS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}></Typography>
      <PageHeading
        title="Minimum Points"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Minimum Points"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aminimumpoints") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Add Minimum Points
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={yearsOption}
                      placeholder="Mins"
                      value={{
                        label: periodState.year,
                        value: periodState.year,
                      }}
                      onChange={(e) => {
                        setPeriodState({
                          ...periodState,
                          year: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={monthsOption}
                      placeholder="Mins"
                      value={{
                        label: periodState.monthlabel,
                        value: periodState.month,
                      }}
                      onChange={(e) => {
                        setPeriodState({
                          ...periodState,
                          month: e.value,
                          monthlabel: e.label,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "Capitalize" }}
                    onClick={(e) => ExportsHead()}
                  >
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6} marginTop={3}>
                  <Grid container spacing={2}>
                    <Grid item md={4}>
                      <Button
                        variant="contained"
                        component="label"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated("uploaded");
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null; setSplitArray([]);
                            setSheets([]);
                            setSelectedSheet("Please Select Sheet");
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={7}>
                      {fileUploadName != "" && splitArray.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <p>{fileUploadName}</p>
                          <Button
                            sx={{ minWidth: "36px", borderRadius: "50%" }}
                            onClick={() => clearFileSelection()}
                          >
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter(d => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} xs={12} sm={6} marginTop={3}>
                  <Grid container>
                    <Grid item md={7} xs={12} sm={8}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          minimumPointmanual.processcode !== "" ||
                          minimumPointmanual.amount != ""
                        }
                        onClick={getSheetExcel}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Get Sheet
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Box>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  {!loading ? (
                    fileUploadName != "" && splitArray.length > 0 ? (
                      <>
                        <div readExcel={readExcel}>
                          <SendToServer sendJSON={sendJSON} />
                        </div>
                      </>
                    ) : (
                      <Button variant="contained" onClick={handleSubmit}>
                        Submit
                      </Button>
                    )
                  ) : (
                    <LoadingButton
                      // onClick={handleClick}
                      loading={loading}
                      loadingPosition="start"
                      variant="contained"
                    >
                      <span>Send</span>
                    </LoadingButton>
                  )}                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Box>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lminimumpoints") && (
        <>
          {!tableLoading ? (
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
          ) : (<Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Upload File List
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeFilename}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeFilename}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={minimumPoints?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelminimumpoints") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchMinimumPointDataArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvminimumpoints") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchMinimumPointDataArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printminimumpoints") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleprintFilename}
                      >
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfminimumpoints") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchMinimumPointDataArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageminimumpoints") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImageFilename}
                    >
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQueryFilename}
                      onChange={handleSearchChangeFilename}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button
              sx={userStyle.buttongrp}
              onClick={handleShowAllColumnsFilename}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button
              sx={userStyle.buttongrp}
              onClick={handleOpenManageColumnsFilename}
            >
              Manage Columns
            </Button>
            <Popover
              id={id}
              open={isManageColumnsOpenFilename}
              anchorElFilename={anchorElFilename}
              onClose={handleCloseManageColumnsFilename}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentFilename}
            </Popover>
            &ensp;
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid
                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                rows={rowsWithCheckboxesFilename}
                columns={columnDataTableFilename.filter(
                  (column) => columnVisibilityFilename[column.field]
                )}
                onSelectionModelChange={handleSelectionChange}
                selectionModel={selectedRowsFilename}
                autoHeight={true}
                ref={gridRefFilename}
                density="compact"
                hideFooter
                getRowClassName={getRowClassName}
                disableRowSelectionOnClick
              />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {FilenameFilename.length > 0
                  ? (pageFilename - 1) * pageSizeFilename + 1
                  : 0}{" "}
                to{" "}
                {Math.min(
                  pageFilename * pageSizeFilename,
                  filteredDatasFilename?.length
                )}{" "}
                of {filteredDatasFilename?.length} entries
              </Box>
              <Box>
                <Button
                  onClick={() => setPageFilename(1)}
                  disabled={pageFilename === 1}
                  sx={userStyle.paginationbtn}
                >
                  <FirstPageIcon />
                </Button>
                <Button
                  onClick={() => handlePageChangeFilename(pageFilename - 1)}
                  disabled={pageFilename === 1}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateBeforeIcon />
                </Button>
                {pageNumbersFilename?.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    sx={userStyle.paginationbtn}
                    onClick={() => handlePageChangeFilename(pageNumber)}
                    className={pageFilename === pageNumber ? "active" : ""}
                    disabled={pageFilename === pageNumber}
                  >
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePageFilename < totalPagesFilename && (
                  <span>...</span>
                )}
                <Button
                  onClick={() => handlePageChangeFilename(pageFilename + 1)}
                  disabled={pageFilename === totalPagesFilename}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateNextIcon />
                </Button>
                <Button
                  onClick={() => setPageFilename(totalPagesFilename)}
                  disabled={pageFilename === totalPagesFilename}
                  sx={userStyle.paginationbtn}
                >
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>
            {/* ****** Table End ****** */}
          </Box>
          )}
        </>
      )}
      {/* ****** Table End ****** */}
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lminimumpoints") && (
        <>
          {!tableLoading ? (
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
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Upload Data List
                </Typography>
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
                      {/* <MenuItem value={minimumPoints?.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelminimumpoints") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen2(true)
                          fetchMinimumPointDataArray()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvminimumpoints") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen2(true)
                          fetchMinimumPointDataArray()
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printminimumpoints") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfminimumpoints") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen2(true)
                            fetchMinimumPointDataArray()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageminimumpoints") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
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
              &ensp;
              {isUserRoleCompare?.includes("bdminimumpoints") && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleClickOpenalert}
                  sx={{ textTransform: "capitalize" }}
                >
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
                <StyledDataGrid
                  onClipboardCopy={(copiedString) =>
                    setCopiedData(copiedString)
                  }
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  ref={gridRef}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                />
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
                </Box>
                <Box>
                  <Button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <FirstPageIcon />
                  </Button>
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbers?.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      sx={userStyle.paginationbtn}
                      onClick={() => handlePageChange(pageNumber)}
                      className={page === pageNumber ? "active" : ""}
                      disabled={page === pageNumber}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePage < totalPages && <span>...</span>}
                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateNextIcon />
                  </Button>
                  <Button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent>
          <Box sx={{ padding: "20px 30px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={6}>
                <Typography sx={userStyle.HeaderText}>
                  View Minimum Points
                </Typography>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Company</Typography>
                  <Typography>{viewsingleData.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <Typography>{viewsingleData.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Unit</Typography>
                  <Typography>{viewsingleData.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Name</Typography>
                  <Typography>{viewsingleData.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Emp Code</Typography>
                  <Typography>{viewsingleData.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Team</Typography>
                  <Typography>{viewsingleData.team}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Department</Typography>
                  <Typography>{viewsingleData.department}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Total Paid Days</Typography>
                  <Typography>{viewsingleData.totalpaiddays}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Month Point</Typography>
                  <Typography>{viewsingleData.monthpoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Day Point</Typography>
                  <Typography>{viewsingleData.daypoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Year</Typography>
                  <Typography>{viewsingleData.year}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Month</Typography>
                  <Typography>{viewsingleData.month}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={{ marginLeft: "15px" }}
              >
                Back
              </Button>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseModEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={6}>
              <Typography sx={userStyle.HeaderText}>
                Edit Minimum Points
              </Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
        </Box>
      </Dialog>
      <br />      {/* First table Details */}
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
        // filteredDataTwo={filteredDatasFilename ?? []}
        filteredDataTwo={rowDataTableFilename ?? []}
        itemsTwo={minimumPointFilenameArray ?? []}
        filename={"MinimumPoints"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefFilename}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openFileInfo}
        handleCloseinfo={handleCloseFileinfo}
        heading=" Minimum Points File Info"
        addedby={fileNameInfoCodeAddedBy}
      // updateby={infosingleFileData.updatedby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteFilenameList}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      {/* First Table End */}      {/* second table starts */}
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
        isFilterOpen={isFilterOpen2}
        handleCloseFilterMod={handleCloseFilterMod2}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen2}
        isPdfFilterOpen={isPdfFilterOpen2}
        setIsPdfFilterOpen={setIsPdfFilterOpen2}
        handleClosePdfFilterMod={handleClosePdfFilterMod2}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={minimumPointsArray ?? []}
        filename={"MinimumPoints File"}
        exportColumnNames={exportColumnNames2}
        exportRowValues={exportRowValues2}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading=" Minimum Points Data Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteSingleOpen}
        onClose={handleCloseSingleMod}
        onConfirm={deleteSingleList}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
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
      {/* second table ends */}      <br />    </Box>
  );
}

export default MinimumPoints;