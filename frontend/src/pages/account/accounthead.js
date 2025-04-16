import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ThreeDots } from "react-loader-spinner";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover,
  Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint, } from "react-icons/fa";
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
import domtoimage from 'dom-to-image'

function Accounthead() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [loader, setLoader] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
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

  let exportColumnNames = ["Group Name", "Head Code", "Head Name"];
  let exportRowValues = ["groupname", "headcode", "headname"];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [loadingdeloverall, setloadingdeloverall] = useState(false);


  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //post call
  const [account, setAccount] = useState({ groupname: "", headcode: "", headname: "", });
  const [accountedit, setAccountEdit] = useState({ groupname: "", headcode: "", headname: "", });
  const [accountmaster, setAccountmaster] = useState([]);
  const [accountgrp, setAccountgrp] = useState({ accountname: "", under: "Please Select Under", alias: "", natureofgroup: "Please Select Nature Group", });
  const [accountgroups, setAccountgroups] = useState([]);
  const [accountgrps, setAccountgrps] = useState([]);
  const [selectedgroupname, setSelectedGroupname] = useState("Please Select Groupname");
  const [selectedgroupnameedit, setSelectedGroupnameedit] = useState("Please Select Groupname");
  const [under, setUnder] = useState("Please Select Under");
  const [underOpt, setUnderopt] = useState("Please Select Under");
  const [nature, setNature] = useState("Please Select Nature Group");
  const [searchQuery, setSearchQuery] = useState("");
  const [allAccountedit, setAccountallEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);
  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };
  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Account Head.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);

  };



  const [selectedRowsHeadLinked, setSelectedRowsHeadLinked] = useState([]);
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


      let value = [...new Set(selectedRowsHeadLinked.flat())]
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {
        const [restype, resassetmaterial, resassetdetail, resstockmanage, resstock, resmanual] = await Promise.all([

          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadtypegrouping: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadassetmaterial: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadassetdetail: value,
          }),


          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadstockmanage: value,

          }),
          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            accountheadstock: value,
          }),
          axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
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

        let assettypegrouping = restype?.data?.assettypegrouping.map(t => t.accounthead).flat();
        let assetmaterial = resassetmaterial?.data?.assetmaterial.map(t => t.assethead).flat();
        let assetdetail = resassetdetail?.data?.assetdetail.map(t => t.asset).flat();

        let stockmanage = resstockmanage?.data?.stockmanage.map(t => t.asset).flat();
        let stock = resstock?.data?.stock.map(t => t.producthead).flat();
        let manualstockentry = resmanual?.data?.manualstockentry.map(t => t.producthead).flat();

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
    groupname: true,
    headcode: true,
    headname: true,
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

  const [deleteVendor, setDeletevendor] = useState({});


  const [checktypegrouping, setChecktypegrouping] = useState([]);
  const [checkassetmaterial, setCheckassetmaterial] = useState([]);
  const [checkassetdetail, setCheckAssetdetail] = useState([]);

  const [checkstockmanage, setCheckStockManage] = useState([]);
  const [checkstock, setCheckStock] = useState([]);
  const [checkmanualstock, setCheckManualStock] = useState([]);

  const rowData = async (id, headname) => {
    setPageName(!pageName)
    try {

      const [res, restype, resassetmaterial, resassetdetail, resstockmanage, resstock, resmanual] = await Promise.all([
        axios.get(`${SERVICE.ACCOUNTHEAD_SINGLE}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),
        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadtypegrouping: [headname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadassetmaterial: [headname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadassetdetail: [headname],
        }),


        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadstockmanage: [headname],
          // accountheadstockmanageproduct: [headname]
        }),
        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountheadstock: [headname],
        }),
        axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_HEAD_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // accountheadmanual: [headname],
          accountheadmanualproduct: [headname]
        })
      ])



      // let res = await axios.get(`${SERVICE.ACCOUNTHEAD_SINGLE}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      setDeletevendor(res?.data?.saccount);
      setChecktypegrouping(restype?.data?.assettypegrouping)
      setCheckassetmaterial(resassetmaterial?.data?.assetmaterial)
      setCheckAssetdetail(resassetdetail?.data?.assetdetail)
      setCheckStockManage(resstockmanage?.data?.stockmanage)
      setCheckStock(resstock?.data?.stock)
      setCheckManualStock(resmanual?.data?.manualstockentry)

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
  let Accountsid = deleteVendor?._id;
  const delVendor = async () => {
    setPageName(!pageName)
    try {
      if (Accountsid) {
        await axios.delete(`${SERVICE.ACCOUNTHEAD_SINGLE}/${Accountsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchAccount();
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

  //fetching Groupname for Dropdowns
  const fetchGroupname = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const all = [
        ...res?.data?.groups.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      // setUnder(all);
      setUnderopt(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchGroupname();
  }, []);

  const delVendorcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ACCOUNTHEAD_SINGLE}/${item}`, {
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
      await fetchAccount();
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

      let filtered = rowDataTable.filter(d => !valfilter.some(item => d.headname === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));

      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.ACCOUNTHEAD_SINGLE}/${item}`, {
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

      await fetchAccount();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //fetching Project for Dropdowns
  const fetchAccountGroupsdropdown = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.ACCOUNTGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.accountgroups?.map((d) => ({
          ...d,
          label: d.accountname,
          value: d.accountname,
        })),
      ];
      setAccountgrps(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchAccountgrp = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ACCOUNTGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountgroups(res_vendor?.data?.accountgroups);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all accounts
  const fetchAccount = async () => {
    setPageName(!pageName)
    try {
      let res_account = await axios.get(SERVICE.ACCOUNTHEAD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountmaster(res_account?.data?.accounthead.map((item, index) => ({
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

  useEffect(() => {
    fetchAccountGroupsdropdown();
    fetchAccountgrp();
  }, []);

  const fetchAccountEditAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.ACCOUNTHEAD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountallEdit(
        res_vendor?.data?.accounthead.filter(
          (item) => item._id !== accountedit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.ACCOUNTHEAD_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        groupname: selectedgroupname,
        headcode: String(account.headcode),
        headname: String(account.headname),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAccount();
      setAccount(subprojectscreate.data);
      setloadingdeloverall(false);
      setAccount({ ...account, headcode: "", headname: "" });
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
    const isNameMatch = accountmaster?.some(
      (item) => item?.headname?.toLowerCase() === (account.headname)?.toLowerCase() &&
        item.groupname === selectedgroupname
    );

    const isCodeMatch = accountmaster?.some(
      (item) => item?.headcode?.toLowerCase() === (account.headcode)?.toLowerCase() &&
        item.groupname === selectedgroupname
    );


    if (
      selectedgroupname === "" ||
      selectedgroupname == "Please Select Groupname"
    ) {
      setPopupContentMalert("Please Enter Group Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (account.headcode === "") {
      setPopupContentMalert("Please Enter Head Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (account.headname === "") {
      setPopupContentMalert("Please Enter Head Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setSelectedGroupname("Please Select Groupname");
    setAccount({ headcode: "", headname: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //add function
  const sendRequestgroup = async () => {
    setPageName(!pageName)
    setIsBtn(true);
    try {
      let subprojectscreate = await axios.post(SERVICE.ACCOUNTGROUP_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accountname: String(accountgrp.accountname),
        under: String(under),
        alias: String(accountgrp.alias),
        natureofgroup: String(nature),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAccountGroupsdropdown();
      await fetchAccountgrp();
      setUnder("Please Select Under");
      handleCloseviewalert();
      setAccountgrp(subprojectscreate.data);
      setAccountgrp({
        ...accountgrp,
        accountname: "",
        under: "Please Select Under",
        alias: "",
        natureofgroup: "Choose nature Group",
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmitgroup = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    const isNameMatch = accountgroups?.some(
      (item) =>
        item.accountname?.toLowerCase() ===
        accountgrp.accountname?.toLowerCase()
    );
    if (accountgrp.accountname === "") {
      setPopupContentMalert("Please Enter Group Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (under === "" || under === "Please Select Under") {
      setPopupContentMalert("Please Select Under!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (nature === "" || nature === "Please Select Nature Group") {
      setPopupContentMalert("Please Select Nature Group!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestgroup();
    }
  };

  const handleCleargroup = (e) => {
    e.preventDefault();
    setPageName(!pageName)
    setUnder("Please Select Under");
    setNature("Please Select Nature Group");
    setAccountgrp({
      accountname: "",
      under: "Please Select Under",
      alias: "",
      natureofgroup: "Please Select Nature Group",
    });
    setPopupContent("Cleared Successfully");
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get single row to edit....
  const getCode = async (e, headname) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ACCOUNTHEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountEdit(res?.data?.saccount);
      setSelectedGroupnameedit(res?.data?.saccount?.groupname);
      setOvProj(headname);
      getOverallEditSection(headname);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ACCOUNTHEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountEdit(res?.data?.saccount);
      setSelectedGroupnameedit(res?.data?.saccount?.groupname);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ACCOUNTHEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAccountEdit(res?.data?.saccount);
      setSelectedGroupnameedit(res?.data?.saccount?.groupname);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = accountedit?.updatedby;
  let addedby = accountedit?.addedby;
  let accountheadid = accountedit?._id;



  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_HEAD_LINKED_DATA, {
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
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_HEAD_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });

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
        let answ = assettypegrouping.map(async (d, i) => {

          let res1 = await axios.get(`${SERVICE.SINGLE_ASSETTYPEGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });


          const filtered = res1?.data?.sassettypegrouping.accounthead.filter(item => item != ovProj)


          let res = await axios.put(`${SERVICE.SINGLE_ASSETTYPEGROUPING}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            accounthead: [...filtered, accountedit.headname],
          });
        });
      }
      if (assetmaterial.length > 0) {
        let answ = assetmaterial.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            assethead: String(accountedit.headname),
          });
        });
      }
      if (assetdetail.length > 0) {
        let answ = assetdetail.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            asset: String(accountedit.headname),
          });
        });
      }

      if (stockmanage.length > 0) {
        let answ = stockmanage.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKMANAGE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            asset: String(accountedit.headname),
          });
        });
      }
      if (stock.length > 0) {
        let answ = stock.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            producthead: String(accountedit.headname),
          });
        });
      }
      if (manualstockentry.length > 0) {
        let answ = manualstockentry.map((d, i) => {
          let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            producthead: String(accountedit.headname),
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
        `${SERVICE.ACCOUNTHEAD_SINGLE}/${accountheadid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          groupname: String(selectedgroupnameedit),
          headname: String(accountedit.headname),
          headcode: String(accountedit.headcode),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAccount();
      await fetchAccountEditAll();
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
    fetchAccountEditAll();
    const isNameMatch = allAccountedit?.some(
      (item) => item?.headname?.toLowerCase() === (accountedit.headname)?.toLowerCase() &&
        item.groupname === selectedgroupnameedit
    );

    const isCodeMatch = allAccountedit?.some(
      (item) => item?.headcode?.toLowerCase() === (accountedit.headcode)?.toLowerCase() &&
        item.groupname === selectedgroupnameedit
    );
    if (
      selectedgroupnameedit === "" ||
      selectedgroupnameedit == "Please Select Groupname"
    ) {
      setPopupContentMalert("Please Select GroupName!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (accountedit.headcode === "") {
      setPopupContentMalert("Please Enter Head Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (accountedit.headname === "") {
      setPopupContentMalert("Please Enter Head Name!");
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
    }
    else if (accountedit.headname != ovProj && ovProjCount > 0) {
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

  const handleAccountChange = (e) => {
    const selectedgroupname = e.value;
    setSelectedGroupname(selectedgroupname);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Account Head List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    fetchAccountEditAll();
  }, [isEditOpen, accountedit]);

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
    addSerialNumber(accountmaster);
  }, [accountmaster]);

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
      field: "groupname",
      headerName: "Group Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.groupname,
      headerClassName: "bold-header",
    },
    {
      field: "headcode",
      headerName: "Head Code",
      flex: 0,
      width: 250,
      hide: !columnVisibility.headcode,
      headerClassName: "bold-header",
    },
    {
      field: "headname",
      headerName: "Head Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.headname,
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
          {isUserRoleCompare?.includes("eaccounthead") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.headname);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("daccounthead") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.headname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vaccounthead") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iaccounthead") && (
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
      groupname: item.groupname,
      headcode: item.headcode,
      headname: item.headname,
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
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Account Head"),
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
    if (assetdetail.length > 0) labels.push("Asset Details List");

    if (stockmanage.length > 0) labels.push("Stock Manage Request");
    if (stock.length > 0) labels.push("Stock Purchase");
    if (manualstockentry.length > 0) labels.push("Manual Stock Entry");

    return labels.join(", ");
  };

  const getFilteredUnits = (accountmaster, selectedRows, overalldeletecheck) => {
    const { assettypegrouping = [], assetmaterial = [], assetdetail = [], stockmanage = [], stock = [], manualstockentry = [] } = overalldeletecheck;
    const allConditions = [...new Set([...assettypegrouping, ...assetmaterial, ...assetdetail, ...stockmanage, ...stock, ...manualstockentry])];

    return accountmaster.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.headname));
  };

  const shouldShowDeleteMessage = (accountmaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(accountmaster, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (accountmaster, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(accountmaster, selectedRows, overalldeletecheck).length === 0;
  };


  return (
    <Box>
      <Headtitle title={"Account Head"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aaccounthead") && (
        <>
          <PageHeading
            title="Account Head"
            modulename="Asset"
            submodulename="Master"
            mainpagename="Account Head"
            subpagename=""
            subsubpagename=""
          />

          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Account Head
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Group Name <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={accountgrps}
                      styles={colourStyles}
                      value={{
                        label: selectedgroupname,
                        value: selectedgroupname,
                      }}
                      onChange={(e) => {
                        handleAccountChange(e);
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
                      marginTop: "20px",
                      background: "rgb(25, 118, 210)",
                    }}
                    onClick={() => {
                      handleClickOpenviewalert();
                    }}
                  >
                    <FaPlus style={{ fontSize: "15px" }} />
                  </Button>
                </Grid>
                <Grid item md={3.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Head Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={account.headcode}
                      placeholder="Please Enter Head Code"
                      onChange={(e) => {
                        setAccount({ ...account, headcode: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Head Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={account.headname}
                      placeholder="Please Enter Head Name"
                      onChange={(e) => {
                        setAccount({ ...account, headname: e.target.value });
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
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Account Head
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Group Name <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={accountgrps}
                        styles={colourStyles}
                        value={{
                          label: selectedgroupnameedit,
                          value: selectedgroupnameedit,
                        }}
                        onChange={(e) => {
                          setSelectedGroupnameedit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Head Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={accountedit.headcode}
                        placeholder="Please Enter Head Code"
                        onChange={(e) => {
                          setAccountEdit({
                            ...accountedit,
                            headcode: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    <Grid item md={12} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Head Name <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={accountedit.headname}
                          placeholder="Please Enter Head Name"
                          onChange={(e) => {
                            setAccountEdit({
                              ...accountedit,
                              headname: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit">
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
      {isUserRoleCompare?.includes("laccounthead") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Account Head List
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
                    <MenuItem value={accountmaster?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelaccounthead") && (
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
                  {isUserRoleCompare?.includes("csvaccounthead") && (
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
                  {isUserRoleCompare?.includes("printaccounthead") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfaccounthead") && (
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
                  {isUserRoleCompare?.includes("imageaccounthead") && (
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
                    maindatas={accountmaster}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={accountmaster}
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
                  {isUserRoleCompare?.includes("bdaccounthead") && (
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
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  pagenamecheck={"Account Head Linked"}
                  selectedRowsHeadLinked={selectedRowsHeadLinked}
                  setSelectedRowsHeadLinked={setSelectedRowsHeadLinked}
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
                  itemsList={accountmaster}
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
              View Account Head
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Group Name</Typography>
                  <Typography>{accountedit.groupname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Head Name</Typography>
                  <Typography>{accountedit.headname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Head Code</Typography>
                  <Typography>{accountedit.headcode}</Typography>
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

      {/* Reason of Leaving  */}
      <Dialog
        open={openviewalert}
        onClose={handleClickOpenviewalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Add Account Group
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter name"
                    value={accountgrp.accountname}
                    onChange={(e) => {
                      setAccountgrp({
                        ...accountgrp,
                        accountname: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Under<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={underOpt}
                    styles={colourStyles}
                    value={{ label: under, value: under }}
                    onChange={(e) => {
                      setUnder(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Alias </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Module version"
                    value={accountgrp.alias}
                    onChange={(e) => {
                      setAccountgrp({ ...accountgrp, alias: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Nature Of Group<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={nature}
                    onChange={(e) => {
                      setNature(e.target.value);
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Please Select Nature Group" disabled>
                      {" "}
                      {"Please Select Nature Group"}{" "}
                    </MenuItem>
                    <MenuItem value="Asset"> {"Asset"} </MenuItem>
                    <MenuItem value="Expenses"> {"Expenses"} </MenuItem>
                    <MenuItem value="Income"> {"Income"} </MenuItem>
                    <MenuItem value="Liabilties"> {"Liabilties"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleSubmitgroup}
                  disabled={isBtn}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCleargroup}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseviewalert}>
                  Cancel
                </Button>
              </Grid>
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
                { check: checktypegrouping?.length > 0, label: "Asset Type Grouping" },
                { check: checkassetmaterial?.length > 0, label: "Asset Material" },
                { check: checkassetdetail?.length > 0, label: "Asset Details List" },
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
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteVendor.headname} `}</span>
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
                  {shouldShowDeleteMessage(accountmaster, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(accountmaster, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(accountmaster, selectedRows, overalldeletecheck) && (
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
        itemsTwo={accountmaster ?? []}
        filename={"Account Head"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Account Head Info"
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

export default Accounthead;
