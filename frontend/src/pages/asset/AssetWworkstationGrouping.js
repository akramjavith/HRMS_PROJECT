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
import { Box, Typography, OutlinedInput, TableBody, Radio, InputAdornment, RadioGroup, Tooltip, FormGroup, FormControlLabel, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
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
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import domtoimage from 'dom-to-image';
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";


function AssetWorkStationGrouping() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const [filteteredip, SetFilteredIp] = useState([])
  const [projectCheck1, setProjectCheck1] = useState(false);


  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
  const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);


  //branch multiselect dropdown changes
  const handleCompanyChangeFrom = (options) => {
    setSelectedCompanyFrom(options);
    setSelectedBranchFrom([]);
    setSelectedUnitFrom([])
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };



  //branch multiselect dropdown changes
  const handleBranchChangeFrom = (options) => {
    setSelectedBranchFrom(options);
    setSelectedUnitFrom([])
  };
  const customValueRendererBranchFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //branch multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedUnitFrom(options);
  };
  const customValueRendererUnitFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
  };


  const [selectedCompanyFromCreate, setSelectedCompanyFromCreate] = useState([]);
  const [selectedBranchFromCreate, setSelectedBranchFromCreate] = useState([]);
  const [selectedUnitFromCreate, setSelectedUnitFromCreate] = useState([]);
  const [selectedFloorFromCreate, setSelectedFloorFromCreate] = useState([]);
  const [selectedAreaFromCreate, setSelectedAreaFromCreate] = useState([]);
  const [selectedLocationFromCreate, setSelectedLocationFromCreate] = useState([]);



  //branch multiselect dropdown changes
  const handleCompanyChangeFromCreate = (options) => {
    setSelectedCompanyFromCreate(options);
    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });


    setSelectedBranchFromCreate([]);
    setSelectedUnitFromCreate([])
    setSelectedAreaFromCreate([]);
    setSelectedUnitFromCreate([])
    setSelectedFloorFromCreate([])
    setSelectedLocationFromCreate([])
    setSelectedOptionsMaterial([]);
    setSelectedOptionsComponent([])
    setValueComponentCat([]);
    setFloors([])
    setAreas([])
    setAssetdetails([])
  };
  const customValueRendererCompanyFromCreate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Company";
  };



  //branch multiselect dropdown changes
  const handleBranchChangeFromCreate = (options) => {
    const selectedValues = options.map((a) => a.value);
    setSelectedBranchFromCreate(options);
    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });
    setSelectedUnitFromCreate([])
    setSelectedAreaFromCreate([]);
    setSelectedFloorFromCreate([])
    setLocations([{ label: "ALL", value: "ALL" }]);
    setAreas([])
    fetchFloor(selectedValues);
    setSelectedOptionsMaterial([]);
    setSelectedOptionsComponent([])
    setAssetdetails([])
  };
  const customValueRendererBranchFromCreate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  //branch multiselect dropdown changes
  const handleUnitChangeFromCreate = (options) => {
    setSelectedUnitFromCreate(options);
    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });
    setSelectedAreaFromCreate([]);
    setAssetdetails([])
    setSelectedOptionsComponent([])
    setSelectedFloorFromCreate([])
    setLocations([{ label: "ALL", value: "ALL" }]);
  };
  const customValueRendererUnitFromCreate = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
  };


  const handleFloorChangeFromCreate = (options) => {
    const selectedValues = options.map((a) => a.value);
    setSelectedFloorFromCreate(options);

    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });
    setSelectedOptionsMaterial([]);
    setSelectedOptionsComponent([])
    setAreas([])
    setAssetdetails([])
    setLocations([{ label: "ALL", value: "ALL" }]);
    fetchArea(selectedValues);
  };
  const customValueRendererFloorFromCreate = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Floor";
  };



  const handleAreaChangeFromCreate = (options) => {
    const selectedValues = options.map((a) => a.value);

    setSelectedAreaFromCreate(options);
    setSelectedOptionsComponent([])
    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });
    fetchLocation(selectedValues);
    setAssetdetails([])
  };
  const customValueRendererAreaFromCreate = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Area";
  };


  const handleLocationChangeFromCreate = (options) => {
    setSelectedLocationFromCreate(options);
    // setSelectedOptionsComponent([])
    setMaintentancemaster({
      ...maintentancemaster,
      assetmaterial: "Please Select Material",
    });
    // setAssetdetails([])
  };
  const customValueRendererLocationFromCreate = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Location";
  };







  const [filteredRowDataNear, setFilteredRowDataNear] = useState([]);
  const [filteredChangesNear, setFilteredChangesNear] = useState(null);
  const [searchedStringNear, setSearchedStringNear] = useState("");
  const [isHandleChangeNear, setIsHandleChangeNear] = useState(false);
  const gridRefTableImgNear = useRef(null);
  const gridRefTableNear = useRef(null);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletecheck, setdeletecheck] = useState(false);


  const [overallFilterdataNear, setOverallFilterdataNear] = useState([]);
  const [totalProjectsNear, setTotalProjectsNear] = useState(0);
  const [totalPagesNearTatPrimary, setTotalPagesNear] = useState(0);
  const [deletecheckNear, setdeletecheckNear] = useState(false);


  const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");

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





  // State to track advanced filter
  const [advancedFilterNear, setAdvancedFilterNear] = useState(null);
  const [gridApiNear, setGridApiNear] = useState(null);
  const [columnApiNear, setColumnApiNear] = useState(null);
  const [filteredDataItemsNear, setFilteredDataItemsNear] = useState([]);
  //  const [filteredRowData, setFilteredRowData] = useState([]);
  const [logicOperatorNear, setLogicOperatorNear] = useState("AND");

  const [selectedColumnNear, setSelectedColumnNear] = useState("");
  const [selectedConditionNear, setSelectedConditionNear] = useState("Contains");
  const [filterValueNear, setFilterValueNear] = useState("");
  const [additionalFiltersNear, setAdditionalFiltersNear] = useState([]);
  const [isSearchActiveNear, setIsSearchActiveNear] = useState(false);
  const conditionsNear = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions







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
    setloadingdeloverall(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Work Station",
    "Material",
    "Asset Mmaterial",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "workstation",
    "assetmaterial",
    "component",
  ];

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const gridRef = useRef(null);
  const gridRefNeartat = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsNear, setSelectedRowsNear] = useState([]);
  const [itemsneartat, setItemsNearTat] = useState([]);

  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [assetdetails, setAssetdetails] = useState([]);
  // console.log(assetdetails, "assetde")
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);

  const [areas, setAreas] = useState([]);
  // const [locations, setLocations] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);


  const [individualasset, setIndividualAsset] = useState([]);
  const [uniqueid, setUniqueid] = useState(0);
  const [idgrpedit, setidgrpedit] = useState([]);
  const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);

  const getRowClassNameNearTat = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const handleCaptureImagenear = () => {

    if (gridRefTableImgNear.current) {
      domtoimage.toBlob(gridRefTableImgNear.current)
        .then((blob) => {
          saveAs(blob, "Asset Workstation Grouping Individual.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChangeNear = (newSelection) => {
    setSelectedRowsNear(newSelection.selectionModel);
  };

  const [materialOpt, setMaterialopt] = useState([]);

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //component multiselect
  const [selectedOptionsComponent, setSelectedOptionsComponent] = useState([]);
  let [valueComponentCat, setValueComponentCat] = useState([]);
  const [
    selectedComponentOptionsCateEdit,
    setSelectedComponentOptionsCateEdit,
  ] = useState([]);
  const [ComponentValueCateEdit, setComponentValueCateEdit] = useState([]);

  const handleComponentChange = (options) => {
    setValueComponentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsComponent(options);
  };

  const customValueRendererComponent = (valueComponentCat, _categoryname) => {
    return valueComponentCat?.length
      ? valueComponentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material";
  };

  const handleComponentChangeEdit = (options) => {
    setComponentValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedComponentOptionsCateEdit(options);
  };
  const customValueRendererComponentEdit = (
    componentValueCateEdit,
    _employeename
  ) => {
    return componentValueCateEdit?.length
      ? componentValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material";
  };

  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([{ label: "ALL", value: "ALL" }]);

  const [floorsEdit, setFloorEdit] = useState([]);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [maintentancemaster, setMaintentancemaster] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "Please Select Material",
    assetmaterialcheck: "",
    workstation: "Please Select Workstation",
    addedby: "",
    updatedby: "",
  });
  const [maintentance, setMaintentance] = useState([]);

  const [maintentancemasteredit, setMaintentancemasteredit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "Please Select Material",
    assetmaterialcheck: "",
    workstation: "Please Select Workstation",
  });
  const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([]);
  let [valueMaterialCat, setValueMaterialCat] = useState([]);

  const [selectedOptionsMaterialEdit, setSelectedOptionsMaterialEdit] =
    useState([]);

  const fetchAssetDetails = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetails(res_vendor?.data?.assetdetails);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const {
    isUserRoleCompare,
    isUserRoleAccess, pageName, setPageName, buttonStyles,
    isAssignBranch,
    workStationSystemName,
    allUnit,
    allTeam,
    allCompany,
    allBranch,
    allfloor,
    allareagrouping,
    alllocationgrouping,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);


  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
  const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [allProjectedit, setAllProjectedit] = useState([]);

  const [copiedData, setCopiedData] = useState("");

  const handleCaptureImage = () => {

    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Asset Workstation Grouping_Group.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    if (selectedRowsNear.length == 0) {
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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

  const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
  // Manage Columns
  const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] =
    useState(false);
  const [anchorElNeartat, setAnchorElNeartat] = useState(null);
  const handleOpenManageColumnsNeartat = (event) => {
    setAnchorElNeartat(event.currentTarget);
    setManageColumnsOpenNeartat(true);
  };
  const handleCloseManageColumnsNeartat = () => {
    setManageColumnsOpenNeartat(false);
    setSearchQueryManageNeartat("");
  };

  const openneartat = Boolean(anchorElNeartat);
  const idneartat = openneartat ? "simple-popover" : undefined;

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
    floor: true,
    area: true,
    location: true,
    assetmaterial: true,
    subcomponents: true,
    workstation: true,
    subcomponentsstring: true,
    actions: true,
    component: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const initialColumnVisibilityNeartat = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    assetmaterial: true,
    subcomponents: true,
    subcomponentsstring: true,
    workstation: true,
    actions: true,
    component: true,
  };

  const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(
    initialColumnVisibilityNeartat
  );

  //Delete model
  const handleClickOpenNear = () => {
    setIsDeleteOpenNear(true);
  };
  const handleCloseModNear = () => {
    setIsDeleteOpenNear(false);
  };

  //set function to get particular row
  const rowData = async (id, idgrp) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteproject(res?.data?.sassetworkstationgrouping);
      setidgrpedit(idgrp);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //set function to get particular row
  const rowDataNear = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteproject(res?.data?.sassetworkstationgrouping);
      handleClickOpenNear();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      const deletePromises = idgrpedit?.map((item) => {
        return axios.delete(`${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      await Promise.all(deletePromises);
      await fetchMaintentanceIndividualSingle()
      await fetchFilteredDatas();

      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delProjectNear = async () => {
    try {
      await axios.delete(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${projectid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchMaintentanceIndividualSingle()
      await fetchFilteredDatas();
      handleCloseModNear();
      setSelectedRowsNear([]);
      setPageNearTatPrimary(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delProjectcheckbox = async () => {
    try {
      const deletePromises = selectedRowsNear?.map((item) => {
        return axios.delete(`${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchMaintentanceIndividualSingle()
      await fetchFilteredDatas();
      handleCloseModcheckbox();
      setSelectedRowsNear([]);
      setSelectAllCheckedNear(false);
      setPage(1);
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
    let subarray = selectedOptionsMaterial.map((item) => item.value);
    let uniqueval = uniqueid ? uniqueid + 1 : 1;

    try {
      selectedOptionsComponent.map(item =>
        axios.post(`${SERVICE.ASSETWORKSTATIONGROUP_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(item.company),
          branch: String(item.branch),
          unit: String(item.unit),
          floor: String(item.floor),
          location: String(item.location),
          area: String(item.area),

          // subcomponents: subarray,
          assetmaterial: maintentancemaster.assetmaterial,
          component: item.value,
          assetmaterialcheck: maintentancemaster.assetmaterialcheck,
          workstation: maintentancemaster.workstation,
          uniqueid: uniqueval,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        })
      )
      await fetchMaintentanceIndividualSingle()
      // await fetchFilteredDatas();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();

    let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    // setIndividualAsset(res_project?.data?.assetworkstationgrouping);

    const isNameMatch = res_project?.data?.assetworkstationgrouping.some(
      (item) =>
        // item.company === maintentancemaster.company &&
        // item.branch === maintentancemaster.branch &&
        // item.unit === maintentancemaster.unit &&
        // item.floor === maintentancemaster.floor &&
        // item.area === maintentancemaster.area &&
        // item.location === maintentancemaster.location &&
        item.assetmaterial === maintentancemaster.assetmaterial &&
        item.component.some((data) => valueComponentCat.includes(data)) &&
        item.workstation === maintentancemaster.workstation
    );

    const isDuplicateMaterialWorkstation =
      res_project?.data?.assetworkstationgrouping.some(
        (item) =>
          item.assetmaterial === maintentancemaster.assetmaterial &&
          item.component.some((data) => valueComponentCat.includes(data))
      );
    if (selectedCompanyFromCreate.length === 0) {

      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranchFromCreate.length === 0) {

      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnitFromCreate.length === 0) {

      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedFloorFromCreate.length === 0) {

      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedAreaFromCreate.length === 0) {


      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedLocationFromCreate.length === 0) {

      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (maintentancemaster.workstation === "Please Select Workstation") {
      setPopupContentMalert("Please Select Workstation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.assetmaterial === "Please Select Material") {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueComponentCat?.length === 0) {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicateMaterialWorkstation) {
      setPopupContentMalert("Already Added AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setMaintentancemaster({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "Please Select Material",
      workstation: "Please Select Workstation",
      ip: true,
      empdistribution: true,
      ebusage: true,
    });
    setSelectedCompanyFromCreate([])
    setSelectedBranchFromCreate([])
    setSelectedUnitFromCreate([])
    setSelectedFloorFromCreate([])
    setSelectedAreaFromCreate([])
    setSelectedLocationFromCreate([])


    setFilteredWorkStation([]);
    setValueComponentCat([]);
    setSelectedOptionsComponent([]);
    setLocations([{ label: "ALL", value: "ALL" }]);

    setAreas([]);
    setFloors([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setMaintentancemasteredit({
      branch: "",
      equipment: "",
      maintenancedetails: "",
      maintenancefrequency: "",
      maintenancedate: today,
      maintenancetime: "",
      resdepartment: "Please Select Department",
      resteam: "",
      resperson: "",
      fromdate: "",
      todate: "",
      vendor: "Please Select Vendor",
      address: "",
      phone: "",
      email: "",
    });
  };

  const [isEditOpenNear, setIsEditOpenNear] = useState(false);

  //Edit model...
  const handleClickOpenEditNear = () => {
    setIsEditOpenNear(true);
  };
  const handleCloseModEditNear = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenNear(false);
    setSelectedOptionsMaterialEdit([]);
  };

  //get single row to edit....
  const getCodeNear = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const match = workStationSystemName?.find(secObj =>
        secObj.company === res?.data?.sassetworkstationgrouping.company &&
        secObj.branch === res?.data?.sassetworkstationgrouping.branch &&
        secObj.unit === res?.data?.sassetworkstationgrouping.unit &&
        secObj.floor === res?.data?.sassetworkstationgrouping.floor &&
        secObj.cabinname === res?.data?.sassetworkstationgrouping.workstation?.split("(")[0]
      );



      setMaintentancemasteredit({ ...res?.data?.sassetworkstationgrouping, workstationlabel: `${res?.data?.sassetworkstationgrouping?.workstation}(${match.systemshortname})` });

      fetchFloorEdit(res?.data?.sassetworkstationgrouping);

      fetchAreaEdit(
        res?.data?.sassetworkstationgrouping?.branch,
        res?.data?.sassetworkstationgrouping?.floor
      );
      fetchAllLocationEdit(
        res?.data?.sassetworkstationgrouping?.branch,
        res?.data?.sassetworkstationgrouping?.floor,
        res?.data?.sassetworkstationgrouping?.area
      );
      fetchAssetDetails();

      setSelectedOptionsMaterialEdit(
        res?.data?.sassetworkstationgrouping.subcomponents.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setComponentValueCateEdit(
        res?.data?.sassetworkstationgrouping?.component
      );
      setSelectedComponentOptionsCateEdit([
        ...res?.data?.sassetworkstationgrouping?.component.map((t) => ({
          label: t,
          value: t,
        })),
      ]);

      let codeast =
        res?.data?.sassetworkstationgrouping?.assetmaterial.split("-");

      let sub =
        res?.data?.sassetworkstationgrouping?.assetmaterial !== "" &&
        assetdetails.filter(
          (t) =>
            t.material ===
            res?.data?.sassetworkstationgrouping?.assetmaterialcheck
        ) &&
        assetdetails
          .filter(
            (t) =>
              t.material ===
              res?.data?.sassetworkstationgrouping?.assetmaterialcheck &&
              t.code === codeast[1]
          )
          .map((item) => item.subcomponent);

      const mergedArray = sub.reduce((acc, curr) => acc.concat(curr), []);

      const objectsWithMissingName = [];
      if (mergedArray) {
        handleClickOpenEditNear();
        for (let obj of mergedArray) {
          if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
            objectsWithMissingName.push(obj);
          }
        }

        return objectsWithMissingName;

      }
      handleClickOpenEditNear();
      await fetchProjMasterAll();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (
    company,
    branch,
    unit,
    floor,
    area,
    location,
    assetmaterial,
    workstation,
    subcomponentsstring,
    ip,
    ebusage,
    empdistribution,
    component
  ) => {
    try {

      setMaintentancemasteredit({
        ...maintentancemasteredit,
        company: company,
        branch: branch,
        unit: unit,
        floor: floor,
        area: area,
        location: location,
        assetmaterial: assetmaterial,
        workstation: workstation,
        subcomponentsstring: subcomponentsstring,
        ip: ip,
        ebusage: ebusage,
        empdistribution: empdistribution,
        component: component,
      });
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [openviewnear, setOpenviewnear] = useState(false);

  // view model
  const handleClickOpenviewnear = () => {
    setOpenviewnear(true);
  };

  const handleCloseviewnear = () => {
    setOpenviewnear(false);
  };

  const getviewCodeNear = async (
    company,
    branch,
    unit,
    floor,
    area,
    location,
    assetmaterial,
    workstation,
    subcomponentsstring,
    ip,
    ebusage,
    empdistribution,
    component
  ) => {
    try {


      setMaintentancemasteredit({
        ...maintentancemasteredit,
        company: company,
        branch: branch,
        unit: unit,
        floor: floor,
        area: area,
        location: location,
        assetmaterial: assetmaterial,
        workstation: workstation,
        subcomponentsstring: subcomponentsstring,
        ip: ip,
        ebusage: ebusage,
        empdistribution: empdistribution,
        component: component,
      });
      handleClickOpenviewnear();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setMaintentancemasteredit(res?.data?.sassetworkstationgrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = maintentancemasteredit?.updatedby;
  let addedby = maintentancemasteredit?.addedby;

  let maintenanceid = maintentancemasteredit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      const deletePromises = idgrpedit?.map((item) => {
        return axios.delete(`${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      await Promise.all(deletePromises);
      axios.post(`${SERVICE.ASSETWORKSTATIONGROUP_CREATE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(maintentancemasteredit.company),
        branch: String(maintentancemasteredit.branch),
        unit: String(maintentancemasteredit.unit),
        floor: String(maintentancemasteredit.floor),
        location: String(maintentancemasteredit.location),
        area: String(maintentancemasteredit.area),
        assetmaterial: String(maintentancemasteredit.assetmaterial),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestNear = async () => {
    setPageName(!pageName)
    let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
    try {
      let res = await axios.put(
        `${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${maintenanceid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(maintentancemasteredit.company),
          branch: String(maintentancemasteredit.branch),
          unit: String(maintentancemasteredit.unit),
          floor: String(maintentancemasteredit.floor),
          location: String(maintentancemasteredit.location),
          area: String(maintentancemasteredit.area),
          assetmaterial: String(maintentancemasteredit.assetmaterial),
          component: ComponentValueCateEdit,
          assetmaterialcheck: String(maintentancemasteredit.assetmaterialcheck),
          workstation: String(maintentancemasteredit.workstation),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchFilteredDatas();;
      await fetchMaintentanceIndividualSingle()
      await fetchFilteredDatas();
      handleCloseModEditNear();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmitNear = async (e) => {
    e.preventDefault();
    fetchProjMasterAll();

    let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let dupe = res_project?.data?.assetworkstationgrouping.filter((item) => item._id !== maintentancemasteredit?._id);




    const isNameMatch = dupe.some(
      (item) =>
        item.company === maintentancemasteredit.company &&
        item.branch === maintentancemasteredit.branch &&
        item.unit === maintentancemasteredit.unit &&
        item.floor === maintentancemasteredit.floor &&
        item.area === maintentancemasteredit.area &&
        item.location === maintentancemasteredit.location &&
        item.assetmaterial === maintentancemasteredit.assetmaterial &&
        item.component.some((data) => ComponentValueCateEdit.includes(data)) &&
        item.workstation === maintentancemaster.workstation
    );

    const isDuplicateMaterialWorkstation = allProjectedit.some(
      (item) =>
        item.assetmaterial === maintentancemasteredit.assetmaterial &&
        item.component.some((data) => ComponentValueCateEdit.includes(data))
    );

    if (maintentancemasteredit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isDuplicateMaterialWorkstation) {
      setPopupContentMalert("Already Added AssetMaterial!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemasteredit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.workstation === "Please Select Workstation"
    ) {
      setPopupContentMalert("Please Select Workstation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      maintentancemasteredit.assetmaterial === "Please Select Material"
    ) {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ComponentValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequestNear();
    }
  };

  const fetchFloor = async (selectedBranches) => {

    let resultedit = allfloor.filter((d) => d.branch === selectedBranches.value || d.branch === selectedBranches.branch);
    const flooralledit = resultedit.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));



    let result = allfloor.filter((d) =>
      selectedBranches.some((branch) => d.branch.includes(branch))
    );

    // Map the result to add label and value
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    // Update state
    setFloors(floorall);
    setFloorEdit(flooralledit);
  };


  const fetchFloorEdit = async (e) => {

    let resultedit = allfloor.filter((d) => d.branch === e.value || d.branch === e.branch);
    const flooralledit = resultedit.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));




    setFloorEdit(flooralledit);
  };


  const fetchArea = async (selectedfloor) => {

    let result =

      allareagrouping
        .filter(
          (comp) =>
            selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) &&
            selectedfloor.some((floor) => comp.floor.includes(floor))
          // e.includes(comp.floor)
        )?.map(data => data.area).flat()

    let ji = [].concat(...result);
    const uniqueAreas = Array.from(new Set(ji));
    const all = uniqueAreas.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };


  const fetchLocation = async (selectedlocation) => {
    let result =


      alllocationgrouping
        .filter(
          (comp) =>
            selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) &&
            selectedFloorFromCreate.map((item) => item.value).includes(comp.floor) &&
            selectedlocation.some((area) => comp.area.includes(area))
          // e.includes(comp.floor)
        )?.map(data => data.location).flat()

    let ji = [].concat(...result);
    const unique = Array.from(new Set(ji));
    const all = [
      { label: "ALL", value: "ALL" },
      ...unique
        .filter((d) => d !== "ALL")
        .map((d) => ({
          label: d,
          value: d,
        })),
    ];
    // const alls = Array.from(new Set(ji));

    setLocations(all);
  };

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    var filteredWorks;
    // if (
    //   (selectedUnitFromCreate === "" ||
    //     selectedUnitFromCreate == undefined) &&
    //   (selectedFloorFromCreate === "" || selectedFloorFromCreate == undefined)
    // ) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>
    //       selectedCompanyFromCreate.map(item => item.value).includes(u.company) &&
    //       selectedBranchFromCreate.map(item => item.value).includes(u.branch)
    //   );
    // } else if (
    //   selectedUnitFromCreate.map(item => item.value) === "" ||
    //   selectedUnitFromCreate.map(item => item.value) == undefined
    // ) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>

    //       selectedCompanyFromCreate.map(item => item.value).includes(u.company) &&
    //       selectedBranchFromCreate.map(item => item.value).includes(u.branch) &&
    //       selectedUnitFromCreate.map(item => item.value).includes(u.unit)
    //   );
    // } else if (
    //   selectedFloorFromCreate === "" ||
    //   selectedFloorFromCreate == undefined
    // ) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>

    //       selectedCompanyFromCreate.map(item => item.value).includes(u.company) &&
    //       selectedBranchFromCreate.map(item => item.value).includes(u.branch) &&
    //       selectedUnitFromCreate.map(item => item.value).includes(u.unit)
    //   );
    // } else {
    filteredWorks = workStationOpt?.filter(
      (u) =>

        // console.log(



        //   selectedCompanyFromCreate.map(item => item.value).includes(u.company),
        //   selectedBranchFromCreate.map(item => item.value).includes(u.branch),
        //   selectedUnitFromCreate.map(item => item.value).includes(u.unit),
        //   selectedFloorFromCreate.map(item => item.value).includes(u.floor),

        // )


        selectedCompanyFromCreate.map(item => item.value).includes(u.company) &&
        selectedBranchFromCreate.map(item => item.value).includes(u.branch) &&
        selectedUnitFromCreate.map(item => item.value).includes(u.unit) &&
        selectedFloorFromCreate.map(item => item.value).includes(u.floor)
    );
    // }

    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
          ? combinstationItem.subTodos.map(
            (subTodo) => {
              let workStat = subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"

              return {
                ...item,
                finalworkstation: workStat,
                finalindividualcabinname: subTodo.subcabinname
              }
            }

          )
          : [
            {
              ...item,
              finalworkstation: combinstationItem.cabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")",
              finalindividualcabinname: combinstationItem.cabinname
            }


          ];
      });
    });

    const updatedResult = result.map(mainObj => {
      const match = workStationSystemName?.find(secObj =>
        secObj.company === mainObj.company &&
        secObj.branch === mainObj.branch &&
        secObj.unit === mainObj.unit &&
        secObj.floor === mainObj.floor &&
        secObj.cabinname === mainObj.finalindividualcabinname
      );

      if (match) {
        return { ...mainObj, systemshortname: match.systemshortname }; // Add systemshortname to matched object
      }

      return mainObj; // Return original object if no match is found
    });



    setFilteredWorkStation(
      updatedResult?.flat()?.map((d) => ({
        ...d,
        label: d?.systemshortname
          ? `${d?.finalworkstation}(${d?.systemshortname})`
          : d?.finalworkstation, value: d?.finalworkstation,
      }))
    );
  }, [
    selectedCompanyFromCreate,
    selectedBranchFromCreate,
    selectedUnitFromCreate,
    selectedFloorFromCreate,

  ]);

  useEffect(() => {
    var filteredWorksedit;
    // if (
    //   (maintentancemasteredit.unit === "" ||
    //     maintentancemasteredit.unit == undefined) &&
    //   (maintentancemasteredit.floor === "" ||
    //     maintentancemasteredit.floor == undefined)
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === maintentancemasteredit.company &&
    //       u.branch === maintentancemasteredit.branch
    //   );
    // } else if (
    //   maintentancemasteredit.unit === "" ||
    //   maintentancemasteredit.unit == undefined
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === maintentancemasteredit.company &&
    //       u.branch === maintentancemasteredit.branch &&
    //       u.floor === maintentancemasteredit.floor
    //   );
    // } else if (
    //   maintentancemasteredit.floor === "" ||
    //   maintentancemasteredit.floor == undefined
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === maintentancemasteredit.company &&
    //       u.branch === maintentancemasteredit.branch &&
    //       u.unit === maintentancemasteredit.unit
    //   );
    // } else {
    filteredWorksedit = workStationOpt?.filter(
      (u) =>
        u.company === maintentancemasteredit.company &&
        u.branch === maintentancemasteredit.branch &&
        u.unit === maintentancemasteredit.unit &&
        u.floor === maintentancemasteredit.floor
    );
    // }

    const result = filteredWorksedit?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
          ? combinstationItem.subTodos.map(
            (subTodo) => {
              let workStat = subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"

              return {
                ...item,
                finalworkstation: workStat,
                finalindividualcabinname: subTodo.subcabinname
              }
            }

          )
          : [
            {
              ...item,
              finalworkstation: combinstationItem.cabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")",
              finalindividualcabinname: combinstationItem.cabinname
            }


          ];
      });
    });

    const updatedResult = result.map(mainObj => {
      const match = workStationSystemName?.find(secObj =>
        secObj.company === mainObj.company &&
        secObj.branch === mainObj.branch &&
        secObj.unit === mainObj.unit &&
        secObj.floor === mainObj.floor &&
        secObj.cabinname === mainObj.finalindividualcabinname
      );

      if (match) {
        return { ...mainObj, systemshortname: match.systemshortname }; // Add systemshortname to matched object
      }

      return mainObj; // Return original object if no match is found
    });

    setFilteredWorkStation(
      updatedResult?.flat()?.map((d) => ({
        ...d,
        label: d?.systemshortname
          ? `${d?.finalworkstation}(${d?.systemshortname})`
          : d?.finalworkstation,
        value: d?.finalworkstation,
      }))
    );
  }, [maintentancemasteredit, isEditOpenNear]);

  useEffect(() => {
    fetchWorkStation();
  }, [isEditOpenNear]);

  const fetchAreaEdit = async (a, e) => {
    let result = allareagrouping
      .filter((d) => d.branch === a && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreasEdit(all);
  };

  // //get all Locations edit.
  // const fetchAllLocationEdit = async (a, b, c) => {
  //   let result = alllocationgrouping
  //     .filter((d) => d.branch === a && d.floor === b && d.area === c)
  //     .map((data) => data.location);
  //   let ji = [].concat(...result);
  //   const all = [
  //     ...ji.map((d) => ({
  //       ...d,
  //       label: d,
  //       value: d,
  //     })),
  //   ];
  //   setLocationsEdit(all);
  // };

  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {

    let result = alllocationgrouping
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
  };

  // const fetchMaintentanceIndividual = async () => {
  //   setPageName(!pageName)
  //   setProjectCheck(true);
  //   const queryParams = {
  //     page: Number(page),
  //     pageSize: Number(pageSize),
  //     assignbranch: accessbranch,
  //   };

  //   const allFilters = [
  //     ...additionalFilters,
  //     { column: selectedColumn, condition: selectedCondition, value: filterValue }
  //   ];
  //   // Only include advanced filters if they exist, otherwise just use regular searchQuery
  //   if (allFilters.length > 0 && selectedColumn !== "") {
  //     queryParams.allFilters = allFilters
  //     queryParams.logicOperator = logicOperator;
  //   } else if (searchQuery) {
  //     queryParams.searchQuery = searchQuery;
  //   }
  //   try {
  //     // let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
  //     let res_project = await axios.post(SERVICE.ASSET_WORKSTATION_GRP_ACCESS, queryParams, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     const ans = res_project?.data?.result?.length > 0 ? res_project?.data?.result : []

  //     let single = ans;
  //     const uniqueObjects = [];
  //     const uniqueKeysMap = new Map();

  //     single.forEach((obj) => {
  //       const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.area}-${obj.location}`;

  //       if (!uniqueKeysMap.has(key)) {
  //         obj.id = [obj._id];
  //         uniqueKeysMap.set(key, obj);
  //       } else {
  //         const existingObj = uniqueKeysMap.get(key);
  //         existingObj.assetmaterial += `, ${obj.assetmaterial}`;
  //         existingObj.workstation += `, ${obj.workstation}`;
  //         // Check if subcomponents is empty or not
  //         if (obj.subcomponents.length > 0) {
  //           if (existingObj.subcomponents.length > 0) {
  //             existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
  //           } else {
  //             existingObj.subcomponents = obj.subcomponents.join(",");
  //           }
  //         }
  //         if (obj.component.length > 0) {
  //           if (existingObj.component.length > 0) {
  //             existingObj.component += `, ${obj.component.join(",")}`;
  //           } else {
  //             existingObj.component = obj.component.join(",");
  //           }
  //         }

  //         existingObj.id = existingObj.id.concat(obj._id);
  //         uniqueKeysMap.set(key, existingObj);
  //       }
  //     });

  //     uniqueObjects.push(...uniqueKeysMap.values());


  //     setMaintentance(uniqueObjects);


  //     setOverallFilterdata(uniqueObjects?.length > 0 ?
  //       uniqueObjects?.map((item, index) => {
  //         return {
  //           ...item,
  //           serialNumber: (page - 1) * pageSize + index + 1,
  //           component: item.component?.toString(","),
  //           subcomponentsstring: item.subcomponents?.toString(),

  //         }
  //       }

  //       ) : []
  //     );
  //     setTotalProjects(ans?.length > 0 ? uniqueObjects.length : 0);
  //     setTotalPages(ans?.length > 0 ? uniqueObjects.length : 0);
  //     setPageSize((data) => { return ans?.length > 0 ? data : 10 });
  //     setPage((data) => { return ans?.length > 0 ? data : 1 });
  //     if (res_project?.data?.result.length > 0) {
  //       setUniqueid(
  //         res_project?.data?.result[
  //           res_project?.data?.result.length - 1
  //         ].uniqueid
  //       );
  //     }


  //     setProjectCheck(false);
  //   } catch (err) {
  //     console.log(err, "erororms")
  //     setProjectCheck(false);
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };

  const fetchMaintentanceIndividualSingle = async () => {
    setPageName(!pageName)
    setProjectCheck1(true);
    const queryParams = {
      page: Number(pageNearTatPrimary),
      pageSize: Number(pageSizeNearTatPrimary),
      assignbranch: accessbranch,
    };

    const allFiltersNear = [
      ...additionalFiltersNear,
      { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }
    ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFiltersNear.length > 0 && selectedColumnNear !== "") {
      queryParams.allFilters = allFiltersNear
      queryParams.logicOperator = logicOperatorNear;
    } else if (searchQueryNearTatPrimary) {
      queryParams.searchQuery = searchQueryNearTatPrimary;
    }
    try {
      // let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
      let res_employee = await axios.post(SERVICE.ASSET_WORKSTATION_GRP_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const updatedResult = ans?.map((item, index) => {

        return {
          ...item,
          id: item._id,
          serialNumber: (pageNearTatPrimary - 1) * pageSizeNearTatPrimary + index + 1,
          component: item.component?.toString(","),
          subcomponentsstring: item.subcomponents?.toString(),
        }
      });

      const itemsWithSerialNumber = updatedResult?.map(mainObj => {
        // Split workstation into multiple cabins
        const workstations = mainObj.workstation;

        // Create a new workstation array with the systemshortname added
        const cabinName = workstations.split("(")[0]; // Extract cabin name from "F-A8(TTS-TRICHY-First Floor)"

        // Find the matching object in workStationSystemName
        const match = workStationSystemName?.find(secObj =>
          secObj.company === mainObj.company &&
          secObj.branch === mainObj.branch &&
          secObj.unit === mainObj.unit &&
          secObj.floor === mainObj.floor &&
          secObj.cabinname === cabinName
        );

        // If match found, append systemshortname to the workstation label
        if (match) {
          return {
            ...mainObj,
            workstation: match.systemshortname
              ? `${workstations}(${match.systemshortname})`
              : workstations // Join updated workstations back with commas
          };
        }

        // If no match, return the original workstation
        return {
          ...mainObj,
          workstation: workstations // Join updated workstations back with commas
        };
      });



      setItemsNearTat(itemsWithSerialNumber);
      let overallData = res_employee?.data?.totalProjectsData?.length > 0 ?
        res_employee?.data?.totalProjectsData?.map((item, index) => {
          return {
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,
            component: item.component?.toString(","),
            subcomponentsstring: item.subcomponents?.toString(),
          }
        }

        ) : []
      setOverallFilterdataNear(
        overallData?.map(mainObj => {
          // Split workstation into multiple cabins
          const workstations = mainObj.workstation;

          // Create a new workstation array with the systemshortname added
          const cabinName = workstations.split("(")[0]; // Extract cabin name from "F-A8(TTS-TRICHY-First Floor)"

          // Find the matching object in workStationSystemName
          const match = workStationSystemName?.find(secObj =>
            secObj.company === mainObj.company &&
            secObj.branch === mainObj.branch &&
            secObj.unit === mainObj.unit &&
            secObj.floor === mainObj.floor &&
            secObj.cabinname === cabinName
          );

          // If match found, append systemshortname to the workstation label
          if (match) {
            return {
              ...mainObj,
              workstation: match.systemshortname
                ? `${workstations}(${match.systemshortname})`
                : workstations  // Join updated workstations back with commas
            };
          }

          // If no match, return the original workstation
          return {
            ...mainObj,
            workstation: workstations // Join updated workstations back with commas
          };
        }));
      setTotalProjectsNear(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPagesNear(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSizeNearTatPrimary((data) => { return ans?.length > 0 ? data : 10 });
      setPageNearTatPrimary((data) => { return ans?.length > 0 ? data : 1 });
      setIndividualAsset(itemsWithSerialNumber);
      setProjectCheck1(false);
    } catch (err) {

      setProjectCheck1(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  useEffect(() => {
    fetchMaintentanceIndividualSingle();
  }, [pageNearTatPrimary, pageSizeNearTatPrimary, searchQueryNearTatPrimary]);






  //get all project.
  const fetchProjMasterAll = async () => {
    try {
      let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllProjectedit(
        res_project?.data?.assetworkstationgrouping.filter(
          (item) => item._id !== maintentancemasteredit?._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // useEffect(() => {
  //   fetchProjMasterAll();
  // }, [isEditOpenNear, maintentancemasteredit]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Asset Workstation Grouping Group",
    pageStyle: "print",
  });

  //print...
  const componentRefNear = useRef();
  const handleprintNear = useReactToPrint({
    content: () => componentRefNear.current,
    documentTitle: "Asset Workstation Grouping Individual ",
    pageStyle: "print",
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   serialNumber: index + 1,
    //   component: item.component?.toString(","),
    //   subcomponentsstring: item.subcomponents?.toString(),
    // }));
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(filteteredip);
  }, [filteteredip]);

  //serial no for listing items
  const addSerialNumberNearTat = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   serialNumber: index + 1,
    //   component: item.component?.toString(","),
    //   subcomponentsstring: item.subcomponents?.toString(),
    // }));
    setItemsNearTat(datas);
  };

  useEffect(() => {
    addSerialNumberNearTat(individualasset);
  }, [individualasset]);
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
    console.log(event.target.value, 'serar')
    setSearchQuery(event.target.value);
    setFilterValue(event.target.value);
    setPage(1);
  };

  //Datatable
  const handlePageChangeNearTatPrimary = (newPage) => {
    setPageNearTatPrimary(newPage);
  };

  const handlePageSizeChangeNearTatPrimary = (event) => {
    setPageSizeNearTatPrimary(Number(event.target.value));
    setPageNearTatPrimary(1);
  };

  //datatable....

  const handleSearchChangeNearTatPrimary = (event) => {
    setSearchQueryNearTatPrimary(event.target.value);
    setFilterValue(event.target.value);
    setPageNearTatPrimary(1)
  };

  const searchTerms = searchQuery.toLowerCase().split(" ");
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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

  const searchOverNearTerms = searchQueryNearTatPrimary
    .toLowerCase()
    .split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
    return searchOverNearTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice(
    (pageNearTatPrimary - 1) * pageSizeNearTatPrimary,
    pageNearTatPrimary * pageSizeNearTatPrimary
  );

  // const totalPagesNearTatPrimary = Math.ceil(
  //   filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary
  // );

  const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

  const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
  const lastVisiblePageNearTatPrimary = Math.min(
    Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1),
    totalPagesNearTatPrimary
  );

  const pageNumbersNearTatPrimary = [];

  const indexOfLastItemNearTatPrimary =
    pageNearTatPrimary * pageSizeNearTatPrimary;
  const indexOfFirstItemNearTatPrimary =
    indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;

  for (
    let i = firstVisiblePageNearTatPrimary;
    i <= lastVisiblePageNearTatPrimary;
    i++
  ) {
    pageNumbersNearTatPrimary.push(i);
  }

  useEffect(() => {
    fetchAssetDetails();
    fetchMaterialAll();
  }, []);
  useEffect(() => {
    fetchAssetDetails();
  }, [maintentancemaster.location, maintentancemaster.assetmaterial]);
  // }, [isEditOpenNear]);

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

  const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

  const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
    <div>
      <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
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
      headerName: "Workstation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Material",
      flex: 0,
      width: 160,
      hide: !columnVisibility.assetmaterial,
      headerClassName: "bold-header",
    },
    {
      field: "component",
      headerName: "Asset Material",
      flex: 0,
      width: 160,
      hide: !columnVisibility.component,
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
          {isUserRoleCompare?.includes("dassetworkstationgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.idgrp);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetworkstationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(
                  params.data.company,
                  params.data.branch,
                  params.data.unit,
                  params.data.floor,
                  params.data.area,
                  params.data.location,
                  params.data.assetmaterial,
                  params.data.workstation,
                  params.data.subcomponentsstring,
                  params.data.ip,
                  params.data.ebusage,
                  params.data.empdistribution,
                  params.data.component
                );
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassetworkstationgrouping") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      idgrp: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      assetmaterial: item.assetmaterial,
      workstation: item.workstation,
      subcomponents: item.subcomponents,
      component: item.component,
      subcomponentsstring: item.subcomponents,
    };
  });

  const columnDataTableNeartat = [
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
      hide: !columnVisibilityNeartat.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.company,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.branch,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibilityNeartat.location,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 150,
      hide: !columnVisibilityNeartat.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Material",
      flex: 0,
      width: 160,
      hide: !columnVisibilityNeartat.assetmaterial,
      headerClassName: "bold-header",
    },
    {
      field: "component",
      headerName: "Asset Material",
      flex: 0,
      width: 160,
      hide: !columnVisibilityNeartat.component,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityNeartat.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassetworkstationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpenEditNear();
                getCodeNear(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetworkstationgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataNear(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetworkstationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeNear(
                  params.data.company,
                  params.data.branch,
                  params.data.unit,
                  params.data.floor,
                  params.data.area,
                  params.data.location,
                  params.data.assetmaterial,
                  params.data.workstation,
                  params.data.subcomponentsstring,
                  params.data.ip,
                  params.data.ebusage,
                  params.data.empdistribution,
                  params.data.component
                );
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const filteredSelectedColumnNear = columnDataTableNeartat.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


  const rowDataTableNearTat = itemsneartat.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      assetmaterial: item.assetmaterial,
      workstation: item.workstation,
      subcomponents: item.subcomponents,
      component: item.component,
      subcomponentsstring: item.subcomponents,
    };
  });


  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsNear.includes(row.id),
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // Show All Columns functionality
  const handleShowAllColumnsNeartat = () => {
    const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
    for (const columnKey in updatedVisibilityNeartat) {
      updatedVisibilityNeartat[columnKey] = true;
    }
    setColumnVisibilityNeartat(updatedVisibilityNeartat);
  };

  // Manage Columns functionality
  const toggleColumnVisibilityNeartat = (field) => {
    setColumnVisibilityNeartat((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageNeartat.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentNeartat = (
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
        onClick={handleCloseManageColumnsNeartat}
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
          value={searchQueryManageNeartat}
          onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsNeartat.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityNeartat[column.field]}
                    onChange={() => toggleColumnVisibilityNeartat(column.field)}
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
                setColumnVisibilityNeartat(initialColumnVisibilityNeartat)
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
                columnDataTableNeartat.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityNeartat(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // Function to find an object where the 'name' property is missing and return it in array format
  function findObjectWithMissingName() {
    let codeast = maintentancemaster?.assetmaterial.split("-");

    let sub =
      maintentancemaster.assetmaterial !== "" &&
      assetdetails.find(
        (t) => t.material === maintentancemaster.assetmaterialcheck
      ) &&
      assetdetails.find(
        (t) =>
          t.material === maintentancemaster.assetmaterialcheck &&
          t.code === codeast[1]
      )?.subcomponent;

    const objectsWithMissingName = [];
    if (sub) {
      for (let obj of sub) {
        if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
          objectsWithMissingName.push(obj);
        }
      }

      return objectsWithMissingName;
    }
  }

  function findObjectWithMissingNameEdit() {
    let codeast = maintentancemasteredit?.assetmaterial.split("-");

    let sub =
      maintentancemasteredit.assetmaterial !== "" &&
      assetdetails.find(
        (t) => t.material === maintentancemasteredit.assetmaterialcheck
      ) &&
      assetdetails.find(
        (t) =>
          t.material === maintentancemasteredit.assetmaterialcheck &&
          t.code === codeast[1]
      )?.subcomponent;

    const objectsWithMissingName = [];
    if (sub) {
      for (let obj of sub) {
        if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
          objectsWithMissingName.push(obj);
        }
      }

      return objectsWithMissingName;
    }
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [isFilterOpennear, setIsFilterOpennear] = useState(false);
  const [isPdfFilterOpennear, setIsPdfFilterOpennear] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // page refersh reload
  const handleCloseFilterModnear = () => {
    setIsFilterOpennear(false);
  };

  const handleClosePdfFilterModnear = () => {
    setIsPdfFilterOpennear(false);
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






  //near



  // Search bar
  const [anchorElSearchNear, setAnchorElSearchNear] = React.useState(null);
  const handleClickSearchNear = (event) => {
    setAnchorElSearchNear(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearchNear = () => {
    setAnchorElSearchNear(null);
    setSearchQueryNearTatPrimary("");
  };

  const openSearchNear = Boolean(anchorElSearchNear);
  const idSearchNear = openSearchNear ? 'simple-popover' : undefined;

  const handleAddFilterNear = () => {
    if (selectedColumnNear && filterValueNear || ["Blank", "Not Blank"].includes(selectedConditionNear)) {
      setAdditionalFiltersNear([
        ...additionalFiltersNear,
        { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }
      ]);
      setSelectedColumnNear("");
      setSelectedConditionNear("Contains");
      setFilterValueNear("");
    }
  };

  // Show filtered combination in the search bar
  const getSearchDisplayNear = () => {
    if (advancedFilterNear && advancedFilterNear.length > 0) {
      return advancedFilterNear.map((filter, index) => {
        let showname = columnDataTableNeartat.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilterNear.length > 1 ? advancedFilterNear[1].condition : '') + ' ');
    }
    return searchQueryNearTatPrimary;
  };

  // Disable the search input if the search is active
  const isSearchDisabledNear = isSearchActiveNear || additionalFiltersNear.length > 0;

  const handleResetSearchNear = async () => {


    // Reset all filters and pagination state
    setAdvancedFilterNear(null);
    setAdditionalFiltersNear([]);
    setSearchQueryNearTatPrimary("");
    setIsSearchActiveNear(false);
    setSelectedColumnNear("");
    setSelectedConditionNear("Contains");
    setFilterValueNear("");
    setLogicOperatorNear("AND");
    setFilteredChangesNear(null);


    const queryParams = {
      page: Number(pageNearTatPrimary),
      pageSize: Number(pageSizeNearTatPrimary),
      assignbranch: accessbranch,
    };

    const allFiltersNear = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFiltersNear.length > 0 && selectedColumnNear !== "") {
      queryParams.allFilters = allFiltersNear
      queryParams.logicOperator = logicOperatorNear;
    } else if (searchQueryNearTatPrimary) {
      queryParams.searchQuery = searchQueryNearTatPrimary;
    }

    try {
      // let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
      let res_employee = await axios.post(SERVICE.ASSET_WORKSTATION_GRP_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const updatedResult = ans?.map((item, index) => {

        return {
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          component: item.component?.toString(","),
          subcomponentsstring: item.subcomponents?.toString(),
        }
      });

      const itemsWithSerialNumber = updatedResult?.map(mainObj => {
        // Split workstation into multiple cabins
        const workstations = mainObj.workstation;

        // Create a new workstation array with the systemshortname added
        const cabinName = workstations.split("(")[0]; // Extract cabin name from "F-A8(TTS-TRICHY-First Floor)"

        // Find the matching object in workStationSystemName
        const match = workStationSystemName?.find(secObj =>
          secObj.company === mainObj.company &&
          secObj.branch === mainObj.branch &&
          secObj.unit === mainObj.unit &&
          secObj.floor === mainObj.floor &&
          secObj.cabinname === cabinName
        );

        // If match found, append systemshortname to the workstation label
        if (match) {
          return {
            ...mainObj,
            workstation: match.systemshortname
              ? `${workstations}(${match.systemshortname})`
              : workstations  // Join updated workstations back with commas
          };
        }

        // If no match, return the original workstation
        return {
          ...mainObj,
          workstation: workstations // Join updated workstations back with commas
        };
      });
      setIndividualAsset(itemsWithSerialNumber);


      setItemsNearTat(itemsWithSerialNumber);

      let overallData = res_employee?.data?.totalProjectsData?.length > 0 ?
        res_employee?.data?.totalProjectsData?.map((item, index) => {
          return {
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,
            component: item.component?.toString(","),
            subcomponentsstring: item.subcomponents?.toString(),
          }
        }

        ) : []
      setOverallFilterdataNear(
        overallData?.map(mainObj => {
          // Split workstation into multiple cabins
          const workstations = mainObj.workstation;

          // Create a new workstation array with the systemshortname added
          const cabinName = workstations.split("(")[0]; // Extract cabin name from "F-A8(TTS-TRICHY-First Floor)"

          // Find the matching object in workStationSystemName
          const match = workStationSystemName?.find(secObj =>
            secObj.company === mainObj.company &&
            secObj.branch === mainObj.branch &&
            secObj.unit === mainObj.unit &&
            secObj.floor === mainObj.floor &&
            secObj.cabinname === cabinName
          );

          // If match found, append systemshortname to the workstation label
          if (match) {
            return {
              ...mainObj,
              workstation: match.systemshortname
                ? `${workstations}(${match.systemshortname})`
                : workstations  // Join updated workstations back with commas
            };
          }

          // If no match, return the original workstation
          return {
            ...mainObj,
            workstation: workstations // Join updated workstations back with commas
          };
        }));
      setTotalProjectsNear(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPagesNear(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSizeNearTatPrimary((data) => { return ans?.length > 0 ? data : 10 });
      setPageNearTatPrimary((data) => { return ans?.length > 0 ? data : 1 });


      setProjectCheck(false);
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  //add function 
  const fetchFilteredDatas = async () => {


    setProjectCheck(true);
    try {
      let subprojectscreate = await axios.post(SERVICE.FILTERED_WOKRSTATIONGROUPING, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: selectedCompanyFrom.map(item => item.value),
        branch: selectedBranchFrom.map(item => item.value),
        unit: selectedUnitFrom.map(item => item.value),
      })

      let ans = subprojectscreate.data.materialipfilter;
      let single = ans;
      const uniqueObjects = [];
      const uniqueKeysMap = new Map();

      single.forEach((obj) => {
        const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.area}-${obj.location}`;

        if (!uniqueKeysMap.has(key)) {
          obj.id = [obj._id];
          uniqueKeysMap.set(key, obj);
        } else {
          const existingObj = uniqueKeysMap.get(key);
          existingObj.assetmaterial += `, ${obj.assetmaterial}`;
          existingObj.workstation += `, ${obj.workstation}`;
          // Check if subcomponents is empty or not
          if (obj.subcomponents.length > 0) {
            if (existingObj.subcomponents.length > 0) {
              existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
            } else {
              existingObj.subcomponents = obj.subcomponents.join(",");
            }
          }
          if (obj.component.length > 0) {
            if (existingObj.component.length > 0) {
              existingObj.component += `, ${obj.component.join(",")}`;
            } else {
              existingObj.component = obj.component.join(",");
            }
          }

          existingObj.id = existingObj.id.concat(obj._id);
          uniqueKeysMap.set(key, existingObj);
        }
      });

      uniqueObjects.push(...uniqueKeysMap.values());


      const updatedResult = uniqueObjects.map(mainObj => {
        // Split workstation into multiple cabins
        const workstations = mainObj.workstation.split(",").map(ws => ws.trim());

        // Create a new workstation array with the systemshortname added
        const updatedWorkstations = workstations?.map(ws => {
          const cabinName = ws.split("(")[0]; // Extract cabin name from "F-A8(TTS-TRICHY-First Floor)"

          // Find the matching object in workStationSystemName
          const match = workStationSystemName?.find(secObj =>
            secObj.company === mainObj.company &&
            secObj.branch === mainObj.branch &&
            secObj.unit === mainObj.unit &&
            secObj.floor === mainObj.floor &&
            secObj.cabinname === cabinName
          );

          // If match found, append systemshortname to the workstation label
          if (match) {
            return `${ws}(${match.systemshortname})`;
          }

          // If no match, return the original workstation
          return ws;
        });

        // Return the updated object with the new workstations
        return {
          ...mainObj,
          workstation: updatedWorkstations.join(", ") // Join updated workstations back with commas
        };
      });
      const itemwithserialnumber = updatedResult?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        component: item.component,
        floor: item.floor,
        location: item.location,
        area: item.area,
        component: item.component?.toString(","),
        subcomponentsstring: item.subcomponents?.toString(),
      }))


      SetFilteredIp(itemwithserialnumber)
      setPage(1)
      setProjectCheck(false);
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  }



  //submit option for saving
  const handleSubmitFilter = (e) => {
    e.preventDefault();

    if (selectedCompanyFrom.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedBranchFrom.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedUnitFrom.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchFilteredDatas();
    }

  };
  const handleClearFilter = async (e) => {
    e.preventDefault();
    // setEbreadingdetailFilter({
    //     company: "Please Select Company",
    //     branch: "Please Select Branch",
    //     floor: "Please Select Floor",
    //     servicenumber: "Please Select Service",
    // })
    setSelectedCompanyFrom([])
    setSelectedBranchFrom([])
    setSelectedUnitFrom([])
    SetFilteredIp([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }



  return (
    <Box>
      <Headtitle title={"Asset Workstation Grouping"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Asset Workstation Grouping
      </Typography> */}
      <PageHeading
        title=" Asset Workstation Grouping"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Asset WorkStation Grouping"
        subpagename=""
        subsubpagename=""
      />



      {isUserRoleCompare?.includes("aassetworkstationgrouping") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Asset Workstation Grouping
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
                    <MultiSelect
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={selectedCompanyFromCreate}
                      onChange={handleCompanyChangeFromCreate}
                      valueRenderer={customValueRendererCompanyFromCreate}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch?.filter(
                        (comp) =>
                          // ebreadingdetailFilter.company === comp.company
                          selectedCompanyFromCreate
                            .map((item) => item.value)
                            .includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={selectedBranchFromCreate}
                      onChange={handleBranchChangeFromCreate}
                      valueRenderer={customValueRendererBranchFromCreate}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch?.filter(
                        (comp) =>
                          selectedCompanyFromCreate.map((item) => item.value).includes(comp.company) && selectedBranchFromCreate.map((item) => item.value).includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      styles={colourStyles}
                      value={selectedUnitFromCreate}
                      onChange={handleUnitChangeFromCreate}
                      valueRenderer={customValueRendererUnitFromCreate}

                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>


                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <Selects
                                                              options={floors}
                                                              styles={colourStyles}
                                                              value={{ label: maintentancemaster.floor, value: maintentancemaster.floor }}
                                                              onChange={(e) => {
                                                                  setMaintentancemaster({
                                                                      ...maintentancemaster,
                                                                      floor: e.value,
                                                                      workstation: "",
                                                                      area: "Please Select Area",
                                                                      location: "Please Select Location",
                                                                      assetmaterial: "Please Select Material"
                                                                  });
                                                                  setSelectedOptionsMaterial([]);
                                                                  setSelectedOptionsComponent([])
                                                                  setAreas([])
                                                                  setLocations([{ label: "ALL", value: "ALL" }]);
                                                                  fetchArea(e.value);
                                                              }}
                                                          /> */}
                    <MultiSelect
                      options={floors}
                      styles={colourStyles}
                      value={selectedFloorFromCreate}
                      onChange={handleFloorChangeFromCreate}
                      valueRenderer={customValueRendererFloorFromCreate}
                      labelledBy="Please Select Floor"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <Selects
                                                              options={areas}
                                                              styles={colourStyles}
                                                              value={{ label: maintentancemaster.area, value: maintentancemaster.area }}
                                                              onChange={(e) => {
                                                                  setMaintentancemaster({
                                                                      ...maintentancemaster,
                                                                      area: e.value,
                                                                      workstation: "",
                                                                      location: "Please Select Location",
                                                                      assetmaterial: "Please Select Material"
                                                                  });
                                                                  setSelectedOptionsMaterial([]);
                                                                  setAssetdetails([])
                                                                  setLocations([{ label: "ALL", value: "ALL" }]);
                                                                  fetchLocation(e.value);
                                                              }}
                                                          /> */}

                    <MultiSelect
                      options={areas}
                      styles={colourStyles}
                      value={selectedAreaFromCreate}
                      onChange={handleAreaChangeFromCreate}
                      valueRenderer={customValueRendererAreaFromCreate}
                      labelledBy="Please Select Area"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* <Selects
                                                              options={locations}
                                                              styles={colourStyles}
                                                              value={{
                                                                  label: maintentancemaster.location,
                                                                  value: maintentancemaster.location,
                                                              }}
                                                              onChange={(e) => {
                                                                  setMaintentancemaster({
                                                                      ...maintentancemaster,
                                                                      location: e.value,
                                                                      assetmaterial: "Please Select Material",
                                                                  });
                                                                  setSelectedOptionsMaterial([])
              
                                                              }}
                                                          /> */}

                    <MultiSelect
                      options={locations}
                      styles={colourStyles}
                      value={selectedLocationFromCreate}
                      onChange={handleLocationChangeFromCreate}
                      valueRenderer={customValueRendererLocationFromCreate}
                      labelledBy="Please Select Location"
                    />
                  </FormControl>

                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Station<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      options={filteredWorkStation}
                      placeholder="Please Select Workstation"
                      value={{
                        label:
                          maintentancemaster.workstationlabel === "" ||
                            maintentancemaster.workstationlabel === undefined
                            ? "Please Select Workstation"
                            : maintentancemaster.workstationlabel,
                        value:
                          maintentancemaster.workstation === "" ||
                            maintentancemaster.workstation === undefined
                            ? "Please Select Workstation"
                            : maintentancemaster.workstation,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          workstation: e.value,
                          workstationlabel: e.label,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialOpt}
                      value={{
                        label: maintentancemaster.assetmaterial,
                        value: maintentancemaster.assetmaterial,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assetmaterial: e.value,
                        });
                        setSelectedOptionsMaterial([]);
                        setValueComponentCat([]);
                        setSelectedOptionsComponent([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={
                        selectedLocationFromCreate.map(item => item.value).includes("ALL")
                          ?
                          Array.from(
                            new Set(
                              assetdetails
                                .filter(
                                  (t) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(t.location) &&
                                    t?.material ===
                                    maintentancemaster.assetmaterial
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t.material + "-" + t.code,
                                  value: t.material + "-" + t.code,
                                  company: t.company,
                                  branch: t.branch,
                                  unit: t.unit,
                                  floor: t.floor,
                                  area: t.area,
                                  location: t.location,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              assetdetails
                                .filter(
                                  (t) =>
                                    (
                                      selectedLocationFromCreate
                                        .map((item) => item.value)
                                        .includes(t.location)
                                      ||
                                      t.location === "ALL") &&
                                    // t.location.includes("ALL")) &&
                                    t?.material ===
                                    maintentancemaster.assetmaterial
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t.material + "-" + t.code,
                                  value: t.material + "-" + t.code,
                                  company: t.company,
                                  branch: t.branch,
                                  unit: t.unit,
                                  floor: t.floor,
                                  area: t.area,
                                  location: t.location,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={selectedOptionsComponent}
                      onChange={(e) => {
                        handleComponentChange(e);
                      }}
                      valueRenderer={customValueRendererComponent}
                      labelledBy="Please Select Asset Material"
                    />
                  </FormControl>
                </Grid>
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
          open={isEditOpenNear}
          onClose={handleCloseModEditNear}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "10px 20px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Asset Workstation Grouping
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemasteredit.company,
                        value: maintentancemasteredit.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          workstation: "Please Select Workstation",
                        });
                        setSelectedOptionsMaterialEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);

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
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company
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
                        label: maintentancemasteredit.branch,
                        value: maintentancemasteredit.branch,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          workstation: "Please Select Workstation",
                        });
                        setAreasEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);
                        setFloorEdit([]);
                        setSelectedOptionsMaterialEdit([]);
                        fetchFloorEdit(e);
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
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            maintentancemasteredit.company === comp.company &&
                            maintentancemasteredit.branch === comp.branch
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
                        label: maintentancemasteredit.unit,
                        value: maintentancemasteredit.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          unit: e.value,
                          workstation: "",
                        });
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);
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
                        label: maintentancemasteredit.floor,
                        value: maintentancemasteredit.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          workstation: "Please Select Workstation",
                        });
                        setAreasEdit([]);
                        setSelectedOptionsMaterialEdit([]);
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);
                        fetchAreaEdit(maintentancemasteredit.branch, e.value);
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
                        label: maintentancemasteredit.area,
                        value: maintentancemasteredit.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          workstation: "Please Select Workstation",
                        });
                        setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);
                        setSelectedOptionsMaterialEdit([]);
                        fetchAllLocationEdit(
                          maintentancemasteredit.branch,
                          maintentancemasteredit.floor,
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
                        label: maintentancemasteredit.location,
                        value: maintentancemasteredit.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          location: e.value,
                          assetmaterial: "Please Select Material",
                          workstation: "Please Select Workstation",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Station<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      options={filteredWorkStation}
                      placeholder="Please Select Workstation"
                      value={{
                        label:
                          maintentancemasteredit.workstationlabel === "" ||
                            maintentancemasteredit.workstationlabel === undefined
                            ? "Please Select Workstation"
                            : maintentancemasteredit.workstationlabel,
                        value:
                          maintentancemasteredit.workstation === "" ||
                            maintentancemasteredit.workstation === undefined
                            ? "Please Select Workstation"
                            : maintentancemasteredit.workstation,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          workstation: e.value,
                          workstationlabel: e.label,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialOpt}
                      value={{
                        label: maintentancemasteredit.assetmaterial,
                        value: maintentancemasteredit.assetmaterial,
                      }}
                      onChange={(e) => {
                        setMaintentancemasteredit({
                          ...maintentancemasteredit,
                          assetmaterial: e.value,
                        });
                        setComponentValueCateEdit([]);
                        setSelectedComponentOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset Material<b style={{ color: "red" }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={
                        maintentancemasteredit.location === "ALL"
                          ? Array.from(
                            new Set(
                              assetdetails
                                .filter(
                                  (t) =>
                                    locations
                                      .map((item) => item.value)
                                      .includes(t.location) &&
                                    t?.material ===
                                    maintentancemasteredit.assetmaterial
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t.material + "-" + t.code,
                                  value: t.material + "-" + t.code,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                          : Array.from(
                            new Set(
                              assetdetails
                                .filter(
                                  (t) =>
                                    (t.location ===
                                      maintentancemasteredit.location ||
                                      t.location === "ALL") &&
                                    t?.material ===
                                    maintentancemasteredit.assetmaterial
                                )
                                .map((t) => ({
                                  ...t,
                                  label: t.material + "-" + t.code,
                                  value: t.material + "-" + t.code,
                                }))
                                .reduce((acc, curr) => {
                                  if (
                                    !acc.some(
                                      (obj) => obj.value === curr.value
                                    )
                                  ) {
                                    acc.push(curr);
                                  }
                                  return acc;
                                }, [])
                            )
                          )
                      }
                      value={selectedComponentOptionsCateEdit}
                      onChange={handleComponentChangeEdit}
                      valueRenderer={customValueRendererComponentEdit}
                      labelledBy="Please Select Asset Material"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitNear}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEditNear}
                  >
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
      {isUserRoleCompare?.includes("lassetworkstationgrouping") && (
        <>

          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Group Asset Workstation Grouping List
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2.4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={selectedCompanyFrom}
                    onChange={handleCompanyChangeFrom}
                    valueRenderer={customValueRendererCompanyFrom}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>

              <Grid item md={2.4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAssignBranch?.filter(
                      (comp) =>
                        // ebreadingdetailFilter.company === comp.company
                        selectedCompanyFrom
                          .map((item) => item.value)
                          .includes(comp.company)
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={selectedBranchFrom}
                    onChange={handleBranchChangeFrom}
                    valueRenderer={customValueRendererBranchFrom}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>

              <Grid item md={2.4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAssignBranch?.filter(
                      (comp) =>
                        selectedCompanyFrom.map((item) => item.value).includes(comp.company) && selectedBranchFrom.map((item) => item.value).includes(comp.branch)
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={selectedUnitFrom}
                    onChange={handleUnitChangeFrom}
                    valueRenderer={customValueRendererUnitFrom}

                    labelledBy="Please Select Unit"
                  />
                </FormControl>
              </Grid>


              <Grid item md={1} xs={12} sm={12} marginTop={3}>
                <Button variant="contained" sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmitFilter}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item md={0.5} xs={12} sm={12} marginTop={3}>
                <Button
                  onClick={handleClearFilter}
                  sx={buttonStyles.btncancel}
                >
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
                    <MenuItem value={filteteredip.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassetworkstationgrouping") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchMaintentanceIndividual();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}

                  {isUserRoleCompare?.includes("csvassetworkstationgrouping") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchMaintentanceIndividual();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}

                  {isUserRoleCompare?.includes("printassetworkstationgrouping") && (
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  )}

                  {isUserRoleCompare?.includes("pdfassetworkstationgrouping") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          // fetchMaintentanceIndividual();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageassetworkstationgrouping") && (
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
                  maindatas={filteteredip}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={filteteredip}
                />
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
                  {/* Manage Column */}

                </Box>
              </Grid>
            </Grid>
            {/* ****** Table End ****** */}

            <br />
            <br />

            {projectCheck ? (
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
                  {/* <FacebookCircularProgress /> */}
                </Box>
              </Box>
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
                      itemsList={filteteredip}
                    />
                  </>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>

        </>
      )}
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
        id={idneartat}
        open={isManageColumnsOpenNeartat}
        anchorEl={anchorElNeartat}
        onClose={handleCloseManageColumnsNeartat}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
        transformOrigin={{ vertical: 'center', horizontal: 'right', }}
      >
        {manageColumnsContentNeartat}
      </Popover>
      <br />
      <br />
      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>
              Individual Asset Workstation Grouping List
            </Typography>
          </Grid>
          <Grid container spacing={2} style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  value={pageSizeNearTatPrimary}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeNearTatPrimary}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={totalProjectsNear}>All</MenuItem>
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
                {isUserRoleCompare?.includes("excelassetworkstationgrouping") && (
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpennear(true);
                        // fetchMaintentanceIndividual();
                        setFormat("xl");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileExcel />
                      &ensp;Export to Excel&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("csvassetworkstationgrouping") && (
                  <>
                    <Button
                      onClick={(e) => {
                        setIsFilterOpennear(true);
                        // fetchMaintentanceIndividual();
                        setFormat("csv");
                      }}
                      sx={userStyle.buttongrp}
                    >
                      <FaFileCsv />
                      &ensp;Export to CSV&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("printassetworkstationgrouping") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfassetworkstationgrouping") && (
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpennear(true);
                        // fetchMaintentanceIndividual();
                      }}
                    >
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imageassetworkstationgrouping") && (
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImagenear}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
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
                      {advancedFilterNear && (
                        <IconButton onClick={handleResetSearchNear}>
                          <MdClose />
                        </IconButton>
                      )}
                      <Tooltip title="Show search options">
                        <span>
                          <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchNear} />
                        </span>
                      </Tooltip>
                    </InputAdornment>}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{ 'aria-label': 'weight', }}
                  type="text"
                  value={getSearchDisplayNear()}
                  onChange={handleSearchChangeNearTatPrimary}
                  placeholder="Type to search..."
                  disabled={!!advancedFilterNear}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Button
            sx={userStyle.buttongrp}
            onClick={handleShowAllColumnsNeartat}
          >
            Show All Columns
          </Button>
          &ensp;
          <Button
            sx={userStyle.buttongrp}
            onClick={handleOpenManageColumnsNeartat}
          >
            Manage Columns
          </Button>
          <Popover
            id={idSearchNear}
            open={openSearchNear}
            anchorEl={anchorElSearchNear}
            onClose={handleCloseSearchNear}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
          >
            <Box style={{ padding: "10px", maxWidth: '450px' }}>
              <Typography variant="h6">Advance Search</Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseSearchNear}
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
                          value={selectedColumnNear}
                          onChange={(e) => setSelectedColumnNear(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>Select Column</MenuItem>
                          {filteredSelectedColumnNear.map((col) => (
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
                          value={selectedConditionNear}
                          onChange={(e) => setSelectedConditionNear(e.target.value)}
                          disabled={!selectedColumnNear}
                        >
                          {conditionsNear.map((condition) => (
                            <MenuItem key={condition} value={condition}>
                              {condition}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Value</Typography>
                        <TextField fullWidth size="small"
                          value={["Blank", "Not Blank"].includes(selectedConditionNear) ? "" : filterValueNear}
                          onChange={(e) => setFilterValueNear(e.target.value)}
                          disabled={["Blank", "Not Blank"].includes(selectedConditionNear)}
                          placeholder={["Blank", "Not Blank"].includes(selectedConditionNear) ? "Disabled" : "Enter value"}
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
                      {additionalFiltersNear.length > 0 && (
                        <>
                          <Grid item md={12} sm={12} xs={12}>
                            <RadioGroup
                              row
                              value={logicOperatorNear}
                              onChange={(e) => setLogicOperatorNear(e.target.value)}
                            >
                              <FormControlLabel value="AND" control={<Radio />} label="AND" />
                              <FormControlLabel value="OR" control={<Radio />} label="OR" />
                            </RadioGroup>
                          </Grid>
                        </>
                      )}
                      {additionalFiltersNear.length === 0 && (
                        <Grid item md={4} sm={12} xs={12} >
                          <Button variant="contained" onClick={handleAddFilterNear} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedConditionNear) ? false : !filterValueNear || selectedColumnNear.length === 0}>
                            Add Filter
                          </Button>
                        </Grid>
                      )}

                      <Grid item md={2} sm={12} xs={12}>
                        <Button variant="contained" onClick={() => {
                          fetchMaintentanceIndividualSingle();
                          setIsSearchActiveNear(true);
                          setAdvancedFilterNear([
                            ...additionalFiltersNear,
                            { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }
                          ])
                        }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedConditionNear) ? false : !filterValueNear || selectedColumnNear.length === 0}>
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </DialogContent>
            </Box>
          </Popover>

          &ensp;
          {isUserRoleCompare?.includes("bdassetworkstationgrouping") && (
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
          {projectCheck1 ? (
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
                {/* <FacebookCircularProgress /> */}
              </Box>
            </Box>
          ) : (
            <>
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <>
                  <AggridTableForPaginationTable
                    rowDataTable={rowDataTableNearTat}
                    columnDataTable={columnDataTableNeartat}
                    columnVisibility={columnVisibilityNeartat}
                    page={pageNearTatPrimary}
                    setPage={setPageNearTatPrimary}
                    pageSize={pageSizeNearTatPrimary}
                    totalPages={totalPagesNearTatPrimary}
                    setColumnVisibility={setColumnVisibilityNeartat}
                    selectedRows={selectedRowsNear}
                    setSelectedRows={setSelectedRowsNear}
                    gridRefTable={gridRefTableNear}
                    totalDatas={totalProjectsNear}
                    setFilteredRowData={setFilteredRowDataNear}
                    filteredRowData={filteredRowDataNear}
                    gridRefTableImg={gridRefTableImgNear}
                    itemsList={overallFilterdataNear}
                  />
                </>
              </Box>
            </>
          )}
          {/* ****** Table End ****** */}
        </Box>
      </>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Group Asset Workstation Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintentancemasteredit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{maintentancemasteredit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintentancemasteredit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{maintentancemasteredit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintentancemasteredit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{maintentancemasteredit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> workstation</Typography>
                  <Typography>{maintentancemasteredit.workstation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Material</Typography>
                  <Typography>
                    {maintentancemasteredit.assetmaterial}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>{maintentancemasteredit.component}</Typography>
                </FormControl>
              </Grid>

              {/* <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Subcomponents</Typography>
                  <Typography>
                    {maintentancemasteredit.subcomponentsstring}
                  </Typography>
                </FormControl>
              </Grid> */}
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

      <Dialog
        open={openviewnear}
        onClose={handleClickOpenviewnear}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Individual Asset Workstation Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{maintentancemasteredit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{maintentancemasteredit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{maintentancemasteredit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{maintentancemasteredit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{maintentancemasteredit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{maintentancemasteredit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> workstation</Typography>
                  <Typography>{maintentancemasteredit.workstation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Material</Typography>
                  <Typography>
                    {maintentancemasteredit.assetmaterial}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Material</Typography>
                  <Typography>{maintentancemasteredit?.component}</Typography>
                </FormControl>
              </Grid>

              {/* <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Subcomponents</Typography>
                  <Typography>
                    {maintentancemasteredit.subcomponentsstring}
                  </Typography>
                </FormControl>
              </Grid> */}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseviewnear}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* EXTERNAL COMPONENTS --------------TABLE1 START */}
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
        itemsTwo={filteteredip ?? []}
        filename={"Asset WorkStation Grouping Group"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Workstation Grouping Info"
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

      {/* EXTERNAL COMPONENTS --------------TABLE 1 END */}

      {/* EXTERNAL COMPONENTS -------------- TABLE 2START */}

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpennear}
        handleCloseFilterMod={handleCloseFilterModnear}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpennear}
        isPdfFilterOpen={isPdfFilterOpennear}
        setIsPdfFilterOpen={setIsPdfFilterOpennear}
        handleClosePdfFilterMod={handleClosePdfFilterModnear}
        filteredDataTwo={(filteredChangesNear !== null ? filteredRowDataNear : rowDataTableNearTat) ?? []}
        itemsTwo={overallFilterdataNear ?? []}
        filename={"Asset WorkStation Grouping Individual"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefNear}
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
      <DeleteConfirmation
        open={isDeleteOpenNear}
        onClose={handleCloseModNear}
        onConfirm={delProjectNear}
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
      {/* EXTERNAL COMPONENTS -------------- TABLE2 END */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
  );
}

export default AssetWorkStationGrouping;