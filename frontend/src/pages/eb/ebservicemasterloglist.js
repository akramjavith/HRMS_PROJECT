import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,FormControl,
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
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function Ebservicemasterloglist() {
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
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area","ServiceNumber",
    "StartDate","EndDate","Created By", "Created At"
  ];
  let exportRowValues = [
   "company",
    "branch",
    "unit",
    "floor",
    "area",
    "servicenumber",
    "startdate", "enddate","changedusername",
    "date",
  ];

  const [designationlogs, setDesignationlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewData, setIsViewData] = useState({});

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

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
      pagename: String("Designation Log"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const [designationlogCheck, setDesignationlogcheck] = useState(false);

  const gridRef = useRef(null);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "DesignationLogList.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    servicenumber: true,
    startdate: true,
    company: true,enddate:true,changedusername:true,
    date: true,actions:true
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [designationlogsArray, setDesignationlogsArray] = useState([]);

  const rowDataArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogsArray(res?.data?.sebservicemaster?.servicelog);
      setDesignationlogcheck(true);
    } catch (err) {
      setDesignationlogcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    rowDataArray();
  }, [isFilterOpen]);

  const rowData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.EBSERVICEMASTER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDesignationlogs(res?.data?.sebservicemaster?.servicelog);
      setDesignationlogcheck(true);
    } catch (err) {
      setDesignationlogcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    rowData();
  }, []);
  const logid = useParams().id;

  // Excel
  const fileName = "EB Service Master Log";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EB Service Master Log",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      startdate: item.startdate ? moment(item.startdate).format(
        "DD/MM/YYYY") : "",
      enddate: item.enddate ? moment(item.enddate).format(
        "DD/MM/YYYY") : "",
      servicedate: item.servicedate ? moment(item.servicedate).format(
        "DD/MM/YYYY"
      ) : "",
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(designationlogs);
  }, [designationlogs]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "floor",
      flex: 0,
      width: 150,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 150,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "servicenumber",
      headerName: "Service Number",
      flex: 0,
      width: 150,
      hide: !columnVisibility.servicenumber,
      headerClassName: "bold-header",
    },
    {
      field: "startdate",
      headerName: "StartDate",
      flex: 0,
      width: 150,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },
    {
      field: "enddate",
      headerName: "EndDate",
      flex: 0,
      width: 150,
      hide: !columnVisibility.enddate,
      headerClassName: "bold-header",
    },
    {
      field: "changedusername",
      headerName: "Created By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.changedusername,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Created At",
      flex: 0,
      width: 150,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
            <Button
              onClick={() => {
                setIsViewData({...params.data});
                handleClickOpenview();
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
        </Grid>
      ),
    },
  ];

  function isValidDateFormat(dateString) {
    // Regular expression to match the format YYYY-MM-DD
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    return dateFormatRegex.test(dateString);
  }

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
      company: item?.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      servicenumber: item.servicenumber,
      startdate: item.startdate,
      enddate: item.enddate,
      changedusername: item.changedusername,
      date: item.date
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  // // Function to filter columns based on search query
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"EB SERVICE MASTER LOG"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="EB Service Master Log List"
        modulename="EB"
        submodulename="EB Service Master"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Table Start ****** */}
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item md={8} xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  EB Service Master Log List
                </Typography>
              </Grid>
              <Grid item md={3} xs={3}></Grid>
              <Grid item md={1} xs={1}>
                <Link to={"/eb/ebservicemaster"}>
                  <Button variant="contained" sx={buttonStyles.btncancel}>
                    Back
                  </Button>
                </Link>
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
                    <MenuItem value={designationlogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelebservicemaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          rowDataArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvebservicemaster") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          rowDataArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printebservicemaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfebservicemaster") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          rowDataArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageebservicemaster") && (
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
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={designationlogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={designationlogs}
                />
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
            &ensp;
            <br />
            <br />
            {!designationlogCheck ? (
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
              <>
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
                  itemsList={designationlogs}
                />
              </>
            )}
          </Box>
        </>
      
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
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "95px" }}
        >
        <Box sx={{ overflow: "auto", padding: "20px 50px" }}>
            <>
            <Typography sx={userStyle.HeaderText}>
                {" "}
                View EB Services Master Log
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Company</Typography>
                    <Typography>{isViewData.company}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Branch</Typography>
                    <Typography>{isViewData.branch}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">unit</Typography>
                    <Typography>{isViewData.unit}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Floor</Typography>
                    <Typography>{isViewData.floor}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Area</Typography>
                    <Typography>{isViewData.area + ","}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Service Number</Typography>
                    <Typography>{isViewData.servicenumber}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor Name</Typography>
                    <Typography>{isViewData.vendor}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Name</Typography>
                    <Typography>{isViewData.name}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Region</Typography>
                    <Typography>{isViewData.region}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Circle</Typography>
                    <Typography>{isViewData.circle}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Eb Service Purpose</Typography>
                    <Typography>
                    {isViewData.ebservicepurposes}
                    </Typography>
                </FormControl>
                </Grid>
                {isViewData.ebservicepurposes === "Rental" && (
                <>
                    <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                        <Typography variant="h6">TENENT Name</Typography>
                        <Typography>{isViewData.tenentname}</Typography>
                    </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                        <Typography variant="h6">Rental Address</Typography>
                        <Typography>
                        {isViewData.rentaladdress}
                        </Typography>
                    </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                        <Typography variant="h6">Rental Contact</Typography>
                        <Typography>
                        {isViewData.rentalcontact}
                        </Typography>
                    </FormControl>
                    </Grid>
                </>
                )}

                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Nick Name</Typography>
                    <Typography>{isViewData.nickname}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Service Date</Typography>
                    <Typography>
                    {isViewData.servicedate}
                    </Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Start Date</Typography>
                    <Typography>
                    {isViewData.startdate}
                    </Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">End Date</Typography>
                    <Typography>
                    {isViewData.enddate}
                    </Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Distribution</Typography>
                    <Typography>{isViewData.distribution}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Number</Typography>
                    <Typography>{isViewData.number}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Address</Typography>
                    <Typography>{isViewData.address}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Meter Number</Typography>
                    <Typography>{isViewData.meternumber}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Section ID</Typography>
                    <Typography>{isViewData.sectionid}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Section Name</Typography>
                    <Typography>{isViewData.sectionname}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Opening Reading KWH</Typography>
                    <Typography>{isViewData.openkwh}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">KVAH</Typography>
                    <Typography>{isViewData.kvah}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Contracted Load</Typography>
                    <Typography>{isViewData.contractedload}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Phase</Typography>
                    <Typography>{isViewData.phase}</Typography>
                </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Select CT/Non-CT Type</Typography>
                    <Typography>{isViewData.selectCTtypes}</Typography>
                </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Solar RTS</Typography>
                    <Typography>{isViewData.solars}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Welding</Typography>
                    <Typography>{isViewData.weldings}</Typography>
                </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Tariff</Typography>
                    <Typography>{isViewData.tariff}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Service Category</Typography>
                    <Typography>{isViewData.servicecategory}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">SD Available(Rs)</Typography>
                    <Typography>{isViewData.sdavailable}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">SD Refund(Rs)</Typography>
                    <Typography>{isViewData.sdrefund}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">MCD Available(Rs)</Typography>
                    <Typography>{isViewData.mcdavailable}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">MCD Refund(Rs)</Typography>
                    <Typography>{isViewData.mcdrefund}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Power Factor</Typography>
                    <Typography>{isViewData.powerfactor}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Billing Cycle</Typography>
                    <Typography>{isViewData.billingcycles}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Status</Typography>
                    <Typography>{isViewData.status}</Typography>
                </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Meter Type</Typography>
                    <Typography>{isViewData.metertype}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Bill Month</Typography>
                    <Typography>
                    {isViewData.billmonth === "Choose Month"
                        ? ""
                        : isViewData.billmonth}
                    </Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Allowed Unit/Day</Typography>
                    <Typography>{isViewData.allowedunit}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Allowed Unit/Month</Typography>
                    <Typography>
                    {isViewData.allowedunitmonth}
                    </Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">(Kw)in Rs</Typography>
                    <Typography>{isViewData.kwrs}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Renewal Penalty</Typography>
                    <Typography>{isViewData.renewalpenalty}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Tax</Typography>
                    <Typography>{isViewData.tax}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Max Demand </Typography>
                    <Typography>{isViewData.maxdem}</Typography>
                </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography variant="h6">Power Factor Penality</Typography>
                    {/* <Typography>{isViewData.powerfactorpenality === "Choose Power Factor" ? "" : powerfactorpenalityEdit}</Typography> */}
                    <Typography>
                    {isViewData.powerfactorpenality ===
                        "Choose Power Factor"
                        ? ""
                        : isViewData.powerfactorpenality}
                    </Typography>
                </FormControl>
                </Grid>
            </Grid>
            <br /> 
            <Grid container spacing={2}>
                <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseview}
                >
                {" "}
                Back{" "}
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
        itemsTwo={designationlogs ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Ebservicemasterloglist;
