import React, { useState, useEffect, useRef, useContext } from "react";
import {
  TextField,
  IconButton,
  ListItem,
  List,
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
  Checkbox,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { BASE_URL } from "../../../services/Authservice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";


function DocumentsList() {
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
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
    'Category name',
    'Subcategoryname',
    'Type',
    'Module ',
    'Customer',
    'Queue',
    'Process',
    'Form'
  ];
  let exportRowValues = [
    'categoryname',
    'subcategoryname',
    'type',
    'module',
    'customer',
    'queue',
    'process',
    'form'
  ];
  const [documentsList, setDocumentsList] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const { auth } = useContext(AuthContext);
  //Datatable
    const [singleDoc, setSingleDoc] = useState({});
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const gridRef = useRef(null);
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
  const rowDataTable = filteredData.map((item, index) => {
    let documentArray =
      item.document.length === 0 ? item.documentstext : item.document;
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname.toString(),
      subcategoryname: item.subcategoryname.toString(),
      type: item.type,
      module: item.module.toString(),
      customer: item.customer.toString(),
      queue: item.queue.toString(),
      process: item.process.toString(),
      form: item.form,
      document: item.document,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const delVendorcheckbox = async () => {
        setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.DOCUMENT_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchAllApproveds();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
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

  //get all project.
  const fetchAllApproveds = async () => {
        setPageName(!pageName);
    try {
      const [result] = await Promise.all([
        axios.post(SERVICE.ALLASSIGNDOCUMENT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userid: String(isUserRoleAccess?._id)
        })
      ]);

      const filteredData =result?.data?.assignedDocs?.length > 0 ?  
      result?.data?.documents?.filter((item1) => {
        return result?.data?.assignedDocs?.some(
          (item2) =>
            item1.type === item2.type &&
            item1.categoryname.some((cat) =>
              item1.categoryname.includes(cat)
            ) &&
            item1.subcategoryname.every((subcat) =>
              item1.subcategoryname.includes(subcat)
            ) &&
            item1.module.some((data) => data === item2.module)
        )
    }):[];

     
     const answer =  filteredData?.map((item, index) => ({
        ...item,
        type: item?.type === "Please  Select Type" ? "" : item?.type,
        customer: item.customer
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        subcategoryname: item.subcategoryname
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        categoryname: item.categoryname
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        queue: item.queue
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        process: item.process
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        module: item.module
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
      }));

      console.log(answer , 'answer')
      setDocumentsList(answer);
      setQueueCheck(true);
    } catch (err) {setQueueCheck(true);handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  useEffect(() => {
    fetchAllApproveds();
  }, []);

  useEffect(() => {
    addSerialNumber(documentsList);
  }, [documentsList]);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const columns = [
    { title: "Category name", field: "categoryname" },
    { title: "Subcategoryname", field: "subcategoryname" },
    { title: "Type", field: "type" },
    { title: "Module ", field: "module" },
    { title: "Customer", field: "customer" },
    { title: "Queue", field: "queue" },
    { title: "Process", field: "process" },
    { title: "Form", field: "form" },
  ];

  const handleDownload = async (id) => {
    let response = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    const pages = response.data.sdocument.documentstext;
    const numPages = pages.length;
    const pageNumber = 1;

    const doc = new jsPDF();

    // Show the content of the current page
    doc.text(10, 10, pages[pageNumber - 1]);

    // Convert the content to a data URL
    const pdfDataUri = doc.output("datauristring");

    const newTab = window.open();
    newTab.document.write(`
      <html>
        <style>
          body {
            font-family: 'Arial, sans-serif';
            margin: 0;
            padding: 0;
            background-color: #fff;
            color: #000;
          }
          .pdf-viewer {
            display: flex;
            flex-direction: column;
          }
          .pdf-navigation {
            display: flex;
            justify-content: space-between;
            margin: 20px;
            align-items: center;
          }
          button {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border: none;
            cursor: pointer;
          }
          .pdf-content {
            background-color: #fff;
            padding: 20px;
            box-sizing: border-box;
            flex: 1;
          }
          .pdf-thumbnails {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
          .pdf-thumbnail {
            cursor: pointer;
            margin: 0 5px;
            font-size: 14px;
            padding: 5px;
          }
        </style>
        <body>
          <div class="pdf-viewer">
            <div class="pdf-navigation">
              <button onclick="goToPrevPage()">Prev</button>
              <span>Page ${pageNumber} of ${numPages}</span>
              <button onclick="goToNextPage()">Next</button>
            </div>
            <div class="pdf-content">
              ${/* Render PDF content directly in the embed tag */ ""}
              <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
            </div>
            <div class="pdf-thumbnails">
              ${pages
        .map(
          (_, index) =>
            `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1
            })">${index + 1}</div>`
        )
        .join("")}
            </div>
          </div>
          <script>
            let pageNumber = ${pageNumber};
            let numPages = ${numPages};
            let pagesData = ${JSON.stringify(pages)};

            function goToPrevPage() {
              if (pageNumber > 1) {
                pageNumber--;
                updatePage();
              }
            }

            function goToNextPage() {
              if (pageNumber < numPages) {
                pageNumber++;
                updatePage();
              }
            }

            function updatePage() {
              document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
              document.querySelector('.pdf-content').innerHTML = pagesData[pageNumber - 1];
            }

            function handlePageClick(page) {
              pageNumber = page;
              updatePage();
            }
            
            // Load initial content
            updatePage();
          </script>
        </body>
      </html>
    `);
  };


  // Excel
  const fileName = "Documentslist";


  const getinfoCode = async (e) => {
        setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      handleClickOpeninfo();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };
  const getCode = async (e) => {
        setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      handleClickOpen();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };
  const getviewCode = async (e) => {
        setPageName(!pageName);
    try {
      let res = await axios.delete(
        `${SERVICE.DOCUMENT_SINGLE}/${singleDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleCloseDelete();
      await fetchAllApproveds();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const renderFilePreviewExcelPdfs = async (file) => {
    const { path } = file;
    if (path) {
      const url = `${BASE_URL}/${path}`; // Construct the URL based on your server setup
      window.open(url, "_blank");
    } else {
      const pdfBlobUrl = URL.createObjectURL(file);
      window.open(pdfBlobUrl, "_blank");
    }

  };

  const getDownloadFile = async (id) => {
        setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

    
      const answer = response?.data?.sdocument?.document;
      const viewFiles =  answer?.length > 0 ? answer?.map(Data => {
         renderFilePreviewExcelPdfs(Data)
       }):""
   
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
      if (gridRefTableImg.current) {
        domtoimage.toBlob(gridRefTableImg.current)
          .then((blob) => {
            saveAs(blob, "Documents List.png");
          })
          .catch((error) => {
            console.error("dom-to-image error: ", error);
          });
      }
    };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Documentslist",
    pageStyle: "print",
  });

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    categoryname: true,
    subcategoryname: true,
    type: true,
    module: true,
    customer: true,
    queue: true,
    process: true,
    form: true,
    documentstext: true,
    document: true,
    download: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };



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
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      lockPinned: true,
    },

    {
      field: "categoryname",
      headerName: "Category Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategoryname",
      headerName: " SubCategory Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.subcategoryname,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.type,
    },
    {
      field: "module",
      headerName: "Module",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.module,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.customer,
    },
    {
      field: "queue",
      headerName: "Queue",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.queue,
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.process,
    },
    {
      field: "form",
      headerName: "Form",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.form,
    },
    {
      field: "document",
      headerName: "Documents",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.document,
      pinned: "left",
      lockPinned: true,
      cellRenderer: (params) => (
        <Grid>
          {params.data.document.length < 1 ? (
            <div className="page-pdf">
              <Button
                onClick={() => {
                  handleDownload(params.data.id);
                }}
                className="next-pdf-btn pdf-button"
              >
                Views
              </Button>
            </div>
          ) : (
            <Button
              variant="text"
              onClick={() => {
                getDownloadFile(params.data.id);
              }}
              sx={userStyle.buttonview}
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("edocumentlist") && (
            <Link
              to={`/documentlist/edit/${params.data.id}/listdocument`}
              style={{ textDecoration: "none", color: "#fff"}}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "20px" }}>
                <EditOutlinedIcon  sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("ddocumentlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getCode(params.data.id);
               
              }}
            >
              <DeleteOutlineOutlinedIcon  sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdocumentlist") && (
            <Link
              to={`/documentlist/view/${params.data.id}/listdocument`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button sx={userStyle.buttonview}>
                <VisibilityOutlinedIcon  sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("idocumentlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
             
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon  sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
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

  return (
    <Box>
      <Headtitle title={"Documents List"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Documents List</Typography> */}
      <PageHeading
        title="Documents List"
        modulename="Documents"
        submodulename="Document List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
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
          {isUserRoleCompare?.includes("ldocumentlist") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container spacing={2}>
                  <Grid md={11} item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      All Document List
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("exceldocumentlist") && (

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvdocumentlist") && (
                      
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printdocumentlist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfdocumentlist") && (
                      
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagedocumentlist") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
                        </Button>
                      </>
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
                      <MenuItem value={documentsList?.length}>All</MenuItem>
                    </Select>
                  </Box>
                  <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={documentsList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
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
                &emsp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  Manage Columns
                </Button>
                &emsp;
                {isUserRoleCompare?.includes("bddocumentlist") && (
                  <Button
                    variant="contained"
                    color="error"
                    sx={buttonStyles.buttonbulkdelete}
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
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}     
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}     
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={items}

                />
                  {/* <StyledDataGrid
                    rows={rowsWithCheckboxes}
                    density="compact"
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )} // Only render visible columns
                    onSelectionModelChange={handleSelectionChange}
                    autoHeight={true}
                    hideFooter
                    ref={gridRef}
                    getRowClassName={getRowClassName}
                    selectionModel={selectedRows}
                    disableRowSelectionOnClick
                  /> */}
                </Box>
                {/* ****** Table End ****** */}
              </Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                  sx={{}}
                  aria-label="customized table"
                  id="jobopening"
                  ref={componentRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Category Name</StyledTableCell>
                      <StyledTableCell>Sub Category Name</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell> Module</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Queue</StyledTableCell>
                      <StyledTableCell>Process</StyledTableCell>
                      <StyledTableCell>Form</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData?.length > 0 ? (
                      filteredData?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row?.serialNumber}</StyledTableCell>
                          <StyledTableCell>{row?.categoryname}</StyledTableCell>
                          <StyledTableCell>
                            {row?.subcategoryname}
                          </StyledTableCell>
                          <StyledTableCell>{row?.type}</StyledTableCell>
                          <StyledTableCell>{row?.module}</StyledTableCell>
                          <StyledTableCell>{row?.customer}</StyledTableCell>
                          <StyledTableCell>{row?.queue}</StyledTableCell>
                          <StyledTableCell>{row?.process}</StyledTableCell>
                          <StyledTableCell>{row?.form}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
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
          <Button sx={buttonStyles.btncancel} onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => getviewCode()}
            autoFocus
            variant="contained"
            color="error"
            sx={buttonStyles.buttonsubmit}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
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
              sx={buttonStyles.buttonsubmit}
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
            <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              sx={buttonStyles.buttonsubmit}
              onClick={(e) => delVendorcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


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
        itemsTwo={documentsList ?? []}
        filename={"Documents List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Documents Info"
        addedby={singleDoc.addedby}
        updateby={singleDoc.updatedby}
      />



    </Box>
  );
}

export default DocumentsList;