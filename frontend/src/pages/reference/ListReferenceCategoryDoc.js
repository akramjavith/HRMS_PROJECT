import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, Checkbox, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
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
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PageHeading from "../../components/PageHeading";

function ListReferenceCategoryDoc() {

  const gridRef = useRef(null);
  const [documentsList, setDocumentsList] = useState([]);
  const { isUserRoleCompare, pageName, setPageName } = useContext(UserRoleAccessContext);
  const [singleDoc, setSingleDoc] = useState({});
  const { auth } = useContext(AuthContext);
  //Datatable
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [openInfo, setOpeninfo] = useState(false);
  const [docData, setDocData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]);
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    categoryname: true,
    subcategoryname: true,
    steplist: true,
    namelist: true,
    referencetodo: true,
    download: true,
  };
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //useEffect
  useEffect(() => {
    fetchAllApproveds();
    // getexcelDatas();
  }, []);

  useEffect(() => {
    addSerialNumber();
  }, [documentsList]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);


  const [overallExcelDatas, setOverallExcelDatas] = useState([])
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
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          "Category Name": item.categoryname,
          "Sub Category Name": item.subcategoryname,
          "Step List": item.steplist,
          "Name List": item.namelist,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overallExcelDatas.map((item, index) => ({
          "Sno": index + 1,
          "Category Name": item.categoryname,
          "Sub Category Name": item.subcategoryname,
          "Step List": item.referencetodo.map((d) => d.label).join(','),
          "Name List": item.referencetodo.map((d) => d.name).join(','),
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  // get all branches
  const fetchOverallExcelDatas = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallExcelDatas(res_queue?.data.document);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])

















  const getDownloadFile = async (data) => {

    const ans = data.filter(item => item?.document?.length < 1).map(d => d?.documentstext)
    const ansDocuments = data.filter(item => item?.document?.length > 0)
    const ansType = data.filter(item => item?.document?.length < 1).map(d => d?.label)


    if (ans.length > 0) {
      const pages = ans;
      const numPages = pages.length;
      const pageNumber = 1;

      const goToPrevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
      const goToNextPage = () => setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));

      const handlePageClick = (page) => {
        setPageNumber(page);
      };

      function updatePage() {
        const currentPageContent = pages[pageNumber - 1];
        document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
        document.querySelector('.pdf-content').innerHTML = currentPageContent;
      }

      const doc = new jsPDF();

      // Show the content of the current page
      doc.text(10, 10, pages[pageNumber - 1]);

      // Convert the content to a data URL
      const pdfDataUri = doc.output('datauristring');

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
            #pdf-heading {
              text-align: center;
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
              <h2 id="pdf-heading">${ansType[pageNumber - 1]}</h2> <!-- Add heading here -->
              <div class="pdf-content">
              <div class="pdf-content">
                ${/* Render PDF content directly in the embed tag */ ''}
                <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
              </div>
              <div class="pdf-thumbnails">
                ${pages.map((_, index) => `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1})">${index + 1}</div>`).join('')}
              </div>
            </div>
            <script>
              let pageNumber = ${pageNumber};
              let numPages = ${numPages};
              let pagesData = ${JSON.stringify(pages)};
              let ansType = ${JSON.stringify(ansType)};
  
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
                document.getElementById('pdf-heading').innerText = ansType[pageNumber - 1]; // Update heading
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
    }
    if (ansDocuments.length > 0) {
      data.forEach((d) => {
        const readExcel = (base64Data) => {
          return new Promise((resolve, reject) => {
            const bufferArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;

            const wb = XLSX.read(bufferArray, { type: "buffer" });

            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws);

            resolve(data);
          });
        };

        const pdfContentArray = d.document;

        pdfContentArray.forEach((document) => {
          const fileExtension = getFileExtension(document.name);

          if (fileExtension === "xlsx" || fileExtension === "xls") {
            readExcel(document.data)
              .then((excelData) => {

                const newTab = window.open();
                const htmlTable = generateHtmlTable(excelData);
                newTab.document.write(htmlTable);
              })
              .catch((error) => {
              });
          } else if (fileExtension === "pdf") {
            // Handle PDF file
            const newTab = window.open();
            newTab.document.write('<iframe width="100%" height="100%" src="' + document.preview + '"></iframe>');
          }
        });

        // Helper function to extract file extension from a filename
        function getFileExtension(filename) {
          return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
        }

        // Helper function to generate an HTML table from Excel data
        function generateHtmlTable(data) {
          const headers = Object.keys(data[0]);

          const tableHeader = `<tr>${headers.map((header) => `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`).join("")}</tr>`;

          const tableRows = data.map((row, index) => {
            const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
            const cells = headers.map((header) => `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`).join("");
            return `<tr>${cells}</tr>`;
          });

          return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join("")}</table>`;
        }



      })
    }

  };

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
          saveAs(blob, "ReferenceDocumentList.png");
        });
      });
    }
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

  //Delete model

  const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
  const handleCloseModcheckbox = () => { setIsDeleteOpencheckbox(false); };
  const handleViewOpen = () => { setOpenView(true); };
  const handlViewClose = () => { setOpenView(false); };

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => { setManageColumnsOpen(false); };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //delete model
  const handleClickOpen = () => { setOpenDelete(true); };
  const handleCloseDelete = () => { setOpenDelete(false); };
  const handleCloseinfo = () => { setOpeninfo(false); };

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsList(res_queue?.data.document);
      setLoading(true);
    } catch (err) {setLoading(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Error Popup model
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };
  // info model  
  const handleClickOpeninfo = () => { setOpeninfo(true); };

  //Project updateby edit page...
  let updateby = viewInfo.updatedby;
  let addedby = viewInfo.addedby;
  let snos = 1;
  // this is the etimation concadination value
  const modifiedData = documentsList?.map((person) => ({
    ...person,
    sino: snos++,
  }));
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const columns = [
    { title: "Category name", field: "categoryname" },
    { title: "Subcategoryname", field: "subcategoryname" },
    { title: "Step ", field: "steplist" },
    { title: "Name ", field: "namelist" },
  ];
  // PDF
  // const downloadPdf = () => {
  //   const doc = new jsPDF();
  //   // Add a step and name
  //   const itemsWithStepAndName = filteredData.map((item, index) => ({
  //     ...item,
  //     step: item.referencetodo.map((d) => d.label).join(','),
  //     name: item.referencetodo.map((d) => d.name).join(','),
  //   }));
  //   doc.autoTable({
  //     theme: "grid",
  //     styles: { fontSize: 4, },
  //     columns: columns.map((col) => ({ ...col, dataKey: col.field })),
  //     body: itemsWithStepAndName,
  //   });
  //   doc.save("ReferenceDocumentList.pdf");
  // };

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
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        categoryname: item.categoryname,
        subcategoryname: item.subcategoryname,
        steplist: item.steplist,
        namelist: item.namelist,

      })) :
      overallExcelDatas.map((item, index) => ({
        "serialNumber": index + 1,
        categoryname: item.categoryname,
        subcategoryname: item.subcategoryname,
        steplist: item.referencetodo.map((d) => d.label).join(','),
        namelist: item.referencetodo.map((d) => d.name).join(','),

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("ReferenceDocumentList.pdf");
  };



  // Excel
  const fileName = "ReferenceDocumentList";
  // get particular columns for export excel
  const getexcelDatas = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_REFDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data = res_queue.data.document.map((item, i) => ({
        "S.No": item.serialNumber,
        "Categoryname": item.categoryname,
        "Subcategoryname": item.subcategoryname,
        "Step": item.referencetodo.map((d) => d.label).join(','),
        "Name": item.referencetodo.map((d) => d.name).join(','),
      }));
      setDocData(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.REFDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setViewInfo(res?.data?.sdocument);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getviewCode = async (e) => {
    try {
      let res = await axios.delete(`${SERVICE.REFDOCUMENT_SINGLE}/${singleDoc._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
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

  const delVendorcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.REFDOCUMENT_SINGLE}/${item}`, {
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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ReferenceDocumentList",
    pageStyle: "print",
  });

  // //serial no for listing items
  // const addSerialNumber = () => {
  //   const itemsWithSerialNumber = modifiedData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
  // };
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = documentsList?.map((item, index) => {
     
    let steparray = item.referencetodo.map(d => d.label);
    let namearray = item.referencetodo.map(d => d.name);

      return{
      ...item,
      serialNumber: index + 1,
      steplist: steparray.join(",").toString(),
      namelist: namearray.join(",").toString(),
      }
    });
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
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });
  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
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
      field: "steplist",
      headerName: "Step",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.step,
    },
    {
      field: "namelist",
      headerName: "Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.name,
    },
    {
      field: "referencetodo",
      headerName: "Documents",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.referencetodo,
      renderCell: (params) => (
        <Grid>
          {/* <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.referencetodo);
            }}
            sx={userStyle.buttonview}
          >
            View
          </Button> */}
          <div className="page-pdf">
            <Button
              onClick={() => {
                getDownloadFile(params.row.referencetodo);
              }}
              className="next-pdf-btn pdf-button">
              View
            </Button>
          </div>
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
          {isUserRoleCompare?.includes("ereferencelist") && (
            <Link to={`/editrefcategoryref/edit/${params.row.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <EditOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dreferencelist") && (
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
          {isUserRoleCompare?.includes("vreferencelist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getinfoCode(params.row.id);
                handleViewOpen();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferencelist") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    // let documentArray = item.document.length === 0 ? item.documentstext : item.document;

    // let steparray = item.referencetodo.map(d => d.label);
    // let namearray = item.referencetodo.map(d => d.name);

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      subcategoryname: item.subcategoryname,
      // steplist: steparray.join(",").toString(),
      // namelist: namearray.join(",").toString(),
      steplist: item.steplist,
      namelist: item.namelist,
      name: item.referencetodo,
      referencetodo: item.referencetodo,
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
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
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
      {/* <Headtitle title={"REFERENCE DOCUMENTS LIST"} /> */}
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Reference Documents List"
        modulename="References"
        submodulename="Reference List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lreferencelist") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>All Reference Documents List</Typography>
                  </Grid>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("excelreferencelist") && (
                      // <>
                      //   <ExportXL csvData={filteredData?.map((t, index) => ({
                      //     Sno: index + 1,
                      //     "Categoryname": t.categoryname,
                      //     "Subcategoryname": t.subcategoryname,
                      //     "Step": t.referencetodo.map((d) => d.label).join(','),
                      //     "Name": t.referencetodo.map((d) => d.name).join(','),
                      //   }))} fileName={fileName} />
                      // </>
                      <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                    )}
                    {isUserRoleCompare?.includes("csvreferencelist") && (
                      // <>
                      //   <ExportCSV csvData={filteredData?.map((t, index) => ({
                      //     Sno: index + 1,
                      //     "Categoryname": t.categoryname,
                      //     "Subcategoryname": t.subcategoryname,
                      //     "Step": t.referencetodo.map((d) => d.label).join(','),
                      //     "Name": t.referencetodo.map((d) => d.name).join(','),
                      //   }))} fileName={fileName} />
                      // </>
                      <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                    )}
                    {isUserRoleCompare?.includes("printreferencelist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfreferencelist") && (
                      // <>
                      //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                      //     <FaFilePdf />
                      //     &ensp;Export to PDF&ensp;
                      //   </Button>
                      // </>
                      <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchOverallExcelDatas()
                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                    )}
                    {isUserRoleCompare?.includes("imagereferencelist") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                      <MenuItem value={documentsList?.length}>All</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                  Manage Columns
                </Button>
                &emsp;
                {isUserRoleCompare?.includes("bdreferencelist") && (
                  <Button variant="contained" color="error" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
                    Bulk Delete
                  </Button>)}
                <br />
                <br />
                {/* ****** Table start ****** */}
                <Box style={{ width: "100%", overflowY: "hidden" }}>
                  <StyledDataGrid rows={rowsWithCheckboxes} density="compact" columns={columnDataTable.filter((column) => columnVisibility[column.field])} autoHeight={true} hideFooter ref={gridRef} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
                {/* ****** Table End ****** */}
              </Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="customized table" id="jobopening" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Category Name</StyledTableCell>
                      <StyledTableCell>Sub Category Name</StyledTableCell>
                      <StyledTableCell>Step</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData?.length > 0 ? (
                      filteredData?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.serialNumber}</StyledTableCell>
                          <StyledTableCell>{row.categoryname}</StyledTableCell>
                          <StyledTableCell>{row.subcategoryname}</StyledTableCell>
                          <StyledTableCell>{row.referencetodo.map((d) => d.label).join(',')}</StyledTableCell>
                          <StyledTableCell>{row.referencetodo.map((d) => d.name).join(',')}</StyledTableCell>
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
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Reference Documents List Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
      {/* Delete modal */}
      <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button onClick={(e) => getviewCode()} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
      {/* view model */}
      <Dialog open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Reference Document List</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category Name</Typography>
                  <Typography>{singleDoc.categoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> SubCategory Name</Typography>
                  <Typography>{singleDoc.subcategoryname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Step</Typography>
                  <Typography>{singleDoc.referencetodo?.map((d) => d.label)?.join(',')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{singleDoc.referencetodo?.map((d) => d.name)?.join(',')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12} >
                <Typography variant="h6">Documents</Typography> <br />
                {singleDoc?.referencetodo?.map((d, index) => (
                  <Grid container key={index}>
                    {/* <Grid item md={12} sm={12} xs={12}>
                      <Typography dangerouslySetInnerHTML={{ __html: d.documentstext }}></Typography>
                    </Grid> */}
                    <Grid item md={6} sm={6} xs={12}>
                      {/* <Typography variant="h6">Uploaded Documents</Typography> <br /> */}
                      {d.document.map((file, fileIndex) => (
                        <Grid container key={fileIndex}>
                          <Grid item md={10} sm={10} xs={10}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                ))}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handlViewClose}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog >

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }} onClick={handleCloseerr}>
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
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
              fetchOverallExcelDatas()
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
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delVendorcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box >
  );
}
export default ListReferenceCategoryDoc;
