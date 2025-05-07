import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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

import domtoimage from 'dom-to-image';


function ResolverReasonmaster() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [reasonmaster, setReasonmaster] = useState({
    categoryreason: "Please Select Category",
    subcategoryreason: "Please Select Subcategory",
    typereason: "Please Select Type",
    reasons: "Please Select Reason",
    namereason: "",
  });

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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

  let exportColumnNames = [   'Category',
    'Subcategory',
    'SubSubcategory',
    'Typereason',
    'Reasons',
    'Reason Name'];
  let exportRowValues = [
    'categoryreason',
    'subcategoryreason',
    'subsubcategoryreason',
    'typereason',
    'reasons',
    'namereason'
  ];

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
      pagename: String("Ticket/Master/Resolver Reason Master"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };



  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [ovProjDelete, setOvProjDelete] = useState("");
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState("");
  const [ovProjCountDelete, setOvProjCountDelete] = useState("");
  const [reasonmasterEdit, setReasonmasterEdit] = useState([]);
  const [reasonmasters, setReasonmasters] = useState([]);
  const [reasonmastersList, setReasonmastersList] = useState([]);
  const [isBtn, setIsBtn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allReasonmasteredit, setAllReasonmasteredit] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess , pageName,
    setPageName,
    buttonStyles,} = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [reasonmasterCheck, setReasonmastercheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");





  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };



 
















  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Resolver Reason Master.png");
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
setIsHandleChange(true);
    if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
    } else {
        getOverallEditSectionOverallDelete(selectedRows)

    }

};

