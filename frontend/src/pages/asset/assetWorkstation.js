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
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaPrint,
} from "react-icons/fa";
import Resizable from "react-resizable";
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

function AssetWorkstation() {
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

  let exportColumnNames = [
    "Specification",
    "Component",
    "Sub Component",
    "Type",
    "Model",
    "Size",
    "Variant",
    "Brand",
    "Serial",
    "Other",
    "Capacity",
    "HDMI Port",
    "VGA Port",
    "DP Port",
    "USB Port",
    "Paneltypescreen",
    "Connectivity",
    "Daterate",
    "Compatibledevice",
    "Outputpower",
    "Collingfancount",
    "Clockspeed",
    "Core",
    "Speed",
    "Frequency",
    "Output",
    "Ehernetports",
    "Distance",
    "Length",
    "Slot",
    "NofChannels",
    "Colours",
  ];
  let exportRowValues = [
    "workstation",
    "categoryname",
    "subcategorynamepdf",
    "type",
    "model",
    "size",
    "variant",
    "brand",
    "serial",
    "other",
    "capacity",
    "hdmiport",
    "vgaport",
    "dpport",
    "usbport",
    "paneltypescreen",
    "connectivity",
    "daterate",
    "compatibledevice",
    "outputpower",
    "collingfancount",
    "clockspeed",
    "core",
    "speed",
    "frequency",
    "output",
    "ethernetports",
    "distance",
    "lengthname",
    "slot",
    "noofchannels",
    "colours",
  ];

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

  const [category, setCategory] = useState({
    categoryname: "",
    workstation: "Please Select Specification",
    type: true,
    model: true,
    size: true,
    variant: true,
    brand: true,
    serial: true,
    other: true,
    capacity: true,
    hdmiport: true,
    vgaport: true,
    dpport: true,
    usbport: true,
    speccheck: true,
    paneltypescreen: true,
    resolution: true,
    connectivity: true,
    daterate: true,
    compatibledevice: true,
    outputpower: true,
    collingfancount: true,
    clockspeed: true,
    core: true,
    speed: true,
    frequency: true,
    output: true,
    ethernetports: true,
    distance: true,
    lengthname: true,
    slot: true,
    noofchannels: true,
    colours: true,
    addedby: "",
    updatedby: "",
  });
  const [subCategoryTodo, setSubcategoryTodo] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const { auth } = useContext(AuthContext);

  const [checkedAll, setCheckedAll] = useState(true);

  useEffect(() => {
    let condition = Object.values(category).every((item) => item === true);
    let array = Object.entries(category).map(([key, value]) => ({
      key: key,
      value: value,
    }));
    let filteredArray = array.filter((data) => {
      return data.value === true || data.value === false;
    });
    let final_checking = filteredArray.filter((data) => {
      return data.value === false && data.key !== "speccheck";
    });
    if (final_checking.length > 0) {
      setCheckedAll(false);
    } else {
      setCheckedAll(true);
    }
  }, [category]);

  const checkingAll = (e) => {
    if (e.target.checked) {
      setCategory((prev) => ({
        ...prev,
        type: true,
        model: true,
        size: true,
        variant: true,
        brand: true,
        serial: true,
        other: true,
        capacity: true,
        hdmiport: true,
        vgaport: true,
        dpport: true,
        usbport: true,
        // speccheck: true,
        paneltypescreen: true,
        resolution: true,
        connectivity: true,
        daterate: true,
        compatibledevice: true,
        outputpower: true,
        collingfancount: true,
        clockspeed: true,
        core: true,
        speed: true,
        frequency: true,
        output: true,
        ethernetports: true,
        distance: true,
        lengthname: true,
        slot: true,
        noofchannels: true,
        colours: true,
      }));
      setCheckedAll(true);
    } else {
      setCategory((prev) => ({
        ...prev,
        type: false,
        model: false,
        size: false,
        variant: false,
        brand: false,
        serial: false,
        other: false,
        capacity: false,
        hdmiport: false,
        vgaport: false,
        dpport: false,
        usbport: false,
        // speccheck: false,
        paneltypescreen: false,
        resolution: false,
        connectivity: false,
        daterate: false,
        compatibledevice: false,
        outputpower: false,
        collingfancount: false,
        clockspeed: false,
        core: false,
        speed: false,
        frequency: false,
        output: false,
        ethernetports: false,
        distance: false,
        lengthname: false,
        slot: false,
        noofchannels: false,
        colours: false,
      }));
      setCheckedAll(false);
    }
  };

  const [singleCategory, setSingleCategory] = useState({
    categoryname: "",
    workstation: "Please Select Specification",
    type: true,
    model: true,
    size: true,
    variant: true,
    brand: true,
    serial: true,
    other: true,
    capacity: true,
    hdmiport: true,
    vgaport: true,
    dpport: true,
    usbport: true,
    speccheck: "",
    paneltypescreen: true,
    resolution: true,
    connectivity: true,
    daterate: true,
    compatibledevice: true,
    outputpower: true,
    collingfancount: true,
    clockspeed: true,
    core: true,
    speed: true,
    frequency: true,
    output: true,
    ethernetports: true,
    distance: true,
    lengthname: true,
    slot: true,
    noofchannels: true,
    colours: true,
  });
  const [editTodo, setEditTodo] = useState([]);
  const [subcategoryEdit, setSubCategoryEdit] = useState("");
  const [assetmaterial, setAssetmaterial] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [openInfo, setOpeninfo] = useState(false);

  const getPhoneNumber = () => {
    if (category.speccheck) {
      setCategory({ ...category, categoryname: category.workstation });
    } else {
      setCategory({ ...category, categoryname: "" });
    }
  };

  useEffect(() => {
    getPhoneNumber();
  }, [category.speccheck, category.workstation]);

  // const getPhoneNumberEdit = () => {
  //   if (singleCategory.speccheck) {
  //     setSingleCategory({ ...singleCategory, categoryname: singleCategory.workstation });
  //   } else {
  //     setSingleCategory({ ...singleCategory, categoryname: singleCategory.categoryname });
  //   }
  // };

  // useEffect(() => {
  //   getPhoneNumberEdit();
  // }, [singleCategory.speccheck, singleCategory.workstation]);

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

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Asset_Specification.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [editDuplicate, setEditDuplicate] = useState([]);
  const [subDuplicate, setSubDuplicate] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const username = isUserRoleAccess?.username;
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [excel, setExcel] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  const [ovProjsub, setOvProjsub] = useState("");

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

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const [openView, setOpenView] = useState(false);
  const handleViewOpen = () => {
    setOpenView(true);
  };
  const handlViewClose = () => {
    setOpenView(false);
  };

  const fetchAssetmaterial = async () => {
    try {
      let res_project = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.assetmaterial?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAssetmaterial(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAssetmaterial();
  }, []);
  const sendRequest = async () => {
    setPageName(!pageName)
    const subcategoryName =

      subCategoryTodo.length === 0 ? subCategoryTodo : [...subCategoryTodo];
    try {
      let res_queue = await axios.post(SERVICE.ASSETWORKSTAION_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        workstation: String(category.workstation),
        categoryname: String(category.categoryname),
        speccheck: Boolean(category.speccheck),
        type: Boolean(category.type),
        model: Boolean(category.model),
        size: Boolean(category.size),
        variant: Boolean(category.variant),
        brand: Boolean(category.brand),
        serial: Boolean(category.serial),
        other: Boolean(category.other),
        capacity: Boolean(category.capacity),
        hdmiport: Boolean(category.hdmiport),
        vgaport: Boolean(category.vgaport),
        dpport: Boolean(category.dpport),
        usbport: Boolean(category.usbport),
        paneltypescreen: Boolean(category.paneltypescreen),
        resolution: Boolean(category.resolution),
        connectivity: Boolean(category.connectivity),
        daterate: Boolean(category.daterate),
        compatibledevice: Boolean(category.compatibledevice),
        outputpower: Boolean(category.outputpower),
        collingfancount: Boolean(category.collingfancount),
        clockspeed: Boolean(category.clockspeed),
        core: Boolean(category.core),
        speed: Boolean(category.speed),
        frequency: Boolean(category.frequency),
        output: Boolean(category.output),
        ethernetports: Boolean(category.ethernetports),
        distance: Boolean(category.distance),
        lengthname: Boolean(category.lengthname),
        slot: Boolean(category.slot),
        noofchannels: Boolean(category.noofchannels),
        colours: Boolean(category.colours),
        subcategoryname: subcategoryName,
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });

      setSubcategoryTodo([]);
      await getCategoryList();
      setloadingdeloverall(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = () => {
    setSubcategoryTodo([]);
    setSubcategory("");
    setCategory({
      categoryname: "",
      workstation: "Please Select Specification",
      type: true,
      model: true,
      size: true,
      variant: true,
      brand: true,
      serial: true,
      other: true,
      capacity: true,
      hdmiport: true,
      vgaport: true,
      dpport: true,
      usbport: true,
      speccheck: true,
      paneltypescreen: true,
      resolution: true,
      connectivity: true,
      daterate: true,
      compatibledevice: true,
      outputpower: true,
      collingfancount: true,
      clockspeed: true,
      core: true,
      speed: true,
      frequency: true,
      output: true,
      ethernetports: true,
      distance: true,
      lengthname: true,
      slot: true,
      noofchannels: true,
      colours: true,
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  let updateby = singleCategory?.updatedby;
  let addedby = singleCategory?.addedby;

  let edititd = singleCategory._id;

  const sendRequestEdit = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.ASSETWORKSTAION_SINGLE}/${edititd}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categoryname: String(singleCategory.categoryname),
          workstation: String(singleCategory.workstation),
          speccheck: Boolean(singleCategory.speccheck),
          type: Boolean(singleCategory.type),
          model: Boolean(singleCategory.model),
          size: Boolean(singleCategory.size),
          variant: Boolean(singleCategory.variant),
          brand: Boolean(singleCategory.brand),
          serial: Boolean(singleCategory.serial),
          other: Boolean(singleCategory.other),
          capacity: Boolean(singleCategory.capacity),
          hdmiport: Boolean(singleCategory.hdmiport),
          vgaport: Boolean(singleCategory.vgaport),
          dpport: Boolean(singleCategory.dpport),
          usbport: Boolean(singleCategory.usbport),

          paneltypescreen: Boolean(singleCategory.paneltypescreen),
          resolution: Boolean(singleCategory.resolution),
          connectivity: Boolean(singleCategory.connectivity),
          daterate: Boolean(singleCategory.daterate),
          compatibledevice: Boolean(singleCategory.compatibledevice),
          outputpower: Boolean(singleCategory.outputpower),
          collingfancount: Boolean(singleCategory.collingfancount),
          clockspeed: Boolean(singleCategory.clockspeed),
          core: Boolean(singleCategory.core),
          speed: Boolean(singleCategory.speed),
          frequency: Boolean(singleCategory.frequency),
          output: Boolean(singleCategory.output),
          ethernetports: Boolean(singleCategory.ethernetports),
          distance: Boolean(singleCategory.distance),
          lengthname: Boolean(singleCategory.lengthname),
          slot: Boolean(singleCategory.slot),
          noofchannels: Boolean(singleCategory.noofchannels),
          colours: Boolean(singleCategory.colours),
          subcategoryname: [...editTodo],
          updatedby: [
            ...updateby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      await getCategoryList();
      await getCategoryListAll();
      setSubCategoryEdit("");
      handleEditClose();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCategoryList = async () => {
    try {
      let response = await axios.get(`${SERVICE.ASSETWORKSTAION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setCategoryList(
        response.data.assetworkstation
          ? response.data.assetworkstation?.map((item, index) => {
            const correctedArray = Array.isArray(item?.subcategoryname)
              ? item?.subcategoryname.map((d) =>
                Array.isArray(d) ? d.subcomponent.join(",") : d.subcomponent
              )
              : [];
            const correctedArraypdf = Array.isArray(item?.subcategoryname)
              ? item?.subcategoryname.map((d, i) =>
                Array.isArray(d)
                  ? `${i + 1}) ` + d.subcomponent
                  : d.subcomponent
              )
              : [];

            let subarrtostring = correctedArraypdf.map(
              (d, i) => ` ${i + 1}) ` + d
            );
            return {
              ...item,
              serialNumber: item.serialNumber,
              categoryname: item.categoryname,
              workstation: item.workstation,
              type: item.type === true ? "Yes" : "No",
              model: item.model === true ? "Yes" : "No",
              size: item.size === true ? "Yes" : "No",
              variant: item.variant === true ? "Yes" : "No",
              brand: item.brand === true ? "Yes" : "No",
              serial: item.serial === true ? "Yes" : "No",
              other: item.other === true ? "Yes" : "No",
              capacity: item.capacity === true ? "Yes" : "No",
              hdmiport: item.hdmiport === true ? "Yes" : "No",
              vgaport: item.vgaport === true ? "Yes" : "No",
              dpport: item.dpport === true ? "Yes" : "No",
              usbport: item.usbport === true ? "Yes" : "No",

              paneltypescreen: item.paneltypescreen === true ? "Yes" : "No",
              resolution: item.resolution === true ? "Yes" : "No",
              connectivity: item.connectivity === true ? "Yes" : "No",
              daterate: item.daterate === true ? "Yes" : "No",
              compatibledevice: item.compatibledevice === true ? "Yes" : "No",
              outputpower: item.outputpower === true ? "Yes" : "No",
              collingfancount: item.collingfancount === true ? "Yes" : "No",
              clockspeed: item.clockspeed === true ? "Yes" : "No",
              core: item.core === true ? "Yes" : "No",
              speed: item.speed === true ? "Yes" : "No",
              frequency: item.frequency === true ? "Yes" : "No",
              output: item.output === true ? "Yes" : "No",
              ethernetports: item.ethernetports === true ? "Yes" : "No",
              distance: item.distance === true ? "Yes" : "No",
              lengthname: item.lengthname === true ? "Yes" : "No",
              slot: item.slot === true ? "Yes" : "No",
              noofchannels: item.noofchannels === true ? "Yes" : "No",
              colours: item.colours === true ? "Yes" : "No",
              subcategoryname: correctedArray,
              subcategorynamelist: item.subcategoryname
                .map((item) => item?.subcomponent)
                .join(",")
                .toString(),
              subcategorynamepdf: subarrtostring,
            };
          })
          : []
      );
      // setEditDuplicate(response.data.doccategory.filter(data => data._id !== singleCategory._id));
      if (response.data.assetworkstation) {
        setSubDuplicate(
          response.data.assetworkstation.filter(
            (data) => data._id !== singleCategory._id
          )
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCategoryListAll = async () => {
    try {
      let response = await axios.get(`${SERVICE.ASSETWORKSTAION}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setSubDuplicate(
        response.data.assetworkstation.filter(
          (data) => data._id !== singleCategory._id
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    getCategoryListAll();
  }, [editOpen, editTodo]);

  const getCategoryId = async () => {
    try {
      let response = await axios.get(`${SERVICE.ASSETWORKSTAION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEditDuplicate(
        response.data.assetworkstation.filter(
          (data) => data._id !== singleCategory._id
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //overall edit section for all pages
  // const getOverallEditSection = async (categoryname, subcategoryname) => {
  //   try {
  //     let res = await axios.post(SERVICE.CATEGORYDOCUMENT_OVERALLEDIT, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       oldname: categoryname,
  //       oldnamesub: subcategoryname,
  //     });
  //     setOvProjCount(res.data.count);
  //     setDocindex(Number(docindex));

  //     setGetOverallCount(` is linked in  ${res.data.documents?.length > 0 ? "Add Documents" : ""}
  //      whether you want to do changes ..??`);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something7 went wrong!"}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  // //overall edit section for all pages
  // const getOverallEditSectionUpdate = async () => {
  //   try {
  //     let res = await axios.post(SERVICE.CATEGORYDOCUMENT_OVERALLEDIT, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       oldname: ovProj,
  //       oldnamesub: ovProjsub,
  //     });
  //     sendEditRequestOverall(res.data.documents);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something9 went wrong!"}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  // const sendEditRequestOverall = async (documents) => {
  //   try {
  //     if (documents.length > 0) {
  //       let answ = documents.map((d, i) => {
  //         let res = axios.put(`${SERVICE.DOCUMENT_SINGLE}/${d._id}`, {
  //           headers: {
  //             Authorization: `Bearer ${auth.APIToken}`,
  //           },
  //           categoryname: String(singleCategory.categoryname),
  //           subcategoryname: String(editTodo[docindex]),
  //         });
  //       });
  //     }
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 10went wrong!"}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  const getCode = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSETWORKSTAION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res.data.sassetworkstation);
      setEditTodo(res.data.sassetworkstation.subcategoryname);
      getCategoryId();
      handleEditOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCodeView = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSETWORKSTAION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res.data.sassetworkstation);
      setEditTodo(res.data.sassetworkstation.subcategoryname);
      handleViewOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCodeInfo = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSETWORKSTAION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleCategory(res.data.sassetworkstation);
      setEditTodo(res.data.sassetworkstation.subcategoryname);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [deletedocument, setDeletedocument] = useState({});
  const [checkdoc, setCheckdoc] = useState();

  const rowData = async (id, categoryname) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ASSETWORKSTAION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletedocument(res.data.sassetworkstation);

      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let deleteId = deletedocument?._id;

  const deleteData = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(
        `${SERVICE.ASSETWORKSTAION_SINGLE}/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await getCategoryList();
      await getCategoryListAll();

      handleCloseDelete();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delAssetworkcheckbox = async () => {
    setPageName(!pageName)
    try {
      // selectedRows?.map((item) => {
      //     let res = axios.delete(`${SERVICE.ASSETWORKSTAION_SINGLE}/${item}`, {
      //         headers: {
      //             'Authorization': `Bearer ${auth.APIToken}`
      //         },
      //     });
      // })
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSETWORKSTAION_SINGLE}/${item}`, {
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

      await getCategoryList();
      await getCategoryListAll();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const addTodo = () => {
    getCategoryList();
    // const isSubNameMatch = subCategoryTodo.some(
    //   (item) => item?.toLowerCase() === subcategory?.toLowerCase()
    // );
    const isSubNameMatch = subCategoryTodo.some((item) => item.subcomponent?.toLowerCase() === subcategory?.toLowerCase());

    if (subcategory === "") {
      setPopupContentMalert("Please Enter SubComponent!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (subCategoryTodo.some((item) => item.subcomponent?.toLowerCase() === subcategory?.toLowerCase())) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another SubComponent "}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (isSubNameMatch) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another SubComponent!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSubcategoryTodo([
        ...subCategoryTodo,
        {
          subcomponent: subcategory,
          other: true,
          type: true,
          model: true,
          size: true,
          variant: true,
          brand: true,
          serial: true,
          othe: true,
          capacity: true,
          hdmiport: true,
          vgaport: true,
          dpport: true,
          usbport: true,
          paneltypescreen: true,
          resolution: true,
          connectivity: true,
          daterate: true,
          compatibledevice: true,
          outputpower: true,
          collingfancount: true,
          clockspeed: true,
          core: true,
          speed: true,
          frequency: true,
          output: true,
          ethernetports: true,
          distance: true,
          lengthname: true,
          slot: true,
          noofchannels: true,
          colours: true,
        },
      ]);
      setSubcategory("");

      setCategory({
        ...category,
        type: false,
        model: false,
        size: false,
        variant: false,
        brand: false,
        serial: false,
        other: false,
        capacity: false,
        hdmiport: false,
        vgaport: false,
        dpport: false,
        usbport: false,
        paneltypescreen: false,
        resolution: false,
        connectivity: false,
        daterate: false,
        compatibledevice: false,
        outputpower: false,
        collingfancount: false,
        clockspeed: false,
        core: false,
        speed: false,
        frequency: false,
        output: false,
        ethernetports: false,
        distance: false,
        lengthname: false,
        slot: false,
        noofchannels: false,
        colours: false,
      });
    }
  };

  const EditTodoPopup = (index, newValue) => {
    // const onlSub = categoryList.map((data) => data.subcategoryname);
    // let concatenatedArray = [].concat(...onlSub);
    // const isDuplicate = concatenatedArray.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    getCategoryList();
    if (subcategoryEdit === "") {
      setPopupContentMalert("Please Enter  SubComponent!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // if (isDuplicate) {
    //   // Handle duplicate case, show an error message, and return early
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added! Please Enter Another Subcategory"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    //   return;
    // }
    else if (
      editTodo.some(
        (item) => item.subcomponent?.toLowerCase() === subcategoryEdit?.toLowerCase()
      )
    ) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another SubComponent!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      // setEditTodo([...editTodo, subcategoryEdit]);
      setEditTodo([
        ...editTodo,
        {
          subcomponent: subcategoryEdit,
          other: true,
          type: true,
          model: true,
          size: true,
          variant: true,
          brand: true,
          serial: true,
          othe: true,
          capacity: true,
          hdmiport: true,
          vgaport: true,
          dpport: true,
          usbport: true,
          paneltypescreen: true,
          resolution: true,
          connectivity: true,
          daterate: true,
          compatibledevice: true,
          outputpower: true,
          collingfancount: true,
          clockspeed: true,
          core: true,
          speed: true,
          frequency: true,
          output: true,
          ethernetports: true,
          distance: true,
          lengthname: true,
          slot: true,
          noofchannels: true,
          colours: true,
        },
      ]);

      setSubCategoryEdit("");

      setSingleCategory({
        ...singleCategory,
        type: false,
        model: false,
        size: false,
        variant: false,
        brand: false,
        serial: false,
        other: false,
        capacity: false,
        hdmiport: false,
        vgaport: false,
        dpport: false,
        usbport: false,
        paneltypescreen: false,
        resolution: false,
        connectivity: false,
        daterate: false,
        compatibledevice: false,
        outputpower: false,
        collingfancount: false,
        clockspeed: false,
        core: false,
        speed: false,
        frequency: false,
        output: false,
        ethernetports: false,
        distance: false,
        lengthname: false,
        slot: false,
        noofchannels: false,
        colours: false,
      });
    }
  };

  const handleTodoEdit = (index, name, newValue) => {
    // if (name == "subcomponent") {
    // const isDuplicate = subCategoryTodo.some((item, i) => i !== index && item?.toLowerCase() === newValue.toLowerCase());

    //   if (isDuplicate) {
    //     // Handle duplicate case, show an error message, and return early
    //     setShowAlert(
    //       <>
    //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added! Please Enter Another SubComponent"}</p>
    //       </>
    //     );
    //     handleClickOpenerr();
    //     return;
    //   }
    //   else {
    //     if (subCategoryTodo.some((item) => item?.toLowerCase() === newValue?.toLowerCase())) {
    //       setShowAlert(
    //         <>
    //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another Subcategory "}</p>
    //         </>
    //       );
    //       handleClickOpenerr();
    //       return;
    //     }
    //   }
    // }
    const updatedTodos = [...subCategoryTodo];
    updatedTodos[index][name] = newValue;
    setSubcategoryTodo(updatedTodos);
  };

  const handleTodoEditPop = (index, name, newValue) => {
    // if (name === "subcomponent") {
    //   const onlSub = categoryList.map((data) => data.subcategoryname);
    //   let concatenatedArray = [].concat(...onlSub);

    //   // Check if newValue already exists in the editDuplicate array
    //   const isDuplicate = concatenatedArray?.some((item, i) => i !== index && item?.toLowerCase() === newValue?.toLowerCase());
    //   if (isDuplicate) {
    //     // Handle duplicate case, show an error message, and return early
    //     setShowAlert(
    //       <>
    //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added! Please Enter Another SubComponent"}</p>
    //       </>
    //     );
    //     handleClickOpenerr();
    //     return;
    //   }
    // }
    // If no duplicate is found, update the editTodo array
    const updatedTodos = [...editTodo];
    updatedTodos[index][name] = newValue;

    setEditTodo(updatedTodos);
  };

  const handleSubmit = () => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    // let matchValue = subCategoryTodo.filter((data) => data === subCategoryTodo.includes(data));
    const isNameMatch = categoryList?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        category?.categoryname.toLowerCase() &&
        item.workstation === category.workstation
    );
    const isSubNameMatch = subDuplicate.some((item) =>
      subCategoryTodo.includes(item)
    );
    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert(
        "Already Added ! Please Enter Another subcategory!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.workstation === "Please Select Specification") {
      setPopupContentMalert("Please Select Specification!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (category.categoryname === "") {
      setPopupContentMalert("Please Enter Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategory !== "") {
      setPopupContentMalert("Add SubComponent Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (category.categoryname !== "" && subcategory.length > 0 && subCategoryTodo.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter SubComponent"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (category.categoryname == "" && subCategoryTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      subCategoryTodo.length > 0 &&
      subCategoryTodo.some((item) => item === "")
    ) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subCategoryTodo.some((item) => item.subcomponent === "")) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleSubmitEdit = () => {
    setPageName(!pageName)
    getCategoryListAll();
    const isNameMatch = subDuplicate?.some(
      (item) =>
        item?.categoryname?.toLowerCase() ===
        singleCategory?.categoryname.toLowerCase() &&
        item.workstation === singleCategory.workstation
    );
    const isSubNameMatch = editDuplicate.some((item) =>
      item.subcategoryname.includes(item)
    );
    // const isSubNameMatchTodo = editDuplicate.some((item) => item.subcategoryname.includes(subcategoryEdit));
    // const correctedArray = Array.isArray(editTodo) ? editTodo.map((d) => (Array.isArray(d) ? d.join(",") : d)) : [];
    // let subname = correctedArray.toString();

    // let conditon = "The" + " " + (singleCategory.categoryname !== ovProj && editTodo[docindex] !== ovProjsub[docindex] ? ovProj + ovProjsub[docindex] : singleCategory.categoryname !== ovProj ? ovProj : ovProjsub[docindex]);

    if (isNameMatch) {
      setPopupContentMalert("Already Added ! Please Enter Another Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (isSubNameMatch) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another SubComponent "}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (singleCategory.workstation === "Please Select Specification") {
      setPopupContentMalert("Please Select Specification!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleCategory.categoryname === "") {
      setPopupContentMalert("Please Enter Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit !== "") {
      setPopupContentMalert("Add Sub Component Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item === "")) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {
      setPopupContentMalert("Please Enter SubComponent!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subcategoryEdit === "" && editTodo.length === 0) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length > 0 && editTodo.length === 0) {
      setPopupContentMalert("Please Insert SubComponent!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.length === 0) {
      setPopupContentMalert("Please Insert Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editTodo.some((item) => item.subcomponent === "")) {
      setPopupContentMalert("Please Enter Sub Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    // else if (editTodo.length !== new Set(editTodo.map(item => item.toLowerCase())).size) {

    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Added ! Please Enter Another SubComponent "}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    //   return;
    // }
    else {
      sendRequestEdit();
    }
  };

  const deleteTodo = (index) => {
    const updatedTodos = [...subCategoryTodo];
    updatedTodos.splice(index, 1);
    setSubcategoryTodo(updatedTodos);

    if (updatedTodos.length === 0) {
      setCategory({
        ...category,
        type: true,
        model: true,
        size: true,
        variant: true,
        brand: true,
        serial: true,
        other: true,
        capacity: true,
        hdmiport: true,
        vgaport: true,
        dpport: true,
        usbport: true,
        paneltypescreen: true,
        resolution: true,
        connectivity: true,
        daterate: true,
        compatibledevice: true,
        outputpower: true,
        collingfancount: true,
        clockspeed: true,
        core: true,
        speed: true,
        frequency: true,
        output: true,
        ethernetports: true,
        distance: true,
        lengthname: true,
        slot: true,
        noofchannels: true,
        colours: true,
      });
    }
  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...editTodo];
    updatedTodos.splice(index, 1);
    setEditTodo(updatedTodos);
    if (updatedTodos.length === 0) {
      setSingleCategory({
        ...singleCategory,
        type: true,
        model: true,
        size: true,
        variant: true,
        brand: true,
        serial: true,
        other: true,
        capacity: true,
        hdmiport: true,
        vgaport: true,
        dpport: true,
        usbport: true,
        paneltypescreen: true,
        resolution: true,
        connectivity: true,
        daterate: true,
        compatibledevice: true,
        outputpower: true,
        collingfancount: true,
        clockspeed: true,
        core: true,
        speed: true,
        frequency: true,
        output: true,
        ethernetports: true,
        distance: true,
        lengthname: true,
        slot: true,
        noofchannels: true,
        colours: true,
      });
    }
  };

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
  const dataGridStyles = {
    root: {
      "& .MuiDataGrid-row": {
        height: "15px",
      },
    },
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    categoryname: true,
    workstation: true,
    type: true,
    model: true,
    size: true,
    variant: true,
    brand: true,
    serial: true,
    other: true,
    capacity: true,
    hdmiport: true,
    vgaport: true,
    dpport: true,
    usbport: true,
    paneltypescreen: true,
    resolution: true,
    connectivity: true,
    daterate: true,
    compatibledevice: true,
    outputpower: true,
    collingfancount: true,
    clockspeed: true,
    core: true,
    speed: true,
    frequency: true,
    output: true,
    ethernetports: true,
    distance: true,
    lengthname: true,
    slot: true,
    noofchannels: true,
    colours: true,
    subcategoryname: true,

    subcategorynamelist: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = categoryList?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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
    Math.abs(firstVisiblePage + visiblePages - 1),
    totalPages
  );

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }
  const [isOpen, setIsOpen] = useState(false);

  const handleMakeOpen = () => {
    setIsOpen(true);
  };

  const handleMakeClose = () => {
    setIsOpen(false);
  };
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
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },

    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "workstation",
      headerName: "Specification",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.workstation,
    },
    {
      field: "categoryname",
      headerName: "Component",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.categoryname,
    },

    {
      field: "type",
      headerName: "Type",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.type,
    },
    {
      field: "model",
      headerName: "Model",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.model,
    },
    {
      field: "size",
      headerName: "Size",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.size,
    },
    {
      field: "variant",
      headerName: "Variant",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.variant,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.brand,
    },
    {
      field: "serial",
      headerName: "Serial",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serial,
    },
    {
      field: "other",
      headerName: "Other",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.other,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.capacity,
    },
    {
      field: "hdmiport",
      headerName: "HDMI Port",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.hdmiport,
    },
    {
      field: "vgaport",
      headerName: "VGA Port",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.vgaport,
    },
    {
      field: "dpport",
      headerName: "DP Port",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.dpport,
    },
    {
      field: "usbport",
      headerName: "USB Port",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.usbport,
    },
    {
      field: "paneltypescreen",
      headerName: "Panel Type",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.paneltypescreen,
    },
    {
      field: "resolution",
      headerName: "Screen Resolution ",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.resolution,
    },
    {
      field: "connectivity",
      headerName: "Connectivity",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.connectivity,
    },
    {
      field: "daterate",
      headerName: "Date Rate",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.daterate,
    },
    {
      field: "compatibledevice",
      headerName: "Compatible Device",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.compatibledevice,
    },
    {
      field: "outputpower",
      headerName: "Outpower",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.outputpower,
    },
    {
      field: "collingfancount",
      headerName: "Colling Fancount",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.collingfancount,
    },
    {
      field: "clockspeed",
      headerName: "Clockspeed",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.clockspeed,
    },
    {
      field: "core",
      headerName: "Core",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.core,
    },
    {
      field: "speed",
      headerName: "Speed",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.speed,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.frequency,
    },
    {
      field: "output",
      headerName: "Output",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.output,
    },
    {
      field: "ethernetports",
      headerName: "Ethernetports",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.ethernetports,
    },
    {
      field: "distance",
      headerName: "Distance",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.distance,
    },
    {
      field: "lengthname",
      headerName: "Length",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.lengthname,
    },
    {
      field: "slot",
      headerName: "Slot",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.slot,
    },
    {
      field: "noofchannels",
      headerName: "No of Channels",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.noofchannels,
    },
    {
      field: "colours",
      headerName: "Colours",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.colours,
    },
    {
      field: "subcategorynamelist",
      headerName: "Sub Component",

      flex: 0,
      width: 250,
      minHeight: "40px",
      hide: !columnVisibility.subcategorynamelist,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassetspecification") && (
            <Button
              onClick={() => {
                getCode(params.row.id);
              }}
              sx={userStyle.buttonedit}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dassetspecification") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vassetspecification") && (
            <Button
              sx={userStyle.buttonview}
              onClick={(e) => {
                getCodeView(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iassetspecification") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeInfo(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    const correctedArray = Array.isArray(item?.subcategoryname)
      ? item?.subcategoryname.map((d) =>
        Array.isArray(d) ? d.subcomponent.join(",") : d.subcomponent
      )
      : [];
    const correctedArraypdf = Array.isArray(item?.subcategoryname)
      ? item?.subcategoryname.map((d, i) =>
        Array.isArray(d) ? `${i + 1}) ` + d.subcomponent : d.subcomponent
      )
      : [];

    let subarrtostring = correctedArraypdf.map((d, i) => ` ${i + 1}) ` + d);
    return {
      id: item._id,
      serialNumber: item?.serialNumber,
      categoryname: item?.categoryname,
      workstation: item?.workstation,
      type: item?.type,
      model: item?.model,
      size: item?.size,
      variant: item?.variant,
      brand: item?.brand,
      serial: item?.serial,
      other: item?.other,
      capacity: item?.capacity,
      hdmiport: item?.hdmiport,
      vgaport: item?.vgaport,
      dpport: item?.dpport,
      usbport: item?.usbport,
      paneltypescreen: item?.paneltypescreen,
      resolution: item?.resolution,
      connectivity: item?.connectivity,
      daterate: item?.daterate,
      compatibledevice: item?.compatibledevice,
      outputpower: item?.outputpower,
      collingfancount: item?.collingfancount,
      clockspeed: item?.clockspeed,
      core: item?.core,
      speed: item?.speed,
      frequency: item?.frequency,
      output: item?.output,
      ethernetports: item?.ethernetports,
      distance: item?.distance,
      lengthname: item?.lengthname,
      slot: item?.slot,
      noofchannels: item?.noofchannels,
      colours: item?.colours,

      subcategoryname: item?.subcategoryname,
      subcategorynamelist: item?.subcategorynamelist,
      subcategorynamepdf: item?.subcategorynamepdf,
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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Asset_Specfication",
    pageStyle: "print",
  });

  //  PDF
  const columns = [
    { title: "S.No ", field: "serialNumber" },
    { title: "Specification", field: "workstation" },
    { title: "Component ", field: "categoryname" },
    { title: "Type", field: "type" },
    { title: "Model", field: "model" },
    { title: "Size", field: "size" },
    { title: "Variant", field: "variant" },
    { title: "Brand", field: "brand" },
    { title: "Serial", field: "serial" },
    { title: "Other", field: "other" },
    { title: "Capacity", field: "capacity" },
    { title: "HDMI ", field: "hdmiport" },
    { title: "VGA Port ", field: "vgaport" },
    { title: "DP Port ", field: "dpport" },
    { title: "USB Port ", field: "usbport" },
    { title: "SubComponent", field: "subcategorynamepdf" },

    { title: "Paneltypescreen", field: "paneltypescreen" },
    { title: "Connectivity", field: "connectivity" },
    { title: "Compatibledevice", field: "compatibledevice" },
    { title: "Outputpower", field: "outputpower" },
    { title: "Collingfancount", field: "collingfancount" },
    { title: "Clockspeed", field: "clockspeed" },
    { title: "Core", field: "core" },
    { title: "Speed", field: "speed" },
    { title: "Frequency ", field: "frequency" },
    { title: "Output ", field: "output" },
    { title: "Ehernetports ", field: "ethernetports" },
    { title: "Distance ", field: "distance" },

    { title: "Length", field: "lengthname" },
    { title: "Slot", field: "slot" },
    { title: "Nofchannels ", field: "noofchannels" },
    { title: "Colours ", field: "colours" },

    { title: "SubComponent", field: "subcategorynamepdf" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
        }))
        : categoryList.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      // columns: columnsWithSerial,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Specification.pdf");
  };

  useEffect(() => {
    if (category.speccheck) {
      setCategory((prevCategory) => ({
        ...prevCategory,
        categoryname:
          prevCategory.workstation === "Please Select Specification"
            ? ""
            : prevCategory.workstation,
      }));
    } else {
      setCategory((prevCategory) => ({
        ...prevCategory,
        categoryname: "",
      }));
    }
  }, [category.speccheck, category.workstation]);

  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      {isUserRoleCompare?.includes("aassetspecification") && (
        <>
          <Box sx={userStyle.container}>
            <Headtitle title={"Asset Specification"} />

            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* <Typography sx={userStyle.HeaderText}>
                  Add Asset Specification
                </Typography> */}
                <PageHeading
                  title="Add Asset Specification"
                  modulename="Asset"
                  submodulename="Master"
                  mainpagename="Asset Specification"
                  subpagename=""
                  subsubpagename=""
                />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={subcategory != ""}
                        onChange={(e) => checkingAll(e)}
                      />
                    }
                    label="Select All"
                    checked={checkedAll}
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography>
                    Specification <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <Selects
                    options={assetmaterial}
                    styles={colourStyles}
                    value={{
                      label: category.workstation,
                      value: category.workstation,
                    }}
                    onChange={(e) => {
                      setCategory({
                        ...category,
                        workstation: e.value,
                      });
                    }}
                  />
                </FormControl>
                <Grid>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={category.speccheck} />}
                      onChange={(e) =>
                        setCategory({
                          ...category,
                          speccheck: !category.speccheck,
                        })
                      }
                      label="Same as Specification"
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Component <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    readOnly={category.speccheck}
                    placeholder="Please Enter Component"
                    value={category.categoryname}
                    onChange={(e) => {
                      setCategory({
                        ...category,
                        categoryname: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} sm={12} xs={12}></Grid>

              <Grid item md={12} xs={12} sm={12} marginTop={3}>
                <Grid container spacing={1}>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.resolution === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true
                            )}
                            checked={category.type}
                            onChange={(e) =>
                              setCategory({ ...category, type: !category.type })
                            }
                          />
                        }
                        label="Type"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.model}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                model: !category.model,
                              })
                            }
                          />
                        }
                        label="Model"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.size}
                            onChange={(e) =>
                              setCategory({ ...category, size: !category.size })
                            }
                          />
                        }
                        label="Size"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.variant}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                variant: !category.variant,
                              })
                            }
                          />
                        }
                        label="Variant"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.brand}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                brand: !category.brand,
                              })
                            }
                          />
                        }
                        label="Brand"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.serial}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                serial: !category.serial,
                              })
                            }
                          />
                        }
                        label="Serial"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.other}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                other: !category.other,
                              })
                            }
                          />
                        }
                        label="Other"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.capacity}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                capacity: !category.capacity,
                              })
                            }
                          />
                        }
                        label="Capacity"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.hdmiport}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                hdmiport: !category.hdmiport,
                              })
                            }
                          />
                        }
                        label="HDMI Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.vgaport}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                vgaport: !category.vgaport,
                              })
                            }
                          />
                        }
                        label="VGA Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.dpport}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                dpport: !category.dpport,
                              })
                            }
                          />
                        }
                        label="DP port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true ||
                                item.resolution === true
                            )}
                            checked={category.usbport}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                usbport: !category.usbport,
                              })
                            }
                          />
                        }
                        label="USB Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.paneltypescreen}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                paneltypescreen: !category.paneltypescreen,
                              })
                            }
                          />
                        }
                        label="Panel Type"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.resolution}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                resolution: !category.resolution,
                              })
                            }
                          />
                        }
                        label="Screen Resolution"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.connectivity}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                connectivity: !category.connectivity,
                              })
                            }
                          />
                        }
                        label="Connectivity"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true ||
                                item.resolution === true
                            )}
                            checked={category.daterate}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                daterate: !category.daterate,
                              })
                            }
                          />
                        }
                        label="Date Rate"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.compatibledevice}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                compatibledevice: !category.compatibledevice,
                              })
                            }
                          />
                        }
                        label="Compatible Device"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.outputpower}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                outputpower: !category.outputpower,
                              })
                            }
                          />
                        }
                        label="Output Power"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.collingfancount}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                collingfancount: !category.collingfancount,
                              })
                            }
                          />
                        }
                        label="Colling Fan Count"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.clockspeed}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                clockspeed: !category.clockspeed,
                              })
                            }
                          />
                        }
                        label="Clock Speed"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.core}
                            onChange={(e) =>
                              setCategory({ ...category, core: !category.core })
                            }
                          />
                        }
                        label="Core"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.speed}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                speed: !category.speed,
                              })
                            }
                          />
                        }
                        label="Speed"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.frequency}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                frequency: !category.frequency,
                              })
                            }
                          />
                        }
                        label="Frequency"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.output}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                output: !category.output,
                              })
                            }
                          />
                        }
                        label="Output"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.ethernetports}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                ethernetports: !category.ethernetports,
                              })
                            }
                          />
                        }
                        label="Ethernet Ports"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.distance}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                distance: !category.distance,
                              })
                            }
                          />
                        }
                        label="Distance"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.lengthname}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                lengthname: !category.lengthname,
                              })
                            }
                          />
                        }
                        label="Length"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.slot}
                            onChange={(e) =>
                              setCategory({ ...category, slot: !category.slot })
                            }
                          />
                        }
                        label="Slot"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.noofchannels}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                noofchannels: !category.noofchannels,
                              })
                            }
                          />
                        }
                        label="No of Channels"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={subCategoryTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={category.colours}
                            onChange={(e) =>
                              setCategory({
                                ...category,
                                colours: !category.colours,
                              })
                            }
                          />
                        }
                        label="Colours"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />

            <br />
            <Grid container spacing={1}>
              <Grid item md={4} sm={10} xs={10}>
                <FormControl fullWidth size="small">
                  <Typography>SubComponent</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubComponent"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1.5} sm={2} xs={2} marginTop={3}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={
                    category.type ||
                    category.model ||
                    category.size ||
                    category.variant ||
                    category.brand ||
                    category.serial ||
                    category.other ||
                    category.capacity ||
                    category.hdmiport ||
                    category.vgaport ||
                    category.dpport ||
                    category.usbport ||
                    category.paneltypescreen ||
                    category.connectivity ||
                    category.daterate ||
                    category.compatibledevice ||
                    category.outputpower ||
                    category.collingfancount ||
                    category.clockspeed ||
                    category.core ||
                    category.speed ||
                    category.frequency ||
                    category.output ||
                    category.ethernetports ||
                    category.distance ||
                    category.lengthname ||
                    category.slot ||
                    category.noofchannels ||
                    category.resolution ||
                    category.colours
                  }
                  onClick={addTodo}
                  type="button"
                  sx={{
                    minWidth: "35px",
                    // marginTop: "25px",
                    padding: "11px 10px",
                  }}
                >
                  <FaPlus />
                </Button>
                &nbsp;
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={12} sm={12} xs={12}>
                {subCategoryTodo?.length > 0 && (
                  <ul type="none">
                    {subCategoryTodo?.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid container spacing={2}>
                            <Grid item md={4} sm={10} xs={10}>
                              <FormControl fullWidth size="small">
                                <Typography>SubComponent</Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  placeholder="Please Enter SubComponent"
                                  value={item.subcomponent}
                                  onChange={(e) =>
                                    handleTodoEdit(
                                      index,
                                      "subcomponent",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>

                            {/* <Grid item md={1} sm={2} xs={2}>
                              <Button
                                variant="contained"
                                color="error"
                                type="button"

                                onClick={(e) => {
                                  deleteTodo(index);

                                  subCategoryTodo.length == 0 ?
                                    setCategory({
                                      ...category,
                                      type: false,
                                      model: false,
                                      size: false,
                                      variant: false,
                                      brand: false,
                                      serial: false,
                                      other: false,
                                      capacity: false,
                                      hdmiport: false,
                                      vgaport: false,
                                      dpport: false,
                                      usbport: false,
                                    })
                                    : null

                                }
                                }
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "28px",
                                  padding: "6px 10px",
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            </Grid> */}
                            <Grid item md={1} sm={2} xs={2}>
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={(e) => {
                                  deleteTodo(index);
                                }}
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
                          </Grid>
                          <br />
                          <Grid container spacing={1}>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.type}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "type",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Type"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.model}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "model",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Model"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.size}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "size",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Size"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.variant}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "variant",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Variant"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.brand}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "brand",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Brand"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.serial}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "serial",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Serial"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.other}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "other",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Other"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.capacity}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "capacity",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Capacity"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.hdmiport}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "hdmiport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="HDMI Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.vgaport}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "vgaport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="VGA Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.dpport}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "dpport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="DP port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.usbport}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "usbport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="USB Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.paneltypescreen}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "paneltypescreen",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Panel Type"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.resolution}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "resolution",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Screen Resolution"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.connectivity}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "connectivity",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Connectivity"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.daterate}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "daterate",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Date Rate"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.compatibledevice}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "compatibledevice",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Compatible Device"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.outputpower}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "outputpower",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Output Power"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.collingfancount}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "collingfancount",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Colling Fan Count"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.clockspeed}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "clockspeed",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Clock Speed"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.core}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "core",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Core"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.speed}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "speed",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Speed"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.frequency}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "frequency",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Frequency"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.output}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "output",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Output"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.ethernetports}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "ethernetports",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Ethernet Ports"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.distance}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "distance",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Distance"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.lengthname}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "lengthname",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Length"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.slot}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "slot",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Slot"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.noofchannels}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "noofchannels",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="No of Channels"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.colours}
                                      onChange={(e) =>
                                        handleTodoEdit(
                                          index,
                                          "colours",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Colours"
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
                          <br />
                          <Divider />
                          <br />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Grid>
            </Grid>
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
                {/* <Button variant="contained" onClick={handleSubmit}>
                  SAVE
                </Button> */}
                <LoadingButton
                  onClick={handleSubmit}
                  loading={loadingdeloverall}
                  color="primary"
                  loadingPosition="end"
                  variant="contained"
                >
                  Submit
                </LoadingButton>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  CLEAR
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
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
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlert}
            </Typography>
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
      <Box>
        <Dialog
          maxWidth="lg"
          fullWidth={true}
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ padding: "10px 35px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Asset Specification
                </Typography>
              </Grid>
              {/* <Grid item md={2}></Grid> */}
              <Grid item md={6} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <Typography>
                    Specification <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <Selects
                    options={assetmaterial}
                    styles={colourStyles}
                    value={{
                      label: singleCategory.workstation,
                      value: singleCategory.workstation,
                    }}
                    onChange={(e) => {
                      setSingleCategory({
                        ...singleCategory,
                        workstation: e.value,
                      });
                    }}
                  />
                </FormControl>
                <Grid>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={singleCategory.speccheck} />}
                      onChange={(e) =>
                        setSingleCategory({
                          ...singleCategory,
                          speccheck: !singleCategory.speccheck,
                          categoryname: e.target.checked
                            ? singleCategory.workstation
                            : "",
                        })
                      }
                      label="Same as Specification"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Component <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category Name"
                    readOnly={singleCategory.speccheck}
                    value={singleCategory.categoryname}
                    onChange={(e) => {
                      setSingleCategory({
                        ...singleCategory,
                        categoryname: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12} marginTop={3}>
                <Grid container spacing={1}>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.type}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                type: !singleCategory.type,
                              })
                            }
                          />
                        }
                        label="Type"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.model}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                model: !singleCategory.model,
                              })
                            }
                          />
                        }
                        label="Model"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.size}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                size: !singleCategory.size,
                              })
                            }
                          />
                        }
                        label="Size"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.variant}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                variant: !singleCategory.variant,
                              })
                            }
                          />
                        }
                        label="Variant"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.brand}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                brand: !singleCategory.brand,
                              })
                            }
                          />
                        }
                        label="Brand"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.serial}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                serial: !singleCategory.serial,
                              })
                            }
                          />
                        }
                        label="Serial"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.other}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                other: !singleCategory.other,
                              })
                            }
                          />
                        }
                        label="Other"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.capacity}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                capacity: !singleCategory.capacity,
                              })
                            }
                          />
                        }
                        label="Capacity"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.hdmiport}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                hdmiport: !singleCategory.hdmiport,
                              })
                            }
                          />
                        }
                        label="HDMI Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.vgaport}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                vgaport: !singleCategory.vgaport,
                              })
                            }
                          />
                        }
                        label="VGA Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.dpport}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                dpport: !singleCategory.dpport,
                              })
                            }
                          />
                        }
                        label="DP port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.usbport}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                usbport: !singleCategory.usbport,
                              })
                            }
                          />
                        }
                        label="USB Port"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.paneltypescreen}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                paneltypescreen:
                                  !singleCategory.paneltypescreen,
                              })
                            }
                          />
                        }
                        label="Panel Type"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.resolution}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                resolution: !singleCategory.resolution,
                              })
                            }
                          />
                        }
                        label="Screen Resolution"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.connectivity}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                connectivity: !singleCategory.connectivity,
                              })
                            }
                          />
                        }
                        label="Connectivity"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.daterate}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                daterate: !singleCategory.daterate,
                              })
                            }
                          />
                        }
                        label="Date Rate"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.compatibledevice}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                compatibledevice:
                                  !singleCategory.compatibledevice,
                              })
                            }
                          />
                        }
                        label="Compatible Device"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.outputpower}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                outputpower: !singleCategory.outputpower,
                              })
                            }
                          />
                        }
                        label="Output Power"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.collingfancount}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                collingfancount:
                                  !singleCategory.collingfancount,
                              })
                            }
                          />
                        }
                        label="Colling Fan Count"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.clockspeed}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                clockspeed: !singleCategory.clockspeed,
                              })
                            }
                          />
                        }
                        label="Clock Speed"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.core}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                core: !singleCategory.core,
                              })
                            }
                          />
                        }
                        label="Core"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.speed}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                speed: !singleCategory.speed,
                              })
                            }
                          />
                        }
                        label="Speed"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.frequency}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                frequency: !singleCategory.frequency,
                              })
                            }
                          />
                        }
                        label="Frequency"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.output}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                output: !singleCategory.output,
                              })
                            }
                          />
                        }
                        label="Output"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.ethernetports}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                ethernetports: !singleCategory.ethernetports,
                              })
                            }
                          />
                        }
                        label="Ethernet Ports"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.distance}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                distance: !singleCategory.distance,
                              })
                            }
                          />
                        }
                        label="Distance"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.lengthname}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                lengthname: !singleCategory.lengthname,
                              })
                            }
                          />
                        }
                        label="Length"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.slot}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                slot: !singleCategory.slot,
                              })
                            }
                          />
                        }
                        label="Slot"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.noofchannels}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                noofchannels: !singleCategory.noofchannels,
                              })
                            }
                          />
                        }
                        label="No of Channels"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={editTodo.some(
                              (item) =>
                                item.type === true ||
                                item.model === true ||
                                item.size === true ||
                                item.variant === true ||
                                item.brand === true ||
                                item.serial === true ||
                                item.other === true ||
                                item.capacity === true ||
                                item.hdmiport === true ||
                                item.vgaport === true ||
                                item.dpport === true ||
                                item.usbport ||
                                item.paneltypescreen === true ||
                                item.connectivity === true ||
                                item.daterate === true ||
                                item.compatibledevice === true ||
                                item.outputpower === true ||
                                item.collingfancount === true ||
                                item.clockspeed === true ||
                                item.core === true ||
                                item.speed === true ||
                                item.frequency === true ||
                                item.output === true ||
                                item.ethernetports === true ||
                                item.distance === true ||
                                item.lengthname === true ||
                                item.slot === true ||
                                item.noofchannels === true ||
                                item.colours === true ||
                                item.resolution === true
                            )}
                            checked={singleCategory.colours}
                            onChange={(e) =>
                              setSingleCategory({
                                ...singleCategory,
                                colours: !singleCategory.colours,
                              })
                            }
                          />
                        }
                        label="Colours"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={5} sm={10} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography> subcomponent</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter SubComponent"
                    value={subcategoryEdit}
                    onChange={(e) => setSubCategoryEdit(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} sm={2} xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={
                    singleCategory.type ||
                    singleCategory.model ||
                    singleCategory.size ||
                    singleCategory.variant ||
                    singleCategory.brand ||
                    singleCategory.serial ||
                    singleCategory.other ||
                    singleCategory.capacity ||
                    singleCategory.hdmiport ||
                    singleCategory.vgaport ||
                    singleCategory.dpport ||
                    singleCategory.usbport ||
                    singleCategory.paneltypescreen ||
                    singleCategory.connectivity ||
                    singleCategory.daterate ||
                    singleCategory.compatibledevice ||
                    singleCategory.outputpower ||
                    singleCategory.collingfancount ||
                    singleCategory.clockspeed ||
                    singleCategory.core ||
                    singleCategory.speed ||
                    singleCategory.frequency ||
                    singleCategory.output ||
                    singleCategory.ethernetports ||
                    singleCategory.distance ||
                    singleCategory.lengthname ||
                    singleCategory.slot ||
                    singleCategory.noofchannels ||
                    singleCategory.colours ||
                    singleCategory.resolution
                  }
                  onClick={EditTodoPopup}
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
                &nbsp;
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={12} sm={12} xs={12}>
                {editTodo?.length > 0 && (
                  <ul type="none">
                    {editTodo?.map((item, index) => {
                      return (
                        <li key={index}>
                          <br />
                          <Grid container spacing={2}>
                            <Grid item md={5} sm={10} xs={10}>
                              <FormControl fullWidth size="small">
                                <Typography>SubComponent</Typography>
                                <OutlinedInput
                                  id="component-outlined"
                                  placeholder="Please Enter SubComponent"
                                  value={item.subcomponent}
                                  onChange={(e) =>
                                    handleTodoEditPop(
                                      index,
                                      "subcomponent",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>

                            <Grid item md={1} sm={2} xs={2}>
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
                                <AiOutlineClose />
                              </Button>
                            </Grid>
                          </Grid>
                          <br />
                          <Grid container spacing={1}>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.type}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "type",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Type"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.model}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "model",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Model"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.size}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "size",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Size"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.variant}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "variant",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Variant"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.brand}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "brand",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Brand"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.serial}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "serial",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Serial"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.other}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "other",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Other"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.capacity}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "capacity",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Capacity"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.hdmiport}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "hdmiport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="HDMI Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.vgaport}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "vgaport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="VGA Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.dpport}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "dpport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="DP port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.usbport}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "usbport",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="USB Port"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.paneltypescreen}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "paneltypescreen",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Panel Type "
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.resolution}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "resolution",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Screen Resolution"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.connectivity}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "connectivity",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Connectivity"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.daterate}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "daterate",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Date Rate"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.compatibledevice}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "compatibledevice",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Compatible Device"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.outputpower}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "outputpower",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Output Power"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.collingfancount}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "collingfancount",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Colling Fan Count"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.clockspeed}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "clockspeed",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Clock Speed"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.core}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "core",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Core"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.speed}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "speed",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Speed"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.frequency}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "frequency",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Frequency"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.output}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "output",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Output"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.ethernetports}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "ethernetports",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Ethernet Ports"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.distance}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "distance",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Distance"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.lengthname}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "lengthname",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Length"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.slot}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "slot",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Slot"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.noofchannels}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "noofchannels",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="No of Channels"
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item md={2} sm={3} xs={6}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={item.colours}
                                      onChange={(e) =>
                                        handleTodoEditPop(
                                          index,
                                          "colours",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label="Colours"
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
                          <br />
                          <Divider />
                          <br />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Grid>
            </Grid>

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
                <Button variant="contained" onClick={handleSubmitEdit}>
                  Update
                </Button>
                <Button
                  sx={userStyle.btncancel}
                  onClick={() => {
                    handleEditClose();
                    setSubCategoryEdit("");
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>

      <Box>
        <Dialog
          maxWidth="lg"
          fullWidth={true}
          open={openView}
          onClose={handlViewClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  View Asset Specification
                </Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Specification</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Select Specification"
                    value={singleCategory.workstation}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Component</Typography>
                  <OutlinedInput
                    readOnly
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Category  Name"
                    value={singleCategory.categoryname}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4}></Grid>
              <Grid item md={12} xs={12} sm={12} marginTop={3}>
                <Grid container spacing={1}>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Type</Typography>
                      <Typography>
                        {singleCategory.type === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Model</Typography>
                      <Typography>
                        {singleCategory.model === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Size</Typography>
                      <Typography>
                        {singleCategory.size === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Variant</Typography>
                      <Typography>
                        {singleCategory.variant === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Brand</Typography>
                      <Typography>
                        {singleCategory.brand === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Serial</Typography>
                      <Typography>
                        {singleCategory.serial === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Other</Typography>
                      <Typography>
                        {singleCategory.other === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Capacity</Typography>
                      <Typography>
                        {singleCategory.capacity === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> HDMI Port</Typography>
                      <Typography>
                        {singleCategory.hdmiport === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> VGA Port</Typography>
                      <Typography>
                        {singleCategory.vgaport === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> DP Port</Typography>
                      <Typography>
                        {singleCategory.dpport === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> USB Port</Typography>
                      <Typography>
                        {singleCategory.usbport === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Panel Type </Typography>
                      <Typography>
                        {singleCategory.paneltypescreen === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Screen Resolution</Typography>
                      <Typography>
                        {singleCategory.resolution === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Connectivity</Typography>
                      <Typography>
                        {singleCategory.connectivity === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Compatible Device</Typography>
                      <Typography>
                        {singleCategory.compatibledevice === true
                          ? "Yes"
                          : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Date Rate</Typography>
                      <Typography>
                        {singleCategory.daterate === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Compatible Device</Typography>
                      <Typography>
                        {singleCategory.compatibledevice === true
                          ? "Yes"
                          : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Output Power</Typography>
                      <Typography>
                        {singleCategory.outputpower === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Colling Fan Count</Typography>
                      <Typography>
                        {singleCategory.collingfancount === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Clockspeed</Typography>
                      <Typography>
                        {singleCategory.clockspeed === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Core</Typography>
                      <Typography>
                        {singleCategory.core === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Speed</Typography>
                      <Typography>
                        {singleCategory.speed === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Frequency</Typography>
                      <Typography>
                        {singleCategory.frequency === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Output</Typography>
                      <Typography>
                        {singleCategory.output === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Ethernet Ports</Typography>
                      <Typography>
                        {singleCategory.ethernetports === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Distance</Typography>
                      <Typography>
                        {singleCategory.distance === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Length</Typography>
                      <Typography>
                        {singleCategory.lengthname === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Slot</Typography>
                      <Typography>
                        {singleCategory.slot === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">No of channels</Typography>
                      <Typography>
                        {singleCategory.noofchannels === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={3} xs={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Colours</Typography>
                      <Typography>
                        {singleCategory.colours === true ? "Yes" : "No"}
                      </Typography>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <br />

            {editTodo.length > 0 && (
              <>
                <Typography variant="h6">Sub Component List</Typography>
                <br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ boxShadow: "0px 0px 5px #00000054" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Subcomponent
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Model
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Size
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Variant
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Brand
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Serial
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Other
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Capacity
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          HDMI Port
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          VGA Port
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          DP Port
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          USB Port
                        </TableCell>

                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Panel Type
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Screen Resolution
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Connectivity
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Date Rate
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Compatible Device
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          OutPut Power
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Colling Fan Count
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Clock Speed
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Core
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Speed
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Frequency
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Output
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Ethernet Ports
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Distance
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Length
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Slot
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          No Of Channels
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "5px 10px !important",
                            fontWeight: "600",
                            border: "1px solid #80808047",
                          }}
                        >
                          Colours
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editTodo &&
                        editTodo.map((item, index) => {
                          return (
                            <TableRow>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  wordBreak: "break-word",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.subcomponent}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.type === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.model === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.size === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.variant === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.brand === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.serial === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.other === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.capacity === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.hdmiport === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.vgaport === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.dpport === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.usbport === true ? "Yes" : "No"}
                              </TableCell>

                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.paneltypescreen === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.resolution === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.connectivity === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.daterate === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.compatibledevice === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.outputpower === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.collingfancount === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.clockspeed === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.core === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.speed === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.frequency === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.output === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.ethernetports === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.distance === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.lengthname === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.slot === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.noofchannels === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "5px 10px !important",
                                  border: "1px solid #80808047",
                                }}
                              >
                                {item.colours === true ? "Yes" : "No"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

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
                <Button
                  variant="contained"
                  onClick={() => {
                    handlViewClose();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
      <br />
      <br />
      {isUserRoleCompare?.includes("lassetspecification") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  All Asset Specification
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
                      <MenuItem value={categoryList?.length}>All</MenuItem>
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
                    {isUserRoleCompare?.includes("excelassetspecification") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            getCategoryList();
                            setFormat("xl");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvassetspecification") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            getCategoryList();
                            setFormat("csv");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printassetspecification") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfassetspecification") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            getCategoryList();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageassetspecification") && (
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
              <br />
              <Button
                sx={userStyle.buttongrp}
                onClick={() => {
                  handleShowAllColumns();
                  setColumnVisibility(initialColumnVisibility);
                }}
              >
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              {isUserRoleCompare?.includes("bdassetspecification") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
              {/* ****** Table start ****** */}
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <br />
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
            </Grid>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                {filteredDatas?.length} entries
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
          </Box>
        </>
      )}

      {/* Check Delete Modal */}
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
                  {checkdoc?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deletedocument?.categoryname} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Add Documents</span>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCheck}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
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
        filteredDataTwo={filteredData ?? []}
        itemsTwo={categoryList ?? []}
        filename={"AssetSpecification"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Asset Specification Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={openDelete}
        onClose={handleCloseDelete}
        onConfirm={deleteData}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAssetworkcheckbox}
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

export default AssetWorkstation;
