import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Select,
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
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import "jspdf-autotable";
import Selects from "react-select";
import Headtitle from "../../components/Headtitle";
import { handleApiError } from "../../components/Errorhandling";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../components/TableStyle";
import { ExportXL, ExportCSV } from "../../components/Export";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { UserRoleAccessContext } from "../../context/Appcontext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ManageAsset = () => {
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );

  const [pageSize, setPageSize] = useState(10);

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

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

  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    material: true,
    materialcode: true,
    materialcount: true,
    materialcountcode: true,
    brand: true,
    brandcount: true,
    serial: true,
    rate: true,
    purchasedate: true,
    waranty: true,
    customercare: true,
    vendor: true,
    reason: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 100,
      hide: !columnVisibility.material,
      headerClassName: "bold-header",
    },
    {
      field: "materialcode",
      headerName: "Material Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.materialcode,
      headerClassName: "bold-header",
    },
    {
      field: "materialcount",
      headerName: "Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.materialcount,
      headerClassName: "bold-header",
    },
    {
      field: "materialcountcode",
      headerName: "Material Count Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.materialcountcode,
      headerClassName: "bold-header",
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 0,
      width: 100,
      hide: !columnVisibility.brand,
      headerClassName: "bold-header",
    },
    {
      field: "brandcount",
      headerName: "Count",
      flex: 0,
      width: 100,
      hide: !columnVisibility.brandcount,
      headerClassName: "bold-header",
    },
    {
      field: "serial",
      headerName: "Serial",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serial,
      headerClassName: "bold-header",
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rate,
      headerClassName: "bold-header",
    },
    {
      field: "purchasedate",
      headerName: "Purchase Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.purchasedate,
      headerClassName: "bold-header",
    },
    {
      field: "waranty",
      headerName: "Waranty",
      flex: 0,
      width: 100,
      hide: !columnVisibility.waranty,
      headerClassName: "bold-header",
    },
    {
      field: "customercare",
      headerName: "Customer Care",
      flex: 0,
      width: 150,
      hide: !columnVisibility.customercare,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 0,
      width: 250,
      hide: !columnVisibility.reason,
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
    },
  ];
  const [items, setItems] = useState([]);

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

  const filteredData = filteredDatas?.slice();

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      material: item.material,
      materialcode: item.materialcode,
      materialcount: item.materialcount,
      materialcountcode: item.materialcountcode,
      brand: item.brand,
      brandcount: item.brandcount,
      serial: item.serial,
      rate: item.rate,
      purchasedate: item.purchasedate,
      waranty: item.waranty,
      customercare: item.customercare,
      vendor: item.vendor,
      reason: item.reason,
    };
  });

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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <>
      <Box>
        <Headtitle title={"MANAGE ASSET"} />
        {/* ****** Header Content ****** */}
        <Typography sx={userStyle.HeaderText}>Manage Asset Details </Typography>
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid item xs={8} sx={{ marginBottom: "10px" }}>
              <Typography sx={userStyle.importheadtext}>
                Asset Details List
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <Selects placeholder="Choose Branch" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Unit</Typography>
                  <Selects placeholder="Choose Unit" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Floor</Typography>
                  <Selects placeholder="Choose Floor" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Location</Typography>
                  <Selects placeholder="Choose Location" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Area</Typography>
                  <Selects placeholder="Choose Area" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Responsible Team</Typography>
                  <Selects placeholder="Choose Team" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Asset</Typography>
                  <Selects placeholder="Choose Head" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Material</Typography>
                  <Selects />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Brand</Typography>
                  <Selects placeholder="Choose Brand" />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Vendor</Typography>
                  <Selects placeholder="Choose Vendor" />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Grid item md={12} sm={12} xs={12}>
                  <Button sx={userStyle.buttonadd} variant="contained">
                    Filter
                  </Button>
                </Grid>
              </Grid>

              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Grid item md={12} sm={12} xs={12}>
                  <Button sx={userStyle.btncancel}>Clear</Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanageasset") && (
        <>
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
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
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem>All</MenuItem> */}
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
                    <>
                      <ExportXL />
                    </>
                    <>
                      <ExportCSV />
                    </>
                    <>
                      <Button sx={userStyle.buttongrp}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                    <>
                      <Button sx={userStyle.buttongrp}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                    <Button sx={userStyle.buttongrp}>
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput id="component-outlined" type="text" />
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              <Button variant="contained" color="error">
                Bulk Delete
              </Button>
              <br />
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  rows={rowDataTable}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  autoHeight={true}
                  density="compact"
                  hideFooter
                  disableRowSelectionOnClick
                />
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
                </Box>
                <Box>
                  <Button sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  <Button
                    sx={userStyle.paginationbtn}
                    className="active"
                    disabled
                  >
                    1
                  </Button>
                  <Button sx={userStyle.paginationbtn}>2</Button>
                  <Button sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
              {/* ****** Table End ****** */}
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
            </Box>
          </>
        </>
      )}
    </>
  );
};

export default ManageAsset;
