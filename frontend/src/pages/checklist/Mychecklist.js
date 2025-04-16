import React, { useState, useEffect, useRef, useContext } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  TextField,
  IconButton,
  ListItem,
  List,
  Checkbox,
  ListItemText,
  Popover,
  InputLabel,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
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
  Tooltip,
} from "@mui/material";
import moment from "moment-timezone";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoIcon from "@mui/icons-material/Info";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../services/Baseservice";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import ErrorIcon from "@mui/icons-material/Error";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useNavigate, Link } from "react-router-dom";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Webcamimage from "../hr/webcamprofile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MuiInput from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../components/PageHeading";

const Input = styled(MuiInput)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

const ScrollingText = ({ text }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const textElement = textRef.current;

    if (!textElement) return; // Add a null check here

    const textWidth = textElement.offsetWidth;
    let position = 0;

    const scrollText = () => {
      position -= 1;
      if (position < -textWidth) {
        position = containerWidth;
      }
      textElement.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(scrollText);
    };

    scrollText();

    return () => cancelAnimationFrame(scrollText);
  }, []);

  return (
    <Grid
      item
      xs={8}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          ...userStyle.importheadtext,
          fontSize: "1.4rem",
          marginRight: "1rem",
        }}
      >
        {"Consolidated Checklist Requests"}
      </Typography>
      <div
        ref={containerRef}
        style={{ overflow: "hidden", width: "50%", whiteSpace: "nowrap" }}
      >
        <span ref={textRef} style={{ color: "red", display: "inline-block" }}>
          {text}
        </span>
      </div>
    </Grid>
  );
};

