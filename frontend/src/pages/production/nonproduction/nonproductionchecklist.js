import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import {
  Box,
  Button,
  Chip,
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
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import { PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment-timezone";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const ActionCell = ({ params, fetchBatchFilter }) => {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const { auth } = useContext(AuthContext);

  const handleUpdateStatus = async (id) => {

    try {
      let res = await axios.put(`${SERVICE.NONPRODUCTION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        approvestatus: true,
        
      });
      await fetchBatchFilter();
    } catch (err) {
      console.log(err, "errer");
    }
  };

  const handleRejectStatus = async (id, reasonstatus) => {
    try {
      let res = await axios.put(`${SERVICE.NONPRODUCTION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        approvestatus: false,
        rejectreason: reasonstatus,
      });
      await fetchBatchFilter();
    } catch (err) {
      console.log(err, "errer");
    }
  };

  const handleRejectClick = () => {
    setShowReject(true);

    // optionally call setRejectid here if needed globally
  };

  const handleConfirmReject = () => {
    // Handle reject logic with `params.data.id` and `reason`
    handleRejectStatus(params.data.id, reason); // You might pass ID and reason
    setShowReject(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6} md={6}>
        <Button variant="contained" size="small" onClick={() => handleUpdateStatus(params.data.id)}>
          Approved
        </Button>
        &ensp;&ensp;
        <Button variant="contained" size="small" color="error" onClick={handleRejectClick}>
          Reject
        </Button>
      </Grid>

      {showReject && (
        <>
        <Grid item xs={12} md={12} sx={{display:"flex"}}>

          <TextareaAutosize
            minRows={4}
            placeholder="Please Enter Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "200px",
            //   width: "100%",
            //   maxWidth: "500px",
            }}
          />&ensp;
          <Box sx={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <Button variant="contained"  size="small" color="error" onClick={handleConfirmReject}>
            Ok
          </Button>
          <Button variant="contained"  size="small" color="error" onClick={() => setShowReject(false)}>
            Cancel
          </Button>
          </Box>
        </Grid>
      
          </>
      )}
    </Grid>
  );
};

function Nonproductionchecklist() {
  const [selectedTable, setSelectedTable] = useState([]);
  const [valueTable, setValueTable] = useState([]);
  const [tableCheck, setTableCheck] = useState([]);
  const [loader, setLoader] = useState(false);

  const [rejectpopup, setRejectPopup] = useState([]);
  const [rejectid, setRejectid] = useState([]);
  const [isusercompleted, setisusercompleted] = useState([]);

  const [loaderList, setLoaderList] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [loginIdOptFilter, setClientLoginIDOptFilter] = useState([]);

  const [selectProjectVendor, setSelectedProjectVendor] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedSLoginId, setSelectedLoginId] = useState([]);
  const [errorType, setErrorType] = useState([]);
  const [errorReason, setErrorReason] = useState([]);
  const [errormode, setErrormode] = useState([]);
  const [status, setStatus] = useState([]);
  const [viewsingleData, setviewsingleData] = useState({
    projectvendor: "",
    process: "",
    loginid: "",
    date: "",
    errorfilename: "",
    documentnumber: "",
    documenttype: "",
    filename: "",
    fieldname: "",
    line: "",
    errorvalue: "",
    correctvalue: "",
    link: "",
    doclink: "",
  });

  const [managetypepgState, setManagetypepgState] = useState({
    process: "Please Select Process",
    errortype: "Please Select Error Type",
    errortypepost: "Please Select Error Type",
    errortypestatus: "Error Status",
    reason: "Please Select Reason",
    errorseverity: "",
    explanation: "",
    status: "",
  });

  const [editsingleData, setEditsingleData] = useState({
    fromdate: "",
    todate: "",
    projectvendor: "",
    process: "",
    loginid: "",
    date: "",
    errorfilename: "",
    documentnumber: "",
    documenttype: "",
    filename: "",
    fieldname: "",
    mode: "",
    line: "",
    errorvalue: "",
    correctvalue: "",
    link: "",
    doclink: "",
  });

  const [selectedMode, setSelectedMode] = useState("Time");

  const mode = [
    { label: "Time", value: "Time" },
    { label: "Count", value: "Count" },
  ];

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [fromdate, setFromdate] = useState(today);
  const [todate, setTodate] = useState(today);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
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

  // const exportColumnNames = [
  //     "Name", "Category Name", "Unit",
  //     'Project Vendor', 'Process',
  //     'Login ID', 'Date',
  //     'Error File Name', 'Document Number',
  //     'Document type', 'Field Name',
  //     'Line', 'Error Value',
  //     'Correct value', 'Link',
  //     'Doc Link', "Entry Creation", "Mode", "Manual Completed", "Supervisor Completed"
  // ]
  // const exportRowValues = [
  //     "name", "branch", "unit",
  //     'projectvendor', 'process',
  //     'loginid', 'date',
  //     'errorfilename', 'documentnumber',
  //     'documenttype', 'fieldname',
  //     'line', 'errorvalue',
  //     'correctvalue', 'link',
  //     'doclink', 'mode', 'errormode', 'manaulerrorcheck', 'erroruploadconfirmcheck'
  // ]

