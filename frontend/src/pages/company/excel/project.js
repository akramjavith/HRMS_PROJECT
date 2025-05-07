import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, FormGroup, FormControlLabel, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../components/TableStyle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from "@mui/lab/LoadingButton";

function Projectmaster() {
  const gridRef = useRef(null);
  const [isBtn, setIsBtn] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [projectmaster, setProjectmaster] = useState({
    name: "",
    enablepage: false,
    addedby: "",
    updatedby: "",
  });

  const [projEdit, setProjedit] = useState({
    name: "",
  });
  const [projmaster, setProjmaster] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [ovProj, setOvProj] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [ovProjcount, setOvProjcount] = useState(0);
  const [allProjectedit, setAllProjectedit] = useState([]);

  const [checkvendor, setCheckvendor] = useState();
  const [checkcategory, setCheckcategory] = useState();
  const [checksubcategory, setChecksubcategory] = useState();
  const [checktimepoints, setChecktimepoints] = useState();

  const [copiedData, setCopiedData] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  //image

  const handleCaptureImage = () => {
    // Find the table by its ID
    const table = document.getElementById("excelcanvastable");

    // Clone the table element
    const clonedTable = table.cloneNode(true);

    // Append the cloned table to the document body (it won't be visible)
    clonedTable.style.position = "absolute";
    clonedTable.style.top = "-9999px";
    document.body.appendChild(clonedTable);

    // Use html2canvas to capture the cloned table
    html2canvas(clonedTable).then((canvas) => {
      // Remove the cloned table from the document body
      document.body.removeChild(clonedTable);

      // Convert the canvas to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "Project.png";
      link.click();
    });
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setIsBtn(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsBtn(false)
  };

  // view model
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      getOverallDeleteSection(selectedRows)
      // setIsDeleteOpencheckbox(true);
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
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
    name: true,
    enablepage: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


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
  const handleExportXL = (isfilter) => {

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          Name: item.name,
          enablepage: item.enablepage,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          "Sno": index + 1,
          Name: item.name,
          enablepage: item.enablepage === true ? "Yes" : "No",

        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  const downloadPdf = (isfilter) => {


    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        name: item.name,
        enablepage: item.enablepage,


      })) :
      items.map((item, index) => ({
        "serialNumber": index + 1,
        name: item.name,
        enablepage: item.enablepage === true ? "Yes" : "No",

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Project.pdf");
  };

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.PROJECTMASTER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sprojmaster);

      let resvendor = await axios.post(SERVICE.VENDORPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkproject: String(name),
      });
      setCheckvendor(resvendor?.data?.vendors);

      let rescate = await axios.post(SERVICE.CATEGORYPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkproject: String(name),
      });
      setCheckcategory(rescate?.data?.category);

      let ressub = await axios.post(SERVICE.SUBCATEGORYPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkproject: String(name),
      });
      setChecksubcategory(ressub?.data?.subcategory);

      let restime = await axios.post(SERVICE.TIMEPOINTSPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkproject: String(name),
      });
      setChecktimepoints(restime?.data?.timepoints);

      if ((resvendor?.data?.vendors).length > 0 || (rescate?.data?.category).length > 0 || (ressub?.data?.subcategory).length > 0 || (restime?.data?.timepoints).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.PROJECTMASTER_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchProjMaster();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const delProjectcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PROJECTMASTER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      await fetchProjMaster();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    try {
      let projectscreate = await axios.post(SERVICE.PROJECTMASTER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(projectmaster.name),
        enablepage: Boolean(projectmaster.enablepage),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setProjectmaster(projectscreate.data);
      await fetchProjMaster();
      setProjectmaster({ name: "" });
      setIsBtn(false)
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = projmaster?.some((item) => item.name?.toLowerCase() === projectmaster.name?.toLowerCase());
    if (projectmaster.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Project Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name Already Exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setProjectmaster({ name: "" });
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
      </>
    );
    handleClickOpenerr();
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
    try {
      let res = await axios.get(`${SERVICE.PROJECTMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sprojmaster);
      setOvProj(name);
      getOverallEditSection(name);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PROJECTMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sprojmaster);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PROJECTMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sprojmaster);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //Project updateby edit page...
  let updateby = projEdit.updatedby;
  let addedby = projEdit.addedby;

  let projectsid = projEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.PROJECTMASTER_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(projEdit.name),
        enablepage: Boolean(projEdit.enablepage),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setProjedit(res.data);
      await fetchProjMaster();
      await fetchProjMasterAll();
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchProjMasterAll();
    const isNameMatch = allProjectedit?.some((item) => item.name?.toLowerCase() === projEdit.name?.toLowerCase());
    if (projEdit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Project Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name Already Exists!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (projEdit.name != ovProj && ovProjcount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_PROJECTEXCEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjcount(res?.data?.count);

      setGetOverallCount(`The ${e} is linked in ${res?.data?.vendors?.length > 0 ? "vendor ," : ""} 
       ${res?.data?.category?.length > 0 ? "category ," : ""}
       ${res?.data?.subcategory?.length > 0 ? "subcatetory ," : ""}
       ${res?.data?.timepoints?.length > 0 ? "time and points" : ""} 
       ${res?.data?.excelmapdata?.length > 0 ? "Allotted Queue" : ""}
       ${res?.data?.excelmapresperson?.length > 0 ? "Allotted Resperson" : ""} whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //overall edit section for all pages
  const getOverallDeleteSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_PROJECTEXCEL_BULK_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: e,
      });
      setSelectedRows(res?.data?.result);
      setSelectedRowsCount(res?.data?.count)

      setIsDeleteOpencheckbox(true);


    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_PROJECTEXCEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.vendors, res?.data?.category, res?.data?.subcategory, res?.data?.timepoints, res?.data?.excelmapdata, res?.data?.excelmapresperson);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (vendor, category, subcategory, timepoints, excelmapdata, excelmapresperson) => {
    try {
      if (vendor.length > 0) {
        let answ = vendor.map((d, i) => {
          let res = axios.put(`${SERVICE.VENDORMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            projectname: String(projEdit.name),
          });
        });
      }
      if (category.length > 0) {
        let answ = category.map((d, i) => {
          let res = axios.put(`${SERVICE.CATEGORYEXCEL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projEdit.name),
          });
        });
      }
      if (subcategory.length > 0) {
        let answ = subcategory.map((d, i) => {
          let res = axios.put(`${SERVICE.SUBCATEGORYEXCEL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projEdit.name),
          });
        });
      }
      if (timepoints.length > 0) {
        let answ = timepoints.map((d, i) => {
          let res = axios.put(`${SERVICE.TIMEPOINTS_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            project: String(projEdit.name),
          });
        });
      }
      // if (excelmapdata.length > 0) {
      //   let answ = excelmapdata.map((d, i) => {
      //     let res = axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       project: String(projEdit.name),
      //     });
      //   });
      // }
      // if (excelmapresperson.length > 0) {
      //   let answ = excelmapresperson.map((d, i) => {
      //     let res = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       project: String(projEdit.name),
      //     });
      //   });
      // }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all project.
  const fetchProjMaster = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjectCheck(true);
      setProjmaster(res_project?.data?.projmaster);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all project.
  const fetchProjMasterAll = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setProjmaster(res_project?.data?.projmaster);
      setAllProjectedit(res_project?.data?.projmaster.filter((item) => item._id !== projEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // pdf.....
  const columns = [
    { title: "Project Name", field: "name" },
    { title: "Enable Page", field: "enablepage" },
  ];

  // Excel
  const fileName = "Project";


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Project",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = projmaster?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [projmaster]);

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

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    fetchProjMaster();
  }, []);

  useEffect(() => {
    fetchProjMasterAll();
  }, [isEditOpen, allProjectedit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
    { field: "name", headerName: "Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "enablepage", headerName: "Enable Page", flex: 0, width: 250, hide: !columnVisibility.enablepage, headerClassName: "bold-header" },

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
          {isUserRoleCompare?.includes("eprojectmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}

          {isUserRoleCompare?.includes("dprojectmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vprojectmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iprojectmaster") && (
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
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      enablepage: item.enablepage === true ? "Yes" : "No",
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

  return (
    <Box>
      <Headtitle title={"PROJECT"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Project</Typography>
      {isUserRoleCompare?.includes("aprojectmaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Project</Typography>
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
                      value={projectmaster.name}
                      onChange={(e) => {
                        setProjectmaster({ ...projectmaster, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12} marginTop={2} >

                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={projectmaster.enablepage} />}
                      onChange={(e) =>
                        setProjectmaster({
                          ...projectmaster,
                          enablepage: !projectmaster.enablepage,
                        })
                      }
                      label="Enable Pages"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton loading={isBtn} variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
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
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Project</Typography>
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
                      placeholder="Please Enter Project Name"
                      value={projEdit.name}
                      onChange={(e) => {
                        setProjedit({ ...projEdit, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={12} xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={projEdit.enablepage} />}
                      onChange={(e) =>
                        setProjedit({
                          ...projEdit,
                          enablepage: !projEdit.enablepage,
                        })
                      }
                      label="Enable Pages"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lprojectmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Project List</Typography>
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
                    <MenuItem value={projmaster?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelprojectmaster") && (
                    // <>
                    //   <ExportXL csvData={projectData} fileName={fileName} />
                    // </>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvprojectmaster") && (
                    // <>
                    //   <ExportCSV csvData={projectData} fileName={fileName} />
                    // </>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printprojectmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfprojectmaster") && (
                    // <>
                    //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                    //     <FaFilePdf />
                    //     &ensp;Export to PDF&ensp;
                    //   </Button>
                    // </>
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)

                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageprojectmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
            {isUserRoleCompare?.includes("bdprojectmaster") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
            {/* ****** Table End ****** */}
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
            <Button
              onClick={handleCloseMod}
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}
        <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Project Info</Typography>
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

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Enable Page</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.enablepage}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          style={{
            display: canvasState === false ? "none" : "block",
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="excelcanvastable" ref={gridRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Project Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "350px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Project</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{projEdit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Enable page</Typography>
                  <Typography>{projEdit.enablepage === true ? "Yes" : "No"}</Typography>
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

      {/* ALERT DIALOG */}
      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {checkvendor?.length > 0 && checkcategory?.length > 0 && checksubcategory?.length > 0 && checktimepoints?.length > 0 ? (
              <>
                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteproject.name} `}</span>was linked in <span style={{ fontWeight: "700" }}>Vendor, Category, Subcategory & Time and points </span>
              </>
            ) : checkvendor?.length > 0 || checkcategory?.length > 0 || checksubcategory?.length > 0 || checktimepoints?.length > 0 ? (
              <>
                <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteproject.name} `}</span>
                was linked in{" "}
                <span style={{ fontWeight: "700" }}>
                  {checkvendor?.length ? " Vendor" : ""}
                  {checkcategory?.length ? " Category" : ""}
                  {checksubcategory?.length ? " Subcategory" : ""}
                  {checktimepoints?.length ? " Time and points" : ""}
                </span>
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
                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
                <Button variant="contained" color='error'
                  onClick={(e) => delProjectcheckbox(e)}
                > OK </Button>
              </>
              :
              <Button variant="contained" color='error' onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Ok</Button>
            }
          </DialogActions>
        </Dialog>

      </Box>
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box> */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Projectmaster;