import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
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
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import domtoimage from 'dom-to-image';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import PageHeading from "../../../../components/PageHeading";

import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { DeleteConfirmation } from "../../../../components/DeleteConfirmation.js";
import ExportData from "../../../../components/ExportData";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";
function ProcessAllotList() {
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

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Work Mode",
    "Employee Name",
    "Start Date",
    "Process Name",
    "Process Type",
    "Process Duration",
    "Process Hours",
    "Created Date&Time",
    "Created By",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "team",
    "workmode",
    "empname",
    "date",
    "process",
    "processtype",
    "processduration",
    "time",
    "createdtime",
    "createdby",
  ];

  const [designationlogs, setDesignationlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isprocesslogTeam, setisprocesslogTeam] = useState([]);
  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  const handleCloseinfo = () => {
    setOpenInfo(false);
  };
  const handleOpeninfo = () => {
    setOpenInfo(true);
  };

  //view
  const [openView, setOpenView] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };

  //Edit ...
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);
  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };
  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);

  const [ProcessOptions, setProcessOptions] = useState([]);

  const [prevLogDates, setPrveLogDates] = useState([]);
  const [prevLogSingleDate, setPrveLogSingleDate] = useState([]);
  //get single row to edit....
  const getCode = async (params) => {
    console.log(params)
    setPageName(!pageName);
    try {
      let res_process = await axios.post(SERVICE.ALL_PROCESS_AND_TEAM_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: params?.company,
        branch: params?.branch,
        unit: params?.unit,
        team: params?.team,
      });
      const ans =
        res_process?.data?.processteam?.length > 0
          ? res_process?.data?.processteam
          : [];
      setProcessOptions(
        ans.map((data) => ({
          ...data,
          label: data.process,
          value: data.process,
        }))
      );
      // Find the index of the matched ID
      const matchedIndex = designationlogs.findIndex(item => item.id === params.id);
      let previousOriginalDate = null;

      // Check if there is a valid previous object
      if (matchedIndex > 0) {
        previousOriginalDate = designationlogs[matchedIndex - 1]?.originaldate;
      }
      setPrveLogSingleDate(previousOriginalDate)
      setPrveLogDates(designationlogs?.filter(data => data?.id !== params.id)?.map(item => item?.originaldate))
      let hrs = params?.time?.split(":")[0] || "00";
      let mins = params?.time?.split(":")[1] || "00";
      setHours(hrs);
      setMinutes(mins);
      handleOpenEdit();
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
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      prevLogDates?.includes(editDetails.originaldate)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !editDetails.originaldate ||
      editDetails.originaldate === "" ||
      editDetails.originaldate === undefined
    ) {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.process === "Please Select Process" ||
      editDetails.process === "" ||
      editDetails.process === undefined
    ) {
      setPopupContentMalert("Please Select Process!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.processtype === "" ||
      editDetails.processtype === undefined
    ) {
      setPopupContentMalert("Please Select Process Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.processduration === "" ||
      editDetails.processduration === undefined
    ) {
      setPopupContentMalert("Please Select Process Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.time === "Hrs:Mins" ||
      editDetails.time === "" ||
      editDetails.time === undefined ||
      editDetails.time.includes("Mins") ||
      editDetails.time.includes("Hrs") ||
      editDetails.time === "00:00"
    ) {
      setPopupContentMalert("Please Select Duration!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!isChanged) {
      setPopupContentMalert("No Changes to Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      if (isLastLog) {

        let rocketchatshiftgrouping = [];
        let rocketchatshift = [];

        // Check if the user's boardingLog exists and has entries
        if (getingOlddatas?.boardingLog && getingOlddatas?.boardingLog.length > 0) {
          const lastBoardingLog = getingOlddatas?.boardingLog[getingOlddatas?.boardingLog.length - 1];

          // If shifttype is "Standard", push shiftgrouping and shifttiming values
          if (lastBoardingLog.shifttype === "Standard") {
            if (lastBoardingLog.shiftgrouping) {
              rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
            }
            if (lastBoardingLog.shifttiming) {
              rocketchatshift.push(lastBoardingLog.shifttiming);
            }
          } else if (lastBoardingLog.shifttype !== "Standard") {
            // If shifttype is not "Standard", check the todo array
            const boardtodo = lastBoardingLog.todo;

            if (boardtodo && boardtodo.length > 0) {
              // Iterate over the todo array and push shiftgrouping and shifttiming
              boardtodo.forEach(item => {
                if (item.shiftgrouping) {
                  rocketchatshiftgrouping.push(item.shiftgrouping);
                }
                if (item.shifttiming) {
                  rocketchatshift.push(item.shifttiming);
                }
              });
            }
          }
        }

        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          processduration: String(editDetails.processduration),
          processtype: String(editDetails.processtype),
          time: String(hours),
          timemins: String(minutes),


          process: String(editDetails.process),
          username: getingOlddatas?.username,
          companyname: getingOlddatas?.companyname,
          department: getingOlddatas?.department,
          designation: getingOlddatas?.designation,
          rocketchatemail: getingOlddatas?.rocketchatemail,
          rocketchatid: getingOlddatas?.rocketchatid,
          workmode: getingOlddatas?.workmode,
          rocketchatroles: getingOlddatas?.rocketchatroles,
          rocketchatteamid: getingOlddatas?.rocketchatteamid,
          rocketchatchannelid: getingOlddatas?.rocketchatchannelid,
          company: getingOlddatas?.company,
          branch: getingOlddatas?.branch,
          unit: getingOlddatas?.unit,
          team: getingOlddatas?.team,
          rocketchatshiftgrouping,
          rocketchatshift,
        });
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=processlog`,
          {
            process: String(editDetails.process),
            processduration: String(editDetails.processduration),
            processtype: String(editDetails.processtype),
            duration: String(editDetails.duration),
            date: String(editDetails.originaldate),
            time: String(editDetails.time),
            logeditedby: [
              ...editDetails?.logeditedby,
              {
                username: String(isUserRoleAccess?.username),
                date: String(new Date()),
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

        setFilteredChanges(null)
        setFilteredRowData([]);
        await rowData();

        handleCloseEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=processlog`,
          {
            process: String(editDetails.process),
            processduration: String(editDetails.processduration),
            processtype: String(editDetails.processtype),
            duration: String(editDetails.duration),
            date: String(editDetails.originaldate),
            time: String(editDetails.time),
            logeditedby: [
              ...editDetails?.logeditedby,
              {
                username: String(isUserRoleAccess?.username),
                date: String(new Date()),
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

        setFilteredChanges(null)
        setFilteredRowData([]);
        await rowData();

        handleCloseEdit();
        setPopupContent("Update Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
    setHours("Hrs");
    setMinutes("Mins");
  };

  const processTypes = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];
  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

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
      pagename: String("Process Log"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //image


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "ProcessLogList.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    date: true,
    time: true,
    team: true,
    process: true,
    processtype: true,
    processduration: true,
    actions: true,
    createdby: true,
    createdtime: true,
    allotedhours: true,
    workmode: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [doj, setDOJ] = useState("");
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const rowData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGettingOldDatas(res?.data?.suser);

      const itemsWithSerialNumber = res?.data?.suser.processlog?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        index: index,
        id: item._id,
        date: moment(item.date).format("DD-MM-YYYY"),
        originaldate: item.date,
        createdtime: item.updateddatetime
          ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a")
          : "",
        logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
        createdby: item.updatedusername,
        movetolive: item.movetolive || false,
        workmode: res?.data?.suser?.boardingLog?.find(data => data?.ischangeworkmode && data?.team === item?.team)?.workmode || res?.data?.suser?.workmode,
      }));

      setDesignationlogs(itemsWithSerialNumber);
      setDOJ(res?.data?.suser.doj);
      setisprocesslogTeam(res?.data?.suser?.processlog);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [designationlogsArray, setDesignationlogsArray] = useState([]);

  const rowDataArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDesignationlogsArray(res?.data?.suser.processlog);
      setisprocesslogTeam(res?.data?.suser?.processlog);
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
    rowDataArray();
  }, [isFilterOpen]);

  useEffect(() => {
    rowData();
  }, []);

  const logid = useParams().id;

  // Excel
  const fileName = "Process_Log_List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Process Log List",
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
    addSerialNumber(designationlogs);
  }, [designationlogs]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
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
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "workmode",
      headerName: "Workmode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Start Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "createdtime",
      headerName: "Created Date&Time",
      flex: 0,
      width: 120,
      hide: !columnVisibility.createdtime,
      headerClassName: "bold-header",
    },
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 120,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
    },
    {
      field: "process",
      headerName: "Process Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
    },
    {
      field: "processtype",
      headerName: "Process Type",
      flex: 0,
      width: 120,
      hide: !columnVisibility.processtype,
      headerClassName: "bold-header",
    },
    {
      field: "processduration",
      headerName: "Process Duration",
      flex: 0,
      width: 120,
      hide: !columnVisibility.processduration,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Process Hours",
      flex: 0,
      width: 120,
      hide: !columnVisibility.time,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
        return (
          <>
            {(params?.data?.index === 0 || params?.data?.movetolive) ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eprocesslog") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        setEditDetails(params.data);
                        setEditDetailsOld(params.data);
                        getCode(params.data);
                        setIsLastLog(params?.data?.index === items?.length - 1);
                      }}
                    >
                      <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dprocesslog") && params?.data?.index !== designationlogs?.length - 1 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.data);
                        setIsLastLog(params?.data?.index === designationlogs?.length - 1);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon
                        sx={buttonStyles.buttondelete}
                      />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vprocesslog") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.data);
                    }}
                  >
                    <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("iprocesslog") &&
                params?.data?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.data);
                      }}
                    >
                      <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                    </Button>
                  </>
                )}
            </Grid>
          </>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      doj: doj,
      originaldate: item.originaldate,
      time: item.time,
      movetolive: item.movetolive,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empname: item.empname,
      process: item.process,
      date: item.date,
      createdtime: item.createdtime,
      logeditedby: item?.logeditedby,
      createdby: item.createdby,
      processtype: item.processtype,
      processduration: item.processduration,
      workmode: item?.workmode,
      index: item?.index,
    };
  });
  const [deleteionId, setDeletionId] = useState({});

  const handleDeleteLog = async () => {
    if (isLastLog) {
      const getindex = deleteionId?.index - 1;
      const getdata = isprocesslogTeam.filter((data, index) => {
        return Number(getindex) === index;
      });
      const [hours, minutes] = getdata[0]?.time?.split(":");
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: String(getdata[0]?.process),
        processduration: String(getdata[0]?.processduration),
        processtype: String(getdata[0]?.processtype),
        time: String(hours),
        timemins: String(minutes),
      });
      await axios.delete(
        `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=processlog`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setFilteredChanges(null)
      setFilteredRowData([]);
      await rowData();
      setPage(1);
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } else {
      await axios.delete(
        `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=processlog`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setFilteredChanges(null)
      setFilteredRowData([]);
      await rowData();
      setPage(1);
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    }
  };

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"PROCESS LOG LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Process Log"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Process Log"
      />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lprocesslog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item md={8} xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Process Log List Employee Name :{" "}
                  <b>{isprocesslogTeam[0]?.empname}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={3}></Grid>
              <Grid item md={1} xs={1}>
                <Link to={"/updatepages/processallot"}>
                  <Button variant="contained" sx={buttonStyles.btncancel}>
                    Back
                  </Button>
                </Link>
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
                    <MenuItem value={designationlogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelprocesslog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          rowDataArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvprocesslog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          rowDataArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printprocesslog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfprocesslog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          rowDataArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageprocesslog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={designationlogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={designationlogs}
                />
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
            {!designationlogs ? (
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
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={designationlogs}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "1150px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Designation Log</Typography>
            <br /> <br />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell> SI.No</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Process</TableCell>
                    <TableCell>Process Type</TableCell>
                    <TableCell>Process Duration</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody align="left">
                  {designationlogs &&
                    designationlogs.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.empname}</TableCell>
                        <TableCell>{row.team}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.process}</TableCell>
                        <TableCell>{row.processtype}</TableCell>
                        <TableCell>{row.processduration}</TableCell>
                        <TableCell>{row.time}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* VIEW */}
      <Dialog
        maxWidth="lg"
        open={openView}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                View Process Log
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Company</Typography>
                <Typography>{viewDetails?.company}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Branch</Typography>
                <Typography>{viewDetails?.branch}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Unit</Typography>
                <Typography>{viewDetails?.unit}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Team</Typography>
                <Typography>{viewDetails?.team}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Work Mode</Typography>
                <Typography>{viewDetails?.workmode}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Employee</Typography>
                <Typography>{viewDetails?.empname}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Start Date</Typography>
                <Typography>{viewDetails?.date}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Name</Typography>
                <Typography>{viewDetails?.process}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Type</Typography>
                <Typography>{viewDetails?.processtype}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Duration</Typography>
                <Typography>{viewDetails?.processduration}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <br />
              <br />
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={() => {
                    handleCloseView();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
            <Typography sx={userStyle.HeaderText}>
              Edit Process Log Entry Employee Name :{" "}
              <b style={{ color: "red" }}>{editDetails.empname}</b>
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company : <b>{editDetails.company}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Branch : <b>{editDetails.branch}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Unit : <b>{editDetails.unit}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Team : <b>{editDetails.team}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    placeholder="Date"
                    value={editDetails.originaldate}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        originaldate: e.target.value,
                      });
                    }}

                    inputProps={{
                      min:
                        prevLogSingleDate ||
                        editDetails.doj, // Set the minimum date to today
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Process<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={ProcessOptions}
                    value={{
                      label: editDetails.process,
                      value: editDetails.process,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        process: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Process Type<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={processTypes}
                    value={{
                      label: editDetails.processtype,
                      value: editDetails.processtype,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        processtype: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Process Duration<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={processDuration}
                    value={{
                      label: editDetails.processduration,
                      value: editDetails.processduration,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        processduration: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Typography>
                  Duration<b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={6}>
                    <Typography>Hrs</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={hrsOption}
                        placeholder="Hrs"
                        value={{ label: hours, value: hours }}
                        onChange={(e) => {
                          setHours(e.value);
                          setEditDetails({
                            ...editDetails,
                            time: `${e.value}:${minutes}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <Typography>Mins</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={minsOption}
                        placeholder="Mins"
                        value={{ label: minutes, value: minutes }}
                        onChange={(e) => {
                          setMinutes(e.value);
                          setEditDetails({
                            ...editDetails,
                            time: `${hours}:${e.value}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        itemsTwo={designationlogs ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteLog}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />

      {/* INFO */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Process Log Edited By
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {infoDetails?.logeditedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.username}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                onClick={handleCloseinfo}
                sx={{ marginLeft: "15px", ...buttonStyles.btncancel }}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default ProcessAllotList;