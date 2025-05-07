import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  TableBody,
  TableRow,
  TextField,
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
  IconButton,
  Checkbox,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SearchIcon from "@mui/icons-material/Search";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import { Link, useParams } from "react-router-dom";
import "jspdf-autotable";
import axios from "axios";
import StyledDataGrid from "../../../components/TableStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CancelIcon from "@mui/icons-material/Cancel";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Papa from "papaparse";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function Roleandresponse() {
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  const [allRoleAndRes, setAllRoleAndRes] = useState([]);

  const [roleAndResAdd, setRoleAndResAdd] = useState("Please Select");
  const [desId, setDesId] = useState("Please Select");

  const [roleAndResEdit, setRoleAndResEdit] = useState({});
  const [designations, setDesignations] = useState([]);
  const [roleAndResTextArea, setRoleAndResTextArea] =
    useState("<ul><li></li></ul>");
  const handleRoleAndResponse = (value) => {
    setRoleAndResTextArea(value);
  };
  const handleRoleAndResponseEdit = (value) => {
    setRoleAndResEdit({ ...roleAndResEdit, roleandresponsibilities: value });
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAlert, setShowAlert] = useState();

  const [deleteproject, setDeleteproject] = useState({});

  const [excelData, setExcelData] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjcount, setOvProjcount] = useState(0);
  const [allProjectedit, setAllProjectedit] = useState([]);

  const [checkvendor, setCheckvendor] = useState();
  const [checkcategory, setCheckcategory] = useState();
  const [checksubcategory, setChecksubcategory] = useState();
  const [checktimepoints, setChecktimepoints] = useState();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    // if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
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
  //Delete model
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
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

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
  };

  let printsno = 1;

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sroleandresponsibilities);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchRoleAndRes();
      handleCloseMod();
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delLocationgrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchRoleAndRes();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let refercreate = await axios.post(SERVICE.ROLEANDRESPONSE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: String(roleAndResAdd),
        designationid: String(desId),
        roleandresponsibilities: String(roleAndResTextArea),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRoleAndRes();
      setRoleAndResAdd("Please Select");
      setRoleAndResTextArea("<ul><li></li></ul>");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = allRoleAndRes?.some(item => item.name?.toLowerCase() === (allRoleAndRes.name)?.toLowerCase());
    if (roleAndResAdd === "" || roleAndResAdd === "Please Select") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      roleAndResTextArea === "" ||
      roleAndResTextArea === "<ul><li><br></li></ul>"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Roles And Responsibilites"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  // clear
  const handleClear = (e) => {
    e.preventDefault();
    setRoleAndResTextArea("<ul><li></li></ul>");
    setRoleAndResAdd("Please Select");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //get single row to edit....
  const getCodeEdit = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get single row to edit....
  const getCodeView = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get single row to edit....
  const getCodeInfo = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleAndResEdit(res?.data?.sroleandresponsibilities);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Project updatedby edit page...
  let updatedby = roleAndResEdit.updatedby;
  let addedby = roleAndResEdit.addedby;
  let refsid = roleAndResEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.ROLEANDRESPONSE_SINGLE}/${refsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        designation: String(roleAndResEdit.designation),
        designationid: String(roleAndResEdit.designationid),
        roleandresponsibilities: String(roleAndResEdit.roleandresponsibilities),
        updatedby: [
          ...updatedby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRoleAndResEdit(res.data);
      await fetchRoleAndRes();
      handleCloseModEdit();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    // fetchProjMasterAll();
    // const isNameMatch = allProjectedit?.some(item => item.name?.toLowerCase() === (roleAndResEdit.name)?.toLowerCase());
    if (roleAndResEdit.firstname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (isNameMatch) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon
    //                 sx={{ fontSize: "100px", color: "orange" }}
    //             />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                 {"Name already exits!"}
    //             </p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (roleAndResEdit.name != ovProj && ovProjcount > 0) {
    //     setShowAlertpop(
    //         <>
    //             <ErrorOutlineOutlinedIcon
    //                 sx={{ fontSize: "100px", color: "orange" }}
    //             />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //                 {getOverAllCount}
    //             </p>
    //         </>
    //     );
    //     handleClickOpenerrpop()
    // }
    else {
      sendEditRequest();
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    designation: true,
    roleandresponsibilities: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  const fetchDesignations = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignations(
        res?.data?.designation?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  //get all role and responsibilities details.
  const fetchRoleAndRes = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.ROLEANDRESPONSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllRoleAndRes(res_project?.data?.roleandresponsibilities);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchRoleAndRes();
  }, []);

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = allRoleAndRes?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [allRoleAndRes]);

  // Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

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

  // Table start colum and row
  // Define columns for the DataGrid
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold",
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
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
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
      width: 120,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 200,
      hide: !columnVisibility.referingjob,
    },
    {
      field: "roleandresponsibilities",
      headerName: "Roles And Responsibilities",
      flex: 0,
      width: 600,
      hide: !columnVisibility.emailid,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("erolesandresponsibilities") && (
            // <Link
            //     to={`/contact/supplier/edit/${params.row.id}`}
            //     style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            // >
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeEdit(params.row.id, params.row.name);
              }}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("drolesandresponsibilities") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vrolesandresponsibilities") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("irolesandresponsibilities") && (
            // <Link
            //     to={`/contact/supplier/view/${params.row.id}`}
            //     style={{ textDecoration: "none", color: "white" }}
            // >
            <Button
              sx={userStyle.buttonview}
              onClick={() => {
                getCodeInfo(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
            // </Link>
          )}
        </Grid>
      ),
    },
  ];

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData?.map((roleandres, index) => {
    return {
      id: roleandres._id,
      serialNumber: roleandres.serialNumber,
      designation: roleandres.designation,
      roleandresponsibilities: convertToNumberedList(
        roleandres.roleandresponsibilities
      ),
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    checkbox: selectedRows.includes(row.id),
  }));

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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
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

  // Excel
  const fileName = "Roles And Responsibilities";
  // get particular columns for export excel
  const getExcelDatas = () => {
    var data = allRoleAndRes.map((t, index) => ({
      Sno: index + 1,
      Designation: t.designation,
      "Roles And Responsibilities": convertToNumberedList(
        t.roleandresponsibilities
      ),
    }));
    setExcelData(data);
  };

  useEffect(() => {
    getExcelDatas();
  }, [allRoleAndRes]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Roles And Responsibilities",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "S.No", field: "serialNumber" },
    { title: "Designation", field: "designation" },
    { title: "Roles And Responsibilities", field: "roleandresponsibilities" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    // Add a serial number to each row
    const itemsWithSerial = allRoleAndRes.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      roleandresponsibilities: convertToNumberedList(
        item.roleandresponsibilities
      ),
    }));
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
      },
      // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
      // body: items,
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("Roles And Responsibilities.pdf");
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Roles And Responsibilities.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"ROLE AND RESPONSIBILITIES"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Roles And Responsibilities"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Roles of Responsibilities"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("arolesandresponsibilities") && (
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Designation <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <Selects
                  options={designations}
                  value={{ label: roleAndResAdd, value: roleAndResAdd }}
                  onChange={(e) => {
                    setRoleAndResAdd(e.value);
                    setDesId(e._id);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              sm={{ display: "none" }}
              xs={{ display: "none" }}
            >
              {" "}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>
                  Role And Responsibilities <b style={{ color: "red" }}>*</b>
                </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <ReactQuill
                  style={{ height: "180px" }}
                  value={roleAndResTextArea}
                  onChange={handleRoleAndResponse}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                  ]}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {" "}
                Submit{" "}
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* } */}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Edit Roles And Responsibilities{" "}
            </Typography>
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Designation <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <Selects
                    options={designations}
                    value={{
                      alue: roleAndResEdit.designation,
                      label: roleAndResEdit.designation,
                    }}
                    onChange={(e) => {
                      setRoleAndResEdit({
                        ...roleAndResEdit,
                        designation: e.value,
                        designationid: e._id,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                lg={8}
                md={8}
                sm={{ display: "none" }}
                xs={{ display: "none" }}
              >
                {" "}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <InputLabel>
                  {" "}
                  <b>
                    Role And Responsibilities <b style={{ color: "red" }}>*</b>
                  </b>
                </InputLabel>
                <FormControl fullWidth size="small">
                  <ReactQuill
                    style={{ height: "180px" }}
                    value={roleAndResEdit.roleandresponsibilities}
                    onChange={handleRoleAndResponseEdit}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button variant="contained" onClick={editSubmit}>
                  {" "}
                  Update
                </Button>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("lrolesandresponsibilities") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List a Role & Responsibilities{" "}
              </Typography>
            </Grid>
            <br />
            {/* ****** Table Grid Container ****** */}
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
                    <MenuItem value={allRoleAndRes?.length}>All</MenuItem>
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
                    "excelrolesandresponsibilities"
                  ) && (
                    <>
                      <ExportXL csvData={excelData} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "csvrolesandresponsibilities"
                  ) && (
                    <>
                      <ExportCSV csvData={excelData} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "printrolesandresponsibilities"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "pdfrolesandresponsibilities"
                  ) && (
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
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon
                      sx={{ fontSize: "15px" }}
                    /> &ensp;image&ensp;{" "}
                  </Button>
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            <Button
              sx={userStyle.buttongrp}
              onClick={() => {
                handleShowAllColumns();
                setColumnVisibility(initialColumnVisibility);
              }}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpenalert}
            >
              Bulk Delete
            </Button>
            <br />
            {/* {isLoader ? ( */}
            <>
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <StyledDataGrid
                  ref={gridRef}
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  hideFooter
                  density="compact"
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
              </Box>{" "}
              <br /> <br />
            </>
          </Box>
        </>
      )}
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
      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
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
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delProject(projectid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}
        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Roles And Responsibilities Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Added By</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"S.No"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"User Name"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated By</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"S.No"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"User Name"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updatedby?.map((item, i) => (
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                <TableCell>S.No</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Roles And Responsibilities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {allRoleAndRes &&
                allRoleAndRes.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                    <TableCell>
                      {convertToNumberedList(row.roleandresponsibilities)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <Typography sx={userStyle.HeaderText}>
            {" "}
            View Roles And Responsibilities Page
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Designation </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <TextField size="small" value={roleAndResEdit.designation} />
              </FormControl>
            </Grid>
            <Grid
              item
              lg={8}
              md={8}
              sm={{ display: "none" }}
              xs={{ display: "none" }}
            >
              {" "}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <InputLabel>
                {" "}
                <b>Role And Responsibilities </b>
              </InputLabel>
              <FormControl fullWidth size="small">
                <ReactQuill
                  readOnly
                  style={{ height: "180px" }}
                  value={roleAndResEdit.roleandresponsibilities}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                  ]}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseview}
            >
              {" "}
              Back{" "}
            </Button>
          </Grid>
        </Box>
      </Dialog>

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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
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

      {/* ALERT DIALOG */}
      <Dialog
        open={isCheckOpen}
        onClose={handleCloseCheck}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {checkvendor?.length > 0 &&
            checkcategory?.length > 0 &&
            checksubcategory?.length > 0 &&
            checktimepoints?.length > 0 ? (
              <>
                <span style={{ fontWeight: "700", color: "#777" }}>
                  {`${deleteproject.name} `}
                </span>
                was linked in{" "}
                <span style={{ fontWeight: "700" }}>
                  Vendor, Category, Subcategory & Time and points{" "}
                </span>
              </>
            ) : checkvendor?.length > 0 ||
              checkcategory?.length > 0 ||
              checksubcategory?.length > 0 ||
              checktimepoints?.length > 0 ? (
              <>
                <span style={{ fontWeight: "700", color: "#777" }}>
                  {`${deleteproject.name} `}
                </span>
                was linked in{" "}
                <span style={{ fontWeight: "700" }}>
                  {checkvendor?.length ? " Vendor" : ""}
                  {checkcategory?.length ? " Category" : ""}
                  {checksubcategory?.length ? " Subcategory" : ""}
                  {checktimepoints?.length ? " Time and points" : ""}
                </span>
              </>
            ) : (
              ""
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCheck}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delLocationgrpcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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

      {/* ALERT DELEtE SUCCESS DIALOG
            <Box>
                <Dialog
                    open={alertDeletePopup}
                    onClose={handleClosealertDeletepopup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertdeletePopup}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box> */}
    </Box>
  );
}

export default Roleandresponse;