const [selectedRowsCount, setSelectedRowsCount] = useState(0);
//overall edit section for all pages
const getOverallEditSectionOverallDelete = async (ids) => {
 setPageName(!pageName);
try {

        let res = await axios.post(SERVICE.OVERALL_BULK_RESOLVER_REASONMASTER_TICKET_DELETE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            id: ids
        });
        setSelectedRows(res?.data?.result);
        setSelectedRowsCount(res?.data?.count)
        setSelectAllChecked(
          res?.data?.count === filteredData.length
        );
        setIsDeleteOpencheckbox(true);
      } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
};






  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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
    categoryreason: true,
    subcategoryreason: true,
    subsubcategoryreason: true,
    namereason: true,
    typereason: true,
    reasons: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
}, [columnVisibility]);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteType, setDeleteType] = useState("");

  const rowData = async (id, name) => {
 setPageName(!pageName);
try {
      let res = await axios.get(
        `${SERVICE.RESOLVERREASONMASTER_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteType(res?.data?.sreasonmaster);
      setOvProjDelete(res?.data?.sreasonmaster?.namereason);
      getOverallEditSectionDelete(res?.data?.sreasonmaster?.namereason);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //overall edit section for all pages
  const getOverallEditSectionDelete = async (e) => {
 setPageName(!pageName);
try {
      let res = await axios.post(
        SERVICE.OVERALL_RESOLVER_REASONMASTER_TICKET_DELETE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: e,
        }
      );
      setOvProjCountDelete(res.data.count);

      setGetOverallCountDelete(`This Resolver Reason data is linked in 
       ${res.data.raiseticket.length > 0 ? "Raise Ticket Master," : ""}`);
      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  // Alert delete popup
  let Typesid = deleteType?._id;
  const delReason = async (e) => {
 setPageName(!pageName);
try {
      if (Typesid) {
        await axios.delete(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchReasonmaster();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setPopupContent('Deleted Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const delReasoncheckbox = async () => {
 setPageName(!pageName);
try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchReasonmaster();
      setPopupContent('Deleted Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
     } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const [categorys, setCategorys] = useState([]);

  const [categorysEdit, setCategorysEdit] = useState([]);

  //category multiselect

  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState([]);
  const [selectedCategoryOptionsCateEdit, setSelectedCategoryOptionsCateEdit] =
    useState([]);
  const [categoryValueCateEdit, setCategoryValueCateEdit] = useState("");

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setReasonmaster({
      ...reasonmaster,
      typereason: "Please Select Type",
      reasons: "Please Select Reason",
    });
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat?.length
      ? valueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  const handleCategoryChangeEdit = (options) => {
    setCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCategoryOptionsCateEdit(options);
    setSubCategoryValueCateEdit([]);
    setSelectedSubCategoryOptionsCateEdit([]);
    setSubSubCategoryValueCateEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
    setReasonmasterEdit({
      ...reasonmasterEdit,
      typereason: "Please Select Type",
    });
  };
  const customValueRendererCategoryEdit = (
    categoryValueCateEdit,
    _employeename
  ) => {
    return categoryValueCateEdit?.length
      ? categoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Category";
  };

  //subcategory multiselect
  const [selectedOptionsSubCat, setSelectedOptionsSubCat] = useState([]);
  let [valueSubCat, setValueSubCat] = useState([]);
  const [
    selectedSubCategoryOptionsCateEdit,
    setSelectedSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subCategoryValueCateEdit, setSubCategoryValueCateEdit] = useState("");

  const handleSubCategoryChange = (options) => {
    setValueSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubCat(options);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setReasonmaster({
      ...reasonmaster,
      typereason: "Please Select Type",
      reasons: "Please Select Reason",
    });
  };

  const customValueRendererSubCat = (valueSubCat, _categoryname) => {
    return valueSubCat?.length
      ? valueSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const handleSubCategoryChangeEdit = (options) => {
    setSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubCategoryOptionsCateEdit(options);
    setReasonmasterEdit({
      ...reasonmasterEdit,
      typereason: "Please Select Type",
    });
    setSubSubCategoryValueCateEdit([]);
    setSelectedSubSubCategoryOptionsCateEdit([]);
  };
  const customValueRendererSubCategoryEdit = (
    subCategoryValueCateEdit,
    _employeename
  ) => {
    return subCategoryValueCateEdit?.length
      ? subCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Category";
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [filteredSubCategoryOptions, setFilteredSubCategoryOptions] = useState(
    []
  );
  const [filteredSubCategoryOptionsEdit, setFilteredSubCategoryOptionsEdit] =
    useState([]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => valueCat?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptions(subcategoryNames);
  }, [valueCat]);

  useEffect(() => {
    const filteredCategoryOptions = categoryOptions
      ?.filter((u) => categoryValueCateEdit?.includes(u.categoryname))
      .map((u) => ({
        ...u,
        label: u.subcategoryname,
        value: u.subcategoryname,
      }));
    let subcategoryNames = filteredCategoryOptions.flatMap((obj) =>
      obj.subcategoryname.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }))
    );
    setFilteredSubCategoryOptionsEdit(subcategoryNames);
  }, [categoryValueCateEdit]);

  //sub sub category multiselect

  useEffect(() => {
    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);
    const filteredCategoryOptions = subSubCategoryOptions
      ?.filter(
        (u) =>
          u.categoryname.some((data) => catopt.includes(data)) &&
          u.subcategoryname.some((data) => subcatopt.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptions(filteredCategoryOptions);
  }, [valueCat, valueSubCat]);

  useEffect(() => {
    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    const filteredCategoryOptions = subSubCategoryOptions
      ?.filter(
        (u) =>
          u.categoryname.some((data) => catopt.includes(data)) &&
          u.subcategoryname.some((data) => subcatopt.includes(data))
      )
      .map((u) => ({
        ...u,
        label: u.subsubname,
        value: u.subsubname,
      }));

    setFilteredSubSubCategoryOptionsEdit(filteredCategoryOptions);
  }, [categoryValueCateEdit, subCategoryValueCateEdit]);

  const [filteredSubSubCategoryOptions, setFilteredSubSubCategoryOptions] =
    useState([]);
  const [
    filteredSubSubCategoryOptionsEdit,
    setFilteredSubSubCategoryOptionsEdit,
  ] = useState([]);

  const [selectedOptionsSubSubCat, setSelectedOptionsSubSubCat] = useState([]);
  let [valueSubSubCat, setValueSubSubCat] = useState([]);
  const [
    selectedSubSubCategoryOptionsCateEdit,
    setSelectedSubSubCategoryOptionsCateEdit,
  ] = useState([]);
  const [subSubCategoryValueCateEdit, setSubSubCategoryValueCateEdit] =
    useState("");

  const handleSubSubCategoryChange = (options) => {
    setValueSubSubCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSubSubCat(options);
    setReasonmaster({
      ...reasonmaster,
      typereason: "Please Select Type",
      reasons: "Please Select Reason",
    });
  };

  const customValueRendererSubSubCat = (valueSubSubCat, _categoryname) => {
    return valueSubSubCat?.length
      ? valueSubSubCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const handleSubSubCategoryChangeEdit = (options) => {
    setSubSubCategoryValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubSubCategoryOptionsCateEdit(options);
    setReasonmasterEdit({
      ...reasonmasterEdit,
      typereason: "Please Select Type",
    });
  };
  const customValueRendererSubSubCategoryEdit = (
    subSubCategoryValueCateEdit,
    _employeename
  ) => {
    return subSubCategoryValueCateEdit?.length
      ? subSubCategoryValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Category";
  };

  const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);
  //get all Sub vendormasters.
  const fetchSubsubcomponent = async () => {
 setPageName(!pageName);
try {
      let res_vendor = await axios.get(SERVICE.SUBSUBCOMPONENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubSubCategoryOptions(res_vendor?.data?.subsubcomponents);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const fetchCategoryTicket = async () => {
 setPageName(!pageName);
try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.ticketcategory.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategorys(categoryall);
      setCategorysEdit(categoryall);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const fetchCategoryBased = async () => {
 setPageName(!pageName);
try {
      let res_category = await axios.get(SERVICE.CATEGORYTICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOptions(res_category.data.ticketcategory);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const [typeOptions, setTypeOptions] = useState([]);

  const fetchTypemaster = async () => {
 setPageName(!pageName);
try {
      let res_type = await axios.get(SERVICE.TYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTypeOptions(res_type?.data?.typemasters);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //add function
  const sendRequest = async () => {
    setIsBtn(true)
 setPageName(!pageName);
try {
      let subprojectscreate = await axios.post(
        SERVICE.RESOLVERREASONMASTER_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categoryreason: [...valueCat],
          subcategoryreason: [...valueSubCat],
          subsubcategoryreason: [...valueSubSubCat],
          namereason: String(reasonmaster?.namereason),
          typereason: String(reasonmaster?.typereason),
          reasons: String(reasonmaster?.reasons),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchReasonmaster();
      setReasonmaster({
        ...reasonmaster,
        namereason: "",
        reasons: "Please Select Reason",
      });
      setPopupContent('Added Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
      setSearchQuery("")
      setIsBtn(false)
    } catch (err) {setIsBtn(false);handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubCat.map((item) => item.value);
    let subSubcatopt = selectedOptionsSubSubCat.map((item) => item.value);
    const isNameMatch = reasonmastersList.some(
      (item) =>
        item.categoryreason.some((data) => catopt.includes(data)) &&
        item.subcategoryreason.some((data) => subcatopt.includes(data)) &&
        (subSubcatopt.length === 0 ||
          item.subsubcategoryreason.some((data) =>
            subSubcatopt.includes(data)
          )) &&
        item.typereason === String(reasonmaster?.typereason) &&
        item.reasons === String(reasonmaster?.reasons) &&
        item?.namereason.toLowerCase() ===
        String(reasonmaster?.namereason.toLowerCase())
    );

    if (valueCat?.length == 0) {
      setPopupContentMalert('Please Select Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueSubCat?.length == 0) {
      setPopupContentMalert('Please Select Sub Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filteredSubSubCategoryOptions?.length != 0 &&
      valueSubSubCat?.length == 0
    ) {
      setPopupContentMalert('Please Select Sub Sub Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (reasonmaster.typereason === "Please Select Type") {
      setPopupContentMalert('Please Select Type');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (reasonmaster.reasons === "Please Select Reason") {
      setPopupContentMalert('Please Select Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      
      
    } else if (reasonmaster?.namereason === "") {
      setPopupContentMalert('Please Enter Name');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Resolver Reason Master already exist!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    // setUnder("Choose Under");
    // setNature("Choose Nature Group");
    setReasonmaster({
      categoryreason: "Please Select Category",
      subcategoryreason: "Please Select Subcategory",
      typereason: "Please Select Type",
      namereason: "",
      reasons: "Please Select Reason",
    });
    setValueCat([]);
    setSelectedOptionsCat([]);
    setValueSubCat([]);
    setSelectedOptionsSubCat([]);
    setValueSubSubCat([]);
    setSelectedOptionsSubSubCat([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
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

  //get single row to edit....
  const getCode = async (e, name) => {
 setPageName(!pageName);
try {
      let res = await axios.get(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmasterEdit(res?.data?.sreasonmaster);
      setOvProj(res?.data?.sreasonmaster?.namereason);
      getOverallEditSection(res?.data?.sreasonmaster?.namereason);
      // setTypemasterEdit(res?.data?.sreasonmaster.typereason);
      setCategoryValueCateEdit(res?.data?.sreasonmaster?.categoryreason);
      setSelectedCategoryOptionsCateEdit([
        ...res?.data?.sreasonmaster?.categoryreason.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSubCategoryValueCateEdit(res?.data?.sreasonmaster?.subcategoryreason);
      setSelectedSubCategoryOptionsCateEdit([
        ...res?.data?.sreasonmaster?.subcategoryreason.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setSubSubCategoryValueCateEdit(
        res?.data?.sreasonmaster?.subsubcategoryreason
      );
      setSelectedSubSubCategoryOptionsCateEdit([
        ...res?.data?.sreasonmaster?.subsubcategoryreason.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
 setPageName(!pageName);
try {
      let res = await axios.post(SERVICE.OVERALL_RESOLVER_REASONMASTER_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);

      setGetOverallCount(`The ${e} is linked in 
       ${res?.data?.raiseticket?.length > 0 ? "Raise Ticket Master," : ""}
        whether you want to do changes ..??`);
      } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
 setPageName(!pageName);
try {
      let res = await axios.post(SERVICE.OVERALL_RESOLVER_REASONMASTER_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res.data.raiseticket);
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const sendEditRequestOverall = async (raiseticket) => {
 setPageName(!pageName);
try {
      if (raiseticket.length > 0) {
        let answ = raiseticket.map((d, i) => {
          let res = axios.put(`${SERVICE.RAISETICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            resolverreason: reasonmasterEdit?.namereason,
          });
        });
      }
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  // get single row to view....
  const getviewCode = async (e) => {
 setPageName(!pageName);
try {
      let res = await axios.get(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmasterEdit(res?.data?.sreasonmaster);  
      handleClickOpenview();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };
  // get single row to view....
  const getinfoCode = async (e) => {
 setPageName(!pageName);
try {
      let res = await axios.get(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmasterEdit(res?.data?.sreasonmaster);
      
                handleClickOpeninfo();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  useEffect(() => {
    fetchCategoryTicket();
    fetchTypemaster();
    fetchCategoryBased();
    fetchSubsubcomponent();
  }, []);

  //Project updateby edit page...
  let updateby = reasonmasterEdit?.updatedby;
  let addedby = reasonmasterEdit?.addedby;

  let subprojectsid = reasonmasterEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
 setPageName(!pageName);
try {
      let res = await axios.put(
        `${SERVICE.RESOLVERREASONMASTER_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categoryreason: [...categoryValueCateEdit],
          subcategoryreason: [...subCategoryValueCateEdit],
          subsubcategoryreason: [...subSubCategoryValueCateEdit],
          namereason: String(reasonmasterEdit?.namereason),
          typereason: String(reasonmasterEdit.typereason),
          reasons: String(reasonmasterEdit.reasons),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await getOverallEditSectionUpdate();fetchReasonmaster();
      handleCloseModEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  const editSubmit = async(e) => {
    e.preventDefault();
    let resdata = await fetchReasonmasterAll();

    let catopt = selectedCategoryOptionsCateEdit.map((item) => item.value);
    let subcatopt = selectedSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );
    let subSubcatopt = selectedSubSubCategoryOptionsCateEdit.map(
      (item) => item.value
    );

    const isNameMatch = resdata.some(
      (item) =>
        item.categoryreason.some((data) => catopt.includes(data)) &&
        item.subcategoryreason.some((data) => subcatopt.includes(data)) &&
        (subSubcatopt.length === 0 ||
          item.subsubcategoryreason.some((data) =>
            subSubcatopt.includes(data)
          )) &&
        item.typereason === String(reasonmasterEdit?.typereason) &&
        item.reasons === String(reasonmasterEdit?.reasons) &&
        item?.namereason.toLowerCase() ===
        String(reasonmasterEdit?.namereason.toLowerCase())
    );

    if (categoryValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Sub Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filteredSubSubCategoryOptionsEdit?.length != 0 &&
      subSubCategoryValueCateEdit?.length == 0
    ) {
      setPopupContentMalert('Please Select Sub Sub Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (reasonmasterEdit.typereason === "Please Select Type") {
      setPopupContentMalert('Please Select Type');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (reasonmasterEdit?.namereason === "") {
      setPopupContentMalert('Please Enter Name');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Resolver Reason Master already exist!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (reasonmasterEdit?.namereason != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchReasonmaster = async () => {
 setPageName(!pageName);
try {
      let res_vendor = await axios.get(SERVICE.RESOLVERREASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setReasonmastercheck(true);

      const answer = res_vendor?.data?.reasonmasters?.length > 0 ?
       res_vendor?.data?.reasonmasters?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        categoryreason: item?.categoryreason
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        subcategoryreason: item.subcategoryreason
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        subsubcategoryreason: item.subsubcategoryreason
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .join("\n"),
        typereason: item.typereason,
        namereason: item?.namereason,
        reasons: item?.reasons,
      })):[];
      setReasonmasters(answer);
      setReasonmastersList(res_vendor?.data?.reasonmasters)
    } catch (err) {setReasonmastercheck(true);handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  //get all Sub vendormasters.
  const fetchReasonmasterAll = async () => {
 setPageName(!pageName);
try {
      let res_vendor = await axios.get(SERVICE.RESOLVERREASONMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_vendor?.data?.reasonmasters.filter(
        (item) => item._id !== reasonmasterEdit._id
      )
    } catch (err) {handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);}
  };

  // pdf.....
  const columns = [
    { title: "Category", field: "categoryreason" },
    { title: "Subcategory", field: "subcategoryreason" },
    { title: "SubSubcategory", field: "subsubcategoryreason" },
    { title: "Typereason", field: "typereason" },
    { title: "Reasons", field: "reasons" },
    { title: "Reason Name", field: "namereason" },
  ];



  // Excel
  const fileName = "Resolver_Reason_Master";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Resolver_Reason_Master",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchReasonmaster();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);
  const [itemsPdf, setItemsPdf] = useState([]);

  const addSerialNumber = (data) => {
        setItems(data);
  
  };

  useEffect(() => {
    addSerialNumber(reasonmasters);
  }, [reasonmasters]);

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


  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
        setColumnVisibility(JSON.parse(savedVisibility));
    }
}, []);

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
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "categoryreason",
      headerName: "Category",
      flex: 0,
      width: 200,
      hide: !columnVisibility?.categoryreason,
      headerClassName: "bold-header",
    },
    {
      field: "subcategoryreason",
      headerName: "Subcategory",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subcategoryreason,
      headerClassName: "bold-header",
    },
    {
      field: "subsubcategoryreason",
      headerName: "Sub Subcategory",
      flex: 0,
      width: 200,
      hide: !columnVisibility.subsubcategoryreason,
      headerClassName: "bold-header",
    },
    {
      field: "typereason",
      headerName: "Type",
      flex: 0,
      width: 200,
      hide: !columnVisibility.typereason,
      headerClassName: "bold-header",
    },
    {
      field: "reasons",
      headerName: "Reasons",
      flex: 0,
      width: 200,
      hide: !columnVisibility.reasons,
      headerClassName: "bold-header",
    },
    {
      field: "namereason",
      headerName: "Reason Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility?.namereason,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eresolverreasonmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dresolverreasonmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vresolverreasonmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iresolverreasonmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
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
      categoryreason: item?.categoryreason,
      subcategoryreason: item.subcategoryreason,
      subsubcategoryreason: item.subsubcategoryreason,
      typereason: item.typereason,
      namereason: item?.namereason,
      reasons: item?.reasons,
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
  return (
    <Box>
      <Headtitle title={"Resolver Reason Master"} />
      <PageHeading
        title="Resolver Reason Master"
        modulename="Tickets"
        submodulename="Master"
        mainpagename="Resolver Reason Master"
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aresolverreasonmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Resolver Reason Master
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={categorys}
                      value={selectedOptionsCat}
                      onChange={(e) => {
                        handleCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererCat}
                      labelledBy="Please Select Category"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={filteredSubCategoryOptions}
                      value={selectedOptionsSubCat}
                      onChange={(e) => {
                        handleSubCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererSubCat}
                      labelledBy="Please Select Sub Category"
                    />
                  </FormControl>
                </Grid>
                {filteredSubSubCategoryOptions?.length != 0 && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Sub Category
                        <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={filteredSubSubCategoryOptions}
                        value={selectedOptionsSubSubCat}
                        onChange={(e) => {
                          handleSubSubCategoryChange(e);
                        }}
                        valueRenderer={customValueRendererSubSubCat}
                        labelledBy="Please Select Sub Sub Category"
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={typeOptions
                        ?.filter((u) => {
                          const catMatch = u.categorytype.some((data) =>
                            selectedOptionsCat
                              .map((item) => item.value)
                              .includes(data)
                          );
                          const subCatMatch = u.subcategorytype.some((data) =>
                            selectedOptionsSubCat
                              .map((item) => item.value)
                              .includes(data)
                          );

                          const subSubCatMatch =
                            selectedOptionsSubSubCat.map((item) => item.value)
                              .length === 0 ||
                            u.subsubcategorytype.some((data) =>
                              selectedOptionsSubSubCat
                                .map((item) => item.value)
                                .includes(data)
                            );

                          return (
                            (catMatch && subCatMatch && subSubCatMatch) ||
                            (catMatch && subCatMatch)
                          );
                        })
                        .map((u) => ({
                          ...u,
                          label: u.nametype,
                          value: u.nametype,
                        }))
                        .filter((obj, index, self) => {
                          // Filter out duplicate values based on the 'value' property
                          return (
                            index ===
                            self.findIndex((item) => item.value === obj.value)
                          );
                        })}
                      placeholder="Please Select Type"
                      value={{
                        label: reasonmaster.typereason,
                        value: reasonmaster.typereason,
                      }}
                      onChange={(e) => {
                        setReasonmaster({
                          ...reasonmaster,
                          typereason: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reasons<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={[
                        { label: "Details Needed", value: "Details Needed" },
                        { label: "Closed", value: "Closed" },
                        { label: "Forwarded", value: "Forwarded" },
                        { label: "Hold", value: "Hold" },
                        { label: "Reject", value: "Reject" },
                        { label: "In-Repair", value: "In-Repair" },
                      ]}
                      placeholder="Please Select Type"
                      value={{
                        label: reasonmaster.reasons,
                        value: reasonmaster.reasons,
                      }}
                      onChange={(e) => {
                        setReasonmaster({
                          ...reasonmaster,
                          reasons: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={reasonmaster?.namereason}
                      placeholder="Please Enter Name"
                      onChange={(e) => {
                        setReasonmaster({
                          ...reasonmaster,
                          namereason: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6} >
                  <Typography>&nbsp;</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBtn}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Submit
                  </Button> &nbsp;
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
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },

            marginTop:"40px"

          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Resolver Reason Master
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={categorysEdit}
                        value={selectedCategoryOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCategoryEdit}
                        labelledBy="Please Select Category"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={filteredSubCategoryOptionsEdit}
                        value={selectedSubCategoryOptionsCateEdit}
                        onChange={handleSubCategoryChangeEdit}
                        valueRenderer={customValueRendererSubCategoryEdit}
                        labelledBy="Please Select Sub Category"
                      />
                    </FormControl>
                  </Grid>
                  {filteredSubSubCategoryOptionsEdit?.length != 0 && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sub Sub Category
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={filteredSubSubCategoryOptionsEdit}
                          value={selectedSubSubCategoryOptionsCateEdit}
                          onChange={(e) => {
                            handleSubSubCategoryChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererSubSubCategoryEdit}
                          labelledBy="Please Select Sub Sub Category"
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={typeOptions
                          ?.filter((u) => {
                            const catMatch = u.categorytype.some((data) =>
                              selectedCategoryOptionsCateEdit
                                .map((item) => item.value)
                                .includes(data)
                            );
                            const subCatMatch = u.subcategorytype.some((data) =>
                              selectedSubCategoryOptionsCateEdit
                                .map((item) => item.value)
                                .includes(data)
                            );

                            // Check if subSubcatopt is not empty before applying the filter
                            const subSubCatMatch =
                              selectedSubSubCategoryOptionsCateEdit.map(
                                (item) => item.value
                              ).length === 0 ||
                              u.subsubcategorytype.some((data) =>
                                selectedSubSubCategoryOptionsCateEdit
                                  .map((item) => item.value)
                                  .includes(data)
                              );

                            return (
                              (catMatch && subCatMatch && subSubCatMatch) ||
                              (catMatch && subCatMatch)
                            );
                          })
                          .map((u) => ({
                            ...u,
                            label: u.nametype,
                            value: u.nametype,
                          }))
                          .filter((obj, index, self) => {
                            // Filter out duplicate values based on the 'value' property
                            return (
                              index ===
                              self.findIndex((item) => item.value === obj.value)
                            );
                          })}
                        placeholder="Please Select Type"
                        value={{
                          label: reasonmasterEdit.typereason,
                          value: reasonmasterEdit.typereason,
                        }}
                        onChange={(e) => {
                          setReasonmasterEdit({
                            ...reasonmasterEdit,
                            typereason: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reasons<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={[
                          { label: "Details Needed", value: "Details Needed" },
                          { label: "Closed", value: "Closed" },
                          { label: "Forwarded", value: "Forwarded" },
                          { label: "Hold", value: "Hold" },
                          { label: "Reject", value: "Reject" },
                          { label: "In-Repair", value: "In-Repair" },
                        ]}
                        placeholder="Please Select Type"
                        value={{
                          label: reasonmasterEdit.reasons,
                          value: reasonmasterEdit.reasons,
                        }}
                        onChange={(e) => {
                          setReasonmasterEdit({
                            ...reasonmasterEdit,
                            reasons: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={reasonmasterEdit?.namereason}
                        placeholder="Please Enter Name"
                        onChange={(e) => {
                          setReasonmasterEdit({
                            ...reasonmasterEdit,
                            namereason: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                {/* <Typography sx={{ color: "red" }}> {editCalOverall}</Typography> */}
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
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lresolverreasonmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Resolver Reason Master List
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
                    <MenuItem value={reasonmasters?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelresolverreasonmaster") && (
                   
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvresolverreasonmaster") && (
                    
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printresolverreasonmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfresolverreasonmaster") && (
                   
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageresolverreasonmaster") && (
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={reasonmasters}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
                />
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
            {isUserRoleCompare?.includes("bdresolverreasonmaster") && (
              <Button
                variant="contained"
                color="error"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!reasonmasterCheck ? (
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
                  // totalDatas={totalProjects}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={items}
                />
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
            <Button onClick={handleCloseMod} sx={buttonStyles.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delReason(Typesid)}
              sx={buttonStyles.buttonsubmit}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Check delete Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog
                open={isCheckOpen}
                onClose={handleCloseCheck}
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
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "80px", color: "orange" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", textAlign: "center" }}
                  >
                    {getOverAllCountDelete}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseCheck}
                    autoFocus
                    variant="contained"
                    color="error"
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>
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
                <TableCell> Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Sub Subcategory</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reasons</TableCell>
                <TableCell>Reason Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row?.categoryreason}
                    </TableCell>
                    <TableCell>
                      {row.subcategoryreason}
                    </TableCell>
                    <TableCell>
                      {row.subsubcategoryreason}
                    </TableCell>
                    <TableCell>{row.typereason}</TableCell>
                    <TableCell>{row.reasons}</TableCell>
                    <TableCell>{row?.namereason}</TableCell>
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
        sx={{marginTop:"40px"}}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Resolver Reason Master
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>
                    {reasonmasterEdit?.categoryreason
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Subcategory</Typography>
                  <Typography>
                    {reasonmasterEdit.subcategoryreason
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Subcategory</Typography>
                  <Typography>
                    {reasonmasterEdit.subsubcategoryreason
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{reasonmasterEdit.typereason}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reasons</Typography>
                  <Typography>{reasonmasterEdit.reasons}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{reasonmasterEdit?.namereason}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={buttonStyles.btncancel}
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
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
             sx={buttonStyles.btncancel}
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

  
      <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        {selectedRowsCount > 0 ?
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
                            :
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

                        }
                    </DialogContent>
                    <DialogActions>
                        {selectedRowsCount > 0 ?
                            <>
                                <Button onClick={handleCloseModcheckbox}  sx={buttonStyles.btncancel}>Cancel</Button>
                                <Button variant="contained" color='error'
                                 sx={buttonStyles.buttonsubmit}
                                    onClick={(e) => delReasoncheckbox(e)}
                                > OK </Button>
                            </>
                            :
                            <Button variant="contained" color='error' onClick={handleCloseModcheckbox}  sx={buttonStyles.buttonsubmit}>Ok</Button>
                        }
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
              sx={buttonStyles.buttonsubmit}
            >
              {" "}
              OK{" "}
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
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button  sx={buttonStyles.buttonsubmit} variant="contained" color="error" onClick={handleCloseerr}>
              ok
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
        itemsTwo={reasonmasters ?? []}
        filename={"Resolver Reason Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Resolver Reason Master Info"
        addedby={addedby}
        updateby={updateby}
      />



    </Box>
  );
}

export default ResolverReasonmaster;