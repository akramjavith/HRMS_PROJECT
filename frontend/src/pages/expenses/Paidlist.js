import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
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
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";
import MessageAlert from "../../components/MessageAlert";
import ExportData from "../../components/ExportData";
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
function Paidlist() {
  let exportColumnNames = [
    "Date",
    "Bill No",
    "Bill Status",
    "Vendor Name",
    "Vendor Frequency",
    "Source",
    "Amount",
  ];
  let exportRowValues = [
    "date",
    "billno",
    "billstatus",
    "vendorname",
    "vendorfrequency",
    "source",
    "amount",
  ];
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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

  const [fileFormat, setFormat] = useState("");

  //state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [loader, setLoader] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    billno: true,
    vendorname: true,
    vendorfrequency: true,
    date: true,
    source: true,
    amount: true,
    billstatus: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //useEffect

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleCloseview = () => {
    setOpenview(false);
  };
  useEffect(() => {
    addSerialNumber();
  }, [expenses]);

  const {
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
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
        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  // fetch company



  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const gridRef = useRef(null);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleViewClose = () => {
    setViewpen(false);
  };

  const classes = useStyles();

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulter = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_EXPENSE_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };
  // FILEICONPREVIEW CREATE
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const [singlePay, setSinglePay] = useState({});
  const [billdocs, setBillDocs] = useState([]);
  const [receiptDocs, setReceiptDocs] = useState([]);
  const [viewOpen, setViewpen] = useState(false);

  const [projEdit, setProjedit] = useState({});

  const getviewCode = async (e, source) => {
    setPageName(!pageName);
    try {
      if (source === "Expenses") {
        let res = await axios.get(`${SERVICE.EXPENSES_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setProjedit(res?.data?.sexpenses);
        handleClickOpenview();
      } else {
        let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setSinglePay({ ...res?.data?.sotherpayment, balanceamount: Number(res?.data?.sotherpayment?.dueamount) - Number(res?.data?.sotherpayment?.paidamount || 0) });
        setBillDocs(res?.data?.sotherpayment?.billsdocument);
        setReceiptDocs(res?.data?.sotherpayment?.receiptdocument);
        handleViewOpen();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Paid Report.png");
        });
      });
    }
  };

  const handleViewOpen = () => {
    setViewpen(true);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Paid Report",
    pageStyle: "print",
  });
  const addSerialNumber = () => {
    const itemsWithSerialNumber = expenses?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      date: moment(item?.date).format("DD-MM-YYYY"),
      vendorname: item?.vendor,
    }));
    setItems(itemsWithSerialNumber);
  };
  //table sorting
  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
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
  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      date: item.date,
      billno: item.billno,
      vendorname: item.vendorname,
      vendorfrequency: item.vendorfrequency,
      source: item.source,
      amount: item.amount,
      billstatus: item?.billstatus,
    };
  });
  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "billno",
      headerName: "Bill No",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.billno,
    },
    {
      field: "billstatus",
      headerName: "Bill Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.billstatus,
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.vendorname,
    },
    {
      field: "vendorfrequency",
      headerName: "Vendor Frequency",
      flex: 0,
      width: 190,
      minHeight: "40px",
      hide: !columnVisibility.vendorfrequency,
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.source,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.amount,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 200,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              getviewCode(params.row.id, params.row.source);
            }}
          >
            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
          </Button>
        </Grid>
      ),
    },
  ];
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize) {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${visibleRows > 0
        ? visibleRows * rowHeight + extraSpace
        : scrollbarWidth + extraSpace
        }px`;
    }
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

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
      pagename: String("Paid Report"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };


  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };




  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [filterUser, setFilterUser] = useState({
    day: "Today",
    fromtime: '00:00',
    totime: '23:59',
    fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD'),
    source: "Expense",
    frequency: [],
  });

  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
        break;
      default:
        return;
    }
  }
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = accessbranch.filter(
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

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat([
        ...selectedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && "Others",
      ]);
      setSelectedOptionsCompany([
        ...mappedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && {
        //   label: "Others",
        //   value: "Others",
        // },
      ]);

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

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

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

      let mappedUnit = selectedValues
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
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // useEffect(() => {
  //   handleAutoSelect();
  // }, [isAssignBranch]);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setExpenses([]);

    setFilterUser({
      day: "Today",
      fromtime: '00:00',
      totime: '23:59',
      fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD'),
      source: "Expense",
      frequency: [],
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.day === "Custom Fields" && (!filterUser.fromdate || !filterUser.todate)) {
      setPopupContentMalert("Please Select All Date Fields!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchPaidList();
    }
  };
  const customValueRendererFrequency = (valueCompanyCat, placeholder) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : `Please Select Frequency`;
  };


  const fetchPaidList = async () => {
    setPageName(!pageName);
    try {
      setLoader(true);
      const [res] = await Promise.all([
        axios.post(
          SERVICE.PAID_NOTPAID_REPORT,
          {
            frequency: filterUser?.frequency?.map(data => data?.value),
            dateFilter: filterUser?.day ? filterUser : null,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            source: filterUser.source,
            paidstatus: ["Paid"],
            assignbranch: [
              ...accessbranch,
              (isUserRoleCompare?.includes("lassignexpenseothers") && filterUser.source === "Expense") && {
                company: "Others",
                branch: "",
                unit: "",
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),

      ]);


      let otherMappedData;
      if (filterUser.source === "Expense") {
        otherMappedData = res.data.finaldata.map((data) => ({
          _id: data._id,
          date: data.duedate !== "" ? data.duedate : data.date,
          billno: data.referenceno,
          vendor: data.vendorname,
          vendorfrequency: data.vendorfrequency,
          source: "Expenses",
          amount: data.paidamount,
          billstatus: data.billstatus,
        }));
      } else {
        otherMappedData = res.data.finaldata.map((data) => ({
          _id: data._id,
          date: data.billdate,
          billno: data.billno,
          vendor: data.vendor,
          vendorfrequency: data.vendorfrequency,
          source: "Scheduled Payments",
          amount: data.dueamount,
          billstatus: data.paidbillstatus,
        }));
      }


      setExpenses(otherMappedData);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  return (
    <Box>
      <Headtitle title={"PAID REPORT"} />
      <PageHeading
        title="Paid Report"
        modulename="Expenses"
        submodulename="Paid Report"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lpaidreport") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: "500" }}>
                      Source<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Expense", value: "Expense" },
                        { label: "Scheduled Payment", value: "Scheduled Payment" },
                      ]}
                      // styles={colourStyles}
                      value={{ label: filterUser.source ? filterUser.source : "Please Select Source", value: filterUser.source ? filterUser.source : "Please Select Source" }}
                      onChange={(e) => {
                        setFilterUser((prev) => ({ ...prev, source: e.value }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "Daily", value: "Daily" },
                        { label: "Monthly", value: "Monthly" },
                        { label: "BillWise", value: "BillWise" },
                        { label: "Weekly", value: "Weekly" },
                      ]}
                      value={filterUser?.frequency}
                      onChange={(e) => {

                        setFilterUser((prev) => ({
                          ...prev,
                          frequency: e,
                        }))
                      }}
                      valueRenderer={customValueRendererFrequency}
                      labelledBy="Please Select Frequency"
                    />

                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={[
                        ...accessbranch?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        })),
                        (isUserRoleCompare?.includes(
                          "lassignexpenseothers"
                        ) && filterUser.source === "Expense") && {
                          label: "Others",
                          value: "Others",
                        },
                      ]
                        ?.filter(Boolean) // Filter out falsy values, including `undefined`
                        ?.filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label &&
                                i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) =>
                          valueCompanyCat?.includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label &&
                                i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                      disabled={valueCompanyCat?.includes("Others")}
                    />
                  </FormControl>
                </Grid>
                {filterUser.source === "Expense" &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Unit</Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsUnit}
                        onChange={(e) => {
                          handleUnitChange(e);
                        }}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Unit"
                        disabled={valueCompanyCat?.includes("Others")}
                      />
                    </FormControl>
                  </Grid>}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: "500" }}>
                      Days
                    </Typography>
                    <Selects
                      options={daysoptions}
                      // styles={colourStyles}
                      value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                      onChange={(e) => {
                        handleChangeFilterDate(e);
                        setFilterUser((prev) => ({ ...prev, day: e.value }))
                      }}
                    />
                  </FormControl>
                </Grid>
                {filterUser.day !== "" && <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        From Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="from-date"
                        type="date"
                        disabled={filterUser.day !== "Custom Fields"}
                        value={filterUser.fromdate}
                        onChange={(e) => {
                          const newFromDate = e.target.value;
                          setFilterUser((prevState) => ({
                            ...prevState,
                            fromdate: newFromDate,
                            todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        To Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="to-date"
                        type="date"
                        value={filterUser.todate}
                        disabled={filterUser.day !== "Custom Fields"}
                        onChange={(e) => {
                          const selectedToDate = new Date(e.target.value);
                          const selectedFromDate = new Date(filterUser.fromdate);

                          if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                            setFilterUser({
                              ...filterUser,
                              todate: e.target.value
                            });
                          } else {
                            setFilterUser({
                              ...filterUser,
                              todate: "" // Reset to empty string if the condition fails
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>}
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleClearFilter}
                >
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      <>
        {/* ****** Table Start ****** */}
        {isUserRoleCompare?.includes("lpaidreport") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    All Paid Report
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={expenses.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelpaidreport") && (
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
                    {isUserRoleCompare?.includes("csvpaidreport") && (
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
                    {isUserRoleCompare?.includes("printpaidreport") && (
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
                    {isUserRoleCompare?.includes("pdfpaidreport") && (
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
                    {isUserRoleCompare?.includes("imagepaidreport") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
                        </Button>
                      </>
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
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() =>
                        setColumnVisibility(initialColumnVisibility)
                      }
                    >
                      Show All Columns
                    </Button>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleOpenManageColumns}
                    >
                      Manage Columns
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {loader ? (
                <Box sx={userStyle.container}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "350px",
                    }}
                  >
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
                </Box>
              ) : (
                <Box
                  style={{
                    height: calculateDataGridHeight(),
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    ref={gridRef}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )} // Only render visible columns
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
              )}
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
              </Box>
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
      {/* view model paid Expense*/}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "50px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Expense Paid
            </Typography>
            <br /> <br />
            <Grid container spacing={4}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reference No</Typography>
                  <Typography>{projEdit.referenceno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{projEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{projEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{projEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor Name</Typography>
                  <Typography>{projEdit.vendorname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Purpose</Typography>
                  <Typography>{projEdit.purpose}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Category</Typography>
                  <Typography>{projEdit.expansecategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Sub Category</Typography>
                  <Typography>{projEdit.expansesubcategory}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Total Bill Amount</Typography>
                  <Typography>{projEdit.totalbillamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Frequency</Typography>
                  <Typography>{projEdit.vendorfrequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(projEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Status</Typography>
                  <Typography>{projEdit.paidstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Mode</Typography>
                  <Typography>{projEdit.paidmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Amount</Typography>
                  <Typography>{projEdit.paidamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Balance Amount</Typography>
                  <Typography>{projEdit.balanceamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expense Total</Typography>
                  <Typography>{projEdit.expensetotal}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Bill Status</Typography>
                  <Typography>{projEdit.billstatus}</Typography>
                </FormControl>
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

      <Box>
        <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="lg" sx={{ marginTop: "50px" }}>
          <DialogContent>
            <Box>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Schedule Payment Paid Bills
                  </Typography>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.company}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.branchname}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expense Category</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.expensecategory}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expense Sub Category</Typography>
                    <OutlinedInput
                      readOnly
                      id="component-outlined"
                      value={singlePay?.expensesubcategory}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Purpose</Typography>
                    <OutlinedInput readOnly value={singlePay.purpose} />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Bill No</Typography>
                    <OutlinedInput readOnly value={singlePay.billno} />
                  </FormControl>
                </Grid>
                {/* next grdi */}
                <>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Vendor Grouping</Typography>
                      <OutlinedInput readOnly value={singlePay?.vendorgrouping} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Vendor Name</Typography>
                      <OutlinedInput readOnly value={singlePay?.vendor} />
                    </FormControl>
                    &emsp;
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> GSTNO</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={singlePay.gstno}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Frequency</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={singlePay.vendorfrequency}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Bill Date</Typography>
                      <OutlinedInput
                        readOnly
                        value={moment(singlePay.billdate).format(
                          "DD-MM-YYYY"
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Due Date</Typography>
                      <OutlinedInput
                        readOnly
                        value={moment(singlePay.receiptdate).format(
                          "DD-MM-YYYY"
                        )}
                      />
                    </FormControl>
                  </Grid>
                </>
                {/* next grdi */}
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Due Amount</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay.dueamount}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Paid Status</Typography>
                      <OutlinedInput value={singlePay?.paidstatus} readOnly />
                    </FormControl>
                    &emsp;
                  </Grid>

                  {singlePay?.paidstatus === "Paid" && (
                    <>
                      <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                        <FormControl fullWidth size="small">
                          <Typography>Paid Amount</Typography>
                          <OutlinedInput value={singlePay?.paidamount || 0} readOnly />
                        </FormControl>
                        &emsp;
                      </Grid>
                      <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                        <FormControl fullWidth size="small">
                          <Typography>Balance Amount</Typography>
                          <OutlinedInput value={Number(singlePay?.dueamount) - Number(singlePay?.paidamount || 0)} readOnly />
                        </FormControl>
                        &emsp;
                      </Grid>
                      <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                        <FormControl fullWidth size="small">
                          <Typography>Paid Date</Typography>
                          <OutlinedInput value={singlePay?.paiddate || ""} readOnly />
                        </FormControl>
                        &emsp;
                      </Grid>
                      <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                        <FormControl fullWidth size="small">
                          <Typography>Bill Status</Typography>
                          <OutlinedInput value={singlePay.paidstatus === "Not Paid" ? "InComplete" : (singlePay?.paidstatus === "Paid" && Number(singlePay?.dueamount) === Number(singlePay?.paidamount)) ? "Completed" : "Partially Paid"} readOnly />
                        </FormControl>
                        &emsp;
                      </Grid>
                      <Grid
                        item
                        md={3}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>Paid Through</Typography>
                          <OutlinedInput
                            value={singlePay?.paidthrough}
                            readOnly
                          />
                        </FormControl>
                        &emsp;
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Reference No</Typography>
                          <OutlinedInput
                            readOnly
                            value={singlePay.referenceno}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {singlePay.paidthrough === "Cash" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <br />
                        <br />
                        <br />

                        <Grid
                          item
                          md={4}
                          lg={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "bold" }}>
                              Cash
                            </Typography>
                            <br />

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              readOnly={true}
                              value={"Cash"}
                              onChange={(e) => { }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  {singlePay.paidthrough === "Bank Transfer" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <br />
                        <br />

                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Bank Details
                          </Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.bankname}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Branch Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.bankbranchname}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Holder Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.accountholdername}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.accountnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>IFSC Code</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.ifsccode}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  {singlePay.paidthrough === "UPI" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            UPI Details
                          </Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>UPI Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.upinumber}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  {singlePay.paidthrough === "Card" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid md={12} item xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Card Details
                          </Typography>
                        </Grid>

                        <br />
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.cardnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Holder Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.cardholdername}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Transaction Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.cardtransactionnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Type</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.cardtype}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Expire At</Typography>
                          <Grid container spacing={1}>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  readOnly={true}
                                  value={singlePay.cardmonth}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  readOnly={true}
                                  value={singlePay.cardyear}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>Security Code</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.cardsecuritycode}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  {singlePay.paidthrough === "Cheque" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Cheque Details
                          </Typography>
                        </Grid>

                        <br />

                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>Cheque Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={singlePay.chequenumber}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                </>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="h6">Attachments</Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <Typography variant="h6">Bill </Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadcreatefirst"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                    multiple

                  />
                  <label htmlFor="file-inputuploadcreatefirst"></label>
                  <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                      {billdocs?.map((file, index) => (
                        <>
                          <Grid container>
                            <Grid item md={2} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {/* {file.type.includes("image/") ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    height={50}
                                    style={{
                                      maxWidth: "-webkit-fill-available",
                                    }}
                                  />
                                ) : ( */}
                                <img
                                  className={classes.preview}
                                  src={getFileIcon(file.name)}
                                  height="25"
                                  alt="file icon"
                                />
                                {/* )} */}
                              </Box>
                            </Grid>
                            <Grid
                              item
                              md={8}
                              sm={8}
                              xs={8}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {file.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  marginTop: "16px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => {
                                    if (file.preview) {
                                      renderFilePreview(file)
                                    } else {
                                      renderFilePreviewMulter(file)
                                    }
                                  }
                                  }
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <Typography variant="h6">Receipt</Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputupload"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                    multiple

                  />
                  <label htmlFor="file-inputupload"></label>
                  <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                      {receiptDocs?.map((file, index) => (
                        <>
                          <Grid container>
                            <Grid item md={2} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {/* {file.type.includes("image/") ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    height={50}
                                    style={{
                                      maxWidth: "-webkit-fill-available",
                                    }}
                                  />
                                ) : ( */}
                                <img
                                  className={classes.preview}
                                  src={getFileIcon(file.name)}
                                  height="25"
                                  alt="file icon"
                                />
                                {/* )} */}
                              </Box>
                            </Grid>
                            <Grid
                              item
                              md={8}
                              sm={8}
                              xs={8}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">
                                {file.name}{" "}
                              </Typography>
                            </Grid>
                            <Grid item md={2} sm={2} xs={2}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  marginTop: "16px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => {
                                    if (file.preview) {
                                      renderFilePreview(file)
                                    } else {
                                      renderFilePreviewMulter(file)
                                    }
                                  }
                                  }
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
                <br /> <br />
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <br />
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button variant="contained" onClick={handleViewClose} sx={buttonStyles.btncancel}>
                      {" "}
                      Back
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"PaidReport"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
    </Box>
  );
}
export default Paidlist;
