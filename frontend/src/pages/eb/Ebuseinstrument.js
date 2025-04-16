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
import LoadingButton from "@mui/lab/LoadingButton";
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
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaSearch, FaFilePdf, FaPrint } from "react-icons/fa";
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

function EBUseInstrument() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  const [ebuseInstruments, setEbuseInstruments] = useState([]);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setloadingdeloverall(false);
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
    "Service Number",
    "Material Name",
    "Quantity",
    "Unit/perhour",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "servicenumber",
    "materialname",
    "quantity",
    "unitperhour",
  ];


  //NEW TABLE
  const gridRefTableUserShift = useRef(null);
  const gridRefImageUserShift = useRef(null);

  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(ebuseInstruments);


  const [pageUserShift, setPageUserShift] = useState(1);
  const [pageSizeUserShift, setPageSizeUserShift] = useState(10);
  const [searchQueryUserShift, setSearchQueryUserShift] = useState("");
  const [totalPagesUserShift, setTotalPagesUserShift] = useState(1);


  // Search bar
  const [anchorElSearchUserShift, setAnchorElSearchUserShift] = React.useState(null);
  const handleClickSearchUserShift = (event) => {
    setAnchorElSearchUserShift(event.currentTarget);
  };
  const handleCloseSearchUserShift = () => {
    setAnchorElSearchUserShift(null);
    setSearchQuery("");
  };

  const openSearchUserShift = Boolean(anchorElSearchUserShift);
  const idSearchUserShift = openSearchUserShift ? 'simple-popover' : undefined;

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("EB Use Instrument"),
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



  const [ebview, setEbview] = useState([])

  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [ebuseinstrument, setEbuseinstrument] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    materialname: "Please Select Material Name",
    quantity: "",
    assettype: "Please Select Asset Type",
    assethead: "Please Select Asset Head",
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

  const [floorsFilter, setFloorsFilter] = useState([]);
  const [materialNamesFilter, setMaterialNamesFilter] = useState([]);
  const [serviceNumberFilter, setserviceNumberFilter] = useState([]);
  const [ebuseinstrumentFilter, setEbuseinstrumentFilter] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    floor: "Please Select Floor",
    materialname: "Please Select Material Name",
    servicenumber: "Please Select Service Number",
  });

  const [ebuseinstrumentEdit, setEbuseinstrumentEdit] = useState({
    nameround: "",
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    assettype: "Please Select Asset Type",
    assethead: "Please Select Asset Head",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [allEbuseinstrumentedit, setAllEbuseinstrumnetedit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allfloor,
    allareagrouping,
    alllocationgrouping, buttonStyles,
    pageName, setPageName
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
  const [ebuseinstrumentCheck, setEbuseinstrumentcheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");
  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
    setEbuseinstrument({
      ...ebuseinstrument,
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
  let [valueCateEdit, setValueCateEdit] = useState("");

  const handleCategoryChangeEdit = (options) => {
    setValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsCateEdit(options);
    setEbuseinstrumentEdit({
      ...ebuseinstrumentEdit,
      materialname: "Please Select Material Name",
    });
    setMaterialNamesEdit([]);
    setQuantityEdit("");
    let ans = options.map((a, index) => {
      return a.value;
    });
    fetchMaterialNameEdit(
      ebuseinstrumentEdit.company,
      ebuseinstrumentEdit.branch,
      ebuseinstrumentEdit.unit,
      ebuseinstrumentEdit.floor,
      ebuseinstrumentEdit.area,
      ans
    );
  };

  const customValueRendererCateEdit = (valueCateEdit, _documents) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Location";
  };



  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "EB Use Instrument.png");
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
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);

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
    setFloorsFilter(floorall);
    setFloorsEdit(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
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
  };

  const fetchLocation = async (e) => {
    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === newcheckbranch &&
          d.floor === ebuseinstrument.floor &&
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
    try {
      let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let result = res_type.data.ebservicemasters.find(
        (d) =>
          d.branch === newcheckbranch &&
          d.floor === ebuseinstrument.floor &&
          d.area.includes(e)
      );

      setserviceNumber(result ? result.servicenumber : "");
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
      setUnitCalculation(result ? result.unitperhour : 0);
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
        company: ebuseinstrument.company,
        branch: newcheckbranch,
        unit: ebuseinstrument.unit,
        floor: ebuseinstrument.floor,
        area: ebuseinstrument.area,
      });

      let result =
        locations.length === e.length
          ? res_type.data.assetdetails.filter(
            (d) =>
              d.company === ebuseinstrument.company &&
              d.branch === newcheckbranch &&
              d.unit === ebuseinstrument.unit &&
              d.floor === ebuseinstrument.floor &&
              d.area === ebuseinstrument.area &&
              d.ebusage === "Yes"
          )
          : res_type.data.assetdetails.filter(
            (d) =>
              d.company === ebuseinstrument.company &&
              d.branch === newcheckbranch &&
              d.unit === ebuseinstrument.unit &&
              d.floor === ebuseinstrument.floor &&
              d.area === ebuseinstrument.area &&
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

    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: ebuseinstrument.company,
        branch: newcheckbranch,
        unit: ebuseinstrument.unit,
        floor: ebuseinstrument.floor,
        area: ebuseinstrument.area,
      });
      let result = res_type.data.assetdetails
        .filter(
          (d) =>
            d.company === ebuseinstrument.company &&
            d.branch === newcheckbranch &&
            d.unit === ebuseinstrument.unit &&
            d.floor === ebuseinstrument.floor &&
            d.area === ebuseinstrument.area &&
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
    try {
      let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      let result = res_type.data.ebservicemasters.find(
        (d) => d.branch === branch && d.floor === floor && d.area.includes(area)
      );
      setserviceNumberEdit(result ? result?.servicenumber : "");
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
      setUnitCalculationEdit(result ? result.unitperhour : 0);
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

  const fetchQantityEdit = async (e) => {
    try {
      let res_type = await axios.post(SERVICE.FILTERASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: ebuseinstrumentEdit.company,
        branch: ebuseinstrumentEdit.branch,
        unit: ebuseinstrumentEdit.unit,
        floor: ebuseinstrumentEdit.floor,
        area: ebuseinstrumentEdit.area,
      });

      let result = res_type.data.assetdetails
        .filter(
          (d) =>
            d.company === ebuseinstrumentEdit.company &&
            d.branch === ebuseinstrumentEdit.branch &&
            d.unit === ebuseinstrumentEdit.unit &&
            d.floor === ebuseinstrumentEdit.floor &&
            d.area === ebuseinstrumentEdit.area &&
            d.ebusage === "Yes" &&
            (valueCateEdit.includes(d.location) || d.location === "ALL") &&
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

  const fetchMaterialNameFilter = async (e) => {
    try {
      let res_type = await axios.post(SERVICE.BRANCHFLOORASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: ebuseinstrumentFilter.branch,
        floor: e.value,
      });
      let result = res_type.data.assetdetails.filter(
        (d) => d.branch === ebuseinstrumentFilter.branch && d.floor === e.value
      );
      let answer = result.map((data) => data.material);
      let uniqueArray = [...new Set(answer)];
      setMaterialNamesFilter(
        uniqueArray.map((data) => ({
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchServiceNumberFilter = async (e) => {
    try {
      let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      let result = res_type.data.ebservicemasters.filter(
        (d) => d.branch === ebuseinstrumentFilter.branch && d.floor === e.value
      );
      const all = result.map((d) => ({
        ...d,
        label: d.servicenumber,
        value: d.servicenumber,
      }));
      setserviceNumberFilter(all);
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
    materialname: true,
    quantity: true,
    unitperhour: true,
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
      let res = await axios.get(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteRound(res?.data?.sebuseinstrument);
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
        await axios.delete(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${Roundsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchEbUseInstruments();
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
        return axios.delete(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      setIsHandleChange(false);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchEbUseInstruments();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(
        SERVICE.CREATE_EBUSEINSTRUMENTS,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(ebuseinstrument.company),
          branch: String(ebuseinstrument.branch),
          unit: String(ebuseinstrument.unit),
          floor: String(ebuseinstrument.floor),
          location: [...valueCate],
          area: String(ebuseinstrument.area),
          materialname: String(ebuseinstrument.materialname),
          quantity: quantity,
          servicenumber: serviceNumber,
          unitperhour: Number(quantity) * Number(unitCalculation),
          assettype: String(ebuseinstrument.assettype),
          assethead: String(ebuseinstrument.assethead),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEbUseInstruments();

      // setserviceNumber("");
      // setValueCate([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (ebuseinstrumentFilter.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchFilteredDatas();
    }
  };
  //add function
  const fetchFilteredDatas = async () => {
    setPageName(!pageName)


    try {
      let subprojectscreate = await axios.post(
        SERVICE.CHECK_EBUSE_INSTRUMENTS,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(ebuseinstrumentFilter.company),
          branch:
            String(ebuseinstrumentFilter.branch) === "Please Select Branch"
              ? ""
              : ebuseinstrumentFilter.branch,
          floor:
            String(ebuseinstrumentFilter.floor) === "Please Select Floor"
              ? ""
              : ebuseinstrumentFilter.floor,
          materialname:
            String(ebuseinstrumentFilter.materialname) ===
              "Please Select Material Name"
              ? ""
              : ebuseinstrumentFilter.materialname,
          servicenumber:
            String(ebuseinstrumentFilter.servicenumber) ===
              "Please Select Service Number"
              ? ""
              : ebuseinstrumentFilter.servicenumber,
        }
      );
      setEbuseInstruments(subprojectscreate.data.resulted?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        location: item.location.join(",").toString(),
        id: item._id,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        floor: item.floor,
        area: item.area,
        servicenumber: item.servicenumber,
        materialname: item.materialname,
        quantity: item.quantity,
        unitperhour: item.unitperhour,
      })));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  }


  //Project updateby edit page...
  let updateby = ebuseinstrumentEdit?.updatedby;
  let addedby = ebuseinstrumentEdit?.addedby;

  let subprojectsid = ebuseinstrumentEdit?._id;
  //add function
  const sendRequestEdit = async () => {
    setPageName(!pageName)
    let employ = selectedOptionsCateEdit.map((item) => item.value);

    try {
      let subprojectscreate = await axios.put(
        `${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(ebuseinstrumentEdit.company),
          branch: String(ebuseinstrumentEdit.branch),
          unit: String(ebuseinstrumentEdit.unit),
          floor: String(ebuseinstrumentEdit.floor),
          location: [...employ],
          area: String(ebuseinstrumentEdit.area),
          materialname: String(ebuseinstrumentEdit.materialname),
          quantity: quantityEdit,
          servicenumber: serviceNumberEdit,
          unitperhour: Number(quantityEdit) * Number(unitCalculationEdit),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEbUseInstruments();
      await fetchRoundmasterAll();
      // setEbuseinstrumentEdit({
      //   ...ebuseinstrument,
      //   company: "Please Select Company",
      //   branch: "Please Select Branch",
      //   unit: "Please Select Unit",
      //   floor: "Please Select Floor",
      //   area: "Please Select Area",
      //   location: "Please Select Location",
      //   materialname: "Please Select Material Name",
      // });
      // setQuantityEdit("");
      // setserviceNumberEdit("");
      // setFloorsEdit([]);
      // setAreasEdit([]);
      // setLocationsEdit([]);
      // setMaterialNamesEdit([]);
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // console.log(ebuseInstruments, "ebuseInstruments")
  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    let locations = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = ebuseInstruments.some(
      (item) =>
        item.company === String(ebuseinstrument.company) &&
        item.branch === String(ebuseinstrument.branch) &&
        item.unit === String(ebuseinstrument.unit) &&
        item.area === String(ebuseinstrument.area) &&
        item.materialname === String(ebuseinstrument.materialname) &&
        item.servicenumber === serviceNumber &&
        item.locationold?.some((data) => locations.includes(data))
    );

    e.preventDefault();
    if (ebuseinstrument.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (serviceNumber === "") {
      setPopupContentMalert("Please Enter ServiceNumber!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.materialname === "Please Select Material Name") {
      setPopupContentMalert("Please Select Material Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (quantity != "" && unitCalculation != ""
        ? Number(quantity) * Number(unitCalculation)
        : "") === ""

    ) {
      setPopupContentMalert("Please Enter Unit/Per Hour!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handlesubmitEdit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    let locationsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allEbuseinstrumentedit.some(
      (item) =>
        item.company === String(ebuseinstrumentEdit.company) &&
        item.branch === String(ebuseinstrumentEdit.branch) &&
        item.unit === String(ebuseinstrumentEdit.unit) &&
        item.area === String(ebuseinstrumentEdit.area) &&
        item.materialname === String(ebuseinstrumentEdit.materialname) &&
        item.servicenumber === serviceNumberEdit &&
        item.location.some((data) => locationsEditt.includes(data))
    );

    if (ebuseinstrumentEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrumentEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrumentEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrumentEdit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrumentEdit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (serviceNumberEdit === "") {
      setPopupContentMalert("Please Enter ServiceNumber!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (quantityEdit != "" && unitCalculationEdit != ""
        ? Number(quantityEdit) * Number(unitCalculationEdit)
        : "") === ""
    ) {
      setPopupContentMalert("Please Enter Unit/Per Hou!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ebuseinstrumentEdit.materialname === "Please Select Material Name"
    ) {
      setPopupContentMalert("Please Select Material Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebuseinstrument.unitperhour === "") {
      setPopupContentMalert("Please Enter Unit/Per Hour!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestEdit();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setEbuseinstrument({
      ...ebuseinstrument,
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      materialname: "Please Select Material Name",
      assettype: "Please Select Asset Type",
      assethead: "Please Select Asset Head",
    });
    setQuantity("");
    setserviceNumber("");
    setFloors([]);
    setAreas([]);
    setSelectedOptionsCate([]);
    setLocations([]);
    setMaterialNames([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const handleClearFilter = (e) => {
    e.preventDefault();
    setEbuseinstrumentFilter({
      company: "Please Select Company",
      branch: "Please Select Branch",
      floor: "Please Select Floor",
      materialname: "Please Select Material Name",
      servicenumber: "Please Select Service Number",
    });
    setFloorsFilter([]);
    setMaterialNamesFilter([]);
    setserviceNumberFilter([]);
    fetchEbUseInstruments();
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

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbuseinstrumentEdit(res?.data?.sebuseinstrument);
      setQuantityEdit(res?.data?.sebuseinstrument.quantity);
      fetchUnitCalculationEdit(res?.data?.sebuseinstrument?.materialname);
      fetchFloor(res?.data?.sebuseinstrument);
      fetchAreaEdit(
        res.data.sebuseinstrument.branch,
        res.data.sebuseinstrument.floor
      );
      fetchLocationEdit(
        res.data.sebuseinstrument.branch,
        res.data.sebuseinstrument.floor,
        res.data.sebuseinstrument.area
      );
      fetchServiceNumberEdit(
        res.data.sebuseinstrument.branch,
        res.data.sebuseinstrument.floor,
        res.data.sebuseinstrument.area
      );
      fetchMaterialNameEdit(
        res.data.sebuseinstrument.company,
        res.data.sebuseinstrument.branch,
        res.data.sebuseinstrument.unit,
        res.data.sebuseinstrument.floor,
        res.data.sebuseinstrument.area,
        res.data.sebuseinstrument.location
      );
      setValueCateEdit(res?.data?.sebuseinstrument.location)


      setSelectedOptionsCateEdit(
        res?.data?.sebuseinstrument.location.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbuseinstrumentEdit(res?.data?.sebuseinstrument);
      setEbview(res?.data?.sebuseinstrument);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EBUSEINSTRUMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEbuseinstrumentEdit(res?.data?.sebuseinstrument);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchEbUseInstruments = async () => {
    setPageName(!pageName)
    setEbuseinstrumentcheck(true);

    try {
      let res_vendor = await axios.post(SERVICE.ALL_EBUSEINSTRUMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setEbuseInstruments(res_vendor?.data?.ebuseinstruments?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        location: item.location.join(",").toString(),
        locationold: item.location,
        id: item._id,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        floor: item.floor,
        area: item.area,
        servicenumber: item.servicenumber,
        materialname: item.materialname,
        quantity: item.quantity,
        unitperhour: item.unitperhour,
      })));
      setEbuseinstrumentcheck(false);
    } catch (err) {
      setEbuseinstrumentcheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }


  }

  //get all Sub vendormasters.
  const fetchRoundmasterAll = async () => {
    setPageName(!pageName)
    try {
      let res_meet = await axios.post(SERVICE.ALL_EBUSEINSTRUMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setAllEbuseinstrumnetedit(
        res_meet?.data?.ebuseinstruments.filter(
          (item) => item._id !== ebuseinstrumentEdit._id
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
    documentTitle: "EB Use Instrument",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEbUseInstruments();
  }, []);

  useEffect(() => {
    fetchRoundmasterAll();
  }, [isEditOpen, ebuseinstrumentEdit]);

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
    addSerialNumber(ebuseInstruments);
  }, [ebuseInstruments]);

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
      width: 80,
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
      field: "servicenumber",
      headerName: "Service Number",
      flex: 0,
      width: 100,
      hide: !columnVisibility.servicenumber,
      headerClassName: "bold-header",
    },
    {
      field: "materialname",
      headerName: "Material Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.materialname,
      headerClassName: "bold-header",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0,
      width: 100,
      hide: !columnVisibility.quantity,
      headerClassName: "bold-header",
    },
    {
      field: "unitperhour",
      headerName: "Unit Per Hour",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unitperhour,
      headerClassName: "bold-header",
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eebuseinstrument") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("debuseinstrument") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vebuseinstrument") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iebuseinstrument") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

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
      location: item.location,
      servicenumber: item.servicenumber,
      materialname: item.materialname,
      quantity: item.quantity,
      unitperhour: item.unitperhour,
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



  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <Headtitle title={"EB Use Instrument"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Manage EB Use Instrument
      </Typography> */}
      <PageHeading
        title="EB Use Instrument"
        modulename="EB"
        submodulename="EB Use Instrument"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aebuseinstrument") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add EB Use Instrument
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
                      options={accessbranch ? accessbranch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: ebuseinstrument.company,
                        value: ebuseinstrument.company,
                      }}
                      onChange={(e) => {
                        setEbuseinstrument({
                          ...ebuseinstrument,
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
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) => ebuseinstrument.company === comp.company
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: ebuseinstrument.branch,
                        value: ebuseinstrument.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setEbuseinstrument({
                          ...ebuseinstrument,
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
                      options={accessbranch ? accessbranch
                        ?.filter(
                          (comp) =>
                            ebuseinstrument.company === comp.company &&
                            ebuseinstrument.branch === comp.branch
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
                        }) : []}
                      styles={colourStyles}
                      value={{
                        label: ebuseinstrument.unit,
                        value: ebuseinstrument.unit,
                      }}
                      onChange={(e) => {
                        setEbuseinstrument({
                          ...ebuseinstrument,
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
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: ebuseinstrument.floor,
                        value: ebuseinstrument.floor,
                      }}
                      onChange={(e) => {
                        setEbuseinstrument({
                          ...ebuseinstrument,
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
                        label: ebuseinstrument.area,
                        value: ebuseinstrument.area,
                      }}
                      onChange={(e) => {
                        setEbuseinstrument({
                          ...ebuseinstrument,
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
                    <Typography>
                      Service Number
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={serviceNumber}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialNames}
                      styles={colourStyles}
                      value={{
                        label: ebuseinstrument.materialname,
                        value: ebuseinstrument.materialname,
                      }}
                      onChange={(e) => {
                        setEbuseinstrument({
                          ...ebuseinstrument,
                          materialname: e.value,
                        });
                        fetchUnitCalculation(e.value);
                        fetchQantity(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      (1)-Unit/Per Hour <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        quantity != "" && unitCalculation != ""
                          ? Number(quantity) * Number(unitCalculation)
                          : ""
                      }
                    // value={
                    //   unitCalculation

                    // }
                    />
                  </FormControl>
                </Grid>

                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <LoadingButton
                      onClick={handleSubmit}
                      loading={loadingdeloverall}
                      variant="contained"
                      sx={buttonStyles.buttonsubmit}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Box>
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
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit EB Use Instrument
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
                        options={accessbranch ? accessbranch
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
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: ebuseinstrumentEdit.company,
                          value: ebuseinstrumentEdit.company,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
                            company: e.value,
                            branch: "Please Select Branch",
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
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch ? accessbranch
                          ?.filter(
                            (comp) =>
                              ebuseinstrumentEdit.company === comp.company
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
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: ebuseinstrumentEdit.branch,
                          value: ebuseinstrumentEdit.branch,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
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
                          setSelectedOptionsCateEdit([]);
                          setMaterialNamesEdit([]);
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
                        options={accessbranch ? accessbranch
                          ?.filter(
                            (comp) =>
                              ebuseinstrumentEdit.company === comp.company &&
                              ebuseinstrumentEdit.branch === comp.branch
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
                          }) : []}
                        styles={colourStyles}
                        value={{
                          label: ebuseinstrumentEdit.unit,
                          value: ebuseinstrumentEdit.unit,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
                            unit: e.value,
                            area: "Please Select Area",
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          setAreasEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setLocationsEdit([]);
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
                        options={floorsEdit}
                        styles={colourStyles}
                        value={{
                          label: ebuseinstrumentEdit.floor,
                          value: ebuseinstrumentEdit.floor,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
                            floor: e.value,
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
                          fetchAreaEdit(ebuseinstrumentEdit.branch, e.value);
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
                          label: ebuseinstrumentEdit.area,
                          value: ebuseinstrumentEdit.area,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
                            area: e.value,
                            location: "Please Select Location",
                            materialname: "Please Select Material Name",
                          });
                          setLocationsEdit([]);
                          setMaterialNamesEdit([]);
                          setSelectedOptionsCateEdit([]);
                          setQuantityEdit("");
                          // setserviceNumberEdit("");
                          fetchLocationEdit(
                            ebuseinstrumentEdit.branch,
                            ebuseinstrumentEdit.floor,
                            e.value
                          );
                          fetchServiceNumberEdit(
                            ebuseinstrumentEdit.branch,
                            ebuseinstrumentEdit.floor,
                            e.value
                          );
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
                      <Typography>
                        Service Number <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={serviceNumberEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Material Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={materialNamesEdit}
                        styles={colourStyles}
                        value={{
                          label: ebuseinstrumentEdit?.materialname,
                          value: ebuseinstrumentEdit?.materialname,
                        }}
                        onChange={(e) => {
                          setEbuseinstrumentEdit({
                            ...ebuseinstrumentEdit,
                            materialname: e.value,
                          });

                          fetchQantityEdit(e.value);
                          fetchUnitCalculationEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
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

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        (1)-Unit/Per Hour <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={
                          quantityEdit != "" && unitCalculationEdit != ""
                            ? Number(quantityEdit) * Number(unitCalculationEdit)
                            : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" onClick={handlesubmitEdit} sx={buttonStyles.buttonsubmit}>
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
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lebuseinstrument") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                EB Use Instrument List
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
                    options={accessbranch ? accessbranch
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
                      }) : []}
                    styles={colourStyles}
                    value={{
                      label: ebuseinstrumentFilter.company,
                      value: ebuseinstrumentFilter.company,
                    }}
                    onChange={(e) => {
                      setEbuseinstrumentFilter({
                        ...ebuseinstrumentFilter,
                        company: e.value,
                        branch: "Please Select Branch",
                        floor: "Please Select Floor",
                        materialname: "Please Select Material Name",
                        servicenumber: "Please Select Service Number",
                      });
                      setFloorsFilter([])
                      setMaterialNamesFilter([])
                      setserviceNumberFilter([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <Selects
                    options={accessbranch ? accessbranch
                      ?.filter(
                        (comp) => ebuseinstrumentFilter.company === comp.company
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
                      }) : []}
                    styles={colourStyles}
                    value={{
                      label: ebuseinstrumentFilter.branch,
                      value: ebuseinstrumentFilter.branch,
                    }}
                    onChange={(e) => {
                      setEbuseinstrumentFilter({
                        ...ebuseinstrumentFilter,
                        branch: e.value,
                        floor: "Please Select Floor",
                        materialname: "Please Select Material Name",
                        servicenumber: "Please Select Service Number",
                      });
                      fetchFloor(e);
                      setserviceNumberFilter([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Floor</Typography>
                  <Selects
                    options={floorsFilter}
                    styles={colourStyles}
                    value={{
                      label: ebuseinstrumentFilter.floor,
                      value: ebuseinstrumentFilter.floor,
                    }}
                    onChange={(e) => {
                      setEbuseinstrumentFilter({
                        ...ebuseinstrumentFilter,
                        floor: e.value,
                        materialname: "Please Select Material Name",
                        servicenumber: "Please Select Service Number",
                      });
                      fetchMaterialNameFilter(e);
                      fetchServiceNumberFilter(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Material Name</Typography>
                  <Selects
                    options={materialNamesFilter}
                    styles={colourStyles}
                    value={{
                      label: ebuseinstrumentFilter.materialname,
                      value: ebuseinstrumentFilter.materialname,
                    }}
                    onChange={(e) => {
                      setEbuseinstrumentFilter({
                        ...ebuseinstrumentFilter,
                        materialname: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Service Number</Typography>
                  <Selects
                    options={serviceNumberFilter}
                    styles={colourStyles}
                    value={{
                      label: ebuseinstrumentFilter.servicenumber,
                      value: ebuseinstrumentFilter.servicenumber,
                    }}
                    onChange={(e) => {
                      setEbuseinstrumentFilter({
                        ...ebuseinstrumentFilter,
                        servicenumber: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} xs={12} sm={12} marginTop={3}>
                <Button variant="contained" onClick={handleSubmitFilter}>
                  Filter
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6} marginTop={3}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
                  Clear
                </Button>
              </Grid>
            </Grid>


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
                    <MenuItem value={(ebuseInstruments?.length)}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelebservicemaster") && (
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

                  {isUserRoleCompare?.includes("csvebservicemaster") && (
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
                  {isUserRoleCompare?.includes("printebservicemaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfebservicemaster") && (
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
                  {isUserRoleCompare?.includes("imageebservicemaster") && (
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
              <Grid item md={2} xs={6} sm={6} >
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={ebuseInstruments}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={ebuseInstruments}
                />
              </Grid>
            </Grid>
            <br />

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdebuseinstrument") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}

            <br />
            <br />
            {ebuseinstrumentCheck ? (
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
                      itemsList={ebuseInstruments}
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
      >
        <Box sx={{ overflow: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View EB Use Instrument
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{ebview.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{ebview.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{ebview.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{ebview.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{ebview.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>

                    {ebview.location
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .join(", ")
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Service Number</Typography>
                  <Typography>{ebview.servicenumber}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Material Name</Typography>
                  <Typography>{ebview.materialname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Qty</Typography>
                  <Typography>{ebview.quantity}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">(1)-Unit/Per Hour</Typography>
                  <Typography>{ebview.unitperhour}</Typography>
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
        itemsTwo={ebuseInstruments ?? []}
        filename={"EB Use Instrument"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="EB Use Instrument Info"
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

export default EBUseInstrument;
