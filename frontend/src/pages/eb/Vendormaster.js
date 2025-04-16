import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box, InputAdornment,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus } from "react-icons/fa"; import { AiOutlineClose } from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import {
  accounttypes,
  cardtypes,
  modeofpayments,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";


//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/SearchbarEbList.js';
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";
function VendorMasterForEB() {
  const [vendormaster, setVendormaster] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [modeofpay, setmodeofpay] = useState([]);

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
    "Vendor ID",
    "Vendor Name",
    "Email Id",
    "Phone No",
    "WhatsApp No",
    "Address",
    "Country",
    "State",
    "City",
    "Pincode",
    "GST No",
    "LandLine",
    "Contact Person Name",
    "Credit Days",
    "Mode Of Payments",
  ];
  let exportRowValues = [

    "vendorid",
    "vendorname",
    "emailid",
    "phonenumber",
    "whatsappnumber",
    "address",
    "country",
    "state",
    "city",
    "pincode",
    "gstnumber",
    "landline",
    "contactperson",
    "creditdays",
    "modeofpayments",
  ];



  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Vendor Details"),
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


  let newval = "EB0001";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [vendor, setVendor] = useState({
    vendorname: "",
    emailid: "",
    phonenumber: "",
    phonenumberone: "",
    phonenumbertwo: "",
    phonenumberthree: "",
    phonenumberfour: "",
    whatsappnumber: "",
    contactperson: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    gstnumber: "",
    creditdays: "",
    bankname: "Please Select Bank Name",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    phonecheck: false,
    modeofpayments: "Please Select Mode of Payments",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "Please Select Card Type",
    cardmonth: "Month",
    cardyear: "Year",
    cardsecuritycode: "",
  });

  const [cateCode, setCatCode] = useState([]);
  const [stdCode, setStdCode] = useState();
  const [lanNumber, setLanNumber] = useState();
  const [vendoredit, setVendoredit] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [allVendoredit, setAllVendoredit] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isUserRoleAccess, isUserRoleCompare, buttonStyles, isAssignBranch, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [vendorCheck, setVendorcheck] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [monthsOption, setMonthsOption] = useState([]);
  const [yearsOption, setYearsOption] = useState([]);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteVendor, setDeletevendor] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    vendorid: true,
    vendorname: true,
    emailid: true,
    phonenumber: true,
    whatsappnumber: true,
    address: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    gstnumber: true,
    landline: true,
    contactperson: true,
    creditdays: true,
    modeofpayments: true,
    checkbox: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedStatep, setSelectedStatep] = useState(
    State.getStatesOfCountry(selectedCountryp?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCityp, setSelectedCityp] = useState(
    City.getCitiesOfState(
      selectedStatep?.countryCode,
      selectedStatep?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );
  const [selectedCountryc, setSelectedCountryc] = useState();
  const [selectedStatec, setSelectedStatec] = useState();
  const [selectedCityc, setSelectedCityc] = useState();
  //useEffect
  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber, vendor.modeofpayments, modeofpay]);
  useEffect(() => {
    getPhoneNumberEdit();
  }, [vendoredit.phonecheck, vendoredit.phonenumber]);
  useEffect(() => {
    fetchVendor();
    generateMonthsOptions();
    generateYearsOptions();
  }, []);
  useEffect(() => {
    fetchVendorAll();
  }, [isEditOpen, vendoredit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    addSerialNumber(vendormaster);
  }, [vendormaster]);
  const maxLength = 15; //gst number limit
  const gridRef = useRef(null);
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");


  //function to generate hrs
  const generateMonthsOptions = () => {
    const mnthsOpt = [];
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      mnthsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMonthsOption(mnthsOpt);
  };

  let today = new Date();
  var yyyy = today.getFullYear();
  //function to generate mins
  const generateYearsOptions = () => {
    const yearsOpt = [];
    for (let i = yyyy; i <= 2050; i++) {
      yearsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setYearsOption(yearsOpt);
  };
  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setVendor({ ...vendor, pincode: inputValue });
    }
  };
  const handlechangecpincodeEdit = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setVendoredit({ ...vendoredit, pincode: inputValue });
    }
  };
  const handlechangestdcode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setStdCode(inputValue);
    }
  };
  const handlechangephonenumber = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      return inputValue;
    }
  };

  // Create a row data object for the DataGrid






  const columnDataTable = [

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
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "vendorid",
      headerName: "Vendor ID",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.vendorid,
      headerClassName: "bold-header",
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.vendorname,
      headerClassName: "bold-header",
    },
    {
      field: "emailid",
      headerName: "Email ID",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.emailid,
      headerClassName: "bold-header",
    },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.phonenumber,
      headerClassName: "bold-header",
    },
    {
      field: "whatsappnumber",
      headerName: "Whatsapp Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.whatsappnumber,
      headerClassName: "bold-header",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.address,
      headerClassName: "bold-header",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.country,
      headerClassName: "bold-header",
    },
    {
      field: "state",
      headerName: "State",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.state,
      headerClassName: "bold-header",
    },
    {
      field: "city",
      headerName: "City",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.city,
      headerClassName: "bold-header",
    },
    {
      field: "pincode",
      headerName: "Pincode",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.pincode,
      headerClassName: "bold-header",
    },
    {
      field: "gstnumber",
      headerName: "GstNumber",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.gstnumber,
      headerClassName: "bold-header",
    },
    {
      field: "landline",
      headerName: "LandLine",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.landline,
      headerClassName: "bold-header",
    },
    {
      field: "contactperson",
      headerName: "Contact Person Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.contactperson,
      headerClassName: "bold-header",
    },
    {
      field: "creditdays",
      headerName: "Credit days",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.creditdays,
      headerClassName: "bold-header",
    },
    {
      field: "modeofpayments",
      headerName: "Mode Of Payments",
      flex: 0,
      width: 130,
      minHeight: "80px",
      hide: !columnVisibility.modeofpayments,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eebvendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("debvendormaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vebvendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              {" "}
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("iebvendormaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              {" "}
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{" "}
            </Button>
          )}
        </Grid>
      ),
    },
  ];


  const handleMobile = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Mobile number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, phonenumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setPopupContentMalert("Whats app number can't more than 10 characters!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, whatsappnumber: num });
    }
  };
  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
    } else {
      setVendor({ ...vendor, whatsappnumber: "" });
    }
  };
  const getPhoneNumberEdit = () => {
    if (vendoredit.phonecheck) {
      setVendoredit({ ...vendoredit, whatsappnumber: vendoredit.phonenumber });
    } else {
      setVendoredit({
        ...vendoredit,
        whatsappnumber: vendoredit.whatsappnumber,
      });
    }
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
    setIsHandleChange(true)
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // new code for toggle based on the remove columns
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDOREB}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletevendor(res?.data?.svendoreb);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let Vendorsid = deleteVendor?._id;
  const delVendor = async () => {
    setPageName(!pageName)
    try {
      if (Vendorsid) {
        await axios.delete(`${SERVICE.SINGLE_VENDOREB}/${Vendorsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchVendor();
        handleCloseMod();
        setPage(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //bank name options

  const [modeofpayEdit, setmodeofpayEdit] = useState([]);

  const deleteTodo = (index) => {
    setPageName(!pageName)
    setmodeofpay(
      modeofpay.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendor({
          ...vendor,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendor({ ...vendor, upinumber: "" });
        break;
      case "Cheque":
        setVendor({ ...vendor, chequenumber: "" });
        break;
      case "Card":
        setVendor({
          ...vendor,
          cardnumber: "",
          cardholdername: "",
          cardtransactionnumber: "",
          cardtype: "Please Select Card Type",
          cardmonth: "Month",
          cardyear: "Year",
          cardsecuritycode: "",
        });
        break;
    }
  };

  const deleteTodoEdit = (index) => {
    setmodeofpayEdit(
      modeofpayEdit.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendoredit({
          ...vendoredit,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendoredit({ ...vendoredit, upinumber: "" });
        break;
      case "Cheque":
        setVendoredit({ ...vendoredit, chequenumber: "" });
        break;
      case "Card":
        setVendoredit({
          ...vendoredit,
          cardnumber: "",
          cardholdername: "",
          cardtransactionnumber: "",
          cardtype: "Please Select Card Type",
          cardmonth: "Month",
          cardyear: "Year",
          cardsecuritycode: "",
        });
        break;
    }
  };

  //submit option for saving
  const handlemodeofpay = () => {
    if (vendor.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpay.includes(vendor.modeofpayments)) {
      setPopupContentMalert("ToDo is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setmodeofpay([...modeofpay, vendor.modeofpayments]);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    let filtered = Array.from(new Set(modeofpay));
    try {
      let addVendorDetails = await axios.post(SERVICE.VENDOREB_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorid: String(newval),
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        phonenumberone: Number(vendor.phonenumberone),
        phonenumbertwo: Number(vendor.phonenumbertwo),
        phonenumberthree: Number(vendor.phonenumberthree),
        phonenumberfour: Number(vendor.phonenumberfour),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        country: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        state: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        city: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),
        pincode: Number(vendor.pincode),
        gstnumber: String(vendor.gstnumber),
        landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
        creditdays: Number(vendor.creditdays),
        modeofpayments: [...filtered],
        bankname: filtered.includes("Bank Transfer")
          ? String(vendor.bankname)
          : "",
        bankbranchname: filtered.includes("Bank Transfer")
          ? String(vendor.bankbranchname)
          : "",
        accountholdername: filtered.includes("Bank Transfer")
          ? String(vendor.accountholdername)
          : "",
        accountnumber: filtered.includes("Bank Transfer")
          ? String(vendor.accountnumber)
          : "",
        ifsccode: filtered.includes("Bank Transfer")
          ? String(vendor.ifsccode)
          : "",

        upinumber: filtered.includes("UPI") ? String(vendor.upinumber) : "",

        cardnumber: filtered.includes("Card") ? String(vendor.cardnumber) : "",
        cardholdername: filtered.includes("Card")
          ? String(vendor.cardholdername)
          : "",
        cardtransactionnumber: filtered.includes("Card")
          ? String(vendor.cardtransactionnumber)
          : "",
        cardtype: filtered.includes("Card") ? String(vendor.cardtype) : "",
        cardmonth: filtered.includes("Card") ? String(vendor.cardmonth) : "",
        cardyear: filtered.includes("Card") ? String(vendor.cardyear) : "",
        cardsecuritycode: filtered.includes("Card")
          ? String(vendor.cardsecuritycode)
          : "",
        chequenumber: filtered.includes("Cheque")
          ? String(vendor.chequenumber)
          : "",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchVendor();
      setVendor({
        ...vendor,
        vendorname: "",
        emailid: "",
        phonenumber: "",
        phonenumberone: "",
        phonenumbertwo: "",
        phonenumberthree: "",
        phonenumberfour: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        gstnumber: "",
        creditdays: "",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        upinumber: "",
        cardnumber: "",
        cardholdername: "",
        cardtransactionnumber: "",
        cardsecuritycode: "",
        chequenumber: "",
        phonecheck: false,
      });
      setStdCode("");
      setLanNumber("");
      const country = Country.getAllCountries().find(
        (country) => country.name === "India"
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === "Tamil Nadu"
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === "Tiruchirappalli");
      setSelectedCountryp(country);
      setSelectedStatep(state);
      setSelectedCityp(city);
      setmodeofpay([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handlemodeofpayEdit = () => {
    if (vendoredit.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (modeofpayEdit.includes(vendoredit.modeofpayments)) {
      setPopupContentMalert("ToDo is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setmodeofpayEdit([...modeofpayEdit, vendoredit.modeofpayments]);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    const isNameMatch = vendormaster.some(
      (item) =>
        item.vendorname.toLowerCase() === (vendor.vendorname).toLowerCase()
    );
    if (vendor.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (vendor.emailid === "") {
    //   setPopupContentMalert("Please Enter EmailId!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    // else if (!validateEmail(vendor.emailid) && vendor.emailid) {
    //   setPopupContentMalert("Please Enter Valid Email Id!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    else if (vendor.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCountryp?.isoCode !== selectedStatep?.countryCode) {
      setPopupContentMalert("Please Select The Correct State!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCountryp?.isoCode !== selectedCityp?.countryCode ||
      selectedStatep?.isoCode !== selectedCityp?.stateCode
    ) {
      setPopupContentMalert("Please Select The Correct City!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankname === "Please Select Bank Name"
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Bank Transfer") && vendor.ifsccode === "") {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("UPI") && vendor.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardholdername === "") {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtype === "Please Select Card Type"
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardmonth === "Month") {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardyear === "Year") {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardsecuritycode === "") {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Cheque") && vendor.chequenumber === "") {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Vendor Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendor.phonenumber !== "" && vendor.phonenumber.length < 10) {
      setPopupContentMalert("Please Enter Valid Phone Number!");
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      phonenumberone: "",
      phonenumbertwo: "",
      phonenumberthree: "",
      phonenumberfour: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      gstnumber: "",
      creditdays: "",
      bankname: "Please Select Bank Name",
      bankbranchname: "",
      accountholdername: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
      modeofpayments: "Please Select Mode of Payments",
      upinumber: "",
      chequenumber: "",
      cardnumber: "",
      cardholdername: "",
      cardtransactionnumber: "",
      cardtype: "Please Select Card Type",
      cardmonth: "Month",
      cardyear: "Year",
      cardsecuritycode: "",
    });
    const country = Country.getAllCountries().find(
      (country) => country.name === "India"
    );
    const state = State.getStatesOfCountry(country?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    );
    const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(
      (city) => city.name === "Tiruchirappalli"
    );
    setSelectedCountryp(country);
    setSelectedStatep(state);
    setSelectedCityp(city);
    setStdCode("");
    setLanNumber("");
    setmodeofpay([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setStdCode("");
    setLanNumber("");
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDOREB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setVendoredit(res?.data?.svendoreb);
      setVendoredit({
        ...res?.data?.svendoreb,
        modeofpayments: res?.data?.svendoreb.modeofpayments[0],
      });
      setmodeofpayEdit(res?.data?.svendoreb.modeofpayments);
      const country = Country.getAllCountries().find(
        (country) => country.name === res?.data?.svendoreb?.country
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === res?.data?.svendoreb?.state
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === res?.data?.svendoreb?.city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCityc(city);
      const landlinenumber = res?.data?.svendoreb?.landline;
      const firstFour = landlinenumber.slice(0, 4);
      setStdCode(firstFour);
      const numbersExceptFirstFour = landlinenumber.slice(4);
      setLanNumber(numbersExceptFirstFour);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [vendorview, setVendorview] = useState([])
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDOREB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendoredit(res?.data?.svendoreb);
      setVendorview(res?.data?.svendoreb);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDOREB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendoredit(res?.data?.svendoreb);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VENDOREB}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false)
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchVendor();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = vendoredit?.updatedby;
  let addedby = vendoredit?.addedby;
  let vendorid = vendoredit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    let filtered = Array.from(new Set(modeofpayEdit));
    try {
      let res = await axios.put(`${SERVICE.SINGLE_VENDOREB}/${vendorid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorname: String(vendoredit.vendorname),
        emailid: String(vendoredit.emailid),
        phonenumber: Number(vendoredit.phonenumber),
        phonenumberone: Number(vendoredit.phonenumberone),
        phonenumbertwo: Number(vendoredit.phonenumbertwo),
        phonenumberthree: Number(vendoredit.phonenumberthree),
        phonenumberfour: Number(vendoredit.phonenumberfour),
        whatsappnumber: Number(vendoredit.whatsappnumber),
        phonecheck: Boolean(vendoredit.phonecheck),
        address: String(vendoredit.address),
        country: String(
          selectedCountryc?.name == undefined ? "" : selectedCountryc?.name
        ),
        state: String(
          selectedStatec?.name == undefined ? "" : selectedStatec?.name
        ),
        city: String(
          selectedCityc?.name == undefined ? "" : selectedCityc?.name
        ),
        pincode: String(vendoredit.pincode),
        gstnumber: String(vendoredit.gstnumber),
        landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
        contactperson: String(vendoredit.contactperson),
        creditdays: Number(vendoredit.creditdays),
        modeofpayments: [...filtered],
        bankname: filtered.includes("Bank Transfer")
          ? String(vendoredit.bankname)
          : "",
        bankbranchname: filtered.includes("Bank Transfer")
          ? vendoredit.bankbranchname
          : "",
        accountholdername: filtered.includes("Bank Transfer")
          ? vendoredit.accountholdername
          : "",
        accountnumber: filtered.includes("Bank Transfer")
          ? vendoredit.accountnumber
          : "",
        ifsccode: filtered.includes("Bank Transfer") ? vendoredit.ifsccode : "",

        upinumber: filtered.includes("UPI") ? vendoredit.upinumber : "",

        cardnumber: filtered.includes("Card") ? vendoredit.cardnumber : "",
        cardholdername: filtered.includes("Card")
          ? vendoredit.cardholdername
          : "",
        cardtransactionnumber: filtered.includes("Card")
          ? vendoredit.cardtransactionnumber
          : "",
        cardtype: filtered.includes("Card") ? vendoredit.cardtype : "",
        cardmonth: filtered.includes("Card") ? vendoredit.cardmonth : "",
        cardyear: filtered.includes("Card") ? vendoredit.cardyear : "",
        cardsecuritycode: filtered.includes("Card")
          ? vendoredit.cardsecuritycode
          : "",

        chequenumber: filtered.includes("Cheque")
          ? vendoredit.chequenumber
          : "",
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchVendor();
      setStdCode("");
      setLanNumber("");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = async (e) => {
    setPageName(!pageName)
    e.preventDefault();
    await fetchVendorAll();
    const isNameMatch = allVendoredit.some(
      (item) =>
        item.vendorname.toLowerCase() === (vendoredit.vendorname).toLowerCase()
    );
    if (vendoredit.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (vendoredit.emailid === "") {
    //   setPopupContentMalert("Please Enter EmailId!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    // else if (!validateEmail(vendoredit.emailid)) {
    //   setPopupContentMalert("Please Enter Valid Email Id!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } 
    else if (vendoredit.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCountryc?.isoCode !== selectedStatec?.countryCode) {
      setPopupContentMalert("Please Select The Correct State!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCountryc?.isoCode !== selectedCityc?.countryCode ||
      selectedStatec?.isoCode !== selectedCityc?.stateCode
    ) {
      setPopupContentMalert("Please Select The Correct City!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendoredit.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      (vendoredit.bankname === "Please Select Bank Name" ||
        vendoredit.bankname === "")
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Bank Transfer") &&
      vendoredit.ifsccode === ""
    ) {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.includes("UPI") && vendoredit.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.includes("Card") && vendoredit.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      vendoredit.cardholdername === ""
    ) {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      vendoredit.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardtype === "Please Select Card Type" ||
        vendoredit.cardtype === "")
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardmonth === "Month" || vendoredit.cardmonth === "")
    ) {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Card") &&
      (vendoredit.cardyear === "Year" || vendoredit.cardyear === "")
    ) {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendoredit.modeofpayments === "Card" &&
      vendoredit.cardsecuritycode === ""
    ) {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpayEdit.includes("Cheque") &&
      vendoredit.chequenumber === ""
    ) {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpayEdit.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (vendoredit.phonenumber !== "" && vendoredit.phonenumber.length < 10) {
      setPopupContentMalert("Please Enter Valid Phone Number!");
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Vendor Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all  vendoreb.
  const fetchVendor = async () => {

    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDOREB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorcheck(true);
      setVendormaster(res_vendor?.data?.vendoreb?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        vendorid: item.vendorid,
        vendorname: item.vendorname,
        emailid: item.emailid,
        phonenumber: item.phonenumber,
        whatsappnumber: item.whatsappnumber,
        address: item.address,
        country: item.country,
        state: item.state,
        city: item.city,
        pincode: item.pincode,
        gstnumber: item.gstnumber,
        landline: item.landline,
        contactperson: item.contactperson,
        creditdays: item.creditdays,
        modeofpayments: item.modeofpayments,
      })));
      setCatCode(res_vendor?.data?.vendoreb);
      setAllVendoredit(
        res_vendor?.data?.vendoreb.filter((item) => item._id !== vendoredit._id)
      );
    } catch (err) {
      setVendorcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchVendorAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDOREB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllVendoredit(
        res_vendor?.data?.vendoreb.filter((item) => item._id !== vendoredit._id)
      );
    } catch (err) {
      setVendorcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  useEffect(() => {
    fetchVendor()
  }, [])

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "VendorMasterForEB.png");
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
    documentTitle: "VendorMasterForEB",
    pageStyle: "print",
  });
  const addSerialNumber = (datas) => {
    setItems(datas);

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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendorid: item.vendorid,
      vendorname: item.vendorname,
      emailid: item.emailid,
      phonenumber: item.phonenumber,
      whatsappnumber: item.whatsappnumber,
      address: item.address,
      country: item.country,
      state: item.state,
      city: item.city,
      pincode: item.pincode,
      gstnumber: item.gstnumber,
      landline: item.landline,
      contactperson: item.contactperson,
      creditdays: item.creditdays,
      modeofpayments: item.modeofpayments,
    };
  });

  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <Headtitle title={"EB VENDOR MASTER "} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Vendor Details </Typography> */}
      <PageHeading
        title="Vendor Details"
        modulename="EB"
        submodulename="EB Vendor Master"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aebvendormaster") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  {" "}
                  <Typography sx={{ fontWeight: "bold" }}>
                    Add Vendor Master For EB
                  </Typography>{" "}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {vendormaster &&
                      vendormaster.map(() => {
                        let strings = "EB";
                        let refNo = vendormaster[vendormaster?.length - 1]?.vendorid;
                        let digits = (vendormaster?.length + 1).toString();
                        const stringLength = refNo?.length;
                        let lastChar = refNo?.charAt(stringLength - 1);
                        let getlastBeforeChar = refNo.charAt(stringLength - 2);
                        let getlastThreeChar = refNo.charAt(stringLength - 3);
                        let lastBeforeChar = refNo.slice(-2);
                        let lastThreeChar = refNo.slice(-3);
                        let lastDigit = refNo.slice(-4);
                        let refNOINC = parseInt(lastChar) + 1;
                        let refLstTwo = parseInt(lastBeforeChar) + 1;
                        let refLstThree = parseInt(lastThreeChar) + 1;
                        let refLstDigit = parseInt(lastDigit) + 1;
                        if (
                          digits.length < 4 &&
                          getlastBeforeChar == 0 &&
                          getlastThreeChar == 0
                        ) {
                          refNOINC = ("000" + refNOINC).substr(-4);
                          newval = strings + refNOINC;
                        } else if (
                          digits.length < 4 &&
                          getlastBeforeChar > 0 &&
                          getlastThreeChar == 0
                        ) {
                          refNOINC = ("00" + refLstTwo).substr(-4);
                          newval = strings + refNOINC;
                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                          refNOINC = ("0" + refLstThree).substr(-4);
                          newval = strings + refNOINC;
                        } else {
                          refNOINC = refLstDigit.substr(-4);
                          newval = strings + refNOINC;
                        }
                      })}
                    <Typography>
                      Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter Vendor Id"
                      value={newval}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.vendorname}
                      placeholder="Please Enter Vendor Name"
                      onChange={(e) => {
                        setVendor({ ...vendor, vendorname: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Email ID
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="email"
                      value={vendor.emailid}
                      placeholder="Please Enter Email ID"
                      onChange={(e) => {
                        setVendor({ ...vendor, emailid: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumber}
                      placeholder="Please Enter Phone Number"
                      onChange={(e) => {
                        setVendor({ ...vendor, phonenumber: e.target.value });
                        handleMobile(e.target.value);
                      }}
                    />
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={vendor.phonecheck} />}
                        onChange={(e) =>
                          setVendor({
                            ...vendor,
                            phonecheck: !vendor.phonecheck,
                          })
                        }
                        label="Same as Whats app number"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Alternate Phone Number
                  </Typography>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 1</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberone}
                      placeholder="Please Enter Phone Number 1"
                      onChange={(e) => {
                        const phoneone = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberone: phoneone });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumbertwo}
                      placeholder="Please Enter Phone Number 2"
                      onChange={(e) => {
                        const phonetwo = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumbertwo: phonetwo });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 3</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberthree}
                      placeholder="Please Enter Phone Number 3"
                      onChange={(e) => {
                        const phonethree = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberthree: phonethree });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Phone Number 4</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.phonenumberfour}
                      placeholder="Please Enter Phone Number 4"
                      onChange={(e) => {
                        const phonefour = handlechangephonenumber(e);
                        setVendor({ ...vendor, phonenumberfour: phonefour });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>WhatsApp Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={vendor.whatsappnumber}
                      placeholder="Please Enter Whatsapp Number"
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          whatsappnumber: e.target.value,
                        });
                        handlewhatsapp(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Address <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      placeholder="Please Enter Address"
                      value={vendor.address}
                      onChange={(e) => {
                        setVendor({ ...vendor, address: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Country</Typography>
                    <Selects
                      options={Country.getAllCountries()}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedCountryp}
                      onChange={(item) => {
                        setSelectedCountryp(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          country: item?.name || "",
                        }));
                        setSelectedStatep("")
                        setSelectedCityp("")
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>State</Typography>
                    <Selects
                      options={State?.getStatesOfCountry(
                        selectedCountryp?.isoCode
                      )}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedStatep}
                      onChange={(item) => {
                        setSelectedStatep(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          state: item?.name || "",
                        }));
                        setSelectedCityp("")
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>City</Typography>
                    <Selects
                      options={City.getCitiesOfState(
                        selectedStatep?.countryCode,
                        selectedStatep?.isoCode
                      )}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedCityp}
                      onChange={(item) => {
                        setSelectedCityp(item);
                        setVendor((prevSupplier) => ({
                          ...prevSupplier,
                          city: item?.name || "",
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Pincode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="Please Enter Pincode"
                      value={vendor.pincode}
                      sx={userStyle.input}
                      onChange={(e) => {
                        handlechangecpincode(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>GST Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.gstnumber}
                      placeholder="Please Enter GST Number"
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= maxLength) {
                          setVendor({ ...vendor, gstnumber: newValue });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <Grid container>
                    <Grid item md={4} xs={6} sm={6}>
                      <FormControl size="small" fullWidth>
                        <Typography>Landline</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={stdCode}
                          placeholder="STD Code"
                          sx={userStyle.input}
                          onChange={(e) => {
                            handlechangestdcode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={8} xs={6} sm={6}>
                      <FormControl size="small" fullWidth>
                        <Typography>&nbsp;</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={lanNumber}
                          placeholder="Number"
                          sx={userStyle.input}
                          onChange={(e) => {
                            setLanNumber(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Contact Person Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={vendor.contactperson}
                      placeholder="Please Enter Contact Person Name"
                      onChange={(e) => {
                        setVendor({ ...vendor, contactperson: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={4} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Credit Days</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      value={vendor.creditdays}
                      placeholder="Please Enter Credit Days"
                      sx={userStyle.input}
                      onChange={(e) => {
                        setVendor({ ...vendor, creditdays: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode of Payments<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeofpayments}
                      placeholder="Please Choose Mode Of Payments"
                      value={{
                        label: vendor.modeofpayments,
                        value: vendor.modeofpayments,
                      }}
                      onChange={(e) => {
                        setVendor({ ...vendor, modeofpayments: e.value });
                      }}
                    />
                  </FormControl>
                  &emsp;
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handlemodeofpay}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                  &nbsp;
                </Grid>
              </Grid>
              {modeofpay.includes("Cash") && (
                <>
                  <br />
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cash <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly={true}
                          value={"Cash"}
                          onChange={(e) => { }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Cash")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br />
              <br />
              {modeofpay.includes("Bank Transfer") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Bank Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accounttypes}
                          placeholder="Please Choose Bank Name"
                          value={{
                            label: vendor.bankname,
                            value: vendor.bankname,
                          }}
                          onChange={(e) => {
                            setVendor({ ...vendor, bankname: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Branch Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.bankbranchname}
                          placeholder="Please Enter Bank Branch Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                bankbranchname: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.accountholdername}
                          placeholder="Please Enter Account Holder Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                accountholdername: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.accountnumber}
                          placeholder="Please Enter Account Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                accountnumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          IFSC Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.ifsccode}
                          placeholder="Please Enter IFSC Code"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, ifsccode: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Bank Transfer")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br /> <br />
              {modeofpay.includes("UPI") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          UPI Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.upinumber}
                          placeholder="Please Enter UPI Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, upinumber: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("UPI")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br /> <br />
              {modeofpay.includes("Card") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Card Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.cardnumber}
                          placeholder="Please Enter Card Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({ ...vendor, cardnumber: inputvalue });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.cardholdername}
                          placeholder="Please Enter Card Holder Name"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                cardholdername: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Transaction Number
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={vendor.cardtransactionnumber}
                          placeholder="Please Enter Card Transaction Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                cardtransactionnumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Card Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={cardtypes}
                          placeholder="Please Select Card Type"
                          value={{
                            label: vendor.cardtype,
                            value: vendor.cardtype,
                          }}
                          onChange={(e) => {
                            setVendor({ ...vendor, cardtype: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>
                        Expire At<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={monthsOption}
                              placeholder="Month"
                              id="select7"
                              value={{
                                label: vendor.cardmonth,
                                value: vendor.cardmonth,
                              }}
                              onChange={(e) => {
                                setVendor({ ...vendor, cardmonth: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={yearsOption}
                              placeholder="Year"
                              value={{
                                label: vendor.cardyear,
                                value: vendor.cardyear,
                              }}
                              id="select8"
                              onChange={(e) => {
                                setVendor({ ...vendor, cardyear: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Security Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={vendor.cardsecuritycode}
                          sx={userStyle.input}
                          placeholder="Please Enter Security Code"
                          onChange={(e) => {
                            setVendor({
                              ...vendor,
                              cardsecuritycode: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Card")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br />
              <br />
              {modeofpay.includes("Cheque") && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Cheque Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          value={vendor.chequenumber}
                          placeholder="Please Enter Cheque Number"
                          onChange={(e) => {
                            const inputvalue = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                              setVendor({
                                ...vendor,
                                chequenumber: inputvalue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      &nbsp; &emsp;
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={(e) => deleteTodo("Cheque")}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lebvendormaster") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Vendor Master For EB List
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
                    <MenuItem value={(vendormaster?.length)}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelvendormaster") && (
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

                  {isUserRoleCompare?.includes("csvvendormaster") && (
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
                  {isUserRoleCompare?.includes("printvendormaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvendormaster") && (
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
                  {isUserRoleCompare?.includes("imagemanagematerial") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
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
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={vendormaster}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  gridRefTableImg={gridRefTableImg}
                  paginated={false}
                  totalDatas={vendormaster}
                />
              </Grid>
            </Grid>


            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;

            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>&ensp;

            {isUserRoleCompare?.includes("bdvendormaster") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}                                  <br />
            <br />
            {!vendorCheck ? (
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
                      rowDataTable={rowDataTable}
                      columnDataTable={columnDataTable}
                      columnVisibility={columnVisibility}
                      page={page}
                      setPage={setPage}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      setColumnVisibility={setColumnVisibility}
                      isHandleChange={isHandleChange}
                      items={items}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
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
                      itemsList={vendormaster}
                    />
                  </>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
      {/* Delete ALERT DIALOG */}

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {" "}
        {manageColumnsContent}{" "}
      </Popover>

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{ marginTop: "85px" }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Vendor Master For EB
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Vendor Id"
                        value={vendoredit.vendorid}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Vendor Name"
                        value={vendoredit.vendorname}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            vendorname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Email ID
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Email Id"
                        value={vendoredit.emailid}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            emailid: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Phone Number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumber}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            phonenumber: e.target.value,
                          });
                          handleMobile(e.target.value);
                        }}
                      />
                      <Grid>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox checked={vendoredit.phonecheck} />
                            }
                            onChange={(e) =>
                              setVendoredit({
                                ...vendoredit,
                                phonecheck: !vendoredit.phonecheck,
                              })
                            }
                            label="Same as Whats app number"
                          />
                        </FormGroup>
                      </Grid>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Alternate Phone Number
                    </Typography>
                  </Grid>
                  <br />
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 1</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberone}
                        placeholder="Please Enter Phone Number 1"
                        onChange={(e) => {
                          const phoneone = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberone: phoneone,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 2</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumbertwo}
                        placeholder="Please Enter Phone Number 2"
                        onChange={(e) => {
                          const phonetwo = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumbertwo: phonetwo,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 3</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberthree}
                        placeholder="Please Enter Phone Number 3"
                        onChange={(e) => {
                          const phonethree = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberthree: phonethree,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number 4</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={vendoredit.phonenumberfour}
                        placeholder="Please Enter Phone Number 4"
                        onChange={(e) => {
                          const phonefour = handlechangephonenumber(e);
                          setVendoredit({
                            ...vendoredit,
                            phonenumberfour: phonefour,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>WhatsApp Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Whats App Number"
                        sx={userStyle.input}
                        value={vendoredit.whatsappnumber}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            whatsappnumber: e.target.value,
                          });
                          handlewhatsapp(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Address<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Address"
                        value={vendoredit.address}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            address: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Country</Typography>
                      <Selects
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCountryc}
                        onChange={(item) => {
                          setSelectedCountryc(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            country: item?.name || "",
                          }));
                          setSelectedStatec("")
                          setSelectedCityc("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <Selects
                        options={State?.getStatesOfCountry(
                          selectedCountryc?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedStatec}
                        onChange={(item) => {
                          setSelectedStatec(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            state: item?.name || "",
                          }));
                          setSelectedCityc("")
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <Selects
                        options={City.getCitiesOfState(
                          selectedStatec?.countryCode,
                          selectedStatec?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCityc}
                        onChange={(item) => {
                          setSelectedCityc(item);
                          setVendoredit((prevSupplier) => ({
                            ...prevSupplier,
                            city: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Pincode"
                        value={vendoredit.pincode}
                        sx={userStyle.input}
                        onChange={(e) => {
                          handlechangecpincodeEdit(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>GST Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter GST Number"
                        value={vendoredit.gstnumber}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          if (newValue.length <= maxLength) {
                            setVendoredit({
                              ...vendoredit,
                              gstnumber: newValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <Grid container>
                      <Grid item md={4} xs={6} sm={6}>
                        <FormControl size="small" fullWidth>
                          <Typography>Landline</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={stdCode}
                            placeholder="STD Code"
                            sx={userStyle.input}
                            onChange={(e) => {
                              handlechangestdcode(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={8} xs={6} sm={6}>
                        <FormControl size="small" fullWidth>
                          <Typography>&nbsp;</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={lanNumber}
                            placeholder="Number"
                            sx={userStyle.input}
                            onChange={(e) => {
                              setLanNumber(e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Contact Person Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendoredit.contactperson}
                        placeholder="Please Enter Contact Person Name"
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            contactperson: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Credit Days</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={vendoredit.creditdays}
                        placeholder="Please Enter Credit Days"
                        sx={userStyle.input}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            creditdays: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode of Payments<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={modeofpayments}
                        placeholder="Please Choose Mode Of Payments"
                        value={{
                          label: vendoredit.modeofpayments,
                          value: vendoredit.modeofpayments,
                        }}
                        onChange={(e) => {
                          setVendoredit({
                            ...vendoredit,
                            modeofpayments: e.value,
                          });
                        }}
                      />
                    </FormControl>
                    &emsp;
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handlemodeofpayEdit}
                      type="button"
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </Grid>
                </Grid>
                <br /> <br />
                {modeofpayEdit.includes("Cash") && (
                  <>
                    <br />
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={3}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography sx={{ fontWeight: "bold" }}>
                            Cash <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            readOnly={true}
                            value={"Cash"}
                            onChange={(e) => { }}
                          />
                        </FormControl>
                        &nbsp; &emsp;
                        <Button
                          variant="contained"
                          color="error"
                          type="button"
                          onClick={(e) => deleteTodoEdit("Cash")}
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}{" "}
                <br />
                {modeofpayEdit.includes("Bank Transfer") && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Bank Details
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Bank Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={accounttypes}
                            placeholder="Please Choose Bank Name"
                            value={{
                              label:
                                vendoredit.bankname === ""
                                  ? "Please Select Bank Name"
                                  : vendoredit.bankname,
                              value:
                                vendoredit.bankname === ""
                                  ? "Please Select Bank Name"
                                  : vendoredit.bankname,
                            }}
                            onChange={(e) => {
                              setVendoredit({
                                ...vendoredit,
                                bankname: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Bank Branch Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.bankbranchname}
                            placeholder="Please Enter Bank Branch Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  bankbranchname: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Account Holder Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.accountholdername}
                            placeholder="Please Enter Account Holder Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  accountholdername: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Account Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.accountnumber}
                            placeholder="Please Enter Account Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  accountnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            IFSC Code<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.ifsccode}
                            placeholder="Please Enter IFSC Code"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  ifsccode: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                        &nbsp; &emsp;
                        <Button
                          variant="contained"
                          color="error"
                          type="button"
                          onClick={(e) => deleteTodoEdit("Bank Transfer")}
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                <br />
                {modeofpayEdit.includes("UPI") && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          UPI Details
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            UPI Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.upinumber}
                            placeholder="Please Enter UPI Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  upinumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                        &nbsp; &emsp;
                        <Button
                          variant="contained"
                          color="error"
                          type="button"
                          onClick={(e) => deleteTodoEdit("UPI")}
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                <br />
                {modeofpayEdit.includes("Card") && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Card Details
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.cardnumber}
                            placeholder="Please Enter Card Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Holder Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.cardholdername}
                            placeholder="Please Enter Card Holder Name"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardholdername: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Transaction Number
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={vendoredit.cardtransactionnumber}
                            placeholder="Please Enter Card Transaction Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  cardtransactionnumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Card Type<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={cardtypes}
                            placeholder="Please Select Card Type"
                            value={{
                              label:
                                vendoredit.cardtype === ""
                                  ? "Please Select Card Type"
                                  : vendoredit.cardtype,
                              value:
                                vendoredit.cardtype === ""
                                  ? "Please Select Card Type"
                                  : vendoredit.cardtype,
                            }}
                            onChange={(e) => {
                              setVendoredit({
                                ...vendoredit,
                                cardtype: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <Typography>
                          Expire At<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Selects
                                maxMenuHeight={300}
                                options={monthsOption}
                                placeholder="Month"
                                id="select7"
                                value={{
                                  label:
                                    vendoredit.cardmonth === ""
                                      ? "Month"
                                      : vendoredit.cardmonth,
                                  value:
                                    vendoredit.cardmonth === ""
                                      ? "Month"
                                      : vendoredit.cardmonth,
                                }}
                                onChange={(e) => {
                                  setVendoredit({
                                    ...vendoredit,
                                    cardmonth: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <Selects
                                maxMenuHeight={300}
                                options={yearsOption}
                                placeholder="Year"
                                value={{
                                  label:
                                    vendoredit.cardyear === ""
                                      ? "Year"
                                      : vendoredit.cardyear,
                                  value:
                                    vendoredit.cardyear === ""
                                      ? "Year"
                                      : vendoredit.cardyear,
                                }}
                                id="select8"
                                onChange={(e) => {
                                  setVendoredit({
                                    ...vendoredit,
                                    cardyear: e.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Security Code<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={vendoredit.cardsecuritycode}
                            sx={userStyle.input}
                            placeholder="Please Enter Security Code"
                            onChange={(e) => {
                              // const inputvalue = e.target.value
                              // if((/^[a-zA-Z0-9]*$/).test(inputvalue)){
                              // }
                              setVendoredit({
                                ...vendoredit,
                                cardsecuritycode: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                        &nbsp; &emsp;
                        <Button
                          variant="contained"
                          color="error"
                          type="button"
                          onClick={(e) => deleteTodoEdit("Card")}
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                <br />
                {modeofpayEdit.includes("Cheque") && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cheque Details
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{ display: "flex" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography>
                            Cheque Number<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            sx={userStyle.input}
                            value={vendoredit.chequenumber}
                            placeholder="Please Enter Cheque Number"
                            onChange={(e) => {
                              const inputvalue = e.target.value;
                              if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                                setVendoredit({
                                  ...vendoredit,
                                  chequenumber: inputvalue,
                                });
                              }
                            }}
                          />
                        </FormControl>
                        &nbsp; &emsp;
                        <Button
                          variant="contained"
                          color="error"
                          type="button"
                          onClick={(e) => deleteTodoEdit("Cheque")}
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <AiOutlineClose />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <br></br>
                  <Grid item md={3} xs={12} sm={12}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* view model */}
      <Box>
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          sx={{ marginTop: "95px" }}
          maxWidth="md"
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Vendor Master For EB
              </Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor ID</Typography>
                    <Typography>{vendorview.vendorid}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Vendor Name</Typography>
                    <Typography>{vendorview.vendorname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Email Id</Typography>
                    <Typography>{vendorview.emailid}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number</Typography>
                    <Typography>{vendorview.phonenumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 1</Typography>
                    <Typography>{vendorview.phonenumberone}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 2</Typography>
                    <Typography>{vendorview.phonenumbertwo}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 3</Typography>
                    <Typography>{vendorview.phonenumberthree}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone Number 4</Typography>
                    <Typography>{vendorview.phonenumberfour}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Whatsapp Number</Typography>
                    <Typography>{vendorview.whatsappnumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Address</Typography>
                    <Typography>{vendorview.address}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Country</Typography>
                    <Typography>{vendorview.country}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">State</Typography>
                    <Typography>{vendorview.state}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">City</Typography>
                    <Typography>{vendorview.city}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Pincode</Typography>
                    <Typography>{vendorview.pincode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">GST Number</Typography>
                    <Typography>{vendorview.gstnumber}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">LandLine</Typography>
                    <Typography>{vendorview.landline}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Contact Person Name</Typography>
                    <Typography>{vendorview.contactperson}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Credit Days</Typography>
                    <Typography>{vendorview.creditdays}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Mode Of Payment</Typography>
                    <Typography>
                      {vendorview.modeofpayments
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}

                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleCloseview}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <br />

      {/* EXPTERNAL COMPONENTS -------------- START */}
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={vendormaster ?? []}
        filename={"Vendor Master For EB"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Vendor Master For EB Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delVendor}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXPTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}
export default VendorMasterForEB;
