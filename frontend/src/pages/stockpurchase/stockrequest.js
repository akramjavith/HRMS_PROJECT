import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment-timezone";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup, Radio, InputAdornment, RadioGroup, Tooltip,
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
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Resizable from "react-resizable";
import Selects from "react-select";
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
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ListReferenceCategoryDoc from "./stockrequesttable";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

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
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";

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

function Stockmanagerequest() {

  const [alerts, setAlerts] = useState([]);
  const [getoldqty, setOldQty] = useState(0)

  const [stockmanages, setStockmanage] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState([]);
  //  const [filteredRowData, setFilteredRowData] = useState([]);
  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletecheck, setdeletecheck] = useState(false);





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
    setloadingdeloverall(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setloadingdeloverall(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setloadingdeloverall(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
    setloadingdeloverall(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Date",
    "Time",
    "Expected Days",
    "Due Date",
    "Request Mode For",
    "AssetType",
    "Asset",
    "Material",
    "Component",
    "Subcomponent",
    "Product Details",
    "UOM",
    "Quantity",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "requestdate",
    "requesttime",
    "expectdays",
    "duedate",
    "requestmode",
    "assettype",
    "asset",
    "material",
    "component",
    "subcomponent",
    "productdetails",
    "uom",
    "quantity",
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
      pagename: String("Stock Manage Request"),
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

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  // const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [Specification, setSpecification] = useState([]);
  const [Specificationsub, setSpecificationsub] = useState([]);
  const [Specificationsubedit, setSpecificationsubedit] = useState([]);
  const [Specificationedit, setSpecificationedit] = useState([]);
  const [selectedsubcomponent, setSelectedsubcomponent] = useState([]);
  const [selectedsubcomponentedit, setSelectedsubcomponentedit] = useState([]);

  //filter fields
  const [companys, setCompanys] = useState([]);
  const [assettypes, setAssettypes] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [floors, setFloors] = useState([]);

  //filter fields
  const [companysEdit, setCompanysEdit] = useState([]);
  const [assettypesEdit, setAssetypesEdit] = useState([]);
  const [branchsEdit, setBranchsEdit] = useState([]);
  const [unitsEdit, setUnitsEdit] = useState([]);

  const [materialOpt, setMaterialopt] = useState([]);
  const [materialOptEdit, setMaterialoptEdit] = useState(
    "Please Select Material"
  );

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let now = new Date();

  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let seconds = String(now.getSeconds()).padStart(2, "0");

  let currtime = `${hours}:${minutes}`;

  const [stockmanagemaster, setStockmanagemaster] = useState({
    productdetails: "",
    uom: "Please Select UOM",
    quantity: "",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    requestmode: "Please Select Request Mode",
    workstation: "Please Select Workstation",
    assettype: "",
    requesttime: currtime,
    requestdate: today,
    duedate: "",
    expectdays: "",
    asset: "",
    material: "Please Select Material",
    component: "Please Select Component",
    workcheck: false,
    addedby: "",
    updatedby: "",

    stockcategory: "Please Select Stock Category",
    stocksubcategory: "Please Select Stock Sub Category",
    uomnew: "",
    quantitynew: "",
    materialnew: "Please Select Material",
    productdetailsnew: "",
  });

  const [stockmanagemasteredit, setStockmanagemasteredit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    workstation: "Please Select Workstation",
    assettype: "",
    asset: "",
    material: "Please Select Material",
    component: "Please Select Component",
    productdetails: "",
    uom: "Please Select UOM",
    quantity: "",
    stockcategory: "Please Select Stock Category",
    stocksubcategory: "Please Select Stock Sub Category",
    uomnew: "",
    quantitynew: "",
    materialnew: "Please Select Material",
    productdetailsnew: "",
  });

  const gridRef = useRef(null);

  const [vomMaster, setVomMaster] = useState({
    name: "",
  });
  const [vomMasterget, setVomMasterget] = useState([]);

  const [assetmaster, setAssetmaster] = useState([]);

  const [asset, setAsset] = useState({
    name: "",
    materialcode: "",
    assethead: "",
  });

  const [selectedassethead, setSelectedAssethead] = useState(
    "Please Select Assethead"
  );

  const [stockArray, setStockArray] = useState([]);
  const [stockArrayEdit, setStockArrayEdit] = useState([]);

  const handleAssetChange = (e) => {
    const selectedassethead = e.value;
    setSelectedAssethead(selectedassethead);
  };
  const [assetType, setAssetType] = useState([]);
  const [selectedassetType, setSelectedAssetType] = useState(
    "Please Select Asset Type"
  );
  const [selectedassetTypeEdit, setSelectedAssetTypeEdit] = useState(
    "Please Select Asset Type"
  );

  const [vendor, setVendor] = useState({
    vendorname: "",
    emailid: "",
    phonenumber: "",
    whatsappnumber: "",
    contactperson: "",
    address: "",
    gstnumber: "",
    bankname: "Please Select Bank Name",
    accountname: "",
    accountnumber: "",
    ifsccode: "",
    phonecheck: false,
  });

  const maxLength = 15;

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
    { value: "ANDHRA BANK", label: "ANDHRA BANK" },
    { value: "AXIS BANK", label: "AXIS BANK" },
    { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
    { value: "BANK OF BARODA", label: "BANK OF BARODA" },
    { value: "CITY UNION BANK", label: "CITY UNION BANK" },
    { value: "UCO BANK", label: "UCO BANK" },
    { value: "TMB BANK", label: "TMB BANK" },
    { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
    { value: "BANK OF INDIA", label: "BANK OF INDIA" },
    { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
    { value: "CANARA BANK", label: "CANARA BANK" },
    { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
    { value: "CORPORATION BANK", label: "CORPORATION BANK" },
    { value: "INDIAN BANK", label: "INDIAN BANK" },
    { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
    { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
    { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
    { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
    { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
    { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
    { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
    { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
    { value: "VIJAYA BANK", label: "VIJAYA BANK" },
    { value: "DENA BANK", label: "DENA BANK" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED",
      label: "BHARATIYA MAHILA BANK LIMITED",
    },
    { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
    { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
    { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
    { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
    { value: "PAYTM BANK", label: "PAYTM BANK" },
    { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
    { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
    { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
    { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
    { value: "YES BANK LTD", label: "YES BANK LTD" },
    { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
    { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
    { value: "DCB BANK", label: "DCB BANK" },
    { value: "IDFC BANK", label: "IDFC BANK" },
    {
      value: "JAMMU AND KASHMIR BANK BANK",
      label: "JAMMU AND KASHMIR BANK BANK",
    },
    { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
    { value: "RBL BANK", label: "RBL BANK" },
    { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
    { value: "CSB BANK", label: "CSB BANK" },
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

  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  //Bill upload create

  const [getImg, setGetImg] = useState(null);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [file, setFile] = useState();
  console.log(Number(getoldqty), Number(stockmanagemaster.maximumquantity), Number(getoldqty), Number(stockmanagemaster.quantitynew), Number(stockmanagemaster.maximumquantity), "285")
  const handleStockArray = () => {

    const totalArray = stockArray.reduce((acc, sum) => acc + Number(sum.quantitynew), 0)

    const isNameMatch = stockArray.some(
      (item) =>
        item.materialnew == stockmanagemaster.materialnew &&
        item.uomnew === String(stockmanagemaster.uomnew) &&
        item.quantitynew == stockmanagemaster.quantitynew
    );
    if (
      stockmanagemaster.materialnew === "Please Select Material" ||
      stockmanagemaster.materialnew === ""
    ) {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemaster.uomnew === "" ||
      stockmanagemaster.uomnew === undefined
    ) {
      setPopupContentMalert("Please Select UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemaster.quantitynew === "" ||
      stockmanagemaster.quantitynew === undefined
    ) {
      setPopupContentMalert("Please Enter Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }



    else if (Number(stockmanagemaster.maximumquantity) < Number(stockmanagemaster.quantitynew)) {
      setPopupContentMalert(`Please Enter Less than or Equal to ${stockmanagemaster.maximumquantity}!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (Number(getoldqty) + Number(stockmanagemaster.quantitynew) + totalArray > Number(stockmanagemaster.maximumquantity)) {
      setPopupContentMalert(`Maximum Quantity Reached!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (isNameMatch) {
      setPopupContentMalert("Todo Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }

    else {
      let findData = uomcodes.find(
        (item) => item.name === stockmanagemaster.uomnew
      );

      setStockArray([
        ...stockArray,
        {
          uomnew: stockmanagemaster.uomnew,
          quantitynew: stockmanagemaster.quantitynew,
          materialnew: stockmanagemaster.materialnew,
          productdetailsnew: stockmanagemaster.productdetailsnew,
          uomcodenew: findData?.code,
        },
      ]);

      setStockmanagemaster({
        ...stockmanagemaster,
        uomnew: "",
        quantitynew: "",
        materialnew: "Please Select Material",
        productdetailsnew: "",
      });
    }
  };

  const deleteTodo = (index) => {
    setStockArray(
      stockArray.filter((data, indexcurrent) => {
        return indexcurrent !== index;
      })
    );
  };

  const fetchAssetType = async () => {
    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projall = [
        ...res_account?.data?.assettypemaster?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      const aeestuniqueArray = projall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });
      setAssetType(aeestuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setFile("");
    setRefImage([]);
  };

  //first allexcel....
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
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

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImage(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const resetImage = () => {
    setGetImg("");
    setFile("");
    setRefImage([]);
    setPreviewURL(null);
  };

  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // upload warranty

  const [getImgwarranty, setGetImgwarranty] = useState(null);
  const [refImagewarranty, setRefImagewarranty] = useState([]);
  const [previewURLwarranty, setPreviewURLwarranty] = useState(null);
  const [valNumwarranty, setValNumwarranty] = useState(0);
  const [filewarranty, setFilewarranty] = useState();

  // Upload Popup
  const [uploadPopupOpenwarranty, setUploadPopupOpenwarranty] = useState(false);
  const handleClickUploadPopupOpenwarranty = () => {
    setUploadPopupOpenwarranty(true);
  };
  const handleUploadPopupClosewarranty = () => {
    setUploadPopupOpenwarranty(false);
    setGetImgwarranty("");
    setFilewarranty("");
    setPreviewURLwarranty(null);
  };

  //first allexcel....
  const getFileIconwarranty = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
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

  //reference images
  const handleInputChangewarranty = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImagewarranty(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFilewarranty = (index) => {
    const newSelectedFiles = [...refImagewarranty];
    newSelectedFiles.splice(index, 1);
    setRefImagewarranty(newSelectedFiles);
  };

  const renderFilePreviewwarranty = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const resetImagewarranty = () => {
    setGetImgwarranty("");
    setFilewarranty("");
    setRefImagewarranty([]);
    setPreviewURLwarranty(null);
  };

  const handleUploadOverAllwarranty = () => {
    setUploadPopupOpenwarranty(false);
  };

  const previewFilewarranty = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLwarranty(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //warraty upload edit

  const [getImgwarrantyedit, setGetImgwarrantyedit] = useState(null);
  const [refImagewarrantyedit, setRefImagewarrantyedit] = useState([]);
  const [previewURLwarrantyedit, setPreviewURLwarrantyedit] = useState(null);
  const [valNumwarrantyedit, setValNumwarrantyedit] = useState(0);
  const [filewarrantyedit, setFilewarrantyedit] = useState();

  // Upload Popup
  const [uploadPopupOpenwarrantyedit, setUploadPopupOpenwarrantyedit] =
    useState(false);
  const handleClickUploadPopupOpenwarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(true);
  };
  const handleUploadPopupClosewarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(false);
    setGetImgwarrantyedit("");
    setFilewarrantyedit("");
    setPreviewURLwarrantyedit(null);
  };

  //first allexcel....
  const getFileIconwarrantyedit = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
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

  //reference images
  const handleInputChangewarrantyedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImagewarrantyedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImagewarrantyedit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFilewarrantyedit = (index) => {
    const newSelectedFiles = [...refImagewarrantyedit];
    newSelectedFiles.splice(index, 1);
    setRefImagewarrantyedit(newSelectedFiles);
  };

  const renderFilePreviewwarrantyedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const resetImagewarrantyedit = () => {
    setGetImgwarrantyedit("");
    setFilewarrantyedit("");
    setRefImagewarrantyedit([]);
    setPreviewURLwarrantyedit(null);
  };

  const handleUploadOverAllwarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(false);
  };

  const previewFilewarrantyedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLwarrantyedit(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //bill upload edit

  const [getImgedit, setGetImgedit] = useState(null);
  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [valNumedit, setValNumedit] = useState(0);
  const [fileedit, setFileedit] = useState();

  // Upload Popup
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setFileedit("");
    setPreviewURLedit(null);
  };

  //first allexcel....
  const getFileIconedit = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
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

  //reference images
  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageedit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const resetImageedit = () => {
    setGetImgedit("");
    setFileedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
  };

  const handleUploadOverAlledit = () => {
    setUploadPopupOpenedit(false);
  };

  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsstock, setSelectedRowsstock] = useState([]);
  const [vendormaster, setVendormaster] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamstabledata, setTeamstableData] = useState([]);
  const [account, setAccount] = useState([]);

  const [units, setUnits] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("Please Select Branch");
  const [selectedBranchedit, setSelectedBranchedit] = useState(
    "Please Select Branch"
  );
  const [selectedUnit, setSelectedUnit] = useState("Please Select Unit");
  const [selectedUnitedit, setSelectedUnitedit] =
    useState("Please Select Unit");

  const [selectedProducthead, setSelectedProducthead] = useState(
    "Please Select Assethead"
  );
  const [selectedProductheadedit, setSelectedProductheadedit] = useState(
    "Please Select Assethead"
  );
  const [selectedProductname, setSelectedProductname] = useState(
    "Please Select Material Name"
  );
  const [selectedProductnameedit, setSelectedProductnameedit] = useState(
    "Please Select Material Name"
  );


  const [newcheckteam, setNewcheckTeam] = useState("Please Select Team");
  const [newcheckresperson, setNewcheckResperson] = useState(
    "Please Select Responsible Person"
  );
  const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");

  const [newcheckteamedit, setNewcheckTeamedit] =
    useState("Please Select Team");
  const [newcheckrespersonedit, setNewcheckRespersonedit] = useState(
    "Please Select Responsible Person"
  );
  const [newcheckbranchedit, setNewcheckBranchedit] = useState(
    "Please Select Branch"
  );

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQueryManagestock, setSearchQueryManagestock] = useState("");

  const dropdowndata = [{ label: "All", value: "All" }];

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  //new changes
  const requestModeOptions = [
    { label: "Asset Material", value: "Asset Material" },
    { label: "Stock Material", value: "Stock Material" },
  ];
  const [isStockMaterial, setIsStockMaterial] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
  const [uomOpt, setUomOpt] = useState([]);
  const [uomOptEdit, setUomOptEdit] = useState([]);
  const [subcategoryOpt, setSubcategoryOption] = useState([]);
  const [stocksubcategoryOptEdit, setStocksubcategoryOptEdit] = useState([]);
  const [materialOptNew, setMaterialoptNew] = useState([]);
  const [materialOptEditNew, setMaterialoptEditNew] = useState([]);

  const [changeTable, setChangeTable] = useState("");



  //get all branches.
  const fetchCategoryAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOption([
        ...res_location?.data?.stockcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
      setCategoryOptionEdit([
        ...res_location?.data?.stockcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //get all vom master name.
  const fetchVomMaster = async (e) => {
    try {
      let res_vom = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getdata = res_vom.data.managestockitems.filter((data) => {
        return (
          data.itemname === e.value &&
          data.stockcategory === stockmanagemaster.stockcategory &&
          data.stocksubcategory === stockmanagemaster.stocksubcategory
        );
      });

      setStockmanagemaster((prev) => ({
        ...prev,
        uomnew: getdata[0].uom,
      }));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchSubcategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.stockcategory.filter((data) => {
        return e.value === data.categoryname;
      });

      let subcatOpt = data_set
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      setSubcategoryOption(subcatOpt);
      setStocksubcategoryOptEdit(subcatOpt);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchMaterialNew = async (e) => {
    try {
      let res = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = res.data.managestockitems.filter((data) => {
        return (
          data.stockcategory === stockmanagemaster.stockcategory &&
          data.stocksubcategory === e.value
        );
      });

      const assetmaterialuniqueArray = resultall.map((item) => ({
        label: item.itemname,
        value: item.itemname,
        maximumquantity: item.maximumquantity
      }));

      setMaterialoptNew(assetmaterialuniqueArray);
      setMaterialoptEditNew(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchCompanyDropdowns = async () => {
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCompanys(companyall);
      setCompanysEdit(companyall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationOpt(res?.data?.locationgroupings);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // useEffect(() => {
  //   var filteredWorks;
  //   if (
  //     (stockmanagemaster.unit === "" || stockmanagemaster.unit == undefined) &&
  //     (stockmanagemaster.floor === "" || stockmanagemaster.floor == undefined)
  //   ) {
  //     filteredWorks = workStationOpt?.filter(
  //       (u) =>
  //         u.company === stockmanagemaster.company &&
  //         u.branch === stockmanagemaster.branch
  //     );
  //   } else if (
  //     stockmanagemaster.unit === "" ||
  //     stockmanagemaster.unit == undefined
  //   ) {
  //     filteredWorks = workStationOpt?.filter(
  //       (u) =>
  //         u.company === stockmanagemaster.company &&
  //         u.branch === stockmanagemaster.branch &&
  //         u.floor === stockmanagemaster.floor
  //     );
  //   } else if (
  //     stockmanagemaster.floor === "" ||
  //     stockmanagemaster.floor == undefined
  //   ) {
  //     filteredWorks = workStationOpt?.filter(
  //       (u) =>
  //         u.company === stockmanagemaster.company &&
  //         u.branch === stockmanagemaster.branch &&
  //         u.unit === stockmanagemaster.unit
  //     );
  //   } else {
  //     filteredWorks = workStationOpt?.filter(
  //       (u) =>
  //         u.company === stockmanagemaster.company &&
  //         u.branch === stockmanagemaster.branch &&
  //         u.unit === stockmanagemaster.unit &&
  //         u.floor === stockmanagemaster.floor
  //     );
  //   }
  //   const result = filteredWorks.flatMap((item) => {
  //     const cabinNamesArray =
  //       item.combinstation.length > 0 &&
  //         item.combinstation[0].subTodos.length > 0
  //         ? item.combinstation[0].subTodos.map((subTodo) => ({
  //           label: subTodo.subcabinname,
  //           value: subTodo.subcabinname,
  //         }))
  //         : [
  //           {
  //             label: item.combinstation[0].cabinname,
  //             value: item.combinstation[0].cabinname,
  //           },
  //         ];

  //     return cabinNamesArray;
  //   });
  //   setFilteredWorkStation(result);
  // }, [stockmanagemaster]);


  useEffect(() => {
    fetchCompanyDropdowns();
    fetchMaterialAll();
    fetchWorkStation();
    fetchCategoryAll();
    // fetchVomMaster();
  }, []);

  const fetchBranchDropdowns = async (e) => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_branch.data.branch.filter((d) => d.company === e.value);
      const branchall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchs(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchUnits = async (e) => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_unit?.data?.units.filter((d) => d.branch === e.value);
      const unitall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnits(unitall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchFloor = async (e) => {
    try {
      let res_floor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_floor.data.floors.filter((d) => d.branch === e.value);
      const floorall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setFloors(floorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchArea = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings
        .filter((d) => d.branch === newcheckbranch && d.floor === e)
        .map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreas(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchLocation = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings
        .filter(
          (d) =>
            d.branch === newcheckbranch &&
            d.floor === stockmanagemaster.floor &&
            d.area === e
        )
        .map((data) => data.location);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = [
        { label: "ALL", value: "ALL" },
        ...ji.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setLocations(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchUnitsEdit = async (e) => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_unit?.data?.units.filter((d) => d.branch === e);
      const unitall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnitsEdit(unitall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchFloorEdit = async (e) => {
    try {
      let res_floor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_floor.data.floors.filter((d) => d.branch === e);
      const floorall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setFloorEdit(floorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchAreaEdit = async (a, e) => {
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings
        .filter((d) => d.branch === a && d.floor === e)
        .map((data) => data.area);
      let ji = [].concat(...result);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreasEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  const fetchBranchDropdownsEdit = async (e) => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_branch.data.branch.filter((d) => d.company === e);
      const branchall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchsEdit(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings
        .filter((d) => d.branch === a && d.floor === b && d.area === c)
        .map((data) => data.location);
      let ji = [].concat(...result);
      const all = [
        { label: "ALL", value: "ALL" },
        ...ji.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setLocationsEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // useEffect(() => {
  //   fetchAllLocationEdit();
  // }, [isEditOpen, stockmanagemasteredit.floor]);



  const fetchMaterialAll = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // let result = res.data.assetmaterial.filter((d) => d.assethead === e.value);

      const resultall = res.data.assetmaterial.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
        assettype: d.assettype,
        asset: d.assethead,
      }));

      const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setMaterialopt(assetmaterialuniqueArray);
      setMaterialoptEdit(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchspecification = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation.filter(
        (d) => d.workstation === e.value
      );

      const resultall = result.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
        // subcomponent: d.subcomponent
      }));

      setSpecification(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchspecificationSub = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation.find((d) => d.categoryname === e);
      let resultsub = result.subcategoryname;

      const resultall = resultsub.map((d) => ({
        ...d,
        label: d.subcomponent,
        value: d.subcomponent,
        // subcomponent: d.subcomponent
      }));

      setSpecificationsub(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchspecificationSubEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation.find((d) => d.categoryname === e);
      let resultsub = result.subcategoryname;

      const resultall = resultsub.map((d) => ({
        ...d,
        label: d.subcomponent,
        value: d.subcomponent,
        // subcomponent: d.subcomponent
      }));

      setSpecificationsubedit(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchspecificationEdit = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation?.filter(
        (d) => d.workstation === stockmanagemasteredit.material
      );

      const resultall = result?.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));

      setSpecificationedit(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  useEffect(() => {
    fetchspecificationEdit();
  }, [isEditOpen]);

  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
  // view model
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };

  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };

  //alert model for Uom details
  const [openviewalertUom, setOpenviewalertUom] = useState(false);
  // view model
  const handleClickOpenviewalertUom = () => {
    setOpenviewalertUom(true);
  };

  const handleCloseviewalertUom = () => {
    setOpenviewalertUom(false);
  };

  //alert model for Asset details
  const [openviewalertAsset, setOpenviewalertAsset] = useState(false);
  // view model
  const handleClickOpenviewalertAsset = () => {
    setOpenviewalertAsset(true);
  };

  const handleCloseviewalertAsset = () => {
    setOpenviewalertAsset(false);
  };

  const [projEdit, setProjedit] = useState({
    name: "",
  });

  const {
    isUserRoleCompare,
    isAssignBranch,
    allProjects,
    isUserRoleAccess,
    allCompany,
    allBranch,
    allUnit,
    allTeam, pageName, setPageName, buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);

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
        unit: data.unit,
      }));


  const handleBranchChange = (e) => {
    const selectedBranch = e.value;
    setSelectedBranch(selectedBranch);
    setSelectedUnit("Please Select Unit");
  };

  const handleProductChange = (e) => {
    const selectedProducthead = e.value;
    setSelectedProducthead(selectedProducthead);
    setSelectedProductname("Please Select Material Name");
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});

  const [projectData, setProjectData] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });


  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjcount, setOvProjcount] = useState(0);
  const [allProjectedit, setAllProjectedit] = useState([]);

  const [checkvendor, setCheckvendor] = useState();
  const [checkcategory, setCheckcategory] = useState();
  const [checksubcategory, setChecksubcategory] = useState();
  const [checktimepoints, setChecktimepoints] = useState();

  const [copiedData, setCopiedData] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  //image


  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, '"Stock Asset Request List".png');
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const handleSelectionChangestock = (newSelection) => {
    setSelectedRowsstock(newSelection.selectionModel);
  };

  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const [openstock, setOpenstock] = useState(false);
  const handleClickOpenstock = () => {
    setOpenstock(true);
  };

  const handleClosestock = () => {
    setOpenstock(false);
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true)
    if (selectedRows.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
  };

  const classes = useStyles();

  let printsno = 1;

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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    requesttime: true,
    requestdate: true,
    duedate: true,
    expectdays: true,
    floor: true,
    area: true,
    location: true,
    workstation: true,
    requestmode: true,
    asset: true,
    assettype: true,
    material: true,
    component: true,
    subcomponent: true,
    productdetails: true,
    uom: true,
    quantity: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const fetchVendor = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const vendorall = [
        ...res_vendor?.data?.vendordetails.map((d) => ({
          ...d,
          label: d.vendorname,
          value: d.vendorname,
        })),
      ];
      setVendormaster(vendorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sstockmanage);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.STOCKMANAGE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // await fetchStockStockMaterial();

      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchStock("Filtered");

      setSelectedRows([]);
      setPage(1);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const delProjectcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.STOCKMANAGE_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false)

      await fetchStock("Filtered");
      // await fetchStockStockMaterial();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //add function
  const sendRequest = async () => {
    let subcomp = selectedsubcomponent.map((item) => item.value);
    setChangeTable("new");
    try {
      let stockcreate = await axios.post(SERVICE.STOCKMANAGE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(stockmanagemaster.company),
        branch: String(stockmanagemaster.branch),
        unit: String(stockmanagemaster.unit),
        floor: String(stockmanagemaster.floor),
        location: String(stockmanagemaster.location),
        area: String(stockmanagemaster.area),
        requestdate: String(stockmanagemaster.requestdate),
        requesttime: String(stockmanagemaster.requesttime),
        expectdays: String(stockmanagemaster.expectdays),
        duedate: String(stockmanagemaster.duedate),
        workstation: String(
          stockmanagemaster.workcheck ? stockmanagemaster.workstation : ""
        ),
        workcheck: String(stockmanagemaster.workcheck),
        assettype: String(
          stockmanagemaster.assettype === undefined
            ? ""
            : stockmanagemaster.assettype
        ),
        asset: String(stockmanagemaster.asset),
        subcomponent: subcomp,
        material: String(
          stockmanagemaster.material === "Please Select Material"
            ? ""
            : stockmanagemaster.material
        ),
        component: String(
          stockmanagemaster.component === "Please Select Component"
            ? ""
            : stockmanagemaster.component
        ),
        productdetails: String(stockmanagemaster.productdetails),
        uom:
          stockmanagemaster.uom === "Please Select UOM"
            ? ""
            : String(stockmanagemaster.uom),
        quantity: Number(stockmanagemaster.quantity),
        updating: String(""),

        requestmode: String(stockmanagemaster.requestmode),
        stockcategory:
          stockmanagemaster.stockcategory === "Please Select Stock Category"
            ? ""
            : String(stockmanagemaster.stockcategory),
        stocksubcategory:
          stockmanagemaster.stocksubcategory ===
            "Please Select Stock Sub Category"
            ? ""
            : String(stockmanagemaster.stocksubcategory),
        stockmaterialarray: stockArray,

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      // setStockmanagemaster(stockcreate.data);

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setStockArray([]);
      setChangeTable("old");
      setStockmanagemaster({
        ...stockmanagemaster,
        productdetails: "",
        quantity: "",
        addedby: "",
        updatedby: "",
        productdetailsnew: "",
        quantitynew: "",
      });
    } catch (err) {
      setChangeTable("");
      console.log(err, "send")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  // console.log(stockArray, "stockArray")
  //submit option for saving
  const handleSubmit = async (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();

    if (!isStockMaterial) {
      const isNameMatch = stockmanages.some(
        (item) =>
          item.company == stockmanagemaster.company &&
          item.branch == stockmanagemaster.branch &&
          item.unit == stockmanagemaster.unit &&
          item.floor == stockmanagemaster.floor &&
          item.area == stockmanagemaster.area &&
          item.location == stockmanagemaster.location &&
          item.requestmode == stockmanagemaster.requestmode &&
          item.material == stockmanagemaster.material &&
          item.component == stockmanagemaster.component &&
          item.productdetails.toLowerCase() ===
          stockmanagemaster.productdetails.toLowerCase() &&
          item.uom === String(stockmanagemaster.uom) &&
          item.quantity === Number(stockmanagemaster.quantity)
      );
      if (stockmanagemaster.company === "Please Select Company") {
        setPopupContentMalert("Please Select Company!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.branch === "Please Select Branch") {
        setPopupContentMalert("Please Select Branch!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.unit === "Please Select Unit") {
        setPopupContentMalert("Please Select Unit!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.floor === "Please Select Floor") {
        setPopupContentMalert("Please Select Floor!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.area === "Please Select Area") {
        setPopupContentMalert("Please Select Area!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.location === "Please Select Location") {
        setPopupContentMalert("Please Select Location!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (stockmanagemaster.requestdate === "") {
        setPopupContentMalert("Please Select Date!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.requesttime === "") {
        setPopupContentMalert("Please Select Time!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      else if (stockmanagemaster.expectdays === "") {
        setPopupContentMalert("Please Enter Expected Days!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (
        stockmanagemaster.requestmode === "" ||
        stockmanagemaster.requestmode === "Please Select Request Mode"
      ) {
        setPopupContentMalert("Please Select Request Mode For!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        stockmanagemaster.material === "" ||
        stockmanagemaster.material === "Please Select Material"
      ) {
        setPopupContentMalert("Please Select Material!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        stockmanagemaster.component === "" ||
        stockmanagemaster.component === "Please Select Component"
      ) {
        setPopupContentMalert("Please Select Component!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (Specificationsub.length > 0 && selectedsubcomponent.length === 0) {
        setPopupContentMalert("Please Select SubComponent!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (stockmanagemaster.productdetails === "") {
        setPopupContentMalert("Please Enter product Details!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        stockmanagemaster.uom === "" ||
        stockmanagemaster.uom === "Please Select UOM"
      ) {
        setPopupContentMalert("Please Select UOM!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.quantity === "") {
        setPopupContentMalert("Please Enter Quantity!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Data Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendRequest();
      }
    }
    else {


      // let response = await axios.post(SERVICE.STOCK_MANAGE_ALERT_COUNT, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      //   itemname: stockmanagemaster.materialnew,
      // })
      // setAlerts(response.data.stockmanage.length);

      console.log(alerts, "aldfkie")
      const isNameMatch = stockMaterial.some(
        item =>

          item.company == stockmanagemaster.company &&
          item.branch == stockmanagemaster.branch &&
          item.unit == stockmanagemaster.unit &&
          item.floor == stockmanagemaster.floor &&
          item.area == stockmanagemaster.area &&
          item.location == stockmanagemaster.location &&
          item.requestmode === stockmanagemaster.requestmode &&
          item.stockcategory === stockmanagemaster.stockcategory &&
          item.stocksubcategory === stockmanagemaster.stocksubcategory &&

          item.stockmaterialarray.some(obj1 =>
            stockArray.some(obj2 => obj1.uomnew == obj2.uomnew && obj1.quantitynew == obj2.quantitynew

              && obj1.materialnew == obj2.materialnew &&
              // obj1.productdetailsnew == obj2.productdetailsnew
              obj1.productdetailsnew.replace(/\n/g, '') === obj2.productdetailsnew.replace(/\n/g, '')
            )
          ),


      );

      if (stockmanagemaster.company === "Please Select Company") {
        setPopupContentMalert("Please Select Company!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.branch === "Please Select Branch") {
        setPopupContentMalert("Please Select Branch!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.unit === "Please Select Unit") {
        setPopupContentMalert("Please Select Unit!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.floor === "Please Select Floor") {
        setPopupContentMalert("Please Select Floor!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.area === "Please Select Area") {
        setPopupContentMalert("Please Select Area!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.location === "Please Select Location") {
        setPopupContentMalert("Please Select Location!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (stockmanagemaster.requestdate === "") {
        setPopupContentMalert("Please Select Date!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (stockmanagemaster.requesttime === "") {
        setPopupContentMalert("Please Select Time!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (stockmanagemaster.expectdays === "") {
        setPopupContentMalert("Please Enter Expected Days!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      else if (
        stockmanagemaster.requestmode === "" ||
        stockmanagemaster.requestmode === "Please Select Request Mode"
      ) {
        setPopupContentMalert("Please Select Request Mode For!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        stockmanagemaster.stockcategory === "" ||
        stockmanagemaster.stockcategory === "Please Select Stock Category"
      ) {
        setPopupContentMalert("Please Select Stock Category!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        stockmanagemaster.stocksubcategory === "" ||
        stockmanagemaster.stocksubcategory ===
        "Please Select Stock Sub Category"
      ) {
        setPopupContentMalert("Please Select Stock Sub Category!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      // else if (
      //   stockmanagemaster.materialnew === "" ||
      //   stockmanagemaster.materialnew ===
      //   "Please Select Material"
      // ) {
      //   setPopupContentMalert("Please Select Material");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
      // else if (stockmanagemaster.quantitynew == "") {
      //   setPopupContentMalert("Please Enter Quantity");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
      else if (stockmanagemaster.quantitynew > stockmanagemaster.maximumquantity) {
        setPopupContentMalert(`Please Enter Less than or Equal to ${stockmanagemaster.maximumquantity}!`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (stockArray.length === 0) {
        setPopupContentMalert("Please Insert Stock Todo List!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Data Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendRequest();
      }
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setStockmanagemaster({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      workstation: "Please Select Workstation",
      assettype: "",
      asset: "",
      requesttime: currtime,
      requestdate: today,
      expectdays: "",
      duedate: "",
      material: "Please Select Material",
      component: "Please Select Component",
      requestmode: "Please Select Request Mode",
      productdetails: "",
      uom: "Please Select UOM",
      quantity: "",
      stockcategory: "Please Select Stock Category",
      stocksubcategory: "Please Select Stock Sub Category",
      uomnew: "",
      quantitynew: "",
      materialnew: "Please Select Material",
      productdetailsnew: "",
      workcheck: false,
    });
    setStockArray([]);
    setBranchs([]);
    setUnits([]);
    setFloors([]);
    setAreas([]);
    setLocations([{ label: "ALL", value: "ALL" }]);
    setSelectedsubcomponent([]);
    setMaterialoptNew([]);
    setSubcategoryOption([]);

    setAccount([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // vendro details create
  //add function
  const sendRequestvendor = async () => {
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        gstnumber: String(vendor.gstnumber),
        bankname: String(
          vendor.bankname === "Please Select Bank Name" ? "" : vendor.bankname
        ),
        accountname: String(vendor.accountname),
        accountnumber: Number(vendor.accountnumber),
        ifsccode: String(vendor.ifsccode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchVendor();
      setVendor({
        vendorname: "",
        emailid: "",
        phonenumber: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        gstnumber: "",
        bankname: "Please Select Bank Name",
        accountname: "",
        accountnumber: "",
        ifsccode: "",
        phonecheck: false,
      });
      handleCloseviewalertvendor();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  //submit option for saving
  const handleSubmitvendor = (e) => {
    e.preventDefault();
    const isNameMatch = vendormaster.some(
      (item) =>
        item.vendorname.toLowerCase() === vendor.vendorname.toLowerCase() &&
        item.vendorname === vendor.vendorname
    );

    if (vendor.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!validateEmail(vendor.emailid)) {
      setPopupContentMalert("Please Enter Valid Email Id!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exis!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestvendor();
    }
  };
  const handleClearvendor = (e) => {
    e.preventDefault();
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      gstnumber: "",
      bankname: "Please Select Bank Name",
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
    });
  };

  //post call for UOM
  //add function
  const sendRequestuom = async () => {
    try {
      let vomnamecreate = await axios.post(SERVICE.CREATE_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(vomMaster.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setVomMaster(vomnamecreate.data);
      await fetchUom();
      setVomMaster({ name: "" });
      handleCloseviewalertUom();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //submit option for saving
  const handleSubmituom = (e) => {
    e.preventDefault();
    const isNameMatch = vomMasterget?.some(
      (item) => item.name?.toLowerCase() === vomMaster.name?.toLowerCase()
    );
    if (vomMaster.name === "") {
      setPopupContentMalert("Please Enter VOM Master Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestuom();
    }
  };

  const handleclearuom = (e) => {
    e.preventDefault();
    setVomMaster({ name: "" });
  };

  //post call for asset material

  //add function
  const sendRequestasset = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.ASSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assethead: selectedassethead,
        name: String(asset.name),
        materialcode: String(asset.materialcode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAsset();
      setAsset(subprojectscreate.data);
      setAsset({ ...asset, name: "", materialcode: "" });
      handleCloseviewalertAsset();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //submit option for saving
  const handleSubmitasset = (e) => {
    e.preventDefault();

    // const isNameMatch = assetmaster?.some(item => item?.name?.toLowerCase() === (asset.name)?.toLowerCase() && item.assethead === selectedassethead);
    // const isCodeMatch = assetmaster?.some(item => item?.headcode?.toLowerCase() === (asset.headcode)?.toLowerCase() && item.name?.toLowerCase() === (asset.name)?.toLowerCase() && item?.assethead === selectedassethead);
    const isNameMatch = assetmaster?.some(
      (item) =>
        item?.name?.toLowerCase() === asset.name?.toLowerCase() &&
        item.assethead === selectedassethead
    );
    const isCodeMatch = assetmaster?.some(
      (item) =>
        item?.materialcode?.toLowerCase() ===
        asset.materialcode?.toLowerCase() &&
        item.assethead === selectedassethead
    );

    if (
      selectedassethead === "" ||
      selectedassethead == "Please Select Assethead"
    ) {
      setPopupContentMalert("Please Select Assethead!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (asset.materialcode === "") {
      setPopupContentMalert("Please Enter Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (asset.name === "") {
      setPopupContentMalert("Please Enter Material Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestasset();
    }
  };
  const handleClearasset = (e) => {
    e.preventDefault();
    setSelectedAssethead("Please Select Assethead");
    setAsset({ materialcode: "", name: "" });
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setStockmanagemasteredit({
      productdetails: "",
      uom: "",
      quantity: "",
    });
    setSelectedBranchedit("Please Select Branch");
    setSelectedUnitedit("Please Select Unit");
    setSelectedProductheadedit("Please Select Assethead");
    setSelectedProductnameedit("Please Select Material Name");
  };

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setStockmanagemasteredit(res?.data?.sstockmanage);
      setSelectedBranchedit(res?.data?.sstockmanage.branch);
      setSelectedUnitedit(res?.data?.sstockmanage.unit);
      setSelectedProductheadedit(res?.data?.sstockmanage.producthead);
      setSelectedProductnameedit(res?.data?.sstockmanage.productname);
      setSelectedAssetTypeEdit(res?.data?.sstockmanage.assettype);
      setSelectedsubcomponentedit(
        res?.data?.sstockmanage.subcomponent.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      await fetchBranchDropdownsEdit(res?.data?.sstockmanage?.company);
      await fetchUnitsEdit(res?.data?.sstockmanage.branch);
      await fetchFloorEdit(res?.data?.sstockmanage?.branch);
      await fetchAreaEdit(
        res?.data?.sstockmanage?.branch,
        res?.data?.sstockmanage?.floor
      );
      await fetchAllLocationEdit(
        res?.data?.sstockmanage?.branch,
        res?.data?.sstockmanage?.floor,
        res?.data?.sstockmanage?.area
      );
      await fetchspecificationSubEdit(res?.data?.sstockmanage?.component);

      let res1 = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res1.data.assetworkstation.filter(
        (d) => d.workstation === res?.data?.sstockmanage.material
      );

      const resultall = result?.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));
      setSpecificationedit(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project_1?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data?.code,
      }));

      let setDataOne = codeValues.find(
        (item1) => res?.data?.sstockmanage.uom === item1.name
      );

      let setData = {
        ...res?.data?.sstockmanage,
        uomcode: setDataOne ? setDataOne?.code : "",
      };
      setStockmanagemasteredit(setData);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setStockmanagemasteredit(res?.data?.sstockmanage);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  //Project updateby edit page...
  let updateby = stockmanagemasteredit?.updatedby;
  let addedby = stockmanagemasteredit?.addedby;

  let maintenanceid = stockmanagemasteredit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    let subcomp = selectedsubcomponentedit.map((item) => item.value);
    try {
      let res = await axios.put(
        `${SERVICE.STOCKMANAGE_SINGLE}/${maintenanceid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(stockmanagemasteredit.company),
          branch: String(stockmanagemasteredit.branch),
          unit: String(stockmanagemasteredit.unit),
          floor: String(stockmanagemasteredit.floor),
          location: String(stockmanagemasteredit.location),
          area: String(stockmanagemasteredit.area),
          requestdate: String(stockmanagemasteredit.requestdate),
          requesttime: String(stockmanagemasteredit.requesttime),
          expectdays: String(stockmanagemasteredit.expectdays),
          duedate: String(stockmanagemasteredit.duedate),
          workstation: String(
            stockmanagemasteredit.workcheck
              ? stockmanagemasteredit.workstation
              : ""
          ),
          workcheck: String(stockmanagemasteredit.workcheck),
          assettype: String(stockmanagemasteredit.assettype),
          asset: String(stockmanagemasteredit.asset),

          subcomponent: subcomp,
          component: String(
            stockmanagemasteredit.component === "Please Select Component"
              ? ""
              : stockmanagemasteredit.component
          ),
          productdetails: String(stockmanagemasteredit.productdetails),
          uom: String(stockmanagemasteredit.uom),
          quantity: Number(stockmanagemasteredit.quantity),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchStock("Filtered");
      handleCloseModEdit();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchStockedit();
    const isNameMatch = stockmanageedit.some(
      (item) =>
        item.company == stockmanagemasteredit.company &&
        item.branch == stockmanagemasteredit.branch &&
        item.unit == stockmanagemasteredit.unit &&
        item.floor == stockmanagemasteredit.floor &&
        item.area == stockmanagemasteredit.area &&
        item.location == stockmanagemasteredit.location &&
        item.material == stockmanagemasteredit.material &&
        item.component == stockmanagemasteredit.component &&
        item.productdetails.toLowerCase() ===
        String(stockmanagemasteredit.productdetails).toLowerCase() &&
        item.uom === String(stockmanagemasteredit.uom) &&
        item.quantity === Number(stockmanagemasteredit.quantity)
    );

    if (stockmanagemasteredit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (stockmanagemasteredit.requestdate === "") {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.requesttime === "") {
      setPopupContentMalert("Please Select Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (stockmanagemasteredit.expectdays === "") {
      setPopupContentMalert("Please Enter Expected Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      stockmanagemasteredit.component === "" ||
      stockmanagemasteredit.component === "Please Select Component"
    ) {
      setPopupContentMalert("Please Select Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (Specificationsubedit.length > 0 && selectedsubcomponentedit.length === 0) {
      setPopupContentMalert("Please Select SubComponent!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (stockmanagemasteredit.productdetails === "") {
      setPopupContentMalert("Please Enter product Details!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemasteredit.uom === "" ||
      stockmanagemasteredit.uom === "Please Select UOM"
    ) {
      setPopupContentMalert("Please Select UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (stockmanagemasteredit.quantity === "") {
      setPopupContentMalert("Please Enter Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const fetchbranches = async () => {
    try {
      let res_branchunit = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const branchall = [
        ...res_branchunit?.data?.branch.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setBranches(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchAccount = async (e) => {
    let resulthead = [];
    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const itAssetsObject = res_account?.data?.assettypegrouping.filter(
        (item) => item.name === e
      );
      //filter products
      let dataallstocks = itAssetsObject?.map((data, index) => {
        return data.accounthead;
      });
      //individual products
      dataallstocks.forEach((value) => {
        value.forEach((valueData) => {
          resulthead.push(valueData);
        });
      });
      const projall = [
        ...resulthead?.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setAccount(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };



  const fetchAsset = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_vendor?.data?.assetmaterial.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAssetmaster(deptall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const fetchOldQuantity = async (material) => {
    try {
      let res_vendor = await axios.post(SERVICE.GET_OLD_MATERIAL_QTY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        material: material
      });

      setOldQty(res_vendor.data.oldtotalqty);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };




  const [uomcodes, setuomcodes] = useState([]);

  //get all project.
  const fetchUom = async () => {
    try {
      let res_project = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data?.code,
      }));
      setuomcodes(codeValues);

      const deptall = [
        ...res_project?.data?.vommaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setVomMasterget(deptall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const [stockMaterial, setStockMaterial] = useState([]);
  //get all project.
  const fetchStockStockMaterial = async () => {
    try {
      let res_project = await axios.get(SERVICE.STOCKMANAGE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setLoading(true);
      let filteredData = res_project?.data?.stockmanage.filter((data) => {
        return data.requestmode === "Stock Material";
      });
      setStockMaterial(filteredData);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //get all project.
  const fetchStock = async (e) => {
    setPageName(!pageName)
    setProjectCheck(true);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      if (e === "Filtered") {
        let res_employee = await axios.post(SERVICE.STOCK_MANAGE_ACCESS, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
        console.log(ans, "ansss")
        // let filteredData = ans.filter((data) => {
        //   return data.requestmode === "Asset Material";
        // });

        let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        let codeValues = res_project_1?.data?.vommaster.map((data) => ({
          name: data.name,
          code: data?.code,
        }));
        // setuomcodes(codeValues);

        let setData = ans.map((item) => {
          // Find the corresponding item in codeValues array
          const matchingItem = codeValues.find(
            (item1) => item.uom === item1.name
          );

          // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
          return matchingItem
            ? { ...item, uomcode: matchingItem?.code }
            : { ...item, uomcode: "" };
        });
        const itemsWithSerialNumber = setData?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
          duedate: moment(item.duedate).format("DD/MM/YYYY"),
        }));

        setStockmanage(itemsWithSerialNumber);
        console.log(itemsWithSerialNumber, "itemsWithSerialNumber")





        setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });
        setProjectCheck(false);
      } else {
        setProjectCheck(false)
      }
    }

    catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }

  }

  const [stockmanageedit, setStockmanageedit] = useState([]);
  const fetchStockedit = async (e) => {
    try {
      let res_project = await axios.get(SERVICE.STOCKMANAGE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setStockmanageedit(
        res_project?.data?.stockmanage.filter((item) => item._id !== e)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Stock Asset Request List",
    pageStyle: "print",
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   id: item._id,
    //   serialNumber: index + 1,
    // }));
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(stockmanages);
  }, [stockmanages]);

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
    setFilterValue(event.target.value);
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

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

  useEffect(() => {
    fetchUom();
    fetchStockStockMaterial();
    fetchbranches();
    fetchAsset();
    fetchVendor();

    fetchAssetType();
  }, []);

  useEffect(() => {
    if (items?.length > 0) {
      fetchStock("Filtered");
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [selectAllCheckedstock, setSelectAllCheckedstock] = useState(false);

  const CheckboxHeaderstock = ({ selectAllCheckedstock, onSelectAllstock }) => (
    <div>
      <Checkbox checked={selectAllCheckedstock} onChange={onSelectAllstock} />
    </div>
  );

  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
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
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },

    {
      field: "requestdate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.requestdate,
      headerClassName: "bold-header",
    },
    {
      field: "requesttime",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.requesttime,
      headerClassName: "bold-header",
    },


    {
      field: "expectdays",
      headerName: "Expected Days",
      flex: 0,
      width: 100,
      hide: !columnVisibility.expectdays,
      headerClassName: "bold-header",
    },

    {
      field: "duedate",
      headerName: "Due Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duedate,
      headerClassName: "bold-header",
    },



    // { field: "workstation", headerName: "WorkStation", flex: 0, width: 100, hide: !columnVisibility.workstation, headerClassName: "bold-header" },
    {
      field: "requestmode",
      headerName: "Request Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.requestmode,
      headerClassName: "bold-header",
    },

    {
      field: "asset",
      headerName: "Asset",
      flex: 0,
      width: 150,
      hide: !columnVisibility.asset,
      headerClassName: "bold-header",
    },
    {
      field: "assettype",
      headerName: "Asset Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.assettype,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 150,
      hide: !columnVisibility.material,
      headerClassName: "bold-header",
    },
    {
      field: "component",
      headerName: "Component",
      flex: 0,
      width: 150,
      hide: !columnVisibility.component,
      headerClassName: "bold-header",
    },
    {
      field: "subcomponent",
      headerName: "SubComponent",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcomponent,
      headerClassName: "bold-header",
    },
    {
      field: "productdetails",
      headerName: "Product Details",
      flex: 0,
      width: 120,
      hide: !columnVisibility.productdetails,
      headerClassName: "bold-header",
    },

    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0,
      width: 120,
      hide: !columnVisibility.quantity,
      headerClassName: "bold-header",
    },
    {
      field: "uom",
      headerName: "Quantity & UOM",
      flex: 0,
      width: 120,
      hide: !columnVisibility.uom,
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
          {isUserRoleCompare?.includes("estockrequest") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
                handleClickOpenEdit();
                fetchStockedit(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}

          {isUserRoleCompare?.includes("dstockrequest") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vstockrequest") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("istockrequest") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


  const rowDataTable = items.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      duedate: item.duedate,
      requesttime: item.requesttime,
      requestdate: item.requestdate,
      expectdays: item.expectdays,
      duedate: item.duedate,
      area: item.area,
      location: item.location,
      requestmode: item.requestmode,
      asset: item.asset,
      assettype: item.assettype,
      material: item.material,
      component: item.component,
      productdetails: item.productdetails,
      uom:
        item.uomcode !== ""
          ? `${item.quantity}#${item.uomcode}`
          : item.quantity,
      quantity: item.quantity,
      subcomponent: item.subcomponent
        ?.map((t, i) => t)
        .join(", ")
        .toString(),
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

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


  //unit multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedsubcomponent(options);
  };
  const customValueRendererUnitFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Subcomponent";
  };

  const handleUnitChangeFromEdit = (options) => {
    setSelectedsubcomponentedit(options);
  };
  const customValueRendererUnitFromEdit = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Subcomponent";
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



  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  // Disable the search input if the search is active
  const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

  const handleResetSearch = async () => {
    setProjectCheck(true);

    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    setPageName(!pageName)

    try {
      // let res_project = await axios.get(SERVICE.STOCKMANAGE, {
      let res_employee = await axios.post(SERVICE.STOCK_MANAGE_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

      // let filteredData = ans.filter((data) => {
      //   return data.requestmode === "Asset Material";
      // });

      let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project_1?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data?.code,
      }));
      // setuomcodes(codeValues);

      let setData = ans.map((item) => {
        // Find the corresponding item in codeValues array
        const matchingItem = codeValues.find(
          (item1) => item.uom === item1.name
        );

        // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
        return matchingItem
          ? { ...item, uomcode: matchingItem?.code }
          : { ...item, uomcode: "" };
      });
      const itemsWithSerialNumber = setData?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
        duedate: moment(item.duedate).format("DD/MM/YYYY"),

      }));

      setStockmanage(itemsWithSerialNumber);


      let ansoverall = res_employee?.data?.totalProjectsData.filter((data) => {
        return data.requestmode === "Asset Material";
      });


      setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
        res_employee?.data?.totalProjectsData?.map((item, index) => {
          return {
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,
            requestdate: moment(item.requestdate).format("DD/MM/YYYY"),


          }
        }

        ) : []
      );



      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setProjectCheck(false);
    }
    catch (err) { setProjectCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const handleChangephonenumber = (e) => {
    // const regex = /^\d*\.?\d*$/;
    const regex = /^\d+$/; // Allows only whole numbers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setStockmanagemaster({ ...stockmanagemaster, expectdays: inputValue });
    }
  };




  const handlePurchaseDateChange = (e) => {
    const { value } = e.target;
    setStockmanagemaster({ ...stockmanagemaster, requestdate: value });
  };

  const handleChangephonenumberedit = (e) => {
    // const regex = /^\d*\.?\d*$/;
    const regex = /^\d+$/; // Allows only whole numbers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setStockmanagemasteredit({ ...stockmanagemasteredit, expectdays: inputValue });
    }
  };

  const handlePurchaseDateChangeEdit = (e) => {
    const { value } = e.target;
    setStockmanagemasteredit({ ...stockmanagemasteredit, requestdate: value });
  };

  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };


  const calculateExpiryDate = () => {
    if (stockmanagemaster.estimationtime !== "" && stockmanagemaster.requestdate) {
      const currentDate = new Date(stockmanagemaster.requestdate);
      let expiryDate = new Date(currentDate);
      expiryDate.setDate(
        currentDate.getDate() + parseInt(stockmanagemaster.expectdays)
      );

      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      setStockmanagemaster({
        ...stockmanagemaster,
        duedate: formattedempty, // Format date as needed
      });
    }
  };

  const calculateExpiryDateEdit = () => {
    if (stockmanagemasteredit.estimationtime !== "" && stockmanagemasteredit.requestdate) {
      const currentDate = new Date(stockmanagemasteredit.requestdate);
      let expiryDate = new Date(currentDate);
      expiryDate.setDate(
        currentDate.getDate() + parseInt(stockmanagemasteredit.expectdays)
      );

      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      setStockmanagemasteredit({
        ...stockmanagemasteredit,
        duedate: formattedempty, // Format date as needed
      });
    }
  };


  useEffect(() => {
    calculateExpiryDate();
  }, [
    stockmanagemaster.expectdays,
    stockmanagemaster.requestdate,
  ]);

  useEffect(() => {
    calculateExpiryDateEdit();
  }, [
    stockmanagemasteredit.expectdays,
    stockmanagemasteredit.requestdate,
  ]);


  //MULTISELECT ONCHANGE START

  //company multiselect
  //team multiselect
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

  const handleBranchChangeFilter = (options) => {
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


  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
    try {
      let selectedValues = accessbranch
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

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany?.length === 0 &&
      selectedOptionsBranch?.length === 0 &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Any One");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchStock("Filtered");
    }
  };

  const handleClearFilter = () => {
    setStockmanage([]);
    setItems([]);
    setPage(1)
    setTotalProjects(0);
    setTotalPages(0);
    setPageSize(10)
    setOverallFilterdata([]);
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsUnit([])
    setValueCompanyCat([])
    setValueBranchCat([])
    setValueUnitCat([])
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  }

  const handleChangeqty = (e) => {
    // const regex = /^\d*\.?\d*$/;
    // const regex = /^\d+$/; // Allows only whole numbers
    const regex = /^[1-9]\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setStockmanagemaster({ ...stockmanagemaster, quantity: inputValue });
    }
  };
  const handleChangeqtynew = (e) => {
    // const regex = /^\d*\.?\d*$/;
    // const regex = /^\d+$/; // Allows only whole numbers
    const regex = /^[1-9]\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setStockmanagemaster({ ...stockmanagemaster, quantitynew: inputValue });
    }
  };

  console.log(stockmanagemaster.duedate, "de")
  return (
    <Box>
      <Headtitle title={"Manage Stock"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Stock Request</Typography> */}
      <PageHeading
        title="Stock Request"
        modulename="Asset"
        submodulename="Stock"
        mainpagename="Stock Manage Request"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("astockrequest") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Stock Request
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={companys}
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.company,
                        value: stockmanagemaster.company,
                      }}
                      onChange={(e) => {
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        setBranchs([]);
                        setUnits([]);
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchBranchDropdowns(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={branchs}
                      options={accessbranch?.filter(
                        (comp) =>
                          stockmanagemaster.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.branch,
                        value: stockmanagemaster.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        setUnits([]);
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchUnits(e);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={units}
                      options={accessbranch?.filter(
                        (comp) =>
                          stockmanagemaster.company === comp.company && stockmanagemaster.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.unit,
                        value: stockmanagemaster.unit,
                      }}
                      onChange={(e) => {
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          unit: e.value,
                          area: "Please Select Area",
                          floor: "Please Select Floor",
                          location: "Please Select Location",
                        });
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        setAreas([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.floor,
                        value: stockmanagemaster.floor,
                      }}
                      onChange={(e) => {
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.area,
                        value: stockmanagemaster.area,
                      }}
                      onChange={(e) => {
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                        });
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchLocation(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.location,
                        value: stockmanagemaster.location,
                      }}
                      onChange={(e) => {
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          location: e.value,
                          workstation: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={stockmanagemaster.requestdate}
                      // onChange={(e) => {
                      //   setStockmanagemaster({ ...stockmanagemaster, requestdate: e.target.value });
                      // }}
                      onChange={handlePurchaseDateChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Time<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      value={stockmanagemaster.requesttime}
                      onChange={(e) => {
                        setStockmanagemaster({ ...stockmanagemaster, requesttime: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expected Days<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      value={stockmanagemaster.expectdays}
                      onChange={(e) => handleChangephonenumber(e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={stockmanagemaster.duedate}
                    // onChange={(e) => {
                    //   setStockmanagemaster({ ...stockmanagemaster, duedate: e.target.value });
                    // }}
                    />
                  </FormControl>
                </Grid>



                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Request Mode For<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={requestModeOptions}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemaster.requestmode,
                        value: stockmanagemaster.requestmode,
                      }}
                      onChange={(e) => {
                        fetchAsset();
                        setStockmanagemaster({
                          ...stockmanagemaster,
                          requestmode: e.value,
                        });
                        if (e.value === "Stock Material") {
                          setIsStockMaterial(true);
                        } else {
                          setIsStockMaterial(false);
                        }

                        setStockmanagemaster((prev) => ({
                          ...prev,
                          productdetails: "",
                          uom: "Please Select UOM",
                          quantity: "",

                          workstation: "Please Select Workstation",
                          assettype: "",
                          asset: "",
                          material: "Please Select Material",
                          component: "Please Select Component",

                          addedby: "",
                          updatedby: "",
                          stockcategory: "Please Select Stock Category",
                          stocksubcategory: "Please Select Stock Sub Category",
                          uomnew: "",
                          quantitynew: "",
                          materialnew: "Please Select Material",
                          productdetailsnew: "",
                        }));

                        fetchspecification(e);
                        setSelectedsubcomponent([]);
                        setSpecificationsub([]);
                        setSubcategoryOption([]);
                        setMaterialoptNew([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                {isStockMaterial ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Stock Category<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={categoryOption}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.stockcategory,
                            value: stockmanagemaster.stockcategory,
                          }}
                          onChange={(e) => {
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              stockcategory: e.value,
                              stocksubcategory:
                                "Please Select Stock Sub Category",
                              materialnew: "Please Select Material",
                              uomnew: "",
                            });
                            fetchSubcategoryBased(e);
                            setMaterialoptNew([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Stock Sub-category<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={subcategoryOpt}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.stocksubcategory,
                            value: stockmanagemaster.stocksubcategory,
                          }}
                          onChange={(e) => {
                            fetchMaterialNew(e);

                            setStockmanagemaster({
                              ...stockmanagemaster,
                              stocksubcategory: e.value,
                              materialnew: "Please Select Material",
                              uomnew: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Material<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={materialOptNew}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.materialnew,
                            value: stockmanagemaster.materialnew,
                          }}
                          onChange={(e) => {
                            fetchAsset();
                            fetchOldQuantity(e.value)
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              materialnew: e.value,
                              maximumquantity: e.maximumquantity
                            });

                            fetchspecification(e);
                            fetchVomMaster(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          UOM<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={stockmanagemaster.uomnew}
                          onChange={(e) => {
                            // setStockmanagemaster({
                            //     ...stockmanagemaster,
                            //     uomnew: e.value, materialnew: "Please Select Material"
                            // });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Qty<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter Quantity"
                          value={stockmanagemaster.quantitynew}
                          // onChange={(e) => {
                          //   setStockmanagemaster({
                          //     ...stockmanagemaster,
                          //     quantitynew:
                          //       e.target.value > 0 ? e.target.value : 0,
                          //   });
                          // }}
                          onChange={(e) => handleChangeqtynew(e)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.5} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Product Details</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2}
                          value={stockmanagemaster.productdetailsnew}
                          placeholder="Please Enter Product Details"
                          onChange={(e) => {
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              productdetailsnew: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} sm={1} xs={1}>
                      <Button
                        variant="contained"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          color: "white",
                          marginTop: "23px",
                          marginLeft: "-10px",
                        }}
                        color="success"
                        onClick={() => {
                          handleStockArray();
                        }}
                      >
                        <FaPlus style={{ fontSize: "15px" }} />
                      </Button>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>
                    {stockArray.length > 0 && (
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          {" "}
                          <Typography variant="h6">Stock Todo List</Typography>
                        </Grid>

                        <Grid item md={3} xs={12} sm={12}></Grid>
                        <Grid item md={3} xs={12} sm={12}></Grid>
                        <Grid item md={3} xs={12} sm={12}></Grid>
                      </>
                    )}
                    {stockArray.length > 0 &&
                      stockArray.map((item, index) => {
                        return (
                          <>
                            <Grid item md={3} xs={3} sm={3}>
                              <FormControl fullWidth size="small">
                                <Typography>Material</Typography>
                                <OutlinedInput
                                  readOnly={true}
                                  value={item.materialnew}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={3} sm={3}>
                              <FormControl fullWidth size="small">
                                <Typography>UOM </Typography>
                                <OutlinedInput
                                  readOnly={true}
                                  value={item.uomnew}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={3} sm={3} xs={3}>
                              <FormControl fullWidth size="small">
                                <Typography>Qty </Typography>
                                <OutlinedInput
                                  readOnly={true}
                                  value={item.quantitynew}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              md={3}
                              sm={3}
                              xs={3}
                              sx={{ display: "flex" }}
                            >
                              <FormControl fullWidth size="small">
                                <Typography>Product Details</Typography>

                                <TextareaAutosize
                                  aria-label="minimum height"
                                  minRows={2}
                                  readOnly={true}
                                  value={item.productdetailsnew}
                                  placeholder="Please Enter Product Details"
                                />
                              </FormControl>
                              &nbsp; &emsp;
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={(e) => deleteTodo(index)}
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
                          </>
                        );
                      })}
                  </>
                ) : (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Material<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={materialOpt}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.material,
                            value: stockmanagemaster.material,
                          }}
                          onChange={(e) => {
                            fetchAsset();
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              material: e.value,
                              code: e.materialcode,
                              assettype: e.assettype,
                              asset: e.assethead,
                              materialcountcode: `${e.materialcode}#`,
                              component: "Please Select Component",
                            });

                            fetchspecification(e);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Asset Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={stockmanagemaster.assettype}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Asset Head<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={stockmanagemaster.asset}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Component<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={Specification}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.component,
                            value: stockmanagemaster.component,
                          }}
                          onChange={(e) => {
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              component: e.value,
                            });
                            // setTodos([]);
                            fetchspecificationSub(e.value);
                            setSelectedsubcomponent([]);
                            setSpecificationsub([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>SubComponent<b style={{ color: "red" }}>*</b></Typography>
                        <MultiSelect
                          options={Specificationsub}
                          value={selectedsubcomponent}
                          onChange={handleUnitChangeFrom}
                          valueRenderer={customValueRendererUnitFrom}
                          labelledBy="Please Select SubComponent"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Product Details<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={2}
                          value={stockmanagemaster.productdetails}
                          placeholder="Please Enter Product Details"
                          onChange={(e) => {
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              productdetails: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          UOM <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={vomMasterget}
                          styles={colourStyles}
                          value={{
                            label: stockmanagemaster.uom,
                            value: stockmanagemaster.uom,
                          }}
                          onChange={(e) => {
                            setStockmanagemaster({
                              ...stockmanagemaster,
                              uom: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Qty<b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter Quantity"
                          value={stockmanagemaster.quantity}
                          // onChange={(e) => {
                          //   setStockmanagemaster({
                          //     ...stockmanagemaster,
                          //     quantity: e.target.value > 0 ? e.target.value : 0,
                          //   });
                          // }}
                          onChange={(e) => handleChangeqty(e)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            overflow: "scroll",
            "& .MuiPaper-root": {
              overflow: "scroll",
            },
            marginTop: "95px"
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Stock Asset Request
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={companysEdit}
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.company,
                        value: stockmanagemasteredit.company,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        // setBranchsEdit([]);
                        setAreasEdit([]);
                        setUnitsEdit([]);
                        setFloorEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchBranchDropdownsEdit(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={branchsEdit}
                      options={accessbranch?.filter(
                        (comp) =>
                          stockmanagemasteredit.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.branch,
                        value: stockmanagemasteredit.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        // setUnitsEdit([]);
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);

                        fetchUnitsEdit(e.value);
                        fetchFloorEdit(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={unitsEdit}
                      options={accessbranch?.filter(
                        (comp) =>
                          stockmanagemasteredit.company === comp.company && stockmanagemasteredit.branch === comp.branch
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.unit,
                        value: stockmanagemasteredit.unit,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          unit: e.value,

                        });
                        // setFloorEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floorsEdit}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.floor,
                        value: stockmanagemasteredit.floor,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        // setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAreaEdit(stockmanagemasteredit.branch, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areasEdit}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.area,
                        value: stockmanagemasteredit.area,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                        });
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        fetchAllLocationEdit(
                          stockmanagemasteredit.branch,
                          stockmanagemasteredit.floor,
                          e.value
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locationsEdit}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.location,
                        value: stockmanagemasteredit.location,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          location: e.value,
                          workstation: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={stockmanagemasteredit.requestdate}
                      // onChange={(e) => {
                      //   setStockmanagemasteredit({ ...stockmanagemasteredit, requestdate: e.target.value });
                      // }}
                      onChange={handlePurchaseDateChangeEdit}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Time<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      value={stockmanagemasteredit.requesttime}
                      onChange={(e) => {
                        setStockmanagemasteredit({ ...stockmanagemasteredit, requesttime: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expected Days<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      value={stockmanagemasteredit.expectdays}
                      onChange={(e) => handleChangephonenumberedit(e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date<b style={{ color: "red" }}>*</b> </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={stockmanagemasteredit.duedate}
                    // onChange={(e) => {
                    //   setStockmanagemaster({ ...stockmanagemaster, duedate: e.target.value });
                    // }}
                    />
                  </FormControl>
                </Grid>



                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Request Mode For</Typography>
                    <OutlinedInput
                      value={stockmanagemasteredit.requestmode}
                      disabled={true}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Material</Typography>
                    <OutlinedInput value={stockmanagemasteredit.material} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Asset Type</Typography>
                    <OutlinedInput value={stockmanagemasteredit.assettype} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Asset</Typography>
                    <OutlinedInput value={stockmanagemasteredit.asset} />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Component</Typography>
                    <Selects
                      options={Specificationedit}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.component,
                        value: stockmanagemasteredit.component,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          component: e.value,
                        });
                        fetchspecificationSubEdit(e.value);
                        setSelectedsubcomponentedit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>SubComponent<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={Specificationsubedit}
                      value={selectedsubcomponentedit}
                      onChange={handleUnitChangeFromEdit}
                      valueRenderer={customValueRendererUnitFromEdit}
                      labelledBy="Please Select SubComponent"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Product Details <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={stockmanagemasteredit.productdetails}
                      placeholder="Please Enter Product Details"
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          productdetails: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      UOM <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={vomMasterget}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.uom,
                        value: stockmanagemasteredit.uom,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          uom: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Quantity<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Quantity"
                      value={stockmanagemasteredit.quantity}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          quantity: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lstockrequest") && (
        <>

          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Stock Asset Request List
              </Typography>
            </Grid>

            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
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
                    <Typography>
                      {" "}
                      Branch
                    </Typography>
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
                        handleBranchChangeFilter(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit
                    </Typography>
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
                    />
                  </FormControl>
                </Grid>

              </>

              <br />

              <Grid item md={3} sm={12} xs={12} marginTop={3}>
                <Grid sx={{ display: "flex", gap: "15px" }}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={(e) => {
                      handleSubmitFilter(e);
                    }}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleClearFilter();
                    }}
                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Box>
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
                      <MenuItem value={(totalProjects)}>All</MenuItem>
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
                      "excelstockrequest"
                    ) && (
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
                    {isUserRoleCompare?.includes(
                      "csvstockrequest"
                    ) && (
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
                    {isUserRoleCompare?.includes(
                      "printstockrequest"
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
                      "pdfstockrequest"
                    ) && (
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
                    {isUserRoleCompare?.includes(
                      "imagestockrequest"
                    ) && (
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
                  <FormControl fullWidth size="small">
                    <OutlinedInput size="small"
                      id="outlined-adornment-weight"
                      startAdornment={
                        <InputAdornment position="start">
                          <FaSearch />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          {advancedFilter && (
                            <IconButton onClick={handleResetSearch}>
                              <MdClose />
                            </IconButton>
                          )}
                          <Tooltip title="Show search options">
                            <span>
                              <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                            </span>
                          </Tooltip>
                        </InputAdornment>}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{ 'aria-label': 'weight', }}
                      type="text"
                      value={getSearchDisplay()}
                      onChange={handleSearchChange}
                      placeholder="Type to search..."
                      disabled={!!advancedFilter}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={12}>
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
                      onClick={handleShowAllColumns}
                    >
                      Show All Columns
                    </Button>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleOpenManageColumns}
                    >
                      Manage Columns
                    </Button>
                    {isUserRoleCompare?.includes(
                      "bdstockrequest"
                    ) && (
                        <Button
                          variant="contained"
                          sx={buttonStyles.buttonbulkdelete}
                          onClick={handleClickOpenalert}
                        >
                          Bulk Delete
                        </Button>
                      )}
                  </Box>
                  <br />
                </Grid>
              </Grid>

              {projectCheck ? (
                <Box >
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
                <>
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <>
                      <AggridTableForPaginationTable
                        rowDataTable={rowDataTable}
                        columnDataTable={columnDataTable}
                        columnVisibility={columnVisibility}
                        page={page}
                        setPage={setPage}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        setColumnVisibility={setColumnVisibility}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        gridRefTable={gridRefTable}
                        totalDatas={totalProjects}
                        setFilteredRowData={setFilteredRowData}
                        filteredRowData={filteredRowData}
                        gridRefTableImg={gridRefTableImg}
                        itemsList={overallFilterdata}
                      />
                    </>
                  </Box>
                </>
              )}

              {/* ****** Table End ****** */}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
        transformOrigin={{ vertical: 'center', horizontal: 'right', }}
      >
        {manageColumnsContent}
      </Popover>

      <Popover
        id={idSearch}
        open={openSearch}
        anchorEl={anchorElSearch}
        onClose={handleCloseSearch}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <Box style={{ padding: "10px", maxWidth: '450px' }}>
          <Typography variant="h6">Advance Search</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseSearch}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ width: "100%" }}>
            <Box sx={{
              width: '350px',
              maxHeight: '400px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                // paddingRight: '5px'
              }}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Columns</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Column</MenuItem>
                      {filteredSelectedColumn.map((col) => (
                        <MenuItem key={col.field} value={col.field}>
                          {col.headerName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Operator</Typography>
                    <Select fullWidth size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150 }}
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      disabled={!selectedColumn}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition} value={condition}>
                          {condition}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography>Value</Typography>
                    <TextField fullWidth size="small"
                      value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                      placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-disabled': {
                          backgroundColor: 'rgb(0 0 0 / 26%)',
                        },
                        '& .MuiOutlinedInput-input.Mui-disabled': {
                          cursor: 'not-allowed',
                        },
                      }}
                    />
                  </Grid>
                  {additionalFilters.length > 0 && (
                    <>
                      <Grid item md={12} sm={12} xs={12}>
                        <RadioGroup
                          row
                          value={logicOperator}
                          onChange={(e) => setLogicOperator(e.target.value)}
                        >
                          <FormControlLabel value="AND" control={<Radio />} label="AND" />
                          <FormControlLabel value="OR" control={<Radio />} label="OR" />
                        </RadioGroup>
                      </Grid>
                    </>
                  )}
                  {additionalFilters.length === 0 && (
                    <Grid item md={4} sm={12} xs={12} >
                      <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                        Add Filter
                      </Button>
                    </Grid>
                  )}

                  <Grid item md={2} sm={12} xs={12}>
                    <Button variant="contained" onClick={() => {
                      fetchStock();
                      setIsSearchActive(true);
                      setAdvancedFilter([
                        ...additionalFilters,
                        { column: selectedColumn, condition: selectedCondition, value: filterValue }
                      ])
                    }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Popover>

      {/* ****** Table End ****** */}
      <br />
      {/* ****** Table Start ****** */}

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Stock Asset Request{" "}
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{stockmanagemasteredit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{stockmanagemasteredit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{stockmanagemasteredit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{stockmanagemasteredit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{stockmanagemasteredit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{stockmanagemasteredit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(stockmanagemasteredit.requestdate).format("DD/MM/YYYY")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{stockmanagemasteredit.requesttime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Expected Days</Typography>
                  <Typography>{stockmanagemasteredit.expectdays}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Due Date</Typography>
                  <Typography>{stockmanagemasteredit.duedate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Request Mode For</Typography>
                  <Typography>{stockmanagemasteredit.requestmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Detail</Typography>
                  <Typography>{stockmanagemasteredit.asset}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Type</Typography>
                  <Typography>{stockmanagemasteredit.assettype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Material</Typography>
                  <Typography>{stockmanagemasteredit.material}</Typography>
                </FormControl>
              </Grid>
              {/* <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material Name</Typography>
                                    <Typography>{stockmanagemasteredit.productname}</Typography>
                                </FormControl>
                            </Grid> */}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Component</Typography>
                  <Typography>{stockmanagemasteredit.component}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Component</Typography>
                  <Typography>
                    {stockmanagemasteredit.subcomponent
                      ?.map((t, i) => t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Product Details</Typography>
                  <Typography>
                    {stockmanagemasteredit.productdetails}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Quantity</Typography>
                  <Typography>{stockmanagemasteredit.quantity}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Quantity & UOM</Typography>
                  <Typography>
                    {stockmanagemasteredit.uomcode !== "" ||
                      stockmanagemasteredit.uomcode !== undefined
                      ? `${stockmanagemasteredit.quantity}#${stockmanagemasteredit.uomcode}`
                      : ""}
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
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

      {/* dialog box for vendor details */}

      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={{ fontWeight: "bold" }}>Add Vendor</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
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
                  <Typography>Email ID</Typography>
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
                        setVendor({ ...vendor, phonecheck: !vendor.phonecheck })
                      }
                      label="Same as Whats app number"
                    />
                  </FormGroup>
                </Grid>
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
                      setVendor({ ...vendor, whatsappnumber: e.target.value });
                      handlewhatsapp(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
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
            </Grid>
            <br /> <br />
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
                  <Typography>Bank Name</Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={accounttypes}
                    placeholder="Please Choose Bank Name"
                    value={{ label: vendor.bankname, value: vendor.bankname }}
                    onChange={(e) => {
                      setVendor({ ...vendor, bankname: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Account Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.accountname}
                    placeholder="Please Enter Account Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, accountname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Account Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.accountnumber}
                    placeholder="Please Enter Account Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, accountnumber: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>IFSC Code</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.ifsccode}
                    placeholder="Please Enter IFSC Code"
                    onChange={(e) => {
                      setVendor({ ...vendor, ifsccode: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmitvendor}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearvendor}>
                  Clear
                </Button>
              </Grid>
              <Grid item lg={2.5} md={2.5} sm={2} xs={12}>
                <Button
                  sx={userStyle.btncancel}
                  onClick={handleCloseviewalertvendor}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* dialog box for uom details */}
      <Dialog
        open={openviewalertUom}
        onClose={handleClickOpenviewalertUom}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Manage UOM
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={vomMaster.name}
                    onChange={(e) => {
                      setVomMaster({ ...vomMaster, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />

            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmituom}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleclearuom}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseviewalertUom}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog
        open={openviewalertAsset}
        onClose={handleClickOpenviewalertAsset}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Manage Asset Material
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography>
                    Asset Head <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <Selects
                    options={account}
                    styles={colourStyles}
                    value={{
                      label: selectedassethead,
                      value: selectedassethead,
                    }}
                    onChange={(e) => {
                      handleAssetChange(e);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Material Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={asset.materialcode}
                    placeholder="Please Enter Material Code"
                    onChange={(e) => {
                      setAsset({ ...asset, materialcode: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Material Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={asset.name}
                    placeholder="Please Enter Material Code"
                    onChange={(e) => {
                      setAsset({ ...asset, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmitasset}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearasset}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseviewalertAsset}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* UPLOAD BILL CREATE IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD BILL IMAGE DIALOG EDIT*/}
      <Dialog
        open={uploadPopupOpenedit}
        onClose={handleUploadPopupCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChangeedit}
                    />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImageedit.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIconedit(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewedit(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFileedit(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD WARRANTY IMAGE DIALOG    CREATE*/}
      <Dialog
        open={uploadPopupOpenwarranty}
        onClose={handleUploadPopupClosewarranty}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChangewarranty}
                    />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImagewarranty.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIconwarranty(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewwarranty(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFilewarranty(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAllwarranty} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImagewarranty} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button
            onClick={handleUploadPopupClosewarranty}
            sx={userStyle.btncancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD WARRANTY IMAGE DIALOG EDIT*/}
      <Dialog
        open={uploadPopupOpenwarrantyedit}
        onClose={handleUploadPopupClosewarrantyedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChangewarrantyedit}
                    />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImagewarrantyedit.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIconwarrantyedit(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewwarrantyedit(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFilewarrantyedit(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAllwarrantyedit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImagewarrantyedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button
            onClick={handleUploadPopupClosewarrantyedit}
            sx={userStyle.btncancel}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={stockmanages ?? []}
        filename={"StockAssetRequest"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Stock Asset Request Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delProjectcheckbox}
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
      {/* EXTERNAL COMPONENTS -------------- END */}

      <ListReferenceCategoryDoc vendorAuto={changeTable} />
    </Box>
  );
}

export default Stockmanagerequest;