//   const exportColumnNamescom = [
//     "Employee Name",
//     "Branch",
//     "Unit",
//     "Project Vendor",
//     "Process",
//     "Login ID",
//     "Date",
//     "Error File Name",
//     "Document Number",
//     "Document type",
//     "Field Name",
//     "Line",
//     "Error Value",
//     "Correct value",
//     "Link",
//     "Doc Link",
//     "Entry Creation",
//     "Mode",
//     "Status",
//     "Manual Completed",
//     "Supervisor Completed",
//   ];
//   const exportRowValuescom = [
//     "name",
//     "branch",
//     "unit",
//     "projectvendor",
//     "process",
//     "loginid",
//     "date",
//     "errorfilename",
//     "documentnumber",
//     "documenttype",
//     "fieldname",
//     "line",
//     "errorvalue",
//     "correctvalue",
//     "link",
//     "doclink",
//     "mode",
//     "errormode",
//     "status",
//     "manaulerrorcheck",
//     "erroruploadconfirmcheck",
//   ];

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
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);

  //completed
  const [filteredRowDatacom, setFilteredRowDatacom] = useState([]);
  const [filteredChangescom, setFilteredChangescom] = useState(null);
  const [isHandleChangecom, setIsHandleChangecom] = useState(false);
  const [searchedStringcom, setSearchedStringcom] = useState("");
  const gridRefTablecom = useRef(null);
  const gridRefTableImgcom = useRef(null);

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
          saveAs(blob, "Validation Error Entry List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleCaptureImagecom = () => {
    if (gridRefTableImgcom.current) {
      domtoimage
        .toBlob(gridRefTableImgcom.current)
        .then((blob) => {
          saveAs(blob, "Invalid/Valid Updated List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const [searchQueryManagecom, setSearchQueryManagecom] = useState("");
  const [searchQuerycom, setSearchQuerycom] = useState("");

  const [isFilterOpencom, setIsFilterOpencom] = useState(false);
  const [isPdfFilterOpencom, setIsPdfFilterOpencom] = useState(false);

  // page refersh reload
  const handleCloseFilterModcom = () => {
    setIsFilterOpencom(false);
  };

  const handleClosePdfFilterModcom = () => {
    setIsPdfFilterOpencom(false);
  };

  const componentRefcom = useRef();
  const handleprintcom = useReactToPrint({
    content: () => componentRefcom.current,
    documentTitle: "Invalid/Valid Updated List",
    pageStyle: "print",
  });

  const [pagecom, setPagecom] = useState(1);
  const [pageSizecom, setPageSizecom] = useState(10);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
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
    name: true,
    category: true,
    subcategory: true,
    date: true,
    alloteddays: true,
    allotedhours: true,
    allotedminutes: true,
    days: true,
    hours: true,
    minutes: true,
    count: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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

  //Edit model...
  const [isEditOpenError, setIsEditOpenError] = useState(false);
  const handleClickOpenEditError = () => {
    setIsEditOpenError(true);
  };
  const handleCloseModEditError = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenError(false);
    setManagetypepgState({
      ...managetypepgState,
      process: "Please Select Process",
      errortype: "Please Select Error Type",
      errortypepost: "Please Select Error Type",
      errortypestatus: "Error Status",
      reason: "Please Select Reason",
      errorseverity: "",
      explanation: "",
      status: "",
    });
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Project updateby edit page...
  let updateby = editsingleData.updatedby;
  let addedby = editsingleData.addedby;

  const [updateCounts, setUpdateCounts] = useState({}); // Track update counts

  //editing the single data...
  const sendEditRequest = async () => {
    let projectsid = editsingleData._id;
    setPageName(!pageName);
    let currentCount = updateCounts[projectsid] ? updateCounts[projectsid] : 1;
    console.log(currentCount, "currentCount");
    if (currentCount > 4) {
      setPopupContentMalert(`Update for should not exceed 4 times`);
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
      return;
    }
    try {
      if (editsingleData.mode == "Bulkupload" || editsingleData.mode == "Bulkkeying") {
        let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          projectvendor: String(editsingleData.projectvendor),
          process: String(editsingleData.process),
          loginid: String(editsingleData.loginid),
          date: String(editsingleData.date),
          errorfilename: String(editsingleData.errorfilename),
          documentnumber: String(editsingleData.documentnumber),
          documenttype: String(editsingleData.documenttype),
          fieldname: String(editsingleData.fieldname),
          line: String(editsingleData.line),
          errorvalue: String(editsingleData.errorvalue),
          correctvalue: String(editsingleData.correctvalue),
          link: String(editsingleData.link),
          doclink: String(editsingleData.doclink),
          validatestatus: true,
          errorseverity: String(errormode),
          editedcount: currentCount,
          updatedby: [
            {
              ...updateby,
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });

        setUpdateCounts((prevCounts) => ({
          ...prevCounts,
          [projectsid]: currentCount + 1,
        }));

        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchBatchFilter();
      } else {
        let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          projectvendor: String(editsingleData.projectvendor),
          process: String(editsingleData.process),
          loginid: String(editsingleData.loginid),
          date: String(editsingleData.date),
          errorfilename: String(editsingleData.errorfilename),
          documentnumber: String(editsingleData.documentnumber),
          documenttype: String(editsingleData.documenttype),
          fieldname: String(editsingleData.fieldname),
          line: String(editsingleData.line),
          errorvalue: String(editsingleData.errorvalue),
          correctvalue: String(editsingleData.correctvalue),
          link: String(editsingleData.link),
          doclink: String(editsingleData.doclink),
          validatestatus: true,
          editedcount: currentCount,
          errorseverity: String(errormode),
          updatedby: [
            {
              ...updateby,
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchBatchFilter();

      setUpdateCounts((prevCounts) => ({
        ...prevCounts,
        [projectsid]: currentCount + 1,
      }));

      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    if (editsingleData.projectvendor === "") {
      setPopupContentMalert("Please Select Project Vendor");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.process === "") {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.loginid === "Please Select Login ID") {
      setPopupContentMalert("Please Select Login ID");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.date == "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.errorfilename == "") {
      setPopupContentMalert("Please Enter Error File Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.documentnumber == "") {
      setPopupContentMalert("Please Enter Document Number");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.documenttype == "") {
      setPopupContentMalert("Please Enter Document Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.fieldname == "") {
      setPopupContentMalert("Please Enter Field Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.line == "") {
      setPopupContentMalert("Please Enter Line");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.errorvalue == "") {
      setPopupContentMalert("Please Enter Error Value");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.correctvalue == "") {
      setPopupContentMalert("Please Enter Correct Value");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.link == "") {
      setPopupContentMalert("Please Enter Link");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (editsingleData.doclink == "") {
      setPopupContentMalert("Please Enter Doc Link");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  const sendEditRequestErrorLoad = async () => {
    let projectsid = viewsingleData._id;
    setPageName(!pageName);
    try {
      if (viewsingleData.mode == "Bulkupload" || viewsingleData.mode == "Bulkkeying") {
        let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          projectvendor: String(viewsingleData.projectvendor),
          process: String(viewsingleData.process),
          loginid: String(viewsingleData.loginid),
          date: String(viewsingleData.date),
          errorfilename: String(viewsingleData.errorfilename),
          documentnumber: String(viewsingleData.documentnumber),
          documenttype: String(viewsingleData.documenttype),
          fieldname: String(viewsingleData.fieldname),

          line: String(viewsingleData.line),
          errorvalue: String(viewsingleData.errorvalue),
          correctvalue: String(viewsingleData.correctvalue),
          link: String(viewsingleData.link),
          doclink: String(viewsingleData.doclink),
          errortype: String(managetypepgState.errortype),
          reason: String(managetypepgState.reason),
          explanation: String(managetypepgState.explanation),
          status: String(managetypepgState.errortypepost),
          errorseverity: String(errormode),

          validatestatus: true,

          updatedby: [
            {
              ...updateby,
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        setPopupContent("Saved Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        await fetchBatchFilter();
      } else {
        let reserror = await axios.put(`${SERVICE.PENALTYERRORUPLOADS_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          projectvendor: String(viewsingleData.projectvendor),
          process: String(viewsingleData.process),
          loginid: String(viewsingleData.loginid),
          date: String(viewsingleData.date),
          errorfilename: String(viewsingleData.errorfilename),
          documentnumber: String(viewsingleData.documentnumber),
          documenttype: String(viewsingleData.documenttype),
          fieldname: String(viewsingleData.fieldname),

          line: String(viewsingleData.line),
          errorvalue: String(viewsingleData.errorvalue),
          correctvalue: String(viewsingleData.correctvalue),
          link: String(viewsingleData.link),
          doclink: String(viewsingleData.doclink),

          //validation

          errortype: String(managetypepgState.errortype),
          reason: String(managetypepgState.reason),
          explanation: String(managetypepgState.explanation),
          status: String(managetypepgState.errortypepost),
          errorseverity: String(errormode),
          validatestatus: true,

          updatedby: [
            {
              ...updateby,
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchBatchFilter();

      setPopupContent("Saved Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEditError();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmitErrorLoad = async (e) => {
    e.preventDefault();

    if (managetypepgState.errortype == "Please Select Error Type") {
      setPopupContentMalert("Please Select Error Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (managetypepgState.reason == "Please Select Reason") {
      setPopupContentMalert("Please Select Error Reason");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (managetypepgState.explanation == "") {
      setPopupContentMalert("Please Enter Explanation To Avoid");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequestErrorLoad();
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Validation Error Entry List",
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
    addSerialNumber(filterList);
  }, [filterList]);

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

  console.log(rejectid, "rejectid");

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category Name",
      flex: 0,
      width: 130,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 130,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "alloteddays",
      headerName: "Allot Days",
      flex: 0,
      width: 130,

      hide: !columnVisibility.alloteddays,
      headerClassName: "bold-header",
    },
    {
      field: "allotedhours",
      headerName: "Allot Hours",
      flex: 0,
      width: 130,
      hide: !columnVisibility.allotedhours,
      headerClassName: "bold-header",
    },
    {
      field: "allotedminutes",
      headerName: "Allot Mins",
      flex: 0,
      width: 130,
      hide: !columnVisibility.allotedminutes,
      headerClassName: "bold-header",
    },
    {
      field: "days",
      headerName: "Days",
      flex: 0,
      width: 150,
      hide: !columnVisibility.days,
      headerClassName: "bold-header",
    },
    {
      field: "hours",
      headerName: "Hours",
      flex: 0,
      width: 140,
      hide: !columnVisibility.hours,
      headerClassName: "bold-header",
    },
    {
      field: "minutes",
      headerName: "Minutes",
      flex: 0,
      width: 150,
      hide: !columnVisibility.minutes,
      headerClassName: "bold-header",
    },
    {
      field: "count",
      headerName: "Count",
      flex: 0,
      width: 150,
      hide: !columnVisibility.count,
      headerClassName: "bold-header",
    },

    //         {
    //             field: "actions",
    //             headerName: "Action",
    //             flex: 0,
    //             width: 700,
    //             minHeight: "40px !important",
    //             sortable: false,
    //             hide: !columnVisibility.actions,
    //             headerClassName: "bold-header",
    //             cellRenderer: (params) => (

    //                 <Grid container>
    //                     <Grid item sx={6} md={6}>
    //                    <Button variant="contained" size="small" onClick={handleUpdateStatus}>Approved</Button>&ensp;&ensp;
    //                    <Button variant="contained" size="small" color="error" onClick={(e) => setRejectid(prev => [...prev, params.data.id])}>Reject</Button>
    // </Grid>
    // <Grid item sx={6} md={6}></Grid>
    // <Grid item sx={6} md={6}>
    //                 {   rejectid.includes(params.data.id) &&
    //                 <>
    //    <TextareaAutosize
    //                                                          aria-label="minimum height"
    //                                                          minRows={5}
    //                                                          min
    //                                                          placeholder="Please Enter Reason"
    //                                                          value={rejectpopup[params.data.id]}
    //                                                          onChange={(e) => {
    //                                                              setRejectPopup({
    //                                                                  ...rejectpopup,
    //                                                                  [params.data.id]: e.target.value,
    //                                                              });
    //                                                          }}
    //                                                         //  onPaste={(e) => {
    //                                                         //      e.preventDefault();
    //                                                         //      setPopupContentMalert("Pasting is not allowed in this field!");
    //                                                         //      setPopupSeverityMalert("info");
    //                                                         //      handleClickOpenPopupMalert();
    //                                                         //  }}
    //                                                          style={{
    //                                                              minWidth: "300px", // Set minimum width
    //                                                              width: "100%", // Allow responsiveness
    //                                                              maxWidth: "500px", // Optional maximum width
    //                                                          }}
    //                                                      />
    //                                                            <Button variant="contained"size="small" color="error" onClick={handleRejectStatus}>Confirm</Button>
    //                                                            </>
    //                                                         }
    //                 </Grid>
    //                 </Grid>
    //             ),
    //         },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 400,
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => <ActionCell params={params} fetchBatchFilter={fetchBatchFilter} />,
    },
  ];

  const exportColumnNames = columnDataTable.map((d) => d.headerName).filter((t) => t != "Action" && t != "SNo");

  const exportRowValues = columnDataTable.map((d) => d.field).filter((t) => t != "action" && t != "serialNumber");

  function formatDate(dateString) {
    if (!dateString) {
      return ""; // Return an empty string or handle the error as needed
    }
    const dateParts = dateString.split("-");
    if (dateParts.length !== 3) {
      return ""; // Return an empty string or handle the error as needed
    }
    const formattedDay = dateParts[0]?.padStart(2, "0");
    const formattedMonth = dateParts[1]?.padStart(2, "0");
    const formattedYear = dateParts[2];
    return `${formattedDay}-${formattedMonth}-${formattedYear}`;
  }

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      errormode: item.errormode,
      name: item.name,
      olddate: item.olddate,
      branch: item.branch,
      unit: item.unit,
      projectvendor: item.projectvendor,
      process: item.process,
      loginid: item.loginid,
      date: item.date,
      errorfilename: item.errorfilename,
      documentnumber: item.documentnumber,
      documenttype: item.documenttype,
      fieldname: item.fieldname,
      line: item.line,
      errorvalue: item.errorvalue,
      status: item.status,
      correctvalue: item.correctvalue,
      link: item.link,
      doclink: item.doclink,
      mode: item.mode,
      greentext: item.greentext,
      validatestatus: item.validatestatus,
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
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
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
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  const [fileFormat, setFormat] = useState("");

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Validation Error Entry"),
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

  const fetchBatchFilter = async () => {
    setFilterList([]);
    setLoaderList(true);
    setLoader(true);
    try {
      let [res_employee, res_completed] = await Promise.all([
        axios.post(SERVICE.NON_PRODUCTION_APPROVE_LIST, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          base: selectedMode,
        }),

        axios.post(
            SERVICE.NON_PRODUCTION_REJECT_LIST,
            {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                  base: selectedMode,
            }
        ),
      ]);
      console.log(res_employee?.data?.validatefinal, "de");

      const itemsWithSerialNumber = res_employee?.data?.nonproduction?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        date: moment(item.date).format("DD-MM-YYYY"),
      }));

      setFilterList(itemsWithSerialNumber);
      setTableCheck(valueTable);

      //valid/Invalid status


      const itemsWithSerialNumberstatus = res_completed?.data?.nonproduction?.map((item, index) => ({
          ...item,
           serialNumber: index + 1,
          date: moment(item.date).format("DD-MM-YYYY"),
        id:item._id,
      }));
      setisusercompleted(itemsWithSerialNumberstatus);
      setLoaderList(false);
      setLoader(false);
    } catch (err) {
      setLoaderList(false);
      setLoader(false);
    }
  };

  const handleSubmitFilterNew = (e) => {
    e.preventDefault();

    if (selectedMode === 0) {
      setPopupContentMalert("Please Select Table Mode");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      // If all conditions are met, proceed with the fetch
      fetchBatchFilter(1);
    }
  };

  const handleClearFilterNew = async (e) => {
    setPageName(!pageName);
    e.preventDefault();
    var today1 = new Date();
    var dd1 = String(today1.getDate()).padStart(2, "0");
    var mm1 = String(today1.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy1 = today1.getFullYear();
    today1 = yyyy1 + "-" + mm1 + "-" + dd1;
    setPageName(!pageName);
    // e.preventDefault();
    setFromdate(today1);
    setTodate(today1);
    setSelectedMode("Today");
    setSelectedTable([]);
    setValueTable([]);
    setTableCheck([]);
    setSelectedProjectVendor([]);
    setSelectedProcess([]);
    setSelectedLoginId([]);
    setFilterList([]);
    setPopupContent("Cleared Successfully!");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //completed

  // Manage Columns
  const [isManageColumnsOpencom, setManageColumnsOpencom] = useState(false);
  const [anchorElcom, setAnchorElcom] = useState(null);

  const handleOpenManageColumnscom = (event) => {
    setAnchorElcom(event.currentTarget);
    setManageColumnsOpencom(true);
  };
  const handleCloseManageColumnscom = () => {
    setManageColumnsOpencom(false);
    setSearchQueryManagecom("");
  };

  const opencom = Boolean(anchorElcom);
  const idcom = opencom ? "simple-popover" : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibilitycom = {
    serialNumber: true,
    checkbox: true,
    serialNumber: true,
    checkbox: true,
    name: true,
    category: true,
    subcategory: true,
    date: true,
    alloteddays: true,
    allotedhours: true,
    allotedminutes: true,
    days: true,
    hours: true,
    minutes: true,
    count: true,
    rejectreason:true,
    actions: true,
  };

  const [columnVisibilitycom, setColumnVisibilitycom] = useState(initialColumnVisibilitycom);

  const [itemscom, setItemscom] = useState([]);

  // const addSerialNumber = () => {
  //     const itemsWithSerialNumber = isuser?.map((item, index) => ({
  //         ...item, serialNumber: index + 1,
  //         fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
  //     }));
  //     setItems(itemsWithSerialNumber);
  // };

  const addSerialNumbercom = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => {

    //     return {
    //         ...item,
    //         serialNumber: index + 1,

    //         date: moment(item.date).format("DD/MM/YYYY"),
    //     }
    // });
    setItemscom(datas);
  };

  useEffect(() => {
    addSerialNumbercom(isusercompleted);
  }, [isusercompleted]);

  // console.log(isuser, "isuser")

  //Datatable
  const handlePageChangecom = (newPage) => {
    setPagecom(newPage);
    setSelectedRows([]);
    // setSelectAllChecked(false);
  };

  const handlePageSizeChangecom = (event) => {
    setPageSizecom(Number(event.target.value));
    setSelectedRows([]);
    // setSelectAllChecked(false);
    setPagecom(1);
  };

  //datatable....
  const handleSearchChangecom = (event) => {
    setSearchQuerycom(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermscom = searchQuerycom.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatascom = itemscom?.filter((item) => {
    return searchTermscom.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDatacom = filteredDatascom?.slice((pagecom - 1) * pageSizecom, pagecom * pageSizecom);

  const totalPagescom = Math.ceil(filteredDatascom?.length / pageSizecom);

  const visiblePagescom = Math.min(totalPagescom, 3);

  const firstVisiblePagecom = Math.max(1, pagecom - 1);
  const lastVisiblePagecom = Math.min(firstVisiblePagecom + visiblePagescom - 1, totalPagescom);

  const pageNumberscom = [];

  const indexOfLastItemcom = pagecom * pageSizecom;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTablecom = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilitycom.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibilitycom.name,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category Name",
      flex: 0,
      width: 130,
      hide: !columnVisibilitycom.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 130,
      hide: !columnVisibilitycom.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      hide: !columnVisibilitycom.date,
      headerClassName: "bold-header",
    },
    {
      field: "alloteddays",
      headerName: "Allot Days",
      flex: 0,
      width: 130,

      hide: !columnVisibilitycom.alloteddays,
      headerClassName: "bold-header",
    },
    {
      field: "allotedhours",
      headerName: "Allot Hours",
      flex: 0,
      width: 130,
      hide: !columnVisibilitycom.allotedhours,
      headerClassName: "bold-header",
    },
    {
      field: "allotedminutes",
      headerName: "Allot Mins",
      flex: 0,
      width: 130,
      hide: !columnVisibilitycom.allotedminutes,
      headerClassName: "bold-header",
    },
    {
      field: "days",
      headerName: "Days",
      flex: 0,
      width: 150,
      hide: !columnVisibilitycom.days,
      headerClassName: "bold-header",
    },
    {
      field: "hours",
      headerName: "Hours",
      flex: 0,
      width: 140,
      hide: !columnVisibilitycom.hours,
      headerClassName: "bold-header",
    },
    {
      field: "minutes",
      headerName: "Minutes",
      flex: 0,
      width: 150,
      hide: !columnVisibilitycom.minutes,
      headerClassName: "bold-header",
    },
    {
      field: "count",
      headerName: "Count",
      flex: 0,
      width: 150,
      hide: !columnVisibilitycom.count,
      headerClassName: "bold-header",
    },

    {
      field: "rejectreason",
      headerName: "Reject Reason",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilitycom.rejectreason,
      headerClassName: "bold-header",
    },
  ];


  
  const exportColumnNamescom = columnDataTablecom.map((d) => d.headerName).filter((t) => t != "Action" && t != "SNo");

  const exportRowValuescom = columnDataTablecom.map((d) => d.field).filter((t) => t != "action" && t != "serialNumber");
  // console.log(filteredData, "lll")

  const rowDataTablecom = filteredDatacom.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
      errormode: item.errormode,
      name: item.name,
      olddate: item.olddate,
      branch: item.branch,
      unit: item.unit,
      projectvendor: item.projectvendor,
      process: item.process,
      loginid: item.loginid,
      date: item.date,
      errorfilename: item.errorfilename,
      documentnumber: item.documentnumber,
      documenttype: item.documenttype,
      fieldname: item.fieldname,
      line: item.line,
      errorvalue: item.errorvalue,
      status: item.status,
      correctvalue: item.correctvalue,
      link: item.link,
      doclink: item.doclink,
      mode: item.mode,
      greentext: item.greentext,
      validatestatus: item.validatestatus,
    };
  });
  console.log(rowDataTablecom, "rowdat");
  const rowsWithCheckboxescom = rowDataTablecom?.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumnscom = () => {
    const updatedVisibilitycom = { ...columnVisibilitycom };
    for (const columnKey in updatedVisibilitycom) {
      updatedVisibilitycom[columnKey] = true;
    }
    setColumnVisibilitycom(updatedVisibilitycom);
  };

  // // Function to filter columns based on search query
  const filteredColumnscom = columnDataTablecom.filter((column) => column.headerName.toLowerCase().includes(searchQueryManagecom.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilitycom = (field) => {
    setColumnVisibilitycom((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentcom = (
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
        onClick={handleCloseManageColumnscom}
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
          value={searchQueryManagecom}
          onChange={(e) => setSearchQueryManagecom(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnscom.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilitycom[column.field]}
                    onChange={() => toggleColumnVisibilitycom(column.field)}
                  />
                }
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilitycom(initialColumnVisibilitycom)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibilitycom = {};
                columnDataTablecom.forEach((column) => {
                  newColumnVisibilitycom[column.field] = false; // Set hide property to true
                });
                setColumnVisibilitycom(newColumnVisibilitycom);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <Box>
      <Headtitle title={"NonProduction Check List"} />
      <PageHeading
        title="NonProduction Check List"
        modulename="Quality"
        submodulename="Penalty"
        mainpagename="Penalty Setup"
        subpagename="Penalty Calculation"
        subsubpagename="Validation Error Entry"
      />
      {isUserRoleCompare?.includes("avalidationerrorentry") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add NonProduction Check List</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Base<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      labelId="mode-select-label"
                      options={mode}
                      style={colourStyles}
                      value={{ label: selectedMode, value: selectedMode }}
                      onChange={(selectedOption) => {
                        setSelectedMode(selectedOption.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={1.5} xs={12} sm={12} marginTop={3}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitFilterNew}>
                    Filter
                  </Button>
                </Grid>
                <Grid item md={1.5} xs={12} sm={12} marginTop={3}>
                  <Button onClick={handleClearFilterNew} sx={buttonStyles.btncancel}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <br />
            </>
          </Box>
        </>
      )}

      <br />
      {/* ****** Table Start ****** */}
      {loader && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size="3rem" />
        </Box>
      )}

      {/* {isUserRoleCompare?.includes("lvalidationerrorentry")  ? */}

      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>
              Approve List
              {/* Penalty Total Field List */}
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
                  <MenuItem value={filterList?.length}>All</MenuItem>
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
                {isUserRoleCompare?.includes("excelvalidationerrorentry") && (
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
                {isUserRoleCompare?.includes("csvvalidationerrorentry") && (
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
                {isUserRoleCompare?.includes("printvalidationerrorentry") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfvalidationerrorentry") && (
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
                {isUserRoleCompare?.includes("imagevalidationerrorentry") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item md={2} xs={6} sm={6}>
              <Box>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={filterList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={filterList}
                />
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
          {/* {hasMoreData && !isLoading && filterList.length > 0 && (
                            <Button variant="contained" onClick={loadMore}>
                                Load More
                            </Button>
                        )} */}
          <br />
          {loaderList ? (
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
                // pagenamecheck={"Validation Error Entry"}
                filteredDatas={filteredDatas}
                // totalDatas={totalDatas}
                searchQuery={searchedString}
                handleShowAllColumns={handleShowAllColumns}
                setFilteredRowData={setFilteredRowData}
                filteredRowData={filteredRowData}
                setFilteredChanges={setFilteredChanges}
                filteredChanges={filteredChanges}
                gridRefTableImg={gridRefTableImg}
                itemsList={filterList}
                rowHeight={150}
              />
            </>
          )}
        </Box>
      </>
      {/* // : null} */}

      <br />

      {/* {isUserRoleCompare?.includes("lvalidationerrorentry")  ? */}

      <>
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Reject List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizecom}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangecom}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={isusercompleted?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelvalidationerrorentry") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpencom(true);
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvvalidationerrorentry") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpencom(true);
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printvalidationerrorentry") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintcom}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvalidationerrorentry") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpencom(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagevalidationerrorentry") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImagecom}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  {/* <FormControl fullWidth size="small">
                                                    <Typography>Search</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={handleSearchChange}
                                                    />
                                                </FormControl> */}
                  <AggregatedSearchBar
                    columnDataTable={columnDataTablecom}
                    setItems={setItemscom}
                    addSerialNumber={addSerialNumbercom}
                    setPage={setPagecom}
                    maindatas={isusercompleted}
                    setSearchedString={setSearchedStringcom}
                    searchQuery={searchQuerycom}
                    setSearchQuery={setSearchQuerycom}
                    paginated={false}
                    totalDatas={isusercompleted}
                  />
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnscom}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnscom}>
              Manage Columns
            </Button>
            {/* Show "Load More" button if there's more data */}
            <Popover
              id={idcom}
              open={isManageColumnsOpencom}
              anchorEl={anchorElcom}
              onClose={handleCloseManageColumnscom}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentcom}
            </Popover>
            <br />
            <br />
            {loaderList ? (
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
                <AggridTable
                  rowDataTable={rowDataTablecom}
                  columnDataTable={columnDataTablecom}
                  columnVisibility={columnVisibilitycom}
                  page={pagecom}
                  setPage={setPagecom}
                  pageSize={pageSizecom}
                  totalPages={totalPagescom}
                  setColumnVisibility={setColumnVisibilitycom}
                  isHandleChange={isHandleChange}
                  items={itemscom}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTablecom}
                  paginated={false}
                  filteredDatas={filteredDatascom}
                  // totalDatas={totalDatas}
                  searchQuery={searchedStringcom}
                  handleShowAllColumns={handleShowAllColumnscom}
                  setFilteredRowData={setFilteredRowDatacom}
                  filteredRowData={filteredRowDatacom}
                  setFilteredChanges={setFilteredChangescom}
                  filteredChanges={filteredChangescom}
                  gridRefTableImg={gridRefTableImgcom}
                  itemsList={isusercompleted}
                />
              </>
            )}
          </>
        </Box>
      </>

      {/* : null} */}

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

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
        itemsTwo={filterList ?? []}
        filename={"Non Production Approve List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportData
        isFilterOpen={isFilterOpencom}
        handleCloseFilterMod={handleCloseFilterModcom}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpencom}
        isPdfFilterOpen={isPdfFilterOpencom}
        setIsPdfFilterOpen={setIsPdfFilterOpencom}
        handleClosePdfFilterMod={handleClosePdfFilterModcom}
        filteredDataTwo={(filteredChangescom !== null ? filteredRowDatacom : rowDataTablecom) ?? []}
        itemsTwo={isusercompleted ?? []}
         filename={"Non Production Reject List"}
        exportColumnNames={exportColumnNamescom}
        exportRowValues={exportRowValuescom}
        componentRef={componentRefcom}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Validation Error Entry Info" addedby={addedby} updateby={updateby} />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Nonproductionchecklist;
