import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box, InputAdornment,
  Button,
  TableCell,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
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
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
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
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';


function AssetSpecificationGrouping() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);



  const [assetSpecGrpingArray, setAssetSpecGrpingArray] = useState([]);

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
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ["Asset Material", "Component", "Sub Component"];
  let exportRowValues = ["assetmaterial", "component", "subcomponent"];


  const [selectedRowsAssetSpecificationGrouping, setSelectedRowsAssetSpecificationGrouping] = useState([])
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState({ open: false, data: [] });
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = (data) => {
    setIsErrorOpenpop({ open: true, data: data });
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop({ open: false, data: [] });
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjsub, setOvProjsub] = useState("");
  const [ovProjsubdata, setOvProjsubdata] = useState("");
  const [ovProjcode, setOvProjcode] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({

    assetdetail: [],
    stock: [],
    manualstockentry: [],
  });

  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {

    setisCheckOpenbulk(false);
  };





  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Asset Specification Grouping"),
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
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [assetSpecGrping, setAssetSpecGrping] = useState({
    assetmaterial: "Please Select Asset Material",
    component: "Please Select Component",
    subcomponent: "Please Select Sub Component",
  });
  const [assetSpecGrpingEdit, setAssetSpecGrpingEdit] = useState({
    assetmaterial: "Please Select Asset Material",
    component: "Please Select Component",
    subcomponent: "Please Select Sub Component",
  });
  const [assetSpecGrpingArrayEdit, setAssetSpecGrpingArrayEdit] = useState([]);
  const [assetMaterialOption, setAssetMaterialOption] = useState([]);
  const [assetSpecificationOption, setAssetSpecificationOption] = useState([]);
  const [filteredComponent, setFilteredComponent] = useState([]);
  const [filteredComponentEdit, setFilteredComponentEdit] = useState([]);

  const [filteredSubComponent, setFilteredSubComponent] = useState([]);
  const [filteredSubComponentEdit, setFilteredSubComponentEdit] = useState([]);

  const [typeOption, setTypeOption] = useState([]);
  const [modelOption, setModelOption] = useState([]);
  const [sizeOption, setSizeOption] = useState([]);
  const [variantOption, setVariantOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [capacityOption, setCapacityOption] = useState([]);
  const [panelTypeOption, setPanelTypeOption] = useState([]);
  const [screenResolutionOption, setScreenResolutionOption] = useState([]);
  const [connectivityOption, setConnectivityOption] = useState([]);
  const [dataRateOption, setDataRateOption] = useState([]);
  const [compatibleDevicesOption, setCompatibleDevicesOption] = useState([]);
  const [outputPowerOption, setOutputPowerOption] = useState([]);
  const [coolingFanCountOption, setCoolingFanCountOption] = useState([]);
  const [clockSpeeedOption, setClockSpeedOption] = useState([]);
  const [coreOption, setCoreOption] = useState([]);
  const [speedOption, setSpeedOption] = useState([]);
  const [frequencyOption, setFrequencyOption] = useState([]);
  const [outputOption, setOutputOption] = useState([]);
  const [ethernetPortsOption, setEthernetPortsOption] = useState([]);
  const [distanceOption, setDistanceOption] = useState([]);
  const [lengthOption, setLengthOption] = useState([]);
  const [slotOption, setSlotOption] = useState([]);
  const [noOfChannelsOption, setNoOfChannelsOption] = useState([]);
  const [coloursOption, setColoursOption] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);



  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [
    deleteAssetSpecificationGrouping,
    setDeleteAssetSpecificationGrouping,
  ] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    assetmaterial: true,
    component: true,
    subcomponent: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect


  useEffect(() => {
    fetchAssetSpecificationGroupingAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchAssetSpecificationGrouping();
  }, []);

  useEffect(() => {
    fetchAssetMaterial();
    fetchAssetSpecifications();
    fetchType();
    fetchModel();
    fetchSize();
    fetchVariant();
    fetchBrand();
    fetchCapacity();
    fetchPanelType();
    fetchScreenResolution();
    fetchConnectivity();
    fetchDataRate();
    fetchCompatibleDevices();
    fetchOutputPower();
    fetchCoolingFanCount();
    fetchClockSpeed();
    fetchCore();
    fetchSpeed();
    fetchFrequency();
    fetchOutput();
    fetchEthernetPorts();
    fetchDistance();
    fetchLength();
    fetchSlot();
    fetchNoOfChannels();
    fetchColours();
  }, []);

  useEffect(() => {
    const filteredComponents = assetSpecificationOption
      ?.filter((u) => u.workstation === assetSpecGrping.assetmaterial)
      .map((u) => ({
        ...u,
        label: u.categoryname,
        value: u.categoryname,
      }));

    setFilteredComponent(filteredComponents);
  }, [assetSpecGrping.assetmaterial]);

  useEffect(() => {
    const filteredCComponentedit = assetSpecificationOption
      ?.filter((ue) => ue.workstation === assetSpecGrpingEdit.assetmaterial)
      .map((ue) => ({
        ...ue,
        label: ue.categoryname,
        value: ue.categoryname,
      }));

    setFilteredComponentEdit(filteredCComponentedit);
  }, [assetSpecGrpingEdit.assetmaterial]);

  useEffect(() => {
    const matchingObject = assetSpecificationOption?.find(
      (u) =>
        u.workstation === assetSpecGrping.assetmaterial &&
        u.categoryname === assetSpecGrping.component
    );
    const filteredSubCategories = matchingObject?.subcategoryname?.map((u) => ({
      label: u.subcomponent,
      value: u.subcomponent,
    }));

    setFilteredSubComponent(filteredSubCategories);
  }, [assetSpecGrping.component]);

  useEffect(() => {
    const matchingObject = assetSpecificationOption?.find(
      (u) =>
        u.workstation === assetSpecGrpingEdit.assetmaterial &&
        u.categoryname === assetSpecGrpingEdit.component
    );

    const filteredSubCategories = matchingObject?.subcategoryname?.map((u) => ({
      label: u.subcomponent,
      value: u.subcomponent,
    }));

    setFilteredSubComponentEdit(filteredSubCategories);
  }, [assetSpecGrpingEdit.component]);

  const [subcomponentData, setSubcomponentData] = useState([]);

  useEffect(() => {
    const matchingObjects = assetSpecificationOption.filter(
      (obj) =>
        obj.workstation === assetSpecGrping.assetmaterial &&
        obj.categoryname === assetSpecGrping.component
    );

    if (matchingObjects.length > 0) {
      if (matchingObjects[0].subcategoryname.length > 0) {
        const subcomponent1Object = matchingObjects[0].subcategoryname.find(
          (sub) => sub.subcomponent === assetSpecGrping.subcomponent
        );
        if (subcomponent1Object) {
          setSubcomponentData(subcomponent1Object);
        } else {
          setSubcomponentData([]);
        }
      } else {
        setSubcomponentData(matchingObjects[0]);
      }
    } else {
      setSubcomponentData([]);
    }
  }, [assetSpecGrping.component, assetSpecGrping.subcomponent]);

  const [subcomponentDataEdit, setSubcomponentDataEdit] = useState([]);

  useEffect(() => {
    const matchingObjects = assetSpecificationOption.filter(
      (obj) =>
        obj.workstation === assetSpecGrpingEdit.assetmaterial &&
        obj.categoryname === assetSpecGrpingEdit.component
    );

    if (matchingObjects.length > 0) {
      if (matchingObjects[0].subcategoryname.length > 0) {
        const subcomponent1Object = matchingObjects[0].subcategoryname.find(
          (sub) => sub.subcomponent === assetSpecGrpingEdit.subcomponent
        );
        if (subcomponent1Object) {
          setSubcomponentDataEdit(subcomponent1Object);
        } else {
          setSubcomponentDataEdit([]);
        }
      } else {
        setSubcomponentDataEdit(matchingObjects[0]);
      }
    } else {
      setSubcomponentDataEdit([]);
    }
  }, [assetSpecGrpingEdit.component, assetSpecGrpingEdit.subcomponent]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
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
  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const fetchAssetMaterial = async () => {
    try {
      let res_category = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const assetMaterialall = [
        ...res_category?.data?.assetmaterial.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setAssetMaterialOption(assetMaterialall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAssetSpecifications = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAssetSpecificationOption(res?.data?.assetworkstation);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchType = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.assetspecificationtype?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setTypeOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchModel = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.assetmodel?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setModelOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSize = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSIZE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.assetsize?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setSizeOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchVariant = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETVARIANT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.assetvariant?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setVariantOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchBrand = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_BRANDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.brandmaster?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setBrandOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchCapacity = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETCAPACITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.assetcapacity?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCapacityOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchPanelType = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_PANELTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.paneltype?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setPanelTypeOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchScreenResolution = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_SCREENRESOLUTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.screenresolution?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setScreenResolutionOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchConnectivity = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_CONNECTIVITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.connectivity?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setConnectivityOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchDataRate = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_DATARANGE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.datarange?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setDataRateOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchCompatibleDevices = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_COMPATIBLEDEVICES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.compatibledevices?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCompatibleDevicesOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchOutputPower = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_OUTPUTPOWER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.outputpower?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setOutputPowerOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchCoolingFanCount = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_COOLINGFANCOUNT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.coolingfancount?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCoolingFanCountOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchClockSpeed = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_CLOCKSPEED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.clockspeed?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setClockSpeedOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchCore = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_CORE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.core?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCoreOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSpeed = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_SPEED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.speed?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setSpeedOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchFrequency = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_FREQUENCY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.frequency?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setFrequencyOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchOutput = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_OUTPUT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.output?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setOutputOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchEthernetPorts = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ETHERNETPORTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.ethernetports?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setEthernetPortsOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchDistance = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_DISTANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.distance?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setDistanceOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchLength = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_LENGTH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.lengthname?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setLengthOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSlot = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_SLOT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.slot?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setSlotOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchNoOfChannels = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_NOOFCHANNELS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.noofchannels?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setNoOfChannelsOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchColours = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_COLOURS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alloptions = [
        ...res.data?.colours?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setColoursOption(alloptions);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [checkassetdetail, setCheckAssetdetail] = useState([]);
  const [checkstock, setCheckstock] = useState([]);
  const [checkmanualstock, setCheckmanualstock] = useState([]);




  //set function to get particular row
  const rowData = async (id, data) => {
    setPageName(!pageName)
    try {


      const [res, resspecification] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.OVERALL_DELETE_ASSET_SPECIFICATION_GROUPING_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: data.component,
          namesub: data.subcomponent,
          datafield: data,


        }),


      ])
      setDeleteAssetSpecificationGrouping(
        res?.data?.sassetspecificationgrouping
      );

      // let dataasset = resspecification?.data?.assetdetail.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
      //   ...d,
      //   component: item.component
      // })))

      let dataasset = []
      let datastock = []
      let datamanual = []


      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        dataasset = resspecification?.data?.assetdetail.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        dataasset = resspecification?.data?.assetdetail.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }


      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }



      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }
      const keysToKeep = new Set();
      dataasset.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeep.add(key);
          }
        }
      });


      const cleanedArray = dataasset.map((row) => {
        const cleanedRow = {};
        keysToKeep.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });




      // let datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
      //   ...d,
      //   component: item.component
      // })))

      const keysToKeepStock = new Set();

      datastock.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeepStock.add(key);
          }
        }
      });


      const cleanedArrayStock = datastock.map((row) => {
        const cleanedRow = {};
        keysToKeepStock.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });



      // let datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
      //   ...d,
      //   component: item.component
      // })))

      const keysToKeepManual = new Set();

      datamanual.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeepManual.add(key);
          }
        }
      });


      const cleanedArrayManual = datamanual.map((row) => {
        const cleanedRow = {};
        keysToKeepManual.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });


      setCheckAssetdetail(cleanedArray);
      setCheckstock(cleanedArrayStock);
      setCheckmanualstock(cleanedArrayManual);

      if (

        (resspecification?.data?.assetdetail).length > 0 ||

        (resspecification?.data?.stock).length > 0 ||
        (resspecification?.data?.manualstockentry).length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }


    } catch (err) {
      console.log(err, "errorr")
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // Alert delete popup
  let proid = deleteAssetSpecificationGrouping._id;
  const delProcess = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(
        `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${proid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchAssetSpecificationGrouping();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let brandCreate = await axios.post(
        SERVICE.CREATE_ASSETSPECIFICATIONGROUPING,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assetmaterial: String(assetSpecGrping.assetmaterial),
          component: String(assetSpecGrping.component),
          subcomponent: String(
            filteredSubComponent.length > 0 ? assetSpecGrping.subcomponent : ""
          ),
          type: subcomponentData.type ? [...typeValueCate] : [],
          model: subcomponentData.model ? [...modelValueCate] : [],
          size: subcomponentData.size ? [...sizeValueCate] : [],
          variant: subcomponentData.variant ? [...variantValueCate] : [],
          brand: subcomponentData.brand ? [...brandValueCate] : [],
          capacity: subcomponentData.capacity ? [...capacityValueCate] : [],
          paneltype: subcomponentData.paneltypescreen
            ? [...panelTypeValueCate]
            : [],
          screenresolution: subcomponentData.resolution
            ? [...screenResolutionValueCate]
            : [],
          connectivity: subcomponentData.connectivity
            ? [...connectivityValueCate]
            : [],
          datarate: subcomponentData.daterate ? [...dataRateValueCate] : [],
          compatibledevices: subcomponentData.compatibledevice
            ? [...compatibleDevicesValueCate]
            : [],
          outputpower: subcomponentData.outputpower
            ? [...outputPowerValueCate]
            : [],
          coolingfancount: subcomponentData.collingfancount
            ? [...coolingFanCountValueCate]
            : [],
          clockspeed: subcomponentData.clockspeed
            ? [...clockSpeedValueCate]
            : [],
          core: subcomponentData.core ? [...coreValueCate] : [],
          speed: subcomponentData.speed ? [...speedValueCate] : [],
          frequency: subcomponentData.frequency ? [...frequencyValueCate] : [],
          output: subcomponentData.output ? [...outputValueCate] : [],
          ethernetports: subcomponentData.ethernetports
            ? [...ethernetPortsValueCate]
            : [],
          distance: subcomponentData.distance ? [...distanceValueCate] : [],
          lengthname: subcomponentData.lengthname ? [...lengthValueCate] : [],
          slot: subcomponentData.slot ? [...slotValueCate] : [],
          noofchannels: subcomponentData.noofchannels
            ? [...noOfChannelsValueCate]
            : [],
          colours: subcomponentData.colours ? [...coloursValueCate] : [],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setAssetSpecGrping(brandCreate.data);
      await fetchAssetSpecificationGrouping();
      setloadingdeloverall(false);
      setAssetSpecGrping({ ...assetSpecGrping });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const checkAndShowAlert = (condition, message) => {
    if (condition) {
      setPopupContentMalert(`${message}!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return true;
    }
    return false;
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();
    const isNameMatch = assetSpecGrpingArray?.some(
      (item) =>
        item.assetmaterial == assetSpecGrping.assetmaterial &&
        item.component == assetSpecGrping.component &&
        (item.subcomponent == "" ||
          item.subcomponent == assetSpecGrping.subcomponent)
    );
    if (assetSpecGrping.assetmaterial === "Please Select Asset Material") {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetSpecGrping.component === "Please Select Component") {
      setPopupContentMalert("Please Select Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filteredSubComponent.length > 0 &&
      assetSpecGrping.subcomponent === "Please Select Sub Component"
    ) {
      setPopupContentMalert("Please Select Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      checkAndShowAlert(
        subcomponentData.type && typeValueCate.length === 0,
        "Please Select Type"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.model && modelValueCate.length === 0,
        "Please Select Model"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.size && sizeValueCate.length === 0,
        "Please Select Size"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.variant && variantValueCate.length === 0,
        "Please Select Variant"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.brand && brandValueCate.length === 0,
        "Please Select Brand"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.capacity && capacityValueCate.length === 0,
        "Please Select Capacity"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.paneltypescreen && panelTypeValueCate.length === 0,
        "Please Select Panel Type"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.resolution && screenResolutionValueCate.length === 0,
        "Please Select Screen Resolution"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.connectivity && connectivityValueCate.length === 0,
        "Please Select Connectivity"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.daterate && dataRateValueCate.length === 0,
        "Please Select Data Rate"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.compatibledevice &&
        compatibleDevicesValueCate.length === 0,
        "Please Select Compatible Devices"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.outputpower && outputPowerValueCate.length === 0,
        "Please Select Output Power"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.collingfancount &&
        coolingFanCountValueCate.length === 0,
        "Please Select Cooling Fan Count"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.clockspeed && clockSpeedValueCate.length === 0,
        "Please Select Clock Speed"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.core && coreValueCate.length === 0,
        "Please Select Core"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.speed && speedValueCate.length === 0,
        "Please Select Speed"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.frequency && frequencyValueCate.length === 0,
        "Please Select Frequency"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.output && outputValueCate.length === 0,
        "Please Select Output"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.ethernetports && ethernetPortsValueCate.length === 0,
        "Please Select Ethernet Ports"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.distance && distanceValueCate.length === 0,
        "Please Select Distance"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.lengthname && lengthValueCate.length === 0,
        "Please Select Length"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.slot && slotValueCate.length === 0,
        "Please Select Slot"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.noofchannels && noOfChannelsValueCate.length === 0,
        "Please Select No Of Channels"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentData.colours && coloursValueCate.length === 0,
        "Please Select Colours"
      )
    )
      return;
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setAssetSpecGrping({
      assetmaterial: "Please Select Asset Material",
      component: "Please Select Component",
      subcomponent: "Please Select subcomponent",
    });
    setFilteredComponent([]);
    setFilteredSubComponent([]);
    setTypeValueCate("");
    setSelectedTypeOptionsCate([]);
    setModelValueCate("");
    setSelectedModelOptionsCate([]);
    setSizeValueCate("");
    setSelectedSizeOptionsCate([]);
    setVariantValueCate("");
    setSelectedVariantOptionsCate([]);
    setBrandValueCate("");
    setSelectedBrandOptionsCate([]);
    setCapacityValueCate("");
    setSelectedCapacityOptionsCate([]);
    setPanelTypeValueCate("");
    setSelectedPanelTypeOptionsCate([]);
    setScreenResolutionValueCate("");
    setSelectedScreenResolutionOptionsCate([]);
    setConnectivityValueCate("");
    setSelectedConnectivityOptionsCate([]);
    setDataRateValueCate("");
    setSelectedDataRateOptionsCate([]);
    setCompatibleDevicesValueCate("");
    setSelectedCompatibleDevicesOptionsCate([]);
    setOutputPowerValueCate("");
    setSelectedOutputPowerOptionsCate([]);
    setCoolingFanCountValueCate("");
    setSelectedCoolingFanCountOptionsCate([]);
    setClockSpeedValueCate("");
    setSelectedClockSpeedOptionsCate([]);
    setCoreValueCate("");
    setSelectedCoreOptionsCate([]);
    setSpeedValueCate("");
    setSelectedSpeedOptionsCate([]);
    setFrequencyValueCate("");
    setSelectedFrequencyOptionsCate([]);
    setOutputValueCate("");
    setSelectedOutputOptionsCate([]);
    setEthernetPortsValueCate("");
    setSelectedEthernetPortsOptionsCate([]);
    setDistanceValueCate("");
    setSelectedDistanceOptionsCate([]);
    setSlotValueCate("");
    setSelectedSlotOptionsCate([]);
    setNoOfChannelsValueCate("");
    setSelectedNoOfChannelsOptionsCate([]);
    setColoursValueCate("");
    setSelectedColoursOptionsCate([]);
    setLengthValueCate("");
    setSelectedLengthOptionsCate([]);
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
  };
  //get single row to edit....
  const getCode = async (e, data) => {
    // console.log(data, "checkcode")
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      getOverallEditSection(data.component, data.subcomponent, data)
      setOvProj(data.component);
      setOvProjsub(data.subcomponent);
      setOvProjsubdata(data)
      setAssetSpecGrpingEdit(res?.data?.sassetspecificationgrouping);
      setTypeValueCateEdit(res?.data?.sassetspecificationgrouping?.type);
      setSelectedTypeOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.type.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setModelValueCateEdit(res?.data?.sassetspecificationgrouping?.model);
      setSelectedModelOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.model.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSizeValueCateEdit(res?.data?.sassetspecificationgrouping?.size);
      setSelectedSizeOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.size.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setVariantValueCateEdit(res?.data?.sassetspecificationgrouping?.variant);
      setSelectedVariantOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.variant.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBrandValueCateEdit(res?.data?.sassetspecificationgrouping?.brand);
      setSelectedBrandOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.brand.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setCapacityValueCateEdit(
        res?.data?.sassetspecificationgrouping?.capacity
      );
      setSelectedCapacityOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.capacity.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setPanelTypeValueCateEdit(
        res?.data?.sassetspecificationgrouping?.paneltype
      );
      setSelectedPanelTypeOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.paneltype.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setScreenResolutionValueCateEdit(
        res?.data?.sassetspecificationgrouping?.screenresolution
      );
      setSelectedScreenResolutionOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.screenresolution.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setConnectivityValueCateEdit(
        res?.data?.sassetspecificationgrouping?.connectivity
      );
      setSelectedConnectivityOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.connectivity.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setDataRateValueCateEdit(
        res?.data?.sassetspecificationgrouping?.datarate
      );
      setSelectedDataRateOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.datarate.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setCompatibleDevicesValueCateEdit(
        res?.data?.sassetspecificationgrouping?.compatibledevices
      );
      setSelectedCompatibleDevicesOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.compatibledevices.map(
          (t) => ({ ...t, label: t, value: t })
        ),
      ]);
      setOutputPowerValueCateEdit(
        res?.data?.sassetspecificationgrouping?.outputpower
      );
      setSelectedOutputPowerOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.outputpower.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setCoolingFanCountValueCateEdit(
        res?.data?.sassetspecificationgrouping?.coolingfancount
      );
      setSelectedCoolingFanCountOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.coolingfancount.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setClockSpeedValueCateEdit(
        res?.data?.sassetspecificationgrouping?.clockspeed
      );
      setSelectedClockSpeedOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.clockspeed.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setCoreValueCateEdit(res?.data?.sassetspecificationgrouping?.core);
      setSelectedCoreOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.core.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSpeedValueCateEdit(res?.data?.sassetspecificationgrouping?.speed);
      setSelectedSpeedOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.speed.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setFrequencyValueCateEdit(
        res?.data?.sassetspecificationgrouping?.frequency
      );
      setSelectedFrequencyOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.frequency.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setOutputValueCateEdit(res?.data?.sassetspecificationgrouping?.output);
      setSelectedOutputOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.output.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setEthernetPortsValueCateEdit(
        res?.data?.sassetspecificationgrouping?.ethernetports
      );
      setSelectedEthernetPortsOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.ethernetports.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setDistanceValueCateEdit(
        res?.data?.sassetspecificationgrouping?.distance
      );
      setSelectedDistanceOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.distance.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setLengthValueCateEdit(
        res?.data?.sassetspecificationgrouping?.lengthname
      );
      setSelectedLengthOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.lengthname.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSlotValueCateEdit(res?.data?.sassetspecificationgrouping?.slot);
      setSelectedSlotOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.slot.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setNoOfChannelsValueCateEdit(
        res?.data?.sassetspecificationgrouping?.noofchannels
      );
      setSelectedNoOfChannelsOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.noofchannels.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setColoursValueCateEdit(res?.data?.sassetspecificationgrouping?.colours);
      setSelectedColoursOptionsCateEdit([
        ...res?.data?.sassetspecificationgrouping?.colours.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....

  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAssetSpecGrpingEdit(res?.data?.sassetspecificationgrouping);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....

  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAssetSpecGrpingEdit(res?.data?.sassetspecificationgrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  let updateby = assetSpecGrpingEdit.updatedby;
  let addedby = assetSpecGrpingEdit.addedby;
  let processId = assetSpecGrpingEdit._id;

  //editing the single data...


  const [checkassetdetailedit, setCheckAssetdetailedit] = useState([]);
  const [checkstockedit, setCheckstockedit] = useState([]);
  const [checkmanualstockedit, setCheckmanualstockedit] = useState([]);

  const [checkassetdetaileditall, setCheckAssetdetaileditall] = useState([]);
  const [checkstockeditall, setCheckstockeditall] = useState([]);
  const [checkmanualstockeditall, setCheckmanualstockeditall] = useState([]);




  //overall edit section for all pages
  const getOverallEditSection = async (e, subcategoryname, data) => {
    // console.log(e, "subname")
    try {
      let resspecification = await axios.post(SERVICE.OVERALL_EDIT_ASSET_SPECIFICATION_GROUPING_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        oldnamesub: subcategoryname,
        datafield: data

      });
      // console.log(res?.data, "resdatga")
      setOvProjCount(resspecification?.data?.count);

      let dataasset = []
      let datastock = []
      let datamanual = []


      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        dataasset = resspecification?.data?.assetdetail.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        dataasset = resspecification?.data?.assetdetail.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }


      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }



      if (data.subcomponent && data.subcomponent != undefined && data.subcomponent != "") {
        datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
          ...d,
          component: item.component
        })))

      } else {
        datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.map(d => ({
          ...d,
          component: item.component
        })))

      }
      const keysToKeep = new Set();
      dataasset.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeep.add(key);
          }
        }
      });


      const cleanedArray = dataasset.map((row) => {
        const cleanedRow = {};
        keysToKeep.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });




      // let datastock = resspecification?.data?.stock.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
      //   ...d,
      //   component: item.component
      // })))

      const keysToKeepStock = new Set();

      datastock.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeepStock.add(key);
          }
        }
      });


      const cleanedArrayStock = datastock.map((row) => {
        const cleanedRow = {};
        keysToKeepStock.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });



      // let datamanual = resspecification?.data?.manualstockentry.flatMap(item => item.subcomponent.filter(t => t.subname == data.subcomponent).map(d => ({
      //   ...d,
      //   component: item.component
      // })))

      const keysToKeepManual = new Set();

      datamanual.forEach((row) => {
        for (const [key, value] of Object.entries(row)) {
          if (value && !["vendor", "vendorgroup", "estimationtime",
            "code", "countquantity", "address", "sub", "warranty", "phonenumber", "_id", "vendorid", "updatedby", "addedby", "subcomponentcheck", "purchasedate", "warrantycalculation", "rate", "estimation"].includes(key) && !value?.includes("Please Select")) {
            keysToKeepManual.add(key);
          }
        }
      });


      const cleanedArrayManual = datamanual.map((row) => {
        const cleanedRow = {};
        keysToKeepManual.forEach((key) => {
          if (key in row) {
            cleanedRow[key] = row[key];
          }
        });
        return cleanedRow;
      });

      // console.log(cleanedArrayStock, cleanedArrayManual, "cleanedArrayManual")

      setCheckAssetdetailedit(cleanedArray);
      setCheckstockedit(cleanedArrayStock);
      setCheckmanualstockedit(cleanedArrayManual);

      setCheckAssetdetaileditall(cleanedArray);
      setCheckstockeditall(cleanedArrayStock);
      setCheckmanualstockeditall(cleanedArrayManual);


      // setGetOverallCount(`The ${e + "," + subcategoryname} is linked in
      //   ${res?.data?.assetdetail?.length > 0 ? "Asset List ," : ""} 
      //    ${res?.data?.stock?.length > 0 ? "Stock Purchase ," : ""}
      //   ${res?.data?.manualstockentry?.length > 0 ? "Manual Stock Entry" : ""} 
      //   whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // console.log(ovProjsubdata, "ovProjsubdata")

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ASSET_SPECIFICATION_GROUPING_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldnamesub: ovProjsub,
        datafield: ovProjsubdata,
      });


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const sendEditRequest = async (filteredResult) => {
    setPageName(!pageName)
    try {

      let res = await axios.put(
        `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assetmaterial: String(assetSpecGrpingEdit.assetmaterial),
          component: String(assetSpecGrpingEdit.component),
          subcomponent: String(
            filteredSubComponentEdit.length > 0
              ? assetSpecGrpingEdit.subcomponent
              : ""
          ),
          type: subcomponentDataEdit.type ? [...typeValueCateEdit] : [],
          model: subcomponentDataEdit.model ? [...modelValueCateEdit] : [],
          size: subcomponentDataEdit.size ? [...sizeValueCateEdit] : [],
          variant: subcomponentDataEdit.variant
            ? [...variantValueCateEdit]
            : [],
          brand: subcomponentDataEdit.brand ? [...brandValueCateEdit] : [],
          capacity: subcomponentDataEdit.capacity
            ? [...capacityValueCateEdit]
            : [],
          paneltype: subcomponentDataEdit.paneltypescreen
            ? [...panelTypeValueCateEdit]
            : [],
          screenresolution: subcomponentDataEdit.resolution
            ? [...screenResolutionValueCateEdit]
            : [],
          connectivity: subcomponentDataEdit.connectivity
            ? [...connectivityValueCateEdit]
            : [],
          datarate: subcomponentDataEdit.daterate
            ? [...dataRateValueCateEdit]
            : [],
          compatibledevices: subcomponentDataEdit.compatibledevice
            ? [...compatibleDevicesValueCateEdit]
            : [],
          outputpower: subcomponentDataEdit.outputpower
            ? [...outputPowerValueCateEdit]
            : [],
          coolingfancount: subcomponentDataEdit.collingfancount
            ? [...coolingFanCountValueCateEdit]
            : [],
          clockspeed: subcomponentDataEdit.clockspeed
            ? [...clockSpeedValueCateEdit]
            : [],
          core: subcomponentDataEdit.core ? [...coreValueCateEdit] : [],
          speed: subcomponentDataEdit.speed ? [...speedValueCateEdit] : [],
          frequency: subcomponentDataEdit.frequency
            ? [...frequencyValueCateEdit]
            : [],
          output: subcomponentDataEdit.output ? [...outputValueCateEdit] : [],
          ethernetports: subcomponentDataEdit.ethernetports
            ? [...ethernetPortsValueCateEdit]
            : [],
          distance: subcomponentDataEdit.distance
            ? [...distanceValueCateEdit]
            : [],
          lengthname: subcomponentDataEdit.lengthname
            ? [...lengthValueCateEdit]
            : [],
          slot: subcomponentDataEdit.slot ? [...slotValueCateEdit] : [],
          noofchannels: subcomponentDataEdit.noofchannels
            ? [...noOfChannelsValueCateEdit]
            : [],
          colours: subcomponentDataEdit.colours
            ? [...coloursValueCateEdit]
            : [],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );



      let userchecks = axios.post(`${SERVICE.OVERALL_EDIT_ASSET_SPECIFICATION_GROUPING_ARRAY_LINKED_DATA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        result: filteredResult,
        component: String(assetSpecGrpingEdit.component),
        subcomponent: String(assetSpecGrpingEdit.subcomponent),
      });

      await getOverallEditSectionUpdate();
      await fetchAssetSpecificationGrouping();
      await fetchAssetSpecificationGroupingAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //brand option
  const [selectedBrandOptionsCate, setSelectedBrandOptionsCate] = useState([]);
  const [brandValueCate, setBrandValueCate] = useState("");
  const [selectedBrandOptionsCateEdit, setSelectedBrandOptionsCateEdit] =
    useState([]);
  const [brandValueCateEdit, setBrandValueCateEdit] = useState("");
  const handleBrandChange = (options) => {
    setBrandValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBrandOptionsCate(options);
  };
  const customValueRendererBrand = (brandValueCate, _employeename) => {
    return brandValueCate.length
      ? brandValueCate.map(({ label }) => label).join(", ")
      : "Please Select Brand";
  };




  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    const isNameMatch = assetSpecGrpingArrayEdit?.some(
      (item) =>
        item.assetmaterial == assetSpecGrpingEdit.assetmaterial &&
        item.component == assetSpecGrpingEdit.component &&
        (item.subcomponent == "" ||
          item.subcomponent == assetSpecGrpingEdit.subcomponent)
    );
    // console.log(assetSpecGrpingEdit, "assetSpecGrpingEdit");


    const brand = assetSpecGrpingEdit.brand.filter(d => !brandValueCateEdit.includes(d));
    const capacity = assetSpecGrpingEdit.capacity.filter(d => !capacityValueCateEdit.includes(d));
    const type = assetSpecGrpingEdit.type.filter(d => !typeValueCateEdit.includes(d));
    const model = assetSpecGrpingEdit.model.filter(d => !modelValueCateEdit.includes(d));
    const size = assetSpecGrpingEdit.size.filter(d => !sizeValueCateEdit.includes(d));
    const variant = assetSpecGrpingEdit.variant.filter(d => !variantValueCateEdit.includes(d));
    const paneltypescreen = assetSpecGrpingEdit.paneltype.filter(d => !panelTypeValueCateEdit.includes(d));
    const resolution = assetSpecGrpingEdit.screenresolution.filter(d => !screenResolutionValueCateEdit.includes(d));
    const connectivity = assetSpecGrpingEdit.connectivity.filter(d => !connectivityValueCateEdit.includes(d));
    const daterate = assetSpecGrpingEdit.datarate.filter(d => !dataRateValueCateEdit.includes(d));
    const compatibledevice = assetSpecGrpingEdit.compatibledevices.filter(d => !compatibleDevicesValueCateEdit.includes(d));
    const outputpower = assetSpecGrpingEdit.outputpower.filter(d => !outputPowerValueCateEdit.includes(d));
    const coolingfancount = assetSpecGrpingEdit.coolingfancount.filter(d => !coolingFanCountValueCateEdit.includes(d));
    const clockspeed = assetSpecGrpingEdit.clockspeed.filter(d => !clockSpeedValueCateEdit.includes(d));
    const core = assetSpecGrpingEdit.core.filter(d => !coreValueCateEdit.includes(d));
    const speed = assetSpecGrpingEdit.speed.filter(d => !speedValueCateEdit.includes(d));
    const frequency = assetSpecGrpingEdit.frequency.filter(d => !frequencyValueCateEdit.includes(d));
    const output = assetSpecGrpingEdit.output.filter(d => !outputValueCateEdit.includes(d));
    const ethernetports = assetSpecGrpingEdit.ethernetports.filter(d => !ethernetPortsValueCateEdit.includes(d));
    const distance = assetSpecGrpingEdit.distance.filter(d => !distanceValueCateEdit.includes(d));
    const lengthname = assetSpecGrpingEdit.lengthname.filter(d => !lengthValueCateEdit.includes(d));
    const slot = assetSpecGrpingEdit.slot.filter(d => !slotValueCateEdit.includes(d));
    const noofchannels = assetSpecGrpingEdit.noofchannels.filter(d => !noOfChannelsValueCateEdit.includes(d));
    const colours = assetSpecGrpingEdit.colours.filter(d => !coloursValueCateEdit.includes(d));



    const result = Object.fromEntries(
      Object.entries(subcomponentDataEdit)
        .filter(([key, value]) => value && ["brand", "capacity", "type", "model", "size", "variant",
          "paneltype", "screenresolution", "connectivity", "daterate",
          "compatibledevice", "outputpower", "coolingfancount", "clockspeed",
          "core", "speed", "frequency", "output", "ethernetports", "distance",
          "lengthname", "slot", "noofchannels", "colours"].includes(key)
        ) // Only include keys where the value is true
        .map(([key]) => [key, eval(key)]) // Map keys to their corresponding arrays
    );

    const filteredResult = Object.fromEntries(
      Object.entries(result).filter(([_, value]) => value.length > 0)
    );


    console.log(checkstockeditall, checkmanualstockeditall, "dfsd")

    const keysToKeep = new Set();

    let findallstock = checkstockeditall.filter(item => {
      return (
        (subcomponentDataEdit.brand && brand.includes(item.brand)) ||
        (subcomponentDataEdit.type && type.includes(item.type)) ||
        (subcomponentDataEdit.model && model.includes(item.model)) ||
        (subcomponentDataEdit.size && size.includes(item.size)) ||
        (subcomponentDataEdit.variant && variant.includes(item.variant)) ||
        (subcomponentDataEdit.capacity && capacity.includes(item.capacity)) ||
        (subcomponentDataEdit.paneltypescreen && paneltypescreen.includes(item.paneltypescreen)) ||
        (subcomponentDataEdit.resolution && resolution.includes(item.resolution)) ||
        (subcomponentDataEdit.connectivity && connectivity.includes(item.connectivity)) ||
        (subcomponentDataEdit.daterate && daterate.includes(item.daterate)) ||
        (subcomponentDataEdit.compatibledevice && compatibledevice.includes(item.compatibledevice)) ||
        (subcomponentDataEdit.outputpower && outputpower.includes(item.outputpower)) ||
        (subcomponentDataEdit.collingfancount && coolingfancount.includes(item.collingfancount)) ||
        (subcomponentDataEdit.clockspeed && clockspeed.includes(item.clockspeed)) ||
        (subcomponentDataEdit.core && core.includes(item.core)) ||
        (subcomponentDataEdit.speed && speed.includes(item.speed)) ||
        (subcomponentDataEdit.frequency && frequency.includes(item.frequency)) ||
        (subcomponentDataEdit.output && output.includes(item.output)) ||
        (subcomponentDataEdit.ethernetports && ethernetports.includes(item.ethernetports)) ||
        (subcomponentDataEdit.distance && distance.includes(item.distance)) ||
        (subcomponentDataEdit.lengthname && lengthname.includes(item.lengthname)) ||
        (subcomponentDataEdit.slot && slot.includes(item.slot)) ||
        (subcomponentDataEdit.noofchannels && noofchannels.includes(item.noofchannels)) ||
        (subcomponentDataEdit.colours && colours.includes(item.colours))
      );

    })

    let findallasset = checkassetdetaileditall.filter(item => {
      return (
        (subcomponentDataEdit.brand && brand.includes(item.brand)) ||
        (subcomponentDataEdit.type && type.includes(item.type)) ||
        (subcomponentDataEdit.model && model.includes(item.model)) ||
        (subcomponentDataEdit.size && size.includes(item.size)) ||
        (subcomponentDataEdit.variant && variant.includes(item.variant)) ||
        (subcomponentDataEdit.capacity && capacity.includes(item.capacity)) ||
        (subcomponentDataEdit.paneltypescreen && paneltypescreen.includes(item.paneltypescreen)) ||
        (subcomponentDataEdit.resolution && resolution.includes(item.resolution)) ||
        (subcomponentDataEdit.connectivity && connectivity.includes(item.connectivity)) ||
        (subcomponentDataEdit.daterate && daterate.includes(item.daterate)) ||
        (subcomponentDataEdit.compatibledevice && compatibledevice.includes(item.compatibledevice)) ||
        (subcomponentDataEdit.outputpower && outputpower.includes(item.outputpower)) ||
        (subcomponentDataEdit.collingfancount && coolingfancount.includes(item.collingfancount)) ||
        (subcomponentDataEdit.clockspeed && clockspeed.includes(item.clockspeed)) ||
        (subcomponentDataEdit.core && core.includes(item.core)) ||
        (subcomponentDataEdit.speed && speed.includes(item.speed)) ||
        (subcomponentDataEdit.frequency && frequency.includes(item.frequency)) ||
        (subcomponentDataEdit.output && output.includes(item.output)) ||
        (subcomponentDataEdit.ethernetports && ethernetports.includes(item.ethernetports)) ||
        (subcomponentDataEdit.distance && distance.includes(item.distance)) ||
        (subcomponentDataEdit.lengthname && lengthname.includes(item.lengthname)) ||
        (subcomponentDataEdit.slot && slot.includes(item.slot)) ||
        (subcomponentDataEdit.noofchannels && noofchannels.includes(item.noofchannels)) ||
        (subcomponentDataEdit.colours && colours.includes(item.colours))
      );


    })


    let findallmanual = checkmanualstockeditall.filter(item => {
      return (
        (subcomponentDataEdit.brand && brand.includes(item.brand)) ||
        (subcomponentDataEdit.type && type.includes(item.type)) ||
        (subcomponentDataEdit.model && model.includes(item.model)) ||
        (subcomponentDataEdit.size && size.includes(item.size)) ||
        (subcomponentDataEdit.variant && variant.includes(item.variant)) ||
        (subcomponentDataEdit.capacity && capacity.includes(item.capacity)) ||
        (subcomponentDataEdit.paneltypescreen && paneltypescreen.includes(item.paneltypescreen)) ||
        (subcomponentDataEdit.resolution && resolution.includes(item.resolution)) ||
        (subcomponentDataEdit.connectivity && connectivity.includes(item.connectivity)) ||
        (subcomponentDataEdit.daterate && daterate.includes(item.daterate)) ||
        (subcomponentDataEdit.compatibledevice && compatibledevice.includes(item.compatibledevice)) ||
        (subcomponentDataEdit.outputpower && outputpower.includes(item.outputpower)) ||
        (subcomponentDataEdit.collingfancount && coolingfancount.includes(item.collingfancount)) ||
        (subcomponentDataEdit.clockspeed && clockspeed.includes(item.clockspeed)) ||
        (subcomponentDataEdit.core && core.includes(item.core)) ||
        (subcomponentDataEdit.speed && speed.includes(item.speed)) ||
        (subcomponentDataEdit.frequency && frequency.includes(item.frequency)) ||
        (subcomponentDataEdit.output && output.includes(item.output)) ||
        (subcomponentDataEdit.ethernetports && ethernetports.includes(item.ethernetports)) ||
        (subcomponentDataEdit.distance && distance.includes(item.distance)) ||
        (subcomponentDataEdit.lengthname && lengthname.includes(item.lengthname)) ||
        (subcomponentDataEdit.slot && slot.includes(item.slot)) ||
        (subcomponentDataEdit.noofchannels && noofchannels.includes(item.noofchannels)) ||
        (subcomponentDataEdit.colours && colours.includes(item.colours))
      );

    })

    console.log(findallstock, findallmanual, "final")

    setCheckAssetdetailedit(findallasset);

    setCheckstockedit(findallstock);


    setCheckmanualstockedit(findallmanual);




    if (assetSpecGrpingEdit.assetmaterial === "Please Select Asset Material") {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetSpecGrpingEdit.component === "Please Select Component") {
      setPopupContentMalert("Please Select Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filteredSubComponentEdit.length > 0 &&
      assetSpecGrpingEdit.subcomponent === "Please Select Sub Component"
    ) {
      setPopupContentMalert("Please Select Sub Component");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (
        findallasset.length > 0 || findallstock.length > 0 || findallmanual.length > 0
      )
      &&


      ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          {/* <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p> */}
          <p style={{ fontSize: "20px", fontWeight: 900 }}></p>
        </>
      );
      handleClickOpenerrpop(filteredResult);
    }


    else if (
      checkAndShowAlert(
        subcomponentDataEdit.type && typeValueCateEdit.length === 0,
        "Please Select Type"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.model && modelValueCateEdit.length === 0,
        "Please Select Model"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.size && sizeValueCateEdit.length === 0,
        "Please Select Size"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.variant && variantValueCateEdit.length === 0,
        "Please Select Variant"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.brand && brandValueCateEdit.length === 0,
        "Please Select Brand"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.capacity && capacityValueCateEdit.length === 0,
        "Please Select Capacity"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.paneltypescreen &&
        panelTypeValueCateEdit.length === 0,
        "Please Select Panel Type"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.resolution &&
        screenResolutionValueCateEdit.length === 0,
        "Please Select Screen Resolution"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.connectivity &&
        connectivityValueCateEdit.length === 0,
        "Please Select Connectivity"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.daterate && dataRateValueCateEdit.length === 0,
        "Please Select Data Rate"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.compatibledevice &&
        compatibleDevicesValueCateEdit.length === 0,
        "Please Select Compatible Devices"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.outputpower &&
        outputPowerValueCateEdit.length === 0,
        "Please Select Output Power"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.collingfancount &&
        coolingFanCountValueCateEdit.length === 0,
        "Please Select Cooling Fan Count"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.clockspeed && clockSpeedValueCateEdit.length === 0,
        "Please Select Clock Speed"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.core && coreValueCateEdit.length === 0,
        "Please Select Core"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.speed && speedValueCateEdit.length === 0,
        "Please Select Speed"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.frequency && frequencyValueCateEdit.length === 0,
        "Please Select Frequency"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.output && outputValueCateEdit.length === 0,
        "Please Select Output"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.ethernetports &&
        ethernetPortsValueCateEdit.length === 0,
        "Please Select Ethernet Ports"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.distance && distanceValueCateEdit.length === 0,
        "Please Select Distance"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.lengthname && lengthValueCateEdit.length === 0,
        "Please Select Length"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.slot && slotValueCateEdit.length === 0,
        "Please Select Slot"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.noofchannels &&
        noOfChannelsValueCateEdit.length === 0,
        "Please Select No Of Channels"
      )
    )
      return;
    else if (
      checkAndShowAlert(
        subcomponentDataEdit.colours && coloursValueCateEdit.length === 0,
        "Please Select Colours"
      )
    )
      return;


    else {
      sendEditRequest(filteredResult);
    }
  };

  //get all Asset Specification Grouping.

  const fetchAssetSpecificationGrouping = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setAssetSpecGrpingArray(res_freq?.data?.assetspecificationgrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(
          `${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${item}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setIsHandleChange(false);
      setSelectAllChecked(false);
      setPage(1);

      await fetchAssetSpecificationGrouping();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Asset Specification Grouping.

  const fetchAssetSpecificationGroupingAll = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetSpecGrpingArrayEdit(
        res_freq?.data?.assetspecificationgrouping.filter(
          (item) => item._id !== assetSpecGrpingEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Asset Specification Grouping List.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Asset Specification Grouping",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };


  useEffect(() => {
    addSerialNumber(assetSpecGrpingArray);
  }, [assetSpecGrpingArray]);
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
    //   headerName: "Checkbox", 
    //   headerStyle: {
    //     fontWeight: "bold", 

    //   },

    //   sortable: false, 
    //   width: 90,
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    //   pinned: "left",
    //   lockPinned: true,
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Asset Material",
      flex: 0,
      width: 200,
      hide: !columnVisibility.assetmaterial,
      headerClassName: "bold-header",
    },
    {
      field: "component",
      headerName: "Component",
      flex: 0,
      width: 200,
      hide: !columnVisibility.component,
      headerClassName: "bold-header",
    },
    {
      field: "subcomponent",
      headerName: "Sub Component",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subcomponent,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 290,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassetspecificationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetspecificationgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetspecificationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassetspecificationgrouping") && (
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
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      assetmaterial: item.assetmaterial,
      component: item.component,
      subcomponent: item.subcomponent,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  //type option
  const [selectedTypeOptionsCate, setSelectedTypeOptionsCate] = useState([]);
  const [typeValueCate, setTypeValueCate] = useState("");
  const [selectedTypeOptionsCateEdit, setSelectedTypeOptionsCateEdit] =
    useState([]);
  const [typeValueCateEdit, setTypeValueCateEdit] = useState("");
  const handleTypeChange = (options) => {
    setTypeValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTypeOptionsCate(options);
  };
  const customValueRendererType = (typeValueCate, _employeename) => {
    return typeValueCate.length
      ? typeValueCate.map(({ label }) => label).join(", ")
      : "Please Select Type";
  };
  const handleTypeChangeEdit = (options) => {
    setTypeValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTypeOptionsCateEdit(options);
  };
  const customValueRendererTypeEdit = (typeValueCateEdit, _employeename) => {
    return typeValueCateEdit.length
      ? typeValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Type";
  };

  //model option
  const [selectedModelOptionsCate, setSelectedModelOptionsCate] = useState([]);
  const [modelValueCate, setModelValueCate] = useState("");
  const [selectedModelOptionsCateEdit, setSelectedModelOptionsCateEdit] =
    useState([]);
  const [modelValueCateEdit, setModelValueCateEdit] = useState("");
  const handleModelChange = (options) => {
    setModelValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedModelOptionsCate(options);
  };
  const customValueRendererModel = (modelValueCate, _employeename) => {
    return modelValueCate.length
      ? modelValueCate.map(({ label }) => label).join(", ")
      : "Please Select Model";
  };
  const handleModelChangeEdit = (options) => {
    setModelValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedModelOptionsCateEdit(options);
  };
  const customValueRendererModelEdit = (modelValueCateEdit, _employeename) => {
    return modelValueCateEdit.length
      ? modelValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Model";
  };

  //size option
  const [selectedSizeOptionsCate, setSelectedSizeOptionsCate] = useState([]);
  const [sizeValueCate, setSizeValueCate] = useState("");
  const [selectedSizeOptionsCateEdit, setSelectedSizeOptionsCateEdit] =
    useState([]);
  const [sizeValueCateEdit, setSizeValueCateEdit] = useState("");
  const handleSizeChange = (options) => {
    setSizeValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSizeOptionsCate(options);
  };
  const customValueRendererSize = (sizeValueCate, _employeename) => {
    return sizeValueCate.length
      ? sizeValueCate.map(({ label }) => label).join(", ")
      : "Please Select Size";
  };
  const handleSizeChangeEdit = (options) => {
    setSizeValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSizeOptionsCateEdit(options);
  };
  const customValueRendererSizeEdit = (sizeValueCateEdit, _employeename) => {
    return sizeValueCateEdit.length
      ? sizeValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Size";
  };

  //variant option
  const [selectedVariantOptionsCate, setSelectedVariantOptionsCate] = useState(
    []
  );
  const [variantValueCate, setVariantValueCate] = useState("");
  const [selectedVariantOptionsCateEdit, setSelectedVariantOptionsCateEdit] =
    useState([]);
  const [variantValueCateEdit, setVariantValueCateEdit] = useState("");
  const handleVariantChange = (options) => {
    setVariantValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedVariantOptionsCate(options);
  };
  const customValueRendererVariant = (variantValueCate, _employeename) => {
    return variantValueCate.length
      ? variantValueCate.map(({ label }) => label).join(", ")
      : "Please Select Variant";
  };
  const handleVariantChangeEdit = (options) => {
    setVariantValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedVariantOptionsCateEdit(options);
  };
  const customValueRendererVariantEdit = (
    variantValueCateEdit,
    _employeename
  ) => {
    return variantValueCateEdit.length
      ? variantValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Variant";
  };

  // //brand option
  // const [selectedBrandOptionsCate, setSelectedBrandOptionsCate] = useState([]);
  // const [brandValueCate, setBrandValueCate] = useState("");
  // const [selectedBrandOptionsCateEdit, setSelectedBrandOptionsCateEdit] =
  //   useState([]);
  // const [brandValueCateEdit, setBrandValueCateEdit] = useState("");
  // const handleBrandChange = (options) => {
  //   setBrandValueCate(
  //     options.map((a, index) => {
  //       return a.value;
  //     })
  //   );
  //   setSelectedBrandOptionsCate(options);
  // };
  // const customValueRendererBrand = (brandValueCate, _employeename) => {
  //   return brandValueCate.length
  //     ? brandValueCate.map(({ label }) => label).join(", ")
  //     : "Please Select Brand";
  // };


  // console.log(brandValueCateEdit, "brandValueCateEdit")



  const handleBrandChangeEdit = (options) => {
    setBrandValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBrandOptionsCateEdit(options);
  };
  const customValueRendererBrandEdit = (brandValueCateEdit, _employeename) => {
    return brandValueCateEdit.length
      ? brandValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Brand";
  };

  //capacity option
  const [selectedCapacityOptionsCate, setSelectedCapacityOptionsCate] =
    useState([]);
  const [capacityValueCate, setCapacityValueCate] = useState("");
  const [selectedCapacityOptionsCateEdit, setSelectedCapacityOptionsCateEdit] =
    useState([]);
  const [capacityValueCateEdit, setCapacityValueCateEdit] = useState("");
  const handleCapacityChange = (options) => {
    setCapacityValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCapacityOptionsCate(options);
  };
  const customValueRendererCapacity = (capacityValueCate, _employeename) => {
    return capacityValueCate.length
      ? capacityValueCate.map(({ label }) => label).join(", ")
      : "Please Select Capacity";
  };
  const handleCapacityChangeEdit = (options) => {
    setCapacityValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCapacityOptionsCateEdit(options);
  };
  const customValueRendererCapacityEdit = (
    capacityValueCateEdit,
    _employeename
  ) => {
    return capacityValueCateEdit.length
      ? capacityValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Capacity";
  };

  //PanelType option
  const [selectedPanelTypeOptionsCate, setSelectedPanelTypeOptionsCate] =
    useState([]);
  const [panelTypeValueCate, setPanelTypeValueCate] = useState("");
  const [
    selectedPanelTypeOptionsCateEdit,
    setSelectedPanelTypeOptionsCateEdit,
  ] = useState([]);
  const [panelTypeValueCateEdit, setPanelTypeValueCateEdit] = useState("");
  const handlePanelTypeChange = (options) => {
    setPanelTypeValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedPanelTypeOptionsCate(options);
  };
  const customValueRendererPanelType = (panelTypeValueCate, _employeename) => {
    return panelTypeValueCate.length
      ? panelTypeValueCate.map(({ label }) => label).join(", ")
      : "Please Select Panel Type";
  };
  const handlePanelTypeChangeEdit = (options) => {
    setPanelTypeValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedPanelTypeOptionsCateEdit(options);
  };
  const customValueRendererPanelTypeEdit = (
    panelTypeValueCateEdit,
    _employeename
  ) => {
    return panelTypeValueCateEdit.length
      ? panelTypeValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Panel Type";
  };

  //ScreenResolution option
  const [
    selectedScreenResolutionOptionsCate,
    setSelectedScreenResolutionOptionsCate,
  ] = useState([]);
  const [screenResolutionValueCate, setScreenResolutionValueCate] =
    useState("");
  const [
    selectedScreenResolutionOptionsCateEdit,
    setSelectedScreenResolutionOptionsCateEdit,
  ] = useState([]);
  const [screenResolutionValueCateEdit, setScreenResolutionValueCateEdit] =
    useState("");
  const handleScreenResolutionChange = (options) => {
    setScreenResolutionValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedScreenResolutionOptionsCate(options);
  };
  const customValueRendererScreenResolution = (
    screenResolutionValueCate,
    _employeename
  ) => {
    return screenResolutionValueCate.length
      ? screenResolutionValueCate.map(({ label }) => label).join(", ")
      : "Please Select Screen Resolution";
  };
  const handleScreenResolutionChangeEdit = (options) => {
    setScreenResolutionValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedScreenResolutionOptionsCateEdit(options);
  };
  const customValueRendererScreenResolutionEdit = (
    screenResolutionValueCateEdit,
    _employeename
  ) => {
    return screenResolutionValueCateEdit.length
      ? screenResolutionValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Screen Resolution";
  };

  //Connectivity option
  const [selectedConnectivityOptionsCate, setSelectedConnectivityOptionsCate] =
    useState([]);
  const [connectivityValueCate, setConnectivityValueCate] = useState("");
  const [
    selectedConnectivityOptionsCateEdit,
    setSelectedConnectivityOptionsCateEdit,
  ] = useState([]);
  const [connectivityValueCateEdit, setConnectivityValueCateEdit] =
    useState("");
  const handleConnectivityChange = (options) => {
    setConnectivityValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedConnectivityOptionsCate(options);
  };
  const customValueRendererConnectivity = (
    connectivityValueCate,
    _employeename
  ) => {
    return connectivityValueCate.length
      ? connectivityValueCate.map(({ label }) => label).join(", ")
      : "Please Select Connectivity";
  };
  const handleConnectivityChangeEdit = (options) => {
    setConnectivityValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedConnectivityOptionsCateEdit(options);
  };
  const customValueRendererConnectivityEdit = (
    connectivityValueCateEdit,
    _employeename
  ) => {
    return connectivityValueCateEdit.length
      ? connectivityValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Connectivity";
  };

  //DataRate option
  const [selectedDataRateOptionsCate, setSelectedDataRateOptionsCate] =
    useState([]);
  const [dataRateValueCate, setDataRateValueCate] = useState("");
  const [selectedDataRateOptionsCateEdit, setSelectedDataRateOptionsCateEdit] =
    useState([]);
  const [dataRateValueCateEdit, setDataRateValueCateEdit] = useState("");
  const handleDataRateChange = (options) => {
    setDataRateValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDataRateOptionsCate(options);
  };
  const customValueRendererDataRate = (dataRateValueCate, _employeename) => {
    return dataRateValueCate.length
      ? dataRateValueCate.map(({ label }) => label).join(", ")
      : "Please Select Data Rate";
  };
  const handleDataRateChangeEdit = (options) => {
    setDataRateValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDataRateOptionsCateEdit(options);
  };
  const customValueRendererDataRateEdit = (
    dataRateValueCateEdit,
    _employeename
  ) => {
    return dataRateValueCateEdit.length
      ? dataRateValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Data Rate";
  };

  //CompatibleDevices option
  const [
    selectedCompatibleDevicesOptionsCate,
    setSelectedCompatibleDevicesOptionsCate,
  ] = useState([]);
  const [compatibleDevicesValueCate, setCompatibleDevicesValueCate] =
    useState("");
  const [
    selectedCompatibleDevicesOptionsCateEdit,
    setSelectedCompatibleDevicesOptionsCateEdit,
  ] = useState([]);
  const [compatibleDevicesValueCateEdit, setCompatibleDevicesValueCateEdit] =
    useState("");
  const handleCompatibleDevicesChange = (options) => {
    setCompatibleDevicesValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompatibleDevicesOptionsCate(options);
  };
  const customValueRendererCompatibleDevices = (
    compatibleDevicesValueCate,
    _employeename
  ) => {
    return compatibleDevicesValueCate.length
      ? compatibleDevicesValueCate.map(({ label }) => label).join(", ")
      : "Please Select Compatible Devices";
  };
  const handleCompatibleDevicesChangeEdit = (options) => {
    setCompatibleDevicesValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompatibleDevicesOptionsCateEdit(options);
  };
  const customValueRendererCompatibleDevicesEdit = (
    compatibleDevicesValueCateEdit,
    _employeename
  ) => {
    return compatibleDevicesValueCateEdit.length
      ? compatibleDevicesValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Compatible Devices";
  };

  //Output Power option
  const [selectedOutputPowerOptionsCate, setSelectedOutputPowerOptionsCate] =
    useState([]);
  const [outputPowerValueCate, setOutputPowerValueCate] = useState("");
  const [
    selectedOutputPowerOptionsCateEdit,
    setSelectedOutputPowerOptionsCateEdit,
  ] = useState([]);
  const [outputPowerValueCateEdit, setOutputPowerValueCateEdit] = useState("");
  const handleOutputPowerChange = (options) => {
    setOutputPowerValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOutputPowerOptionsCate(options);
  };
  const customValueRendererOutputPower = (
    outputPowerValueCate,
    _employeename
  ) => {
    return outputPowerValueCate.length
      ? outputPowerValueCate.map(({ label }) => label).join(", ")
      : "Please Select Output Power";
  };
  const handleOutputPowerChangeEdit = (options) => {
    setOutputPowerValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOutputPowerOptionsCateEdit(options);
  };
  const customValueRendererOutputPowerEdit = (
    outputPowerValueCateEdit,
    _employeename
  ) => {
    return outputPowerValueCateEdit.length
      ? outputPowerValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Output Power";
  };

  //Cooling Fan Count option
  const [
    selectedCoolingFanCountOptionsCate,
    setSelectedCoolingFanCountOptionsCate,
  ] = useState([]);
  const [coolingFanCountValueCate, setCoolingFanCountValueCate] = useState("");
  const [
    selectedCoolingFanCountOptionsCateEdit,
    setSelectedCoolingFanCountOptionsCateEdit,
  ] = useState([]);
  const [coolingFanCountValueCateEdit, setCoolingFanCountValueCateEdit] =
    useState("");
  const handleCoolingFanCountChange = (options) => {
    setCoolingFanCountValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCoolingFanCountOptionsCate(options);
  };
  const customValueRendererCoolingFanCount = (
    coolingFanCountValueCate,
    _employeename
  ) => {
    return coolingFanCountValueCate.length
      ? coolingFanCountValueCate.map(({ label }) => label).join(", ")
      : "Please Select Cooling Fan Count";
  };
  const handleCoolingFanCountChangeEdit = (options) => {
    setCoolingFanCountValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCoolingFanCountOptionsCateEdit(options);
  };
  const customValueRendererCoolingFanCountEdit = (
    coolingFanCountValueCateEdit,
    _employeename
  ) => {
    return coolingFanCountValueCateEdit.length
      ? coolingFanCountValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Cooling Fan Count";
  };

  //ClookSpeed option
  const [selectedClockSpeedOptionsCate, setSelectedClockSpeedOptionsCate] =
    useState([]);
  const [clockSpeedValueCate, setClockSpeedValueCate] = useState("");
  const [
    selectedClockSpeedOptionsCateEdit,
    setSelectedClockSpeedOptionsCateEdit,
  ] = useState([]);
  const [clockSpeedValueCateEdit, setClockSpeedValueCateEdit] = useState("");
  const handleClockSpeedChange = (options) => {
    setClockSpeedValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedClockSpeedOptionsCate(options);
  };
  const customValueRendererClockSpeed = (
    clockSpeedValueCate,
    _employeename
  ) => {
    return clockSpeedValueCate.length
      ? clockSpeedValueCate.map(({ label }) => label).join(", ")
      : "Please Select Clock Speed";
  };
  const handleClockSpeedChangeEdit = (options) => {
    setClockSpeedValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedClockSpeedOptionsCateEdit(options);
  };
  const customValueRendererClockSpeedEdit = (
    clockSpeedValueCateEdit,
    _employeename
  ) => {
    return clockSpeedValueCateEdit.length
      ? clockSpeedValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Clock Speed";
  };

  //Core option
  const [selectedCoreOptionsCate, setSelectedCoreOptionsCate] = useState([]);
  const [coreValueCate, setCoreValueCate] = useState("");
  const [selectedCoreOptionsCateEdit, setSelectedCoreOptionsCateEdit] =
    useState([]);
  const [coreValueCateEdit, setCoreValueCateEdit] = useState("");
  const handleCoreChange = (options) => {
    setCoreValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCoreOptionsCate(options);
  };
  const customValueRendererCore = (coreValueCate, _employeename) => {
    return coreValueCate.length
      ? coreValueCate.map(({ label }) => label).join(", ")
      : "Please Select Core";
  };
  const handleCoreChangeEdit = (options) => {
    setCoreValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCoreOptionsCateEdit(options);
  };
  const customValueRendererCoreEdit = (coreValueCateEdit, _employeename) => {
    return coreValueCateEdit.length
      ? coreValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Core";
  };

  //Speed option
  const [selectedSpeedOptionsCate, setSelectedSpeedOptionsCate] = useState([]);
  const [speedValueCate, setSpeedValueCate] = useState("");
  const [selectedSpeedOptionsCateEdit, setSelectedSpeedOptionsCateEdit] =
    useState([]);
  const [speedValueCateEdit, setSpeedValueCateEdit] = useState("");
  const handleSpeedChange = (options) => {
    setSpeedValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSpeedOptionsCate(options);
  };
  const customValueRendererSpeed = (speedValueCate, _employeename) => {
    return speedValueCate.length
      ? speedValueCate.map(({ label }) => label).join(", ")
      : "Please Select Speed";
  };
  const handleSpeedChangeEdit = (options) => {
    setSpeedValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSpeedOptionsCateEdit(options);
  };
  const customValueRendererSpeedEdit = (speedValueCateEdit, _employeename) => {
    return speedValueCateEdit.length
      ? speedValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Speed";
  };

  //Frequency option
  const [selectedFrequencyOptionsCate, setSelectedFrequencyOptionsCate] =
    useState([]);
  const [frequencyValueCate, setFrequencyValueCate] = useState("");
  const [
    selectedFrequencyOptionsCateEdit,
    setSelectedFrequencyOptionsCateEdit,
  ] = useState([]);
  const [frequencyValueCateEdit, setFrequencyValueCateEdit] = useState("");
  const handleFrequencyChange = (options) => {
    setFrequencyValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedFrequencyOptionsCate(options);
  };
  const customValueRendererFrequency = (frequencyValueCate, _employeename) => {
    return frequencyValueCate.length
      ? frequencyValueCate.map(({ label }) => label).join(", ")
      : "Please Select Frequency";
  };
  const handleFrequencyChangeEdit = (options) => {
    setFrequencyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedFrequencyOptionsCateEdit(options);
  };
  const customValueRendererFrequencyEdit = (
    frequencyValueCateEdit,
    _employeename
  ) => {
    return frequencyValueCateEdit.length
      ? frequencyValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Frequency";
  };

  //Output option
  const [selectedOutputOptionsCate, setSelectedOutputOptionsCate] = useState(
    []
  );
  const [outputValueCate, setOutputValueCate] = useState("");
  const [selectedOutputOptionsCateEdit, setSelectedOutputOptionsCateEdit] =
    useState([]);
  const [outputValueCateEdit, setOutputValueCateEdit] = useState("");
  const handleOutputChange = (options) => {
    setOutputValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOutputOptionsCate(options);
  };
  const customValueRendererOutput = (outputValueCate, _employeename) => {
    return outputValueCate.length
      ? outputValueCate.map(({ label }) => label).join(", ")
      : "Please Select Output";
  };
  const handleOutputChangeEdit = (options) => {
    setOutputValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOutputOptionsCateEdit(options);
  };
  const customValueRendererOutputEdit = (
    outputValueCateEdit,
    _employeename
  ) => {
    return outputValueCateEdit.length
      ? outputValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Output";
  };

  //Ethernet Ports option
  const [
    selectedEthernetPortsOptionsCate,
    setSelectedEthernetPortsOptionsCate,
  ] = useState([]);
  const [ethernetPortsValueCate, setEthernetPortsValueCate] = useState("");
  const [
    selectedEthernetPortsOptionsCateEdit,
    setSelectedEthernetPortsOptionsCateEdit,
  ] = useState([]);
  const [ethernetPortsValueCateEdit, setEthernetPortsValueCateEdit] =
    useState("");
  const handleEthernetPortsChange = (options) => {
    setEthernetPortsValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEthernetPortsOptionsCate(options);
  };
  const customValueRendererEthernetPorts = (
    ethernetPortsValueCate,
    _employeename
  ) => {
    return ethernetPortsValueCate.length
      ? ethernetPortsValueCate.map(({ label }) => label).join(", ")
      : "Please Select Ethernet Ports";
  };
  const handleEthernetPortsChangeEdit = (options) => {
    setEthernetPortsValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEthernetPortsOptionsCateEdit(options);
  };
  const customValueRendererEthernetPortsEdit = (
    ethernetPortsValueCateEdit,
    _employeename
  ) => {
    return ethernetPortsValueCateEdit.length
      ? ethernetPortsValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Ethernet Ports";
  };

  //Distance option
  const [selectedDistanceOptionsCate, setSelectedDistanceOptionsCate] =
    useState([]);
  const [distanceValueCate, setDistanceValueCate] = useState("");
  const [selectedDistanceOptionsCateEdit, setSelectedDistanceOptionsCateEdit] =
    useState([]);
  const [distanceValueCateEdit, setDistanceValueCateEdit] = useState("");
  const handleDistanceChange = (options) => {
    setDistanceValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDistanceOptionsCate(options);
  };
  const customValueRendererDistance = (distanceValueCate, _employeename) => {
    return distanceValueCate.length
      ? distanceValueCate.map(({ label }) => label).join(", ")
      : "Please Select Distance";
  };
  const handleDistanceChangeEdit = (options) => {
    setDistanceValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDistanceOptionsCateEdit(options);
  };
  const customValueRendererDistanceEdit = (
    distanceValueCateEdit,
    _employeename
  ) => {
    return distanceValueCateEdit.length
      ? distanceValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Distance";
  };

  //Length option
  const [selectedLengthOptionsCate, setSelectedLengthOptionsCate] = useState(
    []
  );
  const [lengthValueCate, setLengthValueCate] = useState("");
  const [selectedLengthOptionsCateEdit, setSelectedLengthOptionsCateEdit] =
    useState([]);
  const [lengthValueCateEdit, setLengthValueCateEdit] = useState("");
  const handleLengthChange = (options) => {
    setLengthValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedLengthOptionsCate(options);
  };
  const customValueRendererLength = (lengthValueCate, _employeename) => {
    return lengthValueCate.length
      ? lengthValueCate.map(({ label }) => label).join(", ")
      : "Please Select Length";
  };
  const handleLengthChangeEdit = (options) => {
    setLengthValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedLengthOptionsCateEdit(options);
  };
  const customValueRendererLengthEdit = (
    lengthValueCateEdit,
    _employeename
  ) => {
    return lengthValueCateEdit.length
      ? lengthValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Length";
  };

  //Slot option
  const [selectedSlotOptionsCate, setSelectedSlotOptionsCate] = useState([]);
  const [slotValueCate, setSlotValueCate] = useState("");
  const [selectedSlotOptionsCateEdit, setSelectedSlotOptionsCateEdit] =
    useState([]);
  const [slotValueCateEdit, setSlotValueCateEdit] = useState("");
  const handleSlotChange = (options) => {
    setSlotValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSlotOptionsCate(options);
  };
  const customValueRendererSlot = (slotValueCate, _employeename) => {
    return slotValueCate.length
      ? slotValueCate.map(({ label }) => label).join(", ")
      : "Please Select Slot";
  };
  const handleSlotChangeEdit = (options) => {
    setSlotValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSlotOptionsCateEdit(options);
  };
  const customValueRendererSlotEdit = (slotValueCateEdit, _employeename) => {
    return slotValueCateEdit.length
      ? slotValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Slot";
  };

  //Colours option
  const [selectedColoursOptionsCate, setSelectedColoursOptionsCate] = useState(
    []
  );
  const [coloursValueCate, setColoursValueCate] = useState("");
  const [selectedColoursOptionsCateEdit, setSelectedColoursOptionsCateEdit] =
    useState([]);
  const [coloursValueCateEdit, setColoursValueCateEdit] = useState("");
  const handleColoursChange = (options) => {
    setColoursValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedColoursOptionsCate(options);
  };
  const customValueRendererColours = (coloursValueCate, _employeename) => {
    return coloursValueCate.length
      ? coloursValueCate.map(({ label }) => label).join(", ")
      : "Please Select Colours";
  };
  const handleColoursChangeEdit = (options) => {
    setColoursValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedColoursOptionsCateEdit(options);
  };
  const customValueRendererColoursEdit = (
    coloursValueCateEdit,
    _employeename
  ) => {
    return coloursValueCateEdit.length
      ? coloursValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Colours";
  };

  //NoOFChannels option
  const [selectedNoOfChannelsOptionsCate, setSelectedNoOfChannelsOptionsCate] =
    useState([]);
  const [noOfChannelsValueCate, setNoOfChannelsValueCate] = useState("");
  const [
    selectedNoOfChannelsOptionsCateEdit,
    setSelectedNoOfChannelsOptionsCateEdit,
  ] = useState([]);
  const [noOfChannelsValueCateEdit, setNoOfChannelsValueCateEdit] =
    useState("");
  const handleNoOfChannelsChange = (options) => {
    setNoOfChannelsValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedNoOfChannelsOptionsCate(options);
  };
  const customValueRendererNoOfChannels = (
    noOfChannelsValueCate,
    _employeename
  ) => {
    return noOfChannelsValueCate.length
      ? noOfChannelsValueCate.map(({ label }) => label).join(", ")
      : "Please Select No Of Channels";
  };
  const handleNoOfChannelsChangeEdit = (options) => {
    setNoOfChannelsValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedNoOfChannelsOptionsCateEdit(options);
  };
  const customValueRendererNoOfChannelsEdit = (
    noOfChannelsValueCateEdit,
    _employeename
  ) => {
    return noOfChannelsValueCateEdit.length
      ? noOfChannelsValueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select No Of Channels";
  };


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

  return (
    <Box>
      <Headtitle title={"ASSET SPECIFICATION GROUPING"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title=" Asset Specification Grouping"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Asset Specification Grouping"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("aassetspecificationgrouping") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography
                    sx={userStyle.importheadtext}
                    style={{ fontWeight: "600" }}
                  >
                    Add Asset Specification Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Asset Material<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={assetMaterialOption}
                        placeholder="Please Select Asset Material"
                        value={{
                          label: assetSpecGrping.assetmaterial,
                          value: assetSpecGrping.assetmaterial,
                        }}
                        onChange={(e) => {
                          setAssetSpecGrping({
                            ...assetSpecGrping,
                            assetmaterial: e.value,
                            component: "Please Select Component",
                            subcomponent: "Please Select Sub Component",
                          });
                          setTypeValueCate("");
                          setSelectedTypeOptionsCate([]);
                          setModelValueCate("");
                          setSelectedModelOptionsCate([]);
                          setSizeValueCate("");
                          setSelectedSizeOptionsCate([]);
                          setVariantValueCate("");
                          setSelectedVariantOptionsCate([]);
                          setBrandValueCate("");
                          setSelectedBrandOptionsCate([]);
                          setCapacityValueCate("");
                          setSelectedCapacityOptionsCate([]);
                          setPanelTypeValueCate("");
                          setSelectedPanelTypeOptionsCate([]);
                          setScreenResolutionValueCate("");
                          setSelectedScreenResolutionOptionsCate([]);
                          setConnectivityValueCate("");
                          setSelectedConnectivityOptionsCate([]);
                          setDataRateValueCate("");
                          setSelectedDataRateOptionsCate([]);
                          setCompatibleDevicesValueCate("");
                          setSelectedCompatibleDevicesOptionsCate([]);
                          setOutputPowerValueCate("");
                          setSelectedOutputPowerOptionsCate([]);
                          setCoolingFanCountValueCate("");
                          setSelectedCoolingFanCountOptionsCate([]);
                          setClockSpeedValueCate("");
                          setSelectedClockSpeedOptionsCate([]);
                          setCoreValueCate("");
                          setSelectedCoreOptionsCate([]);
                          setSpeedValueCate("");
                          setSelectedSpeedOptionsCate([]);
                          setFrequencyValueCate("");
                          setSelectedFrequencyOptionsCate([]);
                          setOutputValueCate("");
                          setSelectedOutputOptionsCate([]);
                          setEthernetPortsValueCate("");
                          setSelectedEthernetPortsOptionsCate([]);
                          setDistanceValueCate("");
                          setSelectedDistanceOptionsCate([]);
                          setSlotValueCate("");
                          setSelectedSlotOptionsCate([]);
                          setNoOfChannelsValueCate("");
                          setSelectedNoOfChannelsOptionsCate([]);
                          setColoursValueCate("");
                          setSelectedColoursOptionsCate([]);
                          setLengthValueCate("");
                          setSelectedLengthOptionsCate([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Component<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={filteredComponent}
                        placeholder="Please Select Component"
                        value={{
                          label: assetSpecGrping.component,
                          value: assetSpecGrping.component,
                        }}
                        onChange={(e) => {
                          setAssetSpecGrping({
                            ...assetSpecGrping,
                            component: e.value,
                            subcomponent: "Please Select Sub Component",
                          });
                          setTypeValueCate("");
                          setSelectedTypeOptionsCate([]);
                          setModelValueCate("");
                          setSelectedModelOptionsCate([]);
                          setSizeValueCate("");
                          setSelectedSizeOptionsCate([]);
                          setVariantValueCate("");
                          setSelectedVariantOptionsCate([]);
                          setBrandValueCate("");
                          setSelectedBrandOptionsCate([]);
                          setCapacityValueCate("");
                          setSelectedCapacityOptionsCate([]);
                          setPanelTypeValueCate("");
                          setSelectedPanelTypeOptionsCate([]);
                          setScreenResolutionValueCate("");
                          setSelectedScreenResolutionOptionsCate([]);
                          setConnectivityValueCate("");
                          setSelectedConnectivityOptionsCate([]);
                          setDataRateValueCate("");
                          setSelectedDataRateOptionsCate([]);
                          setCompatibleDevicesValueCate("");
                          setSelectedCompatibleDevicesOptionsCate([]);
                          setOutputPowerValueCate("");
                          setSelectedOutputPowerOptionsCate([]);
                          setCoolingFanCountValueCate("");
                          setSelectedCoolingFanCountOptionsCate([]);
                          setClockSpeedValueCate("");
                          setSelectedClockSpeedOptionsCate([]);
                          setCoreValueCate("");
                          setSelectedCoreOptionsCate([]);
                          setSpeedValueCate("");
                          setSelectedSpeedOptionsCate([]);
                          setFrequencyValueCate("");
                          setSelectedFrequencyOptionsCate([]);
                          setOutputValueCate("");
                          setSelectedOutputOptionsCate([]);
                          setEthernetPortsValueCate("");
                          setSelectedEthernetPortsOptionsCate([]);
                          setDistanceValueCate("");
                          setSelectedDistanceOptionsCate([]);
                          setSlotValueCate("");
                          setSelectedSlotOptionsCate([]);
                          setNoOfChannelsValueCate("");
                          setSelectedNoOfChannelsOptionsCate([]);
                          setColoursValueCate("");
                          setSelectedColoursOptionsCate([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Component<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={filteredSubComponent}
                        placeholder="Please Select Sub Component"
                        value={{
                          label: assetSpecGrping.subcomponent,
                          value: assetSpecGrping.subcomponent,
                        }}
                        onChange={(e) => {
                          setAssetSpecGrping({
                            ...assetSpecGrping,
                            subcomponent: e.value,
                          });
                          setTypeValueCate("");
                          setSelectedTypeOptionsCate([]);
                          setModelValueCate("");
                          setSelectedModelOptionsCate([]);
                          setSizeValueCate("");
                          setSelectedSizeOptionsCate([]);
                          setVariantValueCate("");
                          setSelectedVariantOptionsCate([]);
                          setBrandValueCate("");
                          setSelectedBrandOptionsCate([]);
                          setCapacityValueCate("");
                          setSelectedCapacityOptionsCate([]);
                          setPanelTypeValueCate("");
                          setSelectedPanelTypeOptionsCate([]);
                          setScreenResolutionValueCate("");
                          setSelectedScreenResolutionOptionsCate([]);
                          setConnectivityValueCate("");
                          setSelectedConnectivityOptionsCate([]);
                          setDataRateValueCate("");
                          setSelectedDataRateOptionsCate([]);
                          setCompatibleDevicesValueCate("");
                          setSelectedCompatibleDevicesOptionsCate([]);
                          setOutputPowerValueCate("");
                          setSelectedOutputPowerOptionsCate([]);
                          setCoolingFanCountValueCate("");
                          setSelectedCoolingFanCountOptionsCate([]);
                          setClockSpeedValueCate("");
                          setSelectedClockSpeedOptionsCate([]);
                          setCoreValueCate("");
                          setSelectedCoreOptionsCate([]);
                          setSpeedValueCate("");
                          setSelectedSpeedOptionsCate([]);
                          setFrequencyValueCate("");
                          setSelectedFrequencyOptionsCate([]);
                          setOutputValueCate("");
                          setSelectedOutputOptionsCate([]);
                          setEthernetPortsValueCate("");
                          setSelectedEthernetPortsOptionsCate([]);
                          setDistanceValueCate("");
                          setSelectedDistanceOptionsCate([]);
                          setSlotValueCate("");
                          setSelectedSlotOptionsCate([]);
                          setNoOfChannelsValueCate("");
                          setSelectedNoOfChannelsOptionsCate([]);
                          setColoursValueCate("");
                          setSelectedColoursOptionsCate([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {subcomponentData.type && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={typeOption}
                        value={selectedTypeOptionsCate}
                        onChange={handleTypeChange}
                        valueRenderer={customValueRendererType}
                        labelledBy="Please Select Type"
                      />
                    </Grid>
                  )}
                  {subcomponentData.model && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Model<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={modelOption}
                        value={selectedModelOptionsCate}
                        onChange={handleModelChange}
                        valueRenderer={customValueRendererModel}
                        labelledBy="Please Select Model"
                      />
                    </Grid>
                  )}
                  {subcomponentData.size && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Size<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={sizeOption}
                        value={selectedSizeOptionsCate}
                        onChange={handleSizeChange}
                        valueRenderer={customValueRendererSize}
                        labelledBy="Please Select Size"
                      />
                    </Grid>
                  )}
                  {subcomponentData.variant && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Variant<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={variantOption}
                        value={selectedVariantOptionsCate}
                        onChange={handleVariantChange}
                        valueRenderer={customValueRendererVariant}
                        labelledBy="Please Select Variant"
                      />
                    </Grid>
                  )}
                  {subcomponentData.brand && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Brand<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={brandOption}
                        value={selectedBrandOptionsCate}
                        onChange={handleBrandChange}
                        valueRenderer={customValueRendererBrand}
                        labelledBy="Please Select Brand"
                      />
                    </Grid>
                  )}
                  {subcomponentData.capacity && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Capacity<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={capacityOption}
                        value={selectedCapacityOptionsCate}
                        onChange={handleCapacityChange}
                        valueRenderer={customValueRendererCapacity}
                        labelledBy="Please Select Capacity"
                      />
                    </Grid>
                  )}
                  {subcomponentData.paneltypescreen && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Panel Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={panelTypeOption}
                        value={selectedPanelTypeOptionsCate}
                        onChange={handlePanelTypeChange}
                        valueRenderer={customValueRendererPanelType}
                        labelledBy="Please Select Panel Type"
                      />
                    </Grid>
                  )}
                  {subcomponentData.resolution && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Screen Resolution<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={screenResolutionOption}
                        value={selectedScreenResolutionOptionsCate}
                        onChange={handleScreenResolutionChange}
                        valueRenderer={customValueRendererScreenResolution}
                        labelledBy="Please Select Screen Resolution"
                      />
                    </Grid>
                  )}
                  {subcomponentData.connectivity && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Connectivity<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={connectivityOption}
                        value={selectedConnectivityOptionsCate}
                        onChange={handleConnectivityChange}
                        valueRenderer={customValueRendererConnectivity}
                        labelledBy="Please Select Connectivity"
                      />
                    </Grid>
                  )}
                  {subcomponentData.daterate && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Data Rate<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={dataRateOption}
                        value={selectedDataRateOptionsCate}
                        onChange={handleDataRateChange}
                        valueRenderer={customValueRendererDataRate}
                        labelledBy="Please Select Data Rate"
                      />
                    </Grid>
                  )}
                  {subcomponentData.compatibledevice && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Compatible Devices<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={compatibleDevicesOption}
                        value={selectedCompatibleDevicesOptionsCate}
                        onChange={handleCompatibleDevicesChange}
                        valueRenderer={customValueRendererCompatibleDevices}
                        labelledBy="Please Select Compatible Devices"
                      />
                    </Grid>
                  )}
                  {subcomponentData.outputpower && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Output Power<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={outputPowerOption}
                        value={selectedOutputPowerOptionsCate}
                        onChange={handleOutputPowerChange}
                        valueRenderer={customValueRendererOutputPower}
                        labelledBy="Please Select Output Power"
                      />
                    </Grid>
                  )}
                  {subcomponentData.collingfancount && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Cooling Fan Count<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={coolingFanCountOption}
                        value={selectedCoolingFanCountOptionsCate}
                        onChange={handleCoolingFanCountChange}
                        valueRenderer={customValueRendererCoolingFanCount}
                        labelledBy="Please Select Cooling Fan Count"
                      />
                    </Grid>
                  )}
                  {subcomponentData.clockspeed && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Clock Speed<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={clockSpeeedOption}
                        value={selectedClockSpeedOptionsCate}
                        onChange={handleClockSpeedChange}
                        valueRenderer={customValueRendererClockSpeed}
                        labelledBy="Please Select Clock Speed"
                      />
                    </Grid>
                  )}
                  {subcomponentData.core && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Core<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={coreOption}
                        value={selectedCoreOptionsCate}
                        onChange={handleCoreChange}
                        valueRenderer={customValueRendererCore}
                        labelledBy="Please Select Core"
                      />
                    </Grid>
                  )}
                  {subcomponentData.speed && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Speed<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={speedOption}
                        value={selectedSpeedOptionsCate}
                        onChange={handleSpeedChange}
                        valueRenderer={customValueRendererSpeed}
                        labelledBy="Please Select Speed"
                      />
                    </Grid>
                  )}
                  {subcomponentData.frequency && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Frequency<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={frequencyOption}
                        value={selectedFrequencyOptionsCate}
                        onChange={handleFrequencyChange}
                        valueRenderer={customValueRendererFrequency}
                        labelledBy="Please Select Frequency"
                      />
                    </Grid>
                  )}
                  {subcomponentData.output && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Output<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={outputOption}
                        value={selectedOutputOptionsCate}
                        onChange={handleOutputChange}
                        valueRenderer={customValueRendererOutput}
                        labelledBy="Please Select Output"
                      />
                    </Grid>
                  )}
                  {subcomponentData.ethernetports && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Ethernet Ports<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={ethernetPortsOption}
                        value={selectedEthernetPortsOptionsCate}
                        onChange={handleEthernetPortsChange}
                        valueRenderer={customValueRendererEthernetPorts}
                        labelledBy="Please Select Ethernet Ports"
                      />
                    </Grid>
                  )}
                  {subcomponentData.distance && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Distance<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={distanceOption}
                        value={selectedDistanceOptionsCate}
                        onChange={handleDistanceChange}
                        valueRenderer={customValueRendererDistance}
                        labelledBy="Please Select Distance"
                      />
                    </Grid>
                  )}
                  {subcomponentData.lengthname && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Length<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={lengthOption}
                        value={selectedLengthOptionsCate}
                        onChange={handleLengthChange}
                        valueRenderer={customValueRendererLength}
                        labelledBy="Please Select Length"
                      />
                    </Grid>
                  )}
                  {subcomponentData.slot && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Slot<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={slotOption}
                        value={selectedSlotOptionsCate}
                        onChange={handleSlotChange}
                        valueRenderer={customValueRendererSlot}
                        labelledBy="Please Select Slot"
                      />
                    </Grid>
                  )}
                  {subcomponentData.noofchannels && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        No Of Channels<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={noOfChannelsOption}
                        value={selectedNoOfChannelsOptionsCate}
                        onChange={handleNoOfChannelsChange}
                        valueRenderer={customValueRendererNoOfChannels}
                        labelledBy="Please Select No Of Channels"
                      />
                    </Grid>
                  )}
                  {subcomponentData.colours && (
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography>
                        Colours<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={coloursOption}
                        value={selectedColoursOptionsCate}
                        onChange={handleColoursChange}
                        valueRenderer={customValueRendererColours}
                        labelledBy="Please Select Colours"
                      />
                    </Grid>
                  )}
                </>
              </Grid>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />

                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  {/* <Button variant="contained"
                    onClick={handleSubmit}
                  >
                    {" "}
                    Submit
                  </Button> */}
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}


                  >
                    Submit
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />
      {/* ****** Table Start ****** */}
      {!loader ? (
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
        <>
          {isUserRoleCompare?.includes("lassetspecificationgrouping") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Asset Specification Grouping List
                </Typography>
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
                      <MenuItem value={assetSpecGrpingArray?.length}>
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
                    {isUserRoleCompare?.includes(
                      "excelassetspecificationgrouping"
                    ) && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchAssetSpecificationGrouping();
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
                      "csvassetspecificationgrouping"
                    ) && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchAssetSpecificationGrouping();
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
                      "printassetspecificationgrouping"
                    ) && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes(
                      "pdfassetspecificationgrouping"
                    ) && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true);
                              // fetchAssetSpecificationGrouping();
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes(
                      "imageassetspecificationgrouping"
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
                <Grid item md={2} xs={12} sm={12}>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={assetSpecGrpingArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={assetSpecGrpingArray}
                  />
                </Grid>
              </Grid>
              <br />
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
              {/* {isUserRoleCompare?.includes("bdassetspecificationgrouping") && (
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )} */}
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
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
                        itemsList={assetSpecGrpingArray}
                      />
                    </>
                  </Box>
                </>
              </Box>
            </Box>
          )}
        </>
      )}
      {/* ****** Table End ****** */}
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
        fullWidth={true}
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Asset Specification Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Material</Typography>
                  <Typography>{assetSpecGrpingEdit.assetmaterial}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Component</Typography>
                  <Typography>{assetSpecGrpingEdit.component}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Component</Typography>
                  <Typography>{assetSpecGrpingEdit.subcomponent}</Typography>
                </FormControl>
              </Grid>
              {subcomponentDataEdit.type && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Type</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.type
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.model && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Model</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.model
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.size && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Size</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.size
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.variant && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Variant</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.variant
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.brand && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Brand</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.brand
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.capacity && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Capacity</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.capacity
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.paneltypescreen && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Panel Type</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.paneltype
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.resolution && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Screen Resolution</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.screenresolution
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.connectivity && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Connectivity</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.connectivity
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.daterate && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Data Rate</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.datarate?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.compatibledevice && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Compatible Devices</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.compatibledevices
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.outputpower && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Output Power</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.outputpower
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.collingfancount && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Cooling Fan Count</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.coolingfancount
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.clockspeed && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Clock Speed</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.clockspeed
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.core && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Core</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.core
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.speed && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Speed</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.speed
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.frequency && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Frequency</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.frequency
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.output && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Output</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.output
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.ethernetports && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Ethernet Ports</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.ethernetports
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.distance && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Distance</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.distance
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.lengthname && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Length</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.lengthname
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.slot && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Slot</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.slot
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.noofchannels && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">No Of Channels</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.noofchannels
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
              {subcomponentDataEdit.colours && (
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Colours</Typography>
                    <Typography>
                      {assetSpecGrpingEdit?.colours
                        ?.map((t, i) => t)
                        .join(", ")
                        .toString()}
                    </Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}

        //   sx={{
        //     overflow: 'visible',
        //     '& .MuiPaper-root': {
        //         overflow: 'visible',
        //     },
        // }}
        >
          <Box sx={{ padding: "20px 50px", height: "400px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Asset Specification Grouping
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={assetMaterialOption}
                      placeholder="Please Select Asset Material"
                      value={{
                        label:
                          assetSpecGrpingEdit.assetmaterial === ""
                            ? "Please Select Asset Material"
                            : assetSpecGrpingEdit.assetmaterial,
                        value:
                          assetSpecGrpingEdit.assetmaterial === ""
                            ? "Please Select Asset Material"
                            : assetSpecGrpingEdit.assetmaterial,
                      }}
                      onChange={(e) => {
                        setAssetSpecGrpingEdit({
                          ...assetSpecGrpingEdit,
                          assetmaterial: e.value,
                          component: "Please Select Component",
                          subcomponent: "Please Select Sub Component",
                        });
                        setTypeValueCateEdit("");
                        setSelectedTypeOptionsCateEdit([]);
                        setModelValueCateEdit("");
                        setSelectedModelOptionsCateEdit([]);
                        setSizeValueCateEdit("");
                        setSelectedSizeOptionsCateEdit([]);
                        setVariantValueCateEdit("");
                        setSelectedVariantOptionsCateEdit([]);
                        setBrandValueCateEdit("");
                        setSelectedBrandOptionsCateEdit([]);
                        setCapacityValueCateEdit("");
                        setSelectedCapacityOptionsCateEdit([]);
                        setPanelTypeValueCateEdit("");
                        setSelectedPanelTypeOptionsCateEdit([]);
                        setScreenResolutionValueCateEdit("");
                        setSelectedScreenResolutionOptionsCateEdit([]);
                        setConnectivityValueCateEdit("");
                        setSelectedConnectivityOptionsCateEdit([]);
                        setDataRateValueCateEdit("");
                        setSelectedDataRateOptionsCateEdit([]);
                        setCompatibleDevicesValueCateEdit("");
                        setSelectedCompatibleDevicesOptionsCateEdit([]);
                        setOutputPowerValueCateEdit("");
                        setSelectedOutputPowerOptionsCateEdit([]);
                        setCoolingFanCountValueCateEdit("");
                        setSelectedCoolingFanCountOptionsCateEdit([]);
                        setClockSpeedValueCateEdit("");
                        setSelectedClockSpeedOptionsCateEdit([]);
                        setCoreValueCateEdit("");
                        setSelectedCoreOptionsCateEdit([]);
                        setSpeedValueCateEdit("");
                        setSelectedSpeedOptionsCateEdit([]);
                        setFrequencyValueCateEdit("");
                        setSelectedFrequencyOptionsCateEdit([]);
                        setOutputValueCateEdit("");
                        setSelectedOutputOptionsCateEdit([]);
                        setEthernetPortsValueCateEdit("");
                        setSelectedEthernetPortsOptionsCateEdit([]);
                        setDistanceValueCateEdit("");
                        setSelectedDistanceOptionsCateEdit([]);
                        setSlotValueCateEdit("");
                        setSelectedSlotOptionsCateEdit([]);
                        setNoOfChannelsValueCateEdit("");
                        setSelectedNoOfChannelsOptionsCateEdit([]);
                        setColoursValueCateEdit("");
                        setSelectedColoursOptionsCateEdit([]);
                        setLengthValueCateEdit("");
                        setSelectedLengthOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Component<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredComponentEdit}
                      placeholder="Please Select Component"
                      value={{
                        label:
                          assetSpecGrpingEdit.component === ""
                            ? "Please Select Component"
                            : assetSpecGrpingEdit.component,
                        value:
                          assetSpecGrpingEdit.component === ""
                            ? "Please Select Component"
                            : assetSpecGrpingEdit.component,
                      }}
                      onChange={(e) => {
                        setAssetSpecGrpingEdit({
                          ...assetSpecGrpingEdit,
                          component: e.value,
                          subcomponent: "Please Select Sub Component",
                        });
                        setTypeValueCateEdit("");
                        setSelectedTypeOptionsCateEdit([]);
                        setModelValueCateEdit("");
                        setSelectedModelOptionsCateEdit([]);
                        setSizeValueCateEdit("");
                        setSelectedSizeOptionsCateEdit([]);
                        setVariantValueCateEdit("");
                        setSelectedVariantOptionsCateEdit([]);
                        setBrandValueCateEdit("");
                        setSelectedBrandOptionsCateEdit([]);
                        setCapacityValueCateEdit("");
                        setSelectedCapacityOptionsCateEdit([]);
                        setPanelTypeValueCateEdit("");
                        setSelectedPanelTypeOptionsCateEdit([]);
                        setScreenResolutionValueCateEdit("");
                        setSelectedScreenResolutionOptionsCateEdit([]);
                        setConnectivityValueCateEdit("");
                        setSelectedConnectivityOptionsCateEdit([]);
                        setDataRateValueCateEdit("");
                        setSelectedDataRateOptionsCateEdit([]);
                        setCompatibleDevicesValueCateEdit("");
                        setSelectedCompatibleDevicesOptionsCateEdit([]);
                        setOutputPowerValueCateEdit("");
                        setSelectedOutputPowerOptionsCateEdit([]);
                        setCoolingFanCountValueCateEdit("");
                        setSelectedCoolingFanCountOptionsCateEdit([]);
                        setClockSpeedValueCateEdit("");
                        setSelectedClockSpeedOptionsCateEdit([]);
                        setCoreValueCateEdit("");
                        setSelectedCoreOptionsCateEdit([]);
                        setSpeedValueCateEdit("");
                        setSelectedSpeedOptionsCateEdit([]);
                        setFrequencyValueCateEdit("");
                        setSelectedFrequencyOptionsCateEdit([]);
                        setOutputValueCateEdit("");
                        setSelectedOutputOptionsCateEdit([]);
                        setEthernetPortsValueCateEdit("");
                        setSelectedEthernetPortsOptionsCateEdit([]);
                        setDistanceValueCateEdit("");
                        setSelectedDistanceOptionsCateEdit([]);
                        setSlotValueCateEdit("");
                        setSelectedSlotOptionsCateEdit([]);
                        setNoOfChannelsValueCateEdit("");
                        setSelectedNoOfChannelsOptionsCateEdit([]);
                        setColoursValueCateEdit("");
                        setSelectedColoursOptionsCateEdit([]);
                        setLengthValueCateEdit("");
                        setSelectedLengthOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Component<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredSubComponentEdit}
                      placeholder="Please Select Sub Component"
                      value={{
                        label:
                          assetSpecGrpingEdit.subcomponent === ""
                            ? "Please Select Sub Component"
                            : assetSpecGrpingEdit.subcomponent,
                        value:
                          assetSpecGrpingEdit.subcomponent === ""
                            ? "Please Select Sub Component"
                            : assetSpecGrpingEdit.subcomponent,
                      }}
                      onChange={(e) => {
                        setAssetSpecGrpingEdit({
                          ...assetSpecGrpingEdit,
                          subcomponent: e.value,
                        });
                        setTypeValueCateEdit("");
                        setSelectedTypeOptionsCateEdit([]);
                        setModelValueCateEdit("");
                        setSelectedModelOptionsCateEdit([]);
                        setSizeValueCateEdit("");
                        setSelectedSizeOptionsCateEdit([]);
                        setVariantValueCateEdit("");
                        setSelectedVariantOptionsCateEdit([]);
                        setBrandValueCateEdit("");
                        setSelectedBrandOptionsCateEdit([]);
                        setCapacityValueCateEdit("");
                        setSelectedCapacityOptionsCateEdit([]);
                        setPanelTypeValueCateEdit("");
                        setSelectedPanelTypeOptionsCateEdit([]);
                        setScreenResolutionValueCateEdit("");
                        setSelectedScreenResolutionOptionsCateEdit([]);
                        setConnectivityValueCateEdit("");
                        setSelectedConnectivityOptionsCateEdit([]);
                        setDataRateValueCateEdit("");
                        setSelectedDataRateOptionsCateEdit([]);
                        setCompatibleDevicesValueCateEdit("");
                        setSelectedCompatibleDevicesOptionsCateEdit([]);
                        setOutputPowerValueCateEdit("");
                        setSelectedOutputPowerOptionsCateEdit([]);
                        setCoolingFanCountValueCateEdit("");
                        setSelectedCoolingFanCountOptionsCateEdit([]);
                        setClockSpeedValueCateEdit("");
                        setSelectedClockSpeedOptionsCateEdit([]);
                        setCoreValueCateEdit("");
                        setSelectedCoreOptionsCateEdit([]);
                        setSpeedValueCateEdit("");
                        setSelectedSpeedOptionsCateEdit([]);
                        setFrequencyValueCateEdit("");
                        setSelectedFrequencyOptionsCateEdit([]);
                        setOutputValueCateEdit("");
                        setSelectedOutputOptionsCateEdit([]);
                        setEthernetPortsValueCateEdit("");
                        setSelectedEthernetPortsOptionsCateEdit([]);
                        setDistanceValueCateEdit("");
                        setSelectedDistanceOptionsCateEdit([]);
                        setSlotValueCateEdit("");
                        setSelectedSlotOptionsCateEdit([]);
                        setNoOfChannelsValueCateEdit("");
                        setSelectedNoOfChannelsOptionsCateEdit([]);
                        setColoursValueCateEdit("");
                        setSelectedColoursOptionsCateEdit([]);
                        setLengthValueCateEdit("");
                        setSelectedLengthOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {subcomponentDataEdit.type && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={typeOption}
                        value={selectedTypeOptionsCateEdit}
                        onChange={handleTypeChangeEdit}
                        valueRenderer={customValueRendererTypeEdit}
                        labelledBy="Please Select Type"
                      />
                    </FormControl>
                  </Grid>
                )}
                {subcomponentDataEdit.model && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Model<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={modelOption}
                        value={selectedModelOptionsCateEdit}
                        onChange={handleModelChangeEdit}
                        valueRenderer={customValueRendererModelEdit}
                        labelledBy="Please Select Model"
                      />
                    </FormControl>
                  </Grid>
                )}
                {subcomponentDataEdit.size && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Size<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={sizeOption}
                      value={selectedSizeOptionsCateEdit}
                      onChange={handleSizeChangeEdit}
                      valueRenderer={customValueRendererSizeEdit}
                      labelledBy="Please Select Size"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.variant && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Variant<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={variantOption}
                      value={selectedVariantOptionsCateEdit}
                      onChange={handleVariantChangeEdit}
                      valueRenderer={customValueRendererVariantEdit}
                      labelledBy="Please Select Variant"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.brand && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Brand<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={brandOption}
                      value={selectedBrandOptionsCateEdit}
                      onChange={handleBrandChangeEdit}
                      valueRenderer={customValueRendererBrandEdit}
                      labelledBy="Please Select Brand"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.capacity && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Capacity<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={capacityOption}
                      value={selectedCapacityOptionsCateEdit}
                      onChange={handleCapacityChangeEdit}
                      valueRenderer={customValueRendererCapacityEdit}
                      labelledBy="Please Select Capacity"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.paneltypescreen && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Panel Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={panelTypeOption}
                      value={selectedPanelTypeOptionsCateEdit}
                      onChange={handlePanelTypeChangeEdit}
                      valueRenderer={customValueRendererPanelTypeEdit}
                      labelledBy="Please Select Panel Type"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.resolution && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Screen Resolution<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={screenResolutionOption}
                      value={selectedScreenResolutionOptionsCateEdit}
                      onChange={handleScreenResolutionChangeEdit}
                      valueRenderer={customValueRendererScreenResolutionEdit}
                      labelledBy="Please Select Screen Resolution"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.connectivity && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Connectivity<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={connectivityOption}
                      value={selectedConnectivityOptionsCateEdit}
                      onChange={handleConnectivityChangeEdit}
                      valueRenderer={customValueRendererConnectivityEdit}
                      labelledBy="Please Select Connectivity"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.daterate && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Data Rate<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={dataRateOption}
                      value={selectedDataRateOptionsCateEdit}
                      onChange={handleDataRateChangeEdit}
                      valueRenderer={customValueRendererDataRateEdit}
                      labelledBy="Please Select Data Rate"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.compatibledevice && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Compatible Devices<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={compatibleDevicesOption}
                      value={selectedCompatibleDevicesOptionsCateEdit}
                      onChange={handleCompatibleDevicesChangeEdit}
                      valueRenderer={customValueRendererCompatibleDevicesEdit}
                      labelledBy="Please Select Compatible Devices"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.outputpower && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Output Power<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={outputPowerOption}
                      value={selectedOutputPowerOptionsCateEdit}
                      onChange={handleOutputPowerChangeEdit}
                      valueRenderer={customValueRendererOutputPowerEdit}
                      labelledBy="Please Select Output Power"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.collingfancount && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Cooling Fan Count<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={coolingFanCountOption}
                      value={selectedCoolingFanCountOptionsCateEdit}
                      onChange={handleCoolingFanCountChangeEdit}
                      valueRenderer={customValueRendererCoolingFanCountEdit}
                      labelledBy="Please Select Cooling Fan Count"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.clockspeed && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Clock Speed<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={clockSpeeedOption}
                      value={selectedClockSpeedOptionsCateEdit}
                      onChange={handleClockSpeedChangeEdit}
                      valueRenderer={customValueRendererClockSpeedEdit}
                      labelledBy="Please Select Clock Speed"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.core && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Core<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={coreOption}
                      value={selectedCoreOptionsCateEdit}
                      onChange={handleCoreChangeEdit}
                      valueRenderer={customValueRendererCoreEdit}
                      labelledBy="Please Select Core"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.speed && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Speed<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={speedOption}
                      value={selectedSpeedOptionsCateEdit}
                      onChange={handleSpeedChangeEdit}
                      valueRenderer={customValueRendererSpeedEdit}
                      labelledBy="Please Select Speed"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.frequency && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={frequencyOption}
                      value={selectedFrequencyOptionsCateEdit}
                      onChange={handleFrequencyChangeEdit}
                      valueRenderer={customValueRendererFrequencyEdit}
                      labelledBy="Please Select Frequency"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.output && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Output<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={outputOption}
                      value={selectedOutputOptionsCateEdit}
                      onChange={handleOutputChangeEdit}
                      valueRenderer={customValueRendererOutputEdit}
                      labelledBy="Please Select Output"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.ethernetports && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Ethernet Ports<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={ethernetPortsOption}
                      value={selectedEthernetPortsOptionsCateEdit}
                      onChange={handleEthernetPortsChangeEdit}
                      valueRenderer={customValueRendererEthernetPortsEdit}
                      labelledBy="Please Select Ethernet Ports"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.distance && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Distance<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={distanceOption}
                      value={selectedDistanceOptionsCateEdit}
                      onChange={handleDistanceChangeEdit}
                      valueRenderer={customValueRendererDistanceEdit}
                      labelledBy="Please Select Distance"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.lengthname && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Length<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={lengthOption}
                      value={selectedLengthOptionsCateEdit}
                      onChange={handleLengthChangeEdit}
                      valueRenderer={customValueRendererLengthEdit}
                      labelledBy="Please Select Length"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.slot && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Slot<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={slotOption}
                      value={selectedSlotOptionsCateEdit}
                      onChange={handleSlotChangeEdit}
                      valueRenderer={customValueRendererSlotEdit}
                      labelledBy="Please Select Slot"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.noofchannels && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      No Of Channels<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={noOfChannelsOption}
                      value={selectedNoOfChannelsOptionsCateEdit}
                      onChange={handleNoOfChannelsChangeEdit}
                      valueRenderer={customValueRendererNoOfChannelsEdit}
                      labelledBy="Please Select No Of Channels"
                    />
                  </Grid>
                )}
                {subcomponentDataEdit.colours && (
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Colours<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={coloursOption}
                      value={selectedColoursOptionsCateEdit}
                      onChange={handleColoursChangeEdit}
                      valueRenderer={customValueRendererColoursEdit}
                      labelledBy="Please Select Colours"
                    />
                  </Grid>
                )}
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
        itemsTwo={assetSpecGrpingArray ?? []}
        filename={"AssetSpecificationGrouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Specification Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProcess}
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



      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title"
        maxWidth="lg" aria-describedby="alert-dialog-description"
        sx={{ marginTop: "95px" }}
      >
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [
                { check: checkassetdetail?.length > 0, label: "Asset Details List" },
                { check: checkstock?.length > 0, label: "Stock Purchase" },
                { check: checkmanualstock?.length > 0, label: "Manual Stock Entry" },
              ];

              // Filter out the true conditions
              const linkedItems = conditions.filter((item) => item.check);

              // Build the message dynamically
              if (linkedItems.length > 0) {
                const linkedLabels = linkedItems.map((item) => item.label).join(", ");
                return (
                  <>
                    {checkassetdetail?.length > 0 ? (
                      <>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                            id="jobopening"
                          >
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                {Object.keys(checkassetdetail[0]).map((header) => (
                                  <StyledTableCell key={header}>
                                    {header.charAt(0).toUpperCase() + header.slice(1)}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {checkassetdetail.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                  {Object.keys(row).map((key) => (
                                    <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                      {(row[key]?.includes("Please Select") || row[key]?.includes("Choose")) ? "No Value" : row[key]} {/* Show '-' for missing values */}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                          was linked in {"Asset Details List"}
                        </Typography>
                      </>
                    ) : null}


                    {checkstock?.length > 0 ? (
                      <>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                            id="jobopening"
                          >
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                {Object.keys(checkstock[0]).map((header) => (
                                  <StyledTableCell key={header}>
                                    {header.charAt(0).toUpperCase() + header.slice(1)}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {checkstock.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                  {Object.keys(row).map((key) => (
                                    <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                      {(row[key]?.includes("Please Select") || row[key]?.includes("Choose")) ? "No Value" : row[key]} {/* Show '-' for missing values */}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                          was linked in {"Stock Purchase"}
                        </Typography>
                      </>
                    ) : null}

                    {checkmanualstock?.length > 0 ? (
                      <>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                            id="jobopening"
                          >
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                {Object.keys(checkmanualstock[0]).map((header) => (
                                  <StyledTableCell key={header}>
                                    {header.charAt(0).toUpperCase() + header.slice(1)}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {checkmanualstock.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                  {Object.keys(row).map((key) => (
                                    <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                      {(row[key]?.includes("Please Select") || row[key]?.includes("Choose")) ? "No Value" : row[key]} {/* Show '-' for missing values */}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                          was linked in {"Manual Stock Entry"}
                        </Typography>
                      </>
                    ) : null}



                  </>
                );
              } else {
                // Default empty message if no conditions are true
                return "";
              }
            })()}
          </Typography>


        </DialogContent>
        <DialogActions>
          < Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>


      <Box>
        <Dialog
          open={isErrorOpenpop.open}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          sx={{ marginTop: "95px" }}
        >
          <DialogContent
            sx={{ textAlign: "center", alignItems: "center" }}
          >
            {/* <Typography variant="h6">{showAlertpop}</Typography> */}
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              {(() => {
                // Mapping of conditions and their corresponding labels
                const conditions = [
                  { check: checkassetdetailedit?.length > 0, label: "Asset Details List" },
                  { check: checkstockedit?.length > 0, label: "Stock Purchase" },
                  { check: checkmanualstockedit?.length > 0, label: "Manual Stock Entry" },
                ];

                // Filter out the true conditions
                const linkedItems = conditions.filter((item) => item.check);

                // Build the message dynamically
                if (linkedItems.length > 0) {
                  const keysToKeepStock = new Set();

                  return (
                    <>
                      {checkstockedit?.length > 0 ? (
                        <>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 700 }}
                              aria-label="customized table"
                              id="jobopening"
                            >
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                  {Object.keys(checkstockedit[0]).map((header) => (
                                    <StyledTableCell key={header}>
                                      {header.charAt(0).toUpperCase() + header.slice(1)}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {checkstockedit.map((row, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                    {Object.keys(row).map((key) => (
                                      <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                        {row[key] ?? '-'} {/* Show '-' for missing values */}
                                      </StyledTableCell>
                                    ))}
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                            was linked in {"Stock Purchase"}
                          </Typography>
                        </>
                      ) : null}
                      {checkassetdetailedit?.length > 0 ? (
                        <>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 700 }}
                              aria-label="customized table"
                              id="jobopening"
                            >
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                  {Object.keys(checkassetdetailedit[0]).map((header) => (
                                    <StyledTableCell key={header}>
                                      {header.charAt(0).toUpperCase() + header.slice(1)}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {checkassetdetailedit.map((row, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                    {Object.keys(row).map((key) => (
                                      <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                        {row[key] ?? '-'} {/* Show '-' for missing values */}
                                      </StyledTableCell>
                                    ))}
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                            was linked in {"Asset Details List"}
                          </Typography>
                        </>
                      ) : null}




                      {checkmanualstockedit?.length > 0 ? (
                        <>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 700 }}
                              aria-label="customized table"
                              id="jobopening"
                            >
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>#</StyledTableCell> {/* For row index */}
                                  {Object.keys(checkmanualstockedit[0]).map((header) => (
                                    <StyledTableCell key={header}>
                                      {header.charAt(0).toUpperCase() + header.slice(1)}
                                    </StyledTableCell>
                                  ))}
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {checkmanualstockedit.map((row, index) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                    {Object.keys(row).map((key) => (
                                      <StyledTableCell key={key} sx={{ padding: "10px" }}>
                                        {row[key] ?? '-'} {/* Show '-' for missing values */}
                                      </StyledTableCell>
                                    ))}
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Typography variant="body2" sx={{ marginTop: 2, fontWeight: 700 }}>
                            was linked in {"Manual Stock Entry"}
                          </Typography>
                        </>
                      ) : null}


                      <Typography>whether you want to do changes ..?</Typography>
                    </>
                  );
                } else {
                  // Default empty message if no conditions are true
                  return "";
                }
              })()}
            </Typography>

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
                sendEditRequest(isErrorOpenpop.data);
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


    </Box>
  );
}

export default AssetSpecificationGrouping;
