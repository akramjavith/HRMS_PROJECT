import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
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
  OutlinedInput,
  Popover,
  Select,
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
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";

import ExportData from "../../components/ExportData";

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
  },
}));
function NotPaidlist() {
  let exportColumnNames = [
    "Date",
    "Bill No",
    "Vendor Name",
    "Vendor Frequency",
    "Source",
    "Amount",
  ];
  let exportRowValues = [
    "date",
    "billno",
    "vendorname",
    "vendorfrequency",
    "source",
    "amount",
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

  //state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [loader, setLoader] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    billno: true,
    vendorname: true,
    vendorfrequency: true,
    date: true,
    source: true,
    amount: true,
    checkbox: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  useEffect(() => {
    fetchNotPaidList();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    addSerialNumber();
  }, [expenses]);

  const { isUserRoleCompare, isAssignBranch, pageName, setPageName } =
    useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const { auth } = useContext(AuthContext);

  const fetchNotPaidList = async () => {
    setPageName(!pageName);
    try {
      const [res, res1] = await Promise.all([
        axios.post(
          SERVICE.ALL_OTHERPAYMENTS,
          {
            assignbranch: accessbranch,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.post(
          SERVICE.EXPENSESALL,
          { assignbranch: accessbranch },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
      ]);

      let filteredotherpayments = res.data.otherpayments.filter((data) => {
        return data.paidstatus === "Not Paid";
      });

      let otherMappedData = filteredotherpayments.map((data) => ({
        _id: data._id,
        date: data.billdate,
        billno: data.billno,
        vendor: data.vendor,
        vendorfrequency: data.vendorfrequency,
        source: "Scheduled Payments",
        amount: data.dueamount,
      }));

      let filteredexpenses = res1.data.expenses.filter((data) => {
        return data.billstatus === "InComplete";
      });

      let expenseMappedData = filteredexpenses.map((data) => ({
        _id: data._id,
        date: data.duedate !== "" ? data.duedate : data.date,
        billno: data.referenceno,
        vendor: data.vendorname,
        vendorfrequency: data.vendorfrequency,
        source: "Expenses",
        amount: data.totalbillamount,
      }));

      let combinedArray = [...otherMappedData, ...expenseMappedData];
      setExpenses(combinedArray);
      setLoader(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const gridRef = useRef(null);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const handleViewOpen = () => {
    setViewpen(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleViewClose = () => {
    setViewpen(false);
  };

  const classes = useStyles();

  // bill edit
  const handleInputChangedocumentEdit = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...billdocs];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setBillDocs(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
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

  const handleInputChangedocumentRecEd = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...receiptDocs];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setReceiptDocs(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // FILEICONPREVIEW CREATE
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
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

  const [singlePay, setSinglePay] = useState({});
  const [billdocs, setBillDocs] = useState([]);
  const [receiptDocs, setReceiptDocs] = useState([]);
  const [viewOpen, setViewpen] = useState(false);

  const [projEdit, setProjedit] = useState({});

  const getviewCode = async (e, source) => {
    setPageName(!pageName);
    try {
      if (source === "Expenses") {
        let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setProjedit(res?.data?.sexpenses);
        handleClickOpenview();
      } else {
        let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setSinglePay(res?.data?.sotherpayment);
        setBillDocs(res?.data?.sotherpayment?.billsdocument);
        setReceiptDocs(res?.data?.sotherpayment?.receiptdocument);
        handleViewOpen();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Not Paid List.png");
        });
      });
    }
  };
  // Excel
  const fileName = "Not Paid List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Not Paid List",
    pageStyle: "print",
  });
  const addSerialNumber = () => {
    const itemsWithSerialNumber = expenses?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      date: moment(item.date).format("DD-MM-YYYY"),
      vendorname: item?.vendor,
    }));
    setItems(itemsWithSerialNumber);
  };
  //table sorting
  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
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
  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      date: item.date,
      billno: item.billno,
      vendorname: item.vendorname,
      vendorfrequency: item.vendorfrequency,
      source: item.source,
      amount: item.amount,
    };
  });
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold",
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
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "billno",
      headerName: "Bill No",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.billno,
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.vendorname,
    },
    {
      field: "vendorfrequency",
      headerName: "Vendor Frequency",
      flex: 0,
      width: 190,
      minHeight: "40px",
      hide: !columnVisibility.vendorfrequency,
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.source,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.amount,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              // handleClickOpenview();
              getviewCode(params.row.id, params.row.source);
            }}
          >
            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
        </Grid>
      ),
    },
  ];
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize) {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
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
  return (
    <Box>
      <Headtitle title={"NOT PAID LIST"} />
      <PageHeading
        title="Manage Not Paid List"
        modulename="Expenses"
        submodulename="Not Paid List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <br />

      <>
        {/* ****** Table Start ****** */}
        {isUserRoleCompare?.includes("lnotpaidlist") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    All Not Paid List
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid item xs={8}></Grid>
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
                      {/* <MenuItem value={expenses.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelnotpaidlist") && (
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
                    {isUserRoleCompare?.includes("csvnotpaidlist") && (
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
                    {isUserRoleCompare?.includes("printnotpaidlist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfnotpaidlist") && (
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
                    {isUserRoleCompare?.includes("imagenotpaidlist") && (
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
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() =>
                        setColumnVisibility(initialColumnVisibility)
                      }
                    >
                      Show All Columns
                    </Button>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleOpenManageColumns}
                    >
                      Manage Columns
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <br />
              {!loader ? (
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
                <Box
                  style={{
                    height: calculateDataGridHeight(),
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    ref={gridRef}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )} // Only render visible columns
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
              )}
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
      </>

      {/* view model paid Expense*/}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Expense Not Paid
            </Typography>
            <br /> <br />
            <Grid container spacing={4}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reference No</Typography>
                  <Typography>{projEdit.referenceno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{projEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{projEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{projEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor Name</Typography>
                  <Typography>{projEdit.vendorname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Purpose</Typography>
                  <Typography>{projEdit.purpose}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Category</Typography>
                  <Typography>{projEdit.expansecategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Sub Category</Typography>
                  <Typography>{projEdit.expansesubcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Sub Category</Typography>
                  <Typography>{projEdit.expansesubcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Total Bill Amount</Typography>
                  <Typography>{projEdit.totalbillamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Frequency</Typography>
                  <Typography>{projEdit.vendorfrequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(projEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Status</Typography>
                  <Typography>{projEdit.paidstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Mode</Typography>
                  <Typography>{projEdit.paidmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Amount</Typography>
                  <Typography>{projEdit.paidamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Balance Amount</Typography>
                  <Typography>{projEdit.balanceamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Total</Typography>
                  <Typography>{projEdit.expensetotal}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Bill Status</Typography>
                  <Typography>{projEdit.billstatus}</Typography>
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

      <Box>
        <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="lg">
          <DialogContent>
            <Box>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>
                    View Scheduled Payment Not Paid
                  </Typography>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.company}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.branchname}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Head Name</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.headname}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Purpose</Typography>
                    <OutlinedInput readOnly value={singlePay.purpose} />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Bill No</Typography>
                    <OutlinedInput readOnly value={singlePay.billno} />
                  </FormControl>
                </Grid>
                {/* next grdi */}
                <>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Vendor</Typography>
                      <OutlinedInput readOnly value={singlePay?.vendor} />
                    </FormControl>
                    &emsp;
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> GSTNO</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={singlePay.gstno}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Frequency</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={singlePay.vendorfrequency}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Bill Date</Typography>
                      <OutlinedInput
                        readOnly
                        value={moment(singlePay.billdate).format("DD-MM-YYYY")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Receipt Date</Typography>
                      <OutlinedInput
                        readOnly
                        value={moment(singlePay.receiptdate).format(
                          "DD-MM-YYYY"
                        )}
                      />
                    </FormControl>
                  </Grid>
                </>
                {/* next grdi */}
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Due Amount</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay.dueamount}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Account Holder Name</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay.accountholdername}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Bank Name</Typography>
                      <OutlinedInput readOnly value={singlePay.bankname} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> IFSC Code</Typography>
                      <OutlinedInput readOnly value={singlePay.ifsccode} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Paid Through</Typography>
                      <OutlinedInput value={singlePay?.paidthrough} readOnly />
                    </FormControl>
                    &emsp;
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Reference No</Typography>
                      <OutlinedInput readOnly value={singlePay.referenceno} />
                    </FormControl>
                  </Grid>
                </>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="h6">Attachments</Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <Typography variant="h6">Bill </Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadcreatefirst"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                    multiple
                    onChange={handleInputChangedocumentEdit}
                  />
                  <label htmlFor="file-inputuploadcreatefirst"></label>
                  <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                      {billdocs?.map((file, index) => (
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
                                    height="25"
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
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {file.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  marginTop: "16px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <Typography variant="h6">Receipt</Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputupload"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                    multiple
                    onChange={handleInputChangedocumentRecEd}
                  />
                  <label htmlFor="file-inputupload"></label>
                  <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                      {receiptDocs?.map((file, index) => (
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
                                    height="25"
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
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {file.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  marginTop: "16px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                  </Grid>
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
                    <Button variant="contained" onClick={handleViewClose}>
                      {" "}
                      Back
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"NotPaidList"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}
export default NotPaidlist;
