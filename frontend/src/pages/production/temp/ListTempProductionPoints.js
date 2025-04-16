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
  InputAdornment,
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
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import * as XLSX from "xlsx";

function ListTempProductionPoints() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [clientUserID, setClientUserID] = useState({
    projectvendor: "Please Select Project Vendor",
    userid: "",
    password: "",
  });
  const [clientUserIDEdit, setClientUserIDEdit] = useState({
    projectvendor: "Please Select Project Vendor",
    userid: "",
    password: "",
  });
  const [clientUserIDArray, setClientUserIDArray] = useState([]);
  const [productionPoints, setProductionPoints] = useState([]);
  const [projectVendorOption, setProjectVendorOption] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteClientUserID, setDeleteClientUserID] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientUserIDData, setClientUserIDData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allClientUserIDEdit, setAllClientUserIDEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [singleFile, setSingleFile] = useState({});

  const getDownloadFile = async (document) => {
    const readExcel = (base64Data) => {
      return new Promise((resolve, reject) => {
        const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      });
    };

    const fileExtension = getFileExtension(document.name);

    if (
      fileExtension === "xlsx" ||
      fileExtension === "xls" ||
      fileExtension === "csv"
    ) {
      readExcel(document.data)
        .then((excelData) => {
          const htmlTable = generateHtmlTable(excelData);
          const newTab = window.open();
          newTab.document.write(htmlTable);
        })
        .catch((error) => { });
    }

    // Helper function to extract file extension from a filename
    function getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    // Helper function to generate an HTML table from Excel data
    function generateHtmlTable(data) {
      const headers = Object.keys(data[0]);

      const tableHeader = `<tr>${headers
        .map(
          (header) =>
            `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
        )
        .join("")}</tr>`;

      const tableRows = data.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
        const cells = headers
          .map(
            (header) =>
              `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
          )
          .join("");
        return `<tr>${cells}</tr>`;
      });

      return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
        ""
      )}</table>`;
    }
  };

  // get single row to view....
  const getCode = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TEMP_POINTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleFile(res?.data?.stemppointsupload);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    empcode: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    date: true,
    exper: true,
    target: true,
    weekoff: true,
    production: true,
    manual: true,
    nonproduction: true,
    point: true,
    allowancepoint: true,
    nonallowancepoint: true,
    avgpoint: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [clientUserIDArray]);

  useEffect(() => {
    getexcelDatas();
  }, [clientUserIDArray]);

  useEffect(() => {
    // fetchClientUserID();
    fetchProductionLists();
  }, []);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPasswordEdit = () =>
    setShowPasswordEdit((show) => !show);
  const handleMouseDownPasswordEdit = (event) => {
    event.preventDefault();
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload password
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };


  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get all client user id.
  const fetchProductionLists = async () => {
    try {
      let res_freq = await axios.get(SERVICE.GET_TEMP_POINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let answer = res_freq?.data?.temppointsupload
        .map((data) => {
          return data.uploaddata.map((upload) => ({
            ...upload,
            mainid: data._id,
          }));
        })
        .flat();

      setClientUserIDArray(answer?.reverse());
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Temp_Production_Points.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Employee Code", field: "empcode" },
    { title: "Employee Name", field: "name" },
    { title: "Branch", field: "branch" },
    { title: "Company Name", field: "companyname" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Date", field: "date" },
    { title: "Exper", field: "exper" },
    { title: "Target", field: "target" },
    { title: "Week Off", field: "weekoff" },
    { title: "Production", field: "production" },
    { title: "Manual", field: "manual" },
    { title: "Non-Production", field: "nonproduction" },
    { title: "Point", field: "point" },
    { title: "Allowance Point", field: "allowancepoint" },
    { title: "Non-allowance Points", field: "nonallowancepoint" },
    { title: "Average Points", field: "avgpoint" },
  ];
  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
        cellWidth: "auto",
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: items,
    });
    doc.save("List_Temp_Production_Points.pdf");
  };
  // Excel
  const fileName = "List_Temp_Production_Points";
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = clientUserIDArray.map((item, index) => ({
      Sno: index + 1,
      EmployeeCode: item.empcode,
      EmployeeName: item.name,
      Company: item.companyname,
      Branch: item.branch,
      Unit: item.unit,
      Team: item.team,
      Date: moment(item.date).format("DD-MM-YYYY"),
      Exper: item.exper,
      Target: item.target,
      Weekoff: item.weekoff,
      Production: item.production,
      Manual: item.manual,
      NonProduction: item.nonproduction,
      Point: item.point,
      AllowancePoint: item.allowancepoint,
      NonAllowancePoint: item.nonallowancepoint,
      AvgPoint: item.avgpoint,
    }));
    setClientUserIDData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "List Temp Production Points",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = clientUserIDArray?.map((item, index) => ({
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
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
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
      width: 50,
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
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Employee Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "exper",
      headerName: "Exper",
      flex: 0,
      width: 100,
      hide: !columnVisibility.exper,
      headerClassName: "bold-header",
    },
    {
      field: "target",
      headerName: "Target",
      flex: 0,
      width: 100,
      hide: !columnVisibility.target,
      headerClassName: "bold-header",
    },
    {
      field: "weekoff",
      headerName: "Week Off",
      flex: 0,
      width: 100,
      hide: !columnVisibility.weekoff,
      headerClassName: "bold-header",
    },
    {
      field: "production",
      headerName: "Production",
      flex: 0,
      width: 100,
      hide: !columnVisibility.production,
      headerClassName: "bold-header",
    },
    {
      field: "manual",
      headerName: "Manual",
      flex: 0,
      width: 100,
      hide: !columnVisibility.manual,
      headerClassName: "bold-header",
    },
    {
      field: "nonproduction",
      headerName: "Non-Production",
      flex: 0,
      width: 100,
      hide: !columnVisibility.nonproduction,
      headerClassName: "bold-header",
    },
    {
      field: "point",
      headerName: "Point",
      flex: 0,
      width: 100,
      hide: !columnVisibility.point,
      headerClassName: "bold-header",
    },
    {
      field: "allowancepoint",
      headerName: "Allowance Point",
      flex: 0,
      width: 100,
      hide: !columnVisibility.allowancepoint,
      headerClassName: "bold-header",
    },
    {
      field: "nonallowancepoint",
      headerName: "Non-allowance Points",
      flex: 0,
      width: 100,
      hide: !columnVisibility.nonallowancepoint,
      headerClassName: "bold-header",
    },
    {
      field: "avgpoint",
      headerName: "Average Points",
      flex: 0,
      width: 100,
      hide: !columnVisibility.avgpoint,
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
          {isUserRoleCompare?.includes("elisttempproductionpoints") && (
            <Button
              variant="contained"
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.mainid);
              }}
            >
              view
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
      empcode: item.empcode,
      name: item.name,
      companyname: item.companyname,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      date: moment(item.date).format("DD-MM-YYYY"),
      exper: item.exper,
      target: item.target,
      weekoff: item.weekoff,
      production: item.production,
      manual: item.manual,
      nonproduction: item.nonproduction,
      point: item.point,
      allowancepoint: item.allowancepoint,
      nonallowancepoint: item.nonallowancepoint,
      avgpoint: item.avgpoint,
      mainid: item.mainid,
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
              {" "}
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
  return (
    <Box>
      <Headtitle title={"List Temp Production_Points"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        List Temp Production_Points
      </Typography>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {!clientUserIDArray ? (
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
          {isUserRoleCompare?.includes("llisttempproductionpoints") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    List Temp Production_Points
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
                        <MenuItem value={clientUserIDArray?.length}>
                          All
                        </MenuItem>
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
                        "excellisttempproductionpoints"
                      ) && (
                          <>
                            <ExportXL
                              csvData={clientUserIDData}
                              fileName={fileName}
                            />
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "csvlisttempproductionpoints"
                      ) && (
                          <>
                            <ExportCSV
                              csvData={clientUserIDData}
                              fileName={fileName}
                            />
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "printlisttempproductionpoints"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprint}
                            >
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes("pdfclientuserid") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => downloadPdf()}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes(
                        "imagelisttempproductionpoints"
                      ) && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
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
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  Manage Columns
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
        </>
      )}
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
              <TableCell>Employee Code</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Exper</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Week Off</TableCell>
              <TableCell>Production</TableCell>
              <TableCell>Manual</TableCell>
              <TableCell>Non-Production</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Allowance Point</TableCell>
              <TableCell>Non-allowance Points</TableCell>
              <TableCell>Average Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {clientUserIDArray &&
              clientUserIDArray.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{moment(row.date).format("DD-MM-YYYY")}</TableCell>
                  <TableCell>{row.exper}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.weekoff}</TableCell>
                  <TableCell>{row.production}</TableCell>
                  <TableCell>{row.manual}</TableCell>
                  <TableCell>{row.nonproduction}</TableCell>
                  <TableCell>{row.point}</TableCell>
                  <TableCell>{row.allowancepoint}</TableCell>
                  <TableCell>{row.nonallowancepoint}</TableCell>
                  <TableCell>{row.avgpoint}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      {/* Bulk delete ALERT DIALOG */}
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
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Temp Production Points
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              {/* <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">File Name</Typography>
                  <Typography>{singleFile?.filename}</Typography>
                </FormControl>
              </Grid> */}
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(singleFile?.date).format("DD-MM-YYYY")}{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} sm={6} xs={12}>
                <Typography variant="h6">File Name</Typography>
                {singleFile?.document?.map((file, fileIndex) => (
                  <Grid container key={fileIndex}>
                    <Grid item md={8} sm={10} xs={10}>
                      <Typography>{file.name}</Typography>
                    </Grid>
                    <Grid item md={2} sm={10} xs={10}>
                      <a
                        style={{
                          minWidth: "0px",
                          textDecoration: "none",
                          color: "#357AE8",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = `data:application/octet-stream;base64,${file.data}`;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        Download
                      </a>
                    </Grid>
                    <Grid item md={1} sm={2} xs={2}></Grid>
                    <Grid item md={1} sm={2} xs={2}>
                      <VisibilityOutlinedIcon
                        style={{
                          fontsize: "large",
                          color: "#357AE8",
                          cursor: "pointer",
                        }}
                        onClick={() => getDownloadFile(file)}
                      />
                    </Grid>
                  </Grid>
                ))}
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
      <br />
    </Box>
  );
}

export default ListTempProductionPoints;
