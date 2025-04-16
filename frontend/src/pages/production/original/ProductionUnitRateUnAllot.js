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
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { RotatingLines } from "react-loader-spinner";
import Chip from "@mui/material/Chip";
import ExportData from "../../../components/ExportData";
import PageHeading from "../../../components/PageHeading";
import MessageAlert from "../../../components/MessageAlert.js";
import AlertDialog from "../../../components/Alert.js";
import { handleApiError } from "../../../components/Errorhandling";

function ProductionUnAllot() {
  // Error Popup model
  const [loadingMessage, setLoadingMessage] = useState(false);
  const handleOpenLoadingMessage = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setLoadingMessage(true);
  };
  const handleCloseLoadingMessage = async () => {
    setLoadingMessage(false);
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  let currtime = `${hours}:${minutes}`;
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = async (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);

    setProdUnAllot({
      category: "Choose Subcategory",
      filename: "Choose Category",
    });
  };

  //BULKD DELETE model...
  const [isBulkDelOpen, setIsBulkDelOpen] = useState(false);
  const handleClickOpenBulkDelEdit = () => {
    setIsBulkDelOpen(true);
  };
  const handleClickCloseBulkDelEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsBulkDelOpen(false);
  };
  //BULKD UPDATE model...
  const [isBulkEditOpen, setIsBulkEditOpen] = useState({ open: false, data: [] });
  const handleClickOpenBulkEdit = (data) => {
    setIsBulkEditOpen({ open: true, data: data });
  };
  const handleClickCloseBulkEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsBulkEditOpen({ open: false, data: [] });
  };
  //BULKD UPDATE SECTION model...
  const [isBulkEditOpenSec, setIsBulkEditOpenSec] = useState({ open: false, data: [] });
  const handleClickOpenBulkEditSection = (data) => {
    setIsBulkEditOpenSec({ open: true, data: data });
  };
  const handleClickCloseBulkEditSection = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsBulkEditOpenSec({ open: false, data: [] });
  };

  const [productionFilter, setProductionFilter] = useState([]);

  const [produnallot, setProdUnAllot] = useState({
    category: "Choose Subcategory",
    filename: "Choose Category",
    addedby: "",
    updatedby: "",
  });

  const [selectedProject, setSelectedProject] = useState([]);

  const [searchQueryView, setSearchQueryView] = useState("");
  const [selectedRowsView, setSelectedRowsView] = useState([]);

  const [bulkDletedIdshide, setBulkDletedIdshide] = useState([]);

  const [fileFormat, setFormat] = useState("");
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

  let exportColumnNames = ["Date", "Project", "Category", "SubCategory", "Production", "Mode"];
  let exportRowValues = ["datenew", "projectname", "filename", "category", "productioncount", "mode"];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const fetchAllCategory = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // let vendorall = res_vendor?.data?.categoryprod.map((d) => ({
      //     ...d,
      //     label: d.name,
      //     value: d.name,
      // }));

      // Extracting unique categories using a Set
      const uniqueCategories = Array.from(new Set(res_vendor?.data?.categoryprod.map((d) => d.name)));

      // Formatting categories with label and value properties
      const vendorall = uniqueCategories.map((category) => ({
        label: category,
        value: category,
      }));
      setCategories(vendorall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAllSubCategory = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // let result = res_vendor?.data?.subcategoryprod.filter((d) => d.categoryname === e);

      // let vendorall = res_vendor?.data?.subcategoryprod.map((d) => ({
      //     ...d,
      //     label: d.name,
      //     value: d.name,
      // }));
      // setCategoryOPt(vendorall);

      setCategoryOPt(res_vendor?.data?.subcategoryprod);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAllSubCategory();
  }, [isEditOpen]);

  const handleProjectChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedProject(options);
  };
  const customValueRendererProject = (valueProject, _categoryname) => {
    return valueProject?.length ? valueProject.map(({ label }) => label)?.join(", ") : "Please Select Project";
  };
  const fetchProductionFilter = async () => {
    try {
      setSourcecheck(true);
      let res_vendor = await axios.post(SERVICE.PRODUCTION_UNALLOT_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: selectedProject,
      });

      let res_unitrate = await axios.get(SERVICE.PRODUCTION_UNITRATE_LIMITED_PROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let unitratesdata = res_unitrate.data.unitsrate;

      let res_subcats = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // setSubCategoryOPt(res_vendor?.data?.subcategoryprod);
      let subcates = res_subcats?.data?.subcategoryprod;

      let UpdatedValue = res_vendor.data.mergedData;
      // .map((d) => {
      //     let datecurr = d.mode === "Manual" ? d.dateval : d.dateval?.split(" ")[0];
      //     return {
      //         ...d,
      //         datenew: datecurr,
      //     };
      // });

      const groupedData = UpdatedValue.reduce((acc, curr) => {
        let datenew = curr.dateval.includes("GMT+0530") ? moment(new Date(curr.dateval)).format("YYYY-MM-DD") : curr.mode === "Manual" ? curr.dateval : curr.dateval?.split(" ")[0];
        const [finalfilename] = curr.filename.split(".x");
        let finalcategory = curr.unallotcategory ? curr.unallotcategory : finalfilename;
        let finalsubcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;
        const key = `${finalcategory}-${finalsubcategory}-${datenew}`;

        acc[key] = acc[key] || {
          ...curr,
          productioncount: 0,
          ids: [],
          datenew: datenew,
          category: finalcategory,
          filename: finalcategory,
          subcategory: finalsubcategory,
        }; // Initialize _id as an array

        acc[key].productioncount++;

        acc[key].ids.push({
          _id: curr._id,
          flagcount: curr.flagcount, // Include flagcount
          section: curr.section, // Include section
          category: finalcategory,
          subcategory: finalsubcategory,
          mode: curr.mode,
          project: curr.vendor,
        });
        return acc;
      }, {});

      let mergedDataval = Object.values(groupedData);
      console.log(mergedDataval, "mergedDataval");
      let updateMrate = mergedDataval.map((curr) => {
        const [vendorupdated] = curr.vendor?.split("-");
        // const [filenameupdated] = curr.filename?.split(".x");
        // let filename = curr.unallotcategory ? curr.unallotcategory : filenameupdated;
        // let subcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;

        let findmrate = unitratesdata.filter((data) => data.subcategory === curr.subcategory).find((d) => d.project === vendorupdated && d.category === curr.filename && d.subcategory === curr.subcategory);

        let valuefind = subcates.find((item) => {
          return item.project === vendorupdated && item.categoryname === curr.filename && item.name === curr.subcategory;
        });

        return {
          ...curr,
          mrate: findmrate && findmrate.mrate,
          unitflag: findmrate && findmrate.flagcount,
          filename: curr.filename,
          _id: curr._id,
          category: curr.subcategory,
          btnmode: valuefind ? valuefind.mode : "",
          ids: curr.ids.map((d) => ({ ...d, btnmode: valuefind ? valuefind.mode : "", mrate: findmrate && findmrate.mrate, unitflag: findmrate && findmrate.flagcount })),
        };
      });

      const order = ["SDS_Quickclaim-HFF", "SDS_Quickclaim-TTS", "SDS_Quickclaim-TTSH"];
      console.log(updateMrate, "updateMrate1");
      let sorted = updateMrate.sort((a, b) => {
        const dateA = new Date(a.datenew);
        const dateB = new Date(b.datenew);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // Dates are the same, sort by name according to the order array
        const nameA = order.indexOf(a.project);
        const nameB = order.indexOf(b.project);
        if (nameA !== nameB) return nameA - nameB;

        // Names are the same, sort by category alphabetically
        if (a.filename < b.filename) return -1;
        if (a.filename > b.filename) return 1;

        // Categories are the same, sort by priority alphabetically
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;

        return 0;
      });
      setColumnVisibility(initialColumnVisibility);
      setSelectedRowsids([]);
      setSelectedRows([]);
      setSelectAllChecked(false);

      setBtnallotloader(false);
      setBtnsectionloader(false);
      setUpdatedIdsDisabled([]);
      setUpdatedSectionIdsDisabled([]);
      setUpdatedBulkidsDisabledSec([]);
      setIdsBulkUpdteSec([]);
      setUpdatedBulkidsDisabled([]);
      setAllotid("");
      setIdsBulkUpdte([]);
      // Usage
      setProductionFilter(sorted);
      setPage(1);
      setSourcecheck(false);
    } catch (err) {
      setSourcecheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchProductionFilterUpdate = async () => {
    try {
      let res_vendor = await axios.post(SERVICE.PRODUCTION_UNALLOT_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: selectedProject.length > 0 ? selectedProject : [{ label: "SDS_Quickclaim", value: "SDS_Quickclaim" }],
      });

      let res_unitrate = await axios.get(SERVICE.PRODUCTION_UNITRATE_LIMITED_PROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let unitratesdata = res_unitrate.data.unitsrate;

      let res_subcats = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // setSubCategoryOPt(res_vendor?.data?.subcategoryprod);
      let subcates = res_subcats?.data?.subcategoryprod;

      let UpdatedValue = res_vendor.data.mergedData;
      // .map((d) => {
      //     let datecurr = d.mode === "Manual" ? d.dateval : d.dateval?.split(" ")[0];
      //     return {
      //         ...d,
      //         datenew: datecurr,
      //     };
      // });
      const groupedData = UpdatedValue.reduce((acc, curr) => {
        let datenew = curr.dateval.includes("GMT+0530") ? moment(new Date(curr.dateval)).format("YYYY-MM-DD") : curr.mode === "Manual" ? curr.dateval : curr.dateval?.split(" ")[0];
        const [finalfilename] = curr.filename.split(".x");
        let finalcategory = curr.unallotcategory ? curr.unallotcategory : finalfilename;
        let finalsubcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;
        const key = `${finalcategory}-${finalsubcategory}-${datenew}`;

        acc[key] = acc[key] || {
          ...curr,
          productioncount: 0,
          ids: [],
          datenew: datenew,
          category: finalcategory,
          filename: finalcategory,
          subcategory: finalsubcategory,
        }; // Initialize _id as an array

        acc[key].productioncount++;

        acc[key].ids.push({
          _id: curr._id,
          flagcount: curr.flagcount, // Include flagcount
          section: curr.section, // Include section
          category: finalcategory,
          subcategory: finalsubcategory,
          mode: curr.mode,
          project: curr.vendor,
        });
        return acc;
      }, {});

      let mergedDataval = Object.values(groupedData);
      console.log(mergedDataval, "mergedDataval");
      let updateMrate = mergedDataval.map((curr) => {
        const [vendorupdated] = curr.vendor?.split("-");
        // const [filenameupdated] = curr.filename?.split(".x");
        // let filename = curr.unallotcategory ? curr.unallotcategory : filenameupdated;
        // let subcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;

        let findmrate = unitratesdata.filter((data) => data.subcategory === curr.subcategory).find((d) => d.project === vendorupdated && d.category === curr.filename && d.subcategory === curr.subcategory);

        let valuefind = subcates.find((item) => {
          return item.project === vendorupdated && item.categoryname === curr.filename && item.name === curr.subcategory;
        });

        return {
          ...curr,
          mrate: findmrate && findmrate.mrate,
          unitflag: findmrate && findmrate.flagcount,
          filename: curr.filename,
          _id: curr._id,
          category: curr.subcategory,
          btnmode: valuefind ? valuefind.mode : "",
          ids: curr.ids.map((d) => ({ ...d, btnmode: valuefind ? valuefind.mode : "", mrate: findmrate && findmrate.mrate, unitflag: findmrate && findmrate.flagcount })),
        };
      });

      const order = ["SDS_Quickclaim-HFF", "SDS_Quickclaim-TTS", "SDS_Quickclaim-TTSH"];
      console.log(updateMrate, "updateMrate1");
      let sorted = updateMrate.sort((a, b) => {
        const dateA = new Date(a.datenew);
        const dateB = new Date(b.datenew);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // Dates are the same, sort by name according to the order array
        const nameA = order.indexOf(a.project);
        const nameB = order.indexOf(b.project);
        if (nameA !== nameB) return nameA - nameB;

        // Names are the same, sort by category alphabetically
        if (a.filename < b.filename) return -1;
        if (a.filename > b.filename) return 1;

        // Categories are the same, sort by priority alphabetically
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;

        return 0;
      });
      setSelectedRowsids([]);
      setSelectedRows([]);
      setSelectAllChecked(false);

      setBtnallotloader(false);
      setBtnsectionloader(false);
      setUpdatedIdsDisabled([]);
      setUpdatedSectionIdsDisabled([]);
      setUpdatedBulkidsDisabledSec([]);
      setIdsBulkUpdteSec([]);
      setUpdatedBulkidsDisabled([]);
      setAllotid("");
      setIdsBulkUpdte([]);
      // Usage
      setProductionFilter(sorted);
      setPage(1);
      setSourcecheck(false);
    } catch (err) {
      setSourcecheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchProductionFilterUpdateAllot = async () => {
    try {
      let res_vendor = await axios.post(SERVICE.PRODUCTION_UNALLOT_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        project: selectedProject.length > 0 ? selectedProject : [{ label: "SDS_Quickclaim", value: "SDS_Quickclaim" }],
      });

      let res_unitrate = await axios.get(SERVICE.PRODUCTION_UNITRATE_LIMITED_PROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let unitratesdata = res_unitrate.data.unitsrate;

      let res_subcats = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // setSubCategoryOPt(res_vendor?.data?.subcategoryprod);
      let subcates = res_subcats?.data?.subcategoryprod;

      let UpdatedValue = res_vendor.data.mergedData;
      // .map((d) => {
      //     let datecurr = d.mode === "Manual" ? d.dateval : d.dateval?.split(" ")[0];
      //     return {
      //         ...d,
      //         datenew: datecurr,
      //     };
      // });

      const groupedData = UpdatedValue.reduce((acc, curr) => {
        let datenew = curr.dateval.includes("GMT+0530") ? moment(new Date(curr.dateval)).format("YYYY-MM-DD") : curr.mode === "Manual" ? curr.dateval : curr.dateval?.split(" ")[0];
        const [finalfilename] = curr.filename.split(".x");
        let finalcategory = curr.unallotcategory ? curr.unallotcategory : finalfilename;
        let finalsubcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;
        const key = `${finalcategory}-${finalsubcategory}-${datenew}`;

        acc[key] = acc[key] || {
          ...curr,
          productioncount: 0,
          ids: [],
          datenew: datenew,
          category: finalcategory,
          filename: finalcategory,
          subcategory: finalsubcategory,
        }; // Initialize _id as an array

        acc[key].productioncount++;

        acc[key].ids.push({
          _id: curr._id,
          flagcount: curr.flagcount, // Include flagcount
          section: curr.section, // Include section
          category: finalcategory,
          subcategory: finalsubcategory,
          mode: curr.mode,
          project: curr.vendor,
        });
        return acc;
      }, {});

      let mergedDataval = Object.values(groupedData);
      console.log(mergedDataval, "mergedDataval");
      let updateMrate = mergedDataval.map((curr) => {
        const [vendorupdated] = curr.vendor?.split("-");
        // const [filenameupdated] = curr.filename?.split(".x");
        // let filename = curr.unallotcategory ? curr.unallotcategory : filenameupdated;
        // let subcategory = curr.unallotsubcategory ? curr.unallotsubcategory : curr.category;

        let findmrate = unitratesdata.filter((data) => data.subcategory === curr.subcategory).find((d) => d.project === vendorupdated && d.category === curr.filename && d.subcategory === curr.subcategory);

        let valuefind = subcates.find((item) => {
          return item.project === vendorupdated && item.categoryname === curr.filename && item.name === curr.subcategory;
        });

        return {
          ...curr,
          mrate: findmrate && findmrate.mrate,
          unitflag: findmrate && findmrate.flagcount,
          filename: curr.filename,
          _id: curr._id,
          category: curr.subcategory,
          btnmode: valuefind ? valuefind.mode : "",
          ids: curr.ids.map((d) => ({ ...d, btnmode: valuefind ? valuefind.mode : "", mrate: findmrate && findmrate.mrate, unitflag: findmrate && findmrate.flagcount })),
        };
      });

      const order = ["SDS_Quickclaim-HFF", "SDS_Quickclaim-TTS", "SDS_Quickclaim-TTSH"];
      console.log(updateMrate, "updateMrate1");
      let sorted = updateMrate.sort((a, b) => {
        const dateA = new Date(a.datenew);
        const dateB = new Date(b.datenew);

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // Dates are the same, sort by name according to the order array
        const nameA = order.indexOf(a.project);
        const nameB = order.indexOf(b.project);
        if (nameA !== nameB) return nameA - nameB;

        // Names are the same, sort by category alphabetically
        if (a.filename < b.filename) return -1;
        if (a.filename > b.filename) return 1;

        // Categories are the same, sort by priority alphabetically
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;

        return 0;
      });
      setSelectedRowsids([]);
      setSelectedRows([]);
      setSelectAllChecked(false);

      setBtnallotloader(false);
      setBtnsectionloader(false);
      setUpdatedIdsDisabled([]);
      setUpdatedSectionIdsDisabled([]);
      setUpdatedBulkidsDisabledSec([]);
      setIdsBulkUpdteSec([]);
      setUpdatedBulkidsDisabled([]);
      setAllotid("");
      setIdsBulkUpdte([]);
      // Usage
      setProductionFilter(sorted);
      setPage(1);
      setSourcecheck(false);
    } catch (err) {
      setSourcecheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all project.
  const fetchProjMaster = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projectopt = [
        ...res_project?.data?.projmaster.map((item) => ({
          ...item,
          label: item.name,
          value: item.name,
        })),
      ];
      setSelectedProject(projectopt);
      setProjmasterOpt(projectopt);
    } catch (err) {
      setSourcecheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [btnallotloader, setBtnallotloader] = useState(false);
  const [allotid, setAllotid] = useState("");
  const [btnsectionloader, setBtnsectionloader] = useState(false);
  const [sectionallotid, setSectionAllotid] = useState("");
  const [updatedIdsDisabled, setUpdatedIdsDisabled] = useState([]);
  const [updatedSectionIdsDisabled, setUpdatedSectionIdsDisabled] = useState([]);

  const getAllot = async (filename, category, mode, vendor, ids, unitrate, flagcount, id, mrate, unitflag) => {
    try {
      setAllotid(id);

      if (mrate != "0" && mrate != "" && mrate !== undefined && unitflag !== undefined && unitflag != "0") {
        async function updateDataInBulk(items) {
          const updatePayload = items.map((item) => ({
            _id: item._id,
            mode: item.mode,
            updatedunitrate: Number(item.mrate),
            updatedflag: item.unitflag,
          }));

          try {
            await axios.post(
              SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
              {
                updates: updatePayload,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );
          } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
            setBtnloader(false);
          }
        }

        const validItems = ids.filter((item) => item.mrate !== undefined && item.mrate != "0" && item.mrate != "" && item.unitflag !== undefined && item.unitflag != "0");
        if (validItems.length > 0) {
          updateDataInBulk(validItems)
            .then(() => {
              setPopupContent("Alloted");
              setPopupSeverity("success");
              handleClickOpenPopup();
              setAllotid("");
              setUpdatedIdsDisabled((prev) => [...prev, ...validItems]);
              setBtnloader(false);
            })
            .catch((err) => {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setBtnloader(false);
              handleClickCloseBulkEdit();
            });
        } else {
          setAllotid("");
          setBtnloader(false);

          setPopupContentMalert("Please Update Unit Rate Value");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }

        setAllotid("");
      } else {
        setBtnallotloader(false);
        handleCloseLoadingMessage();
        setAllotid("");

        setPopupContentMalert(mrate == "0" || mrate == undefined ? "Mrate value 0 in unit rate,Please Update unit rate" : "Please Update This Unit Rate Value");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      handleCloseLoadingMessage();
      setBtnallotloader(false);
      setAllotid("");
      setSourcecheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getSection = async (filename, category, mode, vendor, ids, unitrate, flagcount, id, mrate) => {
    try {
      if (ids.every((d) => d.mrate !== undefined && d.mrate != "0" && d.mrate != "") && ids.some((d) => d.section !== undefined)) {
        async function updateDataInBulk(items) {
          const updatePayload = items.map((item) => ({
            _id: item._id,
            mode: item.mode,
            updatedunitrate: Number(item.mrate),
            updatedsection: Number(item.mrate) * Number(item.unitflag) * item.section,
          }));

          try {
            await axios.post(
              SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
              {
                updates: updatePayload,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );
          } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
            setBulkloader(false);
          }
        }

        // Call the function to update data in bulk
        const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

        if (validItems.length > 0) {
          updateDataInBulk(validItems)
            .then(() => {
              setPopupContent(validItems.length === ids.length ? "Section Updated" : "Present unitrate value only updated");
              setPopupSeverity("success");
              handleClickOpenPopup();
              setBulkloader(false);
              setUpdatedSectionIdsDisabled((prev) => [...prev, ...validItems]);
            })
            .catch((err) => {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setBulkloader(false);
            });
        } else {
          setBulkloaderSec(false);
          handleClickCloseBulkEditSection();
        }
        setAllotid("");
      } else {
        setBtnallotloader(false);
        handleCloseLoadingMessage();
        setAllotid("");

        setPopupContentMalert(ids.every((d) => d.section === undefined) ? "Section not Present" : mrate == "0" || mrate == undefined ? "Mrate value 0 in unit rate,Please Update unit rate" : "Please Update This Unit Rate Value");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      handleCloseLoadingMessage();
      setBtnallotloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [viewall, setViewall] = useState([]);

  const initialColumnVisibilityView = {
    serialNumber: true,
    checkbox: true,
    mode: true,
    company: true,
    branch: true,
    dateval: true,
    unit: true,
    team: true,
    project: true,
    productioncount: true,
    vendor: true,
    category: true,
    filename: true,
    unitid: true,
    empcode: true,
    empname: true,
    username: true,
    user: true,
    fromdate: true,
    todate: true,
    section: true,
    flagcount: true,
    points: true,
    worktook: true,
    createdAt: true,
    unitrate: true,
    // mode: true,
    actions: true,
  };

  const [columnVisibilityView, setColumnVisibilityView] = useState(initialColumnVisibilityView);

  const getviewCodeall = async (ids, mode) => {
    try {
      if (mode == "Production") {
        let res = await axios.post(SERVICE.PRODUCTION_UNALLOT_FILTER_VIEW, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: ids.map((item) => item._id),
        });
        setColumnVisibilityView(initialColumnVisibilityView);
        setViewall(res.data.mergedData);
        handleClickOpenview();
      } else {
        let res = await axios.post(SERVICE.PRODUCTION_UNALLOT_FILTER_VIEW_Manual, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: ids.map((item) => item._id),
        });

        let mergedata = res.data.mergedData?.map((item, index) => {
          const fromDate = new Date(item.createdAt);
          const fromDatePlus24Hours = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
          const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);
          const fromDatePlus48Hours = new Date(fromDaten.getTime() + 48 * 60 * 60 * 1000);
          return {
            ...item,
            serialNumber: index + 1,
            dateval: item.fromdate,
            lateentrystatus: fromDate > fromDatePlus48Hours ? "Late Entry" : "On Entry",
            approvalstatus:
              (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved"
                ? ""
                : new Date() <= fromDatePlus24Hours && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)
                  ? "Pending"
                  : new Date() > fromDatePlus24Hours && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)
                    ? "Late Not Approval"
                    : new Date(item.approvaldate) > fromDatePlus24Hours && item.approvaldate
                      ? "Late Approval"
                      : "On Approval",
          };
        });
        setViewall(mergedata);
        handleClickOpenview();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchProjMaster();
    fetchAllCategory();
  }, []);

  const [deleteid, setDeleteid] = useState([]);
  const [editid, setEditid] = useState([]);
  const [modests, setModests] = useState("");

  const getCode = async (filename, category, id, mode) => {
    try {
      setCategories([{ label: filename, value: filename }]);
      setEditid(id);
      setModests(mode);
      // setProdUnAllot({ ...produnallot, filename: filename, category: category })
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //set function to get particular row
  const rowData = async (id, mode) => {
    try {
      setDeleteid(id);
      setModests(mode);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  const [btnloader, setBtnloader] = useState(false);

  const delupload = async () => {
    try {
      setBtnloader(true);

      async function updateDataInBatches(items) {
        const updatePayload = items.map((item) => ({
          _id: item._id,
          mode: item.mode,
        }));

        try {
          await axios.post(
            SERVICE.BULK_DELETE_UNITRATE_UNALLOT,
            {
              updates: updatePayload,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }

      // Call the function to update data in batches
      if (deleteid.length > 0) {
        updateDataInBatches(deleteid)
          .then(async () => {
            setBtnloader(false);
            setBulkDletedIdshide((prev) => [...prev, ...deleteid.map((d) => d._id)]);

            handleClose();

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            fetchProductionFilterUpdate();
          })
          .catch((err) => {
            handleApiError(err, setShowAlert, handleClickOpenerr);
          });
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [btnEditloader, setBtnEditloader] = useState(false);

  const editupload = async () => {
    try {
      setBtnEditloader(true);
      // async function updateDataInBatches(items) {
      //   const chunkSize = 1000; // Define the size of each pagination chunk
      //   const totalChunks = Math.ceil(items.length / chunkSize);

      //   for (let i = 0; i < totalChunks; i++) {
      //     const startIndex = i * chunkSize;
      //     const endIndex = Math.min((i + 1) * chunkSize, items.length);
      //     const chunk = items.slice(startIndex, endIndex);

      //     const updateRequests = chunk.map((item) => {
      //       const endpoint = modests === "Production" ? `${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${item._id}` : `${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${item._id}`;
      //       return axios.put(endpoint, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },

      //         unallotcategory: produnallot.filename,
      //         unallotsubcategory: produnallot.category,
      //       });
      //     });

      //     try {
      //       await Promise.all(updateRequests);
      //     } catch (err) {
      //       // Handle errors for this batch if needed
      //       console.err("Error updating batch:", err);
      //     }
      //   }
      // }
      async function updateDataInBatches(items) {
        const updatePayload = items.map((item) => ({
          _id: item._id,
          mode: item.mode,
          unallotcategory: produnallot.filename,
          unallotsubcategory: produnallot.category,
        }));

        try {
          await axios.post(
            SERVICE.PRODUCTION_ORIGINAL_UNITRATE_BULK_UPDATECATSUBCATEGORY,
            {
              updates: updatePayload,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }
      // Call the function to update data in batches
      if (editid.length > 0) {
        updateDataInBatches(editid)
          .then(async () => {
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            fetchProductionFilterUpdateAllot();
          })
          .catch((err) => {
            handleApiError(err, setShowAlert, handleClickOpenerr);
          });
      }
    } catch (err) {
      setBtnEditloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [projectOpt, setProjmasterOpt] = useState([]);
  const [vendorOpt, setVendormasterOpt] = useState([]);

  const [categoryOpt, setCategoryOPt] = useState([]);
  const [subcategory, setSubCategoryOpt] = useState([]);

  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);

  //employee multiselect dropdown changes
  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options);
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Employee";
  };

  const [selectedOptionsMode, setSelectedOptionsMode] = useState([]);
  let [valueMode, setValueMode] = useState([]);

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
  let [valueCompanyCategory, setValueCategory] = useState([]);

  const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
  let [valueSubCat, setValueSubCat] = useState([]);

  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const [sourceEdit, setSourceEdit] = useState({ sourcename: "" });
  const [sources, setSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSourceedit, setAllSourceedit] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");

  const [searchQueryManageView, setSearchQueryManageView] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production_Unit_Rate_UnAllot.png");
        });
      });
    }
  };

  const gridRefview = useRef(null);
  //image
  const handleCaptureImageView = () => {
    if (gridRefview.current) {
      html2canvas(gridRefview.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production_Unit_Rate_UnAllot.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [pageView, setPageView] = useState(1);
  const [pageSizeview, setPageSizeView] = useState(100);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  // const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  // const [showAlertpop, setShowAlertpop] = useState();
  // const handleClickOpenerrpop = () => {
  //   setIsErrorOpenpop(true);
  // };
  // const handleCloseerrpop = () => {
  //   setIsErrorOpenpop(false);
  // };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorAllotOpen, setIsErrorAllotOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorAllotOpen(true);
    setIsErrorOpen(true);
    // setTimeout(() => {
    //   setIsErrorAllotOpen(false);
    // }, 1000);
  };
  const handleCloseerr = () => {
    setIsErrorAllotOpen(false);
    setIsErrorOpen(false);
  };

  // const handleCloseerrAllot = (e, reason) => {
  //   if (reason && reason === "backdropClick") return;
  //   setIsErrorAllotOpen(false);
  //   // fetchProductionFilterUpdate();
  // };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleClose = () => {
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

  // Manage Columns View
  const [isManageColumnsOpenview, setManageColumnsOpenview] = useState(false);
  const [anchorElView, setAnchorElView] = useState(null);

  const handleOpenManageColumnsView = (event) => {
    setAnchorElView(event.currentTarget);
    setManageColumnsOpenview(true);
  };
  const handleCloseManageColumnsView = () => {
    setManageColumnsOpenview(false);
    setSearchQueryManageView("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openView = Boolean(anchorElView);
  const idView = openView ? "simple-popover" : undefined;

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const getRowClassNameView = (params) => {
    if (selectedRowsView.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    mode: true,
    company: true,
    branch: true,
    dateval: true,
    unit: true,
    team: true,
    project: true,
    projectname: true,
    productioncount: true,
    vendor: true,
    category: true,
    filename: true,
    unitid: true,
    empcode: true,
    empname: true,
    username: true,
    user: true,
    fromdate: true,
    todate: true,
    section: true,
    flagcount: true,
    points: true,
    worktook: true,
    createdAt: true,
    unitrate: true,
    datenew: true,
    // mode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProject.length === 0) {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchProductionFilter();
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (produnallot.filename === "Choose Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (produnallot.category === "Choose Subcategory") {
      setPopupContentMalert("Please Select Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      editupload();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedProject([]);
    setProductionFilter([]);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Project", field: "project" },
    { title: "Date", field: "datenew" },
    { title: "Category", field: "filename" },
    { title: "SubCategory", field: "category" },
    { title: "Production", field: "productioncount" },
    { title: "Mode", field: "mode" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTable,
    });
    doc.save("Zero Unitrate UnAllot.pdf");
  };

  // Excel
  const fileName = "Zero Unitrate UnAllot Upload";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Zero Unitrate UnAllot Upload",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    let filtered = bulkDletedIdshide.length > 0 ? productionFilter.filter((d) => !bulkDletedIdshide.includes(d._id)) : productionFilter;

    const itemsWithSerialNumber = filtered?.map((item, index) => {
      const [vendorname] = item.vendor && item.vendor?.split("-");
      return {
        ...item,
        _id: item._id,
        projectname: vendorname,
        serialNumber: index + 1,
        dateval: item.mode === "Manual" ? moment(item.dateval).format("DD/MM/YYYY") : item.dateval,
        datenew: moment(item.datenew).format("DD/MM/YYYY"),
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [productionFilter, bulkDletedIdshide]);

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
    setPage(1);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

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

  const [selectedRowsids, setSelectedRowsids] = useState([]);

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
              setSelectedRowsids([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
              const allRowAllIndIds = rowDataTable.map((row) => row.ids).flat();
              setSelectedRowsids(allRowAllIndIds);
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
            let updatedSelectedRowsIds;
            if (selectedRows.includes(params.row.id)) {
              let flatselectedrowids = selectedRowsids.flat();
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsIds = flatselectedrowids.filter((selectedId) => !params.row.ids.map((item) => item._id).includes(selectedId._id));
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsIds = [...selectedRowsids, params.row.ids.flat()];
            }

            setSelectedRows(updatedSelectedRows);
            setSelectedRowsids(updatedSelectedRowsIds.flat());

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 320,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => {
        // let valuefind = subcategoryopt.find((item) => {
        //   const filenamelistviewAll = params.row.project && params.row.project?.split("-");
        //   const findproject = filenamelistviewAll && filenamelistviewAll[0];

        //   return item.project == findproject && item.categoryname === params.row.filename && item.name === params.row.category;
        // });
        const isRowLoading = params.row.ids?.includes(allotid);
        const isRowLoadingSection = params.row.ids?.includes(sectionallotid);
        return (
          <Grid container sx={{ display: "flex", justifyContent: "left", alignItems: "center", width: "100%" }}>
            <Grid item md={6} sm={6} lg={6} sx={{ display: "flex", alignItems: "center" }}>
              {params.row.btnmode === "Allot" &&
                (params.row.mrate === undefined || params.row.mrate === "" || params.row.mrate == 0 ? (
                  <Link to={"/production/productionunitrate"} target="_blank">
                    {" "}
                    <Typography sx={{ fontSize: "inherit" }}>Unitrate Not Yet Allot</Typography>
                  </Link>
                ) : (
                  <LoadingButton
                    onClick={() => {
                      getAllot(params.row.filename, params.row.category, params.row.mode, params.row.project, params.row.ids, params.row.unitrate, params.row.flagcount, params.row.id, params.row.mrate, params.row.unitflag);
                    }}
                    loading={isRowLoading}
                    color="primary"
                    sx={{
                      minWidth: "98px",
                      textTransform: updatedIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "capitalize" : "uppercase",
                      border: updatedIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "2px solid #1775ce" : "none",
                    }}
                    loadingPosition="end"
                    disabled={updatedIdsDisabled?.map((item) => item._id).includes(params.row.id)}
                    variant="contained"
                  >
                    {" "}
                    {/* <span>Allot &ensp;</span> */}
                    {updatedIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "Alloted" : "Allot"}
                  </LoadingButton>
                ))}

              {params.row.btnmode === "Section" && (
                <>
                  <LoadingButton
                    onClick={() => {
                      getSection(params.row.filename, params.row.category, params.row.mode, params.row.project, params.row.ids, params.row.unitrate, params.row.flagcount, params.row.id, params.row.mrate, params.row.unitflag);
                    }}
                    loading={isRowLoadingSection}
                    sx={{
                      minWidth: "98px",
                      textTransform: updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "capitalize" : "uppercase",
                      padding: updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "6px 4px" : "6px 7px",
                      border: updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "2px solid #1775ce" : "none",
                      fontSize: updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "11px" : "inherit",
                    }}
                    loadingPosition="end"
                    disabled={updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id)}
                    color="primary"
                    variant="contained"
                  >
                    {" "}
                    {/* <span>Section &ensp;</span> */}
                    {updatedSectionIdsDisabled?.map((item) => item._id).includes(params.row.id) ? "Section updated" : "Section"}
                  </LoadingButton>
                </>
              )}
            </Grid>
            <Grid item md={6} sm={6} lg={6}>
              {isUserRoleCompare?.includes("vzerounitrateunallot") && (
                <Button
                  sx={{ minWidth: "50px", padding: "6px 8px" }}
                  onClick={() => {
                    getviewCodeall(params.row.ids, params.row.mode);
                  }}
                >
                  <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}

              {isUserRoleCompare?.includes("ezerounitrateunallot") && (
                <Button
                  sx={{ minWidth: "50px", padding: "6px 8px" }}
                  onClick={() => {
                    getCode(params.row.filename, params.row.category, params.row.ids, params.row.mode);
                  }}
                >
                  <EditOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
              {isUserRoleCompare?.includes("dzerounitrateunallot") && (
                <Button
                  sx={{ minWidth: "50px", padding: "6px 8px" }}
                  onClick={(e) => {
                    rowData(params.row.ids, params.row.mode);
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}
            </Grid>
          </Grid>
        );
      },
    },
    { field: "datenew", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.datenew, headerClassName: "bold-header" },
    { field: "projectname", headerName: "Project", flex: 0, width: 130, hide: !columnVisibility.projectname, headerClassName: "bold-header" },
    { field: "filename", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.filename, headerClassName: "bold-header" },
    { field: "category", headerName: "Sub Category", flex: 0, width: 350, hide: !columnVisibility.category, headerClassName: "bold-header" },
    { field: "productioncount", headerName: "Production", flex: 0, width: 90, hide: !columnVisibility.productioncount, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibility.mode, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    // const filenamelistviewAll = item.filename && item.filename?.split(".x");
    // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      ids: item.ids,
      mode: item.mode,
      project: item.vendor,
      projectname: item.projectname,
      productioncount: item.productioncount,
      filename: item.filename,
      btnmode: item.btnmode,
      category: item.category,
      dateval: item.dateval,
      datenew: item.datenew,
      unitrate: item.points,
      unitid: item.unitid,
      user: item.user,
      mrate: item.mrate,
      unitflag: item.unitflag,
      flagcount: item.flagcount,
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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  //view table
  const [itemsView, setItemsView] = useState([]);

  const addSerialNumberView = () => {
    const itemsWithSerialNumberView = viewall?.map((item, index) => {
      const fromDate = new Date(item.createdAt);
      const fromDatePlus24Hours = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
      const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);
      const fromDatePlus48Hours = new Date(fromDaten.getTime() + 48 * 60 * 60 * 1000);
      return {
        ...item,
        serialNumber: index + 1,
      };
    });
    setItemsView(itemsWithSerialNumberView);
  };

  useEffect(() => {
    addSerialNumberView();
  }, [viewall]);

  //Datatable
  const handlePageChangeView = (newPage) => {
    setPageView(newPage);
    setSelectedRowsView([]);
  };

  const handlePageSizeChangeview = (event) => {
    setPageSizeView(Number(event.target.value));
    setPageView(1);
  };

  //datatable....
  const handleSearchChangeview = (event) => {
    setSearchQueryView(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsView = searchQueryView.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasView = itemsView?.filter((item) => {
    return searchTermsView.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataView = filteredDatasView.slice((pageView - 1) * pageSizeview, pageView * pageSizeview);

  const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeview);

  const visiblePagesview = Math.min(totalPagesView, 3);

  const firstVisiblePageview = Math.max(1, pageView - 1);
  const lastVisiblePageView = Math.min(firstVisiblePageview + visiblePagesview - 1, totalPagesView);

  const pageNumbersView = [];

  const indexOfLastItemview = pageView * pageSizeview;
  const indexOfFirstItemView = indexOfLastItemview - pageSizeview;

  for (let i = firstVisiblePageview; i <= lastVisiblePageView; i++) {
    pageNumbersView.push(i);
  }

  const columnDataTableview = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      headerClassName: "bold-header",
    },
    { field: "dateval", headerName: "Date", flex: 0, width: 110, headerClassName: "bold-header" },
    { field: "project", headerName: "Project", flex: 0, width: 170, headerClassName: "bold-header" },
    { field: "filename", headerName: "Category", flex: 0, width: 250, headerClassName: "bold-header" },
    { field: "category", headerName: "Sub Category", flex: 0, width: 350, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 100, headerClassName: "bold-header" },

    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 250,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Chip sx={{ height: "25px", borderRadius: "0px" }} color={"warning"} variant="outlined" label={params.row.approvalstatus} />
          &ensp;
          <Chip sx={{ height: "25px", borderRadius: "0px" }} color={"success"} variant="outlined" label={params.row.lateentrystatus} />
        </Grid>
      ),
    },
  ];

  const rowDataTableView = filteredDataView.map((item, index) => {
    // const filenamelistviewAll = item.filename && item.filename?.split(".x");
    // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];
    return {
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      ids: item._id,
      mode: item.mode,
      project: item.vendor,
      filename: item.filename,
      category: item.category,
      dateval: item.mode == "Manual" ? moment(item.fromdate).format("DD/MM/YYYY") : item.dateval,
      unitrate: item.points,
      unitid: item.unitid,
      user: item.user,
      flagcount: item.flagcount,
      approvalstatus: item.approvalstatus,
      lateentrystatus: item.lateentrystatus,
    };
  });

  const rowsWithCheckboxesView = rowDataTableView.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsView.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumnsView = () => {
    const updatedVisibilityView = { ...columnVisibilityView };
    for (const columnKey in updatedVisibilityView) {
      updatedVisibilityView[columnKey] = true;
    }
    setColumnVisibilityView(updatedVisibilityView);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibilityView = localStorage.getItem("columnVisibility");
    if (savedVisibilityView) {
      setColumnVisibilityView(JSON.parse(savedVisibilityView));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityView", JSON.stringify(columnVisibilityView));
  }, [columnVisibilityView]);

  // // Function to filter columns based on search query
  const filteredColumnsView = columnDataTableview.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageView.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityview = (field) => {
    setColumnVisibilityView((prevVisibilityView) => ({
      ...prevVisibilityView,
      [field]: !prevVisibilityView[field],
    }));
  };
  const [bulkDeleteDataids, setBulkDeleteDataids] = useState([]);
  const [unitratesCheck, setUnitratesCheck] = useState([]);
  const [filteredIds, setFilteredIds] = useState([]);
  const [bulkloader, setBulkloader] = useState(false);
  const [bulkloaderSec, setBulkloaderSec] = useState(false);

  // BULK DELETE--------------
  const handleBulkDelete = () => {
    setBulkDeleteDataids(selectedRowsids);
    handleClickOpenBulkDelEdit();
  };

  const BulkDeleteUpdate = async () => {
    try {
      setBulkloader(true);
      // async function updateDataInBatches(items) {
      //   const chunkSize = 1000; // Define the size of each pagination chunk
      //   const totalChunks = Math.ceil(items.length / chunkSize);

      //   for (let i = 0; i < totalChunks; i++) {
      //     const startIndex = i * chunkSize;
      //     const endIndex = Math.min((i + 1) * chunkSize, items.length);
      //     const chunk = items.slice(startIndex, endIndex);

      //     const updateRequests = chunk.map((item) => {
      //       const endpoint = item.mode === "Manual" ? `${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${item._id}` : `${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${item._id}`;
      //       return axios.put(endpoint, {
      //         headers: {
      //           Authorization: `Bearer ${auth.APIToken}`,
      //         },
      //         unallothide: "true",
      //       });
      //     });

      //     try {
      //       await Promise.all(updateRequests);
      //     } catch (err) {
      //       // Handle errors for this batch if needed
      //       console.err("Error updating batch:", err);
      //     }
      //   }
      // }

      async function updateDataInBatches(items) {
        const updatePayload = items.map((item) => ({
          _id: item._id,
          mode: item.mode,
        }));

        try {
          await axios.post(
            SERVICE.BULK_DELETE_UNITRATE_UNALLOT,
            {
              updates: updatePayload,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      }
      // Call the function to update data in batches
      if (bulkDeleteDataids.length > 0) {
        updateDataInBatches(bulkDeleteDataids)
          .then(async () => {
            setBulkloader(false);
            setBulkDletedIdshide((prev) => [...prev, ...bulkDeleteDataids.map((d) => d._id)]);

            handleClickCloseBulkDelEdit();

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            fetchProductionFilterUpdate();
          })
          .catch((err) => {
            handleApiError(err, setShowAlert, handleClickOpenerr);
          });
      }
    } catch (err) {
      setBtnEditloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // //BULK ALLOT------------
  const handleBulkUpdate = async () => {
    try {
      setBulkloader(true);

      let mratezeroval = selectedRowsids.some((item) => item.mrate == undefined && item.btnmode === "Allot");
      let mratezerovaldata = selectedRowsids.filter((item) => item.mrate != "0" && item.mrate != "" && item.mrate !== undefined && item.unitflag !== undefined && item.btnmode === "Allot");

      if (selectedRowsids.length !== mratezerovaldata.length && mratezerovaldata.length > 0) {
        setBulkloader(false);
        handleCloseLoadingMessage();

        setFilteredIds(mratezerovaldata);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "90px", color: "orange" }} />
            <p style={{ fontSize: "18px", fontWeight: 900 }}>Some Mrate value 0 in UnitRate,</p>

            <Typography sx={{ fontSize: "16px", fontWeight: 500, marginTop: "5px" }}>{"Do you want to update others?.."}</Typography>
          </>
        );
        handleClickOpenBulkEdit(mratezerovaldata);
      } else if (selectedRowsids.length === mratezerovaldata.length && mratezerovaldata.length > 0) {
        setBulkloader(true);
        setFilteredIds(mratezerovaldata);
        BulkUpdate(mratezerovaldata);
      } else {
        setBulkloader(false);
        setSelectedRows([]);
        setSelectAllChecked(false);
        setSelectedRowsids([]);

        setPopupContentMalert("Mrate value 0 in UnitRate, Please Update UnitRate");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setBtnEditloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [updatedBulkidsDisabled, setUpdatedBulkidsDisabled] = useState([]);
  const [idsBulkUpdte, setIdsBulkUpdte] = useState([]);

  const BulkUpdate = async (data) => {
    try {
      setBulkloader(true);

      async function updateDataInBulk(items) {
        //  const endpoint = `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG}`; // Adjust the endpoint to your bulk update endpoint
        // const endpoint = item.mode === "Production" ? `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}` : `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}`;

        const updatePayload = items.map((item) => ({
          _id: item._id,
          mode: item.mode,
          updatedunitrate: Number(item.mrate),
          updatedflag: item.unitflag,
        }));

        try {
          await axios.post(
            SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
            {
              updates: updatePayload,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
          setBulkloader(false);
          // // handleCloseerrAllot
          handleClickCloseBulkEdit();
          setSelectAllChecked(false);
          setSelectedRowsids([]);
          setSelectedRows([]);
          handleCloseLoadingMessage();
        }
      }

      // Call the function to update data in bulk
      const validItems = data.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

      if (validItems.length > 0) {
        updateDataInBulk(validItems)
          .then(() => {
            setPopupContentMalert(validItems.length === data.length ? "Alloted" : "Present unitrate value only updated");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            setUpdatedIdsDisabled((prev) => [...prev, ...validItems]);
            setBulkloader(false);
            handleClickCloseBulkEdit();
            setSelectAllChecked(false);
            setSelectedRowsids([]);
            setSelectedRows([]);
            handleCloseLoadingMessage();
          })
          .catch((err) => {
            handleApiError(err, setShowAlert, handleClickOpenerr);
            setBulkloader(false);
            // handleCloseerrAllot
            handleClickCloseBulkEdit();
            setSelectAllChecked(false);
            setSelectedRowsids([]);
            setSelectedRows([]);
            handleCloseLoadingMessage();
          });
      } else {
        setBulkloader(false);
        // handleCloseerrAllot
        handleClickCloseBulkEdit();
        setSelectAllChecked(false);
        setSelectedRowsids([]);
        setSelectedRows([]);
        handleCloseLoadingMessage();
      }
    } catch (err) {
      setBulkloader(false);
      handleClickCloseBulkEdit();
      setSelectAllChecked(false);
      setSelectedRowsids([]);
      setSelectedRows([]);
      handleCloseLoadingMessage();
      setBtnEditloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // const BulkUpdateAll = async (data) => {
  //   try {
  //     setBulkloader(true);

  //     async function updateDataInBulk(items) {
  //       //  const endpoint = `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG}`; // Adjust the endpoint to your bulk update endpoint
  //       // const endpoint = item.mode === "Production" ? `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}` : `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}`;

  //       const updatePayload = items.map((item) => ({
  //         _id: item._id,
  //         mode: item.mode,
  //         updatedunitrate: Number(item.mrate),
  //         updatedflag: item.unitflag,
  //       }));

  //       try {
  //         await axios.post(
  //           SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
  //           {
  //             updates: updatePayload,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${auth.APIToken}`,
  //             },
  //           }
  //         );
  //       } catch (err) {
  //         handleApiError(err, setShowAlert, handleClickOpenerr);
  //         setBulkloader(false);
  //         // handleCloseerrAllot
  //         handleClickCloseBulkEdit();
  //         setSelectAllChecked(false);
  //         setSelectedRowsids([]);
  //         setSelectedRows([]);
  //         handleCloseLoadingMessage();
  //       }
  //     }

  //     // Call the function to update data in bulk
  //     const validItems = data.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

  //     if (validItems.length > 0) {
  //       updateDataInBulk(validItems)
  //         .then(() => {
  //           setPopupContentMalert(validItems.length === data.length ? "Alloted" : "Present unitrate value only updated");
  //           setPopupSeverityMalert("info");
  //           handleClickOpenPopupMalert();
  //           setUpdatedIdsDisabled((prev) => [...prev, ...validItems]);
  //           setBulkloader(false);
  //           // handleCloseerrAllot
  //           handleClickCloseBulkEdit();
  //           setSelectAllChecked(false);
  //           setSelectedRowsids([]);
  //           setSelectedRows([]);
  //           handleCloseLoadingMessage();
  //         })
  //         .catch((err) => {
  //           handleApiError(err, setShowAlert, handleClickOpenerr);
  //           setBulkloader(false);
  //           // handleCloseerrAllot
  //           handleClickCloseBulkEdit();
  //           setSelectAllChecked(false);
  //           setSelectedRowsids([]);
  //           setSelectedRows([]);
  //           handleCloseLoadingMessage();
  //         });
  //     } else {
  //       setBulkloader(false);
  //       // handleCloseerrAllot
  //       handleClickCloseBulkEdit();
  //       setSelectAllChecked(false);
  //       setSelectedRowsids([]);
  //       setSelectedRows([]);
  //       handleCloseLoadingMessage();
  //     }
  //   } catch (err) {
  //     setBulkloader(false);
  //     // handleCloseerrAllot
  //     handleClickCloseBulkEdit();
  //     setSelectAllChecked(false);
  //     setSelectedRowsids([]);
  //     setSelectedRows([]);
  //     handleCloseLoadingMessage();
  //     handleCloseLoadingMessage();
  //     setBtnEditloader(false);
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  const [updatedBulkidsDisabledSec, setUpdatedBulkidsDisabledSec] = useState([]);
  const [idsBulkUpdteSec, setIdsBulkUpdteSec] = useState([]);

  // //BULK ALLOT------------
  const handleBulkSection = async () => {
    try {
      setBulkloaderSec(true);

      let mratezeroval = selectedRowsids.some((item) => item.mrate == undefined && item.btnmode === "Section");
      let mratezerovaldata = selectedRowsids.filter((item) => item.mrate != "0" && item.mrate != "" && item.btnmode === "Section" && item.section != undefined);
      let findmratezerovaldata = selectedRowsids.filter((item) => item.btnmode === "Section").every((d) => d.section === undefined);

      if (findmratezerovaldata) {
        setBulkloaderSec(false);
        setSelectedRows([]);
        setSelectAllChecked(false);
        setSelectedRowsids([]);

        setPopupContentMalert("Section not present");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        if (mratezeroval && mratezerovaldata.length > 0) {
          setBulkloaderSec(false);
          setFilteredIds(mratezerovaldata);
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "90px", color: "orange" }} />
              <p style={{ fontSize: "18px", fontWeight: 900 }}>Some Mrate value 0 in UnitRate,</p>
              <Typography sx={{ fontSize: "16px", fontWeight: 500, marginTop: "5px" }}>{"Do you want to update others?.."}</Typography>
            </>
          );
          handleClickOpenBulkEditSection(mratezerovaldata);
        } else if (!mratezeroval && mratezerovaldata.length > 0) {
          setFilteredIds(mratezerovaldata);

          BulkUpdateSection(mratezerovaldata);
        } else {
          setBulkloaderSec(false);
          setSelectedRows([]);
          setSelectAllChecked(false);
          setSelectedRowsids([]);

          setPopupContentMalert("Mrate value 0 in UnitRate, Please Update UnitRate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      }
    } catch (err) {
      setBtnEditloader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const BulkUpdateSection = async (data) => {
    try {
      setBulkloaderSec(true);

      async function updateDataInBulk(items) {
        //  const endpoint = `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG}`; // Adjust the endpoint to your bulk update endpoint
        // const endpoint = item.mode === "Production" ? `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}` : `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}`;

        const updatePayload = items.map((item) => ({
          _id: item._id,
          mode: item.mode,
          updatedunitrate: Number(item.mrate),
          updatedsection: Number(item.mrate) * Number(item.unitflag) * item.section,
        }));

        try {
          await axios.post(
            SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
            {
              updates: updatePayload,
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
          setBulkloaderSec(false);
        }
      }

      // Call the function to update data in bulk
      const validItems = data.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

      if (validItems.length > 0) {
        updateDataInBulk(validItems)
          .then(() => {
            setPopupContent(validItems.length === data.length ? "Section Updated" : "Present unitrate value only updated");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBulkloaderSec(false);
            setUpdatedSectionIdsDisabled((prev) => [...prev, ...validItems]);
          })
          .catch((err) => {
            handleApiError(err, setShowAlert, handleClickOpenerr);
            setBulkloaderSec(false);
          });
      } else {
        setBulkloaderSec(false);
        handleClickCloseBulkEditSection();
      }
    } catch (err) {
      setBulkloaderSec(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // const BulkUpdateSectionAll = async (data) => {
  //   try {
  //     setBulkloaderSec(true);

  //     async function updateDataInBulk(items) {
  //       //  const endpoint = `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG}`; // Adjust the endpoint to your bulk update endpoint
  //       // const endpoint = item.mode === "Production" ? `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}` : `${SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY}`;

  //       const updatePayload = items.map((item) => ({
  //         _id: item._id,
  //         mode: item.mode,
  //         updatedunitrate: Number(item.mrate),
  //         updatedsection: Number(item.mrate) * Number(item.unitflag) * item.section,
  //       }));

  //       try {
  //         await axios.post(
  //           SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
  //           {
  //             updates: updatePayload,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${auth.APIToken}`,
  //             },
  //           }
  //         );
  //       } catch (err) {
  //         handleApiError(err, setShowAlert, handleClickOpenerr);
  //         setBulkloaderSec(false);
  //       }
  //     }

  //     // Call the function to update data in bulk
  //     const validItems = data.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

  //     if (validItems.length > 0) {
  //       updateDataInBulk(validItems)
  //         .then(() => {
  //           setPopupContent(validItems.length === data.length ? "Alloted" : "Present unitrate value only updated");
  //           setPopupSeverity("success");
  //           handleClickOpenPopup();
  //           setBulkloaderSec(false);
  //           setUpdatedSectionIdsDisabled((prev) => [...prev, ...validItems]);
  //         })
  //         .catch((err) => {
  //           handleApiError(err, setShowAlert, handleClickOpenerr);
  //           setBulkloaderSec(false);
  //         });
  //     } else {
  //       setBulkloaderSec(false);
  //       handleClickCloseBulkEditSection();
  //
  //     }
  //   } catch (err) {
  //     setBulkloaderSec(false);
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };

  return (
    <Box>
      <Headtitle title={"Zero Unit Rate UnAllot"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Zero Unit Rate UnAllot" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Zero Unit Rate UnAllot" subsubpagename="" />
      {isUserRoleCompare?.includes("azerounitrateunallot") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography>
                    Project
                    <b style={{ color: "red" }}>*</b>
                  </Typography>

                  <MultiSelect
                    options={projectOpt}
                    value={selectedProject}
                    onChange={(e) => {
                      handleProjectChange(e);
                    }}
                    valueRenderer={customValueRendererProject}
                    labelledBy="Please Select Project"
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={6} marginTop={3}>
                <Grid sx={{ display: "flex", justifyContent: "left", gap: "15px" }}>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lzerounitrateunallot") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/* <Grid item xs={8}> */}
            <Typography sx={userStyle.importheadtext}>Zero Unitrate UnAllot Upload</Typography>
            {/* </Grid> */}
            <Grid container style={userStyle.dataTablestyle}>
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
                    <MenuItem value={productionFilter?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelzerounitrateunallot") && (
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
                  {isUserRoleCompare?.includes("csvzerounitrateunallot") && (
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
                  {isUserRoleCompare?.includes("printzerounitrateunallot") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfzerounitrateunallot") && (
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
                  {isUserRoleCompare?.includes("imagezerounitrateunallot") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <Button color="error" variant="contained" onClick={(e) => handleBulkDelete(e)}>
              Bulk Delete
            </Button>
            &ensp;
            {/* <Button color="warning" variant="contained" onClick={handleBulkUpdate}>
              Bulk Allot
            </Button> */}
            <LoadingButton
              onClick={(e) => handleBulkUpdate(e)}
              loading={bulkloader}
              // sx={{  border:updatedBulkidsDisabled.includes(params.row.id) ? "2px solid #1775ce" : "none"}}
              color="primary"
              loadingPosition="end"
              variant="contained"
            >
              {" "}
              Bulk Allot
            </LoadingButton>
            &ensp;
            <LoadingButton
              onClick={(e) => handleBulkSection(e)}
              loading={bulkloaderSec}
              // sx={{  border:updatedBulkidsDisabled.includes(params.row.id) ? "2px solid #1775ce" : "none"}}
              color="primary"
              loadingPosition="end"
              variant="contained"
            >
              {" "}
              Bulk Section
            </LoadingButton>
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
            {sourceCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
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
        {/* print layout */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Production</TableCell>
                <TableCell>Mode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.datenew}</TableCell>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.productioncount}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg">
        <Box sx={{ padding: "20px" }}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.HeaderText}>View Zero Unitrate UnAllot Upload</Typography>
          </Grid>

          <br />

          <Grid container style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  size="small"
                  value={pageSizeview}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeview}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={viewall?.length}>All</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}></Grid>
            <Grid item md={2} xs={6} sm={6}>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryView} onChange={handleSearchChangeview} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />

          {sourceCheck ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {/* <CircularProgress color="inherit" />  */}
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  rows={rowsWithCheckboxesView}
                  columns={columnDataTableview}
                  selectionModel={selectedRowsView}
                  autoHeight={true}
                  ref={gridRefview}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassNameView}
                  disableRowSelectionOnClick
                />
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredDataView.length > 0 ? (pageView - 1) * pageSizeview + 1 : 0} to {Math.min(pageView * pageSizeview, filteredDatasView.length)} of {filteredDatasView.length} entries
                </Box>
                <Box>
                  <Button onClick={() => setPageView(1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button onClick={() => handlePageChangeView(pageView - 1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbersView?.map((pageNumberView) => (
                    <Button key={pageNumberView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeView(pageNumberView)} className={pageView === pageNumberView ? "active" : ""} disabled={pageView === pageNumberView}>
                      {pageNumberView}
                    </Button>
                  ))}
                  {lastVisiblePageView < totalPagesView && <span>...</span>}
                  <Button onClick={() => handlePageChangeView(pageView + 1)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button onClick={() => setPageView(totalPagesView)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>
          )}
          <br />
          <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
            <Button variant="contained" color="primary" onClick={handleCloseview}>
              {" "}
              Back{" "}
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <LoadingButton onClick={delupload} loading={btnloader} color="error" loadingPosition="end" variant="contained">
              {" "}
              <span>OK &ensp;</span>
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>

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
          }}
        >
          <Box sx={{ padding: "10px 20px" }}>
            <>
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>Edit Production Original Upload</Typography>
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={categories}
                      styles={colourStyles}
                      value={{ label: produnallot.filename, value: produnallot.filename }}
                      onChange={(e) => {
                        setProdUnAllot({ ...produnallot, filename: e.value, category: "Choose Subcategory" });

                        setSubcategories([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={Array.from(new Set(categoryOpt.filter((d) => d.categoryname === produnallot.filename).map((d) => d.name))).map((subcategory) => ({
                        label: subcategory,
                        value: subcategory,
                      }))}
                      styles={colourStyles}
                      value={{ label: produnallot.category, value: produnallot.category }}
                      onChange={(e) => {
                        setProdUnAllot({ ...produnallot, category: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <br />
              </Grid>
              <br />
              <br />

              <br />
              <br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <LoadingButton onClick={handleEditSubmit} loading={btnEditloader} loadingPosition="end" variant="contained">
                    {" "}
                    <span>Update &ensp;</span>
                  </LoadingButton>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </>
          </Box>
        </Dialog>
      </Box>

      <Dialog
        open={loadingMessage}
        onClose={(event, reason) => {
          // Only close the dialog if the reason is not a backdrop click
          if (reason !== "backdropClick") {
            handleCloseLoadingMessage();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={"sm"}
        fullWidth={true}
      >
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <RotatingLines visible={true} height="96" width="96" color="grey" strokeWidth="5" animationDuration="0.75" ariaLabel="rotating-lines-loading" wrapperStyle={{}} wrapperClass="" />
        </DialogContent>
        {/* <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseLoadingMessage}>
            ok
          </Button>
        </DialogActions> */}
      </Dialog>

      {/* ALERT DIALOG */}
      {/* <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}

      {/* <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
        
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerrpop}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}

      {/* <Box>
        <Dialog open={isErrorAllotOpen} onClose={handleCloseerrAllot} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
       
            <Typography variant="h6">{showAlert}</Typography>
            <br />
            <br />
          </DialogContent>
  
        </Dialog>
      </Box> */}

      {/* ALERT DIALOG */}
      <Dialog open={isBulkDelOpen} onClose={handleClickCloseBulkDelEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseBulkDelEdit} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <LoadingButton onClick={BulkDeleteUpdate} loading={bulkloader} color="error" loadingPosition="end" variant="contained">
            {" "}
            <span>OK &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Dialog open={isBulkEditOpen.open} onClose={handleClickCloseBulkEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <Typography sx={{ textAlign: "center" }}>{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseBulkEdit} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <LoadingButton onClick={(e) => BulkUpdate(isBulkEditOpen.data)} loading={bulkloader} color="error" loadingPosition="end" variant="contained">
            {" "}
            <span>Yes &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Dialog open={isBulkEditOpenSec.open} onClose={handleClickCloseBulkEditSection} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <Typography sx={{ textAlign: "center" }}>{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseBulkEditSection} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <LoadingButton onClick={(e) => BulkUpdateSection(isBulkEditOpenSec.data)} loading={bulkloaderSec} color="error" loadingPosition="end" variant="contained">
            {" "}
            <span>Yes &ensp;</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
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
        itemsTwo={items ?? []}
        filename={"Zero Unitrate UnAllot"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default ProductionUnAllot;