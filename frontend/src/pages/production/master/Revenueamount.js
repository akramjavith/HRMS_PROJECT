import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { CsvBuilder } from "filefy";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert.js";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import SendToServer from "../../sendtoserver.js";
import { BASE_URL } from "../../../services/Authservice.js";

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
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
          color: (theme) =>
            theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
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
function RevenueAmount() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [filteredRowDataFilename, setFilteredRowDataFilename] = useState([]);
  const [filteredChangesFilename, setFilteredChangesFilename] = useState(null);

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

  const [searchedStringFilename, setSearchedStringFilename] = useState("")
  const gridRefTable = useRef(null);
  const gridRefTableFilename = useRef(null);
  const [isHandleChangeFilename, setIsHandleChangeFilename] = useState(false);

  let exportColumnNames = ['Company', 'Branch', 'File Name'];
  let exportRowValues = ['company', 'branch', 'filename'];

  const gridRef = useRef(null);
  const gridRefFilename = useRef(null);
  const [updateSheet, setUpdatesheet] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [revenueAmount, setRevenueAmount] = useState([]);
  const [revenueAmountFilename, setRevenueAmountFilename] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [selectedCompany, setSelectedCompany] = useState("Please Select Company");
  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedCompanyEdit, setSelectedCompanyEdit] = useState("Please Select Company");
  const [selectedBranchEdit, setSelectedBranchEdit] = useState("Please Select Branch");
  const [selectedBranchCodeEdit, setSelectedBranchCodeEdit] = useState("");
  const [revenueAmountmanual, setRevenueAmountmanual] = useState({ processcode: "", amount: "" });
  const [loaderList, setLoaderList] = useState(false);
  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [splitArray, setSplitArray] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  //SECOND DATATABLE
  const [pageFilename, setPageFilename] = useState(1);
  const [pageSizeFilename, setPageSizeFilename] = useState(10);
  const [itemsFilename, setItemsFilename] = useState([]);
  const [selectedRowsFilename, setSelectedRowsFilename] = useState([]);
  const [searchQueryFilename, setSearchQueryFilename] = useState("");
  const [isManageColumnsOpenFilename, setManageColumnsOpenFilename] = useState(false);
  const [anchorElFilename, setAnchorElFilename] = useState(null);
  const [selectAllCheckedFilename, setSelectAllCheckedFilename] = useState(false);
  const [searchQueryManageFilename, setSearchQueryManageFilename] = useState("");

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    processcode: true,
    amount: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      codeval: data.branchcode
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

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
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        codeval: data.branchcode
      }));

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
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

  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };
  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };

  //file info model
  const [openFileInfo, setOpenFileinfo] = useState(false);
  const handleClickOpenFileinfo = () => {
    setOpenFileinfo(true);
  };
  const handleCloseFileinfo = () => {
    setOpenFileinfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    setDeletefilenamedata([]);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // View functionality start

  //Delete single model first table view delete
  const [isDeleteSingleOpenView, setIsDeleteSingleOpenView] = useState(false);
  const handleClickSingleOpenView = () => {
    setIsDeleteSingleOpenView(true);
  };
  const handleCloseSingleModView = () => {
    setIsDeleteSingleOpenView(false);
    setDeletesingledataView({});
  };

  const [filteredRowDataViewAll, setFilteredRowDataViewAll] = useState([]);
  const [filteredChangesViewAll, setFilteredChangesViewAll] = useState(null);

  const [productionfirstViewCheck, setProductionfirstViewcheck] = useState(false);
  const [fileNameView, setFileNameView] = useState("");
  //Edit model...
  const [isEditOpenView, setIsEditOpenView] = useState(false);
  const handleClickOpenEditView = () => {
    setIsEditOpenView(true);
  };
  const handleCloseModEditView = (e, reason) => {
    // if (reason && reason === "backdropClick") return;
    setIsEditOpenView(false);
  };

  const [openviewAll, setOpenviewAll] = useState(false);
  const handleClickOpenviewAll = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenviewAll(true);
  };
  const [isHandleChangeviewAll, setIsHandleChangeviewAll] = useState(false);
  const [itemsviewAll, setItemsviewAll] = useState([]);
  const [productionoriginalviewAll, setProductionoriginalViewAll] = useState([]);
  const addSerialNumberviewAll = (datas) => {
    setItemsviewAll(datas);
    // setOverallItemsViewAll(datas);
  };
  useEffect(() => {
    addSerialNumberviewAll(productionoriginalviewAll);
  }, [productionoriginalviewAll]);

  const [searchedStringviewAll, setSearchedStringviewAll] = useState("")
  const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
  const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
  const [pageviewAll, setPageviewAll] = useState(1);
  const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
  const [isFilterOpen1, setIsFilterOpen1] = useState(false);
  const [isPdfFilterOpen1, setIsPdfFilterOpen1] = useState(false);
  const [isFilterOpen3, setIsFilterOpen3] = useState(false);
  const [isPdfFilterOpen3, setIsPdfFilterOpen3] = useState(false);

  //Datatable
  const handlePageChangeviewAll = (newPage) => {
    setPageviewAll(newPage);
  };
  const handlePageSizeChangeviewAll = (event) => {
    setPageSizeviewAll(Number(event.target.value));
    setPageviewAll(1);
  };
  //datatable....
  const handleSearchChangeviewAll = (event) => {
    setSearchQueryviewAll(event.target.value);
    setPageviewAll(1);
  };

  const initialColumnVisibilityviewAll = {
    serialNumber: true,
    company: true,
    branch: true,
    processcode: true,
    amount: true,
    actions: true
  };
  const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(
    initialColumnVisibilityviewAll
  );
  // Show All Columns functionality
  const handleShowAllColumnsviewAll = () => {
    const updatedVisibility = { ...columnVisibilityviewAll };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityviewAll(updatedVisibility);
  };
  // Manage Columnsviewall
  const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] = useState(false);
  const [anchorElviewAll, setAnchorElviewAll] = useState(null);
  const handleOpenManageColumnsviewAll = (event) => {
    setAnchorElviewAll(event.currentTarget);
    setManageColumnsOpenviewAll(true);
  };
  const handleCloseManageColumnsviewAll = () => {
    setManageColumnsOpenviewAll(false);
    setSearchQueryManageviewAll("");
  };
  // page refersh reload
  const handleCloseFilterMod1 = () => {
    setIsFilterOpen1(false);
  };
  const handleClosePdfFilterMod1 = () => {
    setIsPdfFilterOpen1(false);
  };

  // page refersh reload
  const handleCloseFilterMod3 = () => {
    setIsFilterOpen3(false);
  };
  const handleClosePdfFilterMod3 = () => {
    setIsPdfFilterOpen3(false);
  };

  const openviewpopall = Boolean(anchorElviewAll);
  const idviewall = openviewpopall ? "simple-popover" : undefined;
  // datavallist:datavallist,
  const columnDataTableviewAll = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibilityviewAll.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.processcode,
      headerClassName: "bold-header",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0,
      width: 200,
      hide: !columnVisibility.amount,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityviewAll.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("erevenueamount") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleeditView(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("drevenueamount") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataSingleDeleteView(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
        </Grid>
      ),
    },

  ];
  // // Function to filter columns based on search query
  const filteredColumnsviewAll = columnDataTableviewAll.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageviewAll.toLowerCase())
  );
  // Manage Columns functionality
  const toggleColumnVisibilityviewAll = (field) => {
    setColumnVisibilityviewAll((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  //print.view.all.
  const componentRefviewall = useRef();
  const handleprintviewall = useReactToPrint({
    content: () => componentRefviewall.current,
    documentTitle: fileNameView,
    pageStyle: "print",
  });
  const exportColumnNames3 = ['Company', 'Branch', 'Process Code', 'Amount'];
  const exportRowValues3 = ['company', 'branch', 'processcode', 'amount'];

  const modifiedString = fileNameView?.replace(".csv", "");
  const gridRefviewall = useRef(null);

  const gridRefTableImgviewall = useRef(null);
  //image view all
  const handleCaptureImageviewall = () => {
    if (gridRefTableImgviewall.current) {
      domtoimage.toBlob(gridRefTableImgviewall.current)
        .then((blob) => {
          saveAs(blob, "Revenue Amount.png");
          // saveAs(blob, fileNameView);
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
  const filteredDataviewAlls = productionoriginalviewAll?.filter((item) => {
    return searchTermsviewAll.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const filteredDataviewAll = filteredDataviewAlls.slice(
    (pageviewAll - 1) * pageSizeviewAll,
    pageviewAll * pageSizeviewAll
  );
  const totalPagesviewAll = Math.ceil(
    filteredDataviewAlls.length / pageSizeviewAll
  );
  const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);
  const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
  const lastVisiblePageviewAll = Math.min(
    firstVisiblePageviewAll + visiblePagesviewAll - 1,
    totalPagesviewAll
  );
  const pageNumbersviewall = [];
  const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
  const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;
  for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
    pageNumbersviewall.push(i);
  }

  const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      processcode: item.processcode,
      amount: Number(item.amount),

    };
  });
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentviewAll = (
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
        onClick={handleCloseManageColumnsviewAll}
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
          value={searchQueryManageviewAll}
          onChange={(e) => setSearchQueryManageviewAll(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsviewAll.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityviewAll[column.field]}
                    onChange={() => toggleColumnVisibilityviewAll(column.field)}
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
              onClick={() =>
                setColumnVisibilityviewAll(initialColumnVisibilityviewAll)
              }
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
                columnDataTableviewAll.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityviewAll(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // View functionlity end

  //  multer concepts wise upload file download  start

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      // return;
    }

    const uploadFiles = async () => {
      for (const selectedFile of selectedFiles) {
        const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        const uploadNextChunk = async () => {
          if (end < selectedFile.size) {
            end = start + chunkSize;
            if (end > selectedFile.size) {
              end = selectedFile.size;
            }

            const chunk = selectedFile.slice(start, end, selectedFile.type);
            const formData = new FormData();
            formData.append("file", chunk);
            formData.append("chunkNumber", chunkNumber);
            formData.append("totalChunks", totalChunks);
            formData.append("filesize", selectedFile.size);
            formData.append("originalname", `${selectedFile.name}`);

            try {
              const response = await axios.post(SERVICE.REVENUEAMOUNTSEXCELFILEUPLOADSTORE, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully for ${selectedFile.name}`;

              start = end;
              chunkNumber++;

              uploadNextChunk();
            } catch (err) {
              handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
          } else {
            // setProgress(100);
            console.log(`File upload completed for ${selectedFile.name}`);
          }
        };

        await uploadNextChunk();
      }
      setSelectedFiles([]);
      console.log("All file uploads completed");
    };

    uploadFiles();
  };

  // download functions
  const handleDownloadReturn = async (downloadname, dupename) => {
    const encodedDownloadName = encodeURIComponent(downloadname);
    const fullURL = `${BASE_URL}/api/revenuedownloads/${encodedDownloadName}`;

    fetch(fullURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Handle the blob (e.g., create a download link)
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = downloadname;
        downloadLink.click();
      })
      .catch((error) => console.error("Error:", error));
  };

  const [revenueAmountArray, setRevenueAmountArray] = useState([])
  const [revenueAmountFilenameArray, setRevenueAmountFilenameArray] = useState([])

  const fetchRevenuesDataArray = async () => {

    setPageName(!pageName)
    try {
      let Res = await axios.post(SERVICE.REVENUEAMOUNTSASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRevenueAmountArray(Res?.data?.revenueamounts);
      let getFilenames = Res?.data?.revenueamounts.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setRevenueAmountFilename(uniqueArray?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      })));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [revenueAmountEditArray, setRevenueAmountEditArray] = useState([])
  const [editsingleData, setEditsingleData] = useState({ processcode: "", amount: "" });

  const fetchRevenuesDataArrayEdit = async () => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.REVENUEAMOUNTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRevenueAmountEditArray(Res?.data?.revenueamounts.filter((item) => item._id !== editsingleData._id));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchRevenuesDataArrayEdit()
  }, [editsingleData])

  const [overallFilterdataAll, setOverallFilterdataAll] = useState([]);
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // const fetchEmployee = async () => {

  //   setPageName(!pageName)
  //   setLoaderList(true)
  //   try {
  //     let res_employee = await axios.post(SERVICE.REVENUEAMOUNT_SORT, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       page: Number(page),
  //       pageSize: Number(pageSize),
  //       assignbranch: accessbranch
  //     });
  //     const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
  //     const anstotalProjectsAllData = res_employee?.data?.totalProjectsAllData?.length > 0 ? res_employee?.data?.totalProjectsAllData : []
  //     const itemsWithSerialNumberTarget = anstotalProjectsAllData?.map((item, index) => ({
  //       ...item,
  //       serialNumber: (page - 1) * pageSize + index + 1,
  //     }));

  //     setRevenueAmount(itemsWithSerialNumberTarget);


  //     let getFilenames = itemsWithSerialNumberTarget.filter((item) => item.filename !== "nonexcel");
  //     const uniqueArray = Array.from(
  //       new Set(getFilenames.map((obj) => ({ comp: obj.company, bran: obj.branch, filena: obj.filename })))
  //     ).map((key) => {
  //       return getFilenames.find((obj) => obj.company === key.comp && obj.branch === key.bran && obj.filename === key.filena);
  //     });

  //     const uniqueArrayFilt = Array.from(new Set(uniqueArray));
  //     setRevenueAmountFilename(uniqueArrayFilt?.map((item, index) => ({
  //       ...item,
  //       serialNumber: index + 1,
  //     })));
  //     setOverallFilterdataAll(itemsWithSerialNumberTarget);

  //     setLoaderList(false)
  //   } catch (err) {
  //     setLoaderList(false)
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };

  // useEffect(() => {
  //   fetchEmployee();
  // }, [page, pageSize]);

  const fetchEmployee = async () => {
    setLoaderList(true);
    try {
      const response = await axios.post(SERVICE.REVENUEAMOUNTFILE, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        assignbranch: accessbranch,
      });

      const resultData = response?.data?.result || [];

      // Serial Numbers Update
      const itemsWithSerialNumber = resultData.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setRevenueAmount(itemsWithSerialNumber);

      // Unique File Processing moved to Set instead of Map for slightly faster performance
      const seen = new Set();
      const uniqueList = [];

      for (const item of itemsWithSerialNumber) {
        if (item.filename !== "nonexcel") {
          const key = `${item.company}-${item.branch}-${item.filename}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueList.push(item);
          }
        }
      }

      setRevenueAmountFilename(uniqueList.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      })));

      setLoaderList(false);
    } catch (err) {
      setLoaderList(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);



  useEffect(() => {
    fetchRevenuesDataArray()
  }, [isFilterOpen, isFilterOpen2])

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Revenue Amount"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    getapi();
  }, []);


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = revenueAmount?.some((item) => item.company === selectedCompany && item.branch === selectedBranch && item.processcode?.toLowerCase() === revenueAmountmanual.processcode?.toLowerCase() && item.amount?.toLowerCase() === revenueAmountmanual.amount?.toLowerCase());
    if (selectedCompany === "Please Select Company" || selectedBranch === "Please Select Branch") {
      let alertMsg = selectedCompany === "Please Select Company" && selectedBranch === "Please Select Branch" ? "Please Select Company & Branch" : selectedCompany === "Please Select Company" ? "Please Select Company" : "Please Select Branch";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (revenueAmountmanual.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (revenueAmountmanual.amount === "") {
      setPopupContentMalert("Please Enter Amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const [isBtn, setIsBtn] = useState(false)
  //add function...
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.REVENUEAMOUNT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        processcode: String(revenueAmountmanual.processcode),
        amount: String(revenueAmountmanual.amount),
        branch: String(selectedBranch),
        company: String(selectedCompany),
        filename: "nonexcel",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchRevenuesDataArray();
      await fetchEmployee();
      setRevenueAmountmanual({ ...revenueAmountmanual, processcode: "", amount: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
    setSelectedCompany("Please Select Company");
    setSelectedBranch("Please Select Branch");
    setRevenueAmountmanual({ ...revenueAmountmanual, processcode: "", amount: "" });
    setPageSizeFilename(10)
    setPageSize(10)
    setSearchQuery("");
    setSearchQueryFilename("");
    fetchEmployee();
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //delete singledata functionality
  const [deletesingleData, setDeletesingledata] = useState();
  const [deletesingleDataView, setDeletesingledataView] = useState();
  const rowDataSingleDeleteView = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.REVENUEAMOUNT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletesingledataView(Res?.data?.srevenueamount);
      handleClickSingleOpenView();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const deleteSingleListView = async () => {
    let deleteSingleid = deletesingleDataView?._id;
    setPageName(!pageName)
    try {
      const deletePromises = await axios.delete(`${SERVICE.REVENUEAMOUNT_SINGLE}/${deleteSingleid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPage(1);
      await getviewCodeall(deletesingleDataView.filename)
      handleCloseModEditView();
      setFilteredRowDataViewAll([])
      setFilteredChangesViewAll(null)
      await fetchRevenuesDataArray();
      await fetchEmployee();

      handleCloseSingleModView();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //edit get data functionality single list
  const [viewsingleData, setviewsingleData] = useState({ processcode: "", amount: "" });

  const rowdatasingleeditView = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.REVENUEAMOUNT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEditsingleData(Res?.data?.srevenueamount);
      setSelectedCompanyEdit(Res?.data?.srevenueamount?.company);
      setSelectedBranchEdit(Res?.data?.srevenueamount?.branch);
      handleClickOpenEditView();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const gridRefTableImg = useRef(null);

  //print...
  const componentRef = useRef();

  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(overallFilterdata);
  }, [overallFilterdata]);


  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  let updateby = editsingleData.updatedby;
  let addedby = editsingleData.addedby;

  const [infosingleFileData, setinfosingleFileData] = useState([])

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.REVENUEAMOUNT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setinfosingleFileData(Res?.data?.srevenueamount);
      handleClickOpenFileinfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmitView = (e) => {
    e.preventDefault();

    const isNameMatch = revenueAmountEditArray?.some((item) => item.company === selectedCompanyEdit && item.branch === selectedBranchEdit && item.processcode?.toLowerCase() === editsingleData.processcode?.toLowerCase() && item.amount?.toLowerCase() === editsingleData.amount?.toLowerCase());
    if (selectedCompanyEdit === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchEdit === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.amount === "") {
      setPopupContentMalert("Please Enter Amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequestView();
    }
  };

  const sendEditRequestView = async () => {
    let editid = editsingleData._id;
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.REVENUEAMOUNT_SINGLE}/${editid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompanyEdit),
        branch: String(selectedBranchEdit),
        processcode: String(editsingleData.processcode),
        amount: String(editsingleData.amount),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await getviewCodeall(editsingleData.filename);
      await fetchRevenuesDataArray();
      await fetchEmployee();
      setRevenueAmountmanual({ ...revenueAmountmanual, processcode: "", amount: "" });
      handleCloseModEditView();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      processcode: item.processcode,
      amount: Number(item.amount),
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


  //SECOND TABLE FDATA AND FUNCTIONS

  const handleCloseviewAll = () => {
    setOpenviewAll(false);
    setProductionoriginalViewAll([]);
    setSearchQueryviewAll("");
    setPageviewAll(1);
    setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
  };
  const [filenameDataArray3, setFilenameDataArray3] = useState([])

  // get single row to view....
  const getviewCodeall = async (filename) => {
    setPageName(!pageName)
    try {
      setProductionfirstViewcheck(false);
      let res = await axios.get(SERVICE.REVENUEAMOUNTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = res?.data?.revenueamounts.filter((item) => item.filename === filename)
      // .map((item) => item._id);
      setProductionoriginalViewAll(getFilenames?.map(
        (item, index) => ({
          ...item,
          id: item._id,
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          processcode: item.processcode,
          amount: Number(item.amount),

        })
      ));
      setFilenameDataArray3(getFilenames.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          company: item.company,
          branch: item.branch,
          processcode: item.processcode,
          amount: Number(item.amount),

        };
      }))
      setFileNameView(filename);
      handleClickOpenviewAll();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
      setProductionfirstViewcheck(true);
      setPageviewAll(1);
      setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    }
  };

  const [deleteFilenameData, setDeletefilenamedata] = useState([]);
  const rowDatafileNameDelete = async (filename) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.REVENUEAMOUNTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.revenueamounts.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletefilenamedata(getFilenames);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const deleteFilenameList = async () => {
    setLoader(true)

    setPageName(!pageName)
    try {
      const deletePromises = await axios.post(
        SERVICE.REVENUEAMOUNT_BULK,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: deleteFilenameData,
        }

      );
      if (deletePromises?.data?.success) {
        // await Promise.all(deletePromises);
        handleCloseMod();
        await fetchRevenuesDataArray();
        await fetchEmployee();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setLoader(false)

      }
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [loader, setLoader] = useState(false);


  // Manage Columns
  const handleOpenManageColumnsFilename = (event) => {
    setAnchorElFilename(event.currentTarget);
    setManageColumnsOpenFilename(true);
  };
  const handleCloseManageColumnsFilename = () => {
    setManageColumnsOpen(false);
    setSearchQueryManageFilename("");
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityFilename = {
    serialNumber: true,
    checkbox: true,
    branch: true,
    company: true,
    filename: true,
    // lastupload: true,
    actions: true,
  };
  const [columnVisibilityFilename, setColumnVisibilityFilename] = useState(initialColumnVisibilityFilename);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityFilename");
    if (savedVisibility) {
      setColumnVisibilityFilename(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityFilename", JSON.stringify(columnVisibilityFilename));
  }, [columnVisibilityFilename]);

  const handleSelectionChangeFilename = (newSelection) => {
    setSelectedRowsFilename(newSelection.selectionModel);
  };

  const gridRefTableImgFilename = useRef(null);

  //image

  const handleCaptureImageFilename = () => {
    if (gridRefTableImgFilename.current) {
      domtoimage.toBlob(gridRefTableImgFilename.current)
        .then((blob) => {
          saveAs(blob, "Upload File List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //print...
  const componentRefFilename = useRef();
  const handleprintFilename = useReactToPrint({
    content: () => componentRefFilename.current,
    documentTitle: "Revenue Amount File Name",
    pageStyle: "print",
  });

  //serial no for listing itemsFilename
  const addSerialNumberFilename = (datas) => {
    setItemsFilename(datas);
  };
  useEffect(() => {
    addSerialNumberFilename(revenueAmountFilename);
  }, [revenueAmountFilename]);

  //Datatable
  const handlePageChangeFilename = (newPage) => {
    setPageFilename(newPage);
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
  };
  const handlePageSizeChangeFilename = (event) => {
    setPageSizeFilename(Number(event.target.value));
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
    setPageFilename(1);
  };
  //datatable....
  const handleSearchChangeFilename = (event) => {
    setSearchQueryFilename(event.target.value);
    setPageFilename(1);
  };

  // Split the search query into individual terms
  const searchTermsFilename = searchQueryFilename.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasFilename = itemsFilename?.filter((item) => {
    return searchTermsFilename.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const FilenameFilename = filteredDatasFilename?.slice((pageFilename - 1) * pageSizeFilename, pageFilename * pageSizeFilename);
  const totalPagesFilename = Math.ceil(filteredDatasFilename?.length / pageSizeFilename);
  const visiblePagesFilename = Math.min(totalPagesFilename, 3);
  const firstVisiblePageFilename = Math.max(1, pageFilename - 1);
  const lastVisiblePageFilename = Math.min(firstVisiblePageFilename + visiblePagesFilename - 1, totalPagesFilename);

  const pageNumbersFilename = [];
  for (let i = firstVisiblePageFilename; i <= lastVisiblePageFilename; i++) {
    pageNumbersFilename.push(i);
  }

  const CheckboxHeaderFilename = ({ selectAllCheckedFilename, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllCheckedFilename} onChange={onSelectAll} />
    </div>
  );
  const columnDataTableFilename = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityFilename.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.company,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.branch,
      headerClassName: "bold-header",
      pinned: 'left', lockPinned: true,
    },
    {
      field: "filename",
      headerName: "File Name",
      flex: 0,
      width: 350,
      hide: !columnVisibilityFilename.filename,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityFilename.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("drevenueamount") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDatafileNameDelete(params.data.filename);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />            </Button>
          )}
          {isUserRoleCompare?.includes("vrevenueamount") && (
            <Button
              // disabled
              sx={{ minWidth: "40px" }}
              onClick={(e) => {
                handleDownloadReturn(params.data.filename);
              }}
            >
              <DownloadOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vrevenueamount") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeall(params.data.filename);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("irevenueamount") && (
            <Button
              onClick={() => {

                getinfoCode(params.data._id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />            </Button>
          )}

        </Grid>
      ),
    },
  ];

  const rowDataTableFilename = FilenameFilename.map((item, index) => {
    return {
      // id: item.serialNumber,
      id: item.serialNumber,
      _id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      filename: item.filename,
    };
  });

  const rowsWithCheckboxesFilename = rowDataTableFilename.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsFilename.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumnsFilename = () => {
    const updatedVisibility = { ...columnVisibilityFilename };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityFilename(updatedVisibility);
  };
  // Function to filter columns based on search query
  const filteredColumnsFilename = columnDataTableFilename.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFilename.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibilityFilename = (field) => {
    setColumnVisibilityFilename((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentFilename = (
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
        onClick={handleCloseManageColumnsFilename}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFilename} onChange={(e) => setSearchQueryManageFilename(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFilename.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFilename[column.field]} onChange={() => toggleColumnVisibilityFilename(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFilename(initialColumnVisibilityFilename)}>
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
                columnDataTableFilename.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityFilename(newColumnVisibility);
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

  // page refersh reload
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

  const readExcel = (file) => {
    if (file === null) return false;

    if (selectedCompany === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // Convert the sheet to JSON
          const data = XLSX.utils.sheet_to_json(ws);

          // Check if the required columns are present
          if (data.length === 0 || !data[0].hasOwnProperty("ProcessCode") || !data[0].hasOwnProperty("Amount")) {
            setPopupContentMalert("The uploaded file must contain 'ProcessCode' and 'Amount' columns.");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          } else {
            resolve(data);
          }
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      setSelectedFiles((existingFiles) => [...existingFiles, file]);

      promise
        .then((d) => {
          // Check for missing ProcessCode or Amount in any row
          for (const item of d) {
            if (!item.ProcessCode || !item.Amount) {
              setPopupContentMalert("Each row must contain 'ProcessCode' and 'Amount'.");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          }

          // Filter out rows with "Sample Value" or any other placeholder values you want to remove
          const filteredData = d.filter((item) => {
            // Remove rows where the 'Sample Value' column or similar is present
            return !(item["Sample Value"] && item["Sample Value"] === "Sample Data");
          });

          // Filter out duplicates within the newly read data
          const uniqueData = [];
          const uniqueKeys = new Set();

          filteredData.forEach((item) => {
            const key = `${item.ProcessCode}_${item.Amount}`;
            if (!uniqueKeys.has(key)) {
              uniqueKeys.add(key);
              uniqueData.push(item);
            }
          });

          let uniqueArray = uniqueData.filter(
            (item) =>
              !revenueAmountArray.some(
                (tp) =>
                  tp.company === selectedCompany &&
                  tp.branch === selectedBranch &&
                  tp.processcode == item.ProcessCode &&
                  tp.amount == item.Amount
              )
          );

          const dataArray = uniqueArray.map((item) => ({
            processcode: item.ProcessCode,
            amount: item.Amount,
            filename: file.name,
            branch: selectedBranch,
            company: selectedCompany,
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }));

          setUpdatesheet([]);

          const subarraySize = 1000;
          const splitedArray = [];

          for (let i = 0; i < dataArray.length; i += subarraySize) {
            const subarray = dataArray.slice(i, i + subarraySize);
            splitedArray.push(subarray);
          }
          setSplitArray(splitedArray);

          if (uniqueArray.length !== d.length) {
            const duplicateCount = d.length - uniqueArray.length;
            setPopupContentMalert(`${duplicateCount} Duplicate data and/or Points field Not a number data's removed`);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        })
        .catch((err) => {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        });
    }
  };

  const getSheetExcel = () => {
    if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === "")) {
      setPopupContentMalert("Please Upload a file");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      }));

      setSheets(getsheets);
    }
  };

  const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata?.filter((item) => !revenueAmountArray.some((tp) => tp.company === selectedCompany && tp.branch === selectedBranch && tp.processcode == item.processcode && tp.amount == item.amount));
    // Ensure that items is an array of objects before sending
    if (selectedSheet === "Please Select Sheet") {
      setPopupContentMalert(fileUploadName === "" ? "Please Upload File" : selectedSheet === "Please Select Sheet" ? "Please Select Sheet" : "No data to upload");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCompany === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        }
      };

      setPageName(!pageName)
      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.REVENUEAMOUNT_CREATE);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(uniqueArray));
        await fetchRevenuesDataArray();
        await fetchEmployee();

      } catch (err) {
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectedSheet("Please Select Sheet");
        setSelectedSheetindex(-1)
        setUpdatesheet(prev => [...prev, selectedSheetindex])
        await handleFileUpload();
        await fetchRevenuesDataArray();
        await fetchEmployee();

      }
    }
  };

  const clearFileSelection = () => {
    setUpdatesheet([])
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;

  const ExportsHead = () => {
    let fileDownloadName = "Filename_" + selectedBranchCode + "_" + today;
    if (selectedCompany === "Please Select Company" || selectedBranch === "Please Select Branch") {
      let alertMsg = selectedCompany === "Please Select Company" && selectedBranch === "Please Select Branch" ? "Please Select Company & Branch" : selectedCompany === "Please Select Company" ? "Please Select Company" : "Please Select Branch";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const sampleData = [
        ["PADE01", "40", "Sample Data"],
      ];
      new CsvBuilder(fileDownloadName)
        .setColumns(["ProcessCode", "Amount", "Sample Value"])
        .addRows(sampleData)
        .exportFile();
    }
  };

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"REVENUE AMOUNT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Revenue Amount"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Revenue Amount"
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("arevenueamount") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Revenue Amount</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{ label: selectedCompany, value: selectedCompany }}
                      onChange={(e) => {
                        setSelectedCompany(e.value);
                        setSelectedBranch("Please Select Branch");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accessbranch?.filter(
                        (comp) =>
                          selectedCompany === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                        codeval: data.codeval
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Branch"
                      value={{ label: selectedBranch, value: selectedBranch }}
                      onChange={(e) => {
                        setSelectedBranch(e.value);
                        setSelectedBranchCode(e.codeval);
                        //----
                        setSplitArray([]);
                        // readExcel(null);
                        setDataupdated("");
                        setSheets([]);
                        setSelectedSheet("Please Select Sheet");

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    &nbsp;
                  </Typography>

                  <Button variant="contained" color="success" disabled={revenueAmountmanual.processcode !== "" || revenueAmountmanual.amount != ""} sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()}>
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6} marginTop={3}>
                  <Grid container spacing={2}>
                    <Grid item md={4}>
                      <Button variant="contained" disabled={revenueAmountmanual.processcode !== "" || revenueAmountmanual.amount != ""} component="label" sx={{ textTransform: "capitalize" }}>
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated("uploaded");
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null;
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={7}>
                      {fileUploadName != "" && splitArray.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <p>{fileUploadName}</p>
                          <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter(d => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} xs={12} sm={6} marginTop={3}>
                  <Grid container>
                    <Grid item md={7} xs={12} sm={8}>
                      <Button variant="contained" color="primary" disabled={revenueAmountmanual.processcode !== "" || revenueAmountmanual.amount != ""} onClick={getSheetExcel} sx={{ textTransform: "capitalize" }}>
                        Get Sheet
                      </Button>
                    </Grid>
                    <Grid item md={5} xs={12} sm={4}>
                      <Typography>(Or)</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={5} xs={12} sm={6}>
                      <Typography sx={{ marginTop: "3px" }}>
                        Process Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                    </Grid>
                    <Grid item md={7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Process Code"
                          disabled={fileUploadName != "" && splitArray.length > 0}
                          value={revenueAmountmanual.processcode}
                          onChange={(e) => {
                            setRevenueAmountmanual({
                              ...revenueAmountmanual,
                              processcode: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12} sm={6}></Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={5} xs={12} sm={6}>
                      <Typography sx={{ marginTop: "3px" }}>
                        Amount<b style={{ color: "red" }}>*</b>
                      </Typography>
                    </Grid>
                    <Grid item md={7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Amount"
                          disabled={fileUploadName != "" && splitArray.length > 0}
                          value={revenueAmountmanual.amount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              setRevenueAmountmanual({
                                ...revenueAmountmanual,
                                amount: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    {!loading ? (
                      fileUploadName != "" && splitArray.length > 0 ? (
                        <>
                          <div readExcel={readExcel}>
                            <SendToServer sendJSON={sendJSON} />
                          </div>
                        </>
                      ) : (
                        <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                          Submit
                        </Button>
                      )
                    ) : (
                      <LoadingButton
                        // onClick={handleClick}
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                      >
                        <span>Send</span>
                      </LoadingButton>
                    )}

                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />
      {/* ****** Table Start ****** */}
      {loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (<>

        {isUserRoleCompare?.includes("lrevenueamount") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Upload File List</Typography>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>&nbsp;</Typography>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSizeFilename}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 180,
                            width: 80,
                          },
                        },
                      }}
                      onChange={handlePageSizeChangeFilename}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={revenueAmountFilename?.length}>All</MenuItem>
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
                    {isUserRoleCompare?.includes("excelrevenueamount") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvrevenueamount") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printrevenueamount") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfrevenueamount") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagerevenueamount") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={6} sm={6}>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTableFilename}
                    setItems={setItemsFilename}
                    addSerialNumber={addSerialNumberFilename}
                    setPage={setPageFilename}
                    maindatas={revenueAmountFilename}
                    setSearchedString={setSearchedStringFilename}
                    searchQuery={searchQueryFilename}
                    setSearchQuery={setSearchQueryFilename}
                    paginated={false}
                    totalDatas={revenueAmountFilename}
                  />
                </Grid>
              </Grid>
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFilename}>
                Show All Columns
              </Button>
              &ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFilename}>
                Manage Columns
              </Button>
              <Popover
                id={id}
                open={isManageColumnsOpenFilename}
                anchorElFilename={anchorElFilename}
                onClose={handleCloseManageColumnsFilename}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                {manageColumnsContentFilename}
              </Popover>
              &ensp;
              <br />
              {loaderList ? (
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
                    rowDataTable={rowDataTableFilename}
                    columnDataTable={columnDataTableFilename}
                    columnVisibility={columnVisibilityFilename}
                    page={pageFilename}
                    setPage={setPageFilename}
                    pageSize={pageSizeFilename}
                    totalPages={totalPagesFilename}
                    setColumnVisibility={setColumnVisibilityFilename}
                    isHandleChange={isHandleChangeFilename}
                    items={itemsFilename}
                    selectedRows={selectedRowsFilename}
                    setSelectedRows={setSelectedRowsFilename}
                    gridRefTable={gridRefTableFilename}
                    paginated={false}
                    filteredDatas={filteredDatasFilename}
                    searchQuery={searchQueryFilename}
                    handleShowAllColumns={handleShowAllColumnsFilename}
                    setFilteredRowData={setFilteredRowDataFilename}
                    filteredRowData={filteredRowDataFilename}
                    setFilteredChanges={setFilteredChangesFilename}
                    filteredChanges={filteredChangesFilename}
                    gridRefTableImg={gridRefTableImgFilename}
                    itemsList={revenueAmountFilename}
                  />
                </>
              )}
              {/* ****** Table End ****** */}
            </Box>
          </>
        )}</>)}
      {/* ****** Table End ****** */}

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
        <DialogContent>
          <Box sx={{ padding: "20px 30px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={6}>
                <Typography sx={userStyle.HeaderText}>View Revenue Amount</Typography>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Company</Typography>
                  <Typography>{viewsingleData.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <Typography>{viewsingleData.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Process Code</Typography>
                  <Typography>{viewsingleData.processcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Amount</Typography>
                  <Typography>{viewsingleData.amount}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button onClick={handleCloseview} sx={{ ...buttonStyles.btncancel, marginLeft: "15px" }}>
                Back
              </Button>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpenView}
        onClose={handleCloseModEditView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={6}>
              <Typography sx={userStyle.HeaderText}>Edit Revenue Amount</Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={250}
                  options={accessbranch?.map(data => ({
                    label: data.company,
                    value: data.company,
                  })).filter((item, index, self) => {
                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                  })}
                  placeholder="Please Select Company"
                  value={{ label: selectedCompanyEdit, value: selectedCompanyEdit }}
                  onChange={(e) => {
                    setSelectedCompanyEdit(e.value);
                    setSelectedBranchEdit("Please Select Branch");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={250}
                  options={accessbranch?.filter(
                    (comp) =>
                      selectedCompanyEdit === comp.company
                  )?.map(data => ({
                    label: data.branch,
                    value: data.branch,
                  })).filter((item, index, self) => {
                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                  })}
                  placeholder="Please Select Branch"
                  value={{ label: selectedBranchEdit, value: selectedBranchEdit }}
                  onChange={(e) => {
                    setSelectedBranchEdit(e.value);
                    setSelectedBranchCodeEdit(e.codeval);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Process Code<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  placeholder="Please Enter Process Code"
                  value={editsingleData.processcode}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      processcode: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Amount<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  placeholder="Please Enter Amount"
                  value={editsingleData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setEditsingleData({
                        ...editsingleData,
                        amount: e.target.value,
                      });
                    }
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>{" "}
          <br /> <br />
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Grid item md={6} xs={12} sm={12}>
              <Button sx={buttonStyles.buttonsubmit} onClick={editSubmitView}>
                {" "}
                Update
              </Button>
            </Grid>
            <br />
            <Grid item md={6} xs={12} sm={12}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditView}>
                {" "}
                Cancel{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
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
      <br />
      <Dialog
        open={openviewAll}
        onClose={handleClickOpenviewAll}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{ marginTop: '50px' }}
      >
        <DialogContent sx={{ marginTop: '70px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>{fileNameView}</Typography>
            {/* <br /> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeviewAll}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeviewAll}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={productionoriginalviewAll?.length}>
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
                  {isUserRoleCompare?.includes("excelrevenueamount") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen3(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvrevenueamount") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen3(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printrevenueamount") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleprintviewall}
                      >
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfrevenueamount") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen3(true)
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagerevenueamount") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImageviewall}
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
                  columnDataTable={columnDataTableviewAll}
                  setItems={setItemsviewAll}
                  addSerialNumber={addSerialNumberviewAll}
                  setPage={setPageviewAll}
                  maindatas={productionoriginalviewAll}
                  setSearchedString={setSearchedStringviewAll}
                  searchQuery={searchQueryviewAll}
                  setSearchQuery={setSearchQueryviewAll}
                  paginated={false}
                  totalDatas={productionoriginalviewAll}
                />

              </Grid>
            </Grid>
            <Button
              sx={userStyle.buttongrp}
              onClick={handleShowAllColumnsviewAll}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button
              sx={userStyle.buttongrp}
              onClick={handleOpenManageColumnsviewAll}
            >
              Manage Columns
            </Button>
            <br />
            <br></br>
            {/* Manage Column */}
            <Popover
              id={idviewall}
              open={isManageColumnsOpenviewAll}
              anchorEl={anchorElviewAll}
              onClose={handleCloseManageColumnsviewAll}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentviewAll}
            </Popover>
            {/* <br /> */}
            {!productionfirstViewCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <AggridTable
                  rowDataTable={rowDataTableviewAll}
                  columnDataTable={columnDataTableviewAll}
                  columnVisibility={columnVisibilityviewAll}
                  page={pageviewAll}
                  setPage={setPageviewAll}
                  pageSize={pageSizeviewAll}
                  totalPages={totalPagesviewAll}
                  setColumnVisibility={setColumnVisibilityviewAll}
                  isHandleChange={isHandleChangeviewAll}
                  items={itemsviewAll}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefviewall}
                  paginated={false}
                  filteredDatas={filteredDataviewAlls}
                  handleShowAllColumns={handleShowAllColumnsviewAll}

                  setFilteredRowData={setFilteredRowDataViewAll}
                  filteredRowData={filteredRowDataViewAll}
                  setFilteredChanges={setFilteredChangesViewAll}
                  filteredChanges={filteredChangesViewAll}
                  gridRefTableImg={gridRefTableImgviewall}
                  itemsList={productionoriginalviewAll}
                />

              </>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseviewAll}
            sx={buttonStyles.btncancel}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
      <br />

      {/* First table Details */}
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
        filteredDataTwo={(filteredChangesFilename !== null ? filteredRowDataFilename : rowDataTableFilename) ?? []}
        itemsTwo={revenueAmountFilename ?? []}
        filename={"Upload File List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefFilename}
      />
      {/* View functionality code */}
      <ExportData
        isFilterOpen={isFilterOpen3}
        handleCloseFilterMod={handleCloseFilterMod3}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen3}
        isPdfFilterOpen={isPdfFilterOpen3}
        setIsPdfFilterOpen={setIsPdfFilterOpen3}
        handleClosePdfFilterMod={handleClosePdfFilterMod3}
        // filteredDataTwo={rowDataTableviewAll ?? []}
        filteredDataTwo={(filteredChangesViewAll !== null ? filteredRowDataViewAll : rowDataTableviewAll) ?? []}
        itemsTwo={filenameDataArray3 ?? []}
        filename={modifiedString}
        exportColumnNames={exportColumnNames3}
        exportRowValues={exportRowValues3}
        componentRef={componentRefviewall}
      />
      <DeleteConfirmation
        open={isDeleteSingleOpenView}
        onClose={handleCloseSingleModView}
        onConfirm={deleteSingleListView}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openFileInfo}
        handleCloseinfo={handleCloseFileinfo}
        heading="Upload File Info"
        addedby={infosingleFileData.addedby}
        updateby={infosingleFileData.updatedby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteFilenameList}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      {/* <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteFilenameList}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}

      <br />

    </Box>
  );
}

export default RevenueAmount;