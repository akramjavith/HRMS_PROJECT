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

  Select,

  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,

  Checkbox,

  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { htmlToText } from "html-to-text"; // Import htmlToText specifically
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import * as XLSX from "xlsx";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

function ListOrganizationDocument({ vendorAuto }) {



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
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };














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



  let exportColumnNames = ["Category", "Subcategory", "Name"];
  let exportRowValues = ["categoryname", "subcategoryname", "name"];




  const gridRef = useRef(null);
  const [documentsList, setDocumentsList] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [singleDoc, setSingleDoc] = useState({});
  const { auth } = useContext(AuthContext);
  //Datatable
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [documentFiles, setdocumentFiles] = useState([]);
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    categoryname: true,
    subcategoryname: true,
    name: true,
    document: true,
    download: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  useEffect(() => {
    fetchAllApproveds();
  }, [vendorAuto]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const getDownloadFile = async (id) => {
    try {
      let response = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      if (response?.data?.sdocument?.document?.length === 0) {
        const doc = new jsPDF();
        const htmlContent = response?.data?.sdocument?.documentstext;

        // if (containsImage(htmlContent)) {

        const imageSrc = getImageSrc(htmlContent);

        if (imageSrc) {
          // If the HTML content contains an image, add it to the PDF
          doc.addImage(imageSrc, "JPEG", 10, 10, 100, 100);
        }

        // // Create a new tab
        const plainText = htmlToText(htmlContent, {
          wordwrap: 200,
          preserveNewlines: true,
          uppercaseHeadings: false,
        });
        let removeImageContent = plainText.replace(
          /\[data:image\/(jpeg|png);base64,[^\]]+\]/g,
          ""
        );
        doc.setFontSize(8);
        doc.text(removeImageContent, 10, 10);
        const pdfDataUri = doc.output("datauristring");
        const newTabs = window.open();
        newTabs.document.write(`
          <html>
          <style>
          body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          </style>
          <body>
            <iframe
              width="100%"
              height="100%"
              src="data:text/html;charset=utf-8,${encodeURIComponent(
          htmlContent
        )}"
            onload="disableRightClickAndTextSelection()"
            >
            </iframe>
    
          </body>
          </html>
          `);

        function getImageSrc(content) {
          // Extract the image source from the <img> tag
          const match = /<img.*src="(data:image\/[^"]+)"/.exec(content);
          return match ? match[1] : null;
        }
      } else {
        const readExcel = (base64Data) => {
          return new Promise((resolve, reject) => {
            const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
              c.charCodeAt(0)
            ).buffer;

            const wb = XLSX.read(bufferArray, { type: "buffer" });

            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws);

            resolve(data);
          });
        };

        const pdfContentArray = response.data.sdocument.document;

        pdfContentArray.forEach((document) => {
          const fileExtension = getFileExtension(document.name);

          if (
            fileExtension === "xlsx" ||
            fileExtension === "xls" ||
            fileExtension === "csv"
          ) {
            readExcel(document.data)
              .then((excelData) => {
                // setReadXl(excelData);

                const newTab = window.open();
                const htmlTable = generateHtmlTable(excelData);
                newTab.document.write(htmlTable);
              })
              .catch((error) => {
                console.error("Error reading Excel file:", error);
              });
          } else if (fileExtension === "pdf") {
            // Handle PDF file
            const newTab = window.open();
            newTab.document.write(
              '<iframe width="100%" height="100%" src="' +
              document.preview +
              '"></iframe>'
            );
          }
        });

        // Helper function to extract file extension from a filename
        function getFileExtension(filename) {
          return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
        }

        // Helper function to generate an HTML table from Excel data
        function generateHtmlTable(data) {
          const headers = Object.keys(data[0]);

          const tableHeader = `<tr>${headers
            .map(
              (header) =>
                `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
            )
            .join("")}</tr>`;

          const tableRows = data.map((row, index) => {
            const rowStyle =
              index % 2 === 0 ? "background-color: #f9f9f9;" : "";
            const cells = headers
              .map(
                (header) =>
                  `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
              )
              .join("");
            return `<tr>${cells}</tr>`;
          });

          return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
            ""
          )}</table>`;
        }
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      if (res?.data?.sdocument?.document?.length != 0) {
        res?.data?.sdocument?.document.forEach((file) => {
          const link = document.createElement("a");
          link.href = `data:application/octet-stream;base64,${file.data}`;
          link.download = file.name;
          link.click();
        });
      } else {
        // Download documentstext as PDF
        const doc = new jsPDF();

        // Convert HTML to PDF using html2pdf
        html2pdf(res?.data?.sdocument?.documentstext, {
          margin: 10,
          filename: "OrganizationDocumentTextEditor.pdf",
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }).then((pdf) => {
          pdf.output("dataurl").then((pdfDataUri) => {
            const link = document.createElement("a");
            link.href = pdfDataUri;
            link.download = "OrganizationDocumentTextEditor.pdf";
            link.click();
          });
        });
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // ... rest of your code

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "OrganizationDocument.png");
        });
      });
    }
  };
  const handleViewOpen = () => {
    setOpenView(true);
  };
  const handlViewClose = () => {
    setOpenView(false);
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
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //delete model

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_ORGDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsList(res_queue?.data?.document);
      setLoading(true);
    } catch (err) { setLoading(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
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
  //Project updateby edit page...
  let updateby = viewInfo.updatedby;
  let addedby = viewInfo.addedby;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };


  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setSingleDoc(res?.data?.sdocument);
      setViewInfo(res?.data?.sdocument);
      // setdocumentFiles(res?.data?.sdocument?.document);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const rowData = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setdocumentFiles(res?.data?.sdocument?.document);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const getViewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ORGDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setdocumentFiles(res?.data?.sdocument?.document);
      handleViewOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const delFunction = async (e) => {
    try {
      let res = await axios.delete(
        `${SERVICE.ORGDOCUMENT_SINGLE}/${singleDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleCloseMod();
      handleCloseDelete();

      await fetchAllApproveds();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ORGDOCUMENT_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchAllApproveds();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Organization Document",
    pageStyle: "print",
  });

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
  const filteredDatas = documentsList?.filter((item) => {
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
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 0,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "categoryname",
      headerName: "Category",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },
    {
      field: "subcategoryname",
      headerName: " SubCategory",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.subcategoryname,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.name,
    },
    {
      field: "document",
      headerName: "Documents",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.document,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.id);
            }}
            sx={userStyle.buttonview}
          >
            View
          </Button>
        </Grid>
      ),
    },
    {
      field: "download",
      headerName: "Download",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.download,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              fileDataDownload(params.row.id);
            }}
            sx={userStyle.buttonview}
          >
            Download
          </Button>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eorganizationdocument") && (
            <Link
              to={`/settings/editorganizationdocument/edit/${params.row.id}`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <EditOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dorganizationdocument") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
                // handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vorganizationdocument") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getViewCode(params.row.id);
                // handleViewOpen();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iorganizationdocument") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    let documentArray =
      item?.document?.length === 0 ? item.documentstext : item.document;
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      subcategoryname: item.subcategoryname,
      name: item.name,
      document: documentArray,
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
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column?.headerName?.toLowerCase().includes(searchQueryManage?.toLowerCase())
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
  return (
    <Box>
      {!loading ? (
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
          {isUserRoleCompare?.includes("lorganizationdocument") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      All Organization Document List
                    </Typography>
                  </Grid>
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
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "excelorganizationdocument"
                    ) && (
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
                    {isUserRoleCompare?.includes("csvorganizationdocument") && (
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
                    {isUserRoleCompare?.includes(
                      "printorganizationdocument"
                    ) && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes("pdforganizationdocument") && (
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
                    {isUserRoleCompare?.includes(
                      "imageorganizationdocument"
                    ) && (
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
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
                      {/* <MenuItem value={documentsList?.length}>All</MenuItem> */}
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
                </Button>
                &emsp;
                {isUserRoleCompare?.includes("bdorganizationdocument") && (
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                    onClick={handleClickOpenalert}
                  >
                    Bulk Delete
                  </Button>
                )}
                <br />
                <br />
                {/* ****** Table start ****** */}
                <Box style={{ width: "100%", overflowY: "hidden" }} ref={gridRef}>
                  <StyledDataGrid
                    rows={rowsWithCheckboxes}
                    density="compact"
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
                    autoHeight={true}
                    hideFooter

                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
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
              </Box>

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


      <br />
      <br />
      {/* view model */}
      <Dialog
        open={openView}
        onClose={handlViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "500px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Organization Document
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>{singleDoc.categoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> SubCategory</Typography>
                  <Typography>{singleDoc.subcategoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{singleDoc.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}></Grid>

              <Grid item md={12} xs={12} sm={12}>
                {documentFiles?.length > 0 && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> File Type</Typography>
                        <Typography>{singleDoc.fileoptionname}</Typography>
                      </FormControl>
                    </Grid><br />
                    <Typography variant="h6"> Uploaded Documents</Typography>
                    <br />
                  </>
                )}
                {documentFiles?.length > 0 &&
                  documentFiles.map((file, index) => (
                    <>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Grid item md={10} sm={10} xs={10}>
                          <Typography>{file.name}</Typography>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreview(file)}
                          />
                        </Grid>
                      </Grid>
                    </>
                  ))}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlViewClose}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
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
      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={documentsList ?? []}
        filename={"List Organization Document"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Organization Document Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delFunction}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
    </Box>
  );
}
export default ListOrganizationDocument;