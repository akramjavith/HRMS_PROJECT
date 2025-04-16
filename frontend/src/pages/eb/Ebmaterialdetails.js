import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
import {
  Box, InputAdornment,
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
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaSearch, FaPlus, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
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


function EBMaterialUsageDetails() {
  const [roundmasters, setRoundmasters] = useState([]);
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
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Servicenumber",
    "Date",
    "Fromtime",
    "Totime",
    "Total Minute",
    "Total Unit Consumed",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "servicenumber",
    "date",
    "fromtime",
    "totime",
    "hours",
    "totalunitconsumed",
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
      pagename: String("EB Material Usage Details"),
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  //    today date fetching
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [ebmaterialusage, setEbmaterialusage] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    materialname: "Please Select Material Name",
    servicenumber: "",
    quantity: "",
    date: today,
    fromtime: "",
    totime: "",
    usageqty: "",
    hours: "",
    totalunitcalculation: "",
  });

  const [ebmaterialusageEdit, setEbmaterialusageEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    materialname: "Please Select Material Name",
    servicenumber: "",
    quantity: "",
    date: "",
    fromtime: "",
    totime: "",
    usageqty: "",
    hours: "",
    totalunitconsumed: "",
    totalunitcalculation: "",
  });

  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [materialNames, setMaterialNames] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [serviceNumber, setserviceNumber] = useState("");
  const [unitCalculation, setUnitCalculation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [floorsEdit, setFloorsEdit] = useState([]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([]);
  const [materialNamesEdit, setMaterialNamesEdit] = useState([]);
  const [serviceNumberEdit, setserviceNumberEdit] = useState("");
  const [unitCalculationEdit, setUnitCalculationEdit] = useState("");
  const [quantityEdit, setQuantityEdit] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [allEbmaterialusageedit, setAllEbmaterialusageedit] = useState([]);

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allfloor,
    allareagrouping,
    alllocationgrouping, pageName, setPageName, buttonStyles
  } = useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
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


      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));

  const { auth } = useContext(AuthContext);
  const [ebmaterialusageCheck, setEbmaterialusagecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const [todototal, settodototal] = useState("");
  const [todototalEdit, settodototalEdit] = useState("");

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
    setEbmaterialusage({
      ...ebmaterialusage,
      materialname: "Please Select Material Name",
    });
    setMaterialNames([]);
    setQuantity("");
    let ans = options.map((a, index) => {
      return a.value;
    });
    fetchMaterialName(ans);
  };

  const customValueRendererCate = (valueCate, _documents) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Location";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);

  const handleCategoryChangeEdit = (options) => {
    setSelectedOptionsCateEdit(options);
    setEbmaterialusageEdit({
      ...ebmaterialusageEdit,
      materialname: "Please Select Material Name",
    });
    setMaterialNamesEdit([]);
    setQuantityEdit("");
    let ans = options.map((a, index) => {
      return a.value;
    });

    fetchMaterialNameEdit(
      ebmaterialusageEdit.company,
      ebmaterialusageEdit.branch,
      ebmaterialusageEdit.unit,
      ebmaterialusageEdit.floor,
      ebmaterialusageEdit.area,
      ans
    );
  };

  const customValueRendererCateEdit = (valueCateEdit, _documents) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Location";
  };

  // Todo list
  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [newTodoLabelcheck, setNewTodoLabelcheck] = useState("");

  const handleCreateTodocheck = () => {
    const newTodocheck = {
      materialname: ebmaterialusage.materialname,
      quantity: quantity,
      usageqty: ebmaterialusage.usageqty,
      totalunitcalculation: todototal,
    };

    const isDuplicate = todoscheck.some(
      (todo) =>
        todo.materialname === newTodocheck.materialname &&
        todo.quantity === newTodocheck.quantity
    );
    if (ebmaterialusage.materialname == "Please Select Material Name") {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(quantity) < Number(ebmaterialusage.usageqty)) {
      setPopupContentMalert("Usage Quantity must be lesser than Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(ebmaterialusage.usageqty) === 0) {
      setPopupContentMalert("Usage Quantity must be another value!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setTodoscheck([...todoscheck, newTodocheck]);
      setNewTodoLabelcheck("");
      settodototal("");
    }
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  //edit
  const [todoscheckedit, setTodoscheckedit] = useState([]);
  const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
  const [newTodoLabelcheckedit, setNewTodoLabelcheckedit] = useState("");

  const handleCreateTodocheckedit = async () => {
    const newTodoscheckedit = {
      materialname:
        ebmaterialusageEdit.materialname === "Please Select Material Name"
          ? ""
          : ebmaterialusageEdit.materialname,
      quantity: quantityEdit,
      usageqty: ebmaterialusageEdit.usageqty,
      totalunitcalculation: todototalEdit,
    };

    const isDuplicate = todoscheckedit.some(
      (todo) =>
        todo.materialname === newTodoscheckedit.materialname &&
        todo.quantity == Number(newTodoscheckedit.quantity)
    );

    if (ebmaterialusageEdit.materialname == "Please Select Material Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Material"}
          </p>
        </>
      );
      handleClickOpenerr();
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (Number(quantityEdit) < Number(ebmaterialusageEdit.usageqty)) {
      setPopupContentMalert("Usage Quantity must be lesser than Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      Number(ebmaterialusageEdit.usageqty) === 0 ||
      ebmaterialusageEdit.usageqty === undefined ||
      ebmaterialusageEdit.usageqty === ""
    ) {
      setPopupContentMalert("Usage Quantity must be another value!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicate) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      calculateAddTimeDifference(
        ebmaterialusageEdit.fromtime,
        ebmaterialusageEdit.totime,
        newTodoscheckedit
      );
      setTodoscheckedit([...todoscheckedit, newTodoscheckedit]);
      setNewTodoLabelcheckedit("");
    }
  };

  const handleDeleteTodocheckedit = async (index) => {
    const newTodoscheckedit = [...todoscheckedit];
    newTodoscheckedit.splice(index, 1);
    setTodoscheckedit(newTodoscheckedit);
    calculateDeleteTimeDifference(
      ebmaterialusageEdit.fromtime,
      ebmaterialusageEdit.totime,
      newTodoscheckedit
    );
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    settodototalEdit("");
    setTotalmins("");
  };

  //Edit model...End Time Popup
  const [isEditOpenEndtime, setIsEditOpenEndTime] = useState(false);
  const handleClickOpenEditEndTime = () => {
    setEbmaterialusageEdit({
      ...ebmaterialusageEdit,
      totime: "",
      materialname: "",
      usageqty: "",
    });
    settodototalEdit("");
    setQuantityEdit("");
    setTotalmins("");
    setIsEditOpenEndTime(true);
  };
  const handleCloseModEditEndTime = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenEndTime(false);
    setTotalmins("");
  };

  //image


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "EB Material Usage Details.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const fetchFloor = async (e) => {
    let result = allfloor.filter(
      (d) => d.branch === e.value || d.branch === e.branch
    );
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
    setFloorsEdit(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
      .filter((d) => d.branch === newcheckbranch && d.floor === e.value)
      .map((data) => data.area);
    let ji = [].concat(...result);
    let jiii = ji.map((data) => data);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };

  const fetchLocation = async (e) => {
    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === newcheckbranch &&
          d.floor === ebmaterialusage.floor &&
          d.area === e
      )
      .map((data) => data.location);
    let ji = [].concat(...result);
    let jiii = ji.map((data) => data);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setLocations(all);
  };
  const fetchServiceNumber = async (e) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTEREBSERVICEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: newcheckbranch,
        floor: ebmaterialusage.floor,
        area: e,
      });
      setserviceNumber(
        res_type?.data?.ebservicemasters?.length > 0
          ? res_type?.data?.ebservicemasters[0]?.servicenumber
          : ""
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchUnitCalculation = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.MANAGEMATERIAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.managematerials.find(
        (d) => d.materialname === e
      );
      setUnitCalculation(result ? result.totalminutes : 0);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchMaterialName = async (e) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: ebmaterialusage.company,
        branch: newcheckbranch,
        unit: ebmaterialusage.unit,
        floor: ebmaterialusage.floor,
        area: ebmaterialusage.area,
      });

      let result =
        locations.length === e.length
          ? res_type.data.assetdetails.filter(
            (d) =>
              d.company === ebmaterialusage.company &&
              d.branch === newcheckbranch &&
              d.unit === ebmaterialusage.unit &&
              d.floor === ebmaterialusage.floor &&
              d.area === ebmaterialusage.area &&
              d.ebusage === "Yes"
          )
          : res_type.data.assetdetails.filter(
            (d) =>
              d.company === ebmaterialusage.company &&
              d.branch === newcheckbranch &&
              d.unit === ebmaterialusage.unit &&
              d.floor === ebmaterialusage.floor &&
              d.area === ebmaterialusage.area &&
              d.ebusage === "Yes" &&
              (e.includes(d.location) || d.location === "ALL")
          );

      let answer = result.map((data) => data.material);
      let uniqueArray = [...new Set(answer)];
      setMaterialNames(
        uniqueArray.map((data) => ({
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchQantity = async (e) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: ebmaterialusage.company,
        branch: newcheckbranch,
        unit: ebmaterialusage.unit,
        floor: ebmaterialusage.floor,
        area: ebmaterialusage.area,
      });

      let result = res_type.data.assetdetails
        .filter(
          (d) =>
            d.company === ebmaterialusage.company &&
            d.branch === newcheckbranch &&
            d.unit === ebmaterialusage.unit &&
            d.floor === ebmaterialusage.floor &&
            d.area === ebmaterialusage.area &&
            d.ebusage === "Yes" &&
            (valueCate.includes(d.location) || d.location === "ALL") &&
            d.material === e
        )
        ?.map((item) => item.countquantity);

      let answerr =
        result.length > 0
          ? result.reduce((cur, acc) => Number(cur) + Number(acc))
          : 0;

      setQuantity(answerr);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchAreaEdit = async (branch, floor) => {
    let result = allareagrouping
      .filter((d) => d.branch === branch && d.floor === floor)
      .map((data) => data.area);
    let ji = [].concat(...result);
    let jiii = ji.map((data) => data);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreasEdit(all);
  };

  const fetchLocationEdit = async (branch, floor, area) => {
    let result = alllocationgrouping
      .filter(
        (d) => d.branch === branch && d.floor === floor && d.area === area
      )
      .map((data) => data.location);
    let ji = [].concat(...result);
    let jiii = ji.map((data) => data);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setLocationsEdit(all);
  };

  const fetchServiceNumberEdit = async (branch, floor, area) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTEREBSERVICEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: branch,
        floor: floor,
        area: area,
      });
      setserviceNumberEdit(
        res_type?.data?.ebservicemasters?.length > 0
          ? res_type?.data?.ebservicemasters[0]?.servicenumber
          : ""
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchUnitCalculationEdit = async (e) => {
    try {
      let res_type = await axios.get(SERVICE.MANAGEMATERIAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.managematerials.find(
        (d) => d.materialname === e
      );
      setUnitCalculationEdit(result ? result.totalminutes : 0);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchMaterialNameEdit = async (
    company,
    branch,
    unit,
    floor,
    area,
    location
  ) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
        unit: unit,
        floor: floor,
        area: area,
      });

      let result =
        locationsEdit.length === location.length
          ? res_type.data.assetdetails.filter(
            (d) =>
              d.company === company &&
              d.branch === branch &&
              d.unit === unit &&
              d.floor === floor &&
              d.area === area &&
              d.ebusage === "Yes"
          )
          : res_type.data.assetdetails.filter(
            (d) =>
              d.company === company &&
              d.branch === branch &&
              d.unit === unit &&
              d.floor === floor &&
              d.area === area &&
              d.ebusage === "Yes" &&
              (location.includes(d.location) || d.location === "ALL")
          );

      let answer = result.map((data) => data.material);
      let uniqueArray = [...new Set(answer)];
      setMaterialNamesEdit(
        uniqueArray.map((data) => ({
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchQantityEdit = async (
    company,
    branch,
    unit,
    floor,
    area,
    location,
    e
  ) => {
    setPageName(!pageName)
    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
        unit: unit,
        floor: floor,
        area: area,
      });
      let result = res_type.data.assetdetails
        .filter(
          (d) =>
            d.company === company &&
            d.branch === branch &&
            d.unit === unit &&
            d.floor === floor &&
            d.area === area &&
            d.ebusage === "Yes" &&
            (location.includes(d.location) || d.location === "ALL") &&
            d.material === e
        )
        ?.map((item) => item.countquantity);

      let answerr =
        result.length > 0
          ? result.reduce((cur, acc) => Number(cur) + Number(acc))
          : 0;

      setQuantityEdit(answerr);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
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
    servicenumber: true,
    date: true,
    fromtime: true,
    totime: true,
    hours: true,
    totalunitconsumed: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [deleteRound, setDeleteRound] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteRound(res?.data?.sebmaterialdetails);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Roundsid = deleteRound?._id;
  const delRound = async () => {
    setPageName(!pageName)
    try {
      if (Roundsid) {
        await axios.delete(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${Roundsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchRoundmaster();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delRoundcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${item}`, {
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

      await fetchRoundmaster();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // /create alert for same name
  let todoCheck =
    todoscheck?.length > 0
      ? todoscheck?.some(
        (d) =>
          d.label &&
          d.label?.toLowerCase() === newTodoLabelcheck?.toLowerCase()
      )
        ? true
        : false
      : false;
  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(
        SERVICE.EBMATERIALDETAILS_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(ebmaterialusage.company),
          branch: String(ebmaterialusage.branch),
          unit: String(ebmaterialusage.unit),
          floor: String(ebmaterialusage.floor),
          location: [...valueCate],
          area: String(ebmaterialusage.area),
          materialname: String(ebmaterialusage.materialname),
          servicenumber: serviceNumber,
          date: String(ebmaterialusage.date),
          fromtime: String(ebmaterialusage.fromtime),
          totime: String(ebmaterialusage.totime),
          usageqty: Number(ebmaterialusage.usageqty),
          hours: String(ebmaterialusage.hours),
          assettype: String(ebmaterialusage.assettype),
          assethead: String(ebmaterialusage.assethead),
          quantity: quantity,
          ebtodos: [...todoscheck],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchRoundmaster();
      setEbmaterialusage({
        ...ebmaterialusage,
        quantity: "",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        materialname: "Please Select Material Name",
        fromtime: "",
        totime: "",
        usageqty: "",
        hours: "",
        totalunitconsumed: "",
        totalunitcalculation: "",
      });
      setTodoscheck([]);
      setQuantity("");
      setserviceNumber("");

      setFloors([]);
      setAreas([]);
      setLocations([]);
      setMaterialNames([]);
      setSelectedOptionsCate([]);
      setValueCate([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    let locations = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = roundmasters?.some(
      (item) =>
        item.company?.toLowerCase() ===
        ebmaterialusage.company?.toLowerCase() &&
        item.branch?.toLowerCase() === ebmaterialusage.branch?.toLowerCase() &&
        item.unit?.toLowerCase() === ebmaterialusage.unit?.toLowerCase() &&
        item.floor?.toLowerCase() === ebmaterialusage.floor?.toLowerCase() &&
        item.area?.toLowerCase() === ebmaterialusage.area?.toLowerCase() &&
        item.materialname?.toLowerCase() ===
        ebmaterialusage.materialname?.toLowerCase() &&
        item.location.some((data) => locations.includes(data))
    );

    if (ebmaterialusage.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusage.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusage.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusage.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusage.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusage.fromtime === "") {
      setPopupContentMalert("Please Select From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoscheck.length === 0) {
      setPopupContentMalert("Please Add The Todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert(
        "This Company,Branch,Unit,Floor,Area,Location,Material already exits!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setEbmaterialusage({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      materialname: "Please Select Material Name",
      assettype: "Please Select Asset Type",
      assethead: "Please Select Asset Head",
      quantity: "",
      date: today,
      fromtime: "",
      totime: "",
      usageqty: "",
      hours: "",
      totalunitconsumed: "",
      totalunitcalculation: "",
    });
    setQuantity("");
    setserviceNumber("");

    setFloors([]);
    setAreas([]);
    setLocations([]);
    setMaterialNames([]);
    setSelectedOptionsCate([]);
    setTodoscheck([]);
    setTodoscheckedit([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [calculationvalue, setcalculationvalue] = useState(0);
  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbmaterialusageEdit({
        ...res?.data?.sebmaterialdetails,
        totime: "",
        materialname: "",
        usageqty: "",
      });
      setserviceNumberEdit(res?.data?.sebmaterialdetails.servicenumber);
      setTodoscheckedit(res?.data?.sebmaterialdetails.ebtodos);
      fetchFloor(res?.data?.sebmaterialdetails);
      fetchAreaEdit(
        res.data.sebmaterialdetails.branch,
        res.data.sebmaterialdetails.floor
      );
      fetchLocationEdit(
        res.data.sebmaterialdetails.branch,
        res.data.sebmaterialdetails.floor,
        res.data.sebmaterialdetails.area
      );
      fetchServiceNumberEdit(
        res.data.sebmaterialdetails.branch,
        res.data.sebmaterialdetails.floor,
        res.data.sebmaterialdetails.area
      );
      fetchMaterialNameEdit(
        res.data.sebmaterialdetails.company,
        res.data.sebmaterialdetails.branch,
        res.data.sebmaterialdetails.unit,
        res.data.sebmaterialdetails.floor,
        res.data.sebmaterialdetails.area,
        res.data.sebmaterialdetails.location
      );
      setSelectedOptionsCateEdit(
        res?.data?.sebmaterialdetails.location.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setcalculationvalue(res?.data?.sebmaterialdetails?.totalunitconsumed);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbmaterialusageEdit(res?.data?.sebmaterialdetails);
      setTodoscheckedit(res?.data?.sebmaterialdetails.ebtodos);
      fetchQantityEdit(
        res?.data?.sebmaterialdetails?.company,
        res?.data?.sebmaterialdetails?.branch,
        res?.data?.sebmaterialdetails?.unit,
        res?.data?.sebmaterialdetails?.floor,
        res?.data?.sebmaterialdetails?.area,
        res?.data?.sebmaterialdetails?.location,
        res?.data?.sebmaterialdetails?.materialname
      );
      setQuantityEdit(res?.data?.sebmaterialdetails.quantity);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EBMATERIALDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbmaterialusageEdit(res?.data?.sebmaterialdetails);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = ebmaterialusageEdit?.updatedby;
  let addedby = ebmaterialusageEdit?.addedby;
  let subprojectsid = ebmaterialusageEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    let employ = selectedOptionsCateEdit.map((item) => item.value);
    try {
      let res = await axios.put(
        `${SERVICE.EBMATERIALDETAILS_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(ebmaterialusageEdit.company),
          branch: String(ebmaterialusageEdit.branch),
          unit: String(ebmaterialusageEdit.unit),
          floor: String(ebmaterialusageEdit.floor),
          location: [...employ],
          area: String(ebmaterialusageEdit.area),
          materialname: String(ebmaterialusageEdit.materialname),
          servicenumber: serviceNumberEdit,
          date: String(ebmaterialusageEdit.date),
          fromtime: String(ebmaterialusageEdit.fromtime),
          totime: String(ebmaterialusageEdit.totime),
          usageqty: Number(ebmaterialusageEdit.usageqty),
          hours: totalmins,
          quantity: quantityEdit,
          ebtodos: [...todoscheckedit],
          totalunitconsumed: calculationvalue
            ? Math.round(calculationvalue)
            : "",
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchRoundmaster();
      await fetchRoundmasterAll();
      handleCloseModEdit();
      handleCloseModEditEndTime();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchRoundmasterAll();
    let locationsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allEbmaterialusageedit?.some(
      (item) =>
        item.company?.toLowerCase() ===
        ebmaterialusageEdit.company?.toLowerCase() &&
        item.branch?.toLowerCase() ===
        ebmaterialusageEdit.branch?.toLowerCase() &&
        item.unit?.toLowerCase() === ebmaterialusageEdit.unit?.toLowerCase() &&
        item.floor?.toLowerCase() ===
        ebmaterialusageEdit.floor?.toLowerCase() &&
        item.area?.toLowerCase() === ebmaterialusageEdit.area?.toLowerCase() &&
        item.materialname?.toLowerCase() ===
        ebmaterialusageEdit.materialname?.toLowerCase() &&
        item.location.some((data) => locationsEditt.includes(data))
    );

    if (ebmaterialusageEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusageEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusageEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusageEdit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusageEdit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebmaterialusageEdit.fromtime === "") {
      setPopupContentMalert("Please Select From Time!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoscheckedit.length === 0) {
      setPopupContentMalert("Please Add The Todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert(
        "This Company,Branch,Unit,Floor,Area,Location,Material already exits!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchRoundmaster = async () => {

    const accessmodule = [];

    isAssignBranch.map((data) => {
      let fetfinalurl = [];

      if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
        fetfinalurl = data.subpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0) {
        fetfinalurl = data.mainpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      }
      accessmodule.push(fetfinalurl);
    });

    const uniqueValues = [...new Set(accessmodule.flat())];

    if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {

      try {
        let res_vendor = await axios.post(SERVICE.EBMATERIALDETAILS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,
        });
        setEbmaterialusagecheck(true);
        let val = res_vendor?.data?.ebmaterialdetails?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          servicenumber: item.servicenumber,
          date: moment(item.date).format("DD-MM-YYYY"),
          fromtime: item.fromtime,
          totime: item.totime,
          hours: item.hours,
          totalunitconsumed: item.totalunitconsumed
            ? Math.round(item.totalunitconsumed)
            : "",
        }))
          ? res_vendor?.data?.ebmaterialdetails?.map((item, index) => ({
            ...item,
            id: item._id,
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            servicenumber: item.servicenumber,
            date: moment(item.date).format("DD-MM-YYYY"),
            fromtime: item.fromtime,
            totime: item.totime,
            hours: item.hours,
            totalunitconsumed: item.totalunitconsumed
              ? Math.round(item.totalunitconsumed)
              : "",
          }))
          : [];
        setRoundmasters(val);
      } catch (err) {
        setEbmaterialusagecheck(true);
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
    else {
      setEbmaterialusagecheck(true)
      setRoundmasters([]);
    }
  }

  //get all Sub vendormasters.
  const fetchRoundmasterAll = async () => {
    try {
      let res_meet = await axios.post(SERVICE.EBMATERIALDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setAllEbmaterialusageedit(
        res_meet?.data?.ebmaterialdetails.filter(
          (item) => item._id !== ebmaterialusageEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EB Material Usage Details",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchRoundmaster();
    fetchRoundmasterAll();
  }, []);

  useEffect(() => {
    fetchRoundmasterAll();
  }, [isEditOpen, ebmaterialusageEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(roundmasters);
  }, [roundmasters]);

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
      width: 80,
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
    // { field: "materialname", headerName: "Material", flex: 0, width: 100, hide: !columnVisibility.materialname, headerClassName: "bold-header" },
    {
      field: "servicenumber",
      headerName: "Service Number",
      flex: 0,
      width: 100,
      hide: !columnVisibility.servicenumber,
      headerClassName: "bold-header",
    },
    // { field: "quantity", headerName: "Qty", flex: 0, width: 100, hide: !columnVisibility.quantity, headerClassName: "bold-header" },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "fromtime",
      headerName: "From Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.fromtime,
      headerClassName: "bold-header",
    },
    {
      field: "totime",
      headerName: "To Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totime,
      headerClassName: "bold-header",
    },
    // { field: "usageqty", headerName: "Usage Qty", flex: 0, width: 100, hide: !columnVisibility.usageqty, headerClassName: "bold-header" },
    {
      field: "hours",
      headerName: "Total Minute",
      flex: 0,
      width: 100,
      hide: !columnVisibility.hours,
      headerClassName: "bold-header",
    },
    {
      field: "totalunitconsumed",
      headerName: "Total Unit Consumed",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totalunitconsumed,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 450,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eebmaterialusagedetails") &&
            (params.data.totime ? (
              ""
            ) : (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenEditEndTime();
                  getCode(params.data.id);
                }}
              >
                End Time
              </Button>
            ))}
          {isUserRoleCompare?.includes("eebmaterialusagedetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("debmaterialusagedetails") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vebmaterialusagedetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iebmaterialusagedetails") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location.join(",").toString(),
      servicenumber: item.servicenumber,
      date: item.date,
      fromtime: item.fromtime,
      totime: item.totime,
      hours: item.hours,
      totalunitconsumed: item.totalunitconsumed
        ? Math.round(item.totalunitconsumed)
        : "",
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

  const [totalmins, setTotalmins] = useState("");

  const calculateTimeDifference = (fromTime, toTime) => {
    const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
    const [toHours, toMinutes] = toTime.split(":").map(Number);

    let totalMinutes =
      toHours * 60 + toMinutes - (fromHours * 60 + fromMinutes);
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours in minutes
    }

    setTotalmins(`${String(totalMinutes)} Minutes`);
    handleToTimeChangeEditnew(totalMinutes);

    return `${String(totalMinutes)} Minutes`;
  };

  const calculateDeleteTimeDifference = (fromTime, toTime, materialtodos) => {
    const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
    const [toHours, toMinutes] = toTime.split(":").map(Number);

    let totalMinutes =
      toHours * 60 + toMinutes - (fromHours * 60 + fromMinutes);
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours in minutes
    }

    setTotalmins(`${String(totalMinutes)} Minutes`);
    handleToTimeChangeDeletenew(totalMinutes, materialtodos);

    return `${String(totalMinutes)} Minutes`;
  };

  const calculateAddTimeDifference = (fromTime, toTime, materialtodos) => {
    const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
    const [toHours, toMinutes] = toTime.split(":").map(Number);

    // Calculate the total minutes difference
    let totalMinutes =
      toHours * 60 + toMinutes - (fromHours * 60 + fromMinutes);

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours in minutes
    }
    setTotalmins(`${String(totalMinutes)} Minutes`);
    handleToTimeChangeAddnew(totalMinutes, materialtodos);

    return `${String(totalMinutes)} Minutes`;
  };
  const handleFromTimeChange = (e) => {
    const newFromTime = e.target.value;
    const newHours = calculateTimeDifference(
      newFromTime,
      ebmaterialusage.totime
    );

    setEbmaterialusage({
      ...ebmaterialusage,
      fromtime: newFromTime,
      hours: ebmaterialusage.totime ? newHours : "",
    });
  };
  const handleFromTimeChangeEdit = (e) => {
    const newFromTime = e.target.value;
    const newHours = calculateTimeDifference(
      newFromTime,
      ebmaterialusageEdit.totime
    );

    setEbmaterialusageEdit({
      ...ebmaterialusageEdit,
      fromtime: newFromTime,
      hours: ebmaterialusageEdit.totime ? newHours : "",
    });
  };

  const handleToTimeChangeEdit = (e) => {
    const newToTime = e;
    const newHours = calculateTimeDifference(
      ebmaterialusageEdit.fromtime,
      newToTime
    );

    setEbmaterialusageEdit({
      ...ebmaterialusageEdit,
      totime: newToTime,
      hours: ebmaterialusageEdit.totime ? newHours : "",
    });
  };

  const handleToTimeChangeEditnew = (e) => {
    const rr = todoscheckedit?.reduce(
      (acc, cur) => acc + Number(cur.totalunitcalculation),
      0
    );

    const totalunitconsumed = Number(rr) * Number(e);

    setcalculationvalue(totalunitconsumed);
  };

  const handleToTimeChangeDeletenew = (e, materialtodos) => {
    const rr = materialtodos?.reduce(
      (acc, cur) => acc + Number(cur.totalunitcalculation),
      0
    );

    const totalunitconsumed = Number(rr) * Number(e);

    setcalculationvalue(totalunitconsumed);
  };

  const handleToTimeChangeAddnew = (e, materialtodos) => {
    let result = [...todoscheckedit, materialtodos];

    const rr = result?.reduce(
      (acc, cur) => acc + Number(cur.totalunitcalculation),
      0
    );

    const totalunitconsumed = Number(rr) * Number(e);

    setcalculationvalue(totalunitconsumed);
  };

  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <Headtitle title={"EB Material Usage Details"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Manage EB Material Usage Details
      </Typography> */}
      <PageHeading
        title=" Manage EB Material Usage Details"
        modulename="EB"
        submodulename="EB Material Usage Details"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aebmaterialusagedetails") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    ADD EB Material Usage Details
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
                      isDisabled={todoscheck != ""}
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
                      styles={colourStyles}
                      value={{
                        label: ebmaterialusage.company,
                        value: ebmaterialusage.company,
                      }}
                      onChange={(e) => {
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          materialname: "Please Select Material Name",
                        });
                        setFloors([]);
                        setAreas([]);
                        setLocations([]);
                        setSelectedOptionsCate([]);
                        setMaterialNames([]);
                        setQuantity("");
                        setserviceNumber("");
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
                      isDisabled={todoscheck != ""}
                      options={accessbranch
                        ?.filter(
                          (comp) => ebmaterialusage.company === comp.company
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
                      styles={colourStyles}
                      value={{
                        label: ebmaterialusage.branch,
                        value: ebmaterialusage.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          materialname: "Please Select Material Name",
                        });
                        setFloors([]);
                        setAreas([]);
                        setLocations([]);
                        setSelectedOptionsCate([]);
                        setMaterialNames([]);
                        setQuantity("");
                        setserviceNumber("");
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
                      isDisabled={todoscheck != ""}
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            ebmaterialusage.company === comp.company &&
                            ebmaterialusage.branch === comp.branch
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: ebmaterialusage.unit,
                        value: ebmaterialusage.unit,
                      }}
                      onChange={(e) => {
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          unit: e.value,
                          area: "Please Select Area",
                          location: "Please Select Location",
                          materialname: "Please Select Material Name",
                        });
                        setAreas([]);
                        setLocations([]);
                        setSelectedOptionsCate([]);
                        setMaterialNames([]);
                        setQuantity("");
                        setserviceNumber("");
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
                      isDisabled={todoscheck != ""}
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: ebmaterialusage.floor,
                        value: ebmaterialusage.floor,
                      }}
                      onChange={(e) => {
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          floor: e.value,
                          area: "Please Select Area",
                          location: "Please Select Location",
                          materialname: "Please Select Material Name",
                        });
                        setAreas([]);
                        setLocations([]);
                        setSelectedOptionsCate([]);
                        setMaterialNames([]);
                        setQuantity("");
                        setserviceNumber("");
                        fetchArea(e);
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
                      isDisabled={todoscheck != ""}
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: ebmaterialusage.area,
                        value: ebmaterialusage.area,
                      }}
                      onChange={(e) => {
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          area: e.value,
                          location: "Please Select Location",
                          materialname: "Please Select Material Name",
                        });
                        setLocations([]);
                        setSelectedOptionsCate([]);
                        setMaterialNames([]);
                        setQuantity("");
                        setserviceNumber("");
                        fetchLocation(e.value);
                        fetchServiceNumber(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      disabled={todoscheck.length > 0}
                      options={locations}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Location"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Service Number </Typography>
                    <OutlinedInput
                      disabled={todoscheck != ""}
                      id="component-outlined"
                      type="text"
                      value={serviceNumber}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Date </Typography>
                    <OutlinedInput
                      disabled={todoscheck != ""}
                      id="component-outlined"
                      type="date"
                      value={ebmaterialusage.date}
                      onChange={(e) => {
                        setEbmaterialusage({
                          ...ebmaterialusage,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      From Time <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      disabled={todoscheck != ""}
                      id="component-outlined"
                      type="time"
                      placeholder="HH:MM"
                      value={ebmaterialusage.fromtime}
                      onChange={handleFromTimeChange}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <>
                  <br />

                  <Grid container spacing={1}>
                    <Grid container spacing={2}>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Material Name<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={materialNames}
                            styles={colourStyles}
                            value={{
                              label: ebmaterialusage.materialname,
                              value: ebmaterialusage.materialname,
                            }}
                            onChange={(e) => {
                              setEbmaterialusage({
                                ...ebmaterialusage,
                                materialname: e.value,
                                quantity: "",
                                usageqty: "",
                                totalunitcalculation: "",
                              });
                              settodototal("");

                              fetchQantity(e.value);
                              fetchUnitCalculation(e.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Qty </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            value={quantity}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Usage Qty </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            value={ebmaterialusage.usageqty}
                            onChange={(e) => {
                              settodototal(
                                Number(unitCalculation) * Number(e.target.value)
                              );

                              setEbmaterialusage({
                                ...ebmaterialusage,
                                usageqty: e.target.value,
                                totalunitcalculation: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Unit Calculate </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            value={todototal}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={2} sm={1} xs={1} marginTop={3}>
                        {todoCheck ? (
                          ""
                        ) : (
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                            }}
                            onClick={() => {
                              handleCreateTodocheck();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <br /> <br />
                  </Grid>

                  <br />
                  <br />
                  <Box>
                    {todoscheck.map((todo, index) => (
                      <div key={index}>
                        {editingIndexcheck === index ? (
                          <Grid container spacing={1}>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  minWidth: "20px",
                                  minHeight: "41px",
                                  background: "transparent",
                                  boxShadow: "none",
                                  marginTop: "-3px !important",
                                  "&:hover": {
                                    background: "#f4f4f4",
                                    borderRadius: "50%",
                                    minHeight: "41px",
                                    minWidth: "20px",
                                    boxShadow: "none",
                                  },
                                }}
                                onClick={() => setEditingIndexcheck(-1)}
                              >
                                <CancelIcon
                                  style={{
                                    color: "#b92525",
                                    fontSize: "1.5rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={2}>
                            <Grid item md={2} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.materialname}
                              </Typography>
                            </Grid>
                            <Grid item md={1.5} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.quantity}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.usageqty}
                              </Typography>
                            </Grid>
                            <Grid item md={1} sm={3} xs={3}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-all",
                                }}
                              >
                                {todo.totalunitcalculation}
                              </Typography>
                            </Grid>

                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  minWidth: "20px",
                                  minHeight: "41px",
                                  background: "transparent",
                                  boxShadow: "none",
                                  marginTop: "-13px !important",
                                  "&:hover": {
                                    background: "#f4f4f4",
                                    borderRadius: "50%",
                                    minHeight: "41px",
                                    minWidth: "20px",
                                    boxShadow: "none",
                                  },
                                }}
                                onClick={() => handleDeleteTodocheck(index)}
                              >
                                <DeleteIcon
                                  style={{
                                    color: "#b92525",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                        <br />
                      </div>
                    ))}
                  </Box>
                </>
              </Grid>
              <br />
              <Grid container spacing={2}></Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            marginTop: "80px"
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit EB Material Usage Details
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
                        isDisabled={todoscheckedit != ""}
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
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
                        styles={colourStyles}
                        value={{
                          label: ebmaterialusageEdit.company,
                          value: ebmaterialusageEdit.company,
                        }}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });

                          setAreasEdit([]);
                          setLocationsEdit([]);
                          setMaterialNamesEdit([]);
                          setLocationsEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setQuantityEdit("");
                          setserviceNumberEdit("");
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
                        isDisabled={todoscheckedit != ""}
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              ebmaterialusageEdit.company === comp.company
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
                        styles={colourStyles}
                        value={{
                          label: ebmaterialusageEdit.branch,
                          value: ebmaterialusageEdit.branch,
                        }}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            branch: e.value,
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          setFloorsEdit([]);
                          setAreasEdit([]);
                          setLocationsEdit([]);
                          setMaterialNamesEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setQuantityEdit("");
                          setserviceNumberEdit("");
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
                        isDisabled={todoscheckedit != ""}
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              ebmaterialusageEdit.company === comp.company &&
                              ebmaterialusageEdit.branch === comp.branch
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
                        styles={colourStyles}
                        value={{
                          label: ebmaterialusageEdit.unit,
                          value: ebmaterialusageEdit.unit,
                        }}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            unit: e.value,
                            area: "Please Select Area",
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          setAreasEdit([]);
                          setLocationsEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setMaterialNamesEdit([]);
                          setQuantityEdit("");
                          setserviceNumberEdit("");
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
                        isDisabled={todoscheckedit != ""}
                        options={floorsEdit}
                        styles={colourStyles}
                        value={{
                          label: ebmaterialusageEdit.floor,
                          value: ebmaterialusageEdit.floor,
                        }}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            floor: e.value,
                            area: "Please Select Area",
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          fetchAreaEdit(ebmaterialusageEdit.branch, e.value);
                          setAreasEdit([]);
                          setLocationsEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setMaterialNamesEdit([]);
                          setQuantityEdit("");
                          setserviceNumberEdit("");
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
                        isDisabled={todoscheckedit != ""}
                        options={areasEdit}
                        styles={colourStyles}
                        value={{
                          label: ebmaterialusageEdit.area,
                          value: ebmaterialusageEdit.area,
                        }}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            area: e.value,
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          fetchLocationEdit(
                            ebmaterialusageEdit.branch,
                            ebmaterialusageEdit.floor,
                            e.value
                          );
                          fetchServiceNumberEdit(
                            ebmaterialusageEdit.branch,
                            ebmaterialusageEdit.floor,
                            e.value
                          );
                          setLocationsEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setMaterialNamesEdit([]);
                          setQuantityEdit("");
                          setserviceNumberEdit("");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Location <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        disabled={todoscheckedit.length > 0}
                        className="custom-multi-select"
                        id="component-outlined"
                        options={locationsEdit}
                        value={selectedOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Location"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Service Number </Typography>
                      <OutlinedInput
                        disabled={todoscheckedit != ""}
                        id="component-outlined"
                        type="text"
                        value={serviceNumberEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date </Typography>
                      <OutlinedInput
                        disabled={todoscheckedit != ""}
                        id="component-outlined"
                        type="date"
                        value={ebmaterialusageEdit.date}
                        onChange={(e) => {
                          setEbmaterialusageEdit({
                            ...ebmaterialusageEdit,
                            date: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        From Time <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        disabled={todoscheckedit != ""}
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM"
                        value={ebmaterialusageEdit.fromtime}
                        onChange={handleFromTimeChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Time </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM"
                        value={ebmaterialusageEdit.totime}
                        onChange={(e) => handleToTimeChangeEdit(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Minute </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        readOnly
                        value={totalmins}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <Grid item md={12} xs={12} sm={12}>
                  <>
                    <br />

                    <Grid container spacing={1}>
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Material Name<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={materialNamesEdit}
                              styles={colourStyles}
                              value={{
                                label: ebmaterialusageEdit?.materialname,
                                value: ebmaterialusageEdit?.materialname,
                              }}
                              onChange={(e) => {
                                setEbmaterialusageEdit({
                                  ...ebmaterialusageEdit,
                                  materialname: e.value,
                                  usageqty: "",
                                  totalunitcalculation: "",
                                });
                                settodototalEdit("");
                                fetchQantityEdit(
                                  ebmaterialusageEdit.company,
                                  ebmaterialusageEdit.branch,
                                  ebmaterialusageEdit.unit,
                                  ebmaterialusageEdit.floor,
                                  ebmaterialusageEdit.area,
                                  ebmaterialusageEdit.location,
                                  e.value
                                );
                                fetchUnitCalculationEdit(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Qty </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={quantityEdit}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Usage Qty </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={ebmaterialusageEdit.usageqty}
                              onChange={(e) => {
                                settodototalEdit(
                                  Number(unitCalculationEdit) *
                                  Number(e.target.value)
                                );
                                setEbmaterialusageEdit({
                                  ...ebmaterialusageEdit,
                                  usageqty: e.target.value,
                                  totalunitcalculation: "",
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Unit Calculate </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={todototalEdit}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={2} sm={1} xs={1} marginTop={3}>
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                            }}
                            onClick={() => {
                              handleCreateTodocheckedit();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                          {/* )} */}
                        </Grid>
                      </Grid>
                      <br /> <br />
                    </Grid>

                    <br />
                    <br />
                    <Box>
                      {todoscheckedit.map((todo, index) => (
                        <div key={index}>
                          {editingIndexcheckedit === index ? (
                            <Grid container spacing={1}>
                              <Grid item md={1} sm={1} xs={1}>
                                <Button
                                  variant="contained"
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "-3px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() => setEditingIndexcheckedit(-1)}
                                >
                                  <CancelIcon
                                    style={{
                                      color: "#b92525",
                                      fontSize: "1.5rem",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.materialname}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.quantity}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.usageqty}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.totalunitcalculation}
                                </Typography>
                              </Grid>

                              <Grid item md={1} sm={1} xs={1}>
                                <Button
                                  variant="contained"
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "-13px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() =>
                                    handleDeleteTodocheckedit(index)
                                  }
                                >
                                  <DeleteIcon
                                    style={{
                                      color: "#b92525",
                                      fontSize: "1.2rem",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          <br />
                        </div>
                      ))}
                    </Box>
                  </>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Total unitconsumed </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          calculationvalue ? Math.round(calculationvalue) : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <br />
                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      {/* this is End Time Popup details */}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpenEndtime}
          onClose={handleCloseModEditEndTime}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit End Time Usage
                    </Typography>
                  </Grid>
                </Grid>
                <br />

                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        From Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        disabled={todoscheckedit != ""}
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM"
                        value={ebmaterialusageEdit.fromtime}
                        onChange={handleFromTimeChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Time </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM"
                        value={ebmaterialusageEdit.totime}
                        onChange={(e) => handleToTimeChangeEdit(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Total Minute </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        readOnly
                        value={totalmins}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <Grid item md={12} xs={12} sm={12}>
                  <>
                    <br />

                    <Grid container spacing={1}>
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Material Name<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={materialNamesEdit}
                              styles={colourStyles}
                              value={{
                                label: ebmaterialusageEdit?.materialname,
                                value: ebmaterialusageEdit?.materialname,
                              }}
                              onChange={(e) => {
                                setEbmaterialusageEdit({
                                  ...ebmaterialusageEdit,
                                  materialname: e.value,
                                  usageqty: "",
                                  totalunitcalculation: "",
                                });
                                setTotalmins("");
                                fetchQantityEdit(
                                  ebmaterialusageEdit.company,
                                  ebmaterialusageEdit.branch,
                                  ebmaterialusageEdit.unit,
                                  ebmaterialusageEdit.floor,
                                  ebmaterialusageEdit.area,
                                  ebmaterialusageEdit.location,
                                  e.value
                                );
                                fetchUnitCalculationEdit(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Qty </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={quantityEdit}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Usage Qty </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={ebmaterialusageEdit.usageqty}
                              onChange={(e) => {
                                settodototalEdit(
                                  Number(unitCalculationEdit) *
                                  Number(e.target.value)
                                );
                                setEbmaterialusageEdit({
                                  ...ebmaterialusageEdit,
                                  usageqty: e.target.value,
                                  totalunitcalculation: "",
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Unit Calculate </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              value={todototalEdit}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={2} sm={1} xs={1} marginTop={3}>
                          {/* {todoscheckedit ? (
                                                    ""
                                                ) : ( */}
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                            }}
                            onClick={() => {
                              handleCreateTodocheckedit();
                            }}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      </Grid>
                      <br /> <br />
                    </Grid>

                    <br />
                    <br />
                    <Box>
                      {todoscheckedit.map((todo, index) => (
                        <div key={index}>
                          {editingIndexcheckedit === index ? (
                            <Grid container spacing={1}>
                              <Grid item md={1} sm={1} xs={1}>
                                <Button
                                  variant="contained"
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "-3px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() => setEditingIndexcheckedit(-1)}
                                >
                                  <CancelIcon
                                    style={{
                                      color: "#b92525",
                                      fontSize: "1.5rem",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              <Grid item md={2} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.materialname}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.quantity}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.usageqty}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={3} xs={3}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {todo.totalunitcalculation}
                                </Typography>
                              </Grid>

                              <Grid item md={1} sm={1} xs={1}>
                                <Button
                                  variant="contained"
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "41px",
                                    background: "transparent",
                                    boxShadow: "none",
                                    marginTop: "-13px !important",
                                    "&:hover": {
                                      background: "#f4f4f4",
                                      borderRadius: "50%",
                                      minHeight: "41px",
                                      minWidth: "20px",
                                      boxShadow: "none",
                                    },
                                  }}
                                  onClick={() =>
                                    handleDeleteTodocheckedit(index)
                                  }
                                >
                                  <DeleteIcon
                                    style={{
                                      color: "#b92525",
                                      fontSize: "1.2rem",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          <br />
                        </div>
                      ))}
                    </Box>
                  </>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Total unitconsumed </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          calculationvalue ? Math.round(calculationvalue) : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <br />
                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseModEditEndTime}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lebmaterialusagedetails") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                EB Material Usage Details List
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
                    <MenuItem value={(roundmasters?.length)}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelebmaterialusagedetails") && (
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

                  {isUserRoleCompare?.includes("csvebmaterialusagedetails") && (
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
                  {isUserRoleCompare?.includes("printebmaterialusagedetails") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfebmaterialusagedetails") && (
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
                  {isUserRoleCompare?.includes("imageebmaterialusagedetails") && (
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
                  maindatas={roundmasters}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={roundmasters}
                />


              </Grid>
            </Grid>
            <br />

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;

            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>&ensp;

            {isUserRoleCompare?.includes("bdebmaterialusagedetails") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}                                    <br />
            <br />
            {!ebmaterialusageCheck ? (
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
                      itemsList={roundmasters}
                    />
                  </>
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ width: "1050px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View EB Material Usage Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{ebmaterialusageEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{ebmaterialusageEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{ebmaterialusageEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{ebmaterialusageEdit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{ebmaterialusageEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{ebmaterialusageEdit.location + ","}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Service Number</Typography>
                  <Typography>{ebmaterialusageEdit.servicenumber}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(ebmaterialusageEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Time</Typography>
                  <Typography>{ebmaterialusageEdit.fromtime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Time</Typography>
                  <Typography>{ebmaterialusageEdit.totime}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Total Minute</Typography>
                  <Typography>{ebmaterialusageEdit.hours}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <>
                <br />

                <Grid container spacing={1}>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Material</Typography>
                        <Typography>
                          {ebmaterialusageEdit.materialname}
                        </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Quantity</Typography>
                        <Typography>{quantityEdit}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Usage Qty</Typography>
                        <Typography>{ebmaterialusageEdit.usageqty}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Unit Calculate</Typography>
                        <Typography>{todototalEdit}</Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br /> <br />
                </Grid>

                <br />
                <br />
                <Box>
                  {todoscheckedit.map((todo, index) => (
                    <div key={index}>
                      {editingIndexcheckedit === index ? (
                        <Grid container spacing={1}></Grid>
                      ) : (
                        <Grid container spacing={2}>
                          <Grid item md={2} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.materialname}
                            </Typography>
                          </Grid>
                          <Grid item md={1} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.quantity}
                            </Typography>
                          </Grid>
                          <Grid item md={1} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.usageqty}
                            </Typography>
                          </Grid>
                          <Grid item md={1} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              sx={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-all",
                              }}
                            >
                              {todo.totalunitcalculation}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                      <br />
                    </div>
                  ))}
                </Box>
              </>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Total Unit Consumed</Typography>
                  <Typography>{calculationvalue}</Typography>
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
          maxWidth="sm"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
              wordBreak: "break-all",
            }}
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
        itemsTwo={roundmasters ?? []}
        filename={"EBMaterialUsageDetails"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="EB Material Usage Details Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delRound}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delRoundcheckbox}
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

export default EBMaterialUsageDetails;
