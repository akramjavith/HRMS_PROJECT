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
import PageHeading from "../../components/PageHeading";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormGroup,
  DialogActions,
  DialogContent,
  FormControl,
  Grid, Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip,
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
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
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
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import domtoimage from 'dom-to-image';
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io"
import ManageColumnsContent from "../../components/ManageColumn";


function Managestockitems() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);


  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


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
    "Stock Category",
    "Stock Sub Category",
    "Itemname",
    "Uom",
    // "Minimum Stock",
    "Minimum Quantity",
    "Maximum Quantity",
  ];
  let exportRowValues = [
    "stockcategory",
    "stocksubcategory",
    "itemname",
    "uom",
    // "minimumstockswitch",
    "minimumquantity",
    "maximumquantity",
  ];

  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [subcategoryOpt, setSubcategoryOption] = useState([]);
  const [categoryOptionEdit, setCategoryOptionEdit] = useState([]);
  const [uomOpt, setUomOpt] = useState([]);
  const [uomOptEdit, setUomOptEdit] = useState([]);
  const [stocksubcategoryOptEdit, setStocksubcategoryOptEdit] = useState([]);
  const [userId, setUserID] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //state to handle holiday values
  const [managestockitemState, setManagestockitemState] = useState({
    stockcategory: "Please Select Stock category",
    stocksubcategory: "Please Select Stock Sub-category",
    itemname: "",
    uom: "Please Select UOM",
    minimumquantity: "",
    maximumquantity: "",
  });
  const [managestockitemEdit, setManagestockitemEdit] = useState({
    stockcategory: "Please Select Stock category",
    stocksubcategory: "Please Select Stock Sub-category",
    itemname: "",
    uom: "Please Select UOM",
    minimumquantity: "",
    maximumquantity: "",
  });

  const [categoryOption, setCategoryOption] = useState([]);
  const [powerstationArray, setPowerstationArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(true);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteHoliday, setDeleteHoliday] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allStatusEdit, setAllStatusEdit] = useState([]);

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [stockSwitch, setStockSwitch] = useState(false);
  const [stockSwitchEdit, setStockSwitchEdit] = useState(false);

  const handleStockSwitchChange = (e) => {
    setStockSwitch(e.target.checked);
  };
  // const handleStockSwitchChangeEdit = (e) => {
  //   setStockSwitchEdit(e.target.checked);
  //   setManagestockitemEdit
  // };
  const handleStockSwitchChangeEdit = (event) => {
    const isChecked = event.target.checked;
    setStockSwitchEdit(isChecked);
    setManagestockitemEdit((prevState) => ({
      ...prevState,
      minimumstockswitch: isChecked,
      minimumquantity: isChecked ? prevState.minimumquantity : "",
      maximumquantity: isChecked ? prevState.maximumquantity : "",
    }));
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    stockcategory: true,
    stocksubcategory: true,
    itemname: true,
    uom: true,
    minimumstockswitch: true,
    minimumquantity: true,
    maximumquantity: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  //useEffect

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
  const fetchVomMaster = async () => {
    try {
      let res_vom = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUomOpt(
        res_vom?.data?.vommaster?.map((t) => ({
          label: t.name,
          value: t.name,
        }))
      );
      setUomOptEdit(
        res_vom?.data?.vommaster?.map((t) => ({
          label: t.name,
          value: t.name,
        }))
      );
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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteHoliday(res.data.managestockitems);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // Alert delete popup
  let holidayid = deleteHoliday._id;
  const delHoliday = async () => {
    try {
      await axios.delete(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${holidayid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchHoliday();
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
  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let statusCreate = await axios.post(SERVICE.MANAGESTOCKITEMS_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        stockcategory: String(managestockitemState.stockcategory),
        stocksubcategory: String(managestockitemState.stocksubcategory),
        itemname: String(managestockitemState.itemname),
        uom: String(managestockitemState.uom),
        minimumstockswitch: stockSwitch,
        minimumquantity: stockSwitch ? String(managestockitemState.minimumquantity) : "",
        maximumquantity: stockSwitch ? Number(managestockitemState.maximumquantity) : "",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchHoliday();
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
    let res = await axios.get(SERVICE.MANAGESTOCKITEMS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    // const isNameMatch = powerstationArray?.some(
    const isNameMatch = res?.data?.managestockitems?.some(
      (item) =>
        // item.stockcategory?.toLowerCase() === managestockitemState.stockcategory?.toLowerCase() &&
        // item.stocksubcategory?.toLowerCase() === managestockitemState.stocksubcategory?.toLowerCase() &&
        item.itemname?.toLowerCase() ===
        managestockitemState.itemname?.toLowerCase()
      //  &&
      // item.uom?.toLowerCase() === managestockitemState.uom?.toLowerCase()
    );
    if (managestockitemState.stockcategory === "Please Select Stock category") {
      setPopupContentMalert("Please Select Stock category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      managestockitemState.stocksubcategory ===
      "Please Select Stock Sub-category"
    ) {
      setPopupContentMalert("Please Select Stock Sub-category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (managestockitemState.itemname === "") {
      setPopupContentMalert("Please Enter Item Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (managestockitemState.uom === "Please Select UOM") {
      setPopupContentMalert("Please Select UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      stockSwitch && // Only check these fields if stockSwitch is ON
      (!managestockitemState.minimumquantity || !managestockitemState.maximumquantity)
    ) {
      setPopupContentMalert("Please Enter Minimum and Maximum Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      stockSwitch &&
      parseInt(managestockitemState.minimumquantity, 10) >= parseInt(managestockitemState.maximumquantity, 10)
    ) {
      setPopupContentMalert("Minimum Quantity must be less than Maximum Quantity!");
      setPopupSeverityMalert("error");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setManagestockitemState({
      stockcategory: "Please Select Stock category",
      stocksubcategory: "Please Select Stock Sub-category",
      itemname: "",
      uom: "Please Select UOM",
      minimumquantity: "",
      maximumquantity: "",
    });
    setStockSwitch(false);
    setSubcategoryOption([]);
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
  const getCode = async (e) => {
    setPageName(!pageName)
    setUserID(e);
    try {
      let res = await axios.get(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagestockitemEdit(res?.data?.managestockitems);
      setStockSwitchEdit(res?.data?.managestockitems.minimumstockswitch);
      fetchCategoryAll();
      fetchVomMaster();
      fetchHolidayAll();
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagestockitemEdit(res?.data?.managestockitems);
      setStockSwitchEdit(res?.data?.managestockitems.minimumstockswitch);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagestockitemEdit(res?.data?.managestockitems);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  // updateby edit page...
  let updateby = managestockitemEdit?.updatedby;

  let addedby = managestockitemEdit?.addedby;
  let holidayId = managestockitemEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.MANAGESTOCKITEMS_SINGLE}/${holidayId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          stockcategory: String(managestockitemEdit.stockcategory),
          stocksubcategory: String(managestockitemEdit.stocksubcategory),
          itemname: String(managestockitemEdit.itemname),
          uom: String(managestockitemEdit.uom),
          minimumstockswitch: Boolean(stockSwitchEdit), // Ensures true/false value
          minimumquantity: stockSwitchEdit ? String(managestockitemEdit.minimumquantity) : "",
          maximumquantity: stockSwitchEdit ? String(managestockitemEdit.maximumquantity) : "",
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
      await fetchHoliday();
      await fetchHolidayAll();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchHolidayAll();
    const isNameMatch = allStatusEdit?.some(
      (item) =>
        // item.stockcategory?.toLowerCase() == managestockitemEdit.stockcategory?.toLowerCase() &&
        // item.stocksubcategory?.toLowerCase() == managestockitemEdit.stocksubcategory?.toLowerCase()
        //  &&
        item.itemname?.toLowerCase() ==
        managestockitemEdit.itemname?.toLowerCase()
      // &&
      // item.uom?.toLowerCase() == managestockitemEdit.uom?.toLowerCase()
    );
    if (managestockitemEdit.stockcategory === "Please Select Stockcategory") {
      setPopupContentMalert("Please Select Stock category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      managestockitemEdit.stocksubcategory ===
      "Please Select Stock Sub-category"
    ) {
      setPopupContentMalert("Please Select Stock Sub-category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (managestockitemEdit.itemname === "") {
      setPopupContentMalert("Please Enter Item Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (managestockitemEdit.uom === "Please Select UOM") {
      setPopupContentMalert("Please Select UOM!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (stockSwitchEdit && (!managestockitemEdit.minimumquantity || !managestockitemEdit.maximumquantity)) {
      setPopupContentMalert("Please Enter Minimum and Maximum Quantity!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      stockSwitchEdit &&
      parseInt(managestockitemEdit.minimumquantity, 10) >= parseInt(managestockitemEdit.maximumquantity, 10)
    ) {
      setPopupContentMalert("Minimum Quantity must be less than Maximum Quantity!");
      setPopupSeverityMalert("error");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all data.
  const fetchHoliday = async () => {
    // setColumnVisibility(initialColumnVisibility)
    setPageName(!pageName)
    setStatusCheck(true)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
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
      let res_employee = await axios.post(SERVICE.MANAGE_STOCK_ITEMS_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => {

        return {
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,


        }
      });


      setPowerstationArray(itemsWithSerialNumber);
      setItems(itemsWithSerialNumber);
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
      setStatusCheck(false)
    }
    catch (err) {
      setStatusCheck(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //get all data.
  const fetchHolidayAll = async () => {
    setPageName(!pageName)
    try {
      let res_status = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllStatusEdit(
        res_status?.data?.managestockitems.filter((item) => item._id !== userId)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };
  //image


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Managestockitems.png");
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
    documentTitle: "Managestockitems",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(powerstationArray);
  }, [powerstationArray]);



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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
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
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "stockcategory",
      headerName: "Stock Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.stockcategory,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "stocksubcategory",
      headerName: "Stock Sub-Category",
      flex: 0,
      width: 170,
      hide: !columnVisibility.stocksubcategory,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "itemname",
      headerName: "Item Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.itemname,
      headerClassName: "bold-header",
    },
    {
      field: "uom",
      headerName: "Uom",
      flex: 0,
      width: 100,
      hide: !columnVisibility.uom,
      headerClassName: "bold-header",
    },
    // {
    //   field: "minimumstockswitch",
    //   headerName: "Minimum Stock",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.minimumstockswitch,
    //   headerClassName: "bold-header",
    // },
    {
      field: "minimumquantity",
      headerName: "Minimum Quantity",
      flex: 0,
      width: 100,
      hide: !columnVisibility.minimumquantity,
      headerClassName: "bold-header",
    },
    {
      field: "maximumquantity",
      headerName: "Maximum Quantity",
      flex: 0,
      width: 100,
      hide: !columnVisibility.maximumquantity,
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
          {isUserRoleCompare?.includes("emanagestockitems") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
                fetchVomMaster();
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmanagestockitems") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanagestockitems") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanagestockitems") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpeninfo();
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
    const formattedDate = new Date(item.date).toLocaleDateString("en-GB");

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      stockcategory: item.stockcategory,
      stocksubcategory: item.stocksubcategory,
      itemname: item.itemname,
      uom: item.uom,
      // minimumstockswitch: item.minimumstockswitch === true ? "ON" : item.minimumstockswitch === false ? "OFF" : "",
      // minimumstockswitch: item.minimumstockswitch ? "ON" : "OFF",
      minimumquantity: item.minimumquantity,
      maximumquantity: item.maximumquantity,
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

  useEffect(() => {
    fetchCategoryAll();

    fetchVomMaster();
  }, []);

  useEffect(() => {
    fetchHoliday();
  }, [page, pageSize, searchQuery]);


  useEffect(() => {
    fetchHolidayAll();
  }, [isEditOpen]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);


  const delAccountcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANAGESTOCKITEMS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      await fetchHoliday();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

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

  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Manage Stock Items"),
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
    setStatusCheck(true);

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
      let res_employee = await axios.post(SERVICE.MANAGE_STOCK_ITEMS_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => {

        return {
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,


        }
      });


      setPowerstationArray(itemsWithSerialNumber);
      setItems(itemsWithSerialNumber);
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
      setStatusCheck(false)
    } catch (err) { setStatusCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  return (
    <Box>
      <Headtitle title={"Manage Stock Items"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Manage Stock Items</Typography> */}
      <PageHeading
        title="Manage Stock Items"
        modulename="Asset"
        submodulename="Stock"
        mainpagename="Manage Stock Items"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("amanagestockitems") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Stock Items
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={categoryOption}
                      styles={colourStyles}
                      value={{
                        label: managestockitemState.stockcategory,
                        value: managestockitemState.stockcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          stockcategory: e.value,
                          stocksubcategory:
                            "Please Select Stock Sub-category",
                        });
                        fetchSubcategoryBased(e);
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
                        label: managestockitemState.stocksubcategory,
                        value: managestockitemState.stocksubcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          stocksubcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Item Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Item Name"
                      value={managestockitemState.itemname}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          itemname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      UOM<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={uomOpt}
                      styles={colourStyles}
                      value={{
                        label: managestockitemState.uom,
                        value: managestockitemState.uom,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          uom: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Minimum Stock"
                        control={
                          <Switch
                            checked={stockSwitch}
                            onChange={handleStockSwitchChange}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>

                {stockSwitch && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Minimum Quantity <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="Number"
                          sx={userStyle.input}
                          placeholder="Please Enter Minimum Quantity"
                          value={managestockitemState.minimumquantity}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\./g, "");
                            setManagestockitemState({ ...managestockitemState, minimumquantity: newValue });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ".") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Maximum Quantity <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="Number"
                          sx={userStyle.input}
                          placeholder="Please Enter Maximum Quantity"
                          value={managestockitemState.maximumquantity}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\./g, "");
                            setManagestockitemState({ ...managestockitemState, maximumquantity: newValue });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ".") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}


              </Grid>

              <br />
              <br />
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
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
              {/* <Grid container>
                                    <Grid item md={3} xs={12} sm={6}></Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            Clear
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}></Grid>
                                </Grid> */}
            </>
          </Box>
        )}



      </>

      <br />


      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanagestockitems") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Manage Stock Items List
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
                  {isUserRoleCompare?.includes("excelmanagestockitems") && (
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
                  {isUserRoleCompare?.includes("csvmanagestockitems") && (
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
                  {isUserRoleCompare?.includes("printmanagestockitems") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanagestockitems") && (
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

                  {isUserRoleCompare?.includes("imagemanagestockitems") && (
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
            {isUserRoleCompare?.includes("bdmanagestockitems") && (
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

            {statusCheck ? (
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
                      itemsList={powerstationArray}
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
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
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
                      fetchHoliday();
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "30px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Manage Stock Items
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Stock Category</Typography>
                  <Typography>{managestockitemEdit.stockcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Stock Sub-category</Typography>
                  <Typography>
                    {managestockitemEdit.stocksubcategory}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Item Name</Typography>
                  <Typography>{managestockitemEdit.itemname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Uom</Typography>
                  <Typography>{managestockitemEdit.uom}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <FormGroup>
                    <FormControlLabel
                      label="Minimum Stock"
                      control={
                        <Switch
                          checked={stockSwitchEdit}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              {stockSwitchEdit && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Minimum Quantity</Typography>
                      <Typography>{managestockitemEdit.minimumquantity}</Typography>

                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Maximum Quantity </Typography>
                      <Typography>{managestockitemEdit.maximumquantity}</Typography>

                    </FormControl>
                  </Grid>
                </>
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
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
        >
          <Box sx={{ padding: "30px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Manage Stock Items{" "}
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={categoryOptionEdit}
                      styles={colourStyles}
                      value={{
                        label: managestockitemEdit.stockcategory,
                        value: managestockitemEdit.stockcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemEdit({
                          ...managestockitemEdit,
                          stockcategory: e.value,

                          stocksubcategory: "Please Select Stock Sub-category",
                        });
                        fetchSubcategoryBased(e);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Sub-category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={stocksubcategoryOptEdit}
                      styles={colourStyles}
                      value={{
                        label: managestockitemEdit.stocksubcategory,
                        value: managestockitemEdit.stocksubcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemEdit({
                          ...managestockitemEdit,
                          stocksubcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Item Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Item Name"
                      value={managestockitemEdit.itemname}
                      onChange={(e) => {
                        setManagestockitemEdit({
                          ...managestockitemEdit,
                          itemname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      UOM<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={uomOptEdit}
                      styles={colourStyles}
                      value={{
                        label: managestockitemEdit.uom,
                        value: managestockitemEdit.uom,
                      }}
                      onChange={(e) => {
                        setManagestockitemEdit({
                          ...managestockitemEdit,
                          uom: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        label="Minimum Stock"
                        control={
                          <Switch
                            checked={stockSwitchEdit}
                            onChange={handleStockSwitchChangeEdit}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>

                {stockSwitchEdit && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Minimum Quantity <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="Number"
                          sx={userStyle.input}
                          placeholder="Please Enter Minimum Quantity"
                          value={managestockitemEdit.minimumquantity}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\./g, "");
                            setManagestockitemEdit({ ...managestockitemEdit, minimumquantity: newValue });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ".") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Maximum Quantity <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="Number"
                          sx={userStyle.input}
                          placeholder="Please Enter Maximum Quantity"
                          value={managestockitemEdit.maximumquantity}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\./g, "");
                            setManagestockitemEdit({ ...managestockitemEdit, maximumquantity: newValue });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === ".") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
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
        filename={"ManageStockItems"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Manage Stock Items Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delHoliday}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAccountcheckbox}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}
export default Managestockitems;