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
import { userStyle } from "../../pageStyle";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function RaiseticketClosedResolvedList() {
  const classes = useStyles();
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const [filterValue, setFilterValue] = useState("All Ticket");
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [capturedImages, setCapturedImages] = useState([]);
  const [refImage, setRefImage] = useState([]);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((item, index) => ({
          "Sno": index + 1,
          Raiseself: item.status,
          Raiseticketcount: item.raiseticketcount,
          Raisedby: item.raisedby,
          Raiseddate: item.raiseddate,
          Resolvedby: item?.ticketclosed,
          ResolvedDate: item.resolvedate,
          ResolvedReason: item.reason,
          Employeename: item.employeename,
          Employeecode: item.employeecode,
          Category: item.category,
          Subcategory: item.subcategory,
          Subsubcategory:item.subsubcategory   ===
          "Please Select Sub Sub-category"
          ? ""
          :item.subsubcategory,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          "Sno": index + 1,
          Raiseself: item.raiseself,
          Raiseticketcount: item.raiseticketcount,
          Raisedby: item.raisedby,
          Raiseddate: item.raiseddate,
          Resolvedby: item?.ticketclosed,
          ResolvedDate: item.resolvedate,
          ResolvedReason: item.reason,
          Employeename: item.employeename,
          Employeecode: item.employeecode,
          Category: item.category,
          Subcategory: item.subcategory,
          Subsubcategory:item.subsubcategory   ===
          "Please Select Sub Sub-category"
          ? ""
          :item.subsubcategory,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(item => ({
        serialNumber: serialNumberCounter++,
        employeename: item.employeename,
        employeecode: item.employeecode,
        category: item.category,
        subcategory: item.subcategory,
        subsubcategory: item.subsubcategory   ===
        "Please Select Sub Sub-category"
        ? ""
        :item.subsubcategory,
        workstation: item.workstation,
        materialname: item.materialname,
        type: item.type,
        raiseddate: item.raiseddate,
        raisedby: item.raisedby,
        resolverby: item?.ticketclosed,
        resolvedate: item.resolvedate,
        raiseticketcount: item.raiseticketcount,
        reason: item.textAreaCloseDetails,
        priority: item.priority,
        status: item.status,
        duedate: item.duedate,
        title: item.title,
        description: item.description,
      })) :
      items?.map(item => ({
        serialNumber: serialNumberCounter++,
        employeename: item.employeename,
        employeecode: item.employeecode,
        category: item.category,
        subcategory: item.subcategory,
        subsubcategory: item.subsubcategory   ===
        "Please Select Sub Sub-category"
        ? ""
        :item.subsubcategory,
        workstation: item.workstation,
        materialname: item.materialname,
        type: item.type,
        raiseddate: item.raiseddate,
        raisedby: item.raisedby,
        resolverby: item?.ticketclosed,
        resolvedate: item.resolvedate,
        raiseticketcount: item.raiseticketcount,
        reason: item.textAreaCloseDetails,
        priority: item.priority,
        status: item.raiseself,
        duedate: item.duedate,
        title: item.title,
        description: item.description,
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("RaiseTicket(Closed/Resolved).pdf");
  };


  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //Delete model
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Error Popup model
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleClickOpenViewpop = () => {
    setIsViewOpen(true);
  };
  const handleCloseViewpop = () => {
    setIsViewOpen(false);
  };
  //delete model
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  //get all project.
  const fetchAllRaisedTickets = async () => {
    try {
      let res_queue = await axios.get(SERVICE.RAISETICKETCLOSED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let ans = isUserRoleAccess.role.map((data) => data.toLowerCase());
      const isPresent = ans.some((value) =>
        ["Manager", "superadmin"].includes(value)
      );
      const checkList = isPresent
        ? res_queue?.data.raisetickets.filter((data) =>
            ["Closed", "Resolved"].includes(data.raiseself)
          )
        : res_queue?.data.raisetickets.filter(
            (data) =>
              data.employeename.includes(isUserRoleAccess.companyname) &&
              ["Closed", "Resolved"].includes(data.raiseself)
          );

      setRaiseTicketList(checkList);
      setQueueCheck(true);
    } catch (err) {setQueueCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllRaisedTickets();
  }, []);

  const [singleDoc, setSingleDoc] = useState({});
  let updateby = singleDoc?.updatedby;
  let addedby = singleDoc?.addedby;

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sraiseticket);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const getrowData = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sraiseticket);
      setCapturedImages(res?.data?.sraiseticket?.files);
      setRefImage(res?.data?.sraiseticket?.files);
      setRefImageDrag(res?.data?.sraiseticket?.files);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles.concat(
    refImage,
    refImageDrag,
    capturedImages
  );

  // Create an empty object to keep track of unique values
  let uniqueValues = {};

  // Filter out duplicates and create a new array
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

  const getInfoDetails = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.RAISETICKET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sraiseticket);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const getviewCode = async (e) => {
    try {
      let res = await axios.delete(
        `${SERVICE.RAISETICKET_SINGLE}/${singleDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleCloseDelete();
      await fetchAllRaisedTickets();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    status: true,
    raiseticketcount: true,
    raisedby: true,
    raiseddate: true,
    resolverby: true,
    resolvedate: true,
    category: true,
    subcategory: true,
    subsubcategory: true,
    employeename: true,
    employeecode: true,
    reason: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = raiseTicketList?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      employeename: item.employeename
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      employeecode: item.employeecode
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      category: item.category,
      subcategory: item.subcategory,
      subsubcategory:
        item.subsubcategory === "Please Select Sub Sub-category"
          ? ""
          : item.subsubcategory,
      workstation: item.workstation,
      materialname:
        item.materialname === "Please Select Material Name"
          ? ""
          : item.materialname,
      type: item.type,
      raiseddate: item.raiseddate,
      type: item.type,
      raisedby: item.raisedby,
      // resolverby: item?.resolverby?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      resolverby: item?.ticketclosed,
      resolvedate: item.resolvedate,
      raiseticketcount: item.raiseticketcount,
      reason: item.textAreaCloseDetails,
      priority: item.priority,
      status: item.raiseself,
      duedate: item.duedate,
      title: item.title,
      description: convertToNumberedList(item.description),
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [raiseTicketList]);

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

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
      headerName: "S.No",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography
              sx={{
                color:
                  params.row.status === "Open"
                    ? "red"
                    : params.row.status === "Resolved"
                    ? "green"
                    : params.row.status === "Details Needed"
                    ? "blue"
                    : params.row.status === "Closed"
                    ? "Orange"
                    : params.row.status === "Forwarded"
                    ? "palevioletred"
                    : params.row.status === "Reject"
                    ? "darkmagenta"
                    : "violet",
              }}
            >
              {params.row.status}
            </Typography>{" "}
          </Grid>
        </Grid>
      ),
    },

    {
      field: "raiseticketcount",
      headerName: "Ticket Number",
      flex: 0,
      width: 200,
      hide: !columnVisibility.raiseticketcount,
    },
    {
      field: "raisedby",
      headerName: "Raised By",
      flex: 0,
      width: 100,
      hide: !columnVisibility.raisedby,
    },
    {
      field: "raiseddate",
      headerName: "Raised Date/Time",
      flex: 0,
      width: 200,
      hide: !columnVisibility.raiseddate,
    },
    {
      field: "resolverby",
      headerName: "Resolved By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.resolverby,
    },
    {
      field: "resolvedate",
      headerName: "Resolved Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.resolvedate,
    },
    {
      field: "reason",
      headerName: "Resolved Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reason,
    },
    {
      field: "employeename",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeename,
    },
    {
      field: "employeecode",
      headerName: "Employee Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeecode,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 100,
      hide: !columnVisibility.category,
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 0,
      width: 150,

      hide: !columnVisibility.subcategory,
    },
    {
      field: "subsubcategory",
      headerName: "Sub 1 category",
      flex: 0,
      width: 150,

      hide: !columnVisibility.subsubcategory,
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params.row.status !== "Closed" &&
          params.row.status !== "Resolved" &&
          params.row.status !== "Reject"
            ? isUserRoleCompare?.includes("eraiseticket") && (
                <Link
                  to={`/tickets/raiseticketmaster/${params.row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    minWidth: "0px",
                  }}
                >
                  <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                    <EditOutlinedIcon style={{ fontSize: "large" }} />
                  </Button>
                </Link>
              )
            : ""}
          {params.row.status !== "Closed" &&
          params.row.status !== "Resolved" &&
          params.row.status !== "Reject"
            ? isUserRoleCompare?.includes("draiseticket") && (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    getinfoCode(params.row.id);
                    handleClickOpen();
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )
            : ""}
          {isUserRoleCompare?.includes("vraiseticket") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getrowData(params.row.id);
                handleClickOpenViewpop();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iraiseticket") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getInfoDetails(params.row.id);
                handleClickOpeninfo();
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeename: item.employeename,
      employeecode: item.employeecode,
      category: item.category,
      subcategory: item.subcategory,
      subsubcategory:item.subsubcategory   ===
      "Please Select Sub Sub-category"
      ? ""
      :item.subsubcategory,
      workstation: item.workstation,
      materialname: item.materialname,
      type: item.type,
      raiseddate: item.raiseddate,
      raisedby: item.raisedby,
      resolverby: item?.ticketclosed,
      resolvedate: item.resolvedate,
      raiseticketcount: item.raiseticketcount,
      reason: item.textAreaCloseDetails,
      priority: item.priority,
      status: item.raiseself,
      duedate: item.duedate,
      title: item.title,
      description:item.description,
    };
  });

  // Excel
  const fileName = "RaiseTicket(Closed/Resolved)";



  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RaiseTicket(Closed/Resolved)",
    pageStyle: "print",
  });

  const columns = [
    { title: "Status", field: "status" },
    { title: "Ticket Number", field: "raiseticketcount" },
    { title: "Raised By", field: "raisedby" },
    { title: "Raised Date", field: "raiseddate" },
    { title: "Resolved By", field: "resolverby" },
    { title: "Resolved Date", field: "resolvedate" },
        { title: "Reason ", field: "reason" },
    { title: "Employee Name", field: "employeename" },
    { title: "Employee Code", field: "employeecode" },
    { title: "Category", field: "category" },
    { title: "Subcategory ", field: "subcategory" },
    { title: "Sub 1 category ", field: "subsubcategory" },

  ];



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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Raise Ticket(Closed/Resolved).png");
        });
      });
    }
  };

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
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const delAccountcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.RAISETICKET_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setPage(1);
      await fetchAllRaisedTickets();
      handleCloseModcheckbox();
      setSelectedRows([]);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [copiedData, setCopiedData] = useState("");

  return (
    <Box>
      {/* <Headtitle title={"RAISE TICKET LIST"} /> */}
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Raise Ticket List (Closed / Resolved)
      </Typography>

      {!queueCheck ? (
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
        <>
          {isUserRoleCompare?.includes("lconsolidatedticketlist") && (
            <>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes(
                    "excelconsolidatedticketlist"
                  ) && (
                   
                    <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                  )}
                  {isUserRoleCompare?.includes("csvconsolidatedticketlist") && (
               
                    <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                  </>
                  )}
                  {isUserRoleCompare?.includes(
                    "printconsolidatedticketlist"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfconsolidatedticketlist") && (
                    <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                      }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                  )}
                  {isUserRoleCompare?.includes(
                    "imageconsolidatedticketlist"
                  ) && (
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
                </Grid>
              </Grid>
              <br />
              {/* ****** Table Grid Container ****** */}
              <Grid style={userStyle.dataTablestyle}>
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
                  </Select>
                </Box>
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
              &emsp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>{" "}
              &emsp;
              {isUserRoleCompare?.includes("bdconsolidatedticketlist") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
              {/* ****** Table start ****** */}
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
              {/* ****** Table End ****** */}
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                  aria-label="customized table"
                  id="raisetickets"
                  ref={componentRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Ticket Number</StyledTableCell>
                      <StyledTableCell>Raised By</StyledTableCell>
                      <StyledTableCell>Raised Date</StyledTableCell>
                      <StyledTableCell>Resolved By</StyledTableCell>
                      <StyledTableCell>Resolved Date</StyledTableCell>
                      <StyledTableCell>Reason</StyledTableCell>
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>Subcategory</StyledTableCell>
                      <StyledTableCell>Sub 1 category</StyledTableCell>

                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData?.length > 0 ?  (
                      filteredData?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.status}</StyledTableCell>
                          <StyledTableCell>
                            {row.raiseticketcount}
                          </StyledTableCell>
                          <StyledTableCell>{row.raisedby}</StyledTableCell>
                          <StyledTableCell>{row.raiseddate}</StyledTableCell>
                          <StyledTableCell>{row.resolverby}</StyledTableCell>
                          <StyledTableCell>{row.resolvedate}</StyledTableCell>
                          <StyledTableCell>{row.reason}</StyledTableCell>
                          <StyledTableCell>
                            {row.employeename}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.employeecode}
                          </StyledTableCell>
                          <StyledTableCell>{row.category}</StyledTableCell>
                          <StyledTableCell>{row.subcategory}</StyledTableCell>
                          <StyledTableCell>
                            {row.subsubcategory}
                          </StyledTableCell>
                        
                        </StyledTableRow>
                      ))
                    ): (
                      <StyledTableRow>
                        {" "}
                        <StyledTableCell colSpan={7} align="center">
                          No Data Available
                        </StyledTableCell>{" "}
                      </StyledTableRow>
                    )}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
            </>
          )}
        </>
      )}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Raise Ticket Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
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
                      {addedby?.map((item, i) => (
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
                            {item.name}
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
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
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
                      {updateby?.map((item, i) => (
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
                            {item.name}
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
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isViewOpen}
          onClose={handleCloseViewpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "scroll",
            "& .MuiPaper-root": {
              overflow: "scroll",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    View Raise Ticket
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                {singleDoc.accessdrop === "Manager" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>
                          Company
                        </Typography>
                        <Typography>{singleDoc.company}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>
                          Branch
                        </Typography>
                        <Typography>{singleDoc.branch}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>Unit</Typography>
                        <Typography>{singleDoc.unit}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={userStyle.HeaderText}>Team</Typography>
                        <Typography>{singleDoc.team}</Typography>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Employee Name
                    </Typography>
                    <Typography>
                      {singleDoc.employeename
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Employee Code
                    </Typography>
                    <Typography>
                      {singleDoc.employeecode
                        ?.map((t, i) => `${i + 1 + ". "}` + t)
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Category</Typography>
                    <Typography>{singleDoc.category}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Sub-Category
                    </Typography>
                    <Typography>{singleDoc.subcategory}</Typography>
                  </FormControl>
                </Grid>
                {singleDoc.subsubcategory && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>
                        Sub Sub-Category
                      </Typography>
                      <Typography>
                        {singleDoc.subsubcategory ===
                        "Please Select Sub Sub-category"
                          ? ""
                          : singleDoc.subsubcategory}
                      </Typography>
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Type</Typography>
                    <Typography>{singleDoc.type}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Reason</Typography>
                    <Typography>{singleDoc.reason}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Work Station
                    </Typography>
                    <Typography>{singleDoc?.workstation}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Material Name
                    </Typography>
                    <Typography>{singleDoc?.materialname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Priority</Typography>
                    <Typography>{singleDoc.priority}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Title</Typography>
                    <Typography>{singleDoc.title}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Description
                    </Typography>
                    <Typography>
                      {convertToNumberedList(singleDoc.description)}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>Status</Typography>
                    <Typography>{singleDoc?.raiseself}</Typography>
                  </FormControl>
                </Grid>
                {singleDoc.materialname && singleDoc.materialstatus && (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.HeaderText}>
                        Material Status
                      </Typography>
                      <Typography>{singleDoc?.materialstatus}</Typography>
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.HeaderText}>
                      Reason For Ticket Status{" "}
                    </Typography>
                    <Typography>{singleDoc?.textAreaCloseDetails}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={9} xs={12} sm={12}></Grid>
                <Grid item md={12} sm={12} xs={12}>
                  {resultArray.map((file, index) => (
                    <>
                      <Grid container>
                        <Grid item md={2} sm={2} xs={2}>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {file.type.includes("image/") ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                height={50}
                                style={{
                                  maxWidth: "-webkit-fill-available",
                                }}
                              />
                            ) : (
                              <img
                                className={classes.preview}
                                src={getFileIcon(file.name)}
                                height="10"
                                alt="file icon"
                              />
                            )}
                          </Box>
                        </Grid>
                        <Grid
                          item
                          md={8}
                          sm={8}
                          xs={8}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {" "}
                            {file.name}{" "}
                          </Typography>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                          <Grid sx={{ display: "flex" }}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => renderFilePreview(file)}
                            >
                              <VisibilityOutlinedIcon
                                style={{ fontsize: "12px", color: "#357AE8" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Grid>

              <br />

              <br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button variant="contained" onClick={handleCloseViewpop}>
                    Back
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </>
          </Box>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delAccountcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
            {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => getviewCode()}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
    </Box>
  );
}

export default RaiseticketClosedResolvedList;