import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Divider, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaDownload, FaFilePdf, FaTrash } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import SendToServer from "../../sendtoserver.js";
import "jspdf-autotable";
import axios from "axios";
import * as XLSX from "xlsx";
import { CsvBuilder } from "filefy";
import { SERVICE } from "../../../services/Baseservice.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import StyledDataGrid from "../../../components/TableStyle.js";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext.js";
import { AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../../components/Pagination.js';
import ExportData from "../../../components/ExportData.js";
import AlertDialog from "../../../components/Alert.js";
import MessageAlert from "../../../components/MessageAlert.js";
import InfoPopup from "../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading.js";

function TargetPoints() {
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

  let exportColumnNames2 = ['Company', 'Branch', 'Experience in Months', 'Process Code', 'Code', 'Points'];
  let exportRowValues2 = ['company', 'branch', 'experience', 'processcode', 'code', 'points'];

  let exportColumnNames = ['Company', 'Branch', 'Filename'];
  let exportRowValues = ['company', 'branch', 'filename'];

  const gridRef = useRef(null);
  const gridRefFilename = useRef(null);
  const [updateSheet, setUpdatesheet] = useState([])

  const [selectedRows, setSelectedRows] = useState([]);
  const [targetPoints, setTargetPoints] = useState([]);
  const [targetPointsFilename, setTargetPointsFilename] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("Please Select Company");
  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [targetpointsmanual, setTargetpointsmanual] = useState({ experience: "", processcode: "", code: "", points: "" });

  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");

  const [loading, setLoading] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [splitArray, setSplitArray] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [targetPointsData, setTargetPointsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  //SECOND DATATABLE
  const [pageFilename, setPageFilename] = useState(1);
  const [pageSizeFilename, setPageSizeFilename] = useState(10);
  const [itemsFilename, setItemsFilename] = useState([]);
  const [selectedRowsFilename, setSelectedRowsFilename] = useState([]);
  const [searchQueryFilename, setSearchQueryFilename] = useState("");
  const [isManageColumnsOpenFilename, setManageColumnsOpenFilename] = useState(false);
  const [anchorElFilename, setAnchorElFilename] = useState(null);
  const [selectAllCheckedFilename, setSelectAllCheckedFilename] = useState(false);
  const [searchQueryManageFilename, setSearchQueryManageFilename] = useState("");

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    experience: true,
    processcode: true,
    code: true,
    points: true,
    pointstable: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };
  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const username = isUserRoleAccess.username;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    // fetchTargetPointsData();
  };
  const handleCloseerrUpdate = () => {
    setIsErrorOpen(false);
    fetchEmployee();
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

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [openInfoFile, setOpeninfoFile] = useState(false);
  const handleClickOpeninfoFile = () => {
    setOpeninfoFile(true);
  };
  const handleCloseinfoFile = () => {
    setOpeninfoFile(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    setDeletefilenamedata([]);
  };

  //Delete single model
  const [isDeleteSingleOpen, setIsDeleteSingleOpen] = useState(false);
  const handleClickSingleOpen = () => {
    setIsDeleteSingleOpen(true);
  };
  const handleCloseSingleMod = () => {
    setIsDeleteSingleOpen(false);
    setDeletesingledata({});
  };

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
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const handleInputChangePoints = (e) => {
    // Check if the entered value is a number
    const regex = /^[0-9.]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setTargetpointsmanual({
        ...targetpointsmanual,
        points: e.target.value,
      });
    } else {
      setPopupContentMalert("Please Enter Numeric Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };
  const handleInputChangePointsEdit = (e) => {
    // Check if the entered value is a number
    const regex = /^[0-9.]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setEditsingleData({
        ...editsingleData,
        points: e.target.value,
      });
    } else {
      setPopupContentMalert("Please Enter Numeric Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };


  const [targetPointEditDup, setTargetPointEditDup] = useState([])

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployee = async () => {

    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];

    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.ALL_TARGETPOINTS_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        assignbranch: accessbranch
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setTargetPoints(itemsWithSerialNumber);
      setTargetPointEditDup(itemsWithSerialNumber.filter((item) => item._id !== editsingleData._id));
      let getFilenames = itemsWithSerialNumber.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setTargetPointsFilename(uniqueArray);

      setOverallFilterdata(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery, isEditOpen]);

  const [targetPointsArray, setTargetPointsArray] = useState([])
  const [targetPointsFilenameArray, setTargetPointsFilenameArray] = useState([])

  const fetchTargetPointsDataArray = async () => {

    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];

    setPageName(!pageName)
    try {
      let Res = await axios.post(SERVICE.TARGETPOINTSASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTargetPointsArray(Res?.data?.targetpoints);
      setTargetPointEditDup(Res?.data?.targetpoints.filter((item) => item._id !== editsingleData._id));
      let getFilenames = Res?.data?.targetpoints.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setTargetPointsFilenameArray(uniqueArray);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchTargetPointsDataArray()
  }, [isFilterOpen])

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = targetPoints.some((item) => item.company?.toLowerCase() === selectedCompany?.toLowerCase() &&

      item.branch?.toLowerCase() === selectedBranch?.toLowerCase() &&
      item.experience?.toLowerCase() === targetpointsmanual.experience?.toLowerCase() &&
      item.processcode?.toLowerCase() === targetpointsmanual.processcode?.toLowerCase() &&
      item.code?.toLowerCase() === targetpointsmanual.code?.toLowerCase() &&
      item.points?.toLowerCase() === targetpointsmanual.points?.toLowerCase()
    )

    if (selectedCompany === "Please Select Company" || selectedBranch === "Please Select Branch") {
      let alertMsg = selectedCompany === "Please Select Company" && selectedBranch === "Please Select Branch" ? "Please Select Company & Branch" : selectedCompany === "Please Select Company" ? "Please Select Company" : "Please Select Branch";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.experience === "") {
      setPopupContentMalert("Please Enter Experience");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (targetpointsmanual.points === "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const [isBtn, setIsBtn] = useState(false)

  //add function...
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.TARGETPOINT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        experience: String(targetpointsmanual.experience),
        experienceinmonths: String(targetpointsmanual.experienceinmonths),
        processcode: String(targetpointsmanual.processcode),
        code: String(targetpointsmanual.code),
        points: String(targetpointsmanual.points),
        branch: String(selectedBranch),
        company: String(selectedCompany),
        filename: "nonexcel",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchTargetPointsDataArray();
      await fetchEmployee();

      setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
    setSelectedCompany("Please Select Company");
    setSelectedBranch("Please Select Branch");
    setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //delete singledata functionality
  const [deletesingleData, setDeletesingledata] = useState();
  const rowDataSingleDelete = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // let getFilenames = Res?.data?.stargetpoints.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletesingledata(Res?.data?.stargetpoints);
      handleClickSingleOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const deleteSingleList = async () => {
    setLoader(true)
    let deleteSingleid = deletesingleData?._id;
    setPageName(!pageName)
    try {
      const deletePromises = await axios.delete(`${SERVICE.TARGETPOINT_SINGLE}/${deleteSingleid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseSingleMod();
      handleClickOpenerr();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setLoader(false)
      await fetchTargetPointsDataArray();
      await fetchEmployee();
    } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const deleteSingleBulkdataDelete = async () => {
    setLoader(true)
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.TARGETPOINT_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      handleClickOpenerr();
      setPage(1);
      await fetchTargetPointsDataArray();
      await fetchEmployee();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setLoader(false)
    } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //edit get data functionality single list
  const [editsingleData, setEditsingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
  const [viewsingleData, setviewsingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
  const [infosingleData, setinfosingleData] = useState({ experience: "", processcode: "", code: "", points: "" });

  const rowdatasingleedit = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEditsingleData(Res?.data?.stargetpoints);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const rowdatasingleview = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setviewsingleData(Res?.data?.stargetpoints);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [infosingleFileData, setinfosingleFileData] = useState([])

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setinfosingleFileData(Res?.data?.stargetpoints);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const rowdatasingleinfo = async (id) => {
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setinfosingleData(Res?.data?.stargetpoints);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();

    const isNameMatch = targetPointEditDup.some((item) => item.company?.toLowerCase() === editsingleData.company?.toLowerCase() &&

      item.branch?.toLowerCase() === editsingleData.branch?.toLowerCase() &&
      item.experience?.toLowerCase() === editsingleData.experience?.toLowerCase() &&
      item.processcode?.toLowerCase() === editsingleData.processcode?.toLowerCase() &&
      item.code?.toLowerCase() === editsingleData.code?.toLowerCase() &&
      item.points?.toLowerCase() === editsingleData.points?.toLowerCase()
    )
    if (editsingleData.experience === "") {
      setPopupContentMalert("Please Enter Experience");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editsingleData.points == "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };
  // let addedby = editsingleData.addedby;
  // let updateby = editsingleData.updatedby;

  const sendEditRequest = async () => {
    let editid = editsingleData._id;
    let updateby = editsingleData.updatedby;
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.TARGETPOINT_SINGLE}/${editid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        experience: String(editsingleData.experience),
        processcode: String(editsingleData.processcode),
        code: String(editsingleData.code),
        points: String(editsingleData.points ? editsingleData.points : ""),
        updatedby: [
          {
            ...updateby,
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchTargetPointsDataArray();
      await fetchEmployee();
      handleCloseModEdit();
      setEditsingleData({ ...editsingleData, experience: "", processcode: "", code: "", points: "" });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "TargetPoints.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Target Points",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = targetPoints?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [targetPoints]);

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
  const filteredDatas = overallFilterdata?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
            setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
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
      width: 180,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "experience",
      headerName: "Experince in Months",
      flex: 0,
      width: 180,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.processcode,
      headerClassName: "bold-header",
    },
    {
      field: "code",
      headerName: "Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.code,
      headerClassName: "bold-header",
    },
    {
      field: "pointstable",
      headerName: "Points",
      flex: 0,
      width: 150,
      hide: !columnVisibility.pointstable,
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
          {isUserRoleCompare?.includes("etargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleedit(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtargetpoints") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataSingleDelete(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleview(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("itargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleinfo(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      experience: item.experience,
      company: item.company,
      branch: item.branch,
      processcode: item.processcode,
      code: item.code,
      points: item.points,
      pointstable: Number(item.points),
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

  //SECOND TABLE FDATA AND FUNCTIONS

  const [deleteFilenameData, setDeletefilenamedata] = useState([]);
  const rowDatafileNameDelete = async (filename) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.TARGETPOINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.targetpoints.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletefilenamedata(getFilenames);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const deleteFilenameList = async () => {
    setLoader(true)
    setPageName(!pageName)
    try {
      const deletePromises = await axios.post(
        SERVICE.TARGETPOINTSDELETE_BULK,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: deleteFilenameData,
        }

      );
      if (deletePromises?.data?.success) {

        // await Promise.all(deletePromises?.data?.success);
        await fetchTargetPointsDataArray();
        await fetchEmployee();
        handleCloseMod();
        handleClickOpenerr();
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setLoader(false)
      }
    } catch (err) {
      setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Manage Columns
  const handleOpenManageColumnsFilename = (event) => {
    setAnchorElFilename(event.currentTarget);
    setManageColumnsOpenFilename(true);
  };
  const handleCloseManageColumnsFilename = () => {
    setManageColumnsOpenFilename(false);
    setSearchQueryManageFilename("");
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityFilename = {
    serialNumber: true,
    checkbox: true,
    branch: true,
    company: true,

    filename: true,
    uploaddate: true,
    actions: true,
  };
  const [columnVisibilityFilename, setColumnVisibilityFilename] = useState(initialColumnVisibilityFilename);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityFilename");
    if (savedVisibility) {
      setColumnVisibilityFilename(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityFilename", JSON.stringify(columnVisibilityFilename));
  }, [columnVisibilityFilename]);

  const handleSelectionChangeFilename = (newSelection) => {
    setSelectedRowsFilename(newSelection.selectionModel);
  };

  //image
  const handleCaptureImageFilename = () => {
    if (gridRefFilename.current) {
      html2canvas(gridRefFilename.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "TargetPoints.png");
        });
      });
    }
  };
  //print...
  const componentRefFilename = useRef();
  const handleprintFilename = useReactToPrint({
    content: () => componentRefFilename.current,
    documentTitle: "Target Points",
    pageStyle: "print",
  });

  //serial no for listing itemsFilename
  const addSerialNumberFilename = () => {
    const itemsWithSerialNumber = targetPointsFilename?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsFilename(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberFilename();
  }, [targetPointsFilename]);

  //Datatable
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
  };

  // Split the search query into individual terms
  const searchTermsFilename = searchQueryFilename.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasFilename = itemsFilename?.filter((item) => {
    return searchTermsFilename.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const FilenameFilename = filteredDatasFilename?.slice((pageFilename - 1) * pageSizeFilename, pageFilename * pageSizeFilename);
  const totalPagesFilename = Math.ceil(filteredDatasFilename?.length / pageSizeFilename);
  const visiblePagesFilename = Math.min(totalPagesFilename, 3);
  const firstVisiblePageFilename = Math.max(1, pageFilename - 1);
  const lastVisiblePageFilename = Math.min(firstVisiblePageFilename + visiblePagesFilename - 1, totalPagesFilename);

  const pageNumbersFilename = [];
  for (let i = firstVisiblePageFilename; i <= lastVisiblePageFilename; i++) {
    pageNumbersFilename.push(i);
  }

  const CheckboxHeaderFilename = ({ selectAllCheckedFilename, onSelectAll }) => (
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
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsFilename.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsFilename.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsFilename.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRowsFilename, params.row.id];
            }
            setSelectedRowsFilename(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedFilename(updatedSelectedRows.length === FilenameFilename.length);
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
      hide: !columnVisibilityFilename.name,
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
          {isUserRoleCompare?.includes("dtargetpoints") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDatafileNameDelete(params.row.filename);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}

          {isUserRoleCompare?.includes("itargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfoFile();
                getinfoCode(params.row._id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableFilename = FilenameFilename.map((item, index) => {
    return {
      id: item.serialNumber,
      _id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      filename: item.filename,
      uploaddate: item.lastupdated,
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
  const filteredColumnsFilename = columnDataTableFilename.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFilename.toLowerCase()));
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFilename} onChange={(e) => setSearchQueryManageFilename(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFilename.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFilename[column.field]} onChange={() => toggleColumnVisibilityFilename(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFilename(initialColumnVisibilityFilename)}>
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
  );

  // page refersh reload
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
  const readExcel = (file) => {
    if (!(file instanceof Blob)) {
      // Handle the case when the file is not a Blob
      return;
    }

    if (selectedCompany === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
      return;
    }

    if (selectedBranch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
      return;
    }

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      // Check for empty file
      if (data.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"The uploaded file is empty."}</p>
          </>
        );
        handleClickOpenerr();
        return;
      }
      // Check for required columns
      const requiredColumns = ["Experience In Months", "Process Code", "Code", "Points"];
      const missingColumns = requiredColumns.filter(col => !(col in data[0]));

      if (missingColumns.length > 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Missing required columns: ${missingColumns.join(", ")}`}</p>
          </>
        );
        handleClickOpenerr();
        return;
      }

      const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

      const seenKeys = new Set();
      const uniqueArray = data.filter((item) => {
        const key = `${selectedCompany}-${selectedBranch}-${item["Experience In Months"]}-${item.Code}-${item["Process Code"]}-${item.Points}`;
        const isDuplicate = seenKeys.has(key) || targetPointsArray.some((tp) =>
          tp.company === selectedCompany &&
          tp.branch === selectedBranch &&
          tp.experience == item["Experience In Months"] &&
          // tp.processcode == item.Code + item["Process Code"] &&
          tp.processcode == item["Process Code"] &&
          tp.code == item.Code &&
          tp.points == item.Points
        );

        if (!isDuplicate && !isNaN(item.Points)) {
          seenKeys.add(key);
          return true;
        }
        return false;
      });

      const dataArray = uniqueArray.map((item) => ({
        experience: item["Experience In Months"],
        experienceinmonths: item["Process Code"],
        // processcode: item.Code + item["Process Code"],
        processcode: item["Process Code"],
        code: item.Code,
        points: item.Points,
        filename: file.name,
        branch: selectedBranch,
        company: selectedCompany,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: new Date().toISOString(),
          },
        ],
      }));
      setUpdatesheet([])


      const subarraySize = 1000;
      const splitedArray = [];

      for (let i = 0; i < dataArray.length; i += subarraySize) {
        const subarray = dataArray.slice(i, i + subarraySize);
        splitedArray.push(subarray);
      }

      setSplitArray(splitedArray);

      // Display alert if any duplicate data or non-numeric points were removed
      if (uniqueArray.length !== data.length) {
        const duplicateCount = data.length - uniqueArray.length;
        setPopupContentMalert(`${duplicateCount} Duplicate data and/or Points field Not a number data's removed`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }).catch((error) => {
      console.error("Error reading file:", error);
    });
  };

  const getSheetExcel = () => {
    if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === "")) {
      setPopupContentMalert("Please Upload a file");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      }));

      setSheets(getsheets);
    }
  };

  const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata?.filter((item) => !targetPointsArray.some((tp) => tp.company === selectedCompany
      && tp.branch === selectedBranch && tp.experience == item.experience
      && tp.processcode == item.processcode && tp.code == item.code && tp.points == item.points));
    // Ensure that items is an array of objects before sending
    if (selectedSheet === "Please Select Sheet") {
      setPopupContentMalert(fileUploadName === "" ? "Please Upload File" : selectedSheet === "Please Select Sheet" ? "Please Select Sheet" : "No data to upload");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCompany === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
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
        xmlhttp.open("POST", SERVICE.TARGETPOINT_CREATE);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(uniqueArray));
        await fetchTargetPointsDataArray();
        await fetchEmployee();
      } catch (err) {
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectedSheet("Please Select Sheet");
        setSelectedSheetindex(-1)
        setUpdatesheet(prev => [...prev, selectedSheetindex])

        await fetchEmployee();
        await fetchTargetPointsDataArray();

      }
    }
  };

  const clearFileSelection = () => {
    setUpdatesheet([])
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;

  const ExportsHead = () => {
    let fileDownloadName = "Filename_" + selectedBranchCode + "_" + today;
    if (selectedCompany === "Please Select Company" || selectedBranch === "Please Select Branch") {
      let alertMsg = selectedCompany === "Please Select Company" && selectedBranch === "Please Select Branch" ? "Please Select Company & Branch" : selectedCompany === "Please Select Company" ? "Please Select Company" : "Please Select Branch";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      new CsvBuilder(fileDownloadName).setColumns(["Experience In Months", "Process Code", "Code", "Points"], []).exportFile();
    }
  };

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"TARGET POINTS"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Target Points"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Target Points"
        subpagename=""
        subsubpagename=""
      />


      {isUserRoleCompare?.includes("atargetpoints") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Target Points</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    placeholder="Please Select Branch"
                    value={{ label: selectedCompany, value: selectedCompany }}
                    onChange={(e) => {
                      setSelectedCompany(e.value);
                      setSelectedBranch("Please Select Branch");
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={isAssignBranch?.filter(
                      (comp) =>
                        selectedCompany === comp.company
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    placeholder="Please Select Branch"
                    value={{ label: selectedBranch, value: selectedBranch }}
                    onChange={(e) => {
                      setSelectedBranch(e.value);
                      setSelectedBranchCode(e.codeval);
                      setFileUploadName("");
                      setSplitArray([]);
                      setDataupdated("");
                      setSheets([]);
                      setSelectedSheet("Please Select Sheet");
                      setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });

                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <Button variant="contained" color="success" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()}>
                  <FaDownload />
                  &ensp;Download template file
                </Button>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={6} marginTop={3}>
                <Grid container spacing={2}>
                  <Grid item md={4.5} xs={12} sm={6}>
                    <Button variant="contained" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} component="label" sx={{ textTransform: "capitalize" }}>
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
                          e.target.value = null;
                        }}
                      />
                    </Button>
                  </Grid>
                  <Grid item md={6.5} xs={12} sm={6}>
                    {fileUploadName != "" && splitArray.length > 0 ? (
                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <p>{fileUploadName}</p>
                        <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
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
                    <Button variant="contained" color="primary" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} onClick={getSheetExcel} sx={{ textTransform: "capitalize" }}>
                      Get Sheet
                    </Button>
                  </Grid>
                  <Grid item md={5} xs={12} sm={4}>
                    <Typography>(Or)</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography> Experience in Months<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        placeholder="Please Enter Experience"
                        value={targetpointsmanual.experience}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            experience: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Process Code<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Process Code"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.processcode}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            processcode: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Code<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Code"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.code}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            code: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Points"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.points}
                        onChange={(e) => {
                          handleInputChangePoints(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <br />
            <Box>
              <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                {!loading ? (
                  fileUploadName != "" && splitArray.length > 0 ? (
                    <>
                      <div readExcel={readExcel}>
                        <SendToServer sendJSON={sendJSON} />
                      </div>
                    </>
                  ) : (
                    <Button variant="contained" onClick={handleSubmit} disabled={isBtn}>
                      Submit
                    </Button>
                  )
                ) : (
                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                  >
                    <span>Send</span>
                  </LoadingButton>
                )}

                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  CLEAR
                </Button>
              </Grid>
            </Box>
          </>
        </Box>
      )}

      <br /> <br />
      {/* ****** Table Start ****** */}
      {loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("ltargetpoints") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Upload File List</Typography>
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
                        onChange={handlePageSizeChange}
                        sx={{ width: "77px" }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        {/* <MenuItem value={targetPoints?.length}>All</MenuItem> */}
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
                      {isUserRoleCompare?.includes("exceltargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            fetchTargetPointsDataArray()
                            setFormat("xl")
                          }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvtargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            fetchTargetPointsDataArray()
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printtargetpoints") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdftargetpoints") && (
                        <>
                          <Button sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true)
                              fetchTargetPointsDataArray()
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imagetargetpoints") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <Box>
                      <FormControl fullWidth size="small">
                        <Typography>Search</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={searchQueryFilename} onChange={handleSearchChangeFilename} />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFilename}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFilename}>
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxesFilename} columns={columnDataTableFilename.filter((column) => columnVisibilityFilename[column.field])} onSelectionModelChange={handleSelectionChangeFilename} selectionModel={selectedRowsFilename} autoHeight={true} ref={gridRefFilename} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {FilenameFilename.length > 0 ? (pageFilename - 1) * pageSizeFilename + 1 : 0} to {Math.min(pageFilename * pageSizeFilename, filteredDatasFilename?.length)} of {filteredDatasFilename?.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageFilename(1)} disabled={pageFilename === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(pageFilename - 1)} disabled={pageFilename === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersFilename?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={pageFilename === pageNumber ? "active" : ""} disabled={pageFilename === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePageFilename < totalPagesFilename && <span>...</span>}
                    <Button onClick={() => handlePageChange(pageFilename + 1)} disabled={pageFilename === totalPagesFilename} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageFilename(totalPagesFilename)} disabled={pageFilename === totalPagesFilename} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
                {/* ****** Table End ****** */}
              </Box>
            </>
          )}</>)}
      {/* ****** Table End ****** */}
      <br /> <br />
      {/* ****** Table Start ****** */}
      {loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("ltargetpoints") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Upload Data List</Typography>
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
                        {/* <MenuItem value={targetPoints?.length}>All</MenuItem> */}
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
                      {isUserRoleCompare?.includes("exceltargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen2(true)
                            fetchTargetPointsDataArray()
                            setFormat("xl")
                          }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvtargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen2(true)
                            fetchTargetPointsDataArray()
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printtargetpoints") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdftargetpoints") && (
                        <>
                          <Button sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen2(true)
                              fetchTargetPointsDataArray()
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imagetargetpoints") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                        </Button>
                      )}
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
                {isUserRoleCompare?.includes("bdtargetpoints") && (
                  <Button variant="contained" color="error" size="small" onClick={handleClickOpenalert} sx={{ textTransform: "capitalize" }}>
                    Bulk Delete
                  </Button>)}
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
                <Box>
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalPages={searchQuery !== "" ? 1 : totalPages}
                    onPageChange={handlePageChange}
                    pageItemLength={filteredDatas?.length}
                    totalProjects={
                      searchQuery !== "" ? filteredDatas?.length : totalProjects
                    }
                  />
                </Box>

                {/* ****** Table End ****** */}
              </Box>
            </>
          )}</>)}

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={6}>
              <Typography sx={userStyle.HeaderText}>View Target Points</Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Company</Typography>
                <Typography>{viewsingleData.company}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Branch</Typography>
                <Typography>{viewsingleData.branch}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Experience in Months</Typography>
                <Typography>{viewsingleData.experience}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Code</Typography>
                <Typography>{viewsingleData.processcode}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Code</Typography>
                <Typography>{viewsingleData.code}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Points</Typography>
                <Typography>{viewsingleData.points}</Typography>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseview}>
            Back
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit DIALOG */}
      <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={6}>
              <Typography sx={userStyle.HeaderText}>Edit Target Points</Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <Typography variant="h6">Company</Typography>
              <Typography>{editsingleData.company}</Typography>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <Typography variant="h6">Branch</Typography>
              <Typography>{editsingleData.branch}</Typography>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Experience<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Experience"
                  value={editsingleData.experience}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      experience: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Process Code<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Process Code"
                  value={editsingleData.processcode}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      processcode: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Code<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Code"
                  value={editsingleData.code}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      code: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Points"
                  value={editsingleData.points}
                  onChange={(e) => {
                    handleInputChangePointsEdit(e);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={editSubmit}>
            Update
          </Button>
          <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
            Cancel
          </Button>
        </DialogActions>
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
      <br />
      {/* First table Details */}
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
        filteredDataTwo={filteredDatasFilename ?? []}
        itemsTwo={targetPointsFilenameArray ?? []}
        filename={"TargetPoints"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefFilename}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfoFile}
        handleCloseinfo={handleCloseinfoFile}
        heading="Upload File Info"
        addedby={infosingleFileData.addedby}
        updateby={infosingleFileData.updatedby}
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
      {/* <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteFilenameList}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}

      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* First Table End */}

      {/* second table starts */}
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
        filteredDataTwo={filteredDatas ?? []}
        itemsTwo={targetPointsArray ?? []}
        filename={"TargetPoints"}
        exportColumnNames={exportColumnNames2}
        exportRowValues={exportRowValues2}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Target Points Info"
        addedby={infosingleData.addedby}
        updateby={infosingleData.updatedby}
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
        onConfirm={deleteSingleBulkdataDelete}
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
      {/* second table ends */}

      <br />

    </Box>
  );
}

export default TargetPoints;