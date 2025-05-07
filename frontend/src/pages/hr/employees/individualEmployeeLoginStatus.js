import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import PageHeading from "../../../components/PageHeading";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';

const IndividualEmployeeLoginStatus = () => {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    //   setSubmitLoader(false);
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
    "Employee Code",
    "Company Name",
    "Login Name",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Designation",
    "Department",
    "MacAddress",
    "LocalIP",
    "UserName",
    "SystemName",
    "Version",
    "Date",
    "Count",
    "Status",
  ];
  let exportRowValues = [
    "empcode",
    "companyname",
    "userloginname",
    "company",
    "branch",
    "unit",
    "team",
    "designation",
    "department",
    "macaddress",
    "localip",
    "username",
    "hostname",
    "version",
    "date",
    "count",
    "status",
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

  const { auth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState([]);
  const [loginStatusOverall, setLoginStatusOverall] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const [isBranch, setIsBranch] = useState(false);

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
      pagename: String("Individual Login Status"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "IndividualEmployeeLoginStatus.png");
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    if (selectedRows.includes(params.row.orginalid)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
    "& .custom-id-row": {
      backgroundColor: "#1976d22b !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": {
        backgroundColor: "#ff00004a !important",
      },
      "& .custom-in-row:hover": {
        backgroundColor: "#ffff0061 !important",
      },
      "& .custom-others-row:hover": {
        backgroundColor: "#0080005e !important",
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    username: true,
    empcode: true,
    companyname: true,
    userloginname: true,
    macaddress: true,
    localip: true,
    date: true,
    hostname: true,
    department: true,
    designation: true,
    status: true,
    count: true,
    actions: true,
    version: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // get all loginStatus
  const fetchBranch = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.post(SERVICE.INDIVIDUAL_USER_LOGIN_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        _id: isUserRoleAccess?._id,
      });

      const transformData = (data) => {
        const transformedArray = [];

        data?.forEach((item, ind) => {
          const getwithoutmacstatus = item.loginUserStatus.filter(
            (data, index) => {
              return data.macaddress != "none";
            }
          );
          if (
            item.loginUserStatus &&
            getwithoutmacstatus.length > 0 &&
            (item.employeecount !== "0" || item.wfhcount !== "0")
          ) {
            getwithoutmacstatus.forEach((status, index) => {
              const newItem = {
                _id: item?._id,
                branch: item.branch,
                companyname: item.companyname,
                empcode: item.empcode,
                designation: item.designation,
                company: item.company,
                username: item?.username,
                unit: item.unit,
                team: item.team,
                department: item.department,
                loginUserStatus: status,
                version: status.version,
                count: index + 1,
                date: item.createdAt
                  ? moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss a")
                  : "",
              };
              transformedArray.push(newItem);
            });
          }
        });

        return transformedArray;
      };

      const transformedData = transformData([res_branch?.data?.users]);
      setLoginStatus(
        transformedData?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
          empcode: item.empcode,
          companyname: item.companyname,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          userloginname: item?.username,
          designation: item.designation,
          department: item.department,
          macaddress: item?.loginUserStatus?.macaddress,
          localip: item?.loginUserStatus?.localip,
          username: item?.loginUserStatus?.username,
          hostname: item?.loginUserStatus?.hostname,
          version: item?.loginUserStatus?.version,
          count: item?.count,
          addressid: item?.loginUserStatus?._id,
          status: item?.username ? "Active" : "InActive",
          date: item?.loginUserStatus?.createdAt
            ? moment(item?.loginUserStatus?.createdAt).format(
              "DD-MM-YYYY hh:mm:ss a"
            )
            : "",
        }))
      );
      setLoginStatusOverall(
        transformedData?.map((item, index) => ({
          ...item,
          empcode: item.empcode,
          serialNumber: index + 1,
          id: item._id,
          companyname: item.companyname,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          userloginname: item?.username,
          designation: item.designation,
          department: item.department,
          macaddress: item?.loginUserStatus?.macaddress,
          localip: item?.loginUserStatus?.localip,
          username: item?.loginUserStatus?.username,
          hostname: item?.loginUserStatus?.hostname,
          version: item?.loginUserStatus?.version,
          count: item?.count,
          addressid: item?.loginUserStatus?._id,
          status: item?.username ? "Active" : "InActive",
          date: item?.loginUserStatus?.createdAt
            ? moment(item?.loginUserStatus?.createdAt).format(
              "DD-MM-YYYY hh:mm:ss a"
            )
            : "",
        }))
      );
      setIsBranch(true);
    } catch (err) {
      setIsBranch(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Excel
  const fileName = "IndividualEmployeeLoginStatus";

  useEffect(() => {
    fetchBranch();
  }, []);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "IndividualEmployeeLoginStatus",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(loginStatus);
  }, [loginStatus]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
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

  const indexOfLastItem = page * pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      pinned: "left",
      flex: 0,
      width: 160,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      pinned: "left",
      flex: 0,
      width: 180,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "userloginname",
      headerName: "Login Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.userloginname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 130,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "macaddress",
      headerName: "Mac Address",
      flex: 0,
      width: 200,
      hide: !columnVisibility.macaddress,
      headerClassName: "bold-header",
    },
    {
      field: "localip",
      headerName: "Local Ip",
      flex: 0,
      width: 200,
      hide: !columnVisibility.localip,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "UserName",
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "hostname",
      headerName: "SystemName",
      flex: 0,
      width: 200,
      hide: !columnVisibility.hostname,
      headerClassName: "bold-header",
    },
    {
      field: "version",
      headerName: "Version",
      flex: 0,
      width: 200,
      hide: !columnVisibility.version,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "count",
      headerName: "Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.count,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
        return (
          <Grid>
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                borderRadius: "4px",
                boxShadow: "none",
                fontWeight: "500",
                display: "flex",
                color: "white",
                backgroundColor:
                  params.data.status === "Active" ? "green" : "red",
                "&:hover": {
                  backgroundColor:
                    params.data.status === "Active" ? "green" : "red",
                },
              }}
            >
              {params.data.status}
            </Button>
          </Grid>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: index + 1,
      orginalid: item.id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      userloginname: item.userloginname,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      username: item.username,
      designation: item.designation,
      department: item.department,
      macaddress: item.macaddress,
      localip: item.localip,
      hostname: item.hostname,
      version: item.version,
      status: item?.status,
      count: item.count,
      addressid: item.addressid,
      date: item.date,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.orginalid),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
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
              // secondary={column.headerName }
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
    <>
      <Headtitle title={"INDIVIDUAL LOGIN STATUS"} />
      <PageHeading
        title="Individual Employee Login Status"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Status Details"
        subsubpagename="Individual Login Status"
      />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lindividualloginstatus") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Individual Login Status List{" "}
              </Typography>
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
                    <MenuItem value={loginStatus?.length}>All</MenuItem>
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
                    "excelindividualloginstatus"
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
                  {isUserRoleCompare?.includes("csvindividualloginstatus") && (
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
                    "printindividualloginstatus"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("pdfindividualloginstatus") && (
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
                    "imageindividualloginstatus"
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
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={loginStatus}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={loginStatusOverall}
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
            {!isBranch ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
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
                  itemsList={loginStatusOverall}
                />
              </>
            )}
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
      <br />

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            {isLoading ? (
              <>
                <Backdrop
                  sx={{
                    color: "blue",
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                  }}
                  open={isLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <Grid>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    style={{
                      padding: "7px 13px",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={() => {
                      handleCloseerrpop();
                    }}
                  >
                    ok
                  </Button>
                </Grid>
              </>
            )}
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
              Cancel
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
        itemsTwo={loginStatusOverall ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </>
  );
};

export default IndividualEmployeeLoginStatus;
