import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { ThreeDots } from "react-loader-spinner";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem,
  ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function AssetTypeMaster() {
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [loader, setLoader] = useState(false);
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

  let exportColumnNames = ["Asset type"];
  let exportRowValues = ["name"];


  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };


  const [selectedRowsTypeMaster, setSelectedRowsTypeMaster] = useState([]);
  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({
    assettypegrouping: [],
    assetmaterial: [],
    assetdetail: [],
    stockmanage: [],
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

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [assetTypeMaster, setAssetTypeMaster] = useState({ name: "" });
  const [assetTypeMasterEdit, setAssetTypeMasterEdit] = useState({ name: "" });
  const [assetTypeMasterArray, setAssetTypeMasterArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteAssetType, setDeleteAssetType] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAssetTypeMasterEdit, setAllAssetTypeMasterEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
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
  // page refersh reload code
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
  // const handleClickOpenalert = () => {
  //   setIsHandleChange(true);
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     setIsDeleteOpencheckbox(true);
  //   }
  // };


  const handleClickOpenalert = async () => {
    try {


      let value = [...new Set(selectedRowsTypeMaster.flat())]
      // console.log(value, "value")
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        const [restype, resassetmaterial, resassetdetail, resstockmanage, resstock, resmanual] = await Promise.all([

          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadtypegrouping: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadassetmaterial: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadassetdetail: value,
          }),


          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadstockmanage: value,

          }),
          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadstock: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            accountheadmanualproduct: value
          })
        ])

        setChecktypegrouping(restype?.data?.assettypegrouping)
        setCheckassetmaterial(resassetmaterial?.data?.assetmaterial)
        setCheckAssetdetail(resassetdetail?.data?.assetdetail)
        setCheckStockManage(resstockmanage?.data?.stockmanage)
        setCheckStock(resstock?.data?.stock)
        setCheckManualStock(resmanual?.data?.manualstockentry)

        let assettypegrouping = restype?.data?.assettypegrouping.map(t => t.name).flat();
        let assetmaterial = resassetmaterial?.data?.assetmaterial.map(t => t.assettype).flat();
        let assetdetail = resassetdetail?.data?.assetdetail.map(t => t.assettype).flat();

        let stockmanage = resstockmanage?.data?.stockmanage.map(t => t.assettype).flat();
        let stock = resstock?.data?.stock.map(t => t.assettype).flat();
        let manualstockentry = resmanual?.data?.manualstockentry.map(t => t.assettype).flat();

        if (
          (restype?.data?.assettypegrouping).length > 0 ||
          (resassetmaterial?.data?.assetmaterial).length > 0 ||
          (resassetdetail?.data?.assetdetail).length > 0 ||
          (resstockmanage?.data?.stockmanage).length > 0 ||
          (resstock?.data?.stock).length > 0 ||
          (resmanual?.data?.manualstockentry).length > 0
        ) {
          handleClickOpenCheckbulk();
          // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
          setOveraldeletecheck({
            ...overalldeletecheck,
            assettypegrouping: [... new Set(assettypegrouping)],
            assetmaterial: [...new Set(assetmaterial)],
            assetdetail: [...new Set(assetdetail)],
            stockmanage: [... new Set(stockmanage)],
            stock: [...new Set(stock)],
            manualstockentry: [...new Set(manualstockentry)]

          })


          setChecktypegrouping([])
          setCheckassetmaterial([])
          setCheckAssetdetail([])
          setCheckStockManage([])
          setCheckStock([])
          setCheckManualStock([])
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [checktypegrouping, setChecktypegrouping] = useState([]);
  const [checkassetmaterial, setCheckassetmaterial] = useState([]);
  const [checkassetdetail, setCheckAssetdetail] = useState([]);

  const [checkstockmanage, setCheckStockManage] = useState([]);
  const [checkstock, setCheckStock] = useState([]);
  const [checkmanualstock, setCheckManualStock] = useState([]);
  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {

      const [res, restype, resassetmaterial, resassetdetail, resstockmanage, resstock, resmanual] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadtypegrouping: [name],
        }),
        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadassetmaterial: [name],
        }),
        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadassetdetail: [name],
        }),


        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadstockmanage: [name],
          // accountheadstockmanageproduct: [headname]
        }),
        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadstock: [name],
        }),
        axios.post(SERVICE.OVERALL_DELETE_TYPE_MASTER_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // accountheadmanual: [headname],
          accountheadmanualproduct: [name]
        })
      ])


      // let res = await axios.get(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });


      setDeleteAssetType(res?.data?.sassettypemaster);
      setChecktypegrouping(restype?.data?.assettypegrouping)
      setCheckassetmaterial(resassetmaterial?.data?.assetmaterial)
      setCheckAssetdetail(resassetdetail?.data?.assetdetail)
      setCheckStockManage(resstockmanage?.data?.stockmanage)
      setCheckStock(resstock?.data?.stock)
      setCheckManualStock(resmanual?.data?.manualstockentry)
      // handleClickOpen();
      if ((restype?.data?.assettypegrouping).length > 0 ||
        (resassetmaterial?.data?.assetmaterial).length > 0 ||
        (resassetdetail?.data?.assetdetail).length > 0 ||
        (resstockmanage?.data?.stockmanage).length > 0 ||
        (resstock?.data?.stock).length > 0 ||
        (resmanual?.data?.manualstockentry).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let freqid = deleteAssetType._id;
  const delFrequency = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${freqid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchFreqMaster();
      handleCloseMod();
      setFilteredRowData([])
      setFilteredChanges(null)
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
      let freqCreate = await axios.post(SERVICE.CREATE_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(assetTypeMaster.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAssetTypeMaster(freqCreate.data);
      await fetchFreqMaster();
      setAssetTypeMaster({ name: "" });
      setloadingdeloverall(false);
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
    setloadingdeloverall(true);
    e.preventDefault();
    const isNameMatch = assetTypeMasterArray?.some(
      (item) => item.name?.toLowerCase() === assetTypeMaster.name?.toLowerCase()
    );
    if (assetTypeMaster.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setAssetTypeMaster({ name: "" });
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
  const getCode = async (e, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetTypeMasterEdit(res?.data?.sassettypemaster);
      setOvProj(name);
      getOverallEditSection(name);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetTypeMasterEdit(res?.data?.sassettypemaster);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetTypeMasterEdit(res?.data?.sassettypemaster);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //frequency master name updateby edit page...
  let updateby = assetTypeMasterEdit.updatedby;
  let addedby = assetTypeMasterEdit.addedby;
  let frequencyId = assetTypeMasterEdit._id;



  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_TYPE_MASTER_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in
       ${res?.data?.assettypegrouping?.length > 0 ? "Asset Type Grouping ," : ""}
       ${res?.data?.assetmaterial?.length > 0 ? "Asset Material ," : ""}
      ${res?.data?.assetdetail?.length > 0 ? "Asset List" : ""} 
        ${res?.data?.stockmanage?.length > 0 ? "Stock Manage Request," : ""}
       ${res?.data?.stock?.length > 0 ? "Stock Purchase ," : ""}
      ${res?.data?.manualstockentry?.length > 0 ? "Manual Stock Entry" : ""} 
      whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_TYPE_MASTER_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      console.log(
        res?.data?.assettypegrouping,
        res?.data?.assetmaterial,
        res?.data?.assetdetail,
        res?.data?.stockmanage,
        res?.data?.stock,
        res?.data?.manualstockentry, "conditoncheck"
      )
      sendEditRequestOverall(
        res?.data?.assettypegrouping,
        res?.data?.assetmaterial,
        res?.data?.assetdetail,
        res?.data?.stockmanage,
        res?.data?.stock,
        res?.data?.manualstockentry,
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (assettypegrouping, assetmaterial, assetdetail, stockmanage, stock, manualstockentry) => {
    try {
      if (assettypegrouping.length > 0) {
        let answ = assettypegrouping.map((d, i) => {

          let res = axios.put(`${SERVICE.SINGLE_ASSETTYPEGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            name: assetTypeMasterEdit.name,
          });
        });
      }
      if (assetmaterial.length > 0) {
        let answ = assetmaterial.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assettype: String(assetTypeMasterEdit.name),
          });
        });
      }
      if (assetdetail.length > 0) {
        let answ = assetdetail.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assettype: String(assetTypeMasterEdit.name),
          });
        });
      }

      if (stockmanage.length > 0) {
        let answ = stockmanage.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKMANAGE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assettype: String(assetTypeMasterEdit.name),
          });
        });
      }
      if (stock.length > 0) {
        let answ = stock.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assettype: String(assetTypeMasterEdit.name),
          });
        });
      }
      if (manualstockentry.length > 0) {
        let answ = manualstockentry.map((d, i) => {
          let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assettype: String(assetTypeMasterEdit.name),
          });
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_ASSETTYPEMASTER}/${frequencyId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: String(assetTypeMasterEdit.name),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchFreqMaster();
      await fetchFreqMasterAll();
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
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
    fetchFreqMasterAll();
    const isNameMatch = allAssetTypeMasterEdit?.some(
      (item) =>
        item.name?.toLowerCase() === assetTypeMasterEdit.name?.toLowerCase()
    );
    if (assetTypeMasterEdit.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (assetTypeMasterEdit.name != ovProj && ovProjCount > 0) {
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
  //get all frequency master name.
  const fetchFreqMaster = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetTypeMasterArray(res_freq?.data?.assettypemaster.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
      })));
      setLoader(true)
    } catch (err) {
      setLoader(true)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delAreagrpcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${item}`, {
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

      setFilteredRowData([])
      setFilteredChanges(null)
      await fetchFreqMaster();
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
        ...overalldeletecheck.assettypegrouping,
        ...overalldeletecheck.assetmaterial,
        ...overalldeletecheck.assetdetail,
        ...overalldeletecheck.stockmanage,
        ...overalldeletecheck.stock,
        ...overalldeletecheck.manualstockentry,
      ];

      let filtered = rowDataTable.filter(d => !valfilter.some(item => d.name === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));

      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_ASSETTYPEMASTER}/${item}`, {
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

      await fetchFreqMaster();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Asset Type Name.
  const fetchFreqMasterAll = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllAssetTypeMasterEdit(
        res_freq?.data?.assettypemaster.filter(
          (item) => item._id !== assetTypeMasterEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchFreqMasterAll();
  }, [isEditOpen, assetTypeMasterEdit]);

  useEffect(() => {
    fetchFreqMaster();
  }, []);

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Asset Type Master.png");
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
    documentTitle: "Asset Type Master",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  //useEffect
  useEffect(() => {
    addSerialNumber(assetTypeMasterArray);
  }, [assetTypeMasterArray]);

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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
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
          {isUserRoleCompare?.includes("eassettypemaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassettypemaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassettypemaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassettypemaster") && (
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
      name: item.name,
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
              {" "}
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

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Asset Type Master"),
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


  const getLinkedLabelItem = (overalldeletecheck) => {
    const { assettypegrouping = [], assetmaterial = [], assetdetail = [], stockmanage = [], stock = [], manualstockentry = [] } = overalldeletecheck;
    const labels = [];

    assettypegrouping.forEach(item => labels.push(item));
    assetmaterial.forEach(item => labels.push(item));
    assetdetail.forEach(item => labels.push(item));
    stockmanage.forEach(item => labels.push(item));
    stock.forEach(item => labels.push(item));
    manualstockentry.forEach(item => labels.push(item));

    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];

    return uniqueLabels.join(", ");
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { assettypegrouping = [], assetmaterial = [], assetdetail = [], stockmanage = [], stock = [], manualstockentry = [] } = overalldeletecheck;
    const labels = [];

    if (assettypegrouping.length > 0) labels.push("Asset Type Grouping");
    if (assetmaterial.length > 0) labels.push("Asset Material");
    if (assetdetail.length > 0) labels.push("Asset Details");

    if (stockmanage.length > 0) labels.push("Stock Manage Request");
    if (stock.length > 0) labels.push("Stock Purchase");
    if (manualstockentry.length > 0) labels.push("Manual Stock Entry");

    return labels.join(", ");
  };

  const getFilteredUnits = (assetTypeMasterArray, selectedRows, overalldeletecheck) => {
    const { assettypegrouping = [], assetmaterial = [], assetdetail = [], stockmanage = [], stock = [], manualstockentry = [] } = overalldeletecheck;
    const allConditions = [...new Set([...assettypegrouping, ...assetmaterial, ...assetdetail, ...stockmanage, ...stock, ...manualstockentry])];

    return assetTypeMasterArray.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
  };

  const shouldShowDeleteMessage = (assetTypeMasterArray, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetTypeMasterArray, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (assetTypeMasterArray, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetTypeMasterArray, selectedRows, overalldeletecheck).length === 0;
  };





  return (
    <Box>
      <Headtitle title={"ASSET TYPE MASTER"} />
      <PageHeading
        title="Asset Type Master"
        modulename="Asset"
        submodulename="Master"
        mainpagename="Asset Type Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aassettypemaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Asset Type
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetTypeMaster.name}
                      onChange={(e) => {
                        setAssetTypeMaster({
                          ...assetTypeMaster,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
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
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassettypemaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Asset Type List
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
                    <MenuItem value={assetTypeMasterArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassettypemaster") && (
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
                  {isUserRoleCompare?.includes("csvassettypemaster") && (
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
                  {isUserRoleCompare?.includes("printassettypemaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassettypemaster") && (
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
                  {isUserRoleCompare?.includes("imageassettypemaster") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={assetTypeMasterArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={assetTypeMasterArray}
                  />
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
            {isUserRoleCompare?.includes("bdassettypemaster") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}

            <br />
            {!loader ? (
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
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pagenamecheck={"Type Master"}
                  selectedRowsTypeMaster={selectedRowsTypeMaster}
                  setSelectedRowsTypeMaster={setSelectedRowsTypeMaster}
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
                  itemsList={assetTypeMasterArray}
                />
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
      >
        <Box sx={{ width: "400px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Asset Type</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{assetTypeMasterEdit.name}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
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
          maxWidth="sm"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Asset Type
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={assetTypeMasterEdit.name}
                      onChange={(e) => {
                        setAssetTypeMasterEdit({
                          ...assetTypeMasterEdit,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
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


      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [
                { check: checktypegrouping?.length > 0, label: "Asset Type Grouping" },
                { check: checkassetmaterial?.length > 0, label: "Asset Material" },
                { check: checkassetdetail?.length > 0, label: "Asset Details" },
                { check: checkstockmanage?.length > 0, label: "Stock Manage Request" },
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
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteAssetType.name} `}</span>
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



      <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(overalldeletecheck.assettypegrouping?.length > 0 ||
              overalldeletecheck.assetmaterial?.length > 0 ||
              overalldeletecheck.assetdetail?.length > 0 ||
              overalldeletecheck.stockmanage?.length > 0 ||
              overalldeletecheck.stock?.length > 0 ||
              overalldeletecheck.manualstockentry?.length > 0
            )
              && (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabelItem(overalldeletecheck)}
                  </span>{' '}
                  was linked in{' '}
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabel(overalldeletecheck)}
                  </span>
                  {shouldShowDeleteMessage(assetTypeMasterArray, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(assetTypeMasterArray, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(assetTypeMasterArray, selectedRows, overalldeletecheck) && (
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
        itemsTwo={assetTypeMasterArray ?? []}
        filename={"Asset Type Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Type Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delFrequency}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAreagrpcheckbox}
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
      <br />
    </Box>
  );
}

export default AssetTypeMaster;
