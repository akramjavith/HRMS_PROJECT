import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
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
import Alert from "@mui/material/Alert";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import SendToServer from "../../sendtoserver";
import domtoimage from 'dom-to-image';
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
function Clienterrorupload() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [filteredRowDataViewAll, setFilteredRowDataViewAll] = useState([]);
  const [filteredChangesViewAll, setFilteredChangesViewAll] = useState(null);

  const [overallItemsViewAll, setOverallItemsViewAll] = useState([]);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const [isHandleChangeNew, setIsHandleChangeNew] = useState(false);
  const [searchedStringNew, setSearchedStringNew] = useState("")
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
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const gridRef = useRef(null);
  const [items, setItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [deleteClientUserID, setDeleteClientUserID] = useState({});
  const [daypointslist, setDayPointsList] = useState([]);
  const [loading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [AlertButton, setAlertButton] = useState(false);
  const [fileupload, setFileupload] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileNameView, setFileNameView] = useState("");
  const [fileNameID, setFileNameID] = useState("");
  const { auth, setngs } = useContext(AuthContext);
  const [dataupdated, setDataupdated] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [dayPointsUploadOverallData, setDayPointsUploadOverallData] = useState(
    []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [isFilterOpenAll, setIsFilterOpenAll] = useState(false);
  const [isPdfFilterOpenAll, setIsPdfFilterOpenAll] = useState(false);
  const [dateTime, setDateTime] = useState([])
  const [documentFiles, setdocumentFiles] = useState([]);
  //Datatable
  const [page, setPage] = useState(1);
  const [excelData, setExcelData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    fetchAllDayPoints();
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  // page refersh reload
  const handleCloseFilterModAll = () => {
    setIsFilterOpenAll(false);
  };
  const handleClosePdfFilterModAll = () => {
    setIsPdfFilterOpenAll(false);
  };
  const [daypointsupload, setDayPointsUpload] = useState({
    date: formattedDate,
  });
  const [penaltyclientupload, setPenaltyClientUpload] = useState({
    fromdate: formattedDate,
    todate: ""
  });
  const backLPage = useNavigate();

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Client Error Upload"),
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

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    // ResetFunc();
    // fetchAllDayPoints();
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // Access
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const [dataArrayLength, setDataArrayLength] = useState([]);
  // viewAll model
  const initialColumnVisibilityviewAll = {
    serialNumber: true,
    name: true,
    empcode: true,
    clientamount: true,
    wavieramount: true,
    totalamount: true,
    actions: true,
  };
  const [openviewAll, setOpenviewAll] = useState(false);
  const handleClickOpenviewAll = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenviewAll(true);
  };
  // view all codes
  const [itemsviewAll, setItemsviewAll] = useState([]);
  const [productionoriginalviewAll, setProductionoriginalViewAll] = useState(
    []
  );
  const addSerialNumberviewAll = (datas) => {
    const itemsWithSerialNumber = datas?.map(
      (item, index) => ({
        ...item,
        serialNumber: index + 1,
        date: moment(item.date)?.format("DD-MM-YYYY"),
      })
    );
    setItemsviewAll(itemsWithSerialNumber);
    setOverallItemsViewAll(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumberviewAll(productionoriginalviewAll);
  }, [productionoriginalviewAll]);
  const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
  const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
  const [pageviewAll, setPageviewAll] = useState(1);
  const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(
    initialColumnVisibilityviewAll
  );
  const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
  const handleCloseviewAll = () => {
    setOpenviewAll(false);
    setProductionoriginalViewAll([]);
    setSearchQueryviewAll("");
    setPageviewAll(1);
    setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
  };
  const [dayPointsListArrayAll, setDayPointsListArrayAll] = useState([])
  // get single row to view....
  const getviewCodeall = async (id) => {
    setPageName(!pageName)
    try {
      setProductionfirstViewcheck(false);
      let res = await axios.get(`${SERVICE.SINGLE_PENALTY_CLIENT}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductionoriginalViewAll(res?.data?.spenaltyclientamountupload?.uploaddata);
      setDayPointsListArrayAll(res?.data?.spenaltyclientamountupload?.uploaddata);
      setFileNameView(res?.data?.spenaltyclientamountupload?.filename);
      setFileNameID(res?.data?.spenaltyclientamountupload?._id);
      handleClickOpenviewAll();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
      setProductionfirstViewcheck(true);
      setPageviewAll(1);
      setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    }
  };
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
  // Show All Columns functionality
  const handleShowAllColumnsviewAll = () => {
    const updatedVisibility = { ...columnVisibilityviewAll };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityviewAll(updatedVisibility);
  };
  // Manage Columnsviewall
  const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] =
    useState(false);
  const [anchorElviewAll, setAnchorElviewAll] = useState(null);
  const handleOpenManageColumnsviewAll = (event) => {
    setAnchorElviewAll(event.currentTarget);
    setManageColumnsOpenviewAll(true);
  };
  const handleCloseManageColumnsviewAll = () => {
    setManageColumnsOpenviewAll(false);
    setSearchQueryManageviewAll("");
  };
  const openviewpopall = Boolean(anchorElviewAll);
  const idviewall = openviewpopall ? "simple-popover" : undefined;
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityviewAll");
    if (savedVisibility) {
      setColumnVisibilityviewAll(JSON.parse(savedVisibility));
    }
  }, []);
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityviewAll",
      JSON.stringify(columnVisibilityviewAll)
    );
  }, [columnVisibilityviewAll]);
  // Split the search query into individual terms
  const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataviewAlls = itemsviewAll?.filter((item) => {
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
  const fileNameList = "Client Error Upload";
  //print.view.all.
  const componentRefviewall = useRef();
  const handleprintviewall = useReactToPrint({
    content: () => componentRefviewall.current,
    documentTitle: fileNameView,
    pageStyle: "print",
  });
  const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      empcode: item.empcode,
      clientamount: item.clientamount,
      wavieramount: item.wavieramount,
      totalamount: item.totalamount,
    };
  });
  const gridRefviewall = useRef(null);
  //image view all
  const gridRefTableImgviewall = useRef(null);
  // image
  const handleCaptureImageviewall = () => {
    if (gridRefTableImgviewall.current) {
      domtoimage.toBlob(gridRefTableImgviewall.current)
        .then((blob) => {
          saveAs(blob, "Client Error Upload.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    fromdate: true,
    todate: true,
    filename: true,
    createddate: true,
    createdtime: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
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
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewAll.empcode,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 130,
      hide: !columnVisibilityviewAll.name,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "clientamount",
      headerName: "Client Amount",
      flex: 0,
      width: 150,
      hide: !columnVisibilityviewAll.clientamount,
      headerClassName: "bold-header",
    },
    {
      field: "wavieramount",
      headerName: "Wavier Amount",
      flex: 0,
      width: 150,
      hide: !columnVisibilityviewAll.wavieramount,
      headerClassName: "bold-header",
    },
    {
      field: "totalamount",
      headerName: "Total Amount",
      flex: 0,
      width: 160,
      hide: !columnVisibilityviewAll.totalamount,
      headerClassName: "bold-header",
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
  const [productionfirstViewCheck, setProductionfirstViewcheck] =
    useState(false);
  const username = isUserRoleAccess.username;
  const readExcel = (file, name, e) => {
    if (
      name?.split(".")[1] === "xlsx" ||
      name?.split(".")[1] === "xls" ||
      name?.split(".")[1] === "csv"
    ) {
      const resume = e.target.files;
      let documentarray;
      const reader = new FileReader();
      const files = resume[0];
      reader.readAsDataURL(files);
      reader.onload = () => {
        documentarray = [
          {
            name: files.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ];
      };
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
          // const data = XLSX.utils.sheet_to_json(ws);
          resolve(data);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      promise.then((d) => {
        const dataArray = d.map((item, index) => {
          return {
            empcode: item["Emp Code"],
            name: item.Name,
            clientamount: item["Client Amount"],
            wavieramount: item["Wavier Amount"],
            totalamount: item["Total Amount"]
          };
        });
        const uniqueCombinationstime = new Set();
        // Filter and deduplicate CATEGORIES
        const filteredArray1time = dayPointsUploadOverallData.filter((item) => {
          const combination = `${item.fromdate}-${item.todate}-${item.name}-${item.empcode}-${item["clientamount"]}-${item["wavieramount"]}-${item["totalamount"]}`;

          if (!uniqueCombinationstime.has(combination)) {
            uniqueCombinationstime.add(combination);
            return true;
          }
          return false;
        });

        // Filter and deduplicate EXCEL DATA
        const filteredArray2time = dataArray.some(
          (data) => data.name !== undefined
            && data.empcode !== undefined &&
            data.clientamount !== undefined &&
            data.wavieramount !== undefined &&
            data.totalamount !== undefined
        )
          ? dataArray.filter((item) => {
            const combination = `${penaltyclientupload.fromdate}-${penaltyclientupload.todate}-${item.name}-${item.empcode}-${item["clientamount"]}-${item["wavieramount"]}-${item["totalamount"]}`;

            if (!uniqueCombinationstime.has(combination)) {
              uniqueCombinationstime.add(combination);
              return true;
            }
            return false;
          })
          : [];
        const ans = [
          {
            filename: name.split(".")[0],
            fromdate: penaltyclientupload.fromdate,
            todate: penaltyclientupload.todate,
            uploaddata: filteredArray2time,
            document: [...documentarray],
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
        ];
        setItems(ans);
        setShow(true);
        setAlertButton(true);
        setDataArrayLength(filteredArray2time.length);
      });
    }
  };
  const [dayPointsListArray, setDayPointsListArray] = useState([])
  //get all Time Loints List.
  const fetchAllDayPointsArray = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.GET_PENALTY_CLIENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDayPointsListArray(res_queue?.data?.penaltyclientamountupload?.map((item, index) => {
        const date = moment(item.createdAt).format("DD-MM-YYYY")
        const time = moment(item.createdAt).format("HH:MM:SS")
        return {
          ...item,
          id: item._id,
          serialNumber: item.serialNumber,
          fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
          todate: moment(item.todate).format("DD-MM-YYYY"),
          filename: item.filename,
          createddate: date,
          createdtime: time,
        }
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchAllDayPointsArray();
  }, [isFilterOpen, isPdfFilterOpen])
  //get all Time Loints List.
  const pathname = window.location.pathname;

  const fetchAllDayPoints = async () => {
    setPageName(!pageName)
    try {
      let res_queue = await axios.get(SERVICE.GET_PENALTY_CLIENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDayPointsList(res_queue?.data?.penaltyclientamountupload.map((item, index) => {
        const date = moment(item.createdAt).format("DD-MM-YYYY")
        const time = moment(item.createdAt).format("HH:MM:SS")
        return {
          ...item,
          id: item._id,
          serialNumber: item.serialNumber,
          fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
          todate: moment(item.todate).format("DD-MM-YYYY"),
          filename: item.filename,
          createddate: date,
          createdtime: time,
        }
      }));
      let answer = res_queue?.data?.penaltyclientamountupload
        .map((data) => {
          let finalData = data.uploaddata?.map((item) => ({ ...item, fromdate: data?.fromdate, todate: data?.todate }))
          return finalData;
        })
        .flat();
      setDayPointsUploadOverallData(answer);
      setIsLoading(true);
    } catch (err) {
      setIsLoading(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  };
  const ResetFunc = () => {
    fetchAllDayPoints();
    setItems([]);
    setFileName("");
    setShow(false);
    setFileupload("");
    setAlertButton(false);
    setDataArrayLength("");
  };
  useEffect(() => {
    fetchAllDayPoints();
  }, []);
  const clearFileSelection = () => {
    setFileupload([]);
    setFileName("");
    setItems("");
    readExcel(null);
    setShow(false);
    setAlertButton(false);
    setDataupdated("");
    setdocumentFiles([]);
  };
  const ExportsHead = () => {
    new CsvBuilder("Client Error Upload")
      .setColumns([
        "Emp Code",
        "Name",
        "Client Amount",
        "Wavier Amount",
        "Total Amount",
      ])
      .exportFile();
  };
  const sendJSON = async () => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
      }
    };
    // Ensure that items is an array of objects before sending
    if (dataArrayLength === 0 && penaltyclientupload.fromdate === "") {
      setPopupContent("No data to upload!");
      setPopupSeverity("success");
      handleClickOpenPopup();
      return;
    }
    if (penaltyclientupload.fromdate === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (penaltyclientupload.todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setPageName(!pageName)
      try {
        // setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.ADD_PENALTY_CLIENT);
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xmlhttp.send(JSON.stringify(items));
        await fetchAllDayPoints();
        setdocumentFiles([]);
        setFileName("")
        setDataArrayLength([])
        setShow(false)
        setAlertButton(false)
      } catch (err) {
      } finally {
        // setLoading(false); // Set loading back to false when the upload is complete
        await fetchAllDayPoints();
      }
      setPopupContent("Uploaded Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFileName("")
      setDataArrayLength([])
      setShow(false)
      setAlertButton(false)
      await fetchAllDayPoints();
    }
  };
  const handleCheck = () => {
    toast.warning("Upload files!");
  };
  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_PENALTY_CLIENT}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteClientUserID(res?.data?.spenaltyclientamountupload);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let brandid = deleteClientUserID._id;
  const delBrand = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_PENALTY_CLIENT}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // await readExcel(null)
      await fetchAllDayPoints();
      setAlertButton(false);
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      lockPinned: true,
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "fromdate",
      headerName: "From Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fromdate,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "todate",
      headerName: "To Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.todate,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "filename",
      headerName: "File Name",
      flex: 0,
      width: 350,
      hide: !columnVisibility.filename,
      headerClassName: "bold-header",
    },
    {
      field: "createddate",
      headerName: "Created Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createddate,
      headerClassName: "bold-header",
    },
    {
      field: "createdtime",
      headerName: "Created Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createdtime,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dclienterrorupload") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vclienterrorupload") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeall(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  //image
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Client Error Upload.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Client Error Upload",
    pageStyle: "print",
  });
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
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsList(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber(daypointslist);
  }, [daypointslist]);
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = itemsList?.filter((item) => {
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
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fromdate: item.fromdate,
      todate: item.todate,
      filename: item.filename,
      createddate: item.createddate,
      createdtime: item.createdtime,
    };
  });
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  // // Function to filter columns based on search query
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
  const [fileFormat, setFormat] = useState('')
  let exportColumnNames = ["From Date", "To Date", "File Name", "Create Date", "Create Time"];
  let exportRowValues = ["fromdate", "todate", "filename", "createddate", "createdtime"];
  let exportColumnNamesall = ["Empcode", "Name", "Clientamount", "Wavieramount", "Totalamount"];
  let exportRowValuesall = ["empcode", "name", "clientamount", "wavieramount", "totalamount"];
  return (
    <Box>
      <Headtitle title={"CLIENT ERROR UPLOAD"} />

      <PageHeading
        title="Manage Client Error Upload"
        modulename="Quality"
        submodulename="Penalty"
        mainpagename="Penalty Setup"
        subpagename="Penalty Calculation"
        subsubpagename="Client Error Upload"
      />

      {isUserRoleCompare?.includes("lclienterrorupload") && (
        <Box sx={userStyle.container}>
          <Grid container spacing={2}>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  From Date <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={penaltyclientupload.fromdate}
                  onChange={(e) => {
                    const newFromDate = e.target.value;
                    setPenaltyClientUpload((prevState) => ({
                      ...prevState,
                      fromdate: newFromDate,
                      todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                    }));
                    setItems([]);
                    setFileName("");
                    setShow(false);
                    setFileupload("");
                    setAlertButton(false);
                    setDataArrayLength("");
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  To Date <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={penaltyclientupload.todate}
                  onChange={(e) => {
                    const selectedToDate = new Date(e.target.value);
                    const selectedFromDate = new Date(penaltyclientupload.fromdate);
                    const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                      setPenaltyClientUpload({
                        ...penaltyclientupload,
                        todate: e.target.value
                      });
                    } else {
                      setPenaltyClientUpload({
                        ...penaltyclientupload,
                        todate: "" // Reset to empty string if the condition fails
                      });
                    }
                    setItems([]);
                    setFileName("");
                    setShow(false);
                    setFileupload("");
                    setAlertButton(false);
                    setDataArrayLength("");
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {dataArrayLength > 0 && AlertButton ? (
              <Alert severity="success">File Accepted!</Alert>
            ) : null}
            {dataArrayLength == 0 &&
              dataupdated == "uploaded" &&
              AlertButton ? (
              <Alert severity="error">No data to upload!</Alert>
            ) : null}
          </Box>
          <br></br>
          <Grid container spacing={2}>
            <Grid item md={2}>
              <Button
                variant="contained"
                component="label"
                sx={buttonStyles.buttonsubmit}
              >
                Upload
                <input
                  id="resume"
                  name="file"
                  hidden
                  type="file"
                  accept=".xlsx, .xls , .csv"
                  onChange={(e) => {
                    // handleResumeUpload(e);
                    const file = e.target.files[0];
                    setFileupload(file);
                    setDataupdated("uploaded");
                    readExcel(file, file.name, e);
                    setFileName(file.name);
                    e.target.value = null;
                  }}
                />
              </Button>
            </Grid>
            <Grid item md={7}>
              {fileName && dataArrayLength > 0 ? (
                <Box sx={{ display: "flex", justifyContent: "left" }}>
                  <p>{fileName}</p>
                  <Button onClick={() => clearFileSelection()}>
                    <FaTrash style={{ color: "red" }} />
                  </Button>
                </Box>
              ) : null}
            </Grid>
            <Grid item md={2}>
              {show && dataArrayLength > 0 && (
                <>
                  <div>
                    <div readExcel={readExcel} />
                    <SendToServer sendJSON={sendJSON} />
                  </div>
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <br />
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "Capitalize" }}
            onClick={(e) => ExportsHead()}
          >
            <FaDownload />
            &ensp;Download template file
          </Button>
        </Box>
      )}
      <br />
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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lclienterrorupload") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Client Error Upload
              </Typography>
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
                    <MenuItem value={daypointslist?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelclienterrorupload") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAllDayPointsArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvclienterrorupload") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAllDayPointsArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printclienterrorupload") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfclienterrorupload") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchAllDayPointsArray()
                        }}                        >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageclienterrorupload") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={daypointslist} setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={overallItems}
                />
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            {!loading ? (
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
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={itemsList}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
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
          </Box>
        </>
      )}
      {/* ****** Instructions Box Ends ****** */}
      {/* viewAll model */}
      <Dialog
        open={openviewAll}
        onClose={handleClickOpenviewAll}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{ marginTop: '50px' }}
      >
        <DialogContent >
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
                  {isUserRoleCompare?.includes("excelclienterrorupload") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenAll(true)
                        // fetchAllDayPointsArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvclienterrorupload") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpenAll(true)
                        // fetchAllPenaltydayArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>                    </>
                  )}
                  {isUserRoleCompare?.includes("printclienterrorupload") && (
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
                  {isUserRoleCompare?.includes("pdfclienterrorupload") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenAll(true)
                        }}                             >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageclienterrorupload") && (
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
                <AggregatedSearchBar columnDataTable={columnDataTableviewAll} setItems={setItemsviewAll} addSerialNumber={addSerialNumberviewAll} setPage={setPageviewAll} maindatas={productionoriginalviewAll} setSearchedString={setSearchedStringNew}
                  searchQuery={searchQueryviewAll}
                  setSearchQuery={setSearchQueryviewAll}
                  paginated={false}
                  totalDatas={overallItemsViewAll}
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
                  isHandleChange={isHandleChangeNew}
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
                  itemsList={overallItemsViewAll}

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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}

        filteredDataTwo={(filteredChanges !== null ? filteredRowData : filteredData) ?? []}
        itemsTwo={dayPointsListArray ?? []}
        filename={"Client Error Upload"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportData
        isFilterOpen={isFilterOpenAll}
        handleCloseFilterMod={handleCloseFilterModAll}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenAll}
        isPdfFilterOpen={isPdfFilterOpenAll}
        setIsPdfFilterOpen={setIsPdfFilterOpenAll}
        handleClosePdfFilterMod={handleClosePdfFilterModAll}
        filteredDataTwo={(filteredChangesViewAll !== null ? filteredRowDataViewAll : filteredDataviewAll) ?? []}
        itemsTwo={dayPointsListArrayAll ?? []}
        filename={fileNameView}
        exportColumnNames={exportColumnNamesall}
        exportRowValues={exportRowValuesall}
        componentRef={componentRefviewall}
      />
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delBrand}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
    </Box>
  );
}
export default Clienterrorupload;