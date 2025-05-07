
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
import { BASE_URL } from "../../services/Authservice";
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
import { MultiSelect } from "react-multi-select-component";
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
import AlertDialog from "../../components/Alert";
import PageHeading from "../../components/PageHeading";
import MessageAlert from "../../components/MessageAlert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js"

import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

function ListReferenceCategoryDoc() {
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState([]);
  const [valueCategory, setValueCategory] = useState([]);
  const [selectedSubCategoryOptions, setSelectedSubCategoryOptions] = useState([]);
  const [valueSubCategory, setValueSubCategory] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  let exportColumnNames = ['Category', 'Subcategory', 'Step ', 'Name '];
  let exportRowValues = ['categoryname', 'subcategoryname', 'steplist', 'namelist'];
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const gridRef = useRef(null);
  const [documentsList, setDocumentsList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const [singleDoc, setSingleDoc] = useState({});
  const { auth } = useContext(AuthContext);
  //Datatable
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  //useEffect
  useEffect(() => {
    // fetchAllApproveds();
    // getexcelDatas();
  }, []);

  useEffect(() => {
    addSerialNumber(documentsList);
  }, [documentsList]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);



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




  const fetchCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.REFCATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions([...response?.data?.doccategory?.map((t) => ({ ...t, label: t.categoryname, value: t.categoryname }))]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  useEffect(() => { fetchCategory(); }, [])




  const fetchSubCategory = async (e) => {
    setPageName(!pageName)
    try {
      const categoryNames = e?.length > 0 ? e?.map(data => data?.value) : [];
      let response = await axios.post(`${SERVICE.GET_SUBCAT_MULTI_LIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: categoryNames,
      });
      let subcatOpt = response?.data?.subcat
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      let addedAllTeam = [{ label: "ALL", value: "ALL" }, ...subcatOpt];
      setSubCategoryOptions(addedAllTeam);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };





  //Category Changes
  const handleCategoryChange = (options) => {
    setValueCategory(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCategoryOptions(options);
    fetchSubCategory(options);
    setSelectedSubCategoryOptions([]);
    setValueSubCategory([])
  };

  const customValueRendererCategory = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Category";
  };



  //SubCategory Changes
  const handleSubCategoryChange = (options) => {
    let newSelectedOptions;
    const isAllSelected = options.some((option) => option.value === "ALL");
    if (isAllSelected) {
      newSelectedOptions = [{ label: "ALL", value: "ALL" }];
    } else {
      newSelectedOptions = options.filter((option) => option.value !== "ALL");
    }
    setValueSubCategory(newSelectedOptions.map((option) => option.value));
    setSelectedSubCategoryOptions(newSelectedOptions);
  };

  const customValueRendererSubCategory = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select SubCategory";
  };


  //HandleSubmit CHECK
  const handleSubmit = () => {
    if (valueCategory?.length < 1 && valueSubCategory?.length < 1) {
      setPopupContentMalert('Please Select Atleast AnyOne');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery("")
      fetchAllApproveds();
    }
  }


  const handleClear = () => {
    setValueCategory([]);
    setSubCategoryOptions([]);
    setValueSubCategory([]);
    setDocumentsList([])
    setSelectedCategoryOptions([]);
    setSelectedSubCategoryOptions([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
    setFilteredChanges(null);
  }




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

      const viewFiles = ansDocuments?.length > 0 ? ansDocuments?.map(Data => {
        renderFilePreviewExcelPdfs(Data?.document[0])
      }) : ""
    }

  };

  const renderFilePreview = async (file) => {
    const { path } = file;
    if (path) {
      const url = `${BASE_URL}/${path}`; // Construct the URL based on your server setup
      window.open(url, "_blank");
    } else {
      const pdfBlobUrl = URL.createObjectURL(file);
      window.open(pdfBlobUrl, "_blank");
    }

  };
  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Reference Document List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    setPageName(!pageName)
    setLoading(false)
    try {
      let res_queue = await axios.post(SERVICE.ALL_REFDOCUMENT_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: valueCategory,
        subcategory: valueSubCategory,
      });

      const answer = res_queue?.data.document?.length > 0 ? res_queue?.data?.document?.map((item, index) => {

        let steparray = item?.referencetodo?.map(d => d.label);
        let namearray = item?.referencetodo?.map(d => d.name);
        return {
          ...item,
          id: item?._id,
          serialNumber: index + 1,
          steplist: steparray?.join(",")?.toString(),
          namelist: namearray?.join(",")?.toString(),
        }
      }) : [];
      setDocumentsList(answer);
      setLoading(true);
    } catch (err) { setLoading(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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


  // Excel
  const fileName = "Reference Document List";

  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setViewInfo(res?.data?.sdocument);

      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const getDeleteCOde = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setViewInfo(res?.data?.sdocument);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const getViewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.REFDOCUMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.sdocument);
      setViewInfo(res?.data?.sdocument);
      handleViewOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(`${SERVICE.REFDOCUMENT_SINGLE}/${singleDoc._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseDelete();
      // await fetchAllApproveds();
      // setShowAlert(
      //   <>
      //     <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
      //     <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
      //   </>
      // );
      // handleClickOpenerr();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
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
      setIsHandleChange(false)
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchAllApproveds();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ReferenceDocumentList",
    pageStyle: "print",
  });


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
      headerName: "Category",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
      pinned: "left",
      // lockPinned: true,
    },
    {
      field: "subcategoryname",
      headerName: " SubCategory",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.subcategoryname,
      pinned: "left",
      // lockPinned: true,
    },
    {
      field: "steplist",
      headerName: "Step",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.steplist,
    },
    {
      field: "namelist",
      headerName: "Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.namelist,
    },
    {
      field: "referencetodo",
      headerName: "Documents",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.referencetodo,
      pinned: "left",
      // lockPinned: true,
      cellRenderer: (params) => (
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
                getDownloadFile(params.data.referencetodo);
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
      cellRenderer: (params) => (

        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ereferencelist") && (
            <Link to={`/editrefcategoryref/edit/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dreferencelist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getDeleteCOde(params.data.id);

              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vreferencelist") && (
            <Button
              sx={buttonStyles.buttonview}
              onClick={(e) => {
                getViewCode(params.data.id);

              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferencelist") && (
            <Button
              sx={buttonStyles.buttoninfo}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      categoryname: item.categoryname,
      subcategoryname: item.subcategoryname,
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
      pagename: String("Refernce/Reference List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }
  return (
    <Box>
      {/* <Headtitle title={"REFERENCE DOCUMENTS LIST"} /> */}
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Reference Documents List</Typography> */}
      <PageHeading
        title="All Reference Documents List"
        modulename="References"
        submodulename="Reference List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lreferencelist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>Reference Documents List</Typography>
            </Grid>

            <Grid container spacing={2} >
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <MultiSelect size="small"
                    options={categoryOptions}
                    value={selectedCategoryOptions}
                    onChange={handleCategoryChange}
                    valueRenderer={customValueRendererCategory}
                    labelledBy="Please Select Category"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <MultiSelect size="small"
                    options={subCategoryOptions}
                    value={selectedSubCategoryOptions}
                    onChange={handleSubCategoryChange}
                    valueRenderer={customValueRendererSubCategory}
                    labelledBy="Please Select SubCategory"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>

                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <Button variant="contained"
                    onClick={() => {
                      handleSubmit();

                    }}
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleClear();
                    }}

                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>

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
                {isUserRoleCompare?.includes("excelreferencelist") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvreferencelist") && (
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
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

                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
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
            {/* ****** Table Grid Container ****** */}

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
              <Button variant="contained" color="error" sx={{ ...buttonStyles.buttonbulkdelete, textTransform: "capitalize" }} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>)}
            <br />
            <br />
            {!loading ? (
              <Box sx={userStyle.container}>
                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </Box>
            ) : (
              <>
                {/* ****** Table start ****** */}
                <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                  {/* <StyledDataGrid rows={rowsWithCheckboxes} density="compact" columns={columnDataTable.filter((column) => columnVisibility[column.field])} autoHeight={true} hideFooter ref={gridRef} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} getRowClassName={getRowClassName} disableRowSelectionOnClick /> */}
                </Box>
              </>
            )
            }
            {/* ****** Table End ****** */}
          </Box>
          <TableContainer component={Paper} sx={userStyle.printcls}>
            <Table aria-label="customized table" id="jobopening" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <StyledTableRow>
                  <StyledTableCell>SNo</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Sub Category</StyledTableCell>
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
                      <StyledTableCell>{row.steplist}</StyledTableCell>
                      <StyledTableCell>{row.namelist}</StyledTableCell>
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



      <br />
      <br />
      {/* view model */}
      <Dialog open={openView} onClose={handlViewClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: "40px" }}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Reference Document List</Typography>
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
                    {d?.document?.length > 0 ?
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
                      </Grid> :
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography dangerouslySetInnerHTML={{ __html: d.documentstext }}></Typography>
                      </Grid>}
                  </Grid>

                ))}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handlViewClose}>
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
            <Button sx={buttonStyles.btncancel} variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }} onClick={handleCloseerr}>
              {" "}
              ok{" "}
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
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Reference Documents List Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={openDelete}
        onClose={handleCloseDelete}
        onConfirm={getviewCode}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delVendorcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}

    </Box >
  );
}
export default ListReferenceCategoryDoc;
