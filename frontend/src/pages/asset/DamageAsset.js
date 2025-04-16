import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PageHeading from "../../components/PageHeading";
import {
  Box, InputAdornment,
  Button,
  Checkbox,
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
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

function DamageAsset() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  const [assetdetails, setAssetdetails] = useState([]);

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



  let exportColumnNames = [
    "Status",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Material",
  ];
  let exportRowValues = [
    "status",
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "material",
  ];



  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Damage Asset"),
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

  useEffect(() => {
    getapi();
  }, []);


  const gridRefNeartat = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsNear, setSelectedRowsNear] = useState([]);
  const [itemsneartat, setItemsNearTat] = useState([]);

  const getRowClassNameNearTat = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };



  const handleCaptureImagenear = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Damage Asset.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChangeNear = (newSelection) => {
    setSelectedRowsNear(newSelection.selectionModel);
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const fetchDamagedAsset = async () => {
    setPageName(!pageName)
    try {
      setProjectCheck(true);
      // let res = await axios.get(SERVICE.ASSETDETAIL_DAMAGED, {
      let res = await axios.post(SERVICE.ASSET_DAMAGED_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      setAssetdetails(res?.data?.damagedasset?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        component: item.component?.toString(","),
        material: `${item.material} - ${item.code}`,
      })));
      setProjectCheck(false);
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
      if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.subpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.mainpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
      ) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      } else {
        fetfinalurl = [];
      }


      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));

  const { auth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);

  //Datatable
  const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
  const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);

  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRowsNear.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
  // Manage Columns
  const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] =
    useState(false);
  const [anchorElNeartat, setAnchorElNeartat] = useState(null);
  const handleOpenManageColumnsNeartat = (event) => {
    setAnchorElNeartat(event.currentTarget);
    setManageColumnsOpenNeartat(true);
  };
  const handleCloseManageColumnsNeartat = () => {
    setManageColumnsOpenNeartat(false);
    setSearchQueryManageNeartat("");
  };

  const openneartat = Boolean(anchorElNeartat);
  const idneartat = openneartat ? "simple-popover" : undefined;

  const initialColumnVisibilityNeartat = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    material: true,
    subcomponents: true,
    subcomponentsstring: true,
    problem: true,
    ip: true,
    ebusage: true,
    empdistribution: true,
    component: true,
    actions: true,
    status: true,
  };

  const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(
    initialColumnVisibilityNeartat
  );

  useEffect(() => {
    fetchDamagedAsset();
  }, []);

  //print...
  const componentRefNear = useRef();
  const handleprintNear = useReactToPrint({
    content: () => componentRefNear.current,
    documentTitle: "Damaged Asset ",
    pageStyle: "print",
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(assetdetails);
  }, [assetdetails]);

  //serial no for listing items
  const addSerialNumberNearTat = (datas) => {

    setItemsNearTat(datas);
  };

  useEffect(() => {
    addSerialNumberNearTat(assetdetails);
  }, [assetdetails]);


  //Datatable
  const handlePageChange = (newPage) => {
    setPageNearTatPrimary(newPage);
    setSelectedRowsNear([]);
    setSelectAllCheckedNear(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSizeNearTatPrimary(Number(event.target.value));
    setSelectedRowsNear([]);
    setSelectAllCheckedNear(false);
    setPageNearTatPrimary(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQueryManageNeartat(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQueryManageNeartat.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (pageNearTatPrimary - 1) * pageSizeNearTatPrimary,
    pageNearTatPrimary * pageSizeNearTatPrimary
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSizeNearTatPrimary);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, pageNearTatPrimary - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  const indexOfLastItem = pageNearTatPrimary * pageSizeNearTatPrimary;
  const indexOfFirstItem = indexOfLastItem - pageSizeNearTatPrimary;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }



  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

  const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
    <div>
      <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
    </div>
  );

  const columnDataTableNeartat = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerComponent: (params) => (
        <CheckboxHeaderNear
          selectAllCheckedNear={selectAllCheckedNear}
          onSelectAllNear={() => {
            if (rowDataTableNearTat.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllCheckedNear) {
              setSelectedRowsNear([]);
            } else {
              const allRowIds = rowDataTableNearTat.map((row) => row.id);
              setSelectedRowsNear(allRowIds);
            }
            setSelectAllCheckedNear(!selectAllCheckedNear);
          }}
        />
      ),

      cellRenderer: (params) => (
        <Checkbox
          checked={selectedRowsNear.includes(params.data.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsNear.includes(params.data.id)) {
              updatedSelectedRows = selectedRowsNear.filter(
                (selectedId) => selectedId !== params.data.id
              );
            } else {
              updatedSelectedRows = [...selectedRowsNear, params.data.id];
            }

            setSelectedRowsNear(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedNear(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 80,

      hide: !columnVisibilityNeartat.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityNeartat.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 80,
      hide: !columnVisibilityNeartat.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            backgroundColor: "red",
            color: "black",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.data.status}
        </Button>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 130,
      hide: !columnVisibilityNeartat.location,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 170,
      hide: !columnVisibilityNeartat.material,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTableNearTat = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      problem: item.problem,
      // material: `${item.material} - ${item.code}`,
      material: item.material,
      status: item.status,
      subcomponents: item.subcomponents,
      component: item.component,
    };
  });

  const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsNear.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityNeartat };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityNeartat(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableNeartat.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase())
  );



  // new code for toggle based on the remove columns
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityNeartat((prevVisibility) => ({
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
        onClick={handleCloseManageColumnsNeartat}
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
          value={searchQueryManageNeartat}
          onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
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
                    checked={columnVisibilityNeartat[column.field]}
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
              onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}
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
                columnDataTableNeartat.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityNeartat(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

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

  return (
    <Box>
      <Headtitle title={"DAMAGED ASSET"} />
      <PageHeading
        title="Damage Asset"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Damage Asset"
        subpagename=""
        subsubpagename=""
      />
      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>
              Damaged Asset List
            </Typography>

          </Grid>
          <Grid container spacing={2} style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  value={pageSizeNearTatPrimary}
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
                  <MenuItem value={assetdetails?.length}>All</MenuItem>
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
                {isUserRoleCompare?.includes("exceldamageasset") && (
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
                {isUserRoleCompare?.includes("csvdamageasset") && (
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
                {isUserRoleCompare?.includes("printdamageasset") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfdamageasset") && (
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
                {isUserRoleCompare?.includes("imagedamageasset") && (
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImagenear}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableNeartat}
                  setItems={setItemsNearTat}
                  addSerialNumber={addSerialNumberNearTat}
                  setPage={setPageNearTatPrimary}
                  maindatas={assetdetails}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryManageNeartat}
                  setSearchQuery={setSearchQueryManageNeartat}
                  paginated={false}
                  totalDatas={assetdetails}
                />
              </Box>
            </Grid>
          </Grid>
          <br />
          <Button
            sx={userStyle.buttongrp}
            onClick={handleShowAllColumns}
          >
            Show All Columns
          </Button>
          &ensp;
          <Button
            sx={userStyle.buttongrp}
            onClick={handleOpenManageColumnsNeartat}
          >
            Manage Columns
          </Button>
          &ensp;
          <br />
          <br />
          {projectCheck ? (
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
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <>
                  <AggridTable
                    rowDataTable={rowDataTableNearTat}
                    columnDataTable={columnDataTableNeartat}
                    columnVisibility={columnVisibilityNeartat}
                    page={pageNearTatPrimary}
                    setPage={setPageNearTatPrimary}
                    pageSize={pageSizeNearTatPrimary}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibilityNeartat}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRowsNear}
                    setSelectedRows={setSelectedRowsNear}
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={assetdetails}
                  />
                </>
              </Box>
            </>
          )}
          {/* ****** Table End ****** */}
        </Box>
      </>

      <Popover
        id={idneartat}
        open={isManageColumnsOpenNeartat}
        anchorEl={anchorElNeartat}
        onClose={handleCloseManageColumnsNeartat}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTableNearTat) ?? []}
        itemsTwo={assetdetails ?? []}
        filename={"Damaged Asset"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefNear}
      />

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

    </Box>
  );
}

export default DamageAsset;
