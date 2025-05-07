import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
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
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link, useParams } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { DeleteConfirmation } from "../../../../components/DeleteConfirmation.js";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
function DepartmentLogList() {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setUpdateLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setUpdateLoader(false);
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Employee Name",
    "Start Date",
    "Created Date&Time",
    "Created By",
    "Department",
  ];
  let exportRowValues = [
    "companyname",
    "branch",
    "unit",
    "team",
    "username",
    "startdate",
    "createdtime",
    "createdby",
    "department",
  ];

  const [designationlogs, setDesignationlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    alldepartment,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

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
      pagename: String("Department Log"),
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

  const gridRef = useRef(null);

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

  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);

  //get all Departmentmonthset
  const [designationdatasEdit, setDesignationdatasEdit] = useState([]);
  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

  const fetchDepartmentChange = async (e, Doj) => {
    setPageName(!pageName);
    try {
      const response = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let foundData = response?.data?.departmentdetails?.find(
        (item) =>
          item.department === e &&
          new Date(Doj) >= new Date(item.fromdate) &&
          new Date(Doj) <= new Date(item.todate)
      );

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.departmentdetails
          ?.filter(
            (d) =>
              d.department === e &&
              new Date(d.fromdate) >= new Date(foundData.fromdate)
          )
          ?.map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));
      }
      setStartdateoptionsEdit(filteredDatas);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchDesignationData = async () => {
    setPageName(!pageName);
    try {
      const designationall =
        alldepartment?.length > 0
          ? [
            ...alldepartment?.map((d) => ({
              ...d,
              label: d.deptname,
              value: d.deptname,
            })),
          ]
          : [];
      setDesignationdatasEdit(designationall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [prevLogDates, setPrveLogDates] = useState([]);
  const [prevLogSingleDate, setPrveLogSingleDate] = useState([]);
  //get single row to edit....
  const getCode = async (params) => {
    setPageName(!pageName);
    try {

      const matchedIndex = designationlogs.findIndex(item => item.id === params.id);
      let previousOriginalDate = null;

      // Check if there is a valid previous object
      if (matchedIndex > 0) {
        previousOriginalDate = designationlogs[matchedIndex - 1]?.originalstartdate;
      }
      setPrveLogSingleDate(previousOriginalDate)
      setPrveLogDates(designationlogs?.filter(data => data?.id !== params.id)?.map(item => item?.originalstartdate))
      await fetchDepartmentChange(params.department, userData.doj);
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
    setUpdateLoader(true);
    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      prevLogDates?.includes(editDetails.originalstartdate)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.department === "" ||
      editDetails.department === undefined ||
      editDetails.department === "Please Select Department"
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.originalstartdate === "" ||
      editDetails.originalstartdate === undefined ||
      editDetails.originalstartdate === "Please Select Startdate"
    ) {
      setPopupContentMalert("Please Select Start Date!");
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
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: String(editDetails.department),

          designation: String(userData.designation),
          rocketchatemail: userData?.rocketchatemail,
          rocketchatid: userData?.rocketchatid,
          rocketchatroles: userData?.rocketchatroles,
          rocketchatteamid: userData?.rocketchatteamid,
          rocketchatchannelid: userData?.rocketchatchannelid,
          username: userData?.username,
          company: userData?.company,
          branch: userData?.branch,
          unit: userData?.unit,
          team: userData?.team,
          companyname: userData?.companyname,
          workmode: userData?.workmode,
          process: userData?.process,
          rocketchatshiftgrouping: userData?.rocketchatshiftgrouping,
          rocketchatshift: userData?.rocketchatshift,
        });
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=departmentlog`,
          {
            department: String(editDetails.department),
            startdate: String(editDetails.originalstartdate),

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
        setFilteredRowData([]);
        setFilteredChanges(null)
        await rowData();

        handleCloseEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=departmentlog`,
          {
            department: String(editDetails.department),
            startdate: String(editDetails.originalstartdate),
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
        setFilteredRowData([]);
        setFilteredChanges(null)
        await rowData();

        handleCloseEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      setUpdateLoader(false);
    } catch (err) {
      setUpdateLoader(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const [deleteionId, setDeletionId] = useState({});

  const handleDeleteLog = async () => {
    if (isLastLog) {
      const getindex = deleteionId?.index - 1;
      const getdata = userData?.departmentlog.filter((data, index) => {
        return Number(getindex) === index;
      });
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: getdata[0]?.department,


        designation: String(userData.designation),
        rocketchatemail: userData?.rocketchatemail,
        rocketchatid: userData?.rocketchatid,
        rocketchatroles: userData?.rocketchatroles,
        rocketchatteamid: userData?.rocketchatteamid,
        rocketchatchannelid: userData?.rocketchatchannelid,
        username: userData?.username,
        company: userData?.company,
        branch: userData?.branch,
        unit: userData?.unit,
        team: userData?.team,
        companyname: userData?.companyname,

        workmode: userData?.workmode,
        process: userData?.process,
        rocketchatshiftgrouping: userData?.rocketchatshiftgrouping,
        rocketchatshift: userData?.rocketchatshift,
      });
      await axios.delete(
        `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=departmentlog`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setFilteredRowData([]);
      setFilteredChanges(null)
      await rowData();
      setPage(1);
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } else {
      await axios.delete(
        `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=departmentlog`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setFilteredRowData([]);
      setFilteredChanges(null)
      await rowData();
      setPage(1);
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
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
  };

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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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
          saveAs(blob, "DepartmentLogList.png");
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    starttime: true,
    username: true,
    startdate: true,
    time: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    status: true,
    actions: true,
    companyname: true,
    createdtime: true,
    createdby: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [userData, setUserData] = useState({});
  const rowData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const itemsWithSerialNumber = res?.data?.suser?.departmentlog?.map((item, index, array) => ({
        ...item,
        serialNumber: index + 1,
        index: index,
        id: item._id,
        createdby: item.updatedusername,
        movetolive: item.movetolive || false,
        startdate: isValidDateFormat(item.startdate)
          ? moment(item.startdate).format("DD-MM-YYYY")
          : item.startdate,
        originalstartdate: item.startdate,
        createdtime: item.updateddatetime
          ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a")
          : "",
        unit: item.unit === "undefined" ? "" : item.unit,
        status: item.status === false ? "Pending" : "Changed",
        logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
      }));
      setDesignationlogs(itemsWithSerialNumber);

      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];
      // Check if the user's boardingLog exists and has entries
      if (res?.data?.suser?.boardingLog && res?.data?.suser?.boardingLog.length > 0) {
        const lastBoardingLog = res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1];

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
      setUserData({
        ...res?.data?.suser,
        rocketchatshiftgrouping,
        rocketchatshift
      });
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
    rowData();
  }, []);
  useEffect(() => {
    fetchDesignationData();
  }, [alldepartment]);
  const logid = useParams().id;

  const [designationlogsArray, setDesignationlogsArray] = useState([]);

  const rowDataArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogsArray(res?.data?.suser?.departmentlog);
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

  // Excel
  const fileName = "DepartmentLogList";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "DepartmentLogList",
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

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Company",
      flex: 0,
      width: 80,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
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
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },

    {
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 180,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },
    {
      field: "createdtime",
      headerName: "Created Date&Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createdtime,
      headerClassName: "bold-header",
    },
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 180,
      hide: !columnVisibility.department,
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
                {isUserRoleCompare?.includes("edepartmentlog") && (
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
                {isUserRoleCompare?.includes("ddepartmentlog") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.data);
                        setIsLastLog(params?.data?.index === items?.length - 1);
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
              {isUserRoleCompare?.includes("vdepartmentlog") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.data);
                    }}
                  >
                    <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("idepartmentlog") &&
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
  function isValidDateFormat(dateString) {
    // Regular expression to match the format YYYY-MM-DD
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    return dateFormatRegex.test(dateString);
  }

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      username: item.username,
      starttime: item.starttime,
      movetolive: item.movetolive,
      companyname: item.companyname,
      branch: item.branch,
      team: item.team,
      department: item.department,
      index: item?.index,
      createdby: item.createdby,
      startdate: item?.startdate,
      originalstartdate: item.originalstartdate,
      createdtime: item.createdtime,
      unit: item.unit,
      status: item.status,
      logeditedby: item?.logeditedby,
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
      <Headtitle title={"DEPARTMENT LOG LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Department Log"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Department Log"
      />
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ldepartmentlog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item md={8} xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Department Assign Log Employee Name:{" "}
                  <b>{userData?.companyname}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={3}></Grid>
              <Grid item md={1} xs={1}>
                <Link to={"/updatepages/departmentlog"}>
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
                  {isUserRoleCompare?.includes("exceldepartmentlog") && (
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
                  {isUserRoleCompare?.includes("csvdepartmentlog") && (
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
                  {isUserRoleCompare?.includes("printdepartmentlog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfdepartmentlog") && (
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
                  {isUserRoleCompare?.includes("imagedepartmentlog") && (
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
            &ensp;
            <br />
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
            <Typography sx={userStyle.HeaderText}>Department Log</Typography>
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
                    <TableCell>Team</TableCell>
                    <TableCell>From Date</TableCell>
                    <TableCell>Department </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody align="left">
                  {designationlogs &&
                    designationlogs.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.team}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.startdate}</TableCell>
                        <TableCell>{row.department}</TableCell>
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
                View Department Log{" "}
                <b style={{ color: "red" }}>{viewDetails?.username}</b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Company</Typography>
                <Typography>
                  <b>{userData?.company}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Branch</Typography>
                <Typography>
                  <b>{viewDetails?.branch}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Unit</Typography>
                <Typography>
                  <b>{viewDetails?.unit}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Team</Typography>
                <Typography>
                  <b>{viewDetails?.team}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Department</Typography>
                <Typography>
                  <b>{viewDetails?.department}</b>
                </Typography>
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Start Date</Typography>
                <Typography>
                  <b>{viewDetails?.startdate}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created Date&Time</Typography>
                <Typography>
                  <b>{viewDetails?.createdtime}</b>
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created By</Typography>
                <Typography>
                  <b>{viewDetails?.createdby}</b>
                </Typography>
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
            <Typography sx={userStyle.HeaderText}>
              Edit Department Log
            </Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Employee Name : <b>{editDetails.username}</b>
                </Typography>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Department<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={designationdatasEdit}
                    value={{
                      label: editDetails.department,
                      value: editDetails.department,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        department: e.value,
                        originalstartdate: "Please Select Startdate",
                      });
                      fetchDepartmentChange(e.value, userData.doj);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Start Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={startdateoptionsEdit}
                    value={{
                      label: editDetails.originalstartdate,
                      value: editDetails.originalstartdate,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        originalstartdate: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={editSubmit}
                  loading={updateLoader}
                  sx={buttonStyles.buttonsubmit}
                >
                  Update
                </LoadingButton>
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
              Department Log Edited By
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
                sx={{ marginLeft: "15px" }}
              >
                {" "}
                Back{" "}
              </Button>
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

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default DepartmentLogList;