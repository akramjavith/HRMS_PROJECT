import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, TextareaAutosize, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import "jspdf-autotable";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { handleApiError } from "../../../components/Errorhandling";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function Announcement() {
  const pathname = window.location.pathname;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
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

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Team', 'Category', 'SubCategory', 'Content'];
  let exportRowValues = ['company', 'branch', 'unit', 'team', 'category', 'subcategory', 'content']

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Announcement"),
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

  const [fileFormat, setFormat] = useState("");
  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [announcement, setAnnouncement] = useState({ company: "Please Select Company", branch: [], unit: "Please Select Unit", team: "Please Select Team", category: "Please Select Category", subcategory: "Please Select SubCategory", view: "Please Select View", content: "" });
  const [announcementEdit, setAnnouncementEdit] = useState({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", team: "Please Select Team", category: "Please Select Category", subcategory: "Please Select SubCategory", view: "Please Select View", content: "" });
  const [announcementArray, setAnnouncementArray] = useState([]);
  const [announcementArrayEdit, setAnnouncementArrayEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesEdit, setdocumentFilesEdit] = useState([]);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    category: true,
    subcategory: true,
    view: true,
    content: true,
    actions: true,
  };

  //branch option
  const [selectedBranchOptionsCate, setSelectedBranchOptionsCate] = useState([]);
  const [branchValueCate, setBranchValueCate] = useState("");
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] = useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState([]);

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

  const handleBranchChange = (options) => {
    setBranchValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCate(options);
    setUnitValueCate([]);
    setSelectedUnitOptionsCate([]);
    setTeamValueCate([]);
    setSelectedTeamOptionsCate([]);
  };
  const customValueRendererBranch = (branchValueCate, _employeename) => {

    return branchValueCate.length ? branchValueCate.map(({ label }) => label).join(", ") : "Please Select Branch";
  };
  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
  };
  const customValueRendererBranchEdit = (branchValueCateEdit, _employeename) => {
    return branchValueCateEdit.length ? branchValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Branch";
  };

  //unit options
  const [selectedUnitOptionsCate, setSelectedUnitOptionsCate] = useState([]);
  const [unitValueCate, setUnitValueCate] = useState("");
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] = useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState([]);
  const handleUnitChange = (options) => {
    setUnitValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCate(options);
    setTeamValueCate([]);
    setSelectedTeamOptionsCate([]);
  };
  const customValueRendererUnit = (unitValueCate, _employeename) => {
    return unitValueCate.length ? unitValueCate.map(({ label }) => label).join(", ") : "Please Select Unit";
  };
  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit.length ? unitValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Unit";
  };

  //team options
  const [selectedTeamOptionsCate, setSelectedTeamOptionsCate] = useState([]);
  const [teamValueCate, setTeamValueCate] = useState("");
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] = useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");
  const handleTeamChange = (options) => {
    setTeamValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCate(options);
  };
  const customValueRendererTeam = (teamValueCate, _employeename) => {
    return teamValueCate.length ? teamValueCate.map(({ label }) => label).join(", ") : "Please Select Team";
  };
  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit.length ? teamValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Team";
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //useEffect
  useEffect(() => {
    addSerialNumber(announcementArray);
  }, [announcementArray]);

  useEffect(() => {
    fetchAnnouncementAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchAnnouncement();
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const filteredExpsubcat = [...categoryOpt?.filter(u =>
      u.categoryname === announcement.category)?.map((item) => {
        return item.subcategoryname.map((subcategory) => {
          return {
            label: subcategory,
            value: subcategory,
          };
        });
      }).flat()]
    setSubCategory(filteredExpsubcat);
  }, [announcement.category]);

  useEffect(() => {
    const filteredExpsubcat = [...categoryOpt?.filter(u =>
      u.categoryname === announcementEdit.category)?.map((item) => {
        return item.subcategoryname.map((subcategory) => {
          return {
            label: subcategory,
            value: subcategory,
          };
        });
      }).flat()]
    setSubCategoryEdit(filteredExpsubcat);
  }, [announcementEdit.category]);


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
  // page refersh reload
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
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [categoryOpt, setCategory] = useState([]);
  const [subCategoryOpt, setSubCategory] = useState([]);
  const [subCategoryOptEdit, setSubCategoryEdit] = useState([]);

  const fetchCategory = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.ALL_ANNOUNCEMENTCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategory([
        ...res?.data?.announcementcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ANNOUNCEMENT}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteAnnouncement(res?.data?.sannouncement);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let proid = deleteAnnouncement._id;
  const delProcess = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_ANNOUNCEMENT}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAnnouncement();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true)
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_ANNOUNCEMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(announcement.company),
        branch: [...branchValueCate],
        unit: [...unitValueCate],
        team: [...teamValueCate],
        category: String(announcement.category),
        subcategory: String(announcement.subcategory),
        view: String(announcement.view === "Please Select View" ? "" : announcement.view),
        content: String(announcement.content),
        files: [...documentFiles],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAnnouncement(brandCreate.data);
      await fetchAnnouncement();
      setAnnouncement({ ...announcement, content: "" })
      setdocumentFiles([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let branchopt = selectedBranchOptionsCate.map((item) => item.value);
    let unitopt = selectedUnitOptionsCate.map((item) => item.value);
    let teamopt = selectedTeamOptionsCate.map((item) => item.value);
    const isNameMatch = announcementArray?.some(
      (item) =>
        item.company === announcement.company &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.category === announcement.category &&
        item.subcategory === announcement.subcategory
    );
    if (announcement.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (branchValueCate.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (unitValueCate.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (teamValueCate.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (announcement.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (announcement.subcategory === "Please Select SubCategory") {
      setPopupContentMalert("Please Select SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Announcement already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setAnnouncement({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select unit", team: "Please Select Team", category: "Please Select Category", subcategory: "Please Select SubCategory", view: "Please Select View", content: "" });
    setdocumentFiles([]);
    setSelectedBranchOptionsCate([]);
    setBranchValueCate("");
    setSelectedUnitOptionsCate([]);
    setUnitValueCate("");
    setSelectedTeamOptionsCate([]);
    setTeamValueCate("");
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ANNOUNCEMENT}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAnnouncementEdit(res?.data?.sannouncement);
      setBranchValueCateEdit(res?.data?.sannouncement?.branch)
      setSelectedBranchOptionsCateEdit(res?.data?.sannouncement?.branch?.map((item) => ({ ...item, label: item, value: item })))
      setUnitValueCateEdit(res?.data?.sannouncement?.unit)
      setSelectedUnitOptionsCateEdit(res?.data?.sannouncement?.unit?.map((item) => ({ ...item, label: item, value: item })))
      setTeamValueCateEdit(res?.data?.sannouncement?.team)
      setSelectedTeamOptionsCateEdit(res?.data?.sannouncement?.team?.map((item) => ({ ...item, label: item, value: item })))
      setdocumentFilesEdit(res?.data?.sannouncement?.files)
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....

  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ANNOUNCEMENT}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAnnouncementEdit(res?.data?.sannouncement);
      concordinateParticipants(res?.data?.sannouncement);
      setdocumentFilesEdit(res?.data?.sannouncement?.files)
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [concBrancehs, setConcBranches] = useState("");
  const [concUnits, setConcUnits] = useState("");
  const [concTeams, setConcTeams] = useState("");
  const concordinateParticipants = (announcement) => {
    const branches = announcement.branch;
    const units = announcement.unit;
    const teams = announcement.team;
    const concatenatedBrancehs = branches.join(",");
    const concatenatedUnits = units.join(",");
    const concatenatedTeams = teams.join(",");
    setConcBranches(concatenatedBrancehs);
    setConcUnits(concatenatedUnits);
    setConcTeams(concatenatedTeams);
  };
  // get single row to view....

  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_ANNOUNCEMENT}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAnnouncementEdit(res?.data?.sannouncement);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFiles((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  //edit
  const handleResumeUploadEdit = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFilesEdit((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
  };
  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    setdocumentFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  let updateby = announcementEdit.updatedby;
  let addedby = announcementEdit.addedby;
  let processId = announcementEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_ANNOUNCEMENT}/${processId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(announcementEdit.company),
          branch: [...branchValueCateEdit],
          unit: [...unitValueCateEdit],
          team: [...teamValueCateEdit],
          category: String(announcementEdit.category),
          subcategory: String(announcementEdit.subcategory),
          view: String(announcementEdit.view === "Please Select View" ? "" : announcementEdit.view),
          content: String(announcementEdit.content),
          files: [...documentFilesEdit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAnnouncement();
      await fetchAnnouncementAll();
      setBranchValueCateEdit([]);
      setSelectedBranchOptionsCateEdit([]);
      setUnitValueCateEdit("");
      setSelectedUnitOptionsCateEdit([]);
      setTeamValueCateEdit("");
      setSelectedTeamOptionsCateEdit([]);
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    await fetchAnnouncementAll()
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    const isNameMatch = announcementArrayEdit?.some(
      (item) =>
        item.company === announcementEdit.company &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.category === announcementEdit.category &&
        item.subcategory === announcementEdit.subcategory
    );
    if (announcementEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (branchValueCateEdit.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (unitValueCateEdit.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (teamValueCateEdit.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (announcementEdit.category === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (announcementEdit.subcategory === "Please Select SubCategory") {
      setPopupContentMalert("Please Select SubCategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Announcement already Exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };

  //get all Announcement.

  const fetchAnnouncement = async () => {
    setPageName(!pageName);

    try {
      let res_freq = await axios.post(SERVICE.ALL_ANNOUNCEMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setLoader(true);
      setAnnouncementArray(res_freq?.data?.announcement);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_ANNOUNCEMENT}/${item}`, {
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

      await fetchAnnouncement();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all Announcement.
  const fetchAnnouncementAll = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.post(SERVICE.ALL_ANNOUNCEMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setAnnouncementArrayEdit(
        res_freq?.data?.announcement.filter(
          (item) => item._id !== announcementEdit._id
        ));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Announcement.png");
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
    documentTitle: "Announcement",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
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

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }


  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "content",
      headerName: "Content",
      flex: 0,
      width: 150,
      hide: !columnVisibility.content,
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
          {isUserRoleCompare?.includes("eannouncement") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dannouncement") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vannouncement") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iannouncement") && (
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
      company: item.company,
      branch: item.branch?.toString(),
      unit: item.unit?.toString(),
      team: item.team?.toString(),
      category: item.category,
      subcategory: item.subcategory,
      view: item.view,
      content: item.content,
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
  return (
    <Box>
      <Headtitle title={"ANNOUNCEMENT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Announcement"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Announcement"
        subpagename="Announcement"
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("aannouncement") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Add Announcement
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={accessbranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        placeholder="Please Select Company"
                        value={{ label: announcement.company, value: announcement.company }}
                        onChange={(e) => {
                          setAnnouncement({
                            ...announcement,
                            company: e.value,
                          });
                          setBranchValueCate("");
                          setSelectedBranchOptionsCate([]);
                          setUnitValueCate("");
                          setSelectedUnitOptionsCate([]);
                          setTeamValueCate("");
                          setSelectedTeamOptionsCate([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={accessbranch?.filter(
                        (comp) =>
                          announcement.company === comp.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedBranchOptionsCate} onChange={handleBranchChange} valueRenderer={customValueRendererBranch} labelledBy="Please Select Branch" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={accessbranch?.filter(
                        (comp) =>
                          announcement.company === comp.company && branchValueCate.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedUnitOptionsCate} onChange={handleUnitChange} valueRenderer={customValueRendererUnit} labelledBy="Please Select Unit" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect options={allTeam?.filter(
                        (comp) =>
                          announcement.company === comp.company && branchValueCate.includes(comp.branch) && unitValueCate.includes(comp.unit)
                      )?.map(data => ({
                        label: data.teamname,
                        value: data.teamname,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })} value={selectedTeamOptionsCate} onChange={handleTeamChange} valueRenderer={customValueRendererTeam} labelledBy="Please Select Team" />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={categoryOpt}
                        placeholder="Please Select Category"
                        value={{ label: announcement.category, value: announcement.category }}
                        onChange={(e) => {
                          setAnnouncement({
                            ...announcement,
                            category: e.value,
                            subcategory: "Please Select SubCategory",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={subCategoryOpt}
                        placeholder="Please Select SubCategory"
                        value={{ label: announcement.subcategory, value: announcement.subcategory }}
                        onChange={(e) => {
                          setAnnouncement({
                            ...announcement,
                            subcategory: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Content    </Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2.5}
                        value={announcement.content}
                        onChange={(e) => {
                          setAnnouncement({
                            ...announcement,
                            content: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={8} sm={12} xs={12}>
                    <Typography variant="h6">Attachment</Typography>
                    <Grid marginTop={2}>
                      <Button variant="contained" size="small" component="label" disabled={documentFiles.length > 0}
                        sx={{
                          ...buttonStyles.buttonsubmit,
                          "@media only screen and (max-width:550px)": { marginY: "5px" },
                        }}>
                        Upload
                        <input
                          type="file"
                          id="resume"
                          accept=".png, .jpeg, .jpg, .svg, .ico,"
                          name="file"
                          hidden
                          onChange={(e) => {
                            handleResumeUpload(e);
                          }}
                        />
                      </Button>
                      <br /><br />
                      {documentFiles?.length > 0 &&
                        documentFiles.map((file, index) => (
                          <>
                            <Grid container spacing={2} >
                              <Grid item lg={3} md={3} sm={6} xs={6}>
                                <Typography>{file.name}</Typography>
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                              </Grid>
                              <Grid item lg={1} md={1} sm={1} xs={1}>
                                <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                  <DeleteIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12} >
                    <Grid container spacing={3}>
                      <Grid item md={4} sm={6} xs={12}>
                        <Button variant="contained"
                          sx={buttonStyles.buttonsubmit}
                          onClick={handleSubmit}
                          disabled={isBtn}
                        >
                          {" "}
                          Submit
                        </Button>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <Button sx={buttonStyles.btncancel}
                          onClick={handleclear}
                        >
                          {" "}
                          CLEAR
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              </Grid>

            </>
          </Box>
        )}
      </>
      <br />
      {/* ****** Table Start ****** */}
      {!loader ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box> :
        <>
          {isUserRoleCompare?.includes("lannouncement") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Announcement List
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
                      <MenuItem value={announcementArray?.length}> All </MenuItem>
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
                    {isUserRoleCompare?.includes("excelannouncement") && (
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
                    {isUserRoleCompare?.includes("csvannouncement") && (
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
                    {isUserRoleCompare?.includes("printannouncement") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfannouncement") && (
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
                    {isUserRoleCompare?.includes("imageannouncement") && (
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={announcementArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={announcementArray}
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
              {isUserRoleCompare?.includes("bdannouncement") && (
                <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>)}
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
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
                    itemsList={announcementArray}
                  />
                </>

              </Box>

            </Box>
          )}
        </>}
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
        maxWidth="md"
        // fullWidth={true}
        sx={{ marginTop: "47px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Announcement
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{announcementEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography style={{ overflowWrap: 'break-word' }}>{concBrancehs}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{concUnits}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{concTeams}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Category</Typography>
                  <Typography>{announcementEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> SubCategory</Typography>
                  <Typography>{announcementEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Content</Typography>
                  <Typography>{announcementEdit.content}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Typography variant="h6">Attachment</Typography>
                <Grid marginTop={2}>
                  {documentFilesEdit?.length > 0 &&
                    documentFilesEdit.map((file, index) => (
                      <>
                        <Grid container spacing={2} >
                          <Grid item md={10} sm={6} xs={6}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                          </Grid>

                        </Grid>
                      </>
                    ))}
                </Grid>
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

      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "47px" }}
        // fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Announcement
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      placeholder="Please Select Company"
                      value={{ label: announcementEdit.company === "" ? "Please Select Company" : announcementEdit.company, value: announcementEdit.company === "" ? "Please Select Company" : announcementEdit.company }}
                      onChange={(e) => {
                        setAnnouncementEdit({
                          ...announcementEdit,
                          company: e.value,
                        });
                        setBranchValueCateEdit([]);
                        setSelectedBranchOptionsCateEdit([]);
                        setUnitValueCateEdit([]);
                        setSelectedUnitOptionsCateEdit([]);
                        setTeamValueCateEdit([]);
                        setSelectedTeamOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={accessbranch?.filter(
                      (comp) =>
                        announcementEdit.company === comp.company
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })} value={selectedBranchOptionsCateEdit} onChange={handleBranchChangeEdit} valueRenderer={customValueRendererBranchEdit} labelledBy="Please Select Branch" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={accessbranch?.filter(
                      (comp) =>
                        announcementEdit.company === comp.company && branchValueCateEdit.includes(comp.branch)
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })} value={selectedUnitOptionsCateEdit} onChange={handleUnitChangeEdit} valueRenderer={customValueRendererUnitEdit} labelledBy="Please Select Unit" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={allTeam?.filter(
                      (comp) =>
                        announcementEdit.company === comp.company && branchValueCateEdit.includes(comp.branch) && unitValueCateEdit.includes(comp.unit)
                    )?.map(data => ({
                      label: data.teamname,
                      value: data.teamname,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })} value={selectedTeamOptionsCateEdit} onChange={handleTeamChangeEdit} valueRenderer={customValueRendererTeamEdit} labelledBy="Please Select Team" />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOpt}
                      placeholder="Please Select Category"
                      value={{ label: announcementEdit.category === "" ? "Please Select Category" : announcementEdit.category, value: announcementEdit.category === "" ? "Please Select Category" : announcementEdit.category }}
                      onChange={(e) => {
                        setAnnouncementEdit({
                          ...announcementEdit,
                          category: e.value,
                          subcategory: "Please Select SubCategory",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={subCategoryOptEdit}
                      placeholder="Please Select SubCategory"
                      value={{ label: announcementEdit.subcategory === "" ? "Please Select SubCategory" : announcementEdit.subcategory, value: announcementEdit.subcategory === "" ? "Please Select SubCategory" : announcementEdit.subcategory }}
                      onChange={(e) => {
                        setAnnouncementEdit({
                          ...announcementEdit,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Content    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={2.5}
                      value={announcementEdit.content}
                      onChange={(e) => {
                        setAnnouncementEdit({
                          ...announcementEdit,
                          content: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="h6">Attachment</Typography>
                  <Grid marginTop={2}>
                    <Button variant="contained" size="small" disabled={documentFilesEdit.length > 0} component="label"
                      sx={{
                        ...buttonStyles.buttonsubmit,
                        "@media only screen and (max-width:550px)": { marginY: "5px" },
                      }}>
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".png, .jpeg, .jpg, .svg, .ico,"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUploadEdit(e);
                        }}
                      />
                    </Button>
                    <br /><br />
                    {documentFilesEdit?.length > 0 &&
                      documentFilesEdit.map((file, index) => (
                        <>
                          <Grid container spacing={2} >
                            <Grid item md={10} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreviewEdit(file)} />
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDeleteEdit(index)}>
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
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
        itemsTwo={announcementArray ?? []}
        filename={"Announcement"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Announcement Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delProcess}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
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

      <br />
    </Box>
  );
}

export default Announcement;