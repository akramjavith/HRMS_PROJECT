import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
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
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../components/TableStyle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function ActionEmployeeAssignInterviewer() {
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
        rowDataTable.map((t, index) => ({
          serialNumber: index + 1,

          "From Company": t.fromcompany,
          "From Branch": t.frombranch,
          "From Unit": t.fromunit,
          "From Team": t.fromteam,
          Type: t.type,
          Designation: t?.designation,
          Round: t?.round,

          "To Company": t.tocompany,
          "To Branch": t.tobranch,
          "To Unit": t.tounit,
          "To Team": t.toteam,
          employee: t.employee,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        powerstationArray.map((t, index) => ({
          serialNumber: index + 1,

          "From Company": t.fromcompany
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Branch": t.frombranch
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Unit": t.fromunit
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          "From Team": t.fromteam
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
          Type: t.type,
          Designation: t?.designation,
          Round: t?.round?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

          "To Company": t.tocompany,
          "To Branch": t.tobranch,
          "To Unit": t.tounit,
          "To Team": t.toteam,
          employee: t?.employee
            ?.map((ts, i) => `${i + 1 + ". "}` + ts)
            .toString(),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "From Company ", field: "fromcompany" },
    { title: "From Branch ", field: "frombranch" },
    { title: "From Unit ", field: "fromunit" },
    { title: "From Team ", field: "fromteam" },
    { title: "Type ", field: "type" },
    { title: "Designation ", field: "designation" },
    { title: "Round ", field: "round" },

    { title: "To Company ", field: "tocompany" },
    { title: "To Branch ", field: "tobranch" },
    { title: "To Unit ", field: "tounit" },
    { title: "To Team ", field: "toteam" },

    { title: "Employee Name ", field: "employee" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((t, index) => ({
            serialNumber: index + 1,

            fromcompany: t.fromcompany,
            frombranch: t.frombranch,
            fromunit: t.fromunit,
            fromteam: t.fromteam,
            type: t.type,
            designation: t?.designation,
            round: t?.round,

            tocompany: t.tocompany,
            tobranch: t.tobranch,
            tounit: t.tounit,
            toteam: t.toteam,
            employee: t.employee,
          }))
        : powerstationArray?.map((t, index) => ({
            serialNumber: index + 1,

            fromcompany: t.fromcompany
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            frombranch: t.frombranch
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            fromunit: t.fromunit
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            fromteam: t.fromteam
              ?.map((t, i) => `${i + 1 + ". "}` + t)
              .toString(),
            type: t.type,
            designation: t?.designation,
            round: t?.round?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

            tocompany: t.tocompany,
            tobranch: t.tobranch,
            tounit: t.tounit,
            toteam: t.toteam,
            employee: t?.employee
              ?.map((ts, i) => `${i + 1 + ". "}` + ts)
              .toString(),
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Former Employee Assign Interviewer.pdf");
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [assignInterviewerEdit, setAssignInterviewerEdit] = useState({
    tocompany: "Please Select Compay",
    tobranch: "Please Select Branch",
    tounit: "Please Select Unit",
    type: "Please Select Type",
    toteam: "Please Select Team",
    employee: "",
  });

  const [powerstationArray, setPowerstationArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    fromcompany: true,
    frombranch: true,
    fromunit: true,
    fromteam: true,
    tocompany: true,
    tobranch: true,
    tounit: true,
    toteam: true,
    employee: true,
    type: true,
    designation: true,
    round: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  //useEffect

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setStatusCheck(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNINTERVIEWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignInterviewerEdit(res?.data?.sassigninterviewer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // updateby edit page...
  let updateby = assignInterviewerEdit?.updatedby;

  let addedby = assignInterviewerEdit?.addedby;

  const [formerUsers, setFormerUsers] = useState([]);

  // get all data.
  const fetchPowerstationAll = async () => {
    setStatusCheck(true);
    try {
      const [res_status, response] = await Promise.all([
        axios.post(
          SERVICE.ASSIGNINTERVIEWERS,
          {
            assignbranch: accessbranch,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
        axios.get(SERVICE.FORMERUSERS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      let formerUserArray = response?.data?.formerusers?.map(
        (data) => data?.companyname
      );

      setFormerUsers(formerUserArray);

      let filteredData = res_status?.data?.assigninterview
        ?.filter((item) =>
          item?.employee?.some((name) => formerUserArray.includes(name))
        )
        ?.map((item) => ({
          ...item,
          employee: item?.employee?.filter((name) =>
            formerUserArray.includes(name)
          ),
        }));

      setPowerstationArray(filteredData);
      setStatusCheck(false);
    } catch (err) {
      setStatusCheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Former Employee Assign Interviewer.png");
        });
      });
    }
  };

  // Excel
  const fileName = "Former Employee Assign Interviewer";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Former Employee Assign Interviewer",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = powerstationArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
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
      width: 75,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "fromcompany",
      headerName: "From Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fromcompany,
      headerClassName: "bold-header",
    },
    {
      field: "frombranch",
      headerName: "From Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.frombranch,
      headerClassName: "bold-header",
    },
    {
      field: "fromunit",
      headerName: "From Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromunit,
      headerClassName: "bold-header",
    },
    {
      field: "fromteam",
      headerName: "From Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.fromteam,
      headerClassName: "bold-header",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 120,
      hide: !columnVisibility.type,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 120,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "round",
      headerName: "Round",
      flex: 0,
      width: 150,
      hide: !columnVisibility.round,
      headerClassName: "bold-header",
    },

    {
      field: "tocompany",
      headerName: "To Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.tocompany,
      headerClassName: "bold-header",
    },
    {
      field: "tobranch",
      headerName: "To Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tobranch,
      headerClassName: "bold-header",
    },
    {
      field: "tounit",
      headerName: "To Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.tounit,
      headerClassName: "bold-header",
    },
    {
      field: "toteam",
      headerName: "To Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.toteam,
      headerClassName: "bold-header",
    },

    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
      headerClassName: "bold-header",
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
          {isUserRoleCompare?.includes("vassigninterviewer") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassigninterviewer") && (
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
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fromcompany: item.fromcompany.join(","),
      frombranch: item.frombranch.join(","),
      fromunit: item.fromunit.join(","),
      fromteam: item.fromteam.join(","),
      tocompany: item.tocompany,
      tobranch: item.tobranch,
      tounit: item.tounit,
      toteam: item.toteam,
      type: item.type,
      designation: item?.designation,
      round: item?.round.join(","),
      employee: item.employee?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
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
  // Function to filter columns based on search query
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  useEffect(() => {
    fetchPowerstationAll();
  }, []);

  useEffect(() => {
    addSerialNumber();
  }, [powerstationArray]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  return (
    <Box>
      {/* <Headtitle title={"Assign Interviewer"} /> */}

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassigninterviewer") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Former Employee Assign Interviewer
              </Typography>
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
                    {/* <MenuItem value={powerstationArray?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("csvassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("printassigninterviewer") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassigninterviewer") && (
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
                  {isUserRoleCompare?.includes("imageassigninterviewer") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            <br />
            <br />
            {statusCheck ? (
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
              <Box style={{ width: "100%", overflowY: "hidden" }}>
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
            )}
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                {filteredDatas?.length} entries
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
        </>
      )}
      {/* ****** Table End ****** */}
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
              // fetchProductionClientRateArray();
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClickOpenerr}
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>

              <TableCell>From Company</TableCell>
              <TableCell>From Branch</TableCell>
              <TableCell>From Unit</TableCell>
              <TableCell>From Team</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Round</TableCell>

              <TableCell>To Company</TableCell>
              <TableCell>To Branch</TableCell>
              <TableCell>To Unit</TableCell>
              <TableCell>To Team</TableCell>

              <TableCell>Employee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{row.fromcompany}</TableCell>
                    <TableCell>{row.frombranch}</TableCell>
                    <TableCell>{row.fromunit}</TableCell>
                    <TableCell>{row.fromteam}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row?.designation}</TableCell>
                    <TableCell>{row?.round}</TableCell>

                    <TableCell>{row.tocompany}</TableCell>
                    <TableCell>{row.tobranch}</TableCell>
                    <TableCell>{row.tounit}</TableCell>
                    <TableCell>{row.toteam}</TableCell>

                    <TableCell>{row.employee}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "30px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Former Employee Assign Interviewer
            </Typography>
            <br />
            <br />
            <Typography sx={userStyle.HeaderText}>
              {" "}
              From Assign Interviewer
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Company</Typography>
                  <Typography>
                    {assignInterviewerEdit.fromcompany
                      ? assignInterviewerEdit.fromcompany.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Branch</Typography>
                  <Typography>
                    {assignInterviewerEdit.frombranch
                      ? assignInterviewerEdit.frombranch.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Unit</Typography>
                  <Typography>
                    {assignInterviewerEdit.fromunit
                      ? assignInterviewerEdit.fromunit.join(",")
                      : ""}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{assignInterviewerEdit.type}</Typography>
                </FormControl>
              </Grid>
              {assignInterviewerEdit?.type === "Interviewer" ? (
                <>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Designation</Typography>
                      <Typography>
                        {assignInterviewerEdit.designation}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Round</Typography>

                      <Typography>
                        {assignInterviewerEdit?.round
                          ? assignInterviewerEdit?.round?.join(",")
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">From Team</Typography>
                    <Typography>
                      {assignInterviewerEdit.fromteam
                        ? assignInterviewerEdit.fromteam.join(",")
                        : ""}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <br /> <br />
            <Typography sx={userStyle.HeaderText}>
              {" "}
              To Assign Interviewer
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Company</Typography>
                  <Typography>{assignInterviewerEdit.tocompany}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Branch</Typography>
                  <Typography>{assignInterviewerEdit.tobranch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Unit</Typography>
                  <Typography>{assignInterviewerEdit.tounit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Team</Typography>
                  <Typography>{assignInterviewerEdit.toteam}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee</Typography>
                  <Typography>
                    {/* {assignInterviewerEdit.employee.toString()} */}
                    {Array.isArray(assignInterviewerEdit?.employee)
                      ? assignInterviewerEdit.employee
                          .filter((name) => formerUsers.includes(name))
                          .join(",")
                      : ""}
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

      {/* this is info view details */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        <Box sx={{ padding: "30px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Assign Interviewer Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={4}>
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
    </Box>
  );
}
export default ActionEmployeeAssignInterviewer;
