import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Button, List, ListItem, ListItemText, Popover, TextField, IconButton, Checkbox, } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../../components/Errorhandling";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SERVICE } from "../../../../services/Baseservice";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import StyledDataGrid from "../../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThreeDots } from "react-loader-spinner";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import ExportData from "../../../../components/ExportData";
import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";
import InfoPopup from "../../../../components/InfoPopup.js";
import {
  DeleteConfirmation,
} from "../../../../components/DeleteConfirmation.js";

function EnquiryPurposeUsersList() {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
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
    'Status', 'Percentage', 
    'Empcode','Company Name', 'User Name', 'Email', 
    'Branch', 'Unit', 'Team', 'Experience', 'Doj', 'Status' ];
  let exportRowValues = ['status','percentage',
    'empcode', 'companyname', 'username', 'email','branch','unit', 'team', 'experience','doj', 'enquirystatus'];

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
  const [employees, setEmployees] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Enquiry Purpose Users List.png");
        });
      });
    }
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const gridRef = useRef(null);

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
    actions: true,
    serialNumber: true,
    status: true,
    percentage: true,
    empcode: true,
    companyname: true,
    username: true,
    email: true,
    branch: true,
    unit: true,
    team: true,
    shift: true,
    experience: true,
    doj: true,
    checkbox: true,
    enquirystatus: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  let userid = deleteuser?._id;

  //get all employees list details
  const fetchEmployee = async () => {
    try {
      let res_employee = await axios.get(SERVICE.USERSENQUIERY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmployees(res_employee?.data?.users?.map((item)=>({
        ...item,
        percentage: item.percentage ? Math.round(item.percentage) + "%" : " ",
      })));
      setcheckemployeelist(true);
    } catch (err) { setcheckemployeelist(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const delAddemployee = async () => {
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Enquiry Purpose Users List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
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

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

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
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData?.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      minHeight: "40px",
      renderCell: (params) => (
        <Typography
          color={params.row.status == "incomplete" ? "error" : "green"}
          variant="contained"
          sx={{ padding: "5px" }}
        >
          {params.row.status}
        </Typography>
      ),
      hide: !columnVisibility.status,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 0,
      width: 120,
      minHeight: "40px",

      hide: !columnVisibility.percentage,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.username,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "doj",
      headerName: "Doj",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.doj,
    },
    {
      field: "enquirystatus",
      headerName: "Status",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.enquirystatus,
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
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("eenquirypurposeuserslist") && (
                    <a href={`/enquiryedit/${params.row.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        style={userStyle.actionbutton}
                      >
                        <EditIcon style={{ fontSize: "20px" }} />
                      </Button>
                    </a>
                  )}

                  {isUserRoleCompare?.includes("venquirypurposeuserslist") && (
                  <a href={`/enquiryview/${params.row.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>                    
                      <Button
                        size="small"
                        variant="outlined"
                        style={userStyle.actionbutton}
                      >
                        <VisibilityIcon style={{ fontSize: "20px" }} />
                      </Button>
                      </a>
                  )}
                  {isUserRoleCompare?.includes("ienquirypurposeuserslist") && (
                    <Link to="">
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          getinfoCode(params.row.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                      </Button>
                    </Link>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("venquirypurposeuserslist") && (
                  <Link
                    to={`/view/${params.row.id}`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      style={userStyle.actionbutton}
                    >
                      <VisibilityIcon style={{ fontSize: "20px" }} />
                    </Button>
                  </Link>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      percentage: item.percentage,
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      shift: item.shift,
      experience:
        (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 +
          new Date().getMonth() -
          new Date(item.doj).getMonth() -
          (new Date(item.doj).getDate() > 2 ||
            new Date(item.doj).getDate() !== 1
            ? 1
            : 0) ==
          -1
          ? 0
          : (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 +
          new Date().getMonth() -
          new Date(item.doj).getMonth() -
          (new Date(item.doj).getDate() > 2 ||
            new Date(item.doj).getDate() !== 1
            ? 1
            : 0),
      // doj: item.doj,
      doj: moment(item.doj).format("DD-MM-YYYY"),
      enquirystatus: item.enquirystatus,
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
      <Headtitle title={"ENQUIRY PURPOSE USERS LIST"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Enquiry Purpose Users Details
      </Typography>
      <br />
      {isUserRoleCompare?.includes("lenquirypurposeuserslist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Enquiry Purpose Users List
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            <Box>
              {checkemployeelist ? (
                <>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                      {isUserRoleCompare?.includes("excelenquirypurposeuserslist") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              fetchEmployee();
                              setFormat("xl");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileExcel />
                            &ensp;Export to Excel&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvenquirypurposeuserslist") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              fetchEmployee();
                              setFormat("csv");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileCsv />
                            &ensp;Export to CSV&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printenquirypurposeuserslist") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdfenquirypurposeuserslist") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true);
                              fetchEmployee();
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>

                      )}
                      {isUserRoleCompare?.includes("imageenquirypurposeuserslist") && (
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
                    </Grid>
                  </Grid>
                  <br />

                  <Grid style={userStyle.dataTablestyle}>
                    <Box>
                      <label htmlFor="pageSizeSelect">Show entries:</label>
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
                        {/* <MenuItem value={employees?.length}>All</MenuItem> */}
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
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
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
                  </Grid>
                  <br />
                  <Box
                    style={{
                      width: "100%",
                      overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                  >
                    <StyledDataGrid
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
                </>
              ) : (
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
              )}
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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={employees ?? []}
        filename={"Enquiry Purpose Users List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Enquiry Purpose Users List Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseDel}
        onConfirm={delAddemployee}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EnquiryPurposeUsersList;