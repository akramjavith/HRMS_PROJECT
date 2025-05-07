import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, LinearProgress, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import DialogContentText from "@mui/material/DialogContentText";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

function Department() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  let exportColumnNames = [
    'Name',
    'Description',
    'Deduction',
    'ERA',
    'Penalty',
    'Prod',
    'Allowance',
    'Target',
    'Tax'
  ]
  let exportRowValues = [
    'deptname', 'descrip',
    'deduction', 'era',
    'penalty', 'prod', 'allowance',
    'target', 'tax'
  ];
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
  const [btnSubmit, setBtmSubmit] = useState(false);
  const [btnSubmitEdit, setBtmSubmitEdit] = useState(false);

  const [depart, setDepart] = useState({
    deptname: "",
    descrip: "",
    deduction: "",
    era: "",
    penalty: "",
    prod: "",
    target: "",
    tax: "", allowance: "",
    company: "",
  });
  const [getrowid, setRowGetid] = useState("");
  const [deletebranch, setDeletebranch] = useState({});
  const { isUserRoleCompare, pageName, setPageName, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);

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
      pagename: String("Department"),
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

  // page refersh reload code
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

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState('');

  //edit function state...
  const [langid, setLangid] = useState({});
  //overall set functions
  const [department, setDeparttment] = useState([]);
  const [departmentalledit, setDeparttmentalledit] = useState([]);
  const { auth } = useContext(AuthContext);

  const [isDept, setIsDept] = useState(false);



  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Department.png");
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

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //handle click open and close functions
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
    setBtmSubmitEdit(false)
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtmSubmit(false);
    setBtmSubmitEdit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    deptname: true,
    descrip: true,
    deduction: true,
    era: true,
    penalty: true,
    prod: true, allowance: true,
    target: true,
    tax: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      overallBulkdelete(selectedRows);
      // setIsDeleteOpencheckbox(true);
    }
  };

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);

  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.DEPARTMENTOVERALLBULKCHECK}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: ids,
        }
      );
      setSelectedRows(overallcheck?.data?.result);
      setSelectedRowsCount(overallcheck?.data?.count)
      handleClickOpencheckbox(true);
    } catch (err) {
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
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Show All Columns & Manage Columns 


  const sendRequest = async () => {
    setBtmSubmit(true);

    setPageName(!pageName)
    try {
      let req = await axios.post(SERVICE.DEPARTMENT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        deptname: String(depart.deptname),
        company: String(depart.company),
        descrip: String(depart.descrip),
        deduction: Boolean(depart.deduction),
        era: Boolean(depart.era),
        penalty: Boolean(depart.penalty),
        prod: Boolean(depart.prod),
        allowance: Boolean(depart.allowance),
        target: Boolean(depart.target),
        tax: Boolean(depart.tax),
        addedby: [
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchDepartments();
      setDepart(req.data);
      setDepart({
        deptname: "",
        company: "",
        descrip: "",
        deduction: false,
        era: false, allowance: false,
        penalty: false,
        prod: false,
        target: false,
        tax: false,
      });
      setBtmSubmit(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { setBtmSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //submit option for saving
  const handleSubmit = (e) => {

    e.preventDefault();
    const isNameMatch = department.some((item) => item.deptname.toLowerCase() === depart.deptname.toLowerCase());

    if (depart.deptname === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setDepart({
      deptname: "",
      company: "",
      descrip: "",
      deduction: false,
      era: false, allowance: false,
      penalty: false,
      prod: false,
      target: false,
      tax: false,
    });
    fetchDepartments();
    setSearchQuery("")
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();

  };

  //fetching departments whole list
  const fetchDepartments = async () => {
    setPageName(!pageName)
    try {
      let dep = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDeparttment(dep?.data?.departmentdetails?.map((item, index) => ({
        ...item, serialNumber: index + 1, deduction: item.deduction ? "YES" : "NO",
        era: item.era ? "YES" : "NO",
        penalty: item.penalty ? "YES" : "NO",
        prod: item.prod ? "YES" : "NO",
        allowance: item.allowance ? "YES" : "NO",
        target: item.target ? "YES" : "NO",
        tax: item.tax ? "YES" : "NO",
      })));
      setIsDept(true);
    } catch (err) { setIsDept(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //fetching departments whole list
  const fetchDepartmentsAll = async (ids) => {
    setPageName(!pageName)
    try {
      let dep = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeparttmentalledit(dep?.data?.departmentdetails.filter((item) => item._id !== ids));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Department",
    pageStyle: "print",
  });

  //set function to get particular row delete

  const [checkTeam, setCheckTeam] = useState();
  const [checkUser, setCheckUser] = useState();
  //set function to get particular row
  const rowData = async (id, deptname) => {
    setPageName(!pageName)
    try {
      const [res, resdev, resuser, resDep] = await Promise.all([
        axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.TEAMDEPARTMENTCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkteamtodepartment: String(deptname),
        }),
        axios.post(SERVICE.USERDEPARTMENTCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkdepartmenttouser: String(deptname),
        }),
        axios.post(SERVICE.DEPARTMENTOVERALLCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: String(deptname),
        })
      ])
      setDeletebranch(res?.data?.sdepartmentdetails);
      setCheckTeam(resDep?.data?.count);
      setCheckUser(resuser?.data?.users);
      if (resDep?.data?.count > 0) {
        setPopupContentMalert(
          <span style={{ fontWeight: "700", color: "#777" }}>
            {`${deptname}`}
            <span style={{ fontWeight: "bold", color: "black" }}> was linked</span>
          </span>
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setBtmSubmitEdit(false);
  };

  //Edit functiona --->> getCode, sendEditRequest , editSubmit

  const [oldBranchName, setOldBranchName] = useState("");

  //get single row to edit
  const getCode = async (e, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLangid(res?.data?.sdepartmentdetails);
      setRowGetid(res?.data?.sdepartmentdetails);
      setOvProj(name);
      setOldBranchName(name)
      getOverallEditSection(name);
      handleClickOpenEdit();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLangid(res?.data?.sdepartmentdetails);
      handleClickOpenview();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLangid(res?.data?.sdepartmentdetails);
      handleClickOpeninfo();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  let deptid = getrowid?._id;

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
    } else {
      console.log("Total size is zero, unable to compute progress.");
    }
  };


  //department updateby edit page...
  let updateby = langid?.updatedby;
  let addedby = langid?.addedby;

  //editing the single data
  const sendEditRequest = async () => {
    setBtmSubmitEdit(true);
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.DEPARTMENT_SINGLE}/${deptid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        deptname: String(langid.deptname),
        descrip: String(langid.descrip),
        deduction: Boolean(langid.deduction),
        company: String(langid.company),
        era: Boolean(langid.era),
        penalty: Boolean(langid.penalty),
        allowance: Boolean(langid.allowance),
        prod: Boolean(langid.prod),
        target: Boolean(langid.target),
        tax: Boolean(langid.tax),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });

      const performUploads = async () => {
        setPageName(!pageName)
        try {
          // Check and perform employee name update
          if (
            langid.deptname?.toLowerCase() !==
            oldBranchName?.toLowerCase()

          ) {
            await axios.put(
              `${SERVICE.DEPARTMENTOVERALLUPDATE}`,
              {
                oldname: oldBranchName,
                newname: langid.deptname,
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
          console.log(error)
          console.error("Error during upload:", error);
        } finally {
          setOpenPopupUpload(false); // Close the popup after all uploads are completed
          console.log("ended");
        }
      };

      await performUploads()

      await fetchDepartments();
      setLangid(res.data);
      handleCloseModEdit();
      setBtmSubmitEdit(false);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { setBtmSubmitEdit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //update button

  const editSubmit = (e) => {
    e.preventDefault();

    const isNameMatch = departmentalledit.some((item) => item.deptname.toLowerCase() === langid.deptname.toLowerCase());

    if (langid.deptname === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (langid.deptname != ovProj && ovProjCount > 0) {
      setShowAlertpop(getOverAllCount);
      // setPopupSeverityMalert("info");
      handleClickOpenerrpop();
    }
    else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.DEPARTMENTOVERALLCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: e,
      });

      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked
    whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let branchid = deletebranch?._id;
  const delDepartment = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.DEPARTMENT_SINGLE}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchDepartments();
      setSelectedRows([]);
      setPage(1);
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delDepartmentcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.DEPARTMENT_SINGLE}/${item}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();



      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchDepartments();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  useEffect(() => {
    fetchDepartments();
  }, []);

  // useEffect(() => {
  //   fetchDepartmentsAll();
  // }, [isEditOpen, langid]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(department);
  }, [department]);


  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false)
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false)
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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox
        checked={selectAllChecked}
        onChange={onSelectAll}
      />
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      sortable: false, // Optionally, you can make this column not sortable
      width: 60,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header"
    },
    {
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
    },
    { field: "deptname", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.deptname, headerClassName: "bold-header", pinned: 'left', },
    { field: "descrip", headerName: "Decription", flex: 0, width: 100, hide: !columnVisibility.descrip, headerClassName: "bold-header" },
    { field: "deduction", headerName: "Deduction", flex: 0, width: 100, hide: !columnVisibility.deduction, headerClassName: "bold-header" },
    { field: "era", headerName: "ERA", flex: 0, width: 100, hide: !columnVisibility.era, headerClassName: "bold-header" },
    { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, headerClassName: "bold-header" },
    { field: "prod", headerName: "Prod", flex: 0, width: 100, hide: !columnVisibility.prod, headerClassName: "bold-header" },
    { field: "allowance", headerName: "Allowance", flex: 0, width: 100, hide: !columnVisibility.allowance, headerClassName: "bold-header" },
    { field: "target", headerName: "Target", flex: 0, width: 100, hide: !columnVisibility.target, headerClassName: "bold-header" },
    { field: "tax", headerName: "Tax", flex: 0, width: 100, hide: !columnVisibility.tax, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes("edepartment") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              getCode(params.data.id, params.data.deptname);
              fetchDepartmentsAll(params.data.id);
            }}><EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} /></Button>
          )}
          {isUserRoleCompare?.includes("ddepartment") && (
            <Button sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.deptname)
              }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} /></Button>
          )}
          {isUserRoleCompare?.includes("vdepartment") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idepartment") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ]

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      deptname: item.deptname,
      descrip: item.descrip,
      deduction: item.deduction,
      era: item.era,
      penalty: item.penalty,
      prod: item.prod,
      allowance: item.allowance,
      target: item.target,
      tax: item.tax,
    }
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
    <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
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
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
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
      <Headtitle title={"DEPARTMENT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Department"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="HR Setup"
        subpagename="Department"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("adepartment") && (
        <Box sx={userStyle.container}>
          <Typography sx={userStyle.SubHeaderText}>Add Department </Typography>
          <br /> <br />
          <>
            <Grid container spacing={2}>
              <Grid item md={4} sx={12}>
                <Typography>
                  Name <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={depart.deptname}
                    onChange={(e) => {
                      setDepart({ ...depart, deptname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography>Description</Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={depart.descrip}
                    onChange={(e) => {
                      setDepart({ ...depart, descrip: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.deduction} onChange={(e) => setDepart({ ...depart, deduction: !depart.deduction })} />} label="Deduction" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.era} onChange={(e) => setDepart({ ...depart, era: !depart.era })} />} label="ERA" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.penalty} onChange={(e) => setDepart({ ...depart, penalty: !depart.penalty })} />} label="Penalty" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.allowance} onChange={(e) => setDepart({ ...depart, allowance: !depart.allowance })} />} label="Allowance" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.prod} onChange={(e) => setDepart({ ...depart, prod: !depart.prod })} />} label="Prod" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.target} onChange={(e) => setDepart({ ...depart, target: !depart.target })} />} label="Target" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={depart.tax} onChange={(e) => setDepart({ ...depart, tax: !depart.tax })} />} label="Tax" />
                </FormGroup>
              </Grid>
              <Grid item md={3}>
                <Grid container spacing={2}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <LoadingButton loading={btnSubmit} variant="contained" onClick={handleSubmit} sx={buttonStyles.buttonsubmit}>
                        Submit
                      </LoadingButton>
                    </>
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}></Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button onClick={handleClear} sx={buttonStyles.btncancel}>
                        Clear
                      </Button>
                    </>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>

            </Grid>

          </>
        </Box>
      )}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={userStyle.dialogbox}>
            <>
              <Typography sx={userStyle.HeaderText}>Edit Department</Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter Name"
                      type="text"
                      value={langid.deptname}
                      onChange={(e) => {
                        setLangid({ ...langid, deptname: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={langid.descrip}
                      onChange={(e) => {
                        setLangid({ ...langid, descrip: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(langid.deduction)}
                          onChange={(e) =>
                            setLangid({
                              ...langid,
                              deduction: !langid.deduction,
                            })
                          }
                        />
                      }
                      label="Deduction"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.era)} onChange={(e) => setLangid({ ...langid, era: !langid.era })} />} label="ERA" />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.penalty)} onChange={(e) => setLangid({ ...langid, penalty: !langid.penalty })} />} label="Penalty" />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.prod)} onChange={(e) => setLangid({ ...langid, prod: !langid.prod })} />} label="Prod" />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.allowance)} onChange={(e) => setLangid({ ...langid, allowance: !langid.allowance })} />} label="Allowance" />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.target)} onChange={(e) => setLangid({ ...langid, target: !langid.target })} />} label="Target" />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={6} sm={6}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={Boolean(langid.tax)} onChange={(e) => setLangid({ ...langid, tax: !langid.tax })} />} label="Tax" />
                  </FormGroup>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <LoadingButton variant="contained" loading={btnSubmitEdit} onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                    {" "}
                    Update
                  </LoadingButton>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >
                    {" "}
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ldepartment") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Department List</Typography>
            </Grid>

            <br />

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label >Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(department?.length)}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("exceldepartment") && (
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
                  {isUserRoleCompare?.includes("csvdepartment") && (
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
                  {isUserRoleCompare?.includes("printdepartment") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfdepartment") && (
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
                  {isUserRoleCompare?.includes("imagedepartment") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                  )}
                </Box >
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={department}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                // totalDatas={userShifts} 
                />
              </Grid>
            </Grid>

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            {isUserRoleCompare?.includes("bddepartment") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>Bulk Delete</Button>)}


            <br /><br />
            {!isDept ?
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              :
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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                />
              </>}
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delDepartment(branchid)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Department</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{langid.deptname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Description</Typography>
                  <Typography>{langid.descrip}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Deduction</Typography>
                  <Typography>{langid.deduction === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Penalty</Typography>
                  <Typography>{langid.penalty === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ERA</Typography>
                  <Typography>{langid.era === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Production</Typography>
                  <Typography>{langid.prod === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Allowance</Typography>
                  <Typography>{langid.allowance === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Target</Typography>
                  <Typography>{langid.target === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Tax</Typography>
                  <Typography>{langid.tax === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Check  delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {checkTeam > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.deptname} `}</span>was linked
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      {/* print layout */}

      {/* ALERT DIALOG */}
      <Box >
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                width: "350px"
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "3.5rem", color: "teal" }} />              <Typography
                sx={{ fontSize: "1.4rem", fontWeight: "600", color: "black", textAlign: "center" }}
              >
                {showAlertpop}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
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
            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
            <Button autoFocus variant="contained" color='error'
              onClick={(e) => delDepartmentcheckbox(e)}
            > OK </Button>
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
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color='error'
              onClick={handleCloseModalert}
            > OK </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
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
                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                <Button sx={buttonStyles.buttonsubmit}
                  onClick={(e) => delDepartmentcheckbox(e)}
                > OK </Button>
              </>
              :
              <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseModcheckbox} >Ok</Button>
            }
          </DialogActions>
        </Dialog>

      </Box>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={department ?? []}
        filename={"Department"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <LoadingDialog
        open={openPopupUpload}
        onClose={() => setOpenPopupUpload(false)}
        progress={uploadProgress}
      />
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
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Department Info"
        addedby={addedby}
        updateby={updateby}
      />
    </Box>
  );
}

export default Department;