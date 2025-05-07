import React, { useState, useEffect, useRef, useContext } from "react";
import {
  TextField,
  IconButton,
  ListItem,
  List,
  Checkbox,
  ListItemText,
  Popover,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function ResponseLog() {
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          Attempts: item.attempts,
          Question: item?.question,
          Speed: item?.speed,
          Accuracy: item?.accuracy,
          Mistakes: item?.mistakes,
          TypingResult: item?.typingresult,
          Status: item.status,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          Sno: index + 1,
          Attempts: item.attempts,
          Question: item?.question,
          Speed: item?.speed,
          Accuracy: item?.accuracy,
          Mistakes: item?.mistakes,
          TypingResult: item?.typingresult,
          Status: item.status,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Attempts", field: "attempts" },
    { title: "Questions", field: "question" },
    { title: "Speed", field: "speed" },
    { title: "Accuracy", field: "accuracy" },
    { title: "Mistakes", field: "mistakes" },
    { title: "Typing Result", field: "typingresult" },
    { title: "Status", field: "status" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((item, index) => ({
            serialNumber: index + 1,
            attempts: item.attempts,
            question: item?.question,
            speed: item?.speed,
            accuracy: item?.accuracy,
            mistakes: item?.mistakes,
            typingresult: item?.typingresult,
            status: item.status,
          }))
        : items?.map((item, index) => ({
            serialNumber: item.serialNumber,
            attempts: item.attempts,
            question: item?.question,
            speed: item?.speed,
            accuracy: item?.accuracy,
            mistakes: item?.mistakes,
            typingresult: item?.typingresult,
            status: item.status,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`${roleName}-${tableName}-${candidateName}-Reponses.pdf`);
  };

  let candidateid = useParams().candidateid;
  let roundid = useParams().roundid;

  const [roleName, setRoleName] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);

  let [testMark, setTestMark] = useState({
    testname: "",
    totalmarks: "",
    eligiblemarks: "",
    obtainedmarks: "",
    roundid: "",
  });

  const [isBankdetail, setBankdetail] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(
            blob,
            `${roleName}-${tableName}-${candidateName}-Reponses.png`
          );
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const [roundmasterEdit, setRoundmasterEdit] = useState({});
  const [testStatus, setTestStatus] = useState("Please Select Test Status");

  const handleViewImageSubEdit = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
    setTestStatus("Please Select Test Status");
    setTestMark({
      testname: "",
      totalmarks: "",
      eligiblemarks: "",
      obtainedmarks: "",
      roundid: "",
    });
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
    checkbox: true,
    serialNumber: true,
    attempts: true,
    status: true,
    speed: true,
    accuracy: true,
    mistakes: true,
    typingresult: true,
    question: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [tableName, setTableName] = useState();
  const [candidateName, setCandidateName] = useState();
  const [jobopeningsId, setJobopeningsId] = useState();
  const [candidateData, setCandidatesData] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Opening Responses, Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const getJobRoleDatas = async () => {
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${candidateid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let singleRound = res?.data?.scandidates?.interviewrounds?.find(
        (item) => item._id === roundid
      );

      var reportingDateTime = singleRound?.date + " " + singleRound?.time;
      var formattedReportingDateTime =
        moment(reportingDateTime).format("DD-MM-YYYY hh:mm A");
      var deadlineDateTime =
        singleRound?.deadlinedate + " " + singleRound?.deadlinetime;
      var formattedDeadlinegDateTime =
        moment(deadlineDateTime).format("DD-MM-YYYY hh:mm A");

      setJobopeningsId(res?.data?.scandidates?.jobopeningsid);
      setCandidatesData({
        candidatename: res?.data?.scandidates?.fullname,
        username: res?.data?.scandidates?.username,
        password: res?.data?.scandidates?.password,
        totalcount: singleRound?.retestcount,
        roundname: singleRound?.roundname,
        roundcategory: singleRound?.roundcategory,
        roundsubcategory: singleRound?.roundsubcategory,
        designation: singleRound?.designation,
        interviewer: singleRound?.interviewer
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        reportingdateandtime: formattedReportingDateTime,
        deadlinedateandtime: formattedDeadlinegDateTime,
        duration: singleRound?.duration,
      });

      const transformedArray = singleRound?.interviewFormLog.flatMap(
        (subArray, index, array) => {
          return subArray.map((obj) => ({
            ...obj,
            arrayindex: index,
            attempts: index === 0 ? "Main Test" : `Retest ${index}`,
            candidatename: res?.data?.scandidates?.fullname,
            username: res?.data?.scandidates?.username,
            password: res?.data?.scandidates?.password,
            reportingdateandtime: formattedReportingDateTime,
            deadlinedateandtime: formattedDeadlinegDateTime,
            duration: singleRound?.duration,
            status:
              index === array?.length - 1
                ? singleRound?.roundstatus
                : "Completed",
          }));
        }
      );

      // Check if manualEntry exists and has items
      if (singleRound?.manualEntry?.length > 0) {
        // Map over manualEntry and add to transformedArray
        singleRound.manualEntry.forEach((entry) => {
          transformedArray.push({
            ...entry,
            arrayindex: transformedArray.length, // Assuming manualEntry is added at the end
            attempts: "Manual Entry",
            candidatename: res?.data?.scandidates?.fullname,
            username: res?.data?.scandidates?.username,
            password: res?.data?.scandidates?.password,
            reportingdateandtime: formattedReportingDateTime,
            deadlinedateandtime: formattedDeadlinegDateTime,
            duration: singleRound?.duration,
            status: singleRound?.roundstatus, // Assuming status for manualEntry is same as roundstatus
          });
        });
      }

      setBankdetail(true);
      setRoleName(res?.data?.scandidates?.role);
      setCandidateName(res?.data?.scandidates?.fullname);
      setTableName(singleRound?.roundname);
      setCandidates(transformedArray);
    } catch (err) {setBankdetail(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsLoading(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Excel
  const fileName = `${roleName}-${tableName}-${candidateName}-Reponses`;
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${roleName}-${tableName}-${candidateName}-Reponses`,
    pageStyle: "print",
  });

  useEffect(() => {
    getJobRoleDatas();
  }, [candidateid]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      speed: `${item?.typingspeedans} wpm`,
      accuracy: `${item?.typingaccuracyans} %`,
      mistakes: item?.typingmistakesans,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidates]);

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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "attempts",
      headerName: "Attempts",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.attempts,
    },
    {
      field: "question",
      headerName: "Questions",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.question,
    },
    {
      field: "speed",
      headerName: "Speed",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.speed,
    },
    {
      field: "accuracy",
      headerName: "Accuracy",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.accuracy,
    },
    {
      field: "mistakes",
      headerName: "Mistakes",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.mistakes,
    },
    {
      field: "typingresult",
      headerName: "Typing result",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.typingresult,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.status,
    },

    // {
    //   field: "responses",
    //   headerName: "Responses",
    //   flex: 0,
    //   width: 200,
    //   minHeight: "40px !important",
    //   sortable: false,
    //   hide: !columnVisibility.responses,
    //   headerClassName: "bold-header",
    //   // Assign Bank Detail
    //   renderCell: (params) => (
    //     <Grid sx={{ display: "flex" }}>
    //       <>
    //         <Button
    //           sx={userStyle.buttonedit}
    //           onClick={() => {
    //             viewResponses(candidateid, roundid, params?.row?.arrayindex);
    //           }}
    //         >
    //           Responses
    //         </Button>
    //       </>
    //     </Grid>
    //   ),
    // },

    // {
    //   field: "actions",
    //   headerName: "Action",
    //   flex: 0,
    //   width: 100,
    //   minHeight: "40px !important",
    //   sortable: false,
    //   hide: !columnVisibility.actions,

    //   renderCell: (params) => (
    //     <Grid sx={{ display: "flex" }}>
    //       <Link
    //         to={`/recruitment/viewresume/${params.row.id}/interviewrounds/${candidateid}`}
    //       >
    //         <Button sx={userStyle.buttonedit}>
    //           <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
    //         </Button>
    //       </Link>
    //     </Grid>
    //   ),
    // },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: uuidv4(),
      serialNumber: item?.serialNumber,
      attempts: item?.attempts,
      question: item?.question,
      status: item?.status,
      speed: item?.speed,
      accuracy: item?.accuracy,
      mistakes: item?.mistakes,
      typingresult: item?.typingresult,
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"RESPONSE LOG"} />
      <LoadingBackdrop open={isLoading} />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>Response Log</Typography>
        </Grid>
        <Grid item xs={4}>
          <>
            <Link
              to={`/interviewrounds/${jobopeningsId}`}
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            >
              <Button variant="contained">Back</Button>
            </Link>
          </>
        </Grid>
      </Grid>
      <NotificationContainer />
      <br />
      {isUserRoleCompare?.includes("lassignedcandidates") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Job Role :</b> {roleName}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Round Name :</b> {tableName}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Candidate Name :</b> {candidateName}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>UserName :</b> {candidateData?.username}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Password :</b> {candidateData?.password}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Total Count :</b> {candidateData?.totalcount}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Round Category :</b> {candidateData?.roundcategory}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Round SubCategory :</b> {candidateData?.roundsubcategory}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Interviewer :</b> {candidateData?.interviewer}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Duration :</b> {candidateData?.duration}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Reporting Date/Time : </b>
                  {candidateData?.reportingdateandtime}{" "}
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Deadline Date/Time :</b>{" "}
                  {candidateData?.deadlinedateandtime}{" "}
                </Typography>
              </Grid>
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
                    <MenuItem value={candidates?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("csvassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printassignedcandidates") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printassignedcandidates") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            {!isBankdetail ? (
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
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Response &nbsp;&nbsp; <b> {roundmasterEdit?.username} </b>
            </Typography>
            <br />
            <br />
            <>
              <Grid container spacing={2}>
                <Grid item md={5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Questions </Typography>
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">User Ans </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">User Ans Status </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Type </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              {roundmasterEdit?.interviewForm?.map((data, index) => {
                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid item md={5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={data.question}
                          >
                            {index + 1} . {data.question} &nbsp;
                            {data?.uploadedimage && (
                              <>
                                <>
                                  <IconButton
                                    aria-label="view"
                                    onClick={() => {
                                      handleViewImageSubEdit(data);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{ color: "#0B7CED" }}
                                    />
                                  </IconButton>
                                </>
                              </>
                            )}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.userans
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.useransstatus
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>{data.type}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                );
              })}
            </>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={2} xs={12}>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={handleCloseview}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Attempts</StyledTableCell>
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell>Speed</StyledTableCell>
              <StyledTableCell>Accuracy</StyledTableCell>
              <StyledTableCell>Mistakes</StyledTableCell>
              <StyledTableCell>Typing Result</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.attempts}</StyledTableCell>
                  <StyledTableCell> {row.question}</StyledTableCell>
                  <StyledTableCell> {row.speed}</StyledTableCell>
                  <StyledTableCell> {row.accuracy}</StyledTableCell>
                  <StyledTableCell> {row.mistakes}</StyledTableCell>
                  <StyledTableCell> {row.typingresult}</StyledTableCell>
                  <StyledTableCell> {row.status}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResponseLog;