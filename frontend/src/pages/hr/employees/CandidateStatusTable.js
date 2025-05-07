import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Container,
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
  TextField,
  Typography,
} from "@mui/material";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";

import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BlockIcon from "@mui/icons-material/Block";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import moment from "moment-timezone";

import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function CandidateStatusTable({ candidateDatas }) {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

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
    "Current Round",
    "Round Status",
    "Round Result",
    "Status",
    "Final Status",
    "Applicant Name",
    "Contact Number",
    "Email",
    "Company",
    "Branch",
    "Designation",
  ];
  const newLocal = "Round Status";
  let exportRowValues = [
    "roundname",
    "roundstatus",
    "roundanswerstatus",
    "overallstatus",
    "finalstatus",
    "fullname",
    "mobile",
    "email",
    "company",
    "branch",
    "designation",
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

  const [fileFormat, setFormat] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);

  const { isUserRoleCompare, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [candidate, setCandidate] = useState([]);

  const [items, setItems] = useState([]);
  const [itemsAllCanddate, setItemsAllCanddate] = useState([]);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(candidate);
  }, [candidate]);
  useEffect(() => {
    const itemsWithSerialNumber = candidateDatas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      overallstatus: item?.consolidatedvalue,
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: Array.isArray(item?.skill)
        ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
        : [],

      roundname: item.recentroundname,
      roundstatus: item.recentroundstatus,
      finalstatus: !item.finalstatus
        ? ""
        : item.finalstatus == "Added"
          ? "Hired"
          : item.finalstatus,
    }));
    setCandidate(itemsWithSerialNumber);
    setItemsAllCanddate(itemsWithSerialNumber);
  }, [candidateDatas]);

  const [makeScreenButton, setMakeScreenButton] = useState("");

  const gridRef = useRef(null);

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
      pinned: "left",
    },
    {
      field: "roundname",
      headerName: "Current Round",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.roundname,
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) =>
        params.value !== "" && params.value !== undefined ? (
          <div
            style={{
              color: "#000",
              background: "#9fd9e0",
              border: "1px solid #000",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
              display: "flex",
              justifyContent: "center"
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
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) =>
        params.value == "Interview Scheduled" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#FFEC9E",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#4F6F52",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <DoneIcon style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }} />
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <ThumbDownOffAltIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <RefreshIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <AssignmentIndIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <FullscreenIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
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
              display: "flex",
              justifyContent: "center"
            }}
          >
            <ContentCopyIcon
              style={{ marginRight: "5px", verticalAlign: "middle", marginTop: "10px" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value !== "" ? (
          <div
            style={{
              color: "#4A6A68", // Darker shade for text color
              fontWeight: "normal",
              border: "1px solid #4A6A68", // Darker shade for border
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
              display: "flex",
              justifyContent: "center"
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) =>
        params.value == "Hired" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
              display: "flex",
              justifyContent: "center"
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCandidateDetails(params.data);

                window.open(
                  `/recruitment/viewresume/${params?.data?.id}/candidatestatus`,
                  "_blank"
                );
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          </>
          <>
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getCandidateDetails(params.data);
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
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      designation: item.designation,
      email: item.email,
      jobopeningsid: item.jobopeningsid,
      dateofbirth: item.dateofbirth,
      roundanswerstatus: item.roundanswerstatus,

      screencandidate: item.screencandidate,

      experience: item.experience,
      status: item.status,
      tablename: item?.tablename,
      candidatestatus: item?.candidatestatus,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      interviewrounds: item?.interviewrounds,
      company: item?.company,
      branch: item?.branch,

      overallstatus: item?.overallstatus,
      qualification: item?.qualification,
      skill: item?.skill,

      roundname: item.roundname,
      roundstatus: item.roundstatus,
      finalstatus: !item.finalstatus,
    };
  });

  console.log(filteredRowData)
  console.log(rowDataTable)
  console.log(filteredChanges)
  console.log(items)

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  const [selectedRows, setSelectedRows] = useState([]);

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



  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Candidate Detail Status.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
                    <MenuItem value={candidateDatas?.length}>All</MenuItem>
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={candidate}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={itemsAllCanddate}
                />
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
              itemsList={itemsAllCanddate}
            />
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
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "50px" }}
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
                                              <Typography variant="h6">{`Question.${indexNew + 1
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
                                                            <Typography variant="h6">{`Question.${index + 1
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
                                              <Typography variant="h6">{`Question.${indexNew + 1
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
                                                            <Typography variant="h6">{`Question.${index + 1
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
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
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
        itemsTwo={candidateDatas ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default CandidateStatusTable;
