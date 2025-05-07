import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import StyledDataGrid from "../../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

function AllInterviewPendingCheckList() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setBtnSubmit(false);
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
    "Company",
    "Branch",
    "Name",
    "Contact Number",
    "Email",
    "Status",
    "Category",
    "Sub Category",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "fullname",
    "mobile",
    "email",
    "updatestatus",
    "category",
    "subcategory",
  ];

  const [candidates, setCandidates] = useState([]);
  const [overallDatas, setOverallDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("OnBoarding Pending Checklist"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

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
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);
  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);
  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [tableThree, setTableThree] = useState(true);

  const [isBtn, setIsBtn] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);

  const handleClear = () => {
    setValueComp([]);
    setValueBran([]);
    setSelectedOptionsCom([]);
    setSelectedOptionsBran([]);
    setCandidates(overallDatas);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  // company
  const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
  let [valueComp, setValueComp] = useState("");

  const handleCompanyChange = (options) => {
    setValueComp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCom(options);
  };

  const customValueRendererCom = (valueComp, _companys) => {
    return valueComp.length
      ? valueComp.map(({ label }) => label).join(", ")
      : "Please Select Company";
  };

  // branch
  const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
  let [valueBran, setValueBran] = useState("");

  const handleBranchChange = (options) => {
    setValueBran(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBran(options);
  };

  const customValueRendererBran = (valueBran, _branchs) => {
    return valueBran.length
      ? valueBran.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setBtnSubmit(true);
    e.preventDefault();

    let companies =
      selectedOptionsCom?.length === 0
        ? ""
        : selectedOptionsCom?.map((item) => item.value);
    let branches =
      selectedOptionsBran?.length === 0
        ? ""
        : selectedOptionsBran?.map((item) => item.value);

    if (selectedOptionsCom.length === 0) {
      setBtnSubmit(false);

      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setBtnSubmit(false);

      let filteredData = overallDatas.filter((entry) => {
        const companyMatch = !companies || companies.includes(entry.company);
        const branchMatch = !branches || branches.includes(entry.branch);
        return companyMatch && branchMatch;
      });

      setCandidates(filteredData);
    }
  };

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

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);
  const { auth } = useContext(AuthContext);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isBankdetail, setBankdetail] = useState(false);

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
          saveAs(blob, "OnBoarding Pending Checklist.png");
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

  //for assigning workstation
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tableTwoDatas, setTableTwoDatas] = useState([]);
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

  const openTwo = Boolean(anchorElTwo);
  const idTwo = openTwo ? "simple-popover" : undefined;

  const [pageSizeTwo, setPageSizeTwo] = useState(10);

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

  const [getDetails, setGetDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();

  const getCode = async (details) => {
    setGetDetails(details);
    setPageName(!pageName);
    try {
      setGroupDetails(details?.groups);
      let forFillDetails = details?.groups?.map((data) => {
        if (data.checklist === "Date Multi Random Time") {
          if (data?.data && data?.data !== "") {
            const [date, time] = data?.data?.split(" ");
            return { date, time };
          }
        } else {
          return { date: "0", time: "0" };
        }
      });

      let forDateSpan = details?.groups?.map((data) => {
        if (data.checklist === "Date Multi Span") {
          if (data?.data && data?.data !== "") {
            const [fromdate, todate] = data?.data?.split(" ");
            return { fromdate, todate };
          }
        } else {
          return { fromdate: "0", todate: "0" };
        }
      });
      let forDateTime = details?.groups?.map((data) => {
        if (data.checklist === "DateTime") {
          if (data?.data && data?.data !== "") {
            const [date, time] = data?.data?.split(" ");
            return { date, time };
          }
        } else {
          return { date: "0", time: "0" };
        }
      });

      let forDateMultiSpanTime = details?.groups?.map((data) => {
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
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
    company: true,
    unit: true,
    team: true,
    approvedthrough: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  //get all employees list details
  const fetchUnassignedCandidates = async () => {
    setTableThree(false);
    setBankdetail(false);
    setPageName(!pageName);
    const accessbranch = isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));
    try {
      let res = await axios.post(
        SERVICE.PENDINGINTERVIEWCHECKLIST,
        {
          assignbranch: accessbranch,
        },
        { headers: { Authorization: `Bearer ${auth.APIToken}` } }
      );
      setCandidates(res?.data?.derivedDatas);
      setOverallDatas(res?.data?.derivedDatas);
      setBankdetail(true);
      setTableThree(true);
    } catch (err) {
      setTableThree(true);
      setBankdetail(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "OnBoarding Pending Checklist",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchUnassignedCandidates();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => {
      return {
        id: index,
        serialNumber: index + 1,
        fullname: item?.fullname,
        mobile: item?.mobile,
        email: item?.email,
        category: item?.category?.join(","),
        subcategory: item?.subcategory?.join(","),

        company: item?.company,
        branch: item?.branch,
        city: item?.city,
        groups: item?.groups?.filter((itemNew) => {
          if (itemNew.checklist === "Attachments") {
            return itemNew.files === undefined || itemNew.files === "";
          } else {
            return itemNew.data === undefined || itemNew.data === "";
          }
        }),
        updatestatus: "Pending",
      };
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
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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

  let columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
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
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mobile,
      headerClassName: "bold-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.email,
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
            <>
              {isUserRoleCompare?.includes("vonboadingpendingchecklist") && (
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
                  VIEW
                </div>
              )}
            </>
          </Grid>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: index,
      serialNumber: item?.serialNumber,
      role: item?.role,
      fullname: item?.fullname,
      mobile: item?.mobile,
      email: item?.email,
      category: item?.category,
      subcategory: item?.subcategory,
      checklist: item?.checklist,
      username: item?.username,
      password: item?.password,
      company: item?.company,
      branch: item?.branch,
      adharnumber: item?.adharnumber,
      pannumber: item?.pannumber,
      dateofbirth: item?.dateofbirth,
      address: item?.address,
      groups: item?.groups,
      information: item?.information,
      updatestatus: "Pending",
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
      <Headtitle title={"ONBOARDING PENDING CHECKLIST"} />
      <PageHeading
        title="OnBoarding Pending Checklist"
        modulename="Recruitment"
        submodulename="Onboading Pending Checklist"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <>
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  OnBoarding Pending Checklist
                </Typography>
              </Grid>
            </Grid>
            <br />
            {isUserRoleCompare?.includes("aonboadingpendingchecklist") && (
              <Grid container spacing={2}>
                <Grid
                  item
                  md={3}
                  sm={12}
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsCom}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setSelectedOptionsBran([]);
                      }}
                      valueRenderer={customValueRendererCom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={3}
                  sm={12}
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter((comp) =>
                          selectedOptionsCom
                            .map((data) => data.value)
                            .includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBran}
                      onChange={(e) => {
                        handleBranchChange(e);
                      }}
                      valueRenderer={customValueRendererBran}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={6} sm={6}>
                  <Typography>&nbsp;</Typography>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={buttonStyles.buttonsubmit}
                    disabled={isBtn}
                    loading={btnSubmit}
                  >
                    Filter
                  </LoadingButton>
                </Grid>
                <Grid item md={1} xs={6} sm={6}>
                  <Typography>&nbsp;</Typography>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            )}
          </>
        </Box>
      </>
      <br />

      <>
        <>
          {isUserRoleCompare?.includes("lonboadingpendingchecklist") && (
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
                    <Typography sx={userStyle.SubHeaderText}>
                      OnBoarding Pending Checklist
                    </Typography>
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
                      {isUserRoleCompare?.includes(
                        "excelonboadingpendingchecklist"
                      ) && (
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
                      {isUserRoleCompare?.includes(
                        "csvonboadingpendingchecklist"
                      ) && (
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
                      {isUserRoleCompare?.includes(
                        "printonboadingpendingchecklist"
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
                      {isUserRoleCompare?.includes(
                        "pdfonboadingpendingchecklist"
                      ) && (
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
                      {isUserRoleCompare?.includes(
                        "printonboadingpendingchecklist"
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
                <br />
                <br />
                {!isBankdetail ? (
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
                        to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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
      </>
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
          <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
            ok
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
          marginTop: "50px",
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.SubHeaderText}>
              OnBoarding Pending Checklist
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
                    Name:{" "}
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
                      Allotted To
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Completed By
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>
                      Completed At
                    </TableCell>
                    <TableCell style={{ fontSize: "1.2rem" }}>Status</TableCell>

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
                                  readOnly
                                />
                              </TableCell>
                            );
                          case "Text Box-number":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  value={row.data}
                                  style={{ height: "32px" }}
                                  type="text"
                                  readOnly
                                />
                              </TableCell>
                            );
                          case "Text Box-alpha":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  value={row.data}
                                  readOnly
                                />
                              </TableCell>
                            );
                          case "Text Box-alphanumeric":
                            return (
                              <TableCell>
                                <OutlinedInput
                                  style={{ height: "32px" }}
                                  value={row.data}
                                  readOnly
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
                                        flexDirection: "column",
                                        marginTop: "10px",
                                        gap: "10px",
                                      }}
                                    >
                                      {row.files && (
                                        <Grid
                                          container
                                          spacing={2}
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
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
                                        </Grid>
                                      )}
                                    </Box>
                                  </div>
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
                                  readOnly
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
                                  readOnly
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
                                    readOnly
                                  />
                                  <OutlinedInput
                                    type="time"
                                    style={{ height: "32px" }}
                                    value={timeValue[index]}
                                    readOnly
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
                                    readOnly
                                  />
                                  <OutlinedInput
                                    type="date"
                                    style={{ height: "32px" }}
                                    value={dateValueMultiTo[index]}
                                    readOnly
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
                                      readOnly
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: "32px" }}
                                      value={firstTimeValue[index]}
                                      readOnly
                                    />
                                  </Stack>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      type="date"
                                      style={{ height: "32px" }}
                                      value={secondDateValue[index]}
                                      readOnly
                                    />
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="time"
                                      value={secondTimeValue[index]}
                                      readOnly
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
                                  readOnly
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
                                    readOnly
                                  />
                                  <OutlinedInput
                                    type="time"
                                    style={{ height: "32px" }}
                                    value={timeValueRandom[index]}
                                    readOnly
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
                        {Array.isArray(row?.employee) &&
                          row.employee.map((item, index) => (
                            <Typography key={index} variant="body1">
                              {`${index + 1}. ${item}, `}
                            </Typography>
                          ))}
                      </TableCell>
                      <TableCell>
                        <Typography>{row?.completedby}</Typography>
                      </TableCell>
                      <TableCell>
                        {row.completedat &&
                          moment(row.completedat).format(
                            "DD-MM-YYYY hh:mm:ss A"
                          )}
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

                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.subcategory}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br /> <br /> <br />
            <Grid container>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseModEdit}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        isFilterOpen={isFilterOpenNew}
        handleCloseFilterMod={handleCloseFilterModNew}
        fileFormat={fileFormatNew}
        setIsFilterOpen={setIsFilterOpenNew}
        isPdfFilterOpen={isPdfFilterOpenNew}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterModNew}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"OnBoarding Pending Checklist"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default AllInterviewPendingCheckList;