function MyInterviewCheckList() {
  const [btnSubmit, setBtnSubmit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...!");

  const [candidates, setCandidates] = useState([]);
  const [candidateSingle, setCandidateSingle] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    pageName,
    setPageName,
    isAssignBranch,
    listPageAccessMode,
  } = useContext(UserRoleAccessContext);
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Human Resources" &&
        data.submodulename === "HR" &&
        data.mainpagename === "Employee" &&
        data.subpagename === "Employee Status Details" &&
        data.subsubpagename === "Long Absent Restriction Hierarchy List"
    )?.listpageaccessmode || "Overall";
  let cuurrentDate = moment().format("DD-MM-YYYY");
  const tomorrow = moment().add(1, "days").format("DD-MM-YYYY");
  const dayAfterTomorrow = moment().add(2, "days").format("DD-MM-YYYY");

  // Create an array of dates
  const dateArray = [cuurrentDate, tomorrow, dayAfterTomorrow];
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);
  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);
  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [tableCount, setTableCount] = useState(1);
  const [tableThree, setTableThree] = useState(true);

  //print...
  const componentRefTwo = useRef();
  const handleprintTwo = useReactToPrint({
    content: () => componentRefTwo.current,
    documentTitle: "My Check List",
    pageStyle: "print",
  });

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver

      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        "Module Name": item.modulename || "",

        "Sub Module Name": item.submodule || "",

        "Main Page": item.mainpage || "",
        "Sub Page": item.subpage || "",
        "Sub Sub Page": item.subsubpage || "",
      };
    });
  };

  const handleExportXLTwo = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredDataTwo : itemsTwo;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "My Check List");
    setIsFilterOpen(false);
  };

  // pdf.....
  const columnsTwo = [
    { title: "Module Name", field: "modulename" },
    { title: "Sub Module Name", field: "submodule" },
    { title: "Main Page", field: "mainpage" },
    { title: "Sub Page", field: "subpage" },
    { title: "Sub Sub Page", field: "subsubpage" },
  ];

  const downloadPdfTwo = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columnsTwo.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredDataTwo.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
          }))
        : itemsTwo?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("My Check List.pdf");
  };

  //image
  const handleCaptureImageTwo = () => {
    if (gridRefTwo.current) {
      html2canvas(gridRefTwo.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "My Check List.png");
        });
      });
    }
  };
  //----------------------------------------------------------------------------------------------------------------------------------
  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date");
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time");
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate");
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate");
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date");
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time");
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate");
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime");
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate");
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime");
  };

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;
  let completedbyName = isUserRoleAccess.companyname;

  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "My Check List.png");
        });
      });
    }
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  let name = "create";

  const handleChangeImage = (event, index) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      handleDataChange(
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        },
        index,
        "Attachments"
      );
    };
  };

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //-----------------------------------Table Two--------------------------------------------------------------------------------------------------

  const [tableTwoDatas, setTableTwoDatas] = useState([]);
  const [userBasedDatas, setUserBasedDatas] = useState([]);
  const [sourceDatas, setSourceDatas] = useState([]);
  const [itemsTwo, setItemsTwo] = useState([]);
  const [pageTwo, setPageTwo] = useState(1);
  const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");
  const [searchQueryTwo, setSearchQueryTwo] = useState("");

  // Manage Columns
  const addSerialNumberTwo = () => {
    const itemsWithSerialNumber = tableTwoDatas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      id: index,
    }));
    setItemsTwo(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberTwo();
  }, [tableTwoDatas]);

  const initialColumnVisibilityTwo = {
    serialNumber: true,
    module: true,
    submodule: true,
    mainpage: true,
    subpage: true,
    subsubpage: true,
    actions: true,
  };

  const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(
    initialColumnVisibilityTwo
  );

  // Manage Columns
  const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
  const [anchorElTwo, setAnchorElTwo] = useState(null);

  const handleOpenManageColumnsTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
    setManageColumnsOpenTwo(true);
  };

  const openTwo = Boolean(anchorElTwo);
  const idTwo = openTwo ? "simple-popover" : undefined;

  const handleCloseManageColumnsTwo = () => {
    setManageColumnsOpenTwo(false);
    setSearchQueryManageTwo("");
  };

  const [pageSizeTwo, setPageSizeTwo] = useState(10);
  //Datatable
  const handlePageChangeTwo = (newPage) => {
    setPageTwo(newPage);
  };
  const handlePageSizeChangeTwo = (event) => {
    setPageSizeTwo(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataTwos = itemsTwo?.filter((item) => {
    return searchTermsTwo.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataTwo = filteredDataTwos.slice(
    (pageTwo - 1) * pageSizeTwo,
    pageTwo * pageSizeTwo
  );

  const totalPagesTwo = Math.ceil(filteredDataTwos.length / pageSizeTwo);

  const visiblePagesTwo = Math.min(totalPagesTwo, 3);

  const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
  const lastVisiblePageTwo = Math.min(
    firstVisiblePageTwo + visiblePagesTwo - 1,
    totalPagesTwo
  );

  const pageNumbersTwo = [];

  const indexOfLastItemTwo = pageTwo * pageSizeTwo;
  const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;

  for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
    pageNumbersTwo.push(i);
  }
  const columnDataTableTwo = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityTwo.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "module",
      headerName: "Module Name",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.module,
      headerClassName: "bold-header",
    },
    {
      field: "submodule",
      headerName: "Sub Module Name",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.submodule,
      headerClassName: "bold-header",
    },
    {
      field: "mainpage",
      headerName: "Main Page",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.mainpage,
      headerClassName: "bold-header",
    },
    {
      field: "subpage",
      headerName: "Sub Page",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.subpage,
      headerClassName: "bold-header",
    },
    {
      field: "subsubpage",
      headerName: "Sub Sub Page",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.subsubpage,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityTwo.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vmychecklist") && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    border: "1px solid #1565c0",
                    padding: "2px 20px",
                    borderRadius: "20px",
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                    backgroundColor: "#1565c0",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.color = "#1565c0";
                  }} // Change background color on hover
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#1565c0";
                    e.target.style.color = "#fff";
                  }}
                  onClick={() => {
                    showDataToTable(params.row);
                    setTableCount(2);
                  }}
                >
                  {`VIEW (${params.row.count})`}
                </div>
              </div>
            </>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableTwo = filteredDataTwo.map((item, index) => {
    return {
      id: index,
      serialNumber: item.serialNumber,
      module: item.modulename,
      submodule: item.submodule,
      mainpage: item.mainpage,
      subpage: item.subpage,
      subsubpage: item.subsubpage,
      uniquename: item.uniquename,
      count: item.countnew,
    };
  });

  //datatable....
  const handleSearchChangeTwo = (event) => {
    setSearchQueryTwo(event.target.value);
  };

  const gridRefTwo = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsTwo = () => {
    const updatedVisibility = { ...columnVisibilityTwo };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityTwo(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumnsTwo = columnDataTableTwo.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibilityTwo = (field) => {
    setColumnVisibilityTwo((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentTwo = (
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
        onClick={handleCloseManageColumnsTwo}
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
          value={searchQueryManageTwo}
          onChange={(e) => setSearchQueryManageTwo(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsTwo.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityTwo[column.field]}
                    onChange={() => toggleColumnVisibilityTwo(column.field)}
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
              onClick={() => setColumnVisibilityTwo(initialColumnVisibilityTwo)}
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
                columnDataTableTwo.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityTwo(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [manager, setManger] = useState(false);

  async function fecthDBDatas(details) {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find(
        (item) => item.commonid == postID
      );

      setGroupDetails(foundData?.groups);
      // if (manager) {
      //     let consolidatedData = foundData?.groups?.map((data, index) => {
      //         return {
      //             ...data, estimation: getDetails?.groups[index]?.estimation, estimationtime: getDetails?.groups[index]?.estimationtime, assignedtime: getDetails?.groups[index]?.assignedtime
      //         }
      //     })
      //     let datasNew = consolidatedData.map((item) => {
      //         switch (item.details) {
      //             case 'LEGALNAME':
      //                 return {
      //                     ...item, data: details.fullname
      //                 }

      //             case 'USERNAME':
      //                 return {
      //                     ...item, data: details.username
      //                 }

      //             case 'PASSWORD':
      //                 return {
      //                     ...item, data: details.password
      //                 }

      //             case 'DATE OF BIRTH':
      //                 return {
      //                     ...item, data: details.dateofbirth
      //                 }

      //             case 'EMAIL':
      //                 return {
      //                     ...item, data: details.email
      //                 }

      //             case 'PHONE NUMBER':
      //                 return {
      //                     ...item, data: details.mobile
      //                 }

      //             case 'FIRST NAME':
      //                 return {
      //                     ...item, data: details.firstname
      //                 }

      //             case 'LAST NAME':
      //                 return {
      //                     ...item, data: details.lastname
      //                 }

      //             case 'AADHAAR NUMBER':
      //                 return {
      //                     ...item, data: details.adharnumber
      //                 }

      //             case 'PAN NUMBER':
      //                 return {
      //                     ...item, data: details.pannumber
      //                 }

      //             case 'CURRENT ADDRESS':
      //                 return {
      //                     ...item, data: details.address
      //                 }

      //             default:
      //                 return {
      //                     ...item
      //                 }
      //         }
      //     })
      //     setGroupDetails(datasNew);
      // } else {
      //     let consolidatedData = foundData?.groups?.map((data, index) => {
      //         return {
      //             ...data, estimation: getDetails?.groups[index]?.estimation, estimationtime: getDetails?.groups[index]?.estimationtime, assignedtime: getDetails?.groups[index]?.assignedtime
      //         }
      //     })

      //     let individualDatas = consolidatedData?.filter((data) => (data?.employee?.includes(isUserRoleAccess?.companyname)));
      //     let datasNew = individualDatas.map((item) => {
      //         switch (item.details) {
      //             case 'LEGALNAME':
      //                 return {
      //                     ...item, data: details.fullname
      //                 }

      //             case 'USERNAME':
      //                 return {
      //                     ...item, data: details.username
      //                 }

      //             case 'PASSWORD':
      //                 return {
      //                     ...item, data: details.password
      //                 }

      //             case 'DATE OF BIRTH':
      //                 return {
      //                     ...item, data: details.dateofbirth
      //                 }

      //             case 'EMAIL':
      //                 return {
      //                     ...item, data: details.email
      //                 }

      //             case 'PHONE NUMBER':
      //                 return {
      //                     ...item, data: details.mobile
      //                 }

      //             case 'FIRST NAME':
      //                 return {
      //                     ...item, data: details.firstname
      //                 }

      //             case 'LAST NAME':
      //                 return {
      //                     ...item, data: details.lastname
      //                 }

      //             case 'AADHAAR NUMBER':
      //                 return {
      //                     ...item, data: details.adharnumber
      //                 }

      //             case 'PAN NUMBER':
      //                 return {
      //                     ...item, data: details.pannumber
      //                 }

      //             case 'CURRENT ADDRESS':
      //                 return {
      //                     ...item, data: details.address
      //                 }

      //             default:
      //                 return {
      //                     ...item
      //                 }
      //         }
      //     })
      //     setGroupDetails(datasNew);
      // }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  }

  const [postID, setPostID] = useState();
  const [getDetails, setGetDetails] = useState();
  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();

  const [disableInput, setDisableInput] = useState([]);
  const [alreadyUpdatedDatas, setAlreadyUpdatedDatas] = useState([]);
  const [singleDataId, setSingleDataId] = useState("");
  const getCode = async (details) => {
    setLoading(true);
    setGetDetails(details);
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);
      let searchItem = res?.data?.mychecklist.find(
        (item) =>
          item.commonid == details?.id &&
          item.status.toLowerCase() !== "completed"
      );

      if (searchItem) {
        setSingleDataId(searchItem?._id);
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);
        let datasNew = searchItem.groups.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.fullname,
              };

            case "USERNAME":
              return {
                ...item,
                data: details.username,
              };

            case "PASSWORD":
              return {
                ...item,
                data: details.password,
              };

            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dateofbirth,
              };

            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };

            case "PHONE NUMBER":
              return {
                ...item,
                data: details.mobile,
              };

            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };

            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };

            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.adharnumber,
              };

            case "PAN NUMBER":
              return {
                ...item,
                data: details.pannumber,
              };

            case "CURRENT ADDRESS":
              return {
                ...item,
                data: details.address,
              };

            default:
              return {
                ...item,
              };
          }
        });
        let consolidatedData = datasNew?.map((data, index) => {
          return {
            ...data,
            estimation: details?.groups[index]?.estimation,
            estimationtime: details?.groups[index]?.estimationtime,
            assignedtime: details?.groups[index]?.assignedtime,
          };
        });
        setGroupDetails(
          consolidatedData?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        let forFillDetails = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateSpan = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        });

        let forDateTime = datasNew?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateMultiSpanTime = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));
        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));
        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));
        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));
        setDisableInput(new Array(details.groups.length).fill(true));
      } else {
        setAssignDetails(details);
        setPostID(details?.id);

        let datasNew = details.groups.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.fullname,
              };

            case "USERNAME":
              return {
                ...item,
                data: details.username,
              };

            case "PASSWORD":
              return {
                ...item,
                data: details.password,
              };

            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dateofbirth,
              };

            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };

            case "PHONE NUMBER":
              return {
                ...item,
                data: details.mobile,
              };

            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };

            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };

            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.adharnumber,
              };

            case "PAN NUMBER":
              return {
                ...item,
                data: details.pannumber,
              };

            case "CURRENT ADDRESS":
              return {
                ...item,
                data: details.address,
              };

            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setDateValueRandom(new Array(details.groups.length).fill(0));
        setTimeValueRandom(new Array(details.groups.length).fill(0));

        setDateValueMultiFrom(new Array(details.groups.length).fill(0));
        setDateValueMultiTo(new Array(details.groups.length).fill(0));

        setDateValue(new Array(details.groups.length).fill(0));
        setTimeValue(new Array(details.groups.length).fill(0));

        setFirstDateValue(new Array(details.groups.length).fill(0));
        setFirstTimeValue(new Array(details.groups.length).fill(0));
        setSecondDateValue(new Array(details.groups.length).fill(0));
        setSecondTimeValue(new Array(details.groups.length).fill(0));

        setDisableInput(new Array(details.groups.length).fill(true));
      }

      setLoading(false);
      handleClickOpenEdit();
    } catch (err) {
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const updateIndividualData = async (index) => {
    let searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID && item.status.toLowerCase() !== "completed"
    );
    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });
    let addedData = manager ? [] : excludedGroupDatas;
    let considerDatas =
      alreadyUpdatedDatas?.length > 0 ? alreadyUpdatedDatas : addedData;

    setPageName(!pageName);
    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            data: String(objectData?.data),
            newFiles: objectData?.files,
            completedby: objectData?.completedby,
            completedat: objectData?.completedat,
          }
        );
        let updateDate = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLE}/${singleDataId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            longleaveabsentaprooveddatechecklist: dateArray,
          }
        );
        await fecthDBDatas(getDetails);
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: pagesDetails?.module,
          submodule: pagesDetails?.submodule,
          mainpage: pagesDetails?.mainpage,
          subpage: pagesDetails?.subpage,
          subsubpage: pagesDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          longleaveabsentaprooveddatechecklist: dateArray,
          candidatename: assignDetails?.fullname,
          status: "progress",
          groups: [...combinedGroups, ...considerDatas],
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas(getDetails);
      }
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Updated Successfully
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleDataChange = (e, index, from, sub) => {
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case "Text Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-number":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alpha":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alphanumeric":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Attachments":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Pre-Value":
        break;
      case "Date":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Time":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "DateTime":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case "Date Multi Span":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Span Time":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Random":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Date Multi Random Time":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Radio":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

  // submit option for saving....
  const handleSubmit = (e) => {
    setBtnSubmit(true);

    e.preventDefault();
    sendRequest();
  };

  const sendRequest = async () => {
    let searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID && item.status.toLowerCase() !== "completed"
    );
    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;
      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });
    let addedData = manager ? [] : excludedGroupDatas;
    let considerDatas =
      alreadyUpdatedDatas?.length > 0 ? alreadyUpdatedDatas : addedData;
    setPageName(!pageName);
    try {
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            commonid: assignDetails?.id,
            module: pagesDetails?.module,
            submodule: pagesDetails?.submodule,
            mainpage: pagesDetails?.mainpage,
            subpage: pagesDetails?.subpage,
            subsubpage: pagesDetails?.subsubpage,
            category: assignDetails?.category,
            subcategory: assignDetails?.subcategory,
            candidatename: assignDetails?.fullname,
            status: "progress",
            longleaveabsentaprooveddatechecklist: dateArray,
            groups: [...combinedGroups, ...considerDatas],
            updatedby: [
              ...searchItem?.updatedby,
              {
                name: String(username),
                date: String(new Date()),
              },
            ],
          }
        );
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: pagesDetails?.module,
          submodule: pagesDetails?.submodule,
          mainpage: pagesDetails?.mainpage,
          subpage: pagesDetails?.subpage,
          subsubpage: pagesDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: "progress",
          longleaveabsentaprooveddatechecklist: dateArray,
          groups: [...combinedGroups, ...considerDatas],
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchUnassignedCandidates();
      await showDataToTable(pagesDetails);
      setBtnSubmit(false);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "Green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      handleCloseModEdit();
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    checkbox: true,
    mode: true,
    role: true,
    branch: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    experience: true,
    skill: true,
    applieddate: true,
    actions: true,
    category: true,
    subcategory: true,
    checklist: true,
    updatestatus: true,

    name: true,
    empcode: true,
    assignedtime: true,
    duedate: true,
    duebydate: true,

    unit: true,
    team: true,
    approvedthrough: true,
    noticedate: true,

    userstatus: true,
    companyname: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //frequency master name updateby edit page...
  let updateby = candidateSingle.updatedby;
  let addedby = candidateSingle.addedby;

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setDateValueMultiFrom([]);
    setDateValueMultiTo([]);
    setDateValueRandom([]);
    setTimeValueRandom([]);
    setDateValue([]);
    setTimeValue([]);
    setFirstDateValue([]);
    setFirstTimeValue([]);
    setSecondDateValue([]);
    setSecondTimeValue([]);
    setGroupDetails([]);
  };

  const [leaveDatas, setLeaveDatas] = useState([]);
  const [permissionDatas, setPermissionDatas] = useState([]);
  const [longLeaveAbsentDatas, setLongLeaveAbsentDatas] = useState([]);
  const [exitDatas, setExitDatas] = useState([]);

  const [pagesDetails, setPagesDetails] = useState({});
  const [fromWhere, setFromWhere] = useState("");

  const showDataToTable = async (datas) => {
    setPagesDetails(datas);
    setBankdetail(true);
    let isManager = isUserRoleAccess?.role?.includes("Manager");
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);

      let gotDatas = res?.data?.mychecklist;

      if (
        datas.module == "Leave&Permission" &&
        datas.submodule == "Leave" &&
        datas.mainpage == "Apply Leave"
      ) {
        setFromWhere("applyleave");

        let mainFilter = overallGroupDatas?.filter(
          (data) =>
            data?.modulename === "Leave&Permission" &&
            data.submodule === "Leave" &&
            data.mainpage === "Apply Leave"
        );

        let filteredDatas = mainFilter[0]?.groups?.filter(
          (data) => !data?.employee?.includes(isUserRoleAccess?.companyname)
        );
        setexcludedGroupDatas(
          filteredDatas?.map((item) => ({
            ...item,
            lastcheck: false,
            completedby: "",
          }))
        );

        let foundData = sourceDatas.find((item) => {
          return (
            datas.module == item.modulename &&
            datas.submodule == item.submodule &&
            datas.mainpage == item.mainpage &&
            datas.subpage == item.subpage &&
            datas.subsubpage == item.subsubpage
          );
        });
        let toViewDatas = leaveDatas.map((data) => {
          let estimationdata = foundData?.relatedDatas
            ?.filter((item, index, array) => {
              let isMinutes = array.some(
                (item) =>
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
              );
              if (isMinutes) {
                return (
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
                );
              } else {
                let isHours = array.some((item) => item?.estimation == "Hours");
                if (isHours) {
                  return item?.estimation == "Hours";
                } else {
                  return item?.estimation == "Days";
                }
              }
            })
            .reduce((lowest, current) => {
              if (!lowest) return current;
              return parseFloat(current?.estimationtime) <
                parseFloat(lowest?.estimationtime)
                ? current
                : lowest;
            }, null);
          return {
            ...data,
            category: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.category))
            ),
            subcategory: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.subcategory))
            ),
            details: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.details))
            ),
            groups: foundData?.relatedDatas?.map((item) => item.group).flat(),
            information: foundData?.information,
            assignedtime: foundData?.relatedDatas[0]?.assignedtime,
            estimationdata: `${estimationdata?.estimationtime} ${estimationdata?.estimation}`,
          };
        });

        let finalToShow = toViewDatas.map((item) => {
          let foundData = gotDatas?.find(
            (dataNew) => dataNew.commonid == item._id
          );

          if (foundData) {
            let filteredDatas = foundData?.groups?.filter((data) =>
              data?.employee?.includes(isUserRoleAccess?.companyname)
            );

            let areAllGroupsCompleted;
            if (!isManager) {
              areAllGroupsCompleted = filteredDatas?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            } else {
              areAllGroupsCompleted = foundData?.groups?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            }

            if (areAllGroupsCompleted) {
              return {
                ...item,
                updatestatus: "Completed",
              };
            } else {
              return {
                ...item,
                updatestatus: "Not Completed",
              };
            }
          } else {
            return {
              ...item,
              updatestatus: "Not Completed",
            };
          }
        });

        setCandidates(finalToShow);
        setBankdetail(false);
      } else if (
        datas.module == "Leave&Permission" &&
        datas.submodule == "Permission" &&
        datas.mainpage == "Apply Permission"
      ) {
        setFromWhere("applypermission");

        let mainFilter = overallGroupDatas?.filter(
          (data) =>
            data?.modulename === "Leave&Permission" &&
            data.submodule === "Permission" &&
            data.mainpage === "Apply Permission"
        );

        let filteredDatas = mainFilter[0]?.groups?.filter(
          (data) => !data?.employee?.includes(isUserRoleAccess?.companyname)
        );

        setexcludedGroupDatas(
          filteredDatas?.map((item) => ({
            ...item,
            lastcheck: false,
            completedby: "",
          }))
        );

        let foundData = sourceDatas.find((item) => {
          return (
            datas.module == item.modulename &&
            datas.submodule == item.submodule &&
            datas.mainpage == item.mainpage &&
            datas.subpage == item.subpage &&
            datas.subsubpage == item.subsubpage
          );
        });
        let toViewDatas = permissionDatas.map((data) => {
          let estimationdata = foundData?.relatedDatas
            ?.filter((item, index, array) => {
              let isMinutes = array.some(
                (item) =>
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
              );
              if (isMinutes) {
                return (
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
                );
              } else {
                let isHours = array.some((item) => item?.estimation == "Hours");
                if (isHours) {
                  return item?.estimation == "Hours";
                } else {
                  return item?.estimation == "Days";
                }
              }
            })
            .reduce((lowest, current) => {
              if (!lowest) return current;
              return parseFloat(current?.estimationtime) <
                parseFloat(lowest?.estimationtime)
                ? current
                : lowest;
            }, null);

          return {
            ...data,
            category: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.category))
            ),
            subcategory: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.subcategory))
            ),
            details: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.details))
            ),
            groups: foundData?.relatedDatas?.map((item) => item.group).flat(),
            information: foundData?.information,
            assignedtime: foundData?.relatedDatas[0]?.assignedtime,
            estimationdata: `${estimationdata?.estimationtime} ${estimationdata?.estimation}`,
          };
        });

        let finalToShow = toViewDatas.map((item) => {
          let foundData = gotDatas?.find(
            (dataNew) => dataNew.commonid == item._id
          );
          if (foundData) {
            let filteredDatas = foundData?.groups?.filter((data) =>
              data?.employee?.includes(isUserRoleAccess?.companyname)
            );

            let areAllGroupsCompleted;
            if (!isManager) {
              areAllGroupsCompleted = filteredDatas?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            } else {
              areAllGroupsCompleted = foundData?.groups?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            }
            if (areAllGroupsCompleted) {
              return {
                ...item,
                updatestatus: "Completed",
              };
            } else {
              return {
                ...item,
                updatestatus: "Not Completed",
              };
            }
          } else {
            return {
              ...item,
              updatestatus: "Not Completed",
            };
          }
        });

        setCandidates(finalToShow);
        setBankdetail(false);
      } else if (
        datas.module == "Human Resources" &&
        datas.submodule == "HR" &&
        datas.mainpage == "Employee" &&
        datas.subpage == "Notice Period" &&
        datas.subsubpage == "Exit List"
      ) {
        setFromWhere("exitlist");

        let mainFilter = overallGroupDatas?.filter(
          (data) =>
            data?.modulename === "Human Resources" &&
            data.submodule === "HR" &&
            data.mainpage === "Employee" &&
            data.subpage === "Notice Period" &&
            data.subsubpage === "Exit List"
        );

        let filteredDatas = mainFilter[0]?.groups?.filter(
          (data) => !data?.employee?.includes(isUserRoleAccess?.companyname)
        );

        setexcludedGroupDatas(
          filteredDatas?.map((item) => ({
            ...item,
            lastcheck: false,
            completedby: "",
          }))
        );

        let foundData = sourceDatas.find((item) => {
          return (
            datas.module == item.modulename &&
            datas.submodule == item.submodule &&
            datas.mainpage == item.mainpage &&
            datas.subpage == item.subpage &&
            datas.subsubpage == item.subsubpage
          );
        });

        let toViewDatas = exitDatas.map((data) => {
          let estimationdata = foundData?.relatedDatas
            ?.filter((item, index, array) => {
              let isMinutes = array.some(
                (item) =>
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
              );
              if (isMinutes) {
                return (
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
                );
              } else {
                let isHours = array.some((item) => item?.estimation == "Hours");
                if (isHours) {
                  return item?.estimation == "Hours";
                } else {
                  return item?.estimation == "Days";
                }
              }
            })
            .reduce((lowest, current) => {
              if (!lowest) return current;
              return parseFloat(current?.estimationtime) <
                parseFloat(lowest?.estimationtime)
                ? current
                : lowest;
            }, null);

          return {
            ...data,
            category: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.category))
            ),
            subcategory: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.subcategory))
            ),
            details: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.details))
            ),
            groups: foundData?.relatedDatas?.map((item) => item.group).flat(),
            information: foundData?.information,
            assignedtime: foundData?.relatedDatas[0]?.assignedtime,
            estimationdata: `${estimationdata?.estimationtime} ${estimationdata?.estimation}`,
          };
        });

        let finalToShow = toViewDatas.map((item) => {
          let foundData = gotDatas?.find(
            (dataNew) => dataNew.commonid == item._id
          );
          if (foundData) {
            let filteredDatas = foundData?.groups?.filter((data) =>
              data?.employee?.includes(isUserRoleAccess?.companyname)
            );

            let areAllGroupsCompleted;
            if (!isManager) {
              areAllGroupsCompleted = filteredDatas?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            } else {
              areAllGroupsCompleted = foundData?.groups?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            }
            if (areAllGroupsCompleted) {
              return {
                ...item,
                updatestatus: "Completed",
              };
            } else {
              return {
                ...item,
                updatestatus: "Not Completed",
              };
            }
          } else {
            return {
              ...item,
              updatestatus: "Not Completed",
            };
          }
        });

        setCandidates(finalToShow);
        setBankdetail(false);
      } else if (
        datas.module == "Human Resources" &&
        datas.submodule == "HR" &&
        datas.mainpage == "Employee" &&
        datas.subpage == "Employee Status Details" &&
        datas.subsubpage == "Long Absent Restriction List"
      ) {
        setFromWhere("longabsentlongleaverestrcitionlist");

        let mainFilter = overallGroupDatas?.filter(
          (data) =>
            data.module == "Human Resources" &&
            data.submodule == "HR" &&
            data.mainpage == "Employee" &&
            data.subpage == "Employee Status Details" &&
            data.subsubpage == "Long Absent Restriction List"
        );

        let filteredDatas = mainFilter[0]?.groups?.filter(
          (data) => !data?.employee?.includes(isUserRoleAccess?.companyname)
        );

        setexcludedGroupDatas(
          filteredDatas?.map((item) => ({
            ...item,
            lastcheck: false,
            completedby: "",
          }))
        );

        let foundData = sourceDatas.find((item) => {
          return (
            datas.module == item.modulename &&
            datas.submodule == item.submodule &&
            datas.mainpage == item.mainpage &&
            datas.subpage == item.subpage &&
            datas.subsubpage == item.subsubpage
          );
        });

        let toViewDatas = longLeaveAbsentDatas.map((data) => {
          let estimationdata = foundData?.relatedDatas
            ?.filter((item, index, array) => {
              let isMinutes = array.some(
                (item) =>
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
              );
              if (isMinutes) {
                return (
                  item?.estimation == "Minutes" ||
                  item?.estimation == "Immediate"
                );
              } else {
                let isHours = array.some((item) => item?.estimation == "Hours");
                if (isHours) {
                  return item?.estimation == "Hours";
                } else {
                  return item?.estimation == "Days";
                }
              }
            })
            .reduce((lowest, current) => {
              if (!lowest) return current;
              return parseFloat(current?.estimationtime) <
                parseFloat(lowest?.estimationtime)
                ? current
                : lowest;
            }, null);

          return {
            ...data,
            category: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.category))
            ),
            subcategory: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.subcategory))
            ),
            details: Array.from(
              new Set(foundData?.relatedDatas?.map((item) => item.details))
            ),
            groups: foundData?.relatedDatas?.map((item) => item.group).flat(),
            information: foundData?.information,
            assignedtime: foundData?.relatedDatas[0]?.assignedtime,
            estimationdata: `${estimationdata?.estimationtime} ${estimationdata?.estimation}`,
          };
        });

        let finalToShow = toViewDatas.map((item) => {
          let foundData = gotDatas?.find(
            (dataNew) => dataNew.commonid == item._id
          );
          if (foundData) {
            let filteredDatas = foundData?.groups?.filter((data) =>
              data?.employee?.includes(isUserRoleAccess?.companyname)
            );

            let areAllGroupsCompleted;
            if (!isManager) {
              areAllGroupsCompleted = filteredDatas?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            } else {
              areAllGroupsCompleted = foundData?.groups?.every(
                (itemNew) =>
                  (itemNew.data !== undefined && itemNew.data !== "") ||
                  itemNew.files !== undefined
              );
            }
            if (areAllGroupsCompleted) {
              return {
                ...item,
                updatestatus: "Completed",
              };
            } else {
              return {
                ...item,
                updatestatus: "Not Completed",
              };
            }
          } else {
            return {
              ...item,
              updatestatus: "Not Completed",
            };
          }
        });
        setCandidates(finalToShow);
        console.log(
          finalToShow,
          "longleaveabsentaprooveddatechecklist: dateArray,"
        );
        setBankdetail(false);
      }
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [excludedGroupDatas, setexcludedGroupDatas] = useState([]);
  const [overallGroupDatas, setOverallGroupDatas] = useState([]);
  const fetchGroupDatas = async (checklistAll, checkverfication) => {
    setPageName(!pageName);
    try {
      let overallDatas = checklistAll
        ?.map((data) => {
          let foundDataNew = checkverfication?.find(
            (item) =>
              item.categoryname == data.category &&
              item.subcategoryname == data.subcategory &&
              item.checklisttype.includes(data.details)
          );
          if (foundDataNew) {
            return {
              ...data,
              checklisttype: foundDataNew.checklisttype,
              employee: foundDataNew.employee,
              categoryname: foundDataNew.categoryname,
              subcategoryname: foundDataNew.subcategoryname,
              uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`,
              group: {
                category: data.category,
                subcategory: data.subcategory,
                details: data.details,
                checklist: data.checklist,
                information: data.information,
              },
            };
          } else {
            return false;
          }
        })
        .filter((data) => data != false);

      function countUniqueCombinations(data) {
        const counts = {};
        let uniqueArray = [];
        data.forEach((item) => {
          const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
          if (!uniqueArray.includes(key)) {
            uniqueArray.push(key);
          }
          counts[key] = (counts[key] || 0) + 1;
        });
        const result = Object.keys(counts).map((key) => {
          const [modulename, submodule, mainpage, subpage, subsubpage] =
            key.split("_");
          return {
            modulename,
            submodule,
            mainpage,
            subpage,
            subsubpage,
            uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
            count: counts[key],
          };
        });

        let updatedArray = result.map((data, index) => {
          let foundDatas = overallDatas.filter((item) => {
            return item.uniquename == data.uniquename;
          });

          if (foundDatas) {
            return {
              ...data,
              relatedDatas: foundDatas,
              _id: index,
            };
          }
        });

        return { result, uniqueArray, updatedArray };
      }

      let showValues = countUniqueCombinations(overallDatas);

      setSourceDatas(showValues?.updatedArray);

      let finalThisPageDatas = showValues?.updatedArray?.filter((data) => {
        return (
          data.subsubpage !== "Action Employee List" &&
          data.subsubpage !== "Active Intern List" &&
          data.subsubpage !== "Deactivate Employees List" &&
          data.subsubpage !== "Deactivate Intern List" &&
          data.subsubpage !== "Rejoined Employee List"
        );
      });

      let toViewDatas = finalThisPageDatas.map((data, index) => {
        return {
          ...data,
          category: Array.from(
            new Set(
              finalThisPageDatas[index]?.relatedDatas?.map(
                (item) => item.category
              )
            )
          ),
          subcategory: Array.from(
            new Set(
              finalThisPageDatas[index]?.relatedDatas?.map(
                (item) => item.subcategory
              )
            )
          ),
          details: Array.from(
            new Set(
              finalThisPageDatas[index]?.relatedDatas?.map(
                (item) => item.details
              )
            )
          ),
          groups: finalThisPageDatas[index]?.relatedDatas
            ?.map((item) => ({ ...item.group, employee: item.employee }))
            .flat(),
          information: finalThisPageDatas[index]?.information,
        };
      });

      setOverallGroupDatas(toViewDatas);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all employees list details
  const fetchUnassignedCandidates = async () => {
    const accessbranch = isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));
    setPageName(!pageName);
    try {
      const [checkVerificationMaster, checkList, userDatas] = await Promise.all(
        [
          axios.get(SERVICE.CHECKLISTVERIFICATIONMASTER, {
            headers: { Authorization: `Bearer ${auth.APIToken}` },
          }),
          axios.get(SERVICE.CHECKLISTTYPE, {
            headers: { Authorization: `Bearer ${auth.APIToken}` },
          }),
          axios.get(SERVICE.CHECKLISTUSERDATAS, {
            headers: { Authorization: `Bearer ${auth.APIToken}` },
          }),
        ]
      );
      let selectedValues = isAssignBranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });
      const [
        applyLeavesResponse,
        permissionsResponse,
        noticeDatas,
        longleaveabsent,
      ] = await Promise.all([
        axios.get(SERVICE.ACTIVEAPPLYLEAVE),
        axios.get(SERVICE.ACTIVEPERMISSIONS),
        axios.get(SERVICE.CHECKLISTNOTICEPERIODAPPLY),
        axios.post(SERVICE.GETFILTEREUSERDATALONGABSEND, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: selectedCompany,
          branch: selectedBranch,
          unit: selectedUnit,
          team: [],
          filterin: "",
        }),
      ]);
      let longLeaveLongAbsentEmployees =
        longleaveabsent?.data?.filterallDatauser?.filter((item) =>
          isAssignBranch.some(
            (branch) =>
              branch.company === item.company &&
              branch.branch === item.branch &&
              branch.unit === item.unit
          )
        );
      let appliedLeavesOnly = applyLeavesResponse?.data?.applyleaves
        ?.map((data) => {
          let foundData = userDatas?.data?.Users?.find(
            (item) => item.empcode === data?.employeeid
          );
          if (foundData) {
            return {
              ...data,
              ...foundData,
              _id: data?._id,
            };
          } else {
            return {
              ...data,
            };
          }
        })
        .filter((item) =>
          accessbranch.some(
            (branch) =>
              item.company.includes(branch.company) &&
              item.branch.includes(branch.branch) &&
              item.unit.includes(branch.unit)
          )
        );
      let appliedPermissionOnly = permissionsResponse?.data?.permissions
        ?.map((data) => {
          let foundData = userDatas?.data?.Users?.find(
            (item) => item.empcode === data?.employeeid
          );
          if (foundData) {
            return {
              ...data,
              ...foundData,
              _id: data?._id,
              company: data?.companyname,
            };
          } else {
            return {
              ...data,
              company: data?.companyname,
            };
          }
        })
        .filter((item) =>
          accessbranch.some(
            (branch) =>
              branch.company === item.company &&
              branch.branch === item.branch &&
              branch.unit === item.unit
          )
        );

      let ans = noticeDatas?.data?.noticeperiodapply.filter((item) =>
        accessbranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch &&
            branch.unit === item.unit
        )
      );

      let mappedDatas = ans.map((data) => {
        let foundData = userDatas?.data?.Users?.find(
          (item) => item?.empcode === data?.empcode
        );
        if (foundData) {
          return {
            ...data,
            ...foundData,
            _id: data?._id,
          };
        } else {
          return {
            ...data,
          };
        }
      });
      setExitDatas(mappedDatas);

      let longLeaveAbsentmappedDatas = longLeaveLongAbsentEmployees?.map(
        (data) => {
          let foundData = userDatas?.data?.Users?.find(
            (item) => item?.empcode === data?.empcode
          );
          if (foundData) {
            return {
              ...data,
              ...foundData,
              _id: data?._id,
            };
          } else {
            return {
              ...data,
            };
          }
        }
      );
      setLeaveDatas(appliedLeavesOnly);
      setPermissionDatas(appliedPermissionOnly);
      setLongLeaveAbsentDatas(longLeaveAbsentmappedDatas);

      let checkverfication =
        checkVerificationMaster?.data?.checklistverificationmasters;

      let checklistAll = checkList?.data?.checklisttypes;
      let userRelatedDatas = checkverfication.filter((data) => {
        return data?.employee?.includes(isUserRoleAccess?.companyname);
      });
      let isManager = isUserRoleAccess?.role?.includes("Manager");

      if (!isManager) {
        fetchGroupDatas(checklistAll, checkverfication);
      }

      let findCheckListData;
      if (isManager) {
        setManger(true);
        findCheckListData = checklistAll
          ?.map((data) => {
            let foundDataNew = checkverfication?.find(
              (item) =>
                item.categoryname == data.category &&
                item.subcategoryname == data.subcategory &&
                item.checklisttype.includes(data.details)
            );
            if (foundDataNew) {
              return {
                ...data,
                checklisttype: foundDataNew.checklisttype,
                employee: foundDataNew.employee,
                categoryname: foundDataNew.categoryname,
                subcategoryname: foundDataNew.subcategoryname,
                uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`,
                assignedtime: foundDataNew?.createdAt,
                group: {
                  category: data.category,
                  subcategory: data.subcategory,
                  details: data.details,
                  checklist: data.checklist,
                  information: data.information,
                  employee: foundDataNew.employee,
                  estimation: data.estimation,
                  estimationtime: data.estimationtime,
                  assignedtime: foundDataNew?.createdAt,
                },
              };
            } else {
              return false;
            }
          })
          .filter((data) => data != false);
      } else {
        setManger(false);
        findCheckListData = checklistAll
          ?.map((data) => {
            let foundDataNew = userRelatedDatas?.find(
              (item) =>
                item.categoryname == data.category &&
                item.subcategoryname == data.subcategory &&
                item.checklisttype.includes(data.details)
            );
            if (foundDataNew) {
              return {
                ...data,
                checklisttype: foundDataNew.checklisttype,
                employee: foundDataNew.employee,
                categoryname: foundDataNew.categoryname,
                subcategoryname: foundDataNew.subcategoryname,
                uniquename: `${data.module}_${data.submodule}_${data.mainpage}_${data.subpage}_${data.subsubpage}`,
                assignedtime: foundDataNew?.createdAt,
                group: {
                  category: data.category,
                  subcategory: data.subcategory,
                  details: data.details,
                  checklist: data.checklist,
                  information: data.information,
                  estimation: data.estimation,
                  estimationtime: data.estimationtime,
                  employee: foundDataNew.employee,
                  assignedtime: foundDataNew?.createdAt,
                },
              };
            } else {
              return false;
            }
          })
          .filter((data) => data != false);
      }

      function countUniqueCombinations(data) {
        const counts = {};
        let uniqueArray = [];
        data.forEach((item) => {
          const key = `${item.module}_${item.submodule}_${item.mainpage}_${item.subpage}_${item.subsubpage}`;
          if (!uniqueArray.includes(key)) {
            uniqueArray.push(key);
          }
          counts[key] = (counts[key] || 0) + 1;
        });
        const result = Object.keys(counts).map((key) => {
          const [modulename, submodule, mainpage, subpage, subsubpage] =
            key.split("_");
          return {
            modulename,
            submodule,
            mainpage,
            subpage,
            subsubpage,
            uniquename: `${modulename}_${submodule}_${mainpage}_${subpage}_${subsubpage}`,
            count: counts[key],
          };
        });

        let updatedArray = result.map((data, index) => {
          let foundDatas = findCheckListData.filter((item) => {
            return item.uniquename == data.uniquename;
          });

          if (foundDatas) {
            return {
              ...data,
              relatedDatas: foundDatas,
              _id: index,
            };
          }
        });

        return { result, uniqueArray, updatedArray };
      }

      let showValues = countUniqueCombinations(findCheckListData);
      let showDatas = showValues?.result
        .filter((data) => {
          return (
            data.subsubpage !== "Action Employee List" &&
            data.subsubpage !== "Active Intern List" &&
            data.subsubpage !== "Deactivate Employees List" &&
            data.subsubpage !== "Deactivate Intern List" &&
            data.subsubpage !== "Rejoined Employee List" &&
            data.mainpage !== "Job Openings"
          );
        })
        .map((item) => {
          if (item.submodule === "Leave") {
            return {
              ...item,
              countnew: appliedLeavesOnly?.length,
            };
          } else if (item.submodule === "Permission") {
            return {
              ...item,
              countnew: appliedPermissionOnly?.length,
            };
          } else if (item.subsubpage === "Exit List") {
            return {
              ...item,
              countnew: mappedDatas?.length,
            };
          } else if (item.subsubpage === "Long Absent Restriction List") {
            return {
              ...item,
              countnew: longLeaveAbsentmappedDatas?.length,
            };
          }
        });

      setTableTwoDatas(showDatas);
      setSourceDatas(showValues?.updatedArray);

      setTableThree(false);
    } catch (err) {
      setTableThree(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setTableThree(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setTableThree(false);
  };

  //  PDF
  let columns;
  switch (fromWhere) {
    case "applyleave":
      columns = [
        { title: "Name", field: "fullname" },
        { title: "Applied Date", field: "applieddate" },
        { title: "Employee Code", field: "empcode" },
        { title: "Status", field: "updatestatus" },
        { title: "Assigned Date/Time", field: "assignedtime" },
        { title: "Due Date", field: "duebydate" },
        { title: "Remaining Time", field: "duedate" },
        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
        { title: "Check List", field: "checklist" },
      ];
      break;
    case "applypermission":
      columns = [
        { title: "Name", field: "fullname" },
        { title: "Applied Date", field: "applieddate" },
        { title: "Employee Code", field: "empcode" },
        { title: "Status", field: "updatestatus" },
        { title: "Assigned Date/Time", field: "assignedtime" },
        { title: "Due Date", field: "duebydate" },
        { title: "Remaining Time", field: "duedate" },
        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
        { title: "Check List", field: "checklist" },
      ];
      break;
    case "exitlist":
      columns = [
        { title: "Employee Name", field: "fullname" },
        { title: "Emp Code", field: "empcode" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Notice Status", field: "approvedthrough" },
        { title: "Assigned Date/Time", field: "assignedtime" },
        { title: "Due Date", field: "duebydate" },
        { title: "Remaining Time", field: "duedate" },

        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
      ];
      break;
    case "longabsentlongleaverestrcitionlist":
      columns = [
        { title: "Employee Status", field: "userstatus" },
        { title: "Employee Name", field: "companyname" },
        { title: "Emp Code", field: "empcode" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Assigned Date/Time", field: "assignedtime" },
        { title: "Due Date", field: "duebydate" },
        { title: "Remaining Time", field: "duedate" },

        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
      ];
      break;
  }
  //------------------------------------------------------

  const [isFilterOpenNew, setIsFilterOpenNew] = useState(false);
  const [isPdfFilterOpenNew, setIsPdfFilterOpenNew] = useState(false);

  // page refersh reload
  const handleCloseFilterModNew = () => {
    setIsFilterOpenNew(false);
  };

  const handleClosePdfFilterModNew = () => {
    setIsPdfFilterOpenNew(false);
  };

  const [fileFormatNew, setFormatNew] = useState("xl");
  const fileTypeNew =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtensionNew = fileFormatNew === "xl" ? ".xlsx" : ".csv";

  const exportToExcelNew = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileTypeNew });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtensionNew);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatDataNew = (data) => {
    return data.map((item, index) => {
      if (fromWhere == "applyleave") {
        return {
          Sno: index + 1,

          Name: item.fullname,
          "Applied Date": item.applieddate,
          "Employee Code": item.empcode,
          Status: item.updatestatus,
          "Assigned Data/Time": item.assignedtime,
          "Due Date": item.duebydate,
          "Remaining Time": item.duedate,
          Category: item.category,
          "Sub Category": item.subcategory,
          CheckList: item.checklist,
        };
      } else if (fromWhere == "applypermission") {
        return {
          Sno: index + 1,

          Name: item.fullname,
          "Applied Date": item.applieddate,
          "Employee Code": item.empcode,
          Status: item.updatestatus,
          "Assigned Data/Time": item.assignedtime,
          "Due Date": item.duebydate,
          "Remaining Time": item.duedate,
          Category: item.category,
          "Sub Category": item.subcategory,
          CheckList: item.checklist,
        };
      } else if (fromWhere == "exitlist") {
        return {
          Sno: index + 1,

          "Employee Name": item.fullname,
          "Employee Code": item.empcode,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Team: item.team,
          "Notice Status": item.approvedthrough,
          Status: item.updatestatus,
          "Assigned Data/Time": item.assignedtime,
          "Due Date": item.duebydate,
          "Remaining Time": item.duedate,
          Category: item.category,
          "Sub Category": item.subcategory,
        };
      } else if (fromWhere == "longabsentlongleaverestrcitionlist") {
        return {
          Sno: index + 1,

          "Employee Status": item.userstatus,
          "Employee Name": item.companyname,
          "Employee Code": item.empcode,
          Company: item.company,
          Branch: item.branch,
          Unit: item.unit,
          Team: item.team,
          Status: item.updatestatus,
          "Assigned Data/Time": item.assignedtime,
          "Due Date": item.duebydate,
          "Remaining Time": item.duedate,
          Category: item.category,
          "Sub Category": item.subcategory,
        };
      }
    });
  };

  const handleExportXLNew = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcelNew(formatDataNew(dataToExport), "My Check List");
    setIsFilterOpenNew(false);
  };

  const downloadPdfNew = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
          }))
        : items?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("My Check List.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "My Check List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchUnassignedCandidates();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => {
      let timeCalc;
      let showTime;
      let dateTimeWithDuration;
      if (
        item?.estimationdata?.split(" ")[1] == "Minutes" ||
        item?.estimationdata?.split(" ")[1] == "Immediate"
      ) {
        let duration = item?.estimationdata?.split(" ")[0];
        duration = parseInt(duration, 10);
        let currentTime = moment();
        let assignedTime = moment(item?.assignedtime);
        let finalFirst = assignedTime.add(duration, "minutes");
        dateTimeWithDuration = finalFirst.format("DD-MM-YYYY hh:mm:ss A");
        timeCalc = finalFirst.diff(currentTime, "minutes");
        showTime = `${timeCalc} Minutes`;
      } else if (item?.estimationdata?.split(" ")[1] == "Hours") {
        let duration = item?.estimationdata?.split(" ")[0];
        duration = parseInt(duration, 10);
        let currentTime = moment();
        let assignedTime = moment(item?.assignedtime);
        let finalFirst = assignedTime.add(duration, "hours");
        dateTimeWithDuration = finalFirst.format("DD-MM-YYYY hh:mm:ss A");
        timeCalc = finalFirst.diff(currentTime, "minutes");
        showTime = `${(timeCalc / 60).toFixed(2)} Hours`;
      } else {
        let duration = item?.estimationdata?.split(" ")[0];
        duration = parseInt(duration, 10);
        let currentTime = moment();
        let assignedTime = moment(item?.assignedtime);
        let finalFirst = assignedTime.add(duration, "days");
        dateTimeWithDuration = finalFirst.format("DD-MM-YYYY hh:mm:ss A");
        timeCalc = finalFirst.diff(currentTime, "minutes");
        showTime = `${(timeCalc / 60).toFixed(2)} Hours`;
      }
      if (fromWhere == "applyleave") {
        return {
          id: item?._id,
          serialNumber: index + 1,
          role: item?.role,
          fullname: item?.employeename,
          empcode: item?.employeeid,
          applieddate: Array.isArray(item?.date)
            ? item?.date?.join(",")
            : item?.date,
          category: item?.category?.join(","),
          subcategory: item?.subcategory.join(","),
          checklist: item?.details.join(","),
          email: item?.email,

          username: item?.username,
          password: item?.originalpassword,
          firstname: item?.firstname,
          lastname: item?.lastname,
          adharnumber: item?.aadhar,
          pannumber: item?.panno,
          dateofbirth: item?.dob,
          mobile: item?.contactpersonal,
          address:
            `${item?.pdoorno ? `${item.pdoorno}, ` : ""}` +
            `${item?.pstreet ? `${item.pstreet}, ` : ""}` +
            `${item?.parea ? `${item.parea}, ` : ""}` +
            `${item?.plandmark ? `${item.plandmark}, ` : ""}` +
            `${item?.ptaluk ? `${item.ptaluk}, ` : ""}` +
            `${item?.ppost ? `${item.ppost}, ` : ""}` +
            `${item?.ppincode ? `${item.ppincode}, ` : ""}` +
            `${item?.pcity ? `${item.pcity}, ` : ""}` +
            `${item?.pstate ? `${item.pstate}, ` : ""}` +
            `${item?.pcountry ? `${item.pcountry}` : ""}`,
          groups: item?.groups,
          information: item?.information,
          updatestatus: item?.updatestatus,
          assignedtime: moment(item?.assignedtime)?.format(
            "DD-MM-YYYY hh:mm:ss A"
          ),
          duedate: Number(timeCalc) > 0 ? showTime : 0,
          duebydate: dateTimeWithDuration,
        };
      } else if (fromWhere == "applypermission") {
        return {
          id: item?._id,
          serialNumber: index + 1,
          role: item?.role,
          fullname: item?.employeename,
          empcode: item?.employeeid,
          applieddate: moment(item?.date).format("DD-MM-YYYY"),
          category: item?.category?.join(","),
          subcategory: item?.subcategory.join(","),
          checklist: item?.details.join(","),
          email: item?.email,

          username: item?.username,
          password: item?.originalpassword,
          firstname: item?.firstname,
          lastname: item?.lastname,
          adharnumber: item?.aadhar,
          pannumber: item?.panno,
          dateofbirth: item?.dob,
          mobile: item?.contactpersonal,
          address:
            `${item?.pdoorno ? `${item.pdoorno}, ` : ""}` +
            `${item?.pstreet ? `${item.pstreet}, ` : ""}` +
            `${item?.parea ? `${item.parea}, ` : ""}` +
            `${item?.plandmark ? `${item.plandmark}, ` : ""}` +
            `${item?.ptaluk ? `${item.ptaluk}, ` : ""}` +
            `${item?.ppost ? `${item.ppost}, ` : ""}` +
            `${item?.ppincode ? `${item.ppincode}, ` : ""}` +
            `${item?.pcity ? `${item.pcity}, ` : ""}` +
            `${item?.pstate ? `${item.pstate}, ` : ""}` +
            `${item?.pcountry ? `${item.pcountry}` : ""}`,
          groups: item?.groups,
          information: item?.information,
          updatestatus: item?.updatestatus,
          assignedtime: moment(item?.assignedtime)?.format(
            "DD-MM-YYYY hh:mm:ss A"
          ),
          duedate: Number(timeCalc) > 0 ? showTime : 0,
          duebydate: dateTimeWithDuration,
        };
      } else if (fromWhere == "exitlist") {
        return {
          id: item?._id,
          serialNumber: index + 1,
          role: item?.role,
          fullname: item?.empname,
          empcode: item?.empcode,
          noticedate: moment(item?.noticedate).format("DD-MM-YYYY"),
          category: item?.category?.join(","),
          subcategory: item?.subcategory.join(","),
          checklist: item?.details,

          approvedthrough: item?.approvedthrough,
          company: item?.company,
          branch: item?.branch,
          unit: item?.unit,
          team: item?.team,

          username: item?.username,
          password: item?.originalpassword,
          firstname: item?.firstname,
          lastname: item?.lastname,
          adharnumber: item?.aadhar,
          pannumber: item?.panno,
          dateofbirth: item?.dob,
          address: `${item?.pstreet}, ${item?.pcity}, ${item?.ppincode}, ${item?.pstate}, ${item?.pcountry}`,
          groups: item?.groups,
          information: item?.information,
          updatestatus: "Approved",
          mobile: item?.contactpersonal,
          email: item?.email,
          updatestatus: item?.updatestatus,
          assignedtime: moment(item?.assignedtime)?.format(
            "DD-MM-YYYY hh:mm:ss A"
          ),
          duedate: Number(timeCalc) > 0 ? showTime : 0,
          duebydate: dateTimeWithDuration,
        };
      } else if (fromWhere == "longabsentlongleaverestrcitionlist") {
        return {
          id: item?._id,
          serialNumber: index + 1,
          userstatus: item.userstatus,
          companyname: item.companyname,
          fullname: item?.companyname,
          empcode: item.empcode,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          category: item?.category?.join(","),
          subcategory: item?.subcategory.join(","),
          groups: item?.groups,
          information: item?.information,
          mobile: item?.contactpersonal,
          checklist: item?.details,
          email: item?.email,
          updatestatus: item?.updatestatus,
          assignedtime: moment(item?.assignedtime)?.format(
            "DD-MM-YYYY hh:mm:ss A"
          ),
          duedate: Number(timeCalc) > 0 ? showTime : 0,
          duebydate: dateTimeWithDuration,
          username: item?.username,
          password: item?.originalpassword,
          firstname: item?.firstname,
          lastname: item?.lastname,
          adharnumber: item?.aadhar,
          pannumber: item?.panno,
          dateofbirth: item?.dob,
          longleaveabsentaprooveddatechecklist: Array.isArray(
            item?.longleaveabsentaprooveddatechecklist
          )
            ? item?.longleaveabsentaprooveddatechecklist
            : [],
          address: `${item?.pstreet}, ${item?.pcity}, ${item?.ppincode}, ${item?.pstate}, ${item?.pcountry}`,
        };
      }
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidates]);

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

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

  let columnDataTable;

  const renderStatus = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color

    switch (status) {
      case "Long Leave":
        icon = <PauseCircleOutlineIcon {...iconProps} />;
        color = "#1976d2"; // Blue
        break;
      case "Long Absent":
        icon = <ErrorIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default gray
    }

    return (
      <Tooltip title={status} arrow>
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            fontSize: "0.75rem",
            padding: "2px 6px",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              overflow: "visible",
              whiteSpace: "normal",
              maxWidth: "none",
            },
          }}
          disableElevation
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {status}
          </Typography>
        </Button>
      </Tooltip>
    );
  };

  switch (fromWhere) {
    case "applyleave":
      columnDataTable = [
        {
          field: "serialNumber",
          headerName: "SNo",
          flex: 0,
          width: 50,
          hide: !columnVisibility.serialNumber,
          headerClassName: "bold-header",
        },
        {
          field: "fullname",
          headerName: "Name",
          flex: 0,
          width: 150,
          hide: !columnVisibility.fullname,
          headerClassName: "bold-header",
        },
        {
          field: "applieddate",
          headerName: "Applied Date",
          flex: 0,
          width: 100,
          hide: !columnVisibility.applieddate,
          headerClassName: "bold-header",
        },
        {
          field: "empcode",
          headerName: "Employee Code",
          flex: 0,
          width: 100,
          hide: !columnVisibility.empcode,
          headerClassName: "bold-header",
        },
        {
          field: "updatestatus",
          headerName: "Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.updatestatus,
          headerClassName: "bold-header",
        },
        {
          field: "assignedtime",
          headerName: "Assigned Date/Time",
          flex: 0,
          width: 180,
          hide: !columnVisibility.assignedtime,
          headerClassName: "bold-header",
        },
        {
          field: "duebydate",
          headerName: "Due Date",
          flex: 0,
          width: 180,
          hide: !columnVisibility.duebydate,
          headerClassName: "bold-header",
        },
        {
          field: "duedate",
          headerName: "Remaining Time",
          flex: 0,
          width: 150,
          hide: !columnVisibility.duedate,
          headerClassName: "bold-header",
        },
        {
          field: "category",
          headerName: "Category",
          flex: 0,
          width: 100,
          hide: !columnVisibility.category,
          headerClassName: "bold-header",
        },
        {
          field: "subcategory",
          headerName: "Sub Category",
          flex: 0,
          width: 150,
          hide: !columnVisibility.subcategory,
          headerClassName: "bold-header",
        },
        {
          field: "checklist",
          headerName: "Check List",
          flex: 0,
          width: 200,
          hide: !columnVisibility.checklist,
          headerClassName: "bold-header",
        },
        {
          field: "mode",
          headerName: "Mode",
          flex: 0,
          width: 180,
          minHeight: "40px !important",
          sortable: false,
          hide: !columnVisibility.mode,
          headerClassName: "bold-header",
          // Assign Bank Detail
          renderCell: (params) => {
            return (
              <Grid sx={{ display: "flex", justifyContent: "center" }}>
                {params.row.updatestatus == "Completed" ? (
                  <div
                    style={{
                      color: "#fff",
                      border: "1px solid #bfbfbf",
                      padding: "2px 20px",
                      borderRadius: "20px",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      backgroundColor: "#bfbfbf",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <span style={{ verticalAlign: "middle" }}>ASSIGNED</span>
                  </div>
                ) : (
                  <>
                    {isUserRoleCompare?.includes("emychecklist") && (
                      <div
                        style={{
                          color: "#fff",
                          border: "1px solid #1565c0",
                          padding: "2px 20px",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                          backgroundColor: "#1565c0",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.color = "#1565c0";
                        }} // Change background color on hover
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#1565c0";
                          e.target.style.color = "#fff";
                        }}
                        onClick={() => {
                          getCode(params.row);
                        }}
                      >
                        ASSIGN
                      </div>
                    )}
                  </>
                )}
              </Grid>
            );
          },
        },
      ];
      break;
    case "applypermission":
      columnDataTable = [
        {
          field: "serialNumber",
          headerName: "SNo",
          flex: 0,
          width: 50,
          hide: !columnVisibility.serialNumber,
          headerClassName: "bold-header",
        },
        {
          field: "fullname",
          headerName: "Name",
          flex: 0,
          width: 150,
          hide: !columnVisibility.fullname,
          headerClassName: "bold-header",
        },
        {
          field: "applieddate",
          headerName: "Applied Date",
          flex: 0,
          width: 100,
          hide: !columnVisibility.applieddate,
          headerClassName: "bold-header",
        },
        {
          field: "empcode",
          headerName: "Employee Code",
          flex: 0,
          width: 100,
          hide: !columnVisibility.empcode,
          headerClassName: "bold-header",
        },
        {
          field: "updatestatus",
          headerName: "Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.updatestatus,
          headerClassName: "bold-header",
        },
        {
          field: "assignedtime",
          headerName: "Assigned Date/Time",
          flex: 0,
          width: 180,
          hide: !columnVisibility.assignedtime,
          headerClassName: "bold-header",
        },
        {
          field: "duebydate",
          headerName: "Due Date",
          flex: 0,
          width: 180,
          hide: !columnVisibility.duebydate,
          headerClassName: "bold-header",
        },
        {
          field: "duedate",
          headerName: "Remaining Time",
          flex: 0,
          width: 150,
          hide: !columnVisibility.duedate,
          headerClassName: "bold-header",
        },
        {
          field: "category",
          headerName: "Category",
          flex: 0,
          width: 100,
          hide: !columnVisibility.category,
          headerClassName: "bold-header",
        },
        {
          field: "subcategory",
          headerName: "Sub Category",
          flex: 0,
          width: 150,
          hide: !columnVisibility.subcategory,
          headerClassName: "bold-header",
        },
        {
          field: "checklist",
          headerName: "Check List",
          flex: 0,
          width: 200,
          hide: !columnVisibility.checklist,
          headerClassName: "bold-header",
        },
        {
          field: "mode",
          headerName: "Mode",
          flex: 0,
          width: 180,
          minHeight: "40px !important",
          sortable: false,
          hide: !columnVisibility.mode,
          headerClassName: "bold-header",
          // Assign Bank Detail
          renderCell: (params) => {
            return (
              <Grid sx={{ display: "flex", justifyContent: "center" }}>
                {params.row.updatestatus == "Completed" ? (
                  <div
                    style={{
                      color: "#fff",
                      border: "1px solid #bfbfbf",
                      padding: "2px 20px",
                      borderRadius: "20px",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      backgroundColor: "#bfbfbf",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <span style={{ verticalAlign: "middle" }}>ASSIGNED</span>
                  </div>
                ) : (
                  <>
                    {isUserRoleCompare?.includes("emychecklist") && (
                      <div
                        style={{
                          color: "#fff",
                          border: "1px solid #1565c0",
                          padding: "2px 20px",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                          backgroundColor: "#1565c0",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.color = "#1565c0";
                        }} // Change background color on hover
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#1565c0";
                          e.target.style.color = "#fff";
                        }}
                        onClick={() => {
                          getCode(params.row);
                        }}
                      >
                        ASSIGN
                      </div>
                    )}
                  </>
                )}
              </Grid>
            );
          },
        },
      ];
      break;

    case "exitlist":
      columnDataTable = [
        {
          field: "serialNumber",
          headerName: "SNo",
          flex: 0,
          width: 50,
          hide: !columnVisibility.serialNumber,
          headerClassName: "bold-header",
        },
        {
          field: "fullname",
          headerName: "Employee Name",
          flex: 0,
          width: 150,
          hide: !columnVisibility.fullname,
          headerClassName: "bold-header",
        },
        {
          field: "empcode",
          headerName: "Emp Code",
          flex: 0,
          width: 150,
          hide: !columnVisibility.empcode,
          headerClassName: "bold-header",
        },
        {
          field: "company",
          headerName: "Company",
          flex: 0,
          width: 100,
          hide: !columnVisibility.company,
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
          field: "noticedate",
          headerName: "Notice Date",
          flex: 0,
          width: 100,
          hide: !columnVisibility.noticedate,
          headerClassName: "bold-header",
        },
        {
          field: "approvedthrough",
          headerName: "Notice Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.approvedthrough,
          headerClassName: "bold-header",
        },
        {
          field: "updatestatus",
          headerName: "Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.updatestatus,
          headerClassName: "bold-header",
        },
        {
          field: "assignedtime",
          headerName: "Assigned Date/Time",
          flex: 0,
          width: 180,
          hide: !columnVisibility.assignedtime,
          headerClassName: "bold-header",
        },
        {
          field: "duebydate",
          headerName: "Due Date",
          flex: 0,
          width: 180,
          hide: !columnVisibility.duebydate,
          headerClassName: "bold-header",
        },
        {
          field: "duedate",
          headerName: "Remaining Time",
          flex: 0,
          width: 150,
          hide: !columnVisibility.duedate,
          headerClassName: "bold-header",
        },
        {
          field: "category",
          headerName: "Category",
          flex: 0,
          width: 100,
          hide: !columnVisibility.category,
          headerClassName: "bold-header",
        },
        {
          field: "subcategory",
          headerName: "Sub Category",
          flex: 0,
          width: 150,
          hide: !columnVisibility.subcategory,
          headerClassName: "bold-header",
        },
        {
          field: "checklist",
          headerName: "Check List",
          flex: 0,
          width: 200,
          hide: !columnVisibility.checklist,
          headerClassName: "bold-header",
        },
        {
          field: "mode",
          headerName: "Mode",
          flex: 0,
          width: 180,
          minHeight: "40px !important",
          sortable: false,
          hide: !columnVisibility.mode,
          headerClassName: "bold-header",
          // Assign Bank Detail
          renderCell: (params) => {
            return (
              <Grid sx={{ display: "flex", justifyContent: "center" }}>
                {params.row.updatestatus == "Completed" ? (
                  <div
                    style={{
                      color: "#fff",
                      border: "1px solid #bfbfbf",
                      padding: "2px 20px",
                      borderRadius: "20px",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      backgroundColor: "#bfbfbf",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <span style={{ verticalAlign: "middle" }}>ASSIGNED</span>
                  </div>
                ) : (
                  <>
                    {isUserRoleCompare?.includes("emychecklist") && (
                      <div
                        style={{
                          color: "#fff",
                          border: "1px solid #1565c0",
                          padding: "2px 20px",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                          backgroundColor: "#1565c0",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.color = "#1565c0";
                        }} // Change background color on hover
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#1565c0";
                          e.target.style.color = "#fff";
                        }}
                        onClick={() => {
                          getCode(params.row);
                        }}
                      >
                        ASSIGN
                      </div>
                    )}
                  </>
                )}
              </Grid>
            );
          },
        },
      ];

      break;
    case "longabsentlongleaverestrcitionlist":
      columnDataTable = [
        {
          field: "serialNumber",
          headerName: "SNo",
          flex: 0,
          width: 50,
          hide: !columnVisibility.serialNumber,
          headerClassName: "bold-header",
        },
        {
          field: "userstatus",
          headerName: "Employee Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.userstatus,
          minHeight: "40px",
          renderCell: (params) => renderStatus(params?.row.userstatus),
        },

        {
          field: "companyname",
          headerName: "Employee Name",
          flex: 0,
          width: 150,
          hide: !columnVisibility.companyname,
          headerClassName: "bold-header",
        },
        {
          field: "empcode",
          headerName: "Emp Code",
          flex: 0,
          width: 150,
          hide: !columnVisibility.empcode,
          headerClassName: "bold-header",
        },
        {
          field: "company",
          headerName: "Company",
          flex: 0,
          width: 100,
          hide: !columnVisibility.company,
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
          field: "category",
          headerName: "Category",
          flex: 0,
          width: 100,
          hide: !columnVisibility.category,
          headerClassName: "bold-header",
        },
        {
          field: "subcategory",
          headerName: "Sub Category",
          flex: 0,
          width: 150,
          hide: !columnVisibility.subcategory,
          headerClassName: "bold-header",
        },
        {
          field: "checklist",
          headerName: "Check List",
          flex: 0,
          width: 200,
          hide: !columnVisibility.checklist,
          headerClassName: "bold-header",
        },
        {
          field: "mode",
          headerName: "Mode",
          flex: 0,
          width: 180,
          minHeight: "40px !important",
          sortable: false,
          hide: !columnVisibility.mode,
          headerClassName: "bold-header",
          // Assign Bank Detail
          renderCell: (params) => {
            return (
              <Grid sx={{ display: "flex", justifyContent: "center" }}>
                {params.row.updatestatus == "Completed" &&
                params?.row?.longleaveabsentaprooveddatechecklist?.includes(
                  moment().format("DD-MM-YYYY")
                ) ? (
                  <div
                    style={{
                      color: "#fff",
                      border: "1px solid #bfbfbf",
                      padding: "2px 20px",
                      borderRadius: "20px",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      backgroundColor: "#bfbfbf",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <span style={{ verticalAlign: "middle" }}>ASSIGNED</span>
                  </div>
                ) : (
                  <>
                    {isUserRoleCompare?.includes("emychecklist") && (
                      <div
                        style={{
                          color: "#fff",
                          border: "1px solid #1565c0",
                          padding: "2px 20px",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                          backgroundColor: "#1565c0",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#fff";
                          e.target.style.color = "#1565c0";
                        }} // Change background color on hover
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#1565c0";
                          e.target.style.color = "#fff";
                        }}
                        onClick={() => {
                          getCode(params.row);
                        }}
                      >
                        ASSIGN
                      </div>
                    )}
                  </>
                )}
              </Grid>
            );
          },
        },
      ];

      break;

    default:
      columnDataTable = [
        {
          field: "serialNumber",
          headerName: "SNo",
          flex: 0,
          width: 50,
          hide: !columnVisibility.serialNumber,
          headerClassName: "bold-header",
        },
        {
          field: "name",
          headerName: "Name",
          flex: 0,
          width: 150,
          hide: !columnVisibility.name,
          headerClassName: "bold-header",
        },
        {
          field: "applieddate",
          headerName: "Applied Date",
          flex: 0,
          width: 100,
          hide: !columnVisibility.applieddate,
          headerClassName: "bold-header",
        },
        {
          field: "empcode",
          headerName: "Employee Code",
          flex: 0,
          width: 100,
          hide: !columnVisibility.empcode,
          headerClassName: "bold-header",
        },
        {
          field: "updatestatus",
          headerName: "Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.updatestatus,
          headerClassName: "bold-header",
        },
        {
          field: "category",
          headerName: "Category",
          flex: 0,
          width: 100,
          hide: !columnVisibility.category,
          headerClassName: "bold-header",
        },
        {
          field: "subcategory",
          headerName: "Sub Category",
          flex: 0,
          width: 150,
          hide: !columnVisibility.subcategory,
          headerClassName: "bold-header",
        },
        {
          field: "checklist",
          headerName: "Check List",
          flex: 0,
          width: 200,
          hide: !columnVisibility.checklist,
          headerClassName: "bold-header",
        },
      ];
  }

  const rowDataTable = filteredData.map((item, index) => {
    if (fromWhere == "applyleave") {
      return {
        id: item?.id,
        serialNumber: item?.serialNumber,
        role: item?.role,
        fullname: item?.fullname,
        empcode: item?.empcode,
        applieddate: item?.applieddate,
        category: item?.category,
        subcategory: item?.subcategory,
        checklist: item?.checklist,
        email: item?.email,
        mobile: item?.mobile,

        username: item?.username,
        password: item?.password,
        firstname: item?.firstname,
        lastname: item?.lastname,
        adharnumber: item?.adharnumber,
        pannumber: item?.pannumber,
        dateofbirth: item?.dateofbirth,
        address: item?.address,
        groups: item?.groups,
        information: item?.information,
        updatestatus: item?.updatestatus,
        assignedtime: item?.assignedtime,
        duedate: item?.duedate,
        duebydate: item?.duebydate,
      };
    } else if (fromWhere == "applypermission") {
      return {
        id: item?.id,
        serialNumber: item?.serialNumber,
        role: item?.role,
        fullname: item?.fullname,
        empcode: item?.empcode,
        applieddate: item?.applieddate,
        category: item?.category,
        subcategory: item?.subcategory,
        checklist: item?.checklist,

        email: item?.email,
        mobile: item?.mobile,

        username: item?.username,
        password: item?.password,
        firstname: item?.firstname,
        lastname: item?.lastname,
        adharnumber: item?.adharnumber,
        pannumber: item?.pannumber,
        dateofbirth: item?.dateofbirth,
        address: item?.address,
        groups: item?.groups,
        information: item?.information,
        updatestatus: item?.updatestatus,
        assignedtime: item?.assignedtime,
        duedate: item?.duedate,
        duebydate: item?.duebydate,
      };
    } else if (fromWhere == "exitlist") {
      return {
        id: item?.id,
        serialNumber: item?.serialNumber,
        role: item?.role,
        fullname: item?.fullname,
        empcode: item?.empcode,
        noticedate: item?.noticedate,
        category: item?.category,
        subcategory: item?.subcategory,
        checklist: item?.checklist,

        approvedthrough: item?.approvedthrough,
        company: item?.company,
        branch: item?.branch,
        unit: item?.unit,
        team: item?.team,

        username: item?.username,
        password: item?.password,
        email: item?.email,
        mobile: item?.mobile,
        firstname: item?.firstname,
        lastname: item?.lastname,
        adharnumber: item?.adharnumber,
        pannumber: item?.pannumber,
        dateofbirth: item?.dateofbirth,
        address: item?.address,
        groups: item?.groups,
        information: item?.information,
        updatestatus: "Approved",
        mobile: item?.mobile,
        email: item?.email,
        updatestatus: item?.updatestatus,
        assignedtime: item?.assignedtime,
        duedate: item?.duedate,
        duebydate: item?.duebydate,
      };
    } else if (fromWhere == "longabsentlongleaverestrcitionlist") {
      return {
        id: item?.id,
        serialNumber: item?.serialNumber,
        userstatus: item?.userstatus,
        companyname: item?.companyname,
        fullname: item?.companyname,
        empcode: item?.empcode,
        category: item?.category,
        subcategory: item?.subcategory,
        checklist: item?.checklist,

        company: item?.company,
        branch: item?.branch,
        unit: item?.unit,
        team: item?.team,
        groups: item?.groups,
        information: item?.information,
        updatestatus: item?.updatestatus,
        assignedtime: item?.assignedtime,
        duedate: item?.duedate,
        duebydate: item?.duebydate,
        username: item?.username,
        password: item?.password,
        email: item?.email,
        mobile: item?.mobile,
        firstname: item?.firstname,
        lastname: item?.lastname,
        adharnumber: item?.adharnumber,
        pannumber: item?.pannumber,
        dateofbirth: item?.dateofbirth,
        address: item?.address,
        longleaveabsentaprooveddatechecklist:
          item?.longleaveabsentaprooveddatechecklist,
      };
    }
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

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
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
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"MY CHECK LIST"} />
      <PageHeading
        title="My Check List"
        modulename="Checklist"
        submodulename="My Check List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />

      <br />

      <>
        {tableCount === 1 ? (
          <>
            {/*----------Second Table----------------------------------------------------------------------------------------------------------------- */}
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmychecklist") && (
              <>
                <Box sx={userStyle.container}>
                  {/* ******************************************************EXPORT Buttons****************************************************** */}
                  <ScrollingText text="This Page is Not Applicable for 1. Action Employee List 2. Deactivate Employee List 3. Active Intern List 4. Deactivate Intern List 5.Rejoined Employee List 6.Job Openings" />
                  <br />
                  <Grid container spacing={2} style={userStyle.dataTablestyle}>
                    <Grid item md={2} xs={12} sm={12}>
                      <Box>
                        <label>Show entries:</label>
                        <Select
                          id="pageSizeSelect"
                          value={pageSizeTwo}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 180,
                                width: 80,
                              },
                            },
                          }}
                          onChange={handlePageSizeChangeTwo}
                          sx={{ width: "77px" }}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
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
                        {isUserRoleCompare?.includes("excelmychecklist") && (
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
                        {isUserRoleCompare?.includes("csvmychecklist") && (
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
                        {isUserRoleCompare?.includes("printmychecklist") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprintTwo}
                            >
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("pdfmychecklist") && (
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
                        {isUserRoleCompare?.includes("imagemychecklist") && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImageTwo}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                    <Grid item md={2} xs={6} sm={6}>
                      <Box>
                        <FormControl fullWidth size="small">
                          <Typography>Search</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={searchQueryTwo}
                            onChange={handleSearchChangeTwo}
                          />
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <br />
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleShowAllColumnsTwo}
                  >
                    Show All Columns
                  </Button>
                  &ensp;
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleOpenManageColumnsTwo}
                  >
                    Manage Columns
                  </Button>
                  &ensp;
                  <br />
                  <br />
                  {tableThree ? (
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
                          rows={rowDataTableTwo}
                          columns={columnDataTableTwo.filter(
                            (column) => columnVisibilityTwo[column.field]
                          )}
                          onSelectionModelChange={handleSelectionChange}
                          selectionModel={selectedRows}
                          autoHeight={true}
                          ref={gridRefTwo}
                          density="compact"
                          hideFooter
                          getRowClassName={getRowClassName}
                          disableRowSelectionOnClick
                        />
                      </Box>
                      <Box style={userStyle.dataTablestyle}>
                        <Box>
                          Showing{" "}
                          {filteredDataTwo.length > 0
                            ? (pageTwo - 1) * pageSizeTwo + 1
                            : 0}{" "}
                          to{" "}
                          {Math.min(
                            pageTwo * pageSizeTwo,
                            filteredDataTwos.length
                          )}{" "}
                          of {filteredDataTwos.length} entries
                        </Box>
                        <Box>
                          <Button
                            onClick={() => setPageTwo(1)}
                            disabled={pageTwo === 1}
                            sx={userStyle.paginationbtn}
                          >
                            <FirstPageIcon />
                          </Button>
                          <Button
                            onClick={() => handlePageChangeTwo(pageTwo - 1)}
                            disabled={pageTwo === 1}
                            sx={userStyle.paginationbtn}
                          >
                            <NavigateBeforeIcon />
                          </Button>
                          {pageNumbersTwo?.map((pageNumber) => (
                            <Button
                              key={pageNumber}
                              sx={userStyle.paginationbtn}
                              onClick={() => handlePageChangeTwo(pageNumber)}
                              className={pageTwo === pageNumber ? "active" : ""}
                              disabled={pageTwo === pageNumber}
                            >
                              {pageNumber}
                            </Button>
                          ))}
                          {lastVisiblePageTwo < totalPagesTwo && (
                            <span>...</span>
                          )}
                          <Button
                            onClick={() => handlePageChangeTwo(pageTwo + 1)}
                            disabled={pageTwo === totalPagesTwo}
                            sx={userStyle.paginationbtn}
                          >
                            <NavigateNextIcon />
                          </Button>
                          <Button
                            onClick={() => setPageTwo(totalPagesTwo)}
                            disabled={pageTwo === totalPagesTwo}
                            sx={userStyle.paginationbtn}
                          >
                            <LastPageIcon />
                          </Button>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </>
            )}
            {/* Manage Column */}
            <Popover
              id={idTwo}
              open={isManageColumnsOpenTwo}
              anchorEl={anchorElTwo}
              onClose={handleCloseManageColumnsTwo}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentTwo}
            </Popover>
            <br />
          </>
        ) : (
          <>
            {isUserRoleCompare?.includes("lmychecklist") && (
              <>
                <Box sx={userStyle.container}>
                  {/* ******************************************************EXPORT Buttons****************************************************** */}
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={12}
                      lg={12}
                      xs={12}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={userStyle.SubHeaderText}
                        onClick={() => {
                          console.log(excludedGroupDatas);
                        }}
                      >
                        My Check List
                      </Typography>
                      <div
                        style={{
                          color: "#fff",
                          border: "1px solid #1565c0",
                          padding: "2px 20px",
                          borderRadius: "20px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                          backgroundColor: "#1565c0",
                        }}
                        onClick={() => {
                          setTableCount(1);
                        }}
                      >
                        <FirstPageIcon
                          sx={{
                            color: "#fff",
                            fontSize: "1.5rem",
                            verticalAlign: "middle",
                          }}
                        />{" "}
                        <span style={{ verticalAlign: "middle" }}>BACK</span>
                      </div>
                    </Grid>
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
                        {isUserRoleCompare?.includes("excelmychecklist") && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpenNew(true);
                                setFormatNew("xl");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileExcel />
                              &ensp;Export to Excel&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("csvmychecklist") && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpenNew(true);
                                setFormatNew("csv");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileCsv />
                              &ensp;Export to CSV&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("printmychecklist") && (
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
                        {isUserRoleCompare?.includes("pdfmychecklist") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpenNew(true);
                              }}
                            >
                              <FaFilePdf />
                              &ensp;Export to PDF&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("printmychecklist") && (
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
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleShowAllColumns}
                  >
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
                  <br />
                  <br />
                  {isBankdetail ? (
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
                          {filteredData.length > 0
                            ? (page - 1) * pageSize + 1
                            : 0}{" "}
                          to {Math.min(page * pageSize, filteredDatas.length)}{" "}
                          of {filteredDatas.length} entries
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
          </>
        )}
      </>

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
              Unassigned Candidate Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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

      {fromWhere === "applyleave" && (
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table aria-label="simple table" id="branch" ref={componentRef}>
            <TableHead sx={{ fontWeight: "200" }}>
              <StyledTableRow>
                <StyledTableCell>SI.NO</StyledTableCell>

                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Applied Date</StyledTableCell>
                <StyledTableCell>Employee Code</StyledTableCell>

                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned Date/Time</StyledTableCell>
                <StyledTableCell>Due Date</StyledTableCell>
                <StyledTableCell>Remaining Time</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell>Check List</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell> {row.fullname}</StyledTableCell>
                    <StyledTableCell> {row.applieddate}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.updatestatus}</StyledTableCell>
                    <StyledTableCell> {row.assignedtime}</StyledTableCell>
                    <StyledTableCell> {row.duebydate}</StyledTableCell>
                    <StyledTableCell> {row.duedate}</StyledTableCell>
                    <StyledTableCell> {row.category}</StyledTableCell>
                    <StyledTableCell> {row.subcategory}</StyledTableCell>
                    <StyledTableCell> {row.checklist}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {fromWhere === "applypermission" && (
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table aria-label="simple table" id="branch" ref={componentRef}>
            <TableHead sx={{ fontWeight: "200" }}>
              <StyledTableRow>
                <StyledTableCell>SI.NO</StyledTableCell>

                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Applied Date</StyledTableCell>
                <StyledTableCell>Employee Code</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned Date/Time</StyledTableCell>
                <StyledTableCell>Due Date</StyledTableCell>
                <StyledTableCell>Remaining Time</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell>Check List</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell> {row.fullname}</StyledTableCell>
                    <StyledTableCell> {row.applieddate}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.updatestatus}</StyledTableCell>
                    <StyledTableCell> {row.assignedtime}</StyledTableCell>
                    <StyledTableCell> {row.duebydate}</StyledTableCell>
                    <StyledTableCell> {row.duedate}</StyledTableCell>
                    <StyledTableCell> {row.category}</StyledTableCell>
                    <StyledTableCell> {row.subcategory}</StyledTableCell>
                    <StyledTableCell> {row.checklist}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {fromWhere === "exitlist" && (
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table aria-label="simple table" id="branch" ref={componentRef}>
            <TableHead sx={{ fontWeight: "200" }}>
              <StyledTableRow>
                <StyledTableCell>SI.NO</StyledTableCell>

                <StyledTableCell>Employee Name</StyledTableCell>
                <StyledTableCell>Employee ID</StyledTableCell>
                <StyledTableCell>Company</StyledTableCell>
                <StyledTableCell>Branch</StyledTableCell>
                <StyledTableCell>Unit</StyledTableCell>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell>Notice Status</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned Date/Time</StyledTableCell>
                <StyledTableCell>Due Date</StyledTableCell>
                <StyledTableCell>Remaining Time</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell> {row.fullname}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.company}</StyledTableCell>
                    <StyledTableCell> {row.branch}</StyledTableCell>
                    <StyledTableCell> {row.unit}</StyledTableCell>
                    <StyledTableCell> {row.team}</StyledTableCell>

                    <StyledTableCell> {row.approvedthrough}</StyledTableCell>

                    <StyledTableCell> {row.updatestatus}</StyledTableCell>
                    <StyledTableCell> {row.assignedtime}</StyledTableCell>
                    <StyledTableCell> {row.duebydate}</StyledTableCell>
                    <StyledTableCell> {row.duedate}</StyledTableCell>
                    <StyledTableCell> {row.category}</StyledTableCell>
                    <StyledTableCell> {row.subcategory}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {fromWhere === "longabsentlongleaverestrcitionlist" && (
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table aria-label="simple table" id="branch" ref={componentRef}>
            <TableHead sx={{ fontWeight: "200" }}>
              <StyledTableRow>
                <StyledTableCell>SI.NO</StyledTableCell>

                <StyledTableCell>Employee Status</StyledTableCell>
                <StyledTableCell>Employee Name</StyledTableCell>
                <StyledTableCell>Employee ID</StyledTableCell>
                <StyledTableCell>Company</StyledTableCell>
                <StyledTableCell>Branch</StyledTableCell>
                <StyledTableCell>Unit</StyledTableCell>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Assigned Date/Time</StyledTableCell>
                <StyledTableCell>Due Date</StyledTableCell>
                <StyledTableCell>Remaining Time</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell> {row.userstatus}</StyledTableCell>
                    <StyledTableCell> {row.companyname}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.company}</StyledTableCell>
                    <StyledTableCell> {row.branch}</StyledTableCell>
                    <StyledTableCell> {row.unit}</StyledTableCell>
                    <StyledTableCell> {row.team}</StyledTableCell>

                    <StyledTableCell> {row.updatestatus}</StyledTableCell>
                    <StyledTableCell> {row.assignedtime}</StyledTableCell>
                    <StyledTableCell> {row.duebydate}</StyledTableCell>
                    <StyledTableCell> {row.duedate}</StyledTableCell>
                    <StyledTableCell> {row.category}</StyledTableCell>
                    <StyledTableCell> {row.subcategory}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefTwo}>
          <TableHead sx={{ fontWeight: "500" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Module Name</StyledTableCell>
              <StyledTableCell>Sub Module Name</StyledTableCell>
              <StyledTableCell>Main Page</StyledTableCell>
              <StyledTableCell>Sub Page</StyledTableCell>
              <StyledTableCell>Sub Sub Page</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableTwo &&
              rowDataTableTwo.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.module}</StyledTableCell>
                  <StyledTableCell> {row.submodule}</StyledTableCell>
                  <StyledTableCell> {row.mainpage}</StyledTableCell>
                  <StyledTableCell> {row.subpage}</StyledTableCell>
                  <StyledTableCell> {row.subsubpage}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLTwo("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLTwo("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfTwo("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfTwo("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/* for second */}
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpenNew}
        onClose={handleCloseFilterModNew}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {fileFormatNew === "xl" ? (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterModNew}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterModNew}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLNew("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLNew("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpenNew}
        onClose={handleClosePdfFilterModNew}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterModNew}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfNew("filtered");
              setIsPdfFilterOpenNew(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfNew("overall");
              setIsPdfFilterOpenNew(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseModEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        fullWidth={true}
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography
              sx={userStyle.SubHeaderText}
              onClick={() => {
                console.log(excludedGroupDatas);
              }}
            >
              My Check List
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid black",
                    borderRadius: "20px",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
                    Candidate Name:{" "}
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        display: "inline-block",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {`${getDetails?.fullname}`}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Details
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>Field</TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Assigned At
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Assigned Limit
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Due Date
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>Status</TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>Action</TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Category
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Sub Category
                    </TableCell>

                    {/* Add more table headers as needed */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupDetails?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.details}</TableCell>
                      {(() => {
                        switch (row.checklist) {
                          case "Text Box":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  value={row.data}
                                  // disabled={disableInput[index]}
                                  onChange={(e) => {
                                    handleDataChange(e, index, "Text Box");
                                  }}
                                />
                              </TableCell>
                            );
                          case "Text Box-number":
                            return (
                              <TableCell>
                                <Input
                                  value={row.data}
                                  style={{ height: "32px" }}
                                  type="number"
                                  onChange={(e) => {
                                    handleDataChange(
                                      e,
                                      index,
                                      "Text Box-number"
                                    );
                                  }}
                                />
                              </TableCell>
                            );
                          case "Text Box-alpha":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  value={row.data}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const filteredValue = inputValue.replace(
                                      /[^a-zA-Z]/g,
                                      ""
                                    );

                                    // Update the value in state with the filtered value
                                    handleDataChange(
                                      { target: { value: filteredValue } },
                                      index,
                                      "Text Box-alpha"
                                    );
                                  }}
                                />
                              </TableCell>
                            );
                          case "Text Box-alphanumeric":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  value={row.data}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                      handleDataChange(
                                        e,
                                        index,
                                        "Text Box-alphanumeric"
                                      );
                                    }
                                  }}
                                  inputProps={{ pattern: "[A-Za-z0-9]*" }}
                                />
                              </TableCell>
                            );
                          case "Attachments":
                            return (
                              <TableCell>
                                <div>
                                  <InputLabel sx={{ m: 1 }}>File</InputLabel>

                                  <div>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        marginTop: "10px",
                                        gap: "10px",
                                      }}
                                    >
                                      <Box item md={4} sm={4}>
                                        <section>
                                          <input
                                            type="file"
                                            accept="*/*"
                                            id={index}
                                            onChange={(e) => {
                                              handleChangeImage(e, index);
                                            }}
                                            style={{ display: "none" }}
                                          />
                                          <label htmlFor={index}>
                                            <Typography
                                              sx={userStyle.uploadbtn}
                                            >
                                              Upload
                                            </Typography>
                                          </label>
                                          <br />
                                        </section>
                                      </Box>

                                      <Box item md={4} sm={4}>
                                        <Button
                                          onClick={showWebcam}
                                          variant="contained"
                                          sx={userStyle.uploadbtn}
                                        >
                                          <CameraAltIcon />
                                        </Button>
                                      </Box>
                                      {row.files && (
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            lg={8}
                                            md={8}
                                            sm={8}
                                            xs={8}
                                          >
                                            <Typography>
                                              {row.files.name}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}
                                          >
                                            <VisibilityOutlinedIcon
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                renderFilePreviewEdit(row.files)
                                              }
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}
                                          >
                                            <Button
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                                marginTop: "-5px",
                                              }}
                                              onClick={() =>
                                                handleFileDeleteEdit(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </Button>
                                          </Grid>
                                        </Grid>
                                      )}
                                    </Box>
                                  </div>
                                  <Dialog
                                    open={isWebcamOpen}
                                    onClose={webcamClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                  >
                                    <DialogContent
                                      sx={{
                                        textAlign: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Webcamimage
                                        getImg={getImg}
                                        setGetImg={setGetImg}
                                        capturedImages={capturedImages}
                                        valNum={valNum}
                                        setValNum={setValNum}
                                        name={name}
                                      />
                                    </DialogContent>
                                    <DialogActions>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={webcamDataStore}
                                      >
                                        OK
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        onClick={webcamClose}
                                      >
                                        CANCEL
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </div>
                              </TableCell>
                            );
                          case "Pre-Value":
                            return (
                              <TableCell>
                                <Typography>{row?.data}</Typography>
                              </TableCell>
                            );
                          case "Date":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  type="date"
                                  value={row.data}
                                  onChange={(e) => {
                                    handleDataChange(e, index, "Date");
                                  }}
                                />
                              </TableCell>
                            );
                          case "Time":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  type="time"
                                  value={row.data}
                                  onChange={(e) => {
                                    handleDataChange(e, index, "Time");
                                  }}
                                />
                              </TableCell>
                            );
                          case "DateTime":
                            return (
                              <TableCell>
                                <Stack direction="row" spacing={2}>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="date"
                                    value={dateValue[index]}
                                    onChange={(e) => {
                                      updateDateValuesAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                  <OutlinedInput
                                    type="time"
                                    style={{ height: "32px" }}
                                    value={timeValue[index]}
                                    onChange={(e) => {
                                      updateTimeValuesAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                            );
                          case "Date Multi Span":
                            return (
                              <TableCell>
                                <Stack direction="row" spacing={2}>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="date"
                                    value={dateValueMultiFrom[index]}
                                    onChange={(e) => {
                                      updateFromDateValueAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                  <OutlinedInput
                                    type="date"
                                    style={{ height: "32px" }}
                                    value={dateValueMultiTo[index]}
                                    onChange={(e) => {
                                      updateToDateValueAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                            );
                          case "Date Multi Span Time":
                            return (
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                  }}
                                >
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={firstDateValue[index]}
                                      onChange={(e) => {
                                        updateFirstDateValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: "32px" }}
                                      value={firstTimeValue[index]}
                                      onChange={(e) => {
                                        updateFirstTimeValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                  </Stack>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      type="date"
                                      style={{ height: "32px" }}
                                      value={secondDateValue[index]}
                                      onChange={(e) => {
                                        updateSecondDateValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="time"
                                      value={secondTimeValue[index]}
                                      onChange={(e) => {
                                        updateSecondTimeValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                  </Stack>
                                </div>
                              </TableCell>
                            );
                          case "Date Multi Random":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  type="date"
                                  value={row.data}
                                  onChange={(e) => {
                                    handleDataChange(
                                      e,
                                      index,
                                      "Date Multi Random"
                                    );
                                  }}
                                />
                              </TableCell>
                            );
                          case "Date Multi Random Time":
                            return (
                              <TableCell>
                                <Stack direction="row" spacing={2}>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="date"
                                    value={dateValueRandom[index]}
                                    onChange={(e) => {
                                      updateDateValueAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                  <OutlinedInput
                                    type="time"
                                    style={{ height: "32px" }}
                                    value={timeValueRandom[index]}
                                    onChange={(e) => {
                                      updateTimeValueAtIndex(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                            );
                          case "Radio":
                            return (
                              <TableCell>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    value={row.data}
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row !important",
                                    }}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Radio");
                                    }}
                                  >
                                    <FormControlLabel
                                      value="No"
                                      control={<Radio />}
                                      label="No"
                                    />
                                    <FormControlLabel
                                      value="Yes"
                                      control={<Radio />}
                                      label="Yes"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </TableCell>
                            );

                          default:
                            return <TableCell></TableCell>; // Default case
                        }
                      })()}
                      <TableCell>
                        {moment(row?.assignedtime)?.format(
                          "DD-MM-YYYY HH:mm:ss"
                        )}
                      </TableCell>
                      <TableCell>{`${row?.estimationtime} ${row?.estimation}`}</TableCell>
                      <TableCell>
                        {(() => {
                          let timeCalc;
                          let showTime;
                          const duration = parseInt(row?.estimationtime, 10);
                          const currentTime = moment();
                          const assignedTime = moment(row?.assignedtime);
                          let finalFirst;

                          switch (row?.estimation) {
                            case "Minutes":
                            case "Immediate":
                              finalFirst = assignedTime.add(
                                duration,
                                "minutes"
                              );
                              timeCalc = finalFirst.diff(
                                currentTime,
                                "minutes"
                              );
                              showTime = `${timeCalc} Minutes`;
                              break;

                            case "Hours":
                              finalFirst = assignedTime.add(duration, "hours");
                              timeCalc = finalFirst.diff(
                                currentTime,
                                "minutes"
                              );
                              showTime = `${(timeCalc / 60).toFixed(2)} Hours`;
                              break;

                            case "Days":
                              finalFirst = assignedTime.add(duration, "days");
                              timeCalc = finalFirst.diff(
                                currentTime,
                                "minutes"
                              );
                              showTime = `${(timeCalc / 60).toFixed(2)} Hours`;
                              break;

                            default:
                              showTime = "";
                          }

                          return Number(timeCalc) > 0 ? showTime : 0;
                        })()}
                      </TableCell>

                      <TableCell>
                        {row.checklist === "DateTime" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 16 ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )
                        ) : row.checklist === "Date Multi Span" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 21 ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )
                        ) : row.checklist === "Date Multi Span Time" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 33 ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )
                        ) : row.checklist === "Date Multi Random Time" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 16 ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )
                        ) : (row.data !== undefined && row.data !== "") ||
                          row.files !== undefined ? (
                          <Typography>Completed</Typography>
                        ) : (
                          <Typography>Pending</Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        {row.checklist === "DateTime" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 16 ? (
                            <>
                              <IconButton
                                sx={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: "#1565c0", cursor: "pointer" }}
                              onClick={() => {
                                let itemValue = disableInput[index];
                                itemValue = false;
                                let spreadData = [...disableInput];
                                spreadData[index] = false;
                                setDisableInput(spreadData);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )
                        ) : row.checklist === "Date Multi Span" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 21 ? (
                            <>
                              <IconButton
                                sx={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: "#1565c0", cursor: "pointer" }}
                              onClick={() => {
                                let itemValue = disableInput[index];
                                itemValue = false;
                                let spreadData = [...disableInput];
                                spreadData[index] = false;
                                setDisableInput(spreadData);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )
                        ) : row.checklist === "Date Multi Span Time" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 33 ? (
                            <>
                              <IconButton
                                sx={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: "#1565c0", cursor: "pointer" }}
                              onClick={() => {
                                let itemValue = disableInput[index];
                                itemValue = false;
                                let spreadData = [...disableInput];
                                spreadData[index] = false;
                                setDisableInput(spreadData);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )
                        ) : row.checklist === "Date Multi Random Time" ? (
                          ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                          row.data.length === 16 ? (
                            <>
                              <IconButton
                                sx={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: "#1565c0", cursor: "pointer" }}
                              onClick={() => {
                                let itemValue = disableInput[index];
                                itemValue = false;
                                let spreadData = [...disableInput];
                                spreadData[index] = false;
                                setDisableInput(spreadData);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )
                        ) : (row.data !== undefined && row.data !== "") ||
                          row.files !== undefined ? (
                          <>
                            <IconButton
                              sx={{ color: "green", cursor: "pointer" }}
                              onClick={() => {
                                updateIndividualData(index);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            sx={{ color: "#1565c0", cursor: "pointer" }}
                            onClick={() => {
                              let itemValue = disableInput[index];
                              itemValue = false;
                              let spreadData = [...disableInput];
                              spreadData[index] = false;
                              setDisableInput(spreadData);
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.subcategory}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br /> <br /> <br />
            <Grid container>
              <Grid item md={1} sm={1}></Grid>
              <LoadingButton
                loading={btnSubmit}
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </LoadingButton>
              <Grid item md={1} sm={1}></Grid>
              <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                Cancel
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <Loader loading={loading} message={loadingMessage} />
    </Box>
  );
}

export default MyInterviewCheckList;
