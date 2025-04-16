import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MultiSelect } from "react-multi-select-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Button,
  Checkbox,
  TableCell,
  Table,
  TableContainer,
  Paper,
  TableBody,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select, Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaFileCsv, FaSearch,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import Pagination from "../../components/Pagination";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "./Webcameimageasset";
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
import ManageColumnsContent from "../../components/ManageColumn";
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';


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

function AssetDetailsList() {
  const [items, setItems] = useState([]);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);
  const { auth } = useContext(AuthContext);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    workStationSystemName,
    isAssignBranch,
    allfloor,
    alllocationgrouping,
    allareagrouping, pageName, setPageName, buttonStyles,
  } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


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


  const [selectedRowsAssetList, setSelectedRowsAssetList] = useState([])
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjcode, setOvProjcode] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({

    assetmaterialip: [],
    assetworkstationgrouping: [],
    // maintenancedetailsmaster: [],
    maintenancemaster: [],
    assetempdistribution: [],
    maintenancenonschedulegrouping: [],
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
  const [visiblePages, setVisiblePages] = useState(3);

  const [pageNumbers, setPageNumbers] = useState([]);

  //MULTISELECT ONCHANGE START

  //company multiselect
  //team multiselect
  const [materialOpt, setMaterialopt] = useState([]);
  const [selectedOptionsAssetMaterial, setSelectedOptionsAssetMaterial] = useState([]);
  let [valueAssetMaterial, setValueAssetMaterial] = useState([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
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
    setValueAssetMaterial([]);
    setSelectedOptionsAssetMaterial([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };



  const handleAssetMaterialChange = (options) => {
    setValueAssetMaterial(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsAssetMaterial(options);
  };

  const customValueRendererAssetMaterial = (valueAssetMaterial, _categoryname) => {
    return valueAssetMaterial?.length
      ? valueAssetMaterial?.map(({ label }) => label)?.join(", ")
      : "Please Select Asset Material";
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

  //cancel for create section
  const handleAssetMaterials = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultall = res?.data?.assetmaterial?.map((d) => ({
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAssetMaterials();
  }, []);


  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany?.length === 0 &&
      selectedOptionsBranch?.length === 0 &&
      selectedOptionsUnit?.length === 0 &&
      selectedOptionsAssetMaterial?.length === 0) {
      setPopupContentMalert("Please Select Any One");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchAssetDetails("Filtered");
    }
  };

  const handleClear = () => {
    setAssetdetails([]);
    setItems([]);
    setPage(1)
    setTotalProjects(0);
    setTotalPages(0);
    setPageSize(10)
    setOverallFilterdata([]);
    setSelectedOptionsCompany([])
    setSelectedOptionsBranch([])
    setSelectedOptionsUnit([])
    setSelectedOptionsAssetMaterial([])
    setValueCompanyCat([])
    setValueBranchCat([])
    setValueUnitCat([])
    setValueAssetMaterial([])
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  }
  let exportColumnNames = [
    "Status",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "WorkStation",
    "AssetType",
    "Asset",
    "Material",
    "Component",
    "Material Code",
    "Count(Qty)",
    "Rate",
    "Warranty",
    "Purchasedate",
    "Vendor Group",
    "Vendor",
  ];
  let exportRowValues = [
    "status",
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "workstation",
    "assettype",
    "asset",
    "material",
    "component",
    "code",
    "countquantity",
    "rate",
    "warranty",
    "purchasedate",
    "vendorgroup",
    "vendor",
  ];

  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deletecheck, setdeletecheck] = useState(false);

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = async () => {
    setIsDeleteOpen(false);
    setdeletecheck(!deletecheck);
  };

  const EbUsage = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const [floorsEdit, setFloorEdit] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [Specificationedit, setSpecificationedit] = useState([]);
  let name = "create";
  let nameedit = "edit";
  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const handleChangephonenumberEdit = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setAssetdetailEdit({ ...assetdetailEdit, estimation: inputValue });
    }
  };



  // const accessbranch = isAssignBranch
  //   ?.map((data) => ({
  //     branch: data.branch,
  //     company: data.company,
  //     unit: data.unit,
  //   }))


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



  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorOptEdit, setVendoroptEdit] = useState([]);
  const [assetdetails, setAssetdetails] = useState([]);
  const [assetdetailCheck, setAssetdetailcheck] = useState(false);
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  //TODOS
  const [todosEdit, setTodosEdit] = useState([]);
  const classes = useStyles();
  //filter fields

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const gridRef = useRef(null);

  const [vendorGroup, setVendorGroup] = useState("Please Select Vendor Group");
  const [vendorGroupOpt, setVendorGroupopt] = useState([]);
  const [vendorOverall, setVendorOverall] = useState([]);
  const [vendorOpt, setVendoropt] = useState([]);
  const [vendor, setVendor] = useState("Please Select Vendor");

  const fetchVendor = async () => {
    try {
      let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const allGroup = Array.from(
        new Set(res1?.data?.vendorgrouping.map((d) => d.name))
      ).map((item) => {
        return {
          label: item,
          value: item,
        };
      });

      setVendorGroupopt(allGroup);
      setVendorOverall(res1?.data?.vendorgrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleChangeGroupName = async (e) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

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

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    setVendoropt(final);
  };

  const [vendorOptInd, setVendoroptInd] = useState([]);

  const handleChangeGroupNameIndexBased = async (e, index) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

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

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    setVendoroptInd((prev) => {
      const updated = [...prev];
      updated[index] = final;
      return updated;
    });
  };

  // putcall setstate
  const [assetdetailEdit, setAssetdetailEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    workstation: "Please Select Workstation",
    department: "Please Select Department",
    responsibleteam: "Please Select Responsible Person",
    team: "Please Select Responsible Team",
    assettype: "Please Select Asset Type",
    asset: "Please Select Asset Head",
    material: "Please Select Material",
    component: "Please Select Component",
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
    vendor: "Please Select Vendor",
    customercare: "",
    stockcode: "",
    ebusage: "Please Select EB Usage",
  });

  const [specificationGroupingEdit, setSpecificationGroupingEdit] = useState(
    []
  );

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  console.log(page, pageSize, "number")

  const fetchAssetDetails = async (e) => {

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      material: valueAssetMaterial,
      assignbranch: accessbranch,
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
    setAssetdetailcheck(true);

    try {
      if (e === "Filtered") {
        let res_employee = await axios.post(SERVICE.ASSET_DATA_FILTER_ACCESS, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
        const itemsWithSerialNumber = ans?.map((item, index) => {

          return {
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,
            purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
            workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,


          }
        });
        console.log(res_employee?.data, ans, 'res_employee?.data')

        setAssetdetails(itemsWithSerialNumber);
        setItems(itemsWithSerialNumber);
        setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
          res_employee?.data?.totalProjectsData?.map((item, index) => {
            return {
              ...item,
              serialNumber: (page - 1) * pageSize + index + 1,
              purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
              workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

            }
          }

          ) : []
        );
        setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });
        setAssetdetailcheck(false)
      } else {
        setAssetdetailcheck(false)
      }
    }
    catch (err) {
      setAssetdetailcheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchWorkStation();

    fetchVendor();
  }, []);

  useEffect(() => {
    if (items?.length > 0) {
      fetchAssetDetails("Filtered");
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchSpecificationGroupingEdit();
  }, [isEditOpen, assetdetailEdit.component]);


  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assetdetail.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // view model
  const [openview, setOpenview] = useState(false);
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  // const handleClickOpenalert = () => {
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     setIsDeleteOpencheckbox(true);
  //   }
  // };




  const handleClickOpenalert = async () => {
    try {



      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        const [resmatip] = await Promise.all([


          axios.post(SERVICE.OVERALL_DELETE_ASSET_LIST_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            matassetip: selectedRowsAssetList

          }),

        ])

        setCheckassetip(resmatip?.data?.assetmaterialip);
        setCheckassetwrkgrp(resmatip?.data?.assetworkstationgrouping);
        setCheckmaindetails(resmatip?.data?.maintenancedetailsmaster);
        setCheckmaintmaster(resmatip?.data?.maintenancemaster);
        setChecknonschedule(resmatip?.data?.maintenancenonschedulegrouping);
        setCheckAssetempdis(resmatip?.data?.assetempdistribution);


        let assetmaterialip = resmatip?.data?.assetmaterialip.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          // code: item.component[0].split(`${item.assetmaterial}-`)[1],
          // workstation: data.workstation,
          assetmaterial: item.component[0]
        }));
        let assetworkstationgrouping = resmatip?.data?.assetworkstationgrouping.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          // code: item.component[0].split(`${item.assetmaterial}-`)[1],
          // workstation: data.workstation,
          assetmaterial: item.component[0]
        }));

        let maintenancemaster = resmatip?.data?.maintenancemaster.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          // code: item.assetmaterialcode[0].split(`${item.assetmaterial}-`)[1],
          // workstation: data.workstation,
          assetmaterial: item.assetmaterialcode[0]
        }));
        let assetempdistribution = resmatip?.data?.assetempdistribution.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          // /  code: item.assetmaterialcode.split(`${item.assetmaterial}-`)[1],
          // workstation: data.workstation,
          assetmaterial: item.assetmaterialcode
        }));
        let maintenancenonschedulegrouping = resmatip?.data?.maintenancenonschedulegrouping.map(item => ({
          company: item.companyto,
          branch: item.branchto,
          unit: item.unitto,
          floor: item.floorto,
          area: item.areato,
          location: item.locationto,
          // code: item.component[0].split(`${item.assetmaterial}-`)[1],
          // workstation: data.workstation,
          assetmaterial: item.assetmaterial
        }));


        if (
          (resmatip?.data?.assetmaterialip)?.length > 0 ||
          (resmatip?.data?.assetworkstationgrouping)?.length > 0 ||
          (resmatip?.data?.maintenancemaster)?.length > 0 ||
          (resmatip?.data?.maintenancenonschedulegrouping)?.length > 0 ||
          (resmatip?.data?.assetempdistribution)?.length > 0
        ) {
          handleClickOpenCheckbulk();
          // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
          setOveraldeletecheck({
            ...overalldeletecheck,

            assetmaterialip: assetmaterialip,
            assetworkstationgrouping: assetworkstationgrouping,
            maintenancenonschedulegrouping: maintenancenonschedulegrouping,
            maintenancemaster: maintenancemaster,
            assetempdistribution: assetempdistribution,



          })



          setCheckassetip([])
          setCheckmaindetails([])
          setCheckassetwrkgrp([])
          setCheckmaintmaster([])
          setCheckAssetempdis([])
          setChecknonschedule([])

        } else {
          setIsDeleteOpencheckbox(true);
        }
      }
    }
    catch
    (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

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

  const calculateTotalRateEdit = () => {
    let sum = 0;
    todosEdit.forEach((item) => {
      sum += parseInt(item.rate);
    });
    return String(sum);
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
        type: sub.type ? "Please Select Type" : "",
        subcomponentcheck: false,
        model: sub.model ? "Please Select Model" : "",
        size: sub.size ? "Please Select Size" : "",
        variant: sub.variant ? "Please Select variant" : "",
        brand: sub.brand ? "Please Select Brand" : "",
        serial: sub.serial ? "" : undefined,
        other: sub.other ? "" : undefined,
        capacity: sub.capacity ? "Please Select Capacity" : "",
        hdmiport: sub.hdmiport ? "" : undefined,
        vgaport: sub.vgaport ? "" : undefined,
        dpport: sub.dpport ? "" : undefined,
        usbport: sub.usbport ? "" : undefined,
        paneltypescreen: sub.paneltypescreen ? "Please Select Panel Type" : "",
        resolution: sub.resolution ? "Please Select Screen Resolution" : "",
        connectivity: sub.connectivity ? "Please Select Connectivity" : "",
        daterate: sub.daterate ? "Please Select Data Rate" : "",
        compatibledevice: sub.compatibledevice
          ? "Please Select Compatible Device"
          : "",
        outputpower: sub.outputpower ? "Please Select Output Power" : "",
        collingfancount: sub.collingfancount
          ? "Please Select Cooling Fan Count"
          : "",
        clockspeed: sub.clockspeed ? "Please Select Clock Speed" : "",
        core: sub.core ? "Please Select Core" : "",
        speed: sub.speed ? "Please Select Speed" : "",
        frequency: sub.frequency ? "Please Select Frequency" : "",
        output: sub.output ? "Please Select Output" : "",
        ethernetports: sub.ethernetports ? "Please Select Ethernet Ports" : "",
        distance: sub.distance ? "Please Select Distance" : "",
        lengthname: sub.lengthname ? "Please Select Length" : "",
        slot: sub.slot ? "Please Select Slot" : "",
        noofchannels: sub.noofchannels ? "Please Select No. Of Channels" : "",
        colours: sub.colours ? "Please Select Colour" : "",
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
        // vendorgroup: assetdetailEdit.vendorgroup ? assetdetailEdit.vendorgroup : undefined,
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
          type: specificationItem.type ? "Please Select Type" : "",
          subcomponentcheck: false,
          model: specificationItem.model ? "Please Select Model" : "",
          size: specificationItem.size ? "Please Select Size" : "",
          variant: specificationItem.variant ? "Please Select variant" : "",
          brand: specificationItem.brand ? "Please Select Brand" : "",
          serial: specificationItem.serial ? "" : undefined,
          other: specificationItem.other ? "" : undefined,
          capacity: specificationItem.capacity ? "Please Select Capacity" : "",
          hdmiport: specificationItem.hdmiport ? "" : undefined,
          vgaport: specificationItem.vgaport ? "" : undefined,
          dpport: specificationItem.dpport ? "" : undefined,
          usbport: specificationItem.usbport ? "" : undefined,
          paneltypescreen: specificationItem.paneltypescreen
            ? "Please Select Panel Type"
            : "",
          resolution: specificationItem.resolution
            ? "Please Select Screen Resolution"
            : "",
          connectivity: specificationItem.connectivity
            ? "Please Select Connectivity"
            : "",
          daterate: specificationItem.daterate ? "Please Select Data Rate" : "",
          compatibledevice: specificationItem.compatibledevice
            ? "Please Select Compatible Device"
            : "",
          outputpower: specificationItem.outputpower
            ? "Please Select Output Power"
            : "",
          collingfancount: specificationItem.collingfancount
            ? "Please Select Cooling Fan Count"
            : "",
          clockspeed: specificationItem.clockspeed
            ? "Please Select Clock Speed"
            : "",
          core: specificationItem.core ? "Please Select Core" : "",
          speed: specificationItem.speed ? "Please Select Speed" : "",
          frequency: specificationItem.frequency
            ? "Please Select Frequency"
            : "",
          output: specificationItem.output ? "Please Select Output" : "",
          ethernetports: specificationItem.ethernetports
            ? "Please Select Ethernet Ports"
            : "",
          distance: specificationItem.distance ? "Please Select Distance" : "",
          lengthname: specificationItem.lengthname
            ? "Please Select Length"
            : "",
          slot: specificationItem.slot ? "Please Select Slot" : "",
          noofchannels: specificationItem.noofchannels
            ? "Please Select No. Of Channels"
            : "",
          colours: specificationItem.colours ? "Please Select Colour" : "",
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
          // vendorgroup: assetdetailEdit.vendorgroup ? assetdetailEdit.vendorgroup : undefined,

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
    setGetImgbillcode(valueimg);
    handleImgcodeviewbill();
  };
  const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
  //get single row to edit....
  const getCode = async (e, code, data) => {
    setPageName(!pageName)

    handleClickOpenEdit();
    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const match = workStationSystemName?.find(secObj =>
        secObj.company === res?.data?.sassetdetail.company &&
        secObj.branch === res?.data?.sassetdetail.branch &&
        secObj.unit === res?.data?.sassetdetail.unit &&
        secObj.floor === res?.data?.sassetdetail.floor &&
        secObj.cabinname === res?.data?.sassetdetail.workstation?.split("(")[0]
      );


      setOvProj([
        {
          company: data.company,
          branch: data.branch,
          unit: data.unit,
          floor: data.floor,
          area: data.area,
          location: data.location,
          code: data.code,
          // workstation: data.workstation,
          assetmaterial: data.material
        }
      ]);
      getOverallEditSection([
        {
          company: data.company,
          branch: data.branch,
          unit: data.unit,
          floor: data.floor,
          area: data.area,
          location: data.location,
          code: data.code,
          // workstation: data.workstation,
          assetmaterial: data.material
        }
      ], {
        company: data.company,
        branch: data.branch,
        unit: data.unit,
        floor: data.floor,
        area: data.area,
        location: data.location,
        code: data.code,
        // workstation: data.workstation,
        assetmaterial: data.material
      });
      // setAssetdetailEdit(res?.data?.sassetdetail);
      setAssetdetailEdit({ ...res?.data?.sassetdetail, workstationlabel: `${res?.data?.sassetdetail?.workstation}(${match.systemshortname})` });

      setVendor(res?.data?.sassetdetail?.vendor);

      for (let i = 0; i < res?.data?.sassetdetail?.subcomponent?.length; i++) {
        await handleChangeGroupNameIndexBased(
          { value: res?.data?.sassetdetail?.subcomponent[i]?.vendorgroup },
          i
        );
      }

      setVendorGroup(res?.data?.sassetdetail?.vendorgroup);
      await handleChangeGroupName({
        value: res?.data?.sassetdetail?.vendorgroup,
      });
      setTodosEdit(res?.data?.sassetdetail?.subcomponent);

      setRefImageedit(res?.data?.sassetdetail.files);
      // setRefImageDragedit(res?.data?.sassetdetail.files);
      // setCapturedImagesedit(res?.data?.sassetdetail.files);

      setAllUploadedFilesedit(res?.data?.sassetdetail.files);
      setSelectedPurchaseDateEdit(res?.data?.sassetdetail.purchasedate);

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
    } catch (err) {
      console.log(err, "error")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)

    try {
      let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetailEdit(res?.data?.sassetdetail);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
    vendorgroup: true,
    actions: true,
    status: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //get all Sub vendormasters.

  const [deleteAssetdetail, setDeleteAssetdetail] = useState("");

  // const rowData = async (id, name) => {
  //   setPageName(!pageName)

  //   try {
  //     let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setDeleteAssetdetail(res?.data?.sassetdetail);
  //     setdeletecheck(!deletecheck);
  //     handleClickOpen();
  //   } catch (err) {
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };
  // Alert delete popup

  // Alert delete popup



  const [checkassetip, setCheckassetip] = useState([]);
  const [checkassetwrkgrp, setCheckassetwrkgrp] = useState([]);
  const [checkmaindetails, setCheckmaindetails] = useState([]);
  const [checkmaintmaster, setCheckmaintmaster] = useState([]);
  const [checknonschedule, setChecknonschedule] = useState([]);
  const [checkassetempdis, setCheckAssetempdis] = useState([]);

  const rowData = async (id, code, data) => {

    setPageName(!pageName)

    try {
      // let res = await axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });

      const [res, resmatip, resworkgrp, resmaindetmaster, resmainmaster, resnonschedule, resempdis] = await Promise.all([
        axios.get(`${SERVICE.ASSETDETAIL_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),

        axios.post(SERVICE.OVERALL_DELETE_ASSET_LIST_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          matassetip: [
            {
              company: data.company,
              branch: data.branch,
              unit: data.unit,
              floor: data.floor,
              area: data.area,
              location: data.location,
              code: data.code,
              // workstation: data.workstation,
              assetmaterial: data.material
            }
          ]
          ,

        }),

      ])
      // console.log(resempdis?.data?.assetempdistribution, "empdis")
      setDeleteAssetdetail(res?.data?.sassetdetail);
      setCheckassetip(resmatip?.data?.assetmaterialip);
      setCheckassetwrkgrp(resmatip?.data?.assetworkstationgrouping);
      setCheckmaindetails(resmatip?.data?.maintenancedetailsmaster);
      setCheckmaintmaster(resmatip?.data?.maintenancemaster);
      setChecknonschedule(resmatip?.data?.maintenancenonschedulegrouping);
      setCheckAssetempdis(resmatip?.data?.assetempdistribution);
      setdeletecheck(!deletecheck);



      if (
        (resmatip?.data?.assetmaterialip)?.length > 0
        ||
        (resmatip?.data?.assetworkstationgrouping)?.length > 0 ||
        (resmatip?.data?.maintenancedetailsmaster)?.length > 0 ||
        (resmatip?.data?.maintenancemaster)?.length > 0 ||
        (resmatip?.data?.maintenancenonschedulegrouping)?.length > 0 ||
        (resmatip?.data?.assetempdistribution)?.length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }


      // handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




  let Assetdetailsid = deleteAssetdetail?._id;
  const delAssetdetail = async () => {
    setPageName(!pageName)

    try {
      if (Assetdetailsid) {
        await axios.delete(`${SERVICE.ASSETDETAIL_SINGLE}/${Assetdetailsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setdeletecheck(!deletecheck);

        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
      fetchAssetDetails("Filtered");
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delAssetcheckbox = async () => {
    setPageName(!pageName)

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
      fetchAssetDetails("Filtered");
      // await fetchAssetSort();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const delaccountheadwithoutlink = async () => {
    try {
      let valfilter = [

        ...overalldeletecheck.assetmaterialip,
        ...overalldeletecheck.assetworkstationgrouping,
        ...overalldeletecheck.maintenancemaster,
        ...overalldeletecheck.assetempdistribution,
        ...overalldeletecheck.maintenancenonschedulegrouping,
      ];

      let filtered = rowDataTable.filter(d => !valfilter.some(condition =>
        condition.company === d.company && condition.branch === d.branch
        && condition.unit === d.unit
        && condition.floor === d.floor && condition.area === d.area
        && condition.location === d.location && condition.assetmaterial === `${d.material}-${d.code}`))?.flatMap(d => selectedRows?.filter(item => d.id === item));
      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.ASSETDETAIL_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      fetchAssetDetails("Filtered");
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assetdetail",
    pageStyle: "print",
  });

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



  const addSerialNumber = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => (
    //   {
    //     ...item,
    //     serialNumber: index + 1,
    //     purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
    //     workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

    //   }));

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(assetdetails);
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
  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [

    {
      field: "checkbox",
      headerName: "", // Default header name
      headerStyle: {
        fontWeight: "bold",
      },
      sortable: false,
      width: 90,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 140,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            backgroundColor:
              params.data.status === "Repair"
                ? "#FFC300"
                : params.data.status === "In Working"
                  ? "green"
                  : "blue",
            color: params.data.status === "Repair" ? "black" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.data.status}
        </Button>
      ),
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
      headerName: "Count(Qty)",
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
      field: "vendorgroup",
      headerName: "Vendor Group",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendorgroup,
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
      cellRenderer: (params) => (
        <>
          {params.data.files.length > 0 ? (
            <Button
              sx={{
                padding: "14px 14px",
                minWidth: "40px !important",
                borderRadius: "50% !important",
                ":hover": {
                  backgroundColor: "#80808036", // theme.palette.primary.main
                },
              }}
              onClick={() => getimgbillCode(params.data.files)}
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
      width: 290,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassetmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.code, params.data);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.code, params.data);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetmaster") && (
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
          {isUserRoleCompare?.includes("iassetmaster") && (
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


  const rowDataTable = items?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      purchasedate: item.purchasedate,
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

      // purchasedate: moment(item.purchasedate).format("DD/MM/YYYY"),
      vendor: item.vendor,
      vendorgroup: item.vendorgroup,
      customercare: item.customercare,
      stockcode: item.materialcountcode + "#" + item.serialNumber,
      files: item.files,
      status: item.status,
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

  useEffect(() => {
    var filteredWorksedit;
    // if (
    //   (assetdetailEdit.unit === "" || assetdetailEdit.unit == undefined) &&
    //   (assetdetailEdit.floor === "" || assetdetailEdit.floor == undefined)
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetailEdit.company &&
    //       u.branch === assetdetailEdit.branch
    //   );
    // } else if (
    //   assetdetailEdit.unit === "" ||
    //   assetdetailEdit.unit == undefined
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetailEdit.company &&
    //       u.branch === assetdetailEdit.branch &&
    //       u.floor === assetdetailEdit.floor
    //   );
    // } else if (
    //   assetdetailEdit.floor === "" ||
    //   assetdetailEdit.floor == undefined
    // ) {
    //   filteredWorksedit = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetailEdit.company &&
    //       u.branch === assetdetailEdit.branch &&
    //       u.unit === assetdetailEdit.unit
    //   );
    // } else {
    filteredWorksedit = workStationOpt?.filter(
      (u) =>
        u.company === assetdetailEdit.company &&
        u.branch === assetdetailEdit.branch &&
        u.unit === assetdetailEdit.unit &&
        u.floor === assetdetailEdit.floor
    );
    // }
    // const result = filteredWorksedit?.flatMap((item) => {
    //   return item.combinstation.flatMap((combinstationItem) => {
    //     return combinstationItem.subTodos.length > 0
    //       ? combinstationItem.subTodos.map(
    //         (subTodo) =>
    //           subTodo.subcabinname +
    //           "(" +
    //           item.branch +
    //           "-" +
    //           item.floor +
    //           ")"
    //       )
    //       : [
    //         combinstationItem.cabinname +
    //         "(" +
    //         item.branch +
    //         "-" +
    //         item.floor +
    //         ")",
    //       ];
    //   });
    // });



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
      updatedResult.flat()?.map((d) => ({
        ...d,
        // label: d,
        // value: d,
        label: d?.systemshortname
          ? `${d?.finalworkstation}(${d?.systemshortname})`
          : d?.finalworkstation, value: d?.finalworkstation,
      }))
    );
  }, [assetdetailEdit, isEditOpen]);

  const fetchFloorEdit = async (e) => {
    let result = allfloor.filter((d) => d.branch === e);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloorEdit(floorall);
  };
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

  useEffect(() => {
    fetchAllLocationEdit();
  }, [isEditOpen, assetdetailEdit.floor]);

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchspecificationEdit();
  }, [isEditOpen]);

  let updateby = assetdetailEdit?.updatedby;
  let addedby = assetdetailEdit?.addedby;
  let subprojectsid = assetdetailEdit?._id;

  //overall edit section for all pages
  const getOverallEditSection = async (e, d) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ASSET_LIST_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        // oldnamecode: code
      });
      setOvProjCount(res?.data?.count);


      setGetOverallCount(`The ${`${d.company + " ," +
        d.branch + " ," +
        d.unit + " ," +
        d.floor + " ," +
        d.area + " ," +
        d.location + " ," +
        // d.workstation + " ," +
        d.assetmaterial + " ," +
        d.code + " ,"
        } `} is linked in
          ${res?.data?.assetmaterialip?.length > 0 ? "Asset Material IP," : ""}
        ${res?.data?.assetworkstationgrouping?.length > 0 ? "Asset Workstation Grouping ," : ""} 
         ${res?.data?.maintenancemaster?.length > 0 ? "Maintenance Master," : ""}
        ${res?.data?.assetempdistribution?.length > 0 ? "Employee Asset Distribution ," : ""} 
        ${res?.data?.maintenancenonschedulegrouping?.length > 0 ? "Maintenance Non Schedule Grouping ," : ""}
        
        whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ASSET_LIST_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });

      sendEditRequestOverall(

        res?.data?.assetmaterialip,
        res?.data?.assetworkstationgrouping,
        res?.data?.maintenancemaster,
        res?.data?.assetempdistribution,
        res?.data?.maintenancenonschedulegrouping,

      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (
    assetmaterialip, assetworkstationgrouping, maintenancemaster,
    assetempdistribution, maintenancenonschedulegrouping) => {
    try {

      if (assetmaterialip.length > 0) {




        let answ = assetmaterialip.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETMATERIALIP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(assetdetailEdit.company),
            branch: String(assetdetailEdit.branch),
            unit: String(assetdetailEdit.unit),
            floor: String(assetdetailEdit.floor),
            location: String(assetdetailEdit.location),
            area: String(assetdetailEdit.area),

          });
        });
      }






      if (assetworkstationgrouping.length > 0) {


        let answ = assetworkstationgrouping.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            company: String(assetdetailEdit.company),
            branch: String(assetdetailEdit.branch),
            unit: String(assetdetailEdit.unit),
            floor: String(assetdetailEdit.floor),
            location: String(assetdetailEdit.location),
            area: String(assetdetailEdit.area),

          });
        });
      }




      if (maintenancemaster.length > 0) {



        let answ = maintenancemaster.map((d, i) => {
          let res = axios.put(`${SERVICE.MAINTENTANCE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(assetdetailEdit.company),
            branch: String(assetdetailEdit.branch),
            unit: String(assetdetailEdit.unit),
            floor: String(assetdetailEdit.floor),
            location: String(assetdetailEdit.location),
            area: String(assetdetailEdit.area),

          });
        });
      }




      if (assetempdistribution.length > 0) {


        let answ = assetempdistribution.map((d, i) => {
          let res = axios.put(`${SERVICE.EMPLOYEEASSET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            company: String(assetdetailEdit.company),
            branch: String(assetdetailEdit.branch),
            unit: String(assetdetailEdit.unit),
            floor: String(assetdetailEdit.floor),
            location: String(assetdetailEdit.location),
            area: String(assetdetailEdit.area),

          });
        });
      }

      if (maintenancenonschedulegrouping.length > 0) {


        let answ = maintenancenonschedulegrouping.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            companyto: String(assetdetailEdit.company),
            branchto: String(assetdetailEdit.branch),
            unitto: String(assetdetailEdit.unit),
            floorto: String(assetdetailEdit.floor),
            locationto: String(assetdetailEdit.location),
            areato: String(assetdetailEdit.area),

          });
        });
      }


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
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
          ebusage: String(assetdetailEdit.ebusage),
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
          vendor: String(vendor),
          vendorgroup: String(vendorGroup),
          customercare: String(assetdetailEdit.customercare),
          stockcode: String(assetdetailEdit.stockcode),
          address: String(vendorgetidEdit.address),
          phonenumber: String(vendorgetidEdit.phonenumber),
          files: [...refImageedit,
          ...refImageDragedit,
          ...capturedImagesedit],
          status: "In Working",
          assignedthrough: "ASSET",
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await getOverallEditSectionUpdate();
      fetchAssetDetails("Filtered");
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    setPageName(!pageName)

    if (assetdetailEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetailEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetailEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetailEdit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetailEdit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetailEdit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assetdetailEdit.ebusage === "Please Select EB Usage" ||
      assetdetailEdit.ebusage === ""
    ) {
      setPopupContentMalert("Please Select EB Usage!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorGroup === "" ||
      vendorGroup === "Please Select Vendor Group"
    ) {
      setPopupContentMalert("Please Select Vendor Group!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor === "" || vendor === "Please Select Vendor") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assetdetailEdit.warranty == "Yes" &&
      assetdetailEdit.estimation === ""
    ) {
      setPopupContentMalert("Please Enter Warranty Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      (assetdetailEdit.company != ovProj[0].company ||
        assetdetailEdit.branch != ovProj[0].branch ||
        assetdetailEdit.unit != ovProj[0].unit ||
        assetdetailEdit.floor != ovProj[0].floor ||
        assetdetailEdit.area != ovProj[0].area ||
        assetdetailEdit.location != ovProj[0].location
      )
      && ovProjCount > 0
    ) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else {
      sendEditRequest();
    }
  };

  const [vendorgetidEdit, setVendorgetidEdit] = useState({});
  const [vendornameidEdit, setVendornameidEdit] = useState("");

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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
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
    const newCapturedImages = [...capturedImagesedit];
    newCapturedImages.splice(index, 1);
    setCapturedImagesedit(newCapturedImages);
  };

  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
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
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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





  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);


  const handleRemarkChangeUpload = (value, index) => {
    setRefImageedit((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
  const handleRemarkChangeWebCam = (value, index) => {
    setCapturedImagesedit((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };

  const handleRemarkChangeDragDrop = (value, index) => {
    setRefImageDrag((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
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
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
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
  const [selectedPurchaseDateEdit, setSelectedPurchaseDateEdit] = useState("");

  const handleEstimationChangeEdit = (e) => {
    const { value } = e.target;
    setAssetdetailEdit({ ...assetdetailEdit, estimationtime: value });
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

  // const fetchAssetSort = async () => {
  //   try {
  //     let res_employee = await axios.post(SERVICE.OVERALLSORT_ASSET, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       page: Number(page),
  //       pageSize: Number(pageSize),
  //       searchQuery: searchQuery,
  //       assignbranch: accessbranch,
  //     });

  //     const ans =
  //       res_employee?.data?.result?.length > 0
  //         ? res_employee?.data?.result
  //         : [];

  //     const itemsWithSerialNumber = ans?.map((item, index) => ({
  //       ...item,
  //       serialNumber: (page - 1) * pageSize + index + 1,
  //       purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
  //       workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

  //     }));
  //     //   setcheckemployeelist(true);
  //     setAssetdetails(itemsWithSerialNumber);
  //     setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
  //     setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
  //     setPageSize((data) => {
  //       return ans?.length > 0 ? data : 10;
  //     });
  //     setPage((data) => {
  //       return ans?.length > 0 ? data : 1;
  //     });

  //     setAssetdetailcheck(true);
  //   } catch (err) {
  //     setAssetdetailcheck(true);
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };

  // useEffect(() => {
  //   fetchAssetSort();
  // }, [page, pageSize, searchQuery]);


  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Asset Master List"),
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
    setAssetdetailcheck(true);

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
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      material: valueAssetMaterial,
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
      let res_employee = await axios.post(SERVICE.ASSET_DATA_FILTER_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result.filter(
        (data) => data.status === "In Working" || data.status === "Repair" || data.status === "Damage"
      ) : []

      const updatedResult = ans.map(mainObj => {
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



      const itemsWithSerialNumber = updatedResult?.map((item, index) => {

        return {
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
          workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,


        }
      });


      setAssetdetails(itemsWithSerialNumber);
      setItems(itemsWithSerialNumber);
      setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
        res_employee?.data?.totalProjectsData?.map((item, index) => {
          return {
            ...item,
            purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
            workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

          }
        }

        ) : []
      );
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setAssetdetailcheck(false)
    } catch (err) { setAssetdetailcheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };




  const getLinkedLabelItem = (overalldeletecheck) => {
    const {

      assetmaterialip = [],

      assetworkstationgrouping = [],
      maintenancemaster = [],
      assetempdistribution = [],
      maintenancenonschedulegrouping = [],

    } = overalldeletecheck;

    const labels = [
      ...assetmaterialip, ...assetworkstationgrouping,
      ...maintenancemaster, ...assetempdistribution,
      ...maintenancenonschedulegrouping].filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.company === value.company &&
              t.branch === value.branch &&
              t.unit === value.unit &&
              t.floor === value.floor &&
              t.area === value.area &&
              t.location === value.location &&
              t.assetmaterial === value.assetmaterial
          )
      )

    return labels;
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { assetmaterialip = [],
      assetworkstationgrouping = [],
      maintenancemaster = [],
      assetempdistribution = [],
      maintenancenonschedulegrouping = [], } = overalldeletecheck;
    const labels = [];



    if (assetmaterialip.length > 0) labels.push("Asset Material IP");
    if (assetworkstationgrouping.length > 0) labels.push("Asset Workstation Grouping");
    if (maintenancemaster.length > 0) labels.push("Maintenance Master");
    if (assetempdistribution.length > 0) labels.push("Asset Employee Distribution");
    if (maintenancenonschedulegrouping.length > 0) labels.push("Maintenance Non Schedule Grouping");

    return labels.join(", ");
  };

  const getFilteredUnits = (assetdetails, selectedRows, overalldeletecheck) => {
    const {
      assetmaterialip = [],
      assetworkstationgrouping = [],
      maintenancemaster = [],
      assetempdistribution = [],
      maintenancenonschedulegrouping = []
    } = overalldeletecheck;

    const allConditions = [
      ...assetmaterialip, ...assetworkstationgrouping,
      ...maintenancemaster, ...assetempdistribution,
      ...maintenancenonschedulegrouping].filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.company === value.company &&
              t.branch === value.branch &&
              t.unit === value.unit &&
              t.floor === value.floor &&
              t.area === value.area &&
              t.location === value.location &&
              t.assetmaterial === value.assetmaterial
          )
      )

    return assetdetails.filter(d => selectedRows?.includes(d._id) && !allConditions.some(condition =>
      condition.company === d.company && condition.branch === d.branch
      && condition.unit === d.unit
      && condition.floor === d.floor && condition.area === d.area
      && condition.location === d.location && condition.assetmaterial === `${d.material}-${d.code}`
    ))

  };

  const shouldShowDeleteMessage = (assetdetails, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetdetails, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (assetdetails, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetdetails, selectedRows, overalldeletecheck).length === 0;
  };




  return (
    <Box>
      <Headtitle title={"ASSET DETAILS"} />
      {/* <Typography sx={userStyle.HeaderText}> Manage Asset Detail</Typography> */}
      <PageHeading
        title="Manage Asset Detail"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Asset Master List"
        subpagename=""
        subsubpagename=""
      />
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
            marginTop: "90px",
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <form>
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
                        options={isAssignBranch
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
                            workstation: "Please Select Workstation",
                            workstationlabel: "Please Select Workstation",
                          });
                          setAreasEdit([]);
                          setFloorEdit([]);
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
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
                        options={isAssignBranch
                          ?.filter(
                            (comp) => assetdetailEdit.company === comp.company
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
                          label: assetdetailEdit.branch,
                          value: assetdetailEdit.branch,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            branch: e.value,
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                            workstation: "Please Select Workstation",
                            workstationlabel: "Please Select Workstation",
                          });
                          setAreasEdit([]);
                          setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                          setFloorEdit([]);
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
                        options={isAssignBranch
                          ?.filter(
                            (comp) =>
                              assetdetailEdit.company === comp.company &&
                              assetdetailEdit.branch === comp.branch
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
                            workstation: "Please Select Workstation",
                            workstationlabel: "Please Select Workstation",
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
                            workstation: "Please Select Workstation",
                            workstationlabel: "Please Select Workstation",
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
                            workstation: "Please Select Workstation",
                            workstationlabel: "Please Select Workstation",
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
                              assetdetailEdit.workstationlabel === "" ||
                                assetdetailEdit.workstationlabel === undefined
                                ? "Please Select Workstation"
                                : assetdetailEdit.workstationlabel,
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
                              workstationlabel: e.label,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        EB Usage<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EbUsage}
                        styles={colourStyles}
                        value={{
                          label:
                            assetdetailEdit.ebusage === ""
                              ? "Please Select EB Usage"
                              : assetdetailEdit.ebusage,
                          value:
                            assetdetailEdit.ebusage === ""
                              ? "Please Select EB Usage"
                              : assetdetailEdit.ebusage,
                        }}
                        onChange={(e) => {
                          setAssetdetailEdit({
                            ...assetdetailEdit,
                            ebusage: e.value,
                          });
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
                        value={assetdetailEdit.materialcountcode}
                      />
                    </FormControl>
                  </Grid>
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
                      <Typography>
                        {" "}
                        Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={vendorGroupOpt}
                        styles={colourStyles}
                        value={{ label: vendorGroup, value: vendorGroup }}
                        onChange={(e) => {
                          handleChangeGroupName(e);
                          setVendorGroup(e.value);
                          setVendor("Please Select Vendor");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={vendorOpt}
                        styles={colourStyles}
                        value={{
                          label: vendor,
                          value: vendor,
                        }}
                        onChange={(e) => {
                          setVendor(e.value);
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
                          value: assetdetailEdit.component,
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
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>


                                        <FormGroup>
                                          <FormControlLabel

                                            control={
                                              <Switch
                                                // color="success"
                                                sx={{
                                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: "green", // Thumb color when checked
                                                  },
                                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                    backgroundColor: "green", // Track color when checked
                                                  },
                                                  "& .MuiSwitch-switchBase": {
                                                    color: "#ff0000a3", // Thumb color when not checked
                                                  },
                                                  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                                    backgroundColor: "#ff0000a3", // Track color when not checked
                                                  },
                                                }}
                                                checked={todo.subcomponentcheck}
                                                onChange={(e) => {
                                                  handleChangeEdit(
                                                    index,
                                                    "subcomponentcheck",
                                                    e.target.checked
                                                  );
                                                }}
                                              />
                                            }
                                            label="Enable Subcomponent"
                                          />
                                        </FormGroup>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>


                                {todo.subcomponentcheck === true && (

                                  <>
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                disabled={todo.subcomponentcheck === false}
                                                placeholder="Please Enter DP Port"
                                                value={todo.dpport}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
                                              // onChange={(e) => {
                                              //   handleChangeEdit(
                                              //     index,
                                              //     "code",
                                              //     e.target.value
                                              //   );
                                              // }}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                  disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                Vendor Group Name
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <Selects
                                                options={vendorGroupOpt}
                                                styles={colourStyles}
                                                isDisabled={todo.subcomponentcheck === false}
                                                value={{
                                                  label: todo.vendorgroup,
                                                  value: todo.vendorgroup,
                                                }}
                                                onChange={(e) => {
                                                  handleChangeGroupNameIndexBased(
                                                    e,
                                                    index
                                                  );
                                                  handleChangeEdit(
                                                    index,
                                                    "vendorgroup",
                                                    e.value
                                                  );

                                                  setTodosEdit((prev) => {
                                                    const updated = [...prev];
                                                    updated[index].vendor =
                                                      "Please Select Vendor";
                                                    return updated;
                                                  });
                                                }}
                                              />
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item md={3} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                          <Grid item md={10} sm={10} xs={10}>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Vendor
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <Selects
                                                options={vendorOptInd[index]}
                                                styles={colourStyles}
                                                isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
                                                value={todo?.phonenumber}
                                                readOnly
                                              />
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </>

                                  </>
                                )}


                                {/* <Grid item md={1} sm={3} xs={3}>
                                  <Button
                                    sx={{
                                      padding: "14px 14px",
                                      marginTop: "16px",
                                      minWidth: "40px !important",
                                      borderRadius: "50% !important",
                                      ":hover": {
                                        backgroundColor: "#80808036", 
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
                               
                                </Grid> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container key={index} spacing={1}>
                            <Grid item md={12} sm={12} xs={12} marginTop={2}>
                              <Grid container key={index} spacing={1}>
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>


                                        <FormGroup>
                                          <FormControlLabel

                                            control={
                                              <Switch
                                                // color="success"
                                                sx={{
                                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: "green", // Thumb color when checked
                                                  },
                                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                    backgroundColor: "green", // Track color when checked
                                                  },
                                                  "& .MuiSwitch-switchBase": {
                                                    color: "#ff0000a3", // Thumb color when not checked
                                                  },
                                                  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                                    backgroundColor: "#ff0000a3", // Track color when not checked
                                                  },
                                                }}
                                                checked={todo.subcomponentcheck}
                                                onChange={(e) => {
                                                  handleChangeEdit(
                                                    index,
                                                    "subcomponentcheck",
                                                    e.target.checked
                                                  );
                                                }}
                                              />
                                            }
                                            label="Enable Subcomponent"
                                          />
                                        </FormGroup>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                                {todo.subcomponentcheck === true && (

                                  <>
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                  disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                disabled={todo.subcomponentcheck === false}
                                                onChange={(e) => {
                                                  const inputText = e.target.value;
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                  isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
                                              // onChange={(e) => {
                                              //   handleChangeEdit(
                                              //     index,
                                              //     "code",
                                              //     e.target.value
                                              //   );
                                              // }}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                              <Typography>
                                                Warranty Time{" "}
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <FormControl fullWidth size="small">
                                                <OutlinedInput
                                                  id="component-outlined"
                                                  type="text"
                                                  disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                  disabled={todo.subcomponentcheck === false}
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
                                                Purchase date{" "}
                                              </Typography>
                                              <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                size="small"
                                                value={todo.purchasedate}
                                                disabled={todo.subcomponentcheck === false}
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

                                    <>
                                      <Grid item md={3} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                          <Grid item md={10} sm={10} xs={10}>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Vendor Group Name
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <Selects
                                                options={vendorGroupOpt}
                                                styles={colourStyles}
                                                isDisabled={todo.subcomponentcheck === false}
                                                value={{
                                                  label: todo.vendorgroup,
                                                  value: todo.vendorgroup,
                                                }}
                                                onChange={(e) => {
                                                  handleChangeGroupNameIndexBased(
                                                    e,
                                                    index
                                                  );
                                                  handleChangeEdit(
                                                    index,
                                                    "vendorgroup",
                                                    e.value
                                                  );

                                                  setTodosEdit((prev) => {
                                                    const updated = [...prev];
                                                    updated[index].vendor =
                                                      "Please Select Vendor";
                                                    return updated;
                                                  });
                                                }}
                                              />
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item md={3} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                          <Grid item md={10} sm={10} xs={10}>
                                            <FormControl fullWidth size="small">
                                              <Typography>
                                                Vendor
                                                <b style={{ color: "red" }}>*</b>
                                              </Typography>
                                              <Selects
                                                options={vendorOptInd[index]}
                                                styles={colourStyles}
                                                isDisabled={todo.subcomponentcheck === false}
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
                                                disabled={todo.subcomponentcheck === false}
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
                                                value={todo?.phonenumber}
                                                readOnly
                                              />
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </>

                                  </>)}
                                {/* <Grid item md={1} sm={3} xs={3}>
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
                                </Grid> */}
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
                <Grid container spacing={1}>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Photos</Typography>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                      <Button
                        variant="contained"
                        onClick={handleClickUploadPopupOpenedit}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    {isWebcamCapture == true && capturedImagesedit?.length > 0 &&
                      capturedImagesedit?.map((file, index) => (
                        <Grid
                          container
                          key={index}
                          alignItems="center"
                          spacing={2}
                          sx={{
                            padding: "8px 0",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {/* File Icon */}
                          <Grid item md={1} sm={2} xs={2}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={40}
                                  style={{
                                    maxWidth: "100%",
                                  }}
                                />
                              ) : (
                                <img
                                  className={classes.preview}
                                  src={getFileIcon(file.name)}
                                  height={40}
                                  alt="file icon"
                                />
                              )}
                            </Box>
                          </Grid>

                          {/* File Name */}
                          <Grid item md={3} sm={3} xs={3}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {file.name}
                            </Typography>
                          </Grid>

                          {/* Remarks Input */}
                          <Grid item md={4} sm={4} xs={4}>
                            <TextField
                              variant="outlined"
                              size="small"
                              placeholder="Enter remarks"
                              value={file?.remarks || ""}
                              onChange={(e) => handleRemarkChangeWebCam(e.target.value, index)}
                              fullWidth
                            />
                          </Grid>

                          {/* View and Delete Icons */}
                          <Grid
                            item
                            md={4}
                            sm={3}
                            xs={3}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Button
                              sx={{
                                padding: "6px",
                                minWidth: "36px",
                                borderRadius: "50%",
                                ":hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                              onClick={() => renderFilePreview(file)}
                            >
                              <VisibilityOutlinedIcon
                                style={{ fontSize: "18px", color: "#357AE8" }}
                              />
                            </Button>
                            <Button
                              sx={{
                                padding: "6px",
                                minWidth: "36px",
                                borderRadius: "50%",
                                ":hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                              onClick={() => removeCapturedImage(index)}
                            >
                              <FaTrash
                                style={{ fontSize: "18px", color: "#a73131" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    {refImageedit?.length > 0 && refImageedit?.map((file, index) => (
                      <Grid
                        container
                        key={index}
                        alignItems="center"
                        spacing={2}
                        sx={{
                          padding: "8px 0",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {/* File Icon */}
                        <Grid item md={1} sm={2} xs={2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {file.type.includes("image/") ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                height={40}
                                style={{
                                  maxWidth: "100%",
                                }}
                              />
                            ) : (
                              <img
                                className={classes.preview}
                                src={getFileIcon(file.name)}
                                height={40}
                                alt="file icon"
                              />
                            )}
                          </Box>
                        </Grid>

                        {/* File Name */}
                        <Grid item md={3} sm={3} xs={3}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Grid>

                        {/* Remarks Input */}
                        <Grid item md={4} sm={4} xs={4}>
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Enter remarks"
                            value={file?.remarks || ""}
                            onChange={(e) => handleRemarkChangeUpload(e.target.value, index)}
                            fullWidth
                          />
                        </Grid>

                        {/* View and Delete Icons */}
                        <Grid
                          item
                          md={4}
                          sm={3}
                          xs={3}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            sx={{
                              padding: "6px",
                              minWidth: "36px",
                              borderRadius: "50%",
                              ":hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                            onClick={() => renderFilePreview(file)}
                          >
                            <VisibilityOutlinedIcon
                              style={{ fontSize: "18px", color: "#357AE8" }}
                            />
                          </Button>
                          <Button
                            sx={{
                              padding: "6px",
                              minWidth: "36px",
                              borderRadius: "50%",
                              ":hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                            onClick={() => handleDeleteFile(index)}
                          >
                            <FaTrash
                              style={{ fontSize: "18px", color: "#a73131" }}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    ))}



                    {refImageDragedit?.length > 0 && refImageDragedit?.map((file, index) => (
                      <Grid
                        container
                        key={index}
                        alignItems="center"
                        spacing={2}
                        sx={{
                          padding: "8px 0",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {/* File Icon */}
                        <Grid item md={1} sm={2} xs={2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {file.type.includes("image/") ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                height={40}
                                style={{
                                  maxWidth: "100%",
                                }}
                              />
                            ) : (
                              <img
                                className={classes.preview}
                                src={getFileIcon(file.name)}
                                height={40}
                                alt="file icon"
                              />
                            )}
                          </Box>
                        </Grid>

                        {/* File Name */}
                        <Grid item md={3} sm={3} xs={3}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Grid>

                        {/* Remarks Input */}
                        <Grid item md={4} sm={4} xs={4}>
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Enter remarks"
                            value={file?.remarks || ""}
                            onChange={(e) => handleRemarkChangeDragDrop(e.target.value, index)}
                            fullWidth
                          />
                        </Grid>

                        {/* View and Delete Icons */}
                        <Grid
                          item
                          md={4}
                          sm={3}
                          xs={3}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            sx={{
                              padding: "6px",
                              minWidth: "36px",
                              borderRadius: "50%",
                              ":hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                            onClick={() => renderFilePreview(file)}
                          >
                            <VisibilityOutlinedIcon
                              style={{ fontSize: "18px", color: "#357AE8" }}
                            />
                          </Button>
                          <Button
                            sx={{
                              padding: "6px",
                              minWidth: "36px",
                              borderRadius: "50%",
                              ":hover": {
                                backgroundColor: "#f0f0f0",
                              },
                            }}
                            onClick={() => handleRemoveFile(index)}
                          >
                            <FaTrash
                              style={{ fontSize: "18px", color: "#a73131" }}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item md={1} xs={6} sm={6} marginTop={3}>
                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={1} xs={6} sm={6} marginTop={3}>
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
      {isUserRoleCompare?.includes("lassetmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                AssetDetails List
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
                        handleBranchChange(e);
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
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Asset material
                    </Typography>
                    <MultiSelect
                      options={materialOpt}
                      value={selectedOptionsAssetMaterial}
                      onChange={(e) => {
                        handleAssetMaterialChange(e);
                      }}
                      valueRenderer={customValueRendererAssetMaterial}
                      labelledBy="Please Select Asset Material"
                    />
                  </FormControl>
                </Grid>
              </>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <Grid sx={{ display: "flex", gap: "15px" }}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
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
                    <MenuItem value={totalProjects}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("csvassetmaster") && (
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
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                        }}
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
                sx={buttonStyles.buttonbulkdelete}
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
              anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
              <ManageColumnsContent
                handleClose={handleCloseManageColumns}
                searchQuery={searchQueryManage}
                setSearchQuery={setSearchQueryManage}
                filteredColumns={filteredColumns}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
                setColumnVisibility={setColumnVisibility}
                initialColumnVisibility={initialColumnVisibility}
                columnDataTable={columnDataTable}
              />
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
                            if (items?.length) {
                              fetchAssetDetails("Filtered");
                              setIsSearchActive(true);
                              setAdvancedFilter([
                                ...additionalFilters,
                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                              ])
                            }

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
            <br />
            <br />
            {assetdetailCheck ? (
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

                {/* <AggridTable
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
                  pagenamecheck={"Asset Master List"}
                  // totalDatas={totalDatas}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={assetdetails}
                /> */}
                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  pagenamecheck={"Asset List"}
                  selectedRowsAssetList={selectedRowsAssetList}
                  setSelectedRowsAssetList={setSelectedRowsAssetList}
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
            )}
          </Box>
        </>
      )}

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ marginTop: "95px" }}
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
                  <Typography>{assetdetailEdit.workstation === "Please Select Workstation" ? "" : assetdetailEdit.workstation}</Typography>
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
                  <Typography variant="h6">Material Countcode</Typography>
                  <Typography>{assetdetailEdit.materialcountcode}</Typography>
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
                  <Typography>{(assetdetailEdit.purchasedate === "Invalid date" || assetdetailEdit.purchasedate === "" || assetdetailEdit.purchasedate === undefined) ? "" : moment(assetdetailEdit.purchasedate).format("DD/MM/YYYY")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor Group</Typography>
                  <Typography>{assetdetailEdit.vendorgroup}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor</Typography>
                  <Typography>{assetdetailEdit.vendor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Asset Distributed</Typography>
                  <Typography>{assetdetailEdit?.distributed ? "Yes" : "No"}</Typography>
                </FormControl>
              </Grid>
              {assetdetailEdit?.distributed &&
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Distributed To</Typography>
                      <Typography>{assetdetailEdit?.distributedto}</Typography>
                    </FormControl>
                  </Grid>
                </>
              }


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
              {isWebcamCapture == true &&
                capturedImagesedit.map((image, index) => (
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
          <Grid container >
            <Grid item md={3} sm={10} xs={10}>  <Typography variant="h6">File</Typography>    </Grid>
            <Grid
              item
              md={4}
              sm={10}
              xs={10}
              sx={{ display: "flex", alignItems: "center" }}
            > <Typography variant="h6">File Name</Typography>    </Grid>
            <Grid
              item
              md={4}
              sm={10}
              xs={10}
              sx={{ display: "flex", alignItems: "center" }}
            > <Typography variant="h6">Remarks</Typography>    </Grid>
          </Grid>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={3} sm={10} xs={10}>


                {imagefilebill.type.includes("image/") ? (
                  <img
                    src={imagefilebill.preview}
                    alt={imagefilebill.name}
                    height={40}
                    style={{
                      maxWidth: "70px",
                      maxHeight: "70px",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  <img
                    className={classes.preview}
                    src={getFileIcon(imagefilebill.name)}
                    height={40}
                    alt="file icon"
                  />
                )}
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
              <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.remarks}</Typography>
              </Grid>
              <Grid item md={1} sm={1} xs={1}>
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



      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [

                { check: checkassetip?.length > 0, label: "Asset Material IP" },
                { check: checkassetwrkgrp?.length > 0, label: "Asset WorkStation Grouping" },
                { check: checkmaindetails?.length > 0, label: "Maintenance Details Master" },
                { check: checkmaintmaster?.length > 0, label: "Maintenance Master" },
                { check: checknonschedule?.length > 0, label: "Maintenance Non Schedule Grouping" },
                { check: checkassetempdis?.length > 0, label: "Asset Employee Distribution" },
              ];

              // Filter out the true conditions
              const linkedItems = conditions.filter((item) => item.check);

              // Build the message dynamically
              if (linkedItems.length > 0) {
                const linkedLabels = linkedItems.map((item) => item.label).join(", ");
                return (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteAssetdetail.company + " ," +
                      deleteAssetdetail.branch + " ," +
                      deleteAssetdetail.unit + " ," +
                      deleteAssetdetail.floor + " ," +
                      deleteAssetdetail.area + " ," +
                      deleteAssetdetail.location + " ," +
                      // deleteAssetdetail.workstation + " ," +
                      deleteAssetdetail.material + " ," +
                      deleteAssetdetail.code + " ,"


                      } `}</span>
                    was linked in <span style={{ fontWeight: "700" }}>{linkedLabels}</span>
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


      <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="md" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(

              overalldeletecheck.assetmaterialip?.length > 0 ||
              overalldeletecheck.assetworkstationgrouping?.length > 0 ||
              overalldeletecheck.maintenancemaster?.length > 0 ||
              overalldeletecheck.assetempdistribution?.length > 0 ||
              overalldeletecheck.maintenancenonschedulegrouping?.length > 0

            )
              && (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    { }
                  </span>{' '}
                  <TableContainer component={Paper} >
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="jobopening"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Company</StyledTableCell>
                          <StyledTableCell>Branch</StyledTableCell>
                          <StyledTableCell>Unit</StyledTableCell>
                          <StyledTableCell>Floor</StyledTableCell>
                          <StyledTableCell>Area</StyledTableCell>
                          <StyledTableCell>Location</StyledTableCell>
                          <StyledTableCell>Material</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {
                          getLinkedLabelItem(overalldeletecheck)?.length > 0 ? (

                            getLinkedLabelItem(overalldeletecheck)?.map((row, index) => (
                              <StyledTableRow key={index}>
                                <StyledTableCell sx={{ padding: "10px" }}>{index + 1}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row.company}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row?.branch}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row.unit}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row.floor}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row?.area}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row.location}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "10px" }}>{row.assetmaterial}</StyledTableCell>
                              </StyledTableRow>
                            ))
                          ) : (
                            <StyledTableRow>
                              {" "}
                              <StyledTableCell colSpan={7} align="center">
                                No Data Available
                              </StyledTableCell>{" "}
                            </StyledTableRow>
                          )

                        }
                        <StyledTableRow></StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  was linked in{' '}
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabel(overalldeletecheck)}
                  </span>
                  {shouldShowDeleteMessage(assetdetails, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(assetdetails, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(assetdetails, selectedRows, overalldeletecheck) && (
            <>
              <Button onClick={delaccountheadwithoutlink} variant="contained"> Yes </Button>
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>


      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "95px" }}
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
        itemsTwo={overallFilterdata ?? []}
        filename={"AssetDetail"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Detail Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delAssetdetail}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAssetcheckbox}
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

export default AssetDetailsList;