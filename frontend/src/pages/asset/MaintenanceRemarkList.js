import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton, Checkbox } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import "jspdf-autotable";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { AuthContext } from "../../context/Appcontext";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import StyledDataGrid from "../../components/TableStyle";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Link, useParams } from "react-router-dom";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { NotificationManager } from "react-notifications";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function MaintenanceRemarkList() {
  const [searchQuery, setSearchQuery] = useState("");
  const idr = useParams().id;
  const { auth } = useContext(AuthContext);

  const [selectedRows, setSelectedRows] = useState([]);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteRemarkdata, setDeleteRemarkdata] = useState();

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleClickOpenalert = () => {
    if (selectedRows.length == 0) {
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

  //image view model
  const [isimgview, setImgview] = useState(false);

  const handleImgcodeview = () => {
    setImgview(true);
  };
  const handlecloseImgcodeview = () => {
    setImgview(false);
  };

  const [isimgviewbill, setImgviewbill] = useState(false);

  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };

  // Error Popup model
  const [isDeleteUIdataopen, setIsDeleteUIdataopen] = useState(false);
  const handleClickOpenUIdataopen = () => {
    setIsDeleteUIdataopen(true);
  };
  const handleCloseUIdataopen = () => {
    setIsDeleteUIdataopen(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //get single row to delete....
  const delUItodoData = async (id) => {
    setDeleteRemarkdata(id);
    setSelectedRows([]);
    handleClickOpenUIdataopen();
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Maintenance_Remarklist.png");
        });
      });
    }
  };

  const [maintentance, setMaintentance] = useState([]);
  const [getimgcode, setGetImgcode] = useState([]);
  const [getimgbillcode, setGetImgbillcode] = useState([]);

  const getCode = async () => {
    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${idr}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMaintentance(res?.data?.smaintenance.remark);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getimgCode = async (value) => {
    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${idr}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setGetImgcode(value);
      handleImgcodeview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getimgbillCode = async (valueimg) => {
    try {
      let res = await axios.get(`${SERVICE.MAINTENTANCE_SINGLE}/${idr}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setGetImgbillcode(valueimg);
      handleImgcodeviewbill();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const deleteUItodorowData = async () => {
    try {
      let updateDevelop = maintentance.filter((item) => item._id !== deleteRemarkdata);

      await axios.put(`${SERVICE.MAINTENTANCE_SINGLE}/${idr}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        remark: [...updateDevelop],
      });

      // Update the state
      setMaintentance(updateDevelop);

      handleCloseUIdataopen();
      setSelectedRows([]);
      setPage(1);
      await fetchMaintentance();
      NotificationManager.success("Deleted Successfully 👍", "", 2000);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delProjectcheckbox = async () => {
    try {
      let updateDevelop = maintentance.filter((item) => !selectedRows.includes(item._id));
      await axios.put(`${SERVICE.MAINTENTANCE_SINGLE}/${idr}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        remark: [...updateDevelop],
      });

      await fetchMaintentance();
      // Update the state
      setMaintentance(updateDevelop);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully 👍"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    getCode();
    fetchMaintentance();
  }, []);
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Equipment", field: "equipmentname" },
    { title: "Remark", field: "remarkaddress" },
    { title: " Date", field: "remarkdate" },
    { title: "Actual Date", field: "nextdate" },
    { title: "Actual Time", field: "nexttime" },
    { title: "City", field: "city" },
    { title: "State", field: "state" },
    { title: "Country", field: "country" },
    { title: "Pincode", field: "pincode" },
    { title: "Longitude", field: "longitude" },
    { title: "Latitude", field: "latitude" },
  ];

  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: items,
    });
    doc.save("Maintenance_Remarklist.pdf");
  };

  // Excel
  const fileName = "Maintenance_Remarklist";
  const [projectData, setProjectData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = () => {
    try {
      var data = maintentance.map((t, index) => ({
        Sno: index + 1,
        Equipment: t.equipmentname,
        "Remark ": t.remarkaddress,
        " Date": t.remarkdate,
        "Actual Date": t.nextdate,
        "Actual Time": t.nexttime,
        City: t.city,
        State: t.state,
        Country: t.country,
        Pincode: t.pincode,
        Longitude: t.longitude,
        Latitude: t.latitude,
      }));
      setProjectData(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Maintenance_Remarklist",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [maintentance]);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const gridRef = useRef(null);

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [main, setMain] = useState({});

  //get all project.
  const fetchMaintentance = async () => {
    try {
      let res_project = await axios.get(SERVICE.MAINTENTANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMain(res_project?.data?.maintenances);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [deleteproject, setDeleteproject] = useState({});

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.MAINTENTANCE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      handleCloseMod();
      setSelectedRows([]);
      await fetchMaintentance();
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
    actions: true,
    serialNumber: true,
    equipmentname: true,
    remarkdate: true,
    nextdate: true,
    nexttime: true,
    remarkaddress: true,
    latitude: true,
    longitude: true,
    pincode: true,
    city: true,
    state: true,
    country: true,
    checkbox: true,
    files: true,
    imagelocationfiles: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
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

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = maintentance?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [maintentance]);

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
    return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData?.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    { field: "serialNumber", headerName: "S.No", flex: 0, width: 90, minHeight: "40px", hide: !columnVisibility.serialNumber },
    { field: "equipmentname", headerName: "Equipment", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.equipmentname },
    { field: "remarkaddress", headerName: "Remark", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.remarkaddress },
    { field: "remarkdate", headerName: "Date", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.remarkdate },
    { field: "nextdate", headerName: "Actual Date", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.nextdate },
    { field: "nexttime", headerName: "Actual Time", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.nexttime },
    {
      field: "files",
      headerName: "Bill/Invoice",
      flex: 0,
      width: 100,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.files,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          <Button
            sx={{
              padding: "14px 14px",
              minWidth: "40px !important",
              borderRadius: "50% !important",
              ":hover": {
                backgroundColor: "#80808036", // theme.palette.primary.main
              },
            }}
            onClick={() => getimgbillCode(params.row.files)}
          >
            view
          </Button>
          {/* ))} */}
        </>
      ),
    },
    {
      field: "imagelocationfiles",
      headerName: "Image",
      flex: 0,
      width: 100,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.imagelocationfiles,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          <Button
            sx={{
              padding: "14px 14px",
              minWidth: "40px !important",
              borderRadius: "50% !important",
              ":hover": {
                backgroundColor: "#80808036", // theme.palette.primary.main
              },
            }}
            onClick={() => getimgCode(params.row.imagelocationfiles)}
          >
            view
          </Button>
          {/* ))} */}
        </>
      ),
    },
    { field: "city", headerName: "City", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.city },
    { field: "state", headerName: "State", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.state },
    { field: "country", headerName: "Country", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.country },
    { field: "pincode", headerName: "Pincode", flex: 0, width: 100, minHeight: "40px", hide: !columnVisibility.pincode },
    { field: "longitude", headerName: "Longitude", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.longitude },
    { field: "latitude", headerName: "Latitude", flex: 0, width: 120, minHeight: "40px", hide: !columnVisibility.latitude },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }} spacing={2}>
          <Button
            sx={{
              fontSize: "small",
              minWidth: "15px",
              padding: "6px 8px",
            }}
          >
            {/* <CloseIcon sx={{ color: "red", cursor: "pointer" }} onClick={handleClickOpen} /> */}
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                delUItodoData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          </Button>
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      equipmentname: item.equipmentname,
      remarkdate: moment(item.remarkdate).format("DD/MM/YYYY"),
      nextdate: moment(item.nextdate).format("DD/MM/YYYY"),
      nexttime: item.nexttime,
      remarkaddress: item.remarkaddress,
      city: item.city,
      state: item.state,
      country: item.country,
      pincode: item.pincode,
      longitude: item.longitude,
      latitude: item.latitude,
      files: item.files,
      imagelocationfiles: item.imagelocationfiles,
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
  const filteredColumns = columnDataTable?.filter((column) => column?.headerName?.toLowerCase()?.includes(searchQueryManage?.toLowerCase()));

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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column?.field]} onChange={() => toggleColumnVisibility(column?.field)} />} secondary={column?.headerName} />
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

  return (
    <Box>
      <Headtitle title={"MAINTENANCE"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Remark List</Typography>
      <br />
      {/* ****** Table Start ****** */}

      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid container spacing={2}>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}>
              <>
                <Link to="/asset/maintenanceservice" style={{ textDecoration: "none", color: "white", float: "right" }}>
                  <Button variant="contained">GoBack</Button>
                </Link>
              </>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  {/* <MenuItem value={maintentance.length}>All</MenuItem> */}
                </Select>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Box>
                <ExportXL csvData={projectData} fileName={fileName} />
                <ExportCSV csvData={projectData} fileName={fileName} />
                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                  &ensp;
                  <FaPrint />
                  &ensp;Print&ensp;
                </Button>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                  <FaFilePdf />
                  &ensp;Export to PDF&ensp;
                </Button>
                {/* </>
                                )} */}
                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                  {" "}
                  <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                </Button>
              </Box>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item md={6} xs={12} sm={12}>
              <Box sx={{ display: "flex", justifyContent: "left", flexWrap: "wrap", gap: "10px" }}>
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                  Manage Columns
                </Button>
                <Button variant="contained" color="error" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
                  Bulk Delete
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
              // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
              rows={rowsWithCheckboxes}
              columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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

      {/* Print End */}

      {/* ALERT  */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              onClick={() => {
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Delete */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Alert */}
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
            <Button autoFocus variant="contained" color="error">
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* print layout */}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Equipement</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actual Date</TableCell>
              <TableCell>Actual Time</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Latitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.equipmentname}</TableCell>
                  <TableCell>{row.remarkaddress}</TableCell>
                  <TableCell>{row.remarkdate}</TableCell>
                  <TableCell>{row.nextdate}</TableCell>
                  <TableCell>{row.nexttime}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.pincode}</TableCell>
                  <TableCell>{row.longitude}</TableCell>
                  <TableCell>{row.latitude}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ALERT delete UI DIALOG */}
      <Dialog open={isDeleteUIdataopen} onClose={handleCloseUIdataopen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseUIdataopen}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => deleteUItodorowData(deleteRemarkdata)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
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
            <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isimgview} onClose={handlecloseImgcodeview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
          <DialogContent>
            <Typography variant="h6">Bill/Invoice</Typography>
            {getimgcode.map((imagefile, index) => (
              <Grid container key={index}>
                <Grid item md={6} sm={10} xs={10}>
                  <img src={imagefile.preview} style={{ maxWidth: "70px", maxHeight: "70px", marginTop: "10px" }} />
                </Grid>
                <Grid item md={4} sm={10} xs={10} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>{imagefile.name}</Typography>
                </Grid>
                <Grid item md={2} sm={2} xs={2}>
                  <Button
                    sx={{
                      padding: "14px 14px",
                      minWidth: "40px !important",
                      borderRadius: "50% !important",
                      ":hover": {
                        backgroundColor: "#80808036", // theme.palette.primary.main
                      },
                    }}
                    onClick={() => renderFilePreview(imagefile)}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8", marginTop: "35px !important" }} />
                  </Button>
                </Grid>
              </Grid>
            ))}
          </DialogContent>

          <DialogActions>
            <Button onClick={handlecloseImgcodeview} sx={userStyle.btncancel}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isimgviewbill} onClose={handlecloseImgcodeviewbill} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
          <DialogContent>
            <Typography variant="h6">Images</Typography>
            {getimgbillcode.map((imagefilebill, index) => (
              <Grid container key={index}>
                <Grid item md={6} sm={10} xs={10}>
                  <img src={imagefilebill.preview} style={{ maxWidth: "70px", maxHeight: "70px", marginTop: "10px" }} />
                </Grid>

                <Grid item md={4} sm={10} xs={10} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>{imagefilebill.name}</Typography>
                </Grid>
                <Grid item md={2} sm={2} xs={2}>
                  <Button
                    sx={{
                      padding: "14px 14px",
                      minWidth: "40px !important",
                      borderRadius: "50% !important",
                      ":hover": {
                        backgroundColor: "#80808036", // theme.palette.primary.main
                      },
                    }}
                    onClick={() => renderFilePreview(imagefilebill)}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8", marginTop: "35px !important" }} />
                  </Button>
                </Grid>
              </Grid>
            ))}
          </DialogContent>

          <DialogActions>
            <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
              Close
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
    </Box>
  );
}

export default MaintenanceRemarkList;
