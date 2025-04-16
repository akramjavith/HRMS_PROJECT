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
  Checkbox,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Switch,
  Popover,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { repeatTypeOption } from "../../../components/Componentkeyword";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { colourStyles } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Selects from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../components/PageHeading";

function VisitorFollowupFilter() {
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
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          FollowUpDate: t.followupdate,
          "Visitor's ID": t.visitorid,
          "Visitor Name": t.visitorname,
          "Visitor Type": t.visitortype,
          "Visitor Mode": t.visitormode,
          "Visitor Purpose": t.visitorpurpose,
          "Visitor Contact No": t.visitorcontactnumber,
          "IN Time": t.intime,
          "OUT Time": t.outtime,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          FollowUpDate: t.followupdate,
          "Visitor's ID": t.visitorid,
          "Visitor Name": t.visitorname,
          "Visitor Type": t.visitortype,
          "Visitor Mode": t.visitormode,
          "Visitor Purpose": t.visitorpurpose,
          "Visitor Contact No": t.visitorcontactnumber,
          "IN Time": t.intime,
          "OUT Time": t.outtime,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "FollowUp Date", field: "followupdate" },
    { title: "Visitor's ID", field: "visitorid" },
    { title: "Visitor Name", field: "visitorname" },
    { title: "Visitor Type", field: "visitortype" },
    { title: "Visitor Mode", field: "visitormode" },
    { title: "Visitor Purpose", field: "visitorpurpose" },
    { title: "Visitor Contact No", field: "visitorcontactnumber" },
    { title: "IN Time", field: "intime" },
    { title: "OUT Time", field: "outtime" },
  ];
  //  pdf download functionality
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
        ? rowDataTable.map((t, index) => {
            return {
              serialNumber: index + 1,
              company: t.company,
              branch: t.branch,
              unit: t.unit,
              date: t.date,
              visitorid: t.visitorid,
              followupdate: t.followupdate,
              visitorname: t.visitorname,
              visitortype: t.visitortype,
              visitormode: t.visitormode,
              visitorpurpose: t.visitorpurpose,
              visitorcontactnumber: t.visitorcontactnumber,
              intime: t.intime,
              outtime: t.outtime,
            };
          })
        : items?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            unit: t.unit,
            date: t.date,
            visitorid: t.visitorid,
            visitorname: t.visitorname,
            visitortype: t.visitortype,
            visitormode: t.visitormode,
            followupdate: t.followupdate,
            visitorpurpose: t.visitorpurpose,
            visitorcontactnumber: t.visitorcontactnumber,
            intime: t.intime,
            outtime: t.outtime,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Visitors.pdf");
  };

  const [vendormaster, setVendormaster] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isUserRoleCompare, pageName, setPageName, isAssignBranch } =
    useContext(UserRoleAccessContext);
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const { auth } = useContext(AuthContext);
  const [vendorCheck, setVendorcheck] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [filterState, setFilterState] = useState({
    filterby: "Please Choose Filter",
  });

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    followupdate: true,
    serialNumber: true,
    visitorid: true,
    visitorname: true,
    visitortype: true,
    visitormode: true,
    visitorpurpose: true,
    visitorcontactnumber: true,
    intime: true,
    outtime: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  useEffect(() => {
    fetchVendor();
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
  }, [vendormaster]);
  const gridRef = useRef(null);
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      followupdate: item.followupdate,
      visitorid: item.visitorid,
      visitorname: item.visitorname,
      visitortype:
        item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
      visitormode:
        item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
      visitorpurpose:
        item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
      visitorcontactnumber: item.visitorcontactnumber,
      intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
      outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
    };
  });
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold",
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable?.length === 0) {
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
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredData?.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 80,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "followupdate",
      headerName: "Followup Date",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.followupdate,
      headerClassName: "bold-header",
    },
    {
      field: "visitorid",
      headerName: "Visitor ID",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.visitorid,
      headerClassName: "bold-header",
    },
    {
      field: "visitorname",
      headerName: "Visitor Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorname,
      headerClassName: "bold-header",
    },
    {
      field: "visitortype",
      headerName: "Visitor Type",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.visitortype,
      headerClassName: "bold-header",
    },
    {
      field: "visitormode",
      headerName: "Visitor Mode",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.visitormode,
      headerClassName: "bold-header",
    },
    {
      field: "visitorpurpose",
      headerName: "Visitor Purpose",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorpurpose,
      headerClassName: "bold-header",
    },
    {
      field: "visitorcontactnumber",
      headerName: "Visitor Contact Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorcontactnumber,
      headerClassName: "bold-header",
    },
    {
      field: "intime",
      headerName: "IN Time",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.intime,
      headerClassName: "bold-header",
    },
    {
      field: "outtime",
      headerName: "OUT Time",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.outtime,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 180,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vvisitorsdatewisefilter") && (
            <Link
              to={`/interactor/master/viewvisitors/${params.row.id}/followupfilter`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button variant="contained" sx={userStyle.buttonedit}>
                view
              </Button>
            </Link>
          )}
        </Grid>
      ),
    },
  ];

  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
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
        {" "}
        <CloseIcon />{" "}
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
              {" "}
              Show All{" "}
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
                  newColumnVisibility[column.field] = false;
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
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    checkbox: selectedRows.includes(row.id),
  }));
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  // Error Popup model
  const handleClickOpenerr = () => {
    setVendorcheck(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  //get all  vendordetails.
  const fetchVendor = async () => {
    setVendorcheck(true);
    setPageName(!pageName);
    try {
      let res_vendor = await axios.post(
        SERVICE.ALL_VISITORS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const filterfollowup = res_vendor?.data?.visitors.filter(
        (item) => item.followupaction === "Required"
      );
      setAllData(filterfollowup);
      setVendorcheck(false);
    } catch (err) {
      setVendorcheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const filterData = () => {
    setVendorcheck(true);
    if (filterState.filterby === "Please Choose Filter") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Filter"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const currentDate = new Date();
      let filtered = [];

      switch (filterState.filterby) {
        case "Today":
          filtered = allData.filter((item) => {
            const followupDate = new Date(item.followupdate);
            return (
              followupDate.getDate() === currentDate.getDate() &&
              followupDate.getMonth() === currentDate.getMonth() &&
              followupDate.getFullYear() === currentDate.getFullYear()
            );
          });
          break;
        case "Weekly":
          const currentWeekStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - currentDate.getDay()
          ); // Start of current week (Sunday)
          const currentWeekEnd = new Date(
            currentWeekStart.getFullYear(),
            currentWeekStart.getMonth(),
            currentWeekStart.getDate() + 6
          ); // End of current week (Saturday)

          filtered = allData.filter((item) => {
            const followupDate = new Date(item.followupdate);
            return (
              followupDate >= currentWeekStart && followupDate <= currentWeekEnd
            );
          });
          break;
        case "Monthly":
          const currentMonthStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ); // Start of current month
          const nextMonthStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          ); // Start of next month

          filtered = allData.filter((item) => {
            const followupDate = new Date(item.followupdate);
            return (
              followupDate >= currentMonthStart && followupDate < nextMonthStart
            );
          });
          break;
        case "Yearly":
          const currentYearStart = new Date(currentDate.getFullYear(), 0, 1); // Start of current year
          const nextYearStart = new Date(currentDate.getFullYear() + 1, 0, 1); // Start of next year

          filtered = allData.filter((item) => {
            const followupDate = new Date(item.followupdate);
            return (
              followupDate >= currentYearStart && followupDate < nextYearStart
            );
          });
          break;
        default:
          break;
      }

      setVendormaster(filtered);
      setVendorcheck(false);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Visitors.png");
        });
      });
    }
  };
  // Excel
  const fileName = "Visitors";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Visitors",
    pageStyle: "print",
  });
  const addSerialNumber = () => {
    const itemsWithSerialNumber = vendormaster?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      followupdate: moment(item.followupdate).format("DD-MM-YYYY"),
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
  return (
    <Box>
      <Headtitle title={"VISITORS FOLLOWUP FILTER"} />
      <PageHeading
        title="Visitors Followup Filter"
        modulename="Interactors"
        submodulename="Visitor"
        mainpagename="Visitors Followup Filter"
        subpagename=""
        subsubpagename=""
      />
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lvisitorsdatewisefilter") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Visitors List
                </Typography>
              </Grid>
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
                    <MenuItem value={vendormaster?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes(
                    "excelvisitorsdatewisefilter"
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
                  {isUserRoleCompare?.includes("csvvisitorsdatewisefilter") && (
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
                    "printvisitorsdatewisefilter"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvisitorsdatewisefilter") && (
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
                    "imagevisitorsdatewisefilter"
                  ) && (
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
                    onClick={handleShowAllColumns}
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
              <Grid item md={2.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={300}
                    options={repeatTypeOption}
                    styles={colourStyles}
                    placeholder="Repeat Type"
                    value={{
                      label: filterState.filterby,
                      value: filterState.filterby,
                    }}
                    onChange={(e) => {
                      setFilterState({ ...filterState, filterby: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              &ensp;
              <Grid item md={1} xs={12} sm={12}>
                <Button
                  variant="contained"
                  onClick={() => {
                    filterData();
                  }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
            <br />
            <br />
            {vendorCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              </>
            ) : (
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <StyledDataGrid
                  ref={gridRef}
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  autoHeight={true}
                  hideFooter
                  density="compact"
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                />
              </Box>
            )}
            <br />
            <>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
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
            </>
          </Box>
        </>
      )}
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          aria-label="customized table"
          sx={{ minWidth: 100 }}
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Followup Date</TableCell>
              <TableCell>Visitor's ID</TableCell>
              <TableCell>Visitor Name</TableCell>
              <TableCell>Visitor Type</TableCell>
              <TableCell>Visitor Mode</TableCell>
              <TableCell>Visitor Purpose</TableCell>
              <TableCell>Visitor Contact No.</TableCell>
              <TableCell>IN Time</TableCell>
              <TableCell>OUT Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.followupdate}</TableCell>
                  <TableCell>{row.visitorid}</TableCell>
                  <TableCell>{row.visitorname}</TableCell>
                  <TableCell>{row.visitortype}</TableCell>
                  <TableCell>{row.visitormode}</TableCell>
                  <TableCell>{row.visitorpurpose}</TableCell>
                  <TableCell>{row.visitorcontactnumber}</TableCell>
                  <TableCell>{row.intime}</TableCell>
                  <TableCell>{row.outtime}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {" "}
        {manageColumnsContent}{" "}
      </Popover>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
            >
              {" "}
              OK{" "}
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
            Export Filtered Data
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
    </Box>
  );
}
export default VisitorFollowupFilter;
