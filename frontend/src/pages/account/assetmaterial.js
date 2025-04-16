import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton,
  List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
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

function Assetmaterial() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
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

  let exportColumnNames = ["Asset Type", "Asset Head", "Material Name", "Material Code",];
  let exportRowValues = ["assettype", "assethead", "name", "materialcode"];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };



  const [selectedRowsAssetMaterial, setSelectedRowsAssetMaterial] = useState([])
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
    assetspecification: [],
    assetspecificationgrp: [],
    assetdetail: [],
    assetmaterialip: [],
    maintenancedetailsmaster: [],
    assetworkstationgrouping: [],

    assetproblem: [],
    maintenancemaster: [],
    assetempdistribution: [],
    stockmanage: [],
    stock: [],
    manualstockentry: [],
    employeeassetreturn: [],
    maintenancenonschedule: []

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



  const [assetmaster, setAssetmaster] = useState([]);
  const [asset, setAsset] = useState({ name: "", materialcode: "", assethead: "", assettype: "", });
  const [assetedit, setAssetedit] = useState({ name: "", materialcode: "", assethead: "", assettype: "", });
  const [selectedassethead, setSelectedAssethead] = useState("Please Select Assethead");
  const [selectedassetheadedit, setSelectedAssetheadedit] = useState("Please Select Assethead");
  const [selectedassetType, setSelectedAssetType] = useState("Please Select Asset Type");
  const [selectedassetTypeEdit, setSelectedAssetTypeEdit] = useState("Please Select Asset Type");
  const [accountmaster, setAccountmaster] = useState([]);
  const [assetType, setAssetType] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAssetedit, setAllAssetedit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [assetCheck, setAssetcheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Asset Material.png");
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

  //Delete model
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


      let value = [...new Set(selectedRowsAssetMaterial.flat())]
      console.log(value, "value")
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        const [resspecification, resspecificationgrp, resassetdetail, resmatip, resmaindetmaster, resworkgrp,
          resprob, resmainmaster, resempdis, resstockmanage, resstock, resmanual, resempreturn, resnonschedule] = await Promise.all([

            axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              name: value,
            }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matassetspecificationgrp: value,
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matassetdetail: value,
            // }),


            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matassetip: value,

            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matmaintenancedmaster: value,
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },

            //   matassetworkgrp: value
            // }),



            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matassetproblem: value,
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matmaintenances: value
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matempdistribution: value
            // }),


            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matstockmanage: value
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matstock: value
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },

            //   matproduct: value
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },
            //   matempassetreturn: value,
            // }),
            // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },

            //   matnonschedule: value
            // })
          ])

        setCheckAssetSpeicification(resspecification?.data?.assetspecification);
        setCheckAssetSpeicificationgrp(resspecification?.data?.assetspecificationgrp);
        setCheckAssetdetail(resspecification?.data?.assetdetail);
        setCheckassetip(resspecification?.data?.assetmaterialip);
        setCheckmaindetails(resspecification?.data?.maintenancedetailsmaster);
        setCheckassetwrkgrp(resspecification?.data?.assetworkstationgrouping);
        setCheckproblem(resspecification?.data?.assetproblem);
        setCheckmaintmaster(resspecification?.data?.maintenancemaster);
        setCheckAssetempdis(resspecification?.data?.assetempdistribution);
        setCheckstockmanage(resspecification?.data?.stockmanage);
        setCheckstock(resspecification?.data?.stock);
        setCheckmanualstock(resspecification?.data?.manualstockentry);
        setCheckempreturn(resspecification?.data?.employeeassetreturn);
        setChecknonschedule(resspecification?.data?.maintenancenonschedule);


        let assetspecification = resspecification?.data?.assetspecification.map(t => t.workstation).flat();
        let assetspecificationgrp = resspecification?.data?.assetspecificationgrp.map(t => t.assetmaterial).flat();
        let assetdetail = resspecification?.data?.assetdetail.map(t => t.material).flat();

        let assetmaterialip = resspecification?.data?.assetmaterialip.map(t => t.assetmaterial).flat();
        let maintenancedetailsmaster = resspecification?.data?.maintenancedetailsmaster.map(t => t.assetmaterial).flat();
        let assetworkstationgrouping = resspecification?.data?.assetworkstationgrouping.map(t => t.assetmaterial).flat();

        let assetproblem = resspecification?.data?.assetproblem.map(t => t.material).flat();
        let maintenancemaster = resspecification?.data?.maintenancemaster.map(t => t.assetmaterial.split("-")[0]).flat();
        let assetempdistribution = resspecification?.data?.assetempdistribution.map(t => t.assetmaterial).flat();


        let stockmanage = resspecification?.data?.stockmanage.map(t => t.material).flat();
        let stock = resspecification?.data?.stock.map(t => t.productname).flat();
        let manualstockentry = resspecification?.data?.manualstockentry.map(t => t.productname).flat();


        let employeeassetreturn = resspecification?.data?.employeeassetreturn.map(t => t.assetmaterial).flat();
        let maintenancenonschedule = resspecification?.data?.maintenancenonschedule.map(t => t.assetmaterial.split("-")[0]).flat();

        if (
          (resspecification?.data?.assetspecification).length > 0 ||
          (resspecification?.data?.assetspecificationgrp).length > 0 ||
          (resspecification?.data?.assetdetail).length > 0 ||
          (resspecification?.data?.assetmaterialip).length > 0 ||
          (resspecification?.data?.maintenancedetailsmaster).length > 0 ||
          (resspecification?.data?.assetworkstationgrouping).length > 0 ||
          (resspecification?.data?.assetproblem).length > 0 ||
          (resspecification?.data?.maintenancemaster).length > 0 ||
          (resspecification?.data?.assetempdistribution).length > 0 ||
          (resspecification?.data?.stockmanage).length > 0 ||
          (resspecification?.data?.stock).length > 0 ||
          (resspecification?.data?.manualstockentry).length > 0 ||
          (resspecification?.data?.employeeassetreturn).length > 0 ||
          (resspecification?.data?.maintenancenonschedule).length > 0
        ) {
          handleClickOpenCheckbulk();
          // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
          setOveraldeletecheck({
            ...overalldeletecheck,
            assetspecification: [... new Set(assetspecification)],
            assetspecificationgrp: [...new Set(assetspecificationgrp)],
            assetdetail: [...new Set(assetdetail)],


            assetmaterialip: [... new Set(assetmaterialip)],
            maintenancedetailsmaster: [...new Set(maintenancedetailsmaster)],
            assetworkstationgrouping: [...new Set(assetworkstationgrouping)],


            assetproblem: [... new Set(assetproblem)],
            maintenancemaster: [...new Set(maintenancemaster)],
            assetempdistribution: [...new Set(assetempdistribution)],

            stockmanage: [... new Set(stockmanage)],
            stock: [...new Set(stock)],
            manualstockentry: [...new Set(manualstockentry)],
            employeeassetreturn: [...new Set(employeeassetreturn)],
            maintenancenonschedule: [...new Set(maintenancenonschedule)]
          })


          setCheckAssetSpeicification([])
          setCheckAssetSpeicificationgrp([])
          setCheckAssetdetail([])
          setCheckassetip([])
          setCheckmaindetails([])
          setCheckassetwrkgrp([])

          setCheckproblem([])
          setCheckmaintmaster([])
          setCheckAssetempdis([])
          setCheckstockmanage([])
          setCheckstock([])
          setCheckmanualstock([])

          setCheckempreturn([])
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
    assethead: true,
    assettype: true,
    name: true,
    materialcode: true,
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

  const [deleteVendor, setDeletevendor] = useState("");


  const [checkassetspecification, setCheckAssetSpeicification] = useState([]);
  const [checkassetspecificationgrp, setCheckAssetSpeicificationgrp] = useState([]);
  const [checkassetdetail, setCheckAssetdetail] = useState([]);

  const [checkassetip, setCheckassetip] = useState([]);
  const [checkmaindetails, setCheckmaindetails] = useState([]);
  const [checkassetwrkgrp, setCheckassetwrkgrp] = useState([]);



  const [checkproblem, setCheckproblem] = useState([]);
  const [checkmaintmaster, setCheckmaintmaster] = useState([]);
  const [checkassetempdis, setCheckAssetempdis] = useState([]);

  const [checkstockmanage, setCheckstockmanage] = useState([]);
  const [checkstock, setCheckstock] = useState([]);
  const [checkmanualstock, setCheckmanualstock] = useState([]);

  const [checkempreturn, setCheckempreturn] = useState([]);
  const [checknonschedule, setChecknonschedule] = useState([]);

  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      // let res = await axios.get(`${SERVICE.ASSET_SINGLE}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });

      const [res, resspecification, resspecificationgrp, resassetdetail, resmatip, resmaindetmaster, resworkgrp,
        resprob, resmainmaster, resempdis, resstockmanage, resstock, resmanual, resempreturn, resnonschedule] = await Promise.all([
          axios.get(`${SERVICE.ASSET_SINGLE}/${id}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            }
          }),
          axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            name: [name],
          }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matassetspecificationgrp: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matassetdetail: [name],
          // }),


          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matassetip: [name],
          //   // accountheadstockmanageproduct: [name]
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matmaintenancedmaster: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   // accountheadmanual: [name],
          //   matassetworkgrp: [name]
          // }),



          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matassetproblem: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matmaintenances: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matempdistribution: [name],
          // }),


          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matstockmanage: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matstock: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },

          //   matproduct: [name]
          // }),

          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          //   matempassetreturn: [name],
          // }),
          // axios.post(SERVICE.OVERALL_DELETE_ASSET_MATERIAL_LINKED_DATA, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },

          //   matnonschedule: [name]
          // })
        ])

      setDeletevendor(res?.data?.sasset);
      setCheckAssetSpeicification(resspecification?.data?.assetspecification);
      setCheckAssetSpeicificationgrp(resspecification?.data?.assetspecificationgrp);
      setCheckAssetdetail(resspecification?.data?.assetdetail);
      setCheckassetip(resspecification?.data?.assetmaterialip);
      setCheckmaindetails(resspecification?.data?.maintenancedetailsmaster);
      setCheckassetwrkgrp(resspecification?.data?.assetworkstationgrouping);
      setCheckproblem(resspecification?.data?.assetproblem);
      setCheckmaintmaster(resspecification?.data?.maintenancemaster);
      setCheckAssetempdis(resspecification?.data?.assetempdistribution);
      setCheckstockmanage(resspecification?.data?.stockmanage);
      setCheckstock(resspecification?.data?.stock);
      setCheckmanualstock(resspecification?.data?.manualstockentry);

      setCheckempreturn(resspecification?.data?.employeeassetreturn);
      setChecknonschedule(resspecification?.data?.maintenancenonschedule);


      if (
        (resspecification?.data?.assetspecification).length > 0 ||
        (resspecification?.data?.assetspecificationgrp).length > 0 ||
        (resspecification?.data?.assetdetail).length > 0 ||
        (resspecification?.data?.assetmaterialip).length > 0 ||
        (resspecification?.data?.maintenancedetailsmaster).length > 0 ||
        (resspecification?.data?.assetworkstationgrouping).length > 0 ||
        (resspecification?.data?.assetproblem).length > 0 ||
        (resspecification?.data?.maintenancemaster).length > 0 ||
        (resspecification?.data?.assetempdistribution).length > 0 ||
        (resspecification?.data?.stockmanage).length > 0 ||
        (resspecification?.data?.stock).length > 0 ||
        (resspecification?.data?.manualstockentry).length > 0 ||
        (resspecification?.data?.employeeassetreturn).length > 0 ||
        (resspecification?.data?.maintenancenonschedule).length > 0
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

  // Alert delete popup
  let Assetid = deleteVendor?._id;
  const delVendor = async () => {
    setPageName(!pageName)
    try {
      if (Assetid) {
        await axios.delete(`${SERVICE.ASSET_SINGLE}/${Assetid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchAsset();
        handleCloseMod();
        setFilteredRowData([])
        setFilteredChanges(null)
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

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSET_SINGLE}/${item}`, {
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
      await fetchAsset();
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
        overalldeletecheck.assetspecification,
        ...overalldeletecheck.assetspecificationgrp,
        ...overalldeletecheck.assetdetail,
        ...overalldeletecheck.assetmaterialip,
        ...overalldeletecheck.maintenancedetailsmaster,
        ...overalldeletecheck.assetworkstationgrouping,
        ...overalldeletecheck.assetproblem,
        ...overalldeletecheck.maintenancemaster,
        ...overalldeletecheck.assetempdistribution,
        ...overalldeletecheck.stockmanage,
        ...overalldeletecheck.stock,
        ...overalldeletecheck.manualstockentry,
        ...overalldeletecheck.employeeassetreturn,
        ...overalldeletecheck.maintenancenonschedule
      ];

      let filtered = rowDataTable.filter(d => !valfilter.some(item => d.name === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));
      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.ASSET_SINGLE}/${item}`, {
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

      await fetchAsset();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.ASSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assethead: selectedassethead,
        assettype: selectedassetType,
        name: String(asset.name),
        materialcode: String(asset.materialcode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAsset();
      setAsset(subprojectscreate.data);
      setAsset({ ...asset, name: "", materialcode: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setloadingdeloverall(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    e.preventDefault();
    fetchAsset();
    const isNameMatch = assetmaster?.some(
      (item) => item?.name?.toLowerCase() === asset.name?.toLowerCase()
    );
    const isCodeMatch = assetmaster?.some(
      (item) =>
        item?.materialcode?.toLowerCase() === asset.materialcode?.toLowerCase()
    );

    if (
      selectedassetType === "" ||
      selectedassetType == "Please Select Asset Type"
    ) {
      setPopupContentMalert("Please Select Asset Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedassethead === "" ||
      selectedassethead == "Please Select Assethead"
    ) {
      setPopupContentMalert("Please Select Assethead!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (asset.name === "") {
      setPopupContentMalert("Please Enter Material Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (asset.materialcode === "") {
      setPopupContentMalert("Please Enter Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Material Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      handleClickOpenerr();
      setPopupContentMalert("Material Code Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setSelectedAssethead("Please Select Assethead");
    setSelectedAssetType("Please Select Asset Type");
    setAsset({ materialcode: "", name: "" });
    setAccountmaster([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = (e) => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleAssetChange = (e) => {
    const selectedassethead = e.value;
    setSelectedAssethead(selectedassethead);
  };
  const handleAssetTypeChange = (e) => {
    const selectedassetType = e.value;
    setSelectedAssetType(selectedassetType);
  };

  //get single row to edit....
  const getCode = async (e, name, materialcode) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetedit(res?.data?.sasset);
      setSelectedAssetheadedit(res?.data?.sasset?.assethead);
      setSelectedAssetTypeEdit(res?.data?.sasset?.assettype);
      setOvProj(name);
      setOvProjcode(materialcode);
      getOverallEditSection(name, materialcode);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetedit(res?.data?.sasset);
      setSelectedAssetheadedit(res?.data?.sasset?.assethead);
      setSelectedAssetTypeEdit(res?.data?.sasset?.assettype);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetedit(res?.data?.sasset);
      setSelectedAssetheadedit(res?.data?.sasset?.assethead);
      setSelectedAssetTypeEdit(res?.data?.sasset?.assettype);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = assetedit?.updatedby;
  let addedby = assetedit?.addedby;
  let assetsid = assetedit?._id;

  const [alertcode, setAlertcode] = useState([])

  //overall edit section for all pages
  const getOverallEditSection = async (e, code) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ASSET_MATERIAL_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        oldnamecode: code
      });
      setOvProjCount(res?.data?.count);

      setAlertcode(
        `The ${code} is linked in
    ${res?.data?.assetdetail?.length > 0 ? "Asset List" : ""} 
    `
      )
      setGetOverallCount(`The ${e} is linked in
     ${res?.data?.assetspecification?.length > 0 ? "Asset Specification ," : ""}
     ${res?.data?.assetspecificationgrp?.length > 0 ? "Asset Specification Grouping ," : ""}
    ${res?.data?.assetdetail?.length > 0 ? "Asset List" : ""} 
     
      ${res?.data?.assetmaterialip?.length > 0 ? "Asset Material IP," : ""}
     ${res?.data?.maintenancedetailsmaster?.length > 0 ? "Maintemance Details Master," : ""}
    ${res?.data?.assetworkstationgrouping?.length > 0 ? "Asset Workstation Grouping ," : ""} 

  ${res?.data?.assetproblem?.length > 0 ? "Asset Problem Master ," : ""}
     ${res?.data?.maintenancemaster?.length > 0 ? "Maintenance Master," : ""}
    ${res?.data?.assetempdistribution?.length > 0 ? "Employee Asset Distribution ," : ""} 

    ${res?.data?.stockmanage?.length > 0 ? "Stock Manage Request," : ""}
     ${res?.data?.stock?.length > 0 ? "Stock Purchase ," : ""}
    ${res?.data?.manualstockentry?.length > 0 ? "Manual Stock Entry ," : ""} 
      ${res?.data?.maintenancenonschedule?.length > 0 ? "Manitenance Non Schedule ," : ""}
    ${res?.data?.employeeassetreturn?.length > 0 ? "Employee Asset Return Register" : ""} 
    whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ASSET_MATERIAL_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });

      sendEditRequestOverall(
        res?.data?.assetspecification,
        res?.data?.assetspecificationgrp,
        res?.data?.assetdetail,
        res?.data?.assetmaterialip,
        res?.data?.maintenancedetailsmaster,
        res?.data?.assetworkstationgrouping,
        res?.data?.assetproblem,
        res?.data?.maintenancemaster,
        res?.data?.assetempdistribution,
        res?.data?.stockmanage,
        res?.data?.stock,
        res?.data?.manualstockentry,
        res?.data?.maintenancenonschedule,
        res?.data?.employeeassetreturn

      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (
    assetspecification, assetspecificationgrp, assetdetail, assetmaterialip, maintenancedetailsmaster, assetworkstationgrouping,
    assetproblem, maintenancemaster, assetempdistribution, stockmanage, stock, manualstockentry, maintenancenonschedule, employeeassetreturn) => {
    try {
      if (maintenancenonschedule.length > 0) {


        let maindetails = maintenancenonschedule.map((d, i) => {
          // const [name, code, codeto] = d.assetmaterialcode.split("-")
          const [name, code] = d?.assetmaterial.split(ovProj)

          return {
            ...d,
            assetmaterial: `${assetedit.name}${code}`

          }
        })

        let answ = maindetails.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_TASK_MAINTENANCE_NONSCHEDULEGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assetmaterial: d.assetmaterial,
          });
        });
      }

      if (employeeassetreturn.length > 0) {
        let maindetails = employeeassetreturn.map((d, i) => {
          // const [name, code, codeto] = d.assetmaterialcode.split("-")
          const [name, code] = d?.assetmaterialcode.split(ovProj)

          return {
            ...d,
            assetmaterialcode: `${assetedit.name}${code}`

          }
        })

        let answ = maindetails.map((d, i) => {
          let res = axios.put(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assetmaterial: assetedit.name,
            assetmaterialcode: d.assetmaterialcode

          });
        });
      }




      if (assetspecification.length > 0) {
        let answ = assetspecification.map((d, i) => {

          let res = axios.put(`${SERVICE.ASSETWORKSTAION_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            workstation: assetedit.name,
          });
        });
      }
      if (assetspecificationgrp.length > 0) {
        let answ = assetspecificationgrp.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_ASSETSPECIFICATIONGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assetmaterial: String(assetedit.name),

          });
        });
      }
      if (assetdetail.length > 0) {
        let answ = assetdetail.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            material: String(assetedit.name),
          });
        });
      }



      if (assetmaterialip.length > 0) {


        let assetmaterialipaltered = assetmaterialip.map((d, i) => {

          return {
            ...d,
            component: d.component.map(item => {
              const [name, code] = item.split(ovProj)
              return `${assetedit.name}${code}`
            })
          }
        })

        let answ = assetmaterialipaltered.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETMATERIALIP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assetmaterial: assetedit.name,
            component: d.component

          });
        });
      }



      if (maintenancedetailsmaster.length > 0) {


        let maindetails = maintenancedetailsmaster.map((d, i) => {
          // const [name, code, codeto] = d.assetmaterialcode.split("-")
          const [name, code] = d?.assetmaterialcode.split(ovProj)

          return {
            ...d,
            assetmaterialcode: `${assetedit.name}${code}`

          }
        })

        let answ = maindetails.map((d, i) => {
          let res = axios.put(`${SERVICE.MAINTENANCEDETAILSMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assetmaterial: assetedit.name,
            assetmaterialcode: d.assetmaterialcode

          });
        });
      }


      if (assetworkstationgrouping.length > 0) {


        let assetworkgrp = assetworkstationgrouping.map((d, i) => {

          return {
            ...d,
            component: d.component.map(item => {

              const [name, code] = item.split(ovProj)
              return `${assetedit.name}${code}`
            })
          }
        })

        let answ = assetworkgrp.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETWORKSTATIONGROUP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assetmaterial: assetedit.name,
            component: d.component

          });
        });
      }






      if (assetproblem.length > 0) {
        let answ = assetproblem.map((d, i) => {

          let res = axios.put(`${SERVICE.ASSETPROBLEMMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            material: assetedit.name,
          });
        });
      }





      if (maintenancemaster.length > 0) {


        let assetworkgrp = maintenancemaster.map((d, i) => {

          return {
            ...d,
            assetmaterialcode: d.assetmaterialcode.map(item => {
              // const [name, code, codeto] = item.split("-")
              // return `${assetedit.name}-${code}-${codeto}`
              const [name, code] = item.split(ovProj)
              return `${assetedit.name}${code}`
            })
          }
        })

        let answ = assetworkgrp.map((d, i) => {
          let res = axios.put(`${SERVICE.MAINTENTANCE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            // assetmaterial: assetedit.name,
            // component: d.component
            assetmaterial: String(assetedit.name),
            assetmaterialcode: d.assetmaterialcode

          });
        });
      }




      if (assetempdistribution.length > 0) {


        let assetworkgrp = assetempdistribution.map((d, i) => {
          const [name, code] = d?.assetmaterialcode.split(ovProj)

          return {
            ...d,
            assetmaterialcode: `${assetedit.name}${code}`
          }
        })

        let answ = assetworkgrp.map((d, i) => {
          let res = axios.put(`${SERVICE.EMPLOYEEASSET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assetmaterial: assetedit.name,
            assetmaterialcode: d.assetmaterialcode

          });
        });
      }







      if (stockmanage.length > 0) {
        let answ = stockmanage.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKMANAGE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            material: String(assetedit.name),
          });
        });
      }


      if (stock.length > 0) {
        let answ = stock.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            productname: String(assetedit.name),
          });
        });
      }
      if (manualstockentry.length > 0) {
        let answ = manualstockentry.map((d, i) => {
          let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            productname: String(assetedit.name),
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

      let res = await axios.put(`${SERVICE.ASSET_SINGLE}/${assetsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assethead: selectedassetheadedit,
        assettype: selectedassetTypeEdit,
        name: String(assetedit.name),
        materialcode: String(assetedit.materialcode),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAsset();
      await fetchAssetAll();
      await getOverallEditSectionUpdate()
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
    fetchAssetAll();
    const isNameMatch = allAssetedit?.some(
      (item) => item.name?.toLowerCase() === assetedit.name?.toLowerCase()
    );
    const isCodeMatch = allAssetedit?.some(
      (item) =>
        item.materialcode?.toLowerCase() ===
        assetedit.materialcode?.toLowerCase()
    );
    if (
      selectedassetTypeEdit === "" ||
      selectedassetTypeEdit == "Please Select Asset Type"
    ) {
      setPopupContentMalert("Please Select Asset Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedassetheadedit === "" ||
      selectedassetheadedit == "Please Select Assethead"
    ) {
      setPopupContentMalert("Please Select Assethead!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetedit.name === "") {
      setPopupContentMalert("Please Enter Material Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetedit.materialcode === "") {
      setPopupContentMalert("Please Enter Material Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Material Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      handleClickOpenerr();
      setPopupContentMalert("Material Code Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (assetedit.materialcode != ovProjcode && ovProjCount > 0) {
      setPopupContentMalert(alertcode);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (assetedit.name != ovProj && assetedit.materialcode == ovProjcode && ovProjCount > 0) {
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

  //get all Sub vendormasters.
  const fetchAsset = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetcheck(true);
      setAssetmaster(res_vendor?.data?.assetmaterial.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
      })));
    } catch (err) {
      setAssetcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all accounts
  const fetchAccount = async (e) => {
    setPageName(!pageName)
    let resulthead = [];

    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const itAssetsObject = res_account?.data?.assettypegrouping.filter(
        (item) => item.name === e
      );
      //filter products
      let dataallstocks = itAssetsObject?.map((data, index) => {
        return data.accounthead;
      });
      //individual products
      dataallstocks.forEach((value) => {
        value.forEach((valueData) => {
          resulthead.push(valueData);
        });
      });
      const projall = [
        ...resulthead?.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setAccountmaster(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchAssetType = async () => {
    setPageName(!pageName)
    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projall = [
        ...res_account?.data?.assettypemaster?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      const aeestuniqueArray = projall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });
      setAssetType(aeestuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchAssetAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllAssetedit(
        res_vendor?.data?.assetmaterial.filter(
          (item) => item._id !== assetedit._id
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
    documentTitle: "Asset Material",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchAsset();
  }, [isEditOpen, assetedit, asset]);

  useEffect(() => {
    fetchAsset();
    fetchAssetType();
    fetchAssetAll();
  }, []);

  useEffect(() => {
    fetchAssetAll();
  }, [isEditOpen, assetedit]);

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
    addSerialNumber(assetmaster);
  }, [assetmaster]);

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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
      field: "assettype",
      headerName: "Asset Type",
      flex: 0,
      width: 200,
      hide: !columnVisibility.assettype,
      headerClassName: "bold-header",
    },
    {
      field: "assethead",
      headerName: "Asset Head",
      flex: 0,
      width: 200,
      hide: !columnVisibility.assethead,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Material Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "materialcode",
      headerName: "Material Code",
      flex: 0,
      width: 200,
      hide: !columnVisibility.materialcode,
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
          {isUserRoleCompare?.includes("eassetmaterial") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name, params.data.materialcode);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetmaterial") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetmaterial") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassetmaterial") && (
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
      assethead: item.assethead,
      assettype: item.assettype,
      materialcode: item.materialcode,
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

  const [fileFormat, setFormat] = useState("");

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Asset Material"),
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
    const {
      assetspecification = [],
      assetspecificationgrp = [],
      assetdetail = [],
      assetmaterialip = [],
      maintenancedetailsmaster = [],
      assetworkstationgrouping = [],

      assetproblem = [],
      maintenancemaster = [],
      assetempdistribution = [],
      stockmanage = [],
      stock = [],
      manualstockentry = [],
      employeeassetreturn = [],
      maintenancenonschedule = []
    } = overalldeletecheck;
    const labels = [];

    assetspecification.forEach(item => labels.push(item));
    assetspecificationgrp.forEach(item => labels.push(item));
    assetdetail.forEach(item => labels.push(item));

    assetmaterialip.forEach(item => labels.push(item));
    maintenancedetailsmaster.forEach(item => labels.push(item));
    assetworkstationgrouping.forEach(item => labels.push(item));

    assetproblem.forEach(item => labels.push(item));
    maintenancemaster.forEach(item => labels.push(item));
    assetempdistribution.forEach(item => labels.push(item));

    stockmanage.forEach(item => labels.push(item));
    stock.forEach(item => labels.push(item));
    manualstockentry.forEach(item => labels.push(item));

    employeeassetreturn.forEach(item => labels.push(item));
    maintenancenonschedule.forEach(item => labels.push(item));

    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];

    return uniqueLabels.join(", ");
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { assetspecification = [],
      assetspecificationgrp = [],
      assetdetail = [],
      assetmaterialip = [],
      maintenancedetailsmaster = [],
      assetworkstationgrouping = [],

      assetproblem = [],
      maintenancemaster = [],
      assetempdistribution = [],
      stockmanage = [],
      stock = [],
      manualstockentry = [],
      employeeassetreturn = [],
      maintenancenonschedule = []
    } = overalldeletecheck;
    const labels = [];

    if (assetspecification.length > 0) labels.push("Asset Specification");
    if (assetspecificationgrp.length > 0) labels.push("Asset Specification Grouping");
    if (assetdetail.length > 0) labels.push("Asset Details List");


    if (assetmaterialip.length > 0) labels.push("Asset Material IP");
    if (maintenancedetailsmaster.length > 0) labels.push("Maintenance Details Master");
    if (assetworkstationgrouping.length > 0) labels.push("Asset Workstation Grouping");


    if (assetproblem.length > 0) labels.push("Asset Problem");
    if (maintenancemaster.length > 0) labels.push("Maintenance Master");
    if (assetempdistribution.length > 0) labels.push("Asset Employee Distribution");


    if (stockmanage.length > 0) labels.push("Stock Manage Request");
    if (stock.length > 0) labels.push("Stock Purchase");
    if (manualstockentry.length > 0) labels.push("Manual Stock Entry");


    if (employeeassetreturn.length > 0) labels.push("Employee Asset Return Register");
    if (maintenancenonschedule.length > 0) labels.push("Manitenance Non Schedule");


    return labels.join(", ");
  };

  const getFilteredUnits = (assetmaster, selectedRows, overalldeletecheck) => {
    const { assetspecification = [],
      assetspecificationgrp = [],
      assetdetail = [],
      assetmaterialip = [],
      maintenancedetailsmaster = [],
      assetworkstationgrouping = [],

      assetproblem = [],
      maintenancemaster = [],
      assetempdistribution = [],
      stockmanage = [],
      stock = [],
      manualstockentry = [],
      employeeassetreturn = [],
      maintenancenonschedule = [] } = overalldeletecheck;
    const allConditions = [...new Set([
      ...assetspecification, ...assetspecificationgrp, ...assetdetail,
      ...assetmaterialip, ...maintenancedetailsmaster, ...assetworkstationgrouping,
      ...assetproblem, ...maintenancemaster, ...assetempdistribution,
      ...stockmanage, ...stock, ...manualstockentry, ...employeeassetreturn, ...maintenancenonschedule])];

    return assetmaster.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
  };

  const shouldShowDeleteMessage = (assetmaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetmaster, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (assetmaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(assetmaster, selectedRows, overalldeletecheck).length === 0;
  };



  return (
    <Box>
      <Headtitle title={"Asset Material"} />
      {isUserRoleCompare?.includes("aassetmaterial") && (
        <>
          <PageHeading
            title="Asset Material"
            modulename="Asset"
            submodulename="Master"
            mainpagename="Asset Material"
            subpagename=""
            subsubpagename=""
          />

          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Asset Material
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Asset Type<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={assetType}
                      styles={colourStyles}
                      value={{
                        label: selectedassetType,
                        value: selectedassetType,
                      }}
                      onChange={(e) => {
                        handleAssetTypeChange(e);
                        setSelectedAssethead("Please Select Assethead");
                        fetchAccount(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Asset Head <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={accountmaster}
                      styles={colourStyles}
                      value={{
                        label: selectedassethead,
                        value: selectedassethead,
                      }}
                      onChange={(e) => {
                        handleAssetChange(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={asset.name}
                      placeholder="Please Enter Material Name"
                      onChange={(e) => {
                        setAsset({
                          ...asset,
                          name: e.target.value,
                          materialcode: e.target.value
                            .slice(0, 4)
                            ?.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={asset.materialcode}
                      placeholder="Please Enter Material Code"
                      onChange={(e) => {
                        setAsset({
                          ...asset,
                          materialcode: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={2.5} xs={12} sm={6}>
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
                <Grid item md={2.5} xs={12} sm={6}>
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
          maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Asset Material
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Asset Type <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={assetType}
                        styles={colourStyles}
                        value={{
                          label: selectedassetTypeEdit,
                          value: selectedassetTypeEdit,
                        }}
                        onChange={(e) => {
                          setSelectedAssetTypeEdit(e.value);
                          setSelectedAssetheadedit("Please Select Assethead");
                          fetchAccount(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Asset Head <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={accountmaster}
                        styles={colourStyles}
                        value={{
                          label: selectedassetheadedit,
                          value: selectedassetheadedit,
                        }}
                        onChange={(e) => {
                          setSelectedAssetheadedit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Material Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={assetedit.name}
                        placeholder="Please Enter Material Name"
                        onChange={(e) => {
                          setAssetedit({
                            ...assetedit,
                            name: e.target.value,
                            materialcode: e.target.value
                              .slice(0, 4)
                              ?.toUpperCase(),
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Material Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={assetedit.materialcode}
                        placeholder="Please Enter Material Code"
                        onChange={(e) => {
                          setAssetedit({
                            ...assetedit,
                            materialcode: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
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
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassetmaterial") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Asset Material List
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
                    <MenuItem value={assetmaster?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelassetmaterial") && (
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
                  {isUserRoleCompare?.includes("csvassetmaterial") && (
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
                  {isUserRoleCompare?.includes("printassetmaterial") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassetmaterial") && (
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
                  {isUserRoleCompare?.includes("imageassetmaterial") && (
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={assetmaster}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={assetmaster}
                  />
                </Box>
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
                  {isUserRoleCompare?.includes("bdassetmaterial") && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={buttonStyles.buttonbulkdelete}
                      onClick={handleClickOpenalert}
                    >
                      Bulk Delete
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
            <br />

            {!assetCheck ? (
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
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  pagenamecheck={"Asset Material"}
                  selectedRowsAssetMaterial={selectedRowsAssetMaterial}
                  setSelectedRowsAssetMaterial={setSelectedRowsAssetMaterial}
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
                  itemsList={assetmaster}
                />
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
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Asset Material
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Type</Typography>
                  <Typography>{assetedit.assettype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Asset Head</Typography>
                  <Typography>{assetedit.assethead}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Material Name</Typography>
                  <Typography>{assetedit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Material Code</Typography>
                  <Typography>{assetedit.materialcode}</Typography>
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
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>



      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [
                { check: checkassetspecification?.length > 0, label: "Asset Specification" },
                { check: checkassetspecificationgrp?.length > 0, label: "Asset Specification Grouping" },
                { check: checkassetdetail?.length > 0, label: "Asset Details List" },

                { check: checkassetip?.length > 0, label: "Asset Material IP" },
                { check: checkmaindetails?.length > 0, label: "Maintenance Details Master" },
                { check: checkassetwrkgrp?.length > 0, label: "Asset WorkStation Grouping" },

                { check: checkproblem?.length > 0, label: "Asset Problem Master" },
                { check: checkmaintmaster?.length > 0, label: "Maintenance Master" },
                { check: checkassetempdis?.length > 0, label: "Asset Employee Distribution" },

                { check: checkstockmanage?.length > 0, label: "Stock Manage Request" },
                { check: checkstock?.length > 0, label: "Stock Purchase" },
                { check: checkmanualstock?.length > 0, label: "Manual Stock Entry" },

                { check: checkempreturn?.length > 0, label: "Employee Asset Return Register" },
                { check: checknonschedule?.length > 0, label: "Manitenance Non Schedule" },

              ];

              // Filter out the true conditions
              const linkedItems = conditions.filter((item) => item.check);

              // Build the message dynamically
              if (linkedItems.length > 0) {
                const linkedLabels = linkedItems.map((item) => item.label).join(", ");
                return (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteVendor.name} `}</span>
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
            {(
              overalldeletecheck.assetspecification?.length > 0 ||
              overalldeletecheck.assetspecificationgrp?.length > 0 ||
              overalldeletecheck.assetdetail?.length > 0 ||

              overalldeletecheck.assetmaterialip?.length > 0 ||
              overalldeletecheck.maintenancedetailsmaster?.length > 0 ||
              overalldeletecheck.assetworkstationgrouping?.length > 0 ||

              overalldeletecheck.assetproblem?.length > 0 ||
              overalldeletecheck.maintenancemaster?.length > 0 ||
              overalldeletecheck.assetempdistribution?.length > 0 ||

              overalldeletecheck.stockmanage?.length > 0 ||
              overalldeletecheck.stock?.length > 0 ||
              overalldeletecheck.manualstockentry?.length > 0 ||

              overalldeletecheck.employeeassetreturn?.length > 0 ||
              overalldeletecheck.maintenancenonschedule?.length > 0
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
                  {shouldShowDeleteMessage(assetmaster, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(assetmaster, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(assetmaster, selectedRows, overalldeletecheck) && (
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
        itemsTwo={assetmaster ?? []}
        filename={"Asset Material"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Material Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delVendor}
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

export default Assetmaterial;