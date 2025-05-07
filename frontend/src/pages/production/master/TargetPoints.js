import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { CsvBuilder } from "filefy";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert.js";
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
function TargetPoints() {

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

  let exportColumnNames = ['Company', 'Branch', 'Filename'];
  let exportRowValues = ['company', 'branch', 'filename'];

  const gridRef = useRef(null);
  const gridRefFilename = useRef(null);
  const gridRefTableFilename = useRef(null);
  const [updateSheet, setUpdatesheet] = useState([])

  const [selectedRows, setSelectedRows] = useState([]);
  const [targetPoints, setTargetPoints] = useState([]);
  const [targetPointsFilename, setTargetPointsFilename] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

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

  const [searchedString, setSearchedString] = useState("")
  const [searchedStringFilename, setSearchedStringFilename] = useState("")
  const gridRefTable = useRef(null);
  const [isHandleChangeFilename, setIsHandleChangeFilename] = useState(false);
  const [isHandleChange, setIsHandleChange] = useState(false);

  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [loaderList, setLoaderList] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("Please Select Company");
  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [targetpointsmanual, setTargetpointsmanual] = useState({ experience: "", processcode: "", code: "", points: "" });

  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");
  const [loading, setLoading] = useState(false);

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
    experience: true,
    processcode: true,
    code: true,
    points: true,
    pointstable: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const username = isUserRoleAccess.username;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    // fetchTargetPointsData();
  };
  const handleCloseerrUpdate = () => {
    setIsErrorOpen(false);
    fetchEmployee();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [openInfoFile, setOpeninfoFile] = useState(false);
  const handleClickOpeninfoFile = () => {
    setOpeninfoFile(true);
  };
  const handleCloseinfoFile = () => {
    setOpeninfoFile(false);
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

  // View Functionlity 

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
    experience: true,
    processcode: true,
    code: true,
    points: true,
    pointstable: true,
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
  const handleCloseFilterMod3 = () => {
    setIsFilterOpen3(false);
  };
  const handleClosePdfFilterMod3 = () => {
    setIsPdfFilterOpen3(false);
  };

  //  multer concepts wise upload file download 

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log("Please select one or more files to upload.");
      // return;
    }
    // let getuniqudid = productionoriginalid ? productionoriginalid + 1 : 1;

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
              const response = await axios.post(SERVICE.TARGETPOINTEXCELFILEUPLOADSTORE, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully for ${selectedFile.name}`;

              start = end;
              chunkNumber++;

              uploadNextChunk();
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
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
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "experience",
      headerName: "Experince in Months",
      flex: 0,
      width: 180,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.processcode,
      headerClassName: "bold-header",
    },
    {
      field: "code",
      headerName: "Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.code,
      headerClassName: "bold-header",
    },
    {
      field: "pointstable",
      headerName: "Points",
      flex: 0,
      width: 150,
      hide: !columnVisibility.pointstable,
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
          {isUserRoleCompare?.includes("etargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowdatasingleeditView(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtargetpoints") && (
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
  const exportColumnNames3 = [
    'Company', 'Branch', 'Experience in Months', 'Process Code', 'Code', 'Points'
  ]
  const exportRowValues3 = [
    'company', 'branch', 'experience', 'processcode', 'code', 'points'
  ]
  const modifiedString = fileNameView?.replace(".csv", "");
  const gridRefviewall = useRef(null);

  const gridRefTableImgviewall = useRef(null);
  // image
  const handleCaptureImageviewall = () => {
    if (gridRefTableImgviewall.current) {
      domtoimage.toBlob(gridRefTableImgviewall.current)
        .then((blob) => {
          saveAs(blob, "Target Points.png");
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
      experience: item.experience,
      company: item.company,
      branch: item.branch,
      processcode: item.processcode,
      code: item.code,
      points: item.points,
      pointstable: Number(item.points),

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

  const handleInputChangePoints = (e) => {
    // Check if the entered value is a number
    const regex = /^[0-9.]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setTargetpointsmanual({
        ...targetpointsmanual,
        points: e.target.value,
      });
    } else {
      setPopupContentMalert("Please Enter Numeric Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };
  const handleInputChangePointsEdit = (e) => {
    // Check if the entered value is a number
    const regex = /^[0-9.]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setEditsingleData({
        ...editsingleData,
        points: e.target.value,
      });
    } else {
      setPopupContentMalert("Please Enter Numeric Value");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [overallFilterdataAll, setOverallFilterdataAll] = useState([]);
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  const fetchEmployee = async () => {
    setPageName(!pageName);
    setLoaderList(true);

    try {
      console.time("fetchTime");

      let res_employee = await axios.post(SERVICE.TARGETPOINTFILE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      const anstarget = res_employee?.data?.targetpoints || [];
      const itemsWithSerialNumberTarget = anstarget.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));

      setTargetPoints(itemsWithSerialNumberTarget);

      const getFilenames = itemsWithSerialNumberTarget.filter(item => item.filename !== "nonexcel");
      const uniqueArray = getFilenames.reduce((acc, obj) => {
        const key = `${obj.company}_${obj.branch}_${obj.filename}`;
        if (!acc.map.has(key)) {
          acc.map.set(key, obj);
          acc.arr.push(obj);
        }
        return acc;
      }, { map: new Map(), arr: [] }).arr;

      setTargetPointsFilename(uniqueArray.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      })));

      console.timeEnd("fetchTime");
      setOverallFilterdataAll(itemsWithSerialNumberTarget);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    } finally {
      setLoaderList(false);
    }
  };


  useEffect(() => {
    fetchEmployee();
  }, []);




  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Target Points"),
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
    getapi()
  }, [])

  const [targetPointsArray, setTargetPointsArray] = useState([])
  const [targetPointsFilenameArray, setTargetPointsFilenameArray] = useState([])

  const fetchTargetPointsDataArray = async () => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.TARGETPOINTS

        , {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      setTargetPointsArray(Res?.data?.targetpoints);
      let getFilenames = Res?.data?.targetpoints.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setTargetPointsFilenameArray(uniqueArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchTargetPointsDataArray()
  }, [isFilterOpen])

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = targetPoints.some((item) => item.company?.toLowerCase() === selectedCompany?.toLowerCase() &&

      item.branch?.toLowerCase() === selectedBranch?.toLowerCase() &&
      item.experience?.toLowerCase() === targetpointsmanual.experience?.toLowerCase() &&
      item.processcode?.toLowerCase() === targetpointsmanual.processcode?.toLowerCase() &&
      item.code?.toLowerCase() === targetpointsmanual.code?.toLowerCase() &&
      item.points?.toLowerCase() === targetpointsmanual.points?.toLowerCase()
    )
    if (selectedCompany === "Please Select Company" || selectedBranch === "Please Select Branch") {
      let alertMsg = selectedCompany === "Please Select Company" && selectedBranch === "Please Select Branch" ? "Please Select Company & Branch" : selectedCompany === "Please Select Company" ? "Please Select Company" : "Please Select Branch";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.experience === "") {
      setPopupContentMalert("Please Enter Experience");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (targetpointsmanual.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (targetpointsmanual.points === "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const [isBtn, setIsBtn] = useState(false)

  //add function...
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.TARGETPOINT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        experience: String(targetpointsmanual.experience),
        experienceinmonths: String(targetpointsmanual.experienceinmonths),
        processcode: String(targetpointsmanual.processcode),
        code: String(targetpointsmanual.code),
        points: String(targetpointsmanual.points),
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

      await fetchTargetPointsDataArray();
      await fetchEmployee();
      setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });
      setSearchQuery("")
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
    setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });
    setSearchQuery("")
    setSearchQueryFilename("")
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //delete singledata functionality
  const [deletesingleDataView, setDeletesingledataView] = useState();

  const rowDataSingleDeleteView = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // let getFilenames = Res?.data?.stargetpoints.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletesingledataView(Res?.data?.stargetpoints);
      handleClickSingleOpenView();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const deleteSingleListView = async () => {
    setLoader(true)
    let deleteSingleid = deletesingleDataView?._id;
    setPageName(!pageName)
    try {
      const deletePromises = await axios.delete(`${SERVICE.TARGETPOINT_SINGLE}/${deleteSingleid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPage(1);
      handleCloseSingleModView();
      await getviewCodeall(deletesingleDataView.filename)
      await fetchTargetPointsDataArray();
      await fetchEmployee();
      setFilteredRowDataViewAll([])
      setFilteredChangesViewAll(null)
      setLoader(false)
      // handleCloseSingleModView();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //edit get data functionality single list
  const [editsingleData, setEditsingleData] = useState({ experience: "", processcode: "", code: "", points: "" });

  const [penaltyArray, setPenaltyArray] = useState([])
  const fetchTargetPointsAllData = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(SERVICE.TARGETPOINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getArray = Res?.data?.targetpoints.filter((item) => item._id !== editsingleData._id);
      setPenaltyArray(getArray)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchTargetPointsAllData();
  }, [isEditOpenView])

  const rowdatasingleeditView = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEditsingleData(Res?.data?.stargetpoints);

      handleClickOpenEditView();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [infosingleFileData, setinfosingleFileData] = useState([])

  const getinfoCode = async (id) => {
    setPageName(!pageName)
    try {
      let Res = await axios.get(`${SERVICE.TARGETPOINT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setinfosingleFileData(Res?.data?.stargetpoints);
      handleClickOpeninfoFile();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmitView = (e) => {
    e.preventDefault();
    const isNameMatch = penaltyArray.some((item) => item.company?.toLowerCase() === editsingleData.company?.toLowerCase() &&
      item.branch?.toLowerCase() === editsingleData.branch?.toLowerCase() &&
      item.experience?.toLowerCase() === editsingleData.experience?.toLowerCase() &&
      item.processcode?.toLowerCase() === editsingleData.processcode?.toLowerCase() &&
      item.code?.toLowerCase() === editsingleData.code?.toLowerCase() &&
      item.points?.toLowerCase() === editsingleData.points?.toLowerCase()
    )
    if (editsingleData.experience === "") {
      setPopupContentMalert("Please Enter Experience");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.processcode === "") {
      setPopupContentMalert("Please Enter Process Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editsingleData.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (editsingleData.points == "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequestView();
    }
  };

  const sendEditRequestView = async () => {
    setPageName(!pageName)
    let editid = editsingleData._id;
    let updateby = editsingleData.updatedby;

    try {
      let res = await axios.put(`${SERVICE.TARGETPOINT_SINGLE}/${editid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        experience: String(editsingleData.experience),
        processcode: String(editsingleData.processcode),
        code: String(editsingleData.code),
        points: String(editsingleData.points ? editsingleData.points : ""),
        updatedby: [
          {
            ...updateby,
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      handleCloseModEditView();
      await getviewCodeall(editsingleData.filename);
      await fetchTargetPointsDataArray();
      await fetchEmployee();
      // setEditsingleData({ ...editsingleData, experience: "", processcode: "", code: "", points: "" });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(targetPoints);
  }, [targetPoints]);

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
      let res = await axios.get(SERVICE.TARGETPOINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = res?.data?.targetpoints.filter((item) => item.filename === filename)
      // .map((item) => item._id);
      setProductionoriginalViewAll(getFilenames?.map(
        (item, index) => ({
          ...item,
          id: item._id,
          serialNumber: index + 1,
          experience: item.experience,
          company: item.company,
          branch: item.branch,
          processcode: item.processcode,
          code: item.code,
          points: item.points,
          pointstable: Number(item.points),
        })
      ));
      setFilenameDataArray3(getFilenames.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          experience: item.experience,
          company: item.company,
          branch: item.branch,
          processcode: item.processcode,
          code: item.code,
          points: item.points,
          pointstable: Number(item.points),

        };
      }))
      setFileNameView(filename);
      handleClickOpenviewAll();
      // setFileNameID(res?.data?.sdaypointsupload?._id);
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
      let Res = await axios.get(SERVICE.TARGETPOINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.targetpoints.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletefilenamedata(getFilenames);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const deleteFilenameList = async () => {
    setLoader(true)
    setPageName(!pageName)
    try {
      const deletePromises = await axios.post(
        SERVICE.TARGETPOINTSDELETE_BULK,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: deleteFilenameData,
        }

      );
      if (deletePromises?.data?.success) {
        await fetchTargetPointsDataArray();
        await fetchEmployee();
        handleCloseMod();
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setLoader(false)
      }
    } catch (err) {
      setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // download functions
  const handleDownloadReturn = async (downloadname, dupename) => {
    const encodedDownloadName = encodeURIComponent(downloadname);
    const fullURL = `${BASE_URL}/api/downloads/${encodedDownloadName}`;

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

  // Manage Columns
  const handleOpenManageColumnsFilename = (event) => {
    setAnchorElFilename(event.currentTarget);
    setManageColumnsOpenFilename(true);
  };
  const handleCloseManageColumnsFilename = () => {
    setManageColumnsOpenFilename(false);
    setSearchQueryManageFilename("");
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityFilename = {
    serialNumber: true,
    checkbox: true,
    branch: true,
    company: true,

    filename: true,
    uploaddate: true,
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
  // image
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

  const gridRefTableImg = useRef(null);

  //print...
  const componentRefFilename = useRef();
  const handleprintFilename = useReactToPrint({
    content: () => componentRefFilename.current,
    documentTitle: "Target Points",
    pageStyle: "print",
  });

  const addSerialNumberFilename = (datas) => {
    setItemsFilename(datas);
  };
  useEffect(() => {
    addSerialNumberFilename(targetPointsFilename);
  }, [targetPointsFilename]);

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
    },
    {
      field: "company",
      headerName: "Company Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch Name",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.branch,
      headerClassName: "bold-header",
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
          {isUserRoleCompare?.includes("dtargetpoints") && (
            <Button
              onClick={(e) => {
                rowDatafileNameDelete(params.data.filename);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />            </Button>
          )}

          {isUserRoleCompare?.includes("vtargetpoints") && (
            <Button
              // disabled
              sx={{ minWidth: "40px" }}
              onClick={(e) => {
                // handleDownloadReturn(params.row.filenamenew, params.row.filename);
                handleDownloadReturn(params.data.filename);
              }}
            >
              <DownloadOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtargetpoints") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeall(params.data.filename);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}

          {isUserRoleCompare?.includes("itargetpoints") && (
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
      id: item.serialNumber,
      _id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      filename: item.filename,
      uploaddate: item.lastupdated,
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
    if (!(file instanceof Blob)) {
      return;
    }

    if (selectedCompany === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    if (selectedBranch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    setSelectedFiles((existingFiles) => [...existingFiles, file]);

    promise
      .then((data) => {
        // Check for empty file
        if (data.length === 0) {
          setPopupContentMalert("The uploaded file is empty.");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        // Check for required columns
        const requiredColumns = ["Experience In Months", "Process Code", "Code", "Points"];
        const missingColumns = requiredColumns.filter((col) => !(col in data[0]));

        if (missingColumns.length > 0) {
          setPopupContentMalert(`Missing required columns: ${missingColumns.join(", ")}`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        const filteredData = data.filter((item) => item["Sample Value"] !== "Sample Data");

        // Check if the file name already exists
        const isNameDuplicate = targetPointsFilename.some(
          (item) => item.filename?.toLowerCase() === file.name.toLowerCase()
        );

        // Detect duplicates within the current Excel data
        const seenKeys = new Set();
        const uniqueData = [];
        const duplicatesWithinFile = [];

        filteredData.forEach((item) => {
          const key = `${item["Experience In Months"]}-${item["Process Code"]}-${item.Code}-${item.Points}`;
          if (seenKeys.has(key)) {
            duplicatesWithinFile.push(item);
          } else {
            seenKeys.add(key);
            uniqueData.push(item);
          }
        });

        // Check for duplicates with existing data in the database
        const duplicateData = uniqueData.filter((item) =>
          targetPointsArray.some(
            (tp) =>
              tp.company === selectedCompany &&
              tp.branch === selectedBranch &&
              tp.experience == item["Experience In Months"] &&
              tp.processcode == item["Process Code"] &&
              tp.code == item.Code &&
              tp.points == item.Points
          )
        );

        // Handle cases where all rows are duplicates or file name matches
        const isDataDuplicate = duplicateData.length === uniqueData.length;
        if (isNameDuplicate && isDataDuplicate) {
          setPopupContentMalert("File with the same name and duplicate data already exists.");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        if (uniqueData.length === 0) {
          setPopupContentMalert("No new data to upload. All entries are duplicates.");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        const dataArray = uniqueData.map((item) => ({
          experience: item["Experience In Months"],
          experienceinmonths: item["Process Code"],
          processcode: item["Process Code"],
          code: item.Code,
          points: item.Points,
          filename: file.name,
          branch: selectedBranch,
          company: selectedCompany,
          addedby: [
            {
              name: String(username),
              date: new Date().toISOString(),
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

        // Display alert if any duplicates were removed
        if (duplicatesWithinFile.length > 0 || duplicateData.length > 0) {
          setPopupContentMalert(
            `${duplicatesWithinFile.length + duplicateData.length} duplicate rows removed.`
          );
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      })
      .catch((err) => {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      });
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
    let uniqueArray = uploadExceldata?.filter((item) => !targetPointsArray.some((tp) => tp.company === selectedCompany
      && tp.branch === selectedBranch && tp.experience == item.experience
      && tp.processcode == item.processcode && tp.code == item.code && tp.points == item.points));
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

      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.TARGETPOINT_CREATE);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(uniqueArray));
        await fetchTargetPointsDataArray();
        await fetchEmployee();
      } catch (err) {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        setPopupContent("Uploaded Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectedSheet("Please Select Sheet");
        setSelectedSheetindex(-1)
        setUpdatesheet(prev => [...prev, selectedSheetindex])

        await handleFileUpload();
        await fetchEmployee();
        await fetchTargetPointsDataArray();

      }
    }
  };

  const clearFileSelection = () => {
    setUpdatesheet([])
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
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
    }
    else {
      const sampleData = [
        ["12", "PADE", "C001", "10", "Sample Data"],
      ];

      // Create and export the file
      new CsvBuilder(fileDownloadName)
        .setColumns(["Experience In Months", "Process Code", "Code", "Points", "Sample Value"])
        .addRows(sampleData)
        .exportFile();
    }
  };

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"TARGET POINTS"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Target Points"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Target Points"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("atargetpoints") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Target Points</Typography>
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
                    placeholder="Please Select Branch"
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
                      setFileUploadName("");
                      setSplitArray([]);
                      setDataupdated("");
                      setSheets([]);
                      setSelectedSheet("Please Select Sheet");
                      setTargetpointsmanual({ ...targetpointsmanual, experience: "", processcode: "", code: "", points: "" });

                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <Button variant="contained" color="success" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()}>
                  <FaDownload />
                  &ensp;Download template file
                </Button>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={6} marginTop={3}>
                <Grid container spacing={2}>
                  <Grid item md={4.5} xs={12} sm={6}>
                    <Button variant="contained" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} component="label" sx={{ textTransform: "capitalize" }}>
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
                  <Grid item md={6.5} xs={12} sm={6}>
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
                    <Button variant="contained" color="primary" disabled={targetpointsmanual.experience !== "" || targetpointsmanual.processcode !== "" || targetpointsmanual.code !== "" || targetpointsmanual.points != ""} onClick={getSheetExcel} sx={{ textTransform: "capitalize" }}>
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
                    <Typography> Experience in Months<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        placeholder="Please Enter Experience"
                        value={targetpointsmanual.experience}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            experience: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Process Code<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Process Code"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.processcode}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            processcode: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Code<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Code"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.code}
                        onChange={(e) => {
                          setTargetpointsmanual({
                            ...targetpointsmanual,
                            code: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={5} xs={12} sm={6}>
                    <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                  </Grid>
                  <Grid item md={7} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Points"
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        value={targetpointsmanual.points}
                        onChange={(e) => {
                          handleInputChangePoints(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <br />
            <Box>
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
            </Box>
          </>
        </Box>
      )}

      <br />
      {/* ****** Table Start ****** */}
      {loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("ltargetpoints") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Upload File List</Typography>
                </Grid>
                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                  <Grid item md={2} xs={12} sm={12}>
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
                        <MenuItem value={targetPointsFilename?.length}>All</MenuItem>
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
                      {isUserRoleCompare?.includes("exceltargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            setFormat("xl")
                          }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvtargetpoints") && (
                        <>
                          <Button onClick={(e) => {
                            setIsFilterOpen(true)
                            setFormat("csv")
                          }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printtargetpoints") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdftargetpoints") && (
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
                      {isUserRoleCompare?.includes("imagetargetpoints") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
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
                      maindatas={targetPointsFilename}
                      setSearchedString={setSearchedStringFilename}
                      searchQuery={searchQueryFilename}
                      setSearchQuery={setSearchQueryFilename}
                      paginated={false}
                      totalDatas={targetPointsFilename}
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
                      itemsList={targetPointsFilename}
                    />
                  </>
                )}
              </Box>
            </>
          )}</>)}
      {/* ****** Table End ****** */}
      <br />

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
      {/* View wises Edit */}
      <Dialog open={isEditOpenView} onClose={handleCloseModEditView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={6}>
              <Typography sx={userStyle.HeaderText}>Edit Target Points</Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <Typography variant="h6">Company</Typography>
              <Typography>{editsingleData.company}</Typography>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <Typography variant="h6">Branch</Typography>
              <Typography>{editsingleData.branch}</Typography>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Experience<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Experience"
                  value={editsingleData.experience}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      experience: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Process Code<b style={{ color: "red" }}>*</b></Typography>
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
                <Typography>Code<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Code"
                  value={editsingleData.code}
                  onChange={(e) => {
                    setEditsingleData({
                      ...editsingleData,
                      code: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Points<b style={{ color: "red" }}>*</b></Typography>
                <OutlinedInput
                  placeholder="Please Enter Points"
                  value={editsingleData.points}
                  onChange={(e) => {
                    handleInputChangePointsEdit(e);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.buttonsubmit} onClick={editSubmitView}>
            Update
          </Button>
          <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditView}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
                  {isUserRoleCompare?.includes("exceltargetpoints") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen3(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvtargetpoints") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen3(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printtargetpoints") && (
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
                  {isUserRoleCompare?.includes("pdftargetpoints") && (
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
                  {isUserRoleCompare?.includes("imagetargetpoints") && (
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
        itemsTwo={targetPointsFilenameArray ?? []}
        filename={"TargetPoints"}
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
        openInfo={openInfoFile}
        handleCloseinfo={handleCloseinfoFile}
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

      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* First Table End */}

      <br />

    </Box >
  );
}

export default TargetPoints;