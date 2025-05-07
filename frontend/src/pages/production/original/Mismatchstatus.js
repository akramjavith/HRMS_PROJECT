import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Select,
  Chip,

  MenuItem,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { handleApiError } from "../../../components/Errorhandling.js";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../components/TableStyle.js";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import AlertDialog from "../../../components/Alert.js";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import {
//   DeleteConfirmation,
//   PleaseSelectRow,
// } from "../../components/DeleteConfirmation.js";

import ExportData from "../../../components/ExportData.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading";

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

function MismatchStatus() {

  const [mismatchStatus, setMismatchStatus] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [mischeck, setMisCheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [copiedData, setCopiedData] = useState("");

  //Datatable
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedFromdate, setSelectedFromdate] = useState("");
  const [selectedTodate, setSelectedTodate] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [fileFormat, setFormat] = useState("");
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  let exportColumnNames = ["Date", "Outstanding Allot Count", "Day Status"];

  let exportRowValues = ["date", "count", "daystatus"];

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Original Upload.png");
        });
      });
    }
  };


  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    date: true,
    daystatus: true,
    count: true,
    status: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };


  //get all Sub vendormasters.
  const fetchMismatchStatus = async () => {
    setMisCheck(true);
    setSelectedFromdate("");
    setSelectedTodate("");
    try {

      setMismatchStatus([]);
      setMisCheck(false);
    } catch (err) {
      setMisCheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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
    const itemsWithSerialNumber = mismatchStatus?.map((item, index) => ({
      ...item,
      id: index + 1,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [mismatchStatus]);

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
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

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
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "date", headerName: "Date", flex: 0, width: 180, hide: !columnVisibility.date, headerClassName: "bold-header" },
    { field: "count", headerName: "Outstanding Allot Count", flex: 0, width: 250, hide: !columnVisibility.count, headerClassName: "bold-header" },
    {
      field: "daystatus", headerName: "Day Status", flex: 0, width: 250, hide: !columnVisibility.daystatus, headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", borderRadius: "0px" }}>
            <Chip sx={{ height: "25px", color: "white", background: params.row.daystatus === "Created" ? "#459949" : "#f1954a" }} variant="variant" label={params.row.daystatus} />
          </Grid>
        );
      },
      // <Chip icon={<FaceIcon />} label="With Icon" variant="outlined" />
    },
    // { field: "status", headerName: "Status", flex: 0, width: 180, hide: !columnVisibility.status, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
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

  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Vendor", field: "vendor" },
    { title: "Date Time Zone", field: "datetimezone" },
    { title: "From Date", field: "fromdatelist" },
    { title: "To Date", field: "todatelist" },
    { title: "User Name", field: "username" },
    { title: "Created Date", field: "createddate" },
  ];

  // Excel
  const fileName = "Production Original Upload";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Original Upload",
    pageStyle: "print",
  });


  useEffect(() => {
    fetchMismatchStatus();
  }, []);




  const handleFilterSubmit = async () => {
    try {
      setMisCheck(true);

      function getDateArray(fromDate, toDate) {
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        const dateArray = [];

        while (startDate <= endDate) {
          // Convert date to ISO format (YYYY-MM-DD) and push it to the array
          dateArray.push(startDate.toISOString().split('T')[0]);
          // Increment the date by 1 day
          startDate.setDate(startDate.getDate() + 1);
        }

        return dateArray;
      }
      const arrayDates = getDateArray(selectedFromdate, selectedTodate);
      console.log(arrayDates, 'arrayDates')

      // const getFinalDates = async (arrayDates) => {
      //   const finalDates = await Promise.all(
      //     arrayDates.map(async (item) => {
      //       let resNew = await axios.post(
      //         SERVICE.PRODUCTION_MISMATCH_STATUS_DATEFILTER,
      //         {
      //           fromdate: `${item}T00:00:00`,
      //           todate: `${item}T23:59:59`,
      //           arrayDates: arrayDates,
      //         },
      //         {
      //           headers: {
      //             Authorization: `Bearer ${auth.APIToken}`,
      //           },
      //         }
      //       );

      //       return {
      //         date: item,
      //         count: resNew.data.count,
      //       };
      //     })
      //   );

      //   return finalDates;
      // };

      // getFinalDates(arrayDates).then((finalDates) => {
      //   console.log(finalDates, 'finalDates');
      //   setMismatchStatus(finalDates);
      //   setMisCheck(false);
      // });
      if (arrayDates.length <= 7) {
        const getFinalDates = async (arrayDates) => {
          const finalDates = [];

          for (let item of arrayDates) {
            try {
              let resNew = await axios.post(
                SERVICE.PRODUCTION_MISMATCH_STATUS_DATEFILTER,
                {
                  fromdate: `${item}T00:00:00`,
                  todate: `${item}T23:59:59`,
                  fromdate: item,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );

              finalDates.push({
                date: item,
                count: resNew.data.count,
                daystatus: resNew.data.prodday > 0 ? "Created" : "Not Created"
              });
            } catch (error) {
              console.error(`Error processing date ${item}:`, error);
            }
          }

          return finalDates;
        };

        getFinalDates(arrayDates).then((finalDates) => {
          console.log(finalDates, 'finalDates');
          setMismatchStatus(finalDates);
          setMisCheck(false);
        });
      } else {
        setPopupContentMalert("Please choose fewer than 7 days");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        setMisCheck(false);
      }



    } catch (err) {
      setMisCheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  return (
    <Box>
      <Headtitle title={"Unmatch Status"} />
      {/* ****** Header Content ****** */}
      <PageHeading title=" Unmatch Status" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Production Upload List" subsubpagename="" />

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmismatchstatus") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid item md={8} sm={8} xs={12}>
              <Typography sx={{ ...userStyle.importheadtext, fontWeight: "bold" }}>Filter</Typography>
            </Grid>
            <Grid container spacing={3}>

              <Grid item md={4} xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        From Date <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={selectedFromdate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          // Ensure that the selected date is not in the future
                          const currentDate = new Date().toISOString().split("T")[0];
                          if (selectedDate <= currentDate) {
                            setSelectedFromdate(selectedDate);
                            setSelectedTodate(selectedDate);
                          } else {
                          }
                        }}
                        // Set the max attribute to the current date
                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        To Date <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={selectedTodate}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          // Ensure that the selected date is not in the future
                          const currentDate = new Date().toISOString().split("T")[0];
                          const fromdateval = selectedFromdate != "" && new Date(selectedFromdate).toISOString().split("T")[0];
                          if (selectedFromdate == "") {
                            setPopupContentMalert("Please Select From date");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                          } else if (selectedDate < fromdateval) {
                            setPopupContentMalert("To Date should be after or equal to From Date");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();

                            setSelectedTodate("");
                          } else if (selectedDate <= currentDate) {
                            setSelectedTodate(selectedDate);
                          } else {
                          }
                        }}
                        // Set the max attribute to the current date
                        inputProps={{ max: new Date().toISOString().split("T")[0], min: selectedFromdate !== "" ? selectedFromdate : null }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={1.2} sm={6} xs={12} marginTop={3}>
                <Button variant="contained" onClick={(e) => handleFilterSubmit(e)}>
                  Filter
                </Button>
              </Grid>
              <Grid item md={2} sm={6} xs={12} marginTop={3}>
                <Button sx={userStyle.btncancel} onClick={(e) => fetchMismatchStatus(e)}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Box sx={userStyle.container}>
            <Grid container>
              <Grid item md={8} sm={8} xs={12}>
                <Typography sx={userStyle.importheadtext}>Unmatch Status</Typography>
              </Grid>

            </Grid>
            <Grid container style={userStyle.dataTablestyle}>
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
                    <MenuItem value={mismatchStatus?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelmismatchstatus") && (
                    // <>
                    //   <ExportXL
                    //     csvData={filteredData?.map((t, index) => ({
                    //       Sno: index + 1,
                    //       Vendor: t.vendor,
                    //       "Date Time Zone": t.datetimezone,
                    //       "From Date": moment(t.fromdate)?.format("DD-MM-YYYY"),
                    //       "To Date": moment(t.todate)?.format("DD-MM-YYYY"),
                    //       "User Name": t.addedby[0].companyname,
                    //       "Created Date": t.createddate,
                    //     }))}
                    //     fileName={fileName}
                    //   />
                    // </>
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
                  {isUserRoleCompare?.includes("csvmismatchstatus") && (
                    // <>
                    //   <ExportCSV
                    //     csvData={filteredData?.map((t, index) => ({
                    //       Sno: index + 1,
                    //       Vendor: t.vendor,
                    //       "Date Time Zone": t.datetimezone,
                    //       "From Date": moment(t.fromdate)?.format("DD-MM-YYYY"),
                    //       "To Date": moment(t.todate)?.format("DD-MM-YYYY"),
                    //       "User Name": t.addedby[0].companyname,
                    //       "Created Date": t.createddate,
                    //     }))}
                    //     fileName={fileName}
                    //   />
                    // </>
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
                  {isUserRoleCompare?.includes("printmismatchstatus") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmismatchstatus") && (
                    // <>
                    //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                    //     <FaFilePdf />
                    //     &ensp;Export to PDF&ensp;
                    //   </Button>
                    // </>
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
                  {isUserRoleCompare?.includes("imagemismatchstatus") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;

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
            {mischeck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  ref={gridRef}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
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
              </>
            )}
          </Box>
        </>
      )}




      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
        filename={"Unmatch Status"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

    </Box>
  );
}

export default MismatchStatus;