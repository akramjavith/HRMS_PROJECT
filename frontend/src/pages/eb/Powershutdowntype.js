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
import {
  Box,
  Button,
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
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
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


function Managepowershutdowntype() {
  const [isHandleChange, setIsHandleChange] = useState(false);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setIsActive(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setIsActive(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ["Name"];
  let exportRowValues = ["shutdowntypename"];

  const [checkUnit, setCheckUnit] = useState();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [selectedRowsCat, setSelectedRowsCat] = useState([]);
  const [managepowershutdown, setManagepowershutdown] = useState({
    shutdowntypename: "",
  });
  const [isClearOpenalert, setClearOpenalert] = useState(false);
  const [isAddOpenalert, setAddOpenalert] = useState(false);
  const [isDeletealert, setDeletealert] = useState(false);
  const [isBulkDelOpenalert, setBulkDelOpenalert] = useState(false);
  const [isUpdateOpenalert, setUpdateOpenalert] = useState(false);
  const [assignedByArray, setAssignebyArray] = useState([]);
  const [assignedByArrayEdit, setAssignedbyArrayEdit] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [assignedByEdit, setAssignedByEdit] = useState({
    shutdowntypename: "",
  });
  const [sources, setAssignedby] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSourceedit, setAllSourceedit] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(false);

  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({ ebuse: [] });


  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => { setisCheckOpenbulk(true); };
  const handlebulkCloseCheck = () => {
    setSelectedRows([])
    setSelectedRowsCat([])
    setisCheckOpenbulk(false);
    setSelectAllChecked(false);
  };


  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };


  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Manage Power Shutdown Type"),
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



  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Poweshutdowntype.png");
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
    setIsActive(false);
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

  // const handleClickOpenalert = async () => {
  //   let value = [...new Set(selectedRowsCat)];
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     let resdev = await axios.post(SERVICE.OVERALL_DELETE_POWERSTATION, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       checkebuse: value,
  //     });

  //     if (resdev?.data?.ebuse?.length > 0) {
  //       handleClickOpenCheck();
  //       setOveraldeletecheck({
  //         ...overalldeletecheck,
  //         ebuse: resdev?.data?.ebuse,
  //       });
  //       setCheckUnit([]);
  //     } else {
  //       setIsDeleteOpencheckbox(true);
  //     }
  //   }
  // };

  const handleClickOpenalert = async () => {

    try {
      let value = [...new Set(selectedRowsCat.flat())]
      setIsHandleChange(true)

      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {

        const [
          resdev
        ] = await Promise.all([
          axios.post(SERVICE.OVERALL_DELETE_POWERSTATION, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },
            checkebuse: value,
          }),


        ])

        setCheckUnit(resdev?.data?.ebuse)


        let purResult = resdev?.data?.ebuse?.map(t => t.powershutdowntype).flat();



        if (resdev?.data?.ebuse?.length > 0) {
          handleClickOpenCheckbulk();
          setOveraldeletecheck({ ...overalldeletecheck, ebuse: [... new Set(purResult)] })
          setCheckUnit([])

        }
        else {
          setIsDeleteOpencheckbox(true);
        }
      }
    }
    catch (err) {
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    shutdowntypename: true,
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

  const [deleteSource, setDeleteSource] = useState("");

  const rowData = async (id, shutdowntypename) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteSource(res?.data?.managepowershutdowntypename);
      let resdev = await axios.post(SERVICE.OVERALL_DELETE_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkebuse: [shutdowntypename],
      });
      setCheckUnit(resdev?.data?.ebuse);
      if (resdev?.data?.ebuse?.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Sourcesid = deleteSource?._id;
  const delSource = async () => {
    setPageName(!pageName)
    try {
      if (Sourcesid) {
        await axios.delete(
          `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${Sourcesid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        await fetchAssignedBy();
        handleCloseMod();
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

  const delSourcecheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(
          `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${item}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false)
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchAssignedBy();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delReasoncheckboxWithoutLink = async () => {
    try {
      // let filtered = sources.filter(
      //   (d) =>
      //     selectedRows.includes(d._id) &&
      //     !overalldeletecheck.ebuse.some(
      //       (item) => d.shutdowntypename === item.powershutdowntype
      //     )
      // );
      let filtered = rowDataTable.filter(d => !overalldeletecheck.ebuse.some(item => d.shutdowntypename === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));

      const deletePromises = filtered?.map((item) => {
        return axios.delete(
          `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${item}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      handleCloseCheck();
      await fetchAssignedBy();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const getLinkedLabelItem = (overalldeletecheck) => {
    const { ebuse = [] } = overalldeletecheck;
    const labels = [];

    ebuse.forEach(item => labels.push(item));


    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];

    return uniqueLabels.join(", ");
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { ebuse = [], } = overalldeletecheck;
    const labels = [];

    if (ebuse.length > 0) labels.push(" Mange Power ShutDown");

    return labels.join(", ");
  };

  const getFilteredUnits = (sources, selectedRows, overalldeletecheck) => {
    const { ebuse = [] } = overalldeletecheck;
    const allConditions = [...new Set([...ebuse])];

    return sources.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.shutdowntypename));
  };

  const shouldShowDeleteMessage = (sources, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(sources, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (sources, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(sources, selectedRows, overalldeletecheck).length === 0;
  };





  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(
        SERVICE.MANAGEPOWERSHUTDOWNTYPE_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          shutdowntypename: String(managepowershutdown.shutdowntypename),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAssignedBy();
      setManagepowershutdown({ shutdowntypename: "" });
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
    e.preventDefault();
    setIsActive(true);
    const isNameMatch = assignedByArray.some(
      (item) =>
        item.shutdowntypename.toLowerCase() ==
        managepowershutdown.shutdowntypename.toLowerCase()
    );
    if (managepowershutdown.shutdowntypename === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setManagepowershutdown({ shutdowntypename: "" });
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
  const getCode = async (e, shutdowntypename) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAssignedByEdit(res?.data?.managepowershutdowntypename);
      setOvProj(shutdowntypename);
      getOverallEditSection(shutdowntypename);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAssignedByEdit(res?.data?.managepowershutdowntypename);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(
        `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAssignedByEdit(res?.data?.managepowershutdowntypename);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = assignedByEdit?.updatedby;
  let addedby = assignedByEdit?.addedby;
  let subprojectsid = assignedByEdit?._id;
  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {

      // const isNameMatch = allSourceedit.some(
      //   (item) =>
      //     item.shutdowntypename.toLowerCase() ==
      //     assignedByEdit.shutdowntypename.toLowerCase()
      // );

      // if (isNameMatch) {
      //   setPopupContentMalert("Name already exist!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } 
      // else {

      let res = await axios.post(SERVICE.OVERALL_EDIT_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in
    ${res?.data?.ebuse?.length > 0 ? "Power Shutdown" : ""
        } whether you want to do changes ..??`);
      // }


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_POWERSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.ebuse);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (ebuse) => {
    setPageName(!pageName)
    try {

      if (ebuse.length > 0) {
        let answ = ebuse.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_POWERTSTATION}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            powershutdowntype: String(assignedByEdit.shutdowntypename),
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
        `${SERVICE.MANAGEPOWERSHUTDOWNTYPE_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          shutdowntypename: String(assignedByEdit.shutdowntypename),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAssignedBy();
      await fetchSourceAll();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      getOverallEditSectionUpdate();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchSourceAll();
    const isNameMatch = allSourceedit.some(
      (item) =>
        item.shutdowntypename.toLowerCase() ==
        assignedByEdit.shutdowntypename.toLowerCase()
    );
    if (assignedByEdit.shutdowntypename === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (assignedByEdit.shutdowntypename != ovProj && ovProjCount > 0) {
      // setPopupContentMalert(getOverAllCount);
      // setPopupSeverityMalert("info");
      // handleClickOpenPopupMalert();
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();

      setPopupContentMalert("Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchAssignedBy = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.MANAGEPOWERSHUTDOWNTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourcecheck(true);
      setAssignedby(res_vendor?.data?.managepowershutdowntypename);
      setAssignebyArray(res_vendor?.data?.managepowershutdowntypename);
      setAssignedbyArrayEdit(res_vendor?.data?.managepowershutdowntypename);
    } catch (err) {
      setSourcecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchSourceAll = async () => {
    setPageName(!pageName)
    try {
      let res_meet = await axios.get(SERVICE.MANAGEPOWERSHUTDOWNTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllSourceedit(
        res_meet?.data?.managepowershutdowntypename.filter(
          (item) => item._id !== assignedByEdit._id
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
    documentTitle: "Poweshutdowntype",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchAssignedBy();
  }, []);

  useEffect(() => {
    fetchSourceAll();
  }, [isEditOpen, assignedByEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = sources?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [sources]);

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

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold",
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
              setSelectedRowsCat([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              const allRowIdsCat = rowDataTable.map(
                (row) => row.shutdowntypename
              );
              setSelectedRows(allRowIds);
              setSelectedRowsCat(allRowIdsCat);
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
            let updatedSelectedRowsCat;

            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
              updatedSelectedRowsCat = selectedRowsCat.filter(
                (selectedId) => selectedId !== params.row.shutdowntypename
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsCat = [
                ...selectedRowsCat,
                params.row.shutdowntypename,
              ];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectedRowsCat(updatedSelectedRowsCat);

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
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "shutdowntypename",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.shutdowntypename,
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
          {isUserRoleCompare?.includes("epowershutdowntype") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.row.id, params.row.shutdowntypename);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dpowershutdowntype") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.shutdowntypename);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vpowershutdowntype") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ipowershutdowntype") && (
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
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      shutdowntypename: item.shutdowntypename,
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

  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <Headtitle title={"Power Shutdown Type"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        {" "}
        Manage Power Shutdown Type
      </Typography> */}
      <PageHeading
        title="Power Shutdown Type"
        modulename="EB"
        submodulename="Power ShutDown"
        mainpagename="Manage Power ShutDown"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("apowershutdowntype") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Power Shutdown Type
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
                      value={managepowershutdown.shutdowntypename}
                      onChange={(e) => {
                        setManagepowershutdown({
                          ...managepowershutdown,
                          shutdowntypename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>

                    <Button
                      variant="contained"
                      sx={buttonStyles.buttonsubmit}
                      onClick={handleSubmit}
                      disabled={isActive}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      Clear
                    </Button>
                  </Box>
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
          // maxWidth="sm"
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
                      Edit Power Shutdown Type
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={10} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={assignedByEdit.shutdowntypename}
                        onChange={(e) => {
                          setAssignedByEdit({
                            ...assignedByEdit,
                            shutdowntypename: e.target.value,
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
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lpowershutdowntype") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Power Shutdown Type List
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
                    {/* <MenuItem value={(sources?.length)}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelpowershutdowntype") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAssignedBy();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvpowershutdowntype") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAssignedBy();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printpowershutdowntype") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpowershutdowntype") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchAssignedBy();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagepowershutdowntype") && (
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
            {isUserRoleCompare?.includes("bdpowershutdowntype") && (
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
            {!sourceCheck ? (
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
              View Power Shutdown Type
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{assignedByEdit.shutdowntypename}</Typography>
                </FormControl>
              </Grid>
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
                  {checkUnit?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteSource.shutdowntypename} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>
                        Mange Power ShutDown
                      </span>
                    </>
                  ) : (
                    ""
                  )}

                  {/* {overalldeletecheck.ebuse?.length > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${[
                        ...new Set(
                          overalldeletecheck.ebuse.map(
                            (item) => item.powershutdowntype
                          )
                        ),
                      ]} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>
                        Mange Power ShutDown
                      </span>{" "}
                      {sources.filter(
                        (d) =>
                          selectedRows.includes(d._id) &&
                          !overalldeletecheck.ebuse.some(
                            (item) =>
                              d.shutdowntypename === item.powershutdowntype
                          )
                      ).length > 0 && (
                          <Typography>
                            Do You want to Delete others?...
                          </Typography>
                        )}
                    </>
                  ) : (
                    ""
                  )} */}
                </Typography>
              </DialogContent>
              <DialogActions>
                {checkUnit?.length > 0
                  //  ||
                  //   sources.filter(
                  //     (d) =>
                  //       selectedRows.includes(d._id) &&
                  //       !overalldeletecheck.ebuse.some(
                  //         (item) => d.shutdowntypename === item.powershutdowntype
                  //       )
                  //   ).length === 0 
                  ? (
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      OK{" "}
                    </Button>
                  ) : (
                    ""
                  )}
                {/* {checkUnit?.length === 0 &&
                  overalldeletecheck.ebuse.length > 0 &&
                  sources.filter(
                    (d) =>
                      selectedRows.includes(d._id) &&
                      !overalldeletecheck.ebuse.some(
                        (item) => d.shutdowntypename === item.powershutdowntype
                      )
                  ).length > 0 ? (
                  <>
                    <Button
                      onClick={delReasoncheckboxWithoutLink}
                      variant="contained"
                    >
                      {" "}
                      Yes{" "}
                    </Button>
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </>
                ) : (
                  ""
                )} */}
              </DialogActions>
            </Dialog>
          </Box>



        </>
      </Box>

      <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(overalldeletecheck.ebuse?.length > 0) && (
              <>
                <span style={{ fontWeight: "700", color: "#777" }}>
                  {getLinkedLabelItem(overalldeletecheck)}
                </span>{' '}
                was linked in{' '}
                <span style={{ fontWeight: "700", color: "#777" }}>
                  {getLinkedLabel(overalldeletecheck)}
                </span>
                {shouldShowDeleteMessage(sources, selectedRows, overalldeletecheck) && (
                  <Typography>Do you want to delete others?...</Typography>
                )}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(sources, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(sources, selectedRows, overalldeletecheck) && (
            <>
              <Button onClick={delReasoncheckboxWithoutLink} variant="contained"> Yes </Button>
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* EXPTERNAL COMPONENTS -------------- START */}
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
        itemsTwo={items ?? []}
        filename={"Power Shutdown Type"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Power Shutdown Type Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delSource}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delSourcecheckbox}
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
      {/* EXPTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Managepowershutdowntype;
