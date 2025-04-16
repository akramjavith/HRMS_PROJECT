import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogTitle, LinearProgress, Select, MenuItem, DialogContent, TableRow, TableCell, DialogActions, FormControl, TextareaAutosize, Grid, FormGroup, FormControlLabel, Paper, Table, TableHead, TableContainer, Button, TableBody, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ThreeDots } from "react-loader-spinner";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { useReactToPrint } from "react-to-print";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../services/Baseservice";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { AuthContext } from "../../context/Appcontext";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from '@mui/x-data-grid';
import StyledDataGrid from "../../components/TableStyle";
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from '@mui/lab/LoadingButton';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../components/PageHeading";



function Department() {
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
    tax: "",
    company: "",
  });
  const [getrowid, setRowGetid] = useState("");
  const [deletebranch, setDeletebranch] = useState({});
  const { isUserRoleCompare, isUserRoleaccess, isAssignBranch, allUnit, allTeam, allCompany, allBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);

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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Department.png');
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

  const getRowClassName = (params) => {
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };


  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    deptname: true,
    descrip: true,
    deduction: true,
    era: true,
    penalty: true,
    prod: true,
    target: true,
    tax: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const sendRequest = async () => {
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
        target: Boolean(depart.target),
        tax: Boolean(depart.tax),
        addedby: [
          {
            name: String(isUserRoleaccess?.username),
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
        deduction: "",
        era: "",
        penalty: "",
        prod: "",
        target: "",
        tax: "",
      });
      setBtmSubmit(false);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { setBtmSubmit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {

    e.preventDefault();
    setBtmSubmit(true);
    const isNameMatch = department.some((item) => item.deptname.toLowerCase() === depart.deptname.toLowerCase());

    if (depart.deptname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exist!"}</p>
        </>
      );
      handleClickOpenerr();
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
      deduction: "",
      era: "",
      penalty: "",
      prod: "",
      target: "",
      tax: "",
    });
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
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

      setDeparttment(dep?.data?.departmentdetails);
      setIsDept(true);
    } catch (err) { setIsDept(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //fetching departments whole list
  const fetchDepartmentsAll = async () => {
    setPageName(!pageName)
    try {
      let dep = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeparttmentalledit(dep?.data?.departmentdetails.filter((item) => item._id !== langid._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName)
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error('Blob or FileSaver not supported');
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error('FileSaver.saveAs is not available');
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error('Error exporting to Excel', error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Name: item.deptname || '',
        "Description": item.descrip || '',
        "Deduction": item.deduction || '',

        "ERA": item.era || '',
        "Penalty": item.penalty || '',
        "Prod": item.prod || '',
        "Target": item.target || '',
        "Tax": item.tax || '',

      };
    });
  };

  const handleExportXL = (isfilter) => {

    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      return;
    }

    exportToExcel(formatData(dataToExport), 'Department');
    setIsFilterOpen(false);
  };




  //  PDF
  // pdf.....
  const columns = [
    { title: "Name", field: "deptname" },
    { title: "Description", field: "descrip" },
    { title: "Deduction", field: "deduction" },
    { title: "ERA", field: "era" },
    { title: "Penalty", field: "penalty" },
    { title: "Prod", field: "prod" },
    { title: "Target", field: "target" },
    { title: "Tax", field: "tax" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,

        }))
        : items?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,


        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Department.pdf");
  };

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
      console.log(resDep?.data?.count);
      setCheckTeam(resDep?.data?.count);
      setCheckUser(resuser?.data?.users);
      if (resDep?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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


  //department updateby edit page...
  let updateby = langid?.updatedby;
  let addedby = langid?.addedby;

  //editing the single data
  const sendEditRequest = async () => {
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
        prod: Boolean(langid.prod),
        target: Boolean(langid.target),
        tax: Boolean(langid.tax),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleaccess?.username),
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
          console.error("Error during upload:", error);
        } finally {
          setOpenPopupUpload(false); // Close the popup after all uploads are completed
          console.log("ended");
        }
      };

      await performUploads()

      await fetchDepartments();
      await fetchDepartmentsAll();
      setLangid(res.data);
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setBtmSubmitEdit(false);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { setBtmSubmitEdit(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //update button
  const editSubmit = (e) => {
    e.preventDefault();
    setBtmSubmitEdit(true);
    fetchDepartmentsAll();
    const isNameMatch = departmentalledit.some((item) => item.deptname.toLowerCase() === langid.deptname.toLowerCase());

    if (langid.deptname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (langid.deptname != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data already exist!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
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

      console.log(res?.data);
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.users?.length > 0 ? "Add Employee ," : ""}
   ${res?.data?.teams?.length > 0 ? "Teams ," : ""}
   ${res?.data?.hierarchy?.length > 0 ? "Hierarchy ," : ""}
    whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.DEPARTMENTOVERALLUPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.users, res?.data?.teams, res?.data?.hierarchy, res?.data?.usersdepartmentlog);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (user, team, hierarchy, usersdepartmentlog) => {

    let mappedData = usersdepartmentlog.map((data, i) => {
      data.departmentlog.map((data2, ii) => {
        if (data2.department === ovProj) {
          data2.department = String(langid.deptname)
        }
      })
      return data;
    })

    setPageName(!pageName)
    try {
      if (user.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(langid.deptname),
          });
        });
      }
      if (team.length > 0) {
        let answ = team.map((d, i) => {
          let res = axios.put(`${SERVICE.TEAMS_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(langid.deptname),
          });
        });
      }
      if (hierarchy.length > 0) {
        let answ = hierarchy.map((d, i) => {
          let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(langid.deptname),
          });
        });
      }
      if (usersdepartmentlog.length > 0) {
        let answ = mappedData.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            departmentlog: d.departmentlog,
          });
        });
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchDepartments();

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    fetchDepartments();
    fetchDepartmentsAll();
  }, []);

  useEffect(() => {
    fetchDepartmentsAll();
  }, [isEditOpen, langid]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = department?.map((item, index) => ({
      ...item, serialNumber: index + 1, deduction: item.deduction ? "YES" : "NO",
      era: item.era ? "YES" : "NO",
      penalty: item.penalty ? "YES" : "NO",
      prod: item.prod ? "YES" : "NO",
      target: item.target ? "YES" : "NO",
      tax: item.tax ? "YES" : "NO",
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header"
    },
    {
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "deptname", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.deptname, headerClassName: "bold-header" },
    { field: "descrip", headerName: "Decription", flex: 0, width: 100, hide: !columnVisibility.descrip, headerClassName: "bold-header" },
    { field: "deduction", headerName: "Deduction", flex: 0, width: 100, hide: !columnVisibility.deduction, headerClassName: "bold-header" },
    { field: "era", headerName: "ERA", flex: 0, width: 100, hide: !columnVisibility.era, headerClassName: "bold-header" },
    { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, headerClassName: "bold-header" },
    { field: "prod", headerName: "Prod", flex: 0, width: 100, hide: !columnVisibility.prod, headerClassName: "bold-header" },
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
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes("edepartment") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              handleClickOpenEdit();
              getCode(params.row.id, params.row.deptname);
            }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("ddepartment") && (
            <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.deptname) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("vdepartment") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idepartment") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
        title="Manage Department"
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
                  <FormControlLabel control={<Checkbox checked={depart.prod} onChange={(e) => setDepart({ ...depart, prod: !depart.prod })} />} label="Prod" />
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
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
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <>
                  <LoadingButton loading={btnSubmit} variant="contained" onClick={handleSubmit}>
                    Submit
                  </LoadingButton>
                </>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </>
              </Grid>
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
                  <LoadingButton variant="contained" loading={btnSubmitEdit} onClick={editSubmit}>
                    {" "}
                    Update
                  </LoadingButton>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
                <Box>
                  <FormControl fullWidth size="small" >
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            {isUserRoleCompare?.includes("bddepartment") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}


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
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
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
                    Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
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
                  <Typography>{langid.deduction === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">penalty</Typography>
                  <Typography>{langid.penalty === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ERA</Typography>
                  <Typography>{langid.era === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Production</Typography>
                  <Typography>{langid.prod === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Target</Typography>
                  <Typography>{langid.target === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Tax</Typography>
                  <Typography>{langid.tax === true ? "yes" : "no"}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* this is info view details */}

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Department Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
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

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              {/* <TableCell> Company</TableCell> */}
              <TableCell> Name</TableCell>
              <TableCell>Decription</TableCell>
              <TableCell>Deduction</TableCell>
              <TableCell>ERA</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Prod</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Tax</TableCell>
            </TableRow>
          </TableHead>
          {filteredData &&
            filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="left">{index + 1}</TableCell>
                {/* <TableCell align="left">{row.company}</TableCell> */}
                <TableCell align="left">{row.deptname}</TableCell>
                <TableCell align="left">{row.descrip}</TableCell>
                <TableCell align="left">{String(row.deduction)}</TableCell>
                <TableCell align="left">{String(row.era)}</TableCell>
                <TableCell align="left">{String(row.penalty)}</TableCell>
                <TableCell align="left">{String(row.prod)}</TableCell>
                <TableCell align="left">{String(row.target)}</TableCell>
                <TableCell align="left">{String(row.tax)}</TableCell>
              </TableRow>
            ))}
        </Table>
      </TableContainer>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterMod}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");

            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingDialog
        open={openPopupUpload}
        onClose={() => setOpenPopupUpload(false)}
        progress={uploadProgress}
      />
    </Box>
  );
}

export default Department;