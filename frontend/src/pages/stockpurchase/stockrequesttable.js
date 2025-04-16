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
import { MultiSelect } from "react-multi-select-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button, Radio, InputAdornment, RadioGroup, Tooltip, FormControlLabel,
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
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../components/Errorhandling";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
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

function ListReferenceCategoryDoc({ vendorAuto }) {
  const [stockmanages, setStockmanage] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);



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


  const { allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;

  let exportColumnNames = [
    "Company",
    "Subcategoryname",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Date",
    "Time",
    "Expected Days",
    "Due Date",
    "Request Mode For",
    "Stock Category",
    "Stock Sub Category",
    "Quantity",
    "Quantity & UOM",
    "Material",
    "Product Details",
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
    "stockcategory",
    "stocksubcategory",
    "quantitynew",
    "uomnew",
    "materialnew",
    "productdetailsnew",
  ];

  const [getoldqty, setOldQty] = useState(0)


  const fetchOldQuantity = async (material) => {
    try {
      let res_vendor = await axios.post(SERVICE.GET_OLD_MATERIAL_QTY_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        material: material,
        id: stockmanagemasteredit._id
      });

      setOldQty(res_vendor.data.oldtotalqty);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
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


  const gridRef = useRef(null);
  const { isUserRoleCompare, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
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


  //Datatable
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);

  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    company: true,
    requesttime: true,
    requestdate: true,
    duedate: true,
    expectdays: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    workstation: true,
    requestmode: true,
    stockcategory: true,
    stocksubcategory: true,
    uomnew: true,
    quantitynew: true,
    materialnew: true,
    productdetailsnew: true,
  };
  const [items, setItems] = useState([]);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const [openview, setOpenview] = useState(false);
  const [Specificationedit, setSpecificationedit] = useState([]);
  const [selectedUnitedit, setSelectedUnitedit] =
    useState("Please Select Unit");
  const [selectedBranchedit, setSelectedBranchedit] = useState(
    "Please Select Branch"
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [uomOpt, setUomOpt] = useState([]);
  const [categoryOption, setCategoryOption] = useState([]);
  const [subcategoryOpt, setSubcategoryOption] = useState([]);
  const [materialOptNew, setMaterialoptNew] = useState([]);
  const [companys, setCompanys] = useState([]);

  const [stockArray, setStockArray] = useState([]);

  const totalQuantityStock = stockArray.reduce((sum, item) => {

    return sum + Number(item.quantitynew || 0);
  }, 0);

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
        code: data.code,
      }));
      setuomcodes(codeValues);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleStockArray = () => {

    const totalArray = stockArray.reduce((acc, sum) => acc + Number(sum.quantitynew), 0)
    console.log(Number(stockmanagemasteredit.maximumquantity) < Number(stockmanagemasteredit.quantitynew), Number(stockmanagemasteredit.maximumquantity), Number(stockmanagemasteredit.quantitynew))

    const isNameMatch = stockArray.some(
      (item) =>
        item.materialnew == stockmanagemasteredit.materialnew &&
        item.uomnew === String(stockmanagemasteredit.uomnew) &&
        item.quantitynew == stockmanagemasteredit.quantitynew
    );
    if (
      stockmanagemasteredit.materialnew === "Please Select Material" ||
      stockmanagemasteredit.materialnew === ""
    ) {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemasteredit.uomnew === "" ||
      stockmanagemasteredit.uomnew === undefined
    ) {
      setPopupContentMalert("Please Enter UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemasteredit.quantitynew === "" ||
      stockmanagemasteredit.quantitynew === undefined
    ) {
      setPopupContentMalert("Please Enter Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (Number(stockmanagemasteredit.maximumquantity) < Number(stockmanagemasteredit.quantitynew)) {
      setPopupContentMalert(`Please Enter Less than or Equal to ${stockmanagemasteredit.maximumquantity}!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (Number(getoldqty) + Number(stockmanagemasteredit.quantitynew) + totalArray > Number(stockmanagemasteredit.maximumquantity)) {
      setPopupContentMalert(`Maximum Quantity Reached!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    // else if (totalQuantityStock > stockmanagemasteredit.maximumquantity) {
    //   setPopupContentMalert(`Please Enter Less than or Equal to ${stockmanagemasteredit.maximumquantity}!`);
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }


    else if (isNameMatch) {
      setPopupContentMalert("Todo Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (stockmanagemasteredit.productdetailsnew === "" || stockmanagemasteredit.productdetailsnew === undefined) {
    //     setShowAlert(
    //         <>
    //             {" "}
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Enter Product Details</p>{" "}
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else {
      try {
        let findData = uomcodes.find(
          (item) => item.name === stockmanagemasteredit.uomnew
        );

        setStockArray([
          ...stockArray,
          {
            uomnew: stockmanagemasteredit.uomnew,
            quantitynew: stockmanagemasteredit.quantitynew,
            materialnew: stockmanagemasteredit.materialnew,
            productdetailsnew:
              stockmanagemasteredit.productdetailsnew === undefined
                ? ""
                : stockmanagemasteredit.productdetailsnew,
            uomcodenew: findData.code,
          },
        ]);

        setStockmanagemasteredit({
          ...stockmanagemasteredit,
          uomnew: "",
          quantitynew: "",
          materialnew: "Please Select Material",
          productdetailsnew: "",

        });
      } catch (e) {
        setPopupContentMalert("UOM is not found! Hence cannot get a UOM Code!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const deleteTodo = (index) => {
    setStockArray(
      stockArray.filter((data, indexcurrent) => {
        return indexcurrent !== index;
      })
    );
  };

  const [workStationOpt, setWorkStationOpt] = useState([]);
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
          data.stockcategory === stockmanagemasteredit.stockcategory &&
          data.stocksubcategory === stockmanagemasteredit.stocksubcategory
        );
      });
      setStockmanagemasteredit((prev) => ({
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
      // setStocksubcategoryOptEdit(subcatOpt)
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchMaterialNew = async (e, stockcategory) => {
    try {
      let res = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = res.data.managestockitems.filter((data) => {
        return (
          data.stockcategory === stockcategory &&
          data.stocksubcategory === e.value
        );
      });

      const assetmaterialuniqueArray = resultall.map((item) => ({
        label: item.itemname,
        value: item.itemname,
        maximumquantity: item.maximumquantity
      }));

      setMaterialoptNew(assetmaterialuniqueArray);
      // setMaterialoptEditNew(assetmaterialuniqueArray);
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

  //get single row to edit....
  const getCode = async (e) => {

    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setStockmanagemasteredit({
        ...res?.data?.sstockmanage,
        materialnew: "Please Select Material",
      });

      setSelectedBranchedit(res?.data?.sstockmanage.branch);
      setSelectedUnitedit(res?.data?.sstockmanage.unit);
      setStockArray(res?.data?.sstockmanage.stockmaterialarray);
      await fetchSubcategoryBased({
        label: res?.data?.sstockmanage.stockcategory,
        value: res?.data?.sstockmanage.stockcategory,
      });
      await fetchWorkStation();
      await fetchMaterialNew(
        {
          label: res?.data?.sstockmanage.stocksubcategory,
          value: res?.data?.sstockmanage.stocksubcategory,
        },
        res?.data?.sstockmanage.stockcategory
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
      // await fetchspecificationSubEdit(res?.data?.sstockmanage?.component)

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
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  // let projectid = deleteproject._id;
  const delProject = async () => {

    setPageName(!pageName)
    try {
      await axios.delete(
        `${SERVICE.STOCKMANAGE_SINGLE}/${stockmanagemasteredit._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchStock("Filtered")
      // handleCloseMod();
      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSelectedRows([]);
      setPage(1);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.STOCKMANAGE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setStockmanagemasteredit(res?.data?.sstockmanage);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [quantityNeww, setQuantityNeww] = useState();
  const [materialNeww, setMaterialNeww] = useState();
  const [productdetailsNeww, setProductdetailsNeww] = useState();
  const [quantityAndUom, setQuantityAndUom] = useState();

  // get single row to view....
  const getinfoCode = async (e) => {

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

      let quantityNew = res?.data?.sstockmanage.stockmaterialarray.map(
        (data, newindex) => {
          return ` ${data.quantitynew}`;
        }
      );
      setQuantityNeww(quantityNew.toString());

      let materialNew = res?.data?.sstockmanage.stockmaterialarray.map(
        (data, newindex) => {
          return ` ${data.materialnew}`;
        }
      );
      setMaterialNeww(materialNew.toString());

      let productdetailsNew = res?.data?.sstockmanage.stockmaterialarray.map(
        (data, newindex) => {
          return ` ${data.productdetailsnew}`;
        }
      );
      setProductdetailsNeww(productdetailsNew.toString());

      let quantityAndUom = res?.data?.sstockmanage.stockmaterialarray.map(
        (data, newindex) => {
          return ` ${data.quantitynew}#${data.uomcodenew}`;
        }
      );
      setQuantityAndUom(quantityAndUom.toString());

      let codeValues = res_project_1?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data.code,
      }));
      let setDataOne = codeValues.find(
        (item1) => res?.data?.sstockmanage.uomnew === item1.name
      );
      let setData = {
        ...res?.data?.sstockmanage,
        uomcode: setDataOne ? setDataOne.code : "",
      };
      setStockmanagemasteredit(setData);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {

    setPageName(!pageName)
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
  //     fetchAllLocationEdit();
  // }, [isEditOpen, stockmanagemasteredit.floor]);
  //useEffect

  useEffect(() => {
    addSerialNumber();
    fetchCompanyDropdowns();
    fetchCategoryAll();
    // fetchVomMaster();
    fetchWorkStation();
    fetchUom();
  }, [vendorAuto]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

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
      // setCategoryOptionEdit([
      //     ...res_location?.data?.stockcategory?.map((t) => ({
      //         ...t,
      //         label: t.categoryname,
      //         value: t.categoryname,
      //     })),
      // ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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

  const [branchsEdit, setBranchsEdit] = useState([]);
  const [unitsEdit, setUnitsEdit] = useState([]);
  const [companysEdit, setCompanysEdit] = useState([]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setStockmanagemasteredit({
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
      expectdays: "",
      duedate: "",
      uom: "Please Select UOM",
      quantity: "",
      stockcategory: "Please Select Stock Category",
      stocksubcategory: "Please Select Stock Sub Category",
      uomnew: "",
      quantitynew: "",
      materialnew: "Please Select Material",
      productdetailsnew: "",
    });
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

  const editSubmit = async (e) => {
    e.preventDefault()
    // fetchStockedit();

    let res_project = await axios.get(SERVICE.STOCKMANAGE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    let getnamematch = res_project?.data?.stockmanage.filter(
      (item) => item._id !== stockmanagemasteredit._id && item.requestmode !== "Stock Material"
    )


    const isNameMatch = getnamematch.some(
      (item) =>
        item.company == stockmanagemasteredit.company &&
        item.branch == stockmanagemasteredit.branch &&
        item.unit == stockmanagemasteredit.unit &&
        item.floor == stockmanagemasteredit.floor &&
        item.area == stockmanagemasteredit.area &&
        item.location == stockmanagemasteredit.location &&
        item.requestmode == stockmanagemasteredit.requestmode &&
        // item.materialnew == stockmanagemasteredit.materialnew &&
        item.stockcategory == stockmanagemasteredit.stockcategory &&
        item.stocksubcategory == stockmanagemasteredit.stocksubcategory &&

        // item.stockmaterialarray.some(obj1 =>
        //   stockArray.some(obj2 => obj1.uomnew == obj2.uomnew && obj1.quantitynew == obj2.quantitynew

        //     && obj1.materialnew == obj2.materialnew && obj1.productdetailsnew == obj2.productdetailsnew
        //   )
        // ),
        item.stockmaterialarray.some(obj1 =>
          stockArray.some(obj2 => obj1.uomnew == obj2.uomnew && obj1.quantitynew == obj2.quantitynew

            && obj1.materialnew == obj2.materialnew &&
            // obj1.productdetailsnew == obj2.productdetailsnew
            obj1.productdetailsnew.replace(/\n/g, '') === obj2.productdetailsnew.replace(/\n/g, '')
          )
        ),
    );

    // let res = await axios.post(`${SERVICE.DUPE_CHECK_STOCK_MANAGE}`, {
    //   headers: {
    //     Authorization: `Bearer ${auth.APIToken}`,
    //   },
    //   company :stockmanagemasteredit.company ,
    //   branch: stockmanagemasteredit.branch ,
    //   unit : stockmanagemasteredit.unit ,
    //   floor : stockmanagemasteredit.floor ,
    //   area :stockmanagemasteredit.area ,
    //   location : stockmanagemasteredit.location ,
    //   requestmode: stockmanagemasteredit.requestmode ,
    //   stockcategory : stockmanagemasteredit.stockcategory ,
    //   stocksubcategory : stockmanagemasteredit.stocksubcategory ,
    //   stockArray

    // });


    if (stockmanagemasteredit.company === "Please Select Company") {
      setPopupContentMalert("TPlease Select Company!");
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
      stockmanagemasteredit.requestmode === "" ||
      stockmanagemasteredit.requestmode === "Please Select Request Mode"
    ) {
      setPopupContentMalert("Please Select Request Mode For!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      stockmanagemasteredit.stockcategory === "" ||
      stockmanagemasteredit.stockcategory === "Please Select Stock Category"
    ) {
      setPopupContentMalert("Please Select Stock Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      stockmanagemasteredit.stocksubcategory === "" ||
      stockmanagemasteredit.stocksubcategory === "Please Select Stock Sub Category"
    ) {
      setPopupContentMalert("Please Select Stock Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   stockmanagemasteredit.materialnew === "" ||
    //   stockmanagemasteredit.materialnew === "Please Select Material"
    // ) {
    //   setPopupContentMalert("Please Select Material");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    // else if (stockmanagemasteredit.quantitynew == "") {
    //   setPopupContentMalert("Please Enter Quantity");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    // else if (stockmanagemasteredit.quantitynew > stockmanagemasteredit.maximumquantity) {
    //   setPopupContentMalert(`Please Enter Less than or Equal to ${stockmanagemasteredit.maximumquantity}!`);
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (stockArray?.length === 0) {
      setPopupContentMalert("Please Insert Stock Todo List!");
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


  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.STOCKMANAGE_SINGLE}/${stockmanagemasteredit?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(stockmanagemasteredit.company),
          branch: String(stockmanagemasteredit.branch),
          unit: String(stockmanagemasteredit.unit),
          floor: String(stockmanagemasteredit.floor),
          location: String(stockmanagemasteredit.location),
          requestdate: String(stockmanagemasteredit.requestdate),
          requesttime: String(stockmanagemasteredit.requesttime),
          area: String(stockmanagemasteredit.area),
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
          subcomponent: "",
          material: String(
            stockmanagemasteredit.material === "Please Select Material"
              ? ""
              : stockmanagemasteredit.material
          ),
          component: String(
            stockmanagemasteredit.component === "Please Select Component"
              ? ""
              : stockmanagemasteredit.component
          ),
          productdetails: String(stockmanagemasteredit.productdetails),
          uom:
            stockmanagemasteredit.uom === "Please Select UOM"
              ? ""
              : String(stockmanagemasteredit.uom),
          quantity: Number(stockmanagemasteredit.quantity),
          updating: String(""),

          requestmode: String(stockmanagemasteredit.requestmode),
          stockcategory:
            stockmanagemasteredit.stockcategory ===
              "Please Select Stock Category"
              ? ""
              : String(stockmanagemasteredit.stockcategory),
          stocksubcategory:
            stockmanagemasteredit.stocksubcategory ===
              "Please Select Stock Sub Category"
              ? ""
              : String(stockmanagemasteredit.stocksubcategory),
          stockmaterialarray: stockArray,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchStock("Filtered")
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // let maintenanceid = ;
  const [stockmanageedit, setStockmanageedit] = useState([]);
  // const fetchStockedit = async (e) => {
  //   try {
  //     let res_project = await axios.get(SERVICE.STOCKMANAGE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setStockmanageedit(
  //       res_project?.data?.stockmanage.filter(
  //         (item) => item._id !== e && item.requestmode !== "Asset Material"
  //       )
  //     );
  //   } catch (err) {
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };

  // useEffect(() => {

  //     fetchStockedit();
  // }, [isEditOpen, stockmanagemasteredit]);
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
    material: "Choose Material",
    component: "Choose Component",
    productdetails: "",
    uom: "Please Select UOM",
    quantity: "",
    stockcategory: "Please Select Stock Category",
    stocksubcategory: "Please Select Stock Sub Category",
    uomnew: "",
    quantitynew: "",
    materialnew: "Choose Material",
    productdetailsnew: "",
  });
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Stock Request.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const handleViewOpen = () => {
    setOpenView(true);
  };
  const handlViewClose = () => {
    setOpenView(false);
  };

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //delete model
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get all project.
  // const fetchStock = async () => {

  //   setPageName(!pageName)


  //   try {
  //     // let res_project = await axios.get(SERVICE.STOCKMANAGE, {
  //     let res_project = await axios.post(SERVICE.STOCK_MANAGE_ACCESS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       assignbranch: accessbranch,
  //     });
  //     setLoading(true);

  //     let filteredDataStock = res_project?.data?.stockmanage.filter((data) => {
  //       return data.requestmode === "Stock Material";
  //     });
  //     let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });

  //     let codeValues = res_project_1?.data?.vommaster.map((data) => ({
  //       name: data.name,
  //       code: data.code,
  //     }));

  //     let setData = filteredDataStock.map((item) => {
  //       const matchingItem = codeValues.find(
  //         (item1) => item.uomnew === item1.name
  //       );

  //       return matchingItem
  //         ? { ...item, uomcode: matchingItem.code }
  //         : { ...item, uomcode: "" };
  //     });
  //     console.log(setData, "setdata")
  //     setStockmanage(setData);
  //   } catch (err) {
  //     console.log(err, "dkdkdkdkdkd")
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }


  // }


  const fetchStock = async (e) => {
    setPageName(!pageName)
    setLoading(true);
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
        let res_employee = await axios.post(SERVICE.MANAGE_STOCK_ACCESS_PAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []


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
        // const itemsWithSerialNumber = setData?.map((item, index) => ({
        //   ...item,
        //   serialNumber: (page - 1) * pageSize + index + 1,
        // }));


        const itemsWithSerialNumber = setData?.map((item, index) => {
          let quantityNew = item.stockmaterialarray.map((data, newindex) => {
            return ` ${data.quantitynew}`;
          });

          let materialNew = item.stockmaterialarray.map((data, newindex) => {
            return ` ${data.materialnew}`;
          });

          let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
            return ` ${data.productdetailsnew}`;
          });

          let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
            return ` ${data.quantitynew}#${data.uomcodenew}`;
          });
          return {
            ...item,
            id: item._id,
            serialNumber: (page - 1) * pageSize + index + 1,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
            requesttime: item.requesttime,
            duedate: moment(item.duedate).format("DD/MM/YYYY"),
            expecttime: item.expecttime,
            area: item.area,
            location: item.location,
            requestmode: item.requestmode,
            stockcategory: item.stockcategory,
            stocksubcategory: item.stocksubcategory,

            uomnew:
              //  quantityAndUom.join(","),
              quantityAndUom.filter(item => item.trim() !== "").join(","),
            quantitynew: quantityNew.filter(item => item.trim() !== "").join(","),
            //  quantityNew.join(","),
            materialnew: materialNew.filter(item => item.trim() !== "").join(","),
            // materialNew.join(",").toString(),
            productdetailsnew:
              // productdetailsNew.join(",")
              productdetailsNew.filter(item => item.trim() !== "").join(",")

          };
        });
        setStockmanage(itemsWithSerialNumber);


        let ansoverall = res_employee?.data?.totalProjectsData.filter((data) => {
          return data.requestmode === "Stock Material";
        });



        setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
          res_employee?.data?.totalProjectsData?.map((item, index) => {
            let quantityNew = item.stockmaterialarray.map((data, newindex) => {
              return ` ${data.quantitynew}`;
            });

            let materialNew = item.stockmaterialarray.map((data, newindex) => {
              return ` ${data.materialnew}`;
            });

            let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
              return ` ${data.productdetailsnew}`;
            });

            let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
              return ` ${data.quantitynew}#${data.uomcodenew}`;
            });
            return {
              ...item,
              serialNumber: (page - 1) * pageSize + index + 1,
              id: item._id,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              requestdate: moment(item.requestdate).format("DD/MM/YYYY"),
              requesttime: item.requesttime,
              expecttdate: moment(item.expecttdate).format("DD/MM/YYYY"),
              expecttime: item.expecttime,
              floor: item.floor,
              area: item.area,
              location: item.location,
              requestmode: item.requestmode,
              stockcategory: item.stockcategory,
              stocksubcategory: item.stocksubcategory,

              uomnew:
                //  quantityAndUom.join(","),
                quantityAndUom.filter(item => item.trim() !== "").join(","),
              quantitynew: quantityNew.filter(item => item.trim() !== "").join(","),
              //  quantityNew.join(","),
              materialnew: materialNew.filter(item => item.trim() !== "").join(","),
              // materialNew.join(",").toString(),
              productdetailsnew:
                // productdetailsNew.join(",")
                productdetailsNew.filter(item => item.trim() !== "").join(",")

            }
          }

          ) : []
        );



        setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });

        setLoading(false);

      } else {
        setLoading(false)
      }
    }

    catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }

  }


  useEffect(() => {
    if (items?.length > 0) {
      fetchStock("Filtered");
    }
  }, [page, pageSize, searchQuery, vendorAuto]);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  //Project updateby edit page...
  let updateby = stockmanagemasteredit.updatedby;
  let addedby = stockmanagemasteredit.addedby;
  let snos = 1;
  // this is the etimation concadination value
  // const modifiedData = stockmanages?.map((person) => ({
  //     ...person,
  //     sino: snos++,
  // }));
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const delVendorcheckbox = async () => {
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

      handleCloseModcheckbox();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchStock("Filtered")
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Stock Request",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    try {
      // const itemsWithSerialNumber = datas?.map((item, index) => {
      //   let quantityNew = item.stockmaterialarray.map((data, newindex) => {
      //     return ` ${data.quantitynew}`;
      //   });

      //   let materialNew = item.stockmaterialarray.map((data, newindex) => {
      //     return ` ${data.materialnew}`;
      //   });

      //   let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
      //     return ` ${data.productdetailsnew}`;
      //   });

      //   let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
      //     return ` ${data.quantitynew}#${data.uomcodenew}`;
      //   });
      //   return {
      //     id: item._id,
      //     serialNumber: index + 1,
      //     company: item.company,
      //     branch: item.branch,
      //     unit: item.unit,
      //     floor: item.floor,
      //     area: item.area,
      //     location: item.location,
      //     requestmode: item.requestmode,
      //     stockcategory: item.stockcategory,
      //     stocksubcategory: item.stocksubcategory,

      //     uomnew:
      //       //  quantityAndUom.join(","),
      //       quantityAndUom.filter(item => item.trim() !== "").join(","),
      //     quantitynew: quantityNew.filter(item => item.trim() !== "").join(","),
      //     //  quantityNew.join(","),
      //     materialnew: materialNew.filter(item => item.trim() !== "").join(","),
      //     // materialNew.join(",").toString(),
      //     productdetailsnew:
      //       // productdetailsNew.join(",")
      //       productdetailsNew.filter(item => item.trim() !== "").join(",")

      //   };
      // });
      setItems(datas);
    }
    catch (err) {
      console.log(err, "adflfjdsl;j")
    };

  }

  useEffect(() => {
    addSerialNumber(stockmanages);
  }, [stockmanages, vendorAuto]);

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
      headerName: "S.No",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.company,
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.floor,
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.area,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.location,
    },
    // {
    //     field: "workstation",
    //     headerName: "Work Station",
    //     flex: 0,
    //     width: 180,
    //     minHeight: "40px",
    //     hide: !columnVisibility.workstation,
    // },
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
    {
      field: "requestmode",
      headerName: "Request Mode",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.requestmode,
    },
    {
      field: "stockcategory",
      headerName: "Stockcategory",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.stockcategory,
    },
    {
      field: "stocksubcategory",
      headerName: "Stocksubcategory",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.stocksubcategory,
    },

    {
      field: "quantitynew",
      headerName: "Quantity",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.quantitynew,
    },
    {
      field: "uomnew",
      headerName: "Quantity & UOM",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.uomnew,
    },
    {
      field: "materialnew",
      headerName: "Material",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.materialnew,
    },
    {
      field: "productdetailsnew",
      headerName: "Product Details",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.productdetailsnew,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("estockrequest") && (
            <Button
              sx={userStyle.buttonedit}
              style={{ minWidth: "0px" }}
              onClick={() => {

                getCode(params.data.id);
                // fetchStockedit(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dstockrequest") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getinfoCode(params.data.id);
                handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vstockrequest") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={(e) => {
                getinfoCode(params.data.id);
                handleViewOpen();
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

  const rowDataTable = items?.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      requesttime: item.requesttime,
      requestdate: item.requestdate,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      duedate: item.duedate,
      expectdays: item.expectdays,
      location: item.location,
      requestmode: item.requestmode,
      stockcategory: item.stockcategory,
      stocksubcategory: item.stocksubcategory,
      uomnew: item.uomnew,
      quantitynew: item.quantitynew,
      materialnew: item.materialnew,
      productdetailsnew: item.productdetailsnew,
    };
  });
  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
          {filteredColumns?.map((column) => (
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

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
    setLoading(true);

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
      let res_employee = await axios.post(SERVICE.MANAGE_STOCK_ACCESS_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []


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
      // const itemsWithSerialNumber = setData?.map((item, index) => ({
      //   ...item,
      //   serialNumber: (page - 1) * pageSize + index + 1,
      // }));


      const itemsWithSerialNumber = setData?.map((item, index) => {
        let quantityNew = item.stockmaterialarray.map((data, newindex) => {
          return ` ${data.quantitynew}`;
        });

        let materialNew = item.stockmaterialarray.map((data, newindex) => {
          return ` ${data.materialnew}`;
        });

        let productdetailsNew = item.stockmaterialarray.map((data, newindex) => {
          return ` ${data.productdetailsnew}`;
        });

        let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
          return ` ${data.quantitynew}#${data.uomcodenew}`;
        });
        return {
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          requestmode: item.requestmode,
          stockcategory: item.stockcategory,
          stocksubcategory: item.stocksubcategory,

          uomnew:
            //  quantityAndUom.join(","),
            quantityAndUom.filter(item => item.trim() !== "").join(","),
          quantitynew: quantityNew.filter(item => item.trim() !== "").join(","),
          //  quantityNew.join(","),
          materialnew: materialNew.filter(item => item.trim() !== "").join(","),
          // materialNew.join(",").toString(),
          productdetailsnew:
            // productdetailsNew.join(",")
            productdetailsNew.filter(item => item.trim() !== "").join(",")

        };
      });
      setStockmanage(itemsWithSerialNumber);


      let ansoverall = res_employee?.data?.totalProjectsData.filter((data) => {
        return data.requestmode === "Stock Material";
      });



      setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
        res_employee?.data?.totalProjectsData?.map((item, index) => {
          return {
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,


          }
        }

        ) : []
      );



      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setLoading(false);
    }

    catch (err) { setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const handleChangephonenumberedit = (e) => {
    const regex = /^\d*\.?\d*$/;
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
    return `${day}-${month}-${year}`;
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



  return (
    <Box>
      {/* <Headtitle title={"REFERENCE DOCUMENTS LIST"} /> */}
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Reference Documents List</Typography> */}

      <>
        {isUserRoleCompare?.includes("lstockrequest") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    List Stock Request
                  </Typography>
                </Grid>
              </Grid>
              <br />
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
              <br />
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
                <Grid>
                  {isUserRoleCompare?.includes("excelstockrequest") && (
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
                  {isUserRoleCompare?.includes("csvstockrequest") && (
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
                  {isUserRoleCompare?.includes("printstockrequest") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfstockrequest") && (
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
                  {isUserRoleCompare?.includes("imagestockrequest") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                      &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Grid>
              </Grid>
              <br />
              {/* ****** Table Grid Container ****** */}
              <Grid style={userStyle.dataTablestyle}>
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
                <Box>
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
                </Box>
              </Grid>
              <Button
                sx={userStyle.buttongrp}
                onClick={() => {
                  handleShowAllColumns();
                  setColumnVisibility(initialColumnVisibility);
                }}
              >
                Show All Columns
              </Button>
              &emsp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &emsp;
              {isUserRoleCompare?.includes("bdstockrequest") && (
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
              {/* ****** Table start ****** */}
              {loading ? (
                <Box>
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
                        // totalDatas={totalDatas}
                        searchQuery={searchedString}
                        handleShowAllColumns={handleShowAllColumns}
                        setFilteredRowData={setFilteredRowData}
                        filteredRowData={filteredRowData}
                        setFilteredChanges={setFilteredChanges}
                        filteredChanges={filteredChanges}
                        gridRefTableImg={gridRefTableImg}
                        itemsList={stockmanages}
                      /> */}
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
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table
                aria-label="customized table"
                id="jobopening"
                ref={componentRef}
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
                    <StyledTableCell>Request Mode</StyledTableCell>
                    <StyledTableCell>Stock Category</StyledTableCell>
                    <StyledTableCell>Stock Subcategory</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Quantity & UOM</StyledTableCell>
                    <StyledTableCell>Material</StyledTableCell>
                    <StyledTableCell>Product Details</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rowDataTable?.length > 0 ? (
                    rowDataTable?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                        <StyledTableCell>{row.company}</StyledTableCell>
                        <StyledTableCell>{row.branch}</StyledTableCell>
                        <StyledTableCell>{row.unit}</StyledTableCell>
                        <StyledTableCell>{row.floor}</StyledTableCell>
                        <StyledTableCell>{row.area}</StyledTableCell>
                        <StyledTableCell>{row.location}</StyledTableCell>
                        {/* <StyledTableCell>{row.workstation}</StyledTableCell> */}
                        <StyledTableCell>{row.requestmode}</StyledTableCell>
                        <StyledTableCell>{row.stockcategory}</StyledTableCell>
                        <StyledTableCell>
                          {row.stocksubcategory}
                        </StyledTableCell>

                        <StyledTableCell>{row.quantitynew}</StyledTableCell>
                        <StyledTableCell>{row.uomnew}</StyledTableCell>
                        <StyledTableCell>{row.materialnew}</StyledTableCell>
                        <StyledTableCell>
                          {row.productdetailsnew}
                        </StyledTableCell>
                        {/* <StyledTableCell>{row.subcategoryname}</StyledTableCell> */}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      {" "}
                      <StyledTableCell colSpan={7} align="center">
                        No Data Available
                      </StyledTableCell>{" "}
                    </StyledTableRow>
                  )}
                  <StyledTableRow></StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>

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

          </>
        )}
      </>

      {/* this is info view details */}
      {/* <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Stock Request Info
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
      </Dialog> */}
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
                  Edit Stock Request
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
                        setBranchsEdit([]);
                        setUnitsEdit([]);
                        setAreasEdit([]);
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
                        setAreasEdit([]);
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
                      onChange={(e) => {
                        setStockmanagemasteredit({ ...stockmanagemasteredit, requestdate: e.target.value });
                      }}
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
                    <Typography>
                      Stock Category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={categoryOption}
                      styles={colourStyles}
                      value={{
                        label: stockmanagemasteredit.stockcategory,
                        value: stockmanagemasteredit.stockcategory,
                      }}
                      onChange={(e) => {
                        setMaterialoptNew([]);

                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          stockcategory: e.value,
                          stocksubcategory: "Please Select Stock Sub Category",
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
                        label: stockmanagemasteredit.stocksubcategory,
                        value: stockmanagemasteredit.stocksubcategory,
                      }}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          stocksubcategory: e.value,
                          materialnew: "Please Select Material",
                          uomnew: "",
                        });
                        fetchMaterialNew(
                          e,
                          stockmanagemasteredit.stockcategory
                        );
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
                        label: stockmanagemasteredit.materialnew,
                        value: stockmanagemasteredit.materialnew,
                      }}
                      onChange={(e) => {
                        // fetchAsset();
                        fetchOldQuantity(e.value)
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          materialnew: e.value,

                          maximumquantity: e.maximumquantity
                        });

                        fetchVomMaster(e);
                        // fetchspecification(e);
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
                      value={stockmanagemasteredit.uomnew}
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
                      value={stockmanagemasteredit.quantitynew}
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
                          quantitynew: e.target.value > 0 ? e.target.value : 0,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.5} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Product Details</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2}
                      value={stockmanagemasteredit.productdetailsnew}
                      placeholder="Please Enter Product Details"
                      onChange={(e) => {
                        setStockmanagemasteredit({
                          ...stockmanagemasteredit,
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

                {stockArray?.length > 0 && (
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
                {stockArray?.length > 0 &&
                  stockArray?.map((item, index) => {
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
      {/* Delete modal */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
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
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => delProject()}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
      {/* view model */}
      <Dialog
        open={openView}
        onClose={handlViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Stock Request
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
                  <Typography variant="h6">Stock Category</Typography>
                  <Typography>{stockmanagemasteredit.stockcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Stock Subcategory</Typography>
                  <Typography>
                    {stockmanagemasteredit.stocksubcategory}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Quantity & UOM </Typography>
                  <Typography>{quantityAndUom}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Product Details</Typography>
                  <Typography>{productdetailsNeww}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Quantity</Typography>
                  <Typography>{quantityNeww}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlViewClose}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              {" "}
              ok{" "}
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
              onClick={(e) => delVendorcheckbox(e)}
            >
              {" "}
              OK{" "}
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
        itemsTwo={stockmanages ?? []}
        filename={"StockRequest"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Stock Request Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={openDelete}
        onClose={handleCloseDelete}
        onConfirm={delProject}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delVendorcheckbox}
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
    </Box>
  );
}
export default ListReferenceCategoryDoc;
