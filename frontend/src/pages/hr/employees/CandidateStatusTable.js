import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  Container,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";

import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";

import DoneIcon from "@mui/icons-material/Done";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BlockIcon from "@mui/icons-material/Block";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment-timezone";

function CandidateStatusTable({ candidateDatas }) {
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
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            "Current Round": item.roundname,
            "Round Status": item.roundstatus,
            "Round Result": item.roundanswerstatus,
            Status: item.overallstatus,
            "Final Status": item.finalstatus,
            "Applicant Name": item.fullname,
            "Contact Number": item.mobile,
            Email: item.email,
            Company: item.company,
            Branch: item.branch,
            Designation: item.designation,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          "S.No": index + 1,
          "Current Round": item.recentroundname,
          "Round Status": item.recentroundstatus,
          "Round Result": item.roundanswerstatus,
          Status: item.overallstatus,
          "Final Status": item.finalstatus,
          "Applicant Name": item.fullname,
          "Contact Number": item.mobile,
          Email: item.email,
          Company: item.company,
          Branch: item.branch,
          Designation: item.designation,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [candidate, setCandidate] = useState([]);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidate?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidate]);
  useEffect(() => {
    setCandidate(candidateDatas);
  }, [candidateDatas]);

  const [makeScreenButton, setMakeScreenButton] = useState("");

  const gridRef = useRef(null);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setStatusCheck(true);
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

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": { overflowY: "hidden" },
    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: " bold !important " },
    "& .custom-id-row": { backgroundColor: "#1976d22b !important" },
    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": { backgroundColor: "#ff00004a !important" },
      "& .custom-in-row:hover": { backgroundColor: "#ffff0061 !important" },
      "& .custom-others-row:hover": { backgroundColor: "#0080005e !important" },
    },
  }));

  const dataGridStyles = {
    root: {
      "& .MuiDataGrid-row": {
        height: "15px",
      },
    },
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    skill: true,
    experience: true,
    status: true,
    scheduleinterview: true,
    prefix: true,
    gender: true,
    removescreening: false,
    adharnumber: true,
    actions: true,
    company: true,
    branch: true,
    designation: true,
    roundname: true,
    roundstatus: true,
    overallstatus: true,
    finalstatus: true,
    roundanswerstatus: true,
    // subcategory: true,
    // specialization: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  // pdf.....
  const columns = [
    { title: "Current Round", field: "roundname" },
    { title: "Round Status", field: "roundstatus" },
    { title: "Round Result", field: "roundanswerstatus" },
    { title: "Status", field: "overallstatus" },
    { title: "Final Status", field: "finalstatus" },
    { title: "Applicant Name", field: "fullname" },
    { title: "Contact Number", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Designation", field: "designation" },
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
        ? rowDataTable.map((item, index) => {
            return {
              serialNumber: index + 1,
              roundname: item.roundname,
              roundstatus: item.roundstatus,
              roundanswerstatus: item.roundanswerstatus,
              overallstatus: item.overallstatus,
              finalstatus: item.finalstatus,
              fullname: item.fullname,
              mobile: item.mobile,
              email: item.email,
              company: item.company,
              branch: item.branch,
              designation: item.designation,
            };
          })
        : items?.map((item, index) => ({
            serialNumber: index + 1,

            roundname: item.recentroundname,
            roundstatus: item.recentroundstatus,
            roundanswerstatus: item.roundanswerstatus,
            overallstatus: item.overallstatus,
            finalstatus: item.finalstatus,
            fullname: item.fullname,
            mobile: item.mobile,
            email: item.email,
            company: item.company,
            branch: item.branch,
            designation: item.designation,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Candidate Detail Status.pdf");
  };

  // Excel
  const fileName = "Candidate Detail Status";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Candidate Detail Status",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  const filteredData = filteredDatas?.slice(
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

  const getButtonStyles = (params) => {
    const { overallstatus, candidatestatus, interviewrounds } = params.row;

    const lastInterviewRound =
      interviewrounds?.length > 0
        ? interviewrounds[interviewrounds.length - 1].roundanswerstatus
        : null;

    let backgroundColor;
    let color = "white";

    if (overallstatus === "Hold" || candidatestatus === "Already Joined") {
      backgroundColor = "green";
    } else if (
      overallstatus === "Rejected" ||
      lastInterviewRound === "Rejected"
    ) {
      backgroundColor = "red";
    } else if (
      overallstatus === "Canceled" ||
      candidatestatus === "No Response"
    ) {
      backgroundColor = "red";
    } else if (
      overallstatus === "Continue" ||
      lastInterviewRound === "Selected"
    ) {
      backgroundColor = "green";
    } else if (
      [
        "Duplicate Candidate",
        "Profile Not Eligible",
        "Not Interested",
        "First No Response",
        "Second No Response",
        "No Response",
        "Got Other Job",
      ].includes(candidatestatus)
    ) {
      backgroundColor = "blue";
    } else if (overallstatus === "Screened") {
      backgroundColor = "#EE4E4E";
    } else if (overallstatus === "Applied") {
      backgroundColor = "yellow";
      color = "black";
    } else if (candidatestatus === "Second No Response") {
      backgroundColor = "lightgreen";
      color = "black";
    } else if (lastInterviewRound === "On Hold") {
      backgroundColor = "brown";
    } else {
      backgroundColor = "yellow";
      color = "black";
    }

    return { backgroundColor, color };
  };

  const ButtonComponent = ({ params }) => {
    const styles = getButtonStyles(params);

    return (
      <Button
        variant="contained"
        style={{
          padding: "5px",
          background: styles.backgroundColor,
          color: styles.color,
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        {params.row.overallstatus}
      </Button>
    );
  };

  const [viewDatas, setViewDatas] = useState({});

  const getCandidateDetails = (datas) => {
    setViewDatas(datas);
  };

  const [openview, setOpenview] = useState(false);
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 70,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "roundname",
      headerName: "Current Round",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.roundname,
      renderCell: (params) =>
        params.value !== "" && params.value !== undefined ? (
          <div
            style={{
              color: "#000",
              background: "#9fd9e0",
              border: "1px solid #000",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : null,
    },
    {
      field: "roundstatus",
      headerName: "Round Status",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.roundstatus,

      renderCell: (params) =>
        params.value == "Interview Scheduled" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#FFEC9E",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Progress" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#FFBB70",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Completed" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#B5C18E",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "15rem" }}
          >
            {params.value}
          </div>
        ),
    },
    {
      field: "roundanswerstatus",
      headerName: "Round Result",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundanswerstatus,

      renderCell: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#4F6F52",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "8rem" }}
          >
            {params.value}
          </div>
        ),
    },
    {
      field: "overallstatus",
      headerName: "Status",
      flex: 0,
      width: 220,
      minHeight: "40px",
      hide: !columnVisibility.overallstatus,

      renderCell: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <DoneIcon style={{ marginRight: "5px", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <ThumbDownOffAltIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <RefreshIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "First No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Second No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Applied" ? (
          <div
            style={{
              color: "#40A2E3",
              border: "1px solid #40A2E3",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <AssignmentIndIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Not Interested" ? (
          <div
            style={{
              color: "#E72929",
              border: "1px solid #E72929",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Got Other Job" ? (
          <div
            style={{
              color: "#E72929",
              border: "1px solid #E72929",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Screened" ? (
          <div
            style={{
              color: "#10439F",
              border: "1px solid #10439F",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <FullscreenIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Duplicate Candidate" ? (
          <div
            style={{
              color: "#003C43 ",
              border: "1px solid #003C43",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <ContentCopyIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value !== "" ? (
          <div
            style={{
              color: "#BED1CF",
              fontWeight: "normal",
              border: "1px solid #BED1CF",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            {params.value}
          </div>
        ) : (
          <></>
        ),
    },
    {
      field: "finalstatus",
      headerName: "Final Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.finalstatus,
      renderCell: (params) =>
        params.value == "Hired" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <DoneIcon style={{ marginRight: "5px", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <ThumbDownOffAltIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <RefreshIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "10rem" }}
          >
            {params.value}
          </div>
        ),
    },
    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.fullname,
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.mobile,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.designation,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCandidateDetails(params.row);

                window.open(
                  `/recruitment/viewresume/${params?.row?.id}/candidatestatus`,
                  "_blank"
                );
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          </>
          <>
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getCandidateDetails(params.row);
              }}
            >
              <ListAltIcon style={{ fontsize: "large" }} />
            </Button>
          </>
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.skill)
      ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      designation: item.designation,
      email: item.email,
      jobopeningsid: item.jobopeningsid,
      dateofbirth: item.dateofbirth,
      roundname: item.recentroundname,
      roundstatus: item.recentroundstatus,
      roundanswerstatus: item.roundanswerstatus,
      finalstatus: !item.finalstatus
        ? ""
        : item.finalstatus == "Added"
        ? "Hired"
        : item.finalstatus,
      screencandidate: item.screencandidate,
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: correctedArray,
      experience: item.experience,
      status: item.status,
      tablename: item?.tablename,
      candidatestatus: item?.candidatestatus,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      interviewrounds: item?.interviewrounds,
      overallstatus: item?.consolidatedvalue,
      company: item?.company,
      branch: item?.branch,
    };
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
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
  );

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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Candidate Detail Status.png");
        });
      });
    }
  };

  return (
    <Box>
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("lemployeestatus") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {`Candidate Detail Status`}
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
                    onChange={handlePageSizeChange}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
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
                  {isUserRoleCompare?.includes("excelemployeestatus") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProductionClientRateArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvemployeestatus") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProductionClientRateArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printemployeestatus") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfemployeestatus") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          // fetchProductionClientRateArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;image&ensp;{" "}
                    </Button>
                  </>
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
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <>
                <StyledDataGrid
                  ref={gridRef}
                  rows={rowDataTable}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )} // Only render visible columns
                  autoHeight={true}
                  density="compact"
                  hideFooter
                  className={dataGridStyles.root}
                />
              </>
            </Box>
            <br />
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

      {/* Print start */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell>SI.No</TableCell>

              <TableCell>Current Round</TableCell>
              <TableCell>Round Status</TableCell>
              <TableCell>Round Result</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Final Status</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Designation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.roundname}</TableCell>
                  <TableCell>{row.roundstatus}</TableCell>
                  <TableCell>{row.roundanswerstatus}</TableCell>
                  <TableCell>{row.overallstatus}</TableCell>
                  <TableCell>{row.finalstatus}</TableCell>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Print End */}

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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
            Export Searched Data
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
            Export Searched Data
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Candidate Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                {viewDatas?.interviewrounds?.map((log, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {log?.roundname}
                    </AccordionSummary>
                    <AccordionDetails>
                      {(log?.mode == "Test" || log?.mode == "Questions") && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Test Name</Typography>
                                <Typography>
                                  {log?.testname ? log.testname : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Total Marks
                                </Typography>
                                <Typography>
                                  {log?.totalmarks ? log.totalmarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Eligible Marks
                                </Typography>
                                <Typography>
                                  {log?.eligiblemarks ? log.eligiblemarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Created On</Typography>
                                <Typography>
                                  {moment(log?.roundCreatedAt)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Test Completed At
                                </Typography>
                                <Typography>
                                  {moment(log?.testcompletedat)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Type
                                </Typography>
                                <Typography>{log?.questiontype}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Count
                                </Typography>
                                <Typography>{log?.questioncount}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Date
                                </Typography>
                                <Typography>
                                  {moment(log?.date)?.format("DD-MM-YYYY")}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Time
                                </Typography>
                                <Typography>
                                  {log?.time
                                    ? moment(log.time, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Date
                                </Typography>
                                <Typography>
                                  {moment(log?.deadlinedate)?.format(
                                    "DD-MM-YYYY"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Time
                                </Typography>
                                <Typography>
                                  {log?.deadlinetime
                                    ? moment(log.deadlinetime, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Duration</Typography>
                                <Typography>
                                  {log?.duration ? log.duration : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Status
                                </Typography>
                                <Typography>
                                  {log?.roundstatus ? log.roundstatus : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Result
                                </Typography>
                                <Typography>
                                  {log?.roundanswerstatus
                                    ? log.roundanswerstatus
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Interviewer
                                </Typography>
                                <Typography>
                                  {log?.interviewer
                                    ? log?.interviewer?.join(",")
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography variant="h6">
                                Question And Answers
                              </Typography>
                              <Container>
                                <Box mt={2}>
                                  {log?.interviewFormLog?.map((qa, index) => (
                                    <Paper
                                      key={index}
                                      elevation={3}
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      {qa.map((item, indexNew) => (
                                        <>
                                          <Accordion>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls={`panel${indexNew}-content`}
                                              id={`panel${indexNew}-header`}
                                            >
                                              <Typography variant="h6">{`Question.${
                                                indexNew + 1
                                              }`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                              >
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Question
                                                  </Typography>
                                                  <Typography>
                                                    {item?.question
                                                      ? item.question
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    User Answer
                                                  </Typography>
                                                  <Typography>
                                                    {item?.userans
                                                      ? item?.userans?.join(",")
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>

                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Type
                                                  </Typography>
                                                  <Typography>
                                                    {item?.type
                                                      ? item.type
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                            </AccordionDetails>
                                          </Accordion>
                                          <Container>
                                            <Box mt={2}>
                                              {item?.secondarytodo?.length >
                                                0 &&
                                                item?.secondarytodo?.map(
                                                  (qa, index) => (
                                                    <Paper
                                                      key={index}
                                                      elevation={3}
                                                      style={{
                                                        marginBottom: "1rem",
                                                      }}
                                                    >
                                                      <Typography>
                                                        Sub Questions
                                                      </Typography>
                                                      <>
                                                        <Accordion>
                                                          <AccordionSummary
                                                            expandIcon={
                                                              <ExpandMoreIcon />
                                                            }
                                                            aria-controls={`panel${index}-content`}
                                                            id={`panel${index}-header`}
                                                          >
                                                            <Typography variant="h6">{`Question.${
                                                              index + 1
                                                            }`}</Typography>
                                                          </AccordionSummary>
                                                          <AccordionDetails>
                                                            <Grid
                                                              item
                                                              md={12}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Question
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.question
                                                                    ? qa.question
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  User Answer
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.userans
                                                                    ? qa?.userans?.join(
                                                                        ","
                                                                      )
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Type
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.type
                                                                    ? qa.type
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                          </AccordionDetails>
                                                        </Accordion>
                                                      </>
                                                    </Paper>
                                                  )
                                                )}
                                            </Box>
                                          </Container>
                                        </>
                                      ))}
                                    </Paper>
                                  ))}
                                </Box>
                              </Container>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {log?.mode == "Typing Test" && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Test Name</Typography>
                                <Typography>
                                  {log?.testname ? log.testname : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Total Marks
                                </Typography>
                                <Typography>
                                  {log?.totalmarks ? log.totalmarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Eligible Marks
                                </Typography>
                                <Typography>
                                  {log?.eligiblemarks ? log.eligiblemarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Created On</Typography>
                                <Typography>
                                  {moment(log?.roundCreatedAt)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Test Completed At
                                </Typography>
                                <Typography>
                                  {moment(log?.testcompletedat)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Type
                                </Typography>
                                <Typography>{log?.questiontype}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Count
                                </Typography>
                                <Typography>{log?.questioncount}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Date
                                </Typography>
                                <Typography>
                                  {moment(log?.date)?.format("DD-MM-YYYY")}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Time
                                </Typography>
                                <Typography>
                                  {log?.time
                                    ? moment(log.time, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Date
                                </Typography>
                                <Typography>
                                  {moment(log?.deadlinedate)?.format(
                                    "DD-MM-YYYY"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Time
                                </Typography>
                                <Typography>
                                  {log?.deadlinetime
                                    ? moment(log.deadlinetime, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Duration</Typography>
                                <Typography>
                                  {log?.duration ? log.duration : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Status
                                </Typography>
                                <Typography>
                                  {log?.roundstatus ? log.roundstatus : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Result
                                </Typography>
                                <Typography>
                                  {log?.roundanswerstatus
                                    ? log.roundanswerstatus
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Interviewer
                                </Typography>
                                <Typography>
                                  {log?.interviewer
                                    ? log?.interviewer?.join(",")
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography variant="h6">
                                Question And Answers
                              </Typography>
                              <Container>
                                <Box mt={2}>
                                  {log?.interviewFormLog?.map((qa, index) => (
                                    <Paper
                                      key={index}
                                      elevation={3}
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      {qa.map((item, indexNew) => (
                                        <>
                                          <Accordion>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls={`panel${indexNew}-content`}
                                              id={`panel${indexNew}-header`}
                                            >
                                              <Typography variant="h6">{`Question.${
                                                indexNew + 1
                                              }`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                              >
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Question
                                                  </Typography>
                                                  <Typography>
                                                    {item?.question
                                                      ? item.question
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    User Answer
                                                  </Typography>
                                                  <Typography>
                                                    {item?.userans
                                                      ? item?.userans?.join(",")
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Typing Speed Required
                                                  </Typography>
                                                  <Typography>
                                                    {item?.typingspeed
                                                      ? `${item.typingspeed} wpm`
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Type
                                                  </Typography>
                                                  <Typography>
                                                    {item?.type
                                                      ? item.type
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                            </AccordionDetails>
                                          </Accordion>
                                          <Container>
                                            <Box mt={2}>
                                              {item?.secondarytodo?.length >
                                                0 &&
                                                item?.secondarytodo?.map(
                                                  (qa, index) => (
                                                    <Paper
                                                      key={index}
                                                      elevation={3}
                                                      style={{
                                                        marginBottom: "1rem",
                                                      }}
                                                    >
                                                      <Typography>
                                                        Sub Questions
                                                      </Typography>
                                                      <>
                                                        <Accordion>
                                                          <AccordionSummary
                                                            expandIcon={
                                                              <ExpandMoreIcon />
                                                            }
                                                            aria-controls={`panel${index}-content`}
                                                            id={`panel${index}-header`}
                                                          >
                                                            <Typography variant="h6">{`Question.${
                                                              index + 1
                                                            }`}</Typography>
                                                          </AccordionSummary>
                                                          <AccordionDetails>
                                                            <Grid
                                                              item
                                                              md={12}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Question
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.question
                                                                    ? qa.question
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  User Answer
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.userans
                                                                    ? qa?.userans?.join(
                                                                        ","
                                                                      )
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Type
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.type
                                                                    ? qa.type
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                          </AccordionDetails>
                                                        </Accordion>
                                                      </>
                                                    </Paper>
                                                  )
                                                )}
                                            </Box>
                                          </Container>
                                        </>
                                      ))}
                                    </Paper>
                                  ))}
                                </Box>
                              </Container>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Candidate Name</Typography>
                  <Typography>{viewDatas?.fullname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{viewDatas?.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{viewDatas?.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Designation</Typography>
                  <Typography>{viewDatas?.designation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Status</Typography>
                  <Typography>{viewDatas?.overallstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Email</Typography>
                  <Typography>{viewDatas?.email}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Is Screened?</Typography>
                  <Typography>
                    {viewDatas?.screencandidate
                      ? viewDatas?.screencandidate
                      : "Not Yet Screened"}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Round</Typography>
                  <Typography>{viewDatas.roundname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Round Status</Typography>
                  <Typography>{viewDatas.roundstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Final Result</Typography>
                  <Typography
                    sx={{
                      color:
                        viewDatas?.finalstatus == "Selected"
                          ? "green"
                          : viewDatas?.finalstatus == "Rejected"
                          ? "red"
                          : "black",
                    }}
                  >
                    {viewDatas?.finalstatus ? viewDatas?.finalstatus : ""}
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
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
    </Box>
  );
}

export default CandidateStatusTable;