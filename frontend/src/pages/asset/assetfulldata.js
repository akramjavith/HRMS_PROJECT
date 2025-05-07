import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  FormGroup,
  Dialog,
  TextField,
  Popover,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TableBody,
  Checkbox,
  TextareaAutosize,
  FormControlLabel,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { FaPrint, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ExportXL, ExportCSV } from "../../components/Export";
import { saveAs } from "file-saver";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "jspdf-autotable";
import jsPDF from "jspdf";
import axios from "axios";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { makeStyles } from "@material-ui/core";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { ThreeDots } from "react-loader-spinner";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import Webcamimage from "./Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

function AssetDetails() {
  const [capacities, setCapacities] = useState([]);
  const [capacityname, setcapacityname] = useState("");
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [stockCodeCount, setStockCodeCount] = useState(0);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [Specification, setSpecification] = useState([]);
  const [Specificationedit, setSpecificationedit] = useState([]);
  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];
  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };
  //alert model for Type details
  const [opentype, setOpenType] = useState(false);
  // view model
  const handleClickOpenType = () => {
    setOpenType(true);
  };
  const handleClickCloseType = () => {
    setOpenType(false);
    setAssetSpecificationType({ name: "", code: "" });
  };
  //alert model for Type details
  const [openCapacity, setOpenCapacity] = useState(false);
  // view model
  const handleClickOpenCapacity = () => {
    setOpenCapacity(true);
  };
  const handleClickCloseCapacity = () => {
    setOpenCapacity(false);
    setcapacityname("");
  };
  //alert model for Model details
  const [openmodel, setOpenmodel] = useState(false);
  // view model
  const handleClickOpenModel = () => {
    setOpenmodel(true);
  };
  const handleClickCloseModel = () => {
    setOpenmodel(false);
    setAssetModel({ name: "", code: "" });
  };
  //alert model for Size details
  const [opensize, setOpensize] = useState(false);
  // view model
  const handleClickOpenSize = () => {
    setOpensize(true);
  };
  const handleClickCloseSize = () => {
    setOpensize(false);
    setAssetSize({ name: "", code: "" });
  };
  //alert model for Variant details
  const [openvariant, setOpenvariant] = useState(false);
  // view model
  const handleClickOpenVariant = () => {
    setOpenvariant(true);
  };
  const handleClickCloseVariant = () => {
    setOpenvariant(false);
    setAssetVariant({ name: "", code: "" });
  };
  //alert model for Brand details
  const [openbrand, setOpenbrand] = useState(false);
  // view model
  const handleClickOpenBrand = () => {
    setOpenbrand(true);
  };
  const handleClickCloseBrand = () => {
    setOpenbrand(false);
    setBrandMaster({ name: "", code: "" });
  };
  const [assetSpecificationTypeArray, setAssetSpecificationTypeArray] =
    useState([]);
  const [assetSpecificationType, setAssetSpecificationType] = useState({
    name: "",
    code: "",
  });
  const [assetModel, setAssetModel] = useState({ name: "", code: "" });
  const [assetSize, setAssetSize] = useState({ name: "", code: "" });
  const [assetVariant, setAssetVariant] = useState({ name: "", code: "" });
  const [brandMaster, setBrandMaster] = useState({ name: "", code: "" });
  //add function
  const sendRequesttype = async () => {
    try {
      let brandCreate = await axios.post(
        SERVICE.CREATE_ASSETSPECIFICATIONTYPE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: String(assetSpecificationType.name),
          code: String(assetSpecificationType.code),
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      setAssetSpecificationType(brandCreate.data);
      await fetchAssetSpecificationType();
      setAssetSpecificationType({ name: "", code: "" });
      handleClickCloseType();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //submit option for saving
  const handleSubmittype = (e) => {
    e.preventDefault();
    const isNameMatch = assetSpecificationTypeArray?.some(
      (item) =>
        item.name?.toLowerCase() === assetSpecificationType.name?.toLowerCase()
    );
    if (assetSpecificationType.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetSpecificationType.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequesttype();
    }
  };
  const handlecleartype = (e) => {
    e.preventDefault();
    setAssetSpecificationType({ name: "", code: "" });
  };
  //submit option for Capatity
  const handleSubmitCapacity = (e) => {
    e.preventDefault();
    const isNameMatch = capacities?.some(
      (item) => item.name?.toLowerCase() === capacityname?.toLowerCase()
    );
    if (capacityname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestCapacity();
    }
  };
  const handleclearCapacity = (e) => {
    e.preventDefault();
    setcapacityname("");
  };
  //add function
  const sendRequestCapacity = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_ASSETCAPACITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(capacityname),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });

      await fetchCapacities();
      setcapacityname("");
      handleClickCloseCapacity();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //add function
  const sendRequestModel = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_ASSETMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(assetModel.name),
        code: String(assetModel.code),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setAssetModel(brandCreate.data);
      await fetchAssetModel();
      setAssetModel({ name: "", code: "" });
      handleClickCloseModel();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //submit option for saving
  const handleSubmitModel = (e) => {
    e.preventDefault();
    const isNameMatch = assetModelArray?.some(
      (item) => item.name?.toLowerCase() === assetModel.name?.toLowerCase()
    );
    if (assetModel.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetModel.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestModel();
    }
  };
  const handleclearModel = (e) => {
    e.preventDefault();
    setAssetModel({ name: "", code: "" });
  };

  //size create popup
  const sendRequestSize = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_ASSETSIZE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(assetSize.name),
        code: String(assetSize.code),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setAssetSize(brandCreate.data);
      await fetchAssetSize();
      setAssetSize({ name: "", code: "" });
      handleClickCloseSize();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //submit option for saving
  const handleSubmitSize = (e) => {
    e.preventDefault();
    const isNameMatch = assetSizeArray?.some(
      (item) => item.name?.toLowerCase() === assetSize.name?.toLowerCase()
    );
    if (assetSize.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetSize.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestSize();
    }
  };

  const handleclearSize = (e) => {
    e.preventDefault();
    setAssetSize({ name: "", code: "" });
  };

  //add function
  const sendRequestVariant = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_ASSETVARIANT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(assetVariant.name),
        code: String(assetVariant.code),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setAssetVariant(brandCreate.data);
      await fetchAssetVariant();
      setAssetVariant({ name: "", code: "" });
      handleClickCloseVariant();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //submit option for saving
  const handleSubmitVariant = (e) => {
    e.preventDefault();
    const isNameMatch = assetVariantArray?.some(
      (item) => item.name?.toLowerCase() === assetVariant.name?.toLowerCase()
    );
    if (assetVariant.name === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetVariant.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestVariant();
    }
  };

  const handleclearVariant = (e) => {
    e.preventDefault();
    setAssetVariant({ name: "", code: "" });
  };

  //add function
  const sendRequestBrand = async () => {
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_BRANDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(brandMaster.name),
        code: String(brandMaster.code),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setBrandMaster(brandCreate.data);
      await fetchBrand();
      setBrandMaster({ name: "", code: "" });
      handleClickCloseBrand();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //submit option for saving
  const handleSubmitBrand = (e) => {
    e.preventDefault();
    const isNameMatch = brand?.some(
      (item) => item.name?.toLowerCase() === brandMaster.name?.toLowerCase()
    );
    if (brandMaster.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Brand Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (brandMaster.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Brand Code"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Brand Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestBrand();
    }
  };

  const handleclearBrand = (e) => {
    e.preventDefault();
    setBrandMaster({ name: "", code: "" });
  };
  const handleChangephonenumber = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setAssetdetail({ ...assetdetail, estimation: inputValue });
    }
  };
  const handleChangephonenumberEdit = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setAssetdetailEdit({ ...assetdetailEdit, estimation: inputValue });
    }
  };
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUnit, allTeam, allCompany, allBranch } = useContext(
    UserRoleAccessContext
  );
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendor, setVendor] = useState("Choose Vendor");
  const [brand, setBrand] = useState([]);
  const [materialOpt, setMaterialopt] = useState([]);
  const [vendorOpt, setVendoropt] = useState("Choose Vendor");
  const [vendorOptEdit, setVendoroptEdit] = useState("Choose Vendor");
  const [assetdetails, setAssetdetails] = useState([]);
  const [assetdetailCheck, setAssetdetailcheck] = useState(false);
  const [assignValue, setAssignValue] = useState(Number(0));
  const [lastcodeVal, setLastCodeVal] = useState(0);
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  //TODOS
  const [todos, setTodos] = useState([]);
  const [todosEdit, setTodosEdit] = useState([]);
  const classes = useStyles();
  //filter fields
  const [companys, setCompanys] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [units, setUnits] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);
  //filter fields
  const [companysEdit, setCompanysEdit] = useState([]);
  const [branchsEdit, setBranchsEdit] = useState([]);
  const [unitsEdit, setUnitsEdit] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const gridRef = useRef(null);
  //   post call setstate
  const [assetdetail, setAssetdetail] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    workstation: "Please Select Workstation",
    workcheck: false,
    department: "Choose Department",
    responsibleteam: "Choose Responsible Person",
    team: "Choose Responsible Team",
    assettype: "",
    asset: "",
    material: "Choose Material",
    component: "Choose Component",
    branchcode: "",
    companycode: "",
    code: "",
    countquantity: 0,
    materialcountcode: 0,
    serial: "",
    rate: "",
    warranty: "Yes",
    warrantycalculation: "",
    estimation: "",
    estimationtime: "Days",
    purchasedate: "",
    address: "",
    phonenumber: "",
    vendor: "Choose Vendor",
    customercare: "",
    stockcode: "",
    overallrate: true,
  });

  // putcall setstate
  const [assetdetailEdit, setAssetdetailEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    workstation: "Please Select Workstation",
    department: "Choose Department",
    responsibleteam: "Choose Responsible Person",
    team: "Choose Responsible Team",
    assettype: "Choose Asset Type",
    asset: "Choose Asset Head",
    material: "Choose Material",
    component: "Choose Component",
    code: "",
    countquantity: "",
    materialcountcode: "",
    workcheck: "",
    serial: "",
    rate: "",
    warranty: "",
    warrantycalculation: "",
    estimation: "",
    estimationtime: "",
    purchasedate: "",
    address: "",
    phonenumber: "",
    vendor: "Choose Vendor",
    customercare: "",
    stockcode: "",
  });
  const username = isUserRoleAccess.username;
  const [assetModelArray, setAssetModelArray] = useState([]);
  const [assetSizeArray, setAssetSizeArray] = useState([]);
  const [assetVariantArray, setAssetVariantArray] = useState([]);
  const fetchAssetSpecificationType = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = [
        ...res_freq?.data?.assetspecificationtype.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setAssetSpecificationTypeArray(resultall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  const fetchCapacities = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETCAPACITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = [
        ...res_freq?.data?.assetcapacity.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCapacities(resultall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const [specificationGrouping, setSpecificationGrouping] = useState([]);
  const [specificationGroupingEdit, setSpecificationGroupingEdit] = useState(
    []
  );
  const fetchSpecificationGrouping = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getvalues = res?.data?.assetspecificationgrouping.filter(
        (item) =>
          item.assetmaterial === assetdetail.material &&
          assetdetail.component === item.component
      );
      setSpecificationGrouping(getvalues);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const fetchSpecificationGroupingEdit = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getvalues = res?.data?.assetspecificationgrouping.filter(
        (item) =>
          item.assetmaterial === assetdetailEdit.material &&
          assetdetailEdit.component === item.component
      );

      setSpecificationGroupingEdit(getvalues);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  useEffect(() => {
    fetchCompanyDropdowns();
    fetchWorkStation();
    fetchCompanyDropdowns();
    fetchBrand();
    fetchMaterialAll();
    fetchVendor();
    fetchAssetDetails();
  }, []);
  useEffect(() => {
    fetchSpecificationGrouping();
  }, [assetdetail.component]);
  useEffect(() => {
    fetchSpecificationGroupingEdit();
  }, [isEditOpen, assetdetailEdit.component]);
  const fetchAssetModel = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const result = [
        ...res_freq?.data?.assetmodel.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAssetModelArray(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //get all Asset Size name.
  const fetchAssetSize = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETSIZE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = [
        ...res_freq?.data?.assetsize.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAssetSizeArray(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //get all Asset Variant name.
  const fetchAssetVariant = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETVARIANT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = [
        ...res_freq?.data?.assetvariant.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setAssetVariantArray(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assetdetail.png");
        });
      });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const handleAddInput = (e) => {
    let specificationItem = Specification.find(
      (item) => e === item.categoryname
    );
    let filtersub = specificationItem?.subcategoryname;
    let result;
    if (filtersub.length > 0) {
      result = filtersub?.map((sub, index) => ({
        subname: sub.subcomponent,
        sub: `${index + 1}.${sub.subcomponent}`,
        type: sub.type ? "Choose Type" : "",
        model: sub.model ? "Choose Model" : "",
        size: sub.size ? "Choose Size" : "",
        variant: sub.variant ? "Choose variant" : "",
        brand: sub.brand ? "Choose Brand" : "",
        serial: sub.serial ? "" : undefined,
        other: sub.other ? "" : undefined,
        capacity: sub.capacity ? "Choose Capacity" : "",
        hdmiport: sub.hdmiport ? "" : undefined,
        vgaport: sub.vgaport ? "" : undefined,
        dpport: sub.dpport ? "" : undefined,
        usbport: sub.usbport ? "" : undefined,
        paneltypescreen: sub.paneltypescreen ? "Choose Panel Type" : "",
        resolution: sub.resolution ? "Choose Screen Resolution" : "",
        connectivity: sub.connectivity ? "Choose Connectivity" : "",
        daterate: sub.daterate ? "Choose Data Rate" : "",
        compatibledevice: sub.compatibledevice
          ? "Choose Compatible Device"
          : "",
        outputpower: sub.outputpower ? "Choose Output Power" : "",
        collingfancount: sub.collingfancount ? "Choose Cooling Fan Count" : "",
        clockspeed: sub.clockspeed ? "Choose Clock Speed" : "",
        core: sub.core ? "Choose Core" : "",
        speed: sub.speed ? "Choose Speed" : "",
        frequency: sub.frequency ? "Choose Frequency" : "",
        output: sub.output ? "Choose Output" : "",
        ethernetports: sub.ethernetports ? "Choose Ethernet Ports" : "",
        distance: sub.distance ? "Choose Distance" : "",
        lengthname: sub.lengthname ? "Choose Length" : "",
        slot: sub.slot ? "Choose Slot" : "",
        noofchannels: sub.noofchannels ? "Choose No. Of Channels" : "",
        colours: sub.colours ? "Choose Colour" : "",
        warranty: assetdetail.warranty ? assetdetail.warranty : undefined,
        code: assetdetail.code ? assetdetail.code : undefined,
        countquantity: assetdetail.countquantity
          ? assetdetail.countquantity
          : undefined,
        rate: assetdetail.rate ? assetdetail.rate : undefined,
        estimation: assetdetail.estimation ? assetdetail.estimation : undefined,
        estimationtime: assetdetail.estimationtime
          ? assetdetail.estimationtime
          : undefined,
        warrantycalculation: assetdetail.warrantycalculation
          ? assetdetail.warrantycalculation
          : undefined,
        purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
        vendor: vendor ? vendor : undefined,
        phonenumber: vendorgetid.phonenumber
          ? vendorgetid.phonenumber
          : undefined,
        address: vendorgetid.address ? vendorgetid.address : undefined,
      }));
    } else if (
      filtersub.length === 0 &&
      !(
        !specificationItem.type &&
        !specificationItem.model &&
        !specificationItem.size &&
        !specificationItem.variant &&
        !specificationItem.brand &&
        !specificationItem.serial &&
        !specificationItem.other &&
        !specificationItem.capacity &&
        !specificationItem.hdmiport &&
        !specificationItem.vgaport &&
        !specificationItem.dpport &&
        !specificationItem.usbport
      )
    ) {
      result = [
        {
          type: specificationItem.type ? "Choose Type" : "",
          model: specificationItem.model ? "Choose Model" : "",
          size: specificationItem.size ? "Choose Size" : "",
          variant: specificationItem.variant ? "Choose variant" : "",
          brand: specificationItem.brand ? "Choose Brand" : "",
          serial: specificationItem.serial ? "" : undefined,
          other: specificationItem.other ? "" : undefined,
          capacity: specificationItem.capacity ? "Choose Capacity" : "",
          hdmiport: specificationItem.hdmiport ? "" : undefined,
          vgaport: specificationItem.vgaport ? "" : undefined,
          dpport: specificationItem.dpport ? "" : undefined,
          usbport: specificationItem.usbport ? "" : undefined,
          paneltypescreen: specificationItem.paneltypescreen
            ? "Choose Panel Type"
            : "",
          resolution: specificationItem.resolution
            ? "Choose Screen Resolution"
            : "",
          connectivity: specificationItem.connectivity
            ? "Choose Connectivity"
            : "",
          daterate: specificationItem.daterate ? "Choose Data Rate" : "",
          compatibledevice: specificationItem.compatibledevice
            ? "Choose Compatible Device"
            : "",
          outputpower: specificationItem.outputpower
            ? "Choose Output Power"
            : "",
          collingfancount: specificationItem.collingfancount
            ? "Choose Cooling Fan Count"
            : "",
          clockspeed: specificationItem.clockspeed ? "Choose Clock Speed" : "",
          core: specificationItem.core ? "Choose Core" : "",
          speed: specificationItem.speed ? "Choose Speed" : "",
          frequency: specificationItem.frequency ? "Choose Frequency" : "",
          output: specificationItem.output ? "Choose Output" : "",
          ethernetports: specificationItem.ethernetports
            ? "Choose Ethernet Ports"
            : "",
          distance: specificationItem.distance ? "Choose Distance" : "",
          lengthname: specificationItem.lengthname ? "Choose Length" : "",
          slot: specificationItem.slot ? "Choose Slot" : "",
          noofchannels: specificationItem.noofchannels
            ? "Choose No. Of Channels"
            : "",
          colours: specificationItem.colours ? "Choose Colour" : "",
          code: assetdetail.code ? assetdetail.code : undefined,
          countquantity: assetdetail.countquantity
            ? assetdetail.countquantity
            : undefined,
          rate: assetdetail.rate ? assetdetail.rate : undefined,
          warranty: assetdetail.warranty ? assetdetail.warranty : undefined,
          estimation: assetdetail.estimation
            ? assetdetail.estimation
            : undefined,
          estimationtime: assetdetail.estimationtime
            ? assetdetail.estimationtime
            : undefined,
          warrantycalculation: assetdetail.warrantycalculation
            ? assetdetail.warrantycalculation
            : undefined,
          purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
          vendor: vendor ? vendor : undefined,
          phonenumber: vendorgetid.phonenumber
            ? vendorgetid.phonenumber
            : undefined,
          address: vendorgetid.address ? vendorgetid.address : undefined,
        },
      ];
    }
    setTodos(result);
  };
  const calculateTotalRate = () => {
    let sum = 0;
    todos.forEach((item) => {
      sum += parseInt(item.rate);
    });
    return String(sum);
  };
  const calculateTotalRateEdit = () => {
    let sum = 0;
    todosEdit.forEach((item) => {
      sum += parseInt(item.rate);
    });
    return String(sum);
  };
  const handleChange = async (index, name, value, id) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    if (name === "rate" && assetdetail.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetail({ ...assetdetail, rate: String(sum) });
    }
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos[index];
    if (
      updatedTodo.estimationtime !== "" &&
      updatedTodo.purchasedate &&
      updatedTodo.estimation !== ""
    ) {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);
      if (updatedTodo.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(updatedTodo.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      // Update the calculated expiry date in the todo
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
        vendorid: vendornameid,
      };
      setTodos(updatedTodosCopy);
    }
    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendor !== "" && id) {
      const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        address: res?.data?.svendordetails.address,
        phonenumber: res?.data?.svendordetails.phonenumber,
      };
      setTodos(updatedTodosCopy);
    }
  };
  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
    if (assetdetail.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetail({ ...assetdetail, rate: String(sum) });
    }
  };
  const handleAddInputEdit = (e) => {
    let specificationItem = Specificationedit.find(
      (item) => e === item.categoryname
    );
    let filtersub = specificationItem?.subcategoryname;
    let result;
    if (filtersub.length > 0) {
      result = filtersub?.map((sub, index) => ({
        sub: `${index + 1}.${sub.subcomponent}`,
        subname: sub.subcomponent,
        type: sub.type ? "Choose Type" : "",
        model: sub.model ? "Choose Model" : "",
        size: sub.size ? "Choose Size" : "",
        variant: sub.variant ? "Choose variant" : "",
        brand: sub.brand ? "Choose Brand" : "",
        serial: sub.serial ? "" : undefined,
        other: sub.other ? "" : undefined,
        capacity: sub.capacity ? "Choose Capacity" : "",
        hdmiport: sub.hdmiport ? "" : undefined,
        vgaport: sub.vgaport ? "" : undefined,
        dpport: sub.dpport ? "" : undefined,
        usbport: sub.usbport ? "" : undefined,
        paneltypescreen: sub.paneltypescreen ? "Choose Panel Type" : "",
        resolution: sub.resolution ? "Choose Screen Resolution" : "",
        connectivity: sub.connectivity ? "Choose Connectivity" : "",
        daterate: sub.daterate ? "Choose Data Rate" : "",
        compatibledevice: sub.compatibledevice
          ? "Choose Compatible Device"
          : "",
        outputpower: sub.outputpower ? "Choose Output Power" : "",
        collingfancount: sub.collingfancount ? "Choose Cooling Fan Count" : "",
        clockspeed: sub.clockspeed ? "Choose Clock Speed" : "",
        core: sub.core ? "Choose Core" : "",
        speed: sub.speed ? "Choose Speed" : "",
        frequency: sub.frequency ? "Choose Frequency" : "",
        output: sub.output ? "Choose Output" : "",
        ethernetports: sub.ethernetports ? "Choose Ethernet Ports" : "",
        distance: sub.distance ? "Choose Distance" : "",
        lengthname: sub.lengthname ? "Choose Length" : "",
        slot: sub.slot ? "Choose Slot" : "",
        noofchannels: sub.noofchannels ? "Choose No. Of Channels" : "",
        colours: sub.colours ? "Choose Colour" : "",
        code: assetdetailEdit.code ? assetdetailEdit.code : undefined,
        countquantity: assetdetailEdit.countquantity
          ? assetdetailEdit.countquantity
          : undefined,
        rate: assetdetailEdit.rate ? assetdetailEdit.rate : undefined,
        warranty: assetdetailEdit.warranty
          ? assetdetailEdit.warranty
          : undefined,
        estimation: assetdetailEdit.estimation
          ? assetdetailEdit.estimation
          : undefined,
        estimationtime: assetdetailEdit.estimationtime
          ? assetdetailEdit.estimationtime
          : undefined,
        warrantycalculation: assetdetailEdit.warrantycalculation
          ? assetdetailEdit.warrantycalculation
          : undefined,
        purchasedate: selectedPurchaseDateEdit
          ? selectedPurchaseDateEdit
          : undefined,
        vendor: assetdetailEdit.vendor ? assetdetailEdit.vendor : undefined,
        phonenumber: vendorgetidEdit.phonenumber
          ? vendorgetidEdit.phonenumber
          : undefined,
        address: vendorgetidEdit.address ? vendorgetidEdit.address : undefined,
      }));
    } else if (
      filtersub.length === 0 &&
      !(
        !specificationItem.type &&
        !specificationItem.model &&
        !specificationItem.size &&
        !specificationItem.variant &&
        !specificationItem.brand &&
        !specificationItem.serial &&
        !specificationItem.other &&
        !specificationItem.capacity &&
        !specificationItem.hdmiport &&
        !specificationItem.vgaport &&
        !specificationItem.dpport &&
        !specificationItem.usbport
      )
    ) {
      result = [
        {
          type: specificationItem.type ? "Choose Type" : "",
          model: specificationItem.model ? "Choose Model" : "",
          size: specificationItem.size ? "Choose Size" : "",
          variant: specificationItem.variant ? "Choose variant" : "",
          brand: specificationItem.brand ? "Choose Brand" : "",
          serial: specificationItem.serial ? "" : undefined,
          other: specificationItem.other ? "" : undefined,
          capacity: specificationItem.capacity ? "Choose Capacity" : "",
          hdmiport: specificationItem.hdmiport ? "" : undefined,
          vgaport: specificationItem.vgaport ? "" : undefined,
          dpport: specificationItem.dpport ? "" : undefined,
          usbport: specificationItem.usbport ? "" : undefined,
          paneltypescreen: specificationItem.paneltypescreen
            ? "Choose Panel Type"
            : "",
          resolution: specificationItem.resolution
            ? "Choose Screen Resolution"
            : "",
          connectivity: specificationItem.connectivity
            ? "Choose Connectivity"
            : "",
          daterate: specificationItem.daterate ? "Choose Data Rate" : "",
          compatibledevice: specificationItem.compatibledevice
            ? "Choose Compatible Device"
            : "",
          outputpower: specificationItem.outputpower
            ? "Choose Output Power"
            : "",
          collingfancount: specificationItem.collingfancount
            ? "Choose Cooling Fan Count"
            : "",
          clockspeed: specificationItem.clockspeed ? "Choose Clock Speed" : "",
          core: specificationItem.core ? "Choose Core" : "",
          speed: specificationItem.speed ? "Choose Speed" : "",
          frequency: specificationItem.frequency ? "Choose Frequency" : "",
          output: specificationItem.output ? "Choose Output" : "",
          ethernetports: specificationItem.ethernetports
            ? "Choose Ethernet Ports"
            : "",
          distance: specificationItem.distance ? "Choose Distance" : "",
          lengthname: specificationItem.lengthname ? "Choose Length" : "",
          slot: specificationItem.slot ? "Choose Slot" : "",
          noofchannels: specificationItem.noofchannels
            ? "Choose No. Of Channels"
            : "",
          colours: specificationItem.colours ? "Choose Colour" : "",
          code: assetdetailEdit.code ? assetdetailEdit.code : undefined,
          countquantity: assetdetailEdit.countquantity
            ? assetdetailEdit.countquantity
            : undefined,
          rate: assetdetailEdit.rate ? assetdetailEdit.rate : undefined,
          warranty: assetdetailEdit.warranty
            ? assetdetailEdit.warranty
            : undefined,
          estimation: assetdetailEdit.estimation
            ? assetdetailEdit.estimation
            : undefined,
          estimationtime: assetdetailEdit.estimationtime
            ? assetdetailEdit.estimationtime
            : undefined,
          warrantycalculation: assetdetailEdit.warrantycalculation
            ? assetdetailEdit.warrantycalculation
            : undefined,
          purchasedate: selectedPurchaseDateEdit
            ? selectedPurchaseDateEdit
            : undefined,
          vendor: assetdetailEdit.vendor ? assetdetailEdit.vendor : undefined,
          phonenumber: vendorgetidEdit.phonenumber
            ? vendorgetidEdit.phonenumber
            : undefined,
          address: vendorgetidEdit.address
            ? vendorgetidEdit.address
            : undefined,
        },
      ];
    }
    setTodosEdit(result);
  };
  const handleChangeEdit = async (index, name, value, id) => {
    const updatedTodos = [...todosEdit];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    if (name === "rate" && assetdetailEdit.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetailEdit({ ...assetdetailEdit, rate: String(sum) });
    }
    setTodosEdit(updatedTodos);
    const updatedTodo = updatedTodos[index];
    if (
      updatedTodo.estimationtime !== "" &&
      updatedTodo.purchasedate &&
      updatedTodo.estimation !== ""
    ) {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);

      if (updatedTodo.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(updatedTodo.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
      };
      setTodosEdit(updatedTodosCopy);
    }
    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendor !== "" && id) {
      const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        address: res?.data?.svendordetails.address,
        phonenumber: res?.data?.svendordetails.phonenumber,
      };
      setTodosEdit(updatedTodosCopy);
    }
  };
  const handleDeleteEdit = (index) => {
    const updatedTodos = [...todosEdit];
    updatedTodos?.splice(index, 1);
    setTodosEdit(updatedTodos);
    if (assetdetailEdit.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetailEdit({ ...assetdetailEdit, rate: String(sum) });
    }
  };
  const [getimgbillcode, setGetImgbillcode] = useState([]);
  const getimgbillCode = async (valueimg) => {
    try {
      setGetImgbillcode(valueimg);
      handleImgcodeviewbill();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetailEdit(res?.data?.sassetdetail);
      setTodosEdit(res?.data?.sassetdetail?.subcomponent);
      setRefImageedit(res?.data?.sassetdetail.files);
      setRefImageDragedit(res?.data?.sassetdetail.files);
      setCapturedImagesedit(res?.data?.sassetdetail.files);
      setAllUploadedFilesedit(res?.data?.sassetdetail.files);
      setSelectedPurchaseDateEdit(res?.data?.sassetdetail.purchasedate);
      await fetchBranchDropdownsEdit(res?.data?.sassetdetail?.company);
      fetchUnitsEdit(res?.data?.sassetdetail.branch);
      fetchFloorEdit(res?.data?.sassetdetail?.branch);
      fetchAreaEdit(
        res?.data?.sassetdetail?.branch,
        res?.data?.sassetdetail?.floor
      );
      fetchAllLocationEdit(
        res?.data?.sassetdetail?.branch,
        res?.data?.sassetdetail?.floor,
        res?.data?.sassetdetail?.area
      );
      if (res?.data?.sassetdetail.vendorid) {
        let resv = await axios.get(
          `${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.sassetdetail.vendorid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        setVendorgetidEdit(resv?.data?.svendordetails);
      }
      let res1 = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res1.data.assetworkstation.filter(
        (d) => d.workstation === res?.data?.sassetdetail.material
      );

      const resultall = result?.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));
      setSpecificationedit(resultall);
      handleClickOpenEdit();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetailEdit(res?.data?.sassetdetail);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetailEdit(res?.data?.sassetdetail);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
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

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
    "& .custom-id-row": {
      backgroundColor: "#1976d22b !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": {
        backgroundColor: "#ff00004a !important",
      },
      "& .custom-in-row:hover": {
        backgroundColor: "#ffff0061 !important",
      },
      "& .custom-others-row:hover": {
        backgroundColor: "#0080005e !important",
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    workstation: true,
    department: true,
    responsibleteam: true,
    team: true,
    asset: true,
    assettype: true,
    material: true,
    component: true,
    code: true,
    countquantity: true,
    materialcountcode: true,
    rate: true,
    warranty: true,
    purchasedate: true,
    vendor: true,
    customercare: true,
    stockcode: true,
    files: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //get all Sub vendormasters.
  const fetchAssetDetails = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetailcheck(true);
      setAssetdetail({
        ...assetdetail,
        rate: 0,
        stockcode:
          res_vendor?.data?.assetdetails?.length == 0
            ? 1
            : res_vendor?.data?.assetdetails?.length + 1,
      });
      setStockCodeCount(
        res_vendor?.data?.assetdetails?.length == 0
          ? 1
          : res_vendor?.data?.assetdetails?.length + 1
      );
      setAssetdetails(res_vendor?.data?.assetdetails);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const [deleteAssetdetail, setDeleteAssetdetail] = useState("");

  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteAssetdetail(res?.data?.sassetdetail);
      handleClickOpen();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  // Alert delete popup
  let Assetdetailsid = deleteAssetdetail?._id;
  const delAssetdetail = async (e) => {
    try {
      if (Assetdetailsid) {
        await axios.delete(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchAssetDetails();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "#7ac767" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Deleted Successfully 👍"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const delAssetcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSETDETAIL_SINGLE}/${item}`, {
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
      await fetchAssetDetails();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Location", field: "location" },
    { title: "WorkStation", field: "workstation" },
    { title: "Asset Type", field: "assettype" },
    { title: "Asset", field: "asset" },
    { title: "Material", field: "material" },
    { title: "Component", field: "component" },
    { title: "Material Code", field: "code" },
    { title: "Countquantity", field: "countquantity" },
    { title: "Rate", field: "rate" },
    { title: "Warranty", field: "warranty" },
    { title: "Purchasedate", field: "purchasedate" },
    { title: "Vendor", field: "vendor" },
  ];
  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    const itemsWithSerial = assetdetails.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      stockcode: item.materialcountcode + "#" + Number(index + 1),
    }));
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
      },
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("AssetDetails.pdf");
  };
  // Excel
  const fileName = "AssetDetail";
  const [assetdetailData, setAssetdetailData] = useState([]);
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = assetdetails?.map((t, index) => ({
      Sno: index + 1,
      Company: t.company,
      Branch: t.branch,
      Unit: t.unit,
      Floor: t.floor,
      Area: t.area,
      Location: t.location,
      WorkStation: t.workstation,
      AssetType: t.assettype,
      Asset: t.asset,
      Material: t.material,
      Component: t.component,
      "Material Code": t.code,
      Countquantity: t.countquantity,
      Rate: t.rate,
      Warranty: t.warranty,
      Purchasedate: t.purchasedate,
      Vendor: t.vendor,
    }));
    setAssetdetailData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assetdetail",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [assetdetailEdit, assetdetail, assetdetails]);
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

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = assetdetails?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [assetdetails]);

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
      sortable: false,
      width: 70,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
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
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
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
      field: "workstation",
      headerName: "WorkStation",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workstation,
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
      field: "code",
      headerName: "Material Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.code,
      headerClassName: "bold-header",
    },
    {
      field: "countquantity",
      headerName: "Countquantity",
      flex: 0,
      width: 100,
      hide: !columnVisibility.countquantity,
      headerClassName: "bold-header",
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rate,
      headerClassName: "bold-header",
    },
    {
      field: "warranty",
      headerName: "Warranty",
      flex: 0,
      width: 100,
      hide: !columnVisibility.warranty,
      headerClassName: "bold-header",
    },
    {
      field: "purchasedate",
      headerName: "Purchasedate",
      flex: 0,
      width: 150,
      hide: !columnVisibility.purchasedate,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "files",
      headerName: "Attachment",
      flex: 0,
      width: 100,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.files,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          {params.row.files.length > 0 ? (
            <Button
              sx={{
                padding: "14px 14px",
                minWidth: "40px !important",
                borderRadius: "50% !important",
                ":hover": {
                  backgroundColor: "#80808036", // theme.palette.primary.main
                },
              }}
              onClick={() => getimgbillCode(params.row.files)}
            >
              view
            </Button>
          ) : (
            ""
          )}
        </>
      ),
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
          {isUserRoleCompare?.includes("eassetmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassetmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      workstation: item.workstation,
      department: item.department,
      responsibleteam: item.responsibleteam,
      team: item.team,
      asset: item.asset,
      assettype: item.assettype,
      material: item.material,
      component: item.component,
      code: item.code,
      countquantity: item.countquantity,
      materialcountcode: item.materialcountcode,
      rate: item.rate,
      warranty: item.warranty,
      purchasedate: item.purchasedate,
      vendor: item.vendor,
      customercare: item.customercare,
      stockcode: item.materialcountcode + "#" + item.serialNumber,
      files: item.files,
    };
  });
  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
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
  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
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
  //cancel for create section
  const handleClear = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
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

      let res_asset = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const assetall = res_asset.data.assettypemaster.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      const aeestuniqueArray = assetall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });
      setBranchs([]);
      setFloors([]);
      setUnits([]);
      setRefImage([]);
      setPreviewURL(null);
      setTodos([]);
      setAssetdetail({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        department: "Choose Department",
        responsibleteam: "Choose Responsible Person",
        team: "Choose Responsible Team",
        assettype: "",
        asset: "",
        material: "Choose Material",
        component: "Choose Component",
        branchcode: "",
        companycode: "",
        code: "",
        countquantity: 0,
        materialcountcode: 0,
        brand: "Choose Brand",
        serial: "",
        rate: "",
        overallrate: true,
        warranty: "Yes",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "Days",
        purchasedate: "",
        address: "",
        phonenumber: "",
        vendor: "Choose Vendor",
        customercare: "",
        stockcode: stockCodeCount,
        workstation: "",
        workcheck: false,
      });
      setSelectedPurchaseDate("");
      setVendor("Choose Vendor");
      setVendorgetid({ address: "", phonenumber: "" });
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  useEffect(() => {
    var filteredWorks;
    if (
      (assetdetail.unit === "" || assetdetail.unit == undefined) &&
      (assetdetail.floor === "" || assetdetail.floor == undefined)
    ) {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === assetdetail.company && u.branch === assetdetail.branch
      );
    } else if (assetdetail.unit === "" || assetdetail.unit == undefined) {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === assetdetail.company &&
          u.branch === assetdetail.branch &&
          u.floor === assetdetail.floor
      );
    } else if (assetdetail.floor === "" || assetdetail.floor == undefined) {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === assetdetail.company &&
          u.branch === assetdetail.branch &&
          u.unit === assetdetail.unit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === assetdetail.company &&
          u.branch === assetdetail.branch &&
          u.unit === assetdetail.unit &&
          u.floor === assetdetail.floor
      );
    }
    const result = filteredWorks.flatMap((item) => {
      const cabinNamesArray =
        item.combinstation.length > 0 &&
          item.combinstation[0].subTodos.length > 0
          ? item.combinstation[0].subTodos.map((subTodo) => ({
            label: subTodo.subcabinname,
            value: subTodo.subcabinname,
          }))
          : [
            {
              label: item.combinstation[0].cabinname,
              value: item.combinstation[0].cabinname,
            },
          ];
      return cabinNamesArray;
    });
    setFilteredWorkStation(result);
  }, [assetdetail]);

  useEffect(() => {
    var filteredWorksedit;
    if (
      (assetdetailEdit.unit === "" || assetdetailEdit.unit == undefined) &&
      (assetdetailEdit.floor === "" || assetdetailEdit.floor == undefined)
    ) {
      filteredWorksedit = workStationOpt?.filter(
        (u) =>
          u.company === assetdetailEdit.company &&
          u.branch === assetdetailEdit.branch
      );
    } else if (
      assetdetailEdit.unit === "" ||
      assetdetailEdit.unit == undefined
    ) {
      filteredWorksedit = workStationOpt?.filter(
        (u) =>
          u.company === assetdetailEdit.company &&
          u.branch === assetdetail.branch &&
          u.floor === assetdetailEdit.floor
      );
    } else if (
      assetdetailEdit.floor === "" ||
      assetdetailEdit.floor == undefined
    ) {
      filteredWorksedit = workStationOpt?.filter(
        (u) =>
          u.company === assetdetailEdit.company &&
          u.branch === assetdetailEdit.branch &&
          u.unit === assetdetailEdit.unit
      );
    } else {
      filteredWorksedit = workStationOpt?.filter(
        (u) =>
          u.company === assetdetailEdit.company &&
          u.branch === assetdetailEdit.branch &&
          u.unit === assetdetailEdit.unit &&
          u.floor === assetdetailEdit.floor
      );
    }
    const result = filteredWorksedit.flatMap((item) => {
      const cabinNamesArray =
        item.combinstation.length > 0 &&
          item.combinstation[0].subTodos.length > 0
          ? item.combinstation[0].subTodos.map((subTodo) => ({
            label: subTodo.subcabinname,
            value: subTodo.subcabinname,
          }))
          : [
            {
              label: item.combinstation[0].cabinname,
              value: item.combinstation[0].cabinname,
            },
          ];

      return cabinNamesArray;
    });
    setFilteredWorkStation(result);
  }, [assetdetailEdit, isEditOpen]);
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreas(all);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
            d.floor === assetdetail.floor &&
            d.area === e
        )
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
      setLocations(all);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  useEffect(() => {
    fetchAllLocationEdit();
  }, [isEditOpen, assetdetailEdit.floor]);
  const fetchMaterialAll = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
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
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
      }));

      setSpecification(resultall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
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
        (d) => d.workstation === assetdetailEdit.material
      );

      const resultall = result?.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));

      setSpecificationedit(resultall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  useEffect(() => {
    fetchspecificationEdit();
  }, [isEditOpen]);
  const fetchBrand = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_BRANDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_vendor?.data?.brandmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setBrand(deptall);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //fetching Groupname for Dropdowns
  const fetchVendor = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const all = [
        ...res?.data?.vendordetails.map((d) => ({
          ...d,
          label: d.vendorname,
          value: d.vendorname,
        })),
      ];
      setVendoropt(all);
      setVendoroptEdit(all);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  //add function...
  const sendRequest = async () => {
    try {
      let res = await axios.post(SERVICE.ASSETDETAIL_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(assetdetail.company),
        branch: String(assetdetail.branch),
        unit: String(assetdetail.unit),
        floor: String(assetdetail.floor),
        location: String(assetdetail.location),
        area: String(assetdetail.area),
        workstation: String(
          assetdetail.workcheck ? assetdetail.workstation : ""
        ),
        workcheck: String(assetdetail.workcheck),
        assettype: String(
          assetdetail.assettype == undefined ? "" : assetdetail.assettype
        ),
        asset: String(assetdetail.asset),
        material: String(
          assetdetail.material === "Choose Material" ? "" : assetdetail.material
        ),
        component: String(
          assetdetail.component === "Choose Component"
            ? ""
            : assetdetail.component
        ),
        subcomponent: todos ? [...todos] : [],
        code: String(assetdetail.code),
        countquantity: String(assetdetail.countquantity),
        materialcountcode: String(assetdetail.materialcountcode),
        serial: String(assetdetail.serial),
        rate: String(assetdetail.rate),
        overallrate: Boolean(assetdetail.overallrate),
        vendorid: String(vendornameid),
        address: String(vendorgetid.address),
        phonenumber: String(vendorgetid.phonenumber),
        warranty: String(assetdetail.warranty),
        estimation: String(assetdetail.estimation),
        estimationtime: String(assetdetail.estimationtime)
          ? assetdetail.estimationtime
          : "Days",
        warrantycalculation: String(assetdetail.warrantycalculation),
        purchasedate: selectedPurchaseDate,
        vendor: String(vendor),
        customercare: String(assetdetail.customercare),
        stockcode: String(assetdetail.stockcode),
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      setAssetdetail({
        ...assetdetail,
        branchcode: "",
        companycode: "",
        code: "",
        countquantity: 0,
        materialcountcode: 0,
        brand: "Choose Brand",
        workstation: "Please Select Workstation",
        workcheck: false,
        serial: "",
        rate: "",
        warranty: "Yes",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "Days",
        purchasedate: "",
        address: "",
        phonenumber: "",
        customercare: "",
        stockcode: stockCodeCount,
      });
      await fetchAssetDetails();
      setAssignValue(Number(0));
      setLastCodeVal(Number(0));
      setTodos([]);
      setSelectedPurchaseDate("");
      setVendorgetid({ address: "", phonenumber: "" });
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (assetdetail.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.floor === "Please Select Floor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Floor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.area === "Please Select Area") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Area"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.location === "Please Select Location") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Location"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assetdetail.material === "" ||
      assetdetail.material === "Choose Material"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Asset Material"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assetdetail.component === "" ||
      assetdetail.component === "Choose Component"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Component"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.countquantity.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Count(Qty)"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetail.warranty == "Yes" && assetdetail.estimation === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Warranty Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (vendor === "" || vendor === "Choose Vendor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Vendor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  //fetching Groupname for Dropdowns
  const fetchAsset = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETDETAILFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const codeToMatch = assetdetail?.code;
      const filteredData = res.data.assetdetails?.filter((data) => {
        const parts = data.materialcountcode?.split("#");
        return parts[0] == codeToMatch;
      });
      if (filteredData.length > 0) {
        const lastMatchedCode =
          filteredData[filteredData.length - 1]?.materialcountcode;
        const codeSplitMatch = lastMatchedCode.split("-");
        setLastCodeVal(parseInt(codeSplitMatch[1]));
        if (codeSplitMatch) {
          const codeSplit = parseInt(codeSplitMatch[1]);
          setAssignValue(codeSplit + 1);
        } else {
          setAssignValue(1);
        }
      } else {
        setAssignValue(1);
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      //  else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };

  let updateby = assetdetailEdit?.updatedby;
  let addedby = assetdetailEdit?.addedby;
  let subprojectsid = assetdetailEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.ASSETDETAIL_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(assetdetailEdit.company),
          branch: String(assetdetailEdit.branch),
          unit: String(assetdetailEdit.unit),
          floor: String(assetdetailEdit.floor),
          location: String(assetdetailEdit.location),
          area: String(assetdetailEdit.area),
          workstation: String(
            assetdetailEdit.workcheck ? assetdetailEdit.workstation : ""
          ),
          workcheck: String(assetdetailEdit.workcheck),
          assettype: String(
            assetdetailEdit.assettype == undefined
              ? ""
              : assetdetailEdit.assettype
          ),
          asset: String(assetdetailEdit.asset),
          material: String(assetdetailEdit.material),
          component: String(assetdetailEdit.component),
          subcomponent: todosEdit ? [...todosEdit] : [],
          code: String(assetdetailEdit.code),
          countquantity: String(assetdetailEdit.countquantity),
          materialcountcode: String(assetdetailEdit.materialcountcode),
          serial: String(assetdetailEdit.serial),
          rate: String(assetdetailEdit.rate),
          overallrate: Boolean(assetdetailEdit.overallrate),
          warranty: String(assetdetailEdit.warranty),
          estimation: String(assetdetailEdit.estimation),
          estimationtime: String(assetdetailEdit.estimationtime),
          warrantycalculation: String(assetdetailEdit.warrantycalculation),
          purchasedate: selectedPurchaseDateEdit,
          vendorid: String(vendornameidEdit),
          vendor: String(assetdetailEdit.vendor),
          customercare: String(assetdetailEdit.customercare),
          stockcode: String(assetdetailEdit.stockcode),
          address: String(vendorgetidEdit.address),
          phonenumber: String(vendorgetidEdit.phonenumber),
          files: resultArray,
          updatedby: [
            ...updateby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAssetDetails();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    if (assetdetailEdit.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.floor === "Please Select Floor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Floor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.area === "Please Select Area") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Area"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.location === "Please Select Location") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Location"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assetdetailEdit.warranty == "Yes" &&
      assetdetailEdit.estimation === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Warranty Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assetdetailEdit.vendor === "Choose Vendor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Vendor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  const handleCountChange = async (e) => {
    const eventValue = e.target.value;

    if (eventValue.length === 0) {
      setLastCodeVal(parseInt(0));
    }
    await fetchAsset();
  };

  useEffect(() => {
    setAssetdetail((prev) => ({
      ...prev,
      materialcountcode: `${prev?.code}#${assignValue}-${prev.countquantity === ""
          ? ""
          : lastcodeVal + parseInt(prev.countquantity)
        }`,
    }));
  }, [assignValue, lastcodeVal, assetdetail.countquantity]);

  const [vendorgetid, setVendorgetid] = useState({});
  const [vendorgetidEdit, setVendorgetidEdit] = useState({});
  const [vendornameid, setVendornameid] = useState("");
  const [vendornameidEdit, setVendornameidEdit] = useState("");
  const vendorid = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorgetid(res?.data?.svendordetails);
      setVendornameid(id);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const vendoridEdit = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorgetidEdit(res?.data?.svendordetails);
      setVendornameidEdit(id);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
      // else {
      //   setShowAlert(<><ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /><p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p></>);
      //   handleClickOpenerr();
      // }
    }
  };
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
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
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };
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
  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDrag];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDrag(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
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
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };
  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);
  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };
  const showWebcamedit = () => {
    webcamOpenedit();
  };
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
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
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };

  let combinedArray = allUploadedFilesedit.concat(
    refImageedit,
    refImageDragedit,
    capturedImagesedit
  );
  let uniqueValues = {};
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

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
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleDragOveredit = (event) => { };
  const handleDropedit = (event) => {
    event.preventDefault();
    previewFileedit(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDragedit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDragedit(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
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
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };
  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState("");
  const [selectedPurchaseDateEdit, setSelectedPurchaseDateEdit] = useState("");
  const handleEstimationChange = (e) => {
    const { value } = e.target;
    setAssetdetail({ ...assetdetail, estimationtime: value });
  };
  const handleEstimationChangeEdit = (e) => {
    const { value } = e.target;
    setAssetdetailEdit({ ...assetdetailEdit, estimationtime: value });
  };
  const handlePurchaseDateChange = (e) => {
    const { value } = e.target;
    setAssetdetail({ ...assetdetail, purchasedate: value });
    setSelectedPurchaseDate(value);
  };
  const handlePurchaseDateChangeEdit = (e) => {
    const { value } = e.target;
    setAssetdetailEdit({ ...assetdetailEdit, purchasedate: value });
    setSelectedPurchaseDateEdit(value);
  };
  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const calculateExpiryDate = () => {
    if (assetdetail.estimationtime !== "" && assetdetail.purchasedate) {
      const currentDate = new Date(assetdetail.purchasedate);
      let expiryDate = new Date(currentDate);
      if (assetdetail.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(assetdetail.estimation)
        );
      } else if (assetdetail.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(assetdetail.estimation)
        );
      } else if (assetdetail.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(assetdetail.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      setAssetdetail({
        ...assetdetail,
        warrantycalculation: formattedempty, // Format date as needed
      });
    }
  };
  useEffect(() => {
    calculateExpiryDate();
  }, [
    assetdetail.estimationtime,
    assetdetail.estimation,
    assetdetail.purchasedate,
  ]);
  useEffect(() => {
    calculateExpiryDateEdit();
  }, [
    assetdetailEdit.estimationtime,
    assetdetailEdit.estimation,
    assetdetailEdit.purchasedate,
  ]);
  const calculateExpiryDateEdit = () => {
    if (assetdetailEdit.estimationtime && assetdetailEdit.purchasedate) {
      const currentDate = new Date(assetdetailEdit.purchasedate);
      let expiryDate = new Date(currentDate);
      if (assetdetailEdit.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(assetdetailEdit.estimation)
        );
      } else if (assetdetailEdit.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(assetdetailEdit.estimation)
        );
      } else if (assetdetailEdit.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(assetdetailEdit.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      setAssetdetailEdit({
        ...assetdetailEdit,
        warrantycalculation: formattedempty, // Format date as needed
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"ASSET DETAILS"} />
      <Typography sx={userStyle.HeaderText}> Manage Asset Detail</Typography>
      {isUserRoleCompare?.includes("lassetmaster") && (
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.SubHeaderText}>
                <b> Add Asset Details </b>
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
                  options={companys}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.company,
                    value: assetdetail.company,
                  }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      company: e.value,
                      branch: "Please Select Branch",
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      location: "Please Select Location",
                    });
                    setLocations([{ label: "ALL", value: "ALL" }]);
                    fetchBranchDropdowns(e);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={branchs}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.branch,
                    value: assetdetail.branch,
                  }}
                  onChange={(e) => {
                    setNewcheckBranch(e.value);
                    setAssetdetail({
                      ...assetdetail,
                      branch: e.value,
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      location: "Please Select Location",
                    });
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
                  {" "}
                  Unit<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={units}
                  styles={colourStyles}
                  value={{ label: assetdetail.unit, value: assetdetail.unit }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      unit: e.value,
                      workstation: "",
                    });
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
                  value={{ label: assetdetail.floor, value: assetdetail.floor }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      floor: e.value,
                      workstation: "",
                      area: "Please Select Area",
                    });
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
                  value={{ label: assetdetail.area, value: assetdetail.area }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
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
                    label: assetdetail.location,
                    value: assetdetail.location,
                  }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      location: e.value,
                      workstation: "",
                    });
                  }}
                />
              </FormControl>
              <Grid>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={assetdetail.workcheck} />}
                    onChange={(e) =>
                      setAssetdetail({
                        ...assetdetail,
                        workcheck: !assetdetail.workcheck,
                      })
                    }
                    label="Enable Workstation"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            {assetdetail.workcheck && (
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Work Station</Typography>
                  <Selects
                    maxMenuHeight={250}
                    styles={colourStyles}
                    options={filteredWorkStation}
                    placeholder="Please Select Workstation"
                    value={{
                      label:
                        assetdetail.workstation === "" ||
                          assetdetail.workstation === undefined
                          ? "Please Select Workstation"
                          : assetdetail.workstation,
                      value:
                        assetdetail.workstation === "" ||
                          assetdetail.workstation === undefined
                          ? "Please Select Workstation"
                          : assetdetail.workstation,
                    }}
                    onChange={(e) => {
                      setAssetdetail({ ...assetdetail, workstation: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
            )}

            {/* <Grid container spacing={2}> */}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Material Code </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={assetdetail.code}
                  placeholder="Please Enter Material Code"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Count(Qty)<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  sx={userStyle.input}
                  type="number"
                  value={assetdetail.countquantity}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      countquantity: e.target.value,
                      stockcode: `${assetdetail?.code}#${assignValue}- ${e.target.value === ""
                          ? ""
                          : lastcodeVal + parseInt(e.target.value)
                        }#${stockCodeCount}`,
                      materialcountcode: `${assetdetail?.code
                        }#${assignValue}- ${e.target.value === ""
                          ? ""
                          : lastcodeVal + parseInt(e.target.value)
                        }`,
                    });
                    // fetchAsset(e);
                    handleCountChange(e);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Material Countcode</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // value={assetdetail.branch === "Choose Branch" ? "" : `${codeFetch.companycode}-${codeFetch.code}-${assetdetail.code}#${assignValue}-${assetdetail.countquantity === "" ? "" : lastcodeVal + parseInt(assetdetail.countquantity)}`}
                  value={assetdetail.materialcountcode}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Serial </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Serial"
                  value={assetdetail.serial}
                  onChange={(e) => {
                    setAssetdetail({ ...assetdetail, serial: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Rate </Typography>
                {assetdetail.overallrate ? (
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Rate"
                    sx={userStyle.input}
                    value={assetdetail.rate}
                    onChange={(e) => {
                      setAssetdetail({
                        ...assetdetail,
                        rate:
                          Number(e.target.value) >= 0
                            ? Number(e.target.value)
                            : 0,
                      });
                    }}
                  />
                ) : (
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    placeholder="Please Enter Rate"
                    sx={userStyle.input}
                    value={assetdetail.rate}
                    readOnly
                  />
                )}
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={assetdetail.overallrate} />}
                  onChange={(e) => {
                    setAssetdetail((prevAssetDetail) => ({
                      ...prevAssetDetail,
                      overallrate: !prevAssetDetail.overallrate,
                      rate: prevAssetDetail.overallrate
                        ? calculateTotalRate()
                        : "",
                    }));
                  }}
                  label="Overall Rate"
                />
              </FormGroup>
            </Grid>

            {/* </Grid> */}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Warranty <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  fullWidth
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={assetdetail.warranty}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      warranty: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="" disabled>
                    {" "}
                    Please Select
                  </MenuItem>
                  <MenuItem value="Yes"> {"Yes"} </MenuItem>
                  <MenuItem value="No"> {"No"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {assetdetail.warranty === "Yes" && (
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Warranty Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Enter Time"
                          value={assetdetail.estimation}
                          onChange={(e) => handleChangephonenumber(e)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Estimation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={assetdetail.estimationtime}
                        onChange={handleEstimationChange}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select{" "}
                        </MenuItem>
                        <MenuItem value="Days"> {"Days"} </MenuItem>
                        <MenuItem value="Month"> {"Month"} </MenuItem>
                        <MenuItem value="Year"> {"Year"} </MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Purchase date </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={selectedPurchaseDate}
                  onChange={handlePurchaseDateChange}
                />
              </FormControl>
            </Grid>
            {assetdetail.warranty === "Yes" && (
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expiry Date </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={assetdetail.warrantycalculation}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Vendor<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <Selects
                  options={vendorOpt}
                  styles={colourStyles}
                  value={{ label: vendor, value: vendor }}
                  onChange={(e) => {
                    setVendor(e.value);
                    vendorid(e._id);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Address</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={vendorgetid?.address}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Phone Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={vendorgetid?.phonenumber}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Material<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={materialOpt}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.material,
                    value: assetdetail.material,
                  }}
                  onChange={(e) => {
                    fetchAsset();
                    setAssetdetail({
                      ...assetdetail,
                      material: e.value,
                      code: e.materialcode,
                      assettype: e.assettype,
                      asset: e.assethead,
                      materialcountcode: `${e.materialcode}#`,
                      component: "Choose Component",
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
                  value={assetdetail.assettype}
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
                  value={assetdetail.asset}
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
                    label: assetdetail.component,
                    value: assetdetail.component,
                  }}
                  onChange={(e) => {
                    setAssetdetail({ ...assetdetail, component: e.value });
                    handleAddInput(e.value);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>{" "}
          <br />
          {todos &&
            todos.map((todo, index) => {
              return (
                <>
                  {todo.sub ? (
                    <Grid container key={index} spacing={1}>
                      <Grid item md={2} sm={2} xs={2} marginTop={2}>
                        {" "}
                        <Typography>{todo.sub}</Typography>{" "}
                      </Grid>
                      <Grid item md={10} sm={10} xs={10} marginTop={2}>
                        <Grid container key={index} spacing={1}>
                          {todo.type && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Type</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.type?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.type,
                                          value: todo.type,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "type", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      disabled
                                      size="small"
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        handleClickOpenType();
                                      }}
                                    >
                                      {" "}
                                      <FaPlus
                                        style={{ fontSize: "15px" }}
                                      />{" "}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.model && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Model</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.model?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.model,
                                          value: todo.model,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "model", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      disabled
                                      size="small"
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        handleClickOpenModel();
                                      }}
                                    >
                                      {" "}
                                      <FaPlus
                                        style={{ fontSize: "15px" }}
                                      />{" "}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.size && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Size</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.size?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.size,
                                          value: todo.size,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "size", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        handleClickOpenSize();
                                      }}
                                    >
                                      {" "}
                                      <FaPlus
                                        style={{ fontSize: "15px" }}
                                      />{" "}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.variant && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Variants</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.variant?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.variant,
                                          value: todo.variant,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "variant",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        handleClickOpenVariant();
                                      }}
                                    >
                                      {" "}
                                      <FaPlus
                                        style={{ fontSize: "15px" }}
                                      />{" "}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.brand && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl size="small" fullWidth>
                                      <Typography>Brand</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.brand?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.brand,
                                          value: todo.brand,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "brand", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        handleClickOpenBrand();
                                      }}
                                    >
                                      {" "}
                                      <FaPlus
                                        style={{ fontSize: "15px" }}
                                      />{" "}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.serial !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>Serial</Typography>
                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Serial"
                                      value={todo.serial}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "serial",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.other !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>Others</Typography>
                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Other"
                                      value={todo.other}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "other",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.capacity && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Capacity</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.capacity?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.capacity,
                                          value: todo.capacity,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "capacity",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.hdmiport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>HDMI Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="number"
                                      size="small"
                                      placeholder="Please Enter HDMI Port"
                                      value={todo.hdmiport}
                                      // onChange={(e) => {
                                      //   handleChange(index, "hdmiport", e.target.value);
                                      // }}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "hdmiport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.vgaport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>VGA Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="number"
                                      size="small"
                                      placeholder="Please Enter VGA Port"
                                      value={todo.vgaport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "vgaport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.dpport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>DP Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="number"
                                      size="small"
                                      placeholder="Please Enter DP Port"
                                      value={todo.dpport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "dpport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.usbport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>USB Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="number"
                                      size="small"
                                      placeholder="Please Enter USB Port"
                                      value={todo.usbport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "usbport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.paneltypescreen && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Panel Type</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.paneltype?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.paneltypescreen,
                                          value: todo.paneltypescreen,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "paneltypescreen",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.resolution && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Screen Resolution</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.screenresolution?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.resolution,
                                          value: todo.resolution,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "resolution",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.connectivity && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Connectivity</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.connectivity?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.connectivity,
                                          value: todo.connectivity,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "connectivity",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.daterate && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Data Rate</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.datarate?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.daterate,
                                          value: todo.daterate,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "daterate",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.compatibledevice && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Compatible Device</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.compatibledevices?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.compatibledevice,
                                          value: todo.compatibledevice,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "compatibledevice",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.outputpower && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Output Power</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.outputpower?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.outputpower,
                                          value: todo.outputpower,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "outputpower",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.collingfancount && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Cooling Fan Count</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.coolingfancount?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.collingfancount,
                                          value: todo.collingfancount,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "collingfancount",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.clockspeed && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Clock Speed</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.clockspeed?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.clockspeed,
                                          value: todo.clockspeed,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "clockspeed",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.core && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Core</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.core?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.core,
                                          value: todo.core,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "core", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.speed && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Speed</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.speed?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.speed,
                                          value: todo.speed,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "speed", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.frequency && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Frequency</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.frequency?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.frequency,
                                          value: todo.frequency,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "frequency",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.output && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Output</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.output?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.output,
                                          value: todo.output,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "output",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.ethernetports && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Ethernet Ports</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.ethernetports?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.ethernetports,
                                          value: todo.ethernetports,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "ethernetports",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.distance && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Distance</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.distance?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.distance,
                                          value: todo.distance,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "distance",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.lengthname && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Length</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.lengthname?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.lengthname,
                                          value: todo.lengthname,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "lengthname",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.slot && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Slot</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.slot?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.slot,
                                          value: todo.slot,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "slot", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.noofchannels && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>No. Of Channels</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.noofchannels?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.noofchannels,
                                          value: todo.noofchannels,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "noofchannels",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.colours && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Colour</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          ?.find(
                                            (item) =>
                                              item.subcomponent === todo.subname
                                          )
                                          ?.colours?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.colours,
                                          value: todo.colours,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "colours",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Material Code</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.code}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "code",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Count(Qty)</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.countquantity}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "countquantity",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Rate</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.rate}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[0-9]*$/;
                                        if (regex.test(inputValue)) {
                                          handleChange(
                                            index,
                                            "rate",
                                            inputValue
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Warranty <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Select
                                      fullWidth
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={todo.warranty}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, warranty: e.target.value });
                                      // }}
                                      // value={todo.serial}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "warranty",
                                          e.target.value
                                        );
                                      }}
                                    >
                                      <MenuItem value="" disabled>
                                        {" "}
                                        Please Select
                                      </MenuItem>
                                      <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                      <MenuItem value="No"> {"No"} </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          {todo.warranty === "Yes" && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={6} xs={6} sm={6}>
                                    <Typography>
                                      Warranty Time{" "}
                                      <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Enter Time"
                                        value={todo.estimation}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "estimation",
                                            e.target.value
                                          );
                                          // handleChangephonenumber(e)
                                        }}
                                      // onChange={(e) => handleChangephonenumber(e)}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={6} xs={6} sm={6}>
                                    <Typography>
                                      Estimation{" "}
                                      <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Select
                                      fullWidth
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={todo.estimationtime}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, estimationtime: e.target.value });
                                      // }}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "estimationtime",
                                          e.target.value
                                        );
                                        // handleEstimationChange()
                                      }}
                                    // onChange={handleEstimationChange}
                                    >
                                      <MenuItem value="" disabled>
                                        {" "}
                                        Please Select
                                      </MenuItem>
                                      <MenuItem value="Days">
                                        {" "}
                                        {"Days"}{" "}
                                      </MenuItem>
                                      <MenuItem value="Month">
                                        {" "}
                                        {"Month"}{" "}
                                      </MenuItem>
                                      <MenuItem value="Year">
                                        {" "}
                                        {"Year"}{" "}
                                      </MenuItem>
                                    </Select>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Purchase date </Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="date"
                                      value={todo.purchasedate}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "purchasedate",
                                          e.target.value
                                        );
                                        // handlePurchaseDateChange()
                                      }}
                                    // onChange={handlePurchaseDateChange}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          {todo.warranty === "Yes" && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Expiry Date </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder=""
                                        value={todo.warrantycalculation}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, warrantyCalculation: e.target.value });
                                      // }}
                                      />
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Vendor<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                      options={vendorOpt}
                                      styles={colourStyles}
                                      value={{
                                        label: todo.vendor,
                                        value: todo.vendor,
                                      }}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "vendor",
                                          e.value,
                                          e._id
                                        );
                                        // setVendor(e.value);
                                        // vendorid(e._id);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Address</Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      // value={vendorgetid?.address}
                                      value={todo?.address}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Phone Number</Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      // value={vendorgetid?.phonenumber}
                                      value={todo?.phonenumber}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <Grid item md={1} sm={3} xs={3}>
                            {todos.length > 0 && (
                              <>
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
                                  onClick={() => handleDelete(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "large",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container key={index} spacing={1}>
                      <Grid item md={12} sm={12} xs={12} marginTop={2}>
                        <Grid container key={index} spacing={1}>
                          {todo.type && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Type</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.type?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.type,
                                          value: todo.type,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "type", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenType();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.model && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Model</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.model?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.model,
                                          value: todo.model,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "model", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenModel();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {todo.size && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Size</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.size?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.size,
                                          value: todo.size,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "size", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenSize();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {todo.variant && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Variants</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.variant?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.variant,
                                          value: todo.variant,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "variant",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenVariant();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {todo.brand && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl size="small" fullWidth>
                                      <Typography>Brand</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.brand?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.brand,
                                          value: todo.brand,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "brand", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenBrand();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {todo.serial !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>Serial</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Serial"
                                      value={todo.serial}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "serial",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {todo.other !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>Others</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter Other"
                                      value={todo.other}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "other",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.capacity && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Capacity</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.capacity?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.capacity,
                                          value: todo.capacity,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "capacity",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.hdmiport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>HDMI Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="number"
                                      size="small"
                                      placeholder="Please Enter HDMI Port"
                                      value={todo.hdmiport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "hdmiport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.vgaport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>VGA Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter VGA Port"
                                      value={todo.vgaport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "vgaport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.dpport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>DP Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter DP Port"
                                      value={todo.dpport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "dpport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.usbport !== undefined && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={11.6} sm={10} xs={10}>
                                    <Typography>USB Port</Typography>

                                    <OutlinedInput
                                      fullWidth
                                      type="text"
                                      size="small"
                                      placeholder="Please Enter USB Port"
                                      value={todo.usbport}
                                      onChange={(e) => {
                                        const inputText = e.target.value;
                                        // Regex to allow only non-negative numbers
                                        const validatedInput =
                                          inputText.match(/^\d*$/);

                                        const sanitizedInput =
                                          validatedInput !== null
                                            ? validatedInput[0]
                                            : "0";
                                        handleChange(
                                          index,
                                          "usbport",
                                          sanitizedInput
                                        );
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.paneltypescreen && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Panel Type</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.paneltype?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.paneltypescreen,
                                          value: todo.paneltypescreen,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "paneltypescreen",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.resolution && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Screen Resolution</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.screenresolution?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.resolution,
                                          value: todo.resolution,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "resolution",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.connectivity && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Connectivity</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.connectivity?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.connectivity,
                                          value: todo.connectivity,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "connectivity",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.daterate && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Data Rate</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.datarate?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.daterate,
                                          value: todo.daterate,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "daterate",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.compatibledevice && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Compatible Device</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.compatibledevices?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.compatibledevice,
                                          value: todo.compatibledevice,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "compatibledevice",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.outputpower && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Output Power</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.outputpower?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.outputpower,
                                          value: todo.outputpower,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "outputpower",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.collingfancount && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Cooling Fan Count</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.coolingfancount?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.collingfancount,
                                          value: todo.collingfancount,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "collingfancount",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.clockspeed && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Clock Speed</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.clockspeed?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.clockspeed,
                                          value: todo.clockspeed,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "clockspeed",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.core && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Core</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.core?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.core,
                                          value: todo.core,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "core", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.speed && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Speed</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.speed?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.speed,
                                          value: todo.speed,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "speed", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.frequency && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Frequency</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.frequency?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.frequency,
                                          value: todo.frequency,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "frequency",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.output && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Output</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.output?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.output,
                                          value: todo.output,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "output",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.ethernetports && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Ethernet Ports</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.ethernetports?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.ethernetports,
                                          value: todo.ethernetports,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "ethernetports",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.distance && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Distance</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.distance?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.distance,
                                          value: todo.distance,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "distance",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.lengthname && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Length</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.lengthname?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.lengthname,
                                          value: todo.lengthname,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "lengthname",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.slot && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Slot</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.slot?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.slot,
                                          value: todo.slot,
                                        }}
                                        onChange={(e) => {
                                          handleChange(index, "slot", e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.noofchannels && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>No. Of Channels</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.noofchannels?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.noofchannels,
                                          value: todo.noofchannels,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "noofchannels",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          {todo.colours && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Colour</Typography>
                                      <Selects
                                        options={specificationGrouping
                                          .find(
                                            (item) =>
                                              assetdetail.component ===
                                              item.component &&
                                              assetdetail.material ===
                                              item.assetmaterial
                                          )
                                          ?.colours?.map((item) => ({
                                            ...item,
                                            label: item,
                                            value: item,
                                          }))}
                                        styles={colourStyles}
                                        value={{
                                          label: todo.colours,
                                          value: todo.colours,
                                        }}
                                        onChange={(e) => {
                                          handleChange(
                                            index,
                                            "colours",
                                            e.value
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>

                                  <Grid item md={2} sm={2} xs={2}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disabled
                                      style={{
                                        height: "30px",
                                        minWidth: "20px",
                                        padding: "19px 13px",
                                        //  color: "white",
                                        marginTop: "23px",
                                        marginLeft: "-10px",
                                        // background: "rgb(25, 118, 210)",
                                      }}
                                      onClick={() => {
                                        handleClickOpenCapacity();
                                      }}
                                    >
                                      <FaPlus style={{ fontSize: "15px" }} />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Material Code</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.code}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "code",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Count(Qty)</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.countquantity}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "countquantity",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <Typography>Rate</Typography>
                                  <FormControl fullWidth size="small">
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      value={todo.rate}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[0-9]*$/;
                                        if (regex.test(inputValue)) {
                                          handleChange(
                                            index,
                                            "rate",
                                            inputValue
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Warranty <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Select
                                      fullWidth
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={todo.warranty}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, warranty: e.target.value });
                                      // }}
                                      // value={todo.serial}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "warranty",
                                          e.target.value
                                        );
                                      }}
                                    >
                                      <MenuItem value="" disabled>
                                        {" "}
                                        Please Select
                                      </MenuItem>
                                      <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                      <MenuItem value="No"> {"No"} </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          {todo.warranty === "Yes" && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container>
                                  <Grid item md={6} xs={6} sm={6}>
                                    <Typography>
                                      Warranty Time{" "}
                                      <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Enter Time"
                                        value={todo.estimation}
                                        onChange={(e) => {
                                          handleChange(index, "estimation");
                                          handleChangephonenumber(e);
                                        }}
                                      // onChange={(e) => handleChangephonenumber(e)}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={6} xs={6} sm={6}>
                                    <Typography>
                                      Estimation{" "}
                                      <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Select
                                      fullWidth
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={todo.estimationtime}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, estimationtime: e.target.value });
                                      // }}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "estimationtime",
                                          e.target.value
                                        );
                                        // handleEstimationChange()
                                      }}
                                    // onChange={handleEstimationChange}
                                    >
                                      <MenuItem value="" disabled>
                                        {" "}
                                        Please Select
                                      </MenuItem>
                                      <MenuItem value="Days">
                                        {" "}
                                        {"Days"}{" "}
                                      </MenuItem>
                                      <MenuItem value="Month">
                                        {" "}
                                        {"Month"}{" "}
                                      </MenuItem>
                                      <MenuItem value="Year">
                                        {" "}
                                        {"Year"}{" "}
                                      </MenuItem>
                                    </Select>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Purchase date </Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="date"
                                      value={todo.purchasedate}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "purchasedate",
                                          e.target.value
                                        );
                                        // handlePurchaseDateChange()
                                      }}
                                    // onChange={handlePurchaseDateChange}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          {todos.warranty === "Yes" && (
                            <>
                              <Grid item md={3} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                  <Grid item md={10} sm={10} xs={10}>
                                    <FormControl fullWidth size="small">
                                      <Typography>Expiry Date </Typography>
                                      <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder=""
                                        value={todo.warrantycalculation}
                                      // onChange={(e) => {
                                      //   setAssetdetail({ ...assetdetail, warrantyCalculation: e.target.value });
                                      // }}
                                      />
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Vendor<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                      options={vendorOpt}
                                      styles={colourStyles}
                                      value={{
                                        label: todo.vendor,
                                        value: todo.vendor,
                                      }}
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "vendor",
                                          e.value,
                                          e._id
                                        );
                                        // setVendor(e.value);
                                        // vendorid(e._id);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Address</Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      // value={vendorgetid?.address}
                                      value={todo?.address}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormControl fullWidth size="small">
                                    <Typography>Phone Number</Typography>
                                    <OutlinedInput
                                      id="component-outlined"
                                      type="text"
                                      // value={vendorgetid?.phonenumber}
                                      value={todo?.phonenumber}
                                      readOnly
                                    />
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>

                          <Grid item md={1} sm={3} xs={3}>
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
                              onClick={() => handleDelete(index)}
                            >
                              <FaTrash
                                style={{ fontSize: "large", color: "#a73131" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <br />
                </>
              );
            })}
          <br />
          <Grid container spacing={2}>
            {/* <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Material Code </Typography>
                <OutlinedInput id="component-outlined"
                  type="text" value={assetdetail.code}
                  placeholder="Please Enter Material Code" />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Count(Qty)<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  sx={userStyle.input}
                  type="number"
                  value={assetdetail.countquantity}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      countquantity: e.target.value,
                      stockcode: `${assetdetail?.code}#${assignValue}- ${e.target.value === "" ? "" : lastcodeVal + parseInt(e.target.value)}#${stockCodeCount}`,
                      materialcountcode: `${assetdetail?.code}#${assignValue}- ${e.target.value === "" ? "" : lastcodeVal + parseInt(e.target.value)}`,
                    });
                    // fetchAsset(e);
                    handleCountChange(e);
                  }}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Material Countcode</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  // value={assetdetail.branch === "Choose Branch" ? "" : `${codeFetch.companycode}-${codeFetch.code}-${assetdetail.code}#${assignValue}-${assetdetail.countquantity === "" ? "" : lastcodeVal + parseInt(assetdetail.countquantity)}`}
                  value={assetdetail.materialcountcode}
                />
              </FormControl>
            </Grid> */}

            {/* <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Serial </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Serial"
                  value={assetdetail.serial}
                  onChange={(e) => {
                    setAssetdetail({ ...assetdetail, serial: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>  */}
            {/* <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Rate </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  placeholder="Please Enter Rate"
                  sx={userStyle.input}
                  value={assetdetail.rate}
                  onChange={(e) => {
                    setAssetdetail({ ...assetdetail, rate: e.target.value });
                  }}
                />
              </FormControl>
            </Grid> */}

            <Grid item md={3} xs={12} sm={12}>
              <Typography>Attachment</Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Button
                  variant="contained"
                  onClick={handleClickUploadPopupOpen}
                >
                  Upload
                </Button>
              </Box>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Create
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                Clear
              </Button>
            </Grid>
          </Grid>
          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
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
        </Box>
      )}
      <br />

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <form>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Asset Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={companysEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.company,
                          value: assetdetailEdit.company,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setBranchsEdit([]);
                          setAreasEdit([]);
                          setFloorEdit([]);
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                          fetchBranchDropdownsEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={branchsEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.branch,
                          value: assetdetailEdit.branch,
                        }}
                        onChange={(e) => {
                          setNewcheckBranch(e.value);
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            branch: e.value,
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setUnitsEdit([]);
                          setAreasEdit([]);
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                          setFloorEdit([]);
                          fetchUnitsEdit(e.value);
                          fetchFloorEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={unitsEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.unit,
                          value: assetdetailEdit.unit,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            unit: e.value,
                            workstation: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Floor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={floorsEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.floor,
                          value: assetdetailEdit.floor,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            floor: e.value,
                            workstation: "",
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setAreasEdit([]);
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                          fetchAreaEdit(assetdetailEdit.branch, e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={areasEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.area,
                          value: assetdetailEdit.area,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            area: e.value,
                            workstation: "",
                            location: "Please Select Location",
                          });
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                          fetchAllLocationEdit(
                            assetdetailEdit.branch,
                            assetdetailEdit.floor,
                            e.value
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Location<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={locationsEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.location,
                          value: assetdetailEdit.location,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            location: e.value,
                            workstation: "",
                          });
                        }}
                      />
                    </FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={assetdetailEdit.workcheck} />
                        }
                        onChange={(e) =>
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            workcheck: !assetdetailEdit.workcheck,
                            // ^ Update workcheck based on the checkbox state
                          })
                        }
                        label="Enable Workstation"
                      />
                    </FormGroup>
                  </Grid>
                  {assetdetailEdit.workcheck && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Work Station</Typography>
                        <Selects
                          maxMenuHeight={250}
                          styles={colourStyles}
                          options={filteredWorkStation}
                          placeholder="Please Select Workstation"
                          value={{
                            label:
                              assetdetailEdit.workstation === "" ||
                                assetdetailEdit.workstation === undefined
                                ? "Please Select Workstation"
                                : assetdetailEdit.workstation,
                            value:
                              assetdetailEdit.workstation === "" ||
                                assetdetailEdit.workstation === undefined
                                ? "Please Select Workstation"
                                : assetdetailEdit.workstation,
                          }}
                          onChange={(e) => {
                            setAssetdetailEdit({
                              ...assetdetailEdit,
                              workstation: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Material Code </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={assetdetailEdit.code}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Count(Qty) </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={assetdetailEdit.countquantity}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Rate </Typography>
                      {assetdetailEdit.overallrate ? (
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={assetdetailEdit.rate}
                          onChange={(e) => {
                            setAssetdetailEdit({
                              ...assetdetailEdit,
                              rate: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          value={assetdetailEdit.rate}
                          readOnly
                        />
                      )}
                    </FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={assetdetailEdit.overallrate} />
                        }
                        onChange={(e) => {
                          setAssetdetailEdit((prevAssetDetail) => ({
                            ...prevAssetDetail,
                            overallrate: !prevAssetDetail.overallrate,
                            rate: prevAssetDetail.overallrate
                              ? calculateTotalRateEdit()
                              : "",
                          }));
                        }}
                        label="Overall Rate"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Warranty <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={assetdetailEdit.warranty}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            warranty: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select
                        </MenuItem>
                        <MenuItem value="Yes"> {"Yes"} </MenuItem>
                        <MenuItem value="No"> {"No"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {assetdetailEdit.warranty === "Yes" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <Grid container>
                          <Grid item md={6} xs={6} sm={6}>
                            <Typography>
                              Warranty Time <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Enter Time"
                                value={assetdetailEdit.estimation}
                                onChange={(e) => handleChangephonenumberEdit(e)}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={6} sm={6}>
                            <Typography>
                              Estimation <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Select
                              fullWidth
                              size="small"
                              labelId="demo-select-small"
                              id="demo-select-small"
                              value={assetdetailEdit.estimationtime}
                              // onChange={(e) => {
                              //   setAssetdetail({ ...assetdetail, estimationtime: e.target.value });
                              // }}
                              onChange={handleEstimationChangeEdit}
                            >
                              <MenuItem value="" disabled>
                                {" "}
                                Please Select
                              </MenuItem>
                              <MenuItem value="Days"> {"Days"} </MenuItem>
                              <MenuItem value="Month"> {"Month"} </MenuItem>
                              <MenuItem value="Year"> {"Year"} </MenuItem>
                            </Select>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Purchase date </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={selectedPurchaseDateEdit}
                        // onChange={(e) => {
                        //   setAssetdetail({ ...assetdetail, purchasedate: e.target.value });
                        // }}
                        onChange={handlePurchaseDateChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                  {assetdetailEdit.warranty === "Yes" && (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Expiry Date </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder=""
                            value={assetdetailEdit.warrantycalculation}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={vendorOptEdit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.vendor,
                          value: assetdetailEdit.vendor,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            vendor: e.value,
                          });
                          vendoridEdit(e._id);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Address<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgetidEdit?.address}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Phone Number<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendorgetidEdit?.phonenumber}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Material</Typography>
                      <OutlinedInput value={assetdetailEdit.material} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Asset Type</Typography>
                      <OutlinedInput value={assetdetailEdit.assettype} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Asset</Typography>
                      <OutlinedInput value={assetdetailEdit.asset} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Component</Typography>
                      <Selects
                        options={Specificationedit}
                        styles={colourStyles}
                        value={{
                          label: assetdetailEdit.component,
                          value: assetdetail.component,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            component: e.value,
                          });
                          setTodosEdit([]);
                          handleAddInputEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                {todosEdit &&
                  todosEdit?.map((todo, index) => {
                    return (
                      <>
                        {todo.sub ? (
                          <Grid container key={index} spacing={1}>
                            <Grid item md={2} sm={2} xs={2} marginTop={2}>
                              <Typography>{todo.sub}</Typography>
                            </Grid>
                            <Grid item md={10} sm={10} xs={10} marginTop={2}>
                              <Grid container key={index} spacing={1}>
                                {todo.type && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Type</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.type?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.type,
                                                value: todo.type,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "type",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenType();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.model && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Model</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.model?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.model,
                                                value: todo.model,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "model",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenModel();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.size && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Size</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.size?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.size,
                                                value: todo.size,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "size",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenSize();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.variant && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Variants</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.variant?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.variant,
                                                value: todo.variant,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "variant",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            size="small"
                                            variant="contained"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenVariant();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.brand && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl size="small" fullWidth>
                                            <Typography>Brand</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.brand?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.brand,
                                                value: todo.brand,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "brand",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenBrand();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.serial !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>Serial</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter Serial"
                                            value={todo.serial}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "serial",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.other !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>Others</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter Other"
                                            value={todo.other}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "other",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.capacity && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Capacity</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.capacity?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.capacity,
                                                value: todo.capacity,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "capacity",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.hdmiport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>HDMI Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter HDMI Port"
                                            value={todo.hdmiport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "hdmiport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.vgaport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>VGA Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter VGA Port"
                                            value={todo.vgaport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "vgaport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.dpport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>DP Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter DP Port"
                                            value={todo.dpport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "dpport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.usbport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>USB Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter USB Port"
                                            value={todo.usbport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "usbport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.paneltypescreen && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Panel Type</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.paneltype?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.paneltypescreen,
                                                value: todo.paneltypescreen,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "paneltypescreen",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.resolution && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Screen Resolution
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.screenresolution?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.resolution,
                                                value: todo.resolution,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "resolution",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.connectivity && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Connectivity
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.connectivity?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.connectivity,
                                                value: todo.connectivity,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "connectivity",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.daterate && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Data Rate</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.datarate?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.daterate,
                                                value: todo.daterate,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "daterate",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.compatibledevice && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Compatible Device
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.compatibledevices?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.compatibledevice,
                                                value: todo.compatibledevice,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "compatibledevice",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.outputpower && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Output Power
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.outputpower?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.outputpower,
                                                value: todo.outputpower,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "outputpower",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.collingfancount && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Cooling Fan Count
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.coolingfancount?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.collingfancount,
                                                value: todo.collingfancount,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "collingfancount",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.clockspeed && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Clock Speed</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.clockspeed?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.clockspeed,
                                                value: todo.clockspeed,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "clockspeed",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.core && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Core</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.core?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.core,
                                                value: todo.core,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "core",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.speed && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Speed</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.speed?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.speed,
                                                value: todo.speed,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "speed",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.frequency && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Frequency</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.frequency?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.frequency,
                                                value: todo.frequency,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "frequency",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.output && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Output</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.output?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.output,
                                                value: todo.output,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "output",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.ethernetports && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Ethernet Ports
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.ethernetports?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.ethernetports,
                                                value: todo.ethernetports,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "ethernetports",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.distance && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Distance</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.distance?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.distance,
                                                value: todo.distance,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "distance",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.lengthname && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Length</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.lengthname?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.lengthname,
                                                value: todo.lengthname,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "lengthname",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.slot && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Slot</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.slot?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.slot,
                                                value: todo.slot,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "slot",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.noofchannels && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              No. Of Channels
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.noofchannels?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.noofchannels,
                                                value: todo.noofchannels,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "noofchannels",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.colours && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Colour</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                ?.find(
                                                  (item) =>
                                                    item.subcomponent ===
                                                    todo.subname
                                                )
                                                ?.colours?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.colours,
                                                value: todo.colours,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "colours",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Material Code</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.code}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "code",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Count(Qty)</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.countquantity}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "countquantity",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Rate</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.rate}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const regex = /^[0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                handleChangeEdit(
                                                  index,
                                                  "rate",
                                                  inputValue
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Warranty</Typography>
                                          <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={todo.warranty}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "warranty",
                                                e.target.value
                                              );
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              {" "}
                                              Please Select
                                            </MenuItem>
                                            <MenuItem value="Yes">
                                              {" "}
                                              {"Yes"}{" "}
                                            </MenuItem>
                                            <MenuItem value="No">
                                              {" "}
                                              {"No"}{" "}
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                {todo.warranty === "Yes" && (
                                  <>
                                    <Grid item md={3} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={6} xs={6} sm={6}>
                                          <Typography>Warranty Time</Typography>
                                          <FormControl fullWidth size="small">
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              size="small"
                                              placeholder="Enter Time"
                                              value={todo.estimation}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "estimation",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sm={6}>
                                          <Typography>Estimation</Typography>
                                          <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            size="small"
                                            value={todo.estimationtime}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "estimationtime",
                                                e.target.value
                                              );
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              {" "}
                                              Please Select
                                            </MenuItem>
                                            <MenuItem value="Days">
                                              {" "}
                                              {"Days"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Month">
                                              {" "}
                                              {"Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Year">
                                              {" "}
                                              {"Year"}{" "}
                                            </MenuItem>
                                          </Select>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Purchase date{" "}
                                          </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            size="small"
                                            value={todo.purchasedate}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "purchasedate",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                {todo.warranty === "Yes" && (
                                  <>
                                    <Grid item md={3} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Expiry Date{" "}
                                            </Typography>
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              size="small"
                                              placeholder=""
                                              value={todo.warrantycalculation}
                                            />
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Vendor
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            options={vendorOptEdit}
                                            styles={colourStyles}
                                            value={{
                                              label: todo.vendor,
                                              value: todo.vendor,
                                            }}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "vendor",
                                                e.value,
                                                e._id
                                              );

                                              // vendoridEdit(e._id);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Address</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            // value={vendorgetid?.address}
                                            value={todo?.address}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Phone Number</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            // value={vendorgetid?.phonenumber}
                                            value={todo?.phonenumber}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <Grid item md={1} sm={3} xs={3}>
                                  {/* {todos.length > 0 && (
                              <> */}
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
                                    onClick={() => handleDeleteEdit(index)}
                                  >
                                    <FaTrash
                                      style={{
                                        fontSize: "large",
                                        color: "#a73131",
                                      }}
                                    />
                                  </Button>
                                  {/* </>
                              )} */}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container key={index} spacing={1}>
                            <Grid item md={12} sm={12} xs={12} marginTop={2}>
                              <Grid container key={index} spacing={1}>
                                {todo.type && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Type</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.type?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.type,
                                                value: todo.type,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "type",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenType();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.model && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Model</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.model?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.model,
                                                value: todo.model,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "model",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenModel();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.size && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Size</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.size?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.size,
                                                value: todo.size,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "size",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenSize();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.variant && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Variants</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.variant?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.variant,
                                                value: todo.variant,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "variant",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            size="small"
                                            variant="contained"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenVariant();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.brand && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl size="small" fullWidth>
                                            <Typography>Brand</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.brand?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.brand,
                                                value: todo.brand,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "brand",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenBrand();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.serial !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>Serial</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter Serial"
                                            value={todo.serial}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "serial",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.other !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>Others</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter Other"
                                            value={todo.other}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "other",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.capacity && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Capacity</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.capacity?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.capacity,
                                                value: todo.capacity,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "capacity",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.hdmiport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>HDMI Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter HDMI Port"
                                            value={todo.hdmiport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "hdmiport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.vgaport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>VGA Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter VGA Port"
                                            value={todo.vgaport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "vgaport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.dpport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>DP Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter DP Port"
                                            value={todo.dpport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "dpport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.usbport !== undefined && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={11.6} sm={10} xs={10}>
                                          <Typography>USB Port</Typography>

                                          <OutlinedInput
                                            fullWidth
                                            type="text"
                                            size="small"
                                            placeholder="Please Enter USB Port"
                                            value={todo.usbport}
                                            onChange={(e) => {
                                              const inputText = e.target.value;
                                              // Regex to allow only non-negative numbers
                                              const validatedInput =
                                                inputText.match(/^\d*$/);

                                              const sanitizedInput =
                                                validatedInput !== null
                                                  ? validatedInput[0]
                                                  : "0";
                                              handleChangeEdit(
                                                index,
                                                "usbport",
                                                sanitizedInput
                                              );
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                {todo.paneltypescreen && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Panel Type</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.paneltype?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.paneltypescreen,
                                                value: todo.paneltypescreen,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "paneltypescreen",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.resolution && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Screen Resolution
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.screenresolution?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.resolution,
                                                value: todo.resolution,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "resolution",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.connectivity && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Connectivity
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.connectivity?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.connectivity,
                                                value: todo.connectivity,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "connectivity",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.daterate && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Data Rate</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.datarate?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.daterate,
                                                value: todo.daterate,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "daterate",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.compatibledevice && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Compatible Device
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.compatibledevices?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.compatibledevice,
                                                value: todo.compatibledevice,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "compatibledevice",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.outputpower && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Output Power
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.outputpower?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.outputpower,
                                                value: todo.outputpower,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "outputpower",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.collingfancount && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Cooling Fan Count
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.coolingfancount?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.collingfancount,
                                                value: todo.collingfancount,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "collingfancount",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.clockspeed && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Clock Speed</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.clockspeed?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.clockspeed,
                                                value: todo.clockspeed,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "clockspeed",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.core && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Core</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.core?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.core,
                                                value: todo.core,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "core",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.speed && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Speed</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.speed?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.speed,
                                                value: todo.speed,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "speed",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.frequency && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Frequency</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.frequency?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.frequency,
                                                value: todo.frequency,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "frequency",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.output && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Output</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.output?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.output,
                                                value: todo.output,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "output",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.ethernetports && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Ethernet Ports
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.ethernetports?.map(
                                                  (item) => ({
                                                    ...item,
                                                    label: item,
                                                    value: item,
                                                  })
                                                )}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.ethernetports,
                                                value: todo.ethernetports,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "ethernetports",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.distance && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Distance</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.distance?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.distance,
                                                value: todo.distance,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "distance",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.lengthname && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Length</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.lengthname?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.lengthname,
                                                value: todo.lengthname,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "lengthname",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.slot && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Slot</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.slot?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.slot,
                                                value: todo.slot,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "slot",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.noofchannels && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              No. Of Channels
                                            </Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.noofchannels?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.noofchannels,
                                                value: todo.noofchannels,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "noofchannels",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                {todo.colours && (
                                  <>
                                    <Grid item md={4} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>Colour</Typography>
                                            <Selects
                                              options={specificationGroupingEdit
                                                .find(
                                                  (item) =>
                                                    assetdetailEdit.component ===
                                                    item.component &&
                                                    assetdetailEdit.material ===
                                                    item.assetmaterial
                                                )
                                                ?.colours?.map((item) => ({
                                                  ...item,
                                                  label: item,
                                                  value: item,
                                                }))}
                                              styles={colourStyles}
                                              value={{
                                                label: todo.colours,
                                                value: todo.colours,
                                              }}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "colours",
                                                  e.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={2}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            disabled
                                            style={{
                                              height: "30px",
                                              minWidth: "20px",
                                              padding: "19px 13px",
                                              // color: "white",
                                              marginTop: "23px",
                                              marginLeft: "-10px",
                                              // background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={() => {
                                              handleClickOpenCapacity();
                                            }}
                                          >
                                            <FaPlus
                                              style={{ fontSize: "15px" }}
                                            />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Material Code</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.code}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "code",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Count(Qty)</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.countquantity}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "countquantity",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <Typography>Rate</Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={todo.rate}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const regex = /^[0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                handleChangeEdit(
                                                  index,
                                                  "rate",
                                                  inputValue
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Warranty{" "}
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            size="small"
                                            value={todo.warranty}
                                            // onChange={(e) => {
                                            //   setAssetdetail({ ...assetdetail, warranty: e.target.value });
                                            // }}
                                            // value={todo.serial}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "warranty",
                                                e.target.value
                                              );
                                            }}
                                          >
                                            <MenuItem value="" disabled>
                                              {" "}
                                              Please Select
                                            </MenuItem>
                                            <MenuItem value="Yes">
                                              {" "}
                                              {"Yes"}{" "}
                                            </MenuItem>
                                            <MenuItem value="No">
                                              {" "}
                                              {"No"}{" "}
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                {todo.warranty === "Yes" && (
                                  <>
                                    <Grid item md={3} sm={6} xs={12}>
                                      <Grid container>
                                        <Grid item md={6} xs={6} sm={6}>
                                          <Typography>
                                            Warranty Time{" "}
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <FormControl fullWidth size="small">
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              size="small"
                                              placeholder="Enter Time"
                                              value={todo.estimation}
                                              onChange={(e) => {
                                                handleChangeEdit(
                                                  index,
                                                  "estimation",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sm={6}>
                                          <Typography>
                                            Estimation{" "}
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            size="small"
                                            value={todo.estimationtime}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "estimationtime",
                                                e.target.value
                                              );
                                              // handleEstimationChange()
                                            }}
                                          // onChange={handleEstimationChange}
                                          >
                                            <MenuItem value="" disabled>
                                              {" "}
                                              Please Select
                                            </MenuItem>
                                            <MenuItem value="Days">
                                              {" "}
                                              {"Days"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Month">
                                              {" "}
                                              {"Month"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Year">
                                              {" "}
                                              {"Year"}{" "}
                                            </MenuItem>
                                          </Select>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Purchase date{" "}
                                          </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            size="small"
                                            value={todo.purchasedate}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "purchasedate",
                                                e.target.value
                                              );
                                              // handlePurchaseDateChange()
                                            }}
                                          // onChange={handlePurchaseDateChange}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                {todo.warranty === "Yes" && (
                                  <>
                                    <Grid item md={3} sm={6} xs={12}>
                                      <Grid container spacing={2}>
                                        <Grid item md={10} sm={10} xs={10}>
                                          <FormControl fullWidth size="small">
                                            <Typography>
                                              Expiry Date{" "}
                                            </Typography>
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              size="small"
                                              placeholder=""
                                              value={todo.warrantycalculation}
                                            // onChange={(e) => {
                                            //   setAssetdetail({ ...assetdetail, warrantyCalculation: e.target.value });
                                            // }}
                                            />
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>
                                            Vendor
                                            <b style={{ color: "red" }}>*</b>
                                          </Typography>
                                          <Selects
                                            options={vendorOptEdit}
                                            styles={colourStyles}
                                            value={{
                                              label: todo.vendor,
                                              value: todo.vendor,
                                            }}
                                            onChange={(e) => {
                                              handleChangeEdit(
                                                index,
                                                "vendor",
                                                e.value,
                                                e._id
                                              );

                                              // vendoridEdit(e._id);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Address</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            // value={vendorgetid?.address}
                                            value={todo?.address}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Phone Number</Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            // value={vendorgetid?.phonenumber}
                                            value={todo?.phonenumber}
                                            readOnly
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>

                                <Grid item md={1} sm={3} xs={3}>
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
                                    onClick={() => handleDeleteEdit(index)}
                                  >
                                    <FaTrash
                                      style={{
                                        fontSize: "large",
                                        color: "#a73131",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </>
                    );
                  })}
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Attachment</Typography>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                      <Button
                        variant="contained"
                        onClick={handleClickUploadPopupOpenedit}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" onClick={editSubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
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

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassetmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                AssetDetails List
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
                    <MenuItem value={assetdetails?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassetmaster") && (
                    <>
                      <ExportXL csvData={assetdetailData} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvassetmaster") && (
                    <>
                      <ExportCSV
                        csvData={assetdetailData}
                        fileName={fileName}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printassetmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassetmaster") && (
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
                  {isUserRoleCompare?.includes("imageassetmaster") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdassetmaster") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
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
            <br />
            <br />
            {!assetdetailCheck ? (
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
                    unstable_cellSelection
                    disableRowSelectionOnClick
                    unstable_ignoreValueFormatterDuringExport
                  />
                </Box>
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
              </>
            )}
          </Box>
        </>
      )}

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
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delAssetdetail(Assetdetailsid)}
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
                AssetDetail Info
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
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
                    <Typography variant="h6">Updated by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                <TableCell> SI.No</TableCell>
                <TableCell> Company</TableCell>
                <TableCell> Branch</TableCell>
                <TableCell> Unit</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>WorkStation</TableCell>
                <TableCell>Asset Type</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Material Code</TableCell>
                <TableCell>Countablequantity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Warranty</TableCell>
                <TableCell>Purchasedate</TableCell>
                <TableCell>Vendor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {assetdetails &&
                assetdetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.floor}</TableCell>
                    <TableCell>{row.area}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.workstation}</TableCell>
                    <TableCell>{row.assettype}</TableCell>
                    <TableCell>{row.asset}</TableCell>
                    <TableCell>{row.material}</TableCell>
                    <TableCell>{row.component}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.countquantity}</TableCell>
                    <TableCell>{row.rate}</TableCell>
                    <TableCell>{row.warranty}</TableCell>
                    <TableCell>{row.purchasedate}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
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
        maxWidth="lg"
      >
        <Box sx={{ width: "850px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Asset Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{assetdetailEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{assetdetailEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{assetdetailEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{assetdetailEdit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{assetdetailEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{assetdetailEdit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">WorkStation</Typography>
                  <Typography>{assetdetailEdit.workstation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Detail</Typography>
                  <Typography>{assetdetailEdit.asset}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Type</Typography>
                  <Typography>{assetdetailEdit.assettype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Material</Typography>
                  <Typography>{assetdetailEdit.material}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Component</Typography>
                  <Typography>{assetdetailEdit.component}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Material Code</Typography>
                  <Typography>{assetdetailEdit.code}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Count(Qty)</Typography>
                  <Typography>{assetdetailEdit.countquantity}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Rate</Typography>
                  <Typography>{assetdetailEdit.rate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Warranty</Typography>
                  <Typography>{assetdetailEdit.warranty}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Purchasedate</Typography>
                  <Typography>{assetdetailEdit.purchasedate}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor</Typography>
                  <Typography>{assetdetailEdit.vendor}</Typography>
                </FormControl>
              </Grid>
            </Grid>{" "}
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
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
              onClick={(e) => delAssetcheckbox(e)}
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

      {/* UPLOAD IMAGE DIALOG */}
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
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOver} onDrop={handleDrop}>
                {previewURL && refImageDrag.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  {/* {showUploadBtn ? ( */}
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
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
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

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD IMAGE DIALOG EDIT */}
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
          Upload Image Edit
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOveredit} onDrop={handleDropedit}>
                {previewURLedit && refImageDragedit.length > 0 ? (
                  <>
                    {refImageDragedit.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFileedit(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    {" "}
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
                  <Button
                    variant="contained"
                    onClick={showWebcamedit}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {resultArray?.map((file, index) => (
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
                      md={8}
                      sm={8}
                      xs={8}
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
                          onClick={() => {
                            handleDeleteFileedit(index);
                          }}
                        >
                          <FaTrash
                            style={{ color: "#a73131", fontSize: "12px" }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
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

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpenedit}
        onClose={webcamCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={nameedit}
            getImgedit={getImgedit}
            setGetImgedit={setGetImgedit}
            valNumedit={valNumedit}
            setValNumedit={setValNumedit}
            capturedImagesedit={capturedImagesedit}
            setCapturedImagesedit={setCapturedImagesedit}
            setRefImageedit={setRefImageedit}
            setRefImageDragedit={setRefImageDragedit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={webcamDataStoreedit}
          >
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isimgviewbill}
        onClose={handlecloseImgcodeviewbill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6">Images</Typography>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={6} sm={10} xs={10}>
                <img
                  src={imagefilebill.preview}
                  style={{
                    maxWidth: "70px",
                    maxHeight: "70px",
                    marginTop: "10px",
                  }}
                />
              </Grid>

              <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.name}</Typography>
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Button
                  sx={{
                    padding: "14px 14px",
                    minWidth: "40px !important",
                    borderRadius: "50% !important",
                    ":hover": {
                      backgroundColor: "#80808036", // theme.palette.primary.main
                    },
                  }}
                  onClick={() => renderFilePreview(imagefilebill)}
                >
                  <VisibilityOutlinedIcon
                    style={{
                      fontsize: "12px",
                      color: "#357AE8",
                      marginTop: "35px !important",
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* dialog box for Type */}

      <Dialog
        open={opentype}
        onClose={handleClickOpenType}
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
        {isUserRoleCompare?.includes("aassetspecificationtype") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Type
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetSpecificationType.name}
                      onChange={(e) => {
                        setAssetSpecificationType({
                          ...assetSpecificationType,
                          name: e.target.value,
                          code: e.target.value.slice(0, 3)?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={assetSpecificationType.code}
                      onChange={(e) => {
                        setAssetSpecificationType({
                          ...assetSpecificationType,
                          code: e.target.value.toUpperCase(),
                        });
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
                    color="primary"
                    onClick={handleSubmittype}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handlecleartype}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseType}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </Dialog>

      {/* dialog box for Model */}

      <Dialog
        open={openmodel}
        onClose={handleClickOpenModel}
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
        {isUserRoleCompare?.includes("aassetmodel") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Model
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetModel.name}
                      onChange={(e) => {
                        setAssetModel({
                          ...assetModel,
                          name: e.target.value,
                          code: e.target.value.slice(0, 3)?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={assetModel.code}
                      onChange={(e) => {
                        setAssetModel({
                          ...assetModel,
                          code: e.target.value.toUpperCase(),
                        });
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
                    color="primary"
                    onClick={handleSubmitModel}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclearModel}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseModel}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </Dialog>

      {/* dialog box for Size */}

      <Dialog
        open={opensize}
        onClose={handleClickOpenSize}
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
        {isUserRoleCompare?.includes("aassetsize") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Size
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetSize.name}
                      onChange={(e) => {
                        setAssetSize({
                          ...assetSize,
                          name: e.target.value,
                          code: e.target.value.slice(0, 3)?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={assetSize.code}
                      onChange={(e) => {
                        setAssetSize({
                          ...assetSize,
                          code: e.target.value.toUpperCase(),
                        });
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
                    color="primary"
                    onClick={handleSubmitSize}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclearSize}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseSize}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </Dialog>

      {/* dialog box for Vairant */}

      <Dialog
        open={openvariant}
        onClose={handleClickOpenVariant}
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
        {isUserRoleCompare?.includes("aassetvariant") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Variant
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetVariant.name}
                      onChange={(e) => {
                        setAssetVariant({
                          ...assetVariant,
                          name: e.target.value,
                          code: e.target.value.slice(0, 3)?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={assetVariant.code}
                      onChange={(e) => {
                        setAssetVariant({
                          ...assetVariant,
                          code: e.target.value.toUpperCase(),
                        });
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
                    color="primary"
                    onClick={handleSubmitVariant}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclearVariant}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseVariant}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </Dialog>

      {/* dialog box for Brand */}

      <Dialog
        open={openbrand}
        onClose={handleClickOpenBrand}
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
        {isUserRoleCompare?.includes("abrandmaster") && (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Brand
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Brand Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Brand Name"
                      value={brandMaster.name}
                      onChange={(e) => {
                        setBrandMaster({
                          ...brandMaster,
                          name: e.target.value,
                          code: e.target.value.slice(0, 4)?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Brand Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Brand Code"
                      value={brandMaster.code}
                      onChange={(e) => {
                        setBrandMaster({
                          ...brandMaster,
                          code: e.target.value.toUpperCase(),
                        });
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
                    color="primary"
                    onClick={handleSubmitBrand}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclearBrand}>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseBrand}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </Dialog>
      {/* dialog box for capacity */}
      <Dialog
        open={openCapacity}
        onClose={handleClickOpenCapacity}
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
        {isUserRoleCompare?.includes("aassetcapacity") ? (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Capacity
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={capacityname}
                      onChange={(e) => {
                        setcapacityname(e.target.value);
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
                    color="primary"
                    onClick={handleSubmitCapacity}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleclearCapacity}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={handleClickCloseCapacity}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        ) : (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Manage Capacity
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <Box sx={{ textAlign: "center" }}>
                <Typography>No Access</Typography>
              </Box>
              <br />
              <br />
            </DialogContent>
            <DialogActions>
              <Button
                sx={userStyle.btncancel}
                onClick={handleClickCloseCapacity}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default AssetDetails;
