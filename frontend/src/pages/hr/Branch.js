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
import PageHeading from "../../components/PageHeading";

import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextareaAutosize,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import QRCode from "qrcode";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { BASE_URL } from "../../services/Authservice";
import { SERVICE } from "../../services/Baseservice";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

const Branch = () => {
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");

  const [subCategoryTodoEmail, setSubcategoryTodoEmail] = useState([]);
  const [subcategoryEmail, setSubcategoryEmail] = useState("");

  const [subCategoryTodoEdit, setSubcategoryTodoEdit] = useState([]);
  const [subcategoryEdit, setSubcategoryEdit] = useState("");

  const [subCategoryTodoEmailEdit, setSubcategoryTodoEmailEdit] = useState([]);
  const [subcategoryEmailEdit, setSubcategoryEmailEdit] = useState("");

  const addTodoEmail = () => {
    const isSubNameMatchEmail = subCategoryTodoEmail.some(
      (item) => item?.toLowerCase() === subcategoryEmail?.toLowerCase()
    );
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategoryEmail === "") {
      setPopupContentMalert("Please Enter Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!validateEmail(subcategoryEmail)) {
      setPopupContentMalert(
        "Please Enter Valid Email!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatchEmail) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Email!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setSubcategoryTodoEmail([...subCategoryTodoEmail, subcategoryEmail]);
      setSubcategoryEmail("");
    }
  };

  const handleTodoEditEmail = (index, newValue) => {
    const updatedTodos = [...subCategoryTodoEmail];
    updatedTodos[index] = newValue;
    setSubcategoryTodoEmail(updatedTodos);
  };

  const deleteTodoEmail = (index) => {
    const updatedTodos = [...subCategoryTodoEmail];
    updatedTodos.splice(index, 1);
    setSubcategoryTodoEmail(updatedTodos);
  };

  const addTodoEmailEdit = () => {
    const isSubNameMatchEmail = subCategoryTodoEmailEdit.some(
      (item) => item?.toLowerCase() === subcategoryEmailEdit?.toLowerCase()
    );
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategoryEmailEdit === "") {
      setPopupContentMalert("Please Enter Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!validateEmail(subcategoryEmailEdit)) {
      setPopupContentMalert(
        "Please Enter Valid Email!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatchEmail) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Email!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setSubcategoryTodoEmailEdit([...subCategoryTodoEmailEdit, subcategoryEmailEdit]);
      setSubcategoryEmailEdit("");
    }
  };

  const handleTodoEditEmailEdit = (index, newValue) => {
    const updatedTodos = [...subCategoryTodoEmailEdit];
    updatedTodos[index] = newValue;
    setSubcategoryTodoEmailEdit(updatedTodos);
  };

  const deleteTodoEmailEdit = (index) => {
    const updatedTodos = [...subCategoryTodoEmailEdit];
    updatedTodos.splice(index, 1);
    setSubcategoryTodoEmailEdit(updatedTodos);
  };


  const addTodo = () => {
    const isSubNameMatch = subCategoryTodo.some(
      (item) => item?.toLowerCase() === subcategory?.toLowerCase()
    );
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategory === "") {
      setPopupContentMalert("Please Enter Phone Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategory?.length < 10 || subcategory?.length > 10) {
      setPopupContentMalert(
        "Please Enter Valid Phone Number!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatch) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Phone Number!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setSubcategoryTodo([...subCategoryTodo, subcategory]);
      setSubcategory("");
    }
  };

  const handleTodoEdit = (index, newValue) => {
    const updatedTodos = [...subCategoryTodo];
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = newValue?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      updatedTodos[index] = inputValue;
      setSubcategoryTodo(updatedTodos);
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...subCategoryTodo];
    updatedTodos.splice(index, 1);
    setSubcategoryTodo(updatedTodos);
  };

  const addTodoEdit = () => {
    const isSubNameMatch = subCategoryTodoEdit.some(
      (item) => item?.toLowerCase() === subcategoryEdit?.toLowerCase()
    );
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter Phone Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subcategoryEdit?.length < 10 || subcategoryEdit?.length > 10) {
      setPopupContentMalert(
        "Please Enter Valid Phone Number!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatch) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another Phone Number!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setSubcategoryTodoEdit([...subCategoryTodoEdit, subcategoryEdit]);
      setSubcategoryEdit("");
    }
  };

  const handleTodoEditEdit = (index, newValue) => {
    const updatedTodos = [...subCategoryTodoEdit];
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = newValue?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      updatedTodos[index] = inputValue;
      setSubcategoryTodoEdit(updatedTodos);
    }
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...subCategoryTodoEdit];
    updatedTodos.splice(index, 1);
    setSubcategoryTodoEdit(updatedTodos);
  };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    //  setSubmitLoader(false);
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
    "Name",
    "Code",
    "Assetcode",
    "Company",
    "Address",
    "Phonenumber",
    "Email",
  ];
  let exportRowValues = [
    "name",
    "code",
    "assetcode",
    "company",
    "address",
    "phone",
    "email",
  ];

  const {
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      company: data.company,
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
        company: data.company,
      }));

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

  const { auth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isBtn, setIsBtn] = useState(false);

  const [branch, setBranch] = useState({
    code: "",
    assetcode: "",
    phone: "",
    email: "",
    company: "Please Select Company",
    name: "",
    country: "",
    state: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailbranch, setEmail] = useState("");
  const [compCode, setCompCode] = useState("");

  const validateEmail = (emailbranch) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(emailbranch);
  };

  const [branches, setBranches] = useState([]);
  const [branchesall, setBranchesall] = useState([]);
  const [getrowid, setRowGetid] = useState("");
  const [branchedit, setBranchedit] = useState({
    code: "",
    assetcode: "",
    phone: "",
    email: "",
    company: "Please Select Company",
    name: "",
    country: "",
    state: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [deletebranch, setDeletebranch] = useState({});
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [isBranch, setIsBranch] = useState(false);


  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Branch"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Branch.png");
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

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

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

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    code: true,
    assetcode: true,
    company: true,
    address: true,
    phone: true,
    email: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const delBranchcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.BRANCH_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchBranchAccessBranch();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    setBranch({
      company: "Please Select Company",
      code: "",
      assetcode: "",
      phone: "",
      email: "",
      name: "",
      address: "",
      pincode: "",
    });
    setIsValidEmail(validateEmail(""));
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [branchesOverallExport, setBranchesOverallExport] = useState([])

  // get all branches
  const fetchBranch = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranches(res_branch?.data?.branch);
      setBranchesOverallExport(res_branch?.data?.branch.map((item, index) => {
        const isAdd = item.address;
        const address = isAdd !== "" ? item.address + ", " : "";
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          name: item.name,
          code: item.code,
          assetcode: item.assetcode,
          company: item.company,
          address: address + item.city + ", " + item.state + ", " + item.pincode,
          phone: item.phone?.toString(),
          email: item.email?.toString(),
        };
      }));

      setIsBranch(true);
    } catch (err) {
      setIsBranch(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchBranchAccessBranch = async () => {
    setPageName(!pageName);
    try {

      let res_branch = await axios.post(SERVICE.BRANCH_ACCESSBRANCH_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch
      });
      setBranches(res_branch?.data?.branch);
      setBranchesOverallExport(res_branch?.data?.branch.map((item, index) => {
        const isAdd = item.address;
        const address = isAdd !== "" ? item.address + ", " : "";
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          name: item.name,
          code: item.code,
          assetcode: item.assetcode,
          company: item.company,
          address: address + item.city + ", " + item.state + ", " + item.pincode,
          phone: item.phone?.toString(),
          email: item.email?.toString(),
        };
      }));

      setIsBranch(true);
    } catch (err) {
      setIsBranch(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Excel
  const fileName = "Branch";
  let excelno = 1;

  // Country states
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
  const [oldBranchName, setOldBranchName] = useState("");
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
      setOldBranchName(name);
      setRowGetid(res?.data?.sbranch);
      setOvProj(name);
      setSubcategoryTodoEdit(res?.data?.sbranch.phone || [])
      setSubcategoryTodoEmailEdit(res?.data?.sbranch.email || [])
      setIsValidEmail(validateEmail(res?.data?.sbranch.email));
      getOverallEditSection(name);
      const country = Country.getAllCountries().find(
        (country) => country.name === res?.data?.sbranch?.country
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === res?.data?.sbranch?.state
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === res?.data?.sbranch?.city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCityc(city);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.BRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchedit(res?.data?.sbranch);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get all branches
  const fetchBranchAll = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranchesall(
        res_branch?.data?.branch.filter((item) => item._id !== branchedit._id)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //set function to get particular row on delete
  const [checkUnit, setCheckUnit] = useState();
  const [checkFloor, setCheckFloor] = useState();
  const [checkUser, setCheckUser] = useState();
  const [checkBranch, setCheckBranch] = useState();

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      const [res, resdev] = await Promise.all([
        axios.get(`${SERVICE.BRANCH_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.BRANCHALLCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkbranch: String(name),
        }),
      ]);

      setDeletebranch(res?.data?.sbranch);
      setCheckUnit(resdev?.data?.units);
      setCheckFloor(resdev?.data?.floors);
      setCheckBranch(resdev?.data?.designation);
      setCheckUser(resdev?.data?.users);

      if (
        resdev?.data?.units?.length > 0 ||
        resdev?.data?.areagrouping?.length > 0 ||
        resdev?.data?.designation?.length > 0 ||
        resdev?.data?.floors?.length > 0 ||
        resdev?.data?.locationgrouping?.length > 0 ||
        resdev?.data?.manpower?.length > 0 ||
        resdev?.data?.users?.length > 0 ||
        resdev?.data?.workstation?.length > 0
      ) {
        // handleClickOpenCheck();
        setPopupContentMalert(
          <span style={{ fontWeight: "700", color: "#777" }}>
            {`${name}`}
            <span style={{ fontWeight: "bold", color: "black" }}> was linked</span>
          </span>
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleClickOpendel();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup

  let branchid = deletebranch._id;

  const delBranch = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.BRANCH_SINGLE}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBranchAccessBranch();
      setPage(1);
      setSelectedRows([]);
      setPage(1);
      handleCloseDel();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const LoadingDialog = ({ open, onClose, progress }) => {
    const dialogStyles = {
      padding: "24px",
      textAlign: "center",
    };

    const dialogTitleStyles = {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: "#3f51b5", // Primary color
    };

    const dialogContentStyles = {
      padding: "16px",
    };

    const progressStyles = {
      marginTop: "16px",
      height: "10px",
      borderRadius: "5px",
    };

    const progressTextStyles = {
      marginTop: "8px",
      fontWeight: "bold",
      color: "#4caf50", // Success color
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle style={dialogTitleStyles}>Updating...</DialogTitle>
        <DialogContent style={dialogContentStyles}>
          <Typography>
            Please wait while we update the employee names across all pages.
          </Typography>
          <LinearProgress
            style={progressStyles}
            variant="determinate"
            value={progress}
          />
          <Typography style={progressTextStyles}>{progress}%</Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };

  let totalLoaded = 0;
  let totalSize = 0;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPopupUpload, setOpenPopupUpload] = useState(false);


  const handleUploadProgress = (progressEvent) => {
    if (progressEvent.event.lengthComputable) {
      console.log(
        `Progress Event - Loaded: ${progressEvent.loaded}, Total: ${progressEvent.total}`
      );
      updateTotalProgress(progressEvent.loaded, progressEvent.total);
    } else {
      console.log("Unable to compute progress information.");
    }
  };

  const updateTotalProgress = (loaded, size) => {
    totalLoaded += loaded;
    totalSize += size;
    if (totalSize > 0) {
      const percentCompleted = Math.round((totalLoaded * 100) / totalSize);
      setUploadProgress(percentCompleted);
      console.log(`Total Upload Progress: ${percentCompleted}%`);
    } else {
      console.log("Total size is zero, unable to compute progress.");
    }
  };

  const username = isUserRoleAccess.username;

  //branch updatedby edit page....
  let updateby = branchedit?.updatedby;
  let addedby = branchedit?.addedby;

  //edit post call
  let branch_id = getrowid?._id;
  // /edit put
  const sendRequestEdit = async () => {
    setIsLoading(true);
    setPageName(!pageName);
    try {
      // const qrCodeBase64 = await QRCode.toDataURL(
      //   `${"http://192.168.85.34:3000"}/Visitorsregister/${branch.company}/${
      //     branch.name
      //   }`
      // );

      const qrCodeBase64 = await QRCode.toDataURL(
        `${BASE_URL}/Visitorsregister/${branchedit.company}/${branchedit.name}`
      );

      let branches = await axios.put(`${SERVICE.BRANCH_SINGLE}/${branch_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        code: String(branchedit.code),
        assetcode: String(branchedit.assetcode),
        phone: subCategoryTodoEdit,
        email: subCategoryTodoEmailEdit,
        name: String(branchedit.name),
        address: String(branchedit.address),
        company: String(branchedit.company),
        country: String(
          selectedCountryc?.name == undefined ? "" : selectedCountryc?.name
        ),
        state: String(
          selectedStatec?.name == undefined ? "" : selectedStatec?.name
        ),
        city: String(
          selectedCityc?.name == undefined ? "" : selectedCityc?.name
        ),
        pincode: String(branchedit.pincode),
        companycode: String(compCode),
        qrcode: qrCodeBase64,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      const performUploads = async () => {
        setPageName(!pageName);
        try {
          // Check and perform employee name update
          if (branchedit.name?.toLowerCase() !== oldBranchName?.toLowerCase()) {
            await axios.put(
              `${SERVICE.BRANCHOVERALLUPDATE}`,
              {
                oldname: oldBranchName,
                newname: branchedit.name,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                onUploadProgress: handleUploadProgress,
              }
            );
          }
        } catch (error) {
          console.error("Error during upload:", error);
        } finally {
          setOpenPopupUpload(false); // Close the popup after all uploads are completed
          console.log("ended");
        }
      };

      await performUploads();

      await fetchBranchAccessBranch();
      handleCloseModEdit();
      setIsLoading(false);
      fetchBranchAll();

      getOverallEditSectionUpdate();
      setSubcategoryTodoEdit([])
      setSubcategoryEdit("")
      setSubcategoryTodoEmailEdit([])
      setSubcategoryEmailEdit("")
      // setPopupContent("Update Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
    } catch (err) {
      setIsLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    const newErrors = {};
    e.preventDefault();
    fetchBranchAll();

    const isNameMatch = branchesall.some((item) => item.name.toLowerCase() === branchedit.name.toLowerCase() && item.company === branchedit.company);

    const isCodeMatch = branchesall.some(
      (item) => item.code.toLowerCase() === branchedit.code.toLowerCase()
    );
    const isAssetcodeMatch = branchesall.some(
      (item) =>
        item.assetcode.toLowerCase() === branchedit.assetcode.toLowerCase()
    );

    const hasDuplicates = (arr) =>
      new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;

    if (branchedit.name === "") {
      setPopupContentMalert("Please enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchedit.code === "") {
      setPopupContentMalert("Please enter Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isAssetcodeMatch) {
      setPopupContentMalert("Asset Code already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchedit.assetcode === "") {
      setPopupContentMalert("Please enter Assetcode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (subCategoryTodoEdit?.length === 0) {
      setPopupContentMalert("Please Enter Phone Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEdit?.some((item) => item?.length !== 10)) {
      setPopupContentMalert("Phone Number Must Be Valid!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hasDuplicates(subCategoryTodoEdit)) {
      setPopupContentMalert("Phone Number Cannot be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEdit?.some((item) => item === "")) {
      setPopupContentMalert("Phone Number Cannot be Empty!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEmailEdit?.length === 0) {
      setPopupContentMalert("Please Enter Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hasDuplicates(subCategoryTodoEmailEdit)) {
      setPopupContentMalert("Email Cannot be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEmailEdit?.some((item) => !validateEmail(item))) {
      setPopupContentMalert("Please Enter Valid Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      branchedit.company === "" ||
      branchedit.company == "Please Select Company"
    ) {
      setPopupContentMalert("Please Select company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchedit.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
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
    } else {
      sendRequestEdit();
    }
    setErrors(newErrors);
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.units?.length > 0 ? "Unit ," : ""
        } 
     ${res?.data?.floors?.length > 0 ? "Floor ," : ""}
     ${res?.data?.users?.length > 0 ? "Add Employee ," : ""}
     ${res?.data?.hierarchy?.length > 0 ? "Hierarchy ," : ""}
     ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""
        } whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(
        res?.data?.units,
        res?.data?.floors,
        res?.data?.users,
        res?.data?.excelmapresperson,
        res?.data?.hierarchy
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (
    unit,
    floor,
    user,
    excelmapresperson,
    hierarchy
  ) => {
    setPageName(!pageName);
    try {
      if (unit?.length > 0) {
        let answ = unit.map((d, i) => {
          let res = axios.put(`${SERVICE.UNIT_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (hierarchy?.length > 0) {
        let answ = hierarchy.map((d, i) => {
          let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (floor?.length > 0) {
        let answ = floor.map((d, i) => {
          let res = axios.put(`${SERVICE.FLOOR_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      if (user?.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            branch: String(branchedit.name),
          });
        });
      }
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchBranchAccessBranch();
  }, []);

  useEffect(() => {
    fetchBranchAll();
  }, [isEditOpen, branchedit]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Branch",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = branches?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [branches]);

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

  const indexOfLastItem = page * pageSize;

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
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
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

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
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
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 160,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "code",
      headerName: "Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.code,
      headerClassName: "bold-header",
    },
    {
      field: "assetcode",
      headerName: "Asset Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.assetcode,
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
      field: "address",
      headerName: "Address",
      flex: 0,
      width: 250,
      hide: !columnVisibility.address,
      headerClassName: "bold-header",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0,
      width: 130,
      hide: !columnVisibility.phone,
      headerClassName: "bold-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.email,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ebranch") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dbranch") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vbranch") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ibranch") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
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
    const isAdd = item.address;
    const address = isAdd !== "" ? item.address + ", " : "";
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      code: item.code,
      assetcode: item.assetcode,
      company: item.company,
      address: address + item.city + ", " + item.state + ", " + item.pincode,
      phone: item.phone?.toString(),
      email: item.email?.toString(),
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

  //change form
  const handleChangephonenumber = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value?.slice(0, 10);

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setSubcategory(inputValue);
    }
  };

  const handleChangephonenumberEdit = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value?.slice(0, 10);

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setSubcategoryEdit(inputValue);
    }
  };

  // /post call
  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      const qrCodeBase64 = await QRCode.toDataURL(
        `${BASE_URL}/Visitorsregister/${branch.company}/${branch.name}`
      );

      let branches = await axios.post(SERVICE.BRANCH_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        code: String(branch.code),
        assetcode: String(branch.assetcode),
        phone: [...subCategoryTodo],
        email: [...subCategoryTodoEmail],
        name: String(branch.name),
        company: String(branch.company),
        country: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        state: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        city: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),
        address: String(branch.address),
        pincode: String(branch.pincode),
        companycode: String(compCode),
        qrcode: qrCodeBase64,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setBranch(branches.data);

      await fetchBranchAccessBranch();

      setBranch({
        ...branch,
        code: "",
        assetcode: "",
        company: "Please Select Company",
        phone: "",
        email: "",
        name: "",
        country: "",
        state: "",
        address: "",
        city: "",
        pincode: "",
      });
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
      setSubcategoryTodo([])
      setSubcategory("")
      setSubcategoryTodoEmail([])
      setSubcategoryEmail("")
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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

  // submit option for saving....
  const handleSubmit = (e) => {
    const newErrors = {};
    e.preventDefault();
    const isNameMatch = branches.some(
      (item) =>
        item.name.toLowerCase() === branch.name.toLowerCase() &&
        item.company === branch.company
    );

    const isCodeMatch = branches.some(
      (item) => item.code.toLowerCase() === branch.code.toLowerCase()
    );

    const isAssetcodeMatch = branches.some(
      (item) => item.assetcode.toLowerCase() === branch.assetcode.toLowerCase()
    );

    const hasDuplicates = (arr) =>
      new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;


    if (branch.code == "") {
      setPopupContentMalert("Please enter Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branch.assetcode === "") {
      setPopupContentMalert("Please enter Assetcode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo?.length === 0) {
      setPopupContentMalert("Please Enter Phone Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo?.some((item) => item?.length !== 10)) {
      setPopupContentMalert("Phone Number Must Be Valid!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hasDuplicates(subCategoryTodo)) {
      setPopupContentMalert("Phone Number Cannot be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodo?.some((item) => item === "")) {
      setPopupContentMalert("Phone Number Cannot be Empty!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEmail?.length === 0) {
      setPopupContentMalert("Please Enter Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (hasDuplicates(subCategoryTodoEmail)) {
      setPopupContentMalert("Email Cannot be same!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (subCategoryTodoEmail?.some((item) => !validateEmail(item))) {
      setPopupContentMalert("Please Enter Valid Email!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (branch.name === "") {
      setPopupContentMalert("Please enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branch.company === "Please Select Company") {
      setPopupContentMalert("Please Select company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (branch.phone !== "" && branch.phone?.length < 10) {
      setPopupContentMalert("Please Enter Valid Phone Number");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branch.email !== "" && isValidEmail === false) {
      setPopupContentMalert("Please Enter Valid Email!");
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
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isAssetcodeMatch) {
      setPopupContentMalert("Asset Code already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      branch.company === "" ||
      branch.company == "Please Select Company"
    ) {
      setPopupContentMalert("Please Select company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
    setErrors(newErrors);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setBranch({
      code: "",
      assetcode: "",
      phone: "",
      email: "",
      company: "Please Select Company",
      name: "",
      country: "",
      state: "",
      address: "",
      city: "",
      pincode: "",
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
    setSubcategoryTodo([])
    setSubcategory("")
    setSubcategoryTodoEmail([])
    setSubcategoryEmail("")
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  return (
    <>
      <Headtitle title={"BRANCH"} />
      <PageHeading
        title="Branch"
        modulename="Human Resources"
        submodulename="Facility"
        mainpagename="Branch"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("abranch") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.SubHeaderText}> Add Branch</Typography>
            <br />
            <br />
            <>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={branch.code}
                        placeholder="Please Enter Code"
                        onChange={(e) => {
                          setBranch({ ...branch, code: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Asset Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Asset Code"
                        value={branch.assetcode}
                        onChange={(e) => {
                          setBranch({ ...branch, assetcode: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>Phone Number</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={branch.phone?.slice(0, 10)}
                        placeholder="Please Enter Phone Number"
                        onChange={(e) => handleChangephonenumber(e)}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      {" "}
                      <Typography>
                        {" "}
                        Phone Number <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Phone Number"
                        value={subcategory}
                        onChange={(e) => handleChangephonenumber(e)}
                      />
                    </FormControl>
                    &emsp;
                    <Button
                      variant="contained"
                      color="success"
                      onClick={addTodo}
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
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      {" "}
                      <Typography>
                        {" "}
                        Email <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Email"
                        value={subcategoryEmail}
                        onChange={(e) => {
                          setSubcategoryEmail(e.target.value);
                        }}
                      />
                    </FormControl>
                    &emsp;
                    <Button
                      variant="contained"
                      color="success"
                      onClick={addTodoEmail}
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
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}></Grid>
                  <Grid item md={3} sm={12} xs={12}></Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    {subCategoryTodo.length > 0 && (
                      <ul type="none">
                        {subCategoryTodo.map((item, index) => {
                          return (
                            <li key={index}>
                              <br />
                              <Grid sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Phone Number  <b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Please Enter Phone Number"
                                    value={item}
                                    onChange={(e) =>
                                      handleTodoEdit(index, e.target.value)
                                    }
                                  />
                                </FormControl>
                                &emsp;
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
                                  <AiOutlineClose />{" "}
                                </Button>
                              </Grid>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    {subCategoryTodoEmail.length > 0 && (
                      <ul type="none">
                        {subCategoryTodoEmail.map((item, index) => {
                          return (
                            <li key={index}>
                              <br />
                              <Grid sx={{ display: "flex" }}>
                                <FormControl fullWidth size="small">
                                  <Typography>
                                    Email   <b style={{ color: "red" }}>*</b>
                                  </Typography>
                                  <OutlinedInput
                                    id="component-outlined"
                                    placeholder="Please Enter Email"
                                    value={item}
                                    onChange={(e) =>
                                      handleTodoEditEmail(index, e.target.value)
                                    }
                                  />
                                </FormControl>
                                &emsp;
                                <Button
                                  variant="contained"
                                  color="error"
                                  type="button"
                                  onClick={(e) => deleteTodoEmail(index)}
                                  sx={{
                                    height: "30px",
                                    minWidth: "30px",
                                    marginTop: "28px",
                                    padding: "6px 10px",
                                  }}
                                >
                                  <AiOutlineClose />{" "}
                                </Button>
                              </Grid>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </Grid>

                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={branch.name}
                        onChange={(e) => {
                          setBranch({ ...branch, name: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
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
                        placeholder={"please select"}
                        value={{ label: branch.company, value: branch.company }}
                        onChange={(e) => {
                          setBranch({ ...branch, company: e.value });
                          setCompCode(e.companycode);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
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
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCountryp(item);
                          setBranch((prevSupplier) => ({
                            ...prevSupplier,
                            country: item?.name || "",
                          }));
                          setSelectedStatep("Please Select State");
                          setSelectedCityp("Please Select State");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl size="small" fullWidth>
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
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedStatep(item);
                          setBranch((prevSupplier) => ({
                            ...prevSupplier,
                            state: item?.name || "",
                          }));
                          setSelectedCityp("Please Select State");
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12} lg={6}>
                    <FormControl fullWidth>
                      <Typography>Address</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={branch.address}
                        onChange={(e) => {
                          setBranch({ ...branch, address: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl size="small" fullWidth>
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
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCityp(item);
                          setBranch((prevSupplier) => ({
                            ...prevSupplier,
                            city: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        placeholder="Please Enter Pincode"
                        sx={userStyle.input}
                        value={branch.pincode?.slice(0, 6)}
                        onChange={(e) => {
                          setBranch({ ...branch, pincode: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button
                        variant="contained"
                        type="submit"
                        sx={buttonStyles.buttonsubmit}
                        disabled={isBtn}
                      >
                        Submit
                      </Button>
                    </>
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button
                        sx={buttonStyles.btncancel}
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                    </>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
          <br />
        </>
      )}
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lbranch") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Branch List{" "}
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
                  {isUserRoleCompare?.includes("excelbranch") && (
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
                  {isUserRoleCompare?.includes("csvbranch") && (
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
                  {isUserRoleCompare?.includes("printbranch") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfbranch") && (
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
                  {isUserRoleCompare?.includes("imagebranch") && (
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
            {/* {isUserRoleCompare?.includes("bdbranch") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}   sx={buttonStyles.buttonbulkdelete}>
                Bulk Delete
              </Button>
            )} */}
            <br />
            <br />
            {!isBranch ? (
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
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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
                    disableRowSelectionOnClick
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

      {/* ****** Table End ****** */}
      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "80px" }}
        >
          <Box sx={{ padding: "30px" }}>
            <Typography sx={userStyle.SubHeaderText}> Edit Branch</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={branchedit.code}
                    placeholder="Please Enter Code"
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, code: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Asset Code <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Asset Code"
                    value={branchedit.assetcode}
                    onChange={(e) => {
                      setBranchedit({
                        ...branchedit,
                        assetcode: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {/* <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    placeholder="Please Enter Phone Number"
                    value={branchedit.phone?.slice(0, 10)}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, phone: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <FormControl fullWidth size="small">
                    <Typography>Email</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="email"
                      placeholder="Please Enter Email"
                      value={branchedit.email}
                      onChange={(e) => {
                        setBranchedit({ ...branchedit, email: e.target.value });
                        setIsValidEmail(validateEmail(e.target.value));
                        setEmail(e.target.value);
                      }}
                      InputProps={{
                        inputProps: {
                          pattern: /^\S+@\S+\.\S+$/,
                        },
                      }}
                    />
                  </FormControl>
                  {errors.email && <div>{errors.email}</div>}
                </FormControl>
              </Grid> */}
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  {" "}
                  <Typography>
                    {" "}
                    Phone Number <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Phone Number"
                    value={subcategoryEdit}
                    onChange={(e) => handleChangephonenumberEdit(e)}
                  />
                </FormControl>
                &emsp;
                <Button
                  variant="contained"
                  color="success"
                  onClick={addTodoEdit}
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
              </Grid>
              <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  {" "}
                  <Typography>
                    {" "}
                    Email <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Email"
                    value={subcategoryEmailEdit}
                    onChange={(e) => {
                      setSubcategoryEmailEdit(e.target.value);
                    }}
                  />
                </FormControl>
                &emsp;
                <Button
                  variant="contained"
                  color="success"
                  onClick={addTodoEmailEdit}
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
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                {subCategoryTodoEdit.length > 0 && (
                  <ul type="none">
                    {subCategoryTodoEdit.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Phone Number  <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter Phone Number"
                                value={item}
                                onChange={(e) =>
                                  handleTodoEditEdit(index, e.target.value)
                                }
                              />
                            </FormControl>
                            &emsp;
                            <Button
                              variant="contained"
                              color="error"
                              type="button"
                              onClick={(e) => deleteTodoEdit(index)}
                              sx={{
                                height: "30px",
                                minWidth: "30px",
                                marginTop: "28px",
                                padding: "6px 10px",
                              }}
                            >
                              <AiOutlineClose />{" "}
                            </Button>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                {subCategoryTodoEmailEdit.length > 0 && (
                  <ul type="none">
                    {subCategoryTodoEmailEdit.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid sx={{ display: "flex" }}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Email   <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                placeholder="Please Enter Email"
                                value={item}
                                onChange={(e) =>
                                  handleTodoEditEmailEdit(index, e.target.value)
                                }
                              />
                            </FormControl>
                            &emsp;
                            <Button
                              variant="contained"
                              color="error"
                              type="button"
                              onClick={(e) => deleteTodoEmailEdit(index)}
                              sx={{
                                height: "30px",
                                minWidth: "30px",
                                marginTop: "28px",
                                padding: "6px 10px",
                              }}
                            >
                              <AiOutlineClose />{" "}
                            </Button>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Grid>
              <br />
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={branchedit.name}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
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
                    placeholder={"please select"}
                    value={{
                      label: branchedit.company,
                      value: branchedit.company,
                    }}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, company: e.value });
                      setCompCode(e.companycode);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth>
                  <Typography>Address</Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={2}
                    value={branchedit.address}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, address: e.target.value });
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
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCountryc(item);
                      setBranchedit((prevSupplier) => ({
                        ...prevSupplier,
                        country: item?.name || "",
                      }));
                      setSelectedStatec("Please Select State");
                      setSelectedCityc("Please Select City");
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
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedStatec(item);
                      setBranchedit((prevSupplier) => ({
                        ...prevSupplier,
                        state: item?.name || "",
                      }));
                      setSelectedCityc("Please Select City");
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
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCityc(item);
                      setBranchedit((prevSupplier) => ({
                        ...prevSupplier,
                        city: item?.name || "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>Pincode</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    placeholder="Please Enter Pincode"
                    value={branchedit.pincode?.slice(0, 6)}
                    onChange={(e) => {
                      setBranchedit({ ...branchedit, pincode: e.target.value });
                    }}
                  />
                </FormControl>
                <br />
                <br />
              </Grid>
              <Grid container>
                <br />
                <Grid item md={1}></Grid>
                {isLoading ? (
                  <>
                    <Backdrop
                      sx={{
                        color: "blue",
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                      }}
                      open={isLoading}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={editSubmit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>

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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Branch</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{branchedit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{branchedit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Code</Typography>
                  <Typography>{branchedit.code}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Assetcode</Typography>
                  <Typography>{branchedit.assetcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Address</Typography>
                  <Typography>{branchedit.address}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Country</Typography>
                  <Typography>{branchedit.country}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">State</Typography>
                  <Typography>{branchedit.state}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">City</Typography>
                  <Typography>{branchedit.city}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Pincode</Typography>
                  <Typography>{branchedit.pincode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Phone Number</Typography>
                  <Typography>{branchedit.phone?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Email</Typography>
                  <Typography>{branchedit.email?.toString()}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                sx={buttonStyles?.btncancel}
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
            {isLoading ? (
              <>
                <Backdrop
                  sx={{
                    color: "blue",
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                  }}
                  open={isLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <Grid>
                  <Button
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                      ...buttonStyles?.buttonsubmit
                    }}
                    onClick={() => {
                      sendRequestEdit();
                      handleCloseerrpop();
                    }}
                  >
                    ok
                  </Button>
                </Grid>
              </>
            )}
            &nbsp;
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <LoadingDialog
        open={openPopupUpload}
        onClose={() => setOpenPopupUpload(false)}
        progress={uploadProgress}
      />

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={branchesOverallExport ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Branch Info"
        addedby={addedby}
        updateby={updateby}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseDel}
        onConfirm={delBranch}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delBranchcheckbox}
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
    </>
  );
};

export default Branch;
