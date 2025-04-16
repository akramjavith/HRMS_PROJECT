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
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function ResumemailAttachments() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Source: t.source,
          "Candidate Info": t.candidateinfo,
          Status: t.status,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((t, index) => ({
          Sno: index + 1,
          Source: t.source,
          "Candidate Info": t.candidateinfo,
          Status: t.resumemailattachmentstatus,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Source", field: "source" },
    { title: "Candidate Information", field: "candidateinfo" },
    { title: "Status", field: "status" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((t, index) => ({
            serialNumber: index + 1,
            source: t.source,
            candidateinfo: t.candidateinfo,
            status: t.status,
          }))
        : items?.map((t, index) => ({
            serialNumber: index + 1,
            source: t.source,
            candidateinfo: t.candidateinfo,
            status: t.resumemailattachmentstatus,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Resume Mail Attachments.pdf");
  };

  //table 2
  const [fileFormatTable2, setFormatTable2] = useState("");
  const fileExtensionTable2 = fileFormatTable2 === "xl" ? ".xlsx" : ".csv";
  const exportToCSVTable2 = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtensionTable2);
  };
  const handleExportXLTable2 = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSVTable2(
        rowDataTablesuccess?.map((t, index) => ({
          Sno: index + 1,
          Source: t.source,
          "Candidate Info": t.candidateinfo,
          Status: t.status,
        })),
        fileNamesuccess
      );
    } else if (isfilter === "overall") {
      exportToCSVTable2(
        itemssuccess?.map((t, index) => ({
          Sno: index + 1,
          Source: t.source,
          "Candidate Info": t.candidateinfo,
          Status: t.resumemailattachmentstatus,
        })),
        fileNamesuccess
      );
    }
    setIsFilterOpenTable2(false);
  };

  const [isFilterOpenTable2, setIsFilterOpenTable2] = useState(false);
  const [isPdfFilterOpenTable2, setIsPdfFilterOpenTable2] = useState(false);

  // page refersh reload
  const handleCloseFilterModTable2 = () => {
    setIsFilterOpenTable2(false);
  };

  const handleClosePdfFilterModTable2 = () => {
    setIsPdfFilterOpenTable2(false);
  };

  // pdf.....
  const columnssuccess = [
    { title: "Source", field: "source" },
    { title: "Candidate Information", field: "candidateinfo" },
    { title: "Status", field: "status" },
  ];

  const downloadPdfTable2 = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columnssuccess.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTablesuccess?.map((t, index) => ({
            serialNumber: index + 1,
            source: t.source,
            candidateinfo: t.candidateinfo,
            status: t.status,
          }))
        : itemssuccess?.map((t, index) => ({
            serialNumber: index + 1,
            source: t.source,
            candidateinfo: t.candidateinfo,
            status: t.resumemailattachmentstatus,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Resume Mail Attachments Success.pdf");
  };

  const [source, setSource] = useState({ description: "" });

  const [sourceEdit, setSourceEdit] = useState({ description: "" });

  const [reasumemailattachment, setResumemailAttachment] = useState({
    source: "Email ID",
    candidateinfo: "Please Select Candidate Information",
    contactno: "",
    emailid: "",
  });

  const backPage = useNavigate();

  const [expenses, setExpenses] = useState([]);

  let sno = 1;

  const [sources, setSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuerysuccess, setSearchQuerysuccess] = useState("");
  const [allSourceedit, setAllSourceedit] = useState([]);

  const [currentText, setCurrentText] = useState("");
  const [isBtn, setIsBtn] = useState(false);
  const [selectStatus, setSelectStatus] = useState({});

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const gridRefsuccess = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowssuccess, setSelectedRowssuccess] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQueryManagesuccess, setSearchQueryManagesuccess] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Resume Mail Attachments.png");
        });
      });
    }
  };

  const handleCaptureImagesuccess = () => {
    if (gridRefsuccess.current) {
      html2canvas(gridRefsuccess.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Resume Mail Attachments Success.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const handleSelectionChangesuccess = (newSelection) => {
    setSelectedRowssuccess(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pagesuccess, setPagesuccess] = useState(1);
  const [pageSizesuccess, setPageSizesuccess] = useState(10);

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
  const [isDeleteOpenalertsuccess, setIsDeleteOpenalertsuccess] =
    useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };

  const handleClickOpenalertSuccess = () => {
    if (selectedRowssuccess?.length === 0) {
      setIsDeleteOpenalertsuccess(true);
    } else {
      setIsDeleteOpencheckboxsuccess(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const handleCloseModalertsuccess = () => {
    setIsDeleteOpenalertsuccess(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const [isDeleteOpencheckboxsuccess, setIsDeleteOpencheckboxsuccess] =
    useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const handleCloseModcheckboxsuccess = () => {
    setIsDeleteOpencheckboxsuccess(false);
  };

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isManageColumnsOpensuccess, setManageColumnsOpensuccess] =
    useState(false);
  const [anchorElsuccess, setAnchorElsuccess] = useState(null);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const handleOpenManageColumnssuccess = (event) => {
    setAnchorElsuccess(event.currentTarget);
    setManageColumnsOpensuccess(true);
  };
  const handleCloseManageColumnssuccess = () => {
    setManageColumnsOpensuccess(false);
    setSearchQueryManagesuccess("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const getRowClassNamesuccess = (params) => {
    if (selectedRowssuccess.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    source: true,
    candidateinfo: true,
    resumedoc: true,
    uploaddocument: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const initialColumnVisibilitysuccess = {
    serialNumber: true,
    checkbox: true,
    source: true,
    candidateinfo: true,
    resumedoc: true,
    uploaddocument: true,
    status: true,
    actions: true,
  };

  const [columnVisibilitysuccess, setColumnVisibilitysuccess] = useState(
    initialColumnVisibilitysuccess
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteSource, setDeleteSource] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeleteSource(res?.data?.sresumemailattachment);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let Sourcesid = deleteSource?._id;
  const delSource = async (e) => {
    setPageName(!pageName);
    try {
      if (Sourcesid) {
        await axios.delete(`${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchSource();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delSourcecheckbox = async () => {
    setPageName(!pageName);
    try {
      // selectedRows?.map((item) => {
      //     let res = axios.delete(`${SERVICE.SOURCE_SINGLE}/${item}`, {
      //         headers: {
      //             'Authorization': `Bearer ${auth.APIToken}`
      //         },
      //     });
      // })
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${item}`, {
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

      await fetchSource();
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delSourcecheckboxsuccess = async () => {
    setPageName(!pageName);
    try {
      // selectedRows?.map((item) => {
      //     let res = axios.delete(`${SERVICE.SOURCE_SINGLE}/${item}`, {
      //         headers: {
      //             'Authorization': `Bearer ${auth.APIToken}`
      //         },
      //     });
      // })
      const deletePromises = selectedRowssuccess?.map((item) => {
        return axios.delete(`${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckboxsuccess();
      setSelectedRowssuccess([]);
      setSelectAllCheckedsuccess(false);
      setPagesuccess(1);

      await fetchSource();
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(
        SERVICE.RESUMEMAILATTACHMENTS_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          resumedoc: [...documentFiles],
          source: String(reasumemailattachment.source),
          uploaddocfile: [...files],
          attachments: String(currentText),
          candidateinfo: String(reasumemailattachment.candidateinfo),
          candidateinfodata: String(
            reasumemailattachment.candidateinfo === "Email ID"
              ? reasumemailattachment.emailid
              : reasumemailattachment.contactno
          ),
          resumemailattachmentstatus: String("Pending"),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchSource();
      setResumemailAttachment({
        source: "Email ID",
        candidateinfo: "Please Select Candidate Information",
        emailid: "",
        contactno: "",
      });
      setCurrentText("");
      setdocumentFiles([]);
      setFiles([]);
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
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [emailError, setEmailError] = useState(false);

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = sources.some(item => item?.description?.toLowerCase() === source?.description?.toLowerCase());
    if (documentFiles?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload Resume"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      reasumemailattachment.candidateinfo ===
      "Please Select Candidate Information"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Candidate Information"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      reasumemailattachment.candidateinfo === "Email ID" &&
      reasumemailattachment.emailid === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Email ID"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      reasumemailattachment.candidateinfo === "Email ID" &&
      emailError
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Email ID"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      reasumemailattachment.candidateinfo === "Contact No" &&
      reasumemailattachment.contactno === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Contact No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      reasumemailattachment.candidateinfo === "Contact No" &&
      (reasumemailattachment.contactno === "" ||
        reasumemailattachment.contactno?.length < 10)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Contact No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setResumemailAttachment({
      source: "Email ID",
      candidateinfo: "Please Select Candidate Information",
      emailid: "",
      contactno: "",
    });
    setCurrentText("");
    setdocumentFiles([]);
    setFiles([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
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

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SOURCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourceEdit(res?.data?.ssource);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setSourceEdit(res?.data?.sresumemailattachment);
      setdocumentFilesView(res?.data?.sresumemailattachment?.resumedoc);
      setdocumentFilesViewUpload(
        res?.data?.sresumemailattachment?.uploaddocfile
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SOURCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourceEdit(res?.data?.ssource);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Project updateby edit page...
  let updateby = sourceEdit?.updatedby;
  let addedby = sourceEdit?.addedby;

  let subprojectsid = sourceEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SOURCE_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        description: String(sourceEdit.description),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchSource();
      await fetchSourceAll();
      handleCloseModEdit();
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchSourceAll();
    const isNameMatch = allSourceedit.some(
      (item) =>
        item.description.toLowerCase() === sourceEdit.description.toLowerCase()
    );
    if (sourceEdit.description === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchSource = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.RESUMEMAILATTACHMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourcecheck(true);
      setSources(
        res_vendor?.data?.resumemailattachment.filter(
          (item) => item.resumemailattachmentstatus !== "Success"
        )
      );
      setExpenses(
        res_vendor?.data?.resumemailattachment.filter(
          (item) => item.resumemailattachmentstatus === "Success"
        )
      );
    } catch (err) {
      setSourcecheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchSourceAll = async () => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.SOURCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllSourceedit(
        res_meet?.data?.sources.filter((item) => item._id !== sourceEdit._id)
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Resume Mail Attachments";
  const fileNamesuccess = "Resume Mail Attachments Success";

  const [sourceData, setSourceData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = sources?.map((t, index) => ({
      Sno: index + 1,
      "Source Name": t.description,
    }));
    setSourceData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Resume Mail Attachments",
    pageStyle: "print",
  });

  const componentRefsuccess = useRef();
  const handleprintsuccess = useReactToPrint({
    content: () => componentRefsuccess.current,
    documentTitle: "Resume Mail Attachments Success",
    pageStyle: "print",
  });
  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    getexcelDatas();
  }, [sourceEdit, source, sources]);

  useEffect(() => {
    fetchSource();
    fetchSourceAll();
  }, []);

  useEffect(() => {
    fetchSourceAll();
  }, [isEditOpen, sourceEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);
  const [itemssuccess, setItemssuccess] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = sources?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  const addSerialNumbersuccess = () => {
    const itemsWithSerialNumber = expenses?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemssuccess(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [sources]);

  useEffect(() => {
    addSerialNumbersuccess();
  }, [expenses]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const handlePageChangesuccess = (newPage) => {
    setPagesuccess(newPage);
    setSelectedRowssuccess([]);
    setSelectAllCheckedsuccess(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };
  const handlePageSizeChangesuccess = (event) => {
    setPageSizesuccess(Number(event.target.value));
    setSelectedRowssuccess([]);
    setSelectAllCheckedsuccess(false);
    setPagesuccess(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchChangesuccess = (event) => {
    setSearchQuerysuccess(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  const searchTermssuccess = searchQuerysuccess.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDatassuccess = itemssuccess?.filter((item) => {
    return searchTermssuccess.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const filteredDatasuccess = filteredDatassuccess.slice(
    (pagesuccess - 1) * pageSizesuccess,
    pagesuccess * pageSizesuccess
  );

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const totalPagessuccess = Math.ceil(
    filteredDatassuccess?.length / pageSizesuccess
  );

  const visiblePages = Math.min(totalPages, 3);
  const visiblePagessuccess = Math.min(totalPagessuccess, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const firstVisiblePagesuccess = Math.max(1, pagesuccess - 1);

  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );
  const lastVisiblePagesuccess = Math.min(
    firstVisiblePagesuccess + visiblePagessuccess - 1,
    totalPagessuccess
  );

  const pageNumbers = [];
  const pageNumberssuccess = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  for (let i = firstVisiblePagesuccess; i <= lastVisiblePagesuccess; i++) {
    pageNumberssuccess.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllCheckedsuccess, setSelectAllCheckedsuccess] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const CheckboxHeadersuccess = ({ selectAllCheckedsuccess, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllCheckedsuccess} onChange={onSelectAll} />
    </div>
  );

  let updatedByStatus = selectStatus.updatedby;

  const sendEditStatus = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${selectStatus._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          resumemailattachmentstatus: String(
            selectStatus.resumemailattachmentstatus
          ),
          rejectedreason: String(
            selectStatus.resumemailattachmentstatus == "Rejected"
              ? selectStatus.rejectedreason
              : ""
          ),
          updatedby: [
            ...updatedByStatus,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchSource();
      setSelectStatus({});
      handleStatusClose();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editStatus = () => {
    if (selectStatus.resumemailattachmentstatus == "Rejected") {
      if (selectStatus.rejectedreason == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Rejected Reason"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        sendEditStatus();
      }
    } else {
      sendEditStatus();
    }
  };

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  const getinfoCodeStatus = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.RESUMEMAILATTACHMENTS_SINGLE}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setSelectStatus(res?.data?.sresumemailattachment);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getDownloadFile = async (data) => {
    data.forEach(async (d) => {
      const fileExtension = getFileExtension(d.name);

      if (
        fileExtension === "xlsx" ||
        fileExtension === "xls" ||
        fileExtension === "csv"
      ) {
        readExcel(d.data)
          .then((excelData) => {
            const newTab = window.open();
            newTab.document.open();
            newTab.document.write(
              "<html><head><title>Excel File</title></head><body></body></html>"
            );
            newTab.document.close();
            const htmlTable = generateHtmlTable(excelData);
            newTab.document.body.innerHTML = htmlTable;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (fileExtension === "pdf") {
        const newTab = window.open();
        newTab.document.write(
          '<iframe width="100%" height="100%" src="' + d.preview + '"></iframe>'
        );
      } else if (fileExtension === "png" || fileExtension === "jpg") {
        const response = await fetch(d.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const newTab = window.open(url, "_blank");
      }
    });

    function getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    function readExcel(base64Data) {
      return new Promise((resolve, reject) => {
        const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      });
    }

    function generateHtmlTable(data) {
      const headers = Object.keys(data[0]);
      const tableHeader = `<tr>${headers
        .map(
          (header) =>
            `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
        )
        .join("")}</tr>`;
      const tableRows = data.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
        const cells = headers
          .map(
            (header) =>
              `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
          )
          .join("");
        return `<tr>${cells}</tr>`;
      });
      return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
        ""
      )}</table>`;
    }
  };

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
            if (rowDataTable?.length === 0) {
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
              updatedSelectedRows?.length === filteredData?.length
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
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 250,
      hide: !columnVisibility.source,
      headerClassName: "bold-header",
    },
    {
      field: "candidateinfo",
      headerName: "Candidate Info",
      flex: 0,
      width: 250,
      hide: !columnVisibility.candidateinfo,
      headerClassName: "bold-header",
    },
    {
      field: "resumedoc",
      headerName: "Resume",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.resumedoc,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.resumedoc);
            }}
            sx={userStyle.buttonview}
          >
            {params.row.resumedoc?.length > 0 ? "View" : " "}
          </Button>
        </Grid>
      ),
    },
    {
      field: "uploaddocument",
      headerName: "Upload Document",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.uploaddocfile,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.uploaddocfile);
            }}
            sx={userStyle.buttonview}
          >
            {params.row.uploaddocfile?.length > 0 ? "View" : " "}
          </Button>
        </Grid>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 90,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => {
        if (
          !(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
          !["Success", "Rejected"].includes(params.row.status)
        ) {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor:
                    params.value === "Pending"
                      ? "#FFC300"
                      : params.value === "Rejected"
                      ? "red"
                      : params.value === "Success"
                      ? "green"
                      : "inherit",
                  color:
                    params.value === "Applied"
                      ? "black"
                      : params.value === "Rejected"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        } else {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor:
                    params.value === "Pending"
                      ? "#FFC300"
                      : params.value === "Rejected"
                      ? "red"
                      : params.value === "Success"
                      ? "green"
                      : "inherit",
                  color:
                    params.value === "Pending"
                      ? "black"
                      : params.value === "Rejected"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dresumemailattachments") && (
            <>
              {/* <Grid sx={{ display: "flex" }}> */}
              {/* {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin"))
                                    ? null
                                    : isUserRoleCompare?.includes("iresumemailattachments") && ( */}
              <Button
                variant="contained"
                style={{
                  backgroundColor: "red",
                  minWidth: "15px",
                  padding: "6px 5px",
                  marginRight: "15px",
                }}
                onClick={(e) => {
                  getinfoCodeStatus(params.row.id);
                  handleStatusOpen();
                }}
              >
                <FaEdit style={{ color: "white", fontSize: "17px" }} />
              </Button>
              {/* )}*/}
              {/* </Grid>  */}
            </>
          )}
          {isUserRoleCompare?.includes("eresumemailattachments") && (
            <>
              <Button
                onClick={() => {
                  backPage("/recruitment/addresume", {
                    state: { maildata: params.row },
                  });
                }}
                variant="contained"
              >
                Add Resume
              </Button>
            </>
          )}
          {isUserRoleCompare?.includes("dresumemailattachments") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.loanamount);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vresumemailattachments") && (
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
        </Grid>
      ),
    },
  ];
  const columnDataTablesuccess = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeadersuccess
          selectAllCheckedsuccess={selectAllCheckedsuccess}
          onSelectAll={() => {
            if (rowDataTablesuccess?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedsuccess) {
              setSelectedRowssuccess([]);
            } else {
              const allRowIds = rowDataTablesuccess.map((row) => row.id);
              setSelectedRowssuccess(allRowIds);
            }
            setSelectAllCheckedsuccess(!selectAllCheckedsuccess);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowssuccess.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowssuccess.includes(params.row.id)) {
              updatedSelectedRows = selectedRowssuccess.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRowssuccess, params.row.id];
            }

            setSelectedRowssuccess(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedsuccess(
              updatedSelectedRows?.length === filteredDatasuccess?.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibilitysuccess.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilitysuccess.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "source",
      headerName: "Source",
      flex: 0,
      width: 250,
      hide: !columnVisibilitysuccess.source,
      headerClassName: "bold-header",
    },
    {
      field: "candidateinfo",
      headerName: "Candidate Info",
      flex: 0,
      width: 250,
      hide: !columnVisibilitysuccess.candidateinfo,
      headerClassName: "bold-header",
    },
    {
      field: "resumedoc",
      headerName: "Resume",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibilitysuccess.resumedoc,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.resumedoc);
            }}
            sx={userStyle.buttonview}
          >
            {params.row.resumedoc?.length > 0 ? "View" : " "}
          </Button>
        </Grid>
      ),
    },
    {
      field: "uploaddocument",
      headerName: "Upload Document",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibilitysuccess.uploaddocfile,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.uploaddocfile);
            }}
            sx={userStyle.buttonview}
          >
            {params.row.uploaddocfile?.length > 0 ? "View" : " "}
          </Button>
        </Grid>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 90,
      hide: !columnVisibilitysuccess.status,
      headerClassName: "bold-header",
      renderCell: (params) => {
        if (
          !(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
          !["Success", "Rejected"].includes(params.row.status)
        ) {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor:
                    params.value === "Pending"
                      ? "#FFC300"
                      : params.value === "Rejected"
                      ? "red"
                      : params.value === "Success"
                      ? "green"
                      : "inherit",
                  color:
                    params.value === "Applied"
                      ? "black"
                      : params.value === "Rejected"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        } else {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor:
                    params.value === "Pending"
                      ? "#FFC300"
                      : params.value === "Rejected"
                      ? "red"
                      : params.value === "Success"
                      ? "green"
                      : "inherit",
                  color:
                    params.value === "Pending"
                      ? "black"
                      : params.value === "Rejected"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilitysuccess.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dresumemailattachments") && (
            <>
              {/* <Grid sx={{ display: "flex" }}> */}
              {/* {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin"))
                                    ? null
                                    : isUserRoleCompare?.includes("iresumemailattachments") && ( */}
              <Button
                variant="contained"
                style={{
                  backgroundColor: "red",
                  minWidth: "15px",
                  padding: "6px 5px",
                  marginRight: "15px",
                }}
                onClick={(e) => {
                  getinfoCodeStatus(params.row.id);
                  handleStatusOpen();
                }}
              >
                <FaEdit style={{ color: "white", fontSize: "17px" }} />
              </Button>
              {/* )}*/}
              {/* </Grid>  */}
            </>
          )}
          {isUserRoleCompare?.includes("eresumemailattachments") && (
            <>
              <Link
                to={`/recruitment/addresume`}
                // style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
              >
                <Button variant="contained">Add Resume</Button>
              </Link>
            </>
          )}
          {isUserRoleCompare?.includes("dresumemailattachments") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.loanamount);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vresumemailattachments") && (
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
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      resumedoc: item.resumedoc,
      uploaddocfile: item.uploaddocfile,
      source: item.source,
      candidateinfo: item.candidateinfo,
      candidateinfodata: item.candidateinfodata,
      status: item.resumemailattachmentstatus,
    };
  });

  const rowDataTablesuccess = filteredDatasuccess.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      resumedoc: item.resumedoc,
      uploaddocfile: item.uploaddocfile,
      source: item.source,
      candidateinfo: item.candidateinfo,
      candidateinfodata: item.candidateinfodata,
      status: item.resumemailattachmentstatus,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const rowsWithCheckboxessuccess = rowDataTablesuccess.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowssuccess.includes(row.id),
  }));

  const calculateDataGridHeight = () => {
    if (pageSize) {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas?.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
  };

  const calculateDataGridHeightsuccess = () => {
    if (pageSizesuccess) {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatassuccess?.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  const handleShowAllColumnssuccess = () => {
    const updatedVisibility = { ...columnVisibilitysuccess };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilitysuccess(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  const filteredColumnssuccess = columnDataTablesuccess.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManagesuccess.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const toggleColumnVisibilitysuccess = (field) => {
    setColumnVisibilitysuccess((prevVisibility) => ({
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

  const manageColumnsContentsuccess = (
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
        onClick={handleCloseManageColumnssuccess}
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
          value={searchQueryManagesuccess}
          onChange={(e) => setSearchQueryManagesuccess(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnssuccess.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilitysuccess[column.field]}
                    onChange={() => toggleColumnVisibilitysuccess(column.field)}
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
              onClick={() =>
                setColumnVisibilitysuccess(initialColumnVisibilitysuccess)
              }
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
                columnDataTablesuccess.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilitysuccess(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentFilesView, setdocumentFilesView] = useState([]);
  const [documentFilesViewUpload, setdocumentFilesViewUpload] = useState([]);

  const [files, setFiles] = useState([]);

  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileUploadTodo = (event) => {
    const uploadedFiles = event.target.files;
    const duplicateFilesNames = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const uploadedFileName = uploadedFiles[i].name;

      const isDuplicate = files.some((file) => file.name === uploadedFileName);
      if (isDuplicate) {
        duplicateFilesNames.push(uploadedFileName);
      }
    }

    if (duplicateFilesNames.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`${duplicateFilesNames?.join(",")} Files Already Exist`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const files = event.target.files;

      for (let i = 0; i < files?.length; i++) {
        const reader = new FileReader();
        const file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          setFiles((prevFiles) => [
            ...prevFiles,
            {
              name: file.name,
              preview: reader.result,
              data: reader.result.split(",")[1],
              remark: "",
            },
          ]);
        };
      }
    }
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    if (resume?.length > 0) {
      const reader = new FileReader();
      const file = resume[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFiles([
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            remark: "resume file",
          },
        ]);
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
  const renderFilePreviewTodo = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const renderFilePreviewView = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const sourcecandidateOption = [
    { label: "Walk-in", value: "Walk-in" },
    { label: "Email ID", value: "Email ID" },
    { label: "Employee Referral", value: "Employee Referral" },
    { label: "Advertisement", value: "Advertisement" },
    { label: "Job fair", value: "Job fair" },
    { label: "Job Portal", value: "Job Portal" },
    { label: "Website", value: "Website" },
    { label: "Social Media", value: "Social Media" },
  ];

  const candidateinfoOption = [
    { label: "Contact No", value: "Contact No" },
    { label: "Email ID", value: "Email ID" },
  ];

  const handleFileDeleteTodo = (index) => {
    setFiles((prevFiles) => prevFiles?.filter((_, i) => i !== index));
  };

  const handleRemarkChange = (index, remark) => {
    setFiles((prevFiles) =>
      prevFiles?.map((file, i) => (i === index ? { ...file, remark } : file))
    );
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }

    setResumemailAttachment({
      ...reasumemailattachment,
      emailid: value,
    });
  };

  return (
    <Box>
      <Headtitle title={"Resume Mail Attachments"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Resume Management"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Resume"
        subpagename="Resume Mail Attachments"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aresumemailattachments") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Resume Mail Attachments
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <Typography>
                    Resume<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid>
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      sx={{
                        "@media only screen and (max-width:550px)": {
                          marginY: "5px",
                        },
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUpload(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFiles?.length > 0 &&
                      documentFiles.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={10} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid></Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                }}
                                onClick={() => renderFilePreview(file)}
                              />
                            </Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <Button
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                  cursor: "pointer",
                                  marginTop: "-5px",
                                }}
                                onClick={() => handleFileDelete(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Source<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={sourcecandidateOption}
                      value={{
                        label: reasumemailattachment.source,
                        value: reasumemailattachment.source,
                      }}
                      onChange={(e) => {
                        setResumemailAttachment({
                          ...reasumemailattachment,
                          source: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Attachments</Typography>
                    <ReactQuill
                      style={{ height: "100px" }}
                      value={currentText}
                      onChange={(e) => {
                        setCurrentText(e);
                      }}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Candidate Information<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={candidateinfoOption}
                      value={{
                        label: reasumemailattachment.candidateinfo,
                        value: reasumemailattachment.candidateinfo,
                      }}
                      onChange={(e) => {
                        setResumemailAttachment({
                          ...reasumemailattachment,
                          candidateinfo: e.value,
                          contactno: "",
                          emailid: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {reasumemailattachment.candidateinfo === "Contact No" && (
                  <>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Contact No <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          placeholder="Please Enter Contact No"
                          sx={userStyle.input}
                          value={reasumemailattachment.contactno}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setResumemailAttachment({
                                ...reasumemailattachment,
                                contactno: value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {reasumemailattachment.candidateinfo === "Email ID" && (
                  <>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Email ID <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="email"
                          placeholder="Please Enter Email ID"
                          sx={userStyle.input}
                          value={reasumemailattachment.emailid}
                          onChange={handleEmailChange}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item md={12} sm={12} xs={12} marginTop={10}>
                  <Grid item xs={8}>
                    {/* <Typography sx={userStyle.SubHeaderText}>Document<b style={{ color: "red" }}>*</b></Typography> */}
                  </Grid>
                  <>
                    <Grid
                    // sx={{ justifyContent: "center" }}
                    >
                      <Button variant="outlined" component="label">
                        <CloudUploadIcon sx={{ fontSize: "21px" }} />{" "}
                        &ensp;Upload Documents
                        <input
                          hidden
                          type="file"
                          multiple
                          onChange={handleFileUploadTodo}
                        />
                      </Button>
                    </Grid>
                  </>
                  <Typography sx={userStyle.SubHeaderText} marginTop={2}>
                    {" "}
                    Document List{" "}
                  </Typography>
                  <br />
                  <br />
                  <br />
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table" id="branch">
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell align="center">
                            SI.NO
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Document
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Remarks
                          </StyledTableCell>
                          <StyledTableCell align="center">View</StyledTableCell>
                          <StyledTableCell align="center">
                            Action
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {files &&
                          files?.map((file, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell align="center">
                                {sno++}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                {file.name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <FormControl>
                                  <OutlinedInput
                                    sx={{
                                      height: "30px !important",
                                      background: "white",
                                      border: "1px solid rgb(0 0 0 / 48%)",
                                    }}
                                    size="small"
                                    type="text"
                                    value={file.remark}
                                    onChange={(event) =>
                                      handleRemarkChange(
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </StyledTableCell>

                              <StyledTableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                <a
                                  style={{ color: "#357ae8" }}
                                  href={`data:application/octet-stream;base64,${file.data}`}
                                  download={file.name}
                                >
                                  Download
                                </a>
                                <a
                                  style={{
                                    color: "#357ae8",
                                    cursor: "pointer",
                                  }}
                                  //   href={`data:application/octet-stream;base64,${file.data}`}
                                  onClick={() => renderFilePreviewTodo(file)}
                                >
                                  {/* <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} /> */}
                                  View
                                </a>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Button
                                  onClick={() => handleFileDeleteTodo(index)}
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    textTransform: "capitalize",
                                    minWidth: "0px",
                                  }}
                                >
                                  <DeleteIcon style={{ fontSize: "20px" }} />
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <br /> <br />
              <br /> <br />
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
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    SAVE
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
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
                      Edit Source
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={10} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Source Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Source Name"
                        value={sourceEdit.description}
                        onChange={(e) => {
                          setSourceEdit({
                            ...sourceEdit,
                            description: e.target.value,
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
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={userStyle.btncancel}
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
      {isUserRoleCompare?.includes("lresumemailattachments") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Resume Mail Attachments List
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
                    <MenuItem value={sources?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes(
                    "excelresumemailattachments"
                  ) && (
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
                  {isUserRoleCompare?.includes("csvresumemailattachments") && (
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
                  {isUserRoleCompare?.includes(
                    "printresumemailattachments"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfresumemailattachments") && (
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
                  {isUserRoleCompare?.includes(
                    "imageresumemailattachments"
                  ) && (
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
            {isUserRoleCompare?.includes("bdresumemailattachments") && (
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
                    {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lresumemailattachments") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Resume Mail Attachments Success List
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid item xs={8}></Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizesuccess}
                    onChange={handlePageSizeChangesuccess}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={expenses?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes(
                    "excelresumemailattachments"
                  ) && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenTable2(true);
                          setFormatTable2("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvresumemailattachments") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenTable2(true);
                          setFormatTable2("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "printresumemailattachments"
                  ) && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleprintsuccess}
                      >
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfresumemailattachments") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenTable2(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "imageresumemailattachments"
                  ) && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImagesuccess}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    </>
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
                      value={searchQuerysuccess}
                      onChange={handleSearchChangesuccess}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <br />
            {/* <Grid container spacing={2} sx={{display:"flex"}}> */}
            {/* <Grid item md={3} xs={12} sm={12}> */}
            {/* <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                    }}
                                > */}
            <Button
              sx={userStyle.buttongrp}
              onClick={handleShowAllColumnssuccess}
            >
              Show All Columns
            </Button>
            &ensp;
            <Button
              sx={userStyle.buttongrp}
              onClick={handleOpenManageColumnssuccess}
            >
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdresumemailattachments") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalertSuccess}
              >
                Bulk Delete
              </Button>
            )}
            {/* <Button sx={userStyle.buttongrp} onClick={() => {
                                        handleShowAllColumnssuccess();
                                        setColumnVisibilitysuccess(initialColumnVisibilitysuccess);
                                    }}>
                                        Show All Columns
                                    </Button>
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnssuccess}>
                                        Manage Columns
                                    </Button>
                                    {isUserRoleCompare?.includes("bdresumemailattachments") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)} */}
            {/* </Box> */}
            {/* </Grid> */}
            {/* <Grid item md={2.5} xs={12} sm={12}>
                  <Typography>Repeat Type<b style={{ color: "red" }}>*</b></Typography>
                  <FormControl fullWidth size="small">
                  <Selects
                      maxMenuHeight={300}
                      options={companyOpt}
                      placeholder="Please Select Company"
                      style={userStyle.dataTablestyle}
                      value={{ label: companyValue, value: companyValue }}
                      onChange={(e) => {
                        setCompanyValue(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                &ensp;
                <Grid item md={3} xs={12} sm={12}>
                  <Button variant="contained" 
                  onClick={handleFilterClick}
                  >
                    Filter
                  </Button>
                </Grid> */}
            {/* </Grid> */}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid
                // ref={gridRef}
                // rows={rowsWithCheckboxessuccess}
                // columns={columnDataTablesuccess.filter((column) => columnVisibility[column.field])} // Only render visible columns
                // autoHeight={true}
                // density="compact"
                // hideFooter
                // getRowClassName={getRowClassName}
                // disableRowSelectionOnClick
                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                rows={rowsWithCheckboxessuccess}
                columns={columnDataTablesuccess.filter(
                  (column) => columnVisibilitysuccess[column.field]
                )}
                onSelectionModelChange={handleSelectionChangesuccess}
                selectionModel={selectedRowssuccess}
                autoHeight={true}
                ref={gridRefsuccess}
                density="compact"
                hideFooter
                getRowClassNamesuccess={getRowClassNamesuccess}
                disableRowSelectionOnClick
              />
            </Box>
            <br />
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredDatasuccess?.length > 0
                  ? (pagesuccess - 1) * pageSizesuccess + 1
                  : 0}{" "}
                to{" "}
                {Math.min(page * pageSizesuccess, filteredDatassuccess?.length)}{" "}
                of {filteredDatassuccess?.length} entries
              </Box>
              <Box>
                <Button
                  onClick={() => setPagesuccess(1)}
                  disabled={pagesuccess === 1}
                  sx={userStyle.paginationbtn}
                >
                  <FirstPageIcon />
                </Button>
                <Button
                  onClick={() => handlePageChangesuccess(pagesuccess - 1)}
                  disabled={pagesuccess === 1}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateBeforeIcon />
                </Button>
                {pageNumberssuccess?.map((pageNumberssuccess) => (
                  <Button
                    key={pageNumberssuccess}
                    sx={userStyle.paginationbtn}
                    onClick={() => handlePageChangesuccess(pageNumberssuccess)}
                    className={
                      pagesuccess === pageNumberssuccess ? "active" : ""
                    }
                    disabled={pagesuccess === pageNumberssuccess}
                  >
                    {pageNumberssuccess}
                  </Button>
                ))}
                {lastVisiblePagesuccess < totalPagessuccess && <span>...</span>}
                <Button
                  onClick={() => handlePageChangesuccess(pagesuccess + 1)}
                  disabled={pagesuccess === totalPagessuccess}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateNextIcon />
                </Button>
                <Button
                  onClick={() => setPagesuccess(totalPagessuccess)}
                  disabled={pagesuccess === totalPagessuccess}
                  sx={userStyle.paginationbtn}
                >
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>
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
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpensuccess}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumnssuccess}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContentsuccess}
      </Popover>

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delSource(Sourcesid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Source Info</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
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
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Candidate Info</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.candidateinfo}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRefsuccess}
          >
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Candidate Info</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTablesuccess &&
                rowDataTablesuccess.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.candidateinfo}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Resume Mail Attachments
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    <b>Source</b>
                  </Typography>
                  <Typography>{sourceEdit.source}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>
                  {" "}
                  <b>Resume</b>
                </Typography>
                <Grid>
                  {/* <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                            name="file"
                                            hidden
                                            onChange={(e) => {
                                                handleResumeUpload(e);
                                            }}
                                        />
                                    </Button> */}
                  {documentFilesView?.length > 0 &&
                    documentFilesView.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item md={10} sm={6} xs={6}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid></Grid>
                          <Grid item md={1} sm={6} xs={6}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography>
                  {" "}
                  <b>Upload Documents</b>
                </Typography>
                <Grid>
                  {/* <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                            name="file"
                                            hidden
                                            onChange={(e) => {
                                                handleResumeUpload(e);
                                            }}
                                        />
                                    </Button> */}
                  {documentFilesViewUpload?.length > 0 &&
                    documentFilesViewUpload.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item md={10} sm={6} xs={6}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid></Grid>
                          <Grid item md={1} sm={6} xs={6}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: "large",
                                color: "#357AE8",
                                cursor: "pointer",
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    <b>Candidate Information</b>
                  </Typography>
                  <Typography>{sourceEdit.candidateinfo}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    <b>{sourceEdit.candidateinfo}</b>
                  </Typography>
                  <Typography>{sourceEdit.candidateinfodata}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={10} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Attachments </b>
                  </Typography>
                  <ReactQuill
                    style={{ height: "180px" }}
                    value={sourceEdit.attachments}
                    // onChange={(e) => {
                    //   setCurrentText(e);
                    // }}
                    readOnly={true}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </FormControl>
              </Grid>
              {/* <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{sourceEdit.attachments}</Typography>
                                </FormControl>
                            </Grid> */}
            </Grid>
            <br /> <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
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
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delSourcecheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isDeleteOpencheckboxsuccess}
          onClose={handleCloseModcheckboxsuccess}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckboxsuccess}
              sx={userStyle.btncancel}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delSourcecheckboxsuccess(e)}
            >
              {" "}
              OK{" "}
            </Button>
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
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalertsuccess}
          onClose={handleCloseModalertsuccess}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalertsuccess}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* dialog status change */}
      <Box>
        <Dialog
          maxWidth="sm"
          fullWidth={true}
          open={statusOpen}
          onClose={handleStatusClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              padding: "30px 50px",
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Grid container spacing={2}>
              {selectStatus.status !== "Success" && (
                <Grid container item md={12} xs={12} sm={12}>
                  <Grid item md={10} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Resume Mail Attachments Status
                    </Typography>
                  </Grid>
                  {/* <Grid item md={4} sm={6} xs={12} >
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">
                                                Employee Name : {selectStatus.companyname}
                                            </Typography>
                                            <Typography variant="h6">
                                                Emp ID : {selectStatus.empcode}
                                            </Typography>

                                        </FormControl>
                                    </Grid> */}
                </Grid>
              )}

              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Status<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    fullWidth
                    options={[
                      { label: "Success", value: "Success" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Pending", value: "Pending" },
                    ]}
                    value={{
                      label: selectStatus.resumemailattachmentstatus,
                      value: selectStatus.resumemailattachmentstatus,
                    }}
                    onChange={(e) => {
                      setSelectStatus({
                        ...selectStatus,
                        resumemailattachmentstatus: e.value,
                        rejectedreason: "",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12}>
                {selectStatus.resumemailattachmentstatus == "Rejected" ? (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Rejected<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={selectStatus.rejectedreason}
                      onChange={(e) => {
                        setSelectStatus({
                          ...selectStatus,
                          rejectedreason: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
          {selectStatus.status == "Rejected" ? <br /> : null}
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                editStatus();
                // handleCloseerrpop();
              }}
            >
              Update
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
              onClick={() => {
                handleStatusClose();
                setSelectStatus({});
                // setEmiTodo([])
                // setTotalpayableamount(0)
                // setInterestState("Please Select Interest")
                // setSelectStatus({
                //     ...selectStatus,
                //     percentage: "",
                //     startdate: "",
                //     tenure: "",
                //     loanamount: ""
                // });
                // setSelectedDate("");
                // setSelectMonthName("Please Select Start Month");
                // setSelectedYear("Please Select Start Year");
                // updateDateValue("", "")
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
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

      {/* Table 2 */}

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpenTable2}
        onClose={handleCloseFilterModTable2}
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
            onClick={handleCloseFilterModTable2}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormatTable2 === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLTable2("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXLTable2("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpenTable2}
        onClose={handleClosePdfFilterModTable2}
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
            onClick={handleClosePdfFilterModTable2}
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
              downloadPdfTable2("filtered");
              setIsPdfFilterOpenTable2(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdfTable2("overall");
              setIsPdfFilterOpenTable2(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResumemailAttachments;
