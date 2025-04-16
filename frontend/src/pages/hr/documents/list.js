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

function DocumentsList() {
  const [documentsList, setDocumentsList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
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
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((t, index) => ({
          "Sno": index + 1,
          Categoryname: t.categoryname.join(","),
          Subcategoryname: t.subcategoryname.join(","),
          Type: t.type,
          Module: t.module.join(","),
          Customer: t.customer.join(","),
          Queue: t.queue.join(","),
          Process: t.process.join(","),
          Form: t.form,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        documentsList?.map((t, index) => ({
          "Sno": index + 1,
          Categoryname: t.categoryname.join(","),
          Subcategoryname: t.subcategoryname.join(","),
          Type: t.type,
          Module: t.module.join(","),
          Customer: t.customer.join(","),
          Queue: t.queue.join(","),
          Process: t.process.join(","),
          Form: t.form,
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
      filteredData.map(t => ({
        serialNumber: serialNumberCounter++,
        categoryname: t.categoryname.join(","),
        subcategoryname: t.subcategoryname.join(","),
        type: t.type,
        module: t.module.join(","),
        customer: t.customer.join(","),
        queue: t.queue.join(","),
        process: t.process.join(","),
        form: t.form,
      })) :
      documentsList?.map(t => ({
        serialNumber: serialNumberCounter++,
        categoryname: t.categoryname.join(","),
        subcategoryname: t.subcategoryname.join(","),
        type: t.type,
        module: t.module.join(","),
        customer: t.customer.join(","),
        queue: t.queue.join(","),
        process: t.process.join(","),
        form: t.form,
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Documentslist.pdf");
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

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchAllApproveds();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
    try {
      const [result] = await Promise.all([
        axios.post(SERVICE.ALLASSIGNDOCUMENT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userid: String(isUserRoleAccess?._id)
        })
      ]);
      const filteredData = result?.data?.documents.filter((item1) => {
        result?.data?.assignedDocs.forEach(
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
        return item1
    });

      setDocumentsList(filteredData);
      setQueueCheck(true);
    } catch (err) {setQueueCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllApproveds();
  }, []);

  useEffect(() => {
    addSerialNumber();
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
    try {
      let res = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const getviewCode = async (e) => {
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getDownloadFile = async (id) => {
    try {
      let response = await axios.get(`${SERVICE.DOCUMENT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

    

      if (response?.data?.sdocument?.document?.length === 0) {
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

        const pdfContentArray = response.data.sdocument.document[0];

        const fileExtension = getFileExtension(pdfContentArray.name);

        if (
          fileExtension === "xlsx" ||
          fileExtension === "xls" ||
          fileExtension === "csv"
        ) {
          readExcel(pdfContentArray.data)
            .then((excelData) => {
              const newTab = window.open();
              const htmlTable = generateHtmlTable(excelData);
              newTab.document.write(htmlTable);
            })
            .catch((error) => {
            });
        }
       
        else if (fileExtension === "pdf") {
          const renderFilePreview = async (pdfContentArray) => {
            const response = await fetch(pdfContentArray.preview);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            window.open(link, "_blank");
          };
          renderFilePreview(pdfContentArray);
        }

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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Documentslist.png");
        });
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
  const addSerialNumber = () => {
    const itemsWithSerialNumber = documentsList?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

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
      renderCell: (params) => (
        <Grid>
          {params.row.document.length < 1 ? (
            <div className="page-pdf">
              <Button
                onClick={() => {
                  handleDownload(params.row.id);
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
                getDownloadFile(params.row.id);
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
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("edocumentlist") && (
            <Link
              to={`/documentlist/edit/${params.row.id}/listdocument`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <EditOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("ddocumentlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getinfoCode(params.row.id);
                handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdocumentlist") && (
            <Link
              to={`/documentlist/view/${params.row.id}/listdocument`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button sx={userStyle.buttonview}>
                <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("idocumentlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
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
      <Typography sx={userStyle.HeaderText}>Documents List</Typography>
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
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                {isUserRoleCompare?.includes("bddocumentlist") && (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
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
                          <StyledTableCell>{row?.categoryname?.join(",")}</StyledTableCell>
                          <StyledTableCell>
                            {row?.subcategoryname?.join(",")}
                          </StyledTableCell>
                          <StyledTableCell>{row?.type}</StyledTableCell>
                          <StyledTableCell>{row?.customer?.join(",")}</StyledTableCell>
                          <StyledTableCell>{row?.queue?.join(",")}</StyledTableCell>
                          <StyledTableCell>{row?.process?.join(",")}</StyledTableCell>
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
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Added Documents Info
            </Typography>
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
                      {singleDoc.addedby?.map((item, i) => (
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
                      {singleDoc?.updatedby?.map((item, i) => (
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
        <Box>
          <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }} >
              <Typography variant="h6">{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }} onClick={handleCloseerr}>  ok </Button>
            </DialogActions>
          </Dialog>
        </Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delVendorcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default DocumentsList;